import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MyDatePickerModule  } from 'mydatepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchPipeCommon, UniquePipe , duplicatePipe } from './pipe-filter';
import { AppComponent } from './app.component';
import { AuthService } from './auth-service';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoginComponent } from './templates/login/login.component';
import { mandateservice } from './mandate.service';
import { MandateClassService } from './mandate-class.service';
import { retailservice } from './retail.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import { SharedModule } from './templates/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { sharedservice } from './shared.service';
import {CdTimerModule} from 'angular-cd-timer'; 
import { SplicePipe } from './pipe-filter';
import { EchoService } from './echo.service';
import { SanitizeHtmlPipe } from './pipe-filter';


const routes: Routes = [];

// TEMPLATES

@NgModule({
  declarations: [
    AppComponent,
    UniquePipe,
    LoginComponent,
    SearchPipeCommon,
    SplicePipe,
    SanitizeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule.forChild(routes),
    AngularMultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule,
    BsDatepickerModule.forRoot(),
    HttpClientModule,
    SharedModule,
    CdTimerModule,
    InfiniteScrollModule
  ],
  exports: [
    AngularMultiSelectModule,
    FormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    AutoCompleteModule,
    MyDatePickerModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    MultiSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [mandateservice,retailservice, UniquePipe,DatePipe,duplicatePipe,SearchPipeCommon,AuthService,sharedservice,SplicePipe,MandateClassService,EchoService],
  bootstrap: [AppComponent]
})

export class AppModule { }
