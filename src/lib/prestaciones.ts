export type Grupo = "SEM" | "STIRTT" | "SITATYR";
export type Subdivision = "ITV" | "C3" | "ETV" | null;

export interface Concepto {
  id: string;
  nombre: string;
  calculo: string;
  tipo: "percepcion" | "deduccion" | "incapacidad" | "informativo";
}

const SEM: Concepto[] = [
  { id: "P567", nombre: "Bono puntualidad y asistencia", calculo: "Sin retardos en la quincena", tipo: "percepcion" },
  { id: "U492", nombre: "Descanso Laborado", calculo: "Sueldo diario doble", tipo: "percepcion" },
  { id: "U105", nombre: "Días Festivos", calculo: "Registro entrada y salida", tipo: "percepcion" },
  { id: "U537", nombre: "Faltas", calculo: "Descuento salario diario", tipo: "deduccion" },
  { id: "U538", nombre: "Faltas Injustificadas", calculo: "Descuento salario diario + proporcional 7mo día", tipo: "deduccion" },
  { id: "U250", nombre: "Total Hrs Extras Dobles", calculo: "Conforme a Ley, máx 18 hrs, banco de horas", tipo: "percepcion" },
  { id: "U509", nombre: "Inc Por Enfermedad General", calculo: "Conforme a Ley - soporte IMSS", tipo: "incapacidad" },
  { id: "U510", nombre: "Inc Por Maternidad", calculo: "Conforme a Ley - soporte IMSS", tipo: "incapacidad" },
  { id: "U507", nombre: "Inc Por Accidente de Trabajo", calculo: "Conforme a Ley - ST-2 + IMSS", tipo: "incapacidad" },
  { id: "U559", nombre: "Permiso Con Goce de Sueldo", calculo: "Ausencia justificada, máx 18 días/año", tipo: "percepcion" },
  { id: "U565", nombre: "Permiso Por Defunción", calculo: "3 días locales / 5 días foráneo", tipo: "percepcion" },
  { id: "U560", nombre: "Permiso Por Paternidad", calculo: "5 días laborables", tipo: "percepcion" },
  { id: "U561", nombre: "Permiso Sin Goce de Sueldo", calculo: "Ausencia justificada, sin proporcional 7mo día", tipo: "deduccion" },
  { id: "U100", nombre: "Prima Dominical", calculo: "25% salario diario - por laborar domingo", tipo: "percepcion" },
  { id: "U590", nombre: "Suspensión", calculo: "Hasta 8 días máximo", tipo: "deduccion" },
  { id: "U226", nombre: "Vacaciones x Día", calculo: "Tabla por antigüedad conforme a Ley", tipo: "percepcion" },
];

