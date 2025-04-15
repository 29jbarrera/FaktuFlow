export interface Gasto {
  id: number;
  name: string;
  category: string;
  date: Date;
  amount: number;
  description: string;
}
export interface GastosResponse {
  gastos: Gasto[];
  total: number;
}
