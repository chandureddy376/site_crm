import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportActivityComponent } from './report-activity.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '',component: ReportActivityComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    MyDatePickerModule,
    SharedModule
  ],
  declarations: [
    ReportActivityComponent
  ]
})
export class ReportActivityModule { }
