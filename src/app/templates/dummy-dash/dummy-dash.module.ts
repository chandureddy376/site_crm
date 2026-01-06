import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DummyDashComponent } from './dummy-dash.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

const routes:Routes=[
  {path:'',component:DummyDashComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    MyDatePickerModule,
    FormsModule,
    MultiSelectModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DummyDashComponent]
})
export class DummyDashModule { }
