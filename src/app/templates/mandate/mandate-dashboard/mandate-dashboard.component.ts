import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { mandateservice } from '../../../mandate.service';
import { sharedservice } from '../../../shared.service';
import * as moment from 'moment';
import { MandateClassService } from '../../../mandate-class.service';
import { CdTimerComponent } from 'angular-cd-timer';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-dashboard',
  templateUrl: './mandate-dashboard.component.html',
  styleUrls: ['./mandate-dashboard.component.css']
})

export class MandateDashboardComponent implements OnInit {

  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private _mandateService: mandateservice, private _sharedservice: sharedservice, public datepipe: DatePipe, private _mandateClassService: MandateClassService,) {
    if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
      this.router.navigateByUrl('/login');
    };
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
      $('.ui.label.fluid.dropdown').dropdown({
        useLabels: false
      });
    }, 1000);
    this.route.queryParams.subscribe((data) => {
      this.routeparams = data;
      this.mandateGetData();
    });
  }

  @ViewChild('CheckInBasicTimer') CheckInBasicTimer: CdTimerComponent;
  // @ViewChild('basicTimer') basicTimer: CdTimerComponent;

  private isCountdownInitialized: boolean;
  filterLoader: boolean = true;
  routeparams: any;
  fromdate: any;
  todate: any;
  rmid: any;
  execid: any;
  propertyid: any;
  propertyname: any;
  team: any;
  assignedleadstable = true;
  tookactiontable = false;
  static count: number;
  static closedcount: number;
  executives: any;
  totalcounts: number = 0;
  totalusvcounts: number = 0;
  totalrsvcounts: number = 0;
  junkusvcounts: number = 0;
  junkrsvcounts: number = 0;
  allcountsloadmore: number = 0;
  closedcount: any;
  filterdata = false;
  execname: any;
  currentDate = new Date();
  todaysdate: any;
  todayscheduled: number = 0;
  scheduledtoday: any;
  todayscheduledusv: number = 0;
  todayscheduledrsv: number = 0;
  todayscheduledfn: number = 0;
  overduescounts: number = 0;
  overdueslists: any;
  booked: number = 0
  todaysscheduledparam: any;
  todaysvisitedparam: any;
  yesterdaysvisitedparam: any;
  last7param: any;
  allvisitparam: any;
  upcomingvisitparam: any;
  upcomingfollowupparam: any;
  overdueparam: any;
  bookedparam: any;
  inprogressparam: any;
  interestedparam: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdayDateStore: any;
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
  datecustomfetch: any;
  directteamfound: Boolean;
  onlyadmin: Boolean;
  adminandexec: Boolean;
  withoutQueryParams$: Observable<boolean>;
  dateRange: Date[];
  mandateprojects: any;
  executiveTodayInfo: any;
  executiveOverdueInfo: any;
  copyOfExecutiveOverdueInfo: any;
  mandateexecutives: any;
  roleid: any;
  userid: any;
  departid: any;
  totalLeadsCount: any = 0;
  pendingLeadsCount: any = 0;
  overAllAssignedCounts: any;
  dashboardsCounts: any;
  mandateTotalcounts: number = 0;
  allVisitsTotalcounts: number = 0;
  bookingrequest: number = 0;
  bookedLeads: number = 0;
  allscheduledfn: number = 0;
  allscheduledrsv: number = 0;
  allscheduledusv: number = 0;
  allschedulednc: number = 0;
  usvfixcount: number = 0;
  hotColdWarmCount: number = 1;
  leadName: string = 'Total Leads';
  hcwLeadsCount: any;
  leadsCount: number = 0;
  hcwExecutiveCounts: any;
  isExecutive: boolean = false;
  isTLExec: boolean = false;
  checked: boolean = true;
  rejected: number = 0;
  timerInfo = '';
  timerstarted: boolean = false;
  totalBreakTime: any;
  role_type: any;
  mandateProject_ID: any;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  weeknextActionStart: moment.Moment | null = null;
  weeknextActionEnd: moment.Moment | null = null;
  isCheckIn: boolean = true;
  checkinstartTime: any;
  roleTeam: any = '';
  followupsoverduesCount: number = 0;
  ncOverduesCount: number = 0;
  usvFixOverduesCount: number = 0;
  usvOverduesCount: number = 0;
  rsvOverduesCount: number = 0;
  fnOverduesCount: number = 0;
  dealPendingOverduesCount: number = 0;
  dealRequestedOverduesCount: number = 0;
  isLoading: boolean = true;
  dashtype: string = '';
  segments = 6;
  weekData = [
    { label: 'Assigned', value: 0, total: 0, color: 'blue', type: 'solid', bgColor: '#F1F9FF', labelColor: '#005B8B', },
    { label: 'Active', value: 0, total: 0, color: 'green', type: 'segment', bgColor: '#F3FEE5', labelColor: '#437903', },
    { label: 'Inactive', value: 0, total: 0, color: 'orange', type: 'segment', bgColor: '#FFEFE8', labelColor: '#C53B01', },
    { label: 'Junk', value: 0, total: 0, color: 'red', type: 'segment', bgColor: '#FFF3F3', labelColor: '#B50E0E', }
  ];
  weekDataCal: any[];
  weekendCount: number = 0;
  weekendPlansData: any;
  mainAccountData: any;

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.username = localStorage.getItem('Name');
    this.departid = localStorage.getItem('Department');
    this.role_type = localStorage.getItem('role_type');
    this.mainAccountData = localStorage.getItem('mainAccount');
    this.mandateProject_ID = localStorage.getItem('property_ID');
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
    this.getleadsdata();
    if (this.roleid != 1 && this.roleid != 2) {
      this.getListOfCheckedIn();
    }

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    // Todays Date

    // Tomorrows Date
    var tomorrow = this.currentdateforcompare.getDate() + 1;
    var tomorrowwithzero = tomorrow.toString().padStart(2, "0");
    this.tomorrowsdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + tomorrowwithzero;
    // Tomorrows Date

    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }
    if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
      this.tookactiontable = true;
      this.assignedleadstable = false;
    } else if (localStorage.getItem('Role') == '50002') {

      this.rmid = localStorage.getItem('UserId');

    } else {
      this.tookactiontable = false;
      this.assignedleadstable = true;
    }

    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
    MandateDashboardComponent.count = 0;
    MandateDashboardComponent.closedcount = 0;

    this.withoutQueryParams$ = this.route.queryParams.pipe(
      map(params => Object.keys(params).length === 0)
    );
    this.mandateprojectsfetch();
    this.checkRoleAccess();

    this.planSelectedTime('last7')
  }

  calculateSegments(value: number, total: number): number {
    if (total === 0) return 0;

    const ratio = value / total;
    const segments = Math.round(ratio * this.segments);

    // ensure it never exceeds limits
    return Math.min(this.segments, Math.max(0, segments));
  }


  checkRoleAccess() {
    let teamlead;
    if (this.role_type == 1) {
      teamlead = this.userid
    } else {
      teamlead = '';
    }
    if (this.role_type != '1') {
      // this.roleid == '50002' || this.roleid == '50010' 
      this.isExecutive = true;
    } else if (this.role_type == '1') {
      // this.roleid == '50009' || this.roleid == '50001' ||
      this.isTLExec = true;
      this._mandateService.fetchmandateexecutuves(this.mandateProject_ID, '', this.roleTeam, teamlead).subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateexecutives = executives['mandateexecutives'];
        }
      })
    }
  }

  // onDateRangeSelected(range: Date[]): void {
  //   this.dateRange = range;
  //   // Convert the first date of the range to yyyy-mm-dd format
  //   if (this.dateRange != null || this.dateRange != undefined) {
  //     let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
  //     let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
  //     if ((formattedFromDate == '' || formattedFromDate == undefined) || (formattedToDate == '' || formattedToDate == undefined)) {
  //       this.fromdate = '';
  //       this.todate = ''
  //     } else {
  //       this.fromdate = formattedFromDate;
  //       this.todate = formattedToDate;
  //       this.filterLoader = true;
  //       setTimeout(() => {
  //         this.customNavigation(formattedFromDate, formattedToDate)
  //       }, 1000)
  //     }
  //   }
  // }

  // customNavigation(fromdate, todate) {
  //   this.router.navigate(['/mandate-dashboard'], {
  //     queryParams: {
  //       allvisits: 1,
  //       from: fromdate,
  //       to: todate,
  //       property: this.propertyid,
  //       propname: this.propertyname,
  //       execid: this.execid,
  //       execname: this.execname,
  //       stage: this.stagevalue,
  //       stagestatus: this.stagestatusval,
  //       team: this.team,
  //       dashtype: 'dashboard',
  //       htype: 'mandate'
  //     }
  //   });
  // }

  // datePicker() {
  //   setTimeout(() => {
  //     this.dateRange = [this.currentdateforcompare];
  //     $("bs-daterangepicker-container").addClass("newDashBoardDatePicker");
  //     $("bs-daterangepicker-container").attr("id", "newDashBoardDatePicker");
  //   }, 100)
  // }

  ngOnDestroy() {
    let element1 = document.getElementById('dashboard_dynamic_links_1');
    let element2 = document.getElementById('dashboard_dynamic_links_2');
    let element3 = document.getElementById('dashboard_material_css');
    let element5 = document.getElementById('dashboard_dynamic_links_5');
    let element6 = document.getElementById('dashboard_dynamic_links_6');
    if (element1) {
      element1.parentNode.removeChild(element1);
    }
    if (element2) {
      element2.parentNode.removeChild(element2);
    }
    if (element3) {
      element3.parentNode.removeChild(element3);
    }
    if (element5) {
      element5.parentNode.removeChild(element5);
    }
    if (element6) {
      element6.parentNode.removeChild(element6);
    }
    $("bs-daterangepicker-container").removeAttr('style');
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        if (this.roleid == 1 || this.roleid == '2') {
          this.mandateprojects = mandates['Properties'];
        } else {
          this.mandateprojects = mandates['Properties'];
          let property = localStorage.getItem('property_ID');
          let splitProperty = property.split(',');

          this.mandateprojects = this.mandateprojects.filter((data) =>
            splitProperty.some((id) => data.property_idfk == id)
          );
        }
      }
    });
  }

  calculateDiff(sentDate) {
    if (sentDate) {
      var date1: any = new Date(sentDate);
      var date2: any = new Date();
      var diffDays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
      return diffDays;
    } else {
      return undefined;
    }
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
      this.initializeWeekplanNextActionDateRangePicker();
    }, 0);
  }

  getmandateExecutives(prop) {
    let teamlead;
    if (this.role_type == 1) {
      teamlead = this.userid
    } else {
      teamlead = '';
    }
    let propid = prop == undefined ? '' : prop;
    this._mandateService.fetchmandateexecutuves(propid, '', this.roleTeam, teamlead).subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      } else {
        this.mandateexecutives = [];
      }
    });
  }

  getranavmandateExecutives(prop) {
    let propid = prop == undefined ? '' : prop;
    this._mandateService.getExecutivesForRanav(propid, '', this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      } else {
        this.mandateexecutives = [];
      }
    });
  }

  getleadsdata() {
    if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    }
    this.filterLoader = true;
    MandateDashboardComponent.count = 0;
    this.route.queryParams.subscribe((paramss) => {
      // Updated Using Strategy
      this.todaysvisitedparam = paramss['todayvisited'];
      this.yesterdaysvisitedparam = paramss['yesterdayvisited'];
      this.allvisitparam = paramss['allvisits'];
      this.last7param = paramss['last7'];
      this.propertyid = paramss['property'];
      this.propertyname = paramss['propname'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.stagevalue = paramss['stage'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.stagestatusval = paramss['stagestatus'];
      this.team = paramss['team'];
      this.roleTeam = paramss['role'];
      this.dashtype = paramss['type'];
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.initializeWeekplanNextActionDateRangePicker();
      }, 0);

      if ((this.propertyid == '' || this.propertyid == undefined || this.propertyid == null) && (this.roleid == 1 || this.roleid == 2)) {
        // this.propertyid = '16793';
        // this.propertyname = 'GR Sitara';
      }

      if ((this.roleid == 1 || this.roleid == '2') && paramss['crm'] != '2') {
        this.getmandateExecutives(this.propertyid);
      };

      if (paramss['crm'] == 2) {
        this.getranavmandateExecutives(this.propertyid);
      }

      if (this.execid) {
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
          this.rmid = this.execid;
        } else {
          this.rmid = this.execid;
        }
      } else {
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == 1) {
          this.rmid = "";
          this.execid = '';
          $('#rm_dropdown').dropdown('clear');
        } else {
          this.rmid = localStorage.getItem('UserId');
          this.execid = '';
          $('#rm_dropdown').dropdown('clear');
        }
      }

      if (this.stagevalue) {
        if (this.stagevalue == "USV") {
          this.stagestatus = false;
          this.stagestatusval = "";
        } else {
          this.stagestatus = true;
          $("#option-4").prop("checked", false);
          $("#option-5").prop("checked", false);
          $("#option-6").prop("checked", false);
        }
      } else {
      }

      if ((this.fromdate == '' || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined)) {
        $("#fromdate").val('');
        $("#todate").val('');
        this.fromdate = '';
        this.todate = '';
      } else {
        $("#fromdate").val(this.fromdate);
        $("#todate").val(this.todate);
      }

      if (this.stagestatusval) {
        if (this.stagestatusval == '1') {
          this.stagestatusvaltext = "Fixed";
        } else if (this.stagestatusval == '2') {
          this.stagestatusvaltext = "Refixed";
        } else if (this.stagestatusval == '3') {
          this.stagestatusvaltext = "Done";
        }
      }

      if (this.todaysvisitedparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.activitypage = true;
        this.allvisittracks = false;
        this.retailmovelink = false;
        this.clicked = false;
        this.clicked1 = true;
        this.clicked2 = false;
        this.clicked3 = false;
        this.filterLoader = true;
        if (this.roleid == '1' || this.roleid == '2') {
          this.filterview = true;
        } else {
          this.filterview = false;
        }
        var curmonth = this.currentDate.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentDate.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

        this.fromdate = this.todaysdate;
        this.todate = this.todaysdate;
        this.batch2trigger();
        this.getOverallCounts();
        this.getHotColdWarmCount(this.propertyid, 1, this.fromdate, this.todate);
        // if ((this.roleid != '1' && this.roleid != '2') || (this.execid != '' && this.execid != undefined && this.execid != null)) {
        if (this.dashtype == 'visits') {
          this.batch1trigger();
        }
      } else if (this.yesterdaysvisitedparam == '1') {
        // Yesterdays Date
        const yesterday = () => {
          this.currentdateforcompare = new Date();
          this.currentdateforcompare.setDate(this.currentdateforcompare.getDate() - 1);
          return this.currentdateforcompare;
        };
        this.yesterdayDateStore = yesterday().toISOString().split('T')[0];
        // // Yesterdays Date
        this.fromdate = "";
        this.todate = "";
        this.activitypage = true;
        this.allvisittracks = false;
        this.retailmovelink = false;
        this.clicked = false;
        this.clicked1 = false;
        this.clicked3 = false;
        this.clicked2 = true;
        this.filterLoader = true;
        if (this.roleid == '1' || this.roleid == '2') {
          this.filterview = true;
        } else {
          this.filterview = false;
        }

        this.fromdate = this.yesterdayDateStore;
        this.todate = this.yesterdayDateStore;
        this.filterLoader = true;
        this.batch2trigger();
        this.getOverallCounts();
        this.getHotColdWarmCount(this.propertyid, 1, this.fromdate, this.todate);
        // if ((this.roleid != '1' && this.roleid != '2') || (this.execid != '' && this.execid != undefined && this.execid != null)) {
        if (this.dashtype == 'visits') {
          this.batch1trigger();
        }
      } else if (this.last7param == '1') {
        this.fromdate = "";
        this.todate = "";
        this.activitypage = true;
        this.allvisittracks = false;
        this.retailmovelink = false;
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = true;
        this.filterLoader = true;
        if (this.roleid == '1' || this.roleid == '2') {
          this.filterview = true;
        } else {
          this.filterview = false;
        }
        this.currentdateforcompare = new Date();
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, '0');
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, '0');
        this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
        //getting the date of the -6days
        var sevendaysago = new Date(this.currentdateforcompare);
        sevendaysago.setDate(sevendaysago.getDate() - 6);
        var sevendaysmonth = sevendaysago.getMonth() + 1;
        var sevendaysmonthwithzero = sevendaysmonth.toString().padStart(2, "0");
        var sevendays = sevendaysago.getDate();
        var sevendayswithzero = sevendays.toString().padStart(2, "0");
        let sevendaysdateforcompare = sevendaysago.getFullYear() + "-" + sevendaysmonthwithzero + "-" + sevendayswithzero;
        this.fromdate = sevendaysdateforcompare;
        this.todate = this.todaysdateforcompare;

        this.batch2trigger();
        this.getOverallCounts();
        this.getHotColdWarmCount(this.propertyid, 1, this.fromdate, this.todate);
        // if ((this.roleid != '1' && this.roleid != '2') || (this.execid != '' && this.execid != undefined && this.execid != null)) {
        if (this.dashtype == 'visits') {
          this.batch1trigger();
        }
      } else if (this.allvisitparam == '1') {
        this.filterLoader = true;
        this.batch2trigger();
        this.getOverallCounts();
        this.getHotColdWarmCount(this.propertyid, 1, this.fromdate, this.todate);
        // if ((this.roleid != '1' && this.roleid != '2') || (this.execid != '' && this.execid != undefined && this.execid != null)) {
        if (this.dashtype == 'visits') {
          this.batch1trigger();
        }
        this.activitypage = false;
        this.allvisittracks = true;
        this.filterview = true;
        this.retailmovelink = false;
        this.clicked = true;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = false;
      }
      this.getPlansList();
      // Updated Using Strategy
    });
  }

  getPlansList() {
    let leadtype;
    if (this.dashtype == 'leads') {
      leadtype = 1;
    } else if (this.dashtype == 'visits') {
      leadtype = 2;
    }

    var paramcount = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      leadvisit: leadtype
    }
    this._mandateService.planLeadsCount(paramcount).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.weekendCount = compleads.result[0].uniquee_count;
      } else {
        this.weekendCount = 0;
      }
    });

    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      leadvisit: leadtype
    }
    this._mandateService.planLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads.status == 'True') {
        this.weekendPlansData = compleads['result'];
      } else {
        this.weekendPlansData = [];
      }
    });
  }

  //to get the executive today's and overdue data
  batch2trigger() {
    if (this.roleid == '1' || this.roleid == '2') {
      if (this.fromdate == "" && this.todate == "" || this.fromdate == undefined && this.todate == undefined) {
        this.datecustomfetch = "Custom";
      } else {
        this.datecustomfetch = this.fromdate + ' - ' + this.todate;
      }
      // let todayScheldueparam = {
      //   propId: this.propertyid,
      //   fromDate: this.todaysdateforcompare,
      //   todate: this.todaysdateforcompare,
      //   team: this.team,
      //   execId: this.execid,
      //   role: this.roleTeam
      // }
      // Todays Scheduled  Fetch
      // this._mandateService.getExecutiveScheldueTodayInfo(todayScheldueparam).subscribe(execInfo => {
      //   this.executiveTodayInfo = execInfo.Dashtotal;
      //   this.executiveTodayInfo = this.executiveTodayInfo.filter((exec) => {
      //     return exec['counts']['0']['All_Visits'] > 0
      //   })
      // })

      let num;
      if (this.dashtype == 'leads') {
        num = 1;
      } else if (this.dashtype == 'visits') {
        num = 2;
      }

      // let quickviewparam = {
      //   propId: this.propertyid,
      //   fromDate: this.fromdate,
      //   todate: this.todate,
      //   team: this.team,
      //   execId: this.execid,
      //   role: this.roleTeam,
      //   leads: num
      // }
      // this._mandateService.getExecutiveInfo(quickviewparam).subscribe(execInfo => {
      //   this.executiveOverdueInfo = execInfo.Dashtotal;
      //   this.executiveOverdueInfo = this.executiveOverdueInfo.filter((ex) => ex.visits_reg_status == '1');
      //   this.copyOfExecutiveOverdueInfo = execInfo.Dashtotal;
      //   this.executiveOverdueInfo = this.executiveOverdueInfo.filter((exec) => {
      //     return exec['counts']['0']['All_Visits'] > 0;
      //   })
      //   if (this.checked == true) {
      //     this.executiveOverdueInfo = this.executiveOverdueInfo.filter((ex) => ex.visits_reg_status == '1');
      //   } else if (this.checked == false) {
      //     this.executiveOverdueInfo = this.copyOfExecutiveOverdueInfo;
      //   }
      // })
    }
  }

  // Updated Using Strategy
  apitrigger() {
    if (this.todaysscheduledparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.allvisittracks = false;
      this.retailmovelink = false;
      if (this.roleid == '1' || this.roleid == '2') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
    } else if (this.todaysvisitedparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.allvisittracks = false;
      this.retailmovelink = false;
      if (this.roleid == '1' || this.roleid == '2') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
    } else if (this.upcomingvisitparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.allvisittracks = false;
      this.retailmovelink = false;
      if (this.roleid == '1' || this.roleid == '2') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
    } else if (this.upcomingfollowupparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.allvisittracks = false;
      this.retailmovelink = false;
      if (this.roleid == '1' || this.roleid == '2') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
    } else if (this.overdueparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.allvisittracks = false;
      this.retailmovelink = false;
      if (this.roleid == '1' || this.roleid == '2') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
    } else if (this.allvisitparam == '1') {
      this.batch2trigger();
      this.getOverallCounts();
      this.activitypage = false;
      this.allvisittracks = true;
      this.filterview = true;
      this.retailmovelink = false;
    } else if (this.inprogressparam == '1') {
      this.batch2trigger();
      this.getOverallCounts();
      this.activitypage = false;
      this.allvisittracks = true;
      this.filterview = true;
      this.retailmovelink = false;
    } else if (this.interestedparam == '1') {
      this.batch2trigger();
      this.getOverallCounts();
      this.activitypage = false;
      this.allvisittracks = true;
      this.filterview = true;
      this.retailmovelink = false;
    } else if (this.bookedparam == '1') {
      this.batch2trigger();
      this.getOverallCounts();
      this.activitypage = false;
      this.allvisittracks = true;
      this.filterview = true;
      this.retailmovelink = false;
    }
  }

  totalAssignedleadcounts: number = 0
  unTouchedleadcounts: number = 0;
  inactivecounts: number = 0;
  followupleadcounts: number = 0;
  visitconvertedcounts: number = 0;
  visitsFixedcounts: number = 0;
  activecounts: number = 0;
  touchedcounts: number = 0;
  junkvisitsCount: number = 0;
  junkleadsCount: number = 0
  //to get the counts of the dashboard.
  getOverallCounts() {
    //A!tesdt
    this.totalAssignedleadcounts = 0;
    this.unTouchedleadcounts = 0;
    this.inactivecounts = 0;
    this.followupleadcounts = 0;
    this.activecounts = 0;
    this.touchedcounts = 0;
    this.allVisitsTotalcounts = 0;
    this.mandateTotalcounts = 0;
    this.junkvisitsCount = 0;
    this.junkleadsCount = 0;
    this.bookingrequest = 0;
    this.bookedLeads = 0;
    this.rejected = 0;
    this.allschedulednc = 0;
    this.usvfixcount = 0;
    this.allscheduledusv = 0;
    this.allscheduledrsv = 0;
    this.allscheduledfn = 0;
    this.todayscheduled = 0;
    this.todayscheduledusv = 0;
    this.todayscheduledrsv = 0;
    this.todayscheduledfn = 0;
    //there is issue if date filter is used then the counts of 2nd row card counts remains the same because in place of take we are sending variable
    //this counts is used for 1st row 
    if (this.fromdate == "" && this.todate == "" || this.fromdate == undefined && this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    let propID;
    if (this.rmid == '40007') {
      propID = ''
    } else {
      propID = this.propertyid;
    }

    if (this.dashtype == 'leads') {

      //this is the count for assigned leads
      var totalleads = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'assignedleads',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        propid: propID,
        executid: this.rmid,
        loginuser: this.userid,
        priority: '',
        team: this.team,
        visits: 2,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(totalleads).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.totalAssignedleadcounts = compleads.AssignedLeads[0].counts;
        } else {
          this.totalAssignedleadcounts = 0;
        }
      });

      //this is the count for untouched
      var pending = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'pending',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: '',
        team: this.team,
        visits: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(pending).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.unTouchedleadcounts = compleads.AssignedLeads[0].counts;
        } else {
          this.unTouchedleadcounts = 0;
        }
      });

      // this is the count for touched
      var touchedparam = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'touched',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        propid: propID,
        executid: this.rmid,
        loginuser: this.userid,
        priority: '',
        team: this.team,
        visits: 2,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(touchedparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.touchedcounts = compleads.AssignedLeads[0].counts;
        } else {
          this.touchedcounts = 0;
        }
      });

      //this is the count for inactive
      var inactive = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        propid: propID,
        executid: this.rmid,
        loginuser: this.userid,
        priority: '',
        team: this.team,
        visits: 2,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(inactive).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.inactivecounts = compleads.AssignedLeads[0].Uniquee_counts;
        } else {
          this.inactivecounts = 0;
        }
      });

      //here i get the junk leads counts
      var junkleads = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkleads',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        priority: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(junkleads).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.junkleadsCount = compleads.AssignedLeads[0].Uniquee_counts;
        } else {
          this.junkleadsCount = 0;
        }
      });

      //this is the count for active
      var activeparam = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'active',
        stage: '',
        stagestatus: '',
        propid: propID,
        executid: this.rmid,
        loginuser: this.userid,
        priority: '',
        team: this.team,
        visits: 2,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(activeparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.activecounts = compleads.AssignedLeads[0].counts;
        } else {
          this.activecounts = 0;
        }
      });

      //this is the count for followups
      var followups = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'generalfollowups',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        propid: propID,
        executid: this.rmid,
        loginuser: this.userid,
        priority: '',
        team: this.team,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
        // visits: 2,
      }
      this._mandateService.assignedLeadsCount(followups).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.followupleadcounts = compleads.AssignedLeads[0].counts;
        } else {
          this.followupleadcounts = 0;
        }
      });

      //this is the count for nc
      var paramcountusv = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: "NC",
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(paramcountusv).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.allschedulednc = compleads.AssignedLeads[0].counts;
        } else {
          this.allschedulednc = 0;
        }
      });

      //this is the count for USV fix
      var paramcountusvfix = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: "USV",
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(paramcountusvfix).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.usvfixcount = compleads.AssignedLeads[0].Uniquee_counts;
          this.filterLoader = false;

          setTimeout(() => {
            this.weekData = [
              { label: 'Assigned', value: this.totalAssignedleadcounts, total: this.totalAssignedleadcounts, color: 'blue', type: 'solid', bgColor: '#F1F9FF', labelColor: 'blue' },
              { label: 'Active', value: this.activecounts, total: this.totalAssignedleadcounts, color: 'green', type: 'segment', bgColor: '#F3FEE5', labelColor: 'green' },
              { label: 'Inactive', value: this.inactivecounts, total: this.totalAssignedleadcounts, color: 'orange', type: 'segment', bgColor: '#FFEFE8', labelColor: 'orange' },
              { label: 'Junk', value: this.junkleadsCount, total: this.totalAssignedleadcounts, color: 'red', type: 'segment', bgColor: '#FFF3F3', labelColor: 'red' }
            ];

            this.weekDataCal = this.weekData.map(d => ({
              ...d,
              activeSegments: d.type === 'segment' ? this.calculateSegments(d.value, d.total) : null
            }));
          }, 100)

        } else {
          this.usvfixcount = 0;
          this.filterLoader = false;
        }
      });

    }

    if (this.dashtype == 'visits') {
      let stagestatus = (this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null) ? '' : '3';

      //this is the count for all visists and second row cards data
      var paramcount1 = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: 'allvisits',
        stage: this.stagevalue,
        stagestatus: stagestatus,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(paramcount1).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.allVisitsTotalcounts = compleads.AssignedLeads[0].Uniquee_counts;
        }
      });

      //this is the count for Active visists and second row cards data
      var paramcount = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: 'activevisits',
        stage: this.stagevalue,
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(paramcount).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.mandateTotalcounts = compleads.AssignedLeads[0].Uniquee_counts;
        }
      });

      //here i get the junk visits counts
      let stagestatus1 = ((this.fromdate == undefined || this.fromdate == null || this.fromdate == '') || (this.todate == undefined || this.todate == null || this.todate == '')) ? '' : '3'
      var junkvisit = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: 'junkvisits',
        stage: this.stagevalue,
        stagestatus: stagestatus1,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        priority: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(junkvisit).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.junkvisitsCount = compleads.AssignedLeads[0].Uniquee_counts;
        } else {
          this.junkvisitsCount = 0;
        }
      });

      //this is the count for booking request
      let bk: any = 'Deal Closing Requested';
      var bookingvisit = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: '',
        stage: bk,
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(bookingvisit).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.bookingrequest = compleads.AssignedLeads[0].Uniquee_counts;
        }
      });

      //this is the counts for closed 
      let dealclosed: any = 'Deal Closed';
      var bookedvisit = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: '',
        stage: dealclosed,
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(bookedvisit).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.bookedLeads = compleads.AssignedLeads[0].Uniquee_counts;
        }
      });

      //this is the count for rejected
      var rejectbooked = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: '',
        stage: 'Closing Request Rejected',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        priority: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(rejectbooked).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.rejected = compleads.AssignedLeads[0].Uniquee_counts;
        } else {
          this.rejected = 0;
        }
      });

      //this is the count for usv done
      var paramcountnc = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: '',
        stage: "USV",
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(paramcountnc).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.allscheduledusv = compleads.AssignedLeads[0].Uniquee_counts;
        } else {
          this.allscheduledusv = 0;
        }
      });

      //this is the count for rsv
      var paramcountrsv = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: '',
        stage: "RSV",
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(paramcountrsv).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.allscheduledrsv = compleads.AssignedLeads[0].Uniquee_counts;
        } else {
          this.allscheduledrsv = 0;
        }
      });

      //this is the count for fn
      var todayscheduledfn = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: '',
        stage: "Final Negotiation",
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(todayscheduledfn).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.allscheduledfn = compleads.AssignedLeads[0].Uniquee_counts;
          this.filterLoader = false;
        } else {
          this.allscheduledfn = 0;
          this.filterLoader = false;
        }
      });

    }


    // let stagestatus: any;

    // if((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)){
    //   stagestatus = '';
    // }else{
    //   stagestatus = '3';
    // }

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    this.todaysdateforcompare = `${year}-${month}-${day}`;

    //this is the count for today's scheldue count  and executive's scheldue table
    // var todayscheduled = {
    //   datefrom: this.todaysdateforcompare,
    //   dateto: this.todaysdateforcompare,
    //   statuss: 'scheduledtoday',
    //   stage: "",
    //   stagestatus: '',
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: '',
    //   role: this.roleTeam,
    //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    // }
    // this._mandateService.assignedLeadsCount(todayscheduled).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.filterLoader = false;
    //     this.todayscheduled = compleads.AssignedLeads[0].Uniquee_counts;
    //   } else {
    //     this.filterLoader = false;
    //     this.todayscheduled = 0;
    //   }
    // });

    //this is the count for today's scheldue usv count
    // var todayscheduledusv = {
    //   datefrom: this.todaysdateforcompare,
    //   dateto: this.todaysdateforcompare,
    //   statuss: 'scheduledtoday',
    //   stage: "USV",
    //   stagestatus: '',
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: '',
    //   role: this.roleTeam,
    //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    // }
    // this._mandateService.assignedLeadsCount(todayscheduledusv).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.todayscheduledusv = compleads.AssignedLeads[0].Uniquee_counts;
    //   } else {
    //     this.todayscheduledusv = 0;
    //   }
    // });

    // //this is the count for rsv
    // var todayscheduledrsv = {
    //   datefrom: this.todaysdateforcompare,
    //   dateto: this.todaysdateforcompare,
    //   statuss: 'scheduledtoday',
    //   stage: "RSV",
    //   stagestatus: '',
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: '',
    //   role: this.roleTeam,
    //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    // }
    // this._mandateService.assignedLeadsCount(todayscheduledrsv).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.todayscheduledrsv = compleads.AssignedLeads[0].Uniquee_counts;
    //   } else {
    //     this.todayscheduledrsv = 0;
    //   }
    // });

    //this is the count for fn
    // var todayscheduledFn = {
    //   datefrom: this.todaysdateforcompare,
    //   dateto: this.todaysdateforcompare,
    //   statuss: 'scheduledtoday',
    //   stage: "Final Negotiation",
    //   stagestatus: '',
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: '',
    //   role: this.roleTeam,
    //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    // }
    // this._mandateService.assignedLeadsCount(todayscheduledFn).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.todayscheduledfn = compleads.AssignedLeads[0].Uniquee_counts;
    //   } else {
    //     this.todayscheduledfn = 0;
    //   }
    // });

    //overdues counts

    if (this.dashtype == 'leads') {

      var generalfollowupparam = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Fresh',
        stagestatus: '',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: '',
        followup: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(generalfollowupparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.followupsoverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.followupsoverduesCount = 0;
        }
      });

      //here we get nc count
      var ncparam = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'NC',
        stagestatus: '',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(ncparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.ncOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.ncOverduesCount = 0;
        }
      });

      //here we get usv count
      let overstagestatus;
      if (this.stagestatusval == 4 || this.stagestatusval == 5) {
        overstagestatus = this.stagestatusval
      } else {
        overstagestatus = '3'
      }

      var usvparam = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'USV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(usvparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.usvFixOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.usvFixOverduesCount = 0;
        }
      });
    }

    if (this.dashtype == 'visits') {

      var usvparam = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'USV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(usvparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.usvOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.usvOverduesCount = 0;
        }
      });

      //here we get rsv count
      var rsvparam = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'RSV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(rsvparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.rsvOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.rsvOverduesCount = 0;
        }
      });

      //here we get fn count
      var fnparam = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Final Negotiation',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(fnparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.fnOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.fnOverduesCount = 0;
        }
      });

      //here we get deal closing request count
      var dcparam = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Deal Closing Requested',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(dcparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.dealRequestedOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.dealRequestedOverduesCount = 0;
        }
      });

      //here we get deal closing pending count
      var dcpparam = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Deal Closing Pending',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeadsCount(dcpparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.dealPendingOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.dealPendingOverduesCount = 0;
        }
      });
    }

  }

  //based on the user changes  the tabs in  executive's totoal leads(HOT,warm,cold table)
  getTotalLeads(type) {
    if (type == 'Total Leads') {
      $(".other_section").removeClass("active");
      $(".totalLeads_section").addClass("active");
      this.hotColdWarmCount = 1;
      this.leadName = 'Total Leads';
      this.getHotColdWarmCount(this.propertyid, this.hotColdWarmCount, this.fromdate, this.todate);
    }
    else if (type == 'Active Leads') {
      $(".other_section").removeClass("active");
      $(".activeLeads_section").addClass("active");
      this.hotColdWarmCount = 2;
      this.leadName = 'Active Leads';
      this.getHotColdWarmCount(this.propertyid, this.hotColdWarmCount, this.fromdate, this.todate);
      if (this.hcwLeadsCount != null) {
        this.leadsCount = this.hcwLeadsCount.total_counts[0].activeleads
      }
    }
    else if (type == 'Inactive Leads') {
      $(".other_section").removeClass("active");
      $(".inactiveLeads_section").addClass("active");
      this.hotColdWarmCount = 3;
      this.leadName = 'InActive Leads';
      this.getHotColdWarmCount(this.propertyid, this.hotColdWarmCount, this.fromdate, this.todate);
      if (this.hcwLeadsCount != null) {
        this.leadsCount = this.hcwLeadsCount.total_counts[0].inactiveleads
      }
    }
  }

  //to get the executive total info 
  getHotColdWarmCount(propId, hotColdWarmCount, fromdate, todate) {
    this._mandateService.getHotColdWarmCount(hotColdWarmCount, propId, fromdate, todate, this.team, this.execid, this.roleTeam).subscribe(count => {
      this.hcwLeadsCount = count;
      this.hcwExecutiveCounts = count.myexecutive;
      this.hcwExecutiveCounts = this.hcwExecutiveCounts.filter((exec) => {
        return (exec['counts']['0']['totalleads'] > 0 || exec['counts']['0']['activeleads'] > 0 || exec['counts']['0']['inactiveleads'] > 0);
      })
      if (this.hotColdWarmCount == 1) {
        this.leadsCount = this.hcwLeadsCount.total_counts[0].totalleads;
      }
    })
  }

  mandateGetData() {
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    // Todays Date

    // Tomorrows Date
    var tomorrow = this.currentdateforcompare.getDate() + 1;
    var tomorrowwithzero = tomorrow.toString().padStart(2, "0");
    this.tomorrowsdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + tomorrowwithzero;
  }

  rolechange(vals) {
    MandateDashboardComponent.closedcount = 0;
    MandateDashboardComponent.count = 0;
    this.filterLoader = true;
    this.filterdata = true;
    if (vals.target.value == 'all') {
      this.roleTeam = "";
      this.router.navigate([], {
        queryParams: {
          role: '',
        },
        queryParamsHandling: 'merge',
      });
      this.filterLoader = false;
    } else if (vals.target.value) {
      this.roleTeam = vals.target.value;
      this.router.navigate([], {
        queryParams: {
          role: this.roleTeam
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  rmchange(vals) {
    MandateDashboardComponent.closedcount = 0;
    MandateDashboardComponent.count = 0;
    this.filterLoader = true;
    this.filterdata = true;
    if (vals.target.value == 'all') {
      this.execid = "";
      this.execname = "";
      this.router.navigate([], {
        queryParams: {
          execid: '',
          execname: ""
        },
        queryParamsHandling: 'merge',
      });
      this.filterLoader = false;
    } else if (vals.target.value) {
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
    this.getAllOverduePlansCounts();
    this.planSelectedTime(this.selectedPlanDate);
  }

  propchange(vals) {
    var element = document.getElementById('filtermaindiv');
    this.filterdata = true;
    MandateDashboardComponent.closedcount = 0;
    MandateDashboardComponent.count = 0;
    this.filterLoader = true;
    if (vals.target.value == 'all') {
      this.propertyid = "";
      this.propertyname = "";
      this.router.navigate([], {
        queryParams: {
          property: "",
          propname: "",
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
          execid: '',
          execname: '',
          // role: ''
        },
        queryParamsHandling: 'merge',
      });
      // this.directTeamCheck();
    }
    this.getAllOverduePlansCounts();
    this.planSelectedTime(this.selectedPlanDate);
    $('#rm_dropdown').dropdown('clear');
  }

  // directTeamCheck() {
  //   this._mandateService.checkdirectteamexist(this.propertyid).subscribe(executives => {
  //     if (executives['status'] == 'True') {
  //       if (this.roleid == '1' || this.roleid == '2') {
  //         this.directteamfound = true;
  //       } else {
  //         this.directteamfound = false;
  //       }
  //     } else {
  //       if (this.roleid == '1' || this.roleid == '2') {
  //         this.directteamfound = false;
  //       } else {
  //         this.directteamfound = false;
  //       }
  //     }
  //   });
  //   $('#rm_dropdown').dropdown('clear');
  // }

  // teamchange(vals) {
  //   this.execid = null;
  //   this.execname = '';
  //   this.rmid = '';
  //   $('#rm_dropdown').dropdown('clear');
  //   if (vals.target.value == 'all') {
  //     this.team = "";
  //     this.router.navigate([], {
  //       queryParams: {
  //         team: "",
  //         execid: "",
  //         execname: ""
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   } else {
  //     this.team = vals.target.value;
  //     this.router.navigate([], {
  //       queryParams: {
  //         team: this.team,
  //         execid: "",
  //         execname: ""
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   }
  // }

  backToWelcome() {
    $('.modal-backdrop').closest('div').remove();
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);

  }

  //to filter the active execiyives.
  checkActive(event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked == true) {
      this.checked = true;
      this.executiveOverdueInfo = this.executiveOverdueInfo.filter((exec) => exec.visits_reg_status == '1')
      this.executiveOverdueInfo = this.executiveOverdueInfo.filter((exec) => {
        return exec['counts']['0']['All_Visits'] > 0;
      });
    } else {
      this.checked = false;
      this.executiveOverdueInfo = this.copyOfExecutiveOverdueInfo;
      this.executiveOverdueInfo = this.executiveOverdueInfo.filter((exec) => {
        return exec['counts']['0']['All_Visits'] > 0;
      });
    }
  }

  refresh() {
    this._mandateService.setControllerName('');
    $('#project_dropdown').dropdown('clear');
    $('#rm_dropdown').dropdown('clear');
    $('#team_dropdown').dropdown('clear');
    $('#role_dropdown').dropdown('clear');
    this.directteamfound = false;
    this.propertyid = '';
    this.propertyname = '';
    this.team = '';
    this.roleTeam = '';
    this.execid = '';
    this.execname = '';
    if (this.roleid == 1 || this.roleid == 2) {
      this.propertyid = '16793';
      this.propertyname = 'GR Sitara';
    }
    let dashtype;
    if (this.dashtype == 'leads') {
      dashtype = this.dashtype;
    } else if (this.dashtype == 'visits') {
      dashtype = this.dashtype;
    }
    this.router.navigateByUrl('/mandate-dashboard', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/mandate-dashboard'], {
        queryParams: {
          todayvisited: 1,
          from: '',
          to: '',
          dashtype: 'dashboard',
          htype: 'mandate',
          type: dashtype
        }
      });
    });
    this.mandateprojectsfetch();
  }

  //this API is triggered only when the executive has logined.
  isoverdue: boolean = false;
  isScheldue: boolean = false;
  batch1trigger() {
    // if ((this.roleid != '1' && this.roleid != '2') || (this.execid != '' && this.execid != undefined && this.execid != null)) {
    if (this.dashtype == 'visits') {
      //to get the overdues count.
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      this.todaysdateforcompare = `${year}-${month}-${day}`;
      var param = {
        datefrom: this.todaysdateforcompare,
        dateto: this.todaysdateforcompare,
        statuss: 'scheduledtoday',
        stage: this.stagevalue,
        stagestatus: '',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        team: this.team,
        priority: '',
        source: '',
        visits: '',
        role: this.roleTeam,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateService.assignedLeads(param).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.scheduledtoday = compleads['AssignedLeads'];
          this.filterLoader = false;
        } else {
          this.scheduledtoday = [];
          this.filterLoader = false;
        }
      });

      // var followupmissed = {
      //   datefrom: this.fromdate,
      //   dateto: this.todate,
      //   statuss: 'overdues',
      //   stage: '8',
      //   followup: '8',
      //   stagestatus: this.stagestatusval,
      //   propid: this.propertyid,
      //   executid: this.rmid,
      //   loginuser: this.userid,
      //   team: this.team,
      //   priority: '',
      //   source: '',
      //   visits: '',
      //   role: this.roleTeam,
      //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // }
      // this._mandateService.assignedLeadsCount(followupmissed).subscribe(compleads => {
      //   if (compleads['status'] == 'True') {
      //     this.overduescounts = compleads.AssignedLeads[0].Uniquee_counts;
      //   } else {
      //     this.overduescounts = 0;
      //     this.isoverdue = true;
      //   }
      // });

      // var overduesdata = {
      //   limit: 0,
      //   limitrows: 30,
      //   datefrom: this.fromdate,
      //   dateto: this.todate,
      //   statuss: 'overdues',
      //   stage: '8',
      //   followup: '8',
      //   stagestatus: this.stagestatusval,
      //   propid: this.propertyid,
      //   executid: this.rmid,
      //   loginuser: this.userid,
      //   team: this.team,
      //   priority: '',
      //   source: '',
      //   visits: '',
      //   role: this.roleTeam,
      //   ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // }
      // this._mandateService.assignedLeads(overduesdata).subscribe(compleads => {
      //   if (compleads['status'] == 'True') {
      //     this.overdueslists = compleads.AssignedLeads;
      //   } else {
      //     this.overdueslists = [];
      //   }
      // });
    }
  }

  loadmoreForPlan() {
    let leadtype;
    if (this.dashtype == 'leads') {
      leadtype = 1;
    } else if (this.dashtype == 'visits') {
      leadtype = 2;
    }

    const limit = MandateDashboardComponent.count += 30;
    var param = {
      limit: limit,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      leadvisit: leadtype
    }
    if (this.weekendPlansData.length < this.weekendCount) {
      // this._mandateService.assignedLeads(overduesdata).subscribe(compleads => {
      //   if (compleads['status'] == 'True') {
      //     this.overdueslists = this.overdueslists.concat(compleads.AssignedLeads);
      //   }
      // });
      this._mandateService.planLeads(param).subscribe(compleads => {
        this.filterLoader = false;
        if (compleads.status == 'True') {
          this.weekendPlansData = this.weekendPlansData.concat(compleads['result']);
        }
      });
    }
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
            allvisits: 1,
            from: this.fromdate,
            to: this.todate,
            property: this.propertyid,
            propname: this.propertyname,
            execid: this.execid,
            execname: this.execname,
            team: this.team,
            dashtype: 'dashboard',
            htype: 'mandate',
            role: this.roleTeam,
            type: this.dashtype
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
      // maxDate: new Date(),
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

  weekfromdate: any;
  weektodate: any;
  isFuture: boolean = false;
  //this is triggered when custom is clicked to select the dates.
  initializeWeekplanNextActionDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#weeknextActionDates span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          $(this).data('daterangepicker').setEndDate(end);
        }
      } else {
        $('#weeknextActionDates span').html('Select Date Range');
      }
      if (start && end) {
        this.weekfromdate = start.format('YYYY-MM-DD');
        this.weektodate = end.format('YYYY-MM-DD');
        this.weekdatecustomfetch = this.weekfromdate + ' / ' + this.weektodate;
        let targetDate = new Date(this.weektodate);
        let currentdateforcompare = new Date();
        if (targetDate < currentdateforcompare) {
          this.isFuture = false;
        } else {
          this.isFuture = true;
        }
        // this.router.navigate([], {
        //   queryParams: {
        //     allvisits: 1,
        //     from: this.fromdate,
        //     to: this.todate,
        //     execid: this.execid,
        //     execname: this.execname,
        //     team: this.team,
        //     dashtype: 'dashboard',
        //     htype: 'mandate',
        //     role:this.roleTeam
        //   },
        //   // queryParamsHandling: 'merge',
        // });
      }
    };
    // Retrieve the date range from the URL query params (if any)
    const fromDate = this.weekfromdate;
    const toDate = this.weektodate;
    // Initialize start and end dates based on URL parameters or default values
    let startDate = fromDate ? moment(fromDate) : moment().startOf('day');
    let endDate = toDate ? moment(toDate) : moment().endOf('day');

    if (fromDate) {
      startDate = moment(fromDate + ' ', 'YYYY-MM-DD');
    }

    if (toDate) {
      endDate = moment(toDate + ' ', 'YYYY-MM-DD');
    }

    if (this.selectedPlanDate == 'weekend') {
      $('#weeknextActionDates').daterangepicker({
        startDate: startDate || moment().startOf('hour'),
        endDate: endDate || moment().startOf('hour'),
        showDropdowns: true,
        minYear: 1901,
        maxYear: parseInt(moment().format('YYYY'), 10),
        locale: {
          format: 'MMMM D'  // Date format without time (e.g., January 22)
        },
        autoApply: true,
        isInvalidDate: function (date) {
          // Disable weekdays (Monday to Friday), only allow weekends (Saturday and Sunday)
          return date.day() >= 1 && date.day() <= 5;  // Disable Monday (1) to Friday (5)
        }
      }, cb);
    } else if (this.selectedPlanDate == 'weekdays') {
      $('#weeknextActionDates').daterangepicker({
        startDate: startDate || moment().startOf('hour'),
        endDate: endDate || moment().startOf('hour'),
        showDropdowns: true,
        minYear: 1901,
        maxYear: parseInt(moment().format('YYYY'), 10),
        locale: {
          format: 'MMMM D'  // Date format without time (e.g., January 22)
        },
        autoApply: true,
        isInvalidDate: function (date) {
          // Disable weekends (Saturday and Sunday), only allow weekdays (Monday to Friday)
          return date.day() === 0 || date.day() === 6;  // Disable Sunday (0) and Saturday (6)
        }
      }, cb);
    } else if (this.selectedPlanDate == 'last7') {
      $('#weeknextActionDates').daterangepicker({
        startDate: startDate || moment().startOf('day'),
        endDate: endDate || moment().startOf('day'),
        // maxDate: new Date(),
        showDropdowns: false,
        timePicker: false,
        timePickerIncrement: 1,
        locale: {
          format: 'MMMM D, YYYY h:mm A'
        },
        autoApply: true,
      }, cb);
    }

    cb(this.weeknextActionStart, this.weeknextActionEnd);
  }

  selectsuggested(id, name) {
    this.propertyid = id;
    var checkid = $("input[name='programming']:checked").map(function () {
      return this.value;
    }).get().join(',');
    // this.suggestchecked = checkid;
    this.propertyname = name;

    let filteredproject = this.mandateprojects.filter((da) => da.property_idfk == id);

    this.router.navigate([], {
      queryParams: {
        property: this.propertyid,
        propname: this.propertyname,
        execid: '',
        execname: '',
        crm: filteredproject[0].crm
      },
      queryParamsHandling: 'merge',
    });
  }

  // In this method we check in and check out.
  checkIn(type) {
    // this.filterLoader = true;
    let checkId;
    if (type == 'in') {
      checkId = '1';
    } else if (type == 'out') {
      checkId = '0';
    }
    if ((this.mainAccountData == undefined || this.mainAccountData == null || this.mainAccountData == '') && this.userid != 40117) {
      $('#check_inout_btn').click();
    }

    // if (type == 'out') {
    //   this.filterLoader = false;
    //   swal({
    //     title: 'Check Out!',
    //     text: 'If you check out now , it will be considered as an Early Logout',
    //     type: 'info',
    //     confirmButtonText: 'Continue',
    //     showCancelButton: true,
    //     allowOutsideClick: false,
    //   }).then((result) => {
    //     if (result.value == true) {
    //       let param = {
    //         loginid: localStorage.getItem('UserId'),
    //         device: '0',
    //         lat: localStorage.getItem('latitude'),
    //         long: localStorage.getItem('longitude'),
    //         checkin: '0'
    //       }
    //       this._sharedservice.postLoggedLocation(param).subscribe((resp) => {
    //         if (resp.status == 'True') {
    //           this.filterLoader = false;
    //           if (type == 'in') {
    //             this.isCheckIn = false;
    //             this.CheckInBasicTimer.start();
    //           } else {
    //             this.isCheckIn = true;
    //             this.CheckInBasicTimer.reset();
    //             this.CheckInBasicTimer.stop();
    //           }
    //         }
    //       })
    //     }
    //   })
    //   return false;
    // } else {
    //   let param = {
    //     loginid: localStorage.getItem('UserId'),
    //     device: '0',
    //     lat: localStorage.getItem('latitude'),
    //     long: localStorage.getItem('longitude'),
    //     checkin: '1'
    //   }
    //   this._sharedservice.postLoggedLocation(param).subscribe((resp) => {
    //     if (resp.status == 'True') {
    //       this.filterLoader = false;
    //       if (type == 'in') {
    //         this.isCheckIn = false;
    //         this.CheckInBasicTimer.start();
    //       } else {
    //         this.isCheckIn = true;
    //         this.CheckInBasicTimer.reset();
    //         this.CheckInBasicTimer.stop();
    //       }
    //     }
    //   })
    // }
  }

  // here we get the list of check in data and if its checked in then the timer is continued .
  getListOfCheckedIn() {
    let param = {
      loginid: this.userid,
      fromdate: this.todaysdateforcompare,
      todate: this.todaysdateforcompare,
      limitparam: 0,
      limitrows: 30
    }

    this._sharedservice.getCheckedInData(param).subscribe((resp) => {
      if (resp.status == 'True') {
        if (resp.latestdata[0].check_status == '1') {
          this.isCheckIn = false;
          $('#closecheck').click();
          let currentDate = new Date();
          let hours = currentDate.getHours();
          let minutes = currentDate.getMinutes();
          let seconds = currentDate.getSeconds();
          let formattedMinutes: string = String(minutes).padStart(2, '0');
          let formattedSeconds: string = String(seconds).padStart(2, '0');
          let currentTime = hours + ':' + formattedMinutes + ':' + formattedSeconds;
          let timerDifference = getTimeDifference(resp.latestdata[0].created_at.split(' ')[1], currentTime);
          this.checkinstartTime = convertTimeStringToSeconds(timerDifference);
          if (this.CheckInBasicTimer) {
            this.CheckInBasicTimer.resume();
          }
        } else {
          setTimeout(() => {
            if ((this.mainAccountData == undefined || this.mainAccountData == null || this.mainAccountData == '') && this.userid != 40117) {
              $('#check_inout_btn').click();
            }
          }, 0)
          this.isCheckIn = true;
          this.checkinstartTime = 0;
          this.checkinstartTime = 0;
          if (this.CheckInBasicTimer) {
            this.CheckInBasicTimer.reset();
            this.CheckInBasicTimer.stop();
          }
        }
      } else {
        setTimeout(() => {
          if ((this.mainAccountData == undefined || this.mainAccountData == null || this.mainAccountData == '') && this.userid != 40117) {
            $('#check_inout_btn').click();
          }
        }, 0)
      }
    });
  }

  weekdatecustomfetch: any;
  selectedPlanDate: any;
  planSelectedTime(type) {
    this.selectedPlanDate = type;
    $('.add_class').removeClass("active");
    setTimeout(() => {
      if (type == 'last7') {
        setTimeout(() => {
          $('.last7_section').addClass("active");
        }, 0)
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
        let sevendaysdateforcompare = sevendaysago.getFullYear() + "-" + sevendaysmonthwithzero + "-" + sevendayswithzero;

        this.weekfromdate = sevendaysdateforcompare;
        this.weektodate = this.todaysdate;
        this.weekdatecustomfetch = this.weekfromdate + ' / ' + this.weektodate;
      } else if (type == 'weekend') {
        setTimeout(() => {
          $('.weekend_section').addClass('active');
        }, 0)
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        const getPreviousWeekend = () => {
          const currentDay = this.currentdateforcompare.getDay();
          let saturdayDate, sundayDate;

          // Calculate the previous week's Saturday and Sunday
          let diffToPreviousSaturday;
          if (currentDay >= 1 && currentDay <= 5) {
            // If current day is Monday to Friday, calculate the previous Saturday
            diffToPreviousSaturday = currentDay + 1
          } else {
            // If current day is Saturday or Sunday, calculate the previous Saturday
            diffToPreviousSaturday = currentDay === 0 ? 1 : currentDay + 1;
          }
          saturdayDate = new Date(this.currentdateforcompare);
          saturdayDate.setDate(this.currentdateforcompare.getDate() - diffToPreviousSaturday);
          sundayDate = new Date(saturdayDate);
          sundayDate.setDate(saturdayDate.getDate() + 1)
          const saturdayFormatted = saturdayDate.getFullYear() + "-" + (saturdayDate.getMonth() + 1).toString().padStart(2, "0") + "-" + saturdayDate.getDate().toString().padStart(2, "0");
          const sundayFormatted = sundayDate.getFullYear() + "-" + (sundayDate.getMonth() + 1).toString().padStart(2, "0") + "-" + sundayDate.getDate().toString().padStart(2, "0");
          return { saturday: saturdayFormatted, sunday: sundayFormatted };
        };
        const weekend = getPreviousWeekend();
        this.weekfromdate = weekend.saturday;
        this.weektodate = weekend.sunday;
        this.weekdatecustomfetch = this.weekfromdate + ' / ' + this.weektodate;
      } else if (type == 'weekdays') {
        setTimeout(() => {
          $('.weekdays_section').addClass('active');
        }, 0)
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        const getPreviousWeekdays = () => {
          const currentDay = this.currentdateforcompare.getDay();
          let fromDate, toDate;
          // Calculate the previous week's Monday
          let diffToPreviousMonday;
          if (currentDay >= 1 && currentDay <= 5) {
            // If current day is between Monday and Friday, calculate the previous week's Monday
            diffToPreviousMonday = currentDay - 1 + 7;
          } else {
            // If current day is Saturday or Sunday, calculate the previous week's Monday
            diffToPreviousMonday = currentDay === 0 ? 6 : currentDay - 1 + 7;
          }
          fromDate = new Date(this.currentdateforcompare);
          fromDate.setDate(this.currentdateforcompare.getDate() - diffToPreviousMonday);
          // Calculate Friday of the previous week
          toDate = new Date(fromDate);
          toDate.setDate(fromDate.getDate() + 4);

          // Store the date range (previous week's Monday to Friday)
          // this.nextActionDateRange = [fromDate, toDate];
          const fromDateFormatted = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1).toString().padStart(2, "0") + "-" + fromDate.getDate().toString().padStart(2, "0");
          const toDateFormatted = toDate.getFullYear() + "-" + (toDate.getMonth() + 1).toString().padStart(2, "0") + "-" + toDate.getDate().toString().padStart(2, "0");
          return { from: fromDateFormatted, to: toDateFormatted };
        };
        const weekdays = getPreviousWeekdays();
        this.weekfromdate = weekdays.from;
        this.weektodate = weekdays.to;
        this.weekdatecustomfetch = this.weekfromdate + ' / ' + this.weektodate;
      }

      this.initializeWeekplanNextActionDateRangePicker();
      this.getAllOverduePlansCounts()
        ;
    }, 0)
  }

  planRefresh() {
    this.planSelectedTime('last7');
  }

  planOverdue: any;
  getAllOverduePlansCounts() {
    this.isLoading = true;
    let planType;
    if (this.selectedPlanDate == 'weekend') {
      planType = 2;
    } else if (this.selectedPlanDate == 'weekdays') {
      planType = 1
    } else {
      planType = 3;
    }
    let param = {
      fromdate: this.weekfromdate,
      todate: this.weektodate,
      execid: this.execid,
      loginid: this.userid,
      plan: planType,
      propid: this.propertyid
    }
    // this._mandateService.getAllDashPlansCounts(param).subscribe({
    //   next: (resp) => {
    //     this.isLoading = false;
    //     this.planOverdue = resp.result;
    //   }, error: (err) => {
    //     this.isLoading = false;
    //   }
    // })
  }

  detailsPageRedirection() {
    localStorage.setItem('backLocation', 'dashboard');
  }

  // lastWeek(type) {
  //   if (type == 'weekend') {
  //     var curmonth = this.currentdateforcompare.getMonth() + 1;
  //     var curmonthwithzero = curmonth.toString().padStart(2, "0");
  //     var curday = this.currentdateforcompare.getDate();
  //     var curdaywithzero = curday.toString().padStart(2, "0");
  //     const getPreviousWeekend = () => {
  //       const currentDay = this.currentdateforcompare.getDay();
  //       let saturdayDate, sundayDate;

  //       // Calculate the previous week's Saturday and Sunday
  //       let diffToPreviousSaturday;
  //       if (currentDay >= 1 && currentDay <= 5) {
  //         // If current day is Monday to Friday, calculate the previous Saturday
  //         diffToPreviousSaturday = currentDay + 1
  //       } else {
  //         // If current day is Saturday or Sunday, calculate the previous Saturday
  //         diffToPreviousSaturday = currentDay === 0 ? 1 : currentDay + 1;
  //       }
  //       saturdayDate = new Date(this.currentdateforcompare);
  //       saturdayDate.setDate(this.currentdateforcompare.getDate() - diffToPreviousSaturday);
  //       sundayDate = new Date(saturdayDate);
  //       sundayDate.setDate(saturdayDate.getDate() + 1)
  //       // Store the date range (previous Saturday and Sunday)
  //       // this.nextActionDateRange = [saturdayDate, sundayDate];
  //       // Format the dates as YYYY-MM-DD
  //       const saturdayFormatted = saturdayDate.getFullYear() + "-" + (saturdayDate.getMonth() + 1).toString().padStart(2, "0") + "-" + saturdayDate.getDate().toString().padStart(2, "0");
  //       const sundayFormatted = sundayDate.getFullYear() + "-" + (sundayDate.getMonth() + 1).toString().padStart(2, "0") + "-" + sundayDate.getDate().toString().padStart(2, "0");
  //       return { saturday: saturdayFormatted, sunday: sundayFormatted };
  //     };
  //     const weekend = getPreviousWeekend();
  //     this.fromdate = weekend.saturday;
  //     this.todate = weekend.sunday;
  //     this.router.navigate([], {
  //       queryParams: {
  //         from: this.fromdate,
  //         to: this.todate
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   } else if (type == 'weekdays') {
  //     var curmonth = this.currentdateforcompare.getMonth() + 1;
  //     var curmonthwithzero = curmonth.toString().padStart(2, "0");
  //     var curday = this.currentdateforcompare.getDate();
  //     var curdaywithzero = curday.toString().padStart(2, "0");
  //     const getPreviousWeekdays = () => {
  //       const currentDay = this.currentdateforcompare.getDay();
  //       let fromDate, toDate;
  //       // Calculate the previous week's Monday
  //       let diffToPreviousMonday;
  //       if (currentDay >= 1 && currentDay <= 5) {
  //         // If current day is between Monday and Friday, calculate the previous week's Monday
  //         diffToPreviousMonday = currentDay - 1 + 7;
  //       } else {
  //         // If current day is Saturday or Sunday, calculate the previous week's Monday
  //         diffToPreviousMonday = currentDay === 0 ? 6 : currentDay - 1 + 7;
  //       }
  //       fromDate = new Date(this.currentdateforcompare);
  //       fromDate.setDate(this.currentdateforcompare.getDate() - diffToPreviousMonday);
  //       // Calculate Friday of the previous week
  //       toDate = new Date(fromDate);
  //       toDate.setDate(fromDate.getDate() + 4);

  //       // Store the date range (previous week's Monday to Friday)
  //       // this.nextActionDateRange = [fromDate, toDate];
  //       const fromDateFormatted = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1).toString().padStart(2, "0") + "-" + fromDate.getDate().toString().padStart(2, "0");
  //       const toDateFormatted = toDate.getFullYear() + "-" + (toDate.getMonth() + 1).toString().padStart(2, "0") + "-" + toDate.getDate().toString().padStart(2, "0");
  //       return { from: fromDateFormatted, to: toDateFormatted };
  //     };
  //     const weekdays = getPreviousWeekdays();
  //     this.fromdate = weekdays.from;
  //     this.todate = weekdays.to;

  //     this.router.navigate([], {
  //       queryParams: {
  //         from: this.fromdate,
  //         to: this.todate
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   }
  // }

}

