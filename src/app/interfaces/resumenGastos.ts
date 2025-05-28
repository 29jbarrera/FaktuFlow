export interface ResumenGastos {
  totalGastos: number;
  totalImporte: number;
  promedioImporte: number;
}

export interface MensualGastos {
  mes: string;
  total: number;
  totalImporte: number;
}

export interface ResumenGastosResponse {
  year: number;
  resumen: ResumenGastos;
  mensual: MensualGastos[];
}
