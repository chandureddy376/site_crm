import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsMonthlyReportComponent } from './calls-monthly-report.component';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes : Routes = [
  {path:'',component: CallsMonthlyReportComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CalendarModule
  ],
  declarations: [CallsMonthlyReportComponent]
})
export class CallsMonthlyReportModule { }
