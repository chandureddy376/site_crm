import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';
import { sharedservice } from '../../../shared.service';
import { BsDaterangepickerDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { MandateClassService } from '../../../mandate-class.service';
import { EchoService } from '../../../echo.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-plans',
  templateUrl: './mandate-plans.component.html',
  styleUrls: ['./mandate-plans.component.css']
})
export class MandatePlansComponent implements OnInit {


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

  private isCountdownInitialized: boolean;
  filterLoader: boolean = true;
  fromdate: any;
  todate: any;
  rmid: any;
  execid: any;
  propertyid: any;
  propertyname: any;
  static count: number;
  static closedcount: number;
  callerleads: any;
  executives: any;
  filterdata: boolean = false;
  executivefilterview = false;
  propertyfilterview = false;
  stagefilterview = false;
  datefilterview = false;
  execname: any;
  selecteduser: any;
  currentDate = new Date();
  todaysdate: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdaysdateforcompare: any;
  tomorrowsdateforcompare: any;
  stagevalue: any;
  stagestatusval: any;
  stagestatusvaltext: any;
  stagestatus = false;
  roleid: any;
  userid: any;
  mandateprojects: any;
  copyofmandateprojects: any;
  copyofsources: any;
  sourceFilter: boolean = false;
  source: any;
  sourceList: any;
  mandateexecutives: any;
  dateRange: any;
  usvCounts: number = 0;
  rsvCounts: number = 0;
  fnCounts: number = 0;
  leadstatusVisits: any;
  @ViewChild(BsDaterangepickerDirective) datepicker: BsDaterangepickerDirective;
  nextActionDateRange: Date[];
  selectedLeadStatus: string;
  searchTerm: string = '';
  searchTerm_executive: string = '';
  mandateExecutivesFilter: any;
  copyMandateExecutives: any;
  @ViewChild(BsDaterangepickerDirective) datepicker1: BsDaterangepickerDirective;
  @ViewChild(BsDaterangepickerDirective) datepicker2: BsDaterangepickerDirective;
  @ViewChild(BsDaterangepickerDirective) datepicker3: BsDaterangepickerDirective;
  @ViewChild('datepicker1') datepickerreceived: ElementRef;
  @ViewChild('datepicker3') datepickervisited: ElementRef;
  @ViewChild('datepicker2') datepickernextACtion: ElementRef;
  role_type: any;
  mandateProperty_ID: any;
  stageplan: any;
  weekendleadsparam: any;
  weekdaysleadsparam: any;
  ytcleadsparam: any;
  weekendCount: number = 0;
  weekdaysCount: number = 0;
  ytcCount: number = 0;
  weekplanparam: any;
  weekplans: any;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  // callStatus: any;
  calledLead: any;
  assignedRm: any;
  selectedRecordExec: any;
  audioList: any;
  onRecordExecList: any;
  isRestoredFromSession = false;
  // *****************************Assignedleads section list*****************************

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.role_type = localStorage.getItem('role_type');
    this.mandateProperty_ID = localStorage.getItem('property_ID');
    // *********************load the required template files*********************

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
    this.dateRange = [new Date(this.todaysdateforcompare)];
    // Todays Date
    let currentDate = new Date();
    // Yesterdays Date
    const yesterday = () => {
      currentDate.setDate(currentDate.getDate() - 1);
      return currentDate;
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
    if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
    } else if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    }
    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
    // MandatePlansComponent.count = 0;
    // MandatePlansComponent.closedcount = 0;
    if (this.roleid == 1 || this.roleid == '2' || this.roleid == '50013' || this.roleid == '50014') {
      this.getsourcelist();
    }
    this.mandateprojectsfetch();
    this.getExecutivesForFilter();
    const savedState = sessionStorage.getItem('plans_state');

    if (savedState) {
      const state = JSON.parse(savedState);
      this.isRestoredFromSession = true;
      this.fromdate = state.fromdate;
      this.todate = state.todate;
      this.execid = state.execid;
      this.execname = state.execname
      this.propertyid = state.propertyid;
      this.propertyname = state.propertyname

      $(".plan_section").removeClass("active");
      if (state.tabs == 'weekend') {
        this.weekplans = 2;
        this.selectedplanType = 'weekend';
        $(".weekends_section").addClass("active");
        this.nextActionDateRange = [new Date(this.fromdate), new Date(this.todate)];
      } else if (state.tabs == 'weekdays') {
        this.weekplans = 1;
        this.selectedplanType = 'weekdays';
        $(".weekdays_section").addClass("active");
      }

      $(".other_section").removeClass("active");
      if (state.stageplan == 'usv') {
        $(".usv_section").addClass("active");
      } else if (state.stageplan == 'rsv') {
        $(".rsv_section").addClass("active");
      } else if (state.stageplan == 'fn') {
        $(".fn_section").addClass("active");
      }

      MandatePlansComponent.count = state.page;
      this.callerleads = state.leads;

      if (this.propertyid) {
        this.propertyfilterview = true;
      } else {
        this.propertyfilterview = false;
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
        this.datefilterview = false;
      } else {
        this.datefilterview = true;
      }

      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = state.scrollTop;
      }, 0);
      this.filterLoader = false;
      // 🔴 IMPORTANT
      this.batch1trigger();
    }
    this.getleadsdata();
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
    // }
    this.filterLoader = true;
    // MandatePlansComponent.count = 0;
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

      this.weekplanparam = paramss['plan'];
      // this.weekdaysleadsparam = paramss['weekdays'];
      // this.ytcleadsparam = paramss['ytc'];
      this.stageplan = paramss['type']
      // *****************************Assignedleads section list*****************************
      this.propertyid = paramss['property'];
      this.propertyname = paramss['propname'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.stagevalue = paramss['status'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.stagestatusval = paramss['stagestatus'];
      this.source = paramss['source'];
      this.leadstatusVisits = paramss['visits'];
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

      if (this.propertyid) {
        this.propertyfilterview = true;
        if (this.roleid == 1 || this.roleid == '2' || this.role_type == '1') {
          // this.getExecutivesForFilter();
        }
      } else {
        this.propertyfilterview = false;
        if (this.roleid == 1 || this.roleid == '2' || this.role_type == '1') {
          // this.getExecutivesForFilter();
        }
      }

      if (this.execid) {
        this.executivefilterview = true;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == '1') {
          this.rmid = this.execid;
          // } else {
          //   if (this.role_type == '1') {
          //     if (this.execid == '' || this.execid == undefined || this.execid == null) {
          //       this.rmid = '';
          //     } else {
          //       this.rmid = this.execid;
          //     }
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
        // }
      } else {
        this.executivefilterview = false;
        if (this.roleid == '1' || this.roleid == '2' || this.role_type == '1') {
          this.rmid = "";
          this.execid = ''
        }
        // else if (this.role_type == '1') {
        //     if (this.execid == '' || this.execid == undefined || this.execid == null) {
        //       this.rmid = '';
        //     } else {
        //       this.rmid = this.execid;
        //     }
        // } 
        else {
          this.rmid = localStorage.getItem('UserId');
        }
      }

      // if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
      //   this.datefilterview = false;
      //   this.fromdate = '';
      //   this.todate = '';
      // } else {
      //   this.datefilterview = true;
      //   $("#fromdate").val(this.fromdate);
      //   $("#selectedtodate").val(this.todate);
      // }

      // if ((this.receivedFromDate == '' || this.receivedFromDate == undefined || this.receivedFromDate == null) || (this.receivedToDate == '' || this.receivedToDate == undefined || this.receivedToDate == null)) {
      //   this.receivedDatefilterview = false;
      //   this.receivedFromDate = '';
      //   this.receivedToDate = '';
      // } else {
      //   this.receivedDatefilterview = true;
      // }

      // if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == null || this.visitedTo == '' || this.visitedTo == undefined)) {
      //   this.visitedDatefilterview = false;
      //   this.visitedFrom = '';
      //   this.visitedTo = '';
      // } else {
      //   this.visitedDatefilterview = true;
      //   if(this.stagestatusval == 1 || this.stagestatusval == 2){
      //     this.stagestatusval = '';
      //   }

      if (this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
        this.stagefilterview = false;
      } else {
        this.stagefilterview = true;
        if (this.stagestatusval == '1') {
          this.stagestatusvaltext = "Pending";
        } else if (this.stagestatusval == '3') {
          this.stagestatusvaltext = "Done";
        }
      }

      // if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == null) {
      //   this.stagefilterview = false;
      // } else {
      //   this.stagestatus = true;
      //   this.stagefilterview = true;
      // }

      // if ((this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null)) {
      //   this.stagestatusfilterview = false;
      //   this.stagestatusval = '3';
      // } else {
      //   this.stagestatusfilterview = true;
      //   if (this.stagestatusval == '1') {
      //     this.stagestatusvaltext = "Fixed";
      //   } else if (this.stagestatusval == '2') {
      //     this.stagestatusvaltext = "Refixed";
      //   } else if (this.stagestatusval == '3') {
      //     this.stagestatusvaltext = "Done";
      //   } 

      // }
      // if (this.stagestatusval && this.stagestatusval != '3') {
      //   this.stagefilterview = true;
      // }

      // if (this.source) {
      //   this.sourceFilter = true;
      // } else {
      //   this.sourceFilter = false;
      // }

      $(".plan_section").removeClass("active");
      if (this.weekplanparam == 'weekend') {
        this.weekplans = 2;
        this.selectedplanType = 'weekend';
        $(".weekends_section").addClass("active");
        this.nextActionDateRange = [new Date(this.fromdate), new Date(this.todate)];
      } else if (this.weekplanparam == 'weekdays') {
        this.weekplans = 1;
        this.selectedplanType = 'weekdays';
        $(".weekdays_section").addClass("active");
      } else if (this.ytcleadsparam == '1') {
        this.weekplans = 0;
        $(".ytc_section").addClass("active");
      }

      // *****************************Assignedleads section list*****************************
      if (this.stageplan == 'usv') {
        this.stagestatus = false;
        this.batch1trigger();
        this.usvdatas();
      } else if (this.stageplan == 'rsv') {
        this.batch1trigger();
        this.rsvdatas();
      } else if (this.stageplan == 'fn') {
        this.batch1trigger();
        this.fndatas();
      }

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
        this.fromdate = '';
        this.todate = '';
      } else {
        this.datefilterview = true;
        $("#fromdate").val(this.fromdate);
        $("#selectedtodate").val(this.todate);
      }

      // *****************************Assignedleads section list*****************************
    });
  }

  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
        this.copyofmandateprojects = mandates['Properties']
      }
    });
  }

  batch1trigger() {
    this.weekdaysCount = 0;
    this.weekendCount = 0;
    this.usvCounts = 0;
    this.rsvCounts = 0;
    this.fnCounts = 0;
    //weekend plans
    var weekend = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      plan: '2',
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
    }
    this._mandateService.planLeadsCount(weekend).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.weekendCount = compleads.result[0].uniquee_count;
      } else {
        this.weekendCount = 0;
      }
    });
    //weekend plans

    //weekdays plans
    var weekdays = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      plan: '1',
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
    }
    this._mandateService.planLeadsCount(weekdays).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.weekdaysCount = compleads.result[0].uniquee_count;
      } else {
        this.weekdaysCount = 0;
      }
    });
    //weekdays plans

    //usv counts  fetch
    var usvpar = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: 'USV',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      plan: this.weekplans,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
    }
    this._mandateService.planLeadsCount(usvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.usvCounts = compleads.result[0].uniquee_count;
      } else {
        this.usvCounts = 0;
      }
    });
    //usv counts  fetch

    //rsv counts  fetch
    var rsvpar = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: 'RSV',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      plan: this.weekplans,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
    }
    this._mandateService.planLeadsCount(rsvpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.rsvCounts = compleads.result[0].uniquee_count;
      } else {
        this.rsvCounts = 0;
      }
    });
    //rsv counts  fetch

    //fn counts  fetch
    var fnpar = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: 'Final Negotiation',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      visits: this.leadstatusVisits,
      plan: this.weekplans,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
    }
    this._mandateService.planLeadsCount(fnpar).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.fnCounts = compleads.result[0].uniquee_count;
      } else {
        this.fnCounts = 0;
      }
    });
    //fn counts  fetch
  }

  usvdatas() {
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".usv_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: 'USV',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      plan: this.weekplans,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
    }
    this._mandateService.planLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads.status == 'True') {
        if (this.stagestatusval == '1') {
          this.callerleads = compleads['result'].filter((lead) => {
            return lead.leadstagestatus == '1';
          })
        } else if (this.stagestatusval == '3') {
          this.callerleads = compleads['result'].filter((lead) => {
            return lead.leadstagestatus == '3';
          })
        } else {
          let callerleads = compleads['result'];
          // let filterDoneData, filterFixdata;
          // filterDoneData = callerleads.filter((lead) => { return lead.leadstagestatus == '3'; });
          // filterFixdata = callerleads.filter((lead) => { return (lead.leadstagestatus == '1' || lead.leadstagestatus == '2'); });
          // let removedtheFilteredFixData = filterFixdata.filter((lead) => {
          //   return !filterDoneData.some((led) => lead.LeadID === led.LeadID);
          // });
          // this.callerleads = removedtheFilteredFixData.concat(filterDoneData);
          this.callerleads = callerleads.reduce((result, current) => {
            const existingIndex = result.findIndex(item => (item.LeadID == current.LeadID && item.ExecId == current.ExecId));
            if (existingIndex !== -1) {
              // If a duplicate exists, replace it only if the current item's leadstagestatus is "3"
              if (current.leadstagestatus === "3") {
                result[existingIndex] = current;
              }
            } else {
              // If no duplicate exists, add the current item
              result.push(current);
            }
            return result;
          }, []);
        }
      } else {
        this.callerleads = [];
      }
    });
  }

  rsvdatas() {
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".rsv_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: 'RSV',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      plan: this.weekplans,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
    }
    this._mandateService.planLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads.status == 'True') {
        if (this.stagestatusval == '1') {
          this.callerleads = compleads['result'].filter((lead) => {
            return lead.leadstagestatus == '1';
          })
        } else if (this.stagestatusval == '3') {
          this.callerleads = compleads['result'].filter((lead) => {
            return lead.leadstagestatus == '3';
          })
        } else {
          let callerleads = compleads['result'];
          this.callerleads = callerleads.reduce((result, current) => {
            const existingIndex = result.findIndex(item => (item.LeadID == current.LeadID && item.ExecId == current.ExecId));
            if (existingIndex !== -1) {
              // If a duplicate exists, replace it only if the current item's leadstagestatus is "3"
              if (current.leadstagestatus === "3") {
                result[existingIndex] = current;
              }
            } else {
              // If no duplicate exists, add the current item
              result.push(current);
            }
            return result;
          }, []);
        }
      } else {
        this.callerleads = [];
      }
    });
  }

  fndatas() {
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".fn_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: this.stagevalue,
      stage: 'Final Negotiation',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      visits: this.leadstatusVisits,
      plan: this.weekplans,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
    }
    this._mandateService.planLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads.status == 'True') {
        if (this.stagestatusval == '1') {
          this.callerleads = compleads['result'].filter((lead) => {
            return lead.leadstagestatus == '1';
          })
        } else if (this.stagestatusval == '3') {
          this.callerleads = compleads['result'].filter((lead) => {
            return lead.leadstagestatus == '3';
          })
        } else {
          let callerleads = compleads['result'];
          this.callerleads = callerleads.reduce((result, current) => {
            const existingIndex = result.findIndex(item => (item.LeadID == current.LeadID && item.ExecId == current.ExecId));
            if (existingIndex !== -1) {
              // If a duplicate exists, replace it only if the current item's leadstagestatus is "3"
              if (current.leadstagestatus === "3") {
                result[existingIndex] = current;
              }
            } else {
              // If no duplicate exists, add the current item
              result.push(current);
            }
            return result;
          }, []);
        }
      } else {
        this.callerleads = [];
      }
    });
  }

  showdateRange() {
    // this.datepicker1.show();
    let todaysDate = new Date();

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
    let todaysDate = new Date();
    this.nextActionDateRange = [todaysDate];

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

  showdateRange3() {
    // this.datepicker3.show(); 
    let todaysDate = new Date();
    setTimeout(() => {
      const inputElement = this.datepickervisited.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
      $('bs-daterangepicker-container').removeAttr('style');
      $("bs-daterangepicker-container").removeClass("recievedleadsdatepkr");
      $("bs-daterangepicker-container").removeClass("nextactiondatepkr");
      $("bs-daterangepicker-container").addClass("visiteddatepkr");
    }, 0);
  }

  // onLeadReceivedDateRangeSelected(range: Date[]): void {
  //   this.leadReceivedDateRange = range;
  //   //Convert the first date of the range to yyyy-mm-dd format
  //   if (this.leadReceivedDateRange != null || this.leadReceivedDateRange != undefined) {
  //     let formattedFromDate = this.datepipe.transform(this.leadReceivedDateRange[0], 'yyyy-MM-dd');
  //     let formattedToDate = this.datepipe.transform(this.leadReceivedDateRange[1], 'yyyy-MM-dd');
  //     if ((formattedFromDate != null && formattedFromDate != '') && (formattedToDate != null && formattedToDate != '')) {
  //       this.receivedFromDate = formattedFromDate;
  //       this.receivedToDate = formattedToDate;
  //       this.receivedDatefilterview = true;
  //       this.visitedDatefilterview = false;
  //       this.datefilterview = false;
  //       this.router.navigate([], {
  //         queryParams: {
  //           receivedFrom: this.receivedFromDate,
  //           receivedTo: this.receivedToDate
  //         },
  //         queryParamsHandling: 'merge',
  //       });
  //     } else {
  //       this.receivedDatefilterview = false;
  //     }
  //   }
  // }

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

  // onVisitedDateRangeSelected(range) {
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

  // *****************************Assignedleads section list*****************************

  dateclose() {
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;
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

  getExecutives() {
    let teamlead;
    if (this.role_type == 1) {
      teamlead = this.userid
    } else {
      teamlead = '';
    }
    this._mandateService.fetchmandateexecutuves(this.propertyid, '', '', teamlead).subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      }
    });
  }

  statuschange(vals) {
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;
    this.stagefilterview = true;
    this.stagestatusval = "";
    this.stagestatusvaltext = "";
    this.stagevalue = vals.target.value;

    if (this.stagevalue == "USV") {
      this.stagestatus = false;
      this.router.navigate([], {
        queryParams: {
          stage: vals.target.value,
          stagestatus: ""
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.stagestatus = true;
      this.router.navigate([], {
        queryParams: {
          stage: vals.target.value,
        },
        queryParamsHandling: 'merge',
      });
      $("#option-4").prop("checked", false);
      $("#option-5").prop("checked", false);
      $("#option-6").prop("checked", false);
    }
  }

  stagestatuschange(vals) {
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;
    this.stagefilterview = true;
    this.stagestatusval = vals;
    this.router.navigate([], {
      queryParams: {
        stagestatus: vals,
      },
      queryParamsHandling: 'merge',
    });

    if (this.stagestatusval == '1') {
      this.stagestatusvaltext = "Pending";
    } else if (this.stagestatusval == '3') {
      this.stagestatusvaltext = "Done";
    }
  }

  //this method is used only for junk to select the stage
  // junkstatuschange(stagetype, statusType) {
  //   MandatePlansComponent.closedcount = 0;
  //   MandatePlansComponent.count = 0;
  //   // this.filterLoader = true;
  //   this.stagefilterview = true;
  //   // this.stagestatusval = "";
  //   // this.stagestatusvaltext = "";
  //   this.stagevalue = stagetype;
  //   this.stagestatusval = '';

  //   if (this.stagevalue == "Fresh") {
  //     this.stagestatus = true;
  //     this.router.navigate([], {
  //       queryParams: {
  //         stage: stagetype,
  //         stagestatus: ''
  //       },
  //       queryParamsHandling: 'merge',

  //     });
  //   } else {
  //     this.stagestatus = true;
  //     this.router.navigate([], {
  //       queryParams: {
  //         stage: stagetype,
  //         stagestatus: this.stagestatusval
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //     // $("#option-4").prop("checked", false);
  //     // $("#option-5").prop("checked", false);
  //     // $("#option-6").prop("checked", false);
  //     // $("#option-7").prop("checked", false);
  //   }
  // }

  // junkStageStatusChange(stage, vals) {
  //   this.stagevalue = stage;
  //   MandatePlansComponent.closedcount = 0;
  //   MandatePlansComponent.count = 0;
  //   // this.filterLoader = true;
  //   this.stagefilterview = true;
  //   this.stagestatusfilterview = true;
  //   this.stagestatusval = vals;
  //   this.router.navigate([], {
  //     queryParams: {
  //       stage: stage,
  //       stagestatus: vals,
  //     },
  //     queryParamsHandling: 'merge',
  //   });
  //   if (this.stagestatusval == '1') {
  //     this.stagestatusvaltext = "Fixed";
  //   } else if (this.stagestatusval == '2') {
  //     this.stagestatusvaltext = "Refixed";
  //   } else if (this.stagestatusval == '3') {
  //     this.stagestatusvaltext = "Done";
  //   } else if (this.stagestatusval == '4') {
  //     this.stagestatusvaltext = "Followup";
  //   } else if (this.stagestatusval == '5') {
  //     this.stagestatusvaltext = "Junk ";
  //   }
  // }
  // visitedDateclose() {
  //   MandatePlansComponent.closedcount = 0;
  //   MandatePlansComponent.count = 0;
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

  // rmchange(vals) {
  //   MandatePlansComponent.closedcount = 0;
  //   MandatePlansComponent.count = 0;
  //   this.filterLoader = true;
  //   this.executivefilterview = true;
  //   if (vals.target.value == 'all') {
  //     this.filterLoader = false;
  //     this.executivefilterview = false;
  //     this.execid = "";
  //     this.execname = "";
  //     this.router.navigate([], {
  //       queryParams: {
  //         execid: "",
  //         execname: ""
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   } else {
  //     this.execid = vals.target.value;
  //     this.rmid = this.execid;
  //     this.execname = vals.target.options[vals.target.options.selectedIndex].text;
  //     this.router.navigate([], {
  //       queryParams: {
  //         execid: this.execid,
  //         execname: this.execname
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   }

  // }

  // propchange(vals) {
  //   var element = document.getElementById('filtermaindiv');
  //   this.propertyfilterview = true;
  //   MandatePlansComponent.closedcount = 0;
  //   MandatePlansComponent.count = 0;
  //   this.filterLoader = true;

  //   if (vals.target.value == 'all') {
  //     this.filterLoader = false;
  //     this.propertyid = "";
  //     this.propertyname = "";
  //     this.router.navigate([], {
  //       queryParams: {
  //         property: "",
  //         propname: "",
  //         team: "",
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   } else {
  //     this.propertyid = vals.target.value;
  //     this.propertyname = vals.target.options[vals.target.options.selectedIndex].text;
  //     this.router.navigate([], {
  //       queryParams: {
  //         property: this.propertyid,
  //         propname: vals.target.options[vals.target.options.selectedIndex].text,
  //         team: "",
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   }
  //   if (this.propertyid == '16793' || this.propertyid == '1830') {
  //   } else {
  //     this.mandateexecutives = [];
  //     this.getExecutives();
  //   }
  // }

  // sourcechange(vals) {
  //   var element = document.getElementById('filtermaindiv');
  //   this.sourceFilter = true;
  //   MandatePlansComponent.closedcount = 0;
  //   MandatePlansComponent.count = 0;
  //   this.filterLoader = true;

  //   if (vals.target.value == 'all') {
  //     this.filterLoader = false;
  //     this.router.navigate([], {
  //       queryParams: {
  //         source: "",
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   } else {
  //     this.source = vals.target.value;
  //     this.router.navigate([], {
  //       queryParams: {
  //         source: this.source
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   }
  // }
  // sourceClose() {
  //   $("input[name='sourceFilter']").prop("checked", false);
  //   this.sourceFilter = false;
  //   MandatePlansComponent.closedcount = 0;
  //   MandatePlansComponent.count = 0;
  //   this.source = "";
  //   this.router.navigate([], {
  //     queryParams: {
  //       source: ""
  //     },
  //     queryParamsHandling: 'merge',
  //   });
  // }

  // receivedDateclose() {
  //   MandatePlansComponent.closedcount = 0;
  //   MandatePlansComponent.count = 0;
  //   this.receivedDatefilterview = false;
  //   this.receivedFromDate = "";
  //   this.receivedToDate = "";
  //   this.router.navigate([], {
  //     queryParams: {
  //       receivedFrom: "",
  //       receivedTo: ""
  //     },
  //     queryParamsHandling: 'merge',
  //   });
  // }

  executiveclose() {
    $("input[name='executiveFilter']").prop("checked", false);
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;
    this.executivefilterview = false;
    this.execid = null;
    this.execname = null
    this.rmid = null;
    this.searchTerm_executive = '';
    this.mandateExecutivesFilter = this.copyMandateExecutives;
    this.router.navigate([], {
      queryParams: {
        execid: null,
        execname: null
      },
      queryParamsHandling: 'merge',
    });
  }

  propertyclose() {
    $("input[name='propFilter']").prop("checked", false);
    this.propertyfilterview = false;
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;
    this.propertyid = "";
    this.stagestatusval = "";
    this.searchTerm = '';
    if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
      this.getExecutivesForFilter();
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

  stageclose() {
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;
    this.stagefilterview = false;
    this.stagestatusval = "";
    this.router.navigate([], {
      queryParams: {
        stagestatus: "",
      },
      queryParamsHandling: 'merge',
    });
  }

  //this load  is for assigned lead page.
  loadMoreassignedleads() {
    const limit = MandatePlansComponent.count += 30;
    if (this.stageplan == 'usv') {
      var usvpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.stagevalue,
        stage: 'USV',
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        visits: this.leadstatusVisits,
        plan: this.weekplans,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      }
      let livecount = this.callerleads.length;
      if (livecount < this.usvCounts) {
        this._mandateService.planLeads(usvpar).subscribe(compleads => {
          this.filterLoader = false;
          let leadsData;
          leadsData = this.callerleads.concat(compleads['result']);
          if (this.stagestatusval == '1') {
            leadsData = leadsData.filter((lead) => {
              return lead.leadstagestatus == '1';
            })
            this.callerleads = this.callerleads.concat(leadsData);
          } else if (this.stagestatusval == '3') {
            leadsData = leadsData.filter((lead) => {
              return lead.leadstagestatus == '3';
            })
            this.callerleads = this.callerleads.concat(leadsData);
          } else {
            let callerleads = compleads['result'];
            let leads = callerleads.reduce((result, current) => {
              const existingIndex = result.findIndex(item => (item.LeadID === current.LeadID && item.ExecId == current.ExecId));
              if (existingIndex !== -1) {
                if (current.leadstagestatus === "3") {
                  result[existingIndex] = current;
                }
              } else {
                result.push(current);
              }
              return result;
            }, []);
            this.callerleads = this.callerleads.concat(leads);
          }
        });
      }
    } else if (this.stageplan == 'rsv') {
      var rsvpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.stagevalue,
        stage: 'RSV',
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        visits: this.leadstatusVisits,
        plan: this.weekplans,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      }
      let livecount = this.callerleads.length;
      if (livecount < this.rsvCounts) {
        this._mandateService.planLeads(rsvpar).subscribe(compleads => {
          this.filterLoader = false;
          let leadsData;
          leadsData = this.callerleads.concat(compleads['result']);
          if (this.stagestatusval == '1') {
            leadsData = leadsData.filter((lead) => {
              return lead.leadstagestatus == '1';
            })
            this.callerleads = this.callerleads.concat(leadsData);
          } else if (this.stagestatusval == '3') {
            leadsData = leadsData.filter((lead) => {
              return lead.leadstagestatus == '3';
            })
            this.callerleads = this.callerleads.concat(leadsData);
          } else {
            let callerleads = compleads['result'];
            let leads = callerleads.reduce((result, current) => {
              const existingIndex = result.findIndex(item => (item.LeadID === current.LeadID && item.ExecId == current.ExecId));
              if (existingIndex !== -1) {
                if (current.leadstagestatus === "3") {
                  result[existingIndex] = current;
                }
              } else {
                result.push(current);
              }
              return result;
            }, []);
            this.callerleads = this.callerleads.concat(leads);
          }
        });
      }
    } else if (this.stageplan == 'fn') {
      var fnpar = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: this.stagevalue,
        stage: 'Final Negotiation',
        stagestatus: this.stagestatusval,
        propid: this.propertyid,
        executid: this.rmid,
        loginuser: this.userid,
        visits: this.leadstatusVisits,
        plan: this.weekplans,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {}),
      }
      let livecount = this.callerleads.length;
      if (livecount < this.fnCounts) {
        this._mandateService.planLeads(fnpar).subscribe(compleads => {
          this.filterLoader = false;
          let leadsData;
          leadsData = this.callerleads.concat(compleads['result']);
          if (this.stagestatusval == '1') {
            leadsData = leadsData.filter((lead) => {
              return (lead.leadstagestatus == '1' || lead.leadstagestatus == '2');
            })
            this.callerleads = this.callerleads.concat(leadsData);
          } else if (this.stagestatusval == '3') {
            leadsData = leadsData.filter((lead) => {
              return lead.leadstagestatus == '3';
            })
            this.callerleads = this.callerleads.concat(leadsData);
          } else {
            let callerleads = compleads['result'];
            let leads = callerleads.reduce((result, current) => {
              const existingIndex = result.findIndex(item => (item.LeadID === current.LeadID && item.ExecId == current.ExecId));
              if (existingIndex !== -1) {
                if (current.leadstagestatus === "3") {
                  result[existingIndex] = current;
                }
              } else {
                result.push(current);
              }
              return result;
            }, []);
            this.callerleads = this.callerleads.concat(leads);
          }
        });
      }
    }
  }

  refresh() {
    this._mandateService.setControllerName('');
    this.stagevalue = "";
    this.stagestatusval = "";
    this.stagestatusvaltext = '';
    this.execname = '';
    this.execid = '';
    this.rmid = '';
    this.propertyname = '';
    this.propertyid = "";
    this.selectedLeadStatus = '';
    this.propertyfilterview = false;
    this.executivefilterview = false;
    this.stagefilterview = false;

    this.propertyclose();
    this.executiveclose();
    this.stageclose();


    if (this.weekplanparam == 'weekdays') {
      this.currentdateforcompare = new Date();
      const getCurrentWeekdays = () => {
        const currentDay = this.currentdateforcompare.getDay();
        let fromDate, toDate;
        // Check if the current day is between Monday (1) and Friday (5)
        if (currentDay >= 1 && currentDay <= 5) {
          // Calculate Monday of the current week
          const diffToMonday = currentDay - 1;
          fromDate = new Date(this.currentdateforcompare);
          fromDate.setDate(this.currentdateforcompare.getDate() - diffToMonday);
          // Calculate Friday of the current week
          toDate = new Date(fromDate);
          toDate.setDate(fromDate.getDate() + 4);
          this.nextActionDateRange = [fromDate, toDate];
        } else {
          // If today is Saturday or Sunday, calculate the next week's Monday to Friday
          const diffToNextMonday = 8 - currentDay;
          fromDate = new Date(this.currentdateforcompare);
          fromDate.setDate(this.currentdateforcompare.getDate() + diffToNextMonday);
          toDate = new Date(fromDate);
          toDate.setDate(fromDate.getDate() + 4);
          this.nextActionDateRange = [fromDate, toDate];
        }
        const fromDateFormatted = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1).toString().padStart(2, "0") + "-" + fromDate.getDate().toString().padStart(2, "0");
        const toDateFormatted = toDate.getFullYear() + "-" + (toDate.getMonth() + 1).toString().padStart(2, "0") + "-" + toDate.getDate().toString().padStart(2, "0");
        return { from: fromDateFormatted, to: toDateFormatted };
      };
      const weekdays = getCurrentWeekdays();
      this.fromdate = weekdays.from;
      this.todate = weekdays.to;

      this.router.navigate([], {
        queryParams: {
          weekends: 1,
          from: this.fromdate,
          to: this.todate,
          execid: '',
          execname: '',
          status: '',
          propname: '',
          property: '',
          stagestatus: ''
        },
        queryParamsHandling: 'merge',
      });
    } else if (this.weekplanparam == 'weekend') {
      this.currentdateforcompare = new Date();
      const getUpcomingWeekendDates = () => {
        const currentDay = this.currentdateforcompare.getDay();
        let fromDate, toDate;
        if (currentDay === 6) {
          fromDate = new Date(this.currentdateforcompare);
          toDate = new Date(this.currentdateforcompare);
          toDate.setDate(this.currentdateforcompare.getDate() + 1);
          this.nextActionDateRange = [fromDate, toDate];
        } else if (currentDay === 0) {  // Sunday
          fromDate = new Date(this.currentdateforcompare);
          fromDate.setDate(this.currentdateforcompare.getDate() - 1);
          toDate = new Date(this.currentdateforcompare);
          this.nextActionDateRange = [fromDate, toDate];
        } else {
          const diffToSaturday = 6 - currentDay;
          const diffToSunday = diffToSaturday + 1;

          fromDate = new Date(this.currentdateforcompare);
          fromDate.setDate(this.currentdateforcompare.getDate() + diffToSaturday);

          toDate = new Date(this.currentdateforcompare);
          toDate.setDate(this.currentdateforcompare.getDate() + diffToSunday);

          this.nextActionDateRange = [fromDate, toDate];
        }
        const fromDateFormatted = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1).toString().padStart(2, "0") + "-" + fromDate.getDate().toString().padStart(2, "0");
        const toDateFormatted = toDate.getFullYear() + "-" + (toDate.getMonth() + 1).toString().padStart(2, "0") + "-" + toDate.getDate().toString().padStart(2, "0");
        return { from: fromDateFormatted, to: toDateFormatted };
      };
      const weekendDates = getUpcomingWeekendDates();
      this.fromdate = weekendDates.from;
      this.todate = weekendDates.to;

      this.router.navigate([], {
        queryParams: {
          weekdays: 1,
          from: this.fromdate,
          to: this.todate,
          execid: '',
          execname: '',
          status: '',
          propname: '',
          property: '',
          stagestatus: ''
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.fromdate = '';
      this.todate = '';

      this.router.navigate([], {
        queryParams: {
          ytc: 1,
          from: this.fromdate,
          to: this.todate,
          execid: '',
          execname: '',
          status: '',
          propname: '',
          property: '',
          stagestatus: ''
        },
        queryParamsHandling: 'merge',
      });
    }

    $("input[name='propFilter']").prop("checked", false);
    $("input[name='executiveFilter']").prop("checked", false);
    $("input[name='sourceFilter']").prop("checked", false);
    this.apitrigger();
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

  apitrigger() {
    if (this.weekplanparam == 'weekend') {
      this.weekplans = 2;
      this.selectedplanType = 'weekend';
      $(".plan_section").removeClass("active");
      $(".weekends_section").addClass("active");
      this.nextActionDateRange = [new Date(this.fromdate), new Date(this.todate)];
    } else if (this.weekplanparam == 'weekdays') {
      this.weekplans = 1;
      this.selectedplanType = 'weekdays';
      $(".plan_section").removeClass("active");
      $(".weekdays_section").addClass("active");
    } else if (this.weekplanparam == 'ytc') {
      this.weekplans = 0;
      $(".plan_section").removeClass("active");
      $(".ytc_section").addClass("active");
    }

    if (this.stageplan == 'usv') {
      this.stagestatus = false;
      this.batch1trigger();
      this.usvdatas();
    } else if (this.stageplan == 'rsv') {
      this.batch1trigger();
      this.rsvdatas();
    } else if (this.stageplan == 'fn') {
      this.batch1trigger();
      this.fndatas();
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

  removeselectedLeadStatus() {
    this.selectedLeadStatus = '';
    this.router.navigate([], {
      queryParams: {
        visits: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  //property selection  filter
  onCheckboxChange(property) {
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;

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

  //executives selection  filter
  onCheckboxExecutiveChange() {
    MandatePlansComponent.closedcount = 0;
    MandatePlansComponent.count = 0;
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
    if (this.role_type != 1) {
      this._mandateService.fetchmandateexecutuvesforreassign(this.propertyid, '', '', '', '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    } else {
      this._mandateService.fetchmandateexecutuvesforreassign(this.mandateProperty_ID, 2, '', '', this.userid).subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    }
  }

  modaldropadd() { }

  onTabPlan(type) {
    if (type == 'weekends') {
      $(".plan_section").removeClass("active");
      $(".weekends_section").addClass("active");
      this.fromdate = '';
      this.todate = '';
      this.currentdateforcompare = new Date();
      if ((this.fromdate == '' || this.fromdate == null || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        const getUpcomingWeekendDates = () => {
          const currentDay = this.currentdateforcompare.getDay();
          let fromDate, toDate;
          if (currentDay === 6) {
            fromDate = new Date(this.currentdateforcompare);
            toDate = new Date(this.currentdateforcompare);
            toDate.setDate(this.currentdateforcompare.getDate() + 1);
            this.nextActionDateRange = [fromDate, toDate];
          } else if (currentDay === 0) {  // Sunday
            fromDate = new Date(this.currentdateforcompare);
            fromDate.setDate(this.currentdateforcompare.getDate() - 1);
            toDate = new Date(this.currentdateforcompare);
            this.nextActionDateRange = [fromDate, toDate];
          } else {
            const diffToSaturday = 6 - currentDay;
            const diffToSunday = diffToSaturday + 1;

            fromDate = new Date(this.currentdateforcompare);
            fromDate.setDate(this.currentdateforcompare.getDate() + diffToSaturday);

            toDate = new Date(this.currentdateforcompare);
            toDate.setDate(this.currentdateforcompare.getDate() + diffToSunday);

            this.nextActionDateRange = [fromDate, toDate];
          }
          const fromDateFormatted = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1).toString().padStart(2, "0") + "-" + fromDate.getDate().toString().padStart(2, "0");
          const toDateFormatted = toDate.getFullYear() + "-" + (toDate.getMonth() + 1).toString().padStart(2, "0") + "-" + toDate.getDate().toString().padStart(2, "0");
          return { from: fromDateFormatted, to: toDateFormatted };
        };
        const weekendDates = getUpcomingWeekendDates();
        this.fromdate = weekendDates.from;
        this.todate = weekendDates.to;
      } else {
        this.fromdate = this.fromdate;
        this.todate = this.todate;
        this.nextActionDateRange = [new Date(this.fromdate), new Date(this.todate)];
      }
      this.initializeNextActionDateRangePicker();
      this.router.navigate(['/mandate-plans'], {
        queryParams: {
          plan: 'weekend',
          type: this.stageplan,
          from: this.fromdate,
          to: this.todate,
          execid: this.execid,
          execname: this.execname,
          property: this.propertyid,
          propname: this.propertyname,
          stagestatus: this.stagestatusval,
          htype: 'mandate'
        }
      })
    } else if (type == 'weekdays') {
      $(".plan_section").removeClass("active");
      $(".weekdays_section").addClass("active");
      this.fromdate = '';
      this.todate = '';
      this.currentdateforcompare = new Date();
      if ((this.fromdate == '' || this.fromdate == null || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");

        const getCurrentWeekdays = () => {
          const currentDay = this.currentdateforcompare.getDay();
          let fromDate, toDate;
          // Check if the current day is between Monday (1) and Friday (5)
          if (currentDay >= 1 && currentDay <= 5) {
            // Calculate Monday of the current week
            const diffToMonday = currentDay - 1;
            fromDate = new Date(this.currentdateforcompare);
            fromDate.setDate(this.currentdateforcompare.getDate() - diffToMonday);
            // Calculate Friday of the current week
            toDate = new Date(fromDate);
            toDate.setDate(fromDate.getDate() + 4);
            this.nextActionDateRange = [fromDate, toDate];
          } else {
            // If today is Saturday or Sunday, calculate the next week's Monday to Friday
            const diffToNextMonday = 8 - currentDay;
            fromDate = new Date(this.currentdateforcompare);
            fromDate.setDate(this.currentdateforcompare.getDate() + diffToNextMonday);
            toDate = new Date(fromDate);
            toDate.setDate(fromDate.getDate() + 4);
            this.nextActionDateRange = [fromDate, toDate];
          }
          const fromDateFormatted = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1).toString().padStart(2, "0") + "-" + fromDate.getDate().toString().padStart(2, "0");
          const toDateFormatted = toDate.getFullYear() + "-" + (toDate.getMonth() + 1).toString().padStart(2, "0") + "-" + toDate.getDate().toString().padStart(2, "0");
          return { from: fromDateFormatted, to: toDateFormatted };
        };

        const weekdays = getCurrentWeekdays();
        this.fromdate = weekdays.from;
        this.todate = weekdays.to;
      } else {
        this.fromdate = this.fromdate;
        this.todate = this.todate;
        this.nextActionDateRange = [new Date(this.fromdate), new Date(this.todate)];
      }
      this.initializeNextActionDateRangePicker();
      this.router.navigate(['/mandate-plans'], {
        queryParams: {
          plan: 'weekdays',
          type: this.stageplan,
          from: this.fromdate,
          to: this.todate,
          execid: this.execid,
          execname: this.execname,
          property: this.propertyid,
          propname: this.propertyname,
          stagestatus: this.stagestatusval,
          htype: 'mandate'
        }
      })
    } else if (type == 'ytc') {
      $(".plan_section").removeClass("active");
      $(".ytc_section").addClass("active");
      this.router.navigate(['/mandate-plans'], {
        queryParams: {
          plan: 'ytc',
          type: this.stageplan,
          from: this.fromdate,
          to: this.todate,
          execid: this.execid,
          execname: this.execname,
          property: this.propertyid,
          propname: this.propertyname,
          stagestatus: this.stagestatusval,
          htype: 'mandate'
        }
      })
    }
  }

  onstageTab(type) {
    if (type == 'usv') {
      this.router.navigate(['/mandate-plans'], {
        queryParams: {
          plan: this.weekplanparam,
          type: 'usv',
          from: this.fromdate,
          to: this.todate,
          status: this.stagevalue,
          execid: this.execid,
          execname: this.execname,
          property: this.propertyid,
          propname: this.propertyname,
          stagestatus: this.stagestatusval,
          htype: 'mandate'
        }
      })
    } else if (type == 'rsv') {
      this.router.navigate(['/mandate-plans'], {
        queryParams: {
          plan: this.weekplanparam,
          type: 'rsv',
          from: this.fromdate,
          to: this.todate,
          status: this.stagevalue,
          execid: this.execid,
          execname: this.execname,
          property: this.propertyid,
          propname: this.propertyname,
          stagestatus: this.stagestatusval,
          htype: 'mandate'
        }
      })
    } else if (type == 'fn') {
      this.router.navigate(['/mandate-plans'], {
        queryParams: {
          plan: this.weekplanparam,
          type: 'fn',
          from: this.fromdate,
          to: this.todate,
          status: this.stagevalue,
          execid: this.execid,
          execname: this.execname,
          property: this.propertyid,
          propname: this.propertyname,
          stagestatus: this.stagestatusval,
          htype: 'mandate'
        }
      })
    }
  }

  selectedplanType: any;
  lastWeek(type) {
    if (type == 'weekend') {
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
        // Store the date range (previous Saturday and Sunday)
        this.nextActionDateRange = [saturdayDate, sundayDate];
        // Format the dates as YYYY-MM-DD
        const saturdayFormatted = saturdayDate.getFullYear() + "-" + (saturdayDate.getMonth() + 1).toString().padStart(2, "0") + "-" + saturdayDate.getDate().toString().padStart(2, "0");
        const sundayFormatted = sundayDate.getFullYear() + "-" + (sundayDate.getMonth() + 1).toString().padStart(2, "0") + "-" + sundayDate.getDate().toString().padStart(2, "0");
        return { saturday: saturdayFormatted, sunday: sundayFormatted };
      };
      const weekend = getPreviousWeekend();
      this.fromdate = weekend.saturday;
      this.todate = weekend.sunday;
      this.router.navigate([], {
        queryParams: {
          from: this.fromdate,
          to: this.todate
        },
        queryParamsHandling: 'merge',
      });
    } else if (type == 'weekdays') {
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
        this.nextActionDateRange = [fromDate, toDate];
        const fromDateFormatted = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1).toString().padStart(2, "0") + "-" + fromDate.getDate().toString().padStart(2, "0");
        const toDateFormatted = toDate.getFullYear() + "-" + (toDate.getMonth() + 1).toString().padStart(2, "0") + "-" + toDate.getDate().toString().padStart(2, "0");
        return { from: fromDateFormatted, to: toDateFormatted };
      };
      const weekdays = getPreviousWeekdays();
      this.fromdate = weekdays.from;
      this.todate = weekdays.to;

      this.router.navigate([], {
        queryParams: {
          from: this.fromdate,
          to: this.todate
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  initializeNextActionDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      const pickerElement = $('#confirmedOnDates');
      if (start && end) {
        pickerElement.find('span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      } else {
        pickerElement.find('span').html('Select Date Range');
      }
      if (start && end) {
        this.fromdate = start.format('YYYY-MM-DD');
        this.todate = end.format('YYYY-MM-DD');
        this.datefilterview = true;
        this.router.navigate([], {
          queryParams: {
            from: this.fromdate,
            to: this.todate
          },
          queryParamsHandling: 'merge',
        });
      }
    };

    // Retrieve the date range from the URL query params (if any)
    const urlParams = new URLSearchParams(window.location.search);
    const fromDate = urlParams.get('from');
    const toDate = urlParams.get('to');

    // Initialize start and end dates based on URL parameters or default values
    let startDate = fromDate ? moment(fromDate) : null;
    let endDate = toDate ? moment(toDate) : null;

    if (this.weekplanparam == 'weekend')
      $('#confirmedOnDates').daterangepicker({
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
    else if (this.weekplanparam == 'weekdays') {
      $('#confirmedOnDates').daterangepicker({
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
    }

    // Trigger the callback function with the initial dates
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
    localStorage.setItem('backLocation', 'plans');
  }

  redirectTo(lead) {
    console.log(lead);
    // save data
    this._sharedservice.leads = this.callerleads;
    this._sharedservice.page = MandatePlansComponent.count;
    this._sharedservice.scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this._sharedservice.hasState = true;

    localStorage.setItem('backLocation', '');

    const state = {
      fromdate: this.fromdate,
      todate: this.todate,
      execid: this.execid,
      execname: this.execname,
      propertyid: this.propertyid,
      propertyname: this.propertyname,
      page: MandatePlansComponent.count,
      scrollTop: this.scrollContainer.nativeElement.scrollTop,
      leads: this.callerleads,
      tabs: this.weekplanparam,
      stageplan: this.stageplan
    };

    sessionStorage.setItem('plans_state', JSON.stringify(state));

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
