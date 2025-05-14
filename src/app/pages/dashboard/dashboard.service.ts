import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment_prod } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment_prod.apiUrl;
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

  getResumenGastosPorYear(year: number) {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<any>(`${this.baseUrl}gastos/resumen`, {
      headers: this.authHeaders,
      params,
    });
  }

  getResumenIngresosPorYear(year: number) {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<any>(`${this.baseUrl}ingresos/resumen`, {
      headers: this.authHeaders,
      params,
    });
  }

  getTotalClientesPorUsuario() {
    return this.http.get<{ totalClientes: number }>(
      `${this.baseUrl}clientes/total`,
      {
        headers: this.authHeaders,
      }
    );
  }

  getTotalUsuarios() {
    return this.http.get<{ totalUsuarios: number }>(
      `${this.baseUrl}admin/total-usuarios`,
      {
        headers: this.authHeaders,
      }
    );
  }
}
