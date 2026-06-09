import { HumandRow } from "./demoData";
import { clasificarEvento, Grupo } from "./prestaciones";

export interface IncidenciaRow {
  idEmpleado: string;
  nombre: string;
  tablaPrestaciones: string;
  fechaAlta: string;
  fechaRegistro: string;
  ccNominas: string;
  descripcionCC: string;
  folioIncapacidad: string;
  cantidad: number;
  estado: "clasificado" | "sin_clasificar" | "requiere_dato";
}

export function transformar(rows: HumandRow[]): IncidenciaRow[] {
  const hoy = new Date().toISOString().split("T")[0];

  return rows.map((row) => {
    const clasificacion = clasificarEvento(row.tipoEvento, row.tablaPrestaciones as Grupo, row.subdivision ?? null);

    const esIncapacidad = clasificacion?.ccId && ["U509", "U507", "U510"].includes(clasificacion.ccId);
    const faltaFolio = esIncapacidad && !row.folioIncapacidad;

    return {
      idEmpleado: row.idEmpleado,
      nombre: row.nombre,
      tablaPrestaciones: row.tablaPrestaciones + (row.subdivision ? ` / ${row.subdivision}` : ""),
      fechaAlta: row.fecha,
      fechaRegistro: hoy,
      ccNominas: clasificacion?.ccId ?? "—",
      descripcionCC: clasificacion?.descripcion ?? row.tipoEvento,
      folioIncapacidad: row.folioIncapacidad ?? "",
      cantidad: row.cantidad,
      estado: !clasificacion ? "sin_clasificar" : faltaFolio ? "requiere_dato" : "clasificado",
    };
  });
}
