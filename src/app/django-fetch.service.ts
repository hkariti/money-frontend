import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DjangoFetchService {

  private transactionsBaseUrl = 'http://localhost:8000/transactions/get';
  constructor(private http: HttpClient) { }

  getData(query): Observable<Object[]> {
    const transactionsUrl = this.transactionsBaseUrl + '/' + query;
    return this.http.get<Object[]>(transactionsUrl);
  }
}
