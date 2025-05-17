export interface ResumenFacturasData {
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

export interface FacturaMensual {
  mes: string;
  total: number;
  pagadas: number;
  noPagadas: number;
  totalImporte: number;
}

export interface ResumenFacturas {
  year: number;
  resumen: ResumenFacturasData;
  mensual: FacturaMensual[];
}
