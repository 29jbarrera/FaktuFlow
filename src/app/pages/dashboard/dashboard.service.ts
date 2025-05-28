import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment_prod } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { ResumenFacturasResponse } from '../../interfaces/resumenFacturas';
import { ResumenGastosResponse } from '../../interfaces/resumenGastos';
import { ResumenIngresosResponse } from '../../interfaces/resumenIngresos';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment_prod.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) {}

  private get authHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getResumenFacturasPorYear(year: number) {
    const params = new HttpParams().set('year', year);
    return this.http.get<ResumenFacturasResponse>(
      `${this.baseUrl}facturas/resumen`,
      {
        headers: this.authHeaders,
        params,
      }
    );
  }

  getResumenGastosPorYear(year: number) {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<ResumenGastosResponse>(
      `${this.baseUrl}gastos/resumen`,
      {
        headers: this.authHeaders,
        params,
      }
    );
  }

  getResumenIngresosPorYear(year: number) {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<ResumenIngresosResponse>(
      `${this.baseUrl}ingresos/resumen`,
      {
        headers: this.authHeaders,
        params,
      }
    );
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
