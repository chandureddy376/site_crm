import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { mandateservice } from '../../mandate.service';
import { sharedservice } from '../../shared.service';
import * as moment from 'moment';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-today-dashboard',
  templateUrl: './today-dashboard.component.html',
  styleUrls: ['./today-dashboard.component.css']
})
export class TodayDashboardComponent implements OnInit {

  filterLoader: boolean = true;
  private isCountdownInitialized: boolean;
  routeparams: any;
  fromdate: any;
  todate: any;
  rmid: any;
  execid: any;
  execname: any;
  propertyid: any;
  propertyname: any;
  static count: number;
  mandateprojects: any;
  copyofmandateprojects: any;
  propertyfilterview: boolean = false;
  searchTerm: string = '';
  copyOfExecutiveOverdueInfo: any;
  mandateexecutives: any;
  copymandateexecutives: any;
  searchTerm_executive: string = '';
  roleid: any;
  userid: any;
  departid: any;
  role_type: any;
  source: any;
  sourcelist: any;
  copyofsources: any;
  searchTerm_source: string = '';
  sourceFilter: boolean = false;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  executivefilterview: boolean = false;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  selectedCategory: any = '';
  callerleads: any;
  username: any;
  mandateProperty_ID: any;
  leadstatusVisits: any;
  selectedLeadStatus: string;
  currentDate = new Date();
  todaysdate: any;
  scheduledvisitscount: number = 0;
  scheduledUSVvisitscount: number = 0;
  scheduledRSVvisitscount: number = 0;
  scheduledFNvisitscount: number = 0;
  todaysVisitedcounts: number = 0;
  todaysUSVVisitedcounts: number = 0;
  todaysRSVVisitedcounts: number = 0;
  todaysFNVisitedcounts: number = 0;
  upcomingvisits: number = 0;
  upcomingusvvisits: number = 0;
  upcomingrsvvisits: number = 0;
  upcomingFNvisits: number = 0;
  calledLead: any;
  selectedRecordExec: any;
  audioList: any;
  onRecordExecList: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _mandateservice: mandateservice,
    private _sharedservice: sharedservice,
    public datepipe: DatePipe) {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
      $('.ui.label.fluid.dropdown').dropdown({
        useLabels: false
      });
    }, 1000);
    this.route.queryParams.subscribe((data) => {
      this.routeparams = data;
    })
  }

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.username = localStorage.getItem('Name');
    this.departid = localStorage.getItem('Department');
    this.role_type = localStorage.getItem('role_type');
    this.mandateProperty_ID = localStorage.getItem('property_ID');

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

    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }

    this.mandateprojectsfetch();
    if (this.roleid == 1 || this.roleid == '2' || this.role_type == '1' || this.roleid == '50013' || this.roleid == '50014') {
      this.getsourcelist();
      this.getmandateExecutives()
    }
    this.getleadsdata();

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resetScroll();
    }, 0)
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
    this.hoverSubscription.unsubscribe();
  }

  getsourcelist() {
    if (this.roleid == 1 || this.roleid == '2') {
      this._sharedservice.sourcelist().subscribe(sources => {
        this.sourcelist = sources;
        this.copyofsources = sources;
      })
    }
  }

  mandateprojectsfetch() {
    this._mandateservice.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
        this.copyofmandateprojects = mandates['Properties'];
      }
    });
  }

  getmandateExecutives() {
    if (this.role_type != 1) {
      this._mandateservice.fetchmandateexecutuvesforreassign(this.propertyid, '', '', '', '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateexecutives = executives['mandateexecutives'];
          this.copymandateexecutives = executives['mandateexecutives'];
        }
      });
    } else {
      this._mandateservice.fetchmandateexecutuvesforreassign(this.mandateProperty_ID, 2, '', '', this.userid).subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateexecutives = executives['mandateexecutives'];
          this.copymandateexecutives = executives['mandateexecutives'];
        }
      });
    }
  }

  getleadsdata() {
    if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    }
    this.filterLoader = true;
    TodayDashboardComponent.count = 0;
    this.route.queryParams.subscribe((paramss) => {
      // Updated Using Strategy
      this.propertyid = paramss['property'];
      this.propertyname = paramss['propname'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.source = paramss['source'];
      this.selectedCategory = paramss['category'];
      this.leadstatusVisits = paramss['visits'];

      setTimeout(() => {
        this.detailsPageRedirection();
        this.resetScroll();
      }, 0);

      if (this.selectedCategory == undefined || this.selectedCategory == null || this.selectedCategory == '') {
        this.selectedCategory = 'Scheduled Visits';
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

      if (this.source == '' || this.source == null || this.source == undefined) {
        this.sourceFilter = false;
      } else {
        this.sourceFilter = true;
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

      if ((this.fromdate == '' || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined)) {
        this.fromdate = '';
        this.todate = '';
      }

      this.batch1trigger();
      if (this.selectedCategory == 'Scheduled USV Visits' || this.selectedCategory == 'Scheduled RSV Visits' || this.selectedCategory == 'Scheduled FN Visits' || this.selectedCategory == 'Scheduled Visits') {
        this.fetchScheduledVisits();
      } else if (this.selectedCategory == 'Today USV Visited' || this.selectedCategory == 'Today RSV Visited' || this.selectedCategory == 'Today FN Visited' || this.selectedCategory == 'Today Visited') {
        this.fetchTodayVisited();
      } else if (this.selectedCategory == 'Upcoming USV Visits' || this.selectedCategory == 'Upcoming RSV Visits' || this.selectedCategory == 'Upcoming FN Visits' || this.selectedCategory == 'Upcoming Visits') {
        this.fetchUpcomingVisits();
      }

    });
  }

  getCategoryLeads(type) {
    this.selectedCategory = type;
    this.router.navigate([], {
      queryParams: {
        category: type
      }, queryParamsHandling: 'merge'
    })
  }

  batch1trigger() {
    var curmonth = this.currentDate.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    var curday = this.currentDate.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    // Scheduled visits Counts Fetch
    var scheduled = {
      datefrom: this.todaysdate,
      dateto: this.todaysdate,
      statuss: 'scheduledtoday',
      stage: '',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(scheduled).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.scheduledvisitscount = compleads['AssignedLeads'][0].Uniquee_counts;
      } else {
        this.scheduledvisitscount = 0;
      }
    });

    var usvscheduled = {
      datefrom: this.todaysdate,
      dateto: this.todaysdate,
      statuss: 'scheduledtoday',
      stage: 'USV',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(usvscheduled).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.scheduledUSVvisitscount = compleads['AssignedLeads'][0].Uniquee_counts;
      } else {
        this.scheduledUSVvisitscount = 0;
      }
    });

    var rsvscheduled = {
      datefrom: this.todaysdate,
      dateto: this.todaysdate,
      statuss: 'scheduledtoday',
      stage: 'RSV',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(rsvscheduled).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.scheduledRSVvisitscount = compleads['AssignedLeads'][0].Uniquee_counts;
      } else {
        this.scheduledRSVvisitscount = 0;
      }
    });

    var fnscheduled = {
      datefrom: this.todaysdate,
      dateto: this.todaysdate,
      statuss: 'scheduledtoday',
      stage: 'Final Negotiation',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(fnscheduled).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.scheduledFNvisitscount = compleads['AssignedLeads'][0].Uniquee_counts;
      } else {
        this.scheduledFNvisitscount = 0;
      }
    });
    // Scheduled visits Counts Fetch

    // Todays Visited Counts Fetch
    var todayVisitedparam = {
      datefrom: '',
      dateto: '',
      visitedfrom: this.todaysdate,
      visitedto: this.todaysdate,
      statuss: 'allvisits',
      stage: '',
      stagestatus: '3',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(todayVisitedparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.todaysVisitedcounts = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.todaysVisitedcounts = 0;
      }
    });

    var todayusvVisitedparam = {
      datefrom: '',
      dateto: '',
      visitedfrom: this.todaysdate,
      visitedto: this.todaysdate,
      statuss: 'allvisits',
      stage: 'USV',
      stagestatus: '3',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(todayusvVisitedparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.todaysUSVVisitedcounts = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.todaysUSVVisitedcounts = 0;
      }
    });

    var todayrsvVisitedparam = {
      datefrom: '',
      dateto: '',
      visitedfrom: this.todaysdate,
      visitedto: this.todaysdate,
      statuss: 'allvisits',
      stage: 'RSV',
      stagestatus: '3',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(todayrsvVisitedparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.todaysRSVVisitedcounts = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.todaysRSVVisitedcounts = 0;
      }
    });

    var todayfnVisitedparam = {
      datefrom: '',
      dateto: '',
      visitedfrom: this.todaysdate,
      visitedto: this.todaysdate,
      statuss: 'allvisits',
      stage: 'Final Negotiation',
      stagestatus: '3',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(todayfnVisitedparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.todaysFNVisitedcounts = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.todaysFNVisitedcounts = 0;
      }
    });
    // Todays Visited Counts Fetch

    // Upcoming Visits Counts Fetch
    var upcomingusvvisit = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'upcomingvisit',
      stage: '',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(upcomingusvvisit).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.upcomingvisits = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.upcomingvisits = 0;
      }
    });

    var upcomingvisit = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'upcomingvisit',
      stage: 'USV',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(upcomingvisit).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.upcomingusvvisits = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.upcomingusvvisits = 0;
      }
    });

    var upcomingrsvvisit = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'upcomingvisit',
      stage: 'RSV',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(upcomingrsvvisit).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.upcomingrsvvisits = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.upcomingrsvvisits = 0;
      }
    });

    var upcomingfnvisit = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'upcomingvisit',
      stage: 'Final Negotiation',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(upcomingfnvisit).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.upcomingFNvisits = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.upcomingFNvisits = 0;
      }
    });
    // Upcoming Visits Counts Fetch
  }

  fetchScheduledVisits() {

    var curmonth = this.currentDate.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    var curday = this.currentDate.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    let stage;
    if (this.selectedCategory == 'Scheduled USV Visits') {
      stage = 'USV';
    } else if (this.selectedCategory == 'Scheduled RSV Visits') {
      stage = 'RSV';
    } else if (this.selectedCategory == 'Scheduled FN Visits') {
      stage = 'Final Negotation';
    } else {
      stage = '';
    }

    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.todaysdate,
      dateto: this.todaysdate,
      statuss: 'scheduledtoday',
      stage: stage,
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this.filterLoader = true;
    this._mandateservice.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  fetchTodayVisited() {
    var curmonth = this.currentDate.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    var curday = this.currentDate.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    let stage;
    if (this.selectedCategory == 'Today USV Visited') {
      stage = 'USV';
    } else if (this.selectedCategory == 'Today RSV Visited') {
      stage = 'RSV';
    } else if (this.selectedCategory == 'Today FN Visited') {
      stage = 'Final Negotation';
    } else {
      stage = '';
    }

    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: '',
      dateto: '',
      visitedfrom: this.todaysdate,
      visitedto: this.todaysdate,
      statuss: 'allvisits',
      stage: stage,
      stagestatus: '3',
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];

    });
  }

  fetchUpcomingVisits() {
    let stage;
    if (this.selectedCategory == 'Upcoming USV Visits') {
      stage = 'USV';
    } else if (this.selectedCategory == 'Upcoming RSV Visits') {
      stage = 'RSV';
    } else if (this.selectedCategory == 'Upcoming FN Visits') {
      stage = 'Final Negotation';
    } else {
      stage = '';
    }

    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'upcomingvisit',
      stage: stage,
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //this is code for filter for direct and assigned
  leadStatus(event) {
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
      this.router.navigate([], {
        queryParams: {
          visits: '1'
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  loadMoreassignedleads() {
    var curmonth = this.currentDate.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    var curday = this.currentDate.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    let stage;
    if (this.selectedCategory == 'Scheduled USV Visits' || this.selectedCategory == 'Today USV Visited' || this.selectedCategory == 'Upcoming USV Visits') {
      stage = 'USV';
    } else if (this.selectedCategory == 'Scheduled RSV Visits' || this.selectedCategory == 'Today RSV Visited' || this.selectedCategory == 'Upcoming RSV Visits') {
      stage = 'RSV';
    } else if (this.selectedCategory == 'Scheduled FN Visits' || this.selectedCategory == 'Today FN Visited' || this.selectedCategory == 'Upcoming FN Visits') {
      stage = 'Final Negotation';
    } else {
      stage = '';
    }

    let totalcounts;
    if (this.selectedCategory == 'Scheduled Visits') {
      totalcounts = this.scheduledvisitscount;
    } else if (this.selectedCategory == 'Scheduled USV Visits') {
      totalcounts = this.scheduledUSVvisitscount;
    } else if (this.selectedCategory == 'Scheduled RSV Visits') {
      totalcounts = this.scheduledRSVvisitscount;
    } else if (this.selectedCategory == 'Scheduled FN Visits') {
      totalcounts = this.scheduledFNvisitscount;
    } else if (this.selectedCategory == 'Today Visited') {
      totalcounts = this.todaysVisitedcounts;
    } else if (this.selectedCategory == 'Today USV Visited') {
      totalcounts = this.todaysUSVVisitedcounts;
    } else if (this.selectedCategory == 'Today RSV Visited') {
      totalcounts = this.todaysRSVVisitedcounts;
    } else if (this.selectedCategory == 'Today FN Visited') {
      totalcounts = this.todaysFNVisitedcounts;
    } else if (this.selectedCategory == 'Upcoming Visits') {
      totalcounts = this.upcomingvisits;
    } else if (this.selectedCategory == 'Upcoming USV Visits') {
      totalcounts = this.upcomingusvvisits;
    } else if (this.selectedCategory == 'Upcoming RSV Visits') {
      totalcounts = this.upcomingrsvvisits;
    } else if (this.selectedCategory == 'Upcoming FN Visits') {
      totalcounts = this.upcomingFNvisits;
    }

    if (this.selectedCategory == 'Scheduled USV Visits' || this.selectedCategory == 'Scheduled RSV Visits' || this.selectedCategory == 'Scheduled FN Visits' || this.selectedCategory == 'Scheduled Visits') {
      var param = {
        limit: 0,
        limitrows: 30,
        datefrom: this.todaysdate,
        dateto: this.todaysdate,
        statuss: 'scheduledtoday',
        stage: stage,
        stagestatus: '',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: this.source,
        visits: this.leadstatusVisits,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < totalcounts) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(param).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Today USV Visited' || this.selectedCategory == 'Today RSV Visited' || this.selectedCategory == 'Today FN Visited' || this.selectedCategory == 'Today Visited') {
      var param1 = {
        limit: 0,
        limitrows: 30,
        datefrom: '',
        dateto: '',
        visitedfrom: this.todaysdate,
        visitedto: this.todaysdate,
        statuss: 'allvisits',
        stage: stage,
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        visits: this.leadstatusVisits,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < totalcounts) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(param1).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Upcoming USV Visits' || this.selectedCategory == 'Upcoming RSV Visits' || this.selectedCategory == 'Upcoming FN Visits' || this.selectedCategory == 'Upcoming Visits') {
      var param2 = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'upcomingvisit',
        stage: stage,
        stagestatus: '',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: this.source,
        visits: this.leadstatusVisits,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < totalcounts) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(param2).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    }

  }

  //property selection filter
  onCheckboxChange(property) {

    TodayDashboardComponent.count = 0;
    if (property != null || property != '' || property != undefined) {
      this.propertyfilterview = true;
      this.propertyname = property.property_info_name;
      this.propertyid = property.property_idfk;
      this.execid = '';
      this.execname = '';
      $("input[name='executiveFilter']").prop("checked", false);
      if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
        this.getmandateExecutives();
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

  //executives selection  filter
  onCheckboxExecutiveChange() {
    TodayDashboardComponent.count = 0;
    var checkid = $("input[name='executiveFilter']:checked").map(function () {
      return this.value;
    }).get().join(',');

    let filteredExexIds;
    filteredExexIds = checkid.split(',');

    let filteredExecName;
    filteredExecName = this.copymandateexecutives.filter((da) => filteredExexIds.some((prop) => {
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
      this.mandateexecutives = this.copymandateexecutives.filter(exec =>
        exec.name.toLowerCase().includes(this.searchTerm_executive.toLowerCase())
      );
    } else {
      this.mandateexecutives = this.copymandateexecutives
    }

  }

  //source filter
  onCheckboxChangesource() {
    TodayDashboardComponent.count = 0;
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
    }

  }

  // Filter projects based on search 
  filtersource(): void {
    if (this.searchTerm_source != '') {
      this.sourcelist = this.copyofsources.filter(project =>
        project.source.toLowerCase().includes(this.searchTerm_source.toLowerCase())
      );
    } else {
      this.sourcelist = this.copyofsources
    }

  }

  executiveclose() {
    $('#rm_dropdown').dropdown('clear');
    $("input[name='executiveFilter']").prop("checked", false);
    TodayDashboardComponent.count = 0;
    this.executivefilterview = false;
    this.execid = null;
    this.execname = null
    this.rmid = null;
    this.searchTerm_executive = '';
    this.mandateexecutives = this.copymandateexecutives;
    this.router.navigate([], {
      queryParams: {
        execid: null,
        execname: null
      },
      queryParamsHandling: 'merge',
    });
  }

  propertyclose() {
    $('#project_dropdown').dropdown('clear');
    $("input[name='propFilter']").prop("checked", false);
    this.propertyfilterview = false;
    TodayDashboardComponent.count = 0;
    this.propertyid = "";
    this.propertyname = "";
    this.searchTerm = '';
    if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
      this.getmandateExecutives();
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
    $('#source_dropdown').dropdown('clear');
    $("input[name='sourceFilter']").prop("checked", false);
    this.sourceFilter = false;
    TodayDashboardComponent.count = 0;
    this.source = "";
    this.searchTerm_source = '';
    this.sourcelist = this.copyofsources;
    this.router.navigate([], {
      queryParams: {
        source: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  refresh() {
    this.propertyid = '';
    this.propertyname = '';
    this.source = '';
    this.execid = '';
    this.execname = '';
    this.selectedLeadStatus = '';
    this.router.navigate(['/today-activity'], {
      queryParams: {
        from: '',
        to: '',
        dashtype: 'dashboard',
        category: this.selectedCategory
      }
    });
  }

  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  detailsPageRedirection() {
    localStorage.setItem('backLocation', 'scheduled');
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

  getexecutiveId(exec) {
    this.selectedRecordExec = exec.Exec_IDFK;
    this.getRecordListByLead();
  }
}
