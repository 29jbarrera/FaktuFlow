import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment';
import { UserData } from '../../interfaces/user';
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
}
