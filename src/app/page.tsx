"use client";

import { useState, useCallback, useRef } from "react";
import { transformar, IncidenciaRow } from "@/lib/transformar";
import { TABLAS, Grupo } from "@/lib/prestaciones";
import { parseHumandExport, ParseResult } from "@/lib/parseHumand";
import * as XLSX from "xlsx";

/* ─── Brand tokens ──────────────────────────────────────────────── */
const HU = {
  navy:   "#182D7A",
  blue:   "#496BE3",
  cream:  "#F8F4ED",
  light1: "#CAD5FE",
  light2: "#D6E1FF",
  light3: "#EEF2FF",
  dark:   "#3A3A45",
  gray1:  "#E8E8E8",
  gray2:  "#F7F7F7",
};

/* ─── Helpers ───────────────────────────────────────────────────── */
const GRUPO_STYLE: Record<string, { bg: string; text: string }> = {
  SEM:    { bg: HU.light2, text: HU.navy },
  STIRTT: { bg: "#EDE9FE", text: "#5B21B6" },
  SITATYR:{ bg: "#FEF3C7", text: "#92400E" },
};

const ESTADO_STYLE = {
  clasificado:   { bg: "#D1FAE5", text: "#065F46", label: "Clasificado" },
  sin_clasificar:{ bg: "#FEE2E2", text: "#991B1B", label: "Sin clasificar" },
  requiere_dato: { bg: "#FEF9C3", text: "#713F12", label: "Falta dato" },
};

const TIPO_STYLE = {
  percepcion:  { color: "#059669" },
  deduccion:   { color: "#DC2626" },
  incapacidad: { color: HU.blue },
  informativo: { color: "#9CA3AF" },
};

function GrupoTag({ grupo }: { grupo: string }) {
  const base = grupo.split(" / ")[0];
  const s = GRUPO_STYLE[base] ?? { bg: HU.gray1, text: HU.dark };
  return (
    <span style={{ background: s.bg, color: s.text }}
      className="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide">
      {grupo}
    </span>
  );
}

