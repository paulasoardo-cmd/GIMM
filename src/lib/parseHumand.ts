import * as XLSX from "xlsx";
import { HumandRow } from "./demoData";
import { Grupo } from "./prestaciones";

export interface ParseResult {
  rows: HumandRow[];
  totalLineas: number;
  errores: string[];
  advertencias: string[];
  periodo: string;
  empleadosSinConvenio: string[];
}

// Convierte un valor de tiempo de Excel (string "HH:MM:SS" o Date) a horas decimales
function toHours(val: unknown): number {
  if (!val) return 0;
  if (val instanceof Date) {
    return val.getHours() + val.getMinutes() / 60 + val.getSeconds() / 3600;
  }
  const s = String(val).trim();
  if (!s || s === "nan" || s === "00:00:00" || s === "0") return 0;
  const parts = s.split(":");
  if (parts.length >= 2) {
    return (parseFloat(parts[0]) || 0) + (parseFloat(parts[1]) || 0) / 60 + (parseFloat(parts[2] || "0") || 0) / 3600;
  }
  return 0;
}

function formatFecha(val: unknown): string {
  if (!val) return "";
  if (val instanceof Date) return val.toISOString().split("T")[0];
  const s = String(val).trim();
  // DD/MM/YYYY → YYYY-MM-DD
  const parts = s.split("/");
  if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  return s;
}

function isTotal(row: unknown[]): boolean {
  return String(row[8] ?? "").trim().toLowerCase() === "total";
}

function isEmpty(val: unknown): boolean {
  return val === null || val === undefined || String(val).trim() === "" || String(val).trim() === "nan";
}

