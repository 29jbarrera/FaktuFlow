export interface Cliente {
  id: number;
  usuario_id: number;
  telefono: number;
  nombre: string;
  email: string;
  direccion_fiscal: string;
}

export interface ClientesResponse {
  clientes: Cliente[];
  total: number;
}
