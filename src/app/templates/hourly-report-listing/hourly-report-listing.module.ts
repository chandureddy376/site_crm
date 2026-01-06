import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HourlyReportListingComponent } from './hourly-report-listing.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

const routes: Routes = [
  { path: '',component: HourlyReportListingComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDatepickerModule.forRoot(),
    InfiniteScrollModule,
    SharedModule,
    MultiSelectModule,
  ],
  declarations: [HourlyReportListingComponent]
})
export class HourlyReportListingModule { }
