import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  private apiUrl = `${environment.apiUrl}ping`;
  constructor(private http: HttpClient) {}

  pingBackend(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
