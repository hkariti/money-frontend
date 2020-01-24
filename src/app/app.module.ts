import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TransactionViewComponent } from './transaction-view/transaction-view.component';
import { HttpClientModule } from '@angular/common/http';
import { AddbillComponent } from './addbill/addbill.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
  MatDialogModule, MatInputModule, MatSelectModule, MatDatepickerModule, MAT_DATE_LOCALE,
  MatAutocompleteModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RouterModule, Routes } from '@angular/router';
import { AddBillDialogComponent } from './add-bill-dialog/add-bill-dialog.component';
import { AutofocusDirective } from './autofocus.directive';
import { OutputBillDialogComponent } from './output-bill-dialog/output-bill-dialog.component';
import { AccountViewComponent } from './account-view/account-view.component';
import { FetchDialogComponent } from './fetch-dialog/fetch-dialog.component';


const appRoutes: Routes = [
  { path: 'transactions', component: TransactionViewComponent },
  { path: 'accounts', component: AccountViewComponent },
  { path: 'addbill', component: AddbillComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TransactionViewComponent,
    AddbillComponent,
    MyNavComponent,
    AddBillDialogComponent,
    AutofocusDirective,
    OutputBillDialogComponent,
    AccountViewComponent,
    FetchDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatMomentDateModule,
    RouterModule.forRoot(appRoutes),
  ],
  entryComponents: [
    AddBillDialogComponent,
    FetchDialogComponent,
    OutputBillDialogComponent
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'he-IL'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
