import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment_prod } from '../../../environments/environment';
import { UpdateUserResponse, UserData } from '../../interfaces/user';
import { Observable } from 'rxjs';
import { AuthService } from '../../pages/auth/auth.service';
import { ChangePasswordResponse } from '../../interfaces/changePassword';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  private apiUrl = `${environment_prod.apiUrl}`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get authHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getUserData(id: number): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}usuarios/${id}`, {
      headers: this.authHeaders,
    });
  }

  changePassword(
    usuario_id: number,
    currentPassword: string,
    newPassword: string
  ): Observable<ChangePasswordResponse> {
    const body = {
      usuario_id,
      currentPassword,
      newPassword,
    };

    return this.http.post<ChangePasswordResponse>(
      `${this.apiUrl}auth/change-password`,
      body,
      {
        headers: this.authHeaders,
      }
    );
  }

  updateUserInfo(
    usuario_id: number,
    nombre: string,
    apellidos: string,
    email: string
  ) {
    return this.http.put<UpdateUserResponse>(
      `${this.apiUrl}auth/update-info`,
      {
        usuario_id,
        nombre,
        apellidos,
        email,
      },
      {
        headers: this.authHeaders,
      }
    );
  }

  deleteUser(usuario_id: number) {
    return this.http.delete(`${this.apiUrl}auth/delete-user`, {
      headers: this.authHeaders,
      body: { usuario_id },
    });
  }
}
