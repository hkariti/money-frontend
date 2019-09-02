import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  backendUrl = 'http://localhost:8000/accounts/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<object[]>(this.backendUrl);
  }
}
