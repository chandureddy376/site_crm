import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsExecutivesReportComponent } from './calls-executives-report.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';

const routes : Routes = [
  {path:'',component: CallsExecutivesReportComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InfiniteScrollModule,
    FormsModule
  ],
  declarations: [CallsExecutivesReportComponent]
})
export class CallsExecutivesReportModule { }