function StatusBadge({ estado }: { estado: keyof typeof ESTADO_STYLE }) {
  const s = ESTADO_STYLE[estado];
  return (
    <span style={{ background: s.bg, color: s.text }}
      className="px-2.5 py-1 rounded-full text-xs font-semibold">
      {s.label}
    </span>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${HU.gray1}` }}>
      <div className="text-3xl font-bold mb-1" style={{ color, fontFamily: "SF Pro Display, -apple-system, sans-serif" }}>
        {value}
      </div>
      <div className="text-sm" style={{ color: HU.dark }}>{label}</div>
    </div>
  );
}

/* ─── Preguntas ─────────────────────────────────────────────────── */
/* ─── Mapeo demo empleado → tabla prestaciones ──────────────────── */
const MAPEO_DEMO: Record<string, { tablaPrestaciones: Grupo; subdivision?: "ITV"|"C3"|"ETV" }> = {
  "1310":  { tablaPrestaciones: "SEM" },
  "64399": { tablaPrestaciones: "SITATYR", subdivision: "ITV" },
  "10980": { tablaPrestaciones: "STIRTT" },
  "23862": { tablaPrestaciones: "SITATYR", subdivision: "C3" },
  "88201": { tablaPrestaciones: "SEM" },
  "55430": { tablaPrestaciones: "STIRTT" },
  "31107": { tablaPrestaciones: "SITATYR", subdivision: "ETV" },
};

/* ─── Main component ─────────────────────────────────────────────── */
type View = "transformador" | "prestaciones";

export default function Home() {
  const [view, setView]             = useState<View>("transformador");
  const [result, setResult]         = useState<IncidenciaRow[]>([]);
  const [filtroGrupo, setFiltroGrupo] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [activeTab, setActiveTab]   = useState<Grupo>("SEM");
  const [loaded, setLoaded]         = useState(false);
  const [parseInfo, setParseInfo]   = useState<{ periodo: string; totalLineas: number; errores: string[]; advertencias: string[]; empleadosSinConvenio: string[] } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    const buf = await file.arrayBuffer();
    const parsed: ParseResult = parseHumandExport(buf, MAPEO_DEMO);
    const rows = transformar(parsed.rows);
    setResult(rows);
    setParseInfo({ periodo: parsed.periodo, totalLineas: parsed.totalLineas, errores: parsed.errores, advertencias: parsed.advertencias, empleadosSinConvenio: parsed.empleadosSinConvenio });
    setLoaded(true);
    setIsProcessing(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const exportar = () => {
    const data = filtered.map((r) => ({
      "ID Empleado": r.idEmpleado,
      "Nombre y Apellido": r.nombre,
      "Tabla de Prestaciones": r.tablaPrestaciones,
      "Fecha Alta": r.fechaAlta,
      "Fecha Registro": r.fechaRegistro,
      "CC Nóminas": r.ccNominas,
      "Descripción CC Nóminas": r.descripcionCC,
      "Folio Incapacidad": r.folioIncapacidad,
      "Cantidad": r.cantidad,
      "Estado": ESTADO_STYLE[r.estado].label,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb2 = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb2, ws, "Incidencias");
    XLSX.writeFile(wb2, "incidencias_grupo_imagen.xlsx");
  };

  const filtered = result.filter((r) => {
    const g = r.tablaPrestaciones.split(" / ")[0];
    if (filtroGrupo !== "todos" && g !== filtroGrupo) return false;
    if (filtroEstado !== "todos" && r.estado !== filtroEstado) return false;
    return true;
  });

  const stats = {
    total:         result.length,
    clasificados:  result.filter((r) => r.estado === "clasificado").length,
    sinClasificar: result.filter((r) => r.estado === "sin_clasificar").length,
    requiereDato:  result.filter((r) => r.estado === "requiere_dato").length,
  };

  /* ─── Nav items ──── */
  const NAV = [
    { key: "transformador", label: "Transformador" },
    { key: "prestaciones",  label: "Tablas de Prestaciones" },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: HU.gray2, fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40" style={{ background: "#fff", borderBottom: `1px solid ${HU.gray1}` }}>
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-16">
          {/* Logo area */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm font-bold" style={{ background: HU.navy }}>
              hu
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: HU.navy }}>Transformador de Incidencias</div>
              <div className="text-xs" style={{ color: "#9CA3AF" }}>Grupo Imagen · Piloto Control de Asistencia</div>
            </div>
          </div>
          {/* Nav */}
          <nav className="flex items-center gap-1">
            {NAV.map((n) => (
              <button key={n.key} onClick={() => setView(n.key)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={view === n.key
                  ? { background: HU.light3, color: HU.navy, fontWeight: 600 }
                  : { color: HU.dark }}>
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ════════════ TRANSFORMADOR ════════════ */}
        {view === "transformador" && (
          <>
            {!loaded ? (
              <div className="flex flex-col items-center justify-center py-20 gap-8">

                {/* Hero */}
                <div className="text-center max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                    style={{ background: HU.light3, color: HU.blue }}>
                    Control de Asistencia → Nómina
                  </div>
                  <h2 className="text-3xl font-bold mb-3 tracking-tight" style={{ color: HU.navy }}>
                    Motor de clasificación de incidencias
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: HU.dark }}>
                    Convierte los marcajes exportados desde Humand en conceptos de nómina, aplicando automáticamente las reglas de cada tabla de prestaciones.
                  </p>
                </div>

                {/* Upload — única opción */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className="rounded-2xl p-10 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 text-center w-full max-w-md"
                  style={{
                    background: isDragging ? HU.light3 : "#fff",
                    border: `2px dashed ${isDragging ? HU.blue : HU.gray1}`,
                    minHeight: 220,
                  }}>
                  <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                  <div className="text-4xl">{isProcessing ? "⏳" : "📂"}</div>
                  <div>
                    <div className="font-semibold text-base mb-1" style={{ color: HU.navy }}>
                      {isProcessing ? "Procesando..." : "Subir export de Humand"}
                    </div>
                    <div className="text-sm" style={{ color: "#9CA3AF" }}>
                      Arrastrá o hacé click · .xlsx / .xls / .csv
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: HU.light3, color: HU.blue }}>
                    Reporte detallado de Control de Asistencia
                  </div>
                </div>

                {/* Info footer */}
                <div className="flex items-center gap-6 text-xs" style={{ color: "#9CA3AF" }}>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: HU.blue }}/>
                    SEM · STIRTT · SITATYR
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#059669" }}/>
                    Clasificación automática por convenio
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#D97706" }}/>
                    Exportación lista para nómina
                  </span>
                </div>
              </div>

            ) : (
              <>
                {/* Parse info banner */}
                {parseInfo && (
                  <div className="flex items-center gap-4 rounded-2xl px-5 py-3 mb-6 text-sm"
                    style={{ background: HU.light3, border: `1px solid ${HU.light2}` }}>
                    <span style={{ color: HU.navy, fontWeight: 600 }}>
                      {parseInfo.periodo || "Demo"}
                    </span>
                    <span style={{ color: HU.dark }}>·</span>
                    <span style={{ color: HU.dark }}>{parseInfo.totalLineas} líneas procesadas</span>
                    <span style={{ color: HU.dark }}>·</span>
                    <span style={{ color: stats.clasificados > 0 ? "#059669" : HU.dark }}>
                      {stats.clasificados} clasificadas
                    </span>
                    {parseInfo.errores.length > 0 && (
                      <>
                        <span style={{ color: HU.dark }}>·</span>
                        <span style={{ color: "#DC2626" }}>
                          {parseInfo.errores.length} advertencia{parseInfo.errores.length > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                    <button onClick={() => { setLoaded(false); setResult([]); }}
                      className="ml-auto text-xs px-3 py-1.5 rounded-lg font-medium"
                      style={{ background: "#fff", color: HU.navy, border: `1px solid ${HU.light1}` }}>
                      Nuevo archivo
                    </button>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <StatCard label="Total incidencias"  value={stats.total}         color={HU.navy} />
                  <StatCard label="Clasificadas"        value={stats.clasificados}  color="#059669" />
                  <StatCard label="Requieren dato"      value={stats.requiereDato}  color="#D97706" />
                  <StatCard label="Sin clasificar"      value={stats.sinClasificar} color="#DC2626" />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-4">
                  {["todos","SEM","STIRTT","SITATYR"].map((g) => (
                    <button key={g} onClick={() => setFiltroGrupo(g)}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                      style={filtroGrupo === g
                        ? { background: HU.navy, color: "#fff" }
                        : { background: "#fff", color: HU.dark, border: `1px solid ${HU.gray1}` }}>
                      {g === "todos" ? "Todos" : g}
                    </button>
                  ))}
                  <div className="w-px h-5 mx-1" style={{ background: HU.gray1 }} />
                  <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
                    className="rounded-xl text-sm px-3 py-2 outline-none"
                    style={{ background: "#fff", border: `1px solid ${HU.gray1}`, color: HU.dark }}>
                    <option value="todos">Todos los estados</option>
                    <option value="clasificado">Clasificadas</option>
                    <option value="requiere_dato">Requieren dato</option>
                    <option value="sin_clasificar">Sin clasificar</option>
                  </select>
                  <button onClick={exportar}
                    className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: HU.navy, color: "#fff" }}>
                    <span>↓</span> Exportar Excel
                  </button>
                </div>

                {/* Table */}
                <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${HU.gray1}` }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${HU.gray1}` }}>
                        {["ID Empleado","Nombre","Convenio","Fecha Alta","CC Nóminas","Descripción","Folio","Cant.","Estado"].map((h) => (
                          <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#9CA3AF", background: HU.gray2 }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((row, i) => (
                        <tr key={i} className="transition-colors hover:bg-gray-50"
                          style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${HU.gray1}` : "none" }}>
                          <td className="px-4 py-3.5 font-mono text-xs" style={{ color: HU.dark }}>{row.idEmpleado}</td>
                          <td className="px-4 py-3.5 font-medium text-sm" style={{ color: HU.navy }}>{row.nombre}</td>
                          <td className="px-4 py-3.5"><GrupoTag grupo={row.tablaPrestaciones} /></td>
                          <td className="px-4 py-3.5 text-sm" style={{ color: HU.dark }}>{row.fechaAlta}</td>
                          <td className="px-4 py-3.5 font-mono font-bold text-sm" style={{ color: HU.blue }}>{row.ccNominas}</td>
                          <td className="px-4 py-3.5 text-sm" style={{ color: HU.dark }}>{row.descripcionCC}</td>
                          <td className="px-4 py-3.5 font-mono text-xs" style={{ color: "#9CA3AF" }}>{row.folioIncapacidad || "—"}</td>
                          <td className="px-4 py-3.5 text-center text-sm font-semibold" style={{ color: HU.dark }}>{row.cantidad}</td>
                          <td className="px-4 py-3.5"><StatusBadge estado={row.estado} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-4 py-3 text-xs" style={{ color: "#9CA3AF", borderTop: `1px solid ${HU.gray1}` }}>
                    {filtered.length} incidencias mostradas
                  </div>
                </div>

                {/* Advertencias */}
                {parseInfo && parseInfo.errores.length > 0 && (
                  <div className="mt-4 rounded-2xl p-4" style={{ background: "#FEF9C3", border: `1px solid #FDE68A` }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: "#713F12" }}>
                      Advertencias ({parseInfo.errores.length})
                    </div>
                    {parseInfo.errores.slice(0, 5).map((e, i) => (
                      <div key={i} className="text-xs" style={{ color: "#92400E" }}>· {e}</div>
                    ))}
                    {parseInfo.errores.length > 5 && (
                      <div className="text-xs mt-1" style={{ color: "#92400E" }}>...y {parseInfo.errores.length - 5} más</div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ════════════ PRESTACIONES ════════════ */}
        {view === "prestaciones" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: HU.navy }}>
                Tablas de Prestaciones
              </h2>
              <p className="text-sm" style={{ color: HU.dark }}>
                Conceptos de nómina por convenio. El CC Nóminas es el código que se informa al sistema de liquidación.
              </p>
            </div>

            {/* Tab selector */}
            <div className="flex gap-2 mb-6 p-1.5 rounded-2xl w-fit" style={{ background: HU.gray1 }}>
              {(["SEM","STIRTT","SITATYR"] as Grupo[]).map((g) => (
                <button key={g} onClick={() => setActiveTab(g)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={activeTab === g
                    ? { background: HU.navy, color: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }
                    : { color: HU.dark }}>
                  {g}
                  <span className="ml-2 text-xs opacity-60 font-normal">{TABLAS[g].length}</span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${HU.gray1}` }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HU.gray1}` }}>
                    {["CC Nóminas","Concepto","Tipo","Regla de cálculo"].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#9CA3AF", background: HU.gray2 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLAS[activeTab].map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors"
                      style={{ borderBottom: i < TABLAS[activeTab].length - 1 ? `1px solid ${HU.gray1}` : "none" }}>
                      <td className="px-5 py-3.5 font-mono font-bold text-sm" style={{ color: HU.blue }}>{c.id}</td>
                      <td className="px-5 py-3.5 font-medium" style={{ color: HU.navy }}>{c.nombre}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold uppercase" style={{ color: TIPO_STYLE[c.tipo].color }}>
                          {c.tipo}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: HU.dark }}>{c.calculo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
