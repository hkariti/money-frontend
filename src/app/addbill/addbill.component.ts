import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddBillDialogComponent } from '../add-bill-dialog/add-bill-dialog.component';
import { MatTable } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AutofocusDirective } from '../autofocus.directive';
import * as moment from 'moment';

export interface BillEntry {
  date: moment.Moment;
  transactionAmount: number;
  description: string;
  currency: string;
  billedAmount: number;
  comments: string;
}
@Component({
  selector: 'app-addbill',
  templateUrl: './addbill.component.html',
  styleUrls: ['./addbill.component.css']
})
export class AddbillComponent implements OnInit {
@ViewChild('inputBillTable') inputBillTable: MatTable<BillEntry>;

  data: BillEntry[] = [];
  columnsToDisplay = ['date', 'billedAmount', 'description', 'currency', 'transactionAmount', 'comments'];
  currencies: string[] = [ 'USD', 'EUR', 'ILS' ];
  constructor(public addBillDialog: MatDialog) { }

  ngOnInit() {
    const savedData: string = window.sessionStorage.getItem('transactionTable');
    if (savedData) {
      this.data = JSON.parse(savedData);
      this.data.map((d) => d.date = moment(d.date));
    }
  }

  addDumpClick(): void {
    const billDialog = this.addBillDialog.open(AddBillDialogComponent, { width: '50%' });
    billDialog.afterClosed().subscribe((r) => { this.parseInput(r); this.inputBillTable.renderRows(); });
  }

  clearTable(): void {
    this.data = [];
    window.sessionStorage.setItem('transactionTable', '');
    this.inputBillTable.renderRows();
  }

  commit(): void {
    window.sessionStorage.setItem('transactionTable', JSON.stringify(this.data));
  }
  parseInput(textInput: string): void {
    if (!textInput) { return; }
    const rows = textInput.split('\n');
    rows.forEach((row) => {
      const columns = row.split('\t');
      const entry: BillEntry = {
        date: moment(columns[0], 'DD/MM/YY'),
        transactionAmount: parseFloat(columns[2]),
        description: columns[1],
        comments: columns[3],
        billedAmount: parseFloat(columns[4]),
        currency: 'ILS'
      };
      this.data.push(entry);
    });
    this.commit();
  }
}
