import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password,
    };

    return this.http.post(`${this.apiUrl}auth/login`, body); // Realizamos la solicitud POST
  }

  // Función para registrar al usuario
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/register`, user); // Realizamos la solicitud POST con los datos del usuario
  }
}
