export interface User {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}
