import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  private apiUrl = `${environment.apiUrl}facturas`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get authHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Método para obtener las facturas del usuario
  getFacturas(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: number
  ): Observable<FacturasResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder.toString());

    return this.http.get<FacturasResponse>(this.apiUrl, {
      headers: this.authHeaders,
      params,
    });
  }

  //Método para crear una factura
  createFactura(factura: CreateFacturaRequest): Observable<Factura> {
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

    return this.http.post<Factura>(this.apiUrl, formData, {
      headers: this.authHeaders,
    });
  }

  // Métdodo para actualizar una factura
  updateFactura(
    id: number,
    factura: CreateFacturaRequest
  ): Observable<Factura> {
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

    return this.http.put<Factura>(`${this.apiUrl}/${id}`, formData, {
      headers: this.authHeaders,
    });
  }

  //Método para eliminar una factura
  deleteFactura(id: number): Observable<Factura> {
    return this.http.delete<Factura>(`${this.apiUrl}/${id}`, {
      headers: this.authHeaders,
    });
  }

  //Método para eliminar un archivo de una factura
  deleteArchivoFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/archivo`, {
      headers: this.authHeaders,
    });
  }
}
