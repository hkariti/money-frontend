import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AccountService, AccountEntry } from '../account.service';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {

  data: Object[];
  columnsToDisplay = ['name', 'actions'];
  accounts = this.accountService.getAll();
  newAccountName = new FormControl('');
  editedAccountName = new FormControl('');
  editEntry: number;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
  }

  addAccount(): void {
    this.accountService.add(this.newAccountName.value).subscribe(this.reloadAccounts.bind(this));
  }

  enableEdit(index: number, account: AccountEntry): void {
    this.editedAccountName.setValue(account.name);
    this.editEntry = index;
  }

  doneEdit(account: AccountEntry): void {
    console.log(`New name: ${this.editedAccountName.value}`);
    this.editEntry = null;
    this.accountService.edit(account.id, this.editedAccountName.value).subscribe(this.reloadAccounts.bind(this));
  }

  cancelEdit(): void {
    this.editEntry = null;
  }

  deleteAccount(id: number): void {
    this.accountService.delete(id).subscribe(this.reloadAccounts.bind(this));
  }

  reloadAccounts(): void {
    this.accounts = this.accountService.getAll();
  }
}
