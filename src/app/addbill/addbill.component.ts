import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addbill',
  templateUrl: './addbill.component.html',
  styleUrls: ['./addbill.component.css']
})
export class AddbillComponent implements OnInit {

  showFields: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  addBill(): void {
    this.showFields = true;  
  }
}
