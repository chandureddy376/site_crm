import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallInsightsComponent } from './call-insights.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import {CdTimerModule} from 'angular-cd-timer'; 

const routes: Routes = [
  { path: '',component: CallInsightsComponent},
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
  declarations: [CallInsightsComponent]
})
export class CallInsightsModule { }