//here on clicking start now the timer will start and on check in the timer will be stopped
// doActionBasicTimer(action: String, event) {
//   switch (action) {
//     case 'start':
//       this.basicTimer.start();
//       this.timerstarted = true;
//       break;
//     default:
//       this.totalBreakTime = this.basicTimer.get();
//       this.basicTimer.stop();
//       this.timerstarted = false;
//       $('.close').click();
//       setTimeout(() => {
//         $('body').removeClass('modal-open');
//       }, 1000)
//       break;
//   }
// }

//here on clicking the start break button  timer pop up will appear with confirmation
// onClickstartBreak() {
//   this.basicTimer.reset();
//   this.basicTimer.stop();
// }

//here on clicking cancel the timer popup will be closed.
// closeModal() {
//   $('.close').click();
//   setTimeout(() => {
//     $('body').removeClass('modal-open');
//   }, 1000)
//   this.timerstarted = false;
// }
// }

function getTimeDifference(startTime: string, endTime: string): string {
  const start = new Date(`1970-01-01T${startTime}Z`);
  const end = new Date(`1970-01-01T${endTime}Z`);
  const differenceInMs = end.getTime() - start.getTime();
  const hours = Math.floor((differenceInMs % 86400000) / 3600000);
  const minutes = Math.floor((differenceInMs % 3600000) / 60000);
  const seconds = Math.floor((differenceInMs % 60000) / 1000);
  return `${Math.abs(hours)}:${Math.abs(minutes)}:${Math.abs(seconds)}`;
}

function convertTimeStringToSeconds(timeString: string): number {
  //map is used to define the date type
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
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

