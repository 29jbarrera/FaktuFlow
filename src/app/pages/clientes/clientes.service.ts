import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import {
  Cliente,
  ClientesResponse,
  CreateClienteRequest,
} from './cliente.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getClientes(): Observable<ClientesResponse> {
    const headers = this.auth.getAuthHeaders();

    return this.http.get<ClientesResponse>(`${this.apiUrl}clientes`, {
      headers,
    });
  }

  getClientesTable(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: number
  ): Observable<ClientesResponse> {
    const headers = this.auth.getAuthHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder.toString());
    return this.http.get<ClientesResponse>(`${this.apiUrl}clientes/table`, {
      headers,
      params,
    });
  }

  // Método para crear un cliente
  createCliente(cliente: CreateClienteRequest): Observable<Cliente> {
    const headers = this.auth.getAuthHeaders();

    return this.http.post<Cliente>(`${this.apiUrl}clientes`, cliente, {
      headers,
    });
  }

  deleteCliente(id: number): Observable<Cliente> {
    const headers = this.auth.getAuthHeaders();

    return this.http.delete<Cliente>(`${this.apiUrl}clientes/${id}`, {
      headers,
    });
  }
}