const STIRTT: Concepto[] = [
  { id: "P620", nombre: "Control Remoto", calculo: "Monto reportado por la compañía", tipo: "percepcion" },
  { id: "P419", nombre: "Ayuda de Transporte", calculo: "125 por día trabajado", tipo: "percepcion" },
  { id: "P462", nombre: "Compensación", calculo: "Monto reportado por la compañía", tipo: "percepcion" },
  { id: "U492", nombre: "Descanso Laborado", calculo: "Sueldo diario doble, mín 4 hrs", tipo: "percepcion" },
  { id: "U105", nombre: "Días Festivos", calculo: "Registro entrada y salida, jornada completa", tipo: "percepcion" },
  { id: "U651", nombre: "Día Festivo Horas", calculo: "Cuando coincide descanso semanal con festivo", tipo: "percepcion" },
  { id: "U537", nombre: "Faltas", calculo: "Descuento salario diario", tipo: "deduccion" },
  { id: "U538", nombre: "Faltas Injustificadas", calculo: "Descuento sueldo diario + proporcional 7mo día", tipo: "deduccion" },
  { id: "P621", nombre: "Grabaciones", calculo: "Monto reportado por la compañía", tipo: "percepcion" },
  { id: "U250", nombre: "Total Hrs Extras Dobles", calculo: "Máx 18 hrs/quincena, excedente a compensación", tipo: "percepcion" },
  { id: "U507", nombre: "Inc Por Accidente de Trabajo", calculo: "Conforme a Ley - ST-2 + IMSS", tipo: "incapacidad" },
  { id: "U509", nombre: "Inc Por Enfermedad General", calculo: "Conforme a Ley - soporte IMSS", tipo: "incapacidad" },
  { id: "U510", nombre: "Inc Por Maternidad", calculo: "Conforme a Ley - soporte IMSS", tipo: "incapacidad" },
  { id: "U559", nombre: "Permiso Con Goce de Sueldo", calculo: "Ausencia justificada, máx 18 días/año", tipo: "percepcion" },
  { id: "U565", nombre: "Permiso Por Defunción", calculo: "3 días locales / 5 días foráneo", tipo: "percepcion" },
  { id: "U560", nombre: "Permiso Por Paternidad", calculo: "7 días laborales desde nacimiento", tipo: "percepcion" },
  { id: "U561", nombre: "Permiso Sin Goce de Sueldo", calculo: "Sin proporcional 7mo día, impacta prestaciones", tipo: "deduccion" },
  { id: "U573", nombre: "Prima Dominical 65% Unidad", calculo: "65% salario diario - por laborar domingo", tipo: "percepcion" },
  { id: "U600", nombre: "Prima Dominical 45% Unidad", calculo: "45% salario diario - por laborar domingo", tipo: "percepcion" },
  { id: "U588", nombre: "Suplencia Imagen", calculo: "Salario diario del otro puesto", tipo: "percepcion" },
  { id: "U590", nombre: "Suspensión", calculo: "Hasta 8 días máximo", tipo: "deduccion" },
  { id: "U593", nombre: "Turno Doble", calculo: "Con base al salario diario", tipo: "percepcion" },
  { id: "U226", nombre: "Vacaciones x Día", calculo: "Tabla por antigüedad", tipo: "percepcion" },
];

const SITATYR: Concepto[] = [
  { id: "P620", nombre: "Control Remoto", calculo: "Monto reportado por la compañía", tipo: "percepcion" },
  { id: "P419_ITV", nombre: "Ayuda de Transporte (ITV)", calculo: "105 - horario antes 6:30 o después 22:00", tipo: "percepcion" },
  { id: "P419_ETV", nombre: "Ayuda de Transporte (ETV)", calculo: "100 - horario antes 6:30 o después 22:00", tipo: "percepcion" },
  { id: "P419_C3", nombre: "Ayuda de Transporte (C3)", calculo: "120 - horario antes 6:30 o después 22:00", tipo: "percepcion" },
  { id: "P420", nombre: "Ayuda de Útiles", calculo: "500 - 1ra quincena agosto (solo C3)", tipo: "percepcion" },
  { id: "P462", nombre: "Compensación", calculo: "Monto reportado por la compañía", tipo: "percepcion" },
  { id: "U492", nombre: "Descanso Laborado", calculo: "Sueldo diario doble, mín 4 hrs", tipo: "percepcion" },
  { id: "U105", nombre: "Días Festivos", calculo: "Registro entrada y salida", tipo: "percepcion" },
  { id: "U651", nombre: "Día Festivo Horas", calculo: "Cuando coincide descanso semanal con festivo", tipo: "percepcion" },
  { id: "U537", nombre: "Faltas", calculo: "Descuento salario diario", tipo: "deduccion" },
  { id: "U538", nombre: "Faltas Injustificadas", calculo: "Descuento sueldo diario + proporcional 7mo día", tipo: "deduccion" },
  { id: "P621", nombre: "Grabaciones", calculo: "Monto reportado por la compañía", tipo: "percepcion" },
  { id: "U250", nombre: "Total Hrs Extras Dobles", calculo: "Máx 18 hrs/quincena, excedente a compensación", tipo: "percepcion" },
  { id: "U507", nombre: "Inc Por Accidente de Trabajo", calculo: "Conforme a Ley - ST-2 + IMSS", tipo: "incapacidad" },
  { id: "U509", nombre: "Inc Por Enfermedad General", calculo: "60% SDI desde día 4 - soporte IMSS", tipo: "incapacidad" },
  { id: "U510", nombre: "Inc Por Maternidad", calculo: "100% SDI pagado por IMSS - soporte IMSS", tipo: "incapacidad" },
  { id: "U559", nombre: "Permiso Con Goce de Sueldo", calculo: "Ausencia justificada, máx 18 días/año", tipo: "percepcion" },
  { id: "U565", nombre: "Permiso Por Defunción", calculo: "3 días locales / 5 días foráneo", tipo: "percepcion" },
  { id: "U560", nombre: "Permiso Por Paternidad", calculo: "7 días laborales desde nacimiento", tipo: "percepcion" },
  { id: "U561", nombre: "Permiso Sin Goce de Sueldo", calculo: "Sin proporcional 7mo día, impacta prestaciones", tipo: "deduccion" },
  { id: "U573", nombre: "Prima Dominical 65% Unidad", calculo: "65% salario diario - por laborar domingo", tipo: "percepcion" },
  { id: "U600", nombre: "Prima Dominical 45% Unidad", calculo: "45% salario diario - por laborar domingo (ITV/ETV)", tipo: "percepcion" },
  { id: "U588", nombre: "Suplencia Imagen", calculo: "Salario diario del otro puesto", tipo: "percepcion" },
  { id: "U590", nombre: "Suspensión", calculo: "Hasta 8 días máximo", tipo: "deduccion" },
  { id: "U593", nombre: "Turno Doble", calculo: "Con base al salario diario", tipo: "percepcion" },
];

