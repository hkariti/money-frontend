import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface AccountEntry {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  backendUrl = 'http://localhost:8000/accounts/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<object[]>(this.backendUrl);
  }

  add(name: string): Observable<any> {
    return this.http.post<object[]>(this.backendUrl, { name });
  }

  delete(id: number): Observable<any> {
    const url = `${this.backendUrl}${id}`;
    return this.http.delete<object[]>(url);
  }

  edit(id: number, name: string): Observable<any> {
    const url = `${this.backendUrl}${id}/`;
    return this.http.put<object[]>(url, { id, name });
  }
}
