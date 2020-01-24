import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  constructor(private http: HttpClient) { }

  backendUrl = 'http://localhost:8000/fetch/';

  fetch(site: string, user: string, pass: string, month: number, year: number): Observable<object[]> {
    const postData = {user, pass, month, year};
    const url = `{this.backendUrl}{site}`;
    return this.http.post<object[]>(url, postData);
  }
}
