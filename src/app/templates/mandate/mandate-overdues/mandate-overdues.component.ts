import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { mandateservice } from '../../../mandate.service';
import { sharedservice } from '../../../shared.service';
import { retailservice } from '../../../retail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { MandateClassService } from '../../../mandate-class.service';
import { EchoService } from '../../../echo.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-overdues',
  templateUrl: './mandate-overdues.component.html',
  styleUrls: ['./mandate-overdues.component.css']
})
export class MandateOverduesComponent implements OnInit {

  @ViewChild('datepicker') datepickernextACtion: ElementRef;

  static count: number = 0;
  followupsoverduesParam: any;
  usvOverduesParam: any;
  ncOverduesParam: any;
  rsvOverduesParam: any;
  fnOverduesParam: any;
  dealPendingOverduesParam: any;
  dealRequestedOverduesParam: any;
  overdueCount: number = 0;
  followupsoverduesCount: number = 0;
  usvOverduesCount: number = 0;
  ncOverduesCount: number = 0;
  rsvOverduesCount: number = 0;
  fnOverduesCount: number = 0;
  dealPendingOverduesCount: number = 0;
  dealRequestedOverduesCount: number = 0;
  callerleads: any;
  roleid: any;
  userid: any;
  filterLoader: boolean = true;
  rmid: any;
  stagestatusval: any;
  stagestatusvaltext: any;
  fromdate: any = '';
  todate: any = '';
  propertyname: any;
  propertyid: any;
  execname: any;
  execid: any;
  searchTerm: string = '';
  searchTerm_executive: string = '';
  mandateExecutivesFilter: any;
  copyMandateExecutives: any;
  mandateprojects: any;
  copyofmandateprojects: any;
  datefilterview: boolean = false;
  propertyfilterview: boolean = false;
  executivefilterview: boolean = false;
  stagestatusfilterview: boolean = false;
  source: any;
  sourceFilter: boolean = false;
  sourceList: any;
  copyofsources: any;
  searchTerm_source: string = '';
  categoryStage: any;
  categoryStageName: any;
  categeoryfilterview: boolean = false;
  searchTerm_stagecategory: string = '';
  followupsections: any;
  followctgFilter: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  overduedDateRange: Date[];

  reassignleadsCount: number = 0;
  selectedEXEC: any;
  selectedExecIds: any;
  selectedAssignedleads: any;
  selectedTeamType: any;
  selectedEXECUTIVES: any;
  selectedEXECUTIVEIDS: any;
  reassignListExecutives: any;
  selectedMandateProp = '';
  selectedReassignTeamType: any = '';
  selectedLeadExecutiveIds: any;
  reassignedResponseInfo: any;
  maxSelectedLabels: number = Infinity;
  randomCheckVal: any = '';
  team: any;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  role_type: any;
  mandateProperty_ID: any;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  // callStatus: any;
  calledLead: any;
  assignedRm: any;
  selectedRecordExec: any;
  audioList: any;
  onRecordExecList: any;
  roleTeam: any;

