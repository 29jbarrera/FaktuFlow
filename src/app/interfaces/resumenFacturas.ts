export interface Resumen {
  totalFacturas: number;
  pagadas: number;
  noPagadas: number;
  totalImporte: number;
  importePagadas: number;
  importeNoPagadas: number;
  promedioImporte: number;
  promedioPagadas: number;
  promedioNoPagadas: number;
}

export interface Mensual {
  mes: string;
  total: number;
  pagadas: number;
  noPagadas: number;
  totalImporte: number;
}

export interface ResumenFacturasResponse {
  year: number;
  resumen: Resumen;
  mensual: Mensual[];
}
