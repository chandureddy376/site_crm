import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExecutivesComponent } from './executives.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
  { path: '',component: ExecutivesComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    AutoCompleteModule,
    MyDatePickerModule,
    MultiSelectModule,
    SharedModule,
    DropdownModule
  ],
  declarations: [ExecutivesComponent]
})
export class ExecutivesModule { }
