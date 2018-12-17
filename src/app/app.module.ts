import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DataviewComponent } from './dataview/dataview.component';
import { HttpClientModule } from '@angular/common/http';
import { AddbillComponent } from './addbill/addbill.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
  MatDialogModule, MatInputModule, MatSelectModule, MatDatepickerModule, MAT_DATE_LOCALE } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RouterModule, Routes } from '@angular/router';
import { AddBillDialogComponent } from './add-bill-dialog/add-bill-dialog.component';
import { AutofocusDirective } from './autofocus.directive';


const appRoutes: Routes = [
  { path: 'view', component: DataviewComponent },
  { path: 'addbill', component: AddbillComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DataviewComponent,
    AddbillComponent,
    MyNavComponent,
    AddBillDialogComponent,
    AutofocusDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
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
    MatDatepickerModule,
    MatMomentDateModule,
    RouterModule.forRoot(appRoutes),
  ],
  entryComponents: [
    AddBillDialogComponent
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'he-IL'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
