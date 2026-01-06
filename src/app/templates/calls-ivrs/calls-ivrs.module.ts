import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsIvrsComponent } from './calls-ivrs.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { BsDatepickerModule } from 'ngx-bootstrap';

const routes : Routes = [
  {path:'',component: CallsIvrsComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    MyDatePickerModule,
  ],
  declarations: [CallsIvrsComponent]
})
export class CallsIvrsModule { }
