import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {

  data: Object[];
  columnsToDisplay = ['name'];
  accounts = this.accountService.getAll();

  constructor(private accountService: AccountService) { }

  ngOnInit() {
  }
}