export const TABLAS: Record<Grupo, Concepto[]> = { SEM, STIRTT, SITATYR };

export function getConcepto(grupo: Grupo, ccId: string): Concepto | undefined {
  return TABLAS[grupo].find((c) => c.id === ccId || c.id.startsWith(ccId));
}

// Mapeo de tipo de evento de Humand → CC NÓMINAS según grupo
export function clasificarEvento(
  tipoEvento: string,
  grupo: Grupo,
  subdivision?: Subdivision
): { ccId: string; descripcion: string } | null {
  const e = tipoEvento.toLowerCase();

  if (e.includes("falta injustificada") || e.includes("ausencia injustificada"))
    return { ccId: "U538", descripcion: TABLAS[grupo].find(c => c.id === "U538")?.nombre ?? "Faltas Injustificadas" };

  if (e.includes("falta") || e.includes("ausencia"))
    return { ccId: "U537", descripcion: TABLAS[grupo].find(c => c.id === "U537")?.nombre ?? "Faltas" };

  if (e.includes("incapacidad") && (e.includes("enfermedad") || e.includes("general")))
    return { ccId: "U509", descripcion: "Inc Por Enfermedad General" };

  if (e.includes("incapacidad") && e.includes("maternidad"))
    return { ccId: "U510", descripcion: "Inc Por Maternidad" };

  if (e.includes("incapacidad") && (e.includes("accidente") || e.includes("trabajo")))
    return { ccId: "U507", descripcion: "Inc Por Accidente de Trabajo" };

  if (e.includes("permiso") && e.includes("goce"))
    return { ccId: "U559", descripcion: "Permiso Con Goce de Sueldo" };

  if (e.includes("permiso") && e.includes("sin goce"))
    return { ccId: "U561", descripcion: "Permiso Sin Goce de Sueldo" };

  if (e.includes("defunci") || e.includes("duelo"))
    return { ccId: "U565", descripcion: "Permiso Por Defunción" };

  if (e.includes("paternidad"))
    return { ccId: "U560", descripcion: "Permiso Por Paternidad" };

  if (e.includes("maternidad"))
    return { ccId: "U510", descripcion: "Inc Por Maternidad" };

  if (e.includes("hora extra") || e.includes("tiempo extra") || e.includes("horas extra"))
    return { ccId: "U250", descripcion: "Total Hrs Extras Dobles" };

  if (e.includes("descanso laborado") || e.includes("descanso trabajado"))
    return { ccId: "U492", descripcion: "Descanso Laborado" };

  if (e.includes("festivo") && e.includes("hora"))
    return { ccId: "U651", descripcion: "Día Festivo Horas" };

  if (e.includes("festivo") || e.includes("feriado"))
    return { ccId: "U105", descripcion: "Días Festivos" };

  if (e.includes("vacacion"))
    return { ccId: "U226", descripcion: "Vacaciones x Día" };

  if (e.includes("suspens"))
    return { ccId: "U590", descripcion: "Suspensión" };

  if (e.includes("prima dominical") || e.includes("domingo")) {
    if (grupo === "SEM") return { ccId: "U100", descripcion: "Prima Dominical" };
    return { ccId: "U573", descripcion: "Prima Dominical 65% Unidad" };
  }

  return null;
}
