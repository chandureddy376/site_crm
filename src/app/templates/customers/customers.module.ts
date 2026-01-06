import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MyDatePickerModule } from 'mydatepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MultiSelectModule } from 'primeng/multiselect';

const routes: Routes = [
  { path: '',component: CustomersComponent},
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
    SharedModule
  ],
  declarations: [CustomersComponent]
})
export class CustomersModule { }
