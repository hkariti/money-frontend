import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-fetch-dialog',
  templateUrl: './fetch-dialog.component.html',
  styleUrls: ['./fetch-dialog.component.css']
})
export class FetchDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FetchDialogComponent>, private fb: FormBuilder) { }

  formGroup = this.fb.group({
    account: [''],
    user: [''],
    pass: [''],
    month: [moment().format('MM')],
    year: [moment().format('YYYY')]
  });

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    const value = {
      user: this.formGroup.value.user,
      pass: this.formGroup.value.pass,
      month: parseInt(this.formGroup.value.month, 10),
      year: parseInt(this.formGroup.value.year, 10),
    };
    this.dialogRef.close(value);
  }
}
