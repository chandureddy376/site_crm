import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandateInactiveJunkComponent } from './mandate-inactive-junk.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';


const routes: Routes = [
  { path: '',component: MandateInactiveJunkComponent},
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
    MultiSelectModule,
  ],
  declarations: [MandateInactiveJunkComponent]
})
export class MandateInactiveJunkModule { }
