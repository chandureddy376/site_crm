import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute,Router} from '@angular/router';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { AuthService } from '../../auth-service';
import { UniquePipe } from '../../pipe-filter';
import { Enquiry ,Follow, Face, Usv, Finalnego, closure, leadforward} from './customer';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
 
  @ViewChild('cancel')cancel:ElementRef;
  @ViewChild('myModalClose') modalClose;
  followup = true;
  USV = true;
  SV = true;
  RSV = true;
  Negotiation = true;
  leadclose = true;
  junkmove = true;
  filterLoader: boolean = true;

  showHide:boolean;
  commentshow:boolean;
  modelaadd = new Follow();
  facemodel = new Face();
  addusvmodel = new Usv();
  svmodel = new Usv();
  negmodel = new Finalnego();
  addclose = new closure();
  addpay = new closure();
  usvmodelone : any;
  resposeData : any;
  countries : any[];
  sections : any;
  projects : any;
  activeinputs : any;
  locality: any;
  newpropertybox = false;
  adminview:boolean;
  execview:boolean;
  followupform = false;
  junkform = false;
  commonformbtn = false;
  followupformbtn = false;
  junkformbtn = false;
  followform = false;
  f2fform = false;
  usvform = false;
  svform = false;
  rsvform = false;
  finalnegoform = false;
  leadclosedform = false;

    // ONLY-CUSTOMER-ViEW-FROM-DB-based-ON-ID
    show_cnt= new Enquiry();
    executlist: any;
    sources:any;
    followmodels: any;
    facemodels: any;
    usvmodels:any;
    svmodels:any;
    rsvmodels:any;
    finalmodels:any;
    closedmodels:any;
    typelist: any;
    propetytimeline: any;
    propertiespurpose: any;
    properties: any;
    propertysize: any;
    usvdates: any;
    current: number = 0;
    leadstatus: any;
    activestagestatus: any;
    datavisitwithothersid: any;
    datavisitwithothersname: any;
    suggestedproperties: any;
    suggestedpropertiesname: any;
    autoremarks: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _sharedService:sharedservice,
    private _mandateService:sharedservice,
    public authService: AuthService,
    private _unique:UniquePipe,
    private _location: Location
  ) {
  }
}
