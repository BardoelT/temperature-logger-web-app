import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SelectComponent } from './component/select/select.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { RouterModule } from '@angular/router';
import { LoadiconComponent } from './component/loadicon/load-icon.component';

@NgModule({
  declarations: [
    AppComponent,
    SelectComponent,
    LoadiconComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LayoutModule,
    FlexLayoutModule,
    GoogleChartsModule.forRoot(),

    MatFormFieldModule,
    MatSelectModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([{
      path: '',
      component: AppComponent
    },
    ]),
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
