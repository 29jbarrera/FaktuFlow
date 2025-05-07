import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { gitHub } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private GITHUB_API_URL = gitHub.GITHUB_API_URL;

  constructor(private http: HttpClient) {}

  getStarCount(): Observable<number> {
    return new Observable((observer) => {
      this.http.get<any>(this.GITHUB_API_URL).subscribe({
        next: (data) => {
          observer.next(data.stargazers_count);
          observer.complete();
        },
        error: (err) => {
          console.error('Error al obtener las estrellas de GitHub', err);
          observer.next(0);
          observer.complete();
        },
      });
    });
  }
}
