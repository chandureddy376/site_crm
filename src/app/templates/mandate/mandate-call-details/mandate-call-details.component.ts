import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth-service';
import { UniquePipe } from '../../../pipe-filter';
import { Enquiry, Follow, Face, Usv, Finalnego, closure, leadforward } from '../../customers/customer';
import { mandateservice } from '../../../mandate.service';
import { retailservice } from '../../../retail.service';
import { sharedservice } from '../../../shared.service';
import { Subject, Subscription } from 'rxjs';
import { MandateClassService } from '../../../mandate-class.service';
import { EchoService } from '../../../echo.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { debounceTime } from 'rxjs/operators';

declare var $: any;
declare var swal: any;
declare var Swal: any;

@Component({
  selector: 'app-mandate-call-details',
  templateUrl: './mandate-call-details.component.html',
  styleUrls: ['./mandate-call-details.component.css']
})
export class MandateCallDetailsComponent implements OnInit {

  callDurationStr: string = '00h:00m:00s';
  private timerSub: Subscription;
  private callStartTime: number = null;
  @Input() calledLead: any;
  @Input() assignedRm: any;
  @ViewChild('cancel') cancel: ElementRef;
  @ViewChild('myModalClose') modalClose;
  followup = true;
  USV = true;
  SV = true;
  RSV = true;
  Negotiation = true;
  leadclose = true;
  junkmove = true;
  filterLoader: boolean = false;
  selectedItem: any;
  showHide: boolean;
  commentshow: boolean;
  modelaadd = new Follow();
  facemodel = new Face();
  addusvmodel = new Usv();
  svmodel = new Usv();
  negmodel = new Finalnego();
  addclose = new closure();
  addpay = new closure();
  usvmodelone: any;
  resposeData: any;
  countries: any[];
  sections: any;
  projects: any;
  activeinputs: any;
  locality: any;
  newpropertybox = false;
  adminview: boolean;
  execview: boolean;
  followupform = false;
  junkform = false;
  commonformbtn = false;
  followupformbtn = false;
  junkformbtn = false;
  followform = false;
  f2fform = false;
  usvform = false;
  svform = false;
  rsvform = false;
  finalnegoform = false;
  leadclosedform = false;

  // ONLY-CUSTOMER-ViEW-FROM-DB-based-ON-ID
  show_cnt = new Enquiry();
  executlist: any;
  sources: any;
  followmodels: any;
  facemodels: any;
  usvmodels: any;
  svmodels: any;
  rsvmodels: any;
  finalmodels: any;
  closedmodels: any;
  typelist: any;
  propetytimeline: any;
  propertiespurpose: any;
  properties: any;
  propertysize: any;
  usvdates: any;
  current: number = 0;
  leadstatus: any;
  activestagestatus: any;
  datavisitwithothersid: any;
  datavisitwithothersname: any;
  suggestedproperties: any;
  suggestedpropertiesname: any;
  autoremarks: any;
  getPriority: any = 1;
  isSuggestedPropBoolean: boolean = false;
  selectedPlanType: string = '';
  private isCountdownInitialized: boolean;
  editplan: boolean = false;
  selectedpropertylists: any;
  selectedlists: any;
  selectedproperty_commaseperated: any;
  visitPlanDone: boolean = false;
  visitpanelselection: any;
  visitPlanNextDate: any;
  visitPlanNextTime: any;
  retailExecutiveTeam: any;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  feedbackId: any;
  clickedRMID: any;
  search_name: string = '';
  clients: any
  selectedLead: any;
  isSelectedLead: boolean = false;
  selectedRelation: any;
  isMandateLead: boolean = false;
  fixedPropertiesList: any;
  primaryLeads: any[] = [];
  selectedPrimaryLead: any;
  isAccompanyBy: boolean = false;
  isEditLead: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _mandateService: mandateservice,
    private _retailservice: retailservice,
    private _sharedservice: sharedservice,
    public authService: AuthService,
    private _unique: UniquePipe,
    private _location: Location,
    private cdRef: ChangeDetectorRef,
    private _mandateClassService: MandateClassService,
    private echoService: EchoService,
  ) {
    // this.route.params.subscribe(params => {
    // this.id = params['id'];
    // this.feedbackId = params['feedback'];
    // this.leadAssignedExecid = params['execid'];
    // this.clickedRMID = params['execid'].split('?')[0];
    // });


    this.retailExecutiveTeam = [
      { team: 'Relationship Executives', value: '50002' },
      { team: 'Customersupport Executives', value: '50014' }
    ]

    this.showHide = true;
    this.commentshow = false;
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 1000)
    this.activeinputs = false;
  }

  checkbox: boolean;
  payment_name: any;
  roleid: any;
  userid: any;
  username: any;
  selectedlocality: any;
  usvs = [];
  rsvs = [];
  rsvmodel: any = {};
  closedmodel: any = {};
  executeid: any;
  assignedrm: any;
  assignedcs: any;
  usvstagedetection: any;
  usvstagestatusdetection: any;
  show_cnt_subarray: any;
  closestObject: any[] = [];
  leadPossession: any;
  leadPropertyType: any;
  leadMoveJunkExec: boolean = true;
  selectedSuggestedProp: any = null;
  activeTabIndex = 0;
  selectedExecId: any;
  leadsDetailsInfo: any;
  adminBookingEdit: boolean = false;
  builderName: any;
  modela = new Enquiry();
  editmodela = new Enquiry();
  followmodel: any = {};
  id: any;
  localityid: any;
  currentstage: any;
  currentstagestatus: any;
  showRejectionForm: boolean = false;
  closepropertyname: any;
  requestedunits: any;
  closurefiles: any[] = [];
  uploads: string[] = [];
  enablebuttonReject: boolean = false;
  enablebuttonApprove: boolean = true;
  status: any;
  leadtrack: any;
  leadforwards = new leadforward();
  executives: any;
  csleadassign = false;
  rmleadassign = false;
  assignteam: any;
  mandateproperties: any;
  selectedMandateTeam: any;
  mandateExecutives: any;
  retailExecutives: any;
  selectedExecIds: any;
  selectedEXEC: any[] = [];
  selectedMandatePropId: any;
  role_type: any;
  leadAssignedExecid: any;
  selectedTeam: any;

  mails: any;
  buildernamereg: any;
  propertyid: any;
  clientregistereddata: any;
  regname: any;
  regnumber: any;
  regmail: any;
  regrmname: any;
  regrmmail: any;
  property: any;
  toselect: any;
  ccselect: any;
  registrationremarks: any;
  selectedCCMail: any;
  assigntype: any;
  liveCallData: any;
  callStatus: any;
  callDuration: string = '00h:00m:00s';
  private timerInterval: any;
  todaysdateforcompare: any;
  currentdateforcompare = new Date();
  currenttime: any;
  private stageTrigger$ = new Subject<void>();
  private historyTrigger$ = new Subject<void>();
  callDirection: any;
  callCounts: number = 3;
  displayCustomerNumber: any = '';

  ngOnInit() {
    let currentUrl = this.router.url;
    let pathWithoutQueryParams = currentUrl.split('/')[1];
    let pathWithoutQueryParams1 = currentUrl.split('?')[0];
    if (pathWithoutQueryParams1 == '/mandate-feedback') {
      this.feedbackId = 1;
    } else {
      this.feedbackId = 0;
    }

    this.id = this.calledLead.LeadID;
    this.clickedRMID = this.userid;
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');
    this.username = localStorage.getItem('Name');
    this.role_type = localStorage.getItem('role_type');

    if (this.role_type == 1 && this.calledLead.execId != this.userid) {
      this.selectedExecId = this.calledLead.execId;
      this.leadAssignedExecid = this.calledLead.execId;
    } else {
      this.leadAssignedExecid = this.assignedRm;
    }


    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = (new Date()).toLocaleTimeString([], options);
    this.currenttime = timeString;

    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.getLiveCallsData();
    this.echoService.listenToDatabaseChanges((message) => {
      if (localStorage.getItem('UserId') == message.Executive && (message.Call_status_new == 'Call Disconnected' || message.Call_status_new == 'Ringing' || message.Call_status_new == 'Answered' || message.Call_status_new == 'Call Connected' || message.Call_status_new == 'Executive Busy' || message.Call_status_new == 'BUSY' || message.Direction == 'inbound')) {
        this.callStatus = message.Call_status_new;
        this.callDirection = message.Direction;
        if (message.Call_status_new == 'Executive Busy' || message.Call_status_new == 'BUSY') {
          setTimeout(() => {
            // this.actionChange('Follow Up');
            this.addfollowupdata();
          }, 0)
        }
        setTimeout(() => {
          if (this.callStatus == 'Call Disconnected') {
            this.stopTimer();
          }
          this.getLiveCallsData();
        }, 1000)
        return
      }
    });

    this.stageTrigger$.pipe(debounceTime(700)).subscribe(() => {
      this.getstages();
    });

    this.historyTrigger$.pipe(debounceTime(700)).subscribe(() => {
      this.triggerhistory();
    });

    this.getcustomerview();
    this.getsize();
    this.getprprtytype();
    this.getstatus();
    this.getlocalitylist();

    let rmid;
    if (this.feedbackId == 1) {
      rmid = this.clickedRMID;
    } else {
      rmid = this.userid;
    }

    var param = {
      leadid: this.id,
      execid: rmid,
      feedbackid: this.feedbackId
    }

    this._mandateService
      .propertylist(param)
      .subscribe(propertylist => {
        this.properties = propertylist;
      });
    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    } else if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
      this.adminview = true;
      this.execview = false;
      this.historyTrigger$.next();
    } else {
      this.adminview = false;
      this.execview = true;
    }

    let node1: any = document.createElement('link');
    node1.setAttribute('href', 'https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css');
    node1.rel = 'stylesheet';
    node1.type = 'text/css';
    node1.id = "myplans_material_css";
    document.getElementsByTagName('head')[0].appendChild(node1);

    let node2: any = document.createElement('script');
    node2.type = 'text/javascript';
    node2.src = 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js';
    node2.charset = 'utf-8';
    node2.id = "myplans_dynamic_links_1";
    document.getElementsByTagName('head')[0].appendChild(node2);

    let node3: any = document.createElement('script');
    node3.src = 'https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js';
    node3.type = 'text/javascript';
    node3.charset = 'utf-8';
    node3.id = "myplans_dynamic_links_2";
    document.getElementsByTagName('head')[0].appendChild(node3);
  }

  // startTimer() {
  //   console.log(this.liveCallData.starttime)
  //   this.timerInterval = setInterval(() => {
  //     if (this.callStatus == 'call Disconnected') {
  //       this.stopTimer(); // stop timer if call ended
  //       return;
  //     }else {
  //       if (this.liveCallData.starttime) {
  //         this.callDuration = this.getDurationTime(this.liveCallData.starttime);
  //       }
  //     }

  //   }, 1000);
  // }

  // stopTimer() {
  //   if (this.timerInterval) {
  //     clearInterval(this.timerInterval);
  //   }
  // }

  handleRefresh() {
    this.ngOnInit();
  }

  getLiveCallsData() {
    this._sharedservice.getLiveCallsList(localStorage.getItem('UserId')).subscribe((resp) => {
      if (resp.status == 'success') {
        this.liveCallData = resp.success[0];
        if (this.liveCallData.starttime) {
          this.callStartTime = new Date(this.liveCallData.starttime).getTime();
          this.callStatus = resp.success[0].dialstatus;
          this.callDirection = resp.success[0].direction;
          this.startTimer();
        }
      } else {
        this.liveCallData = '';
        this.stopTimer();
      }
    })
  }

  ngOnDestroy() {
    let element1 = document.getElementById('myplans_material_css');
    let element2 = document.getElementById('myplans_dynamic_links_1');
    let element3 = document.getElementById('myplans_dynamic_links_2');
    if (element1) {
      element1.parentNode.removeChild(element1);
    }
    if (element2) {
      element2.parentNode.removeChild(element2);
    }
    if (element3) {
      element3.parentNode.removeChild(element3);
    }
    $('.modal').remove();
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.echoService.stopListeningToDatabaseChanges();

    if (this.stageTrigger$) {
      this.stageTrigger$.unsubscribe();
    }

    if (this.historyTrigger$) {
      this.historyTrigger$.unsubscribe();
    }
  }

  backClicked() {
    setTimeout(() => {
      this._location.back();
      // setTimeout(()=>{
      //   let currentUrl = this.router.url;
      //   let pathWithoutQueryParams = currentUrl.split('?')[0];
      //   let currentQueryparams = this.route.snapshot.queryParams;
      //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //     this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
      //   })
      // },1000)
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }, 100)
  }

  public getExstendsion(image) {
    if (image.endsWith('jpg') || image.endsWith('jpeg') || image.endsWith('png')) {
      return 'jpg';
    }
    if (image.endsWith('pdf')) {
      return 'pdf';
    }
  }

  addusv() {
    this.usvs.push({});
  }

  //here we get the fixed property names.
  getFixedProperties() {
    let param = {
      leadid: this.id,
      execid: this.selectedExecId,
      loginid: this.userid
    }
    this._mandateService.getFixedMandateProperties(param).subscribe((resp) => {
      if (resp.status == 'True') {
        this.fixedPropertiesList = resp['result'];
      } else {
        this.fixedPropertiesList = [];
      }
    })
  }

  // CUSTOMER-VIEW-FROM-ENQUIRY
  getcustomerview() {
    this.showRejectionForm = false;
    this._mandateService.getcustomeredit(this.id).subscribe(cust => {
      this.filterLoader = false;
      this.show_cnt = cust[0];
      this.show_cnt_subarray = cust[0].assignedrm;
      this.facemodel = cust[0];
      this.regname = cust[0].customer_name;
      this.regnumber = cust[0].customer_number;
      this.regmail = cust[0].customer_mail;
      if (cust[0].latestaction) {
        this.closestObject = cust[0].latestaction;
      }
      if (this.locality && this.show_cnt['localityid']) {
        let location = this.locality.filter((data) => data.id == this.show_cnt['localityid']);
        this.selectedlocality = location[0].id
      }

      if (this.show_cnt.mergedleads) {
        let data = this.show_cnt.mergedleads.map((data) => ({
          name: data.mergedName,
          id: data.mergedId
        }));
        this.primaryLeads = data;
      }

      if (this.show_cnt) {
        let data1 = {
          name: this.show_cnt.customer_name,
          id: this.show_cnt.customer_IDPK,
        }
        this.primaryLeads.push(data1);
      }

      if (this.show_cnt.enquiry_possession == '1') {
        this.leadPossession = 'Immediate';
      } else if (this.show_cnt.enquiry_possession == '2') {
        this.leadPossession = '6 Months';
      } else if (this.show_cnt.enquiry_possession == '3') {
        this.leadPossession = '1 Year';
      } else if (this.show_cnt.enquiry_possession == '4') {
        this.leadPossession = '< 2 years';
      }

      if (this.show_cnt.enquiry_proptype == '1') {
        this.leadPropertyType = "Apartment";
      } else if (this.show_cnt.enquiry_proptype == '2') {
        this.leadPropertyType = "Villa";
      } else if (this.show_cnt.enquiry_proptype == '3') {
        this.leadPropertyType = "Plot";
      } else if (this.show_cnt.enquiry_proptype == '4') {
        this.leadPropertyType = "Villament";
      }

      $('#proptypeselect').val(this.show_cnt['enquiry_proptype']);
      $('#sizeselect').val(this.show_cnt['enquiry_bhksize']);
      $('#budgetselect').val(this.show_cnt['enquiry_budget']);
      $('#possessionselect').val(this.show_cnt['enquiry_possession']);
      $('#priorityselect').val(this.show_cnt['lead_priority']);
      $('#customer_location').val(this.show_cnt['localityid']);
      $('#customer_address').val(this.show_cnt['address']);

      if (this.show_cnt['customer_phase'] == null) {
        this.show_cnt['customer_phase'] = 'Fresh lead';
      } else {
        this.showRejectionForm = false;
      }
      // let execid;
      // if (this.show_cnt_subarray.length > 0 && this.show_cnt_subarray[0].assignedvisits == '1') {
      //   execid = this.show_cnt_subarray[0].RM_IDFK;
      // } else {
      //   execid = this.leadAssignedExecid
      // }
    })

    this._mandateService.getassignedrm(this.id, this.userid, this.leadAssignedExecid, this.feedbackId).subscribe(cust => {
      this.filterLoader = false;
      if (cust.status == 'True') {
        this.assignedrm = cust.RMname;
        if (this.roleid == 1 || this.roleid == '2' || this.role_type == 1) {
          this.leadsDetailsInfo = cust.RMname;
        } else {
          if (this.feedbackId == 0) {
            this.leadsDetailsInfo = cust.RMname.filter((exec) => {
              if (exec.leadstage != "Junk") return true;
              return exec.RMID == this.userid;
            });
          } else if (this.feedbackId == 1) {
            this.leadsDetailsInfo = cust.RMname;
          }
        }
        this.executeid = cust.RMname[0].executiveid;
        this.usvstagedetection = cust.RMname[0].leadstage;
        this.usvstagestatusdetection = cust.RMname[0].leadstatus;
        // if (this.route.snapshot.params['execid'] == 1) {
        // this.selectedExecId = this.executeid;
        // } else {
        this.selectedExecId = this.leadAssignedExecid
        // }

        this.assignedrm = this.assignedrm.filter((exec) => {
          return exec.RMID == this.selectedExecId;
        });
        if (this.assignedrm && this.assignedrm.length > 0) {
          this.getexecutiveId(this.assignedrm[0]);
        }

        if (this.assignedrm[0].leadstage == 'Fresh' && (this.show_cnt.enquiry_bhksize == null || this.show_cnt.enquiry_budget == null)) {
          setTimeout(() => {
            // $('#auto_edit_trigger').click();
            this.getcustomerupdate(this.show_cnt.customer_IDPK);
          }, 0)
        }

        if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop && this.assignedrm[0].suggestedprop.length > 1) {
          this.isSuggestedPropBoolean = false;
          let propertyData, propIndex;
          this.assignedrm[0].suggestedprop.forEach((prop, index) => {
            propertyData = prop;
            propIndex = index;
          })
          if (propertyData.selection == 1 && propertyData.leadstage == 'USV' && propertyData.actions == 0 || propertyData.selection == 2 && propertyData.leadstage == 'RSV' && propertyData.actions == 1) {
            this.selectedItem = propIndex;
            setTimeout(() => {
              this.tabclick(propIndex, propertyData);
            }, 100)
          } else {
            this.selectedItem = 0;
            setTimeout(() => {
              this.tabclick(this.selectedItem, this.assignedrm[0].suggestedprop[0]);
            }, 100)
          }
        } else {
          this.selectedItem = 0;
          setTimeout(() => {
            if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop) {
              this.tabclick(this.selectedItem, this.assignedrm[0].suggestedprop[0]);
            }
          }, 100)
        }

        if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop) {
          this.visitpanelselection = this.assignedrm[0].suggestedprop.filter((prop) => {
            return !(prop.weekplan == null)
          })
          if (this.visitpanelselection.length > 0 && this.visitpanelselection[0].weekplan == '1') {
            this.selectedPlanType = 'weekdays';
          } else if (this.visitpanelselection.length > 0 && this.visitpanelselection[0].weekplan == '2') {
            this.selectedPlanType = 'weekend';
          } else if (this.visitpanelselection.length > 0 && this.visitpanelselection[0].weekplan == '0') {
            this.selectedPlanType = 'ytc';
          }
        }

        if (this.usvstagedetection == "USV" && this.usvstagestatusdetection == "3" && cust.RMname[0].visitstatus == "0") {
          this.actionChange(this.usvstagedetection);
        }
        if (this.selectedSuggestedProp && this.selectedSuggestedProp.actions == '7' && this.selectedSuggestedProp.currentstage == '5') {
          this.showRejectionForm = true;
          this.verifyrequest(this.assignedrm[0].customer_IDPK, this.selectedSuggestedProp.propid, this.assignedrm[0].RMID, this.selectedSuggestedProp.name);
        }
        if (this.selectedSuggestedProp && this.selectedSuggestedProp.actions == '8' && this.selectedSuggestedProp.currentstage == '5') {
          this.showRejectionForm = true;
          this.verifyrequest(this.assignedrm[0].customer_IDPK, this.selectedSuggestedProp.propid, this.assignedrm[0].RMID, this.selectedSuggestedProp.name)
        }
        if (this.selectedSuggestedProp && this.selectedSuggestedProp.actions == '6' && this.selectedSuggestedProp.currentstage == '5') {
          this.showRejectionForm = true;
          this.verifyrequest(this.assignedrm[0].customer_IDPK, this.selectedSuggestedProp.propid, this.assignedrm[0].RMID, this.selectedSuggestedProp.name)
        }

      } else {
        // if (this.roleid == '50003' || this.roleid == '50004') {
        //   if (cust.status == 'False' && cust.lead == 1) {
        //     this.isMandateLead = true;
        //     swal({
        //       title: 'Do you want to convert lead to Mandate',
        //       type: 'info',
        //       cancelButtonText: 'NO',
        //       confirmButtonText: 'OK',
        //       showCancelButton: true,
        //       allowOutsideClick: false
        //     }).then((result) => {
        //       if (result.value == true) {
        //         this.mandateprojectsfetch();
        //         $('#visit_leads_btn').click();
        //       } else if (result.dismiss) {
        //         this.router.navigateByUrl(`/assigned-leads-details/${this.id}/${this.userid}/${this.feedbackId}/retail`)
        //       }
        //     });
        //   } else {
        //     this.isMandateLead = false;
        //   }
        // }
      }
    })

  };

  tabclick(i, suggested) {
    this.isSuggestedPropBoolean = false;
    $(".actionss").addClass("actionbtnss");
    $(".selectMarks").addClass("iconmarks");
    $(".actionbtnss").removeClass("actionss");
    $(".iconmarks").removeClass("selectMarks");
    $(".actionss" + i).removeClass("actionbtnss");
    $(".actionss" + i).addClass("actionss");
    $(".selectMarks" + i).removeClass("iconmarks");
    $(".selectMarks" + i).addClass("selectMarks");
    this.selectedSuggestedProp = suggested;
    this.followform = false;
    this.usvform = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.leadclosedform = false;
    this.junkform = false;
    // $('.radiocheck').prop('checked', false);
    this.stageTrigger$.next();
  }

  getexecutiveId(exec) {
    this.filterLoader = true;
    this.selectedExecId = exec.RMID;
    this.activeTabIndex = this.leadsDetailsInfo.indexOf(exec);
    this.followform = false;
    this.usvform = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.leadclosedform = false;
    this.junkform = false;

    this.getFixedProperties();
    this.assignedrm = this.leadsDetailsInfo.filter((exec) => {
      return exec.RMID == this.selectedExecId;
    });

    if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop && this.assignedrm[0].suggestedprop.length > 1) {
      this.isSuggestedPropBoolean = true;
      let propertyData;
      let propIndex;
      this.assignedrm[0].suggestedprop.forEach((prop, index) => {
        propertyData = prop;
        propIndex = index;
      })
      if (propertyData.selection == 1 && propertyData.leadstage == 'USV' && propertyData.actions == 0 || propertyData.selection == 2 && propertyData.leadstage == 'RSV' && propertyData.actions == 1) {
        this.selectedItem = propIndex;
        setTimeout(() => {
          this.tabclick(propIndex, propertyData)
        }, 100)
      }
    } else {
      // this.selectedItem = 0;
      if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop) {
        this.tabclick(0, this.assignedrm[0].suggestedprop[0]);
      }
    }

    if (this.assignedrm && this.assignedrm.length > 0 && this.assignedrm[0].suggestedprop) {
      this.visitpanelselection = this.assignedrm[0].suggestedprop.filter((prop) => {
        return !(prop.weekplan == null)
      });

      if (this.selectedSuggestedProp) {
        if (this.selectedSuggestedProp.weekplan == '1') {
          this.selectedPlanType = 'weekdays';
        } else if (this.selectedSuggestedProp.weekplan == '2') {
          this.selectedPlanType = 'weekend';
        } else if (this.selectedSuggestedProp.weekplan == '0') {
          this.selectedPlanType = 'ytc';
        }
      }
    }

    setTimeout(() => {
      this.stageTrigger$.next();
      this.historyTrigger$.next();
      this.scriptfunctions();
      this.filterLoader = false;
    }, 10)

    setTimeout(() => {
      this.isAccompanyBy = false;
      if ((this.userid != this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && ((this.role_type == 1 && (exec.roleid == 50013 || exec.roleid == 50014)) || this.role_type != 1) && this.feedbackId != 1) {
        $(".updateActivities").removeClass("active");
        $(".allActivities").removeClass("active");
        setTimeout(() => {
          const tab = document.getElementById('allActivitiesTab');
          if (tab) {
            tab.click();
          }
        }, 100)
      } else if ((this.userid == this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && ((this.role_type == 1 && exec.roleid != 50013 && exec.roleid != 50014)) && this.feedbackId != 1) {
        if (this.assignedrm && this.assignedrm[0].visitaccompaniedid && ((this.assignedrm[0].visitaccompaniedid != this.assignedrm[0].RMID))) {
          // this.isAccompanyBy = true;
          setTimeout(() => {
            $(".allActivities").removeClass("active");
            const tab = document.getElementById('updateActivitiesTab');
            if (tab) {
              tab.click();
            }
          }, 0)
        } else {
          $(".allActivities").removeClass("active");
          const tab = document.getElementById('updateActivitiesTab');
          if (tab) {
            tab.click();
          }
        }
      } else if ((this.userid == this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && this.role_type != 1 && this.feedbackId != 1) {
        $(".allActivities").removeClass("active");
        const tab = document.getElementById('updateActivitiesTab');
        if (tab) {
          tab.click();
        }
      } else if ((this.userid != this.selectedExecId) && this.roleid != 1 && this.roleid != 2 && ((this.role_type == 1 && exec.roleid != 50013 && exec.roleid != 50014) || this.role_type != 1) && this.feedbackId != 1) {
        if (this.assignedrm && this.assignedrm[0].visitaccompaniedid && ((this.assignedrm[0].visitaccompaniedid != this.assignedrm[0].RMID) || this.role_type == 1)) {
          // this.isAccompanyBy = true;
          setTimeout(() => {
            $(".allActivities").removeClass("active");
            const tab = document.getElementById('updateActivitiesTab');
            if (tab) {
              tab.click();
            }
          }, 0)
        } else {
          $(".allActivities").removeClass("active");
          const tab = document.getElementById('updateActivitiesTab');
          if (tab) {
            tab.click();
          }
        }
      }
    }, 1000)

    $('.radiocheck').prop('checked', false);
  }

  editNowClicked: boolean = false;
  showEditForm(type) {
    if (type == 'admin') {
      this.editNowClicked = true;
      this.adminBookingEdit = true;
    } else {
      this.adminBookingEdit = true;
      this.editNowClicked = false;
    }
  }

  showBookingRejection() {
    this.adminBookingEdit = false;
    this.enablebuttonApprove = true;
    this.enablebuttonReject = false;
  }

  //this method is not been used any where in this component
  addpropertiestolist00() {
    this.datavisitwithothersid = $(".onchangeforvisitwithothers00").dropdown("get value");
    this.datavisitwithothersname = $('.onchangeforvisitwithothers00 option:selected').toArray().map(item => item.text).join();
    this.suggestedproperties = $(".onchangeforsuggestproperties00").dropdown("get value");
    this.suggestedpropertiesname = $('.onchangeforsuggestproperties00 option:selected').toArray().map(item => item.text).join();

    if (this.suggestedproperties == "" && this.datavisitwithothersid == "") {
      swal({
        title: 'Add any one property',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    } else {
      $('.onchangeforsuggestproperties00').removeAttr("style");
    }

    if (this.suggestedproperties.length == 0) {
    } else {
      var param = {
        leadid: this.id,
        suggestproperties: this.suggestedproperties,
        assignid: this.userid,
        stage: "Common Area",
      }
      this.autoremarks = " suggested some properties like " + this.suggestedpropertiesname;
      this._mandateService.addsuggestedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          swal({
            title: 'Suggested Successfully Added',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.modalClose.nativeElement.click();
            $(".radiocheck").prop('checked', false);
            this.followform = false;
            this.followupform = false;
            this.followupformbtn = false;
            this.f2fform = false;
            this.usvform = false;
            this.svform = false;
            this.rsvform = false;
            this.finalnegoform = false;
            this.leadclosedform = false;
            this.junkform = false;
            this.junkformbtn = false;
            this.commonformbtn = false;
            this.ngOnInit();
          });
        }
        $(".onchangeforvisitwithothers00").dropdown('clear');
        $(".onchangeforvisitwithothers00").dropdown('destroy');
        $(".onchangeforvisitwithothers00").dropdown('restore defaults');
        $(".onchangeforsuggestproperties00").dropdown('clear');
        $(".onchangeforsuggestproperties00").dropdown('destroy');
        $(".onchangeforsuggestproperties00").dropdown('restore defaults');
      }, (err) => {
        console.log("Failed to Update");
      })
    }

    if (this.datavisitwithothersid.length == 0) {
      // alert("No need push to database");
    } else {
      // alert("Should push to database");
      var param2 = {
        leadid: this.id,
        assignid: this.selectedExecId,
        visitedproperties: this.datavisitwithothersid
      }
      this.autoremarks = "While fixing the USV " + this.username + " added few already visited properties with others Like, " + this.datavisitwithothersname;
      this._mandateService.addvisitedpropertiesothers(param2).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          swal({
            title: 'Visited Successfully Added',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.modalClose.nativeElement.click();
            $(".radiocheck").prop('checked', false);
            this.followform = false;
            this.followupform = false;
            this.followupformbtn = false;
            this.f2fform = false;
            this.usvform = false;
            this.svform = false;
            this.rsvform = false;
            this.finalnegoform = false;
            this.leadclosedform = false;
            this.junkform = false;
            this.junkformbtn = false;
            this.commonformbtn = false;
            this.ngOnInit();
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }

  }

  propertyType: any;
  typeselection(event) {
    var value = event.target.value;
    const a = document.getElementById("proptypeselect") as HTMLInputElement;
    a.value = value;
    this.propertyType = value;
  }

  possessionselection(event) {
    var value = event.target.value;
    const a = document.getElementById("possessionselect") as HTMLInputElement;
    a.value = value;
  }

  bhkSelection: any;
  sizeselection(event) {
    var value = event.target.value;
    const a = document.getElementById("sizeselect") as HTMLInputElement;
    a.value = value;
    let numArr = value.match(/[\d\.]+/g)
    numArr = numArr.filter(n => n != '.')
    // this.bhkSelection = value;
  }

  budgetselection(event) {
    var value = event.target.value;
    const a = document.getElementById("budgetselect") as HTMLInputElement;
    a.value = value;
  }

  showinput() {
    this.newpropertybox = true;
  }

  getlocalitylist() {
    this._mandateService.localitylist().subscribe(localities => {
      this.locality = localities;
      this.selectedlocality = this.show_cnt['localityid'];
    })
  }

  editPriority(event) {
    var value = event.target.value;
    const a = document.getElementById("priorityselect") as HTMLInputElement;
    a.value = value;
  }

  getprprtytype() {
    this._mandateService
      .getpropertytypelist()
      .subscribe(proprttype => {
        this.typelist = proprttype;
      })
  }

  statesChange(vals) {
    const val = vals.target.value;
    this._mandateService
      .getpropertylist_ID(val)
      .subscribe(prope => {
        this.projects = prope;
      })
    $('.projts.ui.dropdown').dropdown('restore defaults');
    this.negmodel.final_builder_info = vals.target.options[vals.target.selectedIndex].text;
  }

  // CUSTOMER-VIEW-INSIDE-MODAL
  getcustomerupdate(id) {
    // setTimeout(()=>{
    //  $('.modal-backdrop').closest('div').remove();
    // },0);
    this.isEditLead = true;
    this._mandateService.getcustomeredit(id).subscribe(test => {
      this.modela = test[0];
      this.editmodela = test[0];

      if (((this.assignedrm && this.assignedrm[0].leadstage != 'Fresh') || (this.assignedrm && this.assignedrm[0].leadstage == 'Fresh' && this.assignedrm[0].followupreason == 8)) || (this.roleid == '1' || this.roleid == '2')) {
        this.displayCustomerNumber = this.show_cnt && this.show_cnt.customer_number;
      } else {
        this.displayCustomerNumber = 'xxxxxxxxxx';
      }


      this.localityid = this.editmodela['localityid'];
      if (this.editmodela['customer_phase'] == null) {
        this.editmodela['customer_phase'] = 'Fresh lead';
      } else {
      }

      if (this.editmodela.enquiry_budget == undefined || this.editmodela.enquiry_budget == null) {
        this.editmodela.enquiry_budget = '';
      }

      if (this.editmodela.enquiry_possession == undefined || this.editmodela.enquiry_possession == null) {
        this.editmodela.enquiry_possession = '';
      }

      if (this.editmodela.enquiry_bhksize == undefined || this.editmodela.enquiry_bhksize == null) {
        this.editmodela.enquiry_bhksize = '';
      }

      if (this.editmodela.enquiry_proptype == undefined || this.editmodela.enquiry_proptype == null) {
        this.editmodela.enquiry_proptype = '';
      }

      $('#proptypeselect').val(this.show_cnt['enquiry_proptype']);
      $('#sizeselect').val(this.show_cnt['enquiry_bhksize']);
      $('#budgetselect').val(this.show_cnt['enquiry_budget']);
      $('#possessionselect').val(this.show_cnt['enquiry_possession']);
      $('#priorityselect').val(this.show_cnt['lead_priority']);
      $('#customer_location').val(this.show_cnt['localityid']);
      $('#customer_address').val(this.show_cnt['address']);
    })
  }

  getsize() {
    this._mandateService.getbhk().subscribe(propsize => { this.propertysize = propsize; })
  }

  getstatus() {
    this._mandateService.leadstatus().subscribe(status => { this.leadstatus = status; })
  }

  getstages() {
    this.filterLoader = true;
    this.showRejectionForm = false;
    var userid = localStorage.getItem('UserId');
    if (this.selectedSuggestedProp) {
      this._mandateService
        .getactiveleadsstatus(this.id, userid, this.selectedExecId, this.selectedSuggestedProp.propid, this.feedbackId)
        .subscribe(stagestatus => {
          this.filterLoader = false;
          if (stagestatus.status == "True") {
            this.activestagestatus = stagestatus['activeleadsstatus'];
            this.currentstage = this.activestagestatus[0].stage;
            if (this.activestagestatus[0].stagestatus == "1" && this.activestagestatus[0].followupstatus == "0" || this.activestagestatus[0].stagestatus == "1" && this.activestagestatus[0].followupstatus == null) {
              this.currentstagestatus = "Fixed";
            } else if (this.activestagestatus[0].stagestatus == "2" && this.activestagestatus[0].followupstatus == "0" || this.activestagestatus[0].stagestatus == "2" && this.activestagestatus[0].followupstatus == null) {
              this.currentstagestatus = "Refixed";
            } else if (this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].followupstatus == "0" || this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].followupstatus == null) {
              this.currentstagestatus = "Done";
            } else if (this.activestagestatus[0].stagestatus == "1" && this.activestagestatus[0].followupstatus == "4") {
              this.currentstagestatus = "Fixed - Followup";
            } else if (this.activestagestatus[0].stagestatus == "2" && this.activestagestatus[0].followupstatus == "4") {
              this.currentstagestatus = "Refixed - Followup";
            } else if (this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].followupstatus == "4") {
              this.currentstagestatus = "Done - Followup";
            }

            if (this.activestagestatus[0].stage == "Lead Closed" || this.activestagestatus[0].stage == "Move to Junk") {
              this.USV = false;
              if (this.execview) {
                this.showRejectionForm = true;
              }
            } else if (this.activestagestatus[0].stage == "Deal Closed") {
              if (this.roleid != '50014' && this.roleid != '50013' && this.assignedrm && this.assignedrm[0].roleid != 50013 && this.assignedrm[0].roleid != 50014) {
                this.showRejectionForm = true;
                this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name);
              } else {
                this.USV = false;
                this.followup = true;
                this.RSV = false;
                this.Negotiation = false;
                this.leadclose = false;
                this.junkmove = true;
              }
            } else if (this.activestagestatus[0].stage == "Deal Closing Pending") {
              if (this.roleid != '50014' && this.roleid != '50013' && this.assignedrm && this.assignedrm[0].roleid != 50013 && this.assignedrm[0].roleid != 50014) {
                this.USV = false;
                this.followup = true;
                this.RSV = false;
                this.Negotiation = false;
                this.leadclose = true;
                this.junkmove = true;
              } else {
                this.USV = false;
                this.followup = true;
                this.RSV = false;
                this.Negotiation = false;
                this.leadclose = false;
                this.junkmove = true;
              }
            } else if (this.activestagestatus[0].stage == "Deal Closing Requested" && (this.activestagestatus[0].followupstatus == "0 " || this.activestagestatus[0].followupstatus == null || this.activestagestatus[0].followupstatus == "4")) {
              this.RSV = false;
              this.Negotiation = false;
              this.USV = false;
              if (this.userid == 1) {
                if (this.assignedrm && this.assignedrm[0].roleid != 50013 && this.assignedrm[0].roleid != 50014) {
                  this.showRejectionForm = true;
                  this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name)
                }
              } else {
                if (this.roleid != '50014' && this.roleid != '50013') {
                  this.showRejectionForm = true;
                  this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name)
                } else {
                  this.USV = false;
                  this.followup = true;
                  this.RSV = false;
                  this.Negotiation = false;
                  this.leadclose = false;
                  this.junkmove = true;
                }
              }
            } else if (this.activestagestatus[0].stage == "Closing Request Rejected" && (this.activestagestatus[0].followupstatus == "0 " || this.activestagestatus[0].followupstatus == null || this.activestagestatus[0].followupstatus == "4")) {
              this.RSV = false;
              this.Negotiation = false;
              this.USV = false;
              if (this.userid == 1) {
                if (this.assignedrm && this.assignedrm[0].roleid != 50013 && this.assignedrm[0].roleid != 50014) {
                  this.showRejectionForm = true;
                  this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name)
                }
              } else {
                if (this.roleid != '50014' && this.roleid != '50013') {
                  this.showRejectionForm = true;
                  this.verifyrequest(this.id, this.selectedSuggestedProp.propid, this.selectedExecId, this.selectedSuggestedProp.name)
                } else {
                  this.USV = false;
                  this.followup = true;
                  this.RSV = false;
                  this.Negotiation = false;
                  this.leadclose = false;
                  this.junkmove = true;
                }
              }
            } else if (this.activestagestatus[0].stage == "Fresh" && this.activestagestatus[0].followupstatus == "4") {
              this.USV = true;
              this.SV = false;
              this.RSV = false;
              this.Negotiation = false;
              this.leadclose = false;
              this.followup = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "1" || this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "2" || this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "4") {
              this.followup = true;
              this.USV = true;
              this.RSV = false;
              this.Negotiation = false;
              this.leadclose = false;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "1") {
              this.USV = false;
              this.followup = true;
              this.RSV = true;
              this.Negotiation = true;
              this.leadclose = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "0") {
              this.followup = false;
              this.SV = false;
              this.RSV = false;
              this.Negotiation = false;
              this.leadclose = false;
              this.followup = true;
              this.junkmove = true;
              this.USV = true;
              this.usvform = true;
              // Loading this API again only for fetching the walkin date & time and write to the html view hidden visited date and time input boxes after the usvform in true condition
              this._mandateService
                .getassignedrm(this.id, this.userid, this.leadAssignedExecid, this.feedbackId)
                .subscribe(cust => {
                  // Adding First Visit date time to USV Submission Section
                  if (cust && cust.RMname && cust.RMname[0].walkintime) {
                    var date = cust.RMname[0].walkintime.split(' ')[0];
                    var time = cust.RMname[0].walkintime.split(' ').pop();
                    $('#USVvisiteddate').val(date);
                    $('#USVvisitedtime').val(time);
                  }
                  // Adding First Visit date time to USV Submission Section
                });
              $(document).ready(function () {
                $('#option-21').prop('checked', true);
              });
              // Loading this API again only for fetching the walkin date & time and write to the html view hidden visited date and time input boxes after the usvform in true condition

            } else if (this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "1" || this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "2" || this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "4") {
              this.USV = false;
              this.SV = false;
              this.Negotiation = false;
              this.leadclose = false;
              this.followup = true;
              this.RSV = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "1") {
              this.USV = false;
              this.RSV = true;
              this.Negotiation = true;
              this.leadclose = true;
              this.followup = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "0") {
              this.SV = false;
              this.USV = false;
              this.RSV = true;
              this.Negotiation = false;
              this.leadclose = false;
              this.usvform = false;
              this.followup = true;
              this.junkmove = true;
              this.rsvform = true;
              $(document).ready(function () {
                $('#option-23').prop('checked', true);
              });
            } else if (this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "1" || this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "2" || this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "4") {
              this.USV = false;
              this.SV = false;
              this.RSV = false;
              this.leadclose = false;
              // this.finalnegoform = true;
              this.Negotiation = true;
              this.followup = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "1") {
              this.USV = false;
              this.RSV = true;
              this.leadclose = true;
              this.Negotiation = true;
              this.followup = true;
              this.junkmove = true;
            } else if (this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "0") {
              this.SV = false;
              this.USV = false;
              this.RSV = false;
              this.leadclose = false;
              this.usvform = false;
              this.followup = true;
              this.junkmove = true;
              this.finalnegoform = true;
              this.Negotiation = true;
            } else if (this.activestagestatus[0].stage == "Junk") {
              if (this.roleid == 1 || this.roleid == '2') {
                this.USV = false;
                this.RSV = true;
                this.Negotiation = true;
                this.leadclose = true;
                this.followup = true;
                this.junkmove = true;
                this.leadMoveJunkExec = true;
              } else if (this.roleid != '1' && this.roleid != '2') {
                if (this.feedbackId == '0') {
                  this.followup = false;
                  this.junkmove = false;
                  this.USV = false;
                  this.RSV = false;
                  this.Negotiation = false;
                  this.leadclose = false;
                  this.leadMoveJunkExec = false;
                } else {
                  this.USV = false;
                  this.RSV = true;
                  this.Negotiation = true;
                  this.leadclose = true;
                  this.followup = true;
                  this.junkmove = true;
                }
              }
            } else {
              if (this.activestagestatus[0].stage == "Fresh" && this.activestagestatus[0].followupstatus == null) {
                this.showRejectionForm = false;
                this.followup = true;
                this.USV = true;
                this.SV = false;
                this.RSV = false;
                this.Negotiation = false;
                this.leadclose = false;
                this.junkmove = true;
              }
            }

            // if (this.activestagestatus[0].stage == 'Fresh') {
            //   this.usvform = false;
            // }
          } else if (stagestatus.status == "False") {
            this.currentstage = "Fresh";
            this.SV = false;
            this.RSV = false;
            this.Negotiation = false;
            this.leadclose = false;
          }
        });
    }
  }

  alternateNumbercheck(event) {
    if (event.target.value == this.show_cnt.customer_number) {
      this.editmodela.enquiry_altnumber = '';
      $('#enquiry_number').focus().css("border-color", "red").attr('placeholder', 'Please enter different contact number').val('');
    }
  }

  updateCustomer() {
    console.log('triggered edit API', this.editmodela.enquiry_proptype, this.editmodela.enquiry_possession, this.editmodela.enquiry_bhksize, this.editmodela.enquiry_budget);


    if (this.editmodela.enquiry_proptype == undefined || this.editmodela.enquiry_proptype == '' || this.editmodela.enquiry_proptype == null) {
      swal({
        title: 'Please select the Property Type',
        text: "Select any kind of Type",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }

    if (this.editmodela.enquiry_possession == undefined || this.editmodela.enquiry_possession == '' || this.editmodela.enquiry_possession == null) {
      swal({
        title: 'Please select the Possession Type',
        text: "Select any kind of Type",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }


    if (this.editmodela.enquiry_bhksize == undefined || this.editmodela.enquiry_bhksize == '' || this.editmodela.enquiry_bhksize == null) {
      swal({
        title: 'Please select the BHK Type',
        text: "Select any kind of Type",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }

    if (this.editmodela.enquiry_budget == undefined || this.editmodela.enquiry_budget == '' || this.editmodela.enquiry_budget == null) {
      swal({
        title: 'Please select the Budget Type',
        text: "Select any kind of Type",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }

    var primaryname = this.editmodela.customer_name;
    var primarynumber = this.displayCustomerNumber;
    var primarymail = this.editmodela.customer_mail;
    var alternatename = this.editmodela.enquiry_altname;
    var alternatenumber = this.editmodela.enquiry_altnumber;
    var alternatemail = this.editmodela.enquiry_altmail;
    var customerlocation = this.editmodela.localityid;
    var customerproptype = this.editmodela.enquiry_proptype;
    var possession = this.editmodela.enquiry_possession;
    var priority = this.editmodela.lead_priority;
    var customersize = this.editmodela.enquiry_proptype;
    var customerbudget = this.editmodela.enquiry_budget;
    var customeraddress = this.editmodela.address;

    var param = {
      primaryname: primaryname,
      primarynumber: primarynumber,
      primarymail: primarymail,
      name: alternatename,
      number: alternatenumber,
      mail: alternatemail,
      budget: customerbudget,
      location: customerlocation,
      proptype: customerproptype,
      size: customersize,
      address: customeraddress,
      leadid: this.id,
      priority: priority.toString(),
      possession: possession,
      execid: this.userid
    }

    this._sharedservice.datashortupdate(param).subscribe((success) => {
      this.status = success.status;
      this.resposeData = success;
      if (this.status == "True") {
        swal({
          title: 'Updated Successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.modalClose.nativeElement.click();
          this.isEditLead = false;
          this.ngOnInit();
          this.getlocalitylist();
        })
      }
    }, (err) => {
      console.log("Failed to Update");
    })
  }

  verifyrequest(leadid, propid, execid, propname) {
    this.closepropertyname = propname;
    var param = {
      leadid: leadid,
      propid: propid,
      execid: execid
    }
    this._mandateService.fetchrequestedvalues(param)
      .subscribe(requested => {
        this.requestedunits = requested['requestedvals'];
      });
  }

  uploadedData: any;
  uploadedImagesgetData(leadid, propid, execid, propname, index) {
    this.closepropertyname = propname;
    var param = {
      leadid: leadid,
      propid: propid,
      execid: execid
    }
    this._mandateService.fetchrequestedvalues(param)
      .subscribe(requested => {
        this.uploadedData = requested['requestedvals'];
      });
  }

  imageuploads(event, leadid, execid, propid) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      let allFilesValid = true;

      // First, validate all files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('jpg') || file.name.endsWith('jpeg') || file.name.endsWith('png') || file.name.endsWith('pdf')) {
          if (file.size > 1110000) {
            allFilesValid = false;
            swal({
              title: 'File Size Exceeded',
              text: 'File Size limit is 1MB',
              type: "error",
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              input.value = '';
              // this.closurefiles = [];
            });
            break;
          }
        } else {
          allFilesValid = false
          swal({
            title: 'Invalid File Format',
            text: 'The file format is not acceptable. Please upload a file in: JPG, JPEG, PNG, or PDF formats.',
            type: "error",
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            this.closurefiles = [];
          });
        }
      }

      // If all files are valid, process them
      if (allFilesValid) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = file.name;
          $('#customFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

          // Push the file to closurefiles and read the file
          this.closurefiles.push(file);
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.uploads.push(event.target.result);
          };
          this.uploadFile(leadid, execid, propid);
          reader.readAsDataURL(file);
        }
        // input.value = '';
        this.closurefiles = [];
      }
    }
    // let myFile = event.target.files;
    // for (let i = 0; i < myFile.length; i++) {
    //   if (myFile[i].size > 1110000) {
    //     swal({
    //       title: 'File Size Exceeded',
    //       text: 'File Size limit is 1MB',
    //       type: "error",
    //       timer: 2000,
    //       showConfirmButton: false
    //     }).then(() => {
    //     });
    //     return false;
    //   } else {
    //     const fileInput = event.target as HTMLInputElement;
    //     if (fileInput.files.length > 0) {
    //       for (let j = 0; j < event.target.files.length; j++) {
    //         if (!this.closurefiles.includes(event.target.files[j])) {
    //           this.closurefiles.push(event.target.files[j]);
    //           var reader = new FileReader();
    //           reader.onload = (event: any) => {
    //             this.uploads.push(event.target.result);
    //           };
    //           this.uploadFile(leadid, execid, propid)
    //         };
    //         reader.readAsDataURL(event.target.files[j]);
    //       }
    //     }
    //   }
    // }
  }

  uploadFile(leadid, execid, propid) {
    const formData = new FormData();
    formData.append('PropID', propid);
    formData.append('LeadID', leadid);
    formData.append('ExecID', this.userid);
    formData.append('assignID', execid);
    for (var k = 0; k < this.closurefiles.length; k++) {
      formData.append('file[]', this.closurefiles[k]);
    }
    this._mandateService.uploadFile(formData).subscribe((res) => {
      if (this.editNowClicked == true) {
        this.uploadedImagesgetData(leadid, propid, execid, '', '');
      } else {
        this.verifyrequest(leadid, propid, execid, '');
      }
    })
  }

  removeImage(event, leadid, execid, propid) {
    let myFile = event.file_name;
    //to remove from the ui
    this.requestedunits.forEach((data) => {
      data.images = data.images.filter((img) => !(img.file_name == myFile));
    })
    //to remove from the ui
    if (this.uploadedData) {
      this.uploadedData.forEach((data) => {
        data.images = data.images.filter((img) => !(img.file_name == myFile));
      })
    }
    //to remove drom the database
    this._mandateService.deleteImg(event.files_IDPK, event.file_name, event.lead_IDFK).subscribe((resp) => {
    })
  }

  requestapproval(leadid, execid, propid) {
    this.verifyrequest(leadid, propid, this.selectedExecId, this.selectedSuggestedProp.name);
    var param = {
      leadid: leadid,
      propid: propid,
      execid: this.userid,
      statusid: '1',
      remarks: "No Comments",
      assignid: this.selectedExecId
    }

    this._mandateService.closingrequestresponse(param)
      .subscribe(requestresponse => {
        if (requestresponse['status'] == 'True-0') {
          this.autoremarks = " Send the Deal Closing Request successfully.";
          var leadhistparam = {
            leadid: leadid,
            closedate: this.requestedunits[0].closed_date,
            closetime: this.requestedunits[0].closed_time,
            textarearemarks: "Deal closed Request Approved",
            leadstage: "Lead Closed",
            stagestatus: '0',
            userid: this.userid,
            assignid: this.selectedExecId,
            property: propid,
            autoremarks: this.autoremarks,
            feedbackid: this.feedbackId
          }
          this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this.filterLoader = false;
              swal({
                title: 'Request Approved Successfully',
                type: "success",
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
                this.showRejectionForm = false;
                $('.modal-backdrop').closest('div').remove();
                let currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              });
            } else if (this.status == "Duplicate Request") {
              swal({
                title: 'Already got the request for this same Unit number',
                type: "error",
                timer: 2000,
                showConfirmButton: false
              });
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        } else {
          swal({
            title: 'Some Error Occured',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        }
      });
  }

  enableButton() {
    if ($(".rejectedtextarea").val() == '') {
      this.enablebuttonApprove = true;
      this.enablebuttonReject = false;
    } else {
      this.enablebuttonReject = true;
      this.enablebuttonApprove = false;
    }

  }

  remarks: any;
  requestrejection(leadid, execid, propid) {
    if ($(".rejectedtextarea").val().trim() == "") {
      $(".rejectedtextarea").focus().css("border-color", "red").attr('placeholder', 'Please add the reason for rejection');
      return false;
    } else {
      $(".rejectedtextarea").removeAttr("style");
    }

    var remarkscontent = this.remarks;
    var param = {
      leadid: leadid,
      propid: propid,
      execid: this.userid,
      statusid: '2',
      remarks: remarkscontent,
      assignid: this.selectedExecId
    }
    this._mandateService.closingrequestresponse(param)
      .subscribe(requestresponse => {
        if (requestresponse['status'] == 'True-1') {
          swal({
            title: 'Request Rejected',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            $('.modal-backdrop').closest('div').remove();
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        } else {
          swal({
            title: 'Some Error Occured',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        }
      });
  }

  resubmitdata(leadid, execid, propid, type) {
    var bhk = $("#unit").val();
    var bhkunit = $("#unit_number").val();
    var dimension = $("#dimension").val();
    var ratepersqft = $("#rate_per_sqft").val();

    if ($("#unit").val() == "") {
      $("#unit").focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Size');
      return false;
    } else if ($("#unit_number").val() == "") {
      $("#unit_number").focus().css("border-color", "red").attr('placeholder', 'Please type the unit number');
      return false;
    } else if ($("#dimension").val() == "") {
      $("#dimension").focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');
      return false;
    } else if ($("#rate_per_sqft").val() == "") {
      $("#rate_per_sqft").focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
      return false;
    }

    var param = {
      leadid: leadid,
      propid: propid,
      execid: this.userid,
      bhk: bhk,
      bhkunit: bhkunit,
      dimension: dimension,
      ratepersqft: ratepersqft,
      assignid: this.selectedExecId
    }
    this._mandateService.requestresubmition(param)
      .subscribe(requestsubmition => {
        if (requestsubmition['status'] == 'True') {
          if (this.userid != '1') {
            this.getcustomerview()
          }
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
          // this.requestapproval(leadid, execid, propid);
        } else {
          swal({
            title: 'Some Error Occured',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        }
      });
  }

  actionChange(val) {
    if (val == "Follow Up") {
      $('#sectionselector').val('Follow Up');
      this.followform = true;
      this.followupform = true;
      this.followupformbtn = true;
      this.f2fform = false;
      this.usvform = false;
      this.svform = false;
      this.rsvform = false;
      this.finalnegoform = false;
      this.leadclosedform = false;
      this.junkform = false;
      this.junkformbtn = false;
      this.commonformbtn = false;
      $('#customer_phase4').val('Follow Up');
    } else if (val == "USV") {
      this.followform = false;
      this.followupform = false;
      this.followupformbtn = false;
      this.usvform = true;
      this.f2fform = false;
      this.svform = false;
      this.rsvform = false;
      this.finalnegoform = false;
      this.leadclosedform = false;
      this.junkform = false;
      this.junkformbtn = false;
      $('#customer_phase4').val('USV');
      $('#sectionselector').val('USV');
    } else if (val == "RSV") {
      this.followform = false;
      this.followupform = false;
      this.followupformbtn = false;
      this.rsvform = true;
      this.svform = false;
      this.usvform = false;
      this.f2fform = false;
      this.finalnegoform = false;
      this.leadclosedform = false;
      this.junkform = false;
      this.junkformbtn = false;
      $('#customer_phase4').val('RSV');
      $('#sectionselector').val('RSV');
    } else if (val == "Final Negotiation") {
      this.followform = false;
      this.followupform = false;
      this.followupformbtn = false;
      this.finalnegoform = true;
      this.rsvform = false;
      this.svform = false;
      this.usvform = false;
      this.f2fform = false;
      this.leadclosedform = false;
      this.junkform = false;
      this.junkformbtn = false;
      $('#customer_phase4').val('Final Negotiation');
      $('#sectionselector').val('Final Negotiation');
    } else if (val == "Lead Closed") {
      this.leadclosedform = true;
      this.followform = false;
      this.followupform = false;
      this.followupformbtn = false;
      this.finalnegoform = false;
      this.rsvform = false;
      this.svform = false;
      this.usvform = false;
      this.f2fform = false;
      this.junkform = false;
      this.junkformbtn = false;
      $('#customer_phase4').val('Lead Closed');
      $('#sectionselector').val('Lead Closed');
    } else if (val == "Move to Junk") {
      this.junkform = true;
      this.junkformbtn = true;
      this.f2fform = false;
      this.followform = false;
      this.followupform = false;
      this.followupformbtn = false;
      this.finalnegoform = false;
      this.rsvform = false;
      this.svform = false;
      this.usvform = false;
      this.f2fform = false;
      this.commonformbtn = false;
      this.leadclosedform = false;
      $('#customer_phase4').val('Move to Junk');
      $('#sectionselector').val('Move to Junk');
    } else {
      this.followupform = false;
      this.junkform = false;
      this.commonformbtn = true;
      this.followupformbtn = false;
      this.junkformbtn = false;
    }
  }

  triggerhistory() {
    this.showRejectionForm = false;
    this.isAccompanyBy = false;
    let execId;
    if (this.logsType == 'executive') {
      execId = this.selectedExecId;
    } else {
      execId = '';
    }
    var param2 = {
      leadid: this.id,
      roleid: this.roleid,
      userid: this.userid,
      execid: execId,
      feedbackid: this.feedbackId
    }
    this._mandateService
      .gethistory(param2)
      .subscribe(history => {
        if (history.status == 'True') {
          this.leadtrack = history['Leadhistory'];
        } else {
          this.leadtrack = [];
        }
      })
  }

  logsType: any;
  logsTab(type) {
    this.logsType = type;
    $('.other_section').removeClass("active");
    if (type == 'lead') {
      $(".lead_section").addClass("active");
      this.triggerhistory();
    } else if (type == 'executive') {
      $(".executive_section").addClass("active");
      this.triggerhistory();
    }
  }

  //  ASSIGN LEAD SECTION
  // getexecutives(event) {
  //   const id = event.target.options[event.target.options.selectedIndex].value;
  //   if (id == '50002') {
  //     this.rmleadassign = true;
  //     this.csleadassign = false;
  //   } else if (id == '50004') {
  //     this.rmleadassign = false;
  //     this.csleadassign = true;
  //   }
  //   this._mandateService.getexecutivesbasedid(id).subscribe(execute => { this.executives = execute; })
  // }

  moveToUsv() {
    this._mandateService.moveToUSV(this.id, this.selectedExecId).subscribe((data) => {
      $('.modal-backdrop').closest('div').remove();
      let currentUrl = this.router.url;
      let pathWithoutQueryParams = currentUrl.split('?')[0];
      let currentQueryparams = this.route.snapshot.queryParams;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
      });
    })
  }

  //assign leads code 
  assignmodalfetch(type, assigntype) {
    this.assigntype = assigntype;
    this.assignteam = type;
    if (type == 'mandate') {
      this.mandateprojectsfetch();
    }
  }

  //get selected team type based on the selected assign team type
  // getselectedteam(vals) {
  //   if (this.assignteam == 'mandate') {
  //     this.selectedMandateTeam = vals.value;
  //     this.mandateprojectsfetch();
  //   } else if (this.assignteam == 'retail') {
  //     let id = vals.value.value;
  //     if (id == '50010') {
  //     } else if (id == '50004') {
  //     } else {
  //       id = ''
  //     }
  //     this._retailservice.getRetailExecutives(id, '').subscribe(execute => {
  //       this.retailExecutives = execute['DashboardCounts'];
  //     })
  //   }
  // }

  //get mandate properties
  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateproperties = mandates['Properties'];

        if (this.assigntype == 'visit') {
          const selectedPropIds = this.fixedPropertiesList.map(p => p.propId);
          this.mandateproperties = this.mandateproperties.map(item => {
            return {
              ...item,
              isSelected: selectedPropIds.includes(item.property_idfk)
            };
          });
        } else {
          this.mandateproperties = this.mandateproperties.map(item => {
            return {
              ...item,
              isSelected: true
            };
          });
        }
      }
    });
  }

  filteredproject: any = '';
  //here we get the selected  mandate property
  getselectedprop(event) {
    this.selectedMandatePropId = event.target.value;
    if (this.mandateproperties) {
      let filteredproject = this.mandateproperties.filter((da) => da.property_idfk == event.target.value);
      if (filteredproject && filteredproject[0]) {
        this.filteredproject = filteredproject[0];
      }
    }

    let teamlead;
    if (this.role_type == 1) {
      teamlead = this.userid
    } else {
      teamlead = '';
    }
    if (this.assignteam == 'mandate' && this.assigntype == 'visit') {
      if (this.selectedMandatePropId) {
        this._mandateService.fetchmandateexecutuves(this.selectedMandatePropId, '', '', teamlead).subscribe(executives => {
          if (executives['status'] == 'True') {
            setTimeout(() => {
              this.mandateExecutives = executives['mandateexecutives'];
            }, 0)
          } else {
            this.mandateExecutives = [];
          }
        });
      } else {
        this.mandateExecutives = [];
      }
    } else {
      this._mandateService.fetchmandateexecutuves(this.selectedMandatePropId, '', '', teamlead).subscribe(executives => {
        if (executives['status'] == 'True') {
          setTimeout(() => {
            this.mandateExecutives = executives['mandateexecutives'];
            if (this.selectedMandatePropId == this.selectedSuggestedProp.propid) {
              this.mandateExecutives = this.mandateExecutives.filter(executive => {
                return !this.leadsDetailsInfo.some(rmids => rmids.RMID == executive.id);
              });
            }
          }, 0)
        } else {
          this.mandateExecutives = [];
        }
      });
    }

  }

  // executiveSelect(event) {
  //   this.selectedExecIds = [];
  //   if (this.assignteam == 'mandate') {
  //     if (this.roleid == '50003' || this.roleid == '50004' || this.assigntype == 'visit') {
  //       this.selectedEXEC.push(event.value);
  //     };
  //     this.selectedExecIds = this.selectedEXEC.map((exec) => exec.id);
  //   } else if (this.assignteam == 'retail') {
  //     this.selectedExecIds = this.selectedEXEC.map((exec) => exec.ExecId);
  //   }
  //   this.selectedExecIds = Array.from(new Set(this.selectedExecIds));
  // }

  //here we are assigniing the lead to the rmid.
  assignLeadNow() {
    if (this.assignteam == 'mandate') {
      //here its a array of  lead ids converting it to a single value  as comma seperated.
      let comma_separated_data;
      if (this.selectedExecIds) {
        comma_separated_data = this.selectedExecIds.join(',');
      }
      if (comma_separated_data == '' || comma_separated_data == null) {
        swal({
          title: 'Please Select The Executive!',
          text: 'Please try agin',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        });
        $('#rm_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Executives');
        return false;
      }
      else {
        this.filterLoader = true;
        $('#rm_dropdown').removeAttr("style");
      }

      let customersupport = comma_separated_data;
      let assignedleads = this.id;

      var param = {
        customersupport: comma_separated_data,
        assignedleads: this.id,
      }
      var propId = this.selectedMandatePropId;

      if (this.filteredproject && this.filteredproject.crm == '2') {
        this._mandateService.ranavleadassign(param, propId, '', this.userid, '').subscribe((success) => {
          this.filterLoader = false;
          this.status = success.status;
          if (this.status == "True") {
            swal({
              title: 'Assigned Successfully',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            })
            $('#leadAssignClose').click();
            $('#rm_dropdown').dropdown('clear');
            $('#project_dropdown').dropdown('clear');
            $('#property_dropdown').dropdown('clear');
            this.selectedExecIds = [];
            this.selectedEXEC = [];
            this.selectedMandatePropId = '';
            this.selectedMandateTeam = '';
            this.getcustomerview();
            $('.modal-backdrop').closest('div').remove();
            document.body.classList.remove('modal-open');
            let currentUrl = this.router.url.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl], { queryParams: currentQueryparams })
            })
          } else {
            swal({
              title: 'Authentication Failed!',
              text: 'Please try agin',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            })
          }
        }, (err) => {
          console.log("Connection Failed")
        });
      } else {
        this._mandateService.leadassign(param, propId, '', this.userid, '').subscribe((success) => {
          this.filterLoader = false;
          this.status = success.status;
          if (this.status == "True") {
            swal({
              title: 'Assigned Successfully',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            })
            $('#leadAssignClose').click();
            $('#rm_dropdown').dropdown('clear');
            $('#project_dropdown').dropdown('clear');
            $('#property_dropdown').dropdown('clear');
            this.selectedExecIds = [];
            this.selectedEXEC = [];
            this.selectedMandatePropId = '';
            this.selectedMandateTeam = '';
            this.getcustomerview();
            $('.modal-backdrop').closest('div').remove();
            document.body.classList.remove('modal-open');
            let currentUrl = this.router.url.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl], { queryParams: currentQueryparams })
            })
          } else {
            swal({
              title: 'Authentication Failed!',
              text: 'Please try agin',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            })
          }
        }, (err) => {
          console.log("Connection Failed")
        });
      }
    } else if (this.assignteam == 'retail') {
      //here its a array of  lead ids converting it to a single value  as comma seperated.
      let comma_separated_data;
      if (this.selectedExecIds) {
        comma_separated_data = this.selectedExecIds.join(',');
      }

      if (comma_separated_data == '' || comma_separated_data == null) {
        swal({
          title: 'Please Select One Executive.',
          text: 'Please try agin',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        $('#rm_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Executives');
        return false;
      }
      else {
        this.filterLoader = true;
        $('#rm_dropdown').removeAttr("style");
      }
      var param = {
        customersupport: comma_separated_data,
        assignedleads: this.id,
      };

      this._retailservice.leadassign(param, '', this.userid, '').subscribe((success) => {
        this.status = success.status;
        this.filterLoader = false;
        if (this.status == "True") {
          swal({
            title: 'Assigned Successfully',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          $('#leadAssignClose').click();
          $('#rm_dropdown').dropdown('clear');
          $('#exec_designation').dropdown('clear');
          this.selectedExecIds = [];
          this.selectedEXEC = [];
          this.getcustomerview();
          $('.modal-backdrop').closest('div').remove();
          document.body.classList.remove('modal-open');
          let currentUrl = this.router.url.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl], { queryParams: currentQueryparams })
          })
        } else {
          swal({
            title: 'Authentication Failed!',
            text: 'Please try agin',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
        }
      }, (err) => {
        console.log("Connection Failed")
      });
    }
  }

  //here admin or cs executives we assign the lead to RM's.
  visitConvert() {
    let comma_separated_data;
    if (this.selectedExecIds) {
      comma_separated_data = this.selectedExecIds.join(', ');
    }

    if ((this.selectedMandatePropId == '' || this.selectedMandatePropId == null || this.selectedMandatePropId == undefined) && this.assignteam == 'mandate') {
      swal({
        title: 'Please Select the Property.',
        text: 'Please try again',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      $('#property_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Property');
      return false;
    } else {
      $('#property_dropdown').removeAttr("style");
    }

    if (comma_separated_data == '' || comma_separated_data == null || comma_separated_data == undefined) {
      swal({
        title: 'Please Select the Executive.',
        text: 'Please try again',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      $('#rm_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Executives');
      return false;
    } else {
      $('#rm_dropdown').removeAttr("style");
    }

    let dbclinet: string = '';
    if (this.assigntype == 'visit' && this.assignteam == 'mandate') {
      if (this.selectedMandatePropId == '28773') {
        dbclinet = '1';
      }
    }

    let crmtype;
    if (this.assignteam == 'mandate') {
      crmtype = '1';
    } else if (this.assignteam == 'retail') {
      crmtype = '2';
    }

    let param = {
      leadid: this.id,
      propid: this.selectedMandatePropId,
      fromexecutives: this.selectedExecId,
      toexecutives: comma_separated_data,
      loginid: this.userid,
      crmtype: crmtype,
      dbclinet: dbclinet
    };

    this.filterLoader = true;
    if (this.assignteam == 'mandate') {
      this._mandateService.visitAssign(param).subscribe((resp) => {
        this.filterLoader = false;
        if (resp.status == "True") {
          swal({
            title: 'Visit Assigned Successfully',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          $('#leadAssignClose').click();
          $('#rm_dropdown').dropdown('clear');
          $('#fixedprop_dropdown').dropdown('clear');
          $('#project_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          this.selectedExecIds = [];
          this.selectedEXEC = [];
          this.selectedMandatePropId = '';
          this.selectedMandateTeam = '';
          $('.modal-backdrop').closest('div').remove();
          document.body.classList.remove('modal-open');
          let currentUrl = this.router.url.split('?')[0];
          let currentQueryParams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl], { queryParams: currentQueryParams })
          })
        } else {
          swal({
            title: 'Authentication Failed!',
            text: 'Please try agin',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
        }
      }, (err) => {
        console.log("Connection Failed")
      })
    }
  }

  getselectedVisitprop(event) {
    this.selectedMandatePropId = event.value.property_idfk;
  }

  //here we self assign the to Cs account
  visitSelfAssignToCS() {
    if ((this.selectedMandatePropId == '' || this.selectedMandatePropId == null || this.selectedMandatePropId == undefined) && this.assignteam == 'mandate') {
      swal({
        title: 'Please Select the Property.',
        text: 'Please try again',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      $('#property_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Property');
      return false;
    } else {
      $('#property_dropdown').removeAttr("style");
    }

    let param = {
      leadid: this.id,
      propid: this.selectedMandatePropId,
      execid: this.userid
    };

    this.filterLoader = true;
    this._mandateService.visitSelfAssign(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == "True") {
        swal({
          title: 'Visit Assigned Successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        $('#leadvisitAssignClose').click();
        this.selectedExecIds = [];
        this.selectedEXEC = [];
        this.selectedMandatePropId = '';
        this.selectedMandateTeam = '';
        setTimeout(() => {
          $('.modal-backdrop').closest('div').remove();
          document.body.classList.remove('modal-open');
          let currentUrl = this.router.url.split('?')[0];
          let currentQueryParams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl], { queryParams: currentQueryParams })
          })
        }, 0)
      } else {
        swal({
          title: 'Authentication Failed!',
          text: 'Please try agin',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    })
  }

  //here we can revert to the previous stage from junk
  revertStage() {
    swal({
      title: `Do you want to Revert the lead for ${this.assignedrm[0].customer_assign_name}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value == true) {
        let param = {
          leadid: this.id,
          propid: this.selectedSuggestedProp.propid,
          executid: this.selectedExecId
        }
        this._mandateService.revertBackToPreStage(param).subscribe((resposne) => {
          if (resposne.status == 'True') {
            this.filterLoader = true;
            $('.modal-backdrop').closest('div').remove();
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
            });
          }
        })
      }
    });
  }

  editNow(leadId, execid, propid, closeid) {
    if ($("#unit").val() == "") {
      swal({
        title: 'Units Not Selected',
        text: 'Select any Unit for ',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    } else if ($("#unit_number").val().trim() == "") {
      $("#unit_number").val('')
      $("#unit_number").focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Number');
      return false;
    } else if ($("#dimension").val().trim() == "" || !/^[0-9]+$/.test($("#dimension").val())) {
      $("#dimension").val('');
      $("#dimension").focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');
      return false;
    } else if ($("#rate_per_sqft").val().trim() == "" || !/^[0-9]+$/.test($("#rate_per_sqft").val())) {
      $("#rate_per_sqft").val('');
      $("#rate_per_sqft").focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
      return false;
    } else if ($("#customFile").val() == "") {
      swal({
        title: 'No Files Uploaded',
        text: 'Upload atleast one file for ',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    }
    else {
      $("#unit_number").removeAttr("style");
      $("#dimension").removeAttr("style");
      $("#rate_per_sqft").removeAttr("style");
      this.filterLoader = true;
      var unitsselected = $("#unit").val();
      var unitnumbers = $("#unit_number").val();
      var dimensions = $("#dimension").val();
      var rpsft = $("#rate_per_sqft").val();
      this.filterLoader = true;
      var closedate = this.requestedunits[0].closed_date;
      var closetime = this.requestedunits[0].closed_time;
      var textarearemarks = this.requestedunits[0].suggested[0].remarks;
      this.autoremarks = "The Deal Closed has been edited successfully.";
      var leadhistparam = {
        leadid: this.id,
        closedate: closedate,
        closetime: closetime,
        leadstage: "Edit Closed Lead",
        stagestatus: '0',
        textarearemarks: textarearemarks,
        userid: this.userid,
        assignid: this.selectedExecId,
        property: propid,
        bhk: unitsselected,
        bhkunit: unitnumbers,
        dimension: dimensions,
        ratepersft: rpsft,
        autoremarks: this.autoremarks,
        closedleadID: closeid,
        feedbackid: this.feedbackId
      }

      this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this.filterLoader = false;
          swal({
            title: 'Deal Closed Successfully',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        } else if (this.status == "Duplicate Request") {
          this.filterLoader = false;
          swal({
            title: 'Already got the request for this same Unit number',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      });
    }
  }

  //FIXED PLAN CODE
  selectedplan(plantype) {
    this.selectedPlanType = plantype;
    setTimeout(() => {
      this.scriptfunctions();
    }, 0)
    if (this.selectedPlanType == 'weekend' || this.selectedPlanType == 'weekdays') {
      if (this.assignedrm && this.assignedrm[0].leadstage == "USV") {
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
        // },0);
      } else if (this.assignedrm && this.assignedrm[0].leadstage == "RSV" && this.assignedrm[0].suggestedprop) {
        // setTimeout(()=>{
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
        // },0);
      } else if (this.assignedrm && this.assignedrm[0].leadstage == "Final Negotiation" && this.assignedrm[0].suggestedprop) {
        // setTimeout(()=>{
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
        // },0);
      }
    }
    // $('#visitPlandate').val('');
    // $('#visitPlantime').val('');
    setTimeout(() => {
      this.checkWeekDay();
    }, 0)
  }

  checkstage() {
    if (this.assignedrm && this.assignedrm[0].leadstage == 'Fresh' && this.assignedrm[0].followupreason == '8') {
      swal({
        title: 'Please Fix the USV..!',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
    }
    if (this.selectedPlanType == 'weekend' || this.selectedPlanType == 'weekdays') {
      let listofProperties: any = [];
      if (this.assignedrm && this.assignedrm[0].leadstage == "USV" && this.assignedrm[0].suggestedprop) {
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
      } else if (this.assignedrm && this.assignedrm[0].leadstage == "RSV" && this.assignedrm[0].suggestedprop) {
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
      } else if (this.assignedrm && this.assignedrm[0].leadstage == "Final Negotiation" && this.assignedrm[0].suggestedprop) {
        this.visitPlanNextDate = this.selectedSuggestedProp.nextdate;
        this.visitPlanNextTime = this.selectedSuggestedProp.nexttime;
      }
    }
    this.checkWeekDay();
    setTimeout(() => {
      this.scriptfunctions();
    }, 0)
  }

  ngAfterViewChecked() {
    if (!this.isCountdownInitialized) {
      this.isCountdownInitialized = true;
      this.scriptfunctions();
    }
  }

  scriptfunctions() {
    // Initialize the calendar for visitedcalendardate
    let disabledType: any;
    if (this.selectedPlanType == 'weekend' || this.selectedPlanType == '') {
      disabledType = [1, 2, 3, 4, 5];
    } else if (this.selectedPlanType == 'weekdays') {
      disabledType = [0, 6];
    }

    $('#disableddaysofweek_calendar')
      .calendar({
        type: 'date',
        minDate: new Date(),
        formatter: {
          date: 'YYYY-MM-DD'
        },
        disabledDaysOfWeek: disabledType
      });

    // Initialize the time picker for calendartime
    var minDate = new Date();
    var maxDate = new Date();
    minDate.setHours(7);
    maxDate.setHours(20);

    $('.calendartime').calendar({
      type: 'time',
      disableMinute: true,
      minDate: minDate,
      maxDate: maxDate,
    });
  }

  editvisitPlan(type) {
    if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == '2') {
      this.selectedPlanType = 'weekend';
      setTimeout(() => {
        $('#visitPlandate').val(this.selectedSuggestedProp.actiondate);
        $('#visitPlantime').val(this.selectedSuggestedProp.actiontime);
      }, 100)
    } else if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == '1') {
      this.selectedPlanType = 'weekdays';
      setTimeout(() => {
        $('#visitPlandate').val(this.selectedSuggestedProp.actiondate);
        $('#visitPlantime').val(this.selectedSuggestedProp.actiontime);
      }, 100)
    } else if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == '0') {
      this.selectedPlanType = 'ytc';
    } else if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == null) {
      if (type == 'edit') {
        setTimeout(() => {
          $('#visitPlandate').val(this.selectedSuggestedProp.nextdate);
          $('#visitPlantime').val(this.selectedSuggestedProp.nexttime);
          this.scriptfunctions();
        }, 100)
      }
    }
    setTimeout(() => {
      this.scriptfunctions();
    }, 0)
    this.editplan = true;
  }

  confirmbtnClicked: boolean = false;
  confirmPlan() {
    this.confirmbtnClicked = true;
    setTimeout(() => {
      this.fixPlan();
    }, 0);
  }

  fixPlan() {
    if (this.selectedPlanType == "" || this.selectedPlanType == undefined || this.selectedPlanType == null) {
      swal({
        title: 'Please select the Visit Type',
        text: "Select the Visit Type",
        type: 'error',
        timer: 2000,
        showConfirmButton: true,
      })
      return false;
    }

    var nextdate;
    var nexttime;
    if (this.confirmbtnClicked == false) {
      if ($('#visitPlandate').val() == "") {
        $('#visitPlandate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      } else {
        // $('#visitPlandate').removeAttr("style");
        let date = new Date($('#visitPlandate').val());
        let day = date.getDay();
        let isWeekend = (day === 6 || day === 0);
        if (isWeekend) {
          if (this.selectedPlanType == 'weekend') {
            $('#visitPlandate').removeAttr("style");
          } else {
            swal({
              title: 'Please select the correct weekdays date',
              text: "Select the correct date",
              type: 'error',
              timer: 2000,
              showConfirmButton: false,
            })
            return false;
          }
        } else {
          if (this.selectedPlanType == 'weekdays') {
            $('#visitPlandate').removeAttr("style");
          } else {
            swal({
              title: 'Please select the correct weekend date',
              text: "Select the correct date",
              type: 'error',
              timer: 2000,
              showConfirmButton: false,
            })
            return false;
          }
        }
      }

      if ($('#visitPlantime').val() == "") {
        $('#visitPlantime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      } else {
        $('#visitPlantime').removeAttr("style");
      }
      var nextdate = $('#visitPlandate').val();
      var nexttime = $('#visitPlantime').val();
    } else {
      var nextdate = this.visitPlanNextDate;
      var nexttime = this.visitPlanNextTime;
    }

    let selectPlanid: any;
    if (this.selectedPlanType == 'weekend') {
      selectPlanid = 2
    } else if (this.selectedPlanType == 'weekdays') {
      selectPlanid = 1
    } else if (this.selectedPlanType == 'ytc') {
      selectPlanid = 0
    }
    this.filterLoader = true;
    if (this.activestagestatus[0].stage == 'USV') {

      var param = {
        leadid: this.id,
        nextdate: nextdate,
        nexttime: nexttime,
        suggestproperties: this.selectedSuggestedProp.propid,
        execid: this.userid,
        assignid: this.selectedExecId
      }
      this._mandateService.addselectedsuggestedproperties(param).subscribe((success) => {
        this.status = success.status;
        this._mandateService.getselectedsuggestproperties(this.id, this.userid, this.selectedExecId).subscribe(selectsuggested => {
          this.selectedpropertylists = selectsuggested['selectedlists'];
          this.selectedlists = selectsuggested;
          // Joining the object values as comma seperated when add the property for the history storing
          this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
          // Joining the object values as comma seperated when add the property for the history storing

          this.autoremarks = "Scheduled the USV for " + this.selectedproperty_commaseperated + " On " + nextdate + " " + nexttime;
          var leadusvhistparam = {
            leadid: this.id,
            closedate: nextdate,
            closetime: nexttime,
            leadstage: "USV",
            stagestatus: '1',
            textarearemarks: '',
            userid: this.userid,
            assignid: this.selectedExecId,
            autoremarks: this.autoremarks,
            property: this.selectedSuggestedProp.propid,
            feedbackid: this.feedbackId
          }
          this._mandateService.addleadhistory(leadusvhistparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              let params = {
                execid: this.selectedExecId,
                leadid: this.id,
                planid: selectPlanid,
                plandate: nextdate,
                plantime: nexttime,
                stage: this.assignedrm[0].leadstage,
                stagestatus: this.assignedrm[0].leadstatus,
                loginid: this.userid,
                propid: this.selectedSuggestedProp.propid
              }
              this._mandateService.updatemyplan(params).subscribe((response) => {
                this.filterLoader = false;
                if (response.status == 'True') {
                  swal({
                    title: 'Plan Confirmed',
                    text: 'Visit Plan added Successfully',
                    type: 'success',
                    timer: 2000,
                    showConfirmButton: false
                  }).then(() => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  });
                }
              })
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        });
      });
    } else if (this.activestagestatus[0].stage == 'RSV') {
      var param1 = {
        leadid: this.id,
        nextdate: nextdate,
        nexttime: nexttime,
        suggestproperties: this.selectedSuggestedProp.propid,
        execid: this.userid,
        assignid: this.selectedExecId,
      }
      this._mandateService.addrsvselected(param1).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          var param = {
            leadid: this.id,
            execid: this.userid,
            stage: "RSV",
            assignid: this.selectedExecId,
          }
          this._mandateService.rsvselectproperties(param).subscribe(selectsuggested => {
            this.selectedpropertylists = selectsuggested['selectedrsvlists'];
            // Joining the object values as comma seperated when remove the property for the history storing
            this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
            // Joining the object values as comma seperated when remove the property for the history storing

            this.autoremarks = " Scheduled the RSV for " + this.selectedproperty_commaseperated + " On " + nextdate + " " + nexttime;
            var leadrsvfixparam = {
              leadid: this.id,
              closedate: nextdate,
              closetime: nexttime,
              leadstage: "RSV",
              stagestatus: '1',
              textarearemarks: '',
              userid: this.userid,
              assignid: this.selectedExecId,
              autoremarks: this.autoremarks,
              property: this.selectedSuggestedProp.propid,
              feedbackid: this.feedbackId
            }
            this._mandateService.addleadhistory(leadrsvfixparam).subscribe((success) => {
              this.status = success.status;
              if (this.status == "True") {
                let params = {
                  execid: this.selectedExecId,
                  leadid: this.id,
                  planid: selectPlanid,
                  plandate: nextdate,
                  plantime: nexttime,
                  stage: this.assignedrm[0].leadstage,
                  stagestatus: this.assignedrm[0].leadstatus,
                  loginid: this.userid,
                  propid: this.selectedSuggestedProp.propid
                }
                this._mandateService.updatemyplan(params).subscribe((response) => {
                  this.filterLoader = false;
                  if (response.status == 'True') {
                    swal({
                      title: 'Plan Confirmed',
                      text: 'Visit Plan added Successfully',
                      type: 'success',
                      timer: 2000,
                      showConfirmButton: false
                    }).then(() => {
                      let currentUrl = this.router.url;
                      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                        this.router.navigate([currentUrl]);
                      });
                    });
                  }
                })
              }
            }, (err) => {
              console.log("Failed to Update");
            });
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })

    } else if (this.activestagestatus[0].stage == 'Final Negotiation') {
      var param3 = {
        leadid: this.id,
        nextdate: nextdate,
        nexttime: nexttime,
        suggestproperties: this.selectedSuggestedProp.propid,
        execid: this.userid,
        assignid: this.selectedExecId
      }
      this._mandateService.addnegoselected(param3).subscribe((success) => {
        this.status = success.status;
        this._mandateService.negoselectproperties(this.id, this.userid, this.selectedExecId, this.feedbackId).subscribe(selectsuggested => {
          this.selectedpropertylists = selectsuggested['selectednegolists'];
          this.selectedlists = selectsuggested;
          // Joining the object values as comma seperated when add the property for the history storing
          this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
          // Joining the object values as comma seperated when add the property for the history storing

          this.autoremarks = "Scheduled the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + nextdate + " " + nexttime;
          var leadnegofixparam = {
            leadid: this.id,
            closedate: nextdate,
            closetime: nexttime,
            leadstage: "Final Negotiation",
            stagestatus: '1',
            textarearemarks: '',
            userid: this.userid,
            assignid: this.selectedExecId,
            autoremarks: this.autoremarks,
            property: this.selectedSuggestedProp.propid,
            feedbackid: this.feedbackId
          }
          this._mandateService.addleadhistory(leadnegofixparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              let params = {
                execid: this.selectedExecId,
                leadid: this.id,
                planid: selectPlanid,
                plandate: nextdate,
                plantime: nexttime,
                stage: this.assignedrm[0].leadstage,
                stagestatus: this.assignedrm[0].leadstatus,
                loginid: this.userid,
                propid: this.selectedSuggestedProp.propid
              }
              this._mandateService.updatemyplan(params).subscribe((response) => {
                this.filterLoader = false;
                if (response.status == 'True') {
                  swal({
                    title: 'Plan Confirmed',
                    text: 'Visit Plan added Successfully',
                    type: 'success',
                    timer: 2000,
                    showConfirmButton: false
                  }).then(() => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  });
                }
              })
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        });
      }, (err) => {
        console.log("Failed to Update");
      })

    }
  }

  clearPlandata() {
    $('#visitPlandate').val('');
    $('#visitPlantime').val('');
    this.selectedPlanType = '';
  }

  checkWeekDay() {
    let date;
    if ($('#visitPlandate').val() == '' || $('#visitPlandate').val() == null || $('#visitPlandate').val() == undefined) {
      date = new Date(this.selectedSuggestedProp.actiondate)
    } else {
      date = new Date($('#visitPlandate').val());
    }

    let day = date.getDay();
    let isWeekend = (day === 6 || day === 0);
    if (isWeekend) {
      if (this.selectedPlanType == 'weekend') {
        if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == '2') {
          this.visitPlanDone = true;
        } else {
          this.visitPlanDone = false;
        }
        // this.visitPlanDone = false;
      } else {
        // this.visitPlanDone = true
        if (this.selectedPlanType == 'weekend') {
          this.visitPlanDone = false;
        }
        else {
          this.visitPlanDone = true;
        }
      }
    } else {
      if (this.selectedPlanType == 'weekdays') {
        if (this.selectedSuggestedProp && this.selectedSuggestedProp.weekplan == '1') {
          this.visitPlanDone = true;
        } else {
          this.visitPlanDone = false;
        }
        // this.visitPlanDone = false;
      } else {
        if (this.selectedPlanType == 'weekdays') {
          this.visitPlanDone = false;
        }
        else {
          this.visitPlanDone = true;
        }
        // this.visitPlanDone = true
      }
    }
  }

  //merge leads code.
  searchByName() {
    let userid
    if (localStorage.getItem('UserId') == '1') {
      userid = '';
    } else {
      userid = localStorage.getItem('UserId');
    }
    if (this.search_name.length >= 3) {
      this._sharedservice.search(this.search_name, '', '', '', '').subscribe((resp) => {
        this.clients = resp;
      })
    }
  }

  selectedMergeLead(lead) {
    this.selectedLead = lead;
    if (this.selectedLead != '' && this.selectedLead != undefined && this.selectedLead != null) {
      this.isSelectedLead = true;
      this.clients = [];
      this.search_name = '';
    }

    if (this.selectedLead) {
      let data = {
        name: this.selectedLead.customer_name,
        id: this.selectedLead.customer_IDPK,
      }
      this.primaryLeads.push(data);
    }
  }

  relationship(relation) {
    this.selectedRelation = relation;
  }

  primaryLeadSelection(leadid) {
    this.selectedPrimaryLead = leadid;
  }

  mergeLeads() {

    if (this.selectedRelation == '' || this.selectedRelation == undefined || this.selectedRelation == null) {
      swal({
        title: "Relation",
        text: 'Please select the Relationship',
        timer: 2000,
        showConfirmButton: false,
        type: 'error'
      })
      $('#relationship_dropdown').focus().css('border-color', 'red').attr('placeholder', 'Please Select the Relation')
      return false
    }

    if (this.selectedPrimaryLead == '' || this.selectedPrimaryLead == undefined || this.selectedPrimaryLead == null) {
      swal({
        title: "Primary Lead",
        text: 'Please select the Primary Lead',
        timer: 2000,
        showConfirmButton: false,
        type: 'error'
      })
      $('#primary_dropdown').focus().css('border-color', 'red').attr('placeholder', 'Please Select the Relation')
      return false
    }

    let param = {
      leadId: this.id,
      mergeLeadId: this.selectedLead.customer_IDPK,
      relation: this.selectedRelation,
      primaryid: this.selectedPrimaryLead
    };
    this._sharedservice.postMergeLeads(param).subscribe((resp) => {
      swal({
        title: 'Merge Lead',
        text: 'The Lead has been successfully Merged',
        showConfirmButton: false,
        timer: 2000,
        type: 'success'
      }).then(() => {
        $('.modal-backdrop').closest('div').remove();
        document.body.classList.remove('modal-open');
        let currentUrl = this.router.url;
        let pathWithoutQueryParams = currentUrl.split('?')[0];
        let currentQueryparams = this.route.snapshot.queryParams;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
        })
      })
    })
  }

  //  ASSIGN LEAD SECTION
  fetchmails(name, propid) {
    this.filterLoader = true;
    this.propertyid = propid;
    this._retailservice
      .getfetchmail(propid)
      .subscribe(mails => {
        this.filterLoader = false;
        this.mails = mails;
        this.buildernamereg = this.mails[0]['builderInfo_name'];
      });
    this.property = name;
  }

  fetchregistereddata(leadid, propid) {
    var param = {
      leadid: leadid,
      propid: propid
    }
    this._retailservice
      .fetchclientregistereddata(param)
      .subscribe(regdata => {
        this.clientregistereddata = regdata['registereddata'][0];
      })
  }

  clientregisteration() {
    if ($('#mailtoselect').val() == "") {
      $('.sendto').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      $('.sendto').removeAttr("style");
    }

    this.toselect = $('#mailtoselect').val();
    let mails = this.selectedCCMail.map((cc) => cc.builder_mail);
    if (this.selectedCCMail.length == 0) {
      this.ccselect = this.toselect;
    } else {
      this.ccselect = mails.join(',');
    }
    this.registrationremarks = $('#regremarks').val();
    this.filterLoader = true;
    var param = {
      leadid: this.id,
      propid: this.propertyid,
      customer: this.regname,
      customernum: this.regnumber,
      customermail: this.regmail,
      rmname: localStorage.getItem('Name'),
      rmmail: localStorage.getItem('Mail'),
      assignid: this.selectedExecId,
      builder: this.buildernamereg,
      property: this.property,
      sendto: this.toselect,
      sendcc: this.ccselect,
      remarks: this.registrationremarks
    }
    this._retailservice.clientregistration(param).subscribe((success) => {

      var status = success.status;
      var data = success.success;

      if (status == "1") {

        this.filterLoader = false;
        swal({
          title: "Mail Sent Successfully!",
          text: 'This Data registered on 30 Days before so Re-registered Successfully',
          icon: "success",
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          $('#mailtoselect').val("");
          $('#ccselect').val("");
          $('#regremarks').val("");
          document.body.classList.remove('modal-open');
          document.body.classList.remove('dimmable');
          $('#mailtoselect').dropdown('clear');
          $('#ccselect').dropdown('clear');
          $('.modal-backdrop').removeClass('fade');
          $('.modal-backdrop').removeClass('show');
          $('.modal-backdrop').removeClass('modal-backdrop');
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        });

      } else if (status == "0") {

        this.filterLoader = false;
        swal({
          title: "Mail Sent Successfully!",
          text: 'Registered Successfully',
          icon: "success",
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          $('#mailtoselect').val("");
          $('#ccselect').val("");
          $('#regremarks').val("");
          document.body.classList.remove('modal-open');
          document.body.classList.remove('dimmable');
          $('#mailtoselect').dropdown('clear');
          $('#ccselect').dropdown('clear');
          $('.modal-backdrop').removeClass('fade');
          $('.modal-backdrop').removeClass('show');
          $('.modal-backdrop').removeClass('modal-backdrop');
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        });

      } else {

        this.filterLoader = false;
        swal({
          title: 'Already Registered Data Found.!',
          text: data[0].registered_property + ' is registered by ' + data[0].registered_RM + ' on ' + data[0].registered_date + '. Please Unselect this Property If it is a group Submission.',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })

      }
    }, (err) => {
      console.log("Failed to Update");
    });
  }

  //register Now Process
  isDateOver30Days(dateString: string): boolean {
    // Parse the date string into a Date object
    const dateObject = new Date(dateString);

    // Get today's date and subtract 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Compare the parsed date with the 30-day threshold using getTime()
    return dateObject.getTime() < thirtyDaysAgo.getTime();
  }

  startTimer() {
    this.stopTimer();
    this.updateDuration();
    this.timerSub = Observable.interval(1000).subscribe(() => {
      this.updateDuration();
    });
  }

  stopTimer() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = null;
    }
  }

  updateDuration() {
    if (!this.callStartTime) {
      this.resetTimer();
      return;
    }

    const now = Date.now();
    let diff = now - this.callStartTime;
    if (diff < 0) diff = 0;

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    this.callDurationStr = `${this.pad(hours)}h:${this.pad(minutes)}m:${this.pad(seconds)}s`;
  }

  resetTimer() {
    this.callDurationStr = '00h:00m:00s';
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  triggerCall() {
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
    this.filterLoader = true;
    this.callStatus = 'Call Connected';
    const cleanedNumber = this.assignedrm[0].customer_number.startsWith('91') && this.assignedrm[0].customer_number.length > 10 ? this.assignedrm[0].customer_number.slice(2) : this.assignedrm[0].customer_number;
    let param = {
      execid: this.userid,
      number: cleanedNumber,
      leadid: this.id,
      starttime: formattedDateTime,
      modeofcall: 'Desktop-mandate',
      rmid: this.selectedExecId
    }
    this._sharedservice.postTriggerCall(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'success') {
        this._sharedservice.initiatedState('initiate_call');
        setTimeout(() => {
          this.getLiveCallsData();
        }, 500)
      } else {
        swal({
          title: 'Call Not Connected',
          html: `The call could not be completed to <br><stronsg>${this.assignedrm[0].customer_name}</strong> (${this.assignedrm[0].customer_number}) Please try again later.`,
          type: 'error',
          timer: 3000,
          showConfirmButton: false,
          showCancelButton: false
        });
      }
    });
  }

  addfollowupdata() {
    var followdate;
    var followtime;
    var followuptextarearemarks;

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    let todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = (new Date()).toLocaleTimeString([], options);
    let currenttime = timeString;

    followdate = todaysdateforcompare;
    followtime = currenttime;

    var leadid = this.id;
    var userid = localStorage.getItem('UserId');
    var username = localStorage.getItem('Name');

    let followsectiondata, followsectionname;
    if (this.callStatus == 'BUSY') {
      followsectiondata = 2;
      followsectionname = "RNR";
      followuptextarearemarks = `${this.assignedrm[0].customer_name} was busy`;
      this.autoremarks = "Status changed to RNR, because the client did not answer the call.";
    } else if (this.callStatus == 'Executive Busy') {
      followsectiondata = 100;
      followsectionname = "Executive Busy";
      followuptextarearemarks = `${username} was busy`;
      this.autoremarks = `did not pick the Call.`;
    }

    let stagestatus;
    if (this.currentstage !== 'Fresh') {
      if (this.activestagestatus && this.activestagestatus[0].stagestatus == '1') {
        stagestatus = "1";
      } else if (this.activestagestatus && this.activestagestatus[0].stagestatus == '2') {
        stagestatus = "2";
      } else if (this.activestagestatus && this.activestagestatus[0].stagestatus == '3') {
        stagestatus = "3";
      }
    } else {
      if (this.activestagestatus && this.activestagestatus[0].stagestatus == null) {
        stagestatus = '0';
      } else {
        stagestatus = this.activestagestatus[0].stagestatus;
      }
    }

    var followups = {
      leadid: leadid,
      actiondate: followdate,
      actiontime: followtime,
      leadstatus: this.currentstage,
      stagestatus: stagestatus,
      followupsection: followsectiondata,
      followupremarks: followuptextarearemarks,
      userid: userid,
      assignid: this.selectedExecId,
      autoremarks: this.autoremarks,
      property: this.selectedSuggestedProp.propid,
      feedbackid: this.feedbackId
    }

    this.filterLoader = true;
    this._mandateService.addfollowuphistory(followups).subscribe((success) => {
      this.status = success.status;
      this.filterLoader = false;
      if (this.status == "True") {
        if (this.callStatus == 'Executive Busy') {
          // swal({
          //   imageUrl: '../../../../assets/images/missed-call.gif.gif',
          //   imageWidth: 150,
          //   imageHeight: 150,
          //   title: 'You Missed it',
          //   text: `You initiated a call but didn’t pick up.`,
          //   confirmButtonText: "Initiate Call",
          //   cancelButtonText: "Move to Inactive",
          //   showConfirmButton: true,
          //   showCancelButton: true,
          //   allowOutsideClick: false,
          //   showCloseButton: true,
          // })
          Swal.fire({
            title: 'You Missed it',
            text: 'You initiated a call but didn’t pick up.',
            imageUrl: '../../../../assets/images/missed-call.gif.gif',
            imageWidth: 150,
            imageHeight: 150,
            showConfirmButton: true,
            confirmButtonText: 'Initiate Call',
            showDenyButton: true,
            denyButtonText: "Move To Inactive",
            showCancelButton: false,
            // cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            showCloseButton: true
          })
            .then((result) => {
              if (result.isConfirmed) {
                this.triggerCall()
              } else if (result.isDenied) {
                let followupremarks = `${this.assignedrm[0].customer_name} was not reachable`;
                let autoremarks = "Status changed to Not Connected, as the call could not be established with the client.";
                var followups1 = {
                  leadid: leadid,
                  actiondate: followdate,
                  actiontime: followtime,
                  leadstatus: this.currentstage,
                  stagestatus: stagestatus,
                  followupsection: 4,
                  followupremarks: followupremarks,
                  userid: userid,
                  assignid: this.selectedExecId,
                  autoremarks: autoremarks,
                  property: this.selectedSuggestedProp.propid,
                  feedbackid: this.feedbackId
                }
                this.filterLoader = true;
                this._mandateService.addfollowuphistory(followups1).subscribe((success) => {
                  this.status = success.status;
                  this.filterLoader = false;
                  if (this.status == "True") {
                    let currentUrl = this.router.url;
                    let pathWithoutQueryParams = currentUrl.split('?')[0];
                    let currentQueryparams = this.route.snapshot.queryParams;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
                    });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Update Failed',
                      text: 'Something went wrong. Please try again.',
                      confirmButtonText: 'OK',
                      allowOutsideClick: false
                    });
                  }
                })
              } else {
                let currentUrl = this.router.url;
                let pathWithoutQueryParams = currentUrl.split('?')[0];
                let currentQueryparams = this.route.snapshot.queryParams;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
                });
              }
            }), (err) => {
              console.log("Failed to Update");
            }
        } else if (this.callStatus == 'BUSY') {
          swal({
            title: 'Follow-up Updated Successfully',
            text: "Client did not answer the call. A new reminder has been set as RNR",
            type: "success",
            showConfirmButton: true,
            allowOutsideClick: false
          }).then((val) => {
            if (val.value == true) {
              let currentUrl = this.router.url;
              let pathWithoutQueryParams = currentUrl.split('?')[0];
              let currentQueryparams = this.route.snapshot.queryParams;
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
              });
            }
          }), (err) => {
            console.log("Failed to Update");
          }
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Something went wrong. Please try again.',
          confirmButtonText: 'OK',
          allowOutsideClick: false
        });
      }
    });
  }

  // CUSTOMER-VIEW-INSIDE-MODAL
}

//   getDurationTime(time) {
//     let currentDate = new Date();
//     let hours = currentDate.getHours();
//     let minutes = currentDate.getMinutes();
//     let seconds = currentDate.getSeconds();
//     let formattedMinutes: string = String(minutes).padStart(2, '0');
//     let formattedSeconds: string = String(seconds).padStart(2, '0');
//     let currentTime = hours + ':' + formattedMinutes + ':' + formattedSeconds;
//     let timerDifference = getTimeDifference(time.split(' ')[1], currentTime);
//     const [hours1, minutes1, seconds1] = timerDifference.split(':');
//     return `${hours1}h:${minutes1}m:${seconds1}s`;
//   }

// }

// function getTimeDifference(startTime: string, endTime: string): string {
//   const start = new Date(`1970-01-01T${startTime}Z`);
//   const end = new Date(`1970-01-01T${endTime}Z`);
//   const differenceInMs = end.getTime() - start.getTime();
//   const hours = Math.floor((differenceInMs % 86400000) / 3600000);
//   const minutes = Math.floor((differenceInMs % 3600000) / 60000);
//   const seconds = Math.floor((differenceInMs % 60000) / 1000);
//   return `${Math.abs(hours)}:${Math.abs(minutes)}:${Math.abs(seconds)}`;
// }
