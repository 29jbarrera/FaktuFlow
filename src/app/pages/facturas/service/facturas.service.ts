import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para obtener las facturas
  getFacturas(page: number = 1, limit: number = 10): Observable<any> {
    const token = sessionStorage.getItem('authToken');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Realizar la solicitud GET
    return this.http.get<any>(`${this.apiUrl}facturas`, {
      headers,
    });
  }
}
