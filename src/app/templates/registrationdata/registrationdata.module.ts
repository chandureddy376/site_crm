import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationdataComponent } from './registrationdata.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Searchproperty } from '../../pipe-filter';
import { MultiSelectModule } from 'primeng/multiselect';

const routes: Routes = [
  { path: '',component: RegistrationdataComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    MyDatePickerModule,
    ReactiveFormsModule,
    SharedModule,
    MultiSelectModule,
  ],
  providers: [Searchproperty],
  declarations: [RegistrationdataComponent,Searchproperty]
})
export class RegistrationdataModule { }
