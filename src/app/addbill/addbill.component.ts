import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddBillDialogComponent } from '../add-bill-dialog/add-bill-dialog.component';
import { OutputBillDialogComponent } from '../output-bill-dialog/output-bill-dialog.component';
import { TransactionService } from '../transaction.service';
import { AccountService } from '../account.service';
import { MatTable } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AutofocusDirective } from '../autofocus.directive';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';
import { parseDump } from './parsers';

@Component({
  selector: 'app-addbill',
  templateUrl: './addbill.component.html',
  styleUrls: ['./addbill.component.css']
})
export class AddbillComponent implements OnInit {
@ViewChild('inputBillTable') inputBillTable: MatTable<FormGroup>;

  formsIndices: number[] = [];
  forms: FormArray = new FormArray([], {updateOn: 'blur'});
  columnsToDisplay = ['date', 'description', 'transactionAmount', 'currency', 'billedAmount', 'category', 'notes', 'delete'];
  currencies: string[] = [ 'USD', 'EUR', 'ILS' ];
  seenCategories: string[] = [];
  formsToFilter = new Subject<Observable<string>>();
  formsActivity: Observable<string> = this.formsToFilter.pipe(mergeAll());
  filteredCategories: string[];
  accounts: object[];
  selectedAccount: number;
  newTransactionFG = this.fb.group({
    transaction_date: null,
    description: null,
    transaction_amount: null,
    original_currency: 'ILS',
    billed_amount: null,
    category: null,
    notes: null,
  });

  constructor(public dialog: MatDialog, private fb: FormBuilder, private transactionService: TransactionService,
    private accountService: AccountService) { }

  ngOnInit() {
    const savedTable: string = window.sessionStorage.getItem('transactionTable');
    const savedCategories: string = window.sessionStorage.getItem('seenCategories');
    this.formsActivity.pipe(map((v) => this.filterCategories(v))).subscribe((l) => this.filteredCategories = l);
    this.accountService.getAll().subscribe((a) => this.accounts = a);

    if (savedTable) {
      const data = JSON.parse(savedTable);
      data.map((d) => d.transaction_date = moment(d.transaction_date));
      data.map((d) => d.bill_date = moment(d.bill_date));
      this.addEntries(data);
    }
    if (savedCategories) {
      this.seenCategories = JSON.parse(savedCategories);
    }
  }

  addEntries(entries) {
    const fg = entries.map((e) => {
      e.category = [ e.category, { updateOn: 'change' } ];
      return this.fb.group(e);
    });
    const categoryObservables = fg.map((g) => g.get('category').valueChanges);
    categoryObservables.forEach((o) => this.formsToFilter.next(o));
    fg.forEach((g) => {
      this.forms.push(g);
      this.formsIndices.push(1);
    });
  }

  addDumpClick(): void {
    const billDialog = this.dialog.open(AddBillDialogComponent, { width: '50%' });
    billDialog.afterClosed().subscribe((r) => { this.parseInput(r.value, r.format); this.inputBillTable.renderRows(); });
  }

  submitTransaction(form): void {
    if (!form.valid) {
      return;
    }

    form.value.transaction_date = moment(form.value.transaction_date);
    form.value.bill_date = moment(form.value.bill_date);
    this.addEntries([form.value]);
    this.inputBillTable.renderRows();
    this.newTransactionFG.reset();
  }

  outputBill(): void {
    const outputDialog = this.dialog.open(OutputBillDialogComponent, { width: '50%', data: this.forms.value });
  }

  clearTable(): void {
    this.formsIndices = [];
    this.forms = new FormArray([], {updateOn: 'blur'});
    window.sessionStorage.setItem('transactionTable', '');
    this.inputBillTable.renderRows();
  }

  saveToBackend(): void {
    this.transactionService.put(this.forms.value).subscribe(
      () => this.clearTable(),
      () => console.log('failure'), // TODO: proper error handling
    );
  }

  deleteRow(i): void {
    this.formsIndices.splice(i, 1);
    this.forms.removeAt(i);
    this.inputBillTable.renderRows();
    this.commit();
  }

  initFilter(): void {
    this.filteredCategories = this.seenCategories;
  }

  updateCategories(): void {
    const seenCategoriesWithDups: string[] = this.forms.value.map((e) => e.category.trim()).filter((c) => c.length);
    this.seenCategories = Array.from(new Set(seenCategoriesWithDups));
  }

  filterCategories(curValue): string[] {
    return this.seenCategories.filter((c) => c.toLowerCase().includes(curValue.toLowerCase()));
  }

  commit(): void {
    window.sessionStorage.setItem('transactionTable', JSON.stringify(this.forms.value));
    window.sessionStorage.setItem('seenCategories', JSON.stringify(Array.from(this.seenCategories)));
  }
  parseInput(textInput: string, textFormat: string): void {
    const entries = parseDump(textInput, textFormat).map((e) => ({...e, from_account: this.selectedAccount}));
    this.addEntries(entries);
    this.commit();
  }
}
