import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExecutiveDashboardComponent } from './executive-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import {ProgressBarModule} from 'primeng/progressbar';

const routes: Routes = [
  { path: '',component: ExecutiveDashboardComponent},
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
    SharedModule,
    ProgressBarModule
  ],
  declarations: [ExecutiveDashboardComponent]
})
export class ExecutiveDashboardModule { }
