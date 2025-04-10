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

  deleteFactura(id: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.delete<any>(`${this.apiUrl}facturas/${id}`, { headers });
  }

  createFactura(factura: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const formData = new FormData();

    for (const key in factura) {
      if (
        factura.hasOwnProperty(key) &&
        factura[key] !== null &&
        factura[key] !== undefined
      ) {
        if (key === 'file' && factura[key] instanceof File) {
          formData.append('archivo', factura[key]);
        } else {
          formData.append(key, factura[key]);
        }
      }
    }

    return this.http.post<any>(`${this.apiUrl}facturas`, formData, { headers });
  }

  // Actualizar una factura existente
  updateFactura(id: number, factura: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const formData = new FormData();

    for (const key in factura) {
      if (
        factura.hasOwnProperty(key) &&
        factura[key] !== null &&
        factura[key] !== undefined
      ) {
        if (key === 'archivo' && factura[key] instanceof File) {
          formData.append('archivo', factura[key]);
        } else {
          formData.append(key, factura[key]);
        }
      }
    }

    return this.http.put<any>(`${this.apiUrl}facturas/${id}`, formData, {
      headers,
    });
  }

  deleteArchivoFactura(id: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.delete<any>(`${this.apiUrl}facturas/${id}/archivo`, {
      headers,
    });
  }
}
