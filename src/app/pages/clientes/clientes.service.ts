import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  private apiUrl = `${environment.apiUrl}clientes`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get authHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Método para obtener los clientes del usuario
  getClientes(): Observable<ClientesResponse> {
    return this.http.get<ClientesResponse>(this.apiUrl, {
      headers: this.authHeaders,
    });
  }

  // Método para obtener los clientes del usuario con paginación y ordenación
  getClientesTable(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: number,
    searchTerm: string = ''
  ): Observable<ClientesResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder.toString());

    if (searchTerm.trim() !== '') {
      params = params.set('search', searchTerm.trim());
    }
    return this.http.get<ClientesResponse>(`${this.apiUrl}/table`, {
      headers: this.authHeaders,
      params,
    });
  }

  // Método para crear un cliente
  createCliente(cliente: CreateClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente, {
      headers: this.authHeaders,
    });
  }

  // Método para actualziar un cliente
  updateCliente(
    id: number,
    cliente: CreateClienteRequest
  ): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente, {
      headers: this.authHeaders,
    });
  }

  // Método para eliminar un cliente
  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.apiUrl}/${id}`, {
      headers: this.authHeaders,
    });
  }
}
