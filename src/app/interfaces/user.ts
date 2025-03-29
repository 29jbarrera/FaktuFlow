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
}

export interface RegisterResponse {
  message: string;
  user: User;
}
