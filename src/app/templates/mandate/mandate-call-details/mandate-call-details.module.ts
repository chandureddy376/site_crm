import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MandateCallDetailsComponent } from './mandate-call-details.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MyDatePickerModule } from 'mydatepicker';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
// import { MandateOnCallFollowupformComponent } from '../mandate-on-call-followupform/mandate-on-call-followupform.component';
// import { MandateOnCallUsvComponent } from '../mandate-on-call-usv/mandate-on-call-usv.component';
// import { MandateOnCallRsvComponent } from '../mandate-on-call-rsv/mandate-on-call-rsv.component';
// import { MandateOnCallNegoComponent } from '../mandate-on-call-nego/mandate-on-call-nego.component';
// import { MandateOnCallJunkComponent } from '../mandate-on-call-junk/mandate-on-call-junk.component';
// import { MandateOnCallClosedComponent } from '../mandate-on-call-closed/mandate-on-call-closed.component';

@NgModule({
  imports: [
    CommonModule,
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
    // MandateCallDetailsComponent,
    // MandateOnCallFollowupformComponent,
    // MandateOnCallUsvComponent,
    // MandateOnCallRsvComponent,
    // MandateOnCallNegoComponent,
    // MandateOnCallJunkComponent,
    // MandateOnCallClosedComponent
  ]
})
export class MandateCallDetailsModule { }
