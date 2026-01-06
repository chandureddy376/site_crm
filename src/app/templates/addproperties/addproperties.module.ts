import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { AddpropertiesComponent } from './addproperties.component';
import { SharedModule } from '../shared/shared.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MyDatePickerModule } from 'mydatepicker';
// import { Md2AccordionModule } from 'md2-accordion';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MultiSelectModule } from 'primeng/multiselect';

const routes: Routes = [
  { path: '',component: AddpropertiesComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AngularMultiSelectModule,
    FormsModule,
    BsDatepickerModule,
    InfiniteScrollModule,
    AutoCompleteModule,
    MyDatePickerModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    MultiSelectModule,
    SharedModule
  ],
  providers:[DatePipe],
  declarations: [AddpropertiesComponent]
})
export class AddPropertiesModule {
}
