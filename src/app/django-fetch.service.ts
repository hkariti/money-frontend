import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DjangoFetchService {

  private transactionsUrl = 'http://localhost:8000/transactions/get/transactions';
  constructor(private http: HttpClient) { }

  getData(): Observable<Object[]> {
    return this.http.get<Object[]>(this.transactionsUrl);
  }
}
