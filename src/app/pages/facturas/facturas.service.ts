import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { AuthService } from '../auth/auth.service';
import {
  Factura,
  FacturasResponse,
  CreateFacturaRequest,
} from './factura.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Método para obtener las facturas del usuario
  getFacturas(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: number
  ): Observable<FacturasResponse> {
    const headers = this.auth.getAuthHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder.toString());

    return this.http.get<FacturasResponse>(`${this.apiUrl}facturas`, {
      headers,
      params,
    });
  }

  //Método para crear una factura
  createFactura(factura: CreateFacturaRequest): Observable<Factura> {
    const headers = this.auth.getAuthHeaders();
    const formData = new FormData();

    const facturaEntries = Object.entries(factura) as [
      keyof CreateFacturaRequest,
      any
    ][];

    for (const [key, value] of facturaEntries) {
      if (value !== null && value !== undefined) {
        if (key === 'archivo' && value instanceof File) {
          formData.append('archivo', value);
        } else {
          formData.append(key, value);
        }
      }
    }

    return this.http.post<Factura>(`${this.apiUrl}facturas`, formData, {
      headers,
    });
  }

  // Métdodo para actualizar una factura
  updateFactura(
    id: number,
    factura: CreateFacturaRequest
  ): Observable<Factura> {
    const headers = this.auth.getAuthHeaders();

    const formData = new FormData();

    const facturaEntries = Object.entries(factura) as [
      keyof CreateFacturaRequest,
      any
    ][];

    for (const [key, value] of facturaEntries) {
      if (value !== null && value !== undefined) {
        if (key === 'archivo' && value instanceof File) {
          formData.append('archivo', value);
        } else {
          formData.append(key, value);
        }
      }
    }

    return this.http.put<Factura>(`${this.apiUrl}facturas/${id}`, formData, {
      headers,
    });
  }

  //Método para eliminar una factura
  deleteFactura(id: number): Observable<Factura> {
    const headers = this.auth.getAuthHeaders();

    return this.http.delete<Factura>(`${this.apiUrl}facturas/${id}`, {
      headers,
    });
  }

  //Método para eliminar un archivo de una factura
  deleteArchivoFactura(id: number): Observable<void> {
    const headers = this.auth.getAuthHeaders();

    return this.http.delete<void>(`${this.apiUrl}facturas/${id}/archivo`, {
      headers,
    });
  }
}
