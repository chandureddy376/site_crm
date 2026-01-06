import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandateAssignedLeadsComponent } from './mandate-assigned-leads.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../../pipe-filter';

const routes: Routes = [
  { path: '',component: MandateAssignedLeadsComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    MyDatePickerModule,
    SharedModule,
    MultiSelectModule,

  ],
  providers:[SearchPipe],
  declarations: [MandateAssignedLeadsComponent,SearchPipe]
})
export class MandateAssignedLeadsModule { }
