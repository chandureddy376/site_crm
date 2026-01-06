import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsHourlyReportComponent } from './calls-hourly-report.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes:Routes=[
  {path:'',component:CallsHourlyReportComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    BsDatepickerModule,
    InfiniteScrollModule
  ],
  declarations: [CallsHourlyReportComponent]
})
export class CallsHourlyReportModule { }
