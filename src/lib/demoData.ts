export interface HumandRow {
  idEmpleado: string;
  nombre: string;
  fecha: string;
  tipoEvento: string;
  cantidad: number;
  folioIncapacidad?: string;
  tablaPrestaciones: "SEM" | "STIRTT" | "SITATYR";
  subdivision?: "ITV" | "C3" | "ETV";
}

// Datos demo basados en la maqueta real del cliente
export const DEMO_HUMAND: HumandRow[] = [
  { idEmpleado: "1310", nombre: "ABREGO OSORNIO, ANA MARIA", fecha: "2026-01-18", tipoEvento: "Prima Dominical", cantidad: 1, tablaPrestaciones: "SEM" },
  { idEmpleado: "1310", nombre: "ABREGO OSORNIO, ANA MARIA", fecha: "2026-01-25", tipoEvento: "Prima Dominical", cantidad: 1, tablaPrestaciones: "SEM" },
  { idEmpleado: "1310", nombre: "ABREGO OSORNIO, ANA MARIA", fecha: "2026-01-20", tipoEvento: "Incapacidad Enfermedad General", cantidad: 1, folioIncapacidad: "SO631897", tablaPrestaciones: "SEM" },
  { idEmpleado: "1310", nombre: "ABREGO OSORNIO, ANA MARIA", fecha: "2026-01-21", tipoEvento: "Incapacidad Enfermedad General", cantidad: 1, folioIncapacidad: "SO631897", tablaPrestaciones: "SEM" },
  { idEmpleado: "64399", nombre: "ADELAIDO BAROJAS, JUAN PAZ", fecha: "2026-01-18", tipoEvento: "Falta Injustificada", cantidad: 1, tablaPrestaciones: "SITATYR", subdivision: "ITV" },
  { idEmpleado: "64399", nombre: "ADELAIDO BAROJAS, JUAN PAZ", fecha: "2026-01-25", tipoEvento: "Prima Dominical", cantidad: 1, tablaPrestaciones: "SITATYR", subdivision: "ITV" },
  { idEmpleado: "10980", nombre: "ACEVEDO ACOSTA, JOSE LUIS", fecha: "2026-01-14", tipoEvento: "Hora Extra", cantidad: 3, tablaPrestaciones: "STIRTT" },
  { idEmpleado: "10980", nombre: "ACEVEDO ACOSTA, JOSE LUIS", fecha: "2026-01-15", tipoEvento: "Permiso Con Goce de Sueldo", cantidad: 1, tablaPrestaciones: "STIRTT" },
  { idEmpleado: "23862", nombre: "ACUÑA ALVARADO, FRANCISCO JAVIER", fecha: "2026-01-16", tipoEvento: "Días Festivos", cantidad: 1, tablaPrestaciones: "SITATYR", subdivision: "C3" },
  { idEmpleado: "23862", nombre: "ACUÑA ALVARADO, FRANCISCO JAVIER", fecha: "2026-01-20", tipoEvento: "Falta", cantidad: 1, tablaPrestaciones: "SITATYR", subdivision: "C3" },
  { idEmpleado: "23862", nombre: "ACUÑA ALVARADO, FRANCISCO JAVIER", fecha: "2026-01-22", tipoEvento: "Incapacidad Accidente Trabajo", cantidad: 2, folioIncapacidad: "AT789012", tablaPrestaciones: "SITATYR", subdivision: "C3" },
  { idEmpleado: "88201", nombre: "BARRAGAN RUIZ, CARMEN", fecha: "2026-01-19", tipoEvento: "Permiso Sin Goce de Sueldo", cantidad: 1, tablaPrestaciones: "SEM" },
  { idEmpleado: "88201", nombre: "BARRAGAN RUIZ, CARMEN", fecha: "2026-01-26", tipoEvento: "Prima Dominical", cantidad: 1, tablaPrestaciones: "SEM" },
  { idEmpleado: "55430", nombre: "CASTILLO MENDEZ, RODRIGO", fecha: "2026-01-15", tipoEvento: "Descanso Laborado", cantidad: 1, tablaPrestaciones: "STIRTT" },
  { idEmpleado: "55430", nombre: "CASTILLO MENDEZ, RODRIGO", fecha: "2026-01-17", tipoEvento: "Hora Extra", cantidad: 2, tablaPrestaciones: "STIRTT" },
  { idEmpleado: "55430", nombre: "CASTILLO MENDEZ, RODRIGO", fecha: "2026-01-24", tipoEvento: "Vacación", cantidad: 3, tablaPrestaciones: "STIRTT" },
  { idEmpleado: "31107", nombre: "DOMINGUEZ PEÑA, LUCIA", fecha: "2026-01-14", tipoEvento: "Incapacidad Maternidad", cantidad: 7, folioIncapacidad: "MAT445566", tablaPrestaciones: "SITATYR", subdivision: "ETV" },
  { idEmpleado: "31107", nombre: "DOMINGUEZ PEÑA, LUCIA", fecha: "2026-01-21", tipoEvento: "Incapacidad Maternidad", cantidad: 7, folioIncapacidad: "MAT445566", tablaPrestaciones: "SITATYR", subdivision: "ETV" },
];
