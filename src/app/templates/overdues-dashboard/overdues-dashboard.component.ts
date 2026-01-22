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
  selector: 'app-overdues-dashboard',
  templateUrl: './overdues-dashboard.component.html',
  styleUrls: ['./overdues-dashboard.component.css'],
})
export class OverduesDashboardComponent implements OnInit {

  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;

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
  static count: number;
  executives: any;
  execname: any;
  todaysvisitedparam: any;
  yesterdaysvisitedparam: any;
  allvisitparam: any;
  last7daysparam: any;
  sevendaysdateforcompare: any;
  currentDate = new Date();
  todaysdate: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdayDateStore: any;
  tomorrowsdateforcompare: any;
  stagevalue: any;
  stagestatusval: any;
  stagestatusvaltext: any;
  stagestatus = false;
  username: any;
  datecustomfetch: any;
  withoutQueryParams$: Observable<boolean>;
  dateRange: Date[];
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
  followupsoverduesCount: number = 0;
  usvOverduesCount: number = 0;
  usvFixOverduesCount: number = 0;
  ncOverduesCount: number = 0;
  rsvOverduesCount: number = 0;
  fnOverduesCount: number = 0;
  rsvFixOverduesCount: number = 0;
  fnFixOverduesCount: number = 0;
  dealRequestedOverduesCount: number = 0;
  dealPendingOverduesCount: number = 0;
  source: any;
  sourcelist: any;
  copyofsources: any;
  searchTerm_source: string = '';
  sourceFilter: boolean = false;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  executivefilterview: boolean = false;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  selectedCategory: any = '';
  callerleads: any;
  mandateProperty_ID: any;
  roleTeam: any;
  selectedTeamType: any;
  selectedEXECUTIVES: any;
  selectedEXECUTIVEIDS: any;
  selectedMandateProp = '';
  reassignListExecutives: any;
  selectedAssignedleads: any;
  selectedLeadExecutiveIds: any;
  maxSelectedLabels: number = Infinity;
  randomCheckVal: any = '';
  filteredproject: any = '';
  selectedReassignTeamType: any = '';
  reassignedResponseInfo: any;
  calledLead: any;
  selectedRecordExec: any;
  audioList: any;
  onRecordExecList: any;
  reassignleadsCount: number = 0;
  isRestoredFromSession = false;

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
    // if (this._sharedservice.hasState) {
    //   // RESTORE
    //   this.callerleads = this._sharedservice.leads;
    //   OverduesDashboardComponent.count = this._sharedservice.page;

    //   setTimeout(() => {
    //     this.scrollContainer.nativeElement.scrollTop =
    //       this._sharedservice.scrollTop;
    //   }, 0);
    //   this.filterLoader = false;

    //   // setTimeout(()=>{
    //   //   this._sharedservice.hasState = false;
    //   // },5000)

    // } else {

    const savedState = sessionStorage.getItem('overdues_state');

