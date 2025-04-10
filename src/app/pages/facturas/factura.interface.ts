export interface Factura {
  id: number;
  usuario_id: number;
  cliente_id: number;
  fecha_emision: Date;
  importe: number;
  estado: boolean;
  numero: string;
  descripcion: string;
  archivo: string;
  archivo_url: string;
}

export interface FacturasResponse {
  facturas: Factura[];
  total: number;
}

export interface CreateFacturaRequest {
  cliente_id: number;
  fecha_emision: string;
  importe: number;
  estado: string;
  numero: string;
  descripcion: string;
  archivo?: File | null;
}
