import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';
import { sharedservice } from '../../../shared.service';
import { retailservice } from '../../../retail.service';
import * as XLSX from "xlsx";
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
// import { moment } from 'ngx-bootstrap/chronos/test/chain';
import * as moment from 'moment';
import { isArray } from 'jquery';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-assigned-leads',
  templateUrl: './mandate-assigned-leads.component.html',
  styleUrls: ['./mandate-assigned-leads.component.css']
})
export class MandateAssignedLeadsComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private _retailservice: retailservice, private _mandateService: mandateservice, private _sharedservice: sharedservice,
    public datepipe: DatePipe) {
    if (localStorage.getItem('Role') == '50003' || localStorage.getItem('Role') == '50004' || localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
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
  assignedleadstable = true;
  tookactiontable = false;
  tookaction: any;
  followups: any;
  static count: number;
  static closedcount: number;
  static reassigncount: number;
  callerleads: any;
  telecallers: any;
  leads: any;
  status: any;
  executives: any;
  actionid: any;
  totalcounts: any;
  inactivecount: any;
  closedcount: any;
  filterdata: boolean = false;
  executivefilterview = false;
  propertyfilterview = false;
  stagefilterview = false;
  stagestatusfilterview = false;
  datefilterview = false;
  execname: any;
  selecteduser: any;
  currentDate = new Date();
  todaysdate: any;
  enchanting = false;
  grsitara = false;
  todaystotalcounts: any;
  todayscheduled: any;
  upcomingvisits: any;
  upcomingfollowups: any;
  overdue: any;
  notinterested: any;
  interested: any;
  inprogress: any;
  booked: any;
  bookingrequest: any;
  rejected: any;
  retailmoved: any;
  junk = true;
  todaysscheduledparam: any;
  todaysvisitedparam: any;
  upcomingvisitparam: any;
  upcomingfollowupparam: any;
  overdueparam: any;
  bookedparam: any;
  bookingreqparam: any;
  rejectreqparam: any;
  retailmovedparam: any;
  allvisitparam: any;
  inprogressparam: any;
  interestedparam: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdaysdateforcompare: any;
  tomorrowsdateforcompare: any;
  activitypage: Boolean;
  filterview: Boolean;
  stagevalue: any;
  stagestatusval: any;
  stagestatusvaltext: any;
  stagestatus = false;
  retailmovelink = false;
  // *****************************Assignedleads section list*****************************
  allleadsparam: any;
  freshleadsparam: any;
  scheduledtoday: any;
  pendingleadsparam: any;
  followupleadsparam: any;
  fixedvisitsparam: any;
  visitconvertedparam: any;
  // overduesparam: any;
  inactiveparam: any;

  Totalleadcounts: any;
  Freshleadcounts: any;
  todayscheduledcounts: any;
  pendingleadcounts: any;
  followupleadcounts: any;
  fixedvisitcounts: any;
  visitconvertedcounts: any;
  // overduecounts: any;
  inactivecounts: any;
  leaddetails = false;
  rmleaddetails = false;
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
  isReAssign: boolean = false;
  reassignleadsinfo: any;
  selectedStatus: any = '';
  reassignleadsCount: number = 0;
  mandateExecutives: any
  selectedReassignTeam: any;
  selectedEXEC: any;
  selectedExecIds: any;
  selectedAssignedleads: any;
  selectedLeadExecutiveIds: any;
  choosedReAssignLeads: any;
  selectedTeamType: any;
  selectedEXECUTIVES: any;
  selectedEXECUTIVEIDS: any;
  reassignListExecutives: any;
  mandateAssignedLeads: any;
  followupsections: any;
  selectedSubStatus = '';
  selectedMandateProp = '';
  selectedReassignTeamType: any = '';
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
  @ViewChild('datepicker4') datepickerassigned: ElementRef;
  @ViewChild('datepicker2') datepickernextACtion: ElementRef;
  role_type: any;
  mandateProperty_ID: any;
  start: moment.Moment | null = null;
  end: moment.Moment | null = null;
  @ViewChild('leadassign') leadassign: ElementRef;
  isAtStartFlag: boolean = false;
  isAtEndFlag: boolean = true;
  assignedFrom: any;
  assignedTo: any;
  assignedOnDateRange: Date[];
  assignedOnDatefilterview: boolean = false;

  //overdues section 
  // followupsoverduesParam:any;
  // usvOverduesParam:any;
  // rsvOverduesParam:any;
  // fnOverduesParam:any;
  // myOverdues:boolean=false;
  // followupsoverduesCount:number=0;
  // usvOverduesCount:number=0;
  // rsvOverduesCount:number=0;
  // fnOverduesCount:number=0;

  // *****************************Assignedleads section list*****************************

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.role_type = localStorage.getItem('role_type');
    this.mandateProperty_ID = localStorage.getItem('property_ID');
    // *********************load the required template files*********************
    this.getleadsdata();
    this.mandateprojectsfetch();
    this.getExecutivesForFilter();

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
    if (localStorage.getItem('Role') == '1') {
      this.tookactiontable = true;
      this.assignedleadstable = false;
    } else if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    } else {
      this.tookactiontable = false;
      this.assignedleadstable = true;
    }

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
    MandateAssignedLeadsComponent.count = 0;
    MandateAssignedLeadsComponent.closedcount = 0;
    // this.initializeDateRangePicker()
    this.getsourcelist();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeDateRangePicker();
      this.updateChevronState();
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

  getleadsdata() {
    // if (localStorage.getItem('Role') == '50002') {
    //   this.rmid = localStorage.getItem('UserId');
    // }
    this.filterLoader = true;
    MandateAssignedLeadsComponent.count = 0;
    this.actionid = "";
    this.route.queryParams.subscribe((paramss) => {
      // Updated Using Strategy

      // *****************************Assignedleads section list*****************************
      // this.allleadsparam = paramss['allleads'];
      // this.freshleadsparam = paramss['fresh'];
      // this.scheduledtoday = paramss['todayscheduled'];
      this.pendingleadsparam = paramss['pending'];
      this.followupleadsparam = paramss['followups'];
      // this.fixedvisitsparam = paramss['fixedvisits'];
      // this.visitconvertedparam = paramss['visitconverts'];
      // this.overduesparam = paramss['overdues'];
      this.inactiveparam = paramss['inactive'];
      this.usvParam = paramss['usv'];
      this.rsvParam = paramss['rsv'];
      this.fnParam = paramss['fn'];
      this.junkleadsParam = paramss['junkleads'];
      this.junkvisitsParam = paramss['junkvisits'];
      this.bookingRequestParam = paramss['bookingRequest'];
      this.bookedParam = paramss['booked'];
      this.normalcallparam = paramss['nc'];

      //my overdues section data
      // this.followupsoverduesParam = paramss['followupsoverdues'];
      // this.usvOverduesParam = paramss['usvoverdues'];
      // this.rsvOverduesParam = paramss['rsvoverdues'];
      // this.fnOverduesParam = paramss['fnoverdues'];

      // *****************************Assignedleads section list*****************************

      // After Visit Based Params and pages
      // this.todaysscheduledparam = paramss['todayscheduled'];
      // this.todaysvisitedparam = paramss['todayvisited'];
      // this.upcomingvisitparam = paramss['upcomingvisits'];
      // this.upcomingfollowupparam = paramss['upcomingfollowups'];
      // this.overdueparam = paramss['overdue'];
      // this.allvisitparam = paramss['allvisits'];
      // this.inprogressparam = paramss['inprogress'];
      // this.interestedparam = paramss['intrested'];
      // this.bookedparam = paramss['booked'];
      // this.bookingreqparam = paramss['bookingrequest'];
      // this.rejectreqparam = paramss['rejected'];
      // this.retailmovedparam = paramss['retailmoved'];
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
      this.resetScroll();
      setTimeout(() => {
        this.initializeDateRangePicker();
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
        if (this.propertyid == '34779') {
          this.enchanting = true;
          this.grsitara = false;
        } else if (this.propertyid == '16793') {
          this.grsitara = true;
          this.enchanting = false;
        }
      } else {
        this.propertyfilterview = false;
      }

      if (this.execid) {
        this.executivefilterview = true;
        if (localStorage.getItem('Role') == '1') {
          this.rmid = this.execid;
        } else {
          if (this.role_type == '1') {
            if (this.execid == '' || this.execid == undefined || this.execid == null) {
              this.rmid = localStorage.getItem('UserId');
            } else {
              this.rmid = this.execid;
            }
          } else {
            this.rmid = localStorage.getItem('UserId');
          }
        }
      } else {
        this.executivefilterview = false;
        if (localStorage.getItem('Role') == '1') {
          this.rmid = "";
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      }

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
        this.fromdate = '';
        this.todate = '';
      } else {
        this.datefilterview = true;
        // this.receivedDatefilterview = false;
        // this.visitedDatefilterview = false;
        $("#fromdate").val(this.fromdate);
        $("#selectedtodate").val(this.todate);
      }

      if ((this.receivedFromDate == '' || this.receivedFromDate == undefined || this.receivedFromDate == null) || (this.receivedToDate == '' || this.receivedToDate == undefined || this.receivedToDate == null)) {
        this.receivedDatefilterview = false;
        this.receivedFromDate = '';
        this.receivedToDate = '';
      } else {
        this.receivedDatefilterview = true;
        // this.datefilterview = false;
        // this.visitedDatefilterview = false;
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

        if ((this.assignedFrom == '' || this.assignedFrom == undefined || this.assignedFrom == null) || (this.assignedTo == null || this.assignedTo == '' || this.assignedTo == undefined)) {
          this.assignedOnDatefilterview = false;
          this.assignedFrom = '';
          this.assignedTo = '';
        } else {
          this.assignedOnDatefilterview = true;
        }

        if ((this.usvParam == 1 || this.rsvParam == 1 || this.fnParam == 1 || this.additionalParam == 'AllVisits') && (this.fromdate != '' && this.fromdate != undefined && this.fromdate != null && this.todate != '' && this.todate != undefined && this.todate != null)) {
          this.fromdate = '';
          this.todate = '';
          this.datefilterview = false;
        }
        // this.receivedDatefilterview = false;
        // this.datefilterview = false;
      }

      if (this.stagevalue) {
        this.stagefilterview = true;
        if (this.stagevalue == "USV") {
          this.stagestatus = true;
          // this.stagestatusval = "";
        } else {
          this.stagestatus = true;
          // $("#option-4").prop("checked", false);
          // $("#option-5").prop("checked", false);
          // $("#option-6").prop("checked", false);
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
        // if (this.junkParam != 1) {
        this.stagestatusval = '3';
        // }
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

      if (this.priorityName == "HOT") {
        this.priorityType = 'hot';
      } else if (this.priorityName == "WARM") {
        this.priorityType = 'warm';
      } else if (this.priorityName == "COLD") {
        this.priorityType = 'cold';
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
      // if (this.allleadsparam == '1') {
      //   this.batch1trigger();
      //   this.freshleadsdata();
      // } else if (this.freshleadsparam == '1') {
      //   this.batch1trigger();
      //   this.freshleadsdata();
      // } else if (this.scheduledtoday == '1') {
      //   this.batch1trigger();
      //   this.todayscheduleddata();
      // } else

      // else if (this.fixedvisitsparam == '1') {
      //   this.batch1trigger();
      //   this.fixedvisitsdata();
      // } else if (this.visitconvertedparam == '1') {
      //   this.batch1trigger();
      //   this.visitconverted();
      // } 
      if (this.pendingleadsparam == '1') {
        this.batch1trigger();
        this.pendingleadsdata();
        // this.myOverdues = false;
      } else if (this.followupleadsparam == '1') {
        this.batch1trigger();
        this.followupleadsdata();
        this.getFollowupsStatus();
        // this.myOverdues = false;
      }
      //  else if (this.overduesparam == '1') {
      //   this.batch1trigger();
      //   this.overduesdata();
      //   // this.myOverdues = false;
      // } 
      else if (this.inactiveparam == '1') {
        this.batch1trigger();
        this.inactivedatas();
        this.getFollowupsStatus();
        // this.myOverdues = false;
      } else if (this.usvParam == '1') {
        this.batch1trigger();
        this.usvdatas();
        // this.myOverdues = false;
      } else if (this.rsvParam == '1') {
        this.batch1trigger();
        this.rsvdatas();
        // this.myOverdues = false;
      } else if (this.fnParam == '1') {
        this.batch1trigger();
        this.fndatas();
        // this.myOverdues = false;
      } else if (this.junkleadsParam == '1') {
        this.batch1trigger();
        this.junkleadsdatas();
        // this.myOverdues = false;
      } else if (this.junkvisitsParam == '1') {
        this.batch1trigger();
        this.junkvisitsdatas();
        // this.myOverdues = false;
      } else if (this.bookingRequestParam == '1') {
        this.batch1trigger();
        this.bookingRequestdatas();
        // this.myOverdues = false;
      } else if (this.bookedParam == '1') {
        this.batch1trigger();
        this.bookeddatas();
        // this.myOverdues = false;
      } else if (this.normalcallparam == '1') {
        this.stagestatus = true;
        if (this.stagestatusval == '3') {
          this.stagestatusfilterview = false;
          this.stagefilterview = false;
        }
        this.batch1trigger();
        this.ncdatas();
      }

      // if (this.followupsoverduesParam == '1') {
      //   this.myOverduesCountsFetch();
      //   this.generalfollowupdata();
      //   this.myOverdues = true;
      // }else if (this.usvOverduesParam == '1') {
      //   this.myOverduesCountsFetch();
      //   this.usvOverdueData();
      //   this.myOverdues = true;
      // }else if (this.rsvOverduesParam == '1') {
      //   this.myOverduesCountsFetch();
      //   this.rsvOverdueData();
      //   this.myOverdues = true;
      // }else if (this.fnOverduesParam == '1') {
      //   this.myOverduesCountsFetch();
      //   this.fnOverdueData();
      //   this.myOverdues = true;
      // } 

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

    // Total Assigned Leads Count
    // this.datefilterview = false;
    // var totalleads = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'assignedleads',
    //   stage: '',
    //   stagestatus: '',
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   priority: this.priorityName,
    //   team: this.team,
    //   source: this.source,
    //   visits: this.leadstatusVisits,
    //   receivedfrom: this.receivedFromDate,
    //   receivedto: this.receivedToDate,
    //   // visitedfrom: this.visitedFrom,
    //   // visitedto: this.visitedTo
    // }
    // this._mandateService.assignedLeadsCount(totalleads).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.Totalleadcounts = compleads.AssignedLeads[0].counts;
    //     this.unquieleadcounts = compleads.AssignedLeads[0].Uniquee_counts
    //   } else {
    //     this.Totalleadcounts = "0";
    //   }
    // });

    // Total Assigned Leads Count

    // Fresh Leads Counts Fetch
    // var freshleads = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'freshleads',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   priority:this.priorityName,
    //   team: this.team,
    //   source:this.source
    // }
    // this._mandateService.assignedLeadsCount(freshleads).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.Freshleadcounts = compleads.AssignedLeads[0].counts;
    //   } else {
    //     this.Freshleadcounts = "0";
    //   }
    // });
    // Fresh Leads Counts Fetch

    // Scheduled Today Leads Counts Fetch
    // var scheduledtoday = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'scheduledtoday',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   priority:this.priorityName,
    //   team: this.team,
    //   source:this.source
    // }
    // this._mandateService.assignedLeadsCount(scheduledtoday).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.todayscheduledcounts = compleads.AssignedLeads[0].counts;
    //   } else {
    //     this.todayscheduledcounts = "0";
    //   }
    // });
    // Scheduled Today Leads Counts Fetch

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
      assignedto: this.assignedTo
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeadsCount(pending).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.pendingleadcounts = parseInt(compleads.AssignedLeads[0].counts);
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
      assignedto: this.assignedTo
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeadsCount(followups).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.followupleadcounts = parseInt(compleads.AssignedLeads[0].counts);
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
      assignedto: this.assignedTo
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
        this.normalcallcounts = parseInt(compleads.AssignedLeads[0].counts);
      } else {
        this.normalcallcounts = 0;
      }
      this.calculateTotalCount();
    });
    // nc Counts

    //usv counts  fetch

    var usvpar = {
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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeadsCount(usvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        // this.usvCounts = compleads.AssignedLeads[0].counts;
        // if (usvpar.stage == 'USV' && usvpar.stagestatus == '') {
        this.usvCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        // } else {
        //   this.usvCounts = compleads.AssignedLeads[0].counts;
        // }
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
      assignedto: this.assignedTo
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
      assignedto: this.assignedTo
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
    if (this.leadBookingstatus == 1) {
      this.selectedBookingLeadStatus = 'Rejected'
    } else if (this.leadBookingstatus == 2) {
      this.selectedBookingLeadStatus = 'Pending'
    } else {
      this.selectedBookingLeadStatus = 'All'
    }
    let bookingRR;
    if (this.selectedBookingLeadStatus == 'Pending') {
      bookingRR = 'Deal Closing Requested';
    } else if (this.selectedBookingLeadStatus == 'Rejected') {
      bookingRR = 'Closing Request Rejected';
    } else if (this.selectedBookingLeadStatus == 'All') {
      bookingRR = 'DCRR';
    }
    //booking request counts  fetch
    var bookingRequestpar = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: bookingRR,
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
      assignedto: this.assignedTo
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
      assignedto: this.assignedTo
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

    // Fixed Visits Counts Fetch
    // var fixedvisits = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'fixedvisits',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   priority:this.priorityName,
    //   team: this.team,
    //   source:this.source
    // }
    // this._mandateService.assignedLeadsCount(fixedvisits).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.fixedvisitcounts = compleads.AssignedLeads[0].counts;
    //   } else {
    //     this.fixedvisitcounts = "0";
    //   }
    // });
    // Fixed Visits Counts Fetch

    // Converted Visits Counts Fetch
    // var convertedvisits = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'convertedvisits',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   priority:this.priorityName,
    //   team: this.team,
    //   source:this.source
    // }
    // this._mandateService.assignedLeadsCount(convertedvisits).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.visitconvertedcounts = compleads.AssignedLeads[0].counts;
    //   } else {
    //     this.visitconvertedcounts = "0";
    //   }
    // });
    // Converted Visits Counts Fetch

    // Overdues Counts Fetch
    // var overdues = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'overdues',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   priority: this.priorityName,
    //   team: this.team,
    //   source: this.source,
    //   visits:this.leadstatusVisits
    // }
    // this._mandateService.assignedLeadsCount(overdues).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.overduecounts = compleads.AssignedLeads[0].counts;
    //   } else {
    //     this.overduecounts = "0";
    //   }
    // });
    // Overdues Counts Fetch

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
      assignedto: this.assignedTo
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeadsCount(inactive).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.inactivecounts = parseInt(compleads.AssignedLeads[0].counts);
      } else {
        this.inactivecounts = "0";
      }
      this.calculateTotalCount();
    });
    // inactive Counts Fetch


    //junk visits count fetch
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
      assignedto: this.assignedTo
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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeadsCount(junkpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.junkvisitsCounts = 0;
      }
      this.calculateTotalCount();
    });
  }


  calculateTotalCount(): any {
    return this.Totalleadcounts = this.pendingleadcounts + this.followupleadcounts + this.normalcallcounts + this.usvCounts + this.rsvCounts + this.fnCounts + this.inactivecounts + this.junkleadsCounts + this.junkvisitsCounts + this.bookedCounts + this.bookingRequestCounts;
  }

  // todayscheduleddata() {
  //   MandateAssignedLeadsComponent.closedcount = 0;
  //   MandateAssignedLeadsComponent.count = 0;
  //   this.filterLoader = true;
  //   this.junk = true;
  //   // this.datefilterview = false;
  //   $(".other_section").removeClass("active");
  //   $(".scheduled_section").addClass("active");
  //   var param = {
  //     limit: 0,
  //     limitrows: 100,
  //     datefrom: this.fromdate,
  //     dateto: this.todate,
  //     statuss: 'scheduledtoday',
  //     stage: this.stagevalue,
  //     stagestatus: this.stagestatusval,
  //     propid: this.propertyid,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     priority: this.priorityName,
  //     team: this.team,
  //     source: this.source,
  //     visits: this.leadstatusVisits,
  //     receivedfrom: this.receivedFromDate,
  //     receivedto: this.receivedToDate,
  //     visitedfrom: this.visitedFrom,
  //     visitedto: this.visitedTo
  //   }
  //   this._mandateService.assignedLeads(param).subscribe(compleads => {
  //     this.filterLoader = false;
  //     this.callerleads = compleads['AssignedLeads'];
  //   });
  // }

  pendingleadsdata() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;
    $(".other_section").removeClass("active");
    $(".pending_section").addClass("active");
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
      limit: 0,
      limitrows: limitR,
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
      assignedto: this.assignedTo
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  followupleadsdata() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;
    $(".other_section").removeClass("active");
    $(".followups_section").addClass("active");
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  inactivedatas() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;
    $(".other_section").removeClass("active");
    $(".inactive_section").addClass("active");
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  usvdatas() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    $(".other_section").removeClass("active");
    $(".usv_section").addClass("active");
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  rsvdatas() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;
    // let rsvstagestatus;
    // let rsvstatusValueData;
    // if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
    //   rsvstagestatus = 'active';
    //   if(this.stagestatusval == 1 || this.stagestatusval == 2 ||  this.stagestatusval == 3){
    //     rsvstatusValueData = this.stagestatusval;
    //     rsvstagestatus = ''
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
    $(".other_section").removeClass("active");
    $(".rsv_section").addClass("active");
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  fndatas() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    // let fnstagestatus;
    // let fnstatusValueData;
    // if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
    //   fnstagestatus = 'active';
    //   if(this.stagestatusval == 1 || this.stagestatusval == 2 ||  this.stagestatusval == 3){
    //     fnstatusValueData = this.stagestatusval;
    //     fnstagestatus = '';
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
    // this.datefilterview = false;
    $(".other_section").removeClass("active");
    $(".fn_section").addClass("active");
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  bookingRequestdatas() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;
    $(".other_section").removeClass("active");
    $(".booking_section").addClass("active");
    let bookingRR;
    if (this.leadBookingstatus == 1) {
      this.selectedBookingLeadStatus = 'Rejected'
    } else if (this.leadBookingstatus == 2) {
      this.selectedBookingLeadStatus = 'Pending'
    } else {
      this.selectedBookingLeadStatus = 'All'
    }
    if (this.selectedBookingLeadStatus == 'Pending') {
      bookingRR = 'Deal Closing Requested';
    } else if (this.selectedBookingLeadStatus == 'Rejected') {
      bookingRR = 'Closing Request Rejected';
    } else if (this.selectedBookingLeadStatus == 'All') {
      bookingRR = 'DCRR';
    }
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
      limit: 0,
      limitrows: limitR,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: bookingRR,
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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  bookeddatas() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;
    $(".other_section").removeClass("active");
    $(".booked_section").addClass("active");
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  junkleadsdatas() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;
    $(".other_section").removeClass("active");
    $(".junkleads_section").addClass("active");
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  junkvisitsdatas() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;
    $(".other_section").removeClass("active");
    $(".junkvisits_section").addClass("active");
    let stagestatus;
    if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
      stagestatus = '3';
    }
    else {
      stagestatus = this.stagestatusval;
    }
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  ncdatas() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;
    $(".other_section").removeClass("active");
    $(".nc_section").addClass("active");
    let stagestatus;
    if (this.stagestatusval == '3' || this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
      stagestatus = ''
    } else if (this.stagestatusval == '2' || this.stagestatusval == '1') {
      stagestatus = '';
    }
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
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
    // if (this.source == '' || this.source == null || this.source == undefined) {
    //   swal({
    //     title: 'Please Select the Source',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    // } else {
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
        assignedto: this.assignedTo
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
        assignedto: this.assignedTo
      }
    } else if (this.usvParam == 1) {
      param = {
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
        assignedto: this.assignedTo
      }
    } else if (this.rsvParam == 1) {
      param = {
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
        assignedto: this.assignedTo
      }
    } else if (this.fnParam == 1) {
      param = {
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
        assignedto: this.assignedTo
      }
    } else if (this.inactiveparam == 1) {
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
        assignedto: this.assignedTo
      }
    } else if (this.junkleadsParam == 1) {
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
        assignedto: this.assignedTo
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
        assignedto: this.assignedTo
      }
    } else if (this.bookingRequestParam == 1) {
      let bookingRR;
      if (this.leadBookingstatus == 1) {
        this.selectedBookingLeadStatus = 'Rejected'
      } else if (this.leadBookingstatus == 2) {
        this.selectedBookingLeadStatus = 'Pending'
      } else {
        this.selectedBookingLeadStatus = 'All'
      }
      if (this.selectedBookingLeadStatus == 'Pending') {
        bookingRR = 'Deal Closing Requested';
      } else if (this.selectedBookingLeadStatus == 'Rejected') {
        bookingRR = 'Closing Request Rejected';
      } else if (this.selectedBookingLeadStatus == 'All') {
        bookingRR = 'DCRR';
      }
      param = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: bookingRR,
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
        assignedto: this.assignedTo
      }
    } else if (this.bookedparam == 1) {
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
        assignedto: this.assignedTo
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
        assignedto: this.assignedTo
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
        assignedto: this.assignedTo
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
        assignedto: this.assignedTo
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
        assignedto: this.assignedTo
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
    // }
  }

  //this is to get the assigned data 
  assigneddata() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    MandateAssignedLeadsComponent.reassigncount = 0;
    $(".other_section").removeClass("active");
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;

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
      assignedto: this.assignedTo
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
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
      limit: 0,
      limitrows: limitR,
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
      assignedto: this.assignedTo
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    MandateAssignedLeadsComponent.reassigncount = 0;
    $(".other_section").removeClass("active");
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;

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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeadsCount(paramCount).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.additionalParamCount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.additionalParamCount = 0;
      }
    });

    //to fetch data
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to get the touched lead data
  toucheddata() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    $(".other_section").removeClass("active");
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;

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
      assignedto: this.assignedTo
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
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    $(".other_section").removeClass("active");
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;

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
      assignedto: this.assignedTo
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
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to get the active data
  activedata() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    $(".other_section").removeClass("active");
    this.filterLoader = true;
    this.junk = true;
    // this.datefilterview = false;

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
      assignedto: this.assignedTo
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
    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }
    var param = {
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
      assignedto: this.assignedTo
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  showdateRange() {
    // this.datepicker1.show();
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
    // this.datepicker2.show();
    let todaysDate = new Date();
    this.nextActionDateRange = [todaysDate];

    setTimeout(() => {
      const inputElement = this.datepickernextACtion.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      $('bs-daterangepicker-container').removeAttr('style');
      $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
      $("bs-daterangepicker-container").removeClass("visiteddatepkr");
      $("bs-daterangepicker-container").removeClass("assignedOndatepkr");
      $("bs-daterangepicker-container").addClass("nextactiondatepkr");
    }, 0);
  }

  showdateRange3() {
    // this.datepicker3.show(); 
    let todaysDate = new Date();
    this.visitedDateRange = [todaysDate];
    setTimeout(() => {
      const inputElement = this.datepickervisited.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      $('bs-daterangepicker-container').removeAttr('style');
      $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
      $("bs-daterangepicker-container").removeClass("nextactiondatepkr");
      $("bs-daterangepicker-container").removeClass("assignedOndatepkr");
      $("bs-daterangepicker-container").addClass("visiteddatepkr");
    }, 0);
  }

  showdateRange4() {
    // this.datepicker3.show();
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
      MandateAssignedLeadsComponent.closedcount = 0;
      MandateAssignedLeadsComponent.count = 0;
      this.filterdata = true;
      this.actionid = "";
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.datefilterview = false;
    $('#fromdate').val("");
    $('#selectedtodate').val("");
    this.fromdate = "";
    this.todate = "";
    this.actionid = "";
    this.router.navigate([], {
      queryParams: {
        from: "",
        to: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  visitedDateclose() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.visitedDatefilterview = false;
    this.visitedFrom = "";
    this.visitedTo = "";
    this.actionid = "";
    this.router.navigate([], {
      queryParams: {
        visitedfrom: "",
        visitedto: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  assignedOnDateclose() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.assignedOnDatefilterview = false;
    this.assignedFrom = "";
    this.assignedTo = "";
    this.actionid = "";
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.filterdata = true;
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
    this.filterdata = true;
    this.propertyfilterview = true;
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;

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
    this.filterdata = true;
    this.sourceFilter = true;
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;

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
        if (this.roleid == '1') {
          this.directteamfound = true;
        } else {
          this.directteamfound = false;
        }
      } else {
        if (this.roleid == '1') {
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
    this._mandateService.fetchmandateexecutuves(this.propertyid, this.team, '', teamlead).subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      }
    });
  }

  statuschange(vals) {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    // this.filterLoader = true;
    this.filterdata = true;
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    // this.filterLoader = true;
    this.filterdata = true;
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

  //this method is used only for junk to select the stage
  junkstatuschange(stagetype, statusType) {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    // this.filterLoader = true;
    this.filterdata = true;
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    // this.filterLoader = true;
    this.filterdata = true;
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.filterLoader = true;
    this.filterdata = true;
    this.priorityFilter = true;
    if (vals.target.value == 'hot') {
      this.priorityName = "HOT";
      this.router.navigate([], {
        queryParams: {
          priority: "hot",
        },
        queryParamsHandling: 'merge',
      });
    } else if (vals.target.value == 'warm') {
      this.priorityName = "WARM";
      this.router.navigate([], {
        queryParams: {
          priority: "warm",
        },
        queryParamsHandling: 'merge',
      });
    } else if (vals.target.value == 'cold') {
      this.priorityName = "COLD";
      this.router.navigate([], {
        queryParams: {
          priority: "cold",
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  executiveclose() {
    $("input[name='executiveFilter']").prop("checked", false);
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.executivefilterview = false;
    this.execid = null;
    this.execname = null
    this.rmid = null;
    this.router.navigate([], {
      queryParams: {
        execid: null,
        execname: null
      },
      queryParamsHandling: 'merge',
    });
  }

  priorityClose() {
    this.priorityFilter = false;
    this.priorityName = '';
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.propertyid = "";
    this.stagestatusval = "";
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.source = "";
    this.router.navigate([], {
      queryParams: {
        source: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  receivedDateclose() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.receivedDatefilterview = false;
    this.receivedFromDate = "";
    this.receivedToDate = "";
    this.actionid = "";
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    this.additionalParam = ''
    this.router.navigate([], {
      queryParams: {
        from: '',
        to: '',
        pending: 1,
        filterData: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  stageclose() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
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
    if (this.roleid == 1) {
      limit = MandateAssignedLeadsComponent.count += 100;
    } else {
      limit = MandateAssignedLeadsComponent.count += 30;
    }

    let limitR;
    if (this.roleid == 1) {
      limitR = 100
    } else {
      limitR = 30
    }

    if (this.pendingleadsparam == 1) {
      var param = {
        limit: limit,
        limitrows: limitR,
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
        assignedto: this.assignedTo
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
        limitrows: limitR,
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
        assignedto: this.assignedTo
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
      var param2 = {
        limit: limit,
        limitrows: limitR,
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
        assignedto: this.assignedTo
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      let livecount = this.callerleads.length;
      if (livecount < this.inactivecounts) {
        this._mandateService.assignedLeads(param2).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.usvParam == 1) {
      // let usvstagestatus;
      // let statusValueData;
      // if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
      //   statusValueData = 'active';
      //   if(this.stagestatusval == 4 || this.stagestatusval == 5 ||  this.stagestatusval == 3){
      //     usvstagestatus = this.stagestatusval;
      //     statusValueData = '';
      //   }else{
      //     usvstagestatus = '';
      //     statusValueData = 'active';
      //   }
      // } else {
      //   statusValueData = '';
      //   if(this.stagestatusval == 4 || this.stagestatusval == 5 ){
      //     usvstagestatus = this.stagestatusval;
      //   }else{
      //     usvstagestatus = '3';
      //   }
      // }
      // if(this.stagestatusval == 4 || this.stagestatusval == 5){
      //   usvstagestatus = this.stagestatusval;
      // }else{
      //   usvstagestatus = '3';
      // }
      var usvpar = {
        limit: limit,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'USV',
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
        assignedto: this.assignedTo
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
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
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
        assignedto: this.assignedTo
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
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
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
        assignedto: this.assignedTo
      }
      let livecount = this.callerleads.length;
      if (livecount < this.fnCounts) {
        this._mandateService.assignedLeads(fnpar).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.bookingRequestParam == 1) {
      let bookingRR;
      if (this.selectedBookingLeadStatus == 'Pending') {
        bookingRR = 'Deal Closing Requested';
      } else if (this.selectedBookingLeadStatus == 'Rejected') {
        bookingRR = 'Closing Request Rejected';
      } else if (this.selectedBookingLeadStatus == 'All') {
        bookingRR = 'DCRR';
      }
      var dealClosingg = {
        limit: limit,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: bookingRR,
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
        assignedto: this.assignedTo
      }
      let livecount = this.callerleads.length;
      if (livecount < this.bookingRequestCounts) {
        this._mandateService.assignedLeads(dealClosingg).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.bookedParam == 1) {
      var dealclosed = {
        limit: limit,
        limitrows: limitR,
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
        assignedto: this.assignedTo
      }
      let livecount = this.callerleads.length;
      if (livecount < this.bookedCounts) {
        this._mandateService.assignedLeads(dealclosed).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.junkleadsParam == 1) {
      var jparam = {
        limit: limit,
        limitrows: limitR,
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
        assignedto: this.assignedTo
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo
      }
      let livecount = this.callerleads.length;
      if (livecount < this.junkleadsCounts) {
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
      var jvparam = {
        limit: limit,
        limitrows: limitR,
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
        assignedto: this.assignedTo
      }
      let livecount = this.callerleads.length;
      if (livecount < this.junkvisitsCounts) {
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
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo
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
        limitrows: limitR,
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
        assignedto: this.assignedTo
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
        limitrows: limitR,
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
        assignedto: this.assignedTo
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
        limitrows: limitR,
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
        assignedto: this.assignedTo
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
        limitrows: limitR,
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
        assignedto: this.assignedTo
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
        limitrows: limitR,
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
        assignedto: this.assignedTo
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
    this.assignedFrom = '';
    this.assignedTo = '';
    this.visitedDateRange = [this.todaysdateforcompare];
    this.dateRange = [this.todaysdateforcompare];
    this.nextActionDateRange = [this.todaysdateforcompare];
    this.assignedOnDateRange = [this.todaysdateforcompare];

    this.propertyclose();
    this.stageclose();
    this.executiveclose();
    this.priorityClose();
    this.sourceClose();
    this.receivedDateclose();
    this.visitedDateclose();
    this.assignedOnDateclose();

    // this.filterLoader = true;
    this.filterdata = false;
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

    if (this.isAdditonalParamPresent == false) {
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
          assignedto: ""
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate([], {
        queryParams: {
          pending: '1',
          from: '',
          to: '',
          filterData: ''
        },
      })
      this.isAdditonalParamPresent = false;
    }
    $("input[name='propFilter']").prop("checked", false);
    $("input[name='executiveFilter']").prop("checked", false);
    $("input[name='sourceFilter']").prop("checked", false);


    $("#option-1").prop("checked", false);
    $("#option-2").prop("checked", false);
    $("#option-3").prop("checked", false);
    $("#option-4").prop("checked", false);
    $("#option-5").prop("checked", false);
    $("#option-6").prop("checked", false);
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

  // historyfetch(id) {
  //   this.leaddetails = true;
  //   this._mandateService
  //     .getassignedrm(id, this.userid,this.roleid)
  //     .subscribe(cust => {
  //       this.selecteduser = cust;
  //     });
  //   var param2 = {
  //     leadid: id,
  //     roleid: this.roleid,
  //     userid: this.userid
  //   }
  //   this._mandateService
  //     .gethistory(param2)
  //     .subscribe(history => {
  //       this.leadtrack = history['Leadhistory'];
  //     })
  //   $('.CSassigned_table').attr("style", "height: auto;");
  //   $('.remarksection').attr("style", "display: none;");
  //   $('.crm-auto-scroll').attr("style", "height: 650px;");
  // }

  closehistory() {
    this.rmleaddetails = false;
    this.leaddetails = false;
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
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.pendingleadsdata();
    } else if (this.followupleadsparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.followupleadsdata();
    } else if (this.normalcallparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.ncdatas();
    } else if (this.usvParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.usvdatas();
    } else if (this.rsvParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.rsvdatas();
    } else if (this.fnParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.fndatas();
    } else if (this.bookingRequestParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.bookingRequestdatas();
    } else if (this.bookedParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.bookeddatas();
    } else if (this.inactiveparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.inactivedatas();
    } else if (this.junkleadsParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.junkleadsdatas();
    } else if (this.junkvisitsParam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.junkvisitsdatas();
    } else if (this.additionalParam == 'Touched') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.toucheddata();
    } else if (this.additionalParam == 'Active') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.activedata();
    } else if (this.additionalParam == 'Assigned') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.assigneddata();
    } else if (this.additionalParam == 'AllVisits') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.allVisitsdata();
    } else if (this.additionalParam == 'ActiveVisits') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.retailmovelink = false;
      if (this.roleid == '1') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.activevisitsdata();
    }
  }

  //on clicking on reassign button reassign section will be shown
  onclickReAssign() {
    if (this.pendingleadsparam == '1') {
      this.reassignleadsCount = this.pendingleadcounts;
    } else if (this.followupleadsparam == '1') {
      this.reassignleadsCount = this.followupleadcounts;
    } else if (this.inactiveparam == '1') {
      this.reassignleadsCount = this.inactivecounts;
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
    } else if (this.bookedParam == '1') {
      this.reassignleadsCount = this.bookedCounts;
    } else if (this.normalcallparam == '1') {
      this.reassignleadsCount = this.normalcallcounts;
    }
  }

  //on click on cancel we will get the assigned leads section 
  backToDetails() {
    this.isReAssign = false;
    this.isAssignedLeads = true;
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
    this.dateRange = [];

    if (this.pendingleadsparam == '1') {
      this.batch1trigger();
      this.pendingleadsdata();
    } else if (this.followupleadsparam == '1') {
      this.batch1trigger();
      this.followupleadsdata();
    } else if (this.inactiveparam == '1') {
      this.batch1trigger();
      this.inactivedatas();
    }
  }

  //here we get the select counts of leads for retail
  selectcounts(event) {
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

  //here we get the selected assigned team
  reassignTeam(event) {
    this.selectedTeamType = event.target.value;
    this.selectedMandateProp = '';
    if (this.selectedTeamType == 'mandate') {
      this.mandateprojectsfetch();
      this.selectedMandateProp = '16793';
      this._mandateService.fetchmandateexecutuves(16793, '', '','').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.reassignListExecutives = executives['mandateexecutives'];
          // this.reassignListExecutives = this.reassignListExecutives.filter((da) => !(this.rmid.includes(da.id)));
        }
      });
    } else if (this.selectedTeamType == 'retail') {
      this._retailservice.getRetailExecutives('', '').subscribe(execute => {
        this.reassignListExecutives = execute['DashboardCounts'];
      })
    }
    $('#mandate_dropdown').dropdown('clear');
    // $('#retail_dropdown').dropdown('clear');
    $('#mandateExec_dropdown').dropdown('clear');
    $('#retailExec_dropdown').dropdown('clear');
    $('#property_dropdown').dropdown('clear');
  }

  //here we get the selected reassign mandate property
  reassignPropChange(event) {
    this.selectedMandateProp = event.target.value;
    this._mandateService.fetchmandateexecutuves(this.selectedMandateProp, this.selectedReassignTeamType, '','').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.reassignListExecutives = executives['mandateexecutives'];
        // this.reassignListExecutives = this.reassignListExecutives.filter((da) => !(this.rmid.includes(da.id)));
      }
    });
  }

  //heree we get the selected assign executive team type
  reassignExecTeam(event) {
    if (event.target.options[event.target.options.selectedIndex].value == '50010' || event.target.options[event.target.options.selectedIndex].value == '50004') {
      const teamid = event.target.options[event.target.options.selectedIndex].value;
      this._retailservice.getRetailExecutives(teamid, '').subscribe(execute => {
        this.reassignListExecutives = execute['DashboardCounts'];
      })
    } else {
      this._retailservice.getRetailExecutives('', '').subscribe(execute => {
        this.reassignListExecutives = execute['DashboardCounts'];
        // this.reassignListExecutives = this.reassignListExecutives.filter((da) => !(this.rmid.includes(da.ExecId)));
      })
    }
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
    if (this.selectedTeamType == 'mandate') {
      this.selectedEXECUTIVEIDS = this.selectedEXECUTIVES.map((exec) => exec.id);
    } else if (this.selectedTeamType == 'retail') {
      this.selectedEXECUTIVEIDS = this.selectedEXECUTIVES.map((exec) => exec.ExecId);
    }
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
    }
    else {
      $('#selectedleads').removeAttr("style");
      this.filterLoader = true;
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
    }
    else {
      $('#property_dropdown').removeAttr("style");
      this.filterLoader = true;
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
      this.filterLoader = true;
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
    if (this.selectedTeamType == 'mandate') {
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
    } else if (this.selectedTeamType == 'retail') {
      this._retailservice.leadreassign(param).subscribe((success) => {
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
    // var checkid = $("input[name='propFilter']:checked").map(function () {
    //   return this.value;
    // }).get().join(',');

    // let filteredPropIds;
    // // filteredPropIds = checkid.split(',');
    // filteredPropIds =propid;
    // let filteredPropsName;
    // // filteredPropsName = this.copyofmandateprojects.filter((da) => filteredPropIds.some((prop) => {
    // //   return prop == da.property_idfk
    // // }));
    // filteredPropsName =  this.copyofmandateprojects.filter((da) =>{
    //   return da.property_idfk == propid;
    // })
    // filteredPropsName = filteredPropsName.map((name) => name.property_info_name);

    if (property != null || property != '' || property != undefined) {
      this.propertyfilterview = true;
      this.propertyname = property.property_info_name;
      this.propertyid = property.property_idfk;
      this.router.navigate([], {
        queryParams: {
          property: this.propertyid,
          propname: this.propertyname,
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
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

  //get list of mandate executives for mandate for filter purpose
  getExecutivesForFilter() {
    if (this.role_type != 1) {
      this._mandateService.fetchmandateexecutuvesforreassign('', '', '', '','').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    } else {
      this._mandateService.fetchmandateexecutuvesforreassign(this.mandateProperty_ID, 2, '', '',this.userid).subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    }
  }

  onCheckboxChangesource() {
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
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
    MandateAssignedLeadsComponent.closedcount = 0;
    MandateAssignedLeadsComponent.count = 0;
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

  //here we initialize  the date range picker.
  initializeDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      } else {
        $('#reportrange span').html('Select Date Range');
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
        // this.visitedDatefilterview = false;
      }
    };

    // Retrieve the date range from the URL query params (if any)
    const urlParams = new URLSearchParams(window.location.search);
    const visitedFrom = urlParams.get('visitedfrom');
    const visitedTo = urlParams.get('visitedto');

    // Initialize start and end dates based on URL parameters or default values
    let startDate = visitedFrom ? moment(visitedFrom) : null;
    let endDate = visitedTo ? moment(visitedTo) : null;

    $('#reportrange').daterangepicker({
      startDate: startDate || moment(),
      endDate: endDate || moment(),
      showDropdowns: true,
      minYear: 1901,
      maxYear: parseInt(moment().format('YYYY'), 10),
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      locale: {
        format: 'MMMM D, YYYY'
      },
      autoApply: true,
    }, cb);

    cb(this.start, this.end);
  }

  moveToLeft(): void {
    const leadassignElement = this.leadassign.nativeElement;
    leadassignElement.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
    this.updateChevronState();
  }

  moveToRight(): void {
    const leadassignElement = this.leadassign.nativeElement;
    leadassignElement.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
    this.updateChevronState();
  }

  // Check if the scroll is at the start
  isAtStart(): boolean {
    const leadassignElement = this.leadassign.nativeElement;
    return leadassignElement.scrollLeft === 0;
  }

  // Check if the scroll is at the end
  isAtEnd(): boolean {
    const leadassignElement = this.leadassign.nativeElement;
    return leadassignElement.scrollLeft + leadassignElement.clientWidth >= leadassignElement.scrollWidth;
  }

  // Update the chevron states
  updateChevronState(): void {
    this.isAtStartFlag = this.isAtStart();
    this.isAtEndFlag = this.isAtEnd();
    if (this.isAtEndFlag == true && this.isAtStartFlag == true) {
      $('.chevleft').css('display', 'none');
      $('.chevright').css('display', 'flex');
    } else if (this.isAtEndFlag == true && this.isAtStartFlag == false) {
      $('.chevright').css('display', 'none');
      $('.chevleft').css('display', 'flex');
    } else {
      $('.chevright').css('display', 'flex');
      $('.chevleft').css('display', 'none');
    }

  }

  // //load more for reassign leads
  // loadMoreReassignedleads() {
  //   const limit = MandateAssignedLeadsComponent.reassigncount += 100;
  //   this.filterLoader = true;
  //   var param = {
  //     limit: limit,
  //     limitrows: 100,
  //     statuss: 'assignedleads',
  //     propid: this.propertyid,
  //     executid: this.rmid,
  //     source: this.source,
  //     loginuser: this.userid,
  //     team: '',
  //     priority: this.priorityName,
  //     followup: this.categoryStage,
  //     receivedfrom: this.receivedFromDate,
  //     receivedto: this.receivedToDate,
  //     visitedfrom: this.visitedFrom,
  //     visitedto: this.visitedTo
  //   }
  //   if (this.choosedReAssignLeads.length < this.reassignleadsCount) {
  //     this._mandateService.assignedLeads(param).subscribe(compleads => {
  //       this.filterLoader = false;
  //       this.choosedReAssignLeads = this.choosedReAssignLeads.concat(compleads['AssignedLeads']);
  //     });
  //   }
  // }

  // //reassign codes start fomr here
  // //here we filter the leads based on date
  // onDateRangeSelected(range: Date[]): void {
  //   this.dateRange = range;
  //   // Convert the first date of the range to yyyy-mm-dd format
  //   if (this.dateRange != null) {
  //     let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
  //     let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
  //     if (formattedFromDate != null && formattedToDate != null) {
  //       this.reassignfromdate = formattedFromDate;
  //       this.reassigntodate = formattedToDate
  //       this.getReassignLeads(this.selectedStatus);
  //     }
  //   }
  // }

  //here we check whether any leads are selected or no ,if not selected showing all the leads.
  // checkSelectedLeads() {
  //   if (this.maxSelectedLabels == Infinity) {
  //     // this.choosedReAssignLeads = this.reassignleadsinfo;
  //     let selectedLeadsId = this.choosedReAssignLeads.map((da) => da.LeadID);
  //     this.selectedAssignedleads = selectedLeadsId.join(',');
  //   }
  // }

  // //to select the status
  // statusSelect(event) {
  //   this.selectedStatus = event.target.value;
  //   let selectedstatus = event.target.value;

  //   if (selectedstatus == 'untouched') {
  //     this.getReassignLeads(selectedstatus)
  //   } else if (selectedstatus == 'inactive') {
  //     this.getReassignLeads(selectedstatus)
  //   } else if (selectedstatus == 'followups') {
  //     this.getReassignLeads(selectedstatus);
  //     this.getFollowupsStatus();
  //     this.selectedSubStatus = '';
  //   } else if (selectedstatus == 'USV') {
  //     this.getReassignLeads(selectedstatus)
  //   } else if (selectedstatus == 'RSV') {
  //     this.getReassignLeads(selectedstatus)
  //   } else if (selectedstatus == 'FN') {
  //     this.getReassignLeads(selectedstatus)
  //   }

  //   if (this.selectedStatus == undefined || this.selectedStatus.length == 0) {
  //     this.getReassignLeads('assignedleads')
  //   }
  // }

  // //here we get the list of followups sub list
  // subStatusSelection(event) {
  //   this.selectedSubStatus = event.target.value;
  //   this.getReassignLeads(this.selectedStatus);
  // }

  // copyMandateExecutives: any;
  // //to get teh list of executives based on team id
  // getreassignexecutives(event) {
  //   $('#exec_dropdown').dropdown('clear');
  //   const teamid = event.target.options[event.target.options.selectedIndex].value;
  //   const activestatus = '1';
  //   this.selectedReassignTeam = teamid;
  //   this._mandateService.fetchmandateexecutuvesforreassign('', teamid, activestatus).subscribe(executives => {
  //     if (executives['status'] == 'True') {
  //       this.mandateExecutives = executives['mandateexecutives'];
  //       // this.mandateExecutives = this.mandateExecutives.filter((exec) => exec.visits_reg_status == '1')
  //       // this.copyMandateExecutives = executives['mandateexecutives'];
  //     } else {
  //     }
  //   });
  //   this.getReassignLeads(this.selectedStatus);
  // }

  // //to filter the active execiyives.  
  // checkActive(event) {
  //   const isChecked = (event.target as HTMLInputElement).checked;
  //   if (isChecked == true) {
  //     const activestatus = '1';
  //     this._mandateService.fetchmandateexecutuvesforreassign('', this.selectedReassignTeam, activestatus).subscribe(executives => {
  //       if (executives['status'] == 'True') {
  //         this.mandateExecutives = executives['mandateexecutives'];
  //       }
  //     });
  //   } else {
  //     const activestatus = '2';
  //     this._mandateService.fetchmandateexecutuvesforreassign('', this.selectedReassignTeam, activestatus).subscribe(executives => {
  //       if (executives['status'] == 'True') {
  //         this.mandateExecutives = executives['mandateexecutives'];
  //       }
  //     });
  //   }
  // }

  //to get the list of selected executives
  // executiveSelect(event) {
  //   this.selectedExecIds = this.selectedEXEC.map((exec) => exec.id);
  //   this.getReassignLeads(this.selectedStatus);
  // }

  // //here we get the reassign leads data to display in the table
  // getReassignLeads(selectedStatus) {
  //   let comma_separated_data
  //   if (this.selectedExecIds) {
  //     comma_separated_data = this.selectedExecIds.join(',');
  //   }
  //   MandateAssignedLeadsComponent.closedcount = 0;
  //   MandateAssignedLeadsComponent.reassigncount = 0;
  //   this.filterLoader = true;
  //   var param = {
  //     fromdate: this.reassignfromdate,
  //     todate: this.reassigntodate,
  //     limit: 0,
  //     limitrows: 100,
  //     statuss: selectedStatus,
  //     followup: this.selectedSubStatus,
  //     propid: this.selectedMandateProp,
  //     executid: comma_separated_data,
  //     loginuser: this.userid,
  //     team: this.selectedReassignTeam,
  //   }
  //   this._mandateService.getreassignLeads(param).subscribe(compleads => {
  //     this.filterLoader = false;
  //     this.reassignleadsinfo = compleads['AssignedLeads'];
  //     this.reassignleadsCount = compleads.Leadscount;
  //     this.checkSelectedLeads();
  //   });
  // }
}
