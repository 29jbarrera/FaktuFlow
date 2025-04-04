import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { Factura } from '../factura.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFacturas(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: number
  ): Observable<any> {
    const token = sessionStorage.getItem('authToken');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<any>(`${this.apiUrl}facturas`, {
      headers,
      params: {
        page: page.toString(),
        limit: limit.toString(),
        sortField,
        sortOrder: sortOrder.toString(),
      },
    });
  }

  // Método para eliminar una factura
  deleteFactura(id: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Realizar la solicitud DELETE
    return this.http.delete<any>(`${this.apiUrl}facturas/${id}`, { headers });
  }

  createFactura(factura: Factura): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<any>(`${this.apiUrl}facturas`, factura, {
      headers,
    });
  }
}
