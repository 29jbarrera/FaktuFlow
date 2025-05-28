import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment_prod } from '../../../environments/environment';
import { PingResponse } from './ping.intrface';

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  private apiUrl = `${environment_prod.apiUrl}ping`;
  constructor(private http: HttpClient) {}

  pingBackend(): Observable<PingResponse> {
    return this.http.get<PingResponse>(this.apiUrl);
  }
}
