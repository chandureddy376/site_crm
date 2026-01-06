import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MandatelistingComponent } from './mandatelisting.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MultiSelectModule } from 'primeng/multiselect';

const routes: Routes = [
  { path: '',component: MandatelistingComponent},
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
    SharedModule
  ],
  providers:[DatePipe],
  declarations: [MandatelistingComponent]
})
export class MandatelistingModule { }
