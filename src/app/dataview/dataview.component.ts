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
      this.fetchData();
  }

  fetchData(): void {
      this.djangoService.getData().subscribe(data => this.data = data);
  }

}
