export interface User {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario_id: string;
  email: string;
  rol: string;
  nombre: string;
  apellidos: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface UserData {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rol: string;
  fecha_registro: Date;
}
