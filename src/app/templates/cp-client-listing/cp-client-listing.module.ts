import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpClientListingComponent } from './cp-client-listing.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

const routes:Routes=[
  {path:'',component:CpClientListingComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    InfiniteScrollModule,
    SharedModule,
    DropdownModule,
    MultiSelectModule
  ],
  declarations: [CpClientListingComponent]
})
export class CpClientListingModule { }
