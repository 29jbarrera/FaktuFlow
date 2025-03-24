import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { LoginResponse, User, RegisterResponse } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const body = {
      email: email,
      password: password,
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}auth/login`, body);
  }

  register(user: User): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}auth/register`,
      user
    );
  }
}