export function parseHumandExport(
  file: ArrayBuffer,
  mapeoConvenios: Record<string, { tablaPrestaciones: Grupo; subdivision?: "ITV" | "C3" | "ETV" }>
): ParseResult {
  const wb = XLSX.read(file, { type: "array", cellDates: true });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: null });

  const errores: string[] = [];
  const advertencias: string[] = [];
  const empleadosSinConvenio: string[] = [];

  // Fila 0: título con período
  let periodo = "";
  const titleRow = raw[0] as unknown[];
  for (const cell of titleRow) {
    const s = String(cell ?? "");
    if (s.includes("/") && s.includes("-")) { periodo = s; break; }
  }

  // Fila 1: headers — estructura real conocida del export de Humand
  // [0]Usuario [1]Nombre [2]Área [3]Convenio [4]Jerarquía [5]Marcas [6]Tipo puesto
  // [7]Ubicación [8]Fecha [9]Día [10]Ingreso programado [11]Egreso programado
  // [12]Entrada [13]Salida [14]Hs turno [15]Hs trabajadas [16]Hs programadas
  // [17]Balance [18]Método entrada [19]Método salida [20]Tiempo extra
  // [21]Licencias y/o permisos [22]Feriados [23]Ausencias injustificadas
  // [24]Incumplimientos [25]Tardanza [26]Comentarios...

  const C = {
    usuario:   0, nombre: 1, area: 2, convenio: 3,
    fecha:     8, dia: 9,
    entrada:   12, salida: 13,
    horasTrab: 15, horasProg: 16,
    tiempoExtra: 20,
    licencias:   21,
    feriados:    22,
    ausencias:   23,
    incumplimientos: 24,
    tardanza:    25,
  };

  const rows: HumandRow[] = [];
  let totalLineas = 0;

  // Agrupar entradas por empleado+fecha para manejar turnos dobles
  const vistas = new Set<string>();

  for (let i = 2; i < raw.length; i++) {
    const r = raw[i] as unknown[];
    if (!r || r.length < 10) continue;

    const usuario = String(r[C.usuario] ?? "").trim();
    if (!usuario || usuario === "null") continue;
    if (isTotal(r)) continue;

    const fecha = formatFecha(r[C.fecha]);
    if (!fecha) continue;

    totalLineas++;

    const nombre   = String(r[C.nombre] ?? "").trim();
    const dia      = String(r[C.dia] ?? "").trim().toLowerCase();
    const convenioHumand = String(r[C.convenio] ?? "").trim();

    const tieneEntrada = !isEmpty(r[C.entrada]);
    const tieneSalida  = !isEmpty(r[C.salida]);
    const ausencias    = parseFloat(String(r[C.ausencias] ?? "0")) || 0;
    const horasExtra   = toHours(r[C.tiempoExtra]);
    const horasTrab    = toHours(r[C.horasTrab]);
    const licencia     = isEmpty(r[C.licencias]) ? "" : String(r[C.licencias]).trim();
    const feriado      = isEmpty(r[C.feriados])  ? "" : String(r[C.feriados]).trim();
    const esDomingo    = dia === "domingo" || dia === "sunday";

    // Resolver convenio: primero desde Humand, luego desde mapeo externo
    let perfil = mapeoConvenios[usuario];
    if (!perfil && convenioHumand && convenioHumand !== "nan") {
      // Si Humand tiene el convenio configurado, usarlo
      const g = convenioHumand.toUpperCase() as Grupo;
      if (["SEM", "STIRTT", "SITATYR"].includes(g)) {
        perfil = { tablaPrestaciones: g };
      }
    }
    if (!perfil) {
      if (!empleadosSinConvenio.includes(usuario)) {
        empleadosSinConvenio.push(usuario);
      }
      perfil = { tablaPrestaciones: "SEM" }; // fallback, marcado como sin convenio
    }

    const key = `${usuario}-${fecha}`;
    const esDoble = vistas.has(key);
    vistas.add(key);

    // ── Clasificar eventos del día ──────────────────────────────

    // 1. Turno doble (misma persona, mismo día, segunda entrada)
    if (esDoble && tieneEntrada && horasTrab > 0) {
      rows.push({ idEmpleado: usuario, nombre, fecha, tipoEvento: "Turno Doble", cantidad: 1,
        tablaPrestaciones: perfil.tablaPrestaciones, subdivision: perfil.subdivision });
      continue;
    }

    // 2. Licencia / permiso (texto en col 21)
    if (licencia) {
      const l = licencia.toLowerCase();
      let tipo = "Permiso Con Goce de Sueldo";
      if (l.includes("sin goce") || l.includes("sin sueldo")) tipo = "Permiso Sin Goce de Sueldo";
      else if (l.includes("vacaci")) tipo = "Vacación";
      else if (l.includes("maternidad")) tipo = "Incapacidad Maternidad";
      else if (l.includes("enfermedad") || l.includes("incapacidad") || l.includes("imss")) tipo = "Incapacidad Enfermedad General";
      else if (l.includes("accidente")) tipo = "Incapacidad Accidente Trabajo";
      else if (l.includes("paternidad")) tipo = "Permiso Por Paternidad";
      else if (l.includes("defunci") || l.includes("duelo")) tipo = "Permiso Por Defunción";
      rows.push({ idEmpleado: usuario, nombre, fecha, tipoEvento: tipo, cantidad: 1,
        tablaPrestaciones: perfil.tablaPrestaciones, subdivision: perfil.subdivision });
    }

    // 3. Feriado (col 22)
    if (feriado && tieneEntrada) {
      rows.push({ idEmpleado: usuario, nombre, fecha, tipoEvento: "Días Festivos", cantidad: 1,
        tablaPrestaciones: perfil.tablaPrestaciones, subdivision: perfil.subdivision });
    }

    // 4. Ausencia injustificada (col 23)
    if (ausencias > 0) {
      rows.push({ idEmpleado: usuario, nombre, fecha, tipoEvento: "Falta Injustificada", cantidad: ausencias,
        tablaPrestaciones: perfil.tablaPrestaciones, subdivision: perfil.subdivision });
    }

    // 5. Tiempo extra (col 20)
    if (horasExtra > 0 && tieneEntrada) {
      const horasEnteras = Math.floor(horasExtra);
      const cantidad = horasEnteras > 0 ? horasEnteras : 1;
      rows.push({ idEmpleado: usuario, nombre, fecha, tipoEvento: "Hora Extra", cantidad,
        tablaPrestaciones: perfil.tablaPrestaciones, subdivision: perfil.subdivision });
    }

    // 6. Prima dominical: domingo trabajado (sin ausencia, con entrada)
    if (esDomingo && tieneEntrada && tieneSalida && ausencias === 0 && !licencia) {
      rows.push({ idEmpleado: usuario, nombre, fecha, tipoEvento: "Prima Dominical", cantidad: 1,
        tablaPrestaciones: perfil.tablaPrestaciones, subdivision: perfil.subdivision });
    }
  }

  if (empleadosSinConvenio.length > 0) {
    advertencias.push(`${empleadosSinConvenio.length} empleados sin convenio asignado en Humand. Se usó SEM como fallback.`);
    advertencias.push("Para clasificar correctamente, el campo Convenio debe estar configurado en el perfil del empleado en Humand.");
  }

  return { rows, totalLineas, errores, advertencias, periodo, empleadosSinConvenio };
}
