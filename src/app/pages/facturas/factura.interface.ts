export interface Factura {
  id: number;
  usuario_id: number;
  cliente_id: number;
  fecha_emision: Date;
  importe: number;
  estado: boolean;
  numero: string;
  descripcion: string;
}

export interface FacturasResponse {
  facturas: Factura[];
  total: number;
}
