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
  selector: 'app-stage-dashboard',
  templateUrl: './stage-dashboard.component.html',
  styleUrls: ['./stage-dashboard.component.css']
})
export class StageDashboardComponent implements OnInit {

  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _mandateservice: mandateservice,
    private _sharedservice: sharedservice,
    public datepipe: DatePipe
  ) {
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
  sevendaysdateforcompare: any;
  currentDate = new Date();
  todaysdate: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdayDateStore: any;
  tomorrowsdateforcompare: any;
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
  receivedFromDate: any;
  receivedToDate: any;
  receivedDatefilterview: boolean = false;
  leadRecStart: moment.Moment | null = null;
  leadRecEnd: moment.Moment | null = null;
  datetype: any;
  leadstatusVisits: any;
  selectedLeadStatus: string;
  reassignleadsCount: number = 0;
  usvParam: any;
  rsvParam: any;
  fnParam: any;
  fixedCount: number = 0;
  DoneCount: number = 0;
  fixedOverduesCount: number = 0;
  DoneOverduesCount: number = 0;
  junkFixedCount: number = 0;
  junkDoneCount: number = 0;
  priorityName: any;
  priorityFilter: boolean = false;
  priorityType: any;
  assignedRm: any;
  assignedOnStart: moment.Moment | null = null;
  assignedOnEnd: moment.Moment | null = null;
  visitedOnStart: moment.Moment | null = null;
  visitedOnEnd: moment.Moment | null = null;
  assignedOnDateRange: Date[];
  assignedOnDatefilterview: boolean = false;
  assignedFrom: any;
  assignedTo: any;
  visitedDatefilterview: boolean = false;
  visitedFrom: any;
  visitedTo: any;

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

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    let todaysDate = new Date();
    var curday = todaysDate.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = todaysDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

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
      this.initializeNextActionDateRangePicker();
      this.initializeLeadReceivedDateRangePicker();
      this.initializeAssignedOnDateRangePicker();
      this.initializeVisitedOnDateRangePicker();
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
    StageDashboardComponent.count = 0;
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
      this.receivedFromDate = paramss['receivedFrom'];
      this.receivedToDate = paramss['receivedTo'];
      this.usvParam = paramss['usv'];
      this.rsvParam = paramss['rsv'];
      this.fnParam = paramss['fn'];
      this.datetype = paramss['datetype']
      this.leadstatusVisits = paramss['visits'];
      this.priorityName = paramss['priority'];
      this.visitedFrom = paramss['visitedfrom'];
      this.visitedTo = paramss['visitedto'];
      this.assignedFrom = paramss['assignedfrom'];
      this.assignedTo = paramss['assignedto'];

      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.initializeLeadReceivedDateRangePicker();
        this.initializeAssignedOnDateRangePicker();
        this.initializeVisitedOnDateRangePicker();
        this.resetScroll();
      }, 0);

      if (this.selectedCategory == undefined || this.selectedCategory == null || this.selectedCategory == '' && this.usvParam == 1) {
        this.selectedCategory = 'Fixed';
      }

      if ((this.fromdate == '' || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined)) {
        this.fromdate = '';
        this.todate = '';
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
        // if ((this.usvParam == 1 || this.rsvParam == 1 || this.fnParam == 1 ) && this.selectedCategory != 'Fixed' && (this.fromdate != '' && this.fromdate != undefined && this.fromdate != null && this.todate != '' && this.todate != undefined && this.todate != null)) {
        //   this.fromdate = '';
        //   this.todate = '';
        // }
        if((this.usvParam == 1 || this.rsvParam == 1 || this.fnParam == 1) && this.selectedCategory == 'Fixed'){
          this.visitedDatefilterview = true;
          this.visitedFrom = '';
          this.visitedTo = '';
        }
      }

      if ((this.assignedFrom == '' || this.assignedFrom == undefined || this.assignedFrom == null) || (this.assignedTo == null || this.assignedTo == '' || this.assignedTo == undefined)) {
        this.assignedOnDatefilterview = false;
        this.assignedFrom = '';
        this.assignedTo = '';
      } else {
        this.assignedOnDatefilterview = true;
      }

      if (this.leadstatusVisits == 1) {
        this.selectedLeadStatus = 'Direct Visits'
      } else if (this.leadstatusVisits == 2) {
        this.selectedLeadStatus = 'Assigned'
      } else {
        this.selectedLeadStatus = 'All'
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

      if (this.datetype == 'today') {
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
        // this.batch1trigger();
      } else if (this.datetype == 'yesterday') {
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
      } else if (this.datetype == 'last7') {
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
        // this.batch1trigger();
      } else {
        this.filterLoader = true;
        this.clicked = true;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = false;
      }

      if (this.usvParam == 1) {
        this.getUSVLeadsData();
      } else if (this.rsvParam == 1) {
        this.getRSVLeadsData();
      } else if (this.fnParam == 1) {
        this.getFNLeadsData();
      }
      this.getAllStageCounts();
    });
  }

  getAllStageCounts() {
    if (this.fromdate == "" || this.todate == "" || this.fromdate == undefined || this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    if (this.usvParam == 1) {

      var usvfixpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'USV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        // visitedfrom: this.visitedFrom,
        // visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeadsCount(usvfixpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.fixedCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.fixedCount = 0;
        }
      });

      var usvdonepar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'USV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeadsCount(usvdonepar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.DoneCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.DoneCount = 0;
        }
      });

      var usvoverduesparam = {
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
      this._mandateservice.assignedLeadsCount(usvoverduesparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.fixedOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.fixedOverduesCount = 0;
        }
      });

      //here i get the usv done overdues count
      var usvDoneoverduesparam = {
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
      this._mandateservice.assignedLeadsCount(usvDoneoverduesparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.DoneOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.DoneOverduesCount = 0;
        }
      });


      var usvfixjunkparam = {
        statuss: 'junkleads',
        stage: 'USV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        assignedfrom: this.fromdate,
        assignedto: this.todate,
      }
      this._mandateservice.assignedLeadsCount(usvfixjunkparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.junkFixedCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.junkFixedCount = 0;
        }
      });

      var usvDoneparam = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: 'junkvisits',
        stage: 'USV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visits: this.leadstatusVisits,
      }
      this._mandateservice.assignedLeadsCount(usvDoneparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.junkDoneCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.junkDoneCount = 0;
        }
      });

    } else if (this.rsvParam == 1) {

      var rsvfixpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'RSV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeadsCount(rsvfixpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.DoneCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.DoneCount = 0;
        }
      });

      var rsvdonepar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'RSV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeadsCount(rsvdonepar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.DoneCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.DoneCount = 0;
        }
      });

      //here i get the usv overdues count

      var rsvoverduesparam = {
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
      this._mandateservice.assignedLeadsCount(rsvoverduesparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.fixedOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.fixedOverduesCount = 0;
        }
      });

      //here i get the usv done overdues count
      var rsvDoneoverduesparam = {
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
      this._mandateservice.assignedLeadsCount(rsvDoneoverduesparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.DoneOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.DoneOverduesCount = 0;
        }
      });

      //here i get the usv junk counts

      var rsvDonejunkparam = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: 'junkvisits',
        stage: 'RSV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visits: this.leadstatusVisits,
      }
      this._mandateservice.assignedLeadsCount(rsvDonejunkparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.junkDoneCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.junkDoneCount = 0;
        }
      });

    } else if (this.fnParam == 1) {

      var fnfixpar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Final Negotiation',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeadsCount(fnfixpar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.DoneCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.DoneCount = 0;
        }
      });

      var fndonepar = {
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Final Negotiation',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeadsCount(fndonepar).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.DoneCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.DoneCount = 0;
        }
      });

      //here i get the usv overdues count

      var fnoverduesparam = {
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
      this._mandateservice.assignedLeadsCount(fnoverduesparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.fixedOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.fixedOverduesCount = 0;
        }
      });

      //here i get the usv done overdues count
      var fnDoneoverduesparam = {
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
      this._mandateservice.assignedLeadsCount(fnDoneoverduesparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.DoneOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.DoneOverduesCount = 0;
        }
      });

      //here i get the usv junk counts

      var fnfixjunkparam = {
        statuss: 'junkvisits',
        stage: 'Final Negotiation',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visitedfrom: this.fromdate,
        visitedto: this.todate,
      }
      this._mandateservice.assignedLeadsCount(fnfixjunkparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.junkFixedCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.junkFixedCount = 0;
        }
      });

      var fnDonejunkparam = {
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        statuss: 'junkvisits',
        stage: 'Final Negotiation',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visits: this.leadstatusVisits,
      }
      this._mandateservice.assignedLeadsCount(fnDonejunkparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.junkDoneCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.junkDoneCount = 0;
        }
      });

    }
  }

  get totalOverdues() {
    return (this.fixedOverduesCount || 0) + (this.DoneOverduesCount || 0);
  }

  get totalJunk() {
    return (this.junkFixedCount || 0) + (this.junkDoneCount || 0);
  }

  getUSVLeadsData() {
    $('.other_section').removeClass('active');
    $('.usv_stage').addClass('active');

    if (this.selectedCategory == 'Fixed') {
      var usvparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'USV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(usvparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done') {
      var usvdoneparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'USV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(usvdoneparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Overdues') {
      var usvoverduesparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'USV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(usvoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Overdues') {
      var usvdoneoverduesparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'USV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(usvdoneoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Junk') {
      var fixjunkparam = {
        limit: 0,
        limitrows: 30,
        statuss: 'junkleads',
        stage: 'USV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        assignedfrom: this.fromdate,
        assignedto: this.todate,
      }
      this._mandateservice.assignedLeads(fixjunkparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Junk') {
      var param = {
        limit: 0,
        limitrows: 30,
        statuss: 'junkvisits',
        stage: 'USV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        visits: this.leadstatusVisits

      }
      this._mandateservice.assignedLeads(param).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    }
  }

  getRSVLeadsData() {
    $('.other_section').removeClass('active');
    $('.rsv_stage').addClass('active');
    if (this.selectedCategory == 'Fixed') {
      var rsvparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'RSV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(rsvparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done') {
      var rsvdoneparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'RSV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(rsvdoneparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Overdues') {
      var fixoverduesparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'RSV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(fixoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Overdues') {
      var doneoverduesparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'RSV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(doneoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Junk') {
      var fixjunkparam = {
        limit: 0,
        limitrows: 30,
        statuss: 'junkleads',
        stage: 'RSV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        assignedfrom: this.fromdate,
        assignedto: this.todate,
      }
      this._mandateservice.assignedLeads(fixjunkparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Junk') {
      var param = {
        limit: 0,
        limitrows: 30,
        statuss: 'junkvisits',
        stage: 'RSV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        visits: this.leadstatusVisits

      }
      this._mandateservice.assignedLeads(param).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    }
  }

  getFNLeadsData() {
    $('.other_section').removeClass('active');
    $('.fn_stage').addClass('active');

    if (this.selectedCategory == 'Fixed') {
      var fnparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Final Negotiation',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(fnparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done') {
      var fndoneparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Final Negotiation',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(fndoneparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Overdues') {
      var fixoverduesparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Final Negotiation',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(fixoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Overdues') {
      var doneoverduesparam = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Final Negotiation',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(doneoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Junk') {
      var fixjunkparam = {
        limit: 0,
        limitrows: 30,
        statuss: 'junkleads',
        stage: 'Final Negotiation',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        assignedfrom: this.fromdate,
        assignedto: this.todate,
      }
      this._mandateservice.assignedLeads(fixjunkparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Junk') {
      var param = {
        limit: 0,
        limitrows: 30,
        statuss: 'junkvisits',
        stage: 'Final Negotiation',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        visits: this.leadstatusVisits

      }
      this._mandateservice.assignedLeads(param).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    }
  }

  getCategoryLeads(type) {
    this.selectedCategory = type;
    if(type == 'Fixed'){
      this.router.navigate([], {
        queryParams: {
          category: type,
          visitedfrom: '',
          visitedto: ''
        }, queryParamsHandling: 'merge'
      })
    } else {
      this.router.navigate([], {
        queryParams: {
          category: type
        }, queryParamsHandling: 'merge'
      })
    }
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
    } else if (val == 'last7') {
      this.router.navigate([], {
        queryParams: {
          datetype: 'last7'
        },
        queryParamsHandling: 'merge',
      })
    }
  }

  stageTabs(type) {
    $('.other_section').removeClass('active');
    if (type == 'usv') {
      $('.usv_stage').addClass('active');

      this.router.navigate([], {
        queryParams: {
          usv: 1,
          source: this.source,
          property: this.propertyid,
          propname: this.propertyname,
          execid: this.execid,
          execname: this.execname,
          datetype: this.datetype,
          category: 'USV Fix',
          from: this.fromdate,
          to: this.todate
        }
      })
    } else if (type == 'rsv') {
      $('.rsv_stage').addClass('active');

      this.router.navigate([], {
        queryParams: {
          rsv: 1,
          source: this.source,
          property: this.propertyid,
          propname: this.propertyname,
          execid: this.execid,
          execname: this.execname,
          from: this.fromdate,
          to: this.todate,
          visits: '',
          datetype: this.datetype,
          category: 'RSV Fix'
        }
      })
    } else if (type == 'fn') {
      $('.fn_stage').addClass('active');

      this.router.navigate([], {
        queryParams: {
          fn: 1,
          source: this.source,
          property: this.propertyid,
          propname: this.propertyname,
          execid: this.execid,
          execname: this.execname,
          from: this.fromdate,
          to: this.todate,
          visits: '',
          datetype: this.datetype,
          category: 'FN Fix'
        }
      })
    }
  }

  //property selection filter
  onCheckboxChange(property) {

    StageDashboardComponent.count = 0;
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
    StageDashboardComponent.count = 0;
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

  //source filter
  onCheckboxChangesource() {
    StageDashboardComponent.count = 0;
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

  prioritychange(vals) {
    StageDashboardComponent.count = 0;
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
    $('#rm_dropdown').dropdown('clear');
    $("input[name='executiveFilter']").prop("checked", false);
    StageDashboardComponent.count = 0;
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
    StageDashboardComponent.count = 0;
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

  receivedDateclose() {
    StageDashboardComponent.count = 0;
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

  sourceClose() {
    $('#source_dropdown').dropdown('clear');
    $("input[name='sourceFilter']").prop("checked", false);
    this.sourceFilter = false;
    StageDashboardComponent.count = 0;
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

  priorityClose() {
    this.priorityFilter = false;
    this.priorityName = '';
    StageDashboardComponent.count = 0;
    this.router.navigate([], {
      queryParams: {
        priority: ''
      },
      queryParamsHandling: 'merge',
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

  backToWelcome() {
    $('.modal-backdrop').closest('div').remove();
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }

  refresh() {
    this.propertyid = '';
    this.propertyname = '';
    this.source = '';
    this.execid = '';
    this.execname = '';
    this.selectedLeadStatus = '';
    if (this.usvParam == 1) {
      this.router.navigate(['/stage-dashboard'], {
        queryParams: {
          usv: '1',
          from: '',
          to: '',
          dashtype: 'dashboard',
          category: this.selectedCategory,
          datetype: 'today'
        }
      });
    } else if (this.rsvParam == 1) {
      this.router.navigate(['/stage-dashboard'], {
        queryParams: {
          rsv: '1',
          from: '',
          to: '',
          dashtype: 'dashboard',
          category: this.selectedCategory,
          datetype: 'today'
        }
      });
    } else if (this.fnParam == 1) {
      this.router.navigate(['/stage-dashboard'], {
        queryParams: {
          fn: '1',
          from: '',
          to: '',
          dashtype: 'dashboard',
          category: this.selectedCategory,
          datetype: 'today'
        }
      });
    }

  }

  removeselectedLeadStatus() {
    this.selectedLeadStatus = '';
    this.router.navigate([], {
      queryParams: {
        visits: ''
      },
      queryParamsHandling: 'merge',
    });
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

  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  visitedDateclose() {
    StageDashboardComponent.count = 0;
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
    StageDashboardComponent.count = 0;
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

  loadMoreassignedleads() {
    let limit = StageDashboardComponent.count += 30;
    if (this.selectedCategory == 'Fixed' && this.usvParam == 1) {
      var usvparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'USV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.fixedCount) {
        this.filterLoader = false;
        this._mandateservice.assignedLeads(usvparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Done' && this.usvParam == 1) {
      var usvdoneparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'USV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.DoneCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(usvdoneparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Fixed Overdues' && this.usvParam == 1) {
      var usvoverduesparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'USV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.fixedOverduesCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(usvoverduesparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Done Overdues' && this.usvParam == 1) {
      var usvdoneoverduesparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'USV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.DoneOverduesCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(usvdoneoverduesparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Fixed Junk' && this.usvParam == 1) {
      var fixjunkparam = {
        limit: limit,
        limitrows: 30,
        statuss: 'junkleads',
        stage: 'USV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        assignedfrom: this.fromdate,
        assignedto: this.todate,
      }
      if (this.callerleads.length < this.junkFixedCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(fixjunkparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Done Junk' && this.usvParam == 1) {
      var param = {
        limit: limit,
        limitrows: 30,
        statuss: 'junkvisits',
        stage: 'USV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        visits: this.leadstatusVisits

      }
      if (this.callerleads.length < this.junkDoneCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(param).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Fixed' && this.rsvParam == 1) {
      var rsvparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'RSV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.fixedCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(rsvparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Done' && this.rsvParam == 1) {
      var rsvdoneparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'RSV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.DoneCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(rsvdoneparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Fixed Overdues' && this.rsvParam == 1) {
      var fixoverduesparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'RSV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.fixedOverduesCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(fixoverduesparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Done Overdues' && this.rsvParam == 1) {
      var doneoverduesparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'RSV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.DoneOverduesCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(doneoverduesparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Fixed Junk' && this.rsvParam == 1) {
      var fixjunkparam = {
        limit: limit,
        limitrows: 30,
        statuss: 'junkleads',
        stage: 'RSV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        assignedfrom: this.fromdate,
        assignedto: this.todate,
      }
      if (this.callerleads.length < this.junkFixedCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(fixjunkparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Done Junk' && this.rsvParam == 1) {
      var param = {
        limit: limit,
        limitrows: 30,
        statuss: 'junkvisits',
        stage: 'RSV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        visits: this.leadstatusVisits
      }
      if (this.callerleads.length < this.junkDoneCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(param).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Fixed' && this.fnParam == 1) {
      var fnparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Final Negotiation',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.fixedCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(fnparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Done' && this.fnParam == 1) {
      var fndoneparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Final Negotiation',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.DoneCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(fndoneparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Fixed Overdues' && this.fnParam == 1) {
      var fixoverduesparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Final Negotiation',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.fixedOverduesCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(fixoverduesparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Done Overdues' && this.fnParam == 1) {
      var doneoverduesparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Final Negotiation',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.DoneOverduesCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(doneoverduesparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Fixed Junk' && this.fnParam == 1) {
      var fixjunkparam = {
        limit: limit,
        limitrows: 30,
        statuss: 'junkleads',
        stage: 'Final Negotiation',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        assignedfrom: this.fromdate,
        assignedto: this.todate,
      }
      if (this.callerleads.length < this.junkFixedCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(fixjunkparam).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    } else if (this.selectedCategory == 'Done Junk' && this.fnParam == 1) {
      var param = {
        limit: limit,
        limitrows: 30,
        statuss: 'junkvisits',
        stage: 'Final Negotiation',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        visits: this.leadstatusVisits

      }
      if (this.callerleads.length < this.junkDoneCount) {
        this.filterLoader = true;
        this._mandateservice.assignedLeads(param).subscribe(compleads => {
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
        });
      }
    }
  }

  //here Re-assign Code starts.
  onclickReAssign() {
    this.roleTeam = '';

    if (this.selectedCategory == 'Fixed') {
      this.reassignleadsCount = this.fixedCount;
    } else if (this.selectedCategory == 'Done') {
      this.reassignleadsCount = this.DoneCount;
    } else if (this.selectedCategory == 'Fixed Overdues') {
      this.reassignleadsCount = this.fixedOverduesCount;
    } else if (this.selectedCategory == 'Done Overdues') {
      this.reassignleadsCount = this.DoneOverduesCount;
    } else if (this.selectedCategory == 'Fixed Junk') {
      this.reassignleadsCount = this.junkFixedCount;
    } else if (this.selectedCategory == 'Done Junk') {
      this.reassignleadsCount = this.junkDoneCount;
    }
    this.selectedEXECUTIVES = [];

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
        text: 'Please try agin',
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
        text: 'Please try agin',
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
        text: 'Please try agin',
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
            text: 'Please try agin',
            type: 'error',
            confirmButtonText: 'OK'
          })
        }
      }, (err) => {
        console.log("Connection Failed")
      });
    } else {
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
            text: 'Please try agin',
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
      //         text: 'Please try agin',
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

     if (this.selectedCategory == 'Fixed' && this.usvParam == 1) {
      var usvparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'USV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(usvparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done' && this.usvParam == 1) {
      var usvdoneparam = {
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
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(usvdoneparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Overdues' && this.usvParam == 1) {
      var usvoverduesparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'USV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(usvoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Overdues' && this.usvParam == 1) {
      var usvdoneoverduesparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'USV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(usvdoneoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Junk' && this.usvParam == 1) {
      var fixjunkparam = {
        limit: 0,
        limitrows: limitR,
        statuss: 'junkleads',
        stage: 'USV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        assignedfrom: this.fromdate,
        assignedto: this.todate,
      }
      this._mandateservice.assignedLeads(fixjunkparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Junk' && this.usvParam == 1) {
      var param = {
        limit: 0,
        limitrows: limitR,
        statuss: 'junkvisits',
        stage: 'USV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        visits: this.leadstatusVisits

      }
      this._mandateservice.assignedLeads(param).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else  if (this.selectedCategory == 'Fixed' && this.rsvParam == 1) {
      var rsvparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'RSV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(rsvparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done' && this.rsvParam == 1) {
      var rsvdoneparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'RSV',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(rsvdoneparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Overdues' && this.rsvParam == 1) {
      var fixoverduesparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'RSV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(fixoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Overdues' && this.rsvParam == 1) {
      var doneoverduesparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'RSV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(doneoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Junk' && this.rsvParam == 1) {
      var fixjunkparam = {
        limit: 0,
        limitrows: limitR,
        statuss: 'junkleads',
        stage: 'RSV',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        assignedfrom: this.fromdate,
        assignedto: this.todate,
      }
      this._mandateservice.assignedLeads(fixjunkparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Junk' && this.rsvParam == 1) {
      var param = {
        limit: 0,
        limitrows: limitR,
        statuss: 'junkvisits',
        stage: 'RSV',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        visits: this.leadstatusVisits

      }
      this._mandateservice.assignedLeads(param).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else  if (this.selectedCategory == 'Fixed' && this.fnParam == 1) {
      var fnparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Final Negotiation',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(fnparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done' && this.fnParam == 1) {
      var fndoneparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: '',
        stage: 'Final Negotiation',
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        visitedfrom: this.visitedFrom,
        visitedto: this.visitedTo,
        assignedfrom: this.assignedFrom,
        assignedto: this.assignedTo,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(fndoneparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Overdues' && this.fnParam == 1) {
      var fixoverduesparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Final Negotiation',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(fixoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Overdues' && this.fnParam == 1) {
      var doneoverduesparam = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Final Negotiation',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      this._mandateservice.assignedLeads(doneoverduesparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Fixed Junk' && this.fnParam == 1) {
      var fixjunkparam = {
        limit: 0,
        limitrows: limitR,
        statuss: 'junkleads',
        stage: 'Final Negotiation',
        stagestatus: '1',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        assignedfrom: this.fromdate,
        assignedto: this.todate,
      }
      this._mandateservice.assignedLeads(fixjunkparam).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
    } else if (this.selectedCategory == 'Done Junk' && this.fnParam == 1) {
      var param = {
        limit: 0,
        limitrows: limitR,
        statuss: 'junkvisits',
        stage: 'Final Negotiation',
        stagestatus: '3',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visitedfrom: this.fromdate,
        visitedto: this.todate,
        visits: this.leadstatusVisits

      }
      this._mandateservice.assignedLeads(param).subscribe(compleads => {
        if (compleads.status == 'True') {
          this.filterLoader = false;
          this.callerleads = compleads['AssignedLeads'];
        } else {
          this.filterLoader = false;
          this.callerleads = [];
        }
      });
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
        // if (diffInDays <= 30) {
        this.fromdate = start.format('YYYY-MM-DD');
        this.todate = end.format('YYYY-MM-DD');
        this.router.navigate(['/stage-dashboard'], {
          queryParams: {
            datetype: '',
            from: this.fromdate,
            to: this.todate
          }, queryParamsHandling: 'merge'
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

}
