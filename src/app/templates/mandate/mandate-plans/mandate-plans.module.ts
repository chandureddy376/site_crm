import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { MandatePlansComponent } from './mandate-plans.component';
// import { MandateOnCallFollowupformComponent } from '../mandate-on-call-followupform/mandate-on-call-followupform.component';
// import { MandateOnCallUsvComponent } from '../mandate-on-call-usv/mandate-on-call-usv.component';
// import { MandateOnCallRsvComponent } from '../mandate-on-call-rsv/mandate-on-call-rsv.component';
// import { MandateOnCallNegoComponent } from '../mandate-on-call-nego/mandate-on-call-nego.component';
// import { MandateOnCallJunkComponent } from '../mandate-on-call-junk/mandate-on-call-junk.component';
// import { MandateOnCallClosedComponent } from '../mandate-on-call-closed/mandate-on-call-closed.component';

const routes: Routes = [
  { path: '', component: MandatePlansComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDatepickerModule.forRoot(),
    InfiniteScrollModule,
    MyDatePickerModule,
    SharedModule,
    MultiSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    MandatePlansComponent,
    // MandateOnCallFollowupformComponent,
    // MandateOnCallUsvComponent,
    // MandateOnCallRsvComponent,
    // MandateOnCallNegoComponent,
    // MandateOnCallJunkComponent,
    // MandateOnCallClosedComponent
  ]
})
export class MandatePlansModule { }
