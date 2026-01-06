import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandatePriceListingComponent } from './mandate-price-listing.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

const routes:Routes=[
  {path:'',component:MandatePriceListingComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    MyDatePickerModule,
    ReactiveFormsModule,
    SharedModule,
    DropdownModule
  ],
  declarations: [MandatePriceListingComponent]
})
export class MandatePriceListingModule { }
