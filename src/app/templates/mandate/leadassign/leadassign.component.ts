import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { leadforward, reassignlead } from './leadassign';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { mandateservice } from '../../../mandate.service';
import { sharedservice } from '../../../shared.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { MandateClassService } from '../../../mandate-class.service';
import { EchoService } from '../../../echo.service';

declare var $: any;
declare var swal: any;
declare const navigator: any;

@Component({
  selector: 'app-leadassign',
  templateUrl: './leadassign.component.html',
  styleUrls: ['./leadassign.component.css']
})
export class LeadassignComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private _sharedservice: sharedservice, private _mandateService: mandateservice, public datepipe: DatePipe, private _mandateClassService: MandateClassService, private echoService: EchoService,) {
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
  // assignedleadscounts: any;
  fromdate: any;
  todate: any;
  rmid: any;
  execid: any;
  propertyid: any;
  propertyname: any;
  assignedleadstable = true;
  tookactiontable: boolean = false;
  static count: number;
  static activecount: number;
  static closedcount: number;
  callerleads: any;
  // telecallers: any;
  // leads: any;
  // leadforwards = new leadforward();
  // reassignleadforwards = new leadforward();
  status: any;
  // executives: any;
  actionid: any;
  totalcounts: any;
  allcountsloadmore: any;
  closedcount: any;
  filterdata = false;
  // teamfilterview = false;
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
  // todayscheduled: any;
  // overdue: any;
  // notinterested: any;
  // interested: any;
  // inprogress: any;
  // booked: any;
  // bookingrequest: any;
  // rejected: any;
  // retailmoved: any;
  junk = true;
  upcomingvisits: any;
  upcomingfollowups: any;
  todaysvisitedparam: any;
  upcomingvisitparam: any;
  upcomingfollowupparam: any;
  todayvisitsparam: any;
  todayfollowupsparam: any;
  // todaysscheduledparam: any;
  // overdueparam: any;
  // junkparam: any;
  // bookedparam: any;
  // bookingreqparam: any;
  // rejectreqparam: any;
  // retailmovedparam: any;
  // allvisitparam: any;
  // inprogressparam: any;
  // interestedparam: any;
  // teamname: any;
  // followupsmissedcount: number = 0;
  // followupsmissedparam: any;
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
  stagestatus = true;
  retailmovelink = false;
  team: any;
  adminandexec: Boolean;
  leaddetails = false;
  rmleaddetails = false;
  roleid: any;
  userid: any;
  leadtrack: any;
  todayvisitscount: number = 0;
  todayfollowupscount: number = 0;
  isFollowups: Boolean;
  mandateprojects: any;
  copyofmandateprojects: any;
  searchTerm: string = '';
  directteamfound: boolean = false;
  mandateexecutives: any;
  priorityName: any;
  priorityFilter: boolean = false;
  copyofsources: any;
  sourceFilter: boolean = false;
  source: any;
  sourceList: any;
  searchTerm_source: string = '';
  searchTerm_executive: string = '';
  mandateExecutivesFilter: any;
  copyMandateExecutives: any;
  selectedLeadStatus: string;
  leadstatusVisits: any;
  @ViewChild('datepicker2') datepickernextACtion: ElementRef;
  nextActionDateRange: Date[];
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  role_type: any;
  mandateProperty_ID: any;
  // callStatus: any;
  calledLead: any;
  assignedRm: any;
  selectedRecordExec: any;
  audioList: any;
  onRecordExecList: any;
  isRestoredFromSession = false;

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.role_type = localStorage.getItem('role_type');
    this.mandateProperty_ID = localStorage.getItem('property_ID');
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

    this.mandateprojectsfetch();
    if (this.roleid == 1 || this.role_type == '1' || this.roleid == '50013' || this.roleid == '50014') {
      this.getsourcelist();
    }
    // *********************load the required template files*********************

    // *********************load the required template files*********************

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    // Todays Date
    // Yesterdays Date
    var yesterday = this.currentdateforcompare.getDate() - 1;
    var yesterdaywithzero = yesterday.toString().padStart(2, "0");
    this.yesterdaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + yesterdaywithzero;
    // Yesterdays Date
    // Tomorrows Date
    var tomorrow = this.currentdateforcompare.getDate() + 1;
    var tomorrowwithzero = tomorrow.toString().padStart(2, "0");
    this.tomorrowsdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + tomorrowwithzero;
    // Tomorrows Date

    this.getExecutivesForFilter();

    const savedState = sessionStorage.getItem('followup_state');

    if (savedState) {
      const state = JSON.parse(savedState);
      this.isRestoredFromSession = true;
      this.fromdate = state.fromdate;
      this.todate = state.todate;
      this.execid = state.execid;
      this.execname = state.execname
      this.propertyid = state.propertyid;
      this.propertyname = state.propertyname
      this.source = state.source;
      this.leadstatusVisits = state.visits,
        this.stagevalue = state.stage

      $('.other_section').removeClass('active');
      this.isFollowups = true;
      if (state.tabs == 'todayfollowupsparam') {
        this.todayfollowupsparam = 1;
        $('.today_followups').addClass('active');
      } else if (state.tabs == 'upcomingfollowupparam') {
        this.upcomingfollowupparam = 1;
        $('.upcoming_followup').addClass('active');
      }

      LeadassignComponent.count = state.page;
      this.callerleads = state.leads;

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
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
          this.rmid = this.execid;
        } else {
          this.rmid = this.execid;
        }
      } else {
        this.executivefilterview = false;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == 1) {
          this.rmid = "";
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      }

      if (this.stagevalue) {
        this.stagefilterview = true;
        this.stagestatus = true;
      } else {
        this.stagefilterview = false;
      }

      if (this.stagestatusval && this.stagevalue) {
        this.stagefilterview = true;
        this.stagestatusfilterview = true;
        if (this.stagestatusval == '1') {
          this.stagestatusvaltext = "Fixed";
        } else if (this.stagestatusval == '2') {
          this.stagestatusvaltext = "Refixed";
        } else if (this.stagestatusval == '3') {
          this.stagestatusvaltext = "Done";
        }
      } else {
        this.stagestatusfilterview = false;
      }

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
        this.fromdate = '';
        this.todate = '';
        this.fromTime = '';
        this.toTime = '';
      } else {
        this.datefilterview = true;
      }

      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = state.scrollTop;
      }, 0);
      this.filterLoader = false;
      // 🔴 IMPORTANT
      this.myfollowupsCountsTrigger();
    }

    this.getleadsdata();
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
    // LeadassignComponent.count = 0;
    // LeadassignComponent.activecount = 0;
    // LeadassignComponent.closedcount = 0;
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

  //get list of mandate executives for mandate for filter purpose
  getExecutivesForFilter() {
    if (this.roleid == 1) {
      this._mandateService.fetchmandateexecutuvesforreassign(this.propertyid, '', '', '', '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    } else if (this.role_type == 1) {
      this._mandateService.fetchmandateexecutuvesforreassign(this.mandateProperty_ID, '2', '', '', this.userid).subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeNextActionDateRangePicker();
      // this.resetScroll();
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

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  getleadsdata() {
    if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    }
    this.filterLoader = true;
    // LeadassignComponent.count = 0;
    this.actionid = "";
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
      // this.todaysscheduledparam = paramss['todayscheduled'];
      this.todayvisitsparam = paramss['todaysvisits'];
      this.todaysvisitedparam = paramss['todayvisited'];
      this.upcomingvisitparam = paramss['upcomingvisits'];
      this.todayfollowupsparam = paramss['todaysfollowups'];
      this.upcomingfollowupparam = paramss['upcomingfollowups'];
      // this.followupsmissedparam = paramss['followupsmissed']
      // this.overdueparam = paramss['overdue'];
      // this.allvisitparam = paramss['allvisits'];
      // this.inprogressparam = paramss['inprogress'];
      // this.interestedparam = paramss['intrested'];
      // this.junkparam = paramss['junks'];
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
      this.team = paramss['team'];
      this.priorityName = paramss['priority'];
      this.leadstatusVisits = paramss['visits'];
      this.source = paramss['source'];
      this.fromTime = paramss['fromtime'];
      this.toTime = paramss['totime'];
      this.resetScroll();
      this.detailsPageRedirection();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0);

      if (this.leadstatusVisits == 1) {
        this.selectedLeadStatus = 'Direct Visits'
      } else if (this.leadstatusVisits == 2) {
        this.selectedLeadStatus = 'Assigned'
      } else {
        this.selectedLeadStatus = 'All'
      }

      if (this.source) {
        this.sourceFilter = true;
      } else {
        this.sourceFilter = false;
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
        // this.getExecutivesForFilter();
      } else {
        this.propertyfilterview = false;
        // this.getExecutivesForFilter();
      }

      if (this.execid) {
        this.executivefilterview = true;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
          this.rmid = this.execid;
        } else {
          this.rmid = this.execid;
        }
      } else {
        this.executivefilterview = false;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == 1) {
          this.rmid = "";
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      }

      if (this.stagevalue) {
        this.stagefilterview = true;
        this.stagestatus = true;
      } else {
        this.stagefilterview = false;
      }

      if (this.stagestatusval && this.stagevalue) {
        this.stagefilterview = true;
        this.stagestatusfilterview = true;
        if (this.stagestatusval == '1') {
          this.stagestatusvaltext = "Fixed";
        } else if (this.stagestatusval == '2') {
          this.stagestatusvaltext = "Refixed";
        } else if (this.stagestatusval == '3') {
          this.stagestatusvaltext = "Done";
        }
      } else {
        this.stagestatusfilterview = false;
      }

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
        this.fromdate = '';
        this.todate = '';
        this.fromTime = '';
        this.toTime = '';
      } else {
        this.datefilterview = true;
      }

      if (this.todayvisitsparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.activitypage = true;
        this.allvisittracks = false;
        this.isFollowups = false;
        this.retailmovelink = false;
        if (this.roleid == '1' || this.roleid == '2') {
          this.filterview = true;
        } else {
          this.filterview = false;
        }
        this.batch1trigger();
        this.todayschedulevisits();
      } else if (this.todayfollowupsparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.isFollowups = true;
        this.activitypage = false;
        this.allvisittracks = false;
        this.retailmovelink = false;
        if (this.roleid == '1' || this.roleid == '2') {
          this.filterview = true;
        } else {
          this.filterview = false;
        }
        this.myfollowupsCountsTrigger();
        this.fetchtodaysfollowupdata()
      } else if (this.todaysvisitedparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.activitypage = true;
        this.allvisittracks = false;
        this.isFollowups = false;
        this.retailmovelink = false;
        if (this.roleid == '1' || this.roleid == '2') {
          this.filterview = true;
        } else {
          this.filterview = false;
        }
        this.batch1trigger();
        this.fetchtodaydata();
      } else if (this.upcomingvisitparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.activitypage = true;
        this.allvisittracks = false;
        this.isFollowups = false;
        this.retailmovelink = false;
        if (this.roleid == '1' || this.roleid == '2') {
          this.filterview = true;
        } else {
          this.filterview = false;
        }
        this.batch1trigger();
        this.upcomingvisit();
      } else if (this.upcomingfollowupparam == '1') {
        // this.fromdate = "";
        // this.todate = "";
        this.isFollowups = true;
        this.activitypage = false;
        this.allvisittracks = false;
        this.retailmovelink = false;
        if (this.roleid == '1' || this.roleid == '2') {
          this.filterview = true;
        } else {
          this.filterview = false;
        }
        this.myfollowupsCountsTrigger();
        this.upcomingfollowup();
      }
      //  else if (this.followupsmissedparam == '1' ) {
      //   if ((this.fromdate == '' || this.fromdate) == undefined && (this.todate == '' || this.todate == undefined)) {
      //     this.dateclose();
      //   }
      //   this.isFollowups == true;
      //   this.activitypage = false;
      //   this.allvisittracks = false;
      //   this.retailmovelink = false;
      //   if (this.roleid == '1' || this.roleid == '2') {
      //     this.filterview = true;
      //   } else {
      //     this.filterview = false;
      //   }
      //   this.myfollowupsCountsTrigger();
      //   this.followupmissed();
      // }
      // else if (this.overdueparam == '1') {
      //   this.fromdate = "";
      //   this.todate = "";
      //   this.activitypage = true;
      //   this.allvisittracks = false;
      //   this.isFollowups = false;
      //   this.retailmovelink = false;
      //   if (this.roleid == '1' || this.roleid == '2') {
      //     this.filterview = true;
      //   } else {
      //     this.filterview = false;
      //   }
      //   this.batch1trigger();
      //   this.overduesection();
      // } 
      // else if (this.allvisitparam == '1') {
      //   this.batch2trigger();
      //   this.activitypage = false;
      //   this.allvisittracks = true;
      //   this.filterview = true;
      //   this.retailmovelink = false;
      //   this.allvisits();
      // }
      // else if (this.interestedparam == '1') {
      //   this.batch2trigger();
      //   this.activitypage = false;
      //   this.allvisittracks = true;
      //   this.isFollowups = false;
      //   this.filterview = true;
      //   this.retailmovelink = false;
      //   this.interestedtrigger();
      // }
      // else if (this.junkparam == '1') {
      //   this.batch2trigger();
      //   this.activitypage = false;
      //   this.allvisittracks = true;
      //   this.isFollowups = false;
      //   this.filterview = true;
      //   if (this.roleid == '1' || this.roleid == '2') {
      //     if (this.notinterested == '0') {
      //       this.retailmovelink = false;
      //     } else {
      //       this.retailmovelink = true;
      //     }
      //   } else {
      //     this.retailmovelink = false;
      //   }
      //   this.junkclick();
      // }
      // else if (this.inprogressparam == '1') {
      //   this.batch2trigger();
      //   this.activitypage = false;
      //   this.allvisittracks = true;
      //   this.isFollowups = false;
      //   this.filterview = true;
      //   this.retailmovelink = false;
      //   this.inprogresstrigger();
      // }
      //  else if (this.bookedparam == '1') {
      //   this.batch2trigger();
      //   this.activitypage = false;
      //   this.allvisittracks = true;
      //   this.filterview = true;
      //   this.retailmovelink = false;
      //   this.bookedclick();
      // } 
      // else if (this.bookingreqparam == '1') {
      //   this.batch2trigger();
      //   this.activitypage = false;
      //   this.allvisittracks = true;
      //   this.filterview = true;
      //   this.retailmovelink = false;
      //   this.bookingreqclick();
      // } 
      // else if (this.rejectreqparam == '1') {
      //   this.batch2trigger();
      //   this.activitypage = false;
      //   this.allvisittracks = true;
      //   this.filterview = true;
      //   this.retailmovelink = false;
      //   this.rejectreqclick();
      // } 
      // else if (this.retailmovedparam == '1') {
      //   this.batch2trigger();
      //   this.activitypage = false;
      //   this.allvisittracks = true;
      //   this.filterview = true;
      //   this.retailmovelink = false;
      //   this.retailmovedclick();
      // }
      // Updated Using Strategy
    });
  }

  apitrigger() {
    if (this.todayvisitsparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.isFollowups = false;
      this.allvisittracks = false;
      this.retailmovelink = false;
      if (this.roleid == '1' || this.roleid == '2') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.todayschedulevisits();
    } else if (this.todayfollowupsparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = false;
      this.allvisittracks = false;
      this.retailmovelink = false;
      this.isFollowups = true;
      if (this.roleid == '1' || this.roleid == '2') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.myfollowupsCountsTrigger();
      this.fetchtodaysfollowupdata();
    } else if (this.todaysvisitedparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.allvisittracks = false;
      this.retailmovelink = false;
      this.isFollowups = false;
      if (this.roleid == '1' || this.roleid == '2') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.fetchtodaydata();
    } else if (this.upcomingvisitparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = true;
      this.allvisittracks = false;
      this.retailmovelink = false;
      this.isFollowups = false;
      if (this.roleid == '1' || this.roleid == '2') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.batch1trigger();
      this.upcomingvisit();
    } else if (this.upcomingfollowupparam == '1') {
      this.fromdate = "";
      this.todate = "";
      this.activitypage = false;
      this.allvisittracks = false;
      this.isFollowups = true;
      this.retailmovelink = false;
      if (this.roleid == '1' || this.roleid == '2') {
        this.filterview = true;
      } else {
        this.filterview = false;
      }
      this.myfollowupsCountsTrigger();
      this.upcomingfollowup();
    }
    // else if (this.followupsmissedparam == '1') {
    //   this.activitypage = false;
    //   this.allvisittracks = false;
    //   this.isFollowups = true;
    //   this.retailmovelink = false;
    //   if (this.roleid == '1' || this.roleid == '2') {
    //     this.filterview = true;
    //   } else {
    //     this.filterview = false;
    //   }
    //   this.myfollowupsCountsTrigger();
    //   this.followupmissed();
    // }
    // else if (this.overdueparam == '1') {
    //   this.fromdate = "";
    //   this.todate = "";
    //   this.activitypage = true;
    //   this.allvisittracks = false;
    //   this.isFollowups = false;
    //   this.retailmovelink = false;
    //   if (this.roleid == '1' || this.roleid == '2') {
    //     this.filterview = true;
    //   } else {
    //     this.filterview = false;
    //   }
    //   this.batch1trigger();
    //   this.overduesection();
    // } 
    // else if (this.allvisitparam == '1') {
    //   this.batch2trigger();
    //   this.activitypage = false;
    //   this.allvisittracks = true;
    //   this.filterview = true;
    //   this.retailmovelink = false;
    //   // this.allvisits();
    // } 
    // else if (this.inprogressparam == '1') {
    //   this.batch2trigger();
    //   this.activitypage = false;
    //   this.allvisittracks = true;
    //   this.isFollowups = false;
    //   this.filterview = true;
    //   this.retailmovelink = false;
    //   this.inprogresstrigger();
    // }
    // else if (this.interestedparam == '1') {
    //   this.batch2trigger();
    //   this.activitypage = false;
    //   this.allvisittracks = true;
    //   this.filterview = true;
    //   this.retailmovelink = false;
    //   this.isFollowups = false;
    //   this.interestedtrigger();
    // } else if (this.junkparam == '1') {
    //   this.batch2trigger();
    //   this.activitypage = false;
    //   this.allvisittracks = true;
    //   this.filterview = true;
    //   this.isFollowups = false;
    //   if (this.roleid == '1' || this.roleid == '2') {
    //     if (this.notinterested == '0') {
    //       this.retailmovelink = false;
    //     } else {
    //       this.retailmovelink = true;
    //     }
    //   } else {
    //     this.retailmovelink = false;
    //   }
    //   this.junkclick();
    // }
    // else if (this.bookedparam == '1') {
    //   this.batch2trigger();
    //   this.activitypage = false;
    //   this.allvisittracks = true;
    //   this.filterview = true;
    //   this.retailmovelink = false;
    //   this.bookedclick();
    // } else if (this.bookingreqparam == '1') {
    //   this.batch2trigger();
    //   this.activitypage = false;
    //   this.allvisittracks = true;
    //   this.filterview = true;
    //   this.retailmovelink = false;
    //   this.bookingreqclick();
    // } else if (this.rejectreqparam == '1') {
    //   this.batch2trigger();
    //   this.activitypage = false;
    //   this.allvisittracks = true;
    //   this.filterview = true;
    //   this.retailmovelink = false;
    //   this.rejectreqclick();
    // } else if (this.retailmovedparam == '1') {
    //   this.batch2trigger();
    //   this.activitypage = false;
    //   this.allvisittracks = true;
    //   this.filterview = true;
    //   this.retailmovelink = false;
    //   this.retailmovedclick();
    // }
  }

  //here we get the counts of followups 
  myfollowupsCountsTrigger() {
    //here we get the count for today's followups
    var todayfollowupparam = {
      // limit: 0,
      // limitrows: 30,
      datefrom: this.todaysdateforcompare,
      dateto: this.todaysdateforcompare,
      statuss: 'todaysfollowups',
      stage: this.stagevalue,
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeadsCount(todayfollowupparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.todayfollowupscount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.todayfollowupscount = 0;
      }
    });
    // here we get the count for today's followups

    // Upcoming followups Counts Fetch
    var upcomingfollowup = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'upcomingfollowups',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeadsCount(upcomingfollowup).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.upcomingfollowups = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.upcomingfollowups = 0;
      }
    });
    // Upcoming followups Counts Fetch

    //followups missed Counts Fetch
    // var followupmissed = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'overdues',
    //   stage: 'fresh',
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: this.team,
    //   priority: this.priorityName,
    //   source: this.source,
    //   visits: this.leadstatusVisits,,
    // ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    // }
    // this._mandateService.assignedLeadsCount(followupmissed).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.followupsmissedcount = compleads.AssignedLeads[0].counts;
    //   } else {
    //     this.followupsmissedcount = 0;
    //   }
    // });
    //followups missed Counts Fetch
  }

  //to get the data for today's visits
  batch1trigger() {
    this.closehistory();
    var curmonth = this.currentDate.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    var curday = this.currentDate.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    // Todays Scheduled Counts Fetch
    var todayscheduled = {
      datefrom: this.todaysdate,
      dateto: this.todaysdate,
      statuss: 'scheduledtoday',
      stage: this.stagevalue,
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeadsCount(todayscheduled).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.todayvisitscount = compleads['AssignedLeads'][0].counts;
      } else {
        this.todayvisitscount = 0;
      }
    });
    // Todays visits  Counts Fetch


    // Todays Visited Counts Fetch

    var todayparam = {
      datefrom: '',
      dateto: '',
      visitedfrom: this.todaysdate,
      visitedto: this.todaysdate,
      statuss: 'allvisits',
      stage: this.stagevalue,
      stagestatus: '3',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeadsCount(todayparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.todaystotalcounts = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.todaystotalcounts = 0;
      }
    });
    // Todays Visited Counts Fetch


    // Upcoming Visits Counts Fetch
    var upcomingvisit = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'upcomingvisit',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeadsCount(upcomingvisit).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.upcomingvisits = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.upcomingvisits = 0;
      }
    });
    // Upcoming Visits Counts Fetch

    // Overdue Counts Fetch
    // var visitoverdue = {
    //   datefrom: 'overdue',
    //   dateto: 'overdue',
    //   statuss: '',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: this.team,
    //   priority: this.priorityName
    // }
    // this._mandateService.getCountForDashBoard(visitoverdue).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.overdue = compleads.RMLeads[0].counts;
    //   } else {
    //     this.overdue = 0;
    //   }
    // });
    // Overdue Counts Fetch
  }
  //to get the data for All's visits
  batch2trigger() {
    this.closehistory();
    // All Visits Counts Fetch
    var paramcount = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: '',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName
    }
    this._mandateService.getCountForDashBoard(paramcount).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.totalcounts = compleads.RMLeads[0].counts;
        this.allcountsloadmore = compleads.RMLeads[0].counts;
      } else {
        this.totalcounts = "0";
        this.allcountsloadmore = compleads.RMLeads[0].counts;
      }
    });
    // All Visits Counts Fetch

    // inprogress Counts Fetch
    // var inprogressvisit = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'Inprogress',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: this.team,
    //   priority: this.priorityName
    // }
    // this._mandateService.getCountForDashBoard(inprogressvisit).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.inprogress = compleads.RMLeads[0].counts;
    //   } else {
    //     this.inprogress = 0;
    //   }
    // });
    // inprogress Counts Fetch

    // intrested Counts Fetch
    // var intrestedvisit = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'Intrested',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: this.team,
    //   priority: this.priorityName
    // }
    // this._mandateService.getCountForDashBoard(intrestedvisit).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.interested = compleads.RMLeads[0].counts;
    //   } else {
    //     this.interested = 0;
    //   }
    // });
    // intrested Counts Fetch

    // Junk Counts Fetch
    // var junkvisit = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'Junk',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: this.team,
    //   priority: this.priorityName
    // }
    // this._mandateService.getCountForDashBoard(junkvisit).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.notinterested = compleads.RMLeads[0].counts;
    //   } else {
    //     this.notinterested = 0;
    //   }
    // });
    // Junk Counts Fetch

    // booked Counts Fetch
    // var bookedvisit = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'Booked',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: this.team,
    //   priority: this.priorityName
    // }
    // this._mandateService.getCountForDashBoard(bookedvisit).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.booked = compleads.RMLeads[0].counts;
    //   } else {
    //     this.booked = 0;
    //   }
    // });
    // booked Counts Fetch

    // bookingrequests Counts Fetch
    // var bookedvisit = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'Bookingrequest',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: this.team,
    //   priority: this.priorityName
    // }
    // this._mandateService.getCountForDashBoard(bookedvisit).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.bookingrequest = compleads.RMLeads[0].counts;
    //   } else {
    //     this.bookingrequest = 0;
    //   }
    // });
    // bookingrequests Counts Fetch

    // rejectrequests Counts Fetch
    // var rejectbooked = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'Rejected',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: this.team,
    //   priority: this.priorityName
    // }
    // this._mandateService.getCountForDashBoard(rejectbooked).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.rejected = compleads.RMLeads[0].counts;
    //   } else {
    //     this.rejected = 0;
    //   }
    // });
    // rejectrequests Counts Fetch

    // retailmoved Counts Fetch
    // var retailmoved = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'retail',
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   propid: this.propertyid,
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   team: this.team,
    //   priority:this.priorityName
    // }
    // this._mandateService.getCountForDashBoard(retailmoved).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.retailmoved = compleads.RMLeads[0].counts;
    //   } else {
    //     this.retailmoved = 0;
    //   }
    // });
    // retailmoved Counts Fetch
  }

  //to get today's schelude leads
  todayschedulevisits() {
    this.closehistory();
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    $(".other_section").removeClass("active");
    $(".today_visits").addClass("active");
    // this.fromdate = this.todaysdateforcompare;
    // this.todate = 'todaysvisits';
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.todaysdateforcompare,
      dateto: this.todaysdateforcompare,
      statuss: 'scheduledtoday',
      stage: this.stagevalue,
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });

  }

  //to get today's visits followup leads
  fetchtodaysfollowupdata() {
    this.closehistory();
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    $(".other_section").removeClass("active");
    $(".today_followups").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.todaysdateforcompare,
      dateto: this.todaysdateforcompare,
      statuss: 'todaysfollowups',
      stage: this.stagevalue,
      stagestatus: '',
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to get today's visited leads
  fetchtodaydata() {
    this.closehistory();
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    $(".other_section").removeClass("active");
    $(".today_section").addClass("active");
    var curmonth = this.currentDate.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    var curday = this.currentDate.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    // this.fromdate = this.todaysdate;
    // this.todate = this.todaysdate;
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: '',
      dateto: '',
      visitedfrom: this.todaysdate,
      visitedto: this.todaysdate,
      statuss: 'allvisits',
      stage: this.stagevalue,
      stagestatus: '3',
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
      // this.getAllVisitCount();

    });
  }

  //to get upcoming visits leads
  upcomingvisit() {
    this.closehistory();
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    $(".other_section").removeClass("active");
    $(".upcoming_visit").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'upcomingvisit',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
      // this.getAllVisitCount();
    });
  }

  //to get upcoming followup leads
  upcomingfollowup() {
    this.closehistory();
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    $(".other_section").removeClass("active");
    $(".upcoming_followup").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'upcomingfollowups',
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
      // this.getAllVisitCount();
    });
  }

  //to get followup missed leads
  followupmissed() {
    this.closehistory();
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;
    $(".other_section").removeClass("active");
    $(".followups_missed").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'fresh',
      stagestatus: this.stagestatusval,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      fromtime: this.fromTime,
      totime: this.toTime,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to get overdue leads
  // overduesection() {
  //   this.closehistory();
  //   LeadassignComponent.closedcount = 0;
  //   LeadassignComponent.count = 0;
  //   this.filterLoader = true;
  //   this.junk = true;
  //   $(".other_section").removeClass("active");
  //   $(".overdues").addClass("active");
  //   this.fromdate = 'overdue';
  //   this.todate = 'overdue';
  //   var param = {
  //     limit: 0,
  //     limitrows: 30,
  //     datefrom: this.fromdate,
  //     dateto: this.todate,
  //     statuss: '',
  //     stage: this.stagevalue,
  //     stagestatus: this.stagestatusval,
  //     propid: this.propertyid,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     team: this.team,
  //     priority: this.priorityName
  //   }
  //   this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
  //     this.filterLoader = false;
  //     this.callerleads = compleads['RMLeads'];
  //     // this.getAllVisitCount();
  //   });
  // }

  //to get All visits leads counts with over all and not been used
  // getAllVisitCount() {
  //   this.closehistory();
  //   var paramcount = {
  //     datefrom: this.fromdate,
  //     dateto: this.todate,
  //     statuss: '',
  //     stage: this.stagevalue,
  //     stagestatus: this.stagestatusval,
  //     propid: this.propertyid,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     team: this.team,
  //     priority: this.priorityName
  //   }
  //   this._mandateService.getCountForDashBoard(paramcount).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.totalcounts = compleads.RMLeads[0].counts;
  //       this.allcountsloadmore = compleads.RMLeads[0].counts;
  //     } else {
  //       this.totalcounts = "0";
  //       this.allcountsloadmore = compleads.RMLeads[0].counts;
  //     }
  //   });
  // }

  //to get All visits i.e vists converted leads
  // allvisits() {
  //   this.closehistory();
  //   LeadassignComponent.closedcount = 0;
  //   LeadassignComponent.count = 0;
  //   this.filterLoader = true;
  //   this.junk = true;
  //   this.actionid = '';
  //   $(".other_section").removeClass("active");
  //   $(".allvisit_section").addClass("active");
  //   var param = {
  //     limit: 0,
  //     limitrows: 30,
  //     datefrom: this.fromdate,
  //     dateto: this.todate,
  //     statuss: this.actionid,
  //     stage: this.stagevalue,
  //     stagestatus: this.stagestatusval,
  //     executid: this.rmid,
  //     propid: this.propertyid,
  //     loginuser: this.userid,
  //     team: this.team,
  //     priority: this.priorityName
  //   }
  //   this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
  //     this.filterLoader = false;
  //     this.callerleads = compleads['RMLeads'];
  //     // this.getAllVisitCount();
  //   });
  // }

  //to get inprogress leads
  inprogresstrigger() {
    this.closehistory();
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.junk = false;
    $(".other_section").removeClass("active");
    $(".progressclass").addClass("active");
    this.actionid = 'Inprogress';
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.actionid,
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName
    }
    this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['RMLeads'];
    });
  }

  //to get interest leads
  interestedtrigger() {
    this.closehistory();
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.junk = false;
    $(".other_section").removeClass("active");
    $(".interestclass").addClass("active");
    this.actionid = 'Intrested';
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.actionid,
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName
    }
    this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['RMLeads'];
    });
  }

  //to get junk leads
  junkclick() {
    this.closehistory();
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.junk = false;
    $(".other_section").removeClass("active");
    $(".junkclass").addClass("active");
    this.actionid = 'Junk';
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.actionid,
      stage: this.stagevalue,
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      team: this.team,
      priority: this.priorityName
    }
    this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['RMLeads'];
    });
  }

  //to get booked leads
  // bookedclick() {
  //   this.closehistory();
  //   LeadassignComponent.closedcount = 0;
  //   LeadassignComponent.count = 0;
  //   this.filterLoader = true;
  //   this.junk = false;
  //   $(".other_section").removeClass("active");
  //   $(".bookedclass").addClass("active");
  //   this.actionid = 'Booked';
  //   var param = {
  //     limit: 0,
  //     limitrows: 30,
  //     datefrom: this.fromdate,
  //     dateto: this.todate,
  //     statuss: this.actionid,
  //     stage: this.stagevalue,
  //     stagestatus: this.stagestatusval,
  //     propid: this.propertyid,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     team: this.team,
  //     priority: this.priorityName
  //   }
  //   this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
  //     this.filterLoader = false;
  //     this.callerleads = compleads['RMLeads'];
  //   });
  // }

  //to get booking request leads
  // bookingreqclick() {
  //   this.closehistory();
  //   LeadassignComponent.closedcount = 0;
  //   LeadassignComponent.count = 0;
  //   this.filterLoader = true;
  //   this.junk = false;
  //   $(".other_section").removeClass("active");
  //   $(".bookrequestclass").addClass("active");
  //   this.actionid = 'Bookingrequest';
  //   var param = {
  //     limit: 0,
  //     limitrows: 30,
  //     datefrom: this.fromdate,
  //     dateto: this.todate,
  //     statuss: this.actionid,
  //     stage: this.stagevalue,
  //     stagestatus: this.stagestatusval,
  //     propid: this.propertyid,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     team: this.team,
  //     priority: this.priorityName
  //   }
  //   this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
  //     this.filterLoader = false;
  //     this.callerleads = compleads['RMLeads'];
  //   });
  // }

  //to get rejected leads
  // rejectreqclick() {
  //   this.closehistory();
  //   LeadassignComponent.closedcount = 0;
  //   LeadassignComponent.count = 0;
  //   this.filterLoader = true;
  //   this.junk = false;
  //   $(".other_section").removeClass("active");
  //   $(".rejectrequestclass").addClass("active");
  //   this.actionid = 'Rejected';
  //   var param = {
  //     limit: 0,
  //     limitrows: 30,
  //     datefrom: this.fromdate,
  //     dateto: this.todate,
  //     statuss: this.actionid,
  //     stage: this.stagevalue,
  //     stagestatus: this.stagestatusval,
  //     propid: this.propertyid,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     team: this.team,
  //     priority: this.priorityName
  //   }
  //   this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
  //     this.filterLoader = false;
  //     this.callerleads = compleads['RMLeads'];
  //   });
  // }

  //to get retail moved leads 
  // retailmovedclick() {
  //   // this.closehistory();
  //   // LeadassignComponent.closedcount = 0;
  //   // LeadassignComponent.count = 0;
  //   // this.filterLoader = true;
  //   // this.junk = false;
  //   // $(".other_section").removeClass("active");
  //   // $(".retailmoveclass").addClass("active");
  //   // this.actionid = 'retail';
  //   // var param = {
  //   //   limit: 0,
  //   //   limitrows: 30,
  //   //   datefrom: this.fromdate,
  //   //   dateto: this.todate,
  //   //   statuss: this.actionid,
  //   //   stage: this.stagevalue,
  //   //   stagestatus: this.stagestatusval,
  //   //   propid: this.propertyid,
  //   //   executid: this.rmid,
  //   //   loginuser: this.userid,
  //   //   team: this.team,
  //   //   priority:this.priorityName
  //   // }
  //   // this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
  //   //   this.filterLoader = false;
  //   //   this.callerleads = compleads['RMLeads'];
  //   // });
  // }

  //  ENQUIRY-VIEW-FROM-DB
  // filterhere() {
  //   this.fromdate = $('#fromdate').val();
  //   this.todate = $('#todate').val();
  //   if (this.fromdate == "" || this.todate == "") {
  //     this.router.navigate([], {
  //       queryParams: {
  //         from: "",
  //         to: ""
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   } else if (this.fromdate == undefined || this.todate == undefined) {
  //     this.router.navigate([], {
  //       queryParams: {
  //         from: "",
  //         to: ""
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   }
  //   else {
  //     LeadassignComponent.closedcount = 0;
  //     LeadassignComponent.count = 0;
  //     this.filterdata = true;
  //     this.datefilterview = true;
  //     this.actionid = "";
  //     this.router.navigate([], {
  //       queryParams: {
  //         from: this.fromdate,
  //         to: this.todate
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   }
  //   $('.modalclick').removeClass('modal-backdrop');
  //   $('.modalclick').removeClass('fade');
  //   $('.modalclick').removeClass('show');
  //   document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');

  // }

  rmchange(vals) {
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.filterdata = true;
    this.executivefilterview = true;
    if (vals.target.value == 'all') {
      if (this.roleid == '1' || this.roleid == '2') {
        this.execid = "";
        this.execname = "";
        this.filterdata = false;
      } else {
        this.execid = "All";
        this.rmid = "All";
      }
      this.executivefilterview = false;
      this.router.navigate([], {
        queryParams: {
          execid: this.execid,
          execname: ""
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.execid = vals.target.value;
      this.rmid = this, this.execid;
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
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.filterLoader = true;
    this.junk = true;

    if (vals.target.value == 'all') {
      this.propertyid = "";
      this.propertyname = "";
      this.filterLoader = false;
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
  }

  // statuschange(vals) {
  //   LeadassignComponent.closedcount = 0;
  //   LeadassignComponent.count = 0;
  //   // this.filterLoader = true;
  //   this.filterdata = true;
  //   this.stagefilterview = true;
  //   this.stagestatusval = "";
  //   this.stagestatusvaltext = "";
  //   this.stagevalue = vals.target.value;

  //   if (this.stagevalue == "USV") {
  //     // this.stagestatus = false;
  //     this.router.navigate([], {
  //       queryParams: {
  //         stage: vals.target.value,
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   } else {
  //     this.stagestatus = true;
  //     this.router.navigate([], {
  //       queryParams: {
  //         stage: vals.target.value,
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //     $("#option-4").prop("checked", false);
  //     $("#option-5").prop("checked", false);
  //     $("#option-6").prop("checked", false);
  //   }
  // }

  // stagestatuschange(vals) {
  //   LeadassignComponent.closedcount = 0;
  //   LeadassignComponent.count = 0;
  //   this.filterLoader = true;
  //   this.filterdata = true;
  //   this.stagestatusfilterview = true;
  //   this.stagestatusval = vals.target.value;
  //   this.router.navigate([], {
  //     queryParams: {
  //       stagestatus: vals.target.value,
  //     },
  //     queryParamsHandling: 'merge',
  //   });
  //   if (this.stagestatusval == '1') {
  //     this.stagestatusvaltext = "Fixed";
  //   } else if (this.stagestatusval == '2') {
  //     this.stagestatusvaltext = "Refixed";
  //   } else if (this.stagestatusval == '3') {
  //     this.stagestatusvaltext = "Done";
  //   }
  // }

  //this method is used only for junk to select the stage
  junkstatuschange(stagetype, statusType) {
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
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

  statuschange(stagetype, substatus) {
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    // this.filterLoader = true;
    this.filterdata = true;
    this.stagefilterview = true;
    this.stagestatusval = "";
    this.stagestatusvaltext = "";
    this.stagevalue = stagetype;


    this.stagestatus = false;
    this.router.navigate([], {
      queryParams: {
        stage: stagetype,
        stagestatus: substatus
      },
      queryParamsHandling: 'merge',
    });
  }

  //this method is used to  select the stage along with stagestatus
  stageStatusChange(stage, vals) {
    this.stagevalue = stage;
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
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
      this.stagestatusvaltext = "Junk";
    }
  }

  teamchange(vals) {
    if (vals.target.value == 'all') {
      this.team = "";
      this.filterLoader = false;
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
      this.router.navigate([], {
        queryParams: {
          visits: '1'
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  prioritychange(vals) {
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
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    $("input[name='executiveFilter']").prop("checked", false);
    this.executivefilterview = false;
    this.execid = "";
    this.execname = "";
    this.searchTerm_executive = '';
    this.mandateExecutivesFilter = this.copyMandateExecutives;
    this.router.navigate([], {
      queryParams: {
        execid: "",
        execname: ""
      },
      queryParamsHandling: 'merge',
    });

  }

  dateclose() {
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.datefilterview = false;
    $('#fromdate').val("");
    $('#todate').val("");
    this.fromdate = "";
    this.todate = "";
    this.actionid = "";
    this.router.navigate([], {
      queryParams: {
        from: '',
        to: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  sourceClose() {
    $("input[name='sourceFilter']").prop("checked", false);
    this.sourceFilter = false;
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.source = "";
    this.searchTerm_source = '';
    this.sourceList = this.copyofsources;
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

  propertyclose() {
    this.propertyfilterview = false;
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.propertyid = "";
    this.stagestatusval = "";
    this.searchTerm = '';
    this.mandateprojects = this.copyofmandateprojects;
    if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
      this.getExecutivesForFilter();
    }
    $("input[name='propFilter']").prop("checked", false);
    this.router.navigate([], {
      queryParams: {
        property: "",
        propname: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  stageclose() {
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.stagefilterview = false;
    this.stagestatus = false;
    this.stagevalue = "";
    this.stagestatusval = "";
    this.router.navigate([], {
      queryParams: {
        stage: "",
        stagestatus: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  priorityClose() {
    this.priorityFilter = false;
    this.priorityName = '';
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
    this.router.navigate([], {
      queryParams: {
        priority: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  //on scroll to fetched the remaining leads
  loadMoreassignedleads() {
    const limit = LeadassignComponent.count += 30;
    if (this.todayvisitsparam == 1) {
      var param = {
        limit: limit,
        limitrows: 30,
        datefrom: this.todaysdateforcompare,
        dateto: this.todaysdateforcompare,
        statuss: 'scheduledtoday',
        stage: this.stagevalue,
        stagestatus: '',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        team: this.team,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.todayvisitscount) {
        this.filterLoader = true;
        this._mandateService.assignedLeads(param).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
            this.filterLoader = false;
          } else {
            this.filterLoader = false;
          }

        })
      }
    } else if (this.todayfollowupsparam == 1) {
      var param1 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.todaysdateforcompare,
        dateto: this.todaysdateforcompare,
        statuss: 'todaysfollowups',
        stage: this.stagevalue,
        stagestatus: '',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        team: this.team,
        priority: this.priorityName,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.todayfollowupscount) {
        this.filterLoader = true;
        this._mandateService.assignedLeads(param1).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
            this.filterLoader = false;
          } else {
            this.filterLoader = false;
          }
        })
      }
    } else if (this.todaysvisitedparam == 1) {
      var curmonth = this.currentDate.getMonth() + 1;
      var curmonthwithzero = curmonth.toString().padStart(2, "0");
      var curday = this.currentDate.getDate();
      var curdaywithzero = curday.toString().padStart(2, "0");
      this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
      var param8 = {
        limit: limit,
        limitrows: 30,
        visitedfrom: this.todaysdate,
        visitedto: this.todaysdate,
        statuss: 'allvisits',
        datefrom: '',
        dateto: '',
        stage: this.stagevalue,
        stagestatus: '3',
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        team: this.team,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.todaystotalcounts) {
        this.filterLoader = true;
        this._mandateService.assignedLeads(param8).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
            this.filterLoader = false;
          } else {
            this.filterLoader = false;
          }
        })
      }
    } else if (this.upcomingvisitparam == 1) {
      var param2 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'upcomingvisit',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        team: this.team,
        priority: this.priorityName,
        source: this.source,
        visits: this.leadstatusVisits,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.upcomingvisits) {
        this.filterLoader = true;
        this._mandateService.assignedLeads(param2).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
            this.filterLoader = false;
          } else {
            this.filterLoader = false;
          }
        })
      }
    } else if (this.upcomingfollowupparam == 1) {
      var param3 = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'upcomingfollowups',
        stage: this.stagevalue,
        stagestatus: this.stagestatusval,
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        team: this.team,
        priority: this.priorityName,
        fromtime: this.fromTime,
        totime: this.toTime,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      let livecount = this.callerleads.length;
      if (livecount < this.upcomingfollowups) {
        this.filterLoader = true;
        this._mandateService.assignedLeads(param3).subscribe(compleads => {
          if (compleads['status'] == 'True') {
            this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
            this.filterLoader = false;
          } else {
            this.filterLoader = false;
          }
        })
      }
    }
    // else if (this.followupsmissedparam == '1') {
    //   let statusdata: any = 'overdues';
    //   let stagedata: any = 'fresh';
    //   var param4 = {
    //     limit: limit,
    //     limitrows: 30,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: statusdata,
    //     stage: stagedata,
    //     stagestatus: this.stagestatusval,
    //     executid: this.rmid,
    //     propid: this.propertyid,
    //     loginuser: this.userid,
    //     team: this.team,
    //     priority: this.priorityName,
    //     source: this.source,
    //     visits: this.leadstatusVisits,
    //   }
    //   if (this.callerleads.length < this.followupsmissedcount) {
    //     this.filterLoader = true;
    //     return this._mandateService.assignedLeads(param4).subscribe(compleads => {
    //       if (compleads['status'] == 'True') {
    //         this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
    //         this.filterLoader = false;
    //       } else {
    //         this.filterLoader = false;
    //       }
    //     })
    //   }
    // }
    //  else if (this.overdueparam == '1') {
    //   this.fromdate = 'overdue';
    //   this.todate = 'overdue';
    //   var param = {
    //     limit: limit,
    //     limitrows: 30,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: this.actionid,
    //     stage: this.stagevalue,
    //     stagestatus: this.stagestatusval,
    //     executid: this.rmid,
    //     propid: this.propertyid,
    //     loginuser: this.userid,
    //     team: this.team,
    //     priority: this.priorityName
    //   }
    //   if (this.callerleads.length <= this.overdue) {
    //     this.filterLoader = true;
    //     return this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
    //       if (compleads['status'] == 'True') {
    //         this.callerleads = this.callerleads.concat(compleads['RMLeads']);
    //         this.filterLoader = false;
    //       } else {
    //         this.filterLoader = false;
    //       }
    //     })
    //   }
    // } else if (this.allvisitparam == '1') {
    //   var param = {
    //     limit: limit,
    //     limitrows: 30,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: this.actionid,
    //     stage: this.stagevalue,
    //     stagestatus: this.stagestatusval,
    //     executid: this.rmid,
    //     propid: this.propertyid,
    //     loginuser: this.userid,
    //     team: this.team,
    //     priority: this.priorityName
    //   }
    //   if (this.callerleads.length <= this.totalcounts) {
    //     this.filterLoader = true;
    //     return this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
    //       if (compleads['status'] == 'True') {
    //         this.callerleads = this.callerleads.concat(compleads['RMLeads']);
    //         this.filterLoader = false;
    //       } else {
    //         this.filterLoader = false;
    //       }
    //     })
    //   }
    // } 
    // else if (this.inprogressparam == '1') {
    //   this.actionid = 'Inprogress';
    //   var param5 = {
    //     limit: limit,
    //     limitrows: 30,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: this.actionid,
    //     stage: this.stagevalue,
    //     stagestatus: this.stagestatusval,
    //     propid: this.propertyid,
    //     executid: this.rmid,
    //     loginuser: this.userid,
    //     team: this.team,
    //     priority: this.priorityName
    //   }
    //   if (this.callerleads.length < this.interested) {
    //     this.filterLoader = true;
    //     return this._mandateService.completeassignedRMLeads(param5).subscribe(compleads => {
    //       if (compleads['status'] == 'True') {
    //         this.callerleads = this.callerleads.concat(compleads['RMLeads']);
    //         this.filterLoader = false;
    //       } else {
    //         this.filterLoader = false;
    //       }
    //     })
    //   }
    // } else if (this.interestedparam == '1') {
    //   this.actionid = 'Intrested';
    //   var param6 = {
    //     limit: limit,
    //     limitrows: 30,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: this.actionid,
    //     stage: this.stagevalue,
    //     stagestatus: this.stagestatusval,
    //     propid: this.propertyid,
    //     executid: this.rmid,
    //     loginuser: this.userid,
    //     team: this.team,
    //     priority: this.priorityName
    //   }
    //   if (this.callerleads.length < this.interested) {
    //     this.filterLoader = true;
    //     return this._mandateService.completeassignedRMLeads(param6).subscribe(compleads => {
    //       if (compleads['status'] == 'True') {
    //         this.callerleads = this.callerleads.concat(compleads['RMLeads']);
    //         this.filterLoader = false;
    //       } else {
    //         this.filterLoader = false;
    //       }
    //     })
    //   }
    // } else if (this.junkparam == '1') {
    //   this.actionid = 'Junk';
    //   var param7 = {
    //     limit: limit,
    //     limitrows: 30,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: this.actionid,
    //     stage: this.stagevalue,
    //     stagestatus: this.stagestatusval,
    //     executid: this.rmid,
    //     propid: this.propertyid,
    //     loginuser: this.userid,
    //     team: this.team,
    //     priority: this.priorityName
    //   }
    //   if (this.callerleads.length < this.notinterested) {
    //     this.filterLoader = true;
    //     return this._mandateService.completeassignedRMLeads(param7).subscribe(compleads => {
    //       if (compleads['status'] == 'True') {
    //         this.callerleads = this.callerleads.concat(compleads['RMLeads']);
    //         this.filterLoader = false;
    //       } else {
    //         this.filterLoader = false;
    //       }
    //     })
    //   }
    // }
    // else if (this.bookedparam == '1') {
    //   this.actionid = 'Booked';
    //   var param = {
    //     limit: limit,
    //     limitrows: 30,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: this.actionid,
    //     stage: this.stagevalue,
    //     stagestatus: this.stagestatusval,
    //     executid: this.rmid,
    //     propid: this.propertyid,
    //     loginuser: this.userid,
    //     team: this.team,
    //     priority: this.priorityName
    //   }
    //   if (this.callerleads.length <= this.booked) {
    //     this.filterLoader = true;
    //     return this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
    //       if (compleads['status'] == 'True') {
    //         this.callerleads = this.callerleads.concat(compleads['RMLeads']);
    //         this.filterLoader = false;
    //       } else {
    //         this.filterLoader = false;
    //       }
    //     })
    //   }
    // } else if (this.bookingreqparam == '1') {
    //   this.actionid = 'Bookingrequest';
    //   var param = {
    //     limit: limit,
    //     limitrows: 30,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: this.actionid,
    //     stage: this.stagevalue,
    //     stagestatus: this.stagestatusval,
    //     executid: this.rmid,
    //     propid: this.propertyid,
    //     loginuser: this.userid,
    //     team: this.team,
    //     priority: this.priorityName
    //   }
    //   if (this.callerleads.length <= this.bookingrequest) {
    //     this.filterLoader = true;
    //     return this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
    //       if (compleads['status'] == 'True') {
    //         this.callerleads = this.callerleads.concat(compleads['RMLeads']);
    //         this.filterLoader = false;
    //       } else {
    //         this.filterLoader = false;
    //       }
    //     })
    //   }
    // } else if (this.rejectreqparam == '1') {
    //   this.actionid = 'Rejected';
    //   var param = {
    //     limit: limit,
    //     limitrows: 30,
    //     datefrom: this.fromdate,
    //     dateto: this.todate,
    //     statuss: this.actionid,
    //     stage: this.stagevalue,
    //     stagestatus: this.stagestatusval,
    //     executid: this.rmid,
    //     propid: this.propertyid,
    //     loginuser: this.userid,
    //     team: this.team,
    //     priority: this.priorityName
    //   }
    //   if (this.callerleads.length <= this.rejected) {
    //     this.filterLoader = true;
    //     return this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
    //       if (compleads['status'] == 'True') {
    //         this.callerleads = this.callerleads.concat(compleads['RMLeads']);
    //         this.filterLoader = false;
    //       } else {
    //         this.filterLoader = false;
    //       }
    //     })
    //   }
    // } else if (this.retailmovedparam == '1') {
    // this.actionid = 'retail';
    // var param = {
    //   limit: limit,
    //   limitrows: 30,
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: this.actionid,
    //   stage: this.stagevalue,
    //   stagestatus: this.stagestatusval,
    //   executid: this.rmid,
    //   propid: this.propertyid,
    //   loginuser: this.userid,
    //   team: this.team,
    //   priority:this.priorityName
    // }
    // if (this.callerleads.length <= this.retailmoved) {
    //   this.filterLoader = true;
    //   return this._mandateService.completeassignedRMLeads(param).subscribe(compleads => {
    //     if (compleads['status'] == 'True') {
    //       this.callerleads = this.callerleads.concat(compleads['RMLeads']);
    //       this.filterLoader = false;
    //     } else {
    //       this.filterLoader = false;
    //     }
    //   })
    // }
    //}
  }

  //reset the filters used 
  refresh() {
    //this  is added to remove the selectedfilter 
    this._mandateService.setControllerName('');
    this.propertyclose();
    this.executiveclose();
    this.stageclose();
    this.dateclose();
    this.sourceClose();
    this.removeselectedLeadStatus();
    this.filterLoader = true;
    this.filterdata = false;
    this.stagestatus = false;
    this.priorityFilter = false;
    this.sourceFilter = false;
    this.executivefilterview = false;
    this.propertyid = "";
    this.selectedLeadStatus = '';
    this.source = '';
    this.fromdate = '';
    this.todate = '';
    this.priorityName = '';
    this.stagevalue = "";
    this.stagestatusval = "";

    if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    } else {
      this.rmid = "";
    }

    this.router.navigate([], {
      queryParams: {
        property: '',
        propname: '',
        execid: '',
        execname: "",
        stage: '',
        stagestatus: "",
        from: "",
        to: '',
        visits: '',
        source: '',
      },
      queryParamsHandling: 'merge',
    });

    $("input[name='propFilter']").prop("checked", false);
    $("input[name='executiveFilter']").prop("checked", false);
    $("input[name='sourceFilter']").prop("checked", false);
    $(".other_section").removeClass("active");
    $(".schedule_today").addClass("active");
    this.apitrigger();
  }

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

  onCheckboxChangesource() {
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
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

  //executives selection  filter
  onCheckboxExecutiveChange() {
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
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

  onCheckboxChange(property) {
    LeadassignComponent.closedcount = 0;
    LeadassignComponent.count = 0;
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
      this.execid = '';
      this.execname = '';
      if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
        this.getExecutivesForFilter();
      }
      $("input[name='executiveFilter']").prop("checked", false);
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

  showdateRange2() {
    // this.datepicker2.show();
    let todaysDate = new Date();
    this.nextActionDateRange = [todaysDate];

    setTimeout(() => {
      const inputElement = this.datepickernextACtion.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      // $('bs-daterangepicker-container').removeAttr('style');
      // $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
      // $("bs-daterangepicker-container").removeClass("visiteddatepkr");
      // $("bs-daterangepicker-container").addClass("nextactiondatepkr");
    }, 0);
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

  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  fromTime: any;
  toTime: any;
  initializeNextActionDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#nextActionDates span').html(start.format('MMMM D, YYYY HH:mm:ss') + ' - ' + end.format('MMMM D, YYYY HH:mm:ss'));
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

  isModalOpen: boolean = false;
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
  //       this.liveCallData = resp.success[0];
  //     } else {
  //       this.liveCallData = '';
  //     }
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
    if ((this.todayvisitsparam || this.todaysvisitedparam || this.upcomingvisitparam) == 1) {
      localStorage.setItem('backLocation', 'scheduled');
    } else if (this.todayfollowupsparam == 1 || this.todayfollowupsparam == 1) {
      localStorage.setItem('backLocation', 'followup');
    }
  }

  redirectTo(lead) {
    console.log(lead);

    this._sharedservice.leads = this.callerleads;
    this._sharedservice.page = LeadassignComponent.count;
    this._sharedservice.scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this._sharedservice.hasState = true;

    localStorage.setItem('backLocation', '');

    let tab;
    if (this.todayfollowupsparam == 1) {
      tab = 'todayfollowupsparam';
    } else if (this.upcomingfollowupparam == 1) {
      tab = 'upcomingfollowupparam';
    }

    const state = {
      fromdate: this.fromdate,
      todate: this.todate,
      execid: this.execid,
      execname: this.execname,
      propertyid: this.propertyid,
      propertyname: this.propertyname,
      source: this.source,
      visits: this.leadstatusVisits,
      stage: this.stagevalue,
      page: LeadassignComponent.count,
      scrollTop: this.scrollContainer.nativeElement.scrollTop,
      leads: this.callerleads,
      tabs: tab,
    };

    sessionStorage.setItem('followup_state', JSON.stringify(state));

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
