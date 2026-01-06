import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sharedservice } from '../../../shared.service'
import { mandateservice } from '../../../mandate.service';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { MandateClassService } from '../../../mandate-class.service';
import { EchoService } from '../../../echo.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-exec-activities',
  templateUrl: './mandate-exec-activities.component.html',
  styleUrls: ['./mandate-exec-activities.component.css']
})
export class MandateExecActivitiesComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private _mandateService: mandateservice, private _sharedservice: sharedservice, private _mandateClassService: MandateClassService,
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


  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;
  public clicked4: boolean = false;
  filterLoader: boolean = true;
  closepropertyname: any;
  datecustomfetch: any;
  datetype: any;
  private isCountdownInitialized: boolean;
  propertyid: any;
  propertyname: any;
  static count: number;
  static closedcount: number;
  callerleads: any;
  status: any;
  currentDate = new Date();
  currentdateforcompare = new Date();
  todaysdate: any;
  todaysdateforcompare: any;
  yesterdaysdateforcompare: any;
  tomorrowsdateforcompare: any;
  sevendaysdateforcompare: any;
  thirtydaysdateforcompare: any
  stagevalue: any;
  stagestatusval: any;
  stagestatusvaltext: any;
  followupleadsparam: any;
  inactiveparam: any;
  Totalleadcounts: any;
  followupleadcounts: any;
  inactivecounts: any;
  roleid: any;
  userid: any;
  mandateprojects: any;
  copyofmandateprojects: any;
  unquieleadcounts: number = 0;
  followupsections: any;
  dateRange: any;
  usvParam: any;
  rsvParam: any;
  fnParam: any;
  bookingRequestParam: any;
  junkleadsParam: any;
  junkvisitsParam: any;
  bookedParam: any;
  junkleadsCounts: number = 0;
  junkvisitsCounts: number = 0;
  usvCounts: number = 0;
  rsvCounts: number = 0;
  fnCounts: number = 0;
  bookingRequestCounts: number = 0;
  bookedCounts: number = 0;
  leadstatusVisits: any;
  followctgFilter: any;
  searchTerm_stagecategory: any;
  categoryStage: any;
  categoryStageName: any;
  normalcallparam: any;
  normalcallcounts: number = 0;
  propertyfilterview = false;
  stagefilterview = false;
  stagestatusfilterview = false;
  datefilterview = false;
  stagestatus = false;
  lastupdatedDatefilterview: boolean = false;
  receivedDatefilterview: boolean = false;
  categeoryfilterview: boolean = false;
  // visitedDatefilterview: boolean = false;
  selectedLeadStatus: string;
  selectedBookingLeadStatus: string;
  leadBookingstatus: any;
  searchTerm: string = '';
  searchTerm_source: string = '';
  requestedunits: any;
  fromdate: any;
  todate: any;
  receivedFromDate: any;
  receivedToDate: any;
  // visitedFrom: any;
  // visitedTo: any;
  updatedFrom: any;
  updatedTo: any;
  leadReceivedDateRange: Date[];
  nextActionDateRange: Date[];
  // visitedDateRange: Date[];
  updatedDateRange: Date[];
  execname: any;
  execid: any;
  mandateExecutivesFilter: any;
  copyMandateExecutives: any;
  searchTerm_executive: string = '';
  executivefilterview: boolean = false;
  sourceList: any;
  copyofsources: any;
  sourceFilter: boolean = false;
  source: any;
  rmid: any;
  @ViewChild(BsDaterangepickerDirective) datepicker1: BsDaterangepickerDirective;
  @ViewChild(BsDaterangepickerDirective) datepicker2: BsDaterangepickerDirective;
  @ViewChild(BsDaterangepickerDirective) datepicker3: BsDaterangepickerDirective;
  @ViewChild(BsDaterangepickerDirective) datepicker4: BsDaterangepickerDirective;
  @ViewChild('datepicker1') datepickerreceived: ElementRef;
  @ViewChild('datepicker3') datepickervisited: ElementRef;
  @ViewChild('datepicker2') datepickernextACtion: ElementRef;
  @ViewChild('datepicker4') datepickerupdated: ElementRef;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  updatedOnStart: moment.Moment | null = null;
  updatedOnEnd: moment.Moment | null = null;
  fromTime: any;
  toTime: any;
  role_type: any;
  // callStatus: any;
  calledLead: any;
  assignedRm: any;
  selectedRecordExec: any;
  audioList: any;
  onRecordExecList: any;
  // *****************************Assignedleads section list*****************************

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.role_type = localStorage.getItem('role_type');
    // *********************load the required template files*********************
    this.getleadsdata();
    this.mandateprojectsfetch();
    if (this.roleid == 1 || this.roleid == '2' || this.roleid == '50013' || this.roleid == '50014' || this.role_type == 1) {
      this.getsourcelist();
      this.getExecutivesForFilter()
    }

    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");

    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    // Todays Date

    // Yesterdays Date
    const yesterday = () => {
      this.currentdateforcompare.setDate(this.currentdateforcompare.getDate() - 1);
      return this.currentdateforcompare;
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

    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
    MandateExecActivitiesComponent.count = 0;
    MandateExecActivitiesComponent.closedcount = 0;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeNextActionDateRangePicker();
      this.initializeUpdatedOnDateRangePicker();
      this.resetScroll();
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
    this.filterLoader = true;
    MandateExecActivitiesComponent.count = 0;
    this.route.queryParams.subscribe((paramss) => {
      // Updated Using Strategy

      // *****************************Assignedleads section list*****************************

      this.followupleadsparam = paramss['followups'];
      this.inactiveparam = paramss['inactive'];
      this.usvParam = paramss['usv'];
      this.rsvParam = paramss['rsv'];
      this.fnParam = paramss['fn'];
      this.junkleadsParam = paramss['junkleads'];
      this.junkvisitsParam = paramss['junkvisits'];
      this.bookingRequestParam = paramss['bookingRequest'];
      this.bookedParam = paramss['booked'];
      this.normalcallparam = paramss['nc'];

      this.propertyid = paramss['property'];
      this.propertyname = paramss['propname'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.source = paramss['source'];
      this.stagevalue = paramss['stage'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.stagestatusval = paramss['stagestatus'];
      this.leadstatusVisits = paramss['visits'];
      this.leadBookingstatus = paramss['bookingLeadRequest'];
      this.categoryStage = paramss['followupcategory'];
      this.categoryStageName = paramss['followupcategoryName'];
      this.receivedFromDate = paramss['receivedFrom'];
      this.receivedToDate = paramss['receivedTo'];
      // this.visitedFrom = paramss['visitedfrom'];
      // this.visitedTo = paramss['visitedto'];
      this.datetype = paramss['datetype'];
      this.updatedFrom = paramss['updatedFrom'];
      this.updatedTo = paramss['updatedTo'];
      this.fromTime = paramss['fromtime'];
      this.toTime = paramss['totime'];
      this.resetScroll();
      this.detailsPageRedirection();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.initializeUpdatedOnDateRangePicker();
      }, 0);

      if (this.leadstatusVisits == 1) {
        this.selectedLeadStatus = 'Direct Visits'
      } else if (this.leadstatusVisits == 2) {
        this.selectedLeadStatus = 'Assigned'
      } else {
        this.selectedLeadStatus = 'All'
      }

      if (this.datetype == 'today') {
        this.clicked = true;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = false;
        this.clicked4 = false;
        this.currentdateforcompare = new Date();
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        this.todaysdate = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
        this.updatedFrom = this.todaysdate;
        this.updatedTo = this.todaysdate;
      } else if (this.datetype == 'yesterday') {
        this.clicked = false;
        this.clicked1 = true;
        this.clicked2 = false;
        this.clicked3 = false;
        this.clicked4 = false;
        this.currentdateforcompare = new Date();
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var yesterday = this.currentdateforcompare.getDate() - 1;
        var yesterdaywithzero = yesterday.toString().padStart(2, "0");
        this.yesterdaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + yesterdaywithzero;
        this.updatedFrom = this.yesterdaysdateforcompare;
        this.updatedTo = this.yesterdaysdateforcompare;
      } else if (this.datetype == '7days') {
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = true;
        this.clicked3 = false;
        this.clicked4 = false;
        //current date of today's
        this.currentdateforcompare = new Date();
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, '0');
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, '0');
        this.todaysdate = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
        //getting the date of the -6days
        var sevendaysago = new Date(this.currentdateforcompare);
        sevendaysago.setDate(sevendaysago.getDate() - 6);
        var sevendaysmonth = sevendaysago.getMonth() + 1;
        var sevendaysmonthwithzero = sevendaysmonth.toString().padStart(2, "0");
        var sevendays = sevendaysago.getDate();
        var sevendayswithzero = sevendays.toString().padStart(2, "0");
        this.sevendaysdateforcompare = sevendaysago.getFullYear() + "-" + sevendaysmonthwithzero + "-" + sevendayswithzero;

        this.updatedFrom = this.sevendaysdateforcompare;
        this.updatedTo = this.todaysdate;
      } else if (this.datetype == '30days') {
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = true;
        this.clicked4 = false;
        //current date of today's
        this.currentdateforcompare = new Date();
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, '0');
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, '0');
        this.todaysdate = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
        //getting the date of the 29days of the previous month
        var thirtyDaysago = new Date(this.currentdateforcompare);
        thirtyDaysago.setDate(this.currentdateforcompare.getDate() - 29);
        var thirtydaysmonth = thirtyDaysago.getMonth() + 1;
        var thirtydaysmonthwithzero = thirtydaysmonth.toString().padStart(2, "0");
        var thirtydays = thirtyDaysago.getDate();
        var thirtydayswithzero = thirtydays.toString().padStart(2, "0");
        this.thirtydaysdateforcompare = thirtyDaysago.getFullYear() + "-" + thirtydaysmonthwithzero + "-" + thirtydayswithzero;
        this.updatedFrom = this.thirtydaysdateforcompare;
        this.updatedTo = this.todaysdate;
      } else {
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = false;
        this.clicked4 = true;
        this.updatedFrom = this.updatedFrom;
        this.updatedTo = this.updatedTo;
      }

      if (this.propertyid == null || this.propertyid == '' || this.propertyid == undefined) {
        this.propertyfilterview = false;
        if (this.roleid == 1 || this.roleid == '2') {
          // this.getExecutivesForFilter();
        }
      } else {
        this.propertyfilterview = true;
        if (this.roleid == 1 || this.roleid == '2') {
          // this.getExecutivesForFilter();
        }
      }

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
        this.fromdate = '';
        this.todate = '';
        this.fromTime = '';
        this.toTime = '';
      } else {
        this.datefilterview = true;

        if ((this.receivedFromDate == '' || this.receivedFromDate == undefined || this.receivedFromDate == null) || (this.receivedToDate == null || this.receivedToDate == '' || this.receivedToDate == undefined)) {
          this.receivedDatefilterview = false;
        } else {
          this.receivedDatefilterview = true;
        }

        // if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
        //   this.visitedDatefilterview = false;
        // } else {
        //   this.visitedDatefilterview = true;
        // }

        if ((this.updatedFrom == '' || this.updatedFrom == undefined || this.updatedFrom == null) || (this.updatedTo == null || this.updatedTo == '' || this.updatedTo == undefined)) {
          this.lastupdatedDatefilterview = false;
        } else {
          this.lastupdatedDatefilterview = true;
        }
      }

      if ((this.receivedFromDate == '' || this.receivedFromDate == undefined || this.receivedFromDate == null) || (this.receivedToDate == '' || this.receivedToDate == undefined || this.receivedToDate == null)) {
        this.receivedDatefilterview = false;
        this.receivedFromDate = '';
        this.receivedToDate = '';
      } else {
        this.receivedDatefilterview = true;

        if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
          this.datefilterview = false;
        } else {
          this.datefilterview = true;
        }

        // if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
        //   this.visitedDatefilterview = false;
        // } else {
        //   this.visitedDatefilterview = true;
        // }

        if ((this.updatedFrom == '' || this.updatedFrom == undefined || this.updatedFrom == null) || (this.updatedTo == null || this.updatedTo == '' || this.updatedTo == undefined)) {
          this.lastupdatedDatefilterview = false;
        } else {
          this.lastupdatedDatefilterview = true;
        }
      }

      // if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
      //   this.visitedDatefilterview = false;
      //   this.visitedFrom = '';
      //   this.visitedTo = '';
      // } else {
      //   this.visitedDatefilterview = true;

      //   if ((this.receivedFromDate == '' || this.receivedFromDate == undefined || this.receivedFromDate == null) || (this.receivedToDate == null || this.receivedToDate == '' || this.receivedToDate == undefined)) {
      //     this.receivedDatefilterview = false;
      //   } else {
      //     this.receivedDatefilterview = true;
      //   }

      //   if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
      //     this.datefilterview = false;
      //   } else {
      //     this.datefilterview = true;
      //   }

      //   if ((this.updatedFrom == '' || this.updatedFrom == undefined || this.updatedFrom == null) || (this.updatedTo == null || this.updatedTo == '' || this.updatedTo == undefined)) {
      //     this.lastupdatedDatefilterview = false;
      //   } else {
      //     this.lastupdatedDatefilterview = true;
      //   }
      // }

      if ((this.updatedFrom == '' || this.updatedFrom == undefined || this.updatedFrom == null) || (this.updatedTo == null || this.updatedTo == '' || this.updatedTo == undefined)) {
        this.lastupdatedDatefilterview = false;
        this.updatedFrom = '';
        this.updatedTo = '';
      } else {
        this.lastupdatedDatefilterview = true;

        if ((this.receivedFromDate == '' || this.receivedFromDate == undefined || this.receivedFromDate == null) || (this.receivedToDate == null || this.receivedToDate == '' || this.receivedToDate == undefined)) {
          this.receivedDatefilterview = false;
        } else {
          this.receivedDatefilterview = true;
        }

        // if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
        //   this.visitedDatefilterview = false;
        // } else {
        //   this.visitedDatefilterview = true;
        // }

        if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
          this.datefilterview = false;
        } else {
          this.datefilterview = true;
        }
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

      if (this.leadBookingstatus == 1) {
        this.selectedBookingLeadStatus = 'Rejected'
      } else if (this.leadBookingstatus == 2) {
        this.selectedBookingLeadStatus = 'Pending'
      } else {
        this.selectedBookingLeadStatus = 'All'
      }

      if ((this.updatedFrom == "" || this.updatedFrom == undefined) && (this.updatedTo == undefined || this.updatedTo == "")) {
        this.datecustomfetch = "Custom";
      } else {
        // this.datecustomfetch = "Custom";
        this.datecustomfetch = this.updatedFrom + ' - ' + this.updatedTo;
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

      if (this.followupleadsparam == '1') {
        this.batch1trigger();
        this.followupleadsdata();
        this.getFollowupsStatus();
      } else if (this.inactiveparam == '1') {
        this.batch1trigger();
        this.inactivedatas();
        this.getFollowupsStatus();
      } else if (this.usvParam == '1') {
        this.batch1trigger();
        this.usvdatas();
      } else if (this.rsvParam == '1') {
        this.batch1trigger();
        this.rsvdatas();
      } else if (this.fnParam == '1') {
        this.batch1trigger();
        this.fndatas();
      } else if (this.junkleadsParam == '1') {
        this.batch1trigger();
        this.junkleadsdatas();
      } else if (this.junkvisitsParam == '1') {
        this.batch1trigger();
        this.junkvisitsdatas();
      } else if (this.bookingRequestParam == '1') {
        this.batch1trigger();
        this.bookingRequestdatas();
      } else if (this.bookedParam == '1') {
        this.batch1trigger();
        this.bookeddatas();
      } else if (this.normalcallparam == '1') {
        this.stagestatus = true;
        if (this.stagestatusval == '3') {
          this.stagestatusfilterview = false;
          this.stagefilterview = false;
        }
        this.batch1trigger();
        this.ncdatas();
      }
      // *****************************Assignedleads section list*****************************
    });
  }

  datefilter(val) {
    if (val == 'today') {
      this.router.navigate([], {
        queryParams: {
          datetype: 'today'
        },
        queryParamsHandling: 'merge',
      })
    } else if (val == 'yesterday') {
      this.router.navigate([], {
        queryParams: {
          datetype: 'yesterday'
        },
        queryParamsHandling: 'merge',
      })
    } else if (val == '7days') {
      this.router.navigate([], {
        queryParams: {
          datetype: '7days'
        },
        queryParamsHandling: 'merge',
      })
    } else if (val == '30days') {
      this.router.navigate([], {
        queryParams: {
          datetype: '30days'
        },
        queryParamsHandling: 'merge',
      })
    }
  }

  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
        this.copyofmandateprojects = mandates['Properties']
      } else {
      }
    });
  }

  batch1trigger() {
    this.Totalleadcounts = 0;
    this.unquieleadcounts = 0;
    this.followupleadcounts = 0;
    this.normalcallcounts = 0;
    this.usvCounts = 0;
    this.rsvCounts = 0;
    this.fnCounts = 0;
    this.bookingRequestCounts = 0;
    this.bookedCounts = 0;
    this.inactivecounts = 0;
    this.junkleadsCounts = 0;
    this.junkvisitsCounts = 0;

    // Total Assigned Leads Count
    var totalleads = {
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'allleads',
      stage: '',
      stagestatus: '',
      source: this.source,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(totalleads).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.Totalleadcounts = compleads.result[0].total_counts;
        this.unquieleadcounts = compleads.result[0].uniquee_count
      } else {
        this.Totalleadcounts = "0";
      }
    });

    // Total Assigned Leads Count

    // Followup Leads Counts Fetch
    var followups = {
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'generalfollowups',
      stage: '',
      stagestatus: '',
      source: this.source,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      followup: this.categoryStage,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(followups).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.followupleadcounts = compleads.result[0].uniquee_count;
      } else {
        this.followupleadcounts = 0;
      }
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
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'NC',
      stage: '',
      source: this.source,
      stagestatus: stagestatus,
      propid: this.propertyid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      executid: this.rmid,
      loginuser: this.userid,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(nc).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.normalcallcounts = compleads.result[0].uniquee_count;
      } else {
        this.normalcallcounts = 0;
      }
    });

    // nc Counts

    //usv counts  fetch

    var usvpar = {
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'USV',
      stage: '',
      stagestatus: '3',
      source: this.source,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(usvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.usvCounts = compleads.result[0].uniquee_count;
      } else {
        this.usvCounts = 0;
      }
    });
    //usv counts  fetch

    //rsv counts  fetch
    var rsvpar = {
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'RSV',
      stage: '',
      source: this.source,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(rsvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.rsvCounts = compleads.result[0].uniquee_count;
        // if (rsvpar.stage == 'RSV' && (rsvpar.stagestatus == '3' || rsvpar.stagestatus == '')) {
        //   this.rsvCounts = compleads.result[0].uniquee_count;
        // } else {
        //   this.rsvCounts = compleads.result[0].total_counts;
        // }
      } else {
        this.rsvCounts = 0;
      }
    });
    //rsv counts  fetch

    //fn counts  fetch
    var fnpar = {
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'Final Negotiation',
      stage: '',
      source: this.source,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(fnpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.fnCounts = compleads.result[0].uniquee_count;
        // if (fnpar.stage == 'Final Negotiation' && (fnpar.stagestatus == 3 || fnpar.stagestatus == '')) {
        //   this.fnCounts = compleads.result[0].uniquee_count;
        // } else {
        //   this.fnCounts = compleads.result[0].total_counts;
        // }
      } else {
        this.fnCounts = 0;
      }
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
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: bookingRR,
      stage: '',
      stagestatus: '3',
      source: this.source,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(bookingRequestpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.bookingRequestCounts = compleads.result[0].uniquee_count;
      } else {
        this.bookingRequestCounts = 0;
      }
    });
    //booking request  fetch

    //booked counts  fetch
    var bookedpar = {
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'Deal Closed',
      stage: '',
      stagestatus: '3',
      source: this.source,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(bookedpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.bookedCounts = compleads.result[0].uniquee_count;
      } else {
        this.bookedCounts = 0;
      }
    });
    //booked counts fetch

    // inactive Counts Fetch
    var inactive = {
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'inactive',
      stage: '',
      stagestatus: '',
      source: this.source,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      followup: this.categoryStage,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(inactive).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.inactivecounts = compleads.result[0].uniquee_count;
      } else {
        this.inactivecounts = 0;
      }
    });
    // inactive Counts Fetch

    let stagestatus1;
    if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
      stagestatus1 = '';
    } else {
      stagestatus1 = this.stagestatusval;
    }
    //junk visits count detch
    var junkpar = {
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'junkvisits',
      stage: this.stagevalue,
      stagestatus: stagestatus1,
      source: this.source,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(junkpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsCounts = compleads.result[0].uniquee_count;
      } else {
        this.junkvisitsCounts = 0;
      }
    });

    //junk leads count detch
    var junkleadspar = {
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'junkleads',
      stage: '',
      stagestatus: '',
      source: this.source,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
      // updatedfrom: this.updatedFrom,
      // updatedto: this.updatedTo
    }
    this._mandateService.activityLeadsCount(junkleadspar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkleadsCounts = compleads.result[0].uniquee_count;
      } else {
        this.junkleadsCounts = 0;
      }
    });
  }

  followupleadsdata() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".followups_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'generalfollowups',
      executid: this.rmid,
      loginuser: this.userid,
      stage: '',
      stagestatus: '',
      source: this.source,
      propid: this.propertyid,
      followup: this.categoryStage,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
    }
    this._mandateService.activityLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['result'];
    });
  }

  inactivedatas() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".inactive_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'inactive',
      executid: this.rmid,
      loginuser: this.userid,
      stagestatus: '',
      source: this.source,
      propid: this.propertyid,
      followup: this.categoryStage,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
    }
    this._mandateService.activityLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['result'];
    });
  }

  usvdatas() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".usv_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'USV',
      stagestatus: '3',
      source: this.source,
      executid: this.rmid,
      loginuser: this.userid,
      propid: this.propertyid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,

    }
    this._mandateService.activityLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['result'];
    });
  }

  rsvdatas() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".rsv_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'RSV',
      stagestatus: this.stagestatusval,
      source: this.source,
      executid: this.rmid,
      loginuser: this.userid,
      propid: this.propertyid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,

    }
    this._mandateService.activityLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['result'];
    });
  }

  fndatas() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".fn_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'Final Negotiation',
      stagestatus: this.stagestatusval,
      source: this.source,
      executid: this.rmid,
      loginuser: this.userid,
      propid: this.propertyid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,

    }
    this._mandateService.activityLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['result'];
    });
  }

  bookingRequestdatas() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.filterLoader = true;
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
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: bookingRR,
      stagestatus: '3',
      source: this.source,
      executid: this.rmid,
      loginuser: this.userid,
      propid: this.propertyid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,

    }
    this._mandateService.activityLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['result'];
    });
  }

  bookeddatas() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".booked_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'Deal Closed',
      stagestatus: '3',
      source: this.source,
      executid: this.rmid,
      loginuser: this.userid,
      propid: this.propertyid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,

    }
    this._mandateService.activityLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['result'];
    });
  }

  junkleadsdatas() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".junkleads_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'junkleads',
      stage: '',
      stagestatus: '',
      source: this.source,
      executid: this.rmid,
      loginuser: this.userid,
      propid: this.propertyid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
    }
    this._mandateService.activityLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['result'];
    });
  }

  junkvisitsdatas() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".junkvisits_section").addClass("active");
    let stagestatus1;
    if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
      stagestatus1 = '';
    }
    else {
      stagestatus1 = this.stagestatusval;
    }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'junkvisits',
      stage: this.stagevalue,
      stagestatus: stagestatus1,
      source: this.source,
      executid: this.rmid,
      loginuser: this.userid,
      propid: this.propertyid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
    }
    this._mandateService.activityLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['result'];
    });
  }

  ncdatas() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".nc_section").addClass("active");
    let stagestatus;
    if (this.stagestatusval == '3' || this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
      stagestatus = ''
    } else if (this.stagestatusval == '2' || this.stagestatusval == '1') {
      stagestatus = '';
    }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.updatedFrom,
      dateto: this.updatedTo,
      actionfrom: this.fromdate,
      actionto: this.todate,
      statuss: 'NC',
      stagestatus: stagestatus,
      source: this.source,
      executid: this.rmid,
      loginuser: this.userid,
      propid: this.propertyid,
      visits: this.leadstatusVisits,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      // visitedfrom: this.visitedFrom,
      // visitedto: this.visitedTo,
    }
    this._mandateService.activityLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['result'];
    });
  }

  showdateRange() {
    // this.datepicker1.show();
    this.leadReceivedDateRange = [this.currentdateforcompare];

    setTimeout(() => {
      const inputElement = this.datepickerreceived.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      $('bs-daterangepicker-container').removeAttr('style');
      $("bs-daterangepicker-container").removeClass("nextactiondatepkr");
      $("bs-daterangepicker-container").removeClass("visiteddatepkr");
      $("bs-daterangepicker-container").addClass("recievedleadsdatepkr");
    }, 0);
  }

  showdateRange2() {
    // this.datepicker2.show();
    this.nextActionDateRange = [this.currentdateforcompare];

    setTimeout(() => {
      const inputElement = this.datepickernextACtion.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      $('bs-daterangepicker-container').removeAttr('style');
      $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
      $("bs-daterangepicker-container").removeClass("visiteddatepkr");
      $("bs-daterangepicker-container").addClass("nextactiondatepkr");
    }, 0);
  }

  // showdateRange3() {
  //   // this.datepicker3.show(); 
  //   this.visitedDateRange = [this.currentdateforcompare];
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

  showdateRange4() {
    // this.datepicker3.show(); 
    setTimeout(() => {
      const inputElement = this.datepickerupdated.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      $('bs-daterangepicker-container').removeAttr('style');
      $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
      $("bs-daterangepicker-container").removeClass("nextactiondatepkr");
      $("bs-daterangepicker-container").removeClass("visiteddatepkr");
      $("bs-daterangepicker-container").addClass("updateddatepkr");
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
        // this.visitedDatefilterview = false;
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
      if ((formattedFromDate != null && formattedFromDate != '') && (formattedToDate != null && formattedToDate != '')) {
        this.fromdate = formattedFromDate;
        this.todate = formattedToDate;
        this.datefilterview = true;
        this.receivedDatefilterview = false;
        // this.visitedDatefilterview = false;
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

  // onVisitedDateRangeSelected(range: Date[]) {
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

  onupdatedDateRangeSelected(range: Date[]) {
    this.updatedDateRange = range;
    //Convert the first date of the range to yyyy-mm-dd format
    if (this.updatedDateRange != null || this.updatedDateRange != undefined) {
      let formattedFromDate = this.datepipe.transform(this.updatedDateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.updatedDateRange[1], 'yyyy-MM-dd');
      if (formattedFromDate != null && formattedToDate != null) {
        this.updatedFrom = formattedFromDate;
        this.updatedTo = formattedToDate;
        this.lastupdatedDatefilterview = true;
        if ((this.fromdate == '' || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined)) {
          this.datefilterview = false;
        } else {
          this.datefilterview = true;
        }

        if ((this.receivedFromDate == '' || this.receivedFromDate == undefined) || (this.receivedToDate == '' || this.receivedToDate == undefined)) {
          this.receivedDatefilterview = false;
        } else {
          this.receivedDatefilterview = true;
        }

        // if ((this.visitedFrom == '' || this.visitedFrom == undefined) || (this.visitedTo == '' || this.visitedTo == undefined)) {
        //   this.visitedDatefilterview = false;
        // } else {
        //   this.visitedDatefilterview = true;
        // }
      }
      this.router.navigate([], {
        queryParams: {
          updatedFrom: this.updatedFrom,
          updatedTo: this.updatedTo
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  // *****************************Assignedleads section list*****************************
  stagestatuschange(vals) {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
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
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.stagefilterview = true;
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
    }
  }

  junkStageStatusChange(stage, vals) {
    this.stagevalue = stage;
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
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

  // ENQUIRY-VIEW-FROM-DB
  dateclose() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
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

  // visitedDateclose() {
  //   MandateExecActivitiesComponent.closedcount = 0;
  //   MandateExecActivitiesComponent.count = 0;
  //   this.visitedDatefilterview = false;
  //   this.visitedFrom = "";
  //   this.visitedTo = "";
  //   this.router.navigate([], {
  //     queryParams: {
  //       visitedfrom: "",
  //       visitedto: ""
  //     },
  //     queryParamsHandling: 'merge',
  //   });
  // }

  // updatedDateclose() {
  //   MandateExecActivitiesComponent.closedcount = 0;
  //   MandateExecActivitiesComponent.count = 0;
  //   this.lastupdatedDatefilterview = false;
  //   this.updatedFrom = "";
  //   this.updatedTo = "";
  //   this.router.navigate([], {
  //     queryParams: {
  //       updatedFrom: "",
  //       updatedTo: ""
  //     },
  //     queryParamsHandling: 'merge',
  //   });
  // }

  propertyclose() {
    $("input[name='propFilter']").prop("checked", false);
    this.propertyfilterview = false;
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.propertyid = "";
    this.stagestatusval = "";
    this.searchTerm = '';
    if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
      this.getExecutivesForFilter();
    }
    this.mandateprojects = this.copyofmandateprojects
    this.router.navigate([], {
      queryParams: {
        property: "",
        propname: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  receivedDateclose() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
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
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
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

  executiveclose() {
    $("input[name='executiveFilter']").prop("checked", false);
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.executivefilterview = false;
    this.execid = '';
    this.execname = '';
    this.searchTerm_executive = '';
    this.mandateExecutivesFilter = this.copyMandateExecutives;
    this.router.navigate([], {
      queryParams: {
        execid: '',
        execname: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  sourceClose() {
    $("input[name='sourceFilter']").prop("checked", false);
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    this.source = "";
    this.sourceFilter = false;
    this.searchTerm_source = '';
    this.sourceList = this.copyofsources;
    this.router.navigate([], {
      queryParams: {
        source: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  //this load  is for assigned lead page.
  loadMoreassignedleads() {
    const limit = MandateExecActivitiesComponent.count += 30;
    if (this.followupleadsparam == 1) {
      var param1 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.updatedFrom,
        dateto: this.updatedTo,
        actionfrom: this.fromdate,
        actionto: this.todate,
        statuss: 'generalfollowups',
        executid: this.rmid,
        loginuser: this.userid,
        stage: '',
        stagestatus: '',
        source: this.source,
        propid: this.propertyid,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
      }
      let livecount = this.callerleads.length;
      if (livecount < this.followupleadcounts) {
        this._mandateService.activityLeads(param1).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['result']);
        });
      }
    }
    else if (this.inactiveparam == 1) {
      var param2 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.updatedFrom,
        dateto: this.updatedTo,
        actionfrom: this.fromdate,
        actionto: this.todate,
        statuss: 'inactive',
        executid: this.rmid,
        loginuser: this.userid,
        stagestatus: '',
        source: this.source,
        propid: this.propertyid,
        followup: this.categoryStage,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
      }
      let livecount = this.callerleads.length;
      if (livecount < this.inactivecounts) {
        this._mandateService.activityLeads(param2).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['result']);
        });
      }
    }
    else if (this.usvParam == 1) {
      var usvpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.updatedFrom,
        dateto: this.updatedTo,
        actionfrom: this.fromdate,
        actionto: this.todate,
        statuss: 'USV',
        executid: this.rmid,
        loginuser: this.userid,
        stagestatus: '3',
        source: this.source,
        propid: this.propertyid,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
      }
      let livecount = this.callerleads.length;
      if (livecount < this.usvCounts) {
        this._mandateService.activityLeads(usvpar).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['result']);
        });
      }
    }
    else if (this.rsvParam == 1) {
      var rsvpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.updatedFrom,
        dateto: this.updatedTo,
        actionfrom: this.fromdate,
        actionto: this.todate,
        statuss: 'RSV',
        executid: this.rmid,
        loginuser: this.userid,
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
      }
      let livecount = this.callerleads.length;
      if (livecount < this.rsvCounts) {
        this._mandateService.activityLeads(rsvpar).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['result']);
        });
      }
    }
    else if (this.fnParam == 1) {
      var fnpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.updatedFrom,
        dateto: this.updatedTo,
        actionfrom: this.fromdate,
        actionto: this.todate,
        statuss: 'Final Negotiation',
        executid: this.rmid,
        loginuser: this.userid,
        stagestatus: this.stagestatusval,
        source: this.source,
        propid: this.propertyid,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
      }
      let livecount = this.callerleads.length;
      if (livecount < this.fnCounts) {
        this._mandateService.activityLeads(fnpar).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['result']);
        });
      }
    }
    else if (this.bookingRequestParam == 1) {
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
        limitrows: 30,
        datefrom: this.updatedFrom,
        dateto: this.updatedTo,
        actionfrom: this.fromdate,
        actionto: this.todate,
        statuss: bookingRR,
        executid: this.rmid,
        loginuser: this.userid,
        stagestatus: '3',
        source: this.source,
        propid: this.propertyid,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
      }
      let livecount = this.callerleads.length;
      if (livecount < this.bookingRequestCounts) {
        this._mandateService.activityLeads(dealClosingg).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['result']);
        });
      }
    }
    else if (this.bookedParam == 1) {
      var dealclosed = {
        limit: limit,
        limitrows: 30,
        datefrom: this.updatedFrom,
        dateto: this.updatedTo,
        actionfrom: this.fromdate,
        actionto: this.todate,
        statuss: 'Deal Closed',
        executid: this.rmid,
        loginuser: this.userid,
        stagestatus: '3',
        source: this.source,
        propid: this.propertyid,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
      }
      let livecount = this.callerleads.length;
      if (livecount < this.bookedCounts) {
        this._mandateService.activityLeads(dealclosed).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['result']);
        });
      }
    }
    else if (this.junkvisitsParam == 1) {
      let statestatusval;
      if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == null) {
        statestatusval = '';
      } else {
        statestatusval = this.stagestatusval;
      }
      var param = {
        limit: limit,
        limitrows: 30,
        datefrom: this.updatedFrom,
        dateto: this.updatedTo,
        actionfrom: this.fromdate,
        actionto: this.todate,
        statuss: 'junkvisits',
        executid: this.rmid,
        loginuser: this.userid,
        stage: this.stagevalue,
        stagestatus: statestatusval,
        source: this.source,
        propid: this.propertyid,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
      }
      let livecount = this.callerleads.length;
      if (livecount < this.junkvisitsCounts) {
        this._mandateService.activityLeads(param).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['result']);
        });
      }
    }
    else if (this.junkleadsParam == 1) {
      var param1 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.updatedFrom,
        dateto: this.updatedTo,
        actionfrom: this.fromdate,
        actionto: this.todate,
        statuss: 'junkleads',
        executid: this.rmid,
        loginuser: this.userid,
        stage: '',
        stagestatus: '',
        source: this.source,
        propid: this.propertyid,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
      }
      let livecount = this.callerleads.length;
      if (livecount < this.junkleadsCounts) {
        this._mandateService.activityLeads(param1).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['result']);
        });
      }
    }
    else if (this.normalcallparam == 1) {
      let stagestatus;
      if (this.stagestatusval == '3' || this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
        stagestatus = ''
      } else if (this.stagestatusval == '2' || this.stagestatusval == '1') {
        stagestatus = '';
      }
      var paramnc = {
        limit: limit,
        limitrows: 30,
        datefrom: this.updatedFrom,
        dateto: this.updatedTo,
        actionfrom: this.fromdate,
        actionto: this.todate,
        statuss: 'NC',
        executid: this.rmid,
        loginuser: this.userid,
        stagestatus: stagestatus,
        source: this.source,
        propid: this.propertyid,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
      }
      if (this.callerleads.length < this.normalcallcounts) {
        this._mandateService.activityLeads(paramnc).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['result']);
        });
      }
    }
  }

  refresh() {
    this._mandateService.setControllerName('');
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    this.stagevalue = "";
    if (this.stagestatusval != 3) {
      this.stagestatusval = "";
    }
    this.propertyname = '';
    this.propertyid = "";
    this.stagestatusvaltext = '';
    this.fromdate = '';
    this.todate = '';
    this.selectedLeadStatus = '';
    this.selectedBookingLeadStatus = '';
    this.leadstatusVisits = '';
    this.leadBookingstatus = '';
    this.categoryStage = '';
    this.categoryStageName = '';
    this.receivedFromDate = '';
    this.receivedToDate = '';
    this.source = '';
    this.execid = '';
    this.execname = '';
    // this.visitedFrom = '';
    // this.visitedTo = '';
    this.updatedFrom = '';
    this.updatedTo = '';

    // this.visitedDateRange = [this.todaysdateforcompare];
    this.nextActionDateRange = [this.todaysdateforcompare];
    this.updatedDateRange = [this.todaysdateforcompare];


    this.propertyclose();
    this.stageclose();
    this.receivedDateclose();
    this.sourceClose();
    this.executiveclose();

    // this.visitedDateclose();
    // this.updatedDateclose();
    this.stagestatus = false;
    this.propertyfilterview = false;
    this.categeoryfilterview = false;
    this.receivedDatefilterview = false;
    this.sourceFilter = false;
    this.executivefilterview = false;

    this.router.navigate([], {
      queryParams: {
        from: '',
        to: '',
        property: '',
        propname: '',
        datetype: 'today',
        stage: '',
        stagestatus: '',
        execid: '',
        execname: '',
        source: '',
        bookingLeadRequest: '',
        visits: '',
        followupcategory: '',
        followupcategoryName: '',
        receivedFrom: '',
        receivedTo: '',
        visitedfrom: '',
        visitedto: '',
        updatedFrom: '',
        updatedTo: ''
      },
      queryParamsHandling: 'merge',
    });
    $("input[name='propFilter']").prop("checked", false);
    $("input[name='executiveFilter']").prop("checked", false);
    $("input[name='sourceFilter']").prop("checked", false);
    this.apitrigger();
  }

  apitrigger() {
    this.filterLoader = true;
    if ((this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null)) {
      this.stagestatusfilterview = false;
      this.stagestatusval = '3';
    }
    this.lastupdatedDatefilterview = true;
    if (this.followupleadsparam == '1') {
      this.updatedFrom = this.todaysdate;
      this.updatedTo = this.todaysdate;
      // this.batch1trigger();
      this.followupleadsdata();
    } else if (this.normalcallparam == '1') {
      this.updatedFrom = this.todaysdate;
      this.updatedTo = this.todaysdate;
      // this.batch1trigger();
      this.ncdatas();
    } else if (this.usvParam == '1') {
      this.updatedFrom = this.todaysdate;
      this.updatedTo = this.todaysdate;
      // this.batch1trigger();
      this.usvdatas();
    } else if (this.rsvParam == '1') {
      this.updatedFrom = this.todaysdate;
      this.updatedTo = this.todaysdate;
      // this.batch1trigger();
      this.rsvdatas();
    } else if (this.fnParam == '1') {
      this.updatedFrom = this.todaysdate;
      this.updatedTo = this.todaysdate;
      // this.batch1trigger();
      this.fndatas();
    } else if (this.bookingRequestParam == '1') {
      this.updatedFrom = this.todaysdate;
      this.updatedTo = this.todaysdate;
      // this.batch1trigger();
      this.bookingRequestdatas();
    } else if (this.bookedParam == '1') {
      this.updatedFrom = this.todaysdate;
      this.updatedTo = this.todaysdate;
      // this.batch1trigger();
      this.bookeddatas();
    } else if (this.inactiveparam == '1') {
      this.updatedFrom = this.todaysdate;
      this.updatedTo = this.todaysdate;
      // this.batch1trigger();
      this.inactivedatas();
    } else if (this.junkvisitsParam == '1') {
      this.updatedFrom = this.todaysdate;
      this.updatedTo = this.todaysdate;
      // this.batch1trigger();
      this.junkvisitsdatas();
    } else if (this.junkleadsParam == '1') {
      this.updatedFrom = this.todaysdate;
      this.updatedTo = this.todaysdate;
      // this.batch1trigger();
      this.junkleadsdatas();
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
      if (this.followupleadsparam == 1) {
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
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
    // var checkid = $("input[name='propFilter']:checked").map(function () {
    //   return this.value;
    // }).get().join(',');

    // let filteredPropIds;
    // filteredPropIds = checkid.split(',');

    // let filteredPropsName;
    // filteredPropsName = this.copyofmandateprojects.filter((da) => filteredPropIds.some((prop) => {
    //   return prop == da.property_idfk
    // }));
    // filteredPropsName = filteredPropsName.map((name) => name.property_info_name);

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
          team: "",
          execid: '',
          execname: ''
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

  //get list of sources
  getsourcelist() {
    if (this.roleid == 1 || this.roleid == '2' || this.roleid == '50013' || this.roleid == '50014') {
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
  }

  //source filter
  onCheckboxChangesource() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
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
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
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

  //executives selection  filter
  onCheckboxExecutiveChange() {
    MandateExecActivitiesComponent.closedcount = 0;
    MandateExecActivitiesComponent.count = 0;
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
        let teamlead;
    if(this.role_type == 1){
      teamlead = this.userid
    }else{
      teamlead = '';
    }
    if (this.roleid == 1 || this.roleid == '2' || this.role_type == 1) {
      this._mandateService.fetchmandateexecutuvesforreassign(this.propertyid, '', '', '',teamlead).subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
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

  //here we filter the leads based on date
  onDateRangeSelected(range: Date[]): void {
    this.dateRange = range;
    // Convert the first date of the range to yyyy-mm-dd format
    if (this.dateRange != null) {
      let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
      if ((formattedFromDate != '' && formattedFromDate != undefined && formattedFromDate != null) && (formattedToDate != '' && formattedToDate != undefined && formattedToDate != null)) {
        var datefrom = new Date(formattedFromDate);
        var dateto = new Date(formattedToDate);
        var diff = Math.abs(datefrom.getTime() - dateto.getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        if (diffDays > 92) {
          swal({
            title: 'Please Select the date range between 3 Months!',
            type: 'info',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
          })
        } else {
          this.updatedFrom = formattedFromDate;
          this.updatedTo = formattedToDate;
          setTimeout(() => {
            this.customNavigation(formattedFromDate, formattedToDate)
          }, 100)
        }
      }
    }
  }

  customNavigation(fromdate, todate) {
    this.router.navigate(['/mymandatereports'], {
      queryParams: {
        updatedFrom: fromdate,
        updatedTo: todate,
        datetype: '',
        htype: 'mandate'
      },
      queryParamsHandling: 'merge'
    });
  }

  datePicker() {
    $("bs-daterangepicker-container").addClass("newDashBoardDatePicker");
    $("bs-daterangepicker-container").attr("id", "newDashBoardDatePicker");
    setTimeout(() => {
      this.dateRange = [this.currentdateforcompare];
    }, 100);
  }

  initializeNextActionDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      const pickerElement = $('#nextActionDates');
      if (start && end) {
        pickerElement.find('span').html(start.format('MMMM D, YYYY HH:mm:ss') + ' - ' + end.format('MMMM D, YYYY HH:mm:ss'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          const picker = pickerElement.data('daterangepicker');
          if (picker) {
            picker.setEndDate(end);
          }
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

  //this is triggered when custom is clicked to select the dates.
  initializeUpdatedOnDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#updatedDates span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          $(this).data('daterangepicker').setEndDate(end);
        }
      } else {
        $('#updatedDates span').html('Select Date Range');
      }
      if (start && end) {
        this.updatedFrom = start.format('YYYY-MM-DD');
        this.updatedTo = end.format('YYYY-MM-DD');
        this.router.navigate([], {
          queryParams: {
            updatedFrom: this.updatedFrom,
            updatedTo: this.updatedTo,
            datetype: '',
            htype: 'mandate'
          },
          queryParamsHandling: 'merge'
        });
      } else {
      }
    };
    // Retrieve the date range from the URL query params (if any)
    const urlParams = new URLSearchParams(window.location.search);
    const fromDate = urlParams.get('from');
    const toDate = urlParams.get('to');
    // Initialize start and end dates based on URL parameters or default values
    let startDate = fromDate ? moment(fromDate) : moment().startOf('day');
    let endDate = toDate ? moment(toDate) : moment().endOf('day');

    if (fromDate) {
      startDate = moment(fromDate + ' ', 'YYYY-MM-DD');
    }

    if (toDate) {
      endDate = moment(toDate + ' ', 'YYYY-MM-DD');
    }

    $('#updatedDates').daterangepicker({
      startDate: startDate || moment().startOf('day'),
      endDate: endDate || moment().startOf('day'),
      maxDate: new Date(),
      showDropdowns: false,
      timePicker: false,
      timePickerIncrement: 1,
      locale: {
        format: 'MMMM D, YYYY h:mm A'
      },
      autoApply: true,
    }, cb);
    cb(this.updatedOnStart, this.updatedOnEnd);
  }

  isModalOpen: boolean = false;
  triggerCall(lead) {
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

  detailsPageRedirection() {
    localStorage.setItem('backLocation', 'executives-report');
  }
}