import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientEnquiryComponent } from './client-enquiry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MyDatePickerModule } from 'mydatepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedModule } from '../shared/shared.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: ClientEnquiryComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AngularMultiSelectModule,
    FormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    AutoCompleteModule,
    MyDatePickerModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    MultiSelectModule,
    SharedModule,
    InputSwitchModule
  ],
  declarations: [ClientEnquiryComponent,]
})
export class ClientEnquiryModule { }
