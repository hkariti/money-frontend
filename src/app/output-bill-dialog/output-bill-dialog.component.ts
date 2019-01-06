import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-output-bill-dialog',
  templateUrl: './output-bill-dialog.component.html',
  styleUrls: ['./output-bill-dialog.component.css']
})
export class OutputBillDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OutputBillDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  groups: object;
  output: string;

  ngOnInit() {
    this.groups = {};
    this.output = '';
    this.data.forEach((k) => {
      console.log(k);
      const category = k.category || 'none';
      const amount = k.billedAmount;
      if (!this.groups[category]) {
        this.groups[category] = 0;
      }
      this.groups[category] += amount;
    });
    Object.keys(this.groups).forEach((k) => {
      const amount = this.groups[k];
      this.output += `${k}: ${amount} `;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
