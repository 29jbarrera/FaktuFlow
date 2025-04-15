import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environment';
import { Observable } from 'rxjs';

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
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder.toString());

    if (searchTerm.trim() !== '') {
      params = params.set('search', searchTerm.trim());
    }

    return this.http.get<any>(this.apiUrl, {
      headers: this.authHeaders,
      params,
    });
  }
}
