export interface Gasto {
  id: number;
  nombre_gasto: string;
  categoria: string;
  fecha: string | Date;
  importe_total: number;
  descripcion: string;
}
export interface GastosResponse {
  gastos: Gasto[];
  total: number;
}

export interface CreateGastoRequest {
  nombre_gasto: string;
  categoria: string;
  fecha: string | Date;
  importe_total: number;
  descripcion?: string;
  usuario_id: number;
}
