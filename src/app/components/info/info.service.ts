import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment';
import { UpdateUserResponse, UserData } from '../../interfaces/user';
import { Observable } from 'rxjs';
import { AuthService } from '../../pages/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  private apiUrl = `${environment.apiUrl}usuarios`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get authHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getUserData(id: number): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/${id}`, {
      headers: this.authHeaders,
    });
  }

  changePassword(
    usuario_id: number,
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    const body = {
      usuario_id,
      currentPassword,
      newPassword,
    };

    return this.http.post(`${environment.apiUrl}auth/change-password`, body, {
      headers: this.authHeaders,
    });
  }

  updateUserInfo(
    usuario_id: number,
    nombre: string,
    apellidos: string,
    email: string
  ) {
    return this.http.put<UpdateUserResponse>(
      `${environment.apiUrl}auth/update-info`,
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
    return this.http.delete(`${environment.apiUrl}auth/delete-user`, {
      headers: this.authHeaders,
      body: { usuario_id },
    });
  }
}
