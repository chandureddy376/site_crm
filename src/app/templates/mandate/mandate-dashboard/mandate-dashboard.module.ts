import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandateDashboardComponent } from './mandate-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import {CdTimerModule} from 'angular-cd-timer'; 

const routes: Routes = [
  { path: '',component: MandateDashboardComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    MyDatePickerModule,
    CdTimerModule,
    SharedModule
  ],
  declarations: [MandateDashboardComponent]
})
export class MandateDashboardModule { }