  constructor(public datepipe: DatePipe, private echoService: EchoService, private readonly _mandateservice: mandateservice, private readonly _retailservice: retailservice, private _sharedservice: sharedservice, private router: Router, private route: ActivatedRoute, private _mandateClassService: MandateClassService,) {
    if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
      this.router.navigateByUrl('/login');
    };
  }

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.role_type = localStorage.getItem('role_type');
    this.mandateProperty_ID = localStorage.getItem('property_ID');

    this.getleadsdata();
    this.mandateprojectsfetch();
    if (this.roleid == 1 || this.roleid == '2' || this.role_type == '1' || this.roleid == '50013' || this.roleid == '50014') {
      this.getsourcelist();
      this.getExecutivesForFilter()
    }

    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.overduedDateRange = [this.currentdateforcompare]

    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
  }

  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeNextActionDateRangePicker();
    }, 0);
  }

  getleadsdata() {
    if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    }
    this.filterLoader = true;
    this.route.queryParams.subscribe((paramss) => {
      // Updated Using Strategy
      this.followupsoverduesParam = paramss['followupsoverdues'];
      this.usvOverduesParam = paramss['usvoverdues'];
      this.ncOverduesParam = paramss['ncoverdues'];
      this.rsvOverduesParam = paramss['rsvoverdues'];
      this.fnOverduesParam = paramss['fnoverdues'];
      this.dealPendingOverduesParam = paramss['dealPending'];
      this.dealRequestedOverduesParam = paramss['dealRequested'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.categoryStage = paramss['followupcategory'];
      this.categoryStageName = paramss['followupcategoryName'];
      this.source = paramss['source'];
      this.propertyid = paramss['property'];
      this.propertyname = paramss['propname'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.stagestatusval = paramss['stagestatus'];
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0)
      this.resetScroll();
      this.detailsPageRedirection();

      if (this.fromdate || this.todate) {
        this.datefilterview = true;
        $("#fromdate").val(this.fromdate);
        $("#todate").val(this.todate);
      } else {
        this.datefilterview = false;
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
          //       this.rmid = localStorage.getItem('UserId');
          //     } else {
          //       this.rmid = this.execid;
          //     }
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
        // }
      } else {
        this.executivefilterview = false;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2' || this.role_type == 1) {
          this.rmid = "";
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      }

      if ((this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null)) {
        this.stagestatusfilterview = false;
        this.stagestatusval = 3;
      } else {
        this.stagestatusfilterview = true;
        if (this.stagestatusval == '1') {
          this.stagestatusvaltext = "Fixed";
        } else if (this.stagestatusval == '2') {
          this.stagestatusvaltext = "Refixed";
        } else if (this.stagestatusval == '3') {
          this.stagestatusvaltext = "Done";
          this.stagestatusfilterview = false;
        } else if (this.stagestatusval == '4') {
          this.stagestatusvaltext = "Followup";
        }
      }

      if (this.source == '' || this.source == null || this.source == undefined) {
        this.sourceFilter = false;
      } else {
        this.sourceFilter = true;
      }

      if ((this.categoryStage == '' || this.categoryStage == undefined) || (this.categoryStageName == '' || this.categoryStageName == undefined)) {
        this.categoryStage = '';
        this.categoryStageName = '';
        this.categeoryfilterview = false;
      } else {
        this.categeoryfilterview = true;
      }

      if (this.followupsoverduesParam == '1') {
        this.batch1trigger();
        this.generalfollowupdata();
        this.getFollowupsStatus();
      } else if (this.usvOverduesParam == '1') {
        this.batch1trigger();
        this.usvOverdueData();
      } else if (this.ncOverduesParam == '1') {
        this.batch1trigger();
        this.ncOverdueData();
      } else if (this.rsvOverduesParam == '1') {
        this.batch1trigger();
        this.rsvOverdueData();
      } else if (this.fnOverduesParam == '1') {
        this.batch1trigger();
        this.fnOverdueData();
      } else if (this.dealPendingOverduesParam == '1') {
        this.batch1trigger();
        this.dealPendingOverdueData();
      } else if (this.dealRequestedOverduesParam == '1') {
        this.batch1trigger();
        this.dealRequestedOverdueData();
      }
    });
  }

  mandateprojectsfetch() {
    this._mandateservice.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
        this.copyofmandateprojects = mandates['Properties']
      } else {
      }
    });
  }

  //get list of mandate executives for mandate for filter purpose
  getExecutivesForFilter() {
    if (this.role_type != 1) {
      this._mandateservice.fetchmandateexecutuvesforreassign(this.propertyid, '', '', '', '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    } else {
      this._mandateservice.fetchmandateexecutuvesforreassign(this.mandateProperty_ID, 2, '', '', this.userid).subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    }
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

  //here we get the list of followups list
  getFollowupsStatus() {
    this._mandateservice.getfollowupsections().subscribe(followupsection => {
      this.followupsections = followupsection;
      if (this.followupsoverduesParam == 1) {
        let id = [1, 5]
        this.followctgFilter = this.followupsections.filter((da) => id.some((num) => {
          return da.followup_section_IDPK == num
        }));
      }
    });
  }

  // custom date filter
  showdateRange() {
    setTimeout(() => {
      const inputElement = this.datepickernextACtion.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
    }, 0);
  }

  //fixed date filter
  selectedDate(selecteddaterange) {
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    // Todays Date
    if (selecteddaterange == '5days') {
      const today = new Date();
      // Subtract 15 days from today's date
      const fiveDaysDate = new Date(today);
      fiveDaysDate.setDate(today.getDate() - 5);
      // Format the dates to 'YYYY-MM-DD' format
      const year = fiveDaysDate.getFullYear();
      const month = (fiveDaysDate.getMonth() + 1).toString().padStart(2, '0');
      const day = fiveDaysDate.getDate().toString().padStart(2, '0');
      const Filter5DaysDate = `${year}-${month}-${day}`;
      // Set the 'from' date to 10 days ago and the 'to' date to today
      this.fromdate = Filter5DaysDate;
      this.todate = today.toISOString().split('T')[0];
      this.datefilterview = true;
    } else if (selecteddaterange == '10days') {
      const today = new Date();
      // Subtract 10 days from today's date
      const tenDaysAgo = new Date(today);
      tenDaysAgo.setDate(today.getDate() - 10);
      // Format the dates to 'YYYY-MM-DD' format
      const year = tenDaysAgo.getFullYear();
      const month = (tenDaysAgo.getMonth() + 1).toString().padStart(2, '0');
      const day = tenDaysAgo.getDate().toString().padStart(2, '0');
      const Filter10DaysDate = `${year}-${month}-${day}`;
      // Set the 'from' date to 10 days ago and the 'to' date to today
      this.fromdate = Filter10DaysDate;
      this.todate = today.toISOString().split('T')[0];
      this.datefilterview = true;
    } else if (selecteddaterange == '15days') {
      const today = new Date();
      // Subtract 15 days from today's date
      const fifteenDaysAgo = new Date(today);
      fifteenDaysAgo.setDate(today.getDate() - 15);
      // Format the dates to 'YYYY-MM-DD' format
      const year = fifteenDaysAgo.getFullYear();
      const month = (fifteenDaysAgo.getMonth() + 1).toString().padStart(2, '0');
      const day = fifteenDaysAgo.getDate().toString().padStart(2, '0');
      const Filter15DaysDate = `${year}-${month}-${day}`;
      // Set the 'from' date to 10 days ago and the 'to' date to today
      this.fromdate = Filter15DaysDate;
      this.todate = today.toISOString().split('T')[0];
      this.datefilterview = true;
    }
    if ((this.fromdate != '' || this.fromdate != null) && (this.todate != '' || this.todate != null)) {
      this.router.navigate([], {
        queryParams: {
          from: this.fromdate,
          to: this.todate
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  //selected dates for filter
  overduedDateRangeSelected(range: Date[]): void {
    this.overduedDateRange = range;
    //Convert the first date of the range to yyyy-mm-dd format
    if (this.overduedDateRange != null || this.overduedDateRange != undefined) {
      let formattedFromDate = this.datepipe.transform(this.overduedDateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.overduedDateRange[1], 'yyyy-MM-dd');
      if (formattedFromDate != null && formattedToDate != null) {
        this.fromdate = formattedFromDate;
        this.todate = formattedToDate;
        this.datefilterview = true;
      }
      this.router.navigate([], {
        queryParams: {
          from: this.fromdate,
          to: this.todate
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  batch1trigger() {
    this.overdueCount = 0
    this.followupsoverduesCount = 0;
    this.usvOverduesCount = 0;
    this.rsvOverduesCount = 0;
    this.fnOverduesCount = 0;
    this.dealPendingOverduesCount = 0;
    this.dealRequestedOverduesCount = 0;

    //here we get the overdue counts
    // var overdue = {
    //   datefrom: this.fromdate,
    //   dateto: this.todate,
    //   statuss: 'overdues',
    //   executid: this.rmid,
    //   loginuser: this.userid,
    //   propid: this.propertyid,
    //   source: this.source
    // }
    // this._mandateservice.assignedLeadsCount(overdue).subscribe(compleads => {
    //   if (compleads['status'] == 'True') {
    //     this.overdueCount = compleads.AssignedLeads[0].counts;
    //   } else {
    //     this.overdueCount = 0;
    //   }
    // })

    //here we get general followups count
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
      followup: this.categoryStage,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(generalfollowupparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.followupsoverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.calculateOverduesCount();
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
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // team: this.team,
      // priority: this.priorityName
    }
    this._mandateservice.assignedLeadsCount(ncparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.ncOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.calculateOverduesCount();
      } else {
        this.ncOverduesCount = 0;
      }
    });

    //here we get usv count
    let stagestatus;
    if (this.stagestatusval == 4 || this.stagestatusval == 5) {
      stagestatus = this.stagestatusval
    } else {
      stagestatus = '3'
    }
    var usvparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'USV',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // team: this.team,
      // priority: this.priorityName
    }
    this._mandateservice.assignedLeadsCount(usvparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.usvOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.calculateOverduesCount();
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
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // team: this.team,
      // priority: this.priorityName
    }
    this._mandateservice.assignedLeadsCount(rsvparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.rsvOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.calculateOverduesCount();
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
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // team: this.team,
      // priority: this.priorityName
    }
    this._mandateservice.assignedLeadsCount(fnparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.fnOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.calculateOverduesCount();
      } else {
        this.fnOverduesCount = 0;
      }
    });

    //here we get deal closing pending count
    var fnparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Deal Closing Pending',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(fnparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.dealPendingOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.calculateOverduesCount();
      } else {
        this.dealPendingOverduesCount = 0;
      }
    });

    //here we get DEal Closing requested count
    var fnparam = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Deal Closing Requested',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
    }
    this._mandateservice.assignedLeadsCount(fnparam).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.dealRequestedOverduesCount = parseInt(compleads.AssignedLeads[0].Uniquee_counts);
        this.calculateOverduesCount();
      } else {
        this.dealRequestedOverduesCount = 0;
      }
    });
  }

  //here we calculate total counts of all the overdues
  calculateOverduesCount(): number {
    return this.overdueCount = this.followupsoverduesCount + this.usvOverduesCount + this.rsvOverduesCount + this.fnOverduesCount + this.ncOverduesCount + this.dealPendingOverduesCount + this.dealRequestedOverduesCount;
  }

  //to fetch general followup leads
  generalfollowupdata() {
    MandateOverduesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".followupsoverdues_section").addClass("active");
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Fresh',
      stagestatus: '',
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      followup: this.categoryStage,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // team: this.team,
      // priority: this.priorityName
    }
    this._mandateservice.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to fetch nc leads
  ncOverdueData() {
    MandateOverduesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".ncoverdues_followups").addClass("active");
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'NC',
      stagestatus: '',
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // team: this.team,
      // priority: this.priorityName
    }
    this._mandateservice.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to fetch usv leads
  usvOverdueData() {
    MandateOverduesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".usvoverdues_followups").addClass("active");
    let stagestatus;
    if (this.stagestatusval == 4 || this.stagestatusval == 5) {
      stagestatus = this.stagestatusval
    } else {
      stagestatus = '3'
    }
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'USV',
      stagestatus: this.stagestatusval,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // team: this.team,
      // priority: this.priorityName
    }
    this._mandateservice.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to fetch rsv leads
  rsvOverdueData() {
    MandateOverduesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".rsvoverdues_section").addClass("active");
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'RSV',
      stagestatus: this.stagestatusval,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // team: this.team,
      // priority: this.priorityName
    }
    this._mandateservice.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //to fetch fn leads
  fnOverdueData() {
    MandateOverduesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".fnoverdues_section").addClass("active");
    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Final Negotiation',
      stagestatus: this.stagestatusval,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      // team: this.team,
      // priority: this.priorityName
    }
    this._mandateservice.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  dealRequestedOverdueData() {
    MandateOverduesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".dealRequestedoverdues_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Deal Closing Requested',
      stagestatus: this.stagestatusval,
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

  dealPendingOverdueData() {
    MandateOverduesComponent.count = 0;
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".dealPendingoverdues_section").addClass("active");
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'overdues',
      stage: 'Deal Closing Pending',
      stagestatus: this.stagestatusval,
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

  loadMoreassignedleads() {
    let limit
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limit = MandateOverduesComponent.count += 100;
    // } else {
    limit = MandateOverduesComponent.count += 30;
    // }

    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // } else {
    //   limitR = 30
    // }
    if (this.followupsoverduesParam == 1) {
      var gfparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Fresh',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: '',
        source: this.source,
        followup: this.categoryStage,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.followupsoverduesCount) {
        this._mandateservice.assignedLeads(gfparam).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.usvOverduesParam == 1) {
      let stagestatus1;
      if (this.stagestatusval == 4 || this.stagestatusval == 5) {
        stagestatus1 = this.stagestatusval
      } else {
        stagestatus1 = '3'
      }
      var usvparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'USV',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.usvOverduesCount) {
        this._mandateservice.assignedLeads(usvparam).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.ncOverduesParam == 1) {
      var ncparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'NC',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: '',
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.ncOverduesCount) {
        this._mandateservice.assignedLeads(ncparam).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.rsvOverduesParam == 1) {
      var rsvparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'RSV',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.rsvOverduesCount) {
        this._mandateservice.assignedLeads(rsvparam).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.fnOverduesParam == 1) {
      var fnparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Final Negotiation',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.fnOverduesCount) {
        this._mandateservice.assignedLeads(fnparam).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.dealPendingOverduesParam == 1) {
      var dealpendingparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Deal Closing Pending',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.dealPendingOverduesCount) {
        this._mandateservice.assignedLeads(dealpendingparam).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.dealRequestedOverduesParam == 1) {
      var fnparam = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Deal Closing Requested',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
      if (this.callerleads.length < this.dealRequestedOverduesCount) {
        this._mandateservice.assignedLeads(fnparam).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    }
  }

  //stage status based filter
  stagestatuschange(vals) {
    this.filterLoader = true;
    this.stagestatusval = vals;
    this.stagestatusfilterview = true;

    $('.add_class').removeClass('active');
    if (vals == 1) {
      $('.fix_section').addClass('active');
    } else if (vals == 3) {
      $('.done_section').addClass('active');
    }

    this.router.navigate([], {
      queryParams: {
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
    }
  }

  morefilter() {
    document.getElementsByClassName('more_filter_maindiv')[0].removeAttribute("hidden");
    $('.modalclick').addClass('modal-backdrop');
    $('.modalclick').addClass('fade');
    $('.modalclick').addClass('show');
  }

  close() {
    $('.modalclick').removeClass('modal-backdrop');
    $('.modalclick').removeClass('fade');
    $('.modalclick').removeClass('show');
    document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
  }

  filterhere() {
    this.datefilterview = false;
    this.fromdate = $('#fromdate').val();
    this.todate = $('#todate').val();
    if ((this.fromdate == "" || this.fromdate == undefined) || (this.todate == "" || this.todate == undefined)) {
      this.router.navigate([], {
        queryParams: {
          from: "",
          to: ""
        },
        queryParamsHandling: 'merge',
      });
    }
    else {
      this.router.navigate([], {
        queryParams: {
          from: this.fromdate,
          to: this.todate
        },
        queryParamsHandling: 'merge',
      });
      this.datefilterview = true;
    }
    $('.modalclick').removeClass('modal-backdrop');
    $('.modalclick').removeClass('fade');
    $('.modalclick').removeClass('show');
    document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
  }

  dateclose() {
    this.datefilterview = false;
    $('#fromdate').val("");
    $('#todate').val("");
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

  executiveclose() {
    $('#rm_dropdown').dropdown('clear');
    $("input[name='executiveFilter']").prop("checked", false);
    MandateOverduesComponent.count = 0;
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
    $('#project_dropdown').dropdown('clear');
    $("input[name='propFilter']").prop("checked", false);
    this.propertyfilterview = false;
    MandateOverduesComponent.count = 0;
    this.propertyid = "";
    this.propertyname = "";
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
    MandateOverduesComponent.count = 0;
    $("#option-1").prop("checked", false);
    $("#option-2").prop("checked", false);
    $("#option-3").prop("checked", false);
    $("#option-4").prop("checked", false);
    $("#option-5").prop("checked", false);
    $("#option-6").prop("checked", false);
    this.stagestatusfilterview = false;
    this.categeoryfilterview = false;
    this.categoryStage = '';
    this.categoryStageName = '';
    this.stagestatusval = "";
    this.router.navigate([], {
      queryParams: {
        stagestatus: "",
        followupcategory: '',
        followupcategoryName: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  sourceClose() {
    $('#source_dropdown').dropdown('clear');
    $("input[name='sourceFilter']").prop("checked", false);
    this.sourceFilter = false;
    MandateOverduesComponent.count = 0;
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

  //reset the filters used 
  refresh() {
    this._mandateservice.setControllerName('');
    this.datefilterview = false;
    this.propertyfilterview = false;
    this.executivefilterview = false;
    this.stagestatusfilterview = false;
    this.sourceFilter = false;
    this.categeoryfilterview = false;
    this.fromdate = '';
    this.todate = '';
    this.propertyname = '';
    this.propertyid = "";
    this.stagestatusval = "";
    this.stagestatusvaltext = '';
    this.execname = null;
    this.execid = null;
    this.rmid = null;
    this.source = '';
    this.categoryStage = '';
    this.categoryStageName = '';
    this.dateclose();
    this.executiveclose();
    this.propertyclose();
    this.stageclose();
    this.sourceClose();
    this.router.navigate([], {
      queryParams: {
        from: '',
        to: '',
        stagestatus: "",
        property: '',
        propname: '',
        execid: null,
        execname: null,
        source: null,
        followupcategory: '',
        followupcategoryName: '',
      },
      queryParamsHandling: 'merge',
    });
    $("input[name='propFilter']").prop("checked", false);
    $("input[name='executiveFilter']").prop("checked", false);
    $("input[name='sourceFilter']").prop("checked", false);
    $("#option-1").prop("checked", false);
    $("#option-2").prop("checked", false);
    $("#option-3").prop("checked", false);
    $("#option-4").prop("checked", false);
    $("#option-5").prop("checked", false);
    $("#option-6").prop("checked", false);
    // $(".other_section").removeClass("active");
    // $(".followupsoverdues_section").addClass("active");
  }

  //property selection  filter
  onCheckboxChange(property) {
    MandateOverduesComponent.count = 0;
    // var checkid = $("input[name='propFilter']:checked").map(function () {
    //   return this.value;
    // }).get().join(',');

    // let filteredPropIds;
    // filteredPropIds = checkid.split(',');

    // let filteredPropsName;
    // filteredPropsName = this.copyofmandateprojects.filter((da) => filteredPropIds.some((prop) => {
    //   return prop == da.property_idfk
    // }));
    // filteredPropsName = filteredPropsName.map((name) => name.property_info_name);

    if (property != null || property != '' || property != undefined) {
      this.propertyfilterview = true;
      this.propertyname = property.property_info_name;
      this.propertyid = property.property_idfk;
      this.execid = '';
      this.execname = '';
      $("input[name='executiveFilter']").prop("checked", false);
      if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
        this.getExecutivesForFilter();
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
    MandateOverduesComponent.count = 0;
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

  //source filter
  onCheckboxChangesource() {
    MandateOverduesComponent.count = 0;
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
      this.sourceList = this.copyofsources.filter(project =>
        project.source.toLowerCase().includes(this.searchTerm_source.toLowerCase())
      );
    } else {
      this.sourceList = this.copyofsources
    }

  }

  //selected followup category
  onCheckboxstageCategoryChange(category) {
    MandateOverduesComponent.count = 0;
    if (category != '' || category != undefined) {
      this.categeoryfilterview = true;
      this.categoryStage = category.followup_section_IDPK;
      this.categoryStageName = category.followup_categories;
      this.router.navigate([], {
        queryParams: {
          followupcategory: this.categoryStage,
          followupcategoryName: this.categoryStageName,
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.categeoryfilterview = false;
      this.categoryStage = '';
      this.categoryStageName = '';
    }

  }

  // Filter followup based on search 
  filterStageCategory(): void {
    if (this.searchTerm_stagecategory != '') {
      this.followctgFilter = this.followctgFilter.filter(exec =>
        exec.followup_categories.toLowerCase().includes(this.searchTerm_stagecategory.toLowerCase())
      );
    } else {
      if (this.followupsoverduesParam == 1) {
        let id = [1, 8]
        this.followctgFilter = this.followupsections.filter((da) => id.some((num) => {
          return da.followup_section_IDPK == num
        }));
      }
    }
  }

  //on clicking on reassign button reassign section will be shown
  onclickReAssign() {
    if (this.followupsoverduesParam == '1') {
      this.reassignleadsCount = this.followupsoverduesCount;
    } else if (this.ncOverduesParam == '1') {
      this.reassignleadsCount = this.ncOverduesCount;
    } else if (this.usvOverduesParam == '1') {
      this.reassignleadsCount = this.usvOverduesCount;
    } else if (this.rsvOverduesParam == '1') {
      this.reassignleadsCount = this.rsvOverduesCount;
    } else if (this.fnOverduesParam == '1') {
      this.reassignleadsCount = this.fnOverduesCount;
    } else if (this.dealPendingOverduesParam == '1') {
      this.reassignleadsCount = this.dealPendingOverduesCount;
    } else if (this.dealRequestedOverduesParam == '1') {
      this.reassignleadsCount = this.dealRequestedOverduesCount;
    }
    this.roleTeam = '';
    this.selectedEXECUTIVES = [];
    // this.reassignTeam('mandate');

    this.selectedTeamType = 'mandate';
    this.selectedMandateProp = '';
    $('#mandate_dropdown').dropdown('clear');
    $('#retail_dropdown').dropdown('clear');
    $('#mandateExec_dropdown').dropdown('clear');
    $('#retailExec_dropdown').dropdown('clear');
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

    // var checkid = $("input[name='programming']:checked").map(function () {
    //   return this.value;
    // }).get().join(',');
    // this.selectedAssignedleads = checkid;
    // if (this.selectedAssignedleads != '') {
    //   var arraylist = this.selectedAssignedleads.split(',');
    //   this.maxSelectedLabels = arraylist.length;
    // }
  }

  //here we get the selected assigned team
  // reassignTeam(type) {
  //   this.selectedTeamType = type;
  //   this.selectedMandateProp = '';
  //   $('#mandate_dropdown').dropdown('clear');
  //   $('#retail_dropdown').dropdown('clear');
  //   $('#mandateExec_dropdown').dropdown('clear');
  //   $('#retailExec_dropdown').dropdown('clear');
  //   $('#property_dropdown').dropdown('clear');
  //   if (type == 'mandate') {
  //     this.mandateprojectsfetch();
  //     this.selectedMandateProp = '16793';
  //     this._mandateservice.fetchmandateexecutuves(16793, '', this.roleTeam).subscribe(executives => {
  //       if (executives['status'] == 'True') {
  //         this.reassignListExecutives = executives['mandateexecutives'];
  //       }
  //     });
  //   } else if (type == 'retail') {
  //     this._retailservice.getRetailExecutives('', '').subscribe(execute => {
  //       this.reassignListExecutives = execute['DashboardCounts'];
  //     })
  //   }
  // }

  //here we get the selected reassign mandate property
  filteredproject: any = '';
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
    // if (event.target.options[event.target.options.selectedIndex].value == '50010' || event.target.options[event.target.options.selectedIndex].value == '50004') {
    //   const teamid = event.target.options[event.target.options.selectedIndex].value;
    //   this._retailservice.getRetailExecutives(teamid, '').subscribe(execute => {
    //     this.reassignListExecutives = execute['DashboardCounts'];
    //   })
    // } else {
    //   this._retailservice.getRetailExecutives('', '').subscribe(execute => {
    //     this.reassignListExecutives = execute['DashboardCounts'];
    //     // this.reassignListExecutives = this.reassignListExecutives.filter((da) => !(this.rmid.includes(da.ExecId)));
    //   })
    // }
    $('#mandateExec_dropdown').dropdown('clear');
    $('#retailExec_dropdown').dropdown('clear');
  };

  //here on clicking random assign the leads will be divided equally assigned 
  checkRandom(event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked == true) {
      this.selectedEXEC = [];
      this.randomCheckVal = 1;
    } else {
      this.selectedEXEC = [];
    }
  }

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
      // this.filterLoader = true;
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
      // this.filterLoader = true;
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
      // this.filterLoader = true;
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
          $('#statuslist_dropdown').dropdown('clear');
          $('#followup_dropdown').dropdown('clear');
          $('#exec_designation').dropdown('clear');
          $('#exec_dropdown').dropdown('clear');
          $('#leadcount_dropdown').dropdown('clear');
          $('#team_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          $('#mandate_dropdown').dropdown('clear');
          $('#retail_dropdown').dropdown('clear');
          $('#mandateExec_dropdown').dropdown('clear');
          $('#retailExec_dropdown').dropdown('clear');
          this.selectedMandateProp = '';
          this.randomCheckVal = '';
          this.selectedEXEC = [];
          this.selectedEXECUTIVEIDS = [];
          this.selectedEXECUTIVES = [];
          this.selectedExecIds = [];
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
      if (this.followupsoverduesParam == 1 || this.ncOverduesParam == 1 || (this.usvOverduesParam == 1 && this.stagestatusval == 1)) {
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
            $('#statuslist_dropdown').dropdown('clear');
            $('#followup_dropdown').dropdown('clear');
            $('#exec_designation').dropdown('clear');
            $('#exec_dropdown').dropdown('clear');
            $('#leadcount_dropdown').dropdown('clear');
            $('#team_dropdown').dropdown('clear');
            $('#property_dropdown').dropdown('clear');
            $('#mandate_dropdown').dropdown('clear');
            $('#retail_dropdown').dropdown('clear');
            $('#mandateExec_dropdown').dropdown('clear');
            $('#retailExec_dropdown').dropdown('clear');
            this.selectedMandateProp = '';
            this.randomCheckVal = '';
            this.selectedEXEC = [];
            this.selectedEXECUTIVEIDS = [];
            this.selectedEXECUTIVES = [];
            this.selectedExecIds = [];
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
        this._mandateservice.visitAssign(param).subscribe((success) => {
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
            $('#statuslist_dropdown').dropdown('clear');
            $('#followup_dropdown').dropdown('clear');
            $('#exec_designation').dropdown('clear');
            $('#exec_dropdown').dropdown('clear');
            $('#leadcount_dropdown').dropdown('clear');
            $('#team_dropdown').dropdown('clear');
            $('#property_dropdown').dropdown('clear');
            $('#mandate_dropdown').dropdown('clear');
            $('#retail_dropdown').dropdown('clear');
            $('#mandateExec_dropdown').dropdown('clear');
            $('#retailExec_dropdown').dropdown('clear');
            this.selectedMandateProp = '';
            this.randomCheckVal = '';
            this.selectedEXEC = [];
            this.selectedEXECUTIVEIDS = [];
            this.selectedEXECUTIVES = [];
            this.selectedExecIds = [];
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
      }
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
    if (this.followupsoverduesParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Fresh',
        stagestatus: '',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        followup: this.categoryStage,
        // team: this.team,
        // priority: this.priorityName
      }
    } else if (this.ncOverduesParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'NC',
        stagestatus: '',
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source
        // team: this.team,
        // priority: this.priorityName
      }
    } else if (this.usvOverduesParam == 1) {
      let stagestatus;
      if (this.stagestatusval == '3' || this.stagestatusval == '' || this.stagestatusval == undefined || this.stagestatusval == null) {
        stagestatus = ''
      } else if (this.stagestatusval == '2' || this.stagestatusval == '1') {
        stagestatus = '';
      }
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'USV',
        stagestatus: stagestatus,
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source
        // team: this.team,
        // priority: this.priorityName
      }
    } else if (this.rsvOverduesParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'RSV',
        stagestatus: this.stagestatusval,
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source
        // team: this.team,
        // priority: this.priorityName
      }
    } else if (this.fnOverduesParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Final Negotiation',
        stagestatus: this.stagestatusval,
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source
      }
    } else if (this.dealPendingOverduesParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Deal Closing Pending',
        stagestatus: this.stagestatusval,
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source
      }
    } else if (this.dealRequestedOverduesParam == 1) {
      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'overdues',
        stage: 'Deal Closing Requested',
        stagestatus: this.stagestatusval,
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        ...(this.role_type == 1 ? { teamlead: this.userid } : {})
      }
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

  //this is triggered when custom is clicked to select the dates.
  initializeNextActionDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      const pickerElement = $('#nextActionDates');
      if (start && end) {
        pickerElement.find('span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          const picker = pickerElement.data('daterangepicker');
          if (picker) {
            picker.setEndDate(end);
          }
        }
      } else {
        pickerElement.find('span').html('Select Date Range');
      }
      if (start && end) {
        this.fromdate = start.format('YYYY-MM-DD');
        this.todate = end.format('YYYY-MM-DD');
        this.router.navigate([], {
          queryParams: {
            from: this.fromdate,
            to: this.todate
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
    localStorage.setItem('backLocation', 'overdues');
  }

}
