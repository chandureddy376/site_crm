import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsComponent } from './leads.component';
import { RouterModule, Routes } from '@angular/router';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MyDatePickerModule } from 'mydatepicker';
import { Md2AccordionModule } from 'md2-accordion';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HeaderComponent } from '../header/header.component';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
  { path: '',component: LeadsComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    MyDatePickerModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    SharedModule,
    MultiSelectModule
  ],
  declarations: [LeadsComponent],
})
export class LeadsModule { }
