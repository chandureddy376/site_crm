import { Component, OnInit } from '@angular/core';
import { retailservice } from '../../retail.service';
import { mandateservice } from '../../mandate.service';
import { sharedservice } from '../../shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { EchoService } from '../../echo.service';

declare var $: any;

@Component({
  selector: 'app-executive-dashboard',
  templateUrl: './executive-dashboard.component.html',
  styleUrls: ['./executive-dashboard.component.css']
})
export class ExecutiveDashboardComponent implements OnInit {

  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private _sharedservice: sharedservice, 
    private _mandateservice: mandateservice, 
    private _retailservice: retailservice, 
    public datepipe: DatePipe,
    private _echoService: EchoService
  ) {
  }
  private isCountdownInitialized: boolean;
  totalCounts: number = 0;
  mandateTotalCounts: number = 0;
  retailTotalCounts: number = 0;
  usvCounts: number = 0;
  mandateTotalUsvCounts: number = 0;
  retailTotalUsvCounts: number = 0;
  svCounts: number = 0;
  mandateTotalSvCounts: number = 0;
  retailTotalSvCounts: number = 0;
  rsvCounts: number = 0;
  mandateTotalRsvCounts: number = 0;
  retailTotalRsvCounts: number = 0;
  fnCounts: number = 0;
  mandateTotalFnCounts: number = 0;
  retailTotalFnCounts: number = 0;
  closedCounts: number = 0;
  mandateTotalClosedCounts: number = 0;
  retailTotalClosedCounts: number = 0;
  junkVisitsCounts: number = 0;
  mandateTotalJunkVisitsCounts: number = 0;
  retailTotalJunkVisitsCounts: number = 0;
  rejectedVisitsCounts: number = 0;
  mandateTotalRejectedCounts: number = 0;
  retailTotalRejectedCounts: number = 0;
  retailRejectedCounts: number = 0;
  bookingRequestVisitsCounts: number = 0;
  mandateTotalBookingRequestCounts: number = 0;
  retailTotalBookingRequestCounts: number = 0;
  filterLoader: boolean = true;
  dashBoardType: any;
  fromdate: any;
  todate: any;


  static count: number;
  static activecount: number;
  static closedcount: number;
  static followupscount: number;
  static reassignedcount: number;
  callerleads: any;
  callerleadscounts: any;
  telecallers: any;
  leads: any;
  executives: any;
  actionid: any;
  loadmorecountactivecounts: any;
  loadmorecountfollowups: any;
  loadmoreclosedcounts: any;

  totalcounts: number = 0;
  totalusvcounts: number = 0;
  totalrsvcounts: number = 0;
  junkusvcounts: number = 0;
  junkrsvcounts: number = 0;
  allcountsloadmore: number = 0;

  tookactioncounts: any;
  pendingcounts: any;
  activecount: any;
  inactivecount: any;
  f2fcount: any;
  usvcount: any;
  svcount: any;
  rsvcount: any;
  negocount: any;
  closedcount: any;
  leadreassigning: any;
  // csleadassign = false;
  rmleadassign = false;
  inactivetable = false;
  junkleads: any;
  onlyrm = false;
  onlycs = false;
  rmonly: any;
  csonly: any;
  followupsections: any;
  filterdata = false;
  executivefilterview = false;
  propertyfilterview = false;
  stagefilterview = false;
  stagestatusfilterview = false;
  datefilterview = false;
  execname: any;
  fupsectionname: any;
  selecteduser: any;
  currentDate = new Date();
  todaysdate: any;
  enchanting = false;
  grsitara = false;
  todaystotalcounts: any;
  todayscheduled: number = 0;
  scheduledtoday: any;
  todayscheduledusv: number = 0;
  todayscheduledsv: number = 0;
  todayscheduledrsv: number = 0;
  todayscheduledfn: number = 0;
  overduescounts: number = 0;
  overdueslists: any;
  upcomingvisits: any;
  upcomingfollowups: any;
  overdue: any;
  notinterested: any;
  interested: any;
  inprogress: any;
  booked: number = 0;
  bookingrequest: any;
  rejected: any;
  retailmoved: any;
  junk = true;
  propertyparam: any;
  todaysscheduledparam: any;

  todaysvisitedparam: any;
  yesterdaysvisitedparam: any;
  allvisitparam: any;

  upcomingvisitparam: any;
  upcomingfollowupparam: any;
  overdueparam: any;
  junkparam: any;
  bookedparam: any;
  bookingreqparam: any;
  rejectreqparam: any;
  retailmovedparam: any;

  inprogressparam: any;
  interestedparam: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdaysdateforcompare: any;
  tomorrowsdateforcompare: any;
  activitypage: Boolean;
  allvisittracks: Boolean;
  filterview: Boolean;
  stagevalue: any;
  stagestatusval: any;
  stagestatusvaltext: any;
  stagestatus = false;
  retailmovelink = false;
  username: any;
  datecustomfetch: any = 'CUSTOM';
  directteamfound: Boolean;
  onlyadmin: Boolean;
  adminandexec: Boolean;
  rangeDates: Date[] | undefined;
  isScheldue: boolean = false;
  isOverdue: boolean = false;
  withoutQueryParams$: Observable<boolean>;
  dateRange: Date[];
  roleid: any;
  userid: any;
  sourceList: any;
  copyofsources: any;
  source: any;
  sourceFilter: boolean = false;
  mandateCounts: number = 0;
  retailCounts: number = 0;
  mandateUsvCounts: number = 0;
  retailUsvCounts: number = 0;
  mandateRsvCounts: number = 0;
  retailRsvCounts: number = 0;
  mandateFnCounts: number = 0;
  retailFnCounts: number = 0;
  retailSvCounts: number = 0;
  mandateBookingRequestCounts: number = 0;
  retailBookingRequestCounts: number = 0;
  mandateRejectedCounts: number = 0;
  mandateClosedCounts: number = 0;
  retailClosedCounts: number = 0;
  mandateJunkVisitsCounts: number = 0;
  retailJunkVisitsCounts: number = 0;
  mandatePercentage: any;
  retailPercentage: any;
  mandateUSVPercentage: any;
  retailUSVPercentage: any;
  mandateRSVPercentage: any;
  retailRSVPercentage: any;
  mandateFNPercentage: any;
  retailFNPercentage: any;
  mandateClosedPercentage: any;
  retailClosedPercentage: any;
  mandateBReqPercentage: any;
  retailBReqPercentage: any;
  mandateRejectedPercentage: any;
  retailRejectedPercentage: any;
  mandateJunkPercentage: any;
  retailJunkPercentage: any;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.username = localStorage.getItem('Name');
    if (this.roleid == '1' || this.roleid == '2') {
      this.onlyadmin = true;
    }

    if (this.userid == '40007') {
      this.adminandexec = true;
    } else if (this.userid == '40037') {
      this.adminandexec = true;
    } else if (this.userid == '40045') {
      this.adminandexec = true;
    } else if (this.userid == '40050') {
      this.adminandexec = true;
    } else if (this.userid == '40043') {
      this.adminandexec = true;
    } else if (this.userid == '1') {
      this.adminandexec = true;
    } else {
      this.adminandexec = false;
    }

    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    // *********************load the required template files*********************
    let node1: any = document.createElement('link');
    node1.setAttribute('href', 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700');
    node1.rel = 'stylesheet';
    node1.type = 'text/css';
    node1.id = "dashboard_dynamic_links_1";
    document.getElementsByTagName('head')[0].appendChild(node1);

    let node2: any = document.createElement('link');
    node2.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons+Round');
    node2.rel = 'stylesheet';
    node2.type = 'text/css';
    node2.id = "dashboard_dynamic_links_2";
    document.getElementsByTagName('head')[0].appendChild(node2);

    let node3: any = document.createElement('link');
    node3.setAttribute('href', 'https://lead247.in/assets/css/material-dashboard.css?v=3.0.0');
    node3.rel = 'stylesheet';
    node3.type = 'text/css';
    node3.id = "dashboard_material_css";
    document.getElementsByTagName('head')[0].appendChild(node3);

    let node5: any = document.createElement('script');
    node5.src = 'https://cdn.jsdelivr.net/momentjs/latest/moment.min.js';
    node5.type = 'text/javascript';
    node5.async = true;
    node5.charset = 'utf-8';
    node5.id = "dashboard_dynamic_links_5";
    document.getElementsByTagName('head')[0].appendChild(node5);

    let node6: any = document.createElement('script');
    node6.src = 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js';
    node6.type = 'text/javascript';
    node6.charset = 'utf-8';
    node6.id = "dashboard_dynamic_links_6";
    document.getElementsByTagName('head')[0].appendChild(node6);

    let node7: any = document.createElement('link');
    node7.setAttribute('href', 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css');
    node7.rel = 'stylesheet';
    node7.type = 'text/css';
    node7.id = "dashboard_dynamic_links_7";
    document.getElementsByTagName('head')[0].appendChild(node7);

    // *********************load the required template files*********************

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
    setTimeout(() => {
      let currentDate = new Date();
      this.rangeDates = [currentDate]
    }, 100)
    this.getleadsdata();
    this.getsourcelist();

    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }

    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
    ExecutiveDashboardComponent.count = 0;
    ExecutiveDashboardComponent.activecount = 0;
    ExecutiveDashboardComponent.followupscount = 0;
    ExecutiveDashboardComponent.reassignedcount = 0;
    ExecutiveDashboardComponent.closedcount = 0;

    this.withoutQueryParams$ = this.route.queryParams.pipe(
      map(params => Object.keys(params).length === 0)
    );
  }

  onDateRangeSelected(range: Date[]): void {
    this.dateRange = range;
    // Convert the first date of the range to yyyy-mm-dd format
    if (this.dateRange != null) {
      let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
      this.fromdate = formattedFromDate;
      this.todate = formattedToDate
      if ((formattedFromDate != '' && formattedFromDate != undefined && formattedFromDate != null) && (formattedToDate != '' && formattedToDate != undefined && formattedToDate != null)) {
        setTimeout(() => {
          this.customNavigation(formattedFromDate, formattedToDate)
        }, 1000)
      }
    }
  }

  customNavigation(fromdate, todate) {
    this.router.navigate(['/visit-dashboard'], {
      queryParams: {
        allvisits: '1',
        from: fromdate,
        to: todate,
        dashtype: 'dashboard',
        type: this.dashBoardType
      }
    });
    // this.batch1trigger();
  }

  refresh() {
    this.source = '';
    setTimeout(() => {
      $('#sourcelist_dropdown').dropdown('clear');
    }, 0)
    this.router.navigate(['/visit-dashboard'], {
      queryParams: {
        allvisits: 1,
        from: '',
        to: '',
        dashtype: 'dashboard',
        source: ''
      }
    });
  }

  datePicker() {
    setTimeout(() => {
      this.dateRange = [this.currentdateforcompare]
      $("bs-daterangepicker-container").addClass("newDashBoardDatePicker");
      $("bs-daterangepicker-container").attr("id", "newDashBoardDatePicker");
    }, 100)
  }

  ngOnDestroy() {
    let element1 = document.getElementById('dashboard_dynamic_links_1');
    let element2 = document.getElementById('dashboard_dynamic_links_2');
    let element3 = document.getElementById('dashboard_material_css');
    let element5 = document.getElementById('dashboard_dynamic_links_5');
    let element6 = document.getElementById('dashboard_dynamic_links_6');
    if(element1){
      element1.parentNode.removeChild(element1);
    }
    if(element2){
      element2.parentNode.removeChild(element2);
    }
    if(element3){
      element3.parentNode.removeChild(element3);
    }
    if(element5){
      element5.parentNode.removeChild(element5);
    }
    if(element6){
      element6.parentNode.removeChild(element6);
    }
    $("bs-daterangepicker-container").removeAttr('style')
    this.hoverSubscription.unsubscribe();
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

  ngAfterViewInit() {
    setTimeout(() => {
    this.initializeNextActionDateRangePicker();
  },0);
  }


  close() {
    $('.modalclick').removeClass('modal-backdrop');
    $('.modalclick').removeClass('fade');
    $('.modalclick').removeClass('show');
    document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
  }

  getleadsdata() {
    ExecutiveDashboardComponent.count = 0;
    this.route.queryParams.subscribe((paramss) => {
      this.filterLoader = true;
      // Updated Using Strategy
      this.todaysvisitedparam = paramss['todayvisited'];
      this.yesterdaysvisitedparam = paramss['yesterdayvisited'];
      this.allvisitparam = paramss['allvisits'];
      this.stagevalue = paramss['stage'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.stagestatusval = paramss['stagestatus'];
      this.dashBoardType = paramss['type'];
      this.source = paramss['source'];
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0);

      if (this.fromdate || this.todate) {
        $("#fromdate").val(this.fromdate);
        $("#todate").val(this.todate);
      } else {
      }

      if (this.todaysvisitedparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.clicked = false;
        this.clicked1 = true;
        this.clicked2 = false;
        var curmonth = this.currentDate.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentDate.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

        this.fromdate = this.todaysdate;
        this.todate = this.todaysdate;
        this.batch1trigger();
      } else if (this.yesterdaysvisitedparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = true;

        this.fromdate = this.yesterdaysdateforcompare;
        this.todate = this.yesterdaysdateforcompare;
        this.batch1trigger();
      } else if (this.allvisitparam == '1') {
        this.batch1trigger();
        this.clicked = true;
        this.clicked1 = false;
        this.clicked2 = false;
      }
    });
  }

  //here we get the source list
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

  //mandate counts method
  batch1trigger() {

    if (this.fromdate == "" && this.todate == "" || this.fromdate == undefined && this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    //mandate  all visists data.....
    var rallvisits = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: 'allvisits',
      stage: this.stagevalue,
      stagestatus: '3',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._retailservice.assignedLeadsCount(rallvisits).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.retailTotalCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.retailCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.calculateTotalCount();
      }
    });

    //retail all visists data
    var mparamcount = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: 'allvisits',
      stage: this.stagevalue,
      stagestatus: '3',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._mandateservice.assignedLeadsCount(mparamcount).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.mandateTotalCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.mandateCounts = compleads.AssignedLeads[0].Uniquee_counts;
        this.calculateTotalCount();
      }
    });

    //mandate usv counts  fetch
    var musvpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'USV',
      stagestatus: '3',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._mandateservice.assignedLeadsCount(musvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.mandateTotalUsvCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.mandateUsvCounts = compleads.AssignedLeads[0].Uniquee_counts;
        this.calculateUSVCount();
      } else {
        this.mandateTotalUsvCounts = 0;
      }
    });
    //usv counts  fetch

    //retail usv counts  fetch
    var rusvpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'USV',
      stagestatus: '3',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._retailservice.assignedLeadsCount(rusvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.retailTotalUsvCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.retailUsvCounts = compleads.AssignedLeads[0].Uniquee_counts;
        this.calculateUSVCount();
      } else {
        this.retailTotalUsvCounts = 0;
      }
    });
    //usv counts  fetch

    //mandate rsv counts  fetch
    var mrsvpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'RSV',
      stagestatus: '3',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._mandateservice.assignedLeadsCount(mrsvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.mandateTotalRsvCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.mandateRsvCounts = compleads.AssignedLeads[0].Uniquee_counts;
        this.calculateRSVCount();
      } else {
        this.mandateTotalRsvCounts = 0;
      }
    });
    //rsv counts  fetch

    //retail rsv counts  fetch
    var rrsvpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'RSV',
      stagestatus: '3',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._retailservice.assignedLeadsCount(rrsvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.retailTotalRsvCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.retailRsvCounts = compleads.AssignedLeads[0].Uniquee_counts;
        this.calculateRSVCount();
      } else {
        this.retailTotalRsvCounts = 0;
      }
    });
    //rsv counts  fetch

    //mandate fn counts  fetch
    var mfnpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Final Negotiation',
      stagestatus: '3',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._mandateservice.assignedLeadsCount(mfnpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.mandateTotalFnCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.mandateFnCounts = compleads.AssignedLeads[0].Uniquee_counts;
        this.calculateFNCount();
      } else {
        this.mandateTotalFnCounts = 0;
      }
    });
    //fn counts  fetch

    //retail fn counts  fetch
    var rfnpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Final Negotiation',
      stagestatus: '3',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._retailservice.assignedLeadsCount(rfnpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.retailTotalFnCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.retailFnCounts = compleads.AssignedLeads[0].Uniquee_counts;
        this.calculateFNCount();
      } else {
        this.retailTotalFnCounts = 0;
      }
    });
    //fn counts  fetch

    //mandate booking request counts  fetch
    var mbookingRequestpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Deal Closing Requested',
      stagestatus: '',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._mandateservice.assignedLeadsCount(mbookingRequestpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.mandateTotalBookingRequestCounts = parseInt(compleads.AssignedLeads[0].counts);
        this.mandateBookingRequestCounts = compleads.AssignedLeads[0].counts;
        this.calculateBookingReqCount();
      } else {
        this.mandateTotalBookingRequestCounts = 0;
      }
    });
    //booking request  fetch

    //retail booking request counts  fetch
    var rbookingRequestpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Deal Closing Requested',
      stagestatus: '',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._retailservice.assignedLeadsCount(rbookingRequestpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.retailTotalBookingRequestCounts = parseInt(compleads.AssignedLeads[0].counts);
        this.retailBookingRequestCounts = compleads.AssignedLeads[0].counts;
        this.calculateBookingReqCount();
      } else {
        this.retailTotalBookingRequestCounts = 0;
      }
    });
    //booking request  fetch

    //mandate rejected count fetch
    var mbookingRejpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Closing Request Rejected',
      stagestatus: '',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._mandateservice.assignedLeadsCount(mbookingRejpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.mandateTotalRejectedCounts = parseInt(compleads.AssignedLeads[0].counts);
        this.mandateRejectedCounts = compleads.AssignedLeads[0].counts;
        this.calculateRejectedCount();
      } else {
        this.mandateTotalRejectedCounts = 0;
      }
    });
    //rejected count fetch

    //retail rejected count fetch
    var rbookingRejpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Closing Request Rejected',
      stagestatus: '',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._retailservice.assignedLeadsCount(rbookingRejpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.retailTotalRejectedCounts = parseInt(compleads.AssignedLeads[0].counts);
        this.retailRejectedCounts = compleads.AssignedLeads[0].counts;
        this.calculateRejectedCount();
      } else {
        this.retailTotalRejectedCounts = 0;
      }
    });
    //rejected count fetch

    //mandate booked counts  fetch
    var mbookedpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Deal Closed',
      stagestatus: '',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._mandateservice.assignedLeadsCount(mbookedpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.mandateTotalClosedCounts = parseInt(compleads.AssignedLeads[0].counts);
        this.mandateClosedCounts = compleads.AssignedLeads[0].counts;
        this.calculateClosedCount();
      } else {
        this.mandateTotalClosedCounts = 0;
      }
    });
    //booked counts fetch

    //retail booked counts  fetch
    var rbookedpar = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Deal Closed',
      stagestatus: '',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._retailservice.assignedLeadsCount(rbookedpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.retailTotalClosedCounts = parseInt(compleads.AssignedLeads[0].counts);
        this.retailClosedCounts = compleads.AssignedLeads[0].counts;
        this.calculateClosedCount();
      } else {
        this.retailTotalClosedCounts = 0;
      }
    });
    //booked counts fetch

    //mandate here i get the junk visits counts
    let stagestatus1 = ((this.fromdate == undefined || this.fromdate == null || this.fromdate == '') || (this.todate == undefined || this.todate == null || this.todate == '')) ? '' : '3'
    var mjunkvisit = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: 'junkvisits',
      stage: this.stagevalue,
      stagestatus: stagestatus1,
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._mandateservice.assignedLeadsCount(mjunkvisit).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads['status'] == 'True') {
        this.mandateTotalJunkVisitsCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.mandateJunkVisitsCounts = compleads.AssignedLeads[0].Uniquee_counts;
        this.calculateJunkVisitCount();
      } else {
        this.mandateTotalJunkVisitsCounts = 0;
      }
    });

    //retail here i get the junk visits counts
    let stagestatus2 = ((this.fromdate == undefined || this.fromdate == null || this.fromdate == '') || (this.todate == undefined || this.todate == null || this.todate == '')) ? '' : '3'
    var rjunkvisit = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: 'junkvisits',
      stage: this.stagevalue,
      stagestatus: stagestatus2,
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._retailservice.assignedLeadsCount(rjunkvisit).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads['status'] == 'True') {
        this.retailTotalJunkVisitsCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.retailJunkVisitsCounts = compleads.AssignedLeads[0].Uniquee_counts;
        this.calculateJunkVisitCount();
      } else {
        this.retailTotalJunkVisitsCounts = 0;
      }
    });

    //retail this is the count for sv......
    var paramcountsv = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: "SV",
      stagestatus: '3',
      propid: '',
      executid: '',
      loginuser: this.userid,
      team: '',
      source: this.source,
    }
    this._retailservice.assignedLeadsCount(paramcountsv).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads['status'] == 'True') {
        this.retailTotalSvCounts = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.retailSvCounts = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.retailTotalSvCounts = 0;
      }
    });
  }

  // here we get the total count by adding mandate and retail total count 
  calculateTotalCount(): number {
    setTimeout(() => {
      this.calculateTotalPercentage();
    }, 100)
    return this.totalCounts = this.mandateTotalCounts + this.retailTotalCounts;
  }

  // here we get the total count by adding mandate and retail usv total count 
  calculateUSVCount(): number {
    setTimeout(() => {
      this.calculateUsvPercentage();
    }, 100)
    return this.usvCounts = this.mandateTotalUsvCounts + this.retailTotalUsvCounts;
  }

  // here we get the total count by adding mandate and retail rsv total count 
  calculateRSVCount(): number {
    setTimeout(() => {
      this.calculateRsvPercentage();
    }, 100)
    return this.rsvCounts = this.mandateTotalRsvCounts + this.retailTotalRsvCounts;
  }

  // here we get the total count by adding mandate and retail fn total count 
  calculateFNCount(): number {
    setTimeout(() => {
      this.calculateFNPercentage();
    }, 100)
    return this.fnCounts = this.mandateTotalFnCounts + this.retailTotalFnCounts;
  }

  // here we get the total count by adding mandate and retail total junk visit count  
  calculateJunkVisitCount(): number {
    setTimeout(() => {
      this.calculateJunkVisitsPercentage();
    }, 100)
    return this.junkVisitsCounts = this.mandateTotalJunkVisitsCounts + this.retailTotalJunkVisitsCounts;
  }

  // here we get the total count by adding mandate and retail closed total count 
  calculateClosedCount(): number {
    setTimeout(() => {
      this.calculateClosedPercentage();
    }, 100)
    return this.closedCounts = this.mandateTotalClosedCounts + this.retailTotalClosedCounts;
  }

  // here we get the total count by adding mandate and retail booking request total count  
  calculateBookingReqCount(): number {
    setTimeout(() => {
      this.calculateBookingReqPercentage();
    }, 100)
    return this.bookingRequestVisitsCounts = this.mandateTotalBookingRequestCounts + this.retailTotalBookingRequestCounts;
  }

  // here we get the total count by adding mandate and retail rejected total count   
  calculateRejectedCount(): number {
    setTimeout(() => {
      this.calculateRejectedPercentage();
    }, 100)
    return this.rejectedVisitsCounts = this.mandateTotalRejectedCounts + this.retailTotalRejectedCounts;
  }

  // here we calculate the percentage for mandate retail total 
  calculateTotalPercentage() {
    this.mandatePercentage = (this.mandateCounts / this.totalCounts) * 100;
    this.retailPercentage = (this.retailCounts / this.totalCounts) * 100;
  }

  // here we calculate the percentage for mandate retail usv graph 
  calculateUsvPercentage() {
    this.mandateUSVPercentage = (this.mandateUsvCounts / this.usvCounts) * 100;
    this.retailUSVPercentage = (this.retailUsvCounts / this.usvCounts) * 100;
  }

  // here we calculate the percentage for mandate retail rsv graph 
  calculateRsvPercentage() {
    this.mandateRSVPercentage = (this.mandateRsvCounts / this.rsvCounts) * 100;
    this.retailRSVPercentage = (this.retailRsvCounts / this.rsvCounts) * 100;
  }

  // here we calculate the percentage for mandate retail fn graph 
  calculateFNPercentage() {
    this.mandateFNPercentage = (this.mandateFnCounts / this.fnCounts) * 100;
    this.retailFNPercentage = (this.retailFnCounts / this.fnCounts) * 100;
  }

  // here we calculate the percentage for mandate retail closed graph 
  calculateClosedPercentage() {
    this.mandateClosedPercentage = (this.mandateClosedCounts / this.closedCounts) * 100;
    this.retailClosedPercentage = (this.retailClosedCounts / this.closedCounts) * 100;
  }

  // here we calculate the percentage for mandate retail booking request graph 
  calculateBookingReqPercentage() {
    this.mandateBReqPercentage = (this.mandateBookingRequestCounts / this.bookingRequestVisitsCounts) * 100;
    this.retailBReqPercentage = (this.retailBookingRequestCounts / this.bookingRequestVisitsCounts) * 100
  }

  // here we calculate the percentage for mandate retail rejected graph 
  calculateRejectedPercentage() {
    this.mandateRejectedPercentage = (this.mandateRejectedCounts / this.rejectedVisitsCounts) * 100;
    this.retailRejectedPercentage = (this.retailRejectedCounts / this.rejectedVisitsCounts) * 100;
  }

  // here we calculate the percentage for mandate retail junkvisits graph 
  calculateJunkVisitsPercentage() {
    this.mandateJunkPercentage = (this.mandateJunkVisitsCounts / this.junkVisitsCounts) * 100;
    this.retailJunkPercentage = (this.retailJunkVisitsCounts / this.junkVisitsCounts) * 100;
  }

  sourcechange(vals) {
    ExecutiveDashboardComponent.closedcount = 0;
    ExecutiveDashboardComponent.count = 0;
    this.filterLoader = true;
    this.source = vals.target.value;
    this.router.navigate([], {
      queryParams: {
        source: this.source
      },
      queryParamsHandling: 'merge',
    });
  }

  dateclose() {
    ExecutiveDashboardComponent.closedcount = 0;
    ExecutiveDashboardComponent.count = 0;
    this.datefilterview = false;
    $('#fromdate').val("");
    $('#todate').val("");
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

  backToWelcome() {
    $('.modal-backdrop').closest('div').remove();
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
    this._echoService.disconnectSocket();

  }
  
  //this is triggered when custom is clicked to select the dates.
  initializeNextActionDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#nextActionDates span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
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
        this.router.navigate([], {
          queryParams: {
            allvisits: '1',
            from: this.fromdate,
            to: this.todate,
            dashtype: 'dashboard',
            type: this.dashBoardType
          },
          // queryParamsHandling: 'merge',
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

    $('#nextActionDates').daterangepicker({
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
    cb(this.nextActionStart, this.nextActionEnd);
  }
}

export function convert(str) {
  var mnths = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12"
  },
    date = str.split(" ");

  return [date[3], mnths[date[1]], date[2]].join("-");
}


