import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { CreateGastoRequest, Gasto, GastosResponse } from './gastos.interface';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class GastosService {
  private apiUrl = `${environment.apiUrl}gastos`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get authHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Método para obtener los gastos del usuario
  getGastos(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: number,
    searchTerm: string = ''
  ): Observable<GastosResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder.toString());

    if (searchTerm.trim() !== '') {
      params = params.set('search', searchTerm.trim());
    }

    return this.http.get<GastosResponse>(this.apiUrl, {
      headers: this.authHeaders,
      params,
    });
  }

  // Método para crear un gasto
  createGasto(gasto: CreateGastoRequest): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl, gasto, {
      headers: this.authHeaders,
    });
  }

  // Método para eliminar un gasto
  deleteGasto(id: number): Observable<Gasto> {
    return this.http.delete<Gasto>(`${this.apiUrl}/${id}`, {
      headers: this.authHeaders,
    });
  }
}
