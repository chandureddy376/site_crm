import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandateCustomerDetailsComponent } from './mandate-customer-details.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MyDatePickerModule } from 'mydatepicker';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { MandateUsvformComponent } from '../mandate-usvform/mandate-usvform.component';
import { MandateRsvformComponent } from '../mandate-rsvform/mandate-rsvform.component';
import { MandateNegoformComponent } from '../mandate-negoform/mandate-negoform.component';
import { MandateJunkformComponent } from '../mandate-junkform/mandate-junkform.component';
import { MandateFollowupformComponent } from '../mandate-followupform/mandate-followupform.component';
import { MandateClosedformComponent } from '../mandate-closedform/mandate-closedform.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
  { path: '',component: MandateCustomerDetailsComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDatepickerModule,
    MyDatePickerModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    SharedModule,
    MultiSelectModule,
    DropdownModule
  ],
  declarations: [
    MandateCustomerDetailsComponent,
    MandateUsvformComponent,
    MandateRsvformComponent,
    MandateNegoformComponent,
    MandateJunkformComponent,
    MandateFollowupformComponent,
    MandateClosedformComponent
  ],
  schemas :[CUSTOM_ELEMENTS_SCHEMA]
})
export class MandateCustomerDetailsModule { }
