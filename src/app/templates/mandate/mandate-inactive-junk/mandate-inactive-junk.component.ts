import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { sharedservice } from '../../../shared.service';
import { mandateservice } from '../../../mandate.service';
import { retailservice } from '../../../retail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MandateClassService } from '../../../mandate-class.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-inactive-junk',
  templateUrl: './mandate-inactive-junk.component.html',
  styleUrls: ['./mandate-inactive-junk.component.css']
})
export class MandateInactiveJunkComponent implements OnInit {

  static count: number = 0;
  inactive1Param: any;
  inactive2Param: any;
  inactive3Param: any;
  inactive4Param: any;
  inactiveFinalParam: any;
  inactiveCount: number = 0;
  inactive1Count: number = 0;
  inactive2Count: number = 0;
  inactive3Count: number = 0;
  inactive4Count: number = 0;
  inactiveFinalCount: number = 0;

  junk1Param: any;
  junk2Param: any;
  junk3Param: any;
  junk4Param: any;
  junkFinalParam: any;
  junkCount: number = 0;
  junk1Count: number = 0;
  junk2Count: number = 0;
  junk3Count: number = 0;
  junk4Count: number = 0;
  junkFinalCount: number = 0;

  isInactive: boolean = false;
  isJunk: boolean = false;

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
  executivesFilter: any;
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
  stagefilterview: boolean = false;

  //reassign section variables
  //reassign variables
  selectedStatus: any = '';
  reassignleadsCount: number = 0;
  mandateExecutives: any
  selectedReassignTeam: any;
  selectedEXEC: any;
  selectedExecIds: any;
  selectedAssignedleads: any;
  selectedLeadExecutiveIds: any;
  choosedReAssignLeads: any;
  selectedTeamType: any;
  selectedEXECUTIVES: any;
  selectedEXECUTIVEIDS: any;
  reassignListExecutives: any;
  selectedMandateProp = '';
  selectedReassignTeamType: any = '';
  reassignedResponseInfo: any;
  maxSelectedLabels: number = Infinity;
  reassignfromdate: any;
  reassigntodate: any;
  randomCheckVal: any = '';
  status: any;
  leadtype: any;
  role_type: any;
  junkvisitsCount: number = 0;
  stagevalue: any;
  stagestatus: boolean = false;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  team: any;
  mandateExecutivesFilter: any;
  mandateProperty_ID: any;
  copyMandateExecutives: any;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  roleTeam:any;

