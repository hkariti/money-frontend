import { Component, OnInit } from '@angular/core';
import { DjangoFetchService } from '../django-fetch.service';

@Component({
  selector: 'app-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.css']
})
export class DataviewComponent implements OnInit {

  data: Object[];
  constructor(private djangoService: DjangoFetchService) { }

  ngOnInit() {
  }

  fetchAllAccounts(): void {
      this.djangoService.getData('accounts').subscribe(data => this.data = data);
  }
  fetchAllTransactions(): void {
      this.djangoService.getData('transactions').subscribe(data => this.data = data);
  }

}