    if (savedState) {
      const state = JSON.parse(savedState);
      this.isRestoredFromSession = true;
      this.selectedCategory = state.category;
      this.fromdate = state.fromdate;
      this.todate = state.todate;
      this.execid = state.execid;
      this.execname = state.execname
      this.propertyid = state.propertyid;
      this.propertyname = state.propertyname
      this.source = state.source;

      OverduesDashboardComponent.count = state.page;
      this.callerleads = state.leads;

      switch (state.dateFilterType) {
        case 'today':
          this.clicked1 = true;
          break;
        case 'yesterday':
          this.clicked2 = true;
          break;
        case 'last7':
          this.clicked3 = true;
          break;
        default:
          this.clicked = true;
      }

      if (this.selectedCategory == undefined || this.selectedCategory == null || this.selectedCategory == '') {
        this.selectedCategory = 'Followups';
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


      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = state.scrollTop;
      }, 0);
      this.filterLoader = false;
      // 🔴 IMPORTANT
      this.batch1trigger();
    }

    this.getleadsdata();
    // }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeNextActionDateRangePicker();
      // this.resetScroll();
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
    // OverduesDashboardComponent.count = 0;
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
      this.todaysvisitedparam = paramss['todayvisited'];
      this.yesterdaysvisitedparam = paramss['yesterdayvisited'];
      this.allvisitparam = paramss['allvisits'];
      this.last7daysparam = paramss['last7']
      this.propertyid = paramss['property'];
      this.propertyname = paramss['propname'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.source = paramss['source'];
      this.selectedCategory = paramss['category'];

      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.detailsPageRedirection();
        this.resetScroll();
      }, 0);
      if (this.selectedCategory == undefined || this.selectedCategory == null || this.selectedCategory == '') {
        this.selectedCategory = 'Followups';
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

      if (this.todaysvisitedparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.clicked = false;
        this.clicked1 = true;
        this.clicked2 = false;
        this.clicked3 = false;
        this.filterLoader = false;
        var curmonth = this.currentDate.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentDate.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
        this.fromdate = this.todaysdate;
        this.todate = this.todaysdate;
        this.batch1trigger();
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
        this.batch1trigger();
      } else if (this.allvisitparam == '1') {
        this.filterLoader = true;
        this.clicked = true;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = false;
        this.batch1trigger();
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
        this.batch1trigger();
      }
      this.getOverdueLeadsData();

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

    if (this.fromdate == "" && this.todate == "" || this.fromdate == undefined && this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    this.followupsoverduesCount = 0;
    this.usvOverduesCount = 0;
    this.usvFixOverduesCount = 0;
    this.rsvOverduesCount = 0;
    this.rsvFixOverduesCount = 0;
    this.fnOverduesCount = 0;
    this.fnFixOverduesCount = 0;
    this.dealPendingOverduesCount = 0;
    this.dealRequestedOverduesCount = 0;

    //here we get follow up overdues count
    var generalfollowupparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Fresh',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(generalfollowupparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.followupsoverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.followupsoverduesCount = 0;
      }
    });

    //here we get nc overdues count
    var ncparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'NC',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(ncparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.ncOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.ncOverduesCount = 0;
      }
    });

    //here i get the usv fix overdues count
    var usvparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'USV',
      stagestatus: '1',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(usvparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.usvFixOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.usvFixOverduesCount = 0;
      }
    });

    //here i get the usv done overdues count
    var usvDoneparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'USV',
      stagestatus: '3',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(usvDoneparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.usvOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.usvOverduesCount = 0;
      }
    });

    //here i get the rsv fix overdues count
    var rsvparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'RSV',
      stagestatus: '1',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(rsvparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.rsvFixOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.rsvFixOverduesCount = 0;
      }
    });

    //here i get the rsv done overdues count
    var rsvdoneparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'RSV',
      stagestatus: '3',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(rsvdoneparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.rsvOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.rsvOverduesCount = 0;
      }
    });

    //here i get the fn fix overdues count
    var fnparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Final Negotiation',
      stagestatus: '1',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(fnparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.fnFixOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.fnFixOverduesCount = 0;
      }
    });

    //here i get the fn fix overdues count
    var fndoneparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Final Negotiation',
      stagestatus: '3',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(fndoneparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.fnOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.fnOverduesCount = 0;
      }
    });

    //here we get deal closing pending count
    var dealpenparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Deal Closing Pending',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(dealpenparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.dealPendingOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.dealPendingOverduesCount = 0;
      }
    });

    //here we get DEal Closing requested count
    var dealreqparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Deal Closing Requested',
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(dealreqparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.dealRequestedOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
      } else {
        this.dealRequestedOverduesCount = 0;
      }
    });

  }

  //to fetch overdues leads
  getOverdueLeadsData() {
    OverduesDashboardComponent.count = 0;
    this.filterLoader = true;

    let stageval: string = '';
    let stagestatusVal: string;

    if (this.selectedCategory == 'Followups') {
      stageval = 'Fresh';
      stagestatusVal = '';
    } else if (this.selectedCategory == 'USV Fix') {
      stageval = 'USV';
      stagestatusVal = '1';
    } else if (this.selectedCategory == 'NC') {
      stageval = 'NC';
      stagestatusVal = '';
    } else if (this.selectedCategory == 'USV Done') {
      stageval = 'USV';
      stagestatusVal = '3';
    } else if (this.selectedCategory == 'RSV Fix') {
      stageval = 'RSV';
      stagestatusVal = '1';
    } else if (this.selectedCategory == 'RSV Done') {
      stageval = 'RSV';
      stagestatusVal = '3';
    } else if (this.selectedCategory == 'FN Fix') {
      stageval = 'Final Negotiation';
      stagestatusVal = '1';
    } else if (this.selectedCategory == 'FN Done') {
      stageval = 'Final Negotiation';
      stagestatusVal = '3';
    } else if (this.selectedCategory == 'Deal Closing Pending') {
      stageval = 'Deal Closing Pending';
      stagestatusVal = '';
    } else if (this.selectedCategory == 'Deal Closing Requested') {
      stageval = 'Deal Closing Requested';
      stagestatusVal = '';
    }

    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: stageval,
      stagestatus: stagestatusVal,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //property selection filter
  onCheckboxChange(property) {

    OverduesDashboardComponent.count = 0;
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
    OverduesDashboardComponent.count = 0;
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
    OverduesDashboardComponent.count = 0;
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
    OverduesDashboardComponent.count = 0;
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
    OverduesDashboardComponent.count = 0;
    this.propertyid = "";
    this.propertyname = "";
    this.stagestatusval = "";
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
    OverduesDashboardComponent.count = 0;
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

  loadMoreassignedleads() {
    let limit;
    let countLoad;
    limit = OverduesDashboardComponent.count += 30;
    let stageval: string = '';
    let stagestatusVal: string;

    if (this.selectedCategory == 'Followups') {
      stageval = 'Fresh';
      stagestatusVal = '';
      countLoad = this.followupsoverduesCount;
    } else if (this.selectedCategory == 'USV Fix') {
      stageval = 'USV';
      stagestatusVal = '1';
      countLoad = this.usvFixOverduesCount;
    } else if (this.selectedCategory == 'NC') {
      stageval = 'NC';
      stagestatusVal = '';
      countLoad = this.ncOverduesCount;
    } else if (this.selectedCategory == 'USV Done') {
      stageval = 'USV';
      stagestatusVal = '3';
      countLoad = this.usvOverduesCount;
    } else if (this.selectedCategory == 'RSV Fix') {
      stageval = 'RSV';
      stagestatusVal = '1';
      countLoad = this.rsvFixOverduesCount;
    } else if (this.selectedCategory == 'RSV Done') {
      stageval = 'RSV';
      stagestatusVal = '3';
      countLoad = this.rsvOverduesCount;
    } else if (this.selectedCategory == 'FN Fix') {
      stageval = 'Final Negotiation';
      stagestatusVal = '1';
      countLoad = this.fnFixOverduesCount;
    } else if (this.selectedCategory == 'FN Done') {
      stageval = 'Final Negotiation';
      stagestatusVal = '3';
      countLoad = this.fnOverduesCount;
    } else if (this.selectedCategory == 'Deal Closing Pending') {
      stageval = 'Deal Closing Pending';
      stagestatusVal = '';
      countLoad = this.dealPendingOverduesCount;
    } else if (this.selectedCategory == 'Deal Closing Requested') {
      stageval = 'Deal Closing Requested';
      stagestatusVal = '';
      countLoad = this.dealRequestedOverduesCount;
    }

    var param = {
      limit: limit,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: stageval,
      stagestatus: stagestatusVal,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }

    if (this.callerleads.length < countLoad) {
      this.filterLoader = true;
      this._mandateservice.assignedLeads(param).subscribe(compleads => {
        this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        this.filterLoader = false;
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

  getexecutiveId(exec) {
    this.selectedRecordExec = exec.Exec_IDFK;
    this.getRecordListByLead();
  }

  //here Re-assign Code starts.
  onclickReAssign() {
    this.roleTeam = '';

    if (this.selectedCategory == 'Followups') {
      this.reassignleadsCount = this.followupsoverduesCount;
    } else if (this.selectedCategory == 'USV Fix') {
      this.reassignleadsCount = this.usvFixOverduesCount;
    } else if (this.selectedCategory == 'NC') {
      this.reassignleadsCount = this.ncOverduesCount;
    } else if (this.selectedCategory == 'USV Done') {
      this.reassignleadsCount = this.usvOverduesCount;
    } else if (this.selectedCategory == 'RSV Fix') {
      this.reassignleadsCount = this.rsvFixOverduesCount;
    } else if (this.selectedCategory == 'RSV Done') {
      this.reassignleadsCount = this.rsvOverduesCount;
    } else if (this.selectedCategory == 'FN Fix') {
      this.reassignleadsCount = this.fnFixOverduesCount;
    } else if (this.selectedCategory == 'FN Done') {
      this.reassignleadsCount = this.fnOverduesCount;
    } else if (this.selectedCategory == 'Deal Closing Pending') {
      this.reassignleadsCount = this.dealPendingOverduesCount;
    } else if (this.selectedCategory == 'Deal Closing Requested') {
      this.reassignleadsCount = this.dealRequestedOverduesCount;
    }

    this.selectedEXECUTIVES = [];
    // this.reassignTeam('mandate');

    this.selectedTeamType = 'mandate';
    this.selectedMandateProp = '';
    $('#mandate_dropdown').dropdown('clear');
    $('#team_dropdown').dropdown('clear');
    $('#mandateExec_dropdown').dropdown('clear');
    $('#property_dropdown').dropdown('clear');

    this.mandateprojectsfetch();
    this.selectedMandateProp = '16793';
    this._mandateservice.fetchmandateexecutuves(16793, '', this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.reassignListExecutives = executives['mandateexecutives'];
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
      return lead.ExecId;
    })

    this.selectedLeadExecutiveIds = selectedLeadExecutiveIds.join(',');

    if (this.selectedEXECUTIVES && this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
      $('#customSwitch5').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch5').prop('checked', false);
      this.randomCheckVal = '';
    }
  }

  reassignPropChange(event) {
    this.selectedMandateProp = event.target.value;
    if (this.mandateprojects) {
      let filteredproject = this.mandateprojects.filter((da) => da.property_idfk == event.target.value);
      if (filteredproject && filteredproject[0]) {
        this.filteredproject = filteredproject[0];
      }
    }
    if (this.selectedTeamType == 'mandate') {
      this._mandateservice.fetchmandateexecutuves(this.selectedMandateProp, this.selectedReassignTeamType, this.roleTeam, '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.reassignListExecutives = executives['mandateexecutives'];
        }
      });
    }

    this.selectedEXECUTIVEIDS = [];
    this.selectedEXECUTIVES = [];
  }

  //heree we get the selected assign executive team type
  reassignExecTeam(event) {
    this.roleTeam = event.target.options[event.target.options.selectedIndex].value;
    this._mandateservice.fetchmandateexecutuves(this.selectedMandateProp, this.selectedReassignTeamType, this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.reassignListExecutives = executives['mandateexecutives'];
      }
    });
    $('#mandateExec_dropdown').dropdown('clear');
  };

  //here we get th list of selected rmid's
  reAssignexecutiveSelect(event) {
    this.selectedEXECUTIVEIDS = this.selectedEXECUTIVES.map((exec) => exec.id);
    if (this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
      $('#customSwitch5').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch5').prop('checked', false);
      this.randomCheckVal = '';
    }
  }

  //here on clicking random assign the leads will be divided equally assigned 
  checkRandom(event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked == true) {
      this.randomCheckVal = 1;
    } else {
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
      $('#retailExec_dropdown').removeAttr("style");
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

    if (this.filteredproject && this.filteredproject.crm == '2') {
      this.filterLoader = true;
      this._mandateservice.ranavleadreassign(param).subscribe((success) => {
        this.filterLoader = false;
        if (success.status == "True") {
          $('#closereassignmodal').click();
          swal({
            title: 'Assigned Successfully',
            type: 'success',
            confirmButtonText: 'Show Details'
          }).then(() => {
            this.reassignedResponseInfo = success['assignedleads'];
            $('#reassign_leads_detail').click();
          })
          $('#leadcount_dropdown').dropdown('clear');
          $('#team_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          $('#mandate_dropdown').dropdown('clear');
          $('#mandateExec_dropdown').dropdown('clear');
          this.selectedMandateProp = '';
          this.randomCheckVal = '';
          this.selectedEXECUTIVEIDS = [];
          this.selectedEXECUTIVES = [];
          this.maxSelectedLabels = Infinity;
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
      this.filterLoader = true;
      // if (this.followupsoverduesParam == 1 || this.ncOverduesParam == 1 || (this.usvOverduesParam == 1 && this.stagestatusval == 1)) {
      this._mandateservice.leadreassign(param).subscribe((success) => {
        this.filterLoader = false;
        if (success.status == "True") {
          $('#closereassignmodal').click();
          swal({
            title: 'Assigned Successfully',
            type: 'success',
            confirmButtonText: 'Show Details'
          }).then(() => {
            this.reassignedResponseInfo = success['assignedleads'];
            $('#reassign_leads_detail').click();
          })
          $('#leadcount_dropdown').dropdown('clear');
          $('#team_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          $('#mandate_dropdown').dropdown('clear');
          $('#mandateExec_dropdown').dropdown('clear');
          this.selectedMandateProp = '';
          this.randomCheckVal = '';
          this.selectedEXECUTIVEIDS = [];
          this.selectedEXECUTIVES = [];
          this.maxSelectedLabels = Infinity;
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
      // } else {
      //   this._mandateservice.visitAssign(param).subscribe((success) => {
      //     this.filterLoader = false;
      //     if (success.status == "True") {
      //       $('#closereassignmodal').click();
      //       swal({
      //         title: 'Assigned Successfully',
      //         type: 'success',
      //         confirmButtonText: 'Show Details'
      //       }).then(() => {
      //         this.reassignedResponseInfo = success['assignedleads'];
      //         $('#reassign_leads_detail').click();
      //       })
      //       $('#leadcount_dropdown').dropdown('clear');
      //       $('#team_dropdown').dropdown('clear');
      //       $('#property_dropdown').dropdown('clear');
      //       $('#mandate_dropdown').dropdown('clear');
      //       $('#mandateExec_dropdown').dropdown('clear');
      //       this.selectedMandateProp = '';
      //       this.randomCheckVal = '';
      //       this.selectedEXECUTIVEIDS = [];
      //       this.selectedEXECUTIVES = [];
      //       this.maxSelectedLabels = Infinity;
      //     } else {
      //       swal({
      //         title: 'Authentication Failed!',
      //         text: 'Please try again',
      //         type: 'error',
      //         confirmButtonText: 'OK'
      //       })
      //     }
      //   }, (err) => {
      //     console.log("Connection Failed")
      //   });
      // }
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

  getReassignLeadsData(limitR) {
    this.filterLoader = true;
    let param;
    let stageval: string = '';
    let stagestatusVal: string;

    if (this.selectedCategory == 'Followups') {
      stageval = 'Fresh';
      stagestatusVal = '';
    } else if (this.selectedCategory == 'USV Fix') {
      stageval = 'USV';
      stagestatusVal = '1';
    } else if (this.selectedCategory == 'NC') {
      stageval = 'NC';
      stagestatusVal = '';
    } else if (this.selectedCategory == 'USV Done') {
      stageval = 'USV';
      stagestatusVal = '3';
    } else if (this.selectedCategory == 'RSV Fix') {
      stageval = 'RSV';
      stagestatusVal = '1';
    } else if (this.selectedCategory == 'RSV Done') {
      stageval = 'RSV';
      stagestatusVal = '3';
    } else if (this.selectedCategory == 'FN Fix') {
      stageval = 'Final Negotiation';
      stagestatusVal = '1';
    } else if (this.selectedCategory == 'FN Done') {
      stageval = 'Final Negotiation';
      stagestatusVal = '3';
    } else if (this.selectedCategory == 'Deal Closing Pending') {
      stageval = 'Deal Closing Pending';
      stagestatusVal = '';
    } else if (this.selectedCategory == 'Deal Closing Requested') {
      stageval = 'Deal Closing Requested';
      stagestatusVal = '';
    }

    param = {
      limit: 0,
      limitrows: limitR,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: stageval,
      stagestatus: stagestatusVal,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }

    this._mandateservice.assignedLeads(param).subscribe(compleads => {
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

  backToWelcome() {
    $('.modal-backdrop').closest('div').remove();
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
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

  copyToClipboard(text) {
    if ((navigator as any).clipboard) {
      (navigator as any).clipboard.writeText(text).then(() => {
        console.log('Number copied to clipboard!');
      }).catch(() => {
        console.log('Failed to copy number.');
      });
    }
  }

  refresh() {
    this.propertyid = '';
    this.propertyname = '';
    this.source = '';
    this.execid = '';
    this.execname = '';
    console.log(this.selectedCategory)
    // this.router.navigateByUrl('/overdues-dashboard', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/overdues-dashboard'], {
      queryParams: {
        todayvisited: 1,
        from: '',
        to: '',
        dashtype: 'dashboard',
        category: this.selectedCategory
      }
    });
    // });
  }

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
          this.router.navigate(['/overdues-dashboard'], {
            queryParams: {
              allvisits: 1,
              from: this.fromdate,
              to: this.todate,
              dashtype: 'dashboard',
              category: this.selectedCategory,
              propname: this.propertyname,
              property: this.propertyid,
              execid: this.execid,
              execname: this.execname,
              source: this.source
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

  detailsPageRedirection() {
    localStorage.setItem('backLocation', 'overdues');
  }

  redirectTo(lead) {
    console.log(lead);
    let dateFilterType = 'custom';

    if (this.clicked1) dateFilterType = 'today';
    else if (this.clicked2) dateFilterType = 'yesterday';
    else if (this.clicked3) dateFilterType = 'last7';

    localStorage.setItem('backLocation', '');
    // save data
    this._sharedservice.leads = this.callerleads;
    this._sharedservice.page = OverduesDashboardComponent.count;
    this._sharedservice.scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this._sharedservice.hasState = true;

    const state = {
      category: this.selectedCategory,
      fromdate: this.fromdate,
      todate: this.todate,
      execid: this.execid,
      propertyid: this.propertyid,
      source: this.source,
      page: OverduesDashboardComponent.count,
      scrollTop: this.scrollContainer.nativeElement.scrollTop,
      leads: this.callerleads,
      execname: this.execname,
      propertyname: this.propertyname,
      dateFilterType
    };

    sessionStorage.setItem('overdues_state', JSON.stringify(state));

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