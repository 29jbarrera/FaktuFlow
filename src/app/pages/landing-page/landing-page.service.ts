import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment_prod } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  private apiUrl = `${environment_prod.apiUrl}ping`;
  constructor(private http: HttpClient) {}

  pingBackend(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
