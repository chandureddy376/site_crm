import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../mandate.service';
import { retailservice } from '../../retail.service';
import { sharedservice } from '../../shared.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-source-report',
  templateUrl: './source-report.component.html',
  styleUrls: ['./source-report.component.css']
})
export class SourceReportComponent implements OnInit {


  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private _mandateService: mandateservice, private _retailservice: retailservice, private _sharedService: sharedservice, public datepipe: DatePipe) {
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
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  static count: number;
  currentDate = new Date();
  todaysdate: any;
  todaysvisitedparam: any;
  yesterdaysvisitedparam: any;
  allvisitparam: any;
  last7daysparam: any;
  sevendaysdateforcompare: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdayDateStore: any;
  tomorrowsdateforcompare: any;
  datecustomfetch: any;
  dateRange: Date[];
  roleid: any;
  sourcelist: any;
  colors: string[] = [];
  username: any;
  viewallBoolean: boolean = false;
  selectedSource: string = '';
  userid: any;
  allscheduledusv: number = 0;
  allschedulednc: number = 0;
  allscheduledsv: number = 0;
  allscheduledrsv: number = 0;
  allscheduledfn: number = 0;
  totalLeadcounts: any;
  visitsLeadcounts: any;
  allVisitsTotalcounts: number = 0;
  unTouchedleadcounts: number = 0;
  inactivecounts: number = 0;
  followupleadcounts: number = 0;
  junkvisitsCount: number = 0;
  activecounts: number = 0;
  touchedcounts: number = 0;
  activevisitsCounts: number = 0;
  booked: number = 0;
  bookingrequest: number = 0;
  rejected: number = 0;
  junkleadsCount: number = 0;
  @ViewChild('sourceList') sourceList: ElementRef;
  isAtStartFlag: boolean = false;
  isAtEndFlag: boolean = true;
  uniqueTotalLeadsCounts: number = 0;
  listOfSource: any;
  dashboardSourceList: any[] = [];
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  usvCount: number = 0;
  svCount: number = 0;
  rsvCount: number = 0;
  fnCount: number = 0;
  sourceType: string = '';
  sourceInfoType: string = '';
  switchType: string = '';
  departId: string = '';
  sourceCategory: any = 'Total Leads';
  callerleads: any;
  sourceHistory: any[] = [];
  selectedSourceHist: any;
  selectedUniqueDuplicateTab: any;
  duplicateCounts: number = 0;
  uniqueCounts: number = 0;

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.username = localStorage.getItem('Name');
    this.departId = localStorage.getItem('Department');

    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.getsourcelist();

    // this.dashboardSourceList = [
    //   { id: 'OverAll', source: 'OverAll' },
    //   { id: 'Homes247', source: 'Homes247' },
    //   { id: 'Magicbricks', source: 'Magicbricks' },
    //   { id: 'Housing', source: 'Housing' },
    //   { id: '99acres', source: '99acres' },
    //   { id: 'GR-Campaign', source: 'GR-Campaign' },
    //   { id: '"Homes247-Campaign"', source: 'Homes247-Campaign' }
    // ]
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

    // Tomorrows Date
    var tomorrow = this.currentdateforcompare.getDate() + 1;
    var tomorrowwithzero = tomorrow.toString().padStart(2, "0");
    this.tomorrowsdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + tomorrowwithzero;
    // Tomorrows Date

    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }

    setTimeout(() => {
      this.getleadsdata();
    }, 1000)

    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);

    window.addEventListener('scroll', this.scrollEvent, true);
    $('html').on('click', function (e) {
      setTimeout(() => {
        $('[data-toggle="popover"]').each(function () {
          if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
          }
        });
      }, 10)
    });
  }

  scrollEvent = (e: any): void => {
    setTimeout(() => {
      $('[data-toggle="popover"]').each(function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
          $(this).popover('hide');
        }
      });
    }, 10)
  }

  // calculateUsvCount() {
  //   const usvfix = parseInt(this.totalLeadcounts.USV) || 0;
  //   const usvdone = parseInt(this.totalLeadcounts.USV) || 0;
  //   return this.usvCount = usvfix + usvdone;
  // }

  // calculateSvCount() {
  //  const svfix = parseInt(this.totalLeadcounts.SV) || 0;
  //   const svdone = parseInt(this.totalLeadcounts.SV) || 0;
  //    return this.svCount = svfix + svdone;
  // }

  // calculateRsvCount() {
  //   const rsvfix = parseInt(this.totalLeadcounts.RSV) || 0;
  //   const rsvdone = parseInt(this.totalLeadcounts.RSV) || 0;
  //   return this.rsvCount = rsvfix + rsvdone;
  // }

  // calculateFnCount() {
  //   const fnFix = parseInt(this.totalLeadcounts.FN) || 0;
  //   const fnDone = parseInt(this.totalLeadcounts.FN) || 0;
  //    return this.fnCount = fnFix + fnDone;
  // }

  getsourcelist() {
    this.filterLoader = true;
    this._sharedService.sourcelist().subscribe(sources => {
      // this.filterLoader = false;
      this.listOfSource = sources;
      sources.unshift({
        id: "0",
        source: "OverAll",
        activestatus: "1"
      });
      this.dashboardSourceList = sources;
      if (this.selectedSource == '' || this.selectedSource == undefined || this.selectedSource == null) {
        this.selectedSource = this.dashboardSourceList[0].source;
        // this.selectsuggested(this.selectedSource)
      } else {
        this.selectedSource = this.selectedSource;
      }
      // this.colors = this.sourcelist.map(() => this.getRandomColor());
    })
  }

  scrollLeft() {
    const list = this.sourceList.nativeElement;
    list.scrollBy({
      left: -600,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    const list = this.sourceList.nativeElement;
    list.scrollBy({
      left: 600,
      behavior: 'smooth'
    });
  }

  showAllSource() {
    this.filterLoader = true
    this.viewallBoolean = true;
    // this.getTotalLeadsCounts()
    // this.getOverallCounts();
    this.router.navigate([], {
      queryParams: {
        visit: 1,
        type: 'portal',
        infoType: 'leads'
      }, queryParamsHandling: 'merge'
    })
  }

  sourceDashreturn() {
    this.viewallBoolean = false;
    // let currentUrl = this.router.url;
    // let pathWithoutQueryParams = currentUrl.split('?')[0];
    // let currentQueryparams = this.route.snapshot.queryParams;
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
    // });
    this.router.navigate([], {
      queryParams: {
        visit: 0
      }, queryParamsHandling: 'merge'
    })
  }

  selectsuggested(source) {
    var checkid = $("input[name='programming1']:checked").map(function () {
      return this.value;
    }).get().join(',');
    this.selectedSource = source;
    if (this.selectedSource) {
      this.router.navigate(['/source-dashboard'], {
        queryParams: {
          from: this.fromdate,
          to: this.todate,
          dashtype: 'dashboard',
          source: this.selectedSource
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  onDateRangeSelected(range: Date[]): void {
    this.dateRange = range;
    // Convert the first date of the range to yyyy-mm-dd format
    if (this.dateRange != null || this.dateRange != undefined) {
      let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
      if ((formattedFromDate == '' || formattedFromDate == undefined) || (formattedToDate == '' || formattedToDate == undefined)) {
        this.fromdate = '';
        this.todate = ''
      } else {
        this.fromdate = formattedFromDate;
        this.todate = formattedToDate;
        this.filterLoader = true;
        setTimeout(() => {
          this.customNavigation(formattedFromDate, formattedToDate)
        }, 1000)
      }
    }
  }

  customNavigation(fromdate, todate) {
    this.router.navigate(['/source-dashboard'], {
      queryParams: {
        allvisits: 1,
        from: fromdate,
        to: todate,
        dashtype: 'dashboard',
        source: this.selectedSource
      }
    });
  }

  datePicker() {
    setTimeout(() => {
      this.dateRange = [this.currentdateforcompare];
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
      this.resetScroll();
    }, 0)
    // this.updateChevronState();
  }

  getleadsdata() {
    SourceReportComponent.count = 0;
    this.route.queryParams.subscribe((paramss) => {
      this.filterLoader = true;
      // Updated Using Strategy
      this.todaysvisitedparam = paramss['todayvisited'];
      this.yesterdaysvisitedparam = paramss['yesterdayvisited'];
      this.allvisitparam = paramss['allvisits'];
      this.last7daysparam = paramss['last7']
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.selectedSource = paramss['source'];
      this.sourceType = paramss['type'];
      this.sourceInfoType = paramss['infoType'];
      this.sourceCategory = paramss['category'];
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.resetScroll();
      }, 0);
      if (this.sourceCategory == undefined || this.sourceCategory == null || this.sourceCategory == '') {
        this.sourceCategory = 'Total Leads';
        if (this.sourceCategory == 'Total Leads') {
          if (this.selectedUniqueDuplicateTab == undefined || this.selectedUniqueDuplicateTab == null || this.selectedUniqueDuplicateTab == '') {
            this.selectedUniqueDuplicateTab = 'unique';
            $('.lead_section').removeClass('active');
            $('.uniqueLeads_section').addClass('active');
          } else {
            $('.lead_section').removeClass('active');
            if (this.selectedUniqueDuplicateTab == 'unique') {
              $('.uniqueLeads_section').addClass('active');
            } else if (this.selectedUniqueDuplicateTab == 'duplicate') {
              $('.duplicatesLeads_section').addClass('active');
            }
          }
        }
      } else {
        if (this.sourceCategory == 'Total Leads') {
          if (this.selectedUniqueDuplicateTab == undefined || this.selectedUniqueDuplicateTab == null || this.selectedUniqueDuplicateTab == '') {
            this.selectedUniqueDuplicateTab = 'unique';
            $('.lead_section').removeClass('active');
            $('.uniqueLeads_section').addClass('active');
          } else {
            $('.lead_section').removeClass('active');
            if (this.selectedUniqueDuplicateTab == 'unique') {
              $('.uniqueLeads_section').addClass('active');
            } else if (this.selectedUniqueDuplicateTab == 'duplicate') {
              $('.duplicatesLeads_section').addClass('active');
            }
          }
        }
      }

      if (paramss['visit'] == 1) {
        this.viewallBoolean = true;
      } else {
        this.viewallBoolean = false;
      }

      if ((this.fromdate == '' || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined)) {
        $("#fromdate").val('');
        $("#todate").val('');
        this.fromdate = '';
        this.todate = '';
      } else {
        $("#fromdate").val(this.fromdate);
        $("#todate").val(this.todate);
        // if(this.viewallBoolean == true){
        //   // this.getTotalLeadsCounts()
        // }
      }

      if (this.selectedSource == '' || this.selectedSource == undefined || this.selectedSource == null) {
        if (this.departId != '10005') {
          this.selectedSource = this.dashboardSourceList && this.dashboardSourceList.length > 0 ? this.dashboardSourceList[0].source : 'OverAll';;
        } else if (this.departId == '10005' && localStorage.getItem('Role') == '50015') {
          this.selectedSource = 'Magicbricks';
        } else if (this.departId == '10005' && localStorage.getItem('Role') == '50016') {
          this.selectedSource = 'Housing';
        }
      } else {
        this.selectedSource = this.selectedSource;
      }
      if (this.todaysvisitedparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.clicked = false;
        this.clicked1 = true;
        this.clicked2 = false;
        this.clicked3 = false;
        this.filterLoader = true;
        var curmonth = this.currentDate.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentDate.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
        this.fromdate = this.todaysdate;
        this.todate = this.todaysdate;
        // this.getTotalLeadsCounts()
        if (this.viewallBoolean == true) {
          this.getTotalLeadsCounts()
          this.getOverallCounts();
        } else {
          this.getCounts()
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
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = true;
        this.clicked3 = false;
        this.fromdate = this.yesterdayDateStore;
        this.todate = this.yesterdayDateStore;
        this.filterLoader = true;
        if (this.viewallBoolean == true) {
          this.getTotalLeadsCounts()
          this.getOverallCounts();
        } else {
          this.getCounts()
        }
      } else if (this.allvisitparam == '1') {
        this.filterLoader = true;
        this.clicked = true;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = false;
        if (this.viewallBoolean == true) {
          this.getTotalLeadsCounts()
          this.getOverallCounts();
        } else {
          this.getCounts()
        }
      } else if (this.last7daysparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = true;
        this.filterLoader = true;
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

        this.fromdate = this.sevendaysdateforcompare;
        this.todate = this.todaysdate;

        if (this.viewallBoolean == true) {
          this.getTotalLeadsCounts()
          this.getOverallCounts();
        } else {
          this.getCounts()
        }
      }
      // Updated Using Strategy
    });
  }

  getTotalLeadsCounts() {
    this._sharedService.getleadcounts(this.fromdate, this.todate, '', '', '', '').subscribe(enquiryscount => {
      this.uniqueTotalLeadsCounts = enquiryscount[0].uniqueecounts;
    });
  }

  //to get the counts of the dashboard.
  getOverallCounts() {
    //this counts is used for 1st row 

    if (this.fromdate == "" && this.todate == "" || this.fromdate == undefined && this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    this.filterLoader = true;
    // to get dasbboard counts
    let param = {
      from: this.fromdate,
      to: this.todate,
      visitedfrom: this.fromdate,
      visitedto: this.todate
    }
    this._sharedService.getSourceListWithCounts(param).subscribe(dashCounts => {
      if (dashCounts.status == "True") {
        this.filterLoader = false;
        this.sourcelist = dashCounts.SourceCounts;
        this.colors = this.sourcelist.map(() => this.getRandomColor());
      }
    })
  }

  getCounts() {
    //dashboard counts
    if (this.fromdate == "" && this.todate == "" || this.fromdate == undefined && this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    //this is the count for assigned leads....
    let source;
    if (this.selectedSource == 'OverAll') {
      source = '';
    } else if (this.departId == '10005' && localStorage.getItem('Role') == '50015') {
      source = 'Magicbricks';
    } else if (this.departId == '10005' && localStorage.getItem('Role') == '50016') {
      source = 'Housing';
    } else {
      source = this.selectedSource;
    }
    var totalleads = {
      datefrom: this.fromdate,
      dateto: this.todate,
      source: source
    }
    // this.filterLoader = false;
    this._sharedService.assignedLeadsCount(totalleads).subscribe(compleads => {
      // this.filterLoader = false;
      if (compleads['status'] == 'True') {
        this.totalLeadcounts = compleads['result'];
        this._sharedService.assignedLeadsCount2(totalleads).subscribe(compleads => {
          // this.filterLoader = false;
          if (compleads['status'] == 'True') {
            this.visitsLeadcounts = compleads['result'];
            this.getSourceListing();
          } else {
            this.filterLoader = false;
            this.visitsLeadcounts = 0;
          }
        });
      } else {
        this.filterLoader = false;
        this.totalLeadcounts = 0;
      }
    });
  }

  getSourceListing() {
    SourceReportComponent.count = 0;
    let source;
    if (this.selectedSource == 'OverAll') {
      source = '';
    } else if (this.departId == '10005' && localStorage.getItem('Role') == '50015') {
      source = 'Magicbricks';
    } else if (this.departId == '10005' && localStorage.getItem('Role') == '50016') {
      source = 'Housing';
    } else {
      source = this.selectedSource;
    }

    let status;
    if (this.sourceCategory == 'Total Leads') {
      status = 'Total';
    } else if (this.sourceCategory == 'Assigned') {
      status = 'Assigned';
    } else if (this.sourceCategory == 'Pending') {
      status = 'Pending';
    } else if (this.sourceCategory == 'Untouched') {
      status = 'Untouched';
    } else if (this.sourceCategory == 'Touched') {
      status = 'Touched';
    } else if (this.sourceCategory == 'Inactive') {
      status = 'Inactive';
    } else if (this.sourceCategory == 'Junk Leads') {
      status = 'JunkLeads';
    } else if (this.sourceCategory == 'Active Leads') {
      if (this.departId == '10005') {
        status = 'act_lds_hs_mb_count'
      } else {
        status = 'ActiveLeads';
      }
    } else if (this.sourceCategory == 'General Followups') {
      status = 'GeneralFollowup';
    } else if (this.sourceCategory == 'NC') {
      status = 'NC';
    } else if (this.sourceCategory == 'USV Fix') {
      status = 'USVFix';
    } else if (this.sourceCategory == 'All Visits') {
      status = 'AllVisits';
    } else if (this.sourceCategory == 'USV') {
      status = 'USV';
    } else if (this.sourceCategory == 'RSV') {
      status = 'RSV';
    } else if (this.sourceCategory == 'FN') {
      status = 'FN';
    } else if (this.sourceCategory == 'Booking Request') {
      status = 'BRequest';
    } else if (this.sourceCategory == 'Booking Request Rejected') {
      status = 'BRejected';
    } else if (this.sourceCategory == 'Booking Request Pending') {
      status = 'BPending';
    } else if (this.sourceCategory == 'Closed Leads') {
      status = 'BClosed';
    } else if (this.sourceCategory == 'Junk visits') {
      status = 'JunkVisits';
    }

    let tabNumb;
    if (this.sourceCategory == 'Total Leads' && this.selectedUniqueDuplicateTab == 'unique') {
      tabNumb = 1;
    } else if (this.sourceCategory == 'Total Leads' && this.selectedUniqueDuplicateTab == 'duplicate') {
      tabNumb = 2;
    }

    let param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      source: source,
      status: status,
      ...(this.sourceCategory == 'Total Leads' ? { leads: tabNumb } : {})
    }

    this._sharedService.sourcebasedleadslisting(param).subscribe((resp) => {
      if (resp.status == 'True') {
        this.filterLoader = false;
        this.callerleads = resp.result;
        if (resp.counts && resp.counts.length > 0) {
          this.uniqueCounts = resp.counts[1].unquiecounts;
          this.duplicateCounts = resp.counts[0].duplicatecounts;
        }
      } else {
        this.callerleads = [];
        this.uniqueCounts = 0;
        this.duplicateCounts = 0;
        this.filterLoader = false;
      }
    })
  }

  sourceTypeChange(type) {
    this.router.navigate([], {
      queryParams: {
        type: type
      },
      queryParamsHandling: 'merge'
    })
  }

  //here on clicking random assign the leads will be divided equally assigned 
  checkRandom(event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked == true) {
      this.router.navigate([], {
        queryParams: {
          infoType: 'properties'
        }, queryParamsHandling: 'merge'
      })
    } else {
      this.router.navigate([], {
        queryParams: {
          infoType: 'leads'
        }, queryParamsHandling: 'merge'
      })
    }
  }

  backToWelcome() {
    $('.modal-backdrop').closest('div').remove();
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }

  refresh() {
    setTimeout(() => {
      if (this.departId != '10005') {
        this.selectedSource = this.dashboardSourceList[0].source;
      } else if (this.departId == '10005' && localStorage.getItem('Role') == '50015') {
        this.selectedSource = 'Magicbricks';
      } else if (this.departId == '10005' && localStorage.getItem('Role') == '50016') {
        this.selectedSource = 'Housing';
      }
    }, 0)
    this.fromdate = '';
    this.todate = '';
    this.sourceCategory = '';
    // this.currentdateforcompare = new Date();
    // var curmonth = this.currentdateforcompare.getMonth() + 1;
    // var curmonthwithzero = curmonth.toString().padStart(2, '0');
    // var curday = this.currentdateforcompare.getDate();
    // var curdaywithzero = curday.toString().padStart(2, '0');
    // this.todaysdate = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    // //getting the date of the -6days
    // var sevendaysago = new Date(this.currentdateforcompare);
    // sevendaysago.setDate(sevendaysago.getDate() - 6);
    // var sevendaysmonth = sevendaysago.getMonth() + 1;
    // var sevendaysmonthwithzero = sevendaysmonth.toString().padStart(2, "0");
    // var sevendays = sevendaysago.getDate();
    // var sevendayswithzero = sevendays.toString().padStart(2, "0");
    // this.sevendaysdateforcompare = sevendaysago.getFullYear() + "-" + sevendaysmonthwithzero + "-" + sevendayswithzero;

    this.fromdate = this.sevendaysdateforcompare;
    this.todate = this.todaysdate;
    this.selectedUniqueDuplicateTab = '';
    this.router.navigateByUrl('/source-dashboard', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/source-dashboard'], {
        queryParams: {
          todayvisited: 1,
          from: this.fromdate,
          to: this.todate,
          dashtype: 'dashboard',
          source: this.selectedSource,
          category: '',
        }
      });
    });
  }

  // Method to generate a random color
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Method to get color for each card
  getColor(index: number): string {
    return this.colors[index];
  }

  getCategoryLeads(type) {
    this.sourceCategory = type;
    this.router.navigate([], {
      queryParams: {
        category: type
      }, queryParamsHandling: 'merge'
    })
  }

  loadMoreleads() {
    let limit;
    limit = SourceReportComponent.count += 30;

    let source;
    if (this.selectedSource == 'OverAll') {
      source = '';
    } else if (this.departId == '10005' && localStorage.getItem('Role') == '50015') {
      source = 'Magicbricks';
    } else if (this.departId == '10005' && localStorage.getItem('Role') == '50016') {
      source = 'Housing';
    } else {
      source = this.selectedSource;
    }

    let status, countsData;
    if (this.sourceCategory == 'Total Leads') {
      status = 'Total';
      // countsData = this.totalLeadcounts.total;
      console.log(this.selectedUniqueDuplicateTab)
      if (this.selectedUniqueDuplicateTab == 'unique') {
        countsData = this.uniqueCounts;
      } else if (this.selectedUniqueDuplicateTab == 'duplicate') {
        countsData = this.duplicateCounts;
      }
    } else if (this.sourceCategory == 'Assigned') {
      status = 'Assigned';
      countsData = this.totalLeadcounts.Assigned;
    } else if (this.sourceCategory == 'Pending') {
      status = 'Pending';
      countsData = this.totalLeadcounts.pending;
    } else if (this.sourceCategory == 'Untouched') {
      status = 'Untouched';
      countsData = this.totalLeadcounts.Untouched;
    } else if (this.sourceCategory == 'Touched') {
      status = 'Touched';
      countsData = this.totalLeadcounts.Touched;
    } else if (this.sourceCategory == 'Inactive') {
      status = 'Inactive';
      countsData = this.totalLeadcounts.Inactive;
    } else if (this.sourceCategory == 'Junk Leads') {
      status = 'JunkLeads';
      countsData = this.totalLeadcounts.JunkLeads;
    } else if (this.sourceCategory == 'Active Leads') {
      if (this.departId == '10005') {
        countsData = this.totalLeadcounts.act_lds_hs_mb_count;
        status = 'act_lds_hs_mb_count';
      } else {
        status = 'ActiveLeads';
        countsData = this.totalLeadcounts.ActiveLeads;
      }
    } else if (this.sourceCategory == 'General Followups') {
      status = 'GeneralFollowup';
      countsData = this.totalLeadcounts.GeneralFollowup;
    } else if (this.sourceCategory == 'NC') {
      status = 'NC';
      countsData = this.totalLeadcounts.NC;
    } else if (this.sourceCategory == 'USV Fix') {
      status = 'USVFix';
      countsData = this.totalLeadcounts.USV_fix;
    } else if (this.sourceCategory == 'All Visits') {
      status = 'AllVisits';
      countsData = this.visitsLeadcounts.AllVisits;
    } else if (this.sourceCategory == 'USV') {
      status = 'USV';
      countsData = this.visitsLeadcounts.USV;
    } else if (this.sourceCategory == 'RSV') {
      status = 'RSV';
      countsData = this.visitsLeadcounts.RSV;
    } else if (this.sourceCategory == 'FN') {
      status = 'FN';
      countsData = this.visitsLeadcounts.FN;
    } else if (this.sourceCategory == 'Booking Request') {
      status = 'BRequest';
      countsData = this.visitsLeadcounts.BRequest;
    } else if (this.sourceCategory == 'Booking Request Rejected') {
      status = 'BRejected';
      countsData = this.visitsLeadcounts.BRejected;
    } else if (this.sourceCategory == 'Booking Request Pending') {
      status = 'BPending';
      countsData = this.visitsLeadcounts.BPending;
    } else if (this.sourceCategory == 'Closed Leads') {
      status = 'BClosed';
      countsData = this.visitsLeadcounts.BClosed;
    } else if (this.sourceCategory == 'Junk visits') {
      status = 'JunkVisits';
      countsData = this.visitsLeadcounts.JunkVisits;
    }

    let tabNumb;
    if (this.sourceCategory == 'Total Leads' && this.selectedUniqueDuplicateTab == 'unique') {
      tabNumb = 1;
    } else if (this.sourceCategory == 'Total Leads' && this.selectedUniqueDuplicateTab == 'duplicate') {
      tabNumb = 2;
    }

    let param = {
      limit: limit,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      source: source,
      status: status,
      ...(this.sourceCategory == 'Total Leads' ? { leads: tabNumb } : {})
    }
    if (this.callerleads.length < parseInt(countsData)) {
      this.filterLoader = true;
      this._sharedService.sourcebasedleadslisting(param).subscribe(compleads => {
        this.filterLoader = false;
        this.callerleads = this.callerleads.concat(compleads['result'])
      });
    }
  }

  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

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
        const diffInDays = end.diff(start, 'days');
        if (diffInDays <= 30) {
          this.fromdate = start.format('YYYY-MM-DD');
          this.todate = end.format('YYYY-MM-DD');
          this.router.navigate(['/source-dashboard'], {
            queryParams: {
              allvisits: 1,
              from: this.fromdate,
              to: this.todate,
              dashtype: 'dashboard',
              source: this.selectedSource,
              category: this.sourceCategory
            }
          });
        } else {
          swal({
            title: 'Please Select the date range between a Month',
            type: 'info',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.fromdate = '';
            this.todate = '';
            start = null;
            end = null;
            this.nextActionStart = null;
            this.nextActionEnd = null;
          })
        }
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

  getLeadHistory(lead) {
    this.selectedSourceHist = lead;
    if (lead) {
      this.filterLoader = true;
      this._sharedService.viewSourceHistory(lead.leadid).subscribe((resp) => {
        if (resp.status == 'True') {
          this.filterLoader = false;
          this.sourceHistory = resp.result;
        } else {
          this.sourceHistory = [];
          this.filterLoader = false;
        }
      })
    }
  }

  sourceHistoryModalClose() {

  }

  showall(i: number): void {
    $(`.popper${i}`).popover({
      html: true,
      content: function () {
        return $(`.popover_content_wrapper${i}`).html();
      }
    });
    $(`.popper${i}`).popover('show');
  }

  uniqueDuplicateTabs(type) {
    $('.lead_section').removeClass('active');
    if (type == 'unique') {
      $('.uniqueLeads_section').addClass('active');
    } else if (type == 'duplicate') {
      $('.duplicatesLeads_section').addClass('active');
    }

    this.selectedUniqueDuplicateTab = type;
    this.getSourceListing();
  }

  //   moveToLeft(): void {
  //     const leadassignElement = this.sourceList.nativeElement;
  //     leadassignElement.scrollBy({
  //       left: -200,
  //       behavior: 'smooth'
  //     });
  //     this.updateChevronState();
  //   }

  //   moveToRight(): void {
  //     const leadassignElement = this.sourceList.nativeElement;
  //     leadassignElement.scrollBy({
  //       left: 200,
  //       behavior: 'smooth'
  //     });
  //     this.updateChevronState();
  //   }

  //   // Check if the scroll is at the start
  //   isAtStart(): boolean {
  //     const leadassignElement = this.sourceList.nativeElement;
  //     return leadassignElement.scrollLeft === 0;
  //   }

  //   // Check if the scroll is at the end
  //   isAtEnd(): boolean {
  //     const leadassignElement = this.sourceList.nativeElement;
  //     return leadassignElement.scrollLeft + leadassignElement.clientWidth >= leadassignElement.scrollWidth;
  //   }

  //  // Update the chevron states
  //  updateChevronState(): void {
  //   this.isAtStartFlag = this.isAtStart();
  //   this.isAtEndFlag = this.isAtEnd();
  //   if (this.isAtEndFlag == true && this.isAtStartFlag == true) {
  //     $('.chevleft').css('display', 'none');
  //     $('.chevright').css('display', 'flex');
  //   } else if (this.isAtEndFlag == true && this.isAtStartFlag == false) {
  //     $('.chevright').css('display', 'none');
  //     $('.chevleft').css('display', 'flex');
  //   } else {
  //     $('.chevright').css('display', 'flex');
  //     $('.chevleft').css('display', 'none');
  //   }

  // }
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

