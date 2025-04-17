import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import {
  CreateIngresoRequest,
  Ingreso,
  IngresosResponse,
} from './ingreso.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IngresoService {
  private apiUrl = `${environment.apiUrl}ingresos`;
  constructor(private http: HttpClient, private authService: AuthService) {}

  private get authHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Método para obtener los ingresos del usuario
  getIngresos(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: number,
    searchTerm: string = ''
  ): Observable<IngresosResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder.toString());

    if (searchTerm.trim() !== '') {
      params = params.set('search', searchTerm.trim());
    }

    return this.http.get<IngresosResponse>(this.apiUrl, {
      headers: this.authHeaders,
      params,
    });
  }

  // Método para crear un ingreso
  createIngreso(ingreso: CreateIngresoRequest): Observable<Ingreso> {
    return this.http.post<Ingreso>(this.apiUrl, ingreso, {
      headers: this.authHeaders,
    });
  }

  // Método para editar un ingreso
  updateIngreso(
    id: number,
    ingreso: CreateIngresoRequest
  ): Observable<Ingreso> {
    return this.http.put<Ingreso>(`${this.apiUrl}/${id}`, ingreso, {
      headers: this.authHeaders,
    });
  }

  // Método para eliminar un ingreso
  deleteIngreso(id: number): Observable<Ingreso> {
    return this.http.delete<Ingreso>(`${this.apiUrl}/${id}`, {
      headers: this.authHeaders,
    });
  }
}
