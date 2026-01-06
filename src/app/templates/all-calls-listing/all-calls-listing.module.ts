import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCallsListingComponent } from './all-calls-listing.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DropdownModule } from 'primeng/dropdown';

const routes : Routes = [
  {path:'',component: AllCallsListingComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InfiniteScrollModule,
    FormsModule,
    DropdownModule
  ],
  declarations: [AllCallsListingComponent]
})
export class AllCallsListingModule { }
