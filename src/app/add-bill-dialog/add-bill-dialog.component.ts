import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-add-bill-dialog',
  templateUrl: './add-bill-dialog.component.html',
  styleUrls: ['./add-bill-dialog.component.css']
})
export class AddBillDialogComponent implements OnInit {

  billInput: string;
  format = 'leumi';

  constructor(public dialogRef: MatDialogRef<AddBillDialogComponent>) {}

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
