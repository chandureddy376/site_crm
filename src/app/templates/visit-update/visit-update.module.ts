import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitUpdateComponent } from './visit-update.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes:Routes=[
  {path:'',component:VisitUpdateComponent}
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  declarations: [VisitUpdateComponent]
})
export class VisitUpdateModule { }
