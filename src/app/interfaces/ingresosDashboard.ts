export interface ResumenIngresos {
  totalIngresos: number;
  totalImporte: number;
  promedioImporte: number;
}

export interface IngresoMensual {
  mes: string;
  total: number;
  totalImporte: number;
}

export interface ResumenIngresosResponse {
  year: number;
  resumen: ResumenIngresos;
  mensual: IngresoMensual[];
}
