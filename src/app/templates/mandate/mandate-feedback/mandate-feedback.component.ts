import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';
import { sharedservice } from '../../../shared.service';
import { retailservice } from '../../../retail.service';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MandateClassService } from '../../../mandate-class.service';
import { EchoService } from '../../../echo.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-feedback',
  templateUrl: './mandate-feedback.component.html',
  styleUrls: ['./mandate-feedback.component.css']
})
export class MandateFeedbackComponent implements OnInit {


  constructor(private router: Router, private route: ActivatedRoute, private _retailservice: retailservice, private _mandateService: mandateservice, private _sharedservice: sharedservice, private _mandateClassService: MandateClassService,
    public datepipe: DatePipe, private echoService: EchoService) {
    if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
      this.router.navigateByUrl('/login');
    };
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
      $('.ui.label.fluid.dropdown').dropdown({
        useLabels: false
      });
    }, 1000);
  }

  private isCountdownInitialized: boolean;
  filterLoader: boolean = true;
  fromdate: any;
  todate: any;
  rmid: any;
  execid: any;
  propertyid: any;
  propertyname: any;
  static count: number;
  static closedcount: number;
  static reassigncount: number;
  callerleads: any;
  status: any;
  executives: any;
  executivefilterview = false;
  propertyfilterview = false;
  stagefilterview = false;
  stagestatusfilterview = false;
  datefilterview = false;
  execname: any;
  currentDate = new Date();
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdaysdateforcompare: any;
  tomorrowsdateforcompare: any;
  stagevalue: any;
  stagestatusval: any;
  stagestatusvaltext: any;
  stagestatus = false;
  // *****************************Assignedleads section list*****************************
  pendingleadsparam: any;
  followupleadsparam: any;
  ncleadsparam: any;
  inactiveparam: any;
  Totalleadcounts: number = 0;;
  pendingleadcounts: any;
  followupleadcounts: any;
  inactivecounts: any;
  roleid: any;
  userid: any;
  leadtrack: any;
  additionalParam: any;
  additionalParamCount: number = 0;
  isAdditonalParamPresent: boolean = false;
  mandateprojects: any;
  copyofmandateprojects: any;
  copyofsources: any;
  sourceFilter: boolean = false;
  source: any;
  sourceList: any;
  directteamfound: boolean = false;
  team: any
  mandateexecutives: any;
  priorityName: any;
  priorityFilter: boolean = false;
  priorityType: any;
  isAssignedLeads: boolean = true
  filterLeads = '';
  randomCheckVal: any = '';
  unquieleadcounts: number = 0;

  //reassign variables
  reassignleadsCount: number = 0;
  selectedEXEC: any;
  selectedExecIds: any;
  selectedAssignedleads: any;
  selectedTeamType: any;
  selectedEXECUTIVES: any;
  selectedEXECUTIVEIDS: any;
  reassignListExecutives: any;
  followupsections: any;
  selectedMandateProp = '';
  selectedReassignTeamType: any = '';
  selectedLeadExecutiveIds: any;
  reassignedResponseInfo: any;
  maxSelectedLabels: number = Infinity;
  dateRange: any;
  reassignfromdate: any;
  reassigntodate: any;
  usvParam: any;
  rsvParam: any;
  fnParam: any;
  bookingRequestParam: any;
  junkvisitsParam: any;
  junkleadsParam: any;
  bookedParam: any;
  junkleadsCounts: number = 0;
  junkvisitsCounts: number = 0;
  usvCounts: number = 0;
  rsvCounts: number = 0;
  fnCounts: number = 0;
  ncCounts: number = 0;
  bookingRequestCounts: number = 0;
  bookedCounts: number = 0;
  leadstatusVisits: any;
  arr: Array<any>;
  leadReceivedDateRange: Date[];
  @ViewChild(BsDaterangepickerDirective) datepicker: BsDaterangepickerDirective;
  receivedFromDate: any;
  receivedToDate: any;
  receivedDatefilterview: boolean = false;
  followctgFilter: any;
  searchTerm_stagecategory: any;
  categoryStage: any;
  categoryStageName: any;
  categeoryfilterview: boolean = false;
  normalcallparam: any;
  normalcallcounts: number = 0;
  visitedDatefilterview: boolean = false;
  visitedFrom: any;
  visitedTo: any;
  visitedDateRange: Date[];
  nextActionDateRange: Date[];
  donestatusfilterview: boolean = false;
  donestagestatusvaltext: any;
  selectedLeadStatus: string;
  selectedBookingLeadStatus: string;
  leadBookingstatus: any;
  searchTerm: string = '';
  searchTerm_executive: string = '';
  mandateExecutivesFilter: any;
  copyMandateExecutives: any;
  searchTerm_source: string = '';
  closepropertyname: any;
  requestedunits: any;
  isbuttondisable: boolean = false;
  @ViewChild(BsDaterangepickerDirective) datepicker1: BsDaterangepickerDirective;
  @ViewChild(BsDaterangepickerDirective) datepicker2: BsDaterangepickerDirective;
  @ViewChild(BsDaterangepickerDirective) datepicker3: BsDaterangepickerDirective;
  @ViewChild(BsDaterangepickerDirective) datepicker4: BsDaterangepickerDirective;
  @ViewChild('datepicker1') datepickerreceived: ElementRef;
  @ViewChild('datepicker3') datepickervisited: ElementRef;
  @ViewChild('datepicker2') datepickernextACtion: ElementRef;
  @ViewChild('datepicker4') datepickerassigned: ElementRef;
  role_type: any;
  mandateProperty_ID: any;
  assignedFrom: any;
  assignedTo: any;
  type: any;
  assignedOnDateRange: Date[];
  assignedOnDatefilterview: boolean = false;
  bookingRejectedParam: any;
  bookingRejectedCounts: number = 0;
  visitStageType: any;
  stageJunkCount: number = 0;
  overdueCount: number = 0;
  overduejunk: string = '';
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  csexecutivefilterview: boolean = false;
  csexecid: any;
  csexecname: any;
  searchcsTerm_executive: string = '';
  csListExecutives: any;
  copyOfcsListExecutives: any;
  CSEXview: boolean = false;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  assignedOnStart: moment.Moment | null = null;
  assignedOnEnd: moment.Moment | null = null;
  visitedOnStart: moment.Moment | null = null;
  visitedOnEnd: moment.Moment | null = null;
  fromTime: any;
  toTime: any;
  // callStatus: any;
  calledLead: any;
  assignedRm: any;
  selectedRecordExec: any;
  audioList: any;
  onRecordExecList: any;
  roleTeam: any = '';
  isRestoredFromSession = false;
  // *****************************Assignedleads section list*****************************

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    if (this.roleid == 1 || this.roleid == '2') {
      this.userid = localStorage.getItem('UserId');
    } else {
      this.userid = '1';
    }
    this.role_type = localStorage.getItem('role_type');
    this.mandateProperty_ID = localStorage.getItem('property_ID');

    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    // *********************load the required template files*********************


    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    let todaysDate = new Date();
    var curday = todaysDate.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = todaysDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    this.dateRange = [new Date(this.todaysdateforcompare)];
    // Todays Date
    let currentDate = new Date();
    // Yesterdays Date
    const yesterday = () => {
      currentDate.setDate(currentDate.getDate() - 1);
      return currentDate;
    };
    this.yesterdaysdateforcompare = yesterday().toISOString().split('T')[0];
    // Yesterdays Date

    // Tomorrows Date
    var tomorrow = this.currentdateforcompare.getDate() + 1;
    var tomorrowwithzero = tomorrow.toString().padStart(2, "0");
    this.tomorrowsdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + tomorrowwithzero;
    // Tomorrows Date
    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }
    if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
    } else if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    } else {
    }

    this.mandateprojectsfetch();
    if (this.roleid == '1' || this.roleid == '50013' || this.roleid == '50014' || this.roleid == '2') {
      this.getCsExecutives();
      this.getExecutivesForFilter()
    }

    const savedState = sessionStorage.getItem('feedback_state');

    if (savedState) {
      const state = JSON.parse(savedState);
      this.isRestoredFromSession = true;
      this.source = state.source
      this.execid = state.execid;
      this.execname = state.execname
      this.propertyid = state.propertyid;
      this.propertyname = state.propertyname;
      this.csexecid = state.csexecid,
        this.csexecname = state.csexecname,
        this.fromdate = state.from;
      this.todate = state.to;
      this.assignedFrom = state.assignedfrom;
      this.assignedTo = state.assignedto;
      this.visitedFrom = state.visitedfrom;
      this.visitedTo = state.visitedto;
      this.stagevalue = state.stage;
      this.stagestatusval = state.stagestatus

      $(".other_section").removeClass("active");
      if (state.tabs == 'pendingleadsparam') {
        $(".pending_section").addClass("active");
        this.pendingleadsparam = 1;
      } else if (state.tabs == 'ncleadsparam') {
        $(".nc_section").addClass("active");
        this.ncleadsparam = 1;
      } else if (state.tabs == 'usvParam') {
        $(".usv_section").addClass("active");
        this.usvParam = 1;
      } else if (state.tabs == 'rsvParam') {
        $(".rsv_section").addClass("active");
        this.rsvParam = 1;
      } else if (state.tabs == 'fnParam') {
        $(".fn_section").addClass("active");
        this.fnParam = 1;
      } else if (state.tabs == 'junkvisitsParam') {
        $(".junkvisits_section").addClass("active");
        this.junkvisitsParam = 1;
      }

      MandateFeedbackComponent.count = state.page;
      this.callerleads = state.leads;

      if (this.propertyid == null || this.propertyid == '' || this.propertyid == undefined) {
        this.propertyfilterview = false;
      } else {
        this.propertyfilterview = true;
      }

      if (this.execid == '' || this.execid == undefined || this.execid == null) {
        this.executivefilterview = false;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == '1') {
          this.rmid = "";
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      } else {
        this.executivefilterview = true;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == '1') {
          this.rmid = this.execid;
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      }

      if (this.source == '' || this.source == undefined || this.source == null) {
        this.sourceFilter = false;
      } else {
        this.sourceFilter = true;
      }


      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
        this.fromdate = '';
        this.todate = '';
        this.fromTime = '';
        this.toTime = '';
      } else {
        this.datefilterview = true;
        $("#fromdate").val(this.fromdate);
        $("#selectedtodate").val(this.todate);
      }

      if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
        this.visitedDatefilterview = false;
        this.visitedFrom = '';
        this.visitedTo = '';
      } else {
        this.visitedDatefilterview = true;
        if (this.stagestatusval == 1 || this.stagestatusval == 2) {
          this.stagestatusval = '';
        }

        if ((this.usvParam == 1 || this.rsvParam == 1 || this.fnParam == 1) && (this.fromdate != '' && this.fromdate != undefined && this.fromdate != null && this.todate != '' && this.todate != undefined && this.todate != null)) {
          this.fromdate = '';
          this.todate = '';
          this.datefilterview = false;
        }
      }

      if ((this.assignedFrom == '' || this.assignedFrom == undefined || this.assignedFrom == null) || (this.assignedTo == null || this.assignedTo == '' || this.assignedTo == undefined)) {
        this.assignedOnDatefilterview = false;
        this.assignedFrom = '';
        this.assignedTo = '';
      } else {
        this.assignedOnDatefilterview = true;
      }

      if (this.stagevalue) {
        this.stagefilterview = true;
        if (this.stagevalue == "USV") {
          this.stagestatus = true;
        } else if (this.stagevalue == 'Junk') {
          this.stagestatusval = '';
          this.stagestatusvaltext = '';
          this.stagestatusfilterview = false;
          this.stagestatusval = '';
        } else {
          this.stagestatus = true;
        }
      } else {
        this.stagefilterview = false;
      }

      if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == null) {
        this.stagefilterview = false;
        if (this.junkvisitsParam == 1 && this.stagestatusval == 3) {
          this.stagestatusval = '';
        }
      } else {
        this.stagestatus = true;
        this.stagefilterview = true;
      }

      if ((this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null)) {
        this.stagestatusfilterview = false;
      } else {
        this.stagestatusfilterview = true;
        if (this.stagestatusval == '1') {
          this.stagestatusvaltext = "Fixed";
        } else if (this.stagestatusval == '2') {
          this.stagestatusvaltext = "Refixed";
        } else if (this.stagestatusval == '3') {
          this.stagestatusvaltext = "Done";
          if (this.junkvisitsParam != 1) {
            this.stagefilterview = false;
            this.stagestatusfilterview = false;
          }
        }
      }

      if (this.stagestatusval && this.stagestatusval != '3') {
        this.stagefilterview = true;
      }

      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = state.scrollTop;
      }, 0);
      this.filterLoader = false;
      // 🔴 IMPORTANT
      this.batch1trigger();
    }

    this.getleadsdata();

    let node2: any = document.createElement('link');
    node2.setAttribute('href', 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css');
    node2.rel = 'stylesheet';
    node2.type = 'text/css';
    node2.id = "myplans_material_css1";
    document.getElementsByTagName('head')[0].appendChild(node2);

    let node3: any = document.createElement('script');
    node3.type = 'text/javascript';
    node3.src = 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.js';
    node3.charset = 'utf-8';
    node3.id = "myplans_dynamic_links_1";
    document.getElementsByTagName('head')[0].appendChild(node3);

    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
    // MandateFeedbackComponent.count = 0;
    // MandateFeedbackComponent.closedcount = 0;
    if (this.roleid == 1 || this.roleid == '50013' || this.roleid == '50014' || this.roleid == '2') {
      this.getsourcelist();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeNextActionDateRangePicker();
      this.initializeAssignedOnDateRangePicker();
      this.initializeVisitedOnDateRangePicker();
      // this.resetScroll();
    }, 0);
  }

  ngAfterViewChecked() {
    if (!this.isCountdownInitialized) {
      this.isCountdownInitialized = true;
      $('.modalclick').click(function () {
        $('.modalclick').removeClass('modal-backdrop');
        $('.modalclick').removeClass('fade');
        $('.modalclick').removeClass('show');
        document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
      });
    }
  }

  close() {
    $('.modalclick').removeClass('modal-backdrop');
    $('.modalclick').removeClass('fade');
    $('.modalclick').removeClass('show');
    document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  getleadsdata() {
    // MandateFeedbackComponent.count = 0;
    this.route.queryParams.subscribe((paramss) => {

      if (this.isRestoredFromSession) {
        this.filterLoader = false;
        this.isRestoredFromSession = false;
        setTimeout(() => {
          sessionStorage.clear();
        }, 3000)
        return;
      }

      // Updated Using Strategy
      this.filterLoader = true;

      // *****************************Assignedleads section list*****************************
      this.pendingleadsparam = paramss['pending'];
      this.ncleadsparam = paramss['nc'];
      this.usvParam = paramss['usv'];
      this.rsvParam = paramss['rsv'];
      this.fnParam = paramss['fn'];
      this.junkvisitsParam = paramss['junk'];

      this.propertyid = paramss['property'];
      this.propertyname = paramss['propname'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.stagevalue = paramss['stage'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.stagestatusval = paramss['stagestatus'];
      this.source = paramss['source'];
      this.leadstatusVisits = paramss['visits'];
      this.leadBookingstatus = paramss['bookingLeadRequest'];
      this.categoryStage = paramss['followupcategory'];
      this.categoryStageName = paramss['followupcategoryName'];
      this.receivedFromDate = paramss['receivedFrom'];
      this.receivedToDate = paramss['receivedTo'];
      this.visitedFrom = paramss['visitedfrom'];
      this.visitedTo = paramss['visitedto'];
      this.assignedFrom = paramss['assignedfrom'];
      this.assignedTo = paramss['assignedto'];
      this.fromTime = paramss['fromtime'];
      this.toTime = paramss['totime'];
      this.csexecid = paramss['csexecid'];
      this.csexecname = paramss['csexecname'];
      this.resetScroll();
      this.detailsPageRedirection();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.initializeAssignedOnDateRangePicker();
        this.initializeVisitedOnDateRangePicker();
      }, 0);

      if (this.leadstatusVisits == 1) {
        this.selectedLeadStatus = 'Direct Visits'
      } else if (this.leadstatusVisits == 2) {
        this.selectedLeadStatus = 'Assigned'
      } else {
        this.selectedLeadStatus = 'All'
      }

      if (this.propertyid) {
        this.propertyfilterview = true;
      } else {
        this.propertyfilterview = false;
      }

      if (this.execid) {
        this.executivefilterview = true;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == '1') {
          this.rmid = this.execid;
        } else {
          this.rmid = this.execid;
        }
      } else {
        this.executivefilterview = false;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == '1') {
          this.rmid = "";
        } else {
          this.rmid = '';
        }
      }

      if (this.csexecid == '' || this.csexecid == undefined || this.csexecid == null) {
        this.csexecutivefilterview = false;
        if (this.roleid != 1 && this.roleid != '2') {
          this.csexecid = localStorage.getItem('UserId');
        }
      } else {
        this.csexecutivefilterview = true;
      }

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
        this.fromdate = '';
        this.todate = '';
        this.fromTime = '';
        this.toTime = '';
      } else {
        this.datefilterview = true;
        $("#fromdate").val(this.fromdate);
        $("#selectedtodate").val(this.todate);
      }

      if ((this.receivedFromDate == '' || this.receivedFromDate == undefined || this.receivedFromDate == null) || (this.receivedToDate == '' || this.receivedToDate == undefined || this.receivedToDate == null)) {
        this.receivedDatefilterview = false;
        this.receivedFromDate = '';
        this.receivedToDate = '';
      } else {
        this.receivedDatefilterview = true;
      }

      if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
        this.visitedDatefilterview = false;
        this.visitedFrom = '';
        this.visitedTo = '';
      } else {
        this.visitedDatefilterview = true;
        if (this.stagestatusval == 1 || this.stagestatusval == 2) {
          this.stagestatusval = '';
        }

        if ((this.usvParam == 1 || this.rsvParam == 1 || this.fnParam == 1) && (this.fromdate != '' && this.fromdate != undefined && this.fromdate != null && this.todate != '' && this.todate != undefined && this.todate != null)) {
          this.fromdate = '';
          this.todate = '';
          this.datefilterview = false;
        }
        // this.receivedDatefilterview = false;
        // this.datefilterview = false;
      }

      if ((this.assignedFrom == '' || this.assignedFrom == undefined || this.assignedFrom == null) || (this.assignedTo == null || this.assignedTo == '' || this.assignedTo == undefined)) {
        this.assignedOnDatefilterview = false;
        this.assignedFrom = '';
        this.assignedTo = '';
      } else {
        this.assignedOnDatefilterview = true;
      }

      if (this.stagevalue) {
        this.stagefilterview = true;
        if (this.stagevalue == "USV") {
          this.stagestatus = true;
        } else if (this.stagevalue == 'Junk') {
          this.stagestatusval = '';
          this.stagestatusvaltext = '';
          this.stagestatusfilterview = false;
          this.stagestatusval = '';
        } else {
          this.stagestatus = true;
        }
      } else {
        this.stagefilterview = false;
      }

      if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == null) {
        this.stagefilterview = false;
        if (this.junkvisitsParam == 1 && this.stagestatusval == 3) {
          this.stagestatusval = '';
        }
      } else {
        this.stagestatus = true;
        this.stagefilterview = true;
      }

      if ((this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null)) {
        this.stagestatusfilterview = false;
      } else {
        this.stagestatusfilterview = true;
        if (this.stagestatusval == '1') {
          this.stagestatusvaltext = "Fixed";
        } else if (this.stagestatusval == '2') {
          this.stagestatusvaltext = "Refixed";
        } else if (this.stagestatusval == '3') {
          this.stagestatusvaltext = "Done";
          if (this.junkvisitsParam != 1) {
            this.stagefilterview = false;
            this.stagestatusfilterview = false;
          }
        }
      }

      if (this.stagestatusval && this.stagestatusval != '3') {
        this.stagefilterview = true;
      }

      if ((this.categoryStage == '' || this.categoryStage == undefined) || (this.categoryStageName == '' || this.categoryStageName == undefined)) {
        this.categoryStage = '';
        this.categoryStageName = '';
        this.categeoryfilterview = false;
      } else {
        this.categeoryfilterview = true;
      }

      if (this.source) {
        this.sourceFilter = true;
      } else {
        this.sourceFilter = false;
      }

      //if the team id is present and if it's gr sitara or gr samskruthi team dropdown should be shown
      if (this.team == '' || this.team == undefined) {
        this.directteamfound = false;
        if (this.propertyid == '16793' || this.propertyid == '1830') {
          this.directteamfound = true;
        }
      } else {
        if (this.propertyid == '16793' || this.propertyid == '1830') {
          this.directteamfound = true;
        }
      }

      if (this.pendingleadsparam != '1') {
        if (this.stagevalue == 'Junk') {
          this.stagevalue = '';
          this.stagefilterview = false;
        }
      }

      // *****************************Assignedleads section list*****************************
      if (this.pendingleadsparam == '1') {
        this.batch1trigger();
        this.pendingleadsdata();
      } else if (this.ncleadsparam == '1') {
        this.batch1trigger();
        this.ncleadsdata();
      } else if (this.usvParam == '1') {
        this.visitStageType = 'USV';
        this.batch1trigger();
        this.usvdatas();
      } else if (this.rsvParam == '1') {
        this.visitStageType = 'RSV';
        this.batch1trigger();
        this.rsvdatas();
      } else if (this.fnParam == '1') {
        this.visitStageType = 'FN';
        this.batch1trigger();
        this.fndatas();
      } else if (this.junkvisitsParam == '1') {
        this.batch1trigger();
        this.junkvisitsdatas();
      }
      // *****************************Assignedleads section list*****************************
    });
  }

  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
        this.copyofmandateprojects = mandates['Properties']
      }
    });
  }

  batch1trigger() {
    // Pending Leads Counts Fetch
    var pending = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'pending',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime,
      csexecid: this.csexecid,
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.feedbackAssignedLeadsCount(pending).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.pendingleadcounts = compleads.AssignedLeads[0].uniqueecount;
      } else {
        this.pendingleadcounts = "0";
      }
    });

    // NC Leads Counts Fetch
    var nc = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: 'NC',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime,
      csexecid: this.csexecid,
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.feedbackAssignedLeadsCount(nc).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.ncCounts = compleads.AssignedLeads[0].uniqueecount;
      } else {
        this.ncCounts = 0;
      }
    });

    //usv counts  fetch
    var usvpar = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: 'USV',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      csexecid: this.csexecid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime
    }
    this._mandateService.feedbackAssignedLeadsCount(usvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.usvCounts = compleads.AssignedLeads[0].uniqueecount;
      } else {
        this.usvCounts = 0;
      }
    });
    //usv counts  fetch

    //rsv counts  fetch
    var rsvpar = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: 'RSV',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      csexecid: this.csexecid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime
    }
    this._mandateService.feedbackAssignedLeadsCount(rsvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.rsvCounts = compleads.AssignedLeads[0].uniqueecount;
      } else {
        this.rsvCounts = 0;
      }
    });
    //rsv counts  fetch

    //fn counts  fetch
    var fnpar = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: 'Final Negotiation',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      csexecid: this.csexecid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime
    }
    this._mandateService.feedbackAssignedLeadsCount(fnpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.fnCounts = compleads.AssignedLeads[0].uniqueecount;
      } else {
        this.fnCounts = 0;
      }
    });
    //fn counts  fetch
    var junkpar = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      csexecid: this.csexecid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime
    }
    this._mandateService.feedbackAssignedLeadsCount(junkpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsCounts = compleads.AssignedLeads[0].uniqueecount;
      } else {
        this.junkvisitsCounts = 0;
      }
    });
  }

  pendingleadsdata() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".pending_section").addClass("active");
    }, 0)
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'pending',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      csexecid: this.csexecid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.feedbackAssignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  ncleadsdata() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".nc_section").addClass("active");
    }, 0)
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: 'NC',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      csexecid: this.csexecid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.feedbackAssignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  usvdatas() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".usv_section").addClass("active");
    }, 0)
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: 'USV',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      csexecid: this.csexecid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime
    }
    this._mandateService.feedbackAssignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  rsvdatas() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".rsv_section").addClass("active");
    }, 0)
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: 'RSV',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      csexecid: this.csexecid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime
    }
    this._mandateService.feedbackAssignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  fndatas() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".fn_section").addClass("active");
    }, 0)
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: 'Final Negotiation',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      csexecid: this.csexecid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime
    }
    this._mandateService.feedbackAssignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  junkvisitsdatas() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".junkvisits_section").addClass("active");
    }, 0)
    // let stagestatus;
    // if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
    //   stagestatus = '3';
    // }
    // else {
    //   stagestatus = this.stagestatusval;
    // }
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      csexecid: this.csexecid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime
    }
    this._mandateService.feedbackAssignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  showdateRange() {
    let todaysDate = new Date();
    this.leadReceivedDateRange = [todaysDate];

    setTimeout(() => {
      const inputElement = this.datepickerreceived.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      $('bs-daterangepicker-container').removeAttr('style');
      $("bs-daterangepicker-container").removeClass("nextactiondatepkr");
      $("bs-daterangepicker-container").removeClass("visiteddatepkr");
      $("bs-daterangepicker-container").removeClass("assignedOndatepkr");
      $("bs-daterangepicker-container").addClass("recievedleadsdatepkr");
    }, 0);
  }

  showdateRange2() {
    let todaysDate = new Date();
    this.nextActionDateRange = [todaysDate];

    setTimeout(() => {
      const inputElement = this.datepickernextACtion.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      $('bs-daterangepicker-container').removeAttr('style');
      $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
      $("bs-daterangepicker-container").removeClass("assignedOndatepkr");
      $("bs-daterangepicker-container").removeClass("visiteddatepkr");
      $("bs-daterangepicker-container").addClass("nextactiondatepkr");
    }, 0);
  }

  showdateRange3() {
    let todaysDate = new Date();
    this.visitedDateRange = [todaysDate];
    setTimeout(() => {
      const inputElement = this.datepickervisited.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      $('bs-daterangepicker-container').removeAttr('style');
      $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
      $("bs-daterangepicker-container").removeClass("nextactiondatepkr");
      $("bs-daterangepicker-container").addClass("visiteddatepkr");
    }, 0);
  }

  showdateRange4() {
    let todaysDate = new Date();
    this.assignedOnDateRange = [todaysDate];
    setTimeout(() => {
      const inputElement = this.datepickerassigned.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      $('bs-daterangepicker-container').removeAttr('style');
      $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
      $("bs-daterangepicker-container").removeClass("nextactiondatepkr");
      $("bs-daterangepicker-container").removeClass("visiteddatepkr");
      $("bs-daterangepicker-container").addClass("assignedOndatepkr");
    }, 0);
  }

  onLeadReceivedDateRangeSelected(range: Date[]): void {
    this.leadReceivedDateRange = range;
    //Convert the first date of the range to yyyy-mm-dd format
    if (this.leadReceivedDateRange != null || this.leadReceivedDateRange != undefined) {
      let formattedFromDate = this.datepipe.transform(this.leadReceivedDateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.leadReceivedDateRange[1], 'yyyy-MM-dd');
      if ((formattedFromDate != null && formattedFromDate != '') && (formattedToDate != null && formattedToDate != '')) {
        this.receivedFromDate = formattedFromDate;
        this.receivedToDate = formattedToDate;
        this.receivedDatefilterview = true;
        this.visitedDatefilterview = false;
        this.datefilterview = false;
        this.router.navigate([], {
          queryParams: {
            receivedFrom: this.receivedFromDate,
            receivedTo: this.receivedToDate
          },
          queryParamsHandling: 'merge',
        });
      } else {
        this.receivedDatefilterview = false;
      }
    }
  }

  onNextActionDateRangeSelected(range: Date[]): void {
    this.nextActionDateRange = range;
    //Convert the first date of the range to yyyy-mm-dd format
    if (this.nextActionDateRange != null || this.nextActionDateRange != undefined) {
      let formattedFromDate = this.datepipe.transform(this.nextActionDateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.nextActionDateRange[1], 'yyyy-MM-dd');
      if (formattedFromDate != null && formattedToDate != null) {
        this.fromdate = formattedFromDate;
        this.todate = formattedToDate;
        this.datefilterview = true;
        this.receivedDatefilterview = false;
        this.visitedDatefilterview = false;
        this.router.navigate([], {
          queryParams: {
            from: this.fromdate,
            to: this.todate
          },
          queryParamsHandling: 'merge',
        });
      } else {
        this.datefilterview = false;
      }
    }
  }

  onVisitedDateRangeSelected(range) {
    this.visitedDateRange = range;
    //Convert the first date of the range to yyyy-mm-dd format
    if (this.visitedDateRange != null || this.visitedDateRange != undefined) {
      let formattedFromDate = this.datepipe.transform(this.visitedDateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.visitedDateRange[1], 'yyyy-MM-dd');
      if ((formattedFromDate != null && formattedFromDate != '') && (formattedToDate != null && formattedToDate != '')) {
        this.visitedFrom = formattedFromDate;
        this.visitedTo = formattedToDate;
        this.visitedDatefilterview = true;
        this.datefilterview = false;
        this.receivedDatefilterview = false;
        this.router.navigate([], {
          queryParams: {
            visitedfrom: this.visitedFrom,
            visitedto: this.visitedTo
          },
          queryParamsHandling: 'merge',
        });
      } else {
        this.visitedDatefilterview = false;
      }
    }
  }

  onAssignedOnDateRangeSelected(range: Date[]) {
    this.assignedOnDateRange = range;
    //Convert the first date of the range to yyyy-mm-dd format
    if (this.assignedOnDateRange != null || this.assignedOnDateRange != undefined) {
      let formattedFromDate = this.datepipe.transform(this.assignedOnDateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.assignedOnDateRange[1], 'yyyy-MM-dd');
      if ((formattedFromDate != null && formattedFromDate != '') && (formattedToDate != null && formattedToDate != '')) {
        this.assignedFrom = formattedFromDate;
        this.assignedTo = formattedToDate;
        this.assignedOnDatefilterview = true;
        this.router.navigate([], {
          queryParams: {
            assignedfrom: this.assignedFrom,
            assignedto: this.assignedTo
          },
          queryParamsHandling: 'merge',
        });
      } else {
        this.assignedOnDatefilterview = false;
      }
    }
  }

  // *****************************Assignedleads section list*****************************

  dateclose() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.datefilterview = false;
    $('#fromdate').val("");
    $('#selectedtodate').val("");
    this.fromdate = "";
    this.todate = "";
    this.router.navigate([], {
      queryParams: {
        from: "",
        to: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  visitedDateclose() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.visitedDatefilterview = false;
    this.visitedFrom = "";
    this.visitedTo = "";
    this.router.navigate([], {
      queryParams: {
        visitedfrom: "",
        visitedto: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  assignedOnDateclose() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.assignedOnDatefilterview = false;
    this.assignedFrom = "";
    this.assignedTo = "";
    this.assignedOnDateRange = [this.currentdateforcompare];
    this.router.navigate([], {
      queryParams: {
        assignedfrom: "",
        assignedto: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  getExecutives() {
    this._mandateService.fetchmandateexecutuves(this.propertyid, this.team, this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      }
    });
  }

  statuschange(vals) {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.stagefilterview = true;
    this.stagestatusval = "";
    this.stagestatusvaltext = "";
    this.stagevalue = vals.target.value;

    if (this.stagevalue == "USV") {
      this.stagestatus = false;
      this.router.navigate([], {
        queryParams: {
          stage: vals.target.value,
          stagestatus: ""
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.stagestatus = true;
      this.router.navigate([], {
        queryParams: {
          stage: vals.target.value,
        },
        queryParamsHandling: 'merge',
      });
      $("#option-4").prop("checked", false);
      $("#option-5").prop("checked", false);
      $("#option-6").prop("checked", false);
    }
  }

  stagestatuschange(vals) {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.stagestatusfilterview = true;
    this.stagestatusval = vals;
    this.router.navigate([], {
      queryParams: {
        stagestatus: vals,
      },
      queryParamsHandling: 'merge',
    });
    if ((this.normalcallparam || this.rsvParam || this.fnParam || this.junkvisitsParam) == 1) {
      this.stagefilterview = true;
    }
    if (this.stagestatusval == '1') {
      this.stagestatusvaltext = "Fixed";
    } else if (this.stagestatusval == '2') {
      this.stagestatusvaltext = "Refixed";
    } else if (this.stagestatusval == '3') {
      this.stagestatusvaltext = "Done";
    } else if (this.stagestatusval == '4') {
      this.stagestatusvaltext = "Followup";
    } else if (this.stagestatusval == '5') {
      this.stagestatusvaltext = "Junk";
    }
  }

  stageSelected(count) {
    if (count == '1') {
      this.stagestatusvaltext = "Fixed";
      this.router.navigate([], {
        queryParams: {
          stagestatus: count,
          overduejunk: ''
        },
        queryParamsHandling: 'merge',
      });
    } else if (count == '2') {
      this.stagestatusvaltext = "Refixed";
      this.router.navigate([], {
        queryParams: {
          stagestatus: count,
          overduejunk: ''
        },
        queryParamsHandling: 'merge',
      });
    } else if (count == '3') {
      this.stagestatusvaltext = "Done";
      this.router.navigate([], {
        queryParams: {
          stagestatus: count,
          overduejunk: ''
        },
        queryParamsHandling: 'merge',
      });
    } else if (count == '4') {
      this.router.navigate([], {
        queryParams: {
          stagestatus: '',
          overduejunk: count,
        },
        queryParamsHandling: 'merge',
      });
    } else if (count == '5') {
      this.router.navigate([], {
        queryParams: {
          stagestatus: '',
          overduejunk: count,
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  //this method is used only for junk to select the stage
  junkstatuschange(stagetype, statusType) {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.stagefilterview = true;
    // this.stagestatusval = "";
    // this.stagestatusvaltext = "";
    this.stagevalue = stagetype;
    this.stagestatusval = '';

    if (this.stagevalue == "Fresh") {
      this.stagestatus = true;
      this.router.navigate([], {
        queryParams: {
          stage: stagetype,
          stagestatus: ''
        },
        queryParamsHandling: 'merge',

      });
    } else {
      this.stagestatus = true;
      this.router.navigate([], {
        queryParams: {
          stage: stagetype,
          stagestatus: this.stagestatusval
        },
        queryParamsHandling: 'merge',
      });
      // $("#option-4").prop("checked", false);
      // $("#option-5").prop("checked", false);
      // $("#option-6").prop("checked", false);
      // $("#option-7").prop("checked", false);
    }
  }

  junkStageStatusChange(stage, vals) {
    this.stagevalue = stage;
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.stagefilterview = true;
    this.stagestatusfilterview = true;
    this.stagestatusval = vals;
    this.router.navigate([], {
      queryParams: {
        stage: stage,
        stagestatus: vals,
      },
      queryParamsHandling: 'merge',
    });
    if (this.stagestatusval == '1') {
      this.stagestatusvaltext = "Fixed";
    } else if (this.stagestatusval == '2') {
      this.stagestatusvaltext = "Refixed";
    } else if (this.stagestatusval == '3') {
      this.stagestatusvaltext = "Done";
    } else if (this.stagestatusval == '4') {
      this.stagestatusvaltext = "Followup";
    } else if (this.stagestatusval == '5') {
      this.stagestatusvaltext = "Junk ";
    }
  }

  executiveclose() {
    $("input[name='executiveFilter']").prop("checked", false);
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.executivefilterview = false;
    this.execid = null;
    this.execname = null
    this.rmid = null;
    this.searchTerm_executive = '';
    this.mandateExecutivesFilter = this.copyMandateExecutives;
    this.router.navigate([], {
      queryParams: {
        execid: null,
        execname: null
      },
      queryParamsHandling: 'merge',
    });
  }

  propertyclose() {
    $("input[name='propFilter']").prop("checked", false);
    this.propertyfilterview = false;
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.propertyid = "";
    this.stagestatusval = "";
    this.searchTerm = '';
    if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
      this.getExecutivesForFilter();
    }
    this.mandateprojects = this.copyofmandateprojects;
    this.router.navigate([], {
      queryParams: {
        property: "",
        propname: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  csexecutiveclose() {
    $("input[name='executiveFilter']").prop("checked", false);
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.csexecutivefilterview = false;
    this.csexecid = "";
    this.csexecname = "";
    this.searchTerm_executive = '';
    this.searchcsTerm_executive = '';
    this.csListExecutives = this.copyOfcsListExecutives;
    this.router.navigate([], {
      queryParams: {
        csexecid: "",
        csexecname: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  sourceClose() {
    $("input[name='sourceFilter']").prop("checked", false);
    this.sourceFilter = false;
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.source = "";
    this.searchTerm_source = '';
    this.sourceList = this.copyofsources;
    this.router.navigate([], {
      queryParams: {
        source: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  receivedDateclose() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.receivedDatefilterview = false;
    this.receivedFromDate = "";
    this.receivedToDate = "";
    this.router.navigate([], {
      queryParams: {
        receivedFrom: "",
        receivedTo: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  stageclose() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    this.stagefilterview = false;
    this.categeoryfilterview = false;
    this.stagestatus = true;
    this.stagevalue = "";
    this.stagestatusval = "";
    this.categoryStage = '';
    this.categoryStageName = '';
    this.router.navigate([], {
      queryParams: {
        stage: "",
        stagestatus: "",
        followupcategory: '',
        followupcategoryName: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  //this load  is for assigned lead page.
  loadMoreassignedleads() {
    let limit;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limit = MandateFeedbackComponent.count += 100;
    // } else {
    limit = MandateFeedbackComponent.count += 30;
    // }
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    if (this.pendingleadsparam == 1) {
      var param = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'pending',
        stage: this.stagevalue,
        source: this.source,
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        csexecid: this.csexecid,
        loginuser: this.userid,
        priority: this.priorityName,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      let livecount = this.callerleads.length;
      if (livecount < this.pendingleadcounts) {
        this._mandateService.feedbackAssignedLeads(param).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.ncleadsparam == 1) {
      var paramN = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'NC',
        source: this.source,
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        csexecid: this.csexecid,
        loginuser: this.userid,
        priority: this.priorityName,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      let livecount = this.callerleads.length;
      if (livecount < this.ncCounts) {
        this._mandateService.feedbackAssignedLeads(paramN).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.usvParam == 1) {
      var usvpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'USV',
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
        csexecid: this.csexecid,
        loginuser: this.userid,
        priority: this.priorityName,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
      }
      let livecount = this.callerleads.length;
      if (livecount < this.usvCounts) {
        this._mandateService.feedbackAssignedLeads(usvpar).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.rsvParam == 1) {
      var rsvpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'RSV',
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
        csexecid: this.csexecid,
        loginuser: this.userid,
        priority: this.priorityName,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
      }
      let livecount = this.callerleads.length;
      if (livecount < this.rsvCounts) {
        this._mandateService.feedbackAssignedLeads(rsvpar).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.fnParam == 1) {
      var fnpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Final Negotiation',
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
        csexecid: this.csexecid,
        loginuser: this.userid,
        priority: this.priorityName,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
      }
      let livecount = this.callerleads.length;
      if (livecount < this.fnCounts) {
        this._mandateService.feedbackAssignedLeads(fnpar).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.junkvisitsParam == 1) {
      // let statestatusval;
      // if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == null) {
      //   statestatusval = '3';
      // } else {
      //   statestatusval = this.stagestatusval;
      // }
      var jvparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkvisits',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
        csexecid: this.csexecid,
        loginuser: this.userid,
        priority: this.priorityName,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
      }
      let livecount = this.callerleads.length;
      if (livecount < this.junkvisitsCounts) {
        this._mandateService.feedbackAssignedLeads(jvparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    }
  }

  refresh() {
    this._mandateService.setControllerName('');
    this.stagevalue = "";
    this.stagestatusval = "";
    this.propertyname = '';
    this.execname = '';
    this.execid = '';
    this.rmid = '';
    this.propertyid = "";
    this.team = '';
    this.priorityName = '';
    this.stagestatusvaltext = '';
    this.additionalParam = '';
    this.fromdate = '';
    this.todate = '';
    this.source = '';
    this.filterLeads = '';
    this.selectedLeadStatus = '';
    this.selectedBookingLeadStatus = '';
    this.leadstatusVisits = '';
    this.leadBookingstatus = '';
    this.categoryStage = '';
    this.categoryStageName = '';
    this.receivedFromDate = '';
    this.receivedToDate = '';
    this.visitedFrom = '';
    this.visitedTo = '';
    this.visitedDateRange = [this.todaysdateforcompare];
    this.dateRange = [this.todaysdateforcompare];
    this.nextActionDateRange = [this.todaysdateforcompare];
    this.assignedOnDateRange = [this.todaysdateforcompare];
    this.assignedFrom = '';
    this.assignedTo = '';
    this.overduejunk = '',
      this.csexecname = '';
    this.csexecid = '';

    this.propertyclose();
    this.csexecutiveclose();
    this.stageclose();
    this.executiveclose();
    this.sourceClose();
    this.receivedDateclose();
    this.visitedDateclose();
    this.assignedOnDateclose();
    this.sourceFilter = false;
    this.stagestatus = false;
    this.propertyfilterview = false;
    this.priorityFilter = false;
    this.categeoryfilterview = false;
    this.receivedDatefilterview = false;

    if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    } else {
      this.rmid = "";
    }

    this.router.navigate([], {
      queryParams: {
        from: '',
        to: '',
        property: '',
        propname: '',
        execid: null,
        execname: null,
        stage: '',
        stagestatus: '',
        team: null,
        priority: null,
        source: null,
        filterData: '',
        bookingLeadRequest: '',
        visits: '',
        followupcategory: '',
        followupcategoryName: '',
        receivedFrom: '',
        receivedTo: '',
        visitedfrom: '',
        visitedto: '',
        assignedfrom: "",
        assignedto: "",
        csexecid: '',
        csexecname: '',
      },
      queryParamsHandling: 'merge',
    });
    $("input[name='propFilter']").prop("checked", false);
    $("input[name='executiveFilter']").prop("checked", false);
    $("input[name='sourceFilter']").prop("checked", false);
    this.apitrigger();
  }

  getsourcelist() {
    this._sharedservice.sourcelist().subscribe(sources => {
      sources.filter((sou) => {
        if (sou.source == 'GR - Microsite') {
          sou.source = 'GR - campaign';
        }
      })
      this.sourceList = sources;
      this.copyofsources = sources;
    })
  }

  closehistory() {
    $('.remarksection').removeAttr("style");
    $('.panel-1').removeAttr("style");
    $('.CSassigned_table').removeAttr("style");
  }

  morefilter() {
    document.getElementsByClassName('more_filter_maindiv')[0].removeAttribute("hidden");
    $('.modalclick').addClass('modal-backdrop');
    $('.modalclick').addClass('fade');
    $('.modalclick').addClass('show');
  }

  apitrigger() {
    if (this.csexecid == '' || this.csexecid == undefined || this.csexecid == null) {
      if (this.roleid != 1 && this.roleid != '2') {
        this.csexecid = localStorage.getItem('UserId');
      }
    }
    if ((this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) && this.pendingleadsparam != '1') {
      this.stagestatusfilterview = false;
      this.stagestatusval = '3';
    } else {
      this.stagestatusfilterview = true;
      if (this.stagestatusval == '1') {
        this.stagestatusvaltext = "Fixed";
      } else if (this.stagestatusval == '2') {
        this.stagestatusvaltext = "Refixed";
      } else if (this.stagestatusval == '3') {
        this.stagestatusvaltext = "Done";
        if (this.junkvisitsParam != 1) {
          this.stagefilterview = false;
          this.stagestatusfilterview = false;
        }
      }
    }
    if (this.pendingleadsparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.pendingleadsdata();
    } else if (this.usvParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.usvdatas();
    } else if (this.rsvParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.rsvdatas();
    } else if (this.fnParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.fndatas();
    } else if (this.junkvisitsParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.junkvisitsdatas();
    }
  }

  //on clicking on reassign button reassign section will be shown
  onclickReAssign() {
    if (this.pendingleadsparam == '1') {
      this.reassignleadsCount = this.pendingleadcounts;
    } else if (this.usvParam == '1') {
      this.reassignleadsCount = this.usvCounts;
    } else if (this.rsvParam == '1') {
      this.reassignleadsCount = this.rsvCounts;
    } else if (this.fnParam == '1') {
      this.reassignleadsCount = this.fnCounts;
    } else if (this.junkvisitsParam == '1') {
      this.reassignleadsCount = this.junkvisitsCounts;
    }
    this.selectedEXECUTIVES = [];
    this.selectedEXECUTIVES = [];
    $('#mandateExec_dropdown').dropdown('clear');
    $('#leadcount_dropdown').dropdown('clear');
    $('#property_dropdown').dropdown('clear');

    this._mandateService.fetchmandateexecutuves('', '', '50014', '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.csListExecutives = executives['mandateexecutives'];
        this.copyOfcsListExecutives = executives['mandateexecutives'];
      }
    });
  }

  //here we get the select counts of leads for retail
  selectcounts(event) {
    if (event.target.value > 30) {
      this.getReassignLeadsData(parseInt(event.target.value));
    } else {
      $('#start2 tr td :checkbox').each(function () {
        this.checked = false;
      });
      var checkBoxes = $("#start2 tr td :checkbox:lt(" + event.target.value + ")");
      $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));

      if (event.target.value == 'Manual') {
        $('input[id="hidecheckboxid"]').attr("disabled", false);
        $('.hidecheckbox').show();
        this.getselectedleads();
      } else {
        $('.hidecheckbox').hide();
        $('input[id="hidecheckboxid"]:checked').show();
        $('input[id="hidecheckboxid"]:checked').attr("disabled", true);
        this.getselectedleads();
      }
    }
  }

  getselectedleads() {
    var selectedObjects = $("input[name='programming']:checked").map(function () {
      return JSON.parse($(this).attr('data-assign'));
    }).get();

    let selectedAssignedleads = selectedObjects.map((lead) => {
      return lead.LeadID;
    })

    this.selectedAssignedleads = selectedAssignedleads.join(',');

    if (this.selectedAssignedleads != '') {
      this.maxSelectedLabels = selectedObjects.length;
    }
    let selectedLeadExecutiveIds = selectedObjects.map((lead) => {
      return lead.RMID;
    })

    this.selectedLeadExecutiveIds = selectedLeadExecutiveIds.join(',')
    // var checkid = $("input[name='programming']:checked").map(function () {
    //   return this.value;
    // }).get().join(',');
    // this.selectedAssignedleads = checkid;
    // if (this.selectedAssignedleads != '') {
    //   var arraylist = this.selectedAssignedleads.split(',');
    //   this.maxSelectedLabels = arraylist.length;
    // }
  }

  //here we get the list of followups list
  getFollowupsStatus() {
    this._mandateService.getfollowupsections().subscribe(followupsection => {
      this.followupsections = followupsection;
      if (this.followupleadsparam == 1) {
        let id = [1, 5]
        this.followctgFilter = this.followupsections.filter((da) => id.some((num) => {
          return da.followup_section_IDPK == num
        }));
      } else {
        let id = [1, 8, 5]
        this.followctgFilter = this.followupsections.filter((da) => !id.some((num) => {
          return da.followup_section_IDPK == num
        }));
      }
    });
  }

  filteredproject: any = '';
  //here we get the selected reassign mandate property
  reassignPropChange(event) {
    this.selectedMandateProp = event.target.value;
    if (this.mandateprojects) {
      let filteredproject = this.mandateprojects.filter((da) => da.property_idfk == event.target.value);
      if (filteredproject && filteredproject[0]) {
        this.filteredproject = filteredproject[0];
      }
    }

    this._mandateService.fetchmandateexecutuves(this.selectedMandateProp, this.selectedReassignTeamType, this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        setTimeout(() => {
          this.reassignListExecutives = executives['mandateexecutives'];
        }, 0)
        // this.reassignListExecutives = this.reassignListExecutives.filter((da) => !(this.selectedExecIds.includes(da.id)));
      } else {
        this.reassignListExecutives = [];
      }
    });
  }

  //here on clicking random assign the leads will be divided equally assigned 
  checkRandom(event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked == true) {
      this.selectedEXEC = [];
      this.randomCheckVal = 1;
    } else {
      this.selectedEXEC = [];
    }
  }

  //here we get th list of selected rmid's
  reAssignexecutiveSelect(event) {
    this.selectedEXECUTIVEIDS = this.selectedEXECUTIVES.map((exec) => exec.id);
  }

  //here we are reassinging the leads now
  getAssignedLeadsList() {
    if (this.selectedMandateProp == '') {
      $('#property_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Property');
      swal({
        title: 'Please Select Property!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    }
    else {
      $('#property_dropdown').removeAttr("style");
      // this.filterLoader = true;
    }

    if (this.selectedAssignedleads == undefined || this.selectedAssignedleads == "") {
      swal({
        title: 'Please Select Some Leads!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    }
    else {
      $('#selectedleads').removeAttr("style");
    }

    if (this.selectedEXECUTIVES == undefined || this.selectedEXECUTIVES.length == 0) {
      $('#mandateExec_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Executives');
      $('#retailExec_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Executives');
      swal({
        title: 'Please Select The Executive!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    }
    else {
      $('#mandateExec_dropdown').removeAttr("style");
      $('#retailExec_dropdown').removeAttr("style");
    }

    let comma_separated_data = this.selectedEXECUTIVEIDS.join(',');
    this.filterLoader = true;
    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let param = {
      assignedleads: this.selectedAssignedleads,
      customersupport: comma_separated_data,
      randomval: this.randomCheckVal,
      loginid: this.userid,
      executiveIds: this.selectedLeadExecutiveIds
    }
    this._mandateService.feedbackassign(param).subscribe((success) => {
      this.filterLoader = false;
      this.status = success.status;
      if (this.status == "True") {
        $('#closereassignmodal').click();
        swal({
          title: 'Assigned Successfully',
          type: 'success',
          confirmButtonText: 'Show Details'
        }).then(() => {
          this.reassignedResponseInfo = success['assignedleads'];
          $('#reassign_leads_detail').click();
        })
        $('#exec_dropdown').dropdown('clear');
        $('#leadcount_dropdown').dropdown('clear');
        $('#property_dropdown').dropdown('clear');
        $('#mandate_dropdown').dropdown('clear');
        $('#mandateExec_dropdown').dropdown('clear');
        this.selectedMandateProp = '';
        this.randomCheckVal = '';
        this.selectedEXEC = [];
        this.selectedEXECUTIVEIDS = [];
        this.selectedEXECUTIVES = [];
        this.selectedExecIds = [];
      } else {
        swal({
          title: 'Authentication Failed!',
          text: 'Please try again',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    });

  }

  //this is code for filter for direct and assigned
  leadStatus(event) {
    this.selectedLeadStatus = event;
    if (event == 'All') {
      this.leadstatusVisits = '';
      this.router.navigate([], {
        queryParams: {
          visits: ''
        },
        queryParamsHandling: 'merge',
      });
    } else if (event == 'Assigned') {
      this.router.navigate([], {
        queryParams: {
          visits: '2'
        },
        queryParamsHandling: 'merge',
      });
    } else if (event == 'Direct Visits') {
      if (this.pendingleadsparam == 1 || this.followupleadsparam == 1) {
        this.router.navigate([], {
          queryParams: {
            usv: 1,
            visits: '1'
          },
        });
      } else {
        this.router.navigate([], {
          queryParams: {
            visits: '1'
          },
          queryParamsHandling: 'merge',
        });
      }
    }
  }

  bookingLeadStatus(type) {
    this.selectedBookingLeadStatus = type;
    if (type == 'All') {
      this.leadBookingstatus = '';
      this.router.navigate([], {
        queryParams: {
          bookingLeadRequest: ''
        },
        queryParamsHandling: 'merge',
      });
    } else if (type == 'Rejected') {
      this.router.navigate([], {
        queryParams: {
          bookingLeadRequest: 1
        },
        queryParamsHandling: 'merge',
      });
    } else if (type == 'Pending') {
      this.router.navigate([], {
        queryParams: {
          bookingLeadRequest: 2
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  removeselectedLeadStatus() {
    this.selectedLeadStatus = '';
    this.selectedBookingLeadStatus = '';
    this.router.navigate([], {
      queryParams: {
        bookingLeadRequest: '',
        visits: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  //property selection  filter
  onCheckboxChange(property) {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    if (property != null || property != '' || property != undefined) {
      this.propertyfilterview = true;
      this.propertyname = property.property_info_name;
      this.propertyid = property.property_idfk;
      this.execid = '';
      this.execname = '';
      this.csexecid = '';
      this.csexecname = '';
      if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
        this.getExecutivesForFilter();
      }
      $("input[name='executiveFilter']").prop("checked", false);
      this.router.navigate([], {
        queryParams: {
          property: this.propertyid,
          propname: this.propertyname,
          team: "",
          execid: '',
          execname: '',
          csexecid: '',
          csexecname: ''
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.propertyfilterview = false;
      this.propertyname = '';
      this.propertyid = '';
    }

  }

  // Filter projects based on search 
  filterProjects(): void {
    if (this.searchTerm != '') {
      this.mandateprojects = this.copyofmandateprojects.filter(project =>
        project.property_info_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.mandateprojects = this.copyofmandateprojects
    }

  }

  //executives selection  filter
  onCheckboxExecutiveChange() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    var checkid = $("input[name='executiveFilter']:checked").map(function () {
      return this.value;
    }).get().join(',');
    let filteredExexIds;
    filteredExexIds = checkid.split(',');

    let filteredExecName;
    filteredExecName = this.copyMandateExecutives.filter((da) => filteredExexIds.some((prop) => {
      return prop == da.id
    }));
    filteredExecName = filteredExecName.map((name) => name.name);

    if (filteredExecName != '' || filteredExecName != undefined) {
      this.executivefilterview = true;
      this.execname = filteredExecName;
      this.execid = filteredExexIds;
      this.router.navigate([], {
        queryParams: {
          execid: this.execid,
          execname: this.execname
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.executivefilterview = false;
      this.execid = '';
      this.execname = '';
    }

  }

  // Filter executives based on search 
  filterExecutive(): void {
    if (this.searchTerm_executive != '') {
      this.mandateExecutivesFilter = this.copyMandateExecutives.filter(exec =>
        exec.name.toLowerCase().includes(this.searchTerm_executive.toLowerCase())
      );
    } else {
      this.mandateExecutivesFilter = this.copyMandateExecutives
    }

  }

  onCheckboxCSExecutiveChange() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    var checkid = $("input[name='executiveFilter']:checked").map(function () {
      return this.value;
    }).get().join(',');
    let filteredExexIds;
    filteredExexIds = checkid.split(',');

    let filteredExecName;
    filteredExecName = this.copyOfcsListExecutives.filter((da) => filteredExexIds.some((prop) => {
      return prop == da.id
    }));
    filteredExecName = filteredExecName.map((name) => name.name);
    if (filteredExecName != '' || filteredExecName != undefined) {
      this.csexecutivefilterview = true;
      this.csexecname = filteredExecName;
      this.csexecid = filteredExexIds;
      this.router.navigate([], {
        queryParams: {
          csexecid: this.csexecid,
          csexecname: this.csexecname
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.csexecutivefilterview = false;
      this.csexecid = '';
      this.csexecname = '';
    }

  }

  // Filter projects based on search 
  filterCSExecutive(): void {
    if (this.searchcsTerm_executive != '') {
      this.csListExecutives = this.copyOfcsListExecutives.filter(exec =>
        exec.name.toLowerCase().includes(this.searchcsTerm_executive.toLowerCase())
      );
    } else {
      this.csListExecutives = this.copyOfcsListExecutives
    }
  }

  //get list of mandate executives for mandate for filter purpose
  getExecutivesForFilter() {
    if (this.role_type != 1) {
      this._mandateService.fetchmandateexecutuvesforreassign(this.propertyid, '', '', '50002', '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    } else {
      this._mandateService.fetchmandateexecutuvesforreassign(this.mandateProperty_ID, 2, '', '50002', '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    }
  }

  getCsExecutives() {
    this._mandateService.fetchmandateexecutuvesforreassign(this.mandateProperty_ID, 2, '', '50014', '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.csListExecutives = executives['mandateexecutives'];
        this.copyOfcsListExecutives = executives['mandateexecutives'];
      }
    });
  }


  onCheckboxChangesource() {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    var checkid = $("input[name='sourceFilter']:checked").map(function () {
      return this.value;
    }).get().join(',');

    let filteredsourceIds;
    filteredsourceIds = checkid.split(',');

    let sources = filteredsourceIds.map((source) => {
      if (source === "GR - campaign") {
        return "GR - Microsite";
      } else {
        return source;
      }
    });

    if (checkid != '' || checkid != undefined) {
      this.sourceFilter = true;
      this.source = sources.join(',');
      this.router.navigate([], {
        queryParams: {
          source: this.source,
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.sourceFilter = false;
      this.stagevalue = '';
    }

  }

  // Filter projects based on search 
  filtersource(): void {
    if (this.searchTerm_source != '') {
      this.sourceList = this.copyofsources.filter(project =>
        project.source.toLowerCase().includes(this.searchTerm_source.toLowerCase())
      );
    } else {
      this.sourceList = this.copyofsources
    }

  }

  onCheckboxstageCategoryChange(category) {
    MandateFeedbackComponent.closedcount = 0;
    MandateFeedbackComponent.count = 0;
    if (category != '' || category != undefined) {
      this.categeoryfilterview = true;
      this.categoryStage = category.followup_section_IDPK;
      this.categoryStageName = category.followup_categories;
      this.router.navigate([], {
        queryParams: {
          followupcategory: this.categoryStage,
          followupcategoryName: this.categoryStageName,
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.categeoryfilterview = false;
      this.categoryStage = '';
      this.categoryStageName = '';
    }

  }

  // Filter projects based on search 
  filterStageCategory(): void {
    if (this.searchTerm_stagecategory != '') {
      this.followctgFilter = this.followctgFilter.filter(exec =>
        exec.followup_categories.toLowerCase().includes(this.searchTerm_stagecategory.toLowerCase())
      );
    } else {
      if (this.followupleadsparam == 1) {
        let id = [1, 8]
        this.followctgFilter = this.followupsections.filter((da) => id.some((num) => {
          return da.followup_section_IDPK == num
        }));
      } else {
        let id = [1, 8]
        this.followctgFilter = this.followupsections.filter((da) => !id.some((num) => {
          return da.followup_section_IDPK == num
        }));
      }
    }
  }

  closeDetailModal() {
    setTimeout(() => {
      let currentUrl = this.router.url;
      let pathWithoutQueryParams = currentUrl.split('?')[0];
      let currentQueryparams = this.route.snapshot.queryParams;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
      });
    }, 0)
  }

  initializeNextActionDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#nextActionDates span').html(start.format('MMMM D, YYYY HH:mm:ss') + ' - ' + end.format('MMMM D, YYYY HH:mm:ss'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          $(this).data('daterangepicker').setEndDate(end);
        }
      } else {
        $('#nextActionDates span').html('Select Date Range');
      }

      if (start && end) {
        this.fromdate = start.format('YYYY-MM-DD');
        this.todate = end.format('YYYY-MM-DD');
        this.fromTime = start.format('HH:mm:ss');
        this.toTime = end.format('HH:mm:ss');
        this.datefilterview = true;
        this.router.navigate([], {
          queryParams: {
            from: this.fromdate,
            to: this.todate,
            fromtime: this.fromTime,
            totime: this.toTime
          },
          queryParamsHandling: 'merge',
        });
      } else {
      }
    };
    // Retrieve the date range from the URL query params (if any)
    const urlParams = new URLSearchParams(window.location.search);
    const fromDate = urlParams.get('from');
    const toDate = urlParams.get('to');
    const fromTime = urlParams.get('fromtime');
    const toTime = urlParams.get('totime');
    // Initialize start and end dates based on URL parameters or default values
    let startDate = fromDate ? moment(fromDate) : moment().startOf('day');
    let endDate = toDate ? moment(toDate) : moment().endOf('day');

    if (fromTime && fromDate) {
      startDate = moment(fromDate + ' ' + fromTime, 'YYYY-MM-DD hh:mm A');
    }

    if (toTime && toDate) {
      endDate = moment(toDate + ' ' + toTime, 'YYYY-MM-DD hh:mm A');
    }

    $('#nextActionDates').daterangepicker({
      startDate: startDate || moment().startOf('day'),
      endDate: endDate || moment().startOf('day'),
      showDropdowns: false,
      timePicker: true,
      timePickerIncrement: 1,
      locale: {
        format: 'MMMM D, YYYY h:mm A'
      },
      autoApply: true,
    }, cb);
    cb(this.nextActionStart, this.nextActionEnd);
  }

  //here we get the datepicker for Assigned on filter
  initializeAssignedOnDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#assigedOnDates span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          $(this).data('daterangepicker').setEndDate(end);
        }
      } else {
        $('#assigedOnDates span').html('Select Date Range');
      }

      if (start && end) {
        this.assignedFrom = start.format('YYYY-MM-DD');
        this.assignedTo = end.format('YYYY-MM-DD');
        this.assignedOnDatefilterview = true;
        this.router.navigate([], {
          queryParams: {
            assignedfrom: this.assignedFrom,
            assignedto: this.assignedTo
          },
          queryParamsHandling: 'merge',
        });
      } else {
      }
    };
    // Retrieve the date range from the URL query params (if any)
    const urlParams = new URLSearchParams(window.location.search);
    const fromDate = urlParams.get('from');
    const toDate = urlParams.get('to');
    const fromTime = urlParams.get('fromtime');
    const toTime = urlParams.get('totime');
    // Initialize start and end dates based on URL parameters or default values
    let startDate = fromDate ? moment(fromDate) : moment().startOf('day');
    let endDate = toDate ? moment(toDate) : moment().endOf('day');

    if (fromTime && fromDate) {
      startDate = moment(fromDate + ' ' + fromTime, 'YYYY-MM-DD');
    }

    if (toTime && toDate) {
      endDate = moment(toDate + ' ' + toTime, 'YYYY-MM-DD');
    }

    $('#assigedOnDates').daterangepicker({
      startDate: startDate || moment().startOf('day'),
      endDate: endDate || moment().startOf('day'),
      showDropdowns: false,
      maxDate: new Date(),
      timePicker: false,
      timePickerIncrement: 1,
      locale: {
        format: 'MMMM D, YYYY h:mm A'
      },
      autoApply: true,
    }, cb);
    cb(this.assignedOnStart, this.assignedOnEnd);
  }

  //here we get the datepicker for visited on filter
  initializeVisitedOnDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#visitedOnDates span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          $(this).data('daterangepicker').setEndDate(end);
        }
      } else {
        $('#visitedOnDates span').html('Select Date Range');
      }

      if (start && end) {
        this.visitedFrom = start.format('YYYY-MM-DD');
        this.visitedTo = end.format('YYYY-MM-DD');
        this.visitedDatefilterview = true;
        this.router.navigate([], {
          queryParams: {
            visitedfrom: this.visitedFrom,
            visitedto: this.visitedTo
          },
          queryParamsHandling: 'merge',
        });
      } else {
      }
    };
    // Retrieve the date range from the URL query params (if any)
    const urlParams = new URLSearchParams(window.location.search);
    const fromDate = urlParams.get('from');
    const toDate = urlParams.get('to');
    const fromTime = urlParams.get('fromtime');
    const toTime = urlParams.get('totime');
    // Initialize start and end dates based on URL parameters or default values
    let startDate = fromDate ? moment(fromDate) : moment().startOf('day');
    let endDate = toDate ? moment(toDate) : moment().endOf('day');

    if (fromTime && fromDate) {
      startDate = moment(fromDate + ' ' + fromTime, 'YYYY-MM-DD');
    }

    if (toTime && toDate) {
      endDate = moment(toDate + ' ' + toTime, 'YYYY-MM-DD');
    }

    $('#visitedOnDates').daterangepicker({
      startDate: startDate || moment().startOf('day'),
      endDate: endDate || moment().startOf('day'),
      showDropdowns: false,
      maxDate: new Date(),
      timePicker: false,
      timePickerIncrement: 1,
      locale: {
        format: 'MMMM D, YYYY h:mm A'
      },
      autoApply: true,
    }, cb);
    cb(this.visitedOnStart, this.visitedOnEnd);
  }

  getReassignLeadsData(limitR) {
    this.filterLoader = true;
    let param;
    if (this.pendingleadsparam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'pending',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
    } else if (this.ncleadsparam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'NC',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
    } else if (this.usvParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'USV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
      }
    } else if (this.rsvParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'RSV',
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
      }
    } else if (this.fnParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Final Negotiation',
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
      }
    } else if (this.junkvisitsParam == 1) {
      let stagestatus;
      if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
        stagestatus = '3';
      }
      else {
        stagestatus = this.stagestatusval;
      }

      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkvisits',
        stage: this.stagevalue,
        stagestatus: stagestatus,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime
      }
    }

    this._mandateService.feedbackAssignedLeads(param).subscribe(compleads => {
      if (compleads.status == 'True') {
        this.filterLoader = false;
        this.callerleads = compleads['AssignedLeads'];
        setTimeout(() => {
          $('#start2 tr td :checkbox').each(function () {
            this.checked = false;
          });
          var checkBoxes = $("#start2 tr td :checkbox:lt(" + limitR + ")");
          $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));

          if (limitR == 'Manual') {
            $('input[id="hidecheckboxid"]').attr("disabled", false);
            $('.hidecheckbox').show();
            this.getselectedleads();
          } else {
            $('.hidecheckbox').hide();
            $('input[id="hidecheckboxid"]:checked').show();
            $('input[id="hidecheckboxid"]:checked').attr("disabled", true);
            this.getselectedleads();
          }
        }, 1000)
      }
    });
  }

  isModalOpen: boolean = false;
  triggerCall(lead) {

    let number = lead.number.toString().trim();

    if (number.startsWith('+')) {
      number = number.substring(1);
    }

    const mobileRegex = /^(?:[0-9]{10}|91[0-9]{10})$/;

    if (!mobileRegex.test(number)) {
      swal({
        title: 'Invalid Mobile Number',
        html: `The mobile number <b>${lead.number}</b> is not valid`,
        type: 'error',
        timer: 3000,
        showConfirmButton: false
      });
      return false;
    }

    this.calledLead = lead;
    this.assignedRm = lead.ExecId;
    localStorage.setItem('calledLead', JSON.stringify(lead));
    localStorage.setItem('callerTriggeredPlace', 'mandate');
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
    if (this.roleid != 50001 && this.roleid != 50002) {
      this.copyToClipboard(lead.number);
    }
    swal({
      title: 'Initiate Outbound Call',
      html: `Do you want to place a call to <br><stronsg>${lead.CustomerName}</strong> (${((lead.Leadphase != 'Fresh' || (lead.Leadphase == 'Fresh' && lead.followupreason == 8) || this.roleid == 1 || this.roleid == 2) ? lead.number : 'xxxxxxxxxx')})`,
      type: 'warning',
      confirmButtonText: "Call",
      cancelButtonText: "Cancel",
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }).then((val) => {
      this.filterLoader = true;
      if (val.value == true) {
        const cleanedNumber = lead.number.startsWith('91') && lead.number.length > 10 ? lead.number.slice(2) : lead.number;
        let param = {
          execid: this.userid,
          number: cleanedNumber,
          leadid: lead.LeadID,
          starttime: formattedDateTime,
          modeofcall: 'Desktop-mandate',
          rmid: lead.ExecId
        }
        this._sharedservice.postTriggerCall(param).subscribe((resp) => {
          this.filterLoader = false;
          if (resp.status == 'success') {
            this._sharedservice.setOnCallSelection('oncall')
            // setTimeout(() => {
            //   $('#call_modal_detail').click();
            //   const script = document.createElement('script');
            //   script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
            //   script.type = 'module';
            //   script.async = true;
            //   script.id = "dashboard_dynamic_links_5";
            //   document.head.appendChild(script);
            //   this.isModalOpen = true;
            // }, 0)
          } else {
            swal({
              title: 'Call Not Connected',
              html: `The call could not be completed to <br><stronsg>${lead.CustomerName}</strong> (${lead.number}) Please try again later.`,
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

  onCallModalClose() {
  }

  liveCallData: any;
  // getLiveCallsData() {
  //   this._sharedservice.getLiveCallsList(localStorage.getItem('UserId')).subscribe((resp) => {
  //     if (resp.status == 'success') {

  //       console.log(this.liveCallData, 'live class')
  //       // const script = document.createElement('script');
  //       // script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
  //       // script.type = 'module';
  //       // script.async = true;
  //       // script.id = "dashboard_dynamic_links_5";
  //       // document.head.appendChild(script);

  //       this.liveCallData = resp.success[0];
  //     } else {
  //       this.liveCallData = '';
  //     }
  //     // this.cdr.detectChanges();
  //   })
  // }

  moveToWhatsapp(lead) {
    this.router.navigate(['/client-chat'], {
      queryParams: {
        allchat: 1,
        chatid: lead.number,
        index: 0,
        execid: '',
        click: 1
      }
    })
  }

  copyToClipboard(text) {
    if ((navigator as any).clipboard) {
      (navigator as any).clipboard.writeText(text).then(() => {
        console.log('Number copied to clipboard!');
      }).catch(() => {
        console.log('Failed to copy number.');
      });
    }
  }

  recordingList(lead) {
    this.calledLead = lead;
    this.selectedRecordExec = this.calledLead.RMID;
    $('#call_record_modal_detail').click();
    this.getRecordListByLead();
  }

  getRecordListByLead() {
    let param = {
      number: this.calledLead.number,
      execid: this.selectedRecordExec,
      loginid: this.userid
    }
    this.filterLoader = true;
    this._sharedservice.getAllCalls(param).subscribe({
      next: (resp) => {
        this.filterLoader = false;
        this.onRecordExecList = resp.executives;
        this.audioList = resp.success;
      },
      error: (err) => {
        this.filterLoader = false;
        this.audioList = [];
        this.onRecordExecList = [];
        console.log('Something issue from API end', err)
      }
    })
  }

  onRecordModalClose() {

  }

  getexecutiveId(exec) {
    this.selectedRecordExec = exec.Exec_IDFK;
    this.getRecordListByLead();
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

  detailsPageRedirection() {
    localStorage.setItem('backLocation', 'feedback');
  }

  redirectTo(lead) {
    console.log(lead);
    // save data
    this._sharedservice.leads = this.callerleads;
    this._sharedservice.page = MandateFeedbackComponent.count;
    this._sharedservice.scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this._sharedservice.hasState = true;

    localStorage.setItem('backLocation', '');

    let tab;
    if (this.pendingleadsparam == 1) {
      tab = 'pendingleadsparam'
    } else if (this.ncleadsparam == 1) {
      tab = 'ncleadsparam'
    } else if (this.usvParam == 1) {
      tab = 'usvParam';
    } else if (this.rsvParam == 1) {
      tab = 'rsvParam';
    } else if (this.fnParam == 1) {
      tab = 'fnParam';
    } else if (this.junkvisitsParam == 1) {
      tab = 'junkvisitsParam';
    }

    const state = {
      source: this.source,
      propertyid: this.propertyid,
      propertyname: this.propertyname,
      execid: this.execid,
      execname: this.execname,
      page: MandateFeedbackComponent.count,
      scrollTop: this.scrollContainer.nativeElement.scrollTop,
      leads: this.callerleads,
      tabs: tab,
      csexecname: this.csexecname,
      csexecid: this.csexecid,
      from: this.fromdate,
      to: this.todate,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedFrom,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      stage: this.stagevalue,
      stagestatus: this.stagestatusval
    };

    sessionStorage.setItem('feedback_state', JSON.stringify(state));

    this.router.navigate([
      '/mandate-customers',
      lead.LeadID,
      lead.RMID,
      1,
      'mandate',
      lead.propertyid
    ]);
  }
}