  constructor(private readonly _sharedService: sharedservice, private readonly _mandateService: mandateservice, private readonly _retailservice: retailservice, private router: Router, private route: ActivatedRoute, private _mandateClassService:MandateClassService,) {
    if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
      this.router.navigateByUrl('/login');
    };
  }

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.role_type = localStorage.getItem('role_type');
    this.mandateProperty_ID = localStorage.getItem('property_ID');

    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.getleadsdata();
    this.mandateprojectsfetch();
    this.getsourcelist();
    this.getExecutivesForFilter();
    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resetScroll();
    }, 0);
  }

  ngOnDestroy() {
    if(this.hoverSubscription){
      this.hoverSubscription.unsubscribe();
    }
  }

  getleadsdata() {
    if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    }
    this.filterLoader = false;
    this.route.queryParams.subscribe((paramss) => {
      // Updated Using Strategy
      this.leadtype = paramss['type'];
      this.inactive1Param = paramss['inactive1'];
      this.inactive2Param = paramss['inactive2'];
      this.inactive3Param = paramss['inactive3'];
      this.inactive4Param = paramss['inactive4'];
      this.inactiveFinalParam = paramss['inactivefinal'];

      this.junk1Param = paramss['junk1'];
      this.junk2Param = paramss['junk2'];
      this.junk3Param = paramss['junk3'];
      this.junk4Param = paramss['junk4'];
      this.junkFinalParam = paramss['junkfinal'];

      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.source = paramss['source'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.propertyid = paramss['property'];
      this.propertyname = paramss['propname'];
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
          this.rmid = localStorage.getItem('UserId');
        }
      } else {
        this.executivefilterview = false;
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
          this.rmid = "";
        } else {
          this.rmid = localStorage.getItem('UserId');
        }
      }

      if (this.stagestatusval) {
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

      if (this.source == '' || this.source == null || this.source == undefined) {
        this.sourceFilter = false;
      } else {
        this.sourceFilter = true;
      }

      $(".traffic_section").removeClass("active");
      if (this.leadtype == 'inactive') {
        this.getInactiveJunkCounts();
        setTimeout(() => {
          $(".inactive_section").addClass("active");
        }, 0)
      } else if (this.leadtype == 'junkleads') {
        this.getInactiveJunkCounts();
        setTimeout(() => {
          $(".junkleads_section").addClass("active");
        }, 0)
      } else if (this.leadtype == 'junkvisits') {
        this.getInactiveJunkCounts();
        setTimeout(() => {
          $(".junkvisits_section").addClass("active");
        }, 0)
      }

      if (this.inactive1Param == '1') {
        this.inactivebatch1trigger();
        this.inactiveDataFetch();
        this.isInactive = true;
        this.isJunk = false;
      } else if (this.inactive2Param == '1') {
        this.inactivebatch1trigger();
        this.inactiveDataFetch();
        this.isInactive = true;
        this.isJunk = false;
      } else if (this.inactive3Param == '1') {
        this.inactivebatch1trigger();
        this.inactiveDataFetch();
        this.isInactive = true;
        this.isJunk = false;
      } else if (this.inactive4Param == '1') {
        this.inactivebatch1trigger();
        this.inactiveDataFetch();
        this.isInactive = true;
        this.isJunk = false;
      } else if (this.inactiveFinalParam == '1') {
        this.inactivebatch1trigger();
        this.inactiveDataFetch();
        this.isInactive = true;
        this.isJunk = false;
      }

      if (this.junk1Param == '1') {
        if (this.leadtype == 'junkleads') {
          this.junkbatchtrigger();
          this.getjunkdata()
        } else {
          this.junkbatchtrigger();
          this.getjunkvisitsdata()
        }
        this.isJunk = true;
        this.isInactive = false;
      } else if (this.junk2Param == '1') {
        if (this.leadtype == 'junkleads') {
          this.junkbatchtrigger();
          this.getjunkdata()
        } else {
          this.junkbatchtrigger();
          this.getjunkvisitsdata()
        }
        this.isJunk = true;
        this.isInactive = false;
      } else if (this.junk3Param == '1') {
        if (this.leadtype == 'junkleads') {
          this.junkbatchtrigger();
          this.getjunkdata()
        } else {
          this.junkbatchtrigger();
          this.getjunkvisitsdata()
        }
        this.isJunk = true;
        this.isInactive = false;
      } else if (this.junk4Param == '1') {
        if (this.leadtype == 'junkleads') {
          this.junkbatchtrigger();
          this.getjunkdata()
        } else {
          this.junkbatchtrigger();
          this.getjunkvisitsdata()
        }
        this.isJunk = true;
        this.isInactive = false;
      } else if (this.junkFinalParam == '1') {
        if (this.leadtype == 'junkleads') {
          this.junkbatchtrigger();
          this.getjunkdata()
        } else {
          this.junkbatchtrigger();
          this.getjunkvisitsdata()
        }
        this.isJunk = true;
        this.isInactive = false;
      }
    });
  }

  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  getInactiveJunkCounts() {
    //here we get the inactive counts
    var inactive = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'inactive',
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(inactive).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.inactiveCount = compleads.AssignedLeads[0].counts;
      } else {
        this.inactiveCount = 0;
      }
    })

    //here we get the junkleads count
    var junkleads = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkleads',
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkleads).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkCount = compleads.AssignedLeads[0].counts;
      } else {
        this.junkCount = 0;
      }
    })

    let stagestatus1
    if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
      stagestatus1 = '';
    } else {
      stagestatus1 = this.stagestatusval;
    }
    //here we get the junkvisits count
    var junkvisit = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisit).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsCount = compleads.AssignedLeads[0].counts;
      } else {
        this.junkvisitsCount = 0;
      }
    })
  }

  //here we get the inactive leads counts
  inactivebatch1trigger() {
    this.inactiveCount = 0;
    this.inactive1Count = 0
    this.inactive2Count = 0;
    this.inactive3Count = 0;
    this.inactive4Count = 0;
    this.inactiveFinalCount = 0;

    //here we get the inactive1 counts
    var inactive1 = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'inactive',
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      counter: '1'
    }
    this._mandateService.assignedLeadsCount(inactive1).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.inactive1Count = compleads.AssignedLeads[0].counts;
      } else {
        this.inactive1Count = 0;
      }
    })

    //here we get inactive2 count
    var inactive2 = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'inactive',
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      counter: '2'
    }
    this._mandateService.assignedLeadsCount(inactive2).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.inactive2Count = compleads.AssignedLeads[0].counts;
      } else {
        this.inactive2Count = 0;
      }
    });

    //here we get inactive3 count
    var inactive3 = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'inactive',
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      counter: '3'
    }
    this._mandateService.assignedLeadsCount(inactive3).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.inactive3Count = compleads.AssignedLeads[0].counts;
      } else {
        this.inactive3Count = 0;
      }
    });

    //here we get inactive4 count
    var inactive4 = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'inactive',
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      counter: '4'
    }
    this._mandateService.assignedLeadsCount(inactive4).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.inactive4Count = compleads.AssignedLeads[0].counts;
      } else {
        this.inactive4Count = 0;
      }
    });

    //here we get finalinactive count
    var finalinactive = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'inactive',
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      counter: 'final'
    }
    this._mandateService.assignedLeadsCount(finalinactive).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.inactiveFinalCount = compleads.AssignedLeads[0].counts;
      } else {
        this.inactiveFinalCount = 0;
      }
    });
  }

  //here we get inactive leads data.
  inactiveDataFetch() {
    this.filterLoader = true;
    MandateInactiveJunkComponent.count = 0;
    let inactiveCount;
    $(".other_section").removeClass("active");
    if (this.inactive1Param == '1') {
      $(".inactive1_section").addClass("active");
      inactiveCount = '1';
    } else if (this.inactive2Param == '1') {
      $(".inactive2_section").addClass("active");
      inactiveCount = '2';
    } else if (this.inactive3Param == '1') {
      $(".inactive3_section").addClass("active");
      inactiveCount = '3';
    } else if (this.inactive4Param == '1') {
      $(".inactive4_section").addClass("active");
      inactiveCount = '4';
    } else if (this.inactiveFinalParam == '1') {
      $(".inactivefinal_section").addClass("active");
      inactiveCount = 'final';
    }

    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'inactive',
      stage: '',
      stagestatus: this.stagestatusval,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      counter: inactiveCount
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  //here we get the inactive leads counts
  junkbatchtrigger() {
    this.junkCount = 0;
    this.junk1Count = 0;
    this.junk2Count = 0;
    this.junk3Count = 0;
    this.junk4Count = 0;
    this.junkFinalCount = 0;

    let junkstatus;
    if (this.leadtype == 'junkleads') {
      junkstatus = 'junkleads';
    } else if (this.leadtype == 'junkvisits') {
      junkstatus = 'junkvisits';
    }

    //here we get the junk1 counts
    var junk1 = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: junkstatus,
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      counter: '1'
    }
    this._mandateService.assignedLeadsCount(junk1).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junk1Count = compleads.AssignedLeads[0].counts;
      } else {
        this.junk1Count = 0;
      }
    })

    //here we get junk2 count
    var junk2 = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: junkstatus,
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      counter: '2'
    }
    this._mandateService.assignedLeadsCount(junk2).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junk2Count = compleads.AssignedLeads[0].counts;
      } else {
        this.junk2Count = 0;
      }
    });

    //here we get junk3 count
    var junk3 = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: junkstatus,
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      counter: '3'
    }
    this._mandateService.assignedLeadsCount(junk3).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junk3Count = compleads.AssignedLeads[0].counts;
      } else {
        this.junk3Count = 0;
      }
    });

    //here we get junk4 count
    var junk4 = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: junkstatus,
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      counter: '4'
    }
    this._mandateService.assignedLeadsCount(junk4).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junk4Count = compleads.AssignedLeads[0].counts;
      } else {
        this.junk4Count = 0;
      }
    });

    //here we get finaljunk count
    var finaljunk = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: junkstatus,
      stage: '',
      stagestatus: this.stagestatusval,
      propid: this.propertyid,
      executid: this.rmid,
      loginuser: this.userid,
      source: this.source,
      counter: 'final'
    }
    this._mandateService.assignedLeadsCount(finaljunk).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkFinalCount = compleads.AssignedLeads[0].counts;
      } else {
        this.junkFinalCount = 0;
      }
    });
  }

  //here we get inactive leads data.
  getjunkdata() {
    this.filterLoader = true;
    MandateInactiveJunkComponent.count = 0;
    let junkleadsCount;
    $(".other_section").removeClass("active");
    if (this.junk1Param == '1') {
      $(".junk1_section").addClass("active");
      junkleadsCount = '1';
    } else if (this.junk2Param == '1') {
      $(".junk2_section").addClass("active");
      junkleadsCount = '2';
    } else if (this.junk3Param == '1') {
      $(".junk3_section").addClass("active");
      junkleadsCount = '3';
    } else if (this.junk4Param == '1') {
      $(".junk4_section").addClass("active");
      junkleadsCount = '4';
    } else if (this.junkFinalParam == '1') {
      $(".junkfinal_section").addClass("active");
      junkleadsCount = 'final';
    }

    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkleads',
      stage: '',
      stagestatus: this.stagestatusval,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      counter: junkleadsCount
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
  }

  getjunkvisitsdata() {
    this.filterLoader = true;
    MandateInactiveJunkComponent.count = 0;
    let junkvisitsCounts;
    $(".other_section").removeClass("active");
    if (this.junk1Param == '1') {
      $(".junk1_section").addClass("active");
      junkvisitsCounts = '1';
    } else if (this.junk2Param == '1') {
      $(".junk2_section").addClass("active");
      junkvisitsCounts = '2';
    } else if (this.junk3Param == '1') {
      $(".junk3_section").addClass("active");
      junkvisitsCounts = '3';
    } else if (this.junk4Param == '1') {
      $(".junk4_section").addClass("active");
      junkvisitsCounts = '4';
    } else if (this.junkFinalParam == '1') {
      $(".junkfinal_section").addClass("active");
      junkvisitsCounts = 'final';
    }
    let stagestatus1
    if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
      stagestatus1 = '';
    } else {
      stagestatus1 = this.stagestatusval;
    }
    var param = {
      limit: 0,
      limitrows: 30,
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: '',
      stagestatus: stagestatus1,
      executid: this.rmid,
      propid: this.propertyid,
      loginuser: this.userid,
      source: this.source,
      counter: junkvisitsCounts
    }
    this._mandateService.assignedLeads(param).subscribe(compleads => {
      this.filterLoader = false;
      this.callerleads = compleads['AssignedLeads'];
    });
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

  //get list of executives for  filter purpose
  getExecutivesForFilter() {
    if (this.role_type != 1) {
      this._mandateService.fetchmandateexecutuvesforreassign(this.propertyid, '', '','','').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    } else {
      this._mandateService.fetchmandateexecutuvesforreassign(this.mandateProperty_ID, 2, '','',this.userid).subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateExecutivesFilter = executives['mandateexecutives'];
          this.copyMandateExecutives = executives['mandateexecutives'];
        }
      });
    }
  }

  getsourcelist() {
    this._sharedService.sourcelist().subscribe(sources => {
      this.sourceList = sources;
      this.copyofsources = sources;
    })
  }

  loadMoreassignedleads() {
    let limit;
    if (this.roleid == 1 || this.roleid == '2') {
      limit = MandateInactiveJunkComponent.count += 30;
    }

    // let limitR;
    // if (this.roleid == 1 || this.roleid == '2') {
    //   limitR = 100
    // }

    if (this.inactive1Param == 1) {
      var inactive1paramdata = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: '',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        counter: '1'
      }
      if (this.callerleads.length < this.inactive1Count) {
        this._mandateService.assignedLeads(inactive1paramdata).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.inactive2Param == 1) {
      var inactive1paramdata = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: '',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        counter: '2'
      }
      if (this.callerleads.length < this.inactive2Count) {
        this._mandateService.assignedLeads(inactive1paramdata).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.inactive3Param == 1) {
      var inacive3paramdata = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: '',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        counter: '3'
      }
      if (this.callerleads.length < this.inactive3Count) {
        this._mandateService.assignedLeads(inacive3paramdata).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.inactive4Param == 1) {
      var inactive4paramdata = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: '',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        counter: '4'
      }
      if (this.callerleads.length < this.inactive4Count) {
        this._mandateService.assignedLeads(inactive4paramdata).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.inactiveFinalParam == 1) {
      var finalinactiveparamdata = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: '',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        counter: 'final'
      }
      if (this.callerleads.length < this.inactiveFinalParam) {
        this._mandateService.assignedLeads(finalinactiveparamdata).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    }

    let junkstatus;
    if (this.leadtype == 'junkleads') {
      junkstatus = 'junkleads';
    } else if (this.leadtype == 'junkvisits') {
      junkstatus = 'junkvisits';
    }
    if (this.junk1Param == 1) {
      var junk1paramdata = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: junkstatus,
        stage: '',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        counter: '1'
      }
      if (this.callerleads.length < this.junk1Count) {
        this._mandateService.assignedLeads(junk1paramdata).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.junk2Param == 1) {
      var junk2paramdata = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: junkstatus,
        stage: '',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        counter: '2'
      }
      if (this.callerleads.length < this.junk2Count) {
        this._mandateService.assignedLeads(junk2paramdata).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.junk3Param == 1) {
      var junk3paramdata = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: junkstatus,
        stage: '',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        counter: '3'
      }
      if (this.callerleads.length < this.junk3Count) {
        this._mandateService.assignedLeads(junk3paramdata).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.junk4Param == 1) {
      var junk4paramdata = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: junkstatus,
        stage: '',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        counter: '4'
      }
      if (this.callerleads.length < this.junk4Count) {
        this._mandateService.assignedLeads(junk4paramdata).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    } else if (this.junkFinalParam == 1) {
      var finaljunkparamdata = {
        limit: limit,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: junkstatus,
        stage: '',
        executid: this.rmid,
        loginuser: this.userid,
        propid: this.propertyid,
        stagestatus: this.stagestatusval,
        source: this.source,
        counter: 'final'
      }
      if (this.callerleads.length < this.junkFinalCount) {
        this._mandateService.assignedLeads(finaljunkparamdata).subscribe(compleads => {
          this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
          this.filterLoader = false;
        });
      }
    }
  }

  statuschange(vals) {
    MandateInactiveJunkComponent.count = 0;
    this.filterLoader = true;
    this.stagefilterview = true;
    this.stagestatusval = "";
    this.stagestatusvaltext = "";
    this.stagevalue = vals.target.value;

    if (this.stagevalue == "USV") {
      this.stagestatus = true;
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

  //stage status based filter
  stagestatuschange(vals) {
    this.filterLoader = true;
    this.stagestatusval = vals.target.value;
    this.router.navigate([], {
      queryParams: {
        stagestatus: vals.target.value,
      },
      queryParamsHandling: 'merge',
    });
    if (this.stagestatusval == '1') {
      this.stagestatusvaltext = "Fixed";
    } else if (this.stagestatusval == '2') {
      this.stagestatusvaltext = "Refixed";
    } else if (this.stagestatusval == '3') {
      this.stagestatusvaltext = "Done";
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
    MandateInactiveJunkComponent.count = 0;
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
    MandateInactiveJunkComponent.count = 0;
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
    MandateInactiveJunkComponent.count = 0;
    $("#option-1").prop("checked", false);
    $("#option-2").prop("checked", false);
    $("#option-3").prop("checked", false);
    $("#option-4").prop("checked", false);
    $("#option-5").prop("checked", false);
    $("#option-6").prop("checked", false);
    this.stagestatusfilterview = false;
    this.stagestatusval = "";
    this.router.navigate([], {
      queryParams: {
        stagestatus: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  sourceClose() {
    $('#source_dropdown').dropdown('clear');
    $("input[name='sourceFilter']").prop("checked", false);
    this.sourceFilter = false;
    MandateInactiveJunkComponent.count = 0;
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
    this._mandateService.setControllerName('');
    this.datefilterview = false;
    this.propertyfilterview = false;
    this.executivefilterview = false;
    this.stagestatus = false;
    this.stagestatusfilterview = false;
    this.sourceFilter = false;
    this.fromdate = '';
    this.todate = '';
    this.propertyname = '';
    this.propertyid = "";
    this.stagevalue = "";
    this.stagestatusval = "";
    this.stagestatusvaltext = '';
    this.execname = null;
    this.execid = null;
    this.rmid = null;
    this.source = '';
    this.dateclose();
    this.executiveclose();
    this.propertyclose();
    this.stageclose();
    this.sourceClose();
    this.router.navigate([], {
      queryParams: {
        type: this.leadtype,
        from: '',
        to: '',
        stage: '',
        stagestatus: "",
        property: '',
        propname: '',
        execid: null,
        execname: null,
        source: null,
      },
      queryParamsHandling: 'merge',
    });
    $("input[name='propFilter']").prop("checked", false);
    $("input[name='executiveFilter']").prop("checked", false);
    $("input[name='sourceFilter']").prop("checked", false);
  }

  //property selection  filter
  onCheckboxChange(property) {
    MandateInactiveJunkComponent.count = 0;
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
         if(this.roleid == 1 || this.roleid == 2 || this.role_type == 1){
        this.getExecutivesForFilter();
      }
      $("input[name='executiveFilter']").prop("checked", false);
      this.router.navigate([], {
        queryParams: {
          property: this.propertyid,
          propname: this.propertyname,
          execid: '',
          execname: ''
          // team: "",
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
    MandateInactiveJunkComponent.count = 0;
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

  onCheckboxChangesource() {
    MandateInactiveJunkComponent.count = 0;
    var checkid = $("input[name='sourceFilter']:checked").map(function () {
      return this.value;
    }).get().join(',');

    let filteredsourceIds;
    filteredsourceIds = checkid.split(',');

    let filteredsourceName;
    filteredsourceName = this.copyofsources.filter((da) => filteredsourceIds.some((sourc) => {
      return sourc == da.id
    }));
    filteredsourceName = filteredsourceName.map((name) => name.source);

    if (filteredsourceName != '' || filteredsourceName != undefined) {
      this.sourceFilter = true;
      this.source = checkid;
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

  //reassign section code 
  //on clicking on reassign button reassign section will be shown
  onclickReAssign() {
    if (this.inactive1Param == 1) {
      this.reassignleadsCount = this.inactive1Count
    } else if (this.inactive2Param) {
      this.reassignleadsCount = this.inactive2Count
    } else if (this.inactive3Param) {
      this.reassignleadsCount = this.inactive3Count
    } else if (this.inactive4Param) {
      this.reassignleadsCount = this.inactive4Count
    } else if (this.inactiveFinalParam) {
      this.reassignleadsCount = this.inactiveFinalCount
    } else {
      if (this.leadtype == 'junkleads') {
        if (this.junk1Param) {
          this.reassignleadsCount = this.junk1Count;
        } else if (this.junk2Param) {
          this.reassignleadsCount = this.junk2Count;
        } else if (this.junk3Param) {
          this.reassignleadsCount = this.junk3Count;
        } else if (this.junk4Param) {
          this.reassignleadsCount = this.junk4Count;
        } else if (this.junkFinalParam) {
          this.reassignleadsCount = this.junkFinalCount;
        }
      } else if (this.leadtype == 'junkvisits') {
        if (this.junk1Param) {
          this.reassignleadsCount = this.junk1Count;
        } else if (this.junk2Param) {
          this.reassignleadsCount = this.junk2Count;
        } else if (this.junk3Param) {
          this.reassignleadsCount = this.junk3Count;
        } else if (this.junk4Param) {
          this.reassignleadsCount = this.junk4Count;
        } else if (this.junkFinalParam) {
          this.reassignleadsCount = this.junkFinalCount;
        }
      }
    }

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
      this._mandateService.fetchmandateexecutuves(16793, '', this.roleTeam,'').subscribe(executives => {
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

    this.selectedLeadExecutiveIds = selectedLeadExecutiveIds.join(',')

    if (this.selectedEXECUTIVES && this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
      $('#customSwitch5').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch5').prop('checked', false);
      this.randomCheckVal = '';
    }
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
  //     this._mandateService.fetchmandateexecutuves(16793, '',this.roleTeam).subscribe(executives => {
  //       if (executives['status'] == 'True') {
  //         this.reassignListExecutives = executives['mandateexecutives'];
  //         console.log(this.reassignListExecutives)
  //         // this.reassignListExecutives = this.reassignListExecutives.filter((da) => !(this.rmid.includes(da.id)));
  //       }
  //     });
  //   } else if(type == 'retail') {
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
      if(this.selectedTeamType == 'mandate'){
        this._mandateService.fetchmandateexecutuves(this.selectedMandateProp, this.selectedReassignTeamType,this.roleTeam,'').subscribe(executives => {
          if (executives['status'] == 'True') {
            setTimeout(() => {
              this.reassignListExecutives = executives['mandateexecutives'];
            }, 0)
            // this.reassignListExecutives = this.reassignListExecutives.filter((da) => !(this.selectedExecIds.includes(da.id)));
          } else {
            this.reassignListExecutives = [];
          }
        });
      }
    this.selectedEXECUTIVEIDS = [];
    this.selectedEXECUTIVES = [];
    // this.choosedReAssignLeads = this.choosedReAssignLeads.filter((lead)=> lead.property_id == this.selectedMandateProp );
  }

  //heree we get the selected assign executive team type
  reassignExecTeam(event) {
    this.roleTeam = event.target.value;
    this._mandateService.fetchmandateexecutuves(this.selectedMandateProp, this.selectedReassignTeamType, this.roleTeam,'').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.reassignListExecutives = executives['mandateexecutives'];
      }
    });
    // console.log(event.target.value)
    // if (event.target.value == '50010' || event.target.value == '50004') {
    //   const teamid = event.target.value;
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
    // if (this.selectedTeamType == 'mandate') {
      this.selectedEXECUTIVEIDS = this.selectedEXECUTIVES.map((exec) => exec.id);
      if (this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
        $('#customSwitch5').prop('checked', true);
        this.randomCheckVal = 1;
      } else {
        $('#customSwitch5').prop('checked', false);
        this.randomCheckVal = '';
      }
    // } else if (this.selectedTeamType == 'retail') {
    //   this.selectedEXECUTIVEIDS = this.selectedEXECUTIVES.map((exec) => exec.ExecId);
    //   if (this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
    //     $('#customSwitch5').prop('checked', true);
    //     this.randomCheckVal = 1;
    //   } else {
    //     $('#customSwitch5').prop('checked', false);
    //     this.randomCheckVal = '';
    //   }
    // }
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
      // this.filterLoader = true;
    }

    if (this.selectedTeamType == 'mandate' && this.selectedMandateProp == '') {
      this.filterLoader = false;
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
      // this.filterLoader = true;
    }


    if (this.selectedEXECUTIVES == undefined || this.selectedEXECUTIVES.length == 0) {
      this.filterLoader = false;
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
      // this.filterLoader = true;
    }

    let stageVal;
    if (this.leadtype == 'inactive') {
      stageVal = 1;
    } else if (this.leadtype == 'junkleads') {
      stageVal = 2;
    } else if (this.leadtype == 'junkvisits') {
      stageVal = 3;
    }
    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let comma_separated_data = this.selectedEXECUTIVEIDS.join(',');
    let param = {
      assignedleads: this.selectedAssignedleads,
      customersupport: comma_separated_data,
      propId: this.selectedMandateProp,
      randomval: this.randomCheckVal,
      loginid: this.userid,
      stage: stageVal,
      executiveIds: this.selectedLeadExecutiveIds
    }

    // if (this.selectedTeamType == 'mandate') {
      if (this.filteredproject && this.filteredproject.crm == '2') {
        this._mandateService.ranavinactiveJunkLeadreassign(param).subscribe((success) => {
          this.filterLoader = false;
          this.status = success.status;
          if (this.status == "True") {
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
            this.reassignfromdate = '';
            this.reassigntodate = '';
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
        this._mandateService.inactiveJunkLeadreassign(param).subscribe((success) => {
          this.filterLoader = false;
          this.status = success.status;
          if (this.status == "True") {
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
            this.reassignfromdate = '';
            this.reassigntodate = '';
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
      }
    // } else if (this.selectedTeamType == 'retail') {
    //   this._retailservice.inactiveJunkLeadreassign(param).subscribe((success) => {
    //     this.filterLoader = false;
    //     this.status = success.status;
    //     if (this.status == "True") {
    //       $('#closereassignmodal').click();
    //       swal({
    //         title: 'Assigned Successfully',
    //         type: 'success',
    //         confirmButtonText: 'Show Details'
    //       }).then(() => {
    //         this.reassignedResponseInfo = success['assignedleads'];
    //         $('#reassign_leads_detail').click();
    //       })
    //       $('#statuslist_dropdown').dropdown('clear');
    //       $('#followup_dropdown').dropdown('clear');
    //       $('#exec_designation').dropdown('clear');
    //       $('#exec_dropdown').dropdown('clear');
    //       $('#leadcount_dropdown').dropdown('clear');
    //       $('#team_dropdown').dropdown('clear');
    //       $('#property_dropdown').dropdown('clear');
    //       $('#mandate_dropdown').dropdown('clear');
    //       $('#retail_dropdown').dropdown('clear');
    //       $('#mandateExec_dropdown').dropdown('clear');
    //       $('#retailExec_dropdown').dropdown('clear');
    //       this.selectedMandateProp = '';
    //       this.randomCheckVal = '';
    //       this.selectedEXEC = [];
    //       this.selectedEXECUTIVEIDS = [];
    //       this.selectedEXECUTIVES = [];
    //       this.selectedExecIds = [];
    //       this.maxSelectedLabels = Infinity;
    //       this.reassignfromdate = '';
    //       this.reassigntodate = '';
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

  closeModal() {
    let currentUrl = this.router.url;
    let pathWithoutQueryParams = currentUrl.split('?')[0];
    let currentQueryparams = this.route.snapshot.queryParams;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
    });
  }

  //tab clicks for the plan types.
  onTabPlan(type) {
    if (type == 'junkleads') {
      $(".traffic_section").removeClass("active");
      $(".junkleads_section").addClass("active");

      this.router.navigate(['/mandate-inactive-junk'], {
        queryParams: {
          type: 'junkleads',
          junk1: '1',
          from: this.fromdate,
          to: this.todate,
          htype: 'mandate'
        }
      })
    } else if (type == 'junkvisits') {
      $(".traffic_section").removeClass("active");
      $(".junkvisits_section").addClass("active");
      this.fromdate = '';
      this.todate = '';
      this.router.navigate(['/mandate-inactive-junk'], {
        queryParams: {
          type: 'junkvisits',
          junk1: '1',
          from: this.fromdate,
          to: this.todate,
          htype: 'mandate'
        }
      })
    } else if (type == 'inactive') {
      $(".traffic_section").removeClass("active");
      $(".inactive_section").addClass("active");
      this.fromdate = '';
      this.todate = '';
      this.router.navigate(['/mandate-inactive-junk'], {
        queryParams: {
          type: 'inactive',
          inactive1: '1',
          from: this.fromdate,
          to: this.todate,
          htype: 'mandate'
        },
      })
    }
  }

  getReassignLeadsData(limitR) {
    this.filterLoader = true;
    let param;
    if (this.leadtype == 'inactive') {
      let inactiveCount;
      if (this.inactive1Param == '1') {
        inactiveCount = '1';
      } else if (this.inactive2Param == '1') {
        inactiveCount = '2';
      } else if (this.inactive3Param == '1') {
        inactiveCount = '3';
      } else if (this.inactive4Param == '1') {
        inactiveCount = '4';
      } else if (this.inactiveFinalParam == '1') {
        inactiveCount = 'final';
      }

      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'inactive',
        stage: '',
        stagestatus: this.stagestatusval,
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        counter: inactiveCount
      }
    } else if (this.leadtype == 'junkleads') {
      let junkleadsCount;
      if (this.junk1Param == '1') {
        junkleadsCount = '1';
      } else if (this.junk2Param == '1') {
        junkleadsCount = '2';
      } else if (this.junk3Param == '1') {
        junkleadsCount = '3';
      } else if (this.junk4Param == '1') {
        junkleadsCount = '4';
      } else if (this.junkFinalParam == '1') {
        junkleadsCount = 'final';
      }

      param = {
        limit: 0,
        limitrows: limitR,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkleads',
        stage: '',
        stagestatus: this.stagestatusval,
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        counter: junkleadsCount
      }
    } else if (this.leadtype == 'junkvisits') {
      let junkvisitsCounts;
      if (this.junk1Param == '1') {
        junkvisitsCounts = '1';
      } else if (this.junk2Param == '1') {
        junkvisitsCounts = '2';
      } else if (this.junk3Param == '1') {
        junkvisitsCounts = '3';
      } else if (this.junk4Param == '1') {
        junkvisitsCounts = '4';
      } else if (this.junkFinalParam == '1') {
        junkvisitsCounts = 'final';
      }
      let stagestatus1
      if (this.stagevalue == '' || this.stagevalue == undefined || this.stagevalue == 'Fresh') {
        stagestatus1 = '';
      } else {
        stagestatus1 = this.stagestatusval;
      }
      param = {
        limit: 0,
        limitrows: 30,
        datefrom: this.fromdate,
        dateto: this.todate,
        statuss: 'junkvisits',
        stage: '',
        stagestatus: stagestatus1,
        executid: this.rmid,
        propid: this.propertyid,
        loginuser: this.userid,
        source: this.source,
        counter: junkvisitsCounts
      }
    }

    this._mandateService.assignedLeads(param).subscribe(compleads => {
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

  detailsPageRedirection() {
    localStorage.setItem('backLocation', 'inactive-junk');
  }

  //   filterhere() {
  //       this.datefilterview = false;
  //       this.fromdate = $('#fromdate').val();
  //       this.todate = $('#todate').val();
  //       if ((this.fromdate == "" || this.fromdate == undefined) || (this.todate == "" || this.todate == undefined)) {
  //         this.router.navigate([], {
  //           queryParams: {
  //             from: "",
  //             to: ""
  //           },
  //           queryParamsHandling: 'merge',
  //         });
  //       }
  //       else {
  //         this.router.navigate([], {
  //           queryParams: {
  //             from: this.fromdate,
  //             to: this.todate
  //           },
  //           queryParamsHandling: 'merge',
  //         });
  //         this.datefilterview = true;
  //       }
  //     $('.modalclick').removeClass('modal-backdrop');
  //     $('.modalclick').removeClass('fade');
  //     $('.modalclick').removeClass('show');
  //     document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
  //   }  //   filterhere() {
  //       this.datefilterview = false;
  //       this.fromdate = $('#fromdate').val();
  //       this.todate = $('#todate').val();
  //       if ((this.fromdate == "" || this.fromdate == undefined) || (this.todate == "" || this.todate == undefined)) {
  //         this.router.navigate([], {
  //           queryParams: {
  //             from: "",
  //             to: ""
  //           },
  //           queryParamsHandling: 'merge',
  //         });
  //       }
  //       else {
  //         this.router.navigate([], {
  //           queryParams: {
  //             from: this.fromdate,
  //             to: this.todate
  //           },
  //           queryParamsHandling: 'merge',
  //         });
  //         this.datefilterview = true;
  //       }
  //     $('.modalclick').removeClass('modal-backdrop');
  //     $('.modalclick').removeClass('fade');
  //     $('.modalclick').removeClass('show');
  //     document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
  //   }
  // //on click on cancel we will get the assigned leads section 
  // backToDetails() {
  //   $('#statuslist_dropdown').dropdown('clear');
  //   $('#followup_dropdown').dropdown('clear');
  //   $('#exec_designation').dropdown('clear');
  //   $('#exec_dropdown').dropdown('clear');
  //   $('#leadcount_dropdown').dropdown('clear');
  //   $('#team_dropdown').dropdown('clear');
  //   $('#property_dropdown').dropdown('clear');
  //   $('#mandate_dropdown').dropdown('clear');
  //   $('#retail_dropdown').dropdown('clear');
  //   $('#mandateExec_dropdown').dropdown('clear');
  //   $('#retailExec_dropdown').dropdown('clear');
  //   this.selectedMandateProp = '';
  //   this.randomCheckVal = '';
  //   this.selectedEXEC = [];
  //   this.selectedEXECUTIVEIDS = [];
  //   this.selectedEXECUTIVES = [];
  //   this.selectedExecIds = [];
  //   this.maxSelectedLabels = Infinity;
  //   this.reassignfromdate = '';
  //   this.reassigntodate = '';
  //   this.dateRange = [];

  //   if (this.inactive1Param == '1') {
  //     this.inactivebatch1trigger();
  //     this.inactiveDataFetch();
  //   } else if (this.inactive2Param == '1') {
  //     this.inactivebatch1trigger();
  //     this.inactiveDataFetch();
  //   } else if (this.inactive3Param == '1') {
  //     this.inactivebatch1trigger();
  //     this.inactiveDataFetch();
  //   } else if (this.inactive4Param == '1') {
  //     this.inactivebatch1trigger();
  //     this.inactiveDataFetch();
  //   } else if (this.inactiveFinalParam == '1') {
  //     this.inactivebatch1trigger();
  //     this.inactiveDataFetch();
  //   }

  //   if (this.junk1Param == '1') {
  //     this.junkbatchtrigger();
  //     this.getjunkdata();
  //   } else if (this.junk2Param == '1') {
  //     this.junkbatchtrigger();
  //     this.getjunkdata();
  //   } else if (this.junk3Param == '1') {
  //     this.junkbatchtrigger();
  //     this.getjunkdata();
  //   } else if (this.junk4Param == '1') {
  //     this.junkbatchtrigger();
  //     this.getjunkdata();
  //   } else if (this.junkFinalParam == '1') {
  //     this.junkbatchtrigger();
  //     this.getjunkdata();
  //   }
  // }

  //here we check whether any leads are selected or no ,if not selected showing all the leads.
  // checkSelectedLeads() {
  //   if (this.maxSelectedLabels == Infinity) {
  //     let selectedLeadsId = this.choosedReAssignLeads.map((da) => da.LeadID);
  //     this.selectedAssignedleads = selectedLeadsId.join(',');
  //   }
  // }

  //to select the status
  // statusSelect(event) {
  //   this.selectedStatus = event.target.value;
  //   let selectedstatus = event.target.value;

  //   if (selectedstatus == 'untouched') {
  //     this.getReassignLeads(selectedstatus)
  //   } else if (selectedstatus == 'inactive') {
  //     this.getReassignLeads(selectedstatus)
  //   } else if (selectedstatus == 'followups') {
  //     this.getReassignLeads(selectedstatus);
  //     this.getFollowupsStatus();
  //     this.selectedSubStatus = '';
  //   } else if (selectedstatus == 'USV') {
  //     this.getReassignLeads(selectedstatus)
  //   } else if (selectedstatus == 'RSV') {
  //     this.getReassignLeads(selectedstatus)
  //   } else if (selectedstatus == 'FN') {
  //     this.getReassignLeads(selectedstatus)
  //   }

  //   if (this.selectedStatus == undefined || this.selectedStatus.length == 0) {
  //     this.getReassignLeads('assignedleads')
  //   }
  // }

  //here we get the list of followups list
  // getFollowupsStatus() {
  //   this._mandateService.getfollowupsections().subscribe(followupsection => {
  //     this.followupsections = followupsection;
  //   });
  // }

  //here we get the list of followups sub list
  // subStatusSelection(event) {
  //   this.selectedSubStatus = event.target.value;
  //   this.getReassignLeads(this.selectedStatus);
  // }
  //to get teh list of executives based on team id
  // getreassignexecutives(event) {
  //   $('#exec_dropdown').dropdown('clear');
  //   const teamid = event.target.options[event.target.options.selectedIndex].value;
  //   const activestatus = '1';
  //   this.selectedReassignTeam = teamid;
  //   this._mandateService.fetchmandateexecutuvesforreassign('', teamid, activestatus).subscribe(executives => {
  //     if (executives['status'] == 'True') {
  //       this.mandateExecutives = executives['mandateexecutives'];
  //       // this.mandateExecutives = this.mandateExecutives.filter((exec) => exec.visits_reg_status == '1')
  //       // this.copyMandateExecutives = executives['mandateexecutives'];
  //     } else {
  //     }
  //   });
  //   this.getReassignLeads(this.selectedStatus);
  // }

  //to filter the active execiyives.
  // checkActive(event) {
  //   const isChecked = (event.target as HTMLInputElement).checked;
  //   if (isChecked == true) {
  //     const activestatus = '1';
  //     this._mandateService.fetchmandateexecutuvesforreassign('', this.selectedReassignTeam, activestatus).subscribe(executives => {
  //       if (executives['status'] == 'True') {
  //         this.mandateExecutives = executives['mandateexecutives'];
  //       }
  //     });
  //   } else {
  //     const activestatus = '2';
  //     this._mandateService.fetchmandateexecutuvesforreassign('', this.selectedReassignTeam, activestatus).subscribe(executives => {
  //       if (executives['status'] == 'True') {
  //         this.mandateExecutives = executives['mandateexecutives'];
  //       }
  //     });
  //   }
  // }

  //to get the list of selected executives
  // executiveSelect(event) {
  //   this.selectedExecIds = this.selectedEXEC.map((exec) => exec.id);
  //   this.getReassignLeads(this.selectedStatus);
  // }
  //here we get the reassign leads data to display in the table
  // getReassignLeads(selectedStatus) {
  //   let comma_separated_data
  //   if (this.selectedExecIds) {
  //     comma_separated_data = this.selectedExecIds.join(',');
  //   }
  //   InactiveJunkComponent.reassigncount = 0;
  //   this.filterLoader = true;
  //   var param = {
  //     fromdate: this.reassignfromdate,
  //     todate: this.reassigntodate,
  //     limit: 0,
  //     limitrows: 30,
  //     statuss: 'selectedStatus',
  //     followup: this.selectedSubStatus,
  //     propid: this.selectedMandateProp,
  //     executid: comma_separated_data,
  //     loginuser: this.userid,
  //     team: this.selectedReassignTeam,
  //   }
  //   this._mandateService.getreassignLeads(param).subscribe(compleads => {
  //     this.filterLoader = false;
  //     this.reassignleadsCount = compleads.Leadscount;
  //     this.checkSelectedLeads();
  //   });
  // }

}
