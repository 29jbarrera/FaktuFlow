export interface Ingreso {
  id: number;
  nombre_ingreso: string;
  categoria: string;
  fecha: string | Date;
  importe_total: number;
  descripcion: string;
  usuario_id: number;
}

export interface IngresosResponse {
  ingresos: Ingreso[];
  total: number;
}

export interface CreateIngresoRequest {
  nombre_ingreso: string;
  categoria: string;
  fecha: string | Date;
  importe_total: number;
  descripcion?: string;
  usuario_id: number;
}
