import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DataviewComponent } from './dataview/dataview.component';
import { HttpClientModule } from '@angular/common/http';
import { AddbillComponent } from './addbill/addbill.component';

@NgModule({
  declarations: [
    AppComponent,
    DataviewComponent,
    AddbillComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
