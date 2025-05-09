import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  // Solicitar restablecimiento de contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  // Restablecer la contraseña
  resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {
      email,
      token,
      newPassword,
    });
  }
}
