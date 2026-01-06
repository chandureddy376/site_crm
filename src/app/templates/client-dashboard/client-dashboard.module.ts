import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDashboardComponent } from './client-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import {CdTimerModule} from 'angular-cd-timer'; 

const routes:Routes=[
  {path:'',component:ClientDashboardComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    MyDatePickerModule,
    CdTimerModule,
  ],
  declarations: [ClientDashboardComponent],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientDashboardModule { }
