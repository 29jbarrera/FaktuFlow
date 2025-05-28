import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment_prod } from '../../../environments/environment';
import { ResetPasswordResponse } from './reset.interface';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private apiUrl = `${environment_prod.apiUrl}`;
  constructor(private http: HttpClient) {}

  // Solicitar restablecimiento de contraseña
  forgotPassword(email: string): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.apiUrl}/forgot-password`,
      { email }
    );
  }

  // Restablecer la contraseña
  resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.apiUrl}/reset-password`,
      {
        email,
        token,
        newPassword,
      }
    );
  }
}
