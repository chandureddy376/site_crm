import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandateLeadStagesComponent } from './mandate-lead-stages.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../../pipe-filter';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
// import { MandateOnCallFollowupformComponent } from '../mandate-on-call-followupform/mandate-on-call-followupform.component';
// import { MandateOnCallUsvComponent } from '../mandate-on-call-usv/mandate-on-call-usv.component';
// import { MandateOnCallRsvComponent } from '../mandate-on-call-rsv/mandate-on-call-rsv.component';
// import { MandateOnCallNegoComponent } from '../mandate-on-call-nego/mandate-on-call-nego.component';
// import { MandateOnCallJunkComponent } from '../mandate-on-call-junk/mandate-on-call-junk.component';
// import { MandateOnCallClosedComponent } from '../mandate-on-call-closed/mandate-on-call-closed.component';

const routes: Routes = [
  { path: '', component: MandateLeadStagesComponent },
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
    DropdownModule,
    CalendarModule
  ],
  providers:[SearchPipe],
  declarations: [
    MandateLeadStagesComponent,
    // MandateOnCallFollowupformComponent,
    // MandateOnCallUsvComponent,
    // MandateOnCallRsvComponent,
    // MandateOnCallNegoComponent,
    // MandateOnCallJunkComponent,
    // MandateOnCallClosedComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MandateLeadStagesModule { }
