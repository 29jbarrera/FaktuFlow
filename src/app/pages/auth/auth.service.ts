import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { LoginResponse, User, RegisterResponse } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = {
      email: email,
      password: password,
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}auth/login`, body);
  }

  // Almacenar los datos del usuario en el sessionStorage
  storeUserData(response: LoginResponse): void {
    // Almacenar los datos en sessionStorage
    sessionStorage.setItem('authToken', response.token); // Almacenar el token JWT
    sessionStorage.setItem('usuario_id', response.usuario_id.toString()); // Almacenar el usuario_id
    sessionStorage.setItem('userEmail', response.email); // Almacenar el email (si lo necesitas)
    sessionStorage.setItem('rol', response.rol); // Almacenar el rol (si lo necesitas)
    sessionStorage.setItem('nombre', response.nombre);
    sessionStorage.setItem('apellidos', response.apellidos);
  }

  getUserId(): number | null {
    const userId = sessionStorage.getItem('usuario_id');
    return userId ? parseInt(userId, 10) : null;
  }

  register(user: User): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}auth/register`,
      user
    );
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('usuario_id');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('rol');
  }

  verifyCode(email: string, codigo_verificacion: string): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/verify-code`, {
      email,
      codigo_verificacion,
    });
  }
}
