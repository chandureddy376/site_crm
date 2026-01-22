import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';
import { sharedservice } from '../../../shared.service';
import { retailservice } from '../../../retail.service';
import { MandateClassService } from '../../../mandate-class.service';
import * as XLSX from "xlsx";
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { EchoService } from '../../../echo.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-lead-stages',
  templateUrl: './mandate-lead-stages.component.html',
  styleUrls: ['./mandate-lead-stages.component.css']
})

export class MandateLeadStagesComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private _retailservice: retailservice, private _mandateService: mandateservice, private _sharedservice: sharedservice,
    private _mandateClassService: MandateClassService, private echoService: EchoService,
    public datepipe: DatePipe) {
    if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
      this.router.navigateByUrl('/login');
    };
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
      $('.ui.label.fluid.dropdown').dropdown({
        useLabels: false
      });
    }, 100);
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
  inactiveparam: any;
  Totalleadcounts: number = 0;;
  pendingleadcounts: any;
  followupleadcounts: any;
  inactivecounts: any;
  inactive1Count: number = 0;
  inactive2Count: number = 0;
  inactive3Count: number = 0;
  inactive4Count: number = 0;
  inactiveFinalCount: number = 0;
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
  selectedEXECUTIVES: any[] = [];
  selectedEXECUTIVEIDS: any;
  reassignListExecutives: any;
  retailreassignListExecutives: any;
  followupsections: any;
  selectedMandateProp = '';
  selectedReassignTeamType: any = '';
  selectedLeadExecutiveIds: any;
  reassignedResponseInfo: any;
  maxSelectedLabels: number = Infinity;
  dateRange: any;
  reassignfromdate: any;
  reassigntodate: any;
  untouchedParam: any;
  usvParam: any;
  rsvParam: any;
  fnParam: any;
  bookingRequestParam: any;
  bookingPendingParam: any;
  junkvisitsParam: any;
  junkleadsParam: any;
  bookedParam: any;
  junkleadsCounts: number = 0;
  junklead1Count: number = 0;
  junklead2Count: number = 0;
  junklead3Count: number = 0;
  junklead4Count: number = 0;
  junkleadFinalCount: number = 0;
  junkvisitsCounts: number = 0;
  junkvisits1Count: number = 0;
  junkvisits2Count: number = 0;
  junkvisits3Count: number = 0;
  junkvisits4Count: number = 0;
  junkvisitsFinalCount: number = 0;
  untouchedCounts: number = 0;
  usvCounts: number = 0;
  rsvCounts: number = 0;
  fnCounts: number = 0;
  bookingRequestCounts: number = 0;
  bookingPendingCounts: number = 0;
  bookedCounts: number = 0;
  untouchedStage: any;
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
  searchTerm_cs_executives: string = '';
  mandateExecutivesFilter: any;
  rmMandateExecutivesFilter: any;
  copyRmMandateExecutivesFilter: any;
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
  fromTime: any;
  toTime: any;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  leadRecStart: moment.Moment | null = null;
  leadRecEnd: moment.Moment | null = null;
  assignedOnStart: moment.Moment | null = null;
  assignedOnEnd: moment.Moment | null = null;
  visitedOnStart: moment.Moment | null = null;
  visitedOnEnd: moment.Moment | null = null;
  visitType: any;
  assignedVisitsBy: any;
  copyOfAssignedVisitsBy: any;
  csExecutivesList: any;
  visitAssignExecutivefilterview: boolean = false;
  visitAssignExecname: any;
  visitAssignExecid: any;
  calledLead: any;
  filteredproject: any = '';
  feedbackExecutive: any;
  assignedRm: any;
  // callStatus: any;
  isModalOpen: boolean = false;
  liveCallData: any;
  selectedRecordExec: any;
  audioList: any;
  onRecordExecList: any;
  serachRemarks: string = '';
  latestRemarkFilter: boolean = false;
  roleTeam: any;
  inactiveTotal: any;
  junkVisitsTotal: any;
  junkLeadsTotal: any;
  rnrCount: any;
  overduesSelection: boolean = false;
  overduesStage: any;
  todaysDate: Date;
  overduedReassignExecutives: any;
  selectedOverduesLead: any;
  selectedOverduedExecs: any;
  isRestoredFromSession = false;
  // *****************************Assignedleads section list*****************************

  ngOnInit() {

    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.role_type = localStorage.getItem('role_type');
    this.mandateProperty_ID = localStorage.getItem('property_ID');
    this.todaysDate = this.getTodayDate();
    // *********************load the required template files*********************
    this.mandateprojectsfetch();
    this.getExecutivesForFilter();

    const savedState = sessionStorage.getItem('lead_satges_state');

    if (savedState) {
      const state = JSON.parse(savedState);
      this.isRestoredFromSession = true;
      this.fromdate = state.fromdate;
      this.todate = state.todate;
      this.execid = state.execid;
      this.execname = state.execname
      this.propertyid = state.propertyid;
      this.propertyname = state.propertyname;
      this.leadstatusVisits = state.visits;
      this.categoryStage = state.followupcategory;
      this.categoryStageName = state.followupcategoryName;
      this.stagevalue = state.stage;
      this.stagestatusval = state.stagestatus;
      this.source = state.source;
      this.reassignfromdate = state.receivedfrom;
      this.reassigntodate = state.receivedto;
      this.rnrCount = state.rnrCount;
      this.priorityName = state.priority;
      this.visitAssignExecid = state.visitExecid;
      this.visitAssignExecname = state.visitExecname;
      this.assignedFrom = state.assignedfrom;
      this.assignedTo = state.assignedto;
      this.visitType = state.id;
      this.visitedFrom = state.visitedfrom;
      this.visitedTo = state.visitedto
      this.overduesSelection = state.overdues
      this.type = state.type;
      MandateLeadStagesComponent.count = state.page;
      this.callerleads = state.leads;

      if (this.overduesSelection) {
        this.overduesStage = 'overdues';
      } else {
        this.overduesStage = '';
      }

      if ((this.inactiveTotal == null || this.inactiveTotal == undefined || this.inactiveTotal == '') && this.inactiveparam == 1) {
        this.inactiveTotal = '1';
      }

      if ((this.junkLeadsTotal == null || this.junkLeadsTotal == undefined || this.junkLeadsTotal == '') && this.junkleadsParam == 1) {
        this.junkLeadsTotal = '1';
      }

      if ((this.junkVisitsTotal == null || this.junkVisitsTotal == undefined || this.junkVisitsTotal == '') && this.junkvisitsParam == 1) {
        this.junkVisitsTotal = '1';
      }

      if (this.followupleadsparam == '1' || this.normalcallparam == '1') {
        this.serachRemarks = state.remarks;
        if (this.serachRemarks && this.serachRemarks.length > 0) {
          this.latestRemarkFilter = true;
        } else {
          this.latestRemarkFilter = false;
        }
      } else {
        this.serachRemarks = '';
        this.latestRemarkFilter = false;
      }

      if (this.visitType != 1) {
        this.visitAssignExecid = '';
        this.visitAssignExecname = '';
      }

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

      if (this.role_type == '1' && this.visitType == '1') {
        this.getExecutivesForFilter();
      }

      if (this.execid) {
        this.executivefilterview = true;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == '1') {
          this.rmid = this.execid;
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      } else {
        this.executivefilterview = false;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == 1) {
          this.rmid = "";
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      }

      if (this.visitAssignExecid) {
        this.visitAssignExecutivefilterview = true;
      } else {
        this.visitAssignExecutivefilterview = false;
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

        if ((this.usvParam == 1 || this.rsvParam == 1 || this.fnParam == 1 || this.additionalParam == 'AllVisits') && (this.fromdate != '' && this.fromdate != undefined && this.fromdate != null && this.todate != '' && this.todate != undefined && this.todate != null)) {
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
        if (this.overduejunk != '4' && this.overduejunk != '5') {
          this.stagestatusval = '3';
        }
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

      if (this.priorityName) {
        if (this.priorityName == 1) {
          this.priorityType = 'Hot';
        } else if (this.priorityName == 2) {
          this.priorityType = 'Warm';
        } else if (this.priorityName == 3) {
          this.priorityType = 'Cold';
        }
        this.priorityFilter = true;
      } else {
        this.priorityFilter = false;
      }

      if (this.visitType == '' || this.visitType == undefined || this.visitType == null) {
        this.visitType = '3';
      }

      $(".other_section").removeClass("active");
      setTimeout(() => {
        if (state.tabs == 'pendingleadsparam') {
          this.pendingleadsparam = 1;
          $(".pending_section").addClass("active");
        } else if (state.tabs == 'followupleadsparam') {
          this.followupleadsparam = 1;
          $(".followups_section").addClass("active");
          this.getFollowupsStatus();
        } else if (state.tabs == 'normalcallparam') {
          this.normalcallparam = 1;
          $(".nc_section").addClass("active");
        } else if (state.tabs == 'inactiveparam') {
          this.inactiveparam = 1;
          $(".inactive_section").addClass("active");
          this.getFollowupsStatus();
        } else if (state.tabs == 'junkleadsParam') {
          this.junkleadsParam = 1;
          $(".junkleads_section").addClass("active");
        } else if (state.tabs == 'untouchedParam') {
          this.untouchedParam = 1;
          $(".untouched_section").addClass("active");
        } else if (state.tabs == 'usvParam') {
          this.usvParam = 1;
          $(".usv_section").addClass("active");
        } else if (state.tabs == 'rsvParam') {
          this.rsvParam = 1;
          $(".rsv_section").addClass("active");
        } else if (state.tabs == 'fnParam') {
          this.fnParam = 1;
          $(".fn_section").addClass("active");
        } else if (state.tabs == 'junkvisitsParam') {
          this.junkvisitsParam = 1;
          $(".junkvisits_section").addClass("active");
        } else if (state.tabs == 'bookingPendingParam') {
          this.bookingPendingParam = 1;
          $(".bookingPen_section").addClass("active");
        } else if (state.tabs == 'bookingRequestParam') {
          this.bookingRequestParam = 1;
          $(".booking_section").addClass("active");
        } else if (state.tabs == 'bookingRejectedParam') {
          this.bookingRejectedParam = 1;
          $(".bookingRej_section").addClass("active");
        } else if (state.tabs == 'bookedParam') {
          this.bookedParam = 1;
          $(".booked_section").addClass("active");
        }

        this.inactiveTotal = state.inactivecount;
        this.junkLeadsTotal = state.junkleadcount;
        this.junkVisitsTotal = state.junkvisitcount;

        this.batch1trigger();
      })

      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = state.scrollTop;
      }, 0);
      this.filterLoader = false;
      // 🔴 IMPORTANT
    }

    this.getleadsdata();
    // if (this.roleid != 1 && this.roleid != 2 && this.roleid != 50013 && this.roleid != 50014) {
    //   this._mandateService.fetchmandateexecutuvesforreassign(this.propertyid, '', '', '50014').subscribe(executives => {
    //     if (executives['status'] == 'True') {
    //       this.assignedVisitsBy = executives['mandateexecutives'];
    //       this.copyOfAssignedVisitsBy = executives['mandateexecutives'];
    //     }
    //   });
    // }

    // this.echoService.listenToDatabaseChanges((message) => {
    //   if (localStorage.getItem('UserId') == message.Executive && (message.Call_status == 'Call Disconnected' || message.Call_status == 'Call Connected')) {
    //     console.log(message, 'eco')
    //     this.callStatus = message.Call_status;
    //     setTimeout(() => {
    //       this.getLiveCallsData();
    //     }, 1000)
    //     return
    //   }
    // });


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
      // this.rmid = localStorage.getItem('UserId');
    } else {
    }

    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

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
    // MandateLeadStagesComponent.count = 0;
    // MandateLeadStagesComponent.closedcount = 0;
    if (this.roleid == 1 || this.roleid == '2' || this.roleid == '50013' || this.roleid == '50014') {
      this.getsourcelist();
    }
    // window.addEventListener('scroll', this.scrollEvent, true);
    // $('html').on('click', function (e) {
    //   setTimeout(() => {
    //     $('[data-toggle="popover"]').each(function () {
    //       if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
    //         $(this).popover('hide');
    //       }
    //     });
    //   }, 10)
    // });
  }

  getCSExecutives() {
    this._mandateService.fetchmandateexecutuvesforreassign(this.propertyid, '', '', '50014', '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.assignedVisitsBy = executives['mandateexecutives'];
        this.copyOfAssignedVisitsBy = executives['mandateexecutives'];
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeNextActionDateRangePicker();
      this.initializeLeadReceivedDateRangePicker();
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

  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  getleadsdata() {
    // MandateLeadStagesComponent.count = 0;
    this.route.queryParams.subscribe((paramss) => {
      this.filterLoader = true;
      // Updated Using Strategy

      if (this.isRestoredFromSession) {
        this.filterLoader = false;
        this.isRestoredFromSession = false;
        setTimeout(() => {
          sessionStorage.clear();
        }, 3000)
        return;
      }

      // *****************************Assignedleads section list*****************************
      this.pendingleadsparam = paramss['pending'];
      this.followupleadsparam = paramss['followups']
      this.inactiveparam = paramss['inactive'];
      this.untouchedParam = paramss['untouched'];
      this.usvParam = paramss['usv'];
      this.rsvParam = paramss['rsv'];
      this.fnParam = paramss['fn'];
      this.junkleadsParam = paramss['junkleads'];
      this.junkvisitsParam = paramss['junkvisits'];
      this.bookingPendingParam = paramss['bookingPending'];
      this.bookingRequestParam = paramss['bookingRequest'];
      this.bookingRejectedParam = paramss['bookingRejected'];
      this.bookedParam = paramss['booked'];
      this.normalcallparam = paramss['nc'];
      this.type = paramss['type'];
      this.overduejunk = paramss['overduejunk']

      this.propertyid = paramss['property'];
      this.propertyname = paramss['propname'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.stagevalue = paramss['stage'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.stagestatusval = paramss['stagestatus'];
      this.priorityName = paramss['priority'];
      this.team = paramss['team'];
      this.additionalParam = paramss['filterData'];
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
      this.visitType = paramss['id'];
      this.visitAssignExecid = paramss['visitExecid'];
      this.visitAssignExecname = paramss['visitExecname'];
      this.inactiveTotal = paramss['inactivecount'];
      this.junkLeadsTotal = paramss['junkleadcount'];
      this.junkVisitsTotal = paramss['junkvisitcount'];
      this.rnrCount = paramss['rnrCount'];
      this.untouchedStage = paramss['untouchedstage'];
      this.overduesSelection = paramss['overdues'] === 'true';

      if (this.overduesSelection) {
        this.overduesStage = 'overdues';
      } else {
        this.overduesStage = '';
      }

      if ((this.inactiveTotal == null || this.inactiveTotal == undefined || this.inactiveTotal == '') && this.inactiveparam == 1) {
        this.inactiveTotal = '1';
      }

      if ((this.junkLeadsTotal == null || this.junkLeadsTotal == undefined || this.junkLeadsTotal == '') && this.junkleadsParam == 1) {
        this.junkLeadsTotal = '1';
      }

      if ((this.junkVisitsTotal == null || this.junkVisitsTotal == undefined || this.junkVisitsTotal == '') && this.junkvisitsParam == 1) {
        this.junkVisitsTotal = '1';
      }

      if (this.followupleadsparam == '1' || this.normalcallparam == '1') {
        this.serachRemarks = paramss['remarks'];
        if (this.serachRemarks && this.serachRemarks.length > 0) {
          this.latestRemarkFilter = true;
        } else {
          this.latestRemarkFilter = false;
        }
      } else {
        this.serachRemarks = '';
        this.latestRemarkFilter = false;
      }

      if (this.visitType != 1) {
        this.visitAssignExecid = '';
        this.visitAssignExecname = '';
      }

      this.resetScroll();
      this.detailsPageRedirection();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.initializeLeadReceivedDateRangePicker();
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
        // if (this.role_type == '1' && this.visitType == '1') {
        //   this.getExecutivesForFilter();
        // }
      }

      if (this.role_type == '1' && this.visitType == '1') {
        this.getExecutivesForFilter();
      }

      if (this.execid) {
        this.executivefilterview = true;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == '1') {
          this.rmid = this.execid;
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      } else {
        this.executivefilterview = false;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == 1) {
          this.rmid = "";
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      }

      if (this.visitAssignExecid) {
        this.visitAssignExecutivefilterview = true;
      } else {
        this.visitAssignExecutivefilterview = false;
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

        if ((this.usvParam == 1 || this.rsvParam == 1 || this.fnParam == 1 || this.additionalParam == 'AllVisits') && (this.fromdate != '' && this.fromdate != undefined && this.fromdate != null && this.todate != '' && this.todate != undefined && this.todate != null)) {
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
        if (this.overduejunk != '4' && this.overduejunk != '5') {
          this.stagestatusval = '3';
        }
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
        // else if (this.stagestatusval == '4') {
        //   this.stagestatusvaltext = "Followup";
        // } else if (this.stagestatusval == '5') {
        //   this.stagestatusvaltext = "Junk";
        // }
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

      if (this.priorityName) {
        if (this.priorityName == 1) {
          this.priorityType = 'Hot';
        } else if (this.priorityName == 2) {
          this.priorityType = 'Warm';
        } else if (this.priorityName == 3) {
          this.priorityType = 'Cold';
        }
        this.priorityFilter = true;
      } else {
        this.priorityFilter = false;
      }

      if (this.leadBookingstatus == 1) {
        this.selectedBookingLeadStatus = 'Rejected'
      } else if (this.leadBookingstatus == 2) {
        this.selectedBookingLeadStatus = 'Pending'
      } else {
        this.selectedBookingLeadStatus = 'All'
      }

      if (paramss['filterData'] == '' || paramss['filterData'] == undefined) {
        this.isAdditonalParamPresent = false;
      } else {
        $(".other_section").removeClass("active");
        this.additionalParam = paramss['filterData'];
        this.isAdditonalParamPresent = true;
        this.filterLoader = false;
        if (paramss['filterData'] == 'Touched') {
          this.toucheddata();
          this.batch1trigger();
        } else if (paramss['filterData'] == 'Active') {
          this.activedata();
          this.batch1trigger();
        } else if (paramss['filterData'] == 'Assigned') {
          this.assigneddata();
          this.batch1trigger();
        } else if (paramss['filterData'] == 'AllVisits') {
          this.allVisitsdata();
          this.batch1trigger();
        } else if (paramss['filterData'] == 'ActiveVisits') {
          this.activevisitsdata();
          this.batch1trigger();
        }
      }

      // *****************************Assignedleads section list*****************************
      if (this.pendingleadsparam == '1') {
        this.batch1trigger();
        this.pendingleadsdata();
      } else if (this.followupleadsparam == '1') {
        this.batch1trigger();
        this.followupleadsdata();
        this.getFollowupsStatus();
      } else if (this.inactiveparam == '1') {
        this.batch1trigger();
        this.inactivedatas();
        this.getFollowupsStatus();
      } else if (this.untouchedParam == '1') {
        this.visitStageType = '';
        this.untouchedStage = '';
        this.batch1trigger();
        this.untoucheddatas();
      } else if (this.usvParam == '1') {
        this.visitStageType = 'USV';
        this.batch1trigger();
        if (this.overduejunk != '4' && this.overduejunk != '5') {
          this.usvdatas();
        }
      } else if (this.rsvParam == '1') {
        this.visitStageType = 'RSV';
        this.batch1trigger();
        if (this.overduejunk != '4' && this.overduejunk != '5') {
          this.rsvdatas();
        }
      } else if (this.fnParam == '1') {
        this.visitStageType = 'FN';
        this.batch1trigger();
        if (this.overduejunk != '4' && this.overduejunk != '5') {
          this.fndatas();
        }
      } else if (this.junkleadsParam == '1') {
        this.batch1trigger();
        this.junkleadsdatas()
      } else if (this.junkvisitsParam == '1') {
        this.batch1trigger();
        this.junkvisitsdatas();
      } else if (this.bookingPendingParam == '1') {
        this.batch1trigger();
        this.bookingPendingdatas()
      } else if (this.bookingRequestParam == '1') {
        this.batch1trigger();
        this.bookingRequestdatas()
      } else if (this.bookingRejectedParam == '1') {
        this.batch1trigger();
        this.bookingRejecteddatas();
      } else if (this.bookedParam == '1') {
        this.batch1trigger();
        this.bookeddatas();
      } else if (this.normalcallparam == '1') {
        this.stagestatus = true;
        if (this.stagestatusval == '3') {
          this.stagestatusfilterview = false;
          this.stagefilterview = false;
        }
        if (this.visitType == '' || this.visitType == undefined || this.visitType == null) {
          this.visitType = '3';
        }
        this.batch1trigger();
        this.ncdatas();
      }

      if (this.overduejunk == '4') {
        this.getOverdueCounts();
      }

      if (this.overduejunk == '5') {
        this.getJunkCounts();
      }

      if (this.visitType == 1 && ((this.roleid != 1 && this.roleid != 2 && this.roleid != 50013 && this.roleid != 50014) || (this.roleid == '1' || this.roleid == '2'))) {
        this.getCSExecutives();
      }
      // *****************************Assignedleads section list*****************************
    });
  }

  selectedVisitType(type) {
    let id;
    if (type == 'all') {
      id = '3';
    } else if (type == 'self') {
      id = '2';
    } else if (type == 'assigned') {
      id = '1';
    }
    if (id) {
      this.router.navigate([], {
        queryParams: {
          id: id,
          visitExecname: '',
          visitExecid: ''
        }, queryParamsHandling: 'merge'
      })
    }
  }

  selectedInactiveType(type) {
    if (type) {
      this.router.navigate([], {
        queryParams: {
          inactivecount: type,
        }, queryParamsHandling: 'merge'
      })
    }
  }

  selectedJunkLeadsType(type) {
    if (type) {
      this.router.navigate([], {
        queryParams: {
          junkleadcount: type,
        }, queryParamsHandling: 'merge'
      })
    }
  }

  selectedJunkVisitsType(type) {
    if (type) {
      this.router.navigate([], {
        queryParams: {
          junkvisitcount: type,
        }, queryParamsHandling: 'merge'
      })
    }
  }

  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
        this.copyofmandateprojects = mandates['Properties'];
      }
    });
  }

  batch1trigger() {
    if (this.type == 'leads') {
      // Pending Leads Counts Fetch
      var pending = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'pending',
        stage: '',
        stagestatus: '',
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
        visitassignedTo: this.visitAssignExecid,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }

      this._mandateService.assignedLeadsCount(pending).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.pendingleadcounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.pendingleadcounts = "0";
        }
        this.calculateTotalCount();
      });
      // Pending Leads Counts Fetch

      // Followup Leads Counts Fetch
      var followups = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'generalfollowups',
        stage: '',
        stagestatus: '',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        followup: this.categoryStage,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        remarks_search: this.serachRemarks,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      this._mandateService.assignedLeadsCount(followups).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.followupleadcounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.followupleadcounts = "0";
        }
        this.calculateTotalCount();
      });
      // Followup Leads Counts Fetch

      // nc Counts
      let stagestatus;
      if (this.stagestatusval == '3' || this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
        stagestatus = ''
      } else if (this.stagestatusval == '2' || this.stagestatusval == '1') {
        stagestatus = '';
      }
      var nc = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'NC',
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
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        visittype: this.visitType,
        remarks_search: this.serachRemarks,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      this._mandateService.assignedLeadsCount(nc).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          // if(this.propertyid == '' || this.propertyid == undefined){
          //   this.normalcallcounts = compleads.AssignedLeads[0].counts;
          // }else{
          //   this.normalcallcounts = compleads.AssignedLeads[0].Uniquee_counts;
          // }
          this.normalcallcounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.normalcallcounts = 0;
        }
        this.calculateTotalCount();
      });
      // nc Counts

      // inactive Counts Fetch
      var inactive = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: '',
        stagestatus: '',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        followup: this.categoryStage,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      this._mandateService.assignedLeadsCount(inactive).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.inactivecounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.inactivecounts = "0";
        }
        this.calculateTotalCount();
      });
      // inactive Counts Fetch

      //Triggered only if the inactive is selected
      if (this.inactiveparam == 1 && (this.roleid == 1 || this.roleid == 2)) {
        this.inactive1Count = 0
        this.inactive2Count = 0;
        this.inactive3Count = 0;
        this.inactive4Count = 0;
        this.inactiveFinalCount = 0;

        //here we get the inactive1 counts
        var inactive1 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'inactive',
          stage: '',
          stagestatus: '',
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: this.team,
          source: this.source,
          followup: this.categoryStage,
          visits: this.leadstatusVisits,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visitassignedTo: this.visitAssignExecid,
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '1' } : {}),
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeadsCount(inactive1).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.inactive1Count = compleads.AssignedLeads[0].Uniquee_counts;
          } else {
            this.inactive1Count = 0;
          }
        })

        //here we get inactive2 count
        var inactive2 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'inactive',
          stage: '',
          stagestatus: '',
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: this.team,
          source: this.source,
          followup: this.categoryStage,
          visits: this.leadstatusVisits,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visitassignedTo: this.visitAssignExecid,
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '2' } : {}),
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeadsCount(inactive2).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.inactive2Count = compleads.AssignedLeads[0].Uniquee_counts;
          } else {
            this.inactive2Count = 0;
          }
        });

        //here we get inactive3 count
        var inactive3 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'inactive',
          stage: '',
          stagestatus: '',
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: this.team,
          source: this.source,
          followup: this.categoryStage,
          visits: this.leadstatusVisits,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visitassignedTo: this.visitAssignExecid,
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '3' } : {}),
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeadsCount(inactive3).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.inactive3Count = compleads.AssignedLeads[0].Uniquee_counts;
          } else {
            this.inactive3Count = 0;
          }
        });

        //here we get inactive4 count
        var inactive4 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'inactive',
          stage: '',
          stagestatus: '',
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: this.team,
          source: this.source,
          followup: this.categoryStage,
          visits: this.leadstatusVisits,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visitassignedTo: this.visitAssignExecid,
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '4' } : {}),
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeadsCount(inactive4).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.inactive4Count = compleads.AssignedLeads[0].Uniquee_counts;
          } else {
            this.inactive4Count = 0;
          }
        });

        //here we get finalinactive count
        var finalinactive = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'inactive',
          stage: '',
          stagestatus: '',
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: this.team,
          source: this.source,
          followup: this.categoryStage,
          visits: this.leadstatusVisits,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visitassignedTo: this.visitAssignExecid,
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: 'final' } : {}),
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeadsCount(finalinactive).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.inactiveFinalCount = compleads.AssignedLeads[0].Uniquee_counts;
          } else {
            this.inactiveFinalCount = 0;
          }
        });
      }

      //junk leads count fetch
      var junkleadspar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkleads',
        stage: '',
        stagestatus: '',
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
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      this._mandateService.assignedLeadsCount(junkleadspar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.junkleadsCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.junkleadsCounts = 0;
        }
        this.calculateTotalCount();
      });

      if (this.junkleadsParam == 1 && (this.roleid == 1 || this.roleid == 2)) {
        this.junklead1Count = 0;
        this.junklead2Count = 0;
        this.junklead3Count = 0;
        this.junklead4Count = 0;
        this.junkleadFinalCount = 0;

        var junkleadspar1 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkleads',
          stage: '',
          stagestatus: '',
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
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '1' } : {}),
        }
        this._mandateService.assignedLeadsCount(junkleadspar1).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.junklead1Count = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.junklead1Count = 0;
          }
        });

        var junkleadspar2 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkleads',
          stage: '',
          stagestatus: '',
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
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '2' } : {}),
        }
        this._mandateService.assignedLeadsCount(junkleadspar2).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.junklead2Count = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.junklead2Count = 0;
          }
        });

        var junkleadspar3 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkleads',
          stage: '',
          stagestatus: '',
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
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '3' } : {}),
        }
        this._mandateService.assignedLeadsCount(junkleadspar3).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.junklead3Count = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.junklead3Count = 0;
          }
        });


        var junkleadspar4 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkleads',
          stage: '',
          stagestatus: '',
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
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '4' } : {}),
        }
        this._mandateService.assignedLeadsCount(junkleadspar4).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.junklead4Count = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.junklead4Count = 0;
          }
        });

        var junkleadsparfinal = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkleads',
          stage: '',
          stagestatus: '',
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
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: 'final' } : {}),
        }
        this._mandateService.assignedLeadsCount(junkleadsparfinal).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.junkleadFinalCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.junkleadFinalCount = 0;
          }
        });
      }

    } else if (this.type == 'visits') {

      //untouched counts fetch
      var untouchedpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: this.untouchedStage,
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        untouch: 1
      }
      this._mandateService.assignedLeadsCount(untouchedpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.untouchedCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.untouchedCounts = 0;
        }
      });
      //untouched counts fetch

      //usv counts  fetch
      var usvpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
        stage: 'USV',
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(usvpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.usvCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.usvCounts = 0;
        }
        this.calculateTotalCount();
      });
      //usv counts  fetch

      //rsv counts  fetch
      var rsvpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(rsvpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          // this.rsvCounts = compleads.AssignedLeads[0].counts;
          if (rsvpar.stage == 'RSV' && (rsvpar.stagestatus == '3' || rsvpar.stagestatus == '')) {
            this.rsvCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.rsvCounts = parseInt(compleads.AssignedLeads[0].counts);
          }
          this.calculateTotalCount();
        } else {
          this.rsvCounts = 0;
        }
        this.calculateTotalCount();
      });
      //rsv counts  fetch

      //fn counts  fetch
      var fnpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(fnpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          if (fnpar.stage == 'Final Negotiation' && (fnpar.stagestatus == 3 || fnpar.stagestatus == '')) {
            this.fnCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.fnCounts = parseInt(compleads.AssignedLeads[0].counts);
          }
          this.calculateTotalCount();
        } else {
          this.fnCounts = 0;
        } this.calculateTotalCount();
      });
      //fn counts  fetch

      //junk visits count fetch
      let stagestatus1;
      if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
        stagestatus1 = '3';
      } else {
        stagestatus1 = this.stagestatusval;
      }

      var junkpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkvisits',
        stage: this.stagevalue,
        stagestatus: stagestatus1,
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(junkpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.junkvisitsCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.junkvisitsCounts = 0;
        }
        this.calculateTotalCount();
      });

      if (this.junkvisitsParam == 1 && (this.roleid == 1 || this.roleid == 2)) {
        this.junkvisits1Count = 0;
        this.junkvisits2Count = 0;
        this.junkvisits3Count = 0;
        this.junkvisits4Count = 0;
        this.junkvisitsFinalCount = 0;

        var junkpar1 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkvisits',
          stage: this.stagevalue,
          stagestatus: stagestatus1,
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
          totime: this.toTime,
          visittype: this.visitType,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '1' } : {}),
        }
        this._mandateService.assignedLeadsCount(junkpar1).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.junkvisits1Count = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.junkvisits1Count = 0;
          }
        });

        var junkpar2 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkvisits',
          stage: this.stagevalue,
          stagestatus: stagestatus1,
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
          totime: this.toTime,
          visittype: this.visitType,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '2' } : {}),
        }
        this._mandateService.assignedLeadsCount(junkpar2).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.junkvisits2Count = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.junkvisits2Count = 0;
          }
        });

        var junkpar3 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkvisits',
          stage: this.stagevalue,
          stagestatus: stagestatus1,
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
          totime: this.toTime,
          visittype: this.visitType,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '3' } : {}),
        }
        this._mandateService.assignedLeadsCount(junkpar3).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.junkvisits3Count = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.junkvisits3Count = 0;
          }
        });

        var junkpar4 = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkvisits',
          stage: this.stagevalue,
          stagestatus: stagestatus1,
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
          totime: this.toTime,
          visittype: this.visitType,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: '4' } : {}),
        }
        this._mandateService.assignedLeadsCount(junkpar4).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.junkvisits4Count = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.junkvisits4Count = 0;
          }
        });

        var junkparfinal = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkvisits',
          stage: this.stagevalue,
          stagestatus: stagestatus1,
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
          totime: this.toTime,
          visittype: this.visitType,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
          ...(this.roleid == 1 || this.roleid == 2 ? { counter: 'final' } : {}),
        }
        this._mandateService.assignedLeadsCount(junkparfinal).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.junkvisitsFinalCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
          } else {
            this.junkvisitsFinalCount = 0;
          }
        });
      }

      if (this.usvParam == 1) {
        let stagestatus;
        if (this.overduejunk == '4' || this.overduejunk == '5') {
          stagestatus = '3'
        }

        // var usvparam = {
        //   datefrom: this.fromdate,
        //   dateto: this.todate,
        //   statuss: 'overdues',
        //   stage: 'USV',
        //   stagestatus: stagestatus,
        //   propid: this.propertyid,
        //   executid: this.rmid,
        //   loginuser: this.userid,
        //   source: this.source,
        //   fromtime: this.fromTime,
        //   totime: this.toTime,
        //   visittype: this.visitType,
        //   visitassignedTo: this.visitAssignExecid,
        //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // }
        // this._mandateService.assignedLeadsCount(usvparam).subscribe(compleads => {
        //   if (compleads['status'] == 'True') {
        //     this.overdueCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        //   } else {
        //     this.overdueCount = 0;
        //   }
        // });
      } else if (this.rsvParam == 1) {
        let stagestatus;
        if (this.overduejunk == '4' || this.overduejunk == '5') {
          stagestatus = '3'
        }

        // var rsvparam = {
        //   datefrom: this.fromdate,
        //   dateto: this.todate,
        //   statuss: 'overdues',
        //   stage: 'RSV',
        //   stagestatus: stagestatus,
        //   propid: this.propertyid,
        //   executid: this.rmid,
        //   loginuser: this.userid,
        //   source: this.source,
        //   fromtime: this.fromTime,
        //   totime: this.toTime,
        //   visittype: this.visitType,
        //   visitassignedTo: this.visitAssignExecid,
        //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // }
        // this._mandateService.assignedLeadsCount(rsvparam).subscribe(compleads => {
        //   if (compleads['status'] == 'True') {
        //     this.overdueCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        //   } else {
        //     this.overdueCount = 0;
        //   }
        // });
      } else if (this.fnParam == 1) {
        let stagestatus;
        if (this.overduejunk == '4' || this.overduejunk == '5') {
          stagestatus = '3'
        }

        // var fnparam = {
        //   datefrom: this.fromdate,
        //   dateto: this.todate,
        //   statuss: 'overdues',
        //   stage: 'Final Negotiation',
        //   stagestatus: stagestatus,
        //   propid: this.propertyid,
        //   executid: this.rmid,
        //   loginuser: this.userid,
        //   source: this.source,
        //   fromtime: this.fromTime,
        //   totime: this.toTime,
        //   visittype: this.visitType,
        //   visitassignedTo: this.visitAssignExecid,
        //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // }
        // this._mandateService.assignedLeadsCount(fnparam).subscribe(compleads => {
        //   if (compleads['status'] == 'True') {
        //     this.overdueCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        //   } else {
        //     this.overdueCount = 0;
        //   }
        // });
      }

      if (this.usvParam == 1) {
        let stagestatus1
        if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
          stagestatus1 = '';
        } else {
          stagestatus1 = this.stagestatusval;
        }
        let stagestatus2 = ((this.visitedFrom == undefined || this.visitedFrom == null || this.visitedFrom == '') || (this.visitedTo == undefined || this.visitedTo == null || this.visitedTo == '')) ? stagestatus1 : '3';
        let junkvisits = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkvisits',
          stage: 'USV',
          stagestatus: stagestatus2,
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: '',
          source: this.source,
          followup: null,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          visitedfrom: this.visitedFrom,
          visitedto: this.visitedTo,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visittype: this.visitType,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeadsCount(junkvisits).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            if (this.propertyid == '' || this.propertyid == undefined) {
              this.stageJunkCount = parseInt(compleads.AssignedLeads[0].counts);
            } else {
              this.stageJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);

            }
          } else {
            this.stageJunkCount = 0;
          }
        });
      } else if (this.rsvParam == 1) {
        let stagestatus1
        if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
          stagestatus1 = '';
        } else {
          stagestatus1 = this.stagestatusval;
        }
        let stagestatus2 = ((this.visitedFrom == undefined || this.visitedFrom == null || this.visitedFrom == '') || (this.visitedTo == undefined || this.visitedTo == null || this.visitedTo == '')) ? stagestatus1 : '3';
        let junkvisits = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkvisits',
          stage: 'RSV',
          stagestatus: stagestatus2,
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: '',
          source: this.source,
          followup: null,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          visitedfrom: this.visitedFrom,
          visitedto: this.visitedTo,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visittype: this.visitType,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeadsCount(junkvisits).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            if (this.propertyid == '' || this.propertyid == undefined) {
              this.stageJunkCount = parseInt(compleads.AssignedLeads[0].counts);
            } else {
              this.stageJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);

            }
          } else {
            this.stageJunkCount = 0;
          }
        });

      } else if (this.fnParam == 1) {
        let stagestatus1
        if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
          stagestatus1 = '';
        } else {
          stagestatus1 = this.stagestatusval;
        }
        let stagestatus2 = ((this.visitedFrom == undefined || this.visitedFrom == null || this.visitedFrom == '') || (this.visitedTo == undefined || this.visitedTo == null || this.visitedTo == '')) ? stagestatus1 : '3';
        let junkvisits = {
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkvisits',
          stage: 'Final Negotiation',
          stagestatus: stagestatus2,
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: '',
          source: this.source,
          followup: null,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          visitedfrom: this.visitedFrom,
          visitedto: this.visitedTo,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visittype: this.visitType,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeadsCount(junkvisits).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            if (this.propertyid == '' || this.propertyid == undefined) {
              this.stageJunkCount = parseInt(compleads.AssignedLeads[0].counts);
            } else {
              this.stageJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
            }
          } else {
            this.stageJunkCount = 0;
          }
        });
      }

    } else if (this.type == 'bookings') {

      //booking pending counts  fetch
      var bookingPendingpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closing Pending',
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
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(bookingPendingpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.bookingPendingCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.bookingPendingCounts = 0;
        }
        this.calculateTotalCount();
      });
      //booking Pending  fetch

      //booking request counts  fetch
      var bookingRequestpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closing Requested',
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
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(bookingRequestpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.bookingRequestCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.bookingRequestCounts = 0;
        }
        this.calculateTotalCount();
      });
      //booking request  fetch

      //booking rejected counts  fetch
      var bookingRequestpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Closing Request Rejected',
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
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(bookingRequestpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.bookingRejectedCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.bookingRejectedCounts = 0;
        }
        this.calculateTotalCount();
      });
      //booking rejected  fetch

      //booked counts  fetch
      var bookedpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closed',
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
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(bookedpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.bookedCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.bookedCounts = 0;
        }
        this.calculateTotalCount();
      });
      //booked counts fetch
    }

  }

  calculateTotalCount(): any {
    return this.Totalleadcounts = this.pendingleadcounts + this.followupleadcounts + this.bookingRejectedCounts + this.normalcallcounts + this.usvCounts + this.rsvCounts + this.fnCounts + this.inactivecounts + this.junkleadsCounts + this.junkvisitsCounts + this.bookedCounts + this.bookingRequestCounts + this.bookingPendingCounts;
  }

  pendingleadsdata() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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
      // stage: this.stagevalue,
      // stagestatus: this.stagestatusval,
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
      visitassignedTo: this.visitAssignExecid,
      rnrleads: this.rnrCount,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  followupleadsdata() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".followups_section").addClass("active");
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
      statuss: 'generalfollowups',
      // stage: this.stagevalue,
      // stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      followup: this.categoryStage,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime,
      visitassignedTo: this.visitAssignExecid,
      remarks_search: this.serachRemarks,
      rnrleads: this.rnrCount,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  inactivedatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".inactive_section").addClass("active");
    }, 0)
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    let inactiveCount;
    if (this.inactiveTotal == '5') {
      inactiveCount = 'final';
    } else {
      inactiveCount = this.inactiveTotal;
    }

    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'inactive',
      stage: '',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      followup: this.categoryStage,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      ...(this.roleid == 1 || this.roleid == 2 ? { counter: inactiveCount } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  untoucheddatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".untouched_section").addClass("active");
    }, 0)
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: this.untouchedStage,
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
      totime: this.toTime,
      visittype: this.visitType,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      untouch: 1
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  usvdatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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
      statuss: this.overduesStage,
      stage: 'USV',
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
      totime: this.toTime,
      visittype: this.visitType,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  rsvdatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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
      statuss: this.overduesStage,
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
      totime: this.toTime,
      visittype: this.visitType,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  fndatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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
      statuss: this.overduesStage,
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
      totime: this.toTime,
      visittype: this.visitType,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  bookingPendingdatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".bookingPen_section").addClass("active");
    }, 0)

    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: 'Deal Closing Pending',
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
      totime: this.toTime,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  bookingRequestdatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".booking_section").addClass("active");
    }, 0)
    if (this.leadBookingstatus == 1) {
      this.selectedBookingLeadStatus = 'Rejected'
    } else if (this.leadBookingstatus == 2) {
      this.selectedBookingLeadStatus = 'Pending'
    } else {
      this.selectedBookingLeadStatus = 'All'
    }

    // if (this.selectedBookingLeadStatus == 'Pending') {
    //   bookingRR = 'Deal Closing Requested';
    // } else if (this.selectedBookingLeadStatus == 'Rejected') {
    //   bookingRR = 'Closing Request Rejected';
    // } else if (this.selectedBookingLeadStatus == 'All') {
    //   bookingRR = 'DCRR';
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
      statuss: '',
      stage: 'Deal Closing Requested',
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
      totime: this.toTime,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  bookingRejecteddatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".bookingRej_section").addClass("active");
    }, 0)
    if (this.leadBookingstatus == 1) {
      this.selectedBookingLeadStatus = 'Rejected'
    } else if (this.leadBookingstatus == 2) {
      this.selectedBookingLeadStatus = 'Pending'
    } else {
      this.selectedBookingLeadStatus = 'All'
    }

    // if (this.selectedBookingLeadStatus == 'Pending') {
    //   bookingRR = 'Deal Closing Requested';
    // } else if (this.selectedBookingLeadStatus == 'Rejected') {
    //   bookingRR = 'Closing Request Rejected';
    // } else if (this.selectedBookingLeadStatus == 'All') {
    //   bookingRR = 'DCRR';
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
      statuss: '',
      stage: 'Closing Request Rejected',
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
      totime: this.toTime,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  bookeddatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".booked_section").addClass("active");
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
      stage: 'Deal Closed',
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
      totime: this.toTime,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  junkleadsdatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".junkleads_section").addClass("active");
    }, 0)

    let junkleadcount;
    if (this.junkLeadsTotal == '5') {
      junkleadcount = 'final';
    } else {
      junkleadcount = this.junkLeadsTotal;
    }
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
      statuss: 'junkleads',
      stage: '',
      stagestatus: '',
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
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      ...(this.roleid == 1 || this.roleid == 2 ? { counter: junkleadcount } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  junkvisitsdatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".junkvisits_section").addClass("active");
    }, 0)

    let junkvisitcount;
    if (this.junkVisitsTotal == '5') {
      junkvisitcount = 'final';
    } else {
      junkvisitcount = this.junkVisitsTotal;
    }

    let stagestatus;
    if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
      stagestatus = '3';
    }
    else {
      stagestatus = this.stagestatusval;
    }
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
      totime: this.toTime,
      visittype: this.visitType,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      ...(this.roleid == 1 || this.roleid == 2 ? { counter: junkvisitcount } : {}),
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  ncdatas() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".nc_section").addClass("active");
    }, 0)
    let stagestatus;
    if (this.stagestatusval == '3' || this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
      stagestatus = ''
    } else if (this.stagestatusval == '2' || this.stagestatusval == '1') {
      stagestatus = '';
    }
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
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime,
      visitassignedTo: this.visitAssignExecid,
      visittype: this.visitType,
      remarks_search: this.serachRemarks,
      rnrleads: this.rnrCount,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //downloading the junk report only for admin
  downloadDocument() {
    swal({
      title: 'Please Wait.....',
      text: 'Generating Report',
      onOpen: () => {
        swal.showLoading();
      }
    })

    let param;
    if (this.followupleadsparam == 1) {
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'generalfollowups',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        followup: this.categoryStage,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        remarks_search: this.serachRemarks,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.normalcallparam == 1) {
      let stagestatus;
      if (this.stagestatusval == '3' || this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
        stagestatus = ''
      } else if (this.stagestatusval == '2' || this.stagestatusval == '1') {
        stagestatus = '';
      }
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'NC',
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
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visittype: this.visitType,
        remarks_search: this.serachRemarks,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.untouchedParam == 1) {
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: this.untouchedStage,
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
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        untouch: 1
      }
    } else if (this.usvParam == 1) {
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
        stage: 'USV',
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
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.rsvParam == 1) {
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
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
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.fnParam == 1) {
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
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
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.inactiveparam == 1) {
      let inactiveCount;
      if (this.inactiveTotal == '5') {
        inactiveCount = 'final';
      } else {
        inactiveCount = this.inactiveTotal;
      }
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: '',
        stagestatus: '',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        followup: this.categoryStage,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        ...(this.roleid == 1 || this.roleid == 2 ? { counter: inactiveCount } : {}),
      }
    } else if (this.junkleadsParam == 1) {
      let junkleadcount;
      if (this.junkLeadsTotal == '5') {
        junkleadcount = 'final';
      } else {
        junkleadcount = this.junkLeadsTotal;
      }
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkleads',
        stage: '',
        stagestatus: '',
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
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        ...(this.roleid == 1 || this.roleid == 2 ? { counter: junkleadcount } : {}),
      }
    } else if (this.junkvisitsParam == 1) {
      let stagestatus;
      if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
        stagestatus = '3';
      }
      else {
        stagestatus = this.stagestatusval;
      }
      let junkvisitcount;
      if (this.junkVisitsTotal == '5') {
        junkvisitcount = 'final';
      } else {
        junkvisitcount = this.junkVisitsTotal;
      }
      param = {
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
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        ...(this.roleid == 1 || this.roleid == 2 ? { counter: junkvisitcount } : {}),
      }
    } else if (this.bookingPendingParam == 1) {

      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closing Pending',
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
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }

    } else if (this.bookingRequestParam == 1) {
      if (this.leadBookingstatus == 1) {
        this.selectedBookingLeadStatus = 'Rejected'
      } else if (this.leadBookingstatus == 2) {
        this.selectedBookingLeadStatus = 'Pending'
      } else {
        this.selectedBookingLeadStatus = 'All'
      }

      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closing Requested',
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
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.bookingRejectedParam == 1) {
      if (this.leadBookingstatus == 1) {
        this.selectedBookingLeadStatus = 'Rejected'
      } else if (this.leadBookingstatus == 2) {
        this.selectedBookingLeadStatus = 'Pending'
      } else {
        this.selectedBookingLeadStatus = 'All'
      }
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Closing Request Rejected',
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
    } else if (this.bookedParam == 1) {
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closed',
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
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.additionalParam == 'AllVisits') {
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'allvisits',
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
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.additionalParam == 'ActiveVisits') {
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'activevisits',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.additionalParam == 'Active') {
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'active',
        stage: '',
        stagestatus: '',
        propid: this.propertyid,
        executid: this.execid,
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
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.additionalParam == 'Touched') {
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'touched',
        stage: '',
        stagestatus: '',
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
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    }

    this._mandateService.assignedLeads(param).subscribe(compleads => {
      if (compleads.status == 'True') {
        swal.close();
        compleads['AssignedLeads'];
        this.arr = compleads['AssignedLeads'].map(lead => {
          let stagestatus1;
          if (this.followupleadsparam != '1' && this.inactiveparam != '1') {
            switch (lead.stagestatus) {
              case '1':
                stagestatus1 = 'Fix';
                break;
              case '2':
                stagestatus1 = 'Refix';
                break;
              case '3':
                stagestatus1 = 'Done';
                break;
              default:
                stagestatus1 = '';
                break;
            }
          }

          if (this.followupleadsparam == '1' || this.inactiveparam == '1' || (this.normalcallparam == '1' && (lead.stagestatus == null || lead.stagestatus == 0))) {
            stagestatus1 = lead.followup_categories;
          }

          let laststage1 = '';
          if (this.junkleadsParam == '1' || this.junkvisitsParam == '1') {
            laststage1 = lead.laststage;
          }

          return {
            LeadReceived: lead.leadDate + ' ' + lead.leadTime,
            CustomerName: lead.CustomerName,
            CustomerNumber: lead.number,
            Source: lead.source,
            Property: lead.propertyname,
            Stage: lead.Leadphase + '  ' + (laststage1),
            status: stagestatus1,
            VisitedOn: lead.visiteddate,
            ExecutiveName: lead.Executivename,
            LatestRemarks: lead.manualremarks
          };
        });
        const fileName = "AssignedLeads.xlsx";

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.arr);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "AssignedLeads");
        XLSX.writeFile(wb, fileName);
      }
    });
  }

  //this is to get the assigned data 
  assigneddata() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    MandateLeadStagesComponent.reassigncount = 0;
    $(".other_section").removeClass("active");
    this.filterLoader = true;

    //to fetch count
    var paramCount = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'assignedleads',
      stage: '',
      stagestatus: '',
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
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeadsCount(paramCount).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.additionalParamCount = compleads.AssignedLeads[0].counts;
      } else {
        this.additionalParamCount = 0;
      }
    });

    //to fetch data
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
      statuss: 'assignedleads',
      stage: '',
      stagestatus: '',
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
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //this is to get the alll visits data 
  allVisitsdata() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    MandateLeadStagesComponent.reassigncount = 0;
    $(".other_section").removeClass("active");
    this.filterLoader = true;

    //to fetch count
    var paramCount = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'allvisits',
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
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime,
      visittype: this.visitType,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeadsCount(paramCount).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.additionalParamCount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.additionalParamCount = 0;
      }
    });

    //to fetch data
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
      statuss: 'allvisits',
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
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime,
      visittype: this.visitType,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to get the touched lead data
  toucheddata() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    $(".other_section").removeClass("active");
    this.filterLoader = true;

    //to fetch count
    var paramCount = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'touched',
      stage: '',
      stagestatus: '',
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
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeadsCount(paramCount).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.additionalParamCount = compleads.AssignedLeads[0].counts;
      } else {
        this.additionalParamCount = 0;
      }
    });

    //to fetch data
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
      statuss: 'touched',
      stage: '',
      stagestatus: '',
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
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to get the active data
  activevisitsdata() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    $(".other_section").removeClass("active");
    this.filterLoader = true;

    //to fetch counts
    var paramCount = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'activevisits',
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime,
      visittype: this.visitType,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeadsCount(paramCount).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.filterLoader = false;
        this.additionalParamCount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.additionalParamCount = 0;
      }
    });


    //to fetch data
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
      statuss: 'activevisits',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      priority: this.priorityName,
      team: this.team,
      source: this.source,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromtime: this.fromTime,
      totime: this.toTime,
      visittype: this.visitType,
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to get the active data
  activedata() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    $(".other_section").removeClass("active");
    this.filterLoader = true;

    //to fetch counts
    var paramCount = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'active',
      stage: '',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.execid,
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
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeadsCount(paramCount).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.additionalParamCount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.additionalParamCount = 0;
      }
    });


    //to fetch data
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
      statuss: 'active',
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
      visitassignedTo: this.visitAssignExecid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  getOverdueCounts() {
    if (this.type == 'visits') {
      if (this.usvParam == 1) {
        setTimeout(() => {
          $(".other_section").removeClass("active");
          $(".usv_section").addClass("active");
        }, 0)
        let stagestatus;
        if (this.overduejunk == '4' || this.overduejunk == '5') {
          stagestatus = '3'
        }
        $(".add_class").removeClass("active");

        // var param = {
        //   limit: 0,
        //   limitrows: 30,
        //   datefrom: this.fromdate,
        //   dateto: this.todate,
        //   statuss: 'overdues',
        //   stage: 'USV',
        //   stagestatus: stagestatus,
        //   executid: this.rmid,
        //   propid: this.propertyid,
        //   loginuser: this.userid,
        //   source: this.source,
        //   fromtime: this.fromTime,
        //   totime: this.toTime,
        //   visitassignedTo: this.visitAssignExecid,
        //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // }
        // this._mandateService.assignedLeads(param).subscribe(compleads => {
        //   this.filterLoader = false;
        //   this.callerleads = compleads['AssignedLeads'];
        // });

      } else if (this.rsvParam == 1) {
        setTimeout(() => {
          $(".other_section").removeClass("active");
          $(".rsv_section").addClass("active");
        }, 0)
        let stagestatus;
        if (this.overduejunk == '4' || this.overduejunk == '5') {
          stagestatus = '3'
        }
        $(".add_class").removeClass("active");

        // let param = {
        //   limit: 0,
        //   limitrows: 30,
        //   datefrom: this.fromdate,
        //   dateto: this.todate,
        //   statuss: 'overdues',
        //   stage: 'RSV',
        //   stagestatus: stagestatus,
        //   executid: this.rmid,
        //   propid: this.propertyid,
        //   loginuser: this.userid,
        //   source: this.source,
        //   fromtime: this.fromTime,
        //   totime: this.toTime,
        //   visitassignedTo: this.visitAssignExecid,
        //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // }
        // this._mandateService.assignedLeads(param).subscribe(compleads => {
        //   this.filterLoader = false;
        //   this.callerleads = compleads['AssignedLeads'];
        // });

      } else if (this.fnParam == 1) {
        setTimeout(() => {
          $(".other_section").removeClass("active");
          $(".fn_section").addClass("active");
        }, 0)
        let stagestatus;
        if (this.overduejunk == '4' || this.overduejunk == '5') {
          stagestatus = '3'
        }

        $(".add_class").removeClass("active");

        // let param = {
        //   limit: 0,
        //   limitrows: 30,
        //   datefrom: this.fromdate,
        //   dateto: this.todate,
        //   statuss: 'overdues',
        //   stage: 'Final Negotiation',
        //   stagestatus: stagestatus,
        //   executid: this.rmid,
        //   propid: this.propertyid,
        //   loginuser: this.userid,
        //   source: this.source,
        //   fromtime: this.fromTime,
        //   totime: this.toTime,
        //   visitassignedTo: this.visitAssignExecid,
        //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // }
        // this._mandateService.assignedLeads(param).subscribe(compleads => {
        //   this.filterLoader = false;
        //   this.callerleads = compleads['AssignedLeads'];
        // });

      }
    }
  }

  getJunkCounts() {
    if (this.type == 'visits') {
      if (this.usvParam == 1) {
        let stagestatus1
        if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
          stagestatus1 = '';
        } else {
          stagestatus1 = this.stagestatusval;
        }
        let stagestatus2 = ((this.visitedFrom == undefined || this.visitedFrom == null || this.visitedFrom == '') || (this.visitedTo == undefined || this.visitedTo == null || this.visitedTo == '')) ? stagestatus1 : '3';

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
          statuss: 'junkvisits',
          stage: 'USV',
          stagestatus: stagestatus2,
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: '',
          source: this.source,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          visitedfrom: this.visitedFrom,
          visitedto: this.visitedTo,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeads(param).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        });

      } else if (this.rsvParam == 1) {
        let stagestatus1
        if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
          stagestatus1 = '';
        } else {
          stagestatus1 = this.stagestatusval;
        }
        let stagestatus2 = ((this.visitedFrom == undefined || this.visitedFrom == null || this.visitedFrom == '') || (this.visitedTo == undefined || this.visitedTo == null || this.visitedTo == '')) ? stagestatus1 : '3';

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
        let param = {
          limit: 0,
          limitrows: 30,
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkvisits',
          stage: 'RSV',
          stagestatus: stagestatus2,
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: '',
          source: this.source,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          visitedfrom: this.visitedFrom,
          visitedto: this.visitedTo,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeads(param).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        });

      } else if (this.fnParam == 1) {
        let stagestatus1
        if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
          stagestatus1 = '';
        } else {
          stagestatus1 = this.stagestatusval;
        }
        let stagestatus2 = ((this.visitedFrom == undefined || this.visitedFrom == null || this.visitedFrom == '') || (this.visitedTo == undefined || this.visitedTo == null || this.visitedTo == '')) ? stagestatus1 : '3';

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
        let param = {
          limit: 0,
          limitrows: 30,
          datefrom: this.fromdate,
          dateto: this.todate,
          statuss: 'junkvisits',
          stage: 'Final Negotiation',
          stagestatus: stagestatus2,
          propid: this.propertyid,
          executid: this.rmid,
          loginuser: this.userid,
          priority: this.priorityName,
          team: '',
          source: this.source,
          receivedfrom: this.receivedFromDate,
          receivedto: this.receivedToDate,
          visitedfrom: this.visitedFrom,
          visitedto: this.visitedTo,
          assignedfrom: this.assignedFrom,
          assignedto: this.assignedTo,
          fromtime: this.fromTime,
          totime: this.toTime,
          visitassignedTo: this.visitAssignExecid,
          ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        }
        this._mandateService.assignedLeads(param).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        });
      }
    }
  }

  // showdateRange() {
  //   let todaysDate = new Date();
  //   this.leadReceivedDateRange = [todaysDate];

  //   setTimeout(() => {
  //     const inputElement = this.datepickerreceived.nativeElement as HTMLInputElement;
  //     inputElement.focus();
  //     inputElement.click();
  //     $('bs-daterangepicker-container').removeAttr('style');
  //     $("bs-daterangepicker-container").removeClass("nextactiondatepkr");
  //     $("bs-daterangepicker-container").removeClass("visiteddatepkr");
  //     $("bs-daterangepicker-container").removeClass("assignedOndatepkr");
  //     $("bs-daterangepicker-container").addClass("recievedleadsdatepkr");
  //   }, 0);
  // }

  // showdateRange2() {
  //   let todaysDate = new Date();
  //   this.nextActionDateRange = [todaysDate];

  //   setTimeout(() => {
  //     const inputElement = this.datepickernextACtion.nativeElement as HTMLInputElement;
  //     inputElement.focus();
  //     inputElement.click();
  //     $('bs-daterangepicker-container').removeAttr('style');
  //     $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
  //     $("bs-daterangepicker-container").removeClass("assignedOndatepkr");
  //     $("bs-daterangepicker-container").removeClass("visiteddatepkr");
  //     $("bs-daterangepicker-container").addClass("nextactiondatepkr");
  //   }, 0);
  // }

  // showdateRange3() {
  //   let todaysDate = new Date();
  //   this.visitedDateRange = [todaysDate];
  //   setTimeout(() => {
  //     const inputElement = this.datepickervisited.nativeElement as HTMLInputElement;
  //     inputElement.focus();
  //     inputElement.click();
  //     $('bs-daterangepicker-container').removeAttr('style');
  //     $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
  //     $("bs-daterangepicker-container").removeClass("nextactiondatepkr");
  //     $("bs-daterangepicker-container").addClass("visiteddatepkr");
  //   }, 0);
  // }

  // showdateRange4() {
  //   let todaysDate = new Date();
  //   this.assignedOnDateRange = [todaysDate];
  //   setTimeout(() => {
  //     const inputElement = this.datepickerassigned.nativeElement as HTMLInputElement;
  //     inputElement.focus();
  //     inputElement.click();
  //     $('bs-daterangepicker-container').removeAttr('style');
  //     $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
  //     $("bs-daterangepicker-container").removeClass("nextactiondatepkr");
  //     $("bs-daterangepicker-container").removeClass("visiteddatepkr");
  //     $("bs-daterangepicker-container").addClass("assignedOndatepkr");
  //   }, 0);
  // }

  // onLeadReceivedDateRangeSelected(range: Date[]): void {
  //   this.leadReceivedDateRange = range;
  //   //Convert the first date of the range to yyyy-mm-dd format
  //   if (this.leadReceivedDateRange != null || this.leadReceivedDateRange != undefined) {
  //     let formattedFromDate = this.datepipe.transform(this.leadReceivedDateRange[0], 'yyyy-MM-dd');
  //     let formattedToDate = this.datepipe.transform(this.leadReceivedDateRange[1], 'yyyy-MM-dd');
  //     if ((formattedFromDate != null && formattedFromDate != '') && (formattedToDate != null && formattedToDate != '')) {
  //       this.receivedFromDate = formattedFromDate;
  //       this.receivedToDate = formattedToDate;
  //       this.receivedDatefilterview = true;
  //       this.visitedDatefilterview = false;
  //       this.datefilterview = false;
  //       this.router.navigate([], {
  //         queryParams: {
  //           receivedFrom: this.receivedFromDate,
  //           receivedTo: this.receivedToDate
  //         },
  //         queryParamsHandling: 'merge',
  //       });
  //     } else {
  //       this.receivedDatefilterview = false;
  //     }
  //   }
  // }

  // onNextActionDateRangeSelected(range: Date[]): void {
  //   this.nextActionDateRange = range;
  //   //Convert the first date of the range to yyyy-mm-dd format
  //   if (this.nextActionDateRange != null || this.nextActionDateRange != undefined) {
  //     let formattedFromDate = this.datepipe.transform(this.nextActionDateRange[0], 'yyyy-MM-dd');
  //     let formattedToDate = this.datepipe.transform(this.nextActionDateRange[1], 'yyyy-MM-dd');
  //     if (formattedFromDate != null && formattedToDate != null) {
  //       this.fromdate = formattedFromDate;
  //       this.todate = formattedToDate;
  //       this.datefilterview = true;
  //       this.receivedDatefilterview = false;
  //       this.visitedDatefilterview = false;
  //       this.router.navigate([], {
  //         queryParams: {
  //           from: this.fromdate,
  //           to: this.todate
  //         },
  //         queryParamsHandling: 'merge',
  //       });
  //     } else {
  //       this.datefilterview = false;
  //     }
  //   }
  // }

  // onVisitedDateRangeSelected(range) {
  //   this.visitedDateRange = range;
  //   //Convert the first date of the range to yyyy-mm-dd format
  //   if (this.visitedDateRange != null || this.visitedDateRange != undefined) {
  //     let formattedFromDate = this.datepipe.transform(this.visitedDateRange[0], 'yyyy-MM-dd');
  //     let formattedToDate = this.datepipe.transform(this.visitedDateRange[1], 'yyyy-MM-dd');
  //     if ((formattedFromDate != null && formattedFromDate != '') && (formattedToDate != null && formattedToDate != '')) {
  //       this.visitedFrom = formattedFromDate;
  //       this.visitedTo = formattedToDate;
  //       this.visitedDatefilterview = true;
  //       this.datefilterview = false;
  //       this.receivedDatefilterview = false;
  //       this.router.navigate([], {
  //         queryParams: {
  //           visitedfrom: this.visitedFrom,
  //           visitedto: this.visitedTo
  //         },
  //         queryParamsHandling: 'merge',
  //       });
  //     } else {
  //       this.visitedDatefilterview = false;
  //     }
  //   }
  // }

  // onAssignedOnDateRangeSelected(range: Date[]) {
  //   this.assignedOnDateRange = range;
  //   //Convert the first date of the range to yyyy-mm-dd format
  //   if (this.assignedOnDateRange != null || this.assignedOnDateRange != undefined) {
  //     let formattedFromDate = this.datepipe.transform(this.assignedOnDateRange[0], 'yyyy-MM-dd');
  //     let formattedToDate = this.datepipe.transform(this.assignedOnDateRange[1], 'yyyy-MM-dd');
  //     if ((formattedFromDate != null && formattedFromDate != '') && (formattedToDate != null && formattedToDate != '')) {
  //       this.assignedFrom = formattedFromDate;
  //       this.assignedTo = formattedToDate;
  //       this.assignedOnDatefilterview = true;
  //       this.router.navigate([], {
  //         queryParams: {
  //           assignedfrom: this.assignedFrom,
  //           assignedto: this.assignedTo
  //         },
  //         queryParamsHandling: 'merge',
  //       });
  //     } else {
  //       this.assignedOnDatefilterview = false;
  //     }
  //   }
  // }

  // *****************************Assignedleads section list*****************************

  // ENQUIRY-VIEW-FROM-DB
  filterhere() {
    this.fromdate = $('#fromdate').val();
    this.todate = $('#selectedtodate').val();
    if (this.fromdate == "" || this.todate == "") {
      this.router.navigate([], {
        queryParams: {
          from: "",
          to: ""
        },
        queryParamsHandling: 'merge',
      });
      this.datefilterview = false;
    } else if (this.fromdate == undefined || this.todate == undefined) {
      this.router.navigate([], {
        queryParams: {
          from: "",
          to: ""
        },
        queryParamsHandling: 'merge',
      });
      this.datefilterview = false;
    }
    else {
      MandateLeadStagesComponent.closedcount = 0;
      MandateLeadStagesComponent.count = 0;
      this.router.navigate([], {
        queryParams: {
          from: this.fromdate,
          to: this.todate
        },
        queryParamsHandling: 'merge',
      });
      this.datefilterview = true;
    }
    $('.modalclick').removeClass('modal-backdrop');
    $('.modalclick').removeClass('fade');
    $('.modalclick').removeClass('show');
    document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');

  }

  dateclose() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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

  rmchange(vals) {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    this.executivefilterview = true;
    if (vals.target.value == 'all') {
      this.filterLoader = false;
      this.executivefilterview = false;
      this.execid = "";
      this.execname = "";
      this.router.navigate([], {
        queryParams: {
          execid: "",
          execname: ""
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.execid = vals.target.value;
      this.rmid = this.execid;
      this.execname = vals.target.options[vals.target.options.selectedIndex].text;
      this.router.navigate([], {
        queryParams: {
          execid: this.execid,
          execname: this.execname
        },
        queryParamsHandling: 'merge',
      });
    }

  }

  propchange(vals) {
    var element = document.getElementById('filtermaindiv');
    this.propertyfilterview = true;
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;

    if (vals.target.value == 'all') {
      this.filterLoader = false;
      this.propertyid = "";
      this.propertyname = "";
      this.router.navigate([], {
        queryParams: {
          property: "",
          propname: "",
          team: "",
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.propertyid = vals.target.value;
      this.propertyname = vals.target.options[vals.target.options.selectedIndex].text;
      this.router.navigate([], {
        queryParams: {
          property: this.propertyid,
          propname: vals.target.options[vals.target.options.selectedIndex].text,
          team: "",
        },
        queryParamsHandling: 'merge',
      });
    }
    this.checkDirectTeam();
    if (this.propertyid == '16793' || this.propertyid == '1830') {
    } else {
      this.mandateexecutives = [];
      this.getExecutives();
    }
  }

  sourcechange(vals) {
    var element = document.getElementById('filtermaindiv');
    this.sourceFilter = true;
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;

    if (vals.target.value == 'all') {
      this.filterLoader = false;
      this.router.navigate([], {
        queryParams: {
          source: "",
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.source = vals.target.value;
      this.router.navigate([], {
        queryParams: {
          source: this.source
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  checkDirectTeam() {
    this._mandateService.checkdirectteamexist(this.propertyid).subscribe(executives => {
      if (executives['status'] == 'True') {
        if (this.roleid == '1' || this.roleid == '2') {
          this.directteamfound = true;
        } else {
          this.directteamfound = false;
        }
      } else {
        if (this.roleid == '1' || this.roleid == '2') {
          this.directteamfound = false;
        } else {
          this.directteamfound = false;
        }
      }
    });
  }

  getExecutives() {
    let teamlead;
    if (this.role_type == 1) {
      teamlead = this.userid
    } else {
      teamlead = '';
    }
    this._mandateService.fetchmandateexecutuves(this.propertyid, this.team, this.roleTeam, teamlead).subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      }
    });
  }

  statuschange(vals) {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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

  teamchange(vals) {
    if (vals.target.value == 'all') {
      this.filterLoader = false;
      this.team = "";
      this.router.navigate([], {
        queryParams: {
          team: "",
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.team = vals.target.value;
      this.router.navigate([], {
        queryParams: {
          team: this.team
        },
        queryParamsHandling: 'merge',
      });
    }
    // if (this.propertyid == '16793' || this.propertyid == '1830') {
    this.getExecutives();
    // }
  }

  stagestatuschange(vals) {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.stagestatusfilterview = true;
    this.stagestatusval = vals;

    $('.add_class').removeClass('active');
    if (vals == 1) {
      $('.fix_section').addClass('active');
    } else if (vals == 3) {
      $('.done_section').addClass('active');
    }


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

  // untouchedChange(num) {
  //   this.router.navigate([], {
  //     queryParams: {
  //       untouch: 1
  //     }, queryParamsHandling: 'merge'
  //   })
  // }

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
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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

  untouchedstatuschange(stage) {
    this.router.navigate([], {
      queryParams: {
        untouchedstage: stage
      },
      queryParamsHandling: 'merge',
    });
  }

  junkStageStatusChange(stage, vals) {
    this.stagevalue = stage;
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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

  prioritychange(vals) {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.filterLoader = true;
    this.priorityFilter = true;
    if (vals == '1') {
      this.priorityName = "1";
      this.router.navigate([], {
        queryParams: {
          priority: "1",
        },
        queryParamsHandling: 'merge',
      });
    } else if (vals == '2') {
      this.priorityName = "2";
      this.router.navigate([], {
        queryParams: {
          priority: "2",
        },
        queryParamsHandling: 'merge',
      });
    } else if (vals == '3') {
      this.priorityName = "3";
      this.router.navigate([], {
        queryParams: {
          priority: "3",
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  executiveclose() {
    $("input[name='executiveFilter']").prop("checked", false);
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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

  VisitAssignExecutiveclose() {
    $("input[name='executiveFilter']").prop("checked", false);
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.visitAssignExecutivefilterview = false;
    this.visitAssignExecid = "";
    this.visitAssignExecname = "";
    this.router.navigate([], {
      queryParams: {
        visitExecid: "",
        visitExecname: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  priorityClose() {
    this.priorityFilter = false;
    this.priorityName = '';
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.router.navigate([], {
      queryParams: {
        priority: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  propertyclose() {
    $("input[name='propFilter']").prop("checked", false);
    this.propertyfilterview = false;
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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

  sourceClose() {
    $("input[name='sourceFilter']").prop("checked", false);
    this.sourceFilter = false;
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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

  removeAdditionalParam() {
    this.isAdditonalParamPresent = false;
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.additionalParam = ''
    if (this.type == 'leads') {
      this.router.navigate([], {
        queryParams: {
          pending: '1',
          from: '',
          to: '',
          filterData: ''
        },
        queryParamsHandling: 'merge',
      });
    } else if (this.type == 'visits') {
      this.router.navigate([], {
        queryParams: {
          usv: '1',
          from: '',
          to: '',
          filterData: ''
        },
        queryParamsHandling: 'merge',
      });
    } else if (this.type == 'bookings') {
      this.router.navigate([], {
        queryParams: {
          brs: '1',
          from: '',
          to: '',
          filterData: ''
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  stageclose() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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

  latestRemarksClose() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    this.serachRemarks = "";
    this.latestRemarkFilter = false;
    this.router.navigate([], {
      queryParams: {
        remarks: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  //this load  is for assigned lead page.
  loadMoreassignedleads() {
    let limit;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limit = MandateLeadStagesComponent.count += 100;
    // } else {
    limit = MandateLeadStagesComponent.count += 30;
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
        loginuser: this.userid,
        priority: this.priorityName,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      let livecount = this.callerleads.length;
      if (livecount < this.pendingleadcounts) {
        this._mandateService.assignedLeads(param).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.followupleadsparam == 1) {
      var param1 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'generalfollowups',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        visits: this.leadstatusVisits,
        followup: this.categoryStage,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        remarks_search: this.serachRemarks,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      let livecount = this.callerleads.length;
      if (livecount < this.followupleadcounts) {
        this._mandateService.assignedLeads(param1).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.inactiveparam == 1) {
      let inactiveCount;
      if (this.inactiveTotal == '5') {
        inactiveCount = 'final';
      } else {
        inactiveCount = this.inactiveTotal;
      }
      var param2 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        followup: this.categoryStage,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        ...(this.roleid == 1 || this.roleid == 2 ? { counter: inactiveCount } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      let livecount = this.callerleads.length;
      if ((livecount < this.inactive1Count && this.inactiveTotal == '1') || (livecount < this.inactive2Count && this.inactiveTotal == '2') || (livecount < this.inactive3Count && this.inactiveTotal == '3') || (livecount < this.inactive4Count && this.inactiveTotal == '4') || (livecount < this.inactiveFinalCount && this.inactiveTotal == '5') || (this.roleid != 1 && this.roleid != 2 && livecount < this.inactivecounts)) {
        this._mandateService.assignedLeads(param2).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.untouchedParam == 1) {
      var untouchedpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: this.untouchedStage,
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        untouch: 1
      }
      let livecount = this.callerleads.length;
      if (livecount < this.untouchedCounts) {
        this._mandateService.assignedLeads(untouchedpar).subscribe(compleads => {
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
        statuss: this.overduesStage,
        stage: 'USV',
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.usvCounts) {
        this._mandateService.assignedLeads(usvpar).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.rsvParam == 1) {
      // let rsvstagestatus;
      // let rsvstatusValueData;
      // if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
      //   rsvstagestatus = 'active';
      //   if(this.stagestatusval == 1 || this.stagestatusval == 2 ||  this.stagestatusval == 3){
      //     rsvstatusValueData = this.stagestatusval;
      //     rsvstagestatus = '';
      //   }else{
      //     rsvstatusValueData = '';
      //     rsvstagestatus = 'active';
      //   }
      // } else {
      //   rsvstagestatus = '';
      //   if(this.stagestatusval == 1 || this.stagestatusval == 2 ){
      //     rsvstatusValueData = this.stagestatusval;
      //   }else{
      //     rsvstatusValueData = '3';
      //   }
      // }
      var rsvpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
        stage: 'RSV',
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.rsvCounts) {
        this._mandateService.assignedLeads(rsvpar).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.fnParam == 1) {
      // let fnstagestatus;
      // let fnstatusValueData;
      // if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
      //   fnstagestatus = 'active';
      //   if(this.stagestatusval == 1 || this.stagestatusval == 2 ||  this.stagestatusval == 3){
      //     fnstatusValueData = this.stagestatusval;
      //     fnstagestatus = ' ';
      //   }else{
      //     fnstatusValueData = '';
      //     fnstagestatus = 'active';
      //   }
      // } else {
      //   fnstagestatus = '';
      //   if(this.stagestatusval == 1 || this.stagestatusval == 2 ){
      //     fnstatusValueData = this.stagestatusval;
      //   }else{
      //     fnstatusValueData = '3';
      //   }
      // }
      var fnpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
        stage: 'Final Negotiation',
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.fnCounts) {
        this._mandateService.assignedLeads(fnpar).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.bookingPendingParam == 1) {
      var dealClosingg = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closing Pending',
        stagestatus: '3',
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
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
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.bookingPendingCounts) {
        this._mandateService.assignedLeads(dealClosingg).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.bookingRequestParam == 1) {
      var dealClosingg = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closing Requested',
        stagestatus: '3',
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
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
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.bookingRequestCounts) {
        this._mandateService.assignedLeads(dealClosingg).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.bookingRequestParam == 1) {
      var dealClosingg = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Closing Request Rejected',
        stagestatus: '3',
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
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
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.bookingRejectedCounts) {
        this._mandateService.assignedLeads(dealClosingg).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.bookedParam == 1) {
      var dealclosed = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closed',
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
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
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.bookedCounts) {
        this._mandateService.assignedLeads(dealclosed).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.junkleadsParam == 1) {
      let junkleadcount;
      if (this.junkLeadsTotal == '5') {
        junkleadcount = 'final';
      } else {
        junkleadcount = this.junkLeadsTotal;
      }
      var jparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkleads',
        stage: '',
        stagestatus: '',
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        ...(this.roleid == 1 || this.roleid == 2 ? { counter: junkleadcount } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      let livecount = this.callerleads.length;
      // if (livecount < this.junkleadsCounts) {
      if ((livecount < this.junklead1Count && this.junkLeadsTotal == '1') || (livecount < this.junklead2Count && this.junkLeadsTotal == '2') || (livecount < this.junklead3Count && this.junkLeadsTotal == '3') || (livecount < this.junklead4Count && this.junkLeadsTotal == '4') || (livecount < this.junkleadFinalCount && this.junkLeadsTotal == '5') || (this.roleid != 1 && this.roleid != 2 && livecount < this.junkleadsCounts)) {
        this._mandateService.assignedLeads(jparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.junkvisitsParam == 1) {
      let statestatusval;
      if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == null) {
        statestatusval = '3';
      } else {
        statestatusval = this.stagestatusval;
      }
      let junkvisitcount;
      if (this.junkVisitsTotal == '5') {
        junkvisitcount = 'final';
      } else {
        junkvisitcount = this.junkVisitsTotal;
      }
      var jvparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkvisits',
        stage: this.stagevalue,
        stagestatus: statestatusval,
        source: this.source,
        propid: this.propertyid,
        executid: this.rmid,
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        ...(this.roleid == 1 || this.roleid == 2 ? { counter: junkvisitcount } : {}),
      }
      let livecount = this.callerleads.length;
      // if (livecount < this.junkvisitsCounts) {
      if ((livecount < this.junkvisits1Count && this.junkVisitsTotal == '1') || (livecount < this.junkvisits2Count && this.junkVisitsTotal == '2') || (livecount < this.junkvisits3Count && this.junkVisitsTotal == '3') || (livecount < this.junkvisits4Count && this.junkVisitsTotal == '4') || (livecount < this.junkvisitsFinalCount && this.junkVisitsTotal == '5') || (this.roleid != 1 && this.roleid != 2 && livecount < this.junkvisitsCounts)) {
        this._mandateService.assignedLeads(jvparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.normalcallparam == 1) {
      let stagestatus;
      if (this.stagestatusval == '3' || this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
        stagestatus = ''
      } else if (this.stagestatusval == '2' || this.stagestatusval == '1') {
        stagestatus = '';
      }
      var paramnc = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'NC',
        stagestatus: stagestatus,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visitassignedTo: this.visitAssignExecid,
        visittype: this.visitType,
        remarks_search: this.serachRemarks,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      if (this.callerleads.length < this.normalcallcounts) {
        this._mandateService.assignedLeads(paramnc).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    }
    // if(this.followupsoverduesParam == 1){
    //   var gfparam = {
    //     limit: limit,
    //     limitrows: 100,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: 'overdues',
    //     stage: 'fresh',
    //     executid: this.rmid,
    //     loginuser: this.userid,
    //   }
    //   if (this.callerleads.length < this.followupsoverduesCount) {
    //   this._mandateService.assignedLeads(gfparam).subscribe(compleads => {
    //     this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
    //     this.filterLoader = false;
    //   });
    //   }
    // }else if(this.usvOverduesParam == 1){
    //   var usvparam = {
    //     limit: limit,
    //     limitrows: 100,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: 'overdues',
    //     stage: 'USV',
    //     executid: this.rmid,
    //     loginuser: this.userid,
    //   }
    //   if (this.callerleads.length < this.usvOverduesCount) {
    //   this._mandateService.assignedLeads(usvparam).subscribe(compleads => {
    //     this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
    //     this.filterLoader = false;
    //   });
    //   }
    // }else if(this.rsvOverduesParam == 1){
    //   var rsvparam = {
    //     limit: limit,
    //     limitrows: 100,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: 'overdues',
    //     stage: 'RSV',
    //     executid: this.rmid,
    //     loginuser: this.userid,
    //   }
    //   if (this.callerleads.length < this.rsvOverduesCount) {
    //   this._mandateService.assignedLeads(rsvparam).subscribe(compleads => {
    //     this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
    //     this.filterLoader = false;
    //   });
    //   }
    // }else if(this.fnOverduesParam == 1){
    //   var fnparam = {
    //     limit: limit,
    //     limitrows: 100,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: 'overdues',
    //     stage: 'Final Negotiation',
    //     executid: this.rmid,
    //     loginuser: this.userid,
    //   }
    //   if (this.callerleads.length < this.fnOverduesCount) {
    //   this._mandateService.assignedLeads(fnparam).subscribe(compleads => {
    //     this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
    //     this.filterLoader = false;
    //   });
    //   }
    // }
    else if (this.additionalParam == 'Touched') {
      var paramload1 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'touched',
        stage: '',
        stagestatus: '',
        propid: this.propertyid,
        executid: this.execid,
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
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      if (this.callerleads.length < this.additionalParamCount) {
        this._mandateService.assignedLeads(paramload1).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads'])
        });
      }
    } else if (this.additionalParam == 'Active') {
      var paramload = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'active',
        stage: '',
        stagestatus: '',
        propid: this.propertyid,
        executid: this.execid,
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
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      if (this.callerleads.length < this.additionalParamCount) {
        this._mandateService.assignedLeads(paramload).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads'])
        });
      }
    } else if (this.additionalParam == 'Assigned') {
      var paramload2 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'assignedleads',
        stage: '',
        stagestatus: '',
        propid: this.propertyid,
        executid: this.execid,
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
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      if (this.callerleads.length < this.additionalParamCount) {
        this._mandateService.assignedLeads(paramload2).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads'])
        });
      }
    } else if (this.additionalParam == 'AllVisits') {
      var paramload3 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'allvisits',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.execid,
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
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.additionalParamCount) {
        this._mandateService.assignedLeads(paramload3).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads'])
        });
      }
    } else if (this.additionalParam == 'ActiveVisits') {
      var paramloads = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'activevisits',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.execid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visittype: this.visitType,
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.additionalParamCount) {
        this._mandateService.assignedLeads(paramloads).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads'])
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
    this.overduejunk = '';
    this.serachRemarks = '';
    this.latestRemarkFilter = false;
    this.rnrCount = '';
    this.selectedFilteredEXECUTIVES = ''
    this.overduesStage = '';
    this.overduesSelection = false;
    $("input[name='programmingOverdues']").prop("checked", false);

    this.propertyclose();
    this.stageclose();
    this.executiveclose();
    this.priorityClose();
    this.sourceClose();
    this.receivedDateclose();
    this.visitedDateclose();
    this.assignedOnDateclose();
    this.VisitAssignExecutiveclose();

    this.sourceFilter = false;
    this.stagestatus = false;
    this.propertyfilterview = false;
    this.priorityFilter = false;
    this.categeoryfilterview = false;
    this.receivedDatefilterview = false;
    this.visitAssignExecutivefilterview = false;

    if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    } else {
      this.rmid = "";
    }
    // if (this.isAdditonalParamPresent == true) {
    //   console.log('if')
    //   this.router.navigate([], {
    //     queryParams: {
    //       from: '',
    //       to: '',
    //       property: '',
    //       propname: '',
    //       execid: null,
    //       execname: null,
    //       stage: '',
    //       stagestatus: '',
    //       team: null,
    //       priority: null,
    //       source: null,
    //       filterData: '',
    //       bookingLeadRequest: '',
    //       visits: '',
    //       followupcategory: '',
    //       followupcategoryName: '',
    //       receivedFrom: '',
    //       receivedTo: '',
    //       visitedfrom: '',
    //       visitedto: '',
    //       assignedfrom: "",
    //       assignedto: "",
    //       visitExecid: "",
    //       visitExecname: "",
    //       remarks: '',
    //       rnrCount: ''
    //     },
    //     queryParamsHandling: 'merge',
    //   });
    // } else {
    if (this.type == 'leads') {
      this.router.navigate([], {
        queryParams: {
          pending: '1',
          type: 'leads',
          htype: 'mandate',
          from: '',
          to: '',
          filterData: '',
        },
      });
    } else if (this.type == 'visits') {
      this.router.navigate([], {
        queryParams: {
          usv: '1',
          type: 'visits',
          htype: 'mandate',
          from: '',
          to: '',
          filterData: '',
          id: 3
        },
      });
    } else if (this.type == 'bookings') {
      this.router.navigate([], {
        queryParams: {
          brs: '1',
          type: 'bookings',
          htype: 'mandate',
          from: '',
          to: '',
          filterData: ''
        },
      });
    }
    this.isAdditonalParamPresent = false;
    // }
    $("input[name='propFilter']").prop("checked", false);
    $("input[name='executiveFilter']").prop("checked", false);
    $("input[name='sourceFilter']").prop("checked", false);
    // $("#option-1").prop("checked", false);
    // $("#option-2").prop("checked", false);
    // $("#option-3").prop("checked", false);
    // $("#option-4").prop("checked", false);
    // $("#option-5").prop("checked", false);
    // $("#option-6").prop("checked", false);
    // $(".other_section").removeClass("active");
    // $(".schedule_today").addClass("active");
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
    if ((this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null)) {
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
    } else if (this.followupleadsparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.followupleadsdata();
    } else if (this.normalcallparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.ncdatas();
    } else if (this.untouchedParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.untoucheddatas();
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
    } else if (this.bookingPendingParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.bookingPendingdatas();
    } else if (this.bookingRequestParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.bookingRequestdatas();
    } else if (this.bookingRejectedParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.bookingRejecteddatas();
    } else if (this.bookedParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.bookeddatas();
    } else if (this.inactiveparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.inactivedatas();
    } else if (this.junkleadsParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.junkleadsdatas();
    } else if (this.junkvisitsParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.junkvisitsdatas();
    } else if (this.additionalParam == 'Touched') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.toucheddata();
    } else if (this.additionalParam == 'Active') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.activedata();
    } else if (this.additionalParam == 'Assigned') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.assigneddata();
    } else if (this.additionalParam == 'AllVisits') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.allVisitsdata();
    } else if (this.additionalParam == 'ActiveVisits') {
      this.fromdate = "";
      this.todate = "";
      this.batch1trigger();
      this.activevisitsdata();
    }
  }

  //on clicking on reassign button reassign section will be shown
  selectedAssignType: any;
  onclickReAssign(type) {
    this.selectedAssignType = type;
    this.selectedTeamType = 'mandate';
    if (this.pendingleadsparam == '1') {
      this.reassignleadsCount = this.pendingleadcounts;
    } else if (this.followupleadsparam == '1') {
      this.reassignleadsCount = this.followupleadcounts;
    } else if (this.inactiveparam == '1') {
      this.reassignleadsCount = this.inactivecounts;
    } else if (this.untouchedParam == '1') {
      this.reassignleadsCount = this.untouchedCounts;
    } else if (this.usvParam == '1') {
      this.reassignleadsCount = this.usvCounts;
    } else if (this.rsvParam == '1') {
      this.reassignleadsCount = this.rsvCounts;
    } else if (this.fnParam == '1') {
      this.reassignleadsCount = this.fnCounts;
    } else if (this.junkleadsParam == '1') {
      this.reassignleadsCount = this.junkleadsCounts;
    } else if (this.junkvisitsParam == '1') {
      this.reassignleadsCount = this.junkvisitsCounts;
    } else if (this.bookingRequestParam == '1') {
      this.reassignleadsCount = this.bookingRequestCounts;
    } else if (this.bookingRejectedParam == '1') {
      this.reassignleadsCount = this.bookingRejectedCounts;
    } else if (this.bookedParam == '1') {
      this.reassignleadsCount = this.bookedCounts;
    } else if (this.normalcallparam == '1') {
      this.reassignleadsCount = this.normalcallcounts;
    }
    if (this.selectedAssignType == 'feedback') {
      // this._retailservice.getRetailExecutives('50004', '').subscribe(execute => {
      //   this.retailreassignListExecutives = execute['DashboardCounts'];
      // })
      this._mandateService.fetchmandateexecutuves('', '', '50014', '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.reassignListExecutives = executives['mandateexecutives'];
        }
      });
    }

    if (this.role_type == '1') {
      this.selectedTeamType = 'mandate';
      let accesProperty = localStorage.getItem('property_ID').split(',');
      this.mandateprojects = this.mandateprojects.filter((prop) => {
        return accesProperty.some((id) => {
          return prop.property_idfk == id
        });
      });
    }
  }

  //here we get the select counts of leads for retail
  selectcounts(event) {
    if (event.target.value > 30 && (this.roleid == 1 || this.roleid == '2')) {
      this.getReassignLeadsData(parseInt(event.target.value));
    } else if (event.target.value > 30 && this.role_type == '1') {
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

  selectfeedbackcounts(event) {
    if (event.target.value > 30) {
      this.getReassignLeadsData(parseInt(event.target.value));
    } else {
      $('#start3 tr td :checkbox').each(function () {
        this.checked = false;
      });
      var checkBoxes = $("#start3 tr td :checkbox:lt(" + event.target.value + ")");
      $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));

      if (event.target.value == 'Manual') {
        $('input[id="feedbackhidecheckboxid"]').attr("disabled", false);
        $('.feedbackhidecheckbox').show();
        this.getselectedleads();
      } else {
        $('.feedbackhidecheckbox').hide();
        $('input[id="feedbackhidecheckboxid"]:checked').show();
        $('input[id="feedbackhidecheckboxid"]:checked').attr("disabled", true);
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
      return lead.ExecId;
    })

    this.selectedLeadExecutiveIds = selectedLeadExecutiveIds.join(',')

    if (this.selectedEXECUTIVES && this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
      $('#customSwitch5').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch5').prop('checked', false);
      this.randomCheckVal = '';
    }
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

  //here we get the selected assigned team
  // reassignTeam(event) {
  //   this.selectedTeamType = event.target.value;
  //   this.selectedMandateProp = '';
  //   $('#mandate_dropdown').dropdown('clear');
  //   $('#mandateExec_dropdown').dropdown('clear');
  //   $('#retailExec_dropdown').dropdown('clear');
  //   $('#property_dropdown').dropdown('clear');
  //   if (event.target.value == 'mandate') {
  //     this.mandateprojectsfetch();
  //     this.selectedMandateProp = '16793';
  //     this._mandateService.fetchmandateexecutuves(16793, '', this.roleTeam).subscribe(executives => {
  //       if (executives['status'] == 'True') {
  //         this.reassignListExecutives = executives['mandateexecutives'];
  //       }
  //     });
  //   } else if (event.target.value == 'retail') {
  //     // console.log('retail')
  //     // this._retailservice.getRetailExecutives('', '').subscribe(execute => {
  //     //   this.retailreassignListExecutives = execute['DashboardCounts'];
  //     // })
  //   }
  // }

  //here we get the selected reassign mandate property
  reassignPropChange(event) {
    this.selectedMandateProp = event.target.value;
    if (this.mandateprojects) {
      let filteredproject = this.mandateprojects.filter((da) => da.property_idfk == event.target.value);
      if (filteredproject && filteredproject[0]) {
        this.filteredproject = filteredproject[0];
      }
    }
    // if (this.selectedTeamType == 'mandate') {
    this._mandateService.fetchmandateexecutuves(this.selectedMandateProp, this.selectedReassignTeamType, this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.reassignListExecutives = executives['mandateexecutives'];
      }
    });
    // }

    this.selectedEXECUTIVEIDS = [];
    this.selectedEXECUTIVES = [];
  }

  //heree we get the selected assign executive team type
  reassignExecTeam(event) {
    // if (event.target.options[event.target.options.selectedIndex].value == '50010' || event.target.options[event.target.options.selectedIndex].value == '50004') {
    //   const teamid = event.target.options[event.target.options.selectedIndex].value;
    //   this._retailservice.getRetailExecutives(teamid, '').subscribe(execute => {
    //     this.retailreassignListExecutives = execute['DashboardCounts'];
    //   })
    // } else {
    //   this._retailservice.getRetailExecutives('', '').subscribe(execute => {
    //     this.retailreassignListExecutives = execute['DashboardCounts'];
    //     // this.reassignListExecutives = this.reassignListExecutives.filter((da) => !(this.rmid.includes(da.ExecId)));
    //   })
    // }
    this.roleTeam = event.target.options[event.target.options.selectedIndex].value;
    this._mandateService.fetchmandateexecutuves(this.selectedMandateProp, this.selectedReassignTeamType, this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.reassignListExecutives = executives['mandateexecutives'];
      }
    });
    $('#mandateExec_dropdown').dropdown('clear');
    $('#retailExec_dropdown').dropdown('clear');
  };

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
    // 
    // if (this.selectedTeamType == 'mandate') {

    if (this.role_type == '1') {
      this.selectedEXECUTIVES.push(event.value);
    }
    this.selectedEXECUTIVEIDS = this.selectedEXECUTIVES.map((exec) => exec.id);
    if (this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
      $('#customSwitch5').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch5').prop('checked', false);
      this.randomCheckVal = '';
    }
    // } else if (this.selectedTeamType == 'retail') {
    //   this.selectedEXECUTIVEIDS = this.selectedEXECUTIVES.map((exec) => exec.ExecId);
    //   if (this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
    //     $('#customSwitch5').prop('checked', true);
    //     this.randomCheckVal = 1;
    //   } else {
    //     $('#customSwitch5').prop('checked', false);
    //     this.randomCheckVal = '';
    //   }
    // }
  }

  //here we are reassinging the leads now
  getAssignedLeadsList() {
    if (this.selectedAssignedleads == undefined || this.selectedAssignedleads == "") {
      swal({
        title: 'Please Select Some Leads!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    } else {
      $('#selectedleads').removeAttr("style");
      // this.filterLoader = true;
    }

    if (this.selectedTeamType == 'mandate' && this.selectedMandateProp == '') {
      $('#property_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Property');
      swal({
        title: 'Please Select Property!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    } else {
      $('#property_dropdown').removeAttr("style");
      // this.filterLoader = true;
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
    } else {
      $('#mandateExec_dropdown').removeAttr("style");
      $('#retailExec_dropdown').removeAttr("style");
      // this.filterLoader = true;
    }

    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let comma_separated_data = this.selectedEXECUTIVEIDS.join(',');
    let param = {
      assignedleads: this.selectedAssignedleads,
      customersupport: comma_separated_data,
      propId: this.selectedMandateProp,
      randomval: this.randomCheckVal,
      loginid: this.userid,
      executiveIds: this.selectedLeadExecutiveIds
    }
    this.filterLoader = true;
    if (this.filteredproject && this.filteredproject.crm == '2') {
      this._mandateService.ranavleadreassign(param).subscribe((success) => {
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
          $('#statuslist_dropdown').dropdown('clear');
          $('#followup_dropdown').dropdown('clear');
          $('#exec_designation').dropdown('clear');
          $('#exec_dropdown').dropdown('clear');
          $('#leadcount_dropdown').dropdown('clear');
          $('#team_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          $('#mandate_dropdown').dropdown('clear');
          $('#retail_dropdown').dropdown('clear');
          $('#mandateExec_dropdown').dropdown('clear');
          $('#retailExec_dropdown').dropdown('clear');
          this.selectedMandateProp = '';
          this.randomCheckVal = '';
          this.selectedEXEC = [];
          this.selectedEXECUTIVEIDS = [];
          this.selectedEXECUTIVES = [];
          this.selectedExecIds = [];
          this.maxSelectedLabels = Infinity;
          this.reassignfromdate = '';
          this.reassigntodate = '';
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
    } else {
      this._mandateService.leadreassign(param).subscribe((success) => {
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
          $('#statuslist_dropdown').dropdown('clear');
          $('#followup_dropdown').dropdown('clear');
          $('#exec_designation').dropdown('clear');
          $('#exec_dropdown').dropdown('clear');
          $('#leadcount_dropdown').dropdown('clear');
          $('#team_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          $('#mandate_dropdown').dropdown('clear');
          $('#retail_dropdown').dropdown('clear');
          $('#mandateExec_dropdown').dropdown('clear');
          $('#retailExec_dropdown').dropdown('clear');
          this.selectedMandateProp = '';
          this.randomCheckVal = '';
          this.selectedEXEC = [];
          this.selectedEXECUTIVEIDS = [];
          this.selectedEXECUTIVES = [];
          this.selectedExecIds = [];
          this.maxSelectedLabels = Infinity;
          this.reassignfromdate = '';
          this.reassigntodate = '';
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
  }

  //here we are reassinging the leads now
  teamLeadReassign() {
    if (this.selectedAssignedleads == undefined || this.selectedAssignedleads == "") {
      swal({
        title: 'Please Select Some Leads!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    } else {
      $('#selectedleads').removeAttr("style");
    }

    if (this.selectedTeamType == 'mandate' && this.selectedMandateProp == '') {
      $('#property_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Property');
      swal({
        title: 'Please Select Property!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    } else {
      $('#property_dropdown').removeAttr("style");
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
    } else {
      $('#mandateExec_dropdown').removeAttr("style");
    }
    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let comma_separated_data = this.selectedEXECUTIVEIDS.join(',');
    let param = {
      assignedleads: this.selectedAssignedleads,
      customersupport: comma_separated_data,
      propId: this.selectedMandateProp,
      loginid: this.userid,
      executiveIds: this.selectedLeadExecutiveIds
    }

    this.filterLoader = true;
    if (this.selectedTeamType == 'mandate') {
      if (this.type == 'leads') {
        this._mandateService.leadreassign(param).subscribe((success) => {
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
            $('#statuslist_dropdown').dropdown('clear');
            $('#followup_dropdown').dropdown('clear');
            $('#exec_designation').dropdown('clear');
            $('#exec_dropdown').dropdown('clear');
            $('#leadcount_dropdown').dropdown('clear');
            $('#team_dropdown').dropdown('clear');
            $('#property_dropdown').dropdown('clear');
            $('#mandate_dropdown').dropdown('clear');
            $('#retail_dropdown').dropdown('clear');
            $('#mandateExec_dropdown').dropdown('clear');
            $('#retailExec_dropdown').dropdown('clear');
            this.selectedMandateProp = '';
            this.randomCheckVal = '';
            this.selectedEXEC = [];
            this.selectedEXECUTIVEIDS = [];
            this.selectedEXECUTIVES = [];
            this.selectedExecIds = [];
            this.maxSelectedLabels = Infinity;
            this.reassignfromdate = '';
            this.reassigntodate = '';
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
      } else if (this.type == 'visits') {
        this._mandateService.leadAcessTransfer(param).subscribe((success) => {
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
            this.maxSelectedLabels = Infinity;
            this.reassignfromdate = '';
            this.reassigntodate = '';
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
    }
  }

  feedbackassignExecutive(event) {
    this.feedbackExecutive = event.target.value;
  }

  //here we assign the feedback leads
  postFeedbackLeads() {
    if (this.selectedAssignedleads == undefined || this.selectedAssignedleads == "") {
      swal({
        title: 'Please Select Some Leads!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    } else {
      $('#selectedleads').removeAttr("style");
      // this.filterLoader = true;
    }

    if (this.feedbackExecutive == undefined || this.feedbackExecutive.length == '' || this.feedbackExecutive == null) {
      $('#mandateExec_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Executives');
      $('#retailExec_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Executives');
      swal({
        title: 'Please Select The Executive!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    } else {
      $('#mandateExec_dropdown').removeAttr("style");
      $('#retailExec_dropdown').removeAttr("style");
      // this.filterLoader = true;
    }
    this.filterLoader = true;
    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let param = {
      assignedleads: this.selectedAssignedleads,
      customersupport: this.feedbackExecutive,
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
          $('#feedback_assign_lead').click();
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
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    if (property != null || property != '' || property != undefined) {
      this.propertyfilterview = true;
      this.propertyname = property.property_info_name;
      this.propertyid = property.property_idfk;
      this.execid = '';
      this.execname = '';
      $("input[name='executiveFilter']").prop("checked", false);
      if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
        this.getExecutivesForFilter();
      }
      this.router.navigate([], {
        queryParams: {
          property: this.propertyid,
          propname: this.propertyname,
          execid: '',
          execname: '',
          team: "",
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
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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

  filterExecutiveSelect(event) {
    let execids = event.value.map((id) => id.id);
    let execnames = event.value.map((name) => name.name);
    if (execids != '' || execids != undefined) {
      this.executivefilterview = true;
      this.execname = execnames;
      this.execid = execids;
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

  //executives selection  filter for CS
  onCheckboxCSExecutiveChange(exec) {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;

    // if (exec != '' || exec != undefined) {
    //   this.executivefilterview = true;
    //   this.execname = exec.name;
    //   this.execid = exec.id;
    //   this.router.navigate([], {
    //     queryParams: {
    //       execid: this.execid,
    //       execname: this.execname
    //     },
    //     queryParamsHandling: 'merge',
    //   });
    // } else {
    //   this.executivefilterview = false;
    //   this.execid = '';
    //   this.execname = '';
    // }
    if (exec != '' && exec != undefined && exec != null) {
      this.visitAssignExecutivefilterview = true;
      this.visitAssignExecname = exec.name;
      this.visitAssignExecid = exec.id;
      this.router.navigate([], {
        queryParams: {
          visitExecid: this.visitAssignExecid,
          visitExecname: this.visitAssignExecname
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.visitAssignExecutivefilterview = false;
      this.visitAssignExecid = '';
      this.visitAssignExecname = '';
    }
  }

  onCheckboxTeamExecutiveChange(exec, type) {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
    if (type == 'rm') {
      if (exec != '' && exec != undefined && exec != null) {
        this.executivefilterview = true;
        this.execname = exec.name;
        this.execid = exec.id;
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
    } else if (type == 'cs') {
      if (exec != '' && exec != undefined && exec != null) {
        this.visitAssignExecutivefilterview = true;
        this.visitAssignExecname = exec.name;
        this.visitAssignExecid = exec.id;
        this.router.navigate([], {
          queryParams: {
            visitExecid: this.visitAssignExecid,
            visitExecname: this.visitAssignExecname
          },
          queryParamsHandling: 'merge',
        });
      } else {
        this.visitAssignExecutivefilterview = false;
        this.visitAssignExecid = '';
        this.visitAssignExecname = '';
      }
    }
  }

  // Filter executives based on search 
  filterExecutive(): void {
    if (this.searchTerm_executive != '') {
      if (this.visitType != 1) {
        this.mandateExecutivesFilter = this.copyMandateExecutives.filter(exec =>
          exec.name.toLowerCase().includes(this.searchTerm_executive.toLowerCase())
        );
      } else {
        this.rmMandateExecutivesFilter = this.copyRmMandateExecutivesFilter.filter(exec =>
          exec.name.toLowerCase().includes(this.searchTerm_executive.toLowerCase())
        );
      }
    } else {
      this.mandateExecutivesFilter = this.copyMandateExecutives;
      this.rmMandateExecutivesFilter = this.copyRmMandateExecutivesFilter;
    }

  }

  // Filter executives based on search  for rms
  filterCsExecutive(): void {
    if (this.searchTerm_cs_executives != '') {
      this.assignedVisitsBy = this.copyOfAssignedVisitsBy.filter(exec =>
        exec.name.toLowerCase().includes(this.searchTerm_cs_executives.toLowerCase())
      );
    } else {
      this.assignedVisitsBy = this.copyOfAssignedVisitsBy
    }

  }

  selectedFilteredEXECUTIVES: any;
  //get list of mandate executives for mandate for filter purpose
  getExecutivesForFilter() {
    if (this.role_type != 1) {
      this._mandateService.fetchmandateexecutuvesforreassign(this.propertyid, '', '', '', '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
          this.rmMandateExecutivesFilter = executives['mandateexecutives'].filter((team) => team.roleid == '50002' || team.roleid == '50001');
          this.copyRmMandateExecutivesFilter = executives['mandateexecutives'].filter((team) => team.roleid == '50002' || team.roleid == '50001');
          this.selectedFilteredEXECUTIVES = this.mandateExecutivesFilter.filter(da =>
            this.execid.includes(da.id)
          )
        }
      });
    } else {
      this._mandateService.fetchmandateexecutuvesforreassign(this.mandateProperty_ID, '2', '', '', this.userid).subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
          this.rmMandateExecutivesFilter = executives['mandateexecutives'].filter((team) => team.roleid == '50002' || team.roleid == '50001');
          this.copyRmMandateExecutivesFilter = executives['mandateexecutives'].filter((team) => team.roleid == '50002' || team.roleid == '50001');
          this.selectedFilteredEXECUTIVES = this.mandateExecutivesFilter.filter(da =>
            this.execid.includes(da.id)
          )
        }
      });
    }
  }

  onCheckboxChangesource() {
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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
    MandateLeadStagesComponent.closedcount = 0;
    MandateLeadStagesComponent.count = 0;
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

  //this method is used in junk and inactive param,here we check time difference to allow the executive to access the lead.
  isOverAnHourOld(apiDate: string): boolean {
    const apiDateObj = new Date(apiDate);
    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - apiDateObj.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff > 2;
  }

  //here ,this is the code for view ,accept and reject request.
  verifyrequest(leadid, propid, execid, propname, stage) {
    if (stage == 'Closing Request Rejected') {
      this.isbuttondisable = true;
    } else {
      this.isbuttondisable = false;
    }
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

  public getExstendsion(image) {
    if (image.endsWith('jpg') || image.endsWith('jpeg') || image.endsWith('png')) {
      return 'jpg';
    }
    if (image.endsWith('pdf')) {
      return 'pdf';
    }
  }

  requestapproval(leadid, execid, propid) {
    var param = {
      leadid: leadid,
      propid: propid,
      execid: this.userid,
      statusid: '1',
      remarks: "No Comments",
      assignid: execid
    }
    this._mandateService.closingrequestresponse(param)
      .subscribe(requestresponse => {
        if (requestresponse['status'] == 'True-0') {
          let autoremarks = " Send the Deal Closing Request successfully.";
          var leadhistparam = {
            leadid: leadid,
            closedate: this.requestedunits[0].closed_date,
            closetime: this.requestedunits[0].closed_time,
            textarearemarks: "Deal closed Request Approved",
            leadstage: "Lead Closed",
            stagestatus: '0',
            userid: this.userid,
            assignid: execid,
            property: propid,
            autoremarks: autoremarks
          }

          this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this.filterLoader = false;
              swal({
                title: 'Deal Closing Requested Successfully',
                type: "success",
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
              });
              if (this.userid == 1) {
                var param = {
                  leadid: leadid,
                  propid: propid,
                  execid: this.userid,
                  assignid: execid,
                  statusid: '1',
                  remarks: "No Comments"
                }
                this._mandateService.closingrequestresponse(param)
                  .subscribe(requestresponse => {
                    if (requestresponse['status'] == 'True-0') {
                      swal({
                        title: 'Request Approved Successfully',
                        type: "success",
                        timer: 2000,
                        showConfirmButton: false
                      }).then(() => {
                        $('.modal-backdrop').closest('div').remove();
                        let currentUrl = this.router.url;
                        let pathWithoutQueryParams = currentUrl.split('?')[0];
                        let currentQueryparams = this.route.snapshot.queryParams;
                        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                          this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
                        });
                        // location.reload();
                      });
                    } else {
                      swal({
                        title: 'Some Error Occured',
                        type: "error",
                        timer: 2000,
                        showConfirmButton: false
                      }).then(() => {
                        $('.modal-backdrop').closest('div').remove();
                        let currentUrl = this.router.url;
                        let pathWithoutQueryParams = currentUrl.split('?')[0];
                        let currentQueryparams = this.route.snapshot.queryParams;
                        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                          this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
                        });
                        // location.reload();
                      });
                    }
                  });
              }
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
          swal({
            title: 'Request Approved Successfully',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            $('.modal-backdrop').closest('div').remove();
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
            });
            // location.reload();
          });
        } else {
          swal({
            title: 'Some Error Occured',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            $('.modal-backdrop').closest('div').remove();
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
            });
            // location.reload();
          });
        }
      });
  }

  modaldropadd() { }

  closeRejectionModal() {
    setTimeout(() => {
      $('body').addClass('modal-open')
    }, 1000)
  }

  requestrejection(leadid, execid, propid) {
    if ($(".rejectedtextarea").val() == "") {
      $(".rejectedtextarea").focus().css("border-color", "red").attr('placeholder', 'Please add the reason for rejection');
      return false;
    } else {
      $(".rejectedtextarea").removeAttr("style");
    }

    var remarkscontent = $(".rejectedtextarea").val();
    var param = {
      leadid: leadid,
      propid: propid,
      execid: execid,
      statusid: '2',
      remarks: remarkscontent,
      assignid: execid
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
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
            });
            // location.reload();
          });
        } else {
          swal({
            title: 'Some Error Occured',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            $('.close').click();
            // let currentUrl = this.router.url;
            // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            //   this.router.navigate([currentUrl]);
            // });
          });
        }
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

  getPriorityType(lead){
    this.selectedUpdatePriority = lead.lead_priority;
  }

  initializeNextActionDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      const pickerElement = $('#nextActionDates');
      if (start && end) {
        pickerElement.find('span').html(start.format('MMMM D, YYYY HH:mm:ss') + ' - ' + end.format('MMMM D, YYYY HH:mm:ss'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          $(this).data('daterangepicker').setEndDate(end);
        }
      } else {
        pickerElement.find('span').html('Select Date Range');
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

  //here we get the datepicker for received on filter
  initializeLeadReceivedDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#leadReceivedDates span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          $(this).data('daterangepicker').setEndDate(end);
        }
      } else {
        $('#leadReceivedDates span').html('Select Date Range');
      }

      if (start && end) {
        this.receivedFromDate = start.format('YYYY-MM-DD');
        this.receivedToDate = end.format('YYYY-MM-DD');
        this.receivedDatefilterview = true;
        this.router.navigate([], {
          queryParams: {
            receivedFrom: this.receivedFromDate,
            receivedTo: this.receivedToDate
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

    $('#leadReceivedDates').daterangepicker({
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
    cb(this.leadRecStart, this.leadRecEnd);
  }

  //here we get the datepicker for Assigned on filter
  // initializeAssignedOnDateRangePicker() {
  //   const inputEl = $('#assigedOnDates');

  //   const cb = (start: moment.Moment, end: moment.Moment) => {
  //     if (start && end) {
  //       // $('#assigedOnDates span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  //       inputEl.val(
  //         start.format('MMMM D, YYYY') +
  //         ' - ' +
  //         end.format('MMMM D, YYYY')
  //       );
  //       if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
  //         end = end.endOf('day');
  //         // $(this).data('daterangepicker').setEndDate(end);
  //           inputEl.data('daterangepicker').setEndDate(end);
  //       }
  //     } else {
  //       $('#assigedOnDates span').html('Select Date Range');
  //     }

  //     if (start && end) {
  //       this.assignedFrom = start.format('YYYY-MM-DD');
  //       this.assignedTo = end.format('YYYY-MM-DD');
  //       this.assignedOnDatefilterview = true;
  //       this.router.navigate([], {
  //         queryParams: {
  //           assignedfrom: this.assignedFrom,
  //           assignedto: this.assignedTo
  //         },
  //         queryParamsHandling: 'merge',
  //       });
  //     } else {
  //     }
  //   };
  //   // Retrieve the date range from the URL query params (if any)
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const fromDate = urlParams.get('from');
  //   const toDate = urlParams.get('to');
  //   const fromTime = urlParams.get('fromtime');
  //   const toTime = urlParams.get('totime');
  //   // Initialize start and end dates based on URL parameters or default values
  //   let startDate = fromDate ? moment(fromDate) : moment().startOf('day');
  //   let endDate = toDate ? moment(toDate) : moment().endOf('day');

  //   if (fromTime && fromDate) {
  //     startDate = moment(fromDate + ' ' + fromTime, 'YYYY-MM-DD');
  //   }

  //   if (toTime && toDate) {
  //     endDate = moment(toDate + ' ' + toTime, 'YYYY-MM-DD');
  //   }

  //  inputEl.daterangepicker({
  //     startDate: startDate || moment().startOf('day'),
  //     endDate: endDate || moment().startOf('day'),
  //     showDropdowns: false,
  //     maxDate: new Date(),
  //     timePicker: false,
  //     timePickerIncrement: 1,
  //     locale: {
  //       format: 'MMM D, YYYY'
  //     },
  //     autoApply: true,
  //   }, cb);
  //   cb(this.assignedOnStart, this.assignedOnEnd);
  // }

  initializeAssignedOnDateRangePicker() {

    const inputEl = $('#assigedOnDates');
    if (inputEl.data('daterangepicker')) {
      inputEl.data('daterangepicker').remove();
    }

    let startDate = this.assignedFrom
      ? moment(this.assignedFrom, 'YYYY-MM-DD')
      : moment().startOf('day');

    let endDate = this.assignedTo
      ? moment(this.assignedTo, 'YYYY-MM-DD')
      : moment().endOf('day');

    inputEl.daterangepicker({
      startDate,
      endDate,
      autoApply: true,
      maxDate: moment(),
      timePicker: false,
      locale: {
        format: 'DD-MMM-YYYY'
      }
    });

    inputEl.val(
      startDate.format('DD-MMM-YYYY') +
      ' - ' +
      endDate.format('DD-MMM-YYYY')
    );
    inputEl.off('apply.daterangepicker').on(
      'apply.daterangepicker',
      (ev, picker) => {

        inputEl.val(
          picker.startDate.format('DD-MMM-YYYY') +
          ' - ' +
          picker.endDate.format('DD-MMM-YYYY')
        );

        this.assignedFrom = picker.startDate.format('YYYY-MM-DD');
        this.assignedTo = picker.endDate.format('YYYY-MM-DD');

        this.router.navigate([], {
          queryParams: {
            assignedfrom: this.assignedFrom,
            assignedto: this.assignedTo
          },
          queryParamsHandling: 'merge',
        });
      }
    );
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
        totime: this.toTime,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
    } else if (this.followupleadsparam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'generalfollowups',
        // stage: this.stagevalue,
        // stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        followup: this.categoryStage,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        remarks_search: this.serachRemarks,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
    } else if (this.normalcallparam == 1) {
      let stagestatus;
      if (this.stagestatusval == '3' || this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
        stagestatus = ''
      } else if (this.stagestatusval == '2' || this.stagestatusval == '1') {
        stagestatus = '';
      }
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'NC',
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
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visittype: this.visitType,
        remarks_search: this.serachRemarks,
        rnrleads: this.rnrCount,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
    } else if (this.untouchedParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: this.untouchedStage,
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
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        untouch: 1
      }
    } else if (this.usvParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
        stage: 'USV',
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
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.rsvParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
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
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.fnParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.overduesStage,
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
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      }
    } else if (this.inactiveparam == 1) {
      let inactiveCount;
      if (this.inactiveTotal == '5') {
        inactiveCount = 'final';
      } else {
        inactiveCount = this.inactiveTotal;
      }
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: '',
        stagestatus: '',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        followup: this.categoryStage,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        ...(this.roleid == 1 || this.roleid == 2 ? { counter: inactiveCount } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
    } else if (this.junkleadsParam == 1) {
      let junkleadcount;
      if (this.junkLeadsTotal == '5') {
        junkleadcount = 'final';
      } else {
        junkleadcount = this.junkLeadsTotal;
      }
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkleads',
        stage: '',
        stagestatus: '',
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
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        ...(this.roleid == 1 || this.roleid == 2 ? { counter: junkleadcount } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
    } else if (this.junkvisitsParam == 1) {
      let stagestatus;
      if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
        stagestatus = '3';
      }
      else {
        stagestatus = this.stagestatusval;
      }

      let junkvisitcount;
      if (this.junkVisitsTotal == '5') {
        junkvisitcount = 'final';
      } else {
        junkvisitcount = this.junkVisitsTotal;
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
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        ...(this.roleid == 1 || this.roleid == 2 ? { counter: junkvisitcount } : {}),
      }
    } else if (this.bookingRequestParam == 1) {
      if (this.leadBookingstatus == 1) {
        this.selectedBookingLeadStatus = 'Rejected'
      } else if (this.leadBookingstatus == 2) {
        this.selectedBookingLeadStatus = 'Pending'
      } else {
        this.selectedBookingLeadStatus = 'All'
      }

      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closing Requested',
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
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.bookingRejectedParam == 1) {
      if (this.leadBookingstatus == 1) {
        this.selectedBookingLeadStatus = 'Rejected'
      } else if (this.leadBookingstatus == 2) {
        this.selectedBookingLeadStatus = 'Pending'
      } else {
        this.selectedBookingLeadStatus = 'All'
      }
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Closing Request Rejected',
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
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.bookedParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Deal Closed',
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
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.additionalParam == 'AllVisits') {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'allvisits',
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
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.additionalParam == 'ActiveVisits') {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'activevisits',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        team: this.team,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        fromtime: this.fromTime,
        totime: this.toTime,
        visittype: this.visitType,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
    } else if (this.additionalParam == 'Active') {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'active',
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
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
    } else if (this.additionalParam == 'Touched') {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'touched',
        stage: '',
        stagestatus: '',
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
        visitassignedTo: this.visitAssignExecid,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
    }
    this.callerleads = [];
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      if (compleads.status == 'True') {
        this.filterLoader = false;
        this.callerleads = compleads['AssignedLeads'];
        setTimeout(() => {
          if (this.selectedAssignType == 'reassign') {
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
          } else if (this.selectedAssignType == 'feedback') {
            $('#start3 tr td :checkbox').each(function () {
              this.checked = false;
            });
            var checkBoxes = $("#start3 tr td :checkbox:lt(" + limitR + ")");
            $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));

            if (limitR == 'Manual') {
              $('input[id="feedbackhidecheckboxid"]').attr("disabled", false);
              $('.feedbackhidecheckbox').show();
              this.getselectedleads();
            } else {
              $('.feedbackhidecheckbox').hide();
              $('input[id="feedbackhidecheckboxid"]:checked').show();
              $('input[id="feedbackhidecheckboxid"]:checked').attr("disabled", true);
              this.getselectedleads();
            }
          }
        }, 1000)
      }
    });
  }

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
    this.selectedRecordExec = this.calledLead.ExecId;
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

  filterRemarks() {
    if (this.serachRemarks.trim()) {
      this.latestRemarkFilter = true;
      // if (this.followupleadsparam == 1) {
      //   this.filterLoader = true;

      //   var followups = {
      //     datefrom: this.fromdate,
      //     dateto: this.todate,
      //     statuss: 'generalfollowups',
      //     stage: '',
      //     stagestatus: '',
      //     propid: this.propertyid,
      //     executid: this.rmid,
      //     loginuser: this.userid,
      //     priority: this.priorityName,
      //     team: this.team,
      //     source: this.source,
      //     followup: this.categoryStage,
      //     visits: this.leadstatusVisits,
      //     receivedfrom: this.receivedFromDate,
      //     receivedto: this.receivedToDate,
      //     assignedfrom: this.assignedFrom,
      //     assignedto: this.assignedTo,
      //     fromtime: this.fromTime,
      //     totime: this.toTime,
      //     visitassignedTo: this.visitAssignExecid,
      //     remarks_search: this.serachRemarks
      //   }
      //   this._mandateService.assignedLeadsCount(followups).subscribe(compleads => {
      //     if (compleads['status'] == 'True') {
      //       this.followupleadcounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      //     } else {
      //       this.followupleadcounts = "0";
      //     }
      //     this.calculateTotalCount();
      //   });

      //   var param = {
      //     limit: 0,
      //     limitrows: 30,
      //     datefrom: this.fromdate,
      //     dateto: this.todate,
      //     statuss: 'generalfollowups',
      //     propid: this.propertyid,
      //     executid: this.rmid,
      //     loginuser: this.userid,
      //     priority: this.priorityName,
      //     team: this.team,
      //     source: this.source,
      //     followup: this.categoryStage,
      //     visits: this.leadstatusVisits,
      //     receivedfrom: this.receivedFromDate,
      //     receivedto: this.receivedToDate,
      //     assignedfrom: this.assignedFrom,
      //     assignedto: this.assignedTo,
      //     fromtime: this.fromTime,
      //     totime: this.toTime,
      //     visitassignedTo: this.visitAssignExecid,
      //     remarks_search: this.serachRemarks
      //   }
      //   this._mandateService.assignedLeads(param).subscribe(compleads => {
      //     this.filterLoader = false;
      //     this.callerleads = compleads['AssignedLeads'];
      //   });
      // } else if (this.normalcallparam == 1) {
      //   this.filterLoader = true;

      //   let stagestatus;
      //   if (this.stagestatusval == '3' || this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
      //     stagestatus = ''
      //   } else if (this.stagestatusval == '2' || this.stagestatusval == '1') {
      //     stagestatus = '';
      //   }

      //   var nc = {
      //     datefrom: this.fromdate,
      //     dateto: this.todate,
      //     statuss: '',
      //     stage: 'NC',
      //     stagestatus: stagestatus,
      //     propid: this.propertyid,
      //     executid: this.rmid,
      //     loginuser: this.userid,
      //     priority: this.priorityName,
      //     team: this.team,
      //     source: this.source,
      //     visits: this.leadstatusVisits,
      //     receivedfrom: this.receivedFromDate,
      //     receivedto: this.receivedToDate,
      //     assignedfrom: this.assignedFrom,
      //     assignedto: this.assignedTo,
      //     fromtime: this.fromTime,
      //     totime: this.toTime,
      //     visitassignedTo: this.visitAssignExecid,
      //     visittype: this.visitType,
      //     remarks_search: this.serachRemarks
      //   }
      //   this._mandateService.assignedLeadsCount(nc).subscribe(compleads => {
      //     if (compleads['status'] == 'True') {
      //       this.normalcallcounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      //     } else {
      //       this.normalcallcounts = 0;
      //     }
      //     this.calculateTotalCount();
      //   });

      //   var param1 = {
      //     limit: 0,
      //     limitrows: 30,
      //     datefrom: this.fromdate,
      //     dateto: this.todate,
      //     statuss: '',
      //     stage: 'NC',
      //     stagestatus: stagestatus,
      //     propid: this.propertyid,
      //     executid: this.rmid,
      //     loginuser: this.userid,
      //     priority: this.priorityName,
      //     team: this.team,
      //     source: this.source,
      //     visits: this.leadstatusVisits,
      //     receivedfrom: this.receivedFromDate,
      //     receivedto: this.receivedToDate,
      //     assignedfrom: this.assignedFrom,
      //     assignedto: this.assignedTo,
      //     fromtime: this.fromTime,
      //     totime: this.toTime,
      //     visitassignedTo: this.visitAssignExecid,
      //     visittype: this.visitType,
      //     remarks_search: this.serachRemarks
      //   }
      //   this._mandateService.assignedLeads(param1).subscribe(compleads => {
      //     this.filterLoader = false;
      //     this.callerleads = compleads['AssignedLeads'];
      //   });
      // }
      this.router.navigate([], {
        queryParams: {
          remarks: this.serachRemarks
        }, queryParamsHandling: 'merge'
      })
    }
  }

  detailsPageRedirection() {
    if (this.type == 'leads') {
      localStorage.setItem('backLocation', 'leads');
    } else if (this.type == 'visits') {
      localStorage.setItem('backLocation', 'visits');
    } else if (this.type == 'bookings') {
      localStorage.setItem('backLocation', 'bookings');
    }
  }

  getAllInactiveLeads() {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked == true) {
      this.router.navigate([], {
        queryParams: {
          rnrCount: 1
        }, queryParamsHandling: 'merge'
      })
    } else {
      this.router.navigate([], {
        queryParams: {
          rnrCount: ''
        }, queryParamsHandling: 'merge'
      })
    }
  }

  getAlloverdues() {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked == true) {
      this.router.navigate([], {
        queryParams: {
          overdues: checked
        }, queryParamsHandling: 'merge'
      })
    } else {
      this.overduesSelection = false;
      this.router.navigate([], {
        queryParams: {
          overdues: checked
        }, queryParamsHandling: 'merge'
      })
    }
  }


  convertToActive() {
    this.filterLoader = true;
    this._mandateService.markAllAsActive().subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'True') {
        swal({
          title: 'Suuccessfully made Active',
          type: "success",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        });
      } else {
        swal({
          title: 'Some Error Occured',
          type: "error",
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  selectedUpdatePriority: any;
  updatePrriority(type) {
    this.selectedUpdatePriority = type;
  }

  updateLeadPriority(lead) {

    if (this.selectedUpdatePriority == null || this.selectedUpdatePriority == undefined || this.selectedUpdatePriority == '') {
      swal({
        title: 'Select the Priority type',
        type: "error",
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    }

    let param = {
      leadid: lead.LeadID,
      priority: this.selectedUpdatePriority
    }

    this._mandateService.updatePriority(param).subscribe((resp) => {
      if (resp.status == 'True') {
        swal({
          title: 'Updated Successfully',
          text: 'Priority type Successfully updated',
          type: "success",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        })
      } else {
        swal({
          title: 'Some Error Occured',
          type: "error",
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  // Convert API date string to Date object
  toDate(dateStr: string): Date {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0); // remove time part
    return d;
  }

  calculateDiff(dateStr: string): number {
    if (!dateStr) return 0;

    const nextDate = this.toDate(dateStr);
    const diffTime = nextDate.getTime() - this.todaysDate.getTime();
    return Math.ceil(Math.abs(diffTime / (1000 * 60 * 60 * 24)));
  }

  // scrollEvent = (e: any): void => {
  //   setTimeout(() => {
  //     $('[data-toggle="popover"]').each(function () {
  //       if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
  //         $(this).popover('hide');
  //       }
  //     });
  //   }, 10)
  // }

  // showall(i: number): void {
  //   $(`.popper${i}`).popover({
  //     html: true,
  //     template: `
  //   <div class="popover access_popover" role="tooltip">
  //     <div class="arrow"></div>
  //     <div class="popover-body"></div>
  //   </div>
  // `,
  //     content: function () {
  //       return $(`.popover_content_wrapper${i}`).html();
  //     },
  //   });
  //   $(`.popper${i}`).popover('show');
  // }

  enableAccess(lead) {
    let param = {
      leadid: lead.LeadID,
      execid: lead.ExecId,
      propid: lead.propertyid
    }

    this._mandateService.postEnableAccess(param).subscribe((resp) => {
      if (resp.status == 'True') {
        swal({
          title: 'Enabled Successfully',
          text: 'Lead Access reverted Successfully',
          type: "success",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        })
      } else {
        swal({
          title: 'Some Error Occured',
          type: "error",
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  overdueReassign(lead) {
    this.selectedOverduesLead = lead;
    $('#trigger_overdue_reassign').click();

    this._mandateService.fetchmandateexecutuvesforreassign(lead.propertyid, '', '', '', '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.overduedReassignExecutives = executives['mandateexecutives'];
      }
    });
  }

  overdueReassignexecutiveSelect(event) {
    let selectedExecs = event.value.map(exec => exec.id)
    this.selectedOverduedExecs = selectedExecs.join(',');
  }

  assignOverduedLead() {
    if (this.selectedOverduedExecs == undefined || this.selectedOverduedExecs == null || this.selectedOverduedExecs == '') {
      $('#mandateExec_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Executives');
      swal({
        title: 'Please Select The Executive!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    } else {
      $('#mandateExec_dropdown').removeAttr("style");
    }

    let param = {
      assignedleads: this.selectedOverduesLead.LeadID,
      customersupport: this.selectedOverduedExecs,
      propId: this.selectedOverduesLead.propertyid,
      loginid: this.userid,
      executiveIds: this.selectedOverduesLead.ExecId
    }

    this._mandateService.leadreassign(param).subscribe((success) => {
      this.filterLoader = false;
      this.status = success.status;
      if (this.status == "True") {
        $('#closeoverduesreassignmodal').click();
        swal({
          title: 'Assigned Successfully',
          type: 'success',
          confirmButtonText: 'Show Details'
        }).then(() => {
          this.reassignedResponseInfo = success['assignedleads'];
          $('#reassign_leads_detail').click();
        })
        $('#statuslist_dropdown').dropdown('clear');
        $('#followup_dropdown').dropdown('clear');
        $('#exec_designation').dropdown('clear');
        $('#exec_dropdown').dropdown('clear');
        $('#leadcount_dropdown').dropdown('clear');
        $('#team_dropdown').dropdown('clear');
        $('#property_dropdown').dropdown('clear');
        $('#mandate_dropdown').dropdown('clear');
        $('#retail_dropdown').dropdown('clear');
        $('#mandateExec_dropdown').dropdown('clear');
        $('#retailExec_dropdown').dropdown('clear');
        this.selectedOverduedExecs = [];
        this.selectedOverduesLead = [];
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

  redirectTo(lead) {
    // save data
    this._sharedservice.leads = this.callerleads;
    this._sharedservice.page = MandateLeadStagesComponent.count;
    this._sharedservice.scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this._sharedservice.hasState = true;

    localStorage.setItem('backLocation', '');

    let tab;
    if (this.pendingleadsparam == 1) {
      tab = 'pendingleadsparam'
    } else if (this.followupleadsparam == 1) {
      tab = 'followupleadsparam'
    } else if (this.normalcallparam == 1) {
      tab = 'normalcallparam'
    } else if (this.inactiveparam == 1) {
      tab = 'inactiveparam';
    } else if (this.junkleadsParam == 1) {
      tab = 'junkleadsParam';
    } else if (this.untouchedParam == 1) {
      tab = 'untouchedParam';
    } else if (this.usvParam == 1) {
      tab = 'usvParam';
    } else if (this.rsvParam == 1) {
      tab = 'rsvParam';
    } else if (this.fnParam == 1) {
      tab = 'fnParam';
    } else if (this.junkvisitsParam == 1) {
      tab = 'junkvisitsParam';
    } else if (this.bookingPendingParam == 1) {
      tab = 'bookingPendingParam';
    } else if (this.bookingRequestParam == 1) {
      tab = 'bookingRequestParam';
    } else if (this.bookingRejectedParam == 1) {
      tab = 'bookingRejectedParam';
    } else if (this.bookedParam == 1) {
      tab = 'bookedParam';
    }

    const state = {
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      rnrCount: this.rnrCount,
      priority: this.priorityName,
      visits: this.leadstatusVisits,
      source: this.source,
      propertyid: this.propertyid,
      propertyname: this.propertyname,
      followupcategory: this.categoryStage,
      followupcategoryName: this.categoryStageName,
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      execid: this.execid,
      execname: this.execname,
      visitExecid: this.visitAssignExecid,
      visitExecname: this.visitAssignExecname,
      assignedfrom: this.assignedFrom,
      assignedto: this.assignedTo,
      fromdate: this.fromdate,
      todate: this.todate,
      visitedfrom: this.visitedFrom,
      visitedto: this.visitedTo,
      overdues: this.overduesSelection,
      page: MandateLeadStagesComponent.count,
      scrollTop: this.scrollContainer.nativeElement.scrollTop,
      leads: this.callerleads,
      tabs: tab,
      bookingLeadRequest: this.leadBookingstatus,
      id: this.visitType,
      remarks: this.serachRemarks,
      type: this.type,
      inactivecount: this.inactiveTotal,
      junkleadcount: this.junkLeadsTotal,
      junkvisitcount: this.junkVisitsTotal
    };

    sessionStorage.setItem('lead_satges_state', JSON.stringify(state));

    this.router.navigate([
      '/mandate-customers',
      lead.LeadID,
      lead.ExecId,
      0,
      'mandate',
      lead.propertyid
    ]);
  }

}