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
  selector: 'app-junk-dashboard',
  templateUrl: './junk-dashboard.component.html',
  styleUrls: ['./junk-dashboard.component.css']
})
export class JunkDashboardComponent implements OnInit {

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
  // todaysvisitedparam: any;
  // yesterdaysvisitedparam: any;
  // allvisitparam: any;
  // last7daysparam: any;
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
  freshJunkCount: number = 0;
  followupsJunkCount: number = 0;
  ncJunkCount: number = 0;
  usvJunkCount: number = 0;
  usvFixJunkCount: number = 0;
  rsvJunkCount: number = 0;
  rsvFixJunkCount: number = 0;
  fnJunkCount: number = 0;
  fnFixJunkCount: number = 0;
  receivedFromDate: any;
  receivedToDate: any;
  receivedDatefilterview: boolean = false;
  leadRecStart: moment.Moment | null = null;
  leadRecEnd: moment.Moment | null = null;
  junkLeadsParam: any;
  junkVisitsParam: any;
  datetype: any;
  leadstatusVisits: any;
  selectedLeadStatus: string;
  reassignleadsCount: number = 0;

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
      this.initializeNextActionDateRangePicker();
      this.initializeLeadReceivedDateRangePicker();
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
    JunkDashboardComponent.count = 0;
    this.route.queryParams.subscribe((paramss) => {
      // Updated Using Strategy
      // this.todaysvisitedparam = paramss['todayvisited'];
      // this.yesterdaysvisitedparam = paramss['yesterdayvisited'];
      // this.allvisitparam = paramss['allvisits'];
      // this.last7daysparam = paramss['last7']
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
      this.junkVisitsParam = paramss['junkvisits'];
      this.junkLeadsParam = paramss['junkleads'];
      this.datetype = paramss['datetype']
      this.leadstatusVisits = paramss['visits'];

      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.initializeLeadReceivedDateRangePicker();
        this.resetScroll();
      }, 0);
      if (this.selectedCategory == undefined || this.selectedCategory == null || this.selectedCategory == '' && this.junkLeadsParam == 1) {
        this.selectedCategory = 'Fresh';
      } else if (this.selectedCategory == undefined || this.selectedCategory == null || this.selectedCategory == '' && this.junkVisitsParam == 1) {
        this.selectedCategory = 'USV Done';
      }

      if ((this.receivedFromDate == '' || this.receivedFromDate == undefined || this.receivedFromDate == null) || (this.receivedToDate == '' || this.receivedToDate == undefined || this.receivedToDate == null)) {
        this.receivedDatefilterview = false;
        this.receivedFromDate = '';
        this.receivedToDate = '';
      } else {
        this.receivedDatefilterview = true;
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
        // this.batch1trigger();
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

      let type;
      if (this.junkLeadsParam == 1) {
        type = 'leads';
        this.batch1trigger();
      } else if (this.junkVisitsParam == 1) {
        type = 'visits';
        this.batch1trigger();
      }
      this.getJunkLeadsData();

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
    console.log(this.fromdate, this.todate)
    if (this.fromdate == "" || this.todate == "" || this.fromdate == undefined || this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    this.freshJunkCount = 0;
    this.followupsJunkCount = 0;
    this.ncJunkCount = 0;
    this.usvFixJunkCount = 0;
    this.usvJunkCount = 0;
    this.rsvFixJunkCount = 0;
    this.rsvJunkCount = 0;
    this.fnFixJunkCount = 0;
    this.fnJunkCount = 0;

    if (this.junkLeadsParam == '1') {

      //here we get follow up junk count
      var freshparam = {
        statuss: 'junkleads',
        stage: 'Fresh',
        stagestatus: '',
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
      this._mandateservice.assignedLeadsCount(freshparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.freshJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.freshJunkCount = 0;
        }
      });

      //here we get follow up junk count
      var generalfollowupparam = {
        statuss: 'junkleads',
        stage: 'generalfollowups',
        stagestatus: '',
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
      this._mandateservice.assignedLeadsCount(generalfollowupparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.followupsJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.followupsJunkCount = 0;
        }
      });

      //here we get nc junk count
      var ncparam = {
        statuss: 'junkleads',
        stage: 'NC',
        stagestatus: '',
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
      this._mandateservice.assignedLeadsCount(ncparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.ncJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.ncJunkCount = 0;
        }
      });

      //here i get the usv fix junk count
      var usvparam = {
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
      this._mandateservice.assignedLeadsCount(usvparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.usvFixJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.usvFixJunkCount = 0;
        }
      });
    }

    if (this.junkVisitsParam == '1') {

      //here i get the usv done junk count
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
          this.usvJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.usvJunkCount = 0;
        }
      });

      //here i get the rsv fix junk count
      var rsvparam = {
        assignedfrom: this.fromdate,
        assignedto: this.todate,
        statuss: 'junkvisits',
        stage: 'RSV',
        stagestatus: '1',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        source: this.source,
        receivedfrom: this.receivedFromDate,
        receivedto: this.receivedToDate,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
        visits: this.leadstatusVisits,
      }
      this._mandateservice.assignedLeadsCount(rsvparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.rsvFixJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.rsvFixJunkCount = 0;
        }
      });

      //here i get the rsv done junk count
      var rsvdoneparam = {
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
      this._mandateservice.assignedLeadsCount(rsvdoneparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.rsvJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.rsvJunkCount = 0;
        }
      });

      //here i get the fn fix junk count
      var fnparam = {
        assignedfrom: this.fromdate,
        assignedto: this.todate,
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
        visits: this.leadstatusVisits,
      }
      this._mandateservice.assignedLeadsCount(fnparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.fnFixJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.fnFixJunkCount = 0;
        }
      });

      //here i get the fn fix junk count
      var fndoneparam = {
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
      this._mandateservice.assignedLeadsCount(fndoneparam).subscribe(compleads => {
        if (compleads['status'] == 'True') {
          this.fnJunkCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        } else {
          this.fnJunkCount = 0;
        }
      });
    }

  }

  //to fetch junk leads
  getJunkLeadsData() {
    JunkDashboardComponent.count = 0;
    this.filterLoader = true;
    $('.other_section').removeClass('active');
    if (this.junkLeadsParam == '1') {
      $('.junk_leads').addClass('active');

    } else if (this.junkVisitsParam == '1') {
      $('.junk_visits').addClass('active');
    }

    let stageval: string = '';
    let stagestatusVal: string;
    let status: string = '';

    console.log(this.selectedCategory)
    if (this.selectedCategory == 'Fresh') {
      stageval = 'Fresh';
      stagestatusVal = '';
      status = 'junkleads';
    } else if (this.selectedCategory == 'Followups') {
      stageval = 'generalfollowups';
      stagestatusVal = '';
      status = 'junkleads';
    } else if (this.selectedCategory == 'NC') {
      stageval = 'NC';
      stagestatusVal = '';
      status = 'junkleads';
    } else if (this.selectedCategory == 'USV Fix') {
      stageval = 'USV';
      stagestatusVal = '1';
      status = 'junkleads';
    } else if (this.selectedCategory == 'USV Done') {
      stageval = 'USV';
      stagestatusVal = '3';
      status = 'junkvisits';
    } else if (this.selectedCategory == 'RSV Fix') {
      stageval = 'RSV';
      stagestatusVal = '1';
      status = 'junkvisits';
    } else if (this.selectedCategory == 'RSV Done') {
      stageval = 'RSV';
      stagestatusVal = '3';
      status = 'junkvisits';
    } else if (this.selectedCategory == 'FN Fix') {
      stageval = 'Final Negotiation';
      stagestatusVal = '1';
      status = 'junkvisits';
    } else if (this.selectedCategory == 'FN Done') {
      stageval = 'Final Negotiation';
      stagestatusVal = '3';
      status = 'junkvisits';
    }

    var param = {
      limit: 0,
      limitrows: 30,
      statuss: status,
      stage: stageval,
      stagestatus: stagestatusVal,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      ...(this.junkLeadsParam == '1' || this.selectedCategory == 'USV Fix' ||  this.selectedCategory == 'RSV Fix'? { assignedfrom: this.fromdate } : {}),
      ...(this.junkLeadsParam == '1' || this.selectedCategory == 'USV Fix' ||  this.selectedCategory == 'RSV Fix' ? { assignedto: this.todate } : {}),
      ...(this.junkVisitsParam == '1' && this.selectedCategory != 'USV Fix' &&  this.selectedCategory != 'RSV Fix' ? { visitedfrom: this.fromdate } : {}),
      ...(this.junkVisitsParam == '1' && this.selectedCategory != 'USV Fix' &&  this.selectedCategory != 'RSV Fix'? { visitedto: this.todate } : {}),
      ...(this.junkVisitsParam == '1' ? { visits: this.leadstatusVisits } : {})

    }
    this._mandateservice.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
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
    } else if (val == 'last7') {
      this.router.navigate([], {
        queryParams: {
          datetype: 'last7'
        },
        queryParamsHandling: 'merge',
      })
    }
  }

  junkTabs(type) {
    $('.other_section').removeClass('active');
    if (type == 'leads') {
      $('.junk_leads').addClass('active');

      this.router.navigate([], {
        queryParams: {
          junkleads: 1,
          source: this.source,
          property: this.propertyid,
          propname: this.propertyname,
          execid: this.execid,
          execname: this.execname,
          assignedfrom: this.fromdate,
          assignedto: this.todate,
          datetype: this.datetype,
          category: 'Fresh',
          from: this.fromdate,
          to: this.todate
        }
      })
    } else if (type == 'visits') {
      $('.junk_visits').addClass('active');

      this.router.navigate([], {
        queryParams: {
          junkvisits: 1,
          source: this.source,
          property: this.propertyid,
          propname: this.propertyname,
          execid: this.execid,
          execname: this.execname,
          from: this.fromdate,
          to: this.todate,
          visits: '',
          datetype: this.datetype,
          category: 'USV Done'
        }
      })
    }
  }

  //property selection filter
  onCheckboxChange(property) {

    JunkDashboardComponent.count = 0;
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
    JunkDashboardComponent.count = 0;
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
    JunkDashboardComponent.count = 0;
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
    JunkDashboardComponent.count = 0;
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
    JunkDashboardComponent.count = 0;
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
    JunkDashboardComponent.count = 0;
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

  removeselectedLeadStatus() {
    this.selectedLeadStatus = '';
    this.router.navigate([], {
      queryParams: {
        visits: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  loadMoreassignedleads() {
    let limit;
    let countLoad;
    limit = JunkDashboardComponent.count += 30;

    let stageval: string = '';
    let stagestatusVal: string;
    let status: string = '';
    if (this.selectedCategory == 'Fresh') {
      stageval = 'Fresh';
      stagestatusVal = '';
      status = 'junkleads';
      countLoad = this.freshJunkCount;
    } else if (this.selectedCategory == 'Followups') {
      stageval = 'generalfollowups';
      stagestatusVal = '';
      status = 'junkleads';
      countLoad = this.followupsJunkCount;
    } else if (this.selectedCategory == 'NC') {
      stageval = 'NC';
      stagestatusVal = '';
      status = 'junkleads';
      countLoad = this.ncJunkCount;
    } else if (this.selectedCategory == 'USV Fix') {
      stageval = 'USV';
      stagestatusVal = '1';
      status = 'junkleads';
      countLoad = this.usvFixJunkCount;
    } else if (this.selectedCategory == 'USV Done') {
      stageval = 'USV';
      stagestatusVal = '3';
      status = 'junkvisits';
      countLoad = this.usvJunkCount;
    } else if (this.selectedCategory == 'RSV Fix') {
      stageval = 'RSV';
      stagestatusVal = '1';
      status = 'junkvisits';
      countLoad = this.rsvFixJunkCount;
    } else if (this.selectedCategory == 'RSV Done') {
      stageval = 'RSV';
      stagestatusVal = '3';
      status = 'junkvisits';
      countLoad = this.rsvJunkCount;
    } else if (this.selectedCategory == 'FN Fix') {
      stageval = 'Final Negotiation';
      stagestatusVal = '1';
      status = 'junkvisits';
      countLoad = this.fnFixJunkCount;
    } else if (this.selectedCategory == 'FN Done') {
      stageval = 'Final Negotiation';
      stagestatusVal = '3';
      status = 'junkvisits';
      countLoad = this.fnJunkCount;
    }
    console.log('triggered')
    var param = {
      limit: limit,
      limitrows: 30,
      statuss: status,
      stage: stageval,
      stagestatus: stagestatusVal,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      ...(this.junkLeadsParam == '1' || this.selectedCategory == 'USV Fix' ||  this.selectedCategory == 'RSV Fix' ? { assignedfrom: this.fromdate } : {}),
      ...(this.junkLeadsParam == '1' || this.selectedCategory == 'USV Fix' ||  this.selectedCategory == 'RSV Fix'? { assignedto: this.todate } : {}),
      ...(this.junkVisitsParam == '1' && this.selectedCategory != 'USV Fix' &&  this.selectedCategory != 'RSV Fix'? { visitedfrom: this.fromdate } : {}),
      ...(this.junkVisitsParam == '1' && this.selectedCategory != 'USV Fix' &&  this.selectedCategory != 'RSV Fix'? { visitedto: this.todate } : {}),
      ...(this.junkVisitsParam == '1' ? { visits: this.leadstatusVisits } : {})
    }
    console.log(countLoad, this.callerleads.length)
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

    if (this.selectedCategory == 'Fresh') {
      this.reassignleadsCount = this.freshJunkCount;
    } else if (this.selectedCategory == 'Followups') {
      this.reassignleadsCount = this.followupsJunkCount;
    } else if (this.selectedCategory == 'NC') {
      this.reassignleadsCount = this.ncJunkCount;
    } else if (this.selectedCategory == 'USV Fix') {
      this.reassignleadsCount = this.usvFixJunkCount;
    } else if (this.selectedCategory == 'USV Done') {
      this.reassignleadsCount = this.usvJunkCount;
    } else if (this.selectedCategory == 'RSV Fix') {
      this.reassignleadsCount = this.rsvFixJunkCount;
    } else if (this.selectedCategory == 'RSV Done') {
      this.reassignleadsCount = this.rsvJunkCount;
    } else if (this.selectedCategory == 'FN Fix') {
      this.reassignleadsCount = this.fnFixJunkCount;
    } else if (this.selectedCategory == 'FN Done') {
      this.reassignleadsCount = this.fnJunkCount;
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
    let param;
    let stageval: string = '';
    let stagestatusVal: string;
    let status: string = '';
    if (this.selectedCategory == 'Fresh') {
      stageval = 'Fresh';
      stagestatusVal = '';
      status = 'junkleads';
    } else if (this.selectedCategory == 'Followups') {
      stageval = 'generalfollowups';
      stagestatusVal = '';
      status = 'junkleads';
    } else if (this.selectedCategory == 'NC') {
      stageval = 'NC';
      stagestatusVal = '';
      status = 'junkleads';
    } else if (this.selectedCategory == 'USV Fix') {
      stageval = 'USV';
      stagestatusVal = '1';
      status = 'junkleads';
    } else if (this.selectedCategory == 'USV Done') {
      stageval = 'USV';
      stagestatusVal = '3';
      status = 'junkvisits';
    } else if (this.selectedCategory == 'RSV Fix') {
      stageval = 'RSV';
      stagestatusVal = '1';
      status = 'junkvisits';
    } else if (this.selectedCategory == 'RSV Done') {
      stageval = 'RSV';
      stagestatusVal = '3';
      status = 'junkvisits';
    } else if (this.selectedCategory == 'FN Fix') {
      stageval = 'Final Negotiation';
      stagestatusVal = '1';
      status = 'junkvisits';
    } else if (this.selectedCategory == 'FN Done') {
      stageval = 'Final Negotiation';
      stagestatusVal = '3';
      status = 'junkvisits';
    }

    param = {
      limit: 0,
      limitrows: limitR,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: status,
      stage: stageval,
      stagestatus: stagestatusVal,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      receivedfrom: this.receivedFromDate,
      receivedto: this.receivedToDate,
      ...(this.junkLeadsParam == '1' || this.selectedCategory == 'USV Fix' ||  this.selectedCategory == 'RSV Fix'? { assignedfrom: this.fromdate } : {}),
      ...(this.junkLeadsParam == '1' || this.selectedCategory == 'USV Fix' ||  this.selectedCategory == 'RSV Fix'? { assignedto: this.todate } : {}),
      ...(this.junkVisitsParam == '1' && this.selectedCategory != 'USV Fix' &&  this.selectedCategory != 'RSV Fix'? { visitedfrom: this.fromdate } : {}),
      ...(this.junkVisitsParam == '1' && this.selectedCategory != 'USV Fix' &&  this.selectedCategory != 'RSV Fix'? { visitedto: this.todate } : {}),
      ...(this.junkVisitsParam == '1' ? { visits: this.leadstatusVisits } : {})
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

  receivedDateclose() {
    JunkDashboardComponent.count = 0;
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

  refresh() {
    this.propertyid = '';
    this.propertyname = '';
    this.source = '';
    this.execid = '';
    this.execname = '';
    this.selectedLeadStatus = '';
    console.log(this.selectedCategory)
    if (this.junkLeadsParam == 1) {
      this.router.navigate(['/junk-dashboard'], {
        queryParams: {
          junkleads: '1',
          from: '',
          to: '',
          dashtype: 'dashboard',
          category: this.selectedCategory,
          datetype: 'today'
        }
      });
    } else {
      this.router.navigate(['/junk-dashboard'], {
        queryParams: {
          junkvisits: '1',
          from: '',
          to: '',
          dashtype: 'dashboard',
          category: this.selectedCategory,
          datetype: 'today'
        }
      });
    }

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
        // if (diffInDays <= 30) {
        this.fromdate = start.format('YYYY-MM-DD');
        this.todate = end.format('YYYY-MM-DD');
        this.router.navigate(['/junk-dashboard'], {
          queryParams: {
            datetype: '',
            from: this.fromdate,
            to: this.todate
          }, queryParamsHandling: 'merge'
        });
        // } else {
        //   swal({
        //     title: 'Please Select the date range between a Month',
        //     type: 'info',
        //     showConfirmButton: false,
        //     timer: 2000
        //   }).then(() => {
        //     this.fromdate = '';
        //     this.todate = '';
        //     start = null;
        //     end = null;
        //     this.nextActionStart = null;
        //     this.nextActionEnd = null;
        //   })
        // }
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
}
