import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginationComponent } from './pagination/pagination.component';
import { MockDataComponent } from './mock-data/mock-data.component';
import { MockDataDisplayComponent } from './mock-data-display/mock-data-display.component';

@NgModule({
  declarations: [
    AppComponent,
    PaginationComponent,
    MockDataComponent,
    MockDataDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
