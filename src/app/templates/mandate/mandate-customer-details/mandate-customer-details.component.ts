import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../auth-service';
import { UniquePipe } from '../../../pipe-filter';
import { Enquiry, Follow, Face, Usv, Finalnego, closure, leadforward } from '../../customers/customer';
import { mandateservice } from '../../../mandate.service';
import { retailservice } from '../../../retail.service';
import { sharedservice } from '../../../shared.service';
import { Subject, Subscription } from 'rxjs';
import { MandateClassService } from '../../../mandate-class.service';
import { EchoService } from '../../../echo.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { debounceTime } from 'rxjs/operators';
import { Renderer2 } from '@angular/core';
import { timer } from 'rxjs/observable/timer';

declare var $: any;
declare var swal: any;
declare var Swal: any;

@Component({
  selector: 'app-mandate-customer-details',
  templateUrl: './mandate-customer-details.component.html',
  styleUrls: ['./mandate-customer-details.component.css']
})
export class MandateCustomerDetailsComponent implements OnInit {

  callDurationStr: string = '00h:00m:00s';
  private timerSub: Subscription;
  private callStartTime: number = null;
  @ViewChild('cancel') cancel: ElementRef;
  @ViewChild('myModalClose') modalClose;
  followup = true;
  USV = true;
  SV = true;
  RSV = true;
  Negotiation = true;
  leadclose = true;
  junkmove = true;
  filterLoader: boolean = true;
  selectedItem: any;
  showHide: boolean;
  commentshow: boolean;
  modelaadd = new Follow();
  facemodel = new Face();
  addusvmodel = new Usv();
  svmodel = new Usv();
  negmodel = new Finalnego();
  addclose = new closure();
  addpay = new closure();
  usvmodelone: any;
  resposeData: any;
  countries: any[];
  sections: any;
  projects: any;
  activeinputs: any;
  locality: any;
  newpropertybox = false;
  adminview: boolean;
  execview: boolean;
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
  show_cnt = new Enquiry();
  executlist: any;
  sources: any;
  followmodels: any;
  facemodels: any;
  usvmodels: any;
  svmodels: any;
  rsvmodels: any;
  finalmodels: any;
  closedmodels: any;
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
  getPriority: any = 1;
  isSuggestedPropBoolean: boolean = false;
  selectedPlanType: string = '';
  private isCountdownInitialized: boolean;
  editplan: boolean = false;
  selectedpropertylists: any;
  selectedlists: any;
  selectedproperty_commaseperated: any;
  visitPlanDone: boolean = false;
  visitpanelselection: any;
  visitPlanNextDate: any;
  visitPlanNextTime: any;
  retailExecutiveTeam: any;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  feedbackId: any;
  htype: any;
  clickedRMID: any;
  search_name: string = '';
  clients: any
  selectedLead: any;
  isSelectedLead: boolean = false;
  selectedRelation: any;
  isMandateLead: boolean = false;
  fixedPropertiesList: any;
  primaryLeads: any[] = [];
  selectedPrimaryLead: any;
  // isAccompanyBy: boolean = false;
  isDisaplyCall: boolean = false;
  onRecordExecList: any;
  audioList: any;
  selectedRecordExec: any;
  callDirection: any;
  roleTeam: any = '';
  propertyLength: any;
  assignedResponseInfo: any;
  previousUrl: string | null = null;
  reassignedResponseInfo: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _mandateService: mandateservice,
    private _retailservice: retailservice,
    private _sharedservice: sharedservice,
    public authService: AuthService,
    private _unique: UniquePipe,
    private _location: Location,
    private cdRef: ChangeDetectorRef,
    private _mandateClassService: MandateClassService,
    private readonly echoservice: EchoService,
    private renderer: Renderer2
  ) {
    this.route.params.subscribe(params => {
      if (params.id != this.id) {
        setTimeout(() => {
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        })
      }

      this.id = params['id'];
      this.urlpropertyid = params['propid'];
      this.feedbackId = params['feedback'];
      this.leadAssignedExecid = params['execid'];
      this.clickedRMID = params['execid'].split('?')[0];
      this.htype = params['htype'].split('?')[0];
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.url;
      }
    });

    if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
      this.router.navigateByUrl('/login');
    };

    this.retailExecutiveTeam = [
      { team: 'Relationship Executives', value: '50002' },
      { team: 'Customersupport Executives', value: '50014' }
    ]

    this.showHide = true;
    this.commentshow = false;
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 1000)
    this.activeinputs = false;
  }

  urlpropertyid: any;
  checkbox: boolean;
  payment_name: any;
  roleid: any;
  userid: any;
  username: any;
  selectedlocality: any;
  usvs = [];
  rsvs = [];
  rsvmodel: any = {};
  closedmodel: any = {};
  executeid: any;
  assignedrm: any;
  assignedcs: any;
  usvstagedetection: any;
  usvstagestatusdetection: any;
  show_cnt_subarray: any;
  closestObject: any[] = [];
  leadPossession: any;
  leadPropertyType: any;
  leadMoveJunkExec: boolean = true;
  selectedSuggestedProp: any = null;
  activeTabIndex = 0;
  selectedExecId: any;
  leadsDetailsInfo: any;
  adminBookingEdit: boolean = false;
  builderName: any;
  modela = new Enquiry();
  editmodela = new Enquiry();
  followmodel: any = {};
  id = this.route.snapshot.params['id'];
  localityid: any;
  currentstage: any;
  currentstagestatus: any;
  showRejectionForm: boolean = false;
  closepropertyname: any;
  requestedunits: any;
  closurefiles: any[] = [];
  uploads: string[] = [];
  enablebuttonReject: boolean = false;
  enablebuttonApprove: boolean = true;
  status: any;
  leadtrack: any;
  leadforwards = new leadforward();
  executives: any;
  csleadassign = false;
  rmleadassign = false;
  assignteam: any;
  mandateproperties: any;
  selectedMandateTeam: any;
  mandateExecutives: any;
  retailExecutives: any;
  selectedExecIds: any;
  selectedEXEC: any[] = [];
  selectedMandatePropId: any;
  role_type: any;
  leadAssignedExecid: any;
  selectedTeam: any;

  mails: any;
  buildernamereg: any;
  propertyid: any;
  clientregistereddata: any;
  regname: any;
  regnumber: any;
  regmail: any;
  regrmname: any;
  regrmmail: any;
  property: any;
  toselect: any;
  ccselect: any;
  registrationremarks: any;
  selectedCCMail: any;
  assigntype: any;
  execIdMap: any;
  liveCallData: any;
  showCloseButton: boolean = false;
  showCloseConnectingButton: boolean = false;
  closeButtonTimeoutSet = false;
  callStatus: any;
  todaysdateforcompare: any;
  currentdateforcompare = new Date();
  currenttime: any;
  selectedCallLead: any;
  private stageTrigger$ = new Subject<void>();
  private historyTrigger$ = new Subject<void>();
  private fixedPropTrigger$ = new Subject<void>();
  activeTab: string = 'updateActivities';
  url: any;
  // callCounts:number = 3

  ngOnInit() {
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');
    this.username = localStorage.getItem('Name');
    this.role_type = localStorage.getItem('role_type');
    this.propertyLength = localStorage.getItem('prop_suggest');
    this.url = localStorage.getItem('locationURL');

    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    // this.echoservice.stopListeningToDatabaseChanges();
    console.log('Setting up echo listener in this component');
    this.echoservice.listenToDatabaseChanges((message) => {
      this.callStatus = message.Call_status_new;
      this.callDirection = message.Direction;
      if (localStorage.getItem('UserId') == message.Executive && (message.Call_status_new == 'Ringing' || message.Call_status_new == 'Call Disconnected' || message.Call_status_new == 'Answered' || message.Call_status_new == 'Call Connected' || message.Call_status_new == 'Executive Busy' || message.Call_status_new == 'BUSY' || message.Direction == 'inbound')) {
        if (message.Call_status_new == 'Executive Busy' || message.Call_status_new == 'BUSY') {
          setTimeout(() => {
            // this.actionChange('Follow Up');
            this.addfollowupdata();
          }, 0)
        }
        setTimeout(() => {
          if (message.Call_status_new == 'Call Disconnected') {
            this.stopTimer();
            this.isSwalShown = false;
          }
          this.getLiveCallsData();
        }, 0)
        return
      }
    });

    this.stageTrigger$.pipe(debounceTime(500)).subscribe(() => {
      this.getstages();
    });

    // this.historyTrigger$.pipe(debounceTime(500)).subscribe(() => {
    //   this.triggerhistory();
    // });

    this.fixedPropTrigger$.pipe(debounceTime(500)).subscribe(() => {
      this.getFixedProperties();
    })

    if (this.isDisaplyCall == false) {
      this.getLiveCallsData()
    }

    this.initInterval();
    const storedTime = localStorage.getItem('callStartTime');
    if (storedTime) {
      this.scheduleCloseButton(parseInt(storedTime, 10));
      this.scheduleConnectingCloseButton(parseInt(storedTime, 10));
    }

    this.getcustomerview();
    this.getsize();
    this.getprprtytype();
    this.getstatus();
    this.getlocalitylist();

    // var param = {
    //   leadid: this.id,
    //   execid: this.clickedRMID,
    //   loginid:this.userid,
    //   feedbackid: this.feedbackId
    // }

    // this._mandateService.csPropertylist(param).subscribe(propertylist => {
    //     this.properties = propertylist;
    // });

    this.getAllSuggestProperties();

    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    } else if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
      this.adminview = true;
      this.execview = false;
      this.historyTrigger$.next();
    } else {
      this.adminview = false;
      this.execview = true;
    }

    let node1: any = document.createElement('link');
    node1.setAttribute('href', 'https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css');
    node1.rel = 'stylesheet';
    node1.type = 'text/css';
    node1.id = "myplans_material_css";
    document.getElementsByTagName('head')[0].appendChild(node1);

    let node2: any = document.createElement('script');
    node2.type = 'text/javascript';
    node2.src = 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js';
    node2.charset = 'utf-8';
    node2.id = "myplans_dynamic_links_1";
    document.getElementsByTagName('head')[0].appendChild(node2);

    let node3: any = document.createElement('script');
    node3.src = 'https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js';
    node3.type = 'text/javascript';
    node3.charset = 'utf-8';
    node3.id = "myplans_dynamic_links_2";
    document.getElementsByTagName('head')[0].appendChild(node3);

    // ngAfterViewInit() {
    // Initialize Semantic UI dropdowns
    $('.onchangeforsuggestproperties00').dropdown();
    $('.onchangeforvisitwithothers00').dropdown();
    // }
  }

  ngOnDestroy() {
    let element1 = document.getElementById('myplans_material_css');
    let element2 = document.getElementById('myplans_dynamic_links_1');
    let element3 = document.getElementById('myplans_dynamic_links_2');
    if (element1) {
      element1.parentNode.removeChild(element1);
    }
    if (element2) {
      element2.parentNode.removeChild(element2);
    }
    if (element3) {
      element3.parentNode.removeChild(element3);
    }
    $('.modal').remove();
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
    this.echoservice.stopListeningToDatabaseChanges();

    // if (this.stageTrigger$) {
    //   this.stageTrigger$.unsubscribe();
    // }

    // this.historyTrigger$.unsubscribe();

    // this.fixedPropTrigger$.unsubscribe();
    if (this.stageTrigger$) this.stageTrigger$.complete();
    if (this.historyTrigger$) this.historyTrigger$.complete();
    if (this.fixedPropTrigger$) this.fixedPropTrigger$.complete;
  }

  backClicked() {
    let backLoc = localStorage.getItem('backLocation');
    if (backLoc == 'fresh') {
      this.router.navigateByUrl(this.url);
    } else if (backLoc == 'complete') {
      // let todaysdateforcompare;
      // let previousMonthDateForCompare;
      // var curmonth = this.currentdateforcompare.getMonth() + 1;
      // var curmonthwithzero = curmonth.toString().padStart(2, "0");
      // // Todays Date
      // var curday = this.currentdateforcompare.getDate();
      // var curdaywithzero = curday.toString().padStart(2, "0");
      // todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
      // //to get the previous month date of the present day date
      // var previousMonthDate = new Date(this.currentdateforcompare);
      // previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
      // var prevMonth = (previousMonthDate.getMonth() + 1).toString().padStart(2, '0');
      // var prevDay = previousMonthDate.getDate().toString().padStart(2, '0');
      // previousMonthDateForCompare = previousMonthDate.getFullYear() + '-' + prevMonth + '-' + prevDay;
      // this.router.navigate(['/leads'], {
      //   queryParams: {
      //     unique: '1',
      //     from: previousMonthDateForCompare,
      //     to: todaysdateforcompare,
      //   }
      // })
      this.router.navigateByUrl(this.url);
    } else {
      setTimeout(() => {
        this._location.back();
      }, 0);
    }
    // setTimeout(()=>{
    //   let currentUrl = this.router.url;
    //   let pathWithoutQueryParams = currentUrl.split('?')[0];
    //   let currentQueryparams = this.route.snapshot.queryParams;
    //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //     this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
    //   })
    // },1000)

    // if (backLoc == 'leads') {
    //   this.router.navigate(['/mandate-lead-stages'], {
    //     queryParams: {
    //       pending: '1',
    //       type: 'leads',
    //       htype: 'mandate'
    //     }
    //   })
    // } else if (backLoc == 'visits') {
    //   this.router.navigate(['/mandate-lead-stages'], {
    //     queryParams: {
    //       usv: '1',
    //       stagestatus: '3',
    //       type: 'visits',
    //       visitedfrom: '',
    //       visitedto: '',
    //       htype: 'mandate',
    //       id: '3'
    //     }
    //   })
    // } else if (backLoc == 'bookings') {
    //   this.router.navigate(['/mandate-lead-stages'], {
    //     queryParams: {
    //       bookingPending: '1',
    //       from: '',
    //       to: '',
    //       type: 'bookings',
    //       htype: 'mandate'
    //     }
    //   })
    // } else if (backLoc == 'scheduled') {
    //   this.router.navigate(['/rmleadassign'], {
    //     queryParams: {
    //       todaysvisits: '1',
    //       htype: 'mandate'
    //     }
    //   })
    // } else if (backLoc == 'followup') {
    //   this.router.navigate(['/rmleadassign'], {
    //     queryParams: {
    //       todaysfollowups: '1',
    //       htype: 'mandate'
    //     }
    //   })
    // } else if (backLoc == 'executives-report') {
    //   this.router.navigate(['/mymandatereports'], {
    //     queryParams: {
    //       followups: '1',
    //       datetype: 'today',
    //       htype: 'mandate'
    //     }
    //   })
    // } else if (backLoc == 'feedback') {
    //   this.router.navigate(['/mandate-feedback'], {
    //     queryParams: {
    //       pending: '1',
    //       from: '',
    //       to: '',
    //       htype: 'mandate'
    //     }
    //   })
    // } else if (backLoc == 'inactive-junk') {
    //   this.router.navigate(['/mandate-inactive-junk'], {
    //     queryParams: {
    //       type: 'inactive',
    //       inactive1: '1',
    //       from: '',
    //       to: '',
    //       htype: 'mandate'
    //     }
    //   })
    // } else if (backLoc == 'overdues') {
    //   this.router.navigate(['/mandate-myoverdues'], {
    //     queryParams: {
    //       followupsoverdues: '1',
    //       from: '',
    //       to: '',
    //       htype: 'mandate'
    //     }
    //   })
    // } else if (backLoc == 'plans') {
    //   let planfromdate;
    //   let plantodate;
    //   const getUpcomingWeekendDates = () => {
    //     const currentDay = this.currentdateforcompare.getDay();
    //     let fromDate, toDate;
    //     if (currentDay === 6) {
    //       fromDate = new Date(this.currentdateforcompare);
    //       toDate = new Date(this.currentdateforcompare);
    //       toDate.setDate(this.currentdateforcompare.getDate() + 1);
    //     } else if (currentDay === 0) {  // Sunday
    //       fromDate = new Date(this.currentdateforcompare);
    //       fromDate.setDate(this.currentdateforcompare.getDate() - 1);
    //       toDate = new Date(this.currentdateforcompare);
    //     } else {
    //       const diffToSaturday = 6 - currentDay;
    //       const diffToSunday = diffToSaturday + 1;

    //       fromDate = new Date(this.currentdateforcompare);
    //       fromDate.setDate(this.currentdateforcompare.getDate() + diffToSaturday);

    //       toDate = new Date(this.currentdateforcompare);
    //       toDate.setDate(this.currentdateforcompare.getDate() + diffToSunday);
    //     }
    //     const fromDateFormatted = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1).toString().padStart(2, "0") + "-" + fromDate.getDate().toString().padStart(2, "0");
    //     const toDateFormatted = toDate.getFullYear() + "-" + (toDate.getMonth() + 1).toString().padStart(2, "0") + "-" + toDate.getDate().toString().padStart(2, "0");
    //     return { from: fromDateFormatted, to: toDateFormatted };
    //   };
    //   const weekendDates = getUpcomingWeekendDates();
    //   planfromdate = weekendDates.from;
    //   plantodate = weekendDates.to;
    //   this.router.navigate(['/mandate-plans'], {
    //     queryParams: {
    //       plan: 'weekend',
    //       type: 'usv',
    //       from: planfromdate,
    //       to: plantodate,
    //       htype: 'mandate'
    //     }
    //   })
    // } else if (backLoc == 'fresh') {
    //   this.router.navigate(['/Enquiry'], {
    //     queryParams: {
    //       leads: '1',
    //       from: '',
    //       to: '',
    //     }
    //   })
    // } else if (backLoc == 'complete') {
    //   let todaysdateforcompare;
    //   let previousMonthDateForCompare;
    //   var curmonth = this.currentdateforcompare.getMonth() + 1;
    //   var curmonthwithzero = curmonth.toString().padStart(2, "0");
    //   // Todays Date
    //   var curday = this.currentdateforcompare.getDate();
    //   var curdaywithzero = curday.toString().padStart(2, "0");
    //   todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    //   //to get the previous month date of the present day date
    //   var previousMonthDate = new Date(this.currentdateforcompare);
    //   previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    //   var prevMonth = (previousMonthDate.getMonth() + 1).toString().padStart(2, '0');
    //   var prevDay = previousMonthDate.getDate().toString().padStart(2, '0');
    //   previousMonthDateForCompare = previousMonthDate.getFullYear() + '-' + prevMonth + '-' + prevDay;
    //   this.router.navigate(['/leads'], {
    //     queryParams: {
    //       unique: '1',
    //       from: previousMonthDateForCompare,
    //       to: todaysdateforcompare,
    //     }
    //   })
    // } else if (backLoc == 'dashboard') {
    //   this.router.navigate(['/mandate-dashboard'], {
    //     queryParams: {
    //       todayvisited: 1,
    //       from: '',
    //       to: '',
    //       dashtype: 'dashboard',
    //       htype: 'mandate'
    //     }
    //   });
    // } else {
    //   this.router.navigate(['/mandate-lead-stages'], {
    //     queryParams: {
    //       pending: '1',
    //       type: 'leads',
    //       htype: 'mandate'
    //     }
    //   })
    // }

    // }, 50)
  }

  getAllSuggestProperties() {
    var param = {
      leadid: this.id,
      execid: this.selectedExecId,
      loginid: this.userid,
      feedbackid: this.feedbackId
    }
    this._mandateService.csPropertylist(param).subscribe(propertylist => {
      this.properties = propertylist;
    });
  }

  public getExstendsion(image) {
    if (image.endsWith('jpg') || image.endsWith('jpeg') || image.endsWith('png')) {
      return 'jpg';
    }
    if (image.endsWith('pdf')) {
      return 'pdf';
    }
  }

  addusv() {
    this.usvs.push({});
  }

  //here we get the fixed property names.
  getFixedProperties() {
    let param = {
      leadid: this.id,
      execid: this.selectedExecId,
      loginid: this.userid,
      propid: this.selectedSuggestedProp.propid
    }
    this._mandateService.getFixedMandateProperties(param).subscribe((resp) => {
      if (resp.status == 'True') {
        this.fixedPropertiesList = resp['result'];
      } else {
        this.fixedPropertiesList = [];
      }
    })
  }

  // CUSTOMER-VIEW-FROM-ENQUIRY
  getcustomerview() {
    this.showRejectionForm = false;
    this._mandateService.getcustomeredit(this.id).subscribe(cust => {
      this.filterLoader = false;
      this.show_cnt = cust[0];
      this.show_cnt_subarray = cust[0].assignedrm;
      this.facemodel = cust[0];
      this.regname = cust[0].customer_name;
      this.regnumber = cust[0].customer_number;
      this.regmail = cust[0].customer_mail;
      if (cust[0].latestaction) {
        this.closestObject = cust[0].latestaction;
      }
      if (this.locality && this.show_cnt['localityid']) {
        let location = this.locality.filter((data) => data.id == this.show_cnt['localityid']);
        this.selectedlocality = location[0].id
      }

      if (this.show_cnt.mergedleads) {
        let data = this.show_cnt.mergedleads.map((data) => ({
          name: data.mergedName,
          id: data.mergedId
        }));
        this.primaryLeads = data;
      }

      if (this.show_cnt) {
        let data1 = {
          name: this.show_cnt.customer_name,
          id: this.show_cnt.customer_IDPK,
        }
        this.primaryLeads.push(data1);
      }

      if (this.show_cnt.enquiry_possession == '1') {
        this.leadPossession = 'Immediate';
      } else if (this.show_cnt.enquiry_possession == '2') {
        this.leadPossession = '6 Months';
      } else if (this.show_cnt.enquiry_possession == '3') {
        this.leadPossession = '1 Year';
      } else if (this.show_cnt.enquiry_possession == '4') {
        this.leadPossession = '< 2 years';
      }

      if (this.show_cnt.enquiry_proptype == '1') {
        this.leadPropertyType = "Apartment";
      } else if (this.show_cnt.enquiry_proptype == '2') {
        this.leadPropertyType = "Villa";
      } else if (this.show_cnt.enquiry_proptype == '3') {
        this.leadPropertyType = "Plot";
      } else if (this.show_cnt.enquiry_proptype == '4') {
        this.leadPropertyType = "Villament";
      }

      $('#proptypeselect').val(this.show_cnt['enquiry_proptype']);
      $('#sizeselect').val(this.show_cnt['enquiry_bhksize']);
      $('#budgetselect').val(this.show_cnt['enquiry_budget']);
      $('#possessionselect').val(this.show_cnt['enquiry_possession']);
      $('#priorityselect').val(this.show_cnt['lead_priority']);
      $('#customer_location').val(this.show_cnt['localityid']);
      $('#customer_address').val(this.show_cnt['address']);

      if (this.show_cnt['customer_phase'] == null) {
        this.show_cnt['customer_phase'] = 'Fresh lead';
      } else {
        this.showRejectionForm = false;
      }
      // let execid;
      // if (this.show_cnt_subarray.length > 0 && this.show_cnt_subarray[0].assignedvisits == '1') {
      //   execid = this.show_cnt_subarray[0].RM_IDFK;
      // } else {
      //   execid = this.leadAssignedExecid
      // }
    })

    this._mandateService.getassignedrm(this.id, this.userid, this.leadAssignedExecid, this.feedbackId).subscribe(cust => {

      this.filterLoader = false;
      if (cust.status == 'True') {
        this.assignedrm = cust.RMname;
        if (this.roleid == 1 || this.roleid == '2' || this.role_type == 1) {
          this.leadsDetailsInfo = cust.RMname;
        } else {
          if (this.feedbackId == 0) {
            this.leadsDetailsInfo = cust.RMname.filter((exec) => {
              if (exec.leadstage != "Junk") return true;
              return exec.RMID == this.userid;
            });
          } else if (this.feedbackId == 1) {
            this.leadsDetailsInfo = cust.RMname;
          }
        }
        this.executeid = cust.RMname[0].executiveid;
        this.execIdMap = cust.RMname.map((exec) => exec.RMID);

        this.usvstagedetection = cust.RMname[0].leadstage;
        this.usvstagestatusdetection = cust.RMname[0].leadstatus;
        if (this.route.snapshot.params['execid'] == 1) {
          this.selectedExecId = this.executeid;
        } else {
          this.selectedExecId = this.route.snapshot.params['execid']
        }

        this.assignedrm = this.assignedrm.filter((exec) => {
          return exec.RMID == this.selectedExecId;
        });
        if (this.assignedrm && this.assignedrm.length > 0) {
          this.getexecutiveId(this.assignedrm[0]);
        }

        if (this.assignedrm[0].leadstage == 'Fresh' && (this.show_cnt.enquiry_bhksize == null || this.show_cnt.enquiry_budget == null) && this.callStatus != undefined && this.callStatus != null && this.callStatus != '') {
          setTimeout(() => {
            $('#auto_edit_trigger').click();
            this.getcustomerupdate(this.show_cnt.customer_IDPK);
          }, 0)
        }

        if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop && this.assignedrm[0].suggestedprop.length > 1) {
          this.isSuggestedPropBoolean = false;
          let propertyData, propIndex;
          this.assignedrm[0].suggestedprop.forEach((prop, index) => {
            if (prop.propid == this.urlpropertyid) {
              propertyData = prop;
              propIndex = index;
            }
          })
          // if (propertyData.selection == 1 && propertyData.leadstage == 'USV' && propertyData.actions == 0 || propertyData.selection == 2 && propertyData.leadstage == 'RSV' && propertyData.actions == 1) {
          if (this.assignedrm[0].suggestedprop.length > 1 && this.urlpropertyid) {
            this.selectedItem = propIndex;
            setTimeout(() => {
              this.tabclick(propIndex, propertyData);
            }, 100)
          } else if (this.assignedrm[0].suggestedprop.length > 1 && this.urlpropertyid == '') {
            this.selectedItem = 0;
            setTimeout(() => {
              this.tabclick(this.selectedItem, this.assignedrm[0].suggestedprop[0]);
            }, 100)
          } else {
            this.selectedItem = 0;
            setTimeout(() => {
              this.tabclick(this.selectedItem, this.assignedrm[0].suggestedprop[0]);
            }, 100)
          }
        } else {
          this.selectedItem = 0;
          setTimeout(() => {
            if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop) {
              this.tabclick(this.selectedItem, this.assignedrm[0].suggestedprop[0]);
            }
          }, 100)
        }

        if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop) {
          this.visitpanelselection = this.assignedrm[0].suggestedprop.filter((prop) => {
            return !(prop.weekplan == null)
          })
          if (this.visitpanelselection.length > 0 && this.visitpanelselection[0].weekplan == '1') {
            this.selectedPlanType = 'weekdays';
          } else if (this.visitpanelselection.length > 0 && this.visitpanelselection[0].weekplan == '2') {
            this.selectedPlanType = 'weekend';
          } else if (this.visitpanelselection.length > 0 && this.visitpanelselection[0].weekplan == '0') {
            this.selectedPlanType = 'ytc';
          }
        }

        setTimeout(() => {
          if (this.assignedrm && (this.assignedrm[0].suggestedprop == null || this.assignedrm[0].suggestedprop == undefined)) {
            this.filterLoader = false;
          }
        }, 1000)

        if (this.usvstagedetection == "USV" && this.usvstagestatusdetection == "3" && cust.RMname[0].visitstatus == "0") {
          this.actionChange(this.usvstagedetection);
        }
        if (this.selectedSuggestedProp && this.selectedSuggestedProp.actions == '7' && this.selectedSuggestedProp.currentstage == '5') {
          this.showRejectionForm = true;
          this.verifyrequest(this.assignedrm[0].customer_IDPK, this.selectedSuggestedProp.propid, this.assignedrm[0].RMID, this.selectedSuggestedProp.name);
        }
        if (this.selectedSuggestedProp && this.selectedSuggestedProp.actions == '8' && this.selectedSuggestedProp.currentstage == '5') {
          this.showRejectionForm = true;
          this.verifyrequest(this.assignedrm[0].customer_IDPK, this.selectedSuggestedProp.propid, this.assignedrm[0].RMID, this.selectedSuggestedProp.name)
        }
        if (this.selectedSuggestedProp && this.selectedSuggestedProp.actions == '6' && this.selectedSuggestedProp.currentstage == '5') {
          this.showRejectionForm = true;
          this.verifyrequest(this.assignedrm[0].customer_IDPK, this.selectedSuggestedProp.propid, this.assignedrm[0].RMID, this.selectedSuggestedProp.name)
        }

        if (this.assignedrm) {
          if (this.assignedrm.length > 0 && this.assignedrm[0].rnrcount >= 5 && this.assignedrm[0].leadstage == 'Fresh' && this.roleid != 1 && this.roleid != '2') {
            swal({
              text: 'Access Denied , Do contact the Admin',
              type: 'error',
            }).then(() => {
              this.router.navigate(['mandate-lead-stages'], {
                queryParams: {
                  inactive: '1',
                  type: 'leads',
                  htype: 'mandate'
                }
              })
            })
          }
        }
      }
    })

  };

  tabclick(i, suggested) {
    this.followform = false;
    this.usvform = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.leadclosedform = false;
    this.junkform = false;
    this.isSuggestedPropBoolean = false;
    $(".actionss").addClass("actionbtnss");
    $(".selectMarks").addClass("iconmarks");
    $(".actionbtnss").removeClass("actionss");
    $(".iconmarks").removeClass("selectMarks");
    $(".actionss" + i).removeClass("actionbtnss");
    $(".actionss" + i).addClass("actionss");
    $(".selectMarks" + i).removeClass("iconmarks");
    $(".selectMarks" + i).addClass("selectMarks");
    this.selectedSuggestedProp = suggested;
    this.router.navigateByUrl(`/mandate-customers/${this.id}/${this.selectedExecId}/${this.feedbackId}/${this.htype}/${this.selectedSuggestedProp.propid}`);
    this.followform = false;
    this.usvform = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.leadclosedform = false;
    this.junkform = false;
    $('input[name="select4"]').prop('checked', false);
    // this.getFixedProperties();
    this.fixedPropTrigger$.next();
    this.stageTrigger$.next();
  }

  getexecutiveId(exec) {
    this.filterLoader = true;
    this.selectedExecId = exec.RMID;
    this.activeTabIndex = this.leadsDetailsInfo.indexOf(exec);
    this.followform = false;
    this.usvform = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.leadclosedform = false;
    this.junkform = false;

    // if(this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop)

    this.router.navigateByUrl(`/mandate-customers/${this.id}/${this.selectedExecId}/${this.feedbackId}/${this.htype}/${this.urlpropertyid}`);
    this.assignedrm = this.leadsDetailsInfo.filter((exec) => {
      return exec.RMID == this.selectedExecId;
    });

    if (this.roleid == 1 || this.roleid == 2) {
      this.getAllSuggestProperties();
    }

    if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop && this.assignedrm[0].suggestedprop.length > 1) {
      this.isSuggestedPropBoolean = true;
      let propertyData;
      let propIndex;
      this.assignedrm[0].suggestedprop.forEach((prop, index) => {
        if (prop.propid == this.urlpropertyid) {
          propertyData = prop;
          propIndex = index;
        }
      })
      // if (propertyData.selection == 1 && propertyData.leadstage == 'USV' && propertyData.actions == 0 || propertyData.selection == 2 && propertyData.leadstage == 'RSV' && propertyData.actions == 1) {
      if (this.assignedrm[0].suggestedprop.length > 1 && this.urlpropertyid) {
        this.selectedItem = propIndex;
        setTimeout(() => {
          this.tabclick(propIndex, propertyData)
        }, 100)
      } else if (this.assignedrm[0].suggestedprop.length > 1 && this.urlpropertyid == '') {
        this.selectedItem = 0;
        setTimeout(() => {
          this.tabclick(this.selectedItem, this.assignedrm[0].suggestedprop[0]);
        }, 100)
      } else {
        this.selectedItem = 0;
        setTimeout(() => {
          this.tabclick(this.selectedItem, this.assignedrm[0].suggestedprop[0]);
        }, 100)
      }
    } else {
      this.selectedItem = 0;
      if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop) {
        this.tabclick(0, this.assignedrm[0].suggestedprop[0]);
      }
    }

    if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop) {
      this.visitpanelselection = this.assignedrm[0].suggestedprop.filter((prop) => {
        return !(prop.weekplan == null)
      });

      if (this.selectedSuggestedProp) {
        if (this.selectedSuggestedProp.weekplan == '1') {
          this.selectedPlanType = 'weekdays';
        } else if (this.selectedSuggestedProp.weekplan == '2') {
          this.selectedPlanType = 'weekend';
        } else if (this.selectedSuggestedProp.weekplan == '0') {
          this.selectedPlanType = 'ytc';
        }
      }
    }

    setTimeout(() => {
      this.stageTrigger$.next();
      this.historyTrigger$.next();
      this.scriptfunctions();
      this.filterLoader = false;
    }, 10)

    setTimeout(() => {
      // this.isAccompanyBy = false;
      if ((this.userid != this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && ((this.role_type == 1 && (exec.roleid == 50013 || exec.roleid == 50014)) || this.role_type != 1) && this.feedbackId != 1) {
        $(".updateActivities").removeClass("active");
        $(".allActivities").removeClass("active");
        setTimeout(() => {
          const tab = document.getElementById('allActivitiesTab');
          if (tab) {
            tab.click();
            this.logsTab('lead');
          }
          this.activeTab = 'allActivities';
        }, 100)
      } else if ((this.userid == this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && ((this.role_type == 1 && exec.roleid != 50013 && exec.roleid != 50014)) && this.feedbackId != 1) {
        if (this.assignedrm && this.assignedrm[0].visitaccompaniedid && ((this.assignedrm[0].visitaccompaniedid != this.assignedrm[0].RMID))) {
          // this.isAccompanyBy = true;
          setTimeout(() => {
            $(".allActivities").removeClass("active");
            const tab = document.getElementById('updateActivitiesTab');
            if (tab) {
              tab.click();
            }
            this.activeTab = 'updateActivities';
          }, 0)
        } else {
          $(".allActivities").removeClass("active");
          const tab = document.getElementById('updateActivitiesTab');
          if (tab) {
            tab.click();
          }
          this.activeTab = 'updateActivities';
        }
      } else if ((this.userid == this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && this.role_type != 1 && this.feedbackId != 1) {
        $(".allActivities").removeClass("active");
        const tab = document.getElementById('updateActivitiesTab');
        if (tab) {
          tab.click();
        }
        this.activeTab = 'updateActivities';
      } else if ((this.userid != this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && ((this.role_type == 1 && exec.roleid != 50013 && exec.roleid != 50014) || this.role_type != 1) && this.feedbackId != 1) {
        if (this.assignedrm && this.assignedrm[0].visitaccompaniedid && ((this.assignedrm[0].visitaccompaniedid != this.assignedrm[0].RMID) || this.role_type == 1)) {
          // this.isAccompanyBy = true;
          setTimeout(() => {
            $(".allActivities").removeClass("active");
            const tab = document.getElementById('updateActivitiesTab');
            if (tab) {
              tab.click();
            }
          }, 0)
          this.activeTab = 'updateActivities';
        } else {
          $(".allActivities").removeClass("active");
          const tab = document.getElementById('updateActivitiesTab');
          if (tab) {
            tab.click();
          }
          this.activeTab = 'updateActivities';
        }
      }

      if (this.roleid == 1 || this.roleid == 2) {
        this.logsTab('lead');
      }
    }, 1000)

    $('.radiocheck').prop('checked', false);
  }

  accessCheck() {
    if (this.role_type == 1) {
      setTimeout(() => {
        // this.isAccompanyBy = false;
        if ((this.userid != this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && ((this.role_type == 1 && (this.assignedrm[0].roleid == 50013 || this.assignedrm[0].roleid == 50014)) || this.role_type != 1) && this.feedbackId != 1) {
          $(".updateActivities").removeClass("active");
          $(".allActivities").removeClass("active");
        } else if ((this.userid == this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && ((this.role_type == 1 && this.assignedrm[0].roleid != 50013 && this.assignedrm[0].roleid != 50014)) && this.feedbackId != 1) {
          if (this.assignedrm && this.assignedrm[0].visitaccompaniedid && ((this.assignedrm[0].visitaccompaniedid != this.assignedrm[0].RMID))) {
            // this.isAccompanyBy = true;
          } else {
            $(".allActivities").removeClass("active");
            const tab = document.getElementById('updateActivitiesTab');
            if (!tab) {
              tab.click();
              // document.getElementById('updateActivitiesTab')?.click();
            }
            this.activeTab = 'allActivities';
          }
        } else if ((this.userid == this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && this.role_type != 1 && this.feedbackId != 1) {
          $(".allActivities").removeClass("active");
          const tab = document.getElementById('updateActivitiesTab');
          if (!tab) {
            tab.click();
            // document.getElementById('updateActivitiesTab')?.click();
          }
          this.activeTab = 'updateActivities';
        } else if ((this.userid != this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && ((this.role_type == 1 && this.assignedrm[0].roleid != 50013 && this.assignedrm[0].roleid != 50014) || this.role_type != 1) && this.feedbackId != 1) {
          if (this.assignedrm && this.assignedrm[0].visitaccompaniedid && ((this.assignedrm[0].visitaccompaniedid != this.assignedrm[0].RMID) || this.role_type == 1)) {
            // this.isAccompanyBy = true;
          } else {
            $(".allActivities").removeClass("active");
            const tab = document.getElementById('updateActivitiesTab');
            if (!tab) {
              // tab.click();
              tab.click();
            }
            this.activeTab = 'updateActivities';
          }
        }
      }, 1000)
    }

    if (this.adminview && this.activestagestatus[0].stage == 'Junk') {
      $('#profile').removeClass('active');
    }
  }

  editNowClicked: boolean = false;
  showEditForm(type) {
    if (type == 'admin') {
      this.editNowClicked = true;
      this.adminBookingEdit = true;
    } else {
      this.adminBookingEdit = true;
      this.editNowClicked = false;
    }
  }

  showBookingRejection() {
    this.adminBookingEdit = false;
    this.enablebuttonApprove = true;
    this.enablebuttonReject = false;
  }

  //this method is not been used any where in this component
  addpropertiestolist00() {
    this.datavisitwithothersid = $(".onchangeforvisitwithothers00").dropdown("get value");
    this.datavisitwithothersname = $('.onchangeforvisitwithothers00 option:selected').toArray().map(item => item.text).join();
    this.suggestedproperties = $(".onchangeforsuggestproperties00").dropdown("get value");
    this.suggestedpropertiesname = $('.onchangeforsuggestproperties00 option:selected').toArray().map(item => item.text).join();

    if (this.suggestedproperties == "" && this.datavisitwithothersid == "") {
      swal({
        title: 'Add any one property',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    } else {
      $('.onchangeforsuggestproperties00').removeAttr("style");
    }

    if (this.suggestedproperties.length == 0) {
    } else {
      var param = {
        leadid: this.id,
        suggestproperties: this.suggestedproperties,
        assignid: this.userid,
        stage: "Fresh",
        execid: this.selectedExecId
      }
      this.autoremarks = " suggested some properties like " + this.suggestedpropertiesname;
      this._mandateService.csAddsuggestedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          swal({
            title: 'Suggested Successfully Added',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            $('#suggestmodalclose').click();
            this.modalClose.nativeElement.click();
            $(".radiocheck").prop('checked', false);
            this.followform = false;
            this.followupform = false;
            this.followupformbtn = false;
            this.f2fform = false;
            this.usvform = false;
            this.svform = false;
            this.rsvform = false;
            this.finalnegoform = false;
            this.leadclosedform = false;
            this.junkform = false;
            this.junkformbtn = false;
            this.commonformbtn = false;
            this.ngOnInit();
          });
        } else if (this.status == "False" && success.result == '2') {
          swal({
            title: 'Property Suggestion Failed',
            text: 'The selected executive does not have access to suggest this property.',
            type: "error",
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            $('#suggestmodalclose').click();
            this.modalClose.nativeElement.click();
            $(".radiocheck").prop('checked', false);
          })
        }
        $(".onchangeforvisitwithothers00").dropdown('clear');
        $(".onchangeforvisitwithothers00").dropdown('destroy');
        $(".onchangeforvisitwithothers00").dropdown('restore defaults');
        $(".onchangeforsuggestproperties00").dropdown('clear');
        $(".onchangeforsuggestproperties00").dropdown('destroy');
        $(".onchangeforsuggestproperties00").dropdown('restore defaults');
      }, (err) => {
        console.log("Failed to Update");
      })
    }

    if (this.datavisitwithothersid.length == 0) {
      // alert("No need push to database");
    } else {
      // alert("Should push to database");
      var param2 = {
        leadid: this.id,
        assignid: this.selectedExecId,
        visitedproperties: this.datavisitwithothersid
      }
      this.autoremarks = "While fixing the USV " + this.username + " added few already visited properties with others Like, " + this.datavisitwithothersname;
      this._mandateService.addvisitedpropertiesothers(param2).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          swal({
            title: 'Visited Successfully Added',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.modalClose.nativeElement.click();
            $(".radiocheck").prop('checked', false);
            this.followform = false;
            this.followupform = false;
            this.followupformbtn = false;
            this.f2fform = false;
            this.usvform = false;
            this.svform = false;
            this.rsvform = false;
            this.finalnegoform = false;
            this.leadclosedform = false;
            this.junkform = false;
            this.junkformbtn = false;
            this.commonformbtn = false;
            this.ngOnInit();
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }

  }

  propertyType: any;
  typeselection(event) {
    var value = event.target.value;
    const a = document.getElementById("proptypeselect") as HTMLInputElement;
    a.value = value;
    this.propertyType = value;
  }

  possessionselection(event) {
    var value = event.target.value;
    const a = document.getElementById("possessionselect") as HTMLInputElement;
    a.value = value;
  }

  bhkSelection: any;
  sizeselection(event) {
    var value = event.target.value;
    const a = document.getElementById("sizeselect") as HTMLInputElement;
    a.value = value;
    let numArr = value.match(/[\d\.]+/g)
    numArr = numArr.filter(n => n != '.')
    // this.bhkSelection = value;
  }

  budgetselection(event) {
    var value = event.target.value;
    const a = document.getElementById("budgetselect") as HTMLInputElement;
    a.value = value;
  }

  showinput() {
    this.newpropertybox = true;
  }

  getlocalitylist() {
    this._mandateService.localitylist().subscribe(localities => {
      this.locality = localities;
      this.selectedlocality = this.show_cnt['localityid'];
    })
  }

  editPriority(event) {
    var value = event.target.value;
    const a = document.getElementById("priorityselect") as HTMLInputElement;
    a.value = value;
  }

  getprprtytype() {
    this._mandateService
      .getpropertytypelist()
      .subscribe(proprttype => {
        this.typelist = proprttype;
      })
  }

  statesChange(vals) {
    const val = vals.target.value;
    this._mandateService
      .getpropertylist_ID(val)
      .subscribe(prope => {
        this.projects = prope;
      })
    $('.projts.ui.dropdown').dropdown('restore defaults');
    this.negmodel.final_builder_info = vals.target.options[vals.target.selectedIndex].text;
  }

  // CUSTOMER-VIEW-INSIDE-MODAL
  displayCustomerNumber: any = '';
  getcustomerupdate(id) {
    this._mandateService.getcustomeredit(id).subscribe(test => {
      this.modela = test[0];
      this.editmodela = test[0];

      if (((this.assignedrm && this.assignedrm[0].leadstage != 'Fresh') || (this.assignedrm && this.assignedrm[0].leadstage == 'Fresh' && this.assignedrm[0].followupreason == 8)) || (this.roleid == '1' || this.roleid == '2')) {
        this.displayCustomerNumber = this.show_cnt && this.show_cnt.customer_number;
      } else {
        this.displayCustomerNumber = 'xxxxxxxxxx';
      }

      this.localityid = this.editmodela['localityid'];
      if (this.editmodela['customer_phase'] == null) {
        this.editmodela['customer_phase'] = 'Fresh lead';
      } else {
      }

      $('#proptypeselect').val(this.show_cnt['enquiry_proptype']);
      $('#sizeselect').val(this.show_cnt['enquiry_bhksize']);
      $('#budgetselect').val(this.show_cnt['enquiry_budget']);
      $('#possessionselect').val(this.show_cnt['enquiry_possession']);
      $('#priorityselect').val(this.show_cnt['lead_priority']);
      $('#customer_location').val(this.show_cnt['localityid']);
      $('#customer_address').val(this.show_cnt['address']);
    })
  }

  getsize() {
    this._mandateService.getbhk().subscribe(propsize => { this.propertysize = propsize; })
  }

  getstatus() {
    this._mandateService.leadstatus().subscribe(status => { this.leadstatus = status; })
  }

  getstages() {
    this.filterLoader = true;
    this.showRejectionForm = false;
    var userid = localStorage.getItem('UserId');
    if (this.selectedSuggestedProp) {
      this._mandateService
        .getactiveleadsstatus(this.id, userid, this.selectedExecId, this.selectedSuggestedProp.propid, this.feedbackId)
        .subscribe(stagestatus => {
          this.filterLoader = false;
          if (stagestatus.status == "True") {
            this.activestagestatus = stagestatus['activeleadsstatus'];
            this.currentstage = this.activestagestatus[0].stage;
            if (this.activestagestatus[0].stagestatus == "1" && this.activestagestatus[0].followupstatus == "0" || this.activestagestatus[0].stagestatus == "1" && this.activestagestatus[0].followupstatus == null) {
              this.currentstagestatus = "Fixed";
            } else if (this.activestagestatus[0].stagestatus == "2" && this.activestagestatus[0].followupstatus == "0" || this.activestagestatus[0].stagestatus == "2" && this.activestagestatus[0].followupstatus == null) {
              this.currentstagestatus = "Refixed";
            } else if (this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].followupstatus == "0" || this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].followupstatus == null) {
              this.currentstagestatus = "Done";
            } else if (this.activestagestatus[0].stagestatus == "1" && this.activestagestatus[0].followupstatus == "4") {
              this.currentstagestatus = "Fixed - Followup";
            } else if (this.activestagestatus[0].stagestatus == "2" && this.activestagestatus[0].followupstatus == "4") {
              this.currentstagestatus = "Refixed - Followup";
            } else if (this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].followupstatus == "4") {
              this.currentstagestatus = "Done - Followup";
            }

            if (this.activestagestatus[0].stage == "Lead Closed" || this.activestagestatus[0].stage == "Move to Junk") {
              this.USV = false;
              if (this.execview) {
                this.showRejectionForm = true;
              }
            } else if (this.activestagestatus[0].stage == "Deal Closed") {
              if (this.roleid != '50014' && this.roleid != '50013' && this.assignedrm && this.assignedrm[0].roleid != 50013 && this.assignedrm[0].roleid != 50014) {
                this.showRejectionForm = true;
                this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name);
              } else {
                this.USV = false;
                this.followup = true;
                this.RSV = false;
                this.Negotiation = false;
                this.leadclose = false;
                this.junkmove = true;
              }
            } else if (this.activestagestatus[0].stage == "Deal Closing Pending") {
              if (this.roleid != '50014' && this.roleid != '50013' && this.assignedrm && this.assignedrm[0].roleid != 50013 && this.assignedrm[0].roleid != 50014) {
                // this.showRejectionForm = true;
                // this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name);
                this.USV = false;
                this.followup = true;
                this.RSV = false;
                this.Negotiation = false;
                this.leadclose = true;
                this.junkmove = true;
              } else {
                this.USV = false;
                this.followup = true;
                this.RSV = false;
                this.Negotiation = false;
                this.leadclose = false;
                this.junkmove = true;
              }
            } else if (this.activestagestatus[0].stage == "Deal Closing Requested") {
              this.RSV = false;
              this.Negotiation = false;
              this.USV = false;
              if (this.userid == 1) {
                if (this.assignedrm && this.assignedrm[0].roleid != 50013 && this.assignedrm[0].roleid != 50014) {
                  this.showRejectionForm = true;
                  this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name)
                }
              } else {
                if (this.roleid != '50014' && this.roleid != '50013') {
                  this.showRejectionForm = true;
                  this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name)
                } else {
                  this.USV = false;
                  this.followup = true;
                  this.RSV = false;
                  this.Negotiation = false;
                  this.leadclose = false;
                  this.junkmove = true;
                }
              }
            } else if (this.activestagestatus[0].stage == "Closing Request Rejected") {
              this.RSV = false;
              this.Negotiation = false;
              this.USV = false;
              if (this.userid == 1) {
                if (this.assignedrm && this.assignedrm[0].roleid != 50013 && this.assignedrm[0].roleid != 50014) {
                  this.showRejectionForm = true;
                  this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name)
                }
              } else {
                if (this.roleid != '50014' && this.roleid != '50013') {
                  this.showRejectionForm = true;
                  this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name)
                } else {
                  this.USV = false;
                  this.followup = true;
                  this.RSV = false;
                  this.Negotiation = false;
                  this.leadclose = false;
                  this.junkmove = true;
                }
              }
            } else if (this.activestagestatus[0].stage == "Fresh" && this.activestagestatus[0].followupstatus == "4") {
              this.USV = true;
              this.SV = false;
              this.RSV = false;
              this.Negotiation = false;
              this.leadclose = false;
              this.followup = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "1" || this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "2" || this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "4") {
              this.followup = true;
              this.USV = true;
              this.RSV = false;
              this.Negotiation = false;
              this.leadclose = false;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "1") {
              this.USV = false;
              this.followup = true;
              this.RSV = true;
              this.Negotiation = true;
              this.leadclose = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "0") {
              this.followup = false;
              this.SV = false;
              this.RSV = false;
              this.Negotiation = false;
              this.leadclose = false;
              this.followup = true;
              this.junkmove = true;
              this.USV = true;
              this.usvform = true;
              // Loading this API again only for fetching the walkin date & time and write to the html view hidden visited date and time input boxes after the usvform in true condition
              this._mandateService
                .getassignedrm(this.id, this.userid, this.leadAssignedExecid, this.feedbackId)
                .subscribe(cust => {
                  // Adding First Visit date time to USV Submission Section
                  if (cust && cust.RMname && cust.RMname[0].walkintime) {
                    var date = cust.RMname[0].walkintime.split(' ')[0];
                    var time = cust.RMname[0].walkintime.split(' ').pop();
                    $('#USVvisiteddate').val(date);
                    $('#USVvisitedtime').val(time);
                  }
                  // Adding First Visit date time to USV Submission Section
                });
              $(document).ready(function () {
                $('#option-21').prop('checked', true);
              });
              // Loading this API again only for fetching the walkin date & time and write to the html view hidden visited date and time input boxes after the usvform in true condition

            } else if (this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "1" || this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "2" || this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "4") {
              this.USV = false;
              this.SV = false;
              this.Negotiation = false;
              this.leadclose = false;
              this.followup = true;
              this.RSV = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "1") {
              this.USV = false;
              this.RSV = true;
              this.Negotiation = true;
              this.leadclose = true;
              this.followup = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "0") {
              this.SV = false;
              this.USV = false;
              this.RSV = true;
              this.Negotiation = false;
              this.leadclose = false;
              this.usvform = false;
              this.followup = true;
              this.junkmove = true;
              this.rsvform = true;
              $(document).ready(function () {
                $('#option-23').prop('checked', true);
              });
            } else if (this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "1" || this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "2" || this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "4") {
              this.USV = false;
              this.SV = false;
              this.RSV = false;
              this.leadclose = false;
              // this.finalnegoform = true;
              this.Negotiation = true;
              this.followup = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "1") {
              this.USV = false;
              this.RSV = true;
              this.leadclose = true;
              this.Negotiation = true;
              this.followup = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "0") {
              this.SV = false;
              this.USV = false;
              this.RSV = false;
              this.leadclose = false;
              this.usvform = false;
              this.followup = true;
              this.junkmove = true;
              this.finalnegoform = true;
              this.Negotiation = true;
            } else if (this.activestagestatus[0].stage == "Junk") {
              if (this.roleid == 1 || this.roleid == '2') {
                this.USV = false;
                this.RSV = true;
                this.Negotiation = true;
                this.leadclose = true;
                this.followup = true;
                this.junkmove = true;
                this.leadMoveJunkExec = true;
              } else if (this.roleid != '1' && this.roleid != '2') {
                if (this.feedbackId == '0') {
                  this.followup = false;
                  this.junkmove = false;
                  this.USV = false;
                  this.RSV = false;
                  this.Negotiation = false;
                  this.leadclose = false;
                  this.leadMoveJunkExec = false;
                } else {
                  this.USV = false;
                  this.RSV = true;
                  this.Negotiation = true;
                  this.leadclose = true;
                  this.followup = true;
                  this.junkmove = true;
                }
              }
            } else {
              if (this.activestagestatus[0].stage == "Fresh" && this.activestagestatus[0].followupstatus == null) {
                this.showRejectionForm = false;
                this.followup = true;
                this.USV = true;
                this.SV = false;
                this.RSV = false;
                this.Negotiation = false;
                this.leadclose = false;
                this.junkmove = true;
              }
            }

            if (this.activestagestatus[0].stage == 'Fresh') {
              this.usvform = false;
            }

          } else if (stagestatus.status == "False") {
            this.currentstage = "Fresh";
            this.SV = false;
            this.RSV = false;
            this.Negotiation = false;
            this.leadclose = false;
          }
        });
    }
  }

  alternateNumbercheck(event) {
    if (event.target.value == this.show_cnt.customer_number) {
      this.editmodela.enquiry_altnumber = '';
      $('#enquiry_number').focus().css("border-color", "red").attr('placeholder', 'Please enter different contact number').val('');
    }
  }

  updateCustomer() {
    // primary name
    if ($('#customer_name').val() === '') {
      $('#customer_name').focus().css('border-color', 'red').attr('placeholder', 'Please Enter Name');
      return false;
    } else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#customer_name').val())) {
        $('#customer_name').removeAttr('style');
      } else {
        $('#customer_name').focus().css('border-color', 'red').attr('placeholder', 'Please enter valid name').val('');
        return false;
      }
    }

    //primary mail
    if ($('#customer_mail').val() != "") {
      let enameFilter = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (enameFilter.test($('#customer_mail').val())) {
        $('#customer_mail').removeAttr('style');
      } else {
        $('#customer_mail').focus().css('border-color', 'red').attr('placeholder', 'Please enter valid email').val('');
        return false;
      }
    }

    //alternate mail
    if ($('#enquiry_mail').val() != "") {
      let enameFilter = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (enameFilter.test($('#enquiry_mail').val())) {
        $('#enquiry_mail').removeAttr('style');
      } else {
        $('#enquiry_mail').focus().css('border-color', 'red').attr('placeholder', 'Please enter valid email').val('');
        return false;
      }
    }

    //alternate name
    if ($('#enquiry_name').val() != '') {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#enquiry_name').val())) {
        $('#enquiry_name').removeAttr('style');
      } else {
        // $('#enquiry_name').focus().css('border-color', 'red').attr('placeholder', 'Please enter valid name').val('');
        return false;
      }
    }

    //alternate number
    var mobileno = /^[0-9]{10}$/;
    if ($('#enquiry_number').val() != '') {
      if (mobileno.test($('#enquiry_number').val())) {
        $('#enquiry_number').removeAttr("style");
      }
      else {
        $('#enquiry_number').focus().css("border-color", "red").attr('placeholder', 'Please enter valid contact number').val('');
        return false;
      }
    }

    var primaryname = $('#customer_name').val();
    // var primarynumber = $('#customer_number').val();
    var primarymail = $('#customer_mail').val();
    var alternatename = $('#enquiry_name').val();
    var alternatenumber = $('#enquiry_number').val();
    var alternatemail = $('#enquiry_mail').val();
    var customerlocation = $('#customer_location').val();
    var customerproptype = $('#proptypeselect').val();
    var possession = $('#possessionselect').val();
    var priority = $('#priorityselect').val();
    var customersize = $('#sizeselect').val();
    var customerbudget = $('#budgetselect').val();
    var customeraddress = $('#customer_address').val();
    var propertyselect = $('#property_select').val();

    var param = {
      primaryname: primaryname,
      // primarynumber: primarynumber,
      primarymail: primarymail,
      name: alternatename,
      number: alternatenumber,
      mail: alternatemail,
      budget: customerbudget,
      location: customerlocation,
      proptype: customerproptype,
      size: customersize,
      property: propertyselect,
      address: customeraddress,
      leadid: this.id,
      priority: priority.toString(),
      possession: possession,
      execid: this.userid
    }
    this._sharedservice.datashortupdate(param).subscribe((success) => {
      this.status = success.status;
      this.resposeData = success;
      if (this.status == "True") {
        swal({
          title: 'Updated Successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.modalClose.nativeElement.click();
          this.ngOnInit();
          this.getlocalitylist();
        })
      }
    }, (err) => {
      console.log("Failed to Update");
    })
  }


  verifyrequest(leadid, propid, execid, propname) {
    this.closepropertyname = propname;
    var param = {
      leadid: leadid,
      propid: propid,
      execid: execid
    }
    this._mandateService.fetchrequestedvalues(param)
      .subscribe(requested => {
        this.requestedunits = requested['requestedvals'];
      });
  }

  uploadedData: any;
  uploadedImagesgetData(leadid, propid, execid, propname, index) {
    this.closepropertyname = propname;
    var param = {
      leadid: leadid,
      propid: propid,
      execid: execid
    }
    this._mandateService.fetchrequestedvalues(param)
      .subscribe(requested => {
        this.uploadedData = requested['requestedvals'];
      });
  }

  imageuploads(event, leadid, execid, propid) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      let allFilesValid = true;

      // First, validate all files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('jpg') || file.name.endsWith('jpeg') || file.name.endsWith('png') || file.name.endsWith('pdf')) {
          if (file.size > 1110000) {
            allFilesValid = false;
            swal({
              title: 'File Size Exceeded',
              text: 'File Size limit is 1MB',
              type: "error",
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              input.value = '';
              // this.closurefiles = [];
            });
            break;
          }
        } else {
          allFilesValid = false
          swal({
            title: 'Invalid File Format',
            text: 'The file format is not acceptable. Please upload a file in: JPG, JPEG, PNG, or PDF formats.',
            type: "error",
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            this.closurefiles = [];
          });
        }
      }

      // If all files are valid, process them
      if (allFilesValid) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = file.name;
          $('#customFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

          // Push the file to closurefiles and read the file
          this.closurefiles.push(file);
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.uploads.push(event.target.result);
          };
          this.uploadFile(leadid, execid, propid);
          reader.readAsDataURL(file);
        }
        // input.value = '';
        this.closurefiles = [];
      }
    }
    // let myFile = event.target.files;
    // for (let i = 0; i < myFile.length; i++) {
    //   if (myFile[i].size > 1110000) {
    //     swal({
    //       title: 'File Size Exceeded',
    //       text: 'File Size limit is 1MB',
    //       type: "error",
    //       timer: 2000,
    //       showConfirmButton: false
    //     }).then(() => {
    //     });
    //     return false;
    //   } else {
    //     const fileInput = event.target as HTMLInputElement;
    //     if (fileInput.files.length > 0) {
    //       for (let j = 0; j < event.target.files.length; j++) {
    //         if (!this.closurefiles.includes(event.target.files[j])) {
    //           this.closurefiles.push(event.target.files[j]);
    //           var reader = new FileReader();
    //           reader.onload = (event: any) => {
    //             this.uploads.push(event.target.result);
    //           };
    //           this.uploadFile(leadid, execid, propid)
    //         };
    //         reader.readAsDataURL(event.target.files[j]);
    //       }
    //     }
    //   }
    // }
  }

  uploadFile(leadid, execid, propid) {
    const formData = new FormData();
    formData.append('PropID', propid);
    formData.append('LeadID', leadid);
    formData.append('ExecID', this.userid);
    formData.append('assignID', execid);
    for (var k = 0; k < this.closurefiles.length; k++) {
      formData.append('file[]', this.closurefiles[k]);
    }
    this._mandateService.uploadFile(formData).subscribe((res) => {
      if (this.editNowClicked == true) {
        this.uploadedImagesgetData(leadid, propid, execid, '', '');
      } else {
        this.verifyrequest(leadid, propid, execid, '');
      }
    })
  }

  removeImage(event, leadid, execid, propid) {
    let myFile = event.file_name;
    //to remove from the ui
    this.requestedunits.forEach((data) => {
      data.images = data.images.filter((img) => !(img.file_name == myFile));
    })
    //to remove from the ui
    if (this.uploadedData) {
      this.uploadedData.forEach((data) => {
        data.images = data.images.filter((img) => !(img.file_name == myFile));
      })
    }
    //to remove drom the database
    this._mandateService.deleteImg(event.files_IDPK, event.file_name, event.lead_IDFK).subscribe((resp) => {
    })
  }

  requestapproval(leadid, execid, propid) {
    this.verifyrequest(leadid, propid, this.selectedExecId, this.selectedSuggestedProp.name);
    var param = {
      leadid: leadid,
      propid: propid,
      execid: this.userid,
      statusid: '1',
      remarks: "No Comments",
      assignid: this.selectedExecId
    }

    this._mandateService.closingrequestresponse(param)
      .subscribe(requestresponse => {
        if (requestresponse['status'] == 'True-0') {
          this.autoremarks = " Send the Deal Closing Request successfully.";
          var leadhistparam = {
            leadid: leadid,
            closedate: this.requestedunits[0].closed_date,
            closetime: this.requestedunits[0].closed_time,
            textarearemarks: "Deal closed Request Approved",
            leadstage: "Lead Closed",
            stagestatus: '0',
            userid: this.userid,
            assignid: this.selectedExecId,
            property: propid,
            autoremarks: this.autoremarks,
            feedbackid: this.feedbackId
          }
          this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this.filterLoader = false;
              swal({
                title: 'Request Approved Successfully',
                type: "success",
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
                this.showRejectionForm = false;
                $('.modal-backdrop').closest('div').remove();
                let currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              });
            } else if (this.status == "Duplicate Request") {
              swal({
                title: 'Already got the request for this same Unit number',
                type: "error",
                timer: 2000,
                showConfirmButton: false
              });
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        } else {
          swal({
            title: 'Some Error Occured',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        }
      });
  }

  enableButton() {
    if ($(".rejectedtextarea").val() == '') {
      this.enablebuttonApprove = true;
      this.enablebuttonReject = false;
    } else {
      this.enablebuttonReject = true;
      this.enablebuttonApprove = false;
    }

  }

  remarks: any;
  requestrejection(leadid, execid, propid) {
    if ($(".rejectedtextarea").val().trim() == "") {
      $(".rejectedtextarea").focus().css("border-color", "red").attr('placeholder', 'Please add the reason for rejection');
      return false;
    } else {
      $(".rejectedtextarea").removeAttr("style");
    }

    var remarkscontent = this.remarks;
    var param = {
      leadid: leadid,
      propid: propid,
      execid: this.userid,
      statusid: '2',
      remarks: remarkscontent,
      assignid: this.selectedExecId
    }
    this._mandateService.closingrequestresponse(param)
      .subscribe(requestresponse => {
        if (requestresponse['status'] == 'True-1') {
          swal({
            title: 'Request Rejected',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            $('.modal-backdrop').closest('div').remove();
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        } else {
          swal({
            title: 'Some Error Occured',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        }
      });
  }

  resubmitdata(leadid, execid, propid, type) {
    var bhk = $("#unit").val();
    var bhkunit = $("#unit_number").val();
    var dimension = $("#dimension").val();
    var ratepersqft = $("#rate_per_sqft").val();

    if ($("#unit").val() == "") {
      $("#unit").focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Size');
      return false;
    } else if ($("#unit_number").val() == "") {
      $("#unit_number").focus().css("border-color", "red").attr('placeholder', 'Please type the unit number');
      return false;
    } else if ($("#dimension").val() == "") {
      $("#dimension").focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');
      return false;
    } else if ($("#rate_per_sqft").val() == "") {
      $("#rate_per_sqft").focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
      return false;
    }

    var param = {
      leadid: leadid,
      propid: propid,
      execid: this.userid,
      bhk: bhk,
      bhkunit: bhkunit,
      dimension: dimension,
      ratepersqft: ratepersqft,
      assignid: this.selectedExecId
    }
    this._mandateService.requestresubmition(param)
      .subscribe(requestsubmition => {
        if (requestsubmition['status'] == 'True') {
          if (this.userid != '1') {
            this.getcustomerview()
          }
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
          // this.requestapproval(leadid, execid, propid);
        } else {
          swal({
            title: 'Some Error Occured',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        }
      });
  }

  actionChange(val) {
    if (val == "Follow Up") {
      $('#sectionselector').val('Follow Up');
      this.followform = true;
      this.followupform = true;
      this.followupformbtn = true;
      this.f2fform = false;
      this.usvform = false;
      this.svform = false;
      this.rsvform = false;
      this.finalnegoform = false;
      this.leadclosedform = false;
      this.junkform = false;
      this.junkformbtn = false;
      this.commonformbtn = false;
      $('#customer_phase4').val('Follow Up');
    } else if (val == "USV") {
      this.followform = false;
      this.followupform = false;
      this.followupformbtn = false;
      this.usvform = true;
      this.f2fform = false;
      this.svform = false;
      this.rsvform = false;
      this.finalnegoform = false;
      this.leadclosedform = false;
      this.junkform = false;
      this.junkformbtn = false;
      $('#customer_phase4').val('USV');
      $('#sectionselector').val('USV');
    } else if (val == "RSV") {
      this.followform = false;
      this.followupform = false;
      this.followupformbtn = false;
      this.rsvform = true;
      this.svform = false;
      this.usvform = false;
      this.f2fform = false;
      this.finalnegoform = false;
      this.leadclosedform = false;
      this.junkform = false;
      this.junkformbtn = false;
      $('#customer_phase4').val('RSV');
      $('#sectionselector').val('RSV');
    } else if (val == "Final Negotiation") {
      this.followform = false;
      this.followupform = false;
      this.followupformbtn = false;
      this.finalnegoform = true;
      this.rsvform = false;
      this.svform = false;
      this.usvform = false;
      this.f2fform = false;
      this.leadclosedform = false;
      this.junkform = false;
      this.junkformbtn = false;
      $('#customer_phase4').val('Final Negotiation');
      $('#sectionselector').val('Final Negotiation');
    } else if (val == "Lead Closed") {
      this.leadclosedform = true;
      this.followform = false;
      this.followupform = false;
      this.followupformbtn = false;
      this.finalnegoform = false;
      this.rsvform = false;
      this.svform = false;
      this.usvform = false;
      this.f2fform = false;
      this.junkform = false;
      this.junkformbtn = false;
      $('#customer_phase4').val('Lead Closed');
      $('#sectionselector').val('Lead Closed');
    } else if (val == "Move to Junk") {
      this.junkform = true;
      this.junkformbtn = true;
      this.f2fform = false;
      this.followform = false;
      this.followupform = false;
      this.followupformbtn = false;
      this.finalnegoform = false;
      this.rsvform = false;
      this.svform = false;
      this.usvform = false;
      this.f2fform = false;
      this.commonformbtn = false;
      this.leadclosedform = false;
      $('#customer_phase4').val('Move to Junk');
      $('#sectionselector').val('Move to Junk');
    } else {
      this.followupform = false;
      this.junkform = false;
      this.commonformbtn = true;
      this.followupformbtn = false;
      this.junkformbtn = false;
    }
  }

  triggerhistory() {
    if (this.selectedSuggestedProp && this.selectedSuggestedProp.actions != '7' && this.selectedSuggestedProp.actions != '8' && this.selectedSuggestedProp.actions != '6' && this.selectedSuggestedProp.currentstage != '5') {
      this.showRejectionForm = false;
    }
    // this.isAccompanyBy = false;
    let execId;
    if (this.logsType == 'executive') {
      execId = this.selectedExecId;
    } else {
      execId = '';
    }

    var param2 = {
      leadid: this.id,
      roleid: this.roleid,
      userid: this.userid,
      execid: execId,
      feedbackid: this.feedbackId,
    }
    this._mandateService
      .gethistory(param2)
      .subscribe(history => {
        if (history.status == 'True') {
          const uniquehistory = history['Leadhistory'].filter((val, i, self) => {
            return i == self.findIndex((t) => {
              return (t.autoremarks == val.autoremarks && t.Saveddate == val.Saveddate);
            })
          })
          this.leadtrack = uniquehistory;
        } else {
          this.leadtrack = [];
        }
      })
  }

  //  ASSIGN LEAD SECTION
  // getexecutives(event) {
  //   const id = event.target.options[event.target.options.selectedIndex].value;
  //   if (id == '50002') {
  //     this.rmleadassign = true;
  //     this.csleadassign = false;
  //   } else if (id == '50004') {
  //     this.rmleadassign = false;
  //     this.csleadassign = true;
  //   }
  //   this._mandateService.getexecutivesbasedid(id).subscribe(execute => { this.executives = execute; })
  // }

  moveToUsv() {
    this._mandateService.moveToUSV(this.id, this.selectedExecId).subscribe((data) => {
      $('.modal-backdrop').closest('div').remove();
      let currentUrl = this.router.url;
      let pathWithoutQueryParams = currentUrl.split('?')[0];
      let currentQueryparams = this.route.snapshot.queryParams;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
      });
    })
  }

  //assign leads code 
  assignmodalfetch(type, assigntype) {
    this.assigntype = assigntype;
    this.assignteam = type;
    if (type == 'mandate') {
      this.mandateprojectsfetch();
    }

    if (assigntype == 'visit-reassign') {
      this._mandateService.fetchmandateexecutuves(this.selectedSuggestedProp.propid, '', '50002', '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutives = executives['mandateexecutives'];
        } else {
          this.mandateExecutives = [];
        }
      });
    }
  }

  //get selected team type based on the selected assign team type
  getselectedteam(vals) {
    this.roleTeam = vals.value.value;
    this._mandateService.fetchmandateexecutuves(this.selectedMandatePropId, '', this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        setTimeout(() => {
          this.mandateExecutives = executives['mandateexecutives'];
        }, 0)
      } else {
        this.mandateExecutives = [];
      }
    });
    // if (this.assignteam == 'mandate') {
    //   this.selectedMandateTeam = vals.value;
    //   this.mandateprojectsfetch();
    // } else if (this.assignteam == 'retail') {
    //   let id = vals.value.value;
    //   if (id == '50010') {
    //   } else if (id == '50004') {
    //   } else {
    //     id = ''
    //   }
    //   this._retailservice.getRetailExecutives(id, '').subscribe(execute => {
    //     this.retailExecutives = execute['DashboardCounts'];
    //   })
    // }
  }

  //get mandate properties
  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateproperties = mandates['Properties'];

        if (this.assigntype == 'visit') {
          const selectedPropIds = this.fixedPropertiesList.map(p => p.propId);
          this.mandateproperties = this.mandateproperties.map(item => {
            return {
              ...item,
              isSelected: selectedPropIds.includes(item.property_idfk)
            };
          });
        } else {
          this.mandateproperties = this.mandateproperties.map(item => {
            return {
              ...item,
              isSelected: true
            };
          });
        }
      }
    });
  }

  filteredproject: any = '';
  //here we get the selected  mandate property
  getselectedprop(event) {
    this.selectedMandatePropId = event.target.value;
    if (this.mandateproperties) {
      let filteredproject = this.mandateproperties.filter((da) => da.property_idfk == event.target.value);
      if (filteredproject && filteredproject[0]) {
        this.filteredproject = filteredproject[0];
      }
    }

    if (this.assignteam == 'mandate' && this.assigntype == 'visit') {
      if (this.selectedMandatePropId) {
        let roleid;
        if (this.roleid == '50013' || this.roleid == '50014') {
          roleid = '50002'
        } else {
          roleid = this.roleTeam;
        }
        this._mandateService.fetchmandateexecutuves(this.selectedMandatePropId, '', roleid, '').subscribe(executives => {
          if (executives['status'] == 'True') {
            setTimeout(() => {
              this.mandateExecutives = executives['mandateexecutives'];
            }, 0)
          } else {
            this.mandateExecutives = [];
          }
        });
      } else {
        this.mandateExecutives = [];
      }
    } else {
      this._mandateService.fetchmandateexecutuves(this.selectedMandatePropId, '', this.roleTeam, '').subscribe(executives => {
        if (executives['status'] == 'True') {
          setTimeout(() => {
            this.mandateExecutives = executives['mandateexecutives'];
            if (this.selectedMandatePropId == this.selectedSuggestedProp.propid) {
              this.mandateExecutives = this.mandateExecutives.filter(executive => {
                return !this.leadsDetailsInfo.some(rmids => rmids.RMID == executive.id);
              });
            }
          }, 0)
        } else {
          this.mandateExecutives = [];
        }
      });
    }

  }

  executiveSelect(event) {
    this.selectedExecIds = [];
    // if (this.assignteam == 'mandate') {
    if (this.roleid == '50013' || this.roleid == '50014' || this.assigntype == 'visit') {
      this.selectedEXEC.push(event.value);
    };
    this.selectedExecIds = this.selectedEXEC.map((exec) => exec.id);
    // }
    //  else if (this.assignteam == 'retail') {
    //   this.selectedExecIds = this.selectedEXEC.map((exec) => exec.ExecId);
    // }
    this.selectedExecIds = Array.from(new Set(this.selectedExecIds));
  }

  selectedVisitExec: any;
  visitExecutiveSelect(event) {
    this.selectedVisitExec = event.value;
  }

  //here we are assigniing the lead to the rmid.
  assignLeadNow() {
    // if (this.assignteam == 'mandate') {
    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let comma_separated_data;
    if (this.selectedExecIds) {
      comma_separated_data = this.selectedExecIds.join(',');
    }

    if (comma_separated_data == '' || comma_separated_data == null) {
      swal({
        title: 'Please Select The Executive!',
        text: 'Please try again',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      });
      $('#rm_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Executives');
      return false;
    } else {
      this.filterLoader = true;
      $('#rm_dropdown').removeAttr("style");
    }

    let customersupport = comma_separated_data;
    let assignedleads = this.id;

    var param = {
      customersupport: comma_separated_data,
      assignedleads: this.id,
    }
    var propId = this.selectedMandatePropId;

    if (this.filteredproject && this.filteredproject.crm == '2') {
      this._mandateService.ranavleadassign(param, propId, '', this.userid, '').subscribe((success) => {
        this.filterLoader = false;
        this.status = success.status;
        if (this.status == "True") {
          swal({
            title: 'Assigned Successfully',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.assignedResponseInfo = success['details'];
            $('#assign_leads_detail').click();
          })
          $('#leadAssignClose').click();
          $('#rm_dropdown').dropdown('clear');
          $('#project_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          this.selectedExecIds = [];
          this.selectedEXEC = [];
          this.selectedMandatePropId = '';
          this.selectedMandateTeam = '';
          // this.getcustomerview();
          // $('.modal-backdrop').closest('div').remove();
          // document.body.classList.remove('modal-open');
          // let currentUrl = this.router.url.split('?')[0];
          // let currentQueryparams = this.route.snapshot.queryParams;
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //   this.router.navigate([currentUrl], { queryParams: currentQueryparams })
          // })
        } else {
          swal({
            title: 'Authentication Failed!',
            text: 'Please try again',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
        }
      }, (err) => {
        console.log("Connection Failed")
      });
    } else {
      this._mandateService.leadassign(param, propId, '', this.userid, '').subscribe((success) => {
        this.filterLoader = false;
        this.status = success.status;
        if (this.status == "True") {
          swal({
            title: 'Assigned Successfully',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.assignedResponseInfo = success['details'];
            $('#assign_leads_detail').click();
          })
          $('#leadAssignClose').click();
          $('#rm_dropdown').dropdown('clear');
          $('#project_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          this.selectedExecIds = [];
          this.selectedEXEC = [];
          this.selectedMandatePropId = '';
          this.selectedMandateTeam = '';
          // this.getcustomerview();
          // $('.modal-backdrop').closest('div').remove();
          // document.body.classList.remove('modal-open');
          // let currentUrl = this.router.url.split('?')[0];
          // let currentQueryparams = this.route.snapshot.queryParams;
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //   this.router.navigate([currentUrl], { queryParams: currentQueryparams })
          // })
        } else {
          swal({
            title: 'Authentication Failed!',
            text: 'Please try again',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
        }
      }, (err) => {
        console.log("Connection Failed")
      });
    }
    // } 
    // else if (this.assignteam == 'retail') {
    //   //here its a array of  lead ids converting it to a single value  as comma seperated.
    //   let comma_separated_data;
    //   if (this.selectedExecIds) {
    //     comma_separated_data = this.selectedExecIds.join(',');
    //   }

    //   if (comma_separated_data == '' || comma_separated_data == null) {
    //     swal({
    //       title: 'Please Select One Executive.',
    //       text: 'Please try again',
    //       type: 'error',
    //       timer: 2000,
    //       showConfirmButton: false
    //     })
    //     $('#rm_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Executives');
    //     return false;
    //   }
    //   else {
    //     this.filterLoader = true;
    //     $('#rm_dropdown').removeAttr("style");
    //   }
    //   var param = {
    //     customersupport: comma_separated_data,
    //     assignedleads: this.id,
    //   };

    //   this._retailservice.leadassign(param, '', this.userid, '').subscribe((success) => {
    //     this.status = success.status;
    //     this.filterLoader = false;
    //     if (this.status == "True") {
    //       swal({
    //         title: 'Assigned Successfully',
    //         type: 'success',
    //         timer: 2000,
    //         showConfirmButton: false
    //       })
    //       $('#leadAssignClose').click();
    //       $('#rm_dropdown').dropdown('clear');
    //       $('#exec_designation').dropdown('clear');
    //       this.selectedExecIds = [];
    //       this.selectedEXEC = [];
    //       this.getcustomerview();
    //       $('.modal-backdrop').closest('div').remove();
    //       document.body.classList.remove('modal-open');
    //       let currentUrl = this.router.url.split('?')[0];
    //       let currentQueryparams = this.route.snapshot.queryParams;
    //       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //         this.router.navigate([currentUrl], { queryParams: currentQueryparams })
    //       })
    //     } else {
    //       swal({
    //         title: 'Authentication Failed!',
    //         text: 'Please try again',
    //         type: 'error',
    //         timer: 2000,
    //         showConfirmButton: false
    //       })
    //     }
    //   }, (err) => {
    //     console.log("Connection Failed")
    //   });
    // }
  }

  VisitReassignLeadNow() {

    if (this.selectedVisitExec == '' || this.selectedVisitExec == null) {
      swal({
        title: 'Please Select The Executive!',
        text: 'Please try again',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      });
      $('#rm_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Executives');
      return false;
    } else {
      this.filterLoader = true;
      $('#rm_dropdown').removeAttr("style");
    }

    var param = {
      rmid: this.selectedVisitExec.id,
      assignedleads: this.id,
      propid: this.selectedSuggestedProp.propid,
      loginid: this.userid,
      fromexecid: this.selectedExecId,
      stage: this.assignedrm[0].leadstage
    }

    this._mandateService.visitReassignMandate(param).subscribe((success) => {
      this.filterLoader = false;
      this.status = success.status;
      if (this.status == "True") {
        $('#leadAssignClose').click();
        $('#rm_dropdown').dropdown('clear');
        $('#project_dropdown').dropdown('clear');
        $('#property_dropdown').dropdown('clear');
        this.selectedMandateTeam = '';
        this.selectedVisitExec = '';
        swal({
          title: 'Visit Re-assigned Successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          // this.assignedResponseInfo = success['details'];
          // $('#assign_leads_detail').click();
          this.assignleadModalClose();
        })
      }
      else if (this.status == 'False' && success.result == '2') {
        $('#leadAssignClose').click();
        $('#rm_dropdown').dropdown('clear');
        $('#project_dropdown').dropdown('clear');
        $('#property_dropdown').dropdown('clear');
        this.selectedMandateTeam = '';
        this.selectedVisitExec = '';
        swal({
          title: 'Visit Re-assign Unsuccessfull',
          text: 'The lead can be assigned only if its in overdue.',
          type: 'error',
          // timer: 2000,
          showConfirmButton: true,
        }).then(() => {
          $('.modal-backdrop').closest('div').remove();
          document.body.classList.remove('modal-open');
          let currentUrl = this.router.url.split('?')[0];
          let currentQueryParams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl], { queryParams: currentQueryParams })
          })
        })
      }
      else {
        swal({
          title: 'Authentication Failed!',
          text: 'Please try again',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    });

  }

  //here on clicking the assign modal close im reseting the team dropdown to retail by default.
  assignleadModalClose() {
    if (this.assignedrm == undefined) {
      $('.modal-backdrop').closest('div').remove();
      // this.router.navigate(['/mandate-customers/' + this.id + '/' + this.userid + '/' + '0' + '/' + 'mandate'])
      if (this.selectedSuggestedProp && this.selectedSuggestedProp.propid) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/mandate-customers/' + this.id + '/' + this.userid + '/' + '0' + '/' + 'mandate' + '/' + this.selectedSuggestedProp.propid]);
        });
      } else {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/mandate-customers/' + this.id + '/' + this.userid + '/' + '0' + '/' + 'mandate']);
        });
      }
    } else {
      $('.modal-backdrop').closest('div').remove();
      let currentUrl = this.router.url;
      let pathWithoutQueryParams = currentUrl.split('?')[0];
      let currentQueryparams = this.route.snapshot.queryParams;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
      });
    }
  }

  //here admin or cs executives we assign the lead to RM's.
  visitConvert() {
    let comma_separated_data;
    if (this.selectedExecIds) {
      comma_separated_data = this.selectedExecIds.join(', ');
    }

    if ((this.selectedMandatePropId == '' || this.selectedMandatePropId == null || this.selectedMandatePropId == undefined) && this.assignteam == 'mandate') {
      swal({
        title: 'Please Select the Property.',
        text: 'Please try again',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      $('#property_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Property');
      return false;
    } else {
      $('#property_dropdown').removeAttr("style");
    }

    if (comma_separated_data == '' || comma_separated_data == null || comma_separated_data == undefined) {
      swal({
        title: 'Please Select the Executive.',
        text: 'Please try again',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      $('#rm_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Executives');
      return false;
    } else {
      $('#rm_dropdown').removeAttr("style");
    }

    let dbclinet: string = '';
    if (this.assigntype == 'visit' && this.assignteam == 'mandate') {
      if (this.selectedMandatePropId == '28773') {
        dbclinet = '1';
      }
    }

    let crmtype;
    crmtype = '1';
    // if (this.assignteam == 'mandate') {
    // }
    //  else if (this.assignteam == 'retail') {
    //   crmtype = '2';
    // }

    let param = {
      leadid: this.id,
      propid: this.selectedMandatePropId,
      fromexecutives: this.selectedExecId,
      toexecutives: comma_separated_data,
      loginid: this.userid,
      crmtype: crmtype,
      dbclinet: dbclinet
    };

    this.filterLoader = true;
    if (this.assignteam == 'mandate') {
      this._mandateService.visitAssign(param).subscribe((resp) => {
        this.filterLoader = false;
        if (resp.status == "True") {
          swal({
            title: 'Visit Assigned Successfully',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          $('#leadAssignClose').click();
          $('#rm_dropdown').dropdown('clear');
          $('#fixedprop_dropdown').dropdown('clear');
          $('#project_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          this.selectedExecIds = [];
          this.selectedEXEC = [];
          this.selectedMandatePropId = '';
          this.selectedMandateTeam = '';
          $('.modal-backdrop').closest('div').remove();
          document.body.classList.remove('modal-open');
          let currentUrl = this.router.url.split('?')[0];
          let currentQueryParams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl], { queryParams: currentQueryParams })
          })
        } else {
          swal({
            title: 'Authentication Failed!',
            text: 'Please try again',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
        }
      }, (err) => {
        console.log("Connection Failed")
      })
    }
  }

  getselectedVisitprop(event) {
    this.selectedMandatePropId = event.value.property_idfk;
  }

  //here we self assign the to Cs account
  visitSelfAssignToCS() {
    if ((this.selectedMandatePropId == '' || this.selectedMandatePropId == null || this.selectedMandatePropId == undefined) && this.assignteam == 'mandate') {
      swal({
        title: 'Please Select the Property.',
        text: 'Please try again',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      $('#property_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Property');
      return false;
    } else {
      $('#property_dropdown').removeAttr("style");
    }

    let param = {
      leadid: this.id,
      propid: this.selectedMandatePropId,
      execid: this.userid
    };

    this.filterLoader = true;
    this._mandateService.visitSelfAssign(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == "True") {
        swal({
          title: 'Visit Assigned Successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        $('#leadvisitAssignClose').click();
        this.selectedExecIds = [];
        this.selectedEXEC = [];
        this.selectedMandatePropId = '';
        this.selectedMandateTeam = '';
        setTimeout(() => {
          $('.modal-backdrop').closest('div').remove();
          document.body.classList.remove('modal-open');
          let currentUrl = this.router.url.split('?')[0];
          let currentQueryParams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl], { queryParams: currentQueryParams })
          })
        }, 0)
      } else {
        swal({
          title: 'Authentication Failed!',
          text: 'Please try again',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    })
  }

  //here we can revert to the previous stage from junk
  revertStage() {
    swal({
      title: `Do you want to Revert the lead for ${this.assignedrm[0].customer_assign_name}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value == true) {
        let param = {
          leadid: this.id,
          propid: this.selectedSuggestedProp.propid,
          executid: this.selectedExecId
        }
        this._mandateService.revertBackToPreStage(param).subscribe((resposne) => {
          if (resposne.status == 'True') {
            this.filterLoader = true;
            $('.modal-backdrop').closest('div').remove();
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
            });
          }
        })
      }
    });
  }

  editNow(leadId, execid, propid, closeid) {
    if ($("#unit").val() == "") {
      swal({
        title: 'Units Not Selected',
        text: 'Select any Unit for ',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    } else if ($("#unit_number").val().trim() == "") {
      $("#unit_number").val('')
      $("#unit_number").focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Number');
      return false;
    } else if ($("#dimension").val().trim() == "" || !/^[0-9]+$/.test($("#dimension").val())) {
      $("#dimension").val('');
      $("#dimension").focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');
      return false;
    } else if ($("#rate_per_sqft").val().trim() == "" || !/^[0-9]+$/.test($("#rate_per_sqft").val())) {
      $("#rate_per_sqft").val('');
      $("#rate_per_sqft").focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
      return false;
    } else if ($("#customFile").val() == "") {
      swal({
        title: 'No Files Uploaded',
        text: 'Upload atleast one file for ',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    }
    else {
      $("#unit_number").removeAttr("style");
      $("#dimension").removeAttr("style");
      $("#rate_per_sqft").removeAttr("style");
      this.filterLoader = true;
      var unitsselected = $("#unit").val();
      var unitnumbers = $("#unit_number").val();
      var dimensions = $("#dimension").val();
      var rpsft = $("#rate_per_sqft").val();
      this.filterLoader = true;
      var closedate = this.requestedunits[0].closed_date;
      var closetime = this.requestedunits[0].closed_time;
      var textarearemarks = this.requestedunits[0].suggested[0].remarks;
      this.autoremarks = "The Deal Closed has been edited successfully.";
      var leadhistparam = {
        leadid: this.id,
        closedate: closedate,
        closetime: closetime,
        leadstage: "Edit Closed Lead",
        stagestatus: '0',
        textarearemarks: textarearemarks,
        userid: this.userid,
        assignid: this.selectedExecId,
        property: propid,
        bhk: unitsselected,
        bhkunit: unitnumbers,
        dimension: dimensions,
        ratepersft: rpsft,
        autoremarks: this.autoremarks,
        closedleadID: closeid,
        feedbackid: this.feedbackId
      }

      this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this.filterLoader = false;
          swal({
            title: 'Deal Closed Successfully',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        } else if (this.status == "Duplicate Request") {
          this.filterLoader = false;
          swal({
            title: 'Already got the request for this same Unit number',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      });
    }
  }

  //FIXED PLAN CODE
  selectedplan(plantype) {
    this.selectedPlanType = plantype;
    setTimeout(() => {
      this.scriptfunctions();
    }, 0)
    if (this.selectedPlanType == 'weekend' || this.selectedPlanType == 'weekdays') {
      if (this.assignedrm && this.assignedrm[0].leadstage == "USV") {
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
        // },0);
      } else if (this.assignedrm && this.assignedrm[0].leadstage == "RSV" && this.assignedrm[0].suggestedprop) {
        // setTimeout(()=>{
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
        // },0);
      } else if (this.assignedrm && this.assignedrm[0].leadstage == "Final Negotiation" && this.assignedrm[0].suggestedprop) {
        // setTimeout(()=>{
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
        // },0);
      }
    }
    // $('#visitPlandate').val('');
    // $('#visitPlantime').val('');
    setTimeout(() => {
      this.checkWeekDay();
    }, 0)
  }

  checkstage() {
    if (this.assignedrm && this.assignedrm[0].leadstage == 'Fresh' && this.assignedrm[0].followupreason == '8') {
      swal({
        title: 'Please Fix the USV..!',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
    }
    if (this.selectedPlanType == 'weekend' || this.selectedPlanType == 'weekdays') {
      let listofProperties: any = [];
      if (this.assignedrm && this.assignedrm[0].leadstage == "USV" && this.assignedrm[0].suggestedprop) {
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
      } else if (this.assignedrm && this.assignedrm[0].leadstage == "RSV" && this.assignedrm[0].suggestedprop) {
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
      } else if (this.assignedrm && this.assignedrm[0].leadstage == "Final Negotiation" && this.assignedrm[0].suggestedprop) {
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
      }
    }
    this.checkWeekDay();
    setTimeout(() => {
      this.scriptfunctions();
    }, 0)
  }

  ngAfterViewChecked() {
    if (!this.isCountdownInitialized) {
      this.isCountdownInitialized = true;
      this.scriptfunctions();
    }
  }

  scriptfunctions() {
    // Initialize the calendar for visitedcalendardate
    let disabledType: any;
    if (this.selectedPlanType == 'weekend' || this.selectedPlanType == '') {
      disabledType = [1, 2, 3, 4, 5];
    } else if (this.selectedPlanType == 'weekdays') {
      disabledType = [0, 6];
    }

    $('#disableddaysofweek_calendar')
      .calendar({
        type: 'date',
        minDate: new Date(),
        formatter: {
          date: 'YYYY-MM-DD'
        },
        disabledDaysOfWeek: disabledType
      });

    // Initialize the time picker for calendartime
    var minDate = new Date();
    var maxDate = new Date();
    minDate.setHours(7);
    maxDate.setHours(20);

    $('.calendartime').calendar({
      type: 'time',
      disableMinute: true,
      minDate: minDate,
      maxDate: maxDate,
    });
  }

  editvisitPlan(type) {
    if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == '2') {
      this.selectedPlanType = 'weekend';
      setTimeout(() => {
        $('#visitPlandate').val(this.selectedSuggestedProp.actiondate);
        $('#visitPlantime').val(this.selectedSuggestedProp.actiontime);
      }, 100)
    } else if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == '1') {
      this.selectedPlanType = 'weekdays';
      setTimeout(() => {
        $('#visitPlandate').val(this.selectedSuggestedProp.actiondate);
        $('#visitPlantime').val(this.selectedSuggestedProp.actiontime);
      }, 100)
    } else if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == '0') {
      this.selectedPlanType = 'ytc';
    } else if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == null) {
      if (type == 'edit') {
        setTimeout(() => {
          $('#visitPlandate').val(this.selectedSuggestedProp.nextdate);
          $('#visitPlantime').val(this.selectedSuggestedProp.nexttime);
          this.scriptfunctions();
        }, 100)
      }
    }
    setTimeout(() => {
      this.scriptfunctions();
    }, 0)
    this.editplan = true;
  }

  confirmbtnClicked: boolean = false;
  confirmPlan() {
    this.confirmbtnClicked = true;
    setTimeout(() => {
      this.fixPlan();
    }, 0);
  }

  fixPlan() {
    if (this.selectedPlanType == "" || this.selectedPlanType == undefined || this.selectedPlanType == null) {
      swal({
        title: 'Please select the Visit Type',
        text: "Select the Visit Type",
        type: 'error',
        timer: 2000,
        showConfirmButton: true,
      })
      return false;
    }

    var nextdate;
    var nexttime;
    if (this.confirmbtnClicked == false) {
      if ($('#visitPlandate').val() == "") {
        $('#visitPlandate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      } else {
        // $('#visitPlandate').removeAttr("style");
        let date = new Date($('#visitPlandate').val());
        let day = date.getDay();
        let isWeekend = (day === 6 || day === 0);
        if (isWeekend) {
          if (this.selectedPlanType == 'weekend') {
            $('#visitPlandate').removeAttr("style");
          } else {
            swal({
              title: 'Please select the correct weekdays date',
              text: "Select the correct date",
              type: 'error',
              timer: 2000,
              showConfirmButton: false,
            })
            return false;
          }
        } else {
          if (this.selectedPlanType == 'weekdays') {
            $('#visitPlandate').removeAttr("style");
          } else {
            swal({
              title: 'Please select the correct weekend date',
              text: "Select the correct date",
              type: 'error',
              timer: 2000,
              showConfirmButton: false,
            })
            return false;
          }
        }
      }

      if ($('#visitPlantime').val() == "") {
        $('#visitPlantime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      } else {
        $('#visitPlantime').removeAttr("style");
      }
      var nextdate = $('#visitPlandate').val();
      var nexttime = $('#visitPlantime').val();
    } else {
      var nextdate = this.visitPlanNextDate;
      var nexttime = this.visitPlanNextTime;
    }
    let selectPlanid: any;
    if (this.selectedPlanType == 'weekend') {
      selectPlanid = 2
    } else if (this.selectedPlanType == 'weekdays') {
      selectPlanid = 1
    } else if (this.selectedPlanType == 'ytc') {
      selectPlanid = 0
    }
    this.filterLoader = true;
    if (this.activestagestatus[0].stage == 'USV') {

      var param = {
        leadid: this.id,
        nextdate: nextdate,
        nexttime: nexttime,
        suggestproperties: this.selectedSuggestedProp.propid,
        execid: this.userid,
        assignid: this.selectedExecId
      }
      this._mandateService.addselectedsuggestedproperties(param).subscribe((success) => {
        this.status = success.status;
        this._mandateService.getselectedsuggestproperties(this.id, this.userid, this.selectedExecId).subscribe(selectsuggested => {
          this.selectedpropertylists = selectsuggested['selectedlists'];
          this.selectedlists = selectsuggested;
          // Joining the object values as comma seperated when add the property for the history storing
          this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
          // Joining the object values as comma seperated when add the property for the history storing

          this.autoremarks = "Scheduled the USV for " + this.selectedproperty_commaseperated + " On " + nextdate + " " + nexttime;
          var leadusvhistparam = {
            leadid: this.id,
            closedate: nextdate,
            closetime: nexttime,
            leadstage: "USV",
            stagestatus: '1',
            textarearemarks: '',
            userid: this.userid,
            assignid: this.selectedExecId,
            autoremarks: this.autoremarks,
            property: this.selectedSuggestedProp.propid,
            feedbackid: this.feedbackId
          }
          this._mandateService.addleadhistory(leadusvhistparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              let params = {
                execid: this.selectedExecId,
                leadid: this.id,
                planid: selectPlanid,
                plandate: nextdate,
                plantime: nexttime,
                stage: this.assignedrm[0].leadstage,
                stagestatus: this.assignedrm[0].leadstatus,
                loginid: this.userid,
                propid: this.selectedSuggestedProp.propid
              }
              this._mandateService.updatemyplan(params).subscribe((response) => {
                this.filterLoader = false;
                if (response.status == 'True') {
                  swal({
                    title: 'Plan Confirmed',
                    text: 'Visit Plan added Successfully',
                    type: 'success',
                    timer: 2000,
                    showConfirmButton: false
                  }).then(() => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  });
                }
              })
            } else if (this.status == "False" && success.data) {
              this.filterLoader = false;
              swal({
                title: `USV already fixed by ${success.data[0].name}`,
                text: `Please Contact Admin to assign this visit`,
                type: "error",
                showConfirmButton: true
              }).then(() => {
                let currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              });
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        });
      });
    } else if (this.activestagestatus[0].stage == 'RSV') {
      var param1 = {
        leadid: this.id,
        nextdate: nextdate,
        nexttime: nexttime,
        suggestproperties: this.selectedSuggestedProp.propid,
        execid: this.userid,
        assignid: this.selectedExecId,
      }
      this._mandateService.addrsvselected(param1).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          var param = {
            leadid: this.id,
            execid: this.userid,
            stage: "RSV",
            assignid: this.selectedExecId,
          }
          this._mandateService.rsvselectproperties(param).subscribe(selectsuggested => {
            this.selectedpropertylists = selectsuggested['selectedrsvlists'];
            // Joining the object values as comma seperated when remove the property for the history storing
            this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
            // Joining the object values as comma seperated when remove the property for the history storing

            this.autoremarks = " Scheduled the RSV for " + this.selectedproperty_commaseperated + " On " + nextdate + " " + nexttime;
            var leadrsvfixparam = {
              leadid: this.id,
              closedate: nextdate,
              closetime: nexttime,
              leadstage: "RSV",
              stagestatus: '1',
              textarearemarks: '',
              userid: this.userid,
              assignid: this.selectedExecId,
              autoremarks: this.autoremarks,
              property: this.selectedSuggestedProp.propid,
              feedbackid: this.feedbackId
            }
            this._mandateService.addleadhistory(leadrsvfixparam).subscribe((success) => {
              this.status = success.status;
              if (this.status == "True") {
                let params = {
                  execid: this.selectedExecId,
                  leadid: this.id,
                  planid: selectPlanid,
                  plandate: nextdate,
                  plantime: nexttime,
                  stage: this.assignedrm[0].leadstage,
                  stagestatus: this.assignedrm[0].leadstatus,
                  loginid: this.userid,
                  propid: this.selectedSuggestedProp.propid
                }
                this._mandateService.updatemyplan(params).subscribe((response) => {
                  this.filterLoader = false;
                  if (response.status == 'True') {
                    swal({
                      title: 'Plan Confirmed',
                      text: 'Visit Plan added Successfully',
                      type: 'success',
                      timer: 2000,
                      showConfirmButton: false
                    }).then(() => {
                      let currentUrl = this.router.url;
                      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                        this.router.navigate([currentUrl]);
                      });
                    });
                  }
                })
              } else if (this.status == "False" && success.data) {
                this.filterLoader = false;
                swal({
                  title: `RSV already fixed by ${success.data[0].name}`,
                  text: `Please Contact Admin to assign this visit`,
                  type: "error",
                  showConfirmButton: true
                }).then(() => {
                  let currentUrl = this.router.url;
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate([currentUrl]);
                  });
                });
              }
            }, (err) => {
              console.log("Failed to Update");
            });
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })

    } else if (this.activestagestatus[0].stage == 'Final Negotiation') {
      var param3 = {
        leadid: this.id,
        nextdate: nextdate,
        nexttime: nexttime,
        suggestproperties: this.selectedSuggestedProp.propid,
        execid: this.userid,
        assignid: this.selectedExecId
      }
      this._mandateService.addnegoselected(param3).subscribe((success) => {
        this.status = success.status;
        this._mandateService.negoselectproperties(this.id, this.userid, this.selectedExecId, this.feedbackId).subscribe(selectsuggested => {
          this.selectedpropertylists = selectsuggested['selectednegolists'];
          this.selectedlists = selectsuggested;
          // Joining the object values as comma seperated when add the property for the history storing
          this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
          // Joining the object values as comma seperated when add the property for the history storing

          this.autoremarks = "Scheduled the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + nextdate + " " + nexttime;
          var leadnegofixparam = {
            leadid: this.id,
            closedate: nextdate,
            closetime: nexttime,
            leadstage: "Final Negotiation",
            stagestatus: '1',
            textarearemarks: '',
            userid: this.userid,
            assignid: this.selectedExecId,
            autoremarks: this.autoremarks,
            property: this.selectedSuggestedProp.propid,
            feedbackid: this.feedbackId
          }
          this._mandateService.addleadhistory(leadnegofixparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              let params = {
                execid: this.selectedExecId,
                leadid: this.id,
                planid: selectPlanid,
                plandate: nextdate,
                plantime: nexttime,
                stage: this.assignedrm[0].leadstage,
                stagestatus: this.assignedrm[0].leadstatus,
                loginid: this.userid,
                propid: this.selectedSuggestedProp.propid
              }
              this._mandateService.updatemyplan(params).subscribe((response) => {
                this.filterLoader = false;
                if (response.status == 'True') {
                  swal({
                    title: 'Plan Confirmed',
                    text: 'Visit Plan added Successfully',
                    type: 'success',
                    timer: 2000,
                    showConfirmButton: false
                  }).then(() => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  });
                }
              })
            } else if (this.status == "False" && success.data) {
              this.filterLoader = false;
              swal({
                title: `Final Negotiation already fixed by ${success.data[0].name}`,
                text: `Please Contact Admin to assign this visit`,
                type: "error",
                showConfirmButton: true
              }).then(() => {
                let currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              });
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        });
      }, (err) => {
        console.log("Failed to Update");
      })

    }
  }

  clearPlandata() {
    $('#visitPlandate').val('');
    $('#visitPlantime').val('');
    this.selectedPlanType = '';
  }

  checkWeekDay() {
    let date;
    if ($('#visitPlandate').val() == '' || $('#visitPlandate').val() == null || $('#visitPlandate').val() == undefined) {
      date = new Date(this.selectedSuggestedProp.actiondate)
    } else {
      date = new Date($('#visitPlandate').val());
    }

    let day = date.getDay();
    let isWeekend = (day === 6 || day === 0);
    if (isWeekend) {
      if (this.selectedPlanType == 'weekend') {
        if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == '2') {
          this.visitPlanDone = true;
        } else {
          this.visitPlanDone = false;
        }
        // this.visitPlanDone = false;
      } else {
        // this.visitPlanDone = true
        if (this.selectedPlanType == 'weekend') {
          this.visitPlanDone = false;
        }
        else {
          this.visitPlanDone = true;
        }
      }
    } else {
      if (this.selectedPlanType == 'weekdays') {
        if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == '1') {
          this.visitPlanDone = true;
        } else {
          this.visitPlanDone = false;
        }
        // this.visitPlanDone = false;
      } else {
        if (this.selectedPlanType == 'weekdays') {
          this.visitPlanDone = false;
        }
        else {
          this.visitPlanDone = true;
        }
        // this.visitPlanDone = true
      }
    }
  }

  //merge leads code.
  searchByName() {
    let userid
    if (localStorage.getItem('UserId') == '1') {
      userid = '';
    } else {
      userid = localStorage.getItem('UserId');
    }
    if (this.search_name.length >= 3) {
      this._sharedservice.search(this.search_name, '', '', 1, '').subscribe(
        (resp) => {
          this.clients = resp;
          if (resp == undefined) {
            this.clients = [];
          }
        })
    }
  }

  selectedMergeLead(lead) {
    this.selectedLead = lead;
    if (this.selectedLead != '' && this.selectedLead != undefined && this.selectedLead != null) {
      this.isSelectedLead = true;
      this.clients = [];
      this.search_name = '';
    }

    if (this.selectedLead) {
      let data = {
        name: this.selectedLead.customer_name,
        id: this.selectedLead.customer_IDPK,
      }
      this.primaryLeads.push(data);
    }
  }

  relationship(relation) {
    this.selectedRelation = relation;
  }

  primaryLeadSelection(leadid) {
    this.selectedPrimaryLead = leadid;
  }

  mergeLeads() {
    if (this.selectedRelation == '' || this.selectedRelation == undefined || this.selectedRelation == null) {
      swal({
        title: "Relation",
        text: 'Please select the Relationship',
        timer: 2000,
        showConfirmButton: false,
        type: 'error'
      })
      $('#relationship_dropdown').focus().css('border-color', 'red').attr('placeholder', 'Please Select the Relation')
      return false
    }

    if (this.selectedPrimaryLead == '' || this.selectedPrimaryLead == undefined || this.selectedPrimaryLead == null) {
      swal({
        title: "Primary Lead",
        text: 'Please select the Primary Lead',
        timer: 2000,
        showConfirmButton: false,
        type: 'error'
      })
      $('#primary_dropdown').focus().css('border-color', 'red').attr('placeholder', 'Please Select the Relation')
      return false
    }

    let param = {
      leadId: this.id,
      mergeLeadId: this.selectedLead.customer_IDPK,
      relation: this.selectedRelation,
      primaryid: this.selectedPrimaryLead
    };
    this._sharedservice.postMergeLeads(param).subscribe((resp) => {
      swal({
        title: 'Merge Lead',
        text: 'The Lead has been successfully Merged',
        showConfirmButton: false,
        timer: 2000,
        type: 'success'
      }).then(() => {
        $('.modal-backdrop').closest('div').remove();
        document.body.classList.remove('modal-open');
        let currentUrl = this.router.url;
        let pathWithoutQueryParams = currentUrl.split('?')[0];
        let currentQueryparams = this.route.snapshot.queryParams;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
        })
      })
    })
  }

  //  ASSIGN LEAD SECTION
  fetchmails(name, propid) {
    this.filterLoader = true;
    this.propertyid = propid;
    this._retailservice
      .getfetchmail(propid)
      .subscribe(mails => {
        this.filterLoader = false;
        this.mails = mails;
        this.buildernamereg = this.mails[0]['builderInfo_name'];
      });
    this.property = name;
  }

  fetchregistereddata(leadid, propid) {
    var param = {
      leadid: leadid,
      propid: propid
    }
    this._retailservice
      .fetchclientregistereddata(param)
      .subscribe(regdata => {
        this.clientregistereddata = regdata['registereddata'][0];
      })
  }

  clientregisteration() {
    if ($('#mailtoselect').val() == "") {
      $('.sendto').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      $('.sendto').removeAttr("style");
    }

    this.toselect = $('#mailtoselect').val();
    let mails = this.selectedCCMail.map((cc) => cc.builder_mail);
    if (this.selectedCCMail.length == 0) {
      this.ccselect = this.toselect;
    } else {
      this.ccselect = mails.join(',');
    }
    this.registrationremarks = $('#regremarks').val();
    this.filterLoader = true;
    var param = {
      leadid: this.id,
      propid: this.propertyid,
      customer: this.regname,
      customernum: this.regnumber,
      customermail: this.regmail,
      rmname: localStorage.getItem('Name'),
      rmid: localStorage.getItem('UserId'),
      rmmail: localStorage.getItem('Mail'),
      assignid: this.selectedExecId,
      builder: this.buildernamereg,
      property: this.property,
      sendto: this.toselect,
      sendcc: this.ccselect,
      remarks: this.registrationremarks
    }
    this._retailservice.clientregistration(param).subscribe((success) => {

      var status = success.status;
      var data = success.success;

      if (status == "1") {

        this.filterLoader = false;
        swal({
          title: "Mail Sent Successfully!",
          text: 'This Data registered on 30 Days before so Re-registered Successfully',
          icon: "success",
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          $('#mailtoselect').val("");
          $('#ccselect').val("");
          $('#regremarks').val("");
          document.body.classList.remove('modal-open');
          document.body.classList.remove('dimmable');
          $('#mailtoselect').dropdown('clear');
          $('#ccselect').dropdown('clear');
          $('.modal-backdrop').removeClass('fade');
          $('.modal-backdrop').removeClass('show');
          $('.modal-backdrop').removeClass('modal-backdrop');
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        });

      } else if (status == "0") {

        this.filterLoader = false;
        swal({
          title: "Mail Sent Successfully!",
          text: 'Registered Successfully',
          icon: "success",
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          $('#mailtoselect').val("");
          $('#ccselect').val("");
          $('#regremarks').val("");
          document.body.classList.remove('modal-open');
          document.body.classList.remove('dimmable');
          $('#mailtoselect').dropdown('clear');
          $('#ccselect').dropdown('clear');
          $('.modal-backdrop').removeClass('fade');
          $('.modal-backdrop').removeClass('show');
          $('.modal-backdrop').removeClass('modal-backdrop');
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        });

      } else {

        this.filterLoader = false;
        swal({
          title: 'Already Registered Data Found.!',
          text: data[0].registered_property + ' is registered by ' + data[0].registered_RM + ' on ' + data[0].registered_date + '. Please Unselect this Property If it is a group Submission.',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })

      }
    }, (err) => {
      console.log("Failed to Update");
    });
  }

  //register Now Process
  isDateOver30Days(dateString: string): boolean {
    // Parse the date string into a Date object
    const dateObject = new Date(dateString);

    // Get today's date and subtract 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Compare the parsed date with the 30-day threshold using getTime()
    return dateObject.getTime() < thirtyDaysAgo.getTime();
  }

  isShared: boolean = false;
  sharePropertyDetails() {
    this.isShared = true;
    swal({
      title: 'Property Details',
      text: 'Property Details has been shared Successfully',
      type: 'success',
      showConfirmButton: false,
      timer: 2000
    })
  }

  // accessNow(execDetails) {
  //   this.isAccompanyBy = false;
  //   // this.router.navigateByUrl(`/mandate-customers/${this.id}/${this.assignedrm[0].visitaccompaniedid}/${this.feedbackId}/${this.htype}`);
  //   this.filterLoader = true;
  //   setTimeout(() => {
  //     let accompapiedData = this.leadsDetailsInfo.filter(exec => exec.RMID == this.assignedrm[0].visitaccompaniedid);
  //     this.selectedExecId = accompapiedData[0].RMID;
  //     this.activeTabIndex = this.leadsDetailsInfo.indexOf(accompapiedData[0]);
  //     this.followform = false;
  //     this.usvform = false;
  //     this.rsvform = false;
  //     this.finalnegoform = false;
  //     this.leadclosedform = false;
  //     this.junkform = false;

  //     this.router.navigateByUrl(`/mandate-customers/${this.id}/${this.selectedExecId}/${this.feedbackId}/${this.htype}/${this.selectedSuggestedProp.propid}`);
  //     // this.getFixedProperties();
  //     this.fixedPropTrigger$.next();
  //     this.assignedrm = this.leadsDetailsInfo.filter((exec) => {
  //       return exec.RMID == this.selectedExecId;
  //     });

  //     if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop && this.assignedrm[0].suggestedprop.length > 1) {
  //       this.isSuggestedPropBoolean = true;
  //       let propertyData;
  //       let propIndex;
  //       this.assignedrm[0].suggestedprop.forEach((prop, index) => {
  //         if (prop.propid == this.urlpropertyid) {
  //           propertyData = prop;
  //           propIndex = index;
  //         }
  //       })
  //       // if (propertyData.selection == 1 && propertyData.leadstage == 'USV' && propertyData.actions == 0 || propertyData.selection == 2 && propertyData.leadstage == 'RSV' && propertyData.actions == 1) {
  //       if (this.assignedrm[0].suggestedprop.length > 1 && this.urlpropertyid) {
  //         this.selectedItem = propIndex;
  //         setTimeout(() => {
  //           this.tabclick(propIndex, propertyData)
  //         }, 100)
  //       } else if (this.assignedrm[0].suggestedprop.length > 1 && this.urlpropertyid == '') {
  //         this.tabclick(0, this.assignedrm[0].suggestedprop[0]);
  //       }
  //     } else {
  //       // this.selectedItem = 0;
  //       if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop) {
  //         this.tabclick(0, this.assignedrm[0].suggestedprop[0]);
  //       }
  //     }

  //     if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop) {
  //       this.visitpanelselection = this.assignedrm[0].suggestedprop.filter((prop) => {
  //         return !(prop.weekplan == null)
  //       });

  //       if (this.selectedSuggestedProp) {
  //         if (this.selectedSuggestedProp.weekplan == '1') {
  //           this.selectedPlanType = 'weekdays';
  //         } else if (this.selectedSuggestedProp.weekplan == '2') {
  //           this.selectedPlanType = 'weekend';
  //         } else if (this.selectedSuggestedProp.weekplan == '0') {
  //           this.selectedPlanType = 'ytc';
  //         }
  //       }
  //     }

  //     setTimeout(() => {
  //       this.stageTrigger$.next();
  //       this.historyTrigger$.next();
  //       this.scriptfunctions();
  //       this.filterLoader = false;
  //     }, 10)
  //   }, 0)
  // }

  moveToWhatsapp(lead) {
    if (lead.customer_number) {
      this.router.navigate(['/client-chat'], {
        queryParams: {
          allchat: 1,
          chatid: lead.customer_number,
          index: 0,
          execid: '',
          click: 1
        }
      })
    } else if (lead.enquiry_altnumber) {
      this.router.navigate(['/client-chat'], {
        queryParams: {
          allchat: 1,
          chatid: lead.enquiry_altnumber,
          index: 0,
          execid: '',
          click: 1
        }
      })
    }
  }

  triggerCall(lead) {

    let number = lead.customer_number.toString().trim();

    if (number.startsWith('+')) {
      number = number.substring(1);
    }

    const mobileRegex = /^(?:[0-9]{10}|91[0-9]{10})$/;

    if (!mobileRegex.test(number)) {
      swal({
        title: 'Invalid Mobile Number',
        html: `The mobile number <b>${lead.customer_number}</b> is not valid`,
        type: 'error',
        timer: 3000,
        showConfirmButton: false
      });
      return false;
    }

    if (this.assignedrm && this.assignedrm != undefined && this.assignedrm != null && this.assignedrm.length > 0 && this.assignedrm[0].leadstage == 'Junk') {
      swal({
        title: 'Junk Lead',
        html: `Please revert the lead from "Junk" status to make a call.`,
        type: 'warning',
        confirmButtonText: "Revert",
        cancelButtonText: "Cancel",
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false
      }).then((val) => {
        if (val.value == true) {
          this.revertStage();
        }
      })
    } else {

      this.selectedCallLead = lead;
      let currentDate = new Date();
      //date
      let year = currentDate.getFullYear();
      let month = String(currentDate.getMonth() + 1).padStart(2, '0');
      let day = String(currentDate.getDate()).padStart(2, '0');
      //time
      let hours = currentDate.getHours();
      let minutes = currentDate.getMinutes();
      let seconds = currentDate.getSeconds();

      let formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      swal({
        title: 'Initiate Outbound Call',
        html: `Do you want to place a call to <br><stronsg>${lead.customer_name}</strong> (${((this.assignedrm && this.assignedrm[0].leadstage != 'Fresh' || (this.assignedrm[0].leadstage == 'Fresh' && this.assignedrm[0].followupreason == 8) || this.roleid == 1 || this.roleid == 2) ? lead.customer_number : 'xxxxxxxxxx')})`,
        type: 'warning',
        confirmButtonText: "Call",
        cancelButtonText: "Cancel",
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false
      }).then((val) => {
        this.filterLoader = true;
        if (val.value == true) {
          this.showCloseButton = false;
          this.callStatus = 'Call Connected';
          const cleanedNumber = lead.customer_number.startsWith('91') && lead.customer_number.length > 10 ? lead.customer_number.slice(2) : lead.customer_number;
          let param = {
            execid: this.userid,
            number: cleanedNumber,
            leadid: lead.customer_IDPK,
            starttime: formattedDateTime,
            modeofcall: 'Desktop-mandate',
            rmid: this.selectedExecId
          }
          this._sharedservice.postTriggerCall(param).subscribe((resp) => {
            this.filterLoader = false;
            if (resp.status == 'success') {
              setTimeout(() => {
                this.getLiveCallsData();
              }, 0);

              if (this.assignedrm[0].leadstage == 'Fresh' && (this.show_cnt.enquiry_bhksize == null || this.show_cnt.enquiry_budget == null) && this.callStatus != undefined && this.callStatus != null && this.callStatus != '') {
                setTimeout(() => {
                  $('#auto_edit_trigger').click();
                  this.getcustomerupdate(this.show_cnt.customer_IDPK);
                }, 500)
              }

            } else {
              swal({
                title: 'Call Not Connected',
                html: `The call could not be completed to <br><stronsg>${lead.customer_name}</strong> (${lead.customer_number}) Please try again later.`,
                type: 'error',
                timer: 3000,
                showConfirmButton: false,
                showCancelButton: false
              });
            }
          });
        } else {
          this.filterLoader = false;
        }
      })
    }

  }

  isSwalShown: boolean = false;
  getLiveCallsData() {
    this._sharedservice.getLiveCallsList(localStorage.getItem('UserId')).subscribe((resp) => {
      this.callDurationStr = '00h:00m:00s';
      if (resp.status == 'success') {
        this.liveCallData = resp.success[0];
        this.isDisaplyCall = true;
        this.callStatus = resp.success[0].dialstatus;
        this.callDirection = resp.success[0].direction;
        if (this.liveCallData.starttime) {
          this.callStartTime = new Date(this.liveCallData.starttime).getTime();
          this.startTimer();
        }
        // if (!localStorage.getItem('callStartTime')) {
        //   const callStart = Date.now();
        //   localStorage.setItem('callStartTime', callStart.toString());
        //   this.scheduleCloseButton(callStart); // start countdown
        // } else {
        //   // Use existing time if already stored (e.g., after refresh)
        //   const storedTime = parseInt(localStorage.getItem('callStartTime') || '', 10);
        //   this.scheduleCloseButton(storedTime);
        // }
        const callStart = new Date(this.liveCallData.starttime).getTime();
        localStorage.setItem('callStartTime', callStart.toString());
        this.scheduleCloseButton(callStart);
        this.scheduleConnectingCloseButton(callStart);
        let currentUrl = this.router.url;
        let pathWithoutQueryParams = currentUrl.split('/')[1];
        if (!this.isSwalShown && parseInt(this.liveCallData.Lead_IDFK) != parseInt(this.id) && (pathWithoutQueryParams == 'assigned-leads-details' || pathWithoutQueryParams == 'mandate-customers')) {
          this.isSwalShown = true;
          swal({
            title: 'Call Details',
            text: 'You are already on a call with other Client.',
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: true,
            confirmButtonText: "Go to Client details Page",
          }).then((val) => {
            if (val.value == true) {
              let assignedRm;
              if (this.roleid == 1 || this.roleid == 2) {
                assignedRm = this.liveCallData.assignee;
              } else {
                assignedRm = this.liveCallData.Exec_IDFK;
              }
              if (this.liveCallData.modeofcall == 'Desktop-mandate' || this.liveCallData.modeofcall == 'mobile-mandate' || this.liveCallData.modeofcall == 'Mobile-Mandate' || this.liveCallData.modeofcall == 'Mobile-mandate') {
                // this.router.navigateByUrl(`/mandate-customers/${this.liveCallData.Lead_IDFK}/${assignedRm}/0/mandate`)
                if (this.selectedSuggestedProp && this.selectedSuggestedProp.propid) {
                  const newUrl = `/mandate-customers/${this.liveCallData.Lead_IDFK}/${assignedRm}/0/mandate/${this.selectedSuggestedProp.propid}`;
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigateByUrl(newUrl);
                  });
                } else {
                  const newUrl = `/mandate-customers/${this.liveCallData.Lead_IDFK}/${assignedRm}/0/mandate`;
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigateByUrl(newUrl);
                  });
                }

              }
              // else if (this.liveCallData.modeofcall == 'Desktop-retail' || this.liveCallData.modeofcall == 'mobile-retail' || this.liveCallData.modeofcall == 'Mobile-Retail' || this.liveCallData.modeofcall == 'Mobile-retail') {
              //   this.router.navigateByUrl(`/assigned-leads-details/${this.liveCallData.Lead_IDFK}/${assignedRm}/0/retail`)
              // }
            }
          });
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
        script.type = 'module';
        script.async = true;
        script.id = "dashboard_dynamic_links_5";
        document.head.appendChild(script);
      } else {
        this.isSwalShown = false;
        this.isDisaplyCall = false;
        this.liveCallData = '';
        this.stopTimer();
      }
    })
  }

  recordingList() {
    // $('#call_record_modal_detail').click();
    this.selectedRecordExec = this.selectedExecId;
    this.getAllRecordList(this.selectedExecId)
  }

  selectedExecutiveId(exec) {
    this.selectedRecordExec = exec.Exec_IDFK;
    this.getAllRecordList(exec.Exec_IDFK)
  }

  getAllRecordList(exec) {
    let param = {
      number: this.show_cnt.customer_number,
      execid: exec,
      loginid: this.userid
    }
    this.filterLoader = true;
    this._sharedservice.getAllCalls(param).subscribe({
      next: (resp) => {
        this.filterLoader = false;
        this.onRecordExecList = resp.executives;
        this.audioList = resp.success;
        this.groupByDate(resp.success);
      },
      error: (err) => {
        this.filterLoader = false;
        this.audioList = [];
        this.onRecordExecList = [];
        console.log('Something issue from API end', err)
      }
    })
  }

  groupedByDate: any[] = [];
  groupByDate(records: any[]) {
    const grouped = {};
    records.forEach(call => {
      const date = call.starttime.split(' ')[0]; // extract 'YYYY-MM-DD'
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(call);
    });
    // Convert object to array (Angular 5 doesn’t support keyvalue pipe)
    this.groupedByDate = Object.keys(grouped).map(date => ({
      date,
      calls: grouped[date]
    }));
  }

  playAudio(audioElement: HTMLAudioElement, event: any) {
    const icon = event.target as HTMLElement;

    // Stop all other audio elements
    const audios = document.getElementsByTagName('audio');
    const icons = document.getElementsByClassName('fa-play');

    for (let i = 0; i < audios.length; i++) {
      audios[i].pause();
      audios[i].currentTime = 0;
    }

    // Reset all icons back to play
    for (let i = 0; i < icons.length; i++) {
      icons[i].classList.remove('fa-pause');
      icons[i].classList.add('fa-play');
    }

    // Toggle play/pause for this one
    if (icon.classList.contains('fa-play')) {
      audioElement.play();
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');

      // When audio ends, reset icon
      audioElement.onended = () => {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
      };
    } else {
      audioElement.pause();
      audioElement.currentTime = 0;
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
    }
  }


  onAudioPlay(event: any): void {
    const currentAudio: HTMLAudioElement = event.target;

    const allAudios: NodeListOf<HTMLAudioElement> = document.querySelectorAll('audio');

    Array.from(allAudios).forEach((audio: HTMLAudioElement) => {
      if (audio !== currentAudio) {
        audio.pause();
      }
    });
  }

  // getDurationTime(time) {
  //   let currentDate = new Date();
  //   let hours = currentDate.getHours();
  //   let minutes = currentDate.getMinutes();
  //   let seconds = currentDate.getSeconds();
  //   let formattedMinutes: string = String(minutes).padStart(2, '0');
  //   let formattedSeconds: string = String(seconds).padStart(2, '0');
  //   let currentTime = hours + ':' + formattedMinutes + ':' + formattedSeconds;
  //   let timerDifference = getTimeDifference(time.split(' ')[1], currentTime);
  //   const [hours1, minutes1, seconds1] = timerDifference.split(':');
  //   return `${hours1}h:${minutes1}m:${seconds1}s`;
  // }

  revertToActive(exec) {
    swal({
      title: 'Convert Lead to Active?',
      text: `Are you sure you want to change this lead from inactive to active status?`,
      type: 'info',
      cancelButtonText: 'NO',
      confirmButtonText: 'OK',
      showCancelButton: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value == true) {
        this.filterLoader = true;
        let param = {
          execid: exec.RMID,
          leadid: exec.customer_IDPK
        }

        this._mandateService.revertBackToActive(param).subscribe((resp) => {
          this.filterLoader = false;
          if (resp.status == 'True') {
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
            })
          }
        })
      }
    });

  }

  scheduleCloseButton(callStart: any): void {
    const elapsed = Date.now() - callStart;
    const remaining = 60000 - elapsed;
    if (remaining <= 0) {
      this.showCloseButton = true;
    } else {
      this.showCloseButton = false;
      if (!this.closeButtonTimeoutSet) {
        this.closeButtonTimeoutSet = true;
        setTimeout(() => {
          this.showCloseButton = true;
        }, remaining);
      }
    }
  }

  scheduleConnectingCloseButton(callStart: any): void {
    const elapsed = Date.now() - callStart;
    const remaining = 120000 - elapsed;
    if (remaining <= 0) {
      this.showCloseConnectingButton = true;
    } else {
      this.showCloseConnectingButton = false;
      if (!this.closeButtonTimeoutSet) {
        this.closeButtonTimeoutSet = true;
        setTimeout(() => {
          this.showCloseConnectingButton = true;
          console.log('Close button shown via timeout.');
        }, remaining);
      }
    }
  }

  initInterval() {
    setInterval(() => {
      const storedTime = localStorage.getItem('callStartTime');
      if (storedTime) {
        const parsedTime = parseInt(storedTime, 10);
        this.scheduleCloseButton(parsedTime);
        this.scheduleConnectingCloseButton(parsedTime);
      }
    }, 10000);
  }

  onCallDisconnect() {
    swal({
      title: 'Are You Sure the Call is disconnected',
      type: 'info',
      cancelButtonText: 'NO',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value == true) {
        let number = localStorage.getItem('Number');
        this.filterLoader = true;
        this._sharedservice.onCallDisconnected(number).subscribe((resp) => {
          if (resp.status == 'True') {
            this.filterLoader = false;
            localStorage.removeItem('callStartTime');
            this.isDisaplyCall = false;
            this.showCloseButton = false;
            this.liveCallData = '';
            this.callStatus = '';
            $('.body-cntnts-mandate').removeClass('blurred');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').closest('div').remove();
          } else {
            swal({
              title: 'Call Disconnect Failed!',
              text: 'Please try again',
              type: 'error',
              confirmButtonText: 'OK'
            })
          }
        })
      } else if (result.dismiss) {
      }
    });
  }

  startTimer() {
    this.stopTimer();
    this.updateDuration();
    this.timerSub = Observable.interval(1000).subscribe(() => {
      this.updateDuration();
    });
  }

  stopTimer() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = null;
    }
  }

  updateDuration() {
    if (!this.callStartTime) {
      this.resetTimer();
      return;
    }

    const now = Date.now();
    let diff = now - this.callStartTime;
    if (diff < 0) diff = 0;

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    this.callDurationStr = `${this.pad(hours)}h:${this.pad(minutes)}m:${this.pad(seconds)}s`;
  }

  resetTimer() {
    this.callDurationStr = '00h:00m:00s';
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  addfollowupdata() {
    var followdate;
    var followtime;
    var followuptextarearemarks;

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    let todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = (new Date()).toLocaleTimeString([], options);
    let currenttime = timeString;

    followdate = todaysdateforcompare;
    followtime = currenttime;

    var leadid = this.id;
    var userid = localStorage.getItem('UserId');
    var username = localStorage.getItem('Name');

    let followsectiondata, followsectionname;
    if (this.callStatus == 'BUSY') {
      followsectiondata = 2;
      followsectionname = "RNR";
      followuptextarearemarks = `${this.assignedrm[0].customer_name} was busy`;
      this.autoremarks = "Status changed to RNR, because the client did not answer the call.";
    } else if (this.callStatus == 'Executive Busy') {
      followsectiondata = 100;
      followsectionname = "Executive Busy";
      followuptextarearemarks = `${username} was busy`;
      this.autoremarks = `did not pick the Call.`;
    }

    let stagestatus;
    if (this.currentstage !== 'Fresh') {
      if (this.activestagestatus[0].stagestatus == '1') {
        stagestatus = "1";
      } else if (this.activestagestatus[0].stagestatus == '2') {
        stagestatus = "2";
      } else if (this.activestagestatus[0].stagestatus == '3') {
        stagestatus = "3";
      }
    } else {
      if (this.activestagestatus[0].stagestatus == null) {
        stagestatus = '0';
      } else {
        stagestatus = this.activestagestatus[0].stagestatus;
      }
    }

    var followups = {
      leadid: leadid,
      actiondate: followdate,
      actiontime: followtime,
      leadstatus: this.currentstage,
      stagestatus: stagestatus,
      followupsection: followsectiondata,
      followupremarks: followuptextarearemarks,
      userid: userid,
      assignid: this.selectedExecId,
      autoremarks: this.autoremarks,
      property: this.selectedSuggestedProp.propid,
      feedbackid: this.feedbackId
    }

    this.filterLoader = true;
    this._mandateService.addfollowuphistory(followups).subscribe((success) => {
      this.status = success.status;
      this.filterLoader = false;
      if (this.status == "True") {
        if (this.callStatus == 'Executive Busy') {
          // swal({
          //   imageUrl: '../../../../assets/images/missed-call.gif.gif',
          //   imageWidth: 150,
          //   imageHeight: 150,
          //   title: 'You Missed it',
          //   text: `You initiated a call but didn’t pick up.`,
          //   confirmButtonText: "Initiate Call",
          //   cancelButtonText: "Cancel",
          //   showConfirmButton: true,
          //   showCancelButton: true,
          //   allowOutsideClick: false
          // })
          Swal.fire({
            title: 'You Missed it',
            text: 'You initiated a call but didn’t pick up.',
            imageUrl: '../../../../assets/images/missed-call.gif.gif',
            imageWidth: 150,
            imageHeight: 150,
            showConfirmButton: true,
            confirmButtonText: 'Initiate Call',
            showDenyButton: true,
            denyButtonText: "Move To Inactive",
            showCancelButton: false,
            // cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            showCloseButton: true
          })
            .then((result) => {
              if (result.isConfirmed == true) {
                setTimeout(() => {
                  this.triggerCall(this.selectedCallLead);
                }, 500)
              } else if (result.isDenied) {
                let followupremarks = `${this.assignedrm[0].customer_name} was not reachable`;
                let autoremarks = "Status changed to Not Connected, as the call could not be established with the client.";
                var followups1 = {
                  leadid: leadid,
                  actiondate: followdate,
                  actiontime: followtime,
                  leadstatus: this.currentstage,
                  stagestatus: stagestatus,
                  followupsection: 4,
                  followupremarks: followupremarks,
                  userid: userid,
                  assignid: this.selectedExecId,
                  autoremarks: autoremarks,
                  property: this.selectedSuggestedProp.propid,
                  feedbackid: this.feedbackId
                }
                this.filterLoader = true;
                this._mandateService.addfollowuphistory(followups1).subscribe((success) => {
                  this.status = success.status;
                  this.filterLoader = false;
                  if (this.status == "True") {
                    $('.modal-backdrop').closest('div').remove();
                    let currentUrl = this.router.url;
                    let pathWithoutQueryParams = currentUrl.split('?')[0];
                    let currentQueryparams = this.route.snapshot.queryParams;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
                    });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Update Failed',
                      text: 'Something went wrong. Please try again.',
                      confirmButtonText: 'OK',
                      allowOutsideClick: false
                    });
                  }
                })
              } else {
                $('.modal-backdrop').closest('div').remove();
                let currentUrl = this.router.url;
                let pathWithoutQueryParams = currentUrl.split('?')[0];
                let currentQueryparams = this.route.snapshot.queryParams;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
                });
              }
            })
        } else if (this.callStatus == 'BUSY') {
          swal({
            title: 'Follow-up Updated Successfully',
            text: "Client did not answer the call. A new reminder has been set as RNR",
            type: "success",
            showConfirmButton: true,
            allowOutsideClick: false
          }).then((val) => {
            // if (val.value == true) {
            $('.modal-backdrop').closest('div').remove();
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
            });
            // }
          }), (err) => {
            console.log("Failed to Update");
          }
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Something went wrong. Please try again.',
          confirmButtonText: 'OK',
          allowOutsideClick: false
        });
      }
    });
  }

  selectTab(tabName: string) {
    this.activeTab = tabName;
  }

  onPropertyChange(event: any) {
    const index = +event.target.value;

    let property = null;
    if (this.assignedrm && this.assignedrm[0] && this.assignedrm[0].suggestedprop) {
      property = this.assignedrm[0].suggestedprop[index];
    }

    $('#customer_phase4').val('');
    $('#sectionselector').val('');

    if (property) {
      this.tabclick(index, property);
      this.selectedItem = index;
    }

  }

  logsType: any;
  logsTab(type) {
    this.logsType = type;
    $('.other_section').removeClass("active");
    if (type == 'lead') {
      $(".lead_section").addClass("active");
      this.triggerhistory();
    } else if (type == 'call') {
      $(".call_section").addClass("active");
      this.recordingList();
    } else if (type == 'executive') {
      $(".executive_section").addClass("active");
      this.triggerhistory();
    }
  }

  downloadRecordings(call) {
    const link = this.renderer.createElement('a')
    link.setAttribute('href', call.filename);
    link.setAttribute('download', this.getFileNameFromUrl(call.filename));
    link.setAttribute('target', '_blank');
    link.click();
    link.remove();
  }

  // Helper to generate a friendly filename from URL
  getFileNameFromUrl(url: string): string {
    try {
      const urlParams = new URL(url);
      const callId = urlParams.searchParams.get('callId');
      return callId ? `recording_${callId}.mp3` : 'recording.mp3';
    } catch (e) {
      return 'recording.mp3';
    }
  }

  enableAccess() {
    let param = {
      assignedleads: this.assignedrm[0].customer_IDPK,
      customersupport: this.assignedrm[0].RMID,
      propId: this.assignedrm[0].propid,
      loginid: this.userid,
      executiveIds: this.assignedrm[0].RMID
    }
    this.filterLoader = true;
    this._mandateService.leadreassign(param).subscribe((success) => {
      this.filterLoader = false;
      this.status = success.status;
      if (this.status == "True") {
        swal({
          title: 'Access Enabled Successfully',
          type: 'success',
          confirmButtonText: 'Show Details'
        }).then(() => {
          this.reassignedResponseInfo = success['assignedleads'];
          $('#reassign_leads_detail').click();
        })
      } else {
        swal({
          title: 'Authentication Failed!',
          text: 'Please try again',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }, (err) => {
       this.filterLoader = false;
      console.log("Connection Failed")
    });
  }

  closeDetailModal() {
    setTimeout(() => {
      let currentUrl = this.router.url;
      let pathWithoutQueryParams = currentUrl.split('?')[0];
      let currentQueryparams = this.route.snapshot.queryParams;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
      });
      $('.modal-backdrop').closest('div').remove();
    }, 0)
  }

}

// function getTimeDifference(startTime: string, endTime: string): string {
//   const start = new Date(`1970-01-01T${startTime}Z`);
//   const end = new Date(`1970-01-01T${endTime}Z`);
//   const differenceInMs = end.getTime() - start.getTime();
//   const hours = Math.floor((differenceInMs % 86400000) / 3600000);
//   const minutes = Math.floor((differenceInMs % 3600000) / 60000);
//   const seconds = Math.floor((differenceInMs % 60000) / 1000);
//   return `${Math.abs(hours)}:${Math.abs(minutes)}:${Math.abs(seconds)}`;
// }
