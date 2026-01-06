import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { retailservice } from '../../retail.service';
import { sharedservice } from '../../shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { EchoService } from '../../echo.service';


declare var $: any;

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private _retailservice: retailservice, private _sharedservice: sharedservice, public datepipe: DatePipe,   private _echoService: EchoService) {
    if (localStorage.getItem('Role') == '50001' || localStorage.getItem('Role') == '50002') {
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
    })
    this.getCpList();
  }

  private isCountdownInitialized: boolean;
  filterLoader: boolean = true;
  routeparams: any;
  fromdate: any;
  todate: any;
  execid: any;
  static count: number;
  executives: any;
  execname: any;
  currentDate = new Date();
  todaysdate: any;
  todayscheduled: number = 0;
  scheduledtoday: any;
  todayscheduledusv: number = 0;
  todayscheduledsv: number = 0;
  todayscheduledrsv: number = 0;
  todayscheduledfn: number = 0;
  overduescounts: number = 0;
  overdueslists: any;
  booked: number = 0
  todaysvisitedparam: any;
  yesterdaysvisitedparam: any;
  allvisitparam: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdaysdateforcompare: any;
  tomorrowsdateforcompare: any;
  stagevalue: any;
  stagestatusval: any;
  username: any;
  datecustomfetch: any;
  withoutQueryParams$: Observable<boolean>;
  dateRange: Date[];
  executiveTodayInfo: any;
  executiveOverdueInfo: any;
  copyOfExecutiveOverdueInfo: any;
  roleid: any;
  userid: any;
  listOfCps: any;
  bookingrequest: number = 0;
  rejected: number = 0;
  allscheduledusv: number = 0;
  allschedulednc: number = 0;
  allscheduledsv: number = 0;
  allscheduledrsv: number = 0;
  allscheduledfn: number = 0;
  totalAssignedleadcounts: number = 0
  unTouchedleadcounts: number = 0;
  inactivecounts: number = 0;
  followupleadcounts: number = 0;
  activecounts: number = 0;
  touchedcounts: number = 0;
  junkleadsCount: number = 0;
  allVisitsTotalcounts: number = 0;
  junkvisitsCount: number = 0;
  activevisitsCounts: number = 0;
  checked: boolean = true;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;


  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.username = localStorage.getItem('Name');

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

    // Tomorrows Date
    var tomorrow = this.currentdateforcompare.getDate() + 1;
    var tomorrowwithzero = tomorrow.toString().padStart(2, "0");
    this.tomorrowsdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + tomorrowwithzero;
    // Tomorrows Date


    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }
    if (localStorage.getItem('Role') == '1') {
    } else if (localStorage.getItem('Role') == '50002') {
    } else {
    }

    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
    ClientDashboardComponent.count = 0;

    this.withoutQueryParams$ = this.route.queryParams.pipe(
      map(params => Object.keys(params).length === 0)
    );

    // setTimeout(()=>{
    //   this.getleadsdata();
    // },100)
  }

  onDateRangeSelected(range: Date[]): void {
    this.dateRange = range;
    // Convert the first date of the range to yyyy-mm-dd format
    if (this.dateRange != null && this.dateRange != undefined) {
      let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
      if ((formattedFromDate == '' || formattedFromDate == undefined) || (formattedToDate == '' || formattedToDate == undefined)) {
        this.fromdate = '';
        this.todate = '';
      } else {
        this.fromdate = formattedFromDate;
        this.todate = formattedToDate;
        this.filterLoader = true;
        setTimeout(() => {
          this.customNavigation(formattedFromDate, formattedToDate)
        }, 1000);
      }
    }
  }

  customNavigation(fromdate, todate) {
    this.router.navigate(['/client-dash'], {
      queryParams: {
        allvisits: 1,
        from: fromdate,
        to: todate,
        execid: this.execid,
        execname: this.execname,
        dashtype: 'dashboard',
      }
    });
  }

  datePicker() {
    setTimeout(() => {
      this.dateRange = [this.currentdateforcompare]
      $("bs-daterangepicker-container").addClass("newDashBoardDatePicker");
      $("bs-daterangepicker-container").attr("id", "newDashBoardDatePicker");
    }, 100);

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
    $("bs-daterangepicker-container").removeAttr('style');
    this.hoverSubscription.unsubscribe();
  }

  calculateDiff(sentDate) {
    var date1: any = new Date(sentDate);
    var date2: any = new Date();
    var diffDays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    return diffDays;
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

    getleadsdata() {
    ClientDashboardComponent.count = 0;
    this.route.queryParams.subscribe((paramss) => {
      this.filterLoader = true;
      // Updated Using Strategy
      this.todaysvisitedparam = paramss['todayvisited'];
      this.yesterdaysvisitedparam = paramss['yesterdayvisited'];
      this.allvisitparam = paramss['allvisits'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      
      if (this.execid == '' || this.execid == undefined || this.execid == null) {
        setTimeout(() => {
          if (this.listOfCps && this.listOfCps[0]) {
            this.execid = this.listOfCps[0].client_id;
            this.execname = this.listOfCps[0].client_name;
            localStorage.setItem('cpcontrollerName', this.listOfCps[0].client_controller);
          }
        }, 0)
      } else {
        this.execid = this.execid;
        this.execname = this.execname;
        console.log(this.listOfCps)
        let selectedCp = this.listOfCps.filter((cp) => {
          return cp.client_id == this.execid;
        });
        if (selectedCp) {
          localStorage.setItem('cpcontrollerName', selectedCp[0].client_controller);
        }
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

      if (this.todaysvisitedparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.clicked = false;
        this.clicked1 = true;
        this.clicked2 = false;
        this.filterLoader = true;

        var curmonth = this.currentDate.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentDate.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

        this.fromdate = this.todaysdate;
        this.todate = this.todaysdate;
        this.batch2trigger();
        this.getCounts();
      } else if (this.yesterdaysvisitedparam == '1') {
        // Yesterdays Date
        const yesterday = () => {
          this.currentdateforcompare = new Date();
          this.currentdateforcompare.setDate(this.currentdateforcompare.getDate() - 1);
          return this.currentdateforcompare;
        };
        this.yesterdaysdateforcompare = yesterday().toISOString().split('T')[0];
        // Yesterdays Date 
        this.fromdate = "";
        this.todate = "";
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = true;
        this.filterLoader = true;

        this.fromdate = this.yesterdaysdateforcompare;
        this.todate = this.yesterdaysdateforcompare;
        this.batch2trigger();
        this.getCounts();
      } else if (this.allvisitparam == '1') {
        this.batch2trigger();
        this.getCounts();
        this.filterLoader = true;
        this.clicked = true;
        this.clicked1 = false;
        this.clicked2 = false;
      }
      // Updated Using Strategy
    });
  }

  getCpList() {
    this._sharedservice.getCpClients('').subscribe((cp) => {
      this.listOfCps = cp['result'];
      this.execid = this.listOfCps[0].client_id;
      this.execname = this.listOfCps[0].client_name;
      localStorage.setItem('cpcontrollerName', this.listOfCps[0].client_controller);
      this.getleadsdata();
    })
  }

  batch2trigger() {
    if (this.fromdate == "" && this.todate == "" || this.fromdate == undefined && this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    let todayScheldueparam = {
      fromDate: this.todaysdateforcompare,
      todate: this.todaysdateforcompare,
      execId: this.execid,
      loginuser: this.userid,
    }

    this._sharedservice.getExecutiveScheldueTodayInfo(todayScheldueparam).subscribe(execInfo => {
      this.executiveTodayInfo = execInfo.Dashtotal;
      this.filterLoader = false;
      this.executiveTodayInfo = this.executiveTodayInfo.filter((exec) => {
        return exec['counts']['0']['All_Visits'] > 0
      })
    })

    let quickviewparam = {
      fromDate: this.fromdate,
      todate: this.todate,
      execId: this.execid,
      loginuser: this.userid,
    }

    this._sharedservice.getExecutiveInfo(quickviewparam).subscribe(execInfo => {
      this.executiveOverdueInfo = execInfo.Dashtotal;
      this.copyOfExecutiveOverdueInfo = execInfo.Dashtotal;
      this.executiveOverdueInfo = this.executiveOverdueInfo.filter((exec) => {
        return exec['counts']['0']['All_Visits'] > 0
      })
      if (this.checked == true) {
        this.executiveOverdueInfo = this.executiveOverdueInfo.filter((ex) => ex.visits_reg_status == '1');
      } else if (this.checked == false) {
        this.executiveOverdueInfo = this.copyOfExecutiveOverdueInfo;
      }
    })

  }

  // isScheldue: boolean = false;
  // isOverdue: boolean = false;
  // batch1trigger() {
  //   if (this.roleid != '1' || (this.execid != '' && this.execid != undefined && this.execid != null)) {
  //     var overdue = {
  //       datefrom: this.fromdate,
  //       dateto: this.todate,
  //       statuss: 'overdues',
  //       loginuser: this.userid,
  //     }
  //     this._retailservice.assignedLeadsCPCount(overdue).subscribe(compleads => {
  //       if (compleads['status'] == 'True') {
  //         this.overduescounts = compleads.AssignedLeads[0].counts;
  //       } else {
  //         this.overduescounts = 0;
  //       }
  //     });
  //     // Todays Scheduled Counts Fetch
  //     var todayscheduled = {
  //       datefrom: this.todaysdateforcompare,
  //       dateto: this.todaysdateforcompare,
  //       statuss: 'scheduledtoday',
  //       stage: this.stagevalue,
  //       stagestatus: this.stagestatusval,
  //       executid: this.execid,
  //       loginuser: this.userid,
  //     }
  //     this._retailservice.assignedLeads(todayscheduled).subscribe(compleads => {
  //       if (compleads['status'] == 'True') {
  //         this.filterLoader = false;
  //         this.scheduledtoday = compleads['AssignedLeads'];
  //       } else {
  //         this.filterLoader = false;
  //         this.scheduledtoday = [""];
  //         this.isScheldue = true;
  //       }
  //     });

  //    var param = {
  //       limit: 0,
  //       limitrows: 100,
  //       datefrom: this.fromdate,
  //       dateto: this.todate,
  //       statuss: 'overdues',
  //       stage: '',
  //       stagestatus: '',
  //       loginuser: this.userid,
  //       // priority: this.priorityName
  //     }
  //     this._retailservice.assignedLeads(param).subscribe(compleads => {
  //       this.filterLoader = false;
  //       if (compleads['status'] == 'True') {
  //         this.filterLoader = false;
  //         this.overdueslists = compleads['AssignedLeads'];
  //       } else {
  //         this.filterLoader = false;
  //         this.overdueslists = [''];
  //         this.isOverdue = true;
  //       }
  //     });
  //   }
  // }

  getCounts() {
    //dashboard counts
    if (this.fromdate == "" && this.todate == "" || this.fromdate == undefined && this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    //this is the count for assigned leads....
    var totalleads = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'assignedleads',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(totalleads).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.totalAssignedleadcounts = compleads.AssignedLeads[0].counts;
      } else {
        this.totalAssignedleadcounts = 0;
      }
    });

    var pending = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'pending',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(pending).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.unTouchedleadcounts = compleads.AssignedLeads[0].counts;
      } else {
        this.unTouchedleadcounts = 0;
      }
    });

    //this is the count for inactive......
    var inactive = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'inactive',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(inactive).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.inactivecounts = compleads.AssignedLeads[0].counts;
      } else {
        this.inactivecounts = 0;
      }
    });

    //this is the count for genaral followups.....
    var followups = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'generalfollowups',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(followups).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.followupleadcounts = compleads.AssignedLeads[0].counts;
      } else {
        this.followupleadcounts = 0;
      }
    });

    var activeparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'active',
      stage: '',
      stagestatus: '',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(activeparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.activecounts = compleads.AssignedLeads[0].counts;
      } else {
        this.activecounts = 0;
      }
    });

    //this is the count for touched.....
    var touchedparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'touched',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(touchedparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.touchedcounts = compleads.AssignedLeads[0].counts;
      } else {
        this.touchedcounts = 0;
      }
    });

    //this is the count for Active visists and second row cards data.........
    var activevisits = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: 'activevisits',
      stage: this.stagevalue,
      stagestatus: '3',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(activevisits).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.activevisitsCounts = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.activevisitsCounts = 0;
      }
    });

    //this is the count for nc........
    var paramcountnc = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: "NC",
      stagestatus: this.stagestatusval,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(paramcountnc).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.allschedulednc = compleads.AssignedLeads[0].counts;
      } else {
        this.allschedulednc = 0;
      }
    });

    //this is the count for usv.....
    var paramcountusv = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: "USV",
      stagestatus: '3',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(paramcountusv).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.allscheduledusv = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.allscheduledusv = 0;
      }
    });

    //this is the count for sv......
    var paramcountsv = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: "SV",
      stagestatus: '3',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(paramcountsv).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.allscheduledsv = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.allscheduledsv = 0;
      }
    });

    //this is the count for rsv......
    var paramcountrsv = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: "RSV",
      stagestatus: '3',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(paramcountrsv).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.allscheduledrsv = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.allscheduledrsv = 0;
      }
    });

    //this is the count for fn.....
    var todayscheduledfn = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: "Final Negotiation",
      stagestatus: '3',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(todayscheduledfn).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.allscheduledfn = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.allscheduledfn = 0;
      }
    });

    //this is the count for closed.....
    var bookedvisit = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Deal Closed',
      stagestatus: this.stagestatusval,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(bookedvisit).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.booked = compleads.AssignedLeads[0].counts;
      } else {
        this.booked = 0;
      }
    });

    //this is the count for booking request.......
    var bookingvisit = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Deal Closing Requested',
      stagestatus: this.stagestatusval,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(bookingvisit).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.bookingrequest = compleads.AssignedLeads[0].counts;
      } else {
        this.bookingrequest = 0;
      }
    });

    //this is the count for rejected.........
    var rejectbooked = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: '',
      stage: 'Closing Request Rejected',
      stagestatus: '',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(rejectbooked).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.rejected = compleads.AssignedLeads[0].counts;
      } else {
        this.rejected = 0;
      }
    });

    //here i get the junk leads counts.......
    var junkleads = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkleads',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(junkleads).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkleadsCount = compleads.AssignedLeads[0].counts;
      } else {
        this.junkleadsCount = 0;
      }
    });

    let stagestatus = (this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null) ? '' : '3';
    var allvisits = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: 'allvisits',
      stage: this.stagevalue,
      stagestatus: stagestatus,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(allvisits).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.allVisitsTotalcounts = compleads.AssignedLeads[0].Uniquee_counts;
      }
    });

    //here i get the junk visits counts..........
    let stagestatus1 = ((this.fromdate == undefined || this.fromdate == null || this.fromdate == '') || (this.todate == undefined || this.todate == null || this.todate == '')) ? '' : '3'
    var junkvisit = {
      visitedfrom: this.fromdate,
      visitedto: this.todate,
      statuss: 'junkvisits',
      stage: this.stagevalue,
      stagestatus: stagestatus1,
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(junkvisit).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsCount = compleads.AssignedLeads[0].counts;
      } else {
        this.junkvisitsCount = 0;
      }
    });


    //this is the count for today's scheldue count  and executive's scheldue table
    var todayscheduled = {
      datefrom: this.todaysdateforcompare,
      dateto: this.todaysdateforcompare,
      statuss: 'scheduledtoday',
      stage: "",
      stagestatus: '',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(todayscheduled).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads['status'] == 'True') {
        this.todayscheduled = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.todayscheduled = 0;
      }
    });

    //this is the count for today's scheldue usv count
    var todayscheduledusv = {
      datefrom: this.todaysdateforcompare,
      dateto: this.todaysdateforcompare,
      statuss: 'scheduledtoday',
      stage: "USV",
      stagestatus: '',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(todayscheduledusv).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads['status'] == 'True') {
        this.todayscheduledusv = compleads.AssignedLeads[0].counts;
      } else {
        this.todayscheduledusv = 0;
      }
    });

    //this is the count for today's scheldue sv count
    var todayscheduledsv = {
      datefrom: this.todaysdateforcompare,
      dateto: this.todaysdateforcompare,
      statuss: 'scheduledtoday',
      stage: "SV",
      stagestatus: '',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(todayscheduledsv).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.todayscheduledsv = compleads.AssignedLeads[0].counts;
      } else {
        this.todayscheduledsv = 0;
      }
    });

    //this is the count for rsv
    var todayscheduledrsv = {
      datefrom: this.todaysdateforcompare,
      dateto: this.todaysdateforcompare,
      statuss: 'scheduledtoday',
      stage: "RSV",
      stagestatus: '',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(todayscheduledrsv).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.todayscheduledrsv = compleads.AssignedLeads[0].counts;
      } else {
        this.todayscheduledrsv = 0;
      }
    });

    //this is the count for fn
    var todayscheduledFn = {
      datefrom: this.todaysdateforcompare,
      dateto: this.todaysdateforcompare,
      statuss: 'scheduledtoday',
      stage: "Final Negotiation",
      stagestatus: '',
      loginuser: this.userid,
    }
    this._sharedservice.assignedLeadsCPCount(todayscheduledFn).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads['status'] == 'True') {
        this.todayscheduledfn = compleads.AssignedLeads[0].counts;
      } else {
        this.todayscheduledfn = 0;
      }
    });

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

  cpchange(vals) {
    ClientDashboardComponent.count = 0;
    this.filterLoader = true;
    this.execid = vals.target.value;
    this.execname = vals.target.options[vals.target.options.selectedIndex].text;
    let selectedCp = this.listOfCps.filter((cp) => {
      return cp.client_id == this.execid;
    });
    if (selectedCp && selectedCp[0]) {
      localStorage.setItem('cpcontrollerName', selectedCp[0].client_controller);
    }
    this.router.navigate(['/client-dash'], {
      queryParams: {
        execid: this.execid,
        execname: this.execname
      },
      queryParamsHandling: 'merge',
    });
  }

  //to filter the active execiyives.
  checkActive(event) {
    const isChecked = (event.target as HTMLInputElement).checked ? (event.target as HTMLInputElement).checked : event;
    if (isChecked == true) {
      this.executiveOverdueInfo = this.executiveOverdueInfo.filter((exec) => exec.visits_reg_status == '1');
      this.executiveOverdueInfo = this.executiveOverdueInfo.filter((exec) => {
        return exec['counts']['0']['All_Visits'] > 0
      })
    } else {
      this.executiveOverdueInfo = this.copyOfExecutiveOverdueInfo;
    }
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

  refresh() {
    $('#cp_dropdown').dropdown('clear');
    $('#team_dropdown').dropdown('clear');
    if (this.listOfCps) {
      this.execid = this.listOfCps[0].client_id;
      this.execname = this.listOfCps[0].client_name;
    }
    // this.getCpList();
    this.router.navigate(['/client-dash'], {
      queryParams: {
        allvisits: 1,
        from: '',
        to: '',
        execid: this.execid,
        execname: this.execname,
        dashtype: 'dashboard',
      }
    });
  }

  loadmoreForOverdues() {
    const limit = ClientDashboardComponent.count += 100;
    var overduesdata = {
      limit: limit,
      limitrows: 100,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: '',
      stagestatus: this.stagestatusval,
      loginuser: this.userid,
    }
    if (this.overdueslists.length < this.overduescounts) {
      this._sharedservice.assignedLeadsCPCount(overduesdata).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.overdueslists = this.overdueslists.concat(compleads.AssignedLeads);
        }
      });
    }
  }

  underlinedRow: number | null = null;
  underlineName(underline: boolean, index: number): void {
    this.underlinedRow = underline ? index : null;
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
