import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { SearchDropdown } from '../search-dropdown/search-dropdown';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MyDatePickerModule } from 'mydatepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MultiSelectModule } from 'primeng/multiselect';
import { CdTimerModule} from 'angular-cd-timer'; 
import { ExecutivenameRetail } from '../../pipe-filter';
import { HighlightNumbersPipe } from '../../pipe-filter';
import { HighlightTextPipe } from '../../pipe-filter';
import { MandateCallDetailsComponent } from '../mandate/mandate-call-details/mandate-call-details.component';
import { MandateOnCallFollowupformComponent } from '../mandate/mandate-on-call-followupform/mandate-on-call-followupform.component';
import { MandateOnCallUsvComponent } from '../mandate/mandate-on-call-usv/mandate-on-call-usv.component';
import { MandateOnCallRsvComponent } from '../mandate/mandate-on-call-rsv/mandate-on-call-rsv.component';
import { MandateOnCallNegoComponent } from '../mandate/mandate-on-call-nego/mandate-on-call-nego.component';
import { MandateOnCallJunkComponent } from '../mandate/mandate-on-call-junk/mandate-on-call-junk.component';
import { MandateOnCallClosedComponent } from '../mandate/mandate-on-call-closed/mandate-on-call-closed.component';

const routes: Routes = [];

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
    Ng2SearchPipeModule,
    MultiSelectModule,
    CdTimerModule,
  ],
  // providers:[SearchPipeCommon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    HeaderComponent,
    MandateCallDetailsComponent,
    MandateOnCallFollowupformComponent,
    MandateOnCallUsvComponent,
    MandateOnCallRsvComponent,
    MandateOnCallNegoComponent,
    MandateOnCallJunkComponent,
    MandateOnCallClosedComponent,
    SearchDropdown,
    ExecutivenameRetail,
    HighlightNumbersPipe,
    HighlightTextPipe
  ],
  exports: [
    HeaderComponent,
    MandateCallDetailsComponent,
    MandateOnCallFollowupformComponent,
    MandateOnCallUsvComponent,
    MandateOnCallRsvComponent,
    MandateOnCallNegoComponent,
    MandateOnCallJunkComponent,
    MandateOnCallClosedComponent,
    SearchDropdown,
    ExecutivenameRetail,
    HighlightNumbersPipe,
    HighlightTextPipe
  ]
})
export class SharedModule { }
