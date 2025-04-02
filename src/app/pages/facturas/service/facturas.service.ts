import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { Factura } from '../factura.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para obtener las facturas
  getFacturas(page: number, limit: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Realizar la solicitud GET
    return this.http.get<any>(`${this.apiUrl}facturas`, {
      headers,
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
