import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { EnqCampLeadsComponent } from './enq-camp-leads.component';

const routes:Routes = [
  {path:'',component:EnqCampLeadsComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    MyDatePickerModule,
    SharedModule
  ],
  declarations: [EnqCampLeadsComponent]
})
export class EnqCampLeadsModule { }
