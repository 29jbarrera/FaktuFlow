import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) {}

  private get authHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getResumenPorYear(year: number) {
    const params = new HttpParams().set('year', year);
    return this.http.get<any>(`${this.baseUrl}facturas/resumen`, {
      headers: this.authHeaders,
      params,
    });
  }
}
