import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  backendUrl = 'http://localhost:8000/transactions/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    moment.fn.toJSON = function () { return this.format('YYYY-MM-DD'); };
  }

  put(entries: object[]): Observable<any> {
    return this.http.post<object[]>(this.backendUrl, entries, this.httpOptions);
  }
}
