import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sharedservice } from '../../shared.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { passwordchange } from './header';
import { catchError, debounceTime, distinctUntilChanged, filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { CdTimerComponent } from 'angular-cd-timer';
import { EchoService } from '../../echo.service';
import 'rxjs/add/operator/shareReplay';

declare var $: any;
declare var swal: any;
declare var base_version;
export const version = base_version;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  items: any;
  searchs: any;
  public userDetails: any;
  adminview: boolean = false;
  MandateRMTLview: boolean = false;
  MandateRMExecutiveview: boolean = false;
  MandateCSTLview: boolean = false;
  MandateCSExecutiveview: boolean = false;
  RetailRMTLview: boolean = false;
  RetailRMEXview: boolean = false;
  CSTLview: boolean = false;
  CSEXview: boolean = false;
  MandateRMEXview: boolean = false;
  builderexecview: boolean;
  propertyName: any;
  timerInfo = '';
  timerstarted: boolean = false;
  totalBreakTime: any;
  public clients: any;
  private searchTerms = new Subject<string>();
  private mandatesearchTerms = new Subject<string>();
  private retailsearchTerms = new Subject<string>();
  public customer_name = '';
  public name = '';
  public flag: boolean;
  userid: any;
  isAdminDashboardActive: boolean = false;
  isMandateDashboardActive: boolean = false;
  isDashboardActive: boolean = false;
  propertyType: string;
  crmtype: any;
  startTime: number = 0;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  previousMonthDateForCompare: any;
  planfromdate: any;
  plantodate: any;
  customer_id: any;
  password = new passwordchange();
  status: any;
  dataRefresher: any;
  @ViewChild('showBarsIcon') showBarsIcon: ElementRef;
  @ViewChild('showCloseIcon') showCloseIcon: ElementRef
  @ViewChild('pageWrapper') pageWrapper: ElementRef;
  @ViewChild('sidebarWrapper') sidebarWrapper: ElementRef;
  @ViewChild('basicTimer') basicTimer: CdTimerComponent;
  selectedLead: string = '';
  selectedDash: string = '';
  commonHeader: boolean = false
  selectedTypeLead: any;
  loggedName: any;
  routerUrl: any;
  isHover: boolean = false;
  svcount: number = 0;
  svfixcount: number = 0;
  rmid: any;
  normalcallcounts: number = 0;
  junkleadsCounts: number = 0;
  junkvisitsCounts: number = 0;
  usvCounts: number = 0;
  rsvCounts: number = 0;
  rsvfixCounts: number = 0;
  fnCounts: number = 0;
  fnfixCounts: number = 0;
  bookingRequestCounts: number = 0;
  bookingRejCounts: number = 0;
  bookedCounts: number = 0;
  unquieleadcounts: number = 0;
  Totalleadcounts: number = 0;
  followupleadcounts: number = 0;
  inactivecounts: number = 0;
  roleid: any;
  isDrawerOpen = false;
  isUnread: boolean = true;
  isRead: boolean = false;
  departId: any;
  propertyId: any;
  propertyIdArray: any;
  ranavPropIdCheck: any = '';
  sitaraPropIdCheck: any = '';
  samskruthiPropIdCheck: any = '';
  swaraPropIdCheck: any = '';
  revivaPropIdCheck: any = '';
  idInAssignedLeads: any;
  messageCount: number = 0;
  whatsappMessageCount: number = 0;
  private chatSelectionIndication: Subscription;
  private whatsappChatSelectionIndication: Subscription;
  private initiatedCallIndication: Subscription;
  selectedchat: any;
  isShowChatTypesBtn: boolean = false;
  liveCallData: any;
  isDisaplyCall: boolean = false;
  isModalOpen: boolean = false;
  calledLead: any;
  assignedRm: any;
  callStatus: any;
  isOnCallModalOpen: boolean = false;
  private onCallSubscription: Subscription;
  isRetailModalOpen: boolean = false;
  isOnCallMandateModalOpen: boolean = false;
  isPointerEvents: boolean = false;
  showCloseButton: boolean = false;
  showCloseConnectingButton: boolean = false;
  closeButtonTimeoutSet = false;
  filterLoader: boolean = false;
  private liveCallTrigger$ = new Subject<void>();
  private echoServiceSub: Subscription;
  missedCallsCount: number = 0;
  callDirection: any;
  role_type: any;
  dashboardUrl: any;
  selectedCustomOption: string = 'Custom';
  selectedDateRange: any;
  selectedAssignSec: any;
  executiveListData: any;
  copyOfExecutiveListData: any;
  switch_account_name: string = '';
  confirmationSwitch: boolean = false;
  selectedSwitchAccount: any;
  mainAccountData: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _sharedservice: sharedservice,
    private renderer: Renderer2,
    private echoService: EchoService,
  ) {
    setTimeout(() => {
      $(function ($) {
        $(".sidebar-dropdown > a").click(function () {
          $(".sidebar-submenu").slideUp(200);
          if (
            $(this)
              .parent()
              .hasClass("active")
          ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
              .parent()
              .removeClass("active");
          } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
              .next(".sidebar-submenu")
              .slideDown(200);
            $(this)
              .parent()
              .addClass("active");
          }
        });

        $("#close-sidebar").click(function () {
          $(".page-wrapper").removeClass("toggled");
        });
        $("#show-sidebar").click(function () {
          $(".page-wrapper").addClass("toggled");
        });

      });
    }, 1000);


    const data = localStorage.getItem("Name");
    this.userDetails = data;
    this.adminview = false;
    this.MandateRMTLview = false;
    this.RetailRMTLview = false;
    this.RetailRMEXview = false;
    this.MandateRMExecutiveview = false;
    this.CSTLview = false;
    this.CSEXview = false;
  }

  onMouseEnter() {
    this.isHover = true;
    this._sharedservice.setHoverState(true);
    localStorage.setItem('hover', JSON.stringify(this.isHover));
  }

  onMouseLeave() {
    this.isHover = false;
    this._sharedservice.setHoverState(false);
    localStorage.setItem('hover', JSON.stringify(this.isHover));
  }

  onClickSidebarMenu() {
    // if(this.echoServiceSub){
    //   this.echoServiceSub.unsubscribe();
    // }
    this.onMouseLeave();

    //     setTimeout(() => {
    //   this.echoServiceSub =this.echoServiceSub = this.echoService.listenToDatabaseChanges((message) => {
    //     // Your message handler code here

    //     // ... rest of your code
    //   });
    // }, 5000);
  }

  backToWelcome() {
    $('.modal-backdrop').closest('div').remove();
    this.router.navigate(['/login']);
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  logout() {
    let param = {
      sessionid: localStorage.getItem('SessionId'),
      id: localStorage.getItem('UserId')
    }
    this._sharedservice.logout(param).subscribe((resp) => {
      if (resp.status == 'True') {
        localStorage.clear();
        setTimeout(() => this.backToWelcome(), 100);
        this.echoService.disconnectSocket();
      }
    })
  }

  initInterval() {
    setInterval(() => {
      const storedTime = localStorage.getItem('callStartTime');
      if (storedTime) {
        const parsedTime = parseInt(storedTime, 10);
        this.scheduleCloseButton(parsedTime);
        this.scheduleConnectingCloseButton(parsedTime);
      }
    }, 10000);
  }

  ngOnInit() {
    if (localStorage.getItem('UserId') == '1') {
      this.userid = '';
    } else {
      this.userid = localStorage.getItem('UserId');
    }
    this.mainAccountData = localStorage.getItem('mainAccount');
    this.loggedName = localStorage.getItem('Name');
    this.departId = localStorage.getItem('Department');
    this.propertyId = localStorage.getItem('property_ID');
    this.role_type = localStorage.getItem('role_type');
    if (this.propertyId) {
      this.propertyIdArray = this.propertyId.split(',');
      this.ranavPropIdCheck = this.propertyIdArray.find((id) => { return id == '28773' });
      this.sitaraPropIdCheck = this.propertyIdArray.find((id) => { return id == '16793' });
      this.samskruthiPropIdCheck = this.propertyIdArray.find((id) => { return id == '1830' });
      this.swaraPropIdCheck = this.propertyIdArray.find((id) => { return id == '82668' });
      this.revivaPropIdCheck = this.propertyIdArray.find((id) => { return id == '80459' });
    }

    this.liveCallTrigger$.pipe(debounceTime(1000)).subscribe(() => {
      if (this.isApiCallPending == false) {
        this.getLiveCallsData();
      }
    });

    this.onCallSubscription = this._sharedservice.callModalSelect$.subscribe((resp) => {
      if (resp == 'oncall') {
        // this.getLiveCallsData();
        this.liveCallTrigger$.next();
      }
    })

    this.getversion();
    this.initInterval();
    this.geAllDashCounts();

    const callStartStr = localStorage.getItem('callStartTime');
    if (callStartStr) {
      const callStart = parseInt(callStartStr, 10);
      this.scheduleCloseButton(callStart);
      this.scheduleConnectingCloseButton(callStart);
    }

    // this.triggerHourlyAPIMethod();

    this.route.queryParams.subscribe(params => {
      this.idInAssignedLeads = params['id'];
      if (params['dashtype'] === 'dashboard') {
        this.isDashboardActive = true;
      }
      // if ((params['htype'] === 'mandate' || params['htype'] === 'retail')) {
      //   this.commonHeader = true;
      //   // this.selectedLeadtype(params['htype']);
      // } else {
      //   let currentUrl = this.router.url;
      //   let pathWithoutQueryParams = currentUrl.split('?')[0];
      //   let currentQueryparams = this.route.snapshot.queryParams;
      //   if (pathWithoutQueryParams == '/retail-dashboard') {
      //     this.router.navigate(['/retail-dashboard'],
      //       {
      //         queryParams: {
      //           allvisits: 1,
      //           from: '',
      //           to: '',
      //           dashtype: 'dashboard',
      //           htype: 'retail',
      //         },
      //         // queryParamsHandling:'merge'
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-leadassign' && (currentQueryparams.todaysvisits == '1' || currentQueryparams.todayvisited == '1' || currentQueryparams.upcomingvisits == '1')) {
      //     this.router.navigate(['/retail-leadassign'],
      //       {
      //         queryParams: {
      //           todaysvisits: 1,
      //           htype: 'retail'
      //         },
      //         // queryParamsHandling:'merge'
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-leadassign' && (currentQueryparams.todaysfollowups == '1' || currentQueryparams.upcomingfollowups == '1')) {
      //     this.router.navigate(['/retail-leadassign'],
      //       {
      //         queryParams: {
      //           todaysfollowups: 1,
      //           htype: 'retail'
      //         },
      //         // queryParamsHandling:'merge'
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-lead-stages' && (currentQueryparams.pending == '1' || currentQueryparams.followups == '1' || currentQueryparams.nc == '1' || currentQueryparams.inactive == '1' || currentQueryparams.junkleads == '1')) {
      //     this.router.navigate(['/retail-lead-stages'],
      //       {
      //         queryParams: {
      //           pending: '1',
      //           from: '',
      //           to: '',
      //           type: 'leads',
      //           htype: 'retail'
      //         },
      //         // queryParamsHandling:'merge'
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-lead-stages' && (currentQueryparams.usv == '1' || currentQueryparams.usv == '1' || currentQueryparams.sv == '1' || currentQueryparams.rsv == '1' || currentQueryparams.fn == '1' || currentQueryparams.junkvisits == '1')) {
      //     this.router.navigate(['/retail-lead-stages'],
      //       {
      //         queryParams: {
      //           usv: 1,
      //           stagestatus: '3',
      //           type: 'visits',
      //           visitedfrom: '',
      //           visitedto: '',
      //           htype: 'retail'
      //         },
      //         // queryParamsHandling:'merge'
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-lead-stages' && (currentQueryparams.brs == '1' || currentQueryparams.brr == '1' || currentQueryparams.bkd == '1')) {
      //     this.router.navigate(['/retail-lead-stages'],
      //       {
      //         queryParams: {
      //           brs: 1,
      //           from: '',
      //           to: '',
      //           type: 'bookings',
      //           htype: 'retail'
      //         },
      //         // queryParamsHandling:'merge'
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-myoverdues') {
      //     this.router.navigate(['/retail-myoverdues'],
      //       {
      //         queryParams: {
      //           followupsoverdues: 1,
      //           from: '',
      //           to: '',
      //           htype: 'retail'
      //         },
      //         // queryParamsHandling:'merge'
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-plans') {
      //     this.router.navigate(['/retail-plans'],
      //       {
      //         queryParams: {
      //           plan: 'weekend',
      //           type: 'usv',
      //           from: this.planfromdate,
      //           to: this.plantodate,
      //           htype: 'retail'
      //         }
      //       })
      //   } else if (pathWithoutQueryParams == '/myretailreports') {
      //     this.router.navigate(['/myretailreports'],
      //       {
      //         queryParams: {
      //           followups: 1,
      //           datetype: 'today',
      //           htype: 'retail'
      //         }
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-inactive-junk') {
      //     this.router.navigate(['/retail-inactive-junk'],
      //       {
      //         queryParams: {
      //           type: 'inactive',
      //           inactive1: 1,
      //           from: '',
      //           to: '',
      //           htype: 'retail'
      //         }
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-pricing-list') {
      //     this.router.navigate(['/retail-pricing-list'],
      //       {
      //         queryParams: {
      //           htype: 'retail'
      //         }
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-feedback') {
      //     this.router.navigate(['/retail-feedback'],
      //       {
      //         queryParams: {
      //           pending: 1,
      //           from: '',
      //           to: '',
      //           htype: 'retail'
      //         }
      //       })
      //   } else if (pathWithoutQueryParams == '/retail-junk-dash') {
      //     this.router.navigate(['/retail-junk-dash'],
      //       {
      //         queryParams: {
      //           allvisits: 1,
      //           from: '',
      //           to: '',
      //           dashtype: 'dashboard',
      //           htype: 'retail'
      //         }
      //       })
      //   }
      // }
    });

    this.route.url.subscribe((da) => {
      if (da.length > 0) {
        if (da[0].path == "dashboard" || da[0].path == "executive-dashboard" || da[0].path == "retail-dashboard" || da[0].path == "mandate-dashboard" || da[0].path == "executive-report" || da[0].path == "mandate-overdues-dashboard") {
          this.isDashboardActive = true;
        }
      }
    })

    this.getcustomer();

    // if (localStorage.getItem('Department') == '10004') {
    //   // this.MandateRMEXview = true;
    //   if (localStorage.getItem('Role') == '50009') {
    //     this.RetailRMTLview = true;
    //     this.propertyType = 'cp';
    //     //this.getretailcustomer();
    //   } else if (localStorage.getItem('Role') == '50010') {
    //     this.propertyType = 'cp';
    //     this.RetailRMEXview = true;
    //     //this.getretailcustomer();
    //   } else if (localStorage.getItem('Role') == '50003') {
    //     this.CSTLview = true;
    //     // this.getretailcustomer();
    //   } else if (localStorage.getItem('Role') == '50004') {
    //     this.CSEXview = true;
    //     // this.getretailcustomer();
    //   }

    // } else {
    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    } else if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
      this.propertyType = 'property';
      this.roleid = localStorage.getItem('Role');
      this.adminview = true;
    } else if (localStorage.getItem('Role') == '50001') {
      this.MandateRMTLview = true;
      this.propertyType = 'cp';
      //this.getmandatecustomer();
    } else if (localStorage.getItem('Role') == '50002') {
      this.propertyType = 'cp';
      this.MandateRMExecutiveview = true;
      //this.getmandatecustomer();
    } else if (localStorage.getItem('Role') == '50013') {
      this.propertyType = 'cp';
      this.MandateCSTLview = true;
    } else if (localStorage.getItem('Role') == '50014') {
      this.propertyType = 'cp';
      this.MandateCSExecutiveview = true;
    } else if (localStorage.getItem('Role') == '50011') {
      this.builderexecview = true;
    }

    // }

    let currentUrl = this.router.url;
    let pathWithoutQueryParams = currentUrl.split('/')[1];
    let pathWithoutQueryParams1 = currentUrl.split('?')[0];
    let htype = currentUrl.split('/')[5];
    this.selectedLead = htype;



    if (pathWithoutQueryParams1 == '/team-chat') {
      this.isShowChatTypesBtn = true;
      this.selectedchat = 'in';
    } else if (pathWithoutQueryParams1 == '/client-chat') {
      this.isShowChatTypesBtn = true;
      this.selectedchat = 'wc';
    }

    if (pathWithoutQueryParams1 == '/mandate-dashboard' || pathWithoutQueryParams1 == '/all-calls') {
      this.commonHeader = true;
      this.routerUrl = pathWithoutQueryParams1;
      let dtype;
      this.route.queryParams.subscribe(params => {
        this.dashboardUrl = params;
        dtype = params['type'];
        if (pathWithoutQueryParams1 == '/mandate-dashboard' && dtype == 'leads') {
          this.selectedDash = 'leads';
        } else if (pathWithoutQueryParams1 == '/mandate-dashboard' && dtype == 'visits') {
          this.selectedDash = 'visits';
        } else if (pathWithoutQueryParams1 == '/all-calls') {
          this.selectedDash = 'calldash';
        }
      });
    }

    if ((pathWithoutQueryParams == 'assigned-leads-details' || pathWithoutQueryParams == 'mandate-customers' || pathWithoutQueryParams == '/mandate-feedback' || pathWithoutQueryParams == '/retail-feedback') && (this.CSEXview || this.CSTLview)) {
      this.commonHeader = true;
      this.routerUrl = pathWithoutQueryParams;
    }

    if ((pathWithoutQueryParams1 == '/mandate-feedback' || pathWithoutQueryParams1 == '/retail-feedback') && (this.CSEXview || this.CSTLview)) {
      this.commonHeader = true;
      this.routerUrl = pathWithoutQueryParams1;
    }

    if ((pathWithoutQueryParams1 == '/retail-lead-stages' || pathWithoutQueryParams1 == '/mandate-lead-stages') && (this.CSEXview || this.CSTLview)) {
      this.commonHeader = true;
      this.routerUrl = pathWithoutQueryParams1;
    }

    if (pathWithoutQueryParams1 == '/team-chat' || pathWithoutQueryParams1 == '/client-chat') {
      this.routerUrl = pathWithoutQueryParams1;
    }

    this.propertyName = 'GR Sitara';
    if (this.showCloseIcon && this.showCloseIcon.nativeElement) {
      this.renderer.setStyle(this.showCloseIcon.nativeElement, 'display', 'none');
    }

    if (this.MandateRMExecutiveview == true || this.MandateRMTLview == true) {
      this.crmtype = 1;
    } else if (this.RetailRMEXview == true || this.RetailRMTLview == true || this.CSTLview == true || this.CSEXview == true) {
      this.crmtype = 2;
    }

    this.getChatUnreadCounts().subscribe((resp) => {
      if (resp.status == 'True') {
        this.messageCount = resp.details[0].unreadmsgcount;
      }
    });

    // this.getWhatsappUnreadCounts().subscribe((resp) => {
    //   if (resp.status == 'True') {
    //     this.whatsappMessageCount = resp.details[0].unreadmsgcount;
    //   }
    // });

    this.chatSelectionIndication = this._sharedservice.indicationForChatSelect$.pipe(
      filter(resp => resp == 'chatselected'), debounceTime(1000)).subscribe((resp) => {
        this.getChatUnreadCounts().subscribe((resp) => {
          if (resp.status == 'True') {
            this.messageCount = resp.details[0].unreadmsgcount;
          }
        });
      })

    // this.whatsappChatSelectionIndication = this._sharedservice.indicationForWhatsappChatSelect$.pipe(
    //   filter(resp => resp == 'chatselected'), debounceTime(500)).subscribe((resp) => {
    //     this.getWhatsappUnreadCounts().subscribe((resp) => {
    //       if (resp.status == 'True') {
    //         this.whatsappMessageCount = resp.details[0].unreadmsgcount;
    //       }
    //     });
    //   });

    // this.echoService.stopListeningToDatabaseChanges();

    //this code is to check whether  in which page we are (Team-chat).
    this.echoService.listenToDatabaseChanges((message) => {
      if (localStorage.getItem('UserId') == (message && message[0] && message[0].Receiver) || localStorage.getItem('UserId') == (message && message[0] && message[0].Sender)) {
        this._sharedservice.triggerUnreadCount();
        this.messageCount = this._sharedservice.unReadChatCount;
      }

      if (localStorage.getItem('UserId') == message.Executive && (message.Call_status_new == 'Call Disconnected' || message.Call_status_new == 'Ringing' || message.Call_status_new == 'Call Connected' || message.Call_status_new == 'Answered' || message.Call_status_new == 'Executive Busy' || message.Call_status_new == 'BUSY' || message.Direction == 'inbound')) {
        this.callStatus = message.Call_status_new;
        this.callDirection = message.Direction;
        if (message.Call_status_new == 'Call Connected') {
          this.isPointerEvents = true;
        } else {
          this.isPointerEvents = false;
        }

        if (message.Call_status_new == 'Call Disconnected') {
          localStorage.removeItem('callStartTime');
          this.showCloseButton = false;
          this.showCloseConnectingButton = false;
        }

        setTimeout(() => {
          if ((this.isOnCallMandateModalOpen == false) || (this.isOnCallModalOpen == false)) {
            // this.getLiveCallsData();
            this.liveCallTrigger$.next();
          }
        }, 500)
        return
      }

      // this._sharedservice.triggerWhatsappUnreadCount();
      // this.whatsappMessageCount = this._sharedservice.unReadWhatsappChatCount;

    });

    this.initiatedCallIndication = this._sharedservice.initiatedState$.subscribe((resp) => {
      if (resp == 'initiate_call') {
        this.getLiveCallsData();
      }
    })

    // this.getLiveCallsData();
    this.liveCallTrigger$.next();

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    //to get the previous month date of the present day date
    var previousMonthDate = new Date(this.currentdateforcompare);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    var prevMonth = (previousMonthDate.getMonth() + 1).toString().padStart(2, '0');
    var prevDay = previousMonthDate.getDate().toString().padStart(2, '0');
    this.previousMonthDateForCompare = previousMonthDate.getFullYear() + '-' + prevMonth + '-' + prevDay;
    //this code is for weekend plans to get the furture weekend plans
    const getUpcomingWeekendDates = () => {
      const currentDay = this.currentdateforcompare.getDay();
      let fromDate, toDate;
      if (currentDay === 6) {
        fromDate = new Date(this.currentdateforcompare);
        toDate = new Date(this.currentdateforcompare);
        toDate.setDate(this.currentdateforcompare.getDate() + 1);
      } else if (currentDay === 0) {  // Sunday
        fromDate = new Date(this.currentdateforcompare);
        fromDate.setDate(this.currentdateforcompare.getDate() - 1);
        toDate = new Date(this.currentdateforcompare);
      } else {
        const diffToSaturday = 6 - currentDay;
        const diffToSunday = diffToSaturday + 1;

        fromDate = new Date(this.currentdateforcompare);
        fromDate.setDate(this.currentdateforcompare.getDate() + diffToSaturday);

        toDate = new Date(this.currentdateforcompare);
        toDate.setDate(this.currentdateforcompare.getDate() + diffToSunday);
      }
      const fromDateFormatted = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1).toString().padStart(2, "0") + "-" + fromDate.getDate().toString().padStart(2, "0");
      const toDateFormatted = toDate.getFullYear() + "-" + (toDate.getMonth() + 1).toString().padStart(2, "0") + "-" + toDate.getDate().toString().padStart(2, "0");
      return { from: fromDateFormatted, to: toDateFormatted };
    };
    const weekendDates = getUpcomingWeekendDates();
    this.planfromdate = weekendDates.from;
    this.plantodate = weekendDates.to;

  }

  ngAfterViewInit() {
    // Hide sidebar and show bars icon on page load if screen size is less than or equal to 1000
    // if (window.innerWidth <= 1000) {
    //   this.renderer.setStyle(this.sidebarWrapper.nativeElement, 'display', 'none');
    //   this.renderer.setStyle(this.showBarsIcon.nativeElement, 'display', 'block');
    //   this.renderer.setStyle(this.showCloseIcon.nativeElement, 'display', 'block');
    // }

    // if (window.innerWidth > 1000) {
    //   this.renderer.setStyle(this.sidebarWrapper.nativeElement, 'display', 'block');
    //   this.renderer.setStyle(this.showBarsIcon.nativeElement, 'display', 'none');
    //   this.renderer.setStyle(this.showCloseIcon.nativeElement, 'display', 'none')
    // }
    // // on click on bars icon the side bar will paear and again on click it disappers
    // this.renderer.listen(this.showBarsIcon.nativeElement, 'click', () => {
    //   this.toggleSidebar();
    // });

    // this.renderer.listen(this.showCloseIcon.nativeElement, 'click', () => {
    //   this.toggleSidebar();
    // });

    // // here if the window size is <= 1000 bars icon is appeared and side is disappeared
    // //in same way if the screen is > 1000 bars is disappeared and side bar is appeared
    // this.renderer.listen(window, 'resize', () => {
    //   if (window.innerWidth <= 1000) {
    //     this.renderer.setStyle(this.sidebarWrapper.nativeElement, 'display', 'none');
    //     this.renderer.setStyle(this.showBarsIcon.nativeElement, 'display', 'block');
    //     this.renderer.setStyle(this.showCloseIcon.nativeElement, 'display', 'block');
    //   } else {
    //     //after clicking the close in the sid bar and resize the screen with this condition the side bar display 
    //     const element = document.querySelector('.page-wrapper');
    //     if (!(element.classList.contains('toggled'))) {
    //       this.sidebarWrapper.nativeElement.classList.toggle('show-sidebar');
    //       this.pageWrapper.nativeElement.classList.toggle('toggled', this.sidebarWrapper.nativeElement.classList.contains('show-sidebar'));
    //       this.renderer.setStyle(this.sidebarWrapper.nativeElement, 'display', 'block');
    //     }

    //     this.renderer.setStyle(this.sidebarWrapper.nativeElement, 'display', 'block');
    //     this.renderer.setStyle(this.showBarsIcon.nativeElement, 'display', 'none');
    //     this.renderer.setStyle(this.showCloseIcon.nativeElement, 'display', 'none');
    //   }
    // });
  }

  ngOnDestroy() {
    if (this.chatSelectionIndication) {
      this.chatSelectionIndication.unsubscribe();
    }

    if (this.whatsappChatSelectionIndication) {
      this.whatsappChatSelectionIndication.unsubscribe();
    }

    if (this.renderer) {
      this.renderer.removeStyle(document.documentElement, 'overflow');
    }

    this.isPointerEvents = false;
  }

  geAllDashCounts() {
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    let param = {
      loginid: localStorage.getItem('UserId'),
      from: this.todaysdateforcompare,
      to: this.todaysdateforcompare,
      // execid: this.userid
    }

    this._sharedservice.getAllCallsCounts(param).subscribe((resp) => {
      if (resp.status == 'success') {
        this.missedCallsCount = resp.success[0].missed;
      } else {
        this.missedCallsCount = 0;
      }
    })
  }

  isApiCallPending = false;
  getLiveCallsData() {
    let currentUrl = this.router.url;
    let pathWithoutQueryParams = currentUrl.split('/')[1];
    let pathWithoutQueryParams1 = currentUrl.split('?')[0];

    let routerUrl
    if ((pathWithoutQueryParams == 'assigned-leads-details' || pathWithoutQueryParams == 'mandate-customers')) {
      routerUrl = pathWithoutQueryParams;
    }
    if (pathWithoutQueryParams1 == '/team-chat' || pathWithoutQueryParams1 == '/client-chat') {
      routerUrl = pathWithoutQueryParams1;
      this.isPointerEvents = false;
    }

    this.showCloseButton = false;
    this.showCloseConnectingButton = false;
    if (routerUrl != 'assigned-leads-details' && routerUrl != 'mandate-customers' && routerUrl != '/team-chat' && routerUrl != '/client-chat') {
      this._sharedservice.getLiveCallsList(localStorage.getItem('UserId')).subscribe((resp) => {
        if (resp.status == 'success') {
          this.isApiCallPending = true;
          this.liveCallData = resp.success[0];
          if (this.liveCallData && localStorage.getItem('UserId') == this.liveCallData.Exec_IDFK) {
            setTimeout(() => {
              // let calledDataLocalstorage = JSON.parse(localStorage.getItem('calledLead'));
              this.calledLead = {
                LeadID: this.liveCallData.Lead_IDFK,
                number: this.liveCallData.callto,
                leadname: this.liveCallData.leadname,
                execId: this.liveCallData.assignee
              }

              if (this.roleid == 1 || this.roleid == 2) {
                this.assignedRm = this.liveCallData.assignee;
              } else {
                this.assignedRm = this.liveCallData.Exec_IDFK;
              }
              this.callStatus = this.liveCallData.dialstatus;
              // if ((this.liveCallData.modeofcall == 'Desktop-mandate' || this.liveCallData.modeofcall == 'mobile-mandate' || this.liveCallData.modeofcall == 'Mobile-Mandate' || this.liveCallData.modeofcall == 'Mobile-mandate') && this.isOnCallMandateModalOpen == false) {
              this.isOnCallMandateModalOpen = true;
              this.isModalOpen = true;
              this.isOnCallModalOpen = false;
              const callStart = new Date(this.liveCallData.starttime).getTime();
              localStorage.setItem('callStartTime', callStart.toString());
              this.scheduleCloseButton(callStart);
              this.scheduleConnectingCloseButton(callStart);
              // }
              // else if ((this.liveCallData.modeofcall == 'Desktop-retail' || this.liveCallData.modeofcall == 'mobile-retail' || this.liveCallData.modeofcall == 'Mobile-Retail' || this.liveCallData.modeofcall == 'Mobile-retail') && this.isOnCallModalOpen == false) {
              //   this.isOnCallModalOpen = true;
              //   this.isRetailModalOpen = true
              //   this.isOnCallMandateModalOpen = false;
              //   this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
              //   const callStart = new Date(this.liveCallData.starttime).getTime();
              //   localStorage.setItem('callStartTime', callStart.toString());
              //   this.scheduleCloseButton(callStart);
              //   this.scheduleConnectingCloseButton(callStart);
              // }

              const script = document.createElement('script');
              script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
              script.type = 'module';
              script.async = true;
              script.id = "dashboard_dynamic_links_5";
              document.head.appendChild(script);
            }, 0)
          } else {
            localStorage.setItem('calledLead', '');
            localStorage.setItem('callerTriggeredPlace', '');
          }
          this.isDisaplyCall = true;
        } else {
          this.isApiCallPending = false;
          this.isDisaplyCall = false;
          this.liveCallData = '';
          this.callStatus = undefined;
          // if(this.initiatedCallIndication){
          //   this.initiatedCallIndication.unsubscribe();;
          // }
        }
      })
    }
  }

  onCallDisconnect() {
    swal({
      title: 'Are You Sure the Call is disconnected',
      type: 'info',
      cancelButtonText: 'NO',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value == true) {
        let number = localStorage.getItem('Number');
        this.filterLoader = true;
        this._sharedservice.onCallDisconnected(number).subscribe((resp) => {
          if (resp.status == 'True') {
            this.isOnCallMandateModalOpen = false;
            this.filterLoader = false;
            this.isModalOpen = false;
            this.isOnCallModalOpen = false;
            localStorage.setItem('calledLead', '');
            localStorage.setItem('callerTriggeredPlace', '');
            this.isPointerEvents = false;
            this.callStatus = undefined
            if (this.renderer) {
              this.renderer.removeStyle(document.documentElement, 'overflow');
            }
            localStorage.removeItem('callStartTime');
            this.isApiCallPending = false;
            this.showCloseButton = false;
            this.showCloseConnectingButton = false;
            $('body').removeClass('modal-open');
            $('.modal-backdrop').closest('div').remove();
            setTimeout(() => {
              this.echoService.reconnectSocket();
            }, 100)
          } else {
            swal({
              title: 'Call Disconnect Failed!',
              text: 'Please try agin',
              type: 'error',
              confirmButtonText: 'OK'
            })
          }
        })
      } else if (result.dismiss) {
      }
    });
  }

  onCallRetailModalClose() {
    this.isOnCallModalOpen = false;
    localStorage.setItem('calledLead', '');
    localStorage.setItem('callerTriggeredPlace', '');
    this.isApiCallPending = false;
    this.isPointerEvents = false;
    this.callStatus = undefined
    if (this.renderer) {
      this.renderer.removeStyle(document.documentElement, 'overflow');
    }
    localStorage.removeItem('callStartTime');
    this.showCloseButton = false;
    this.showCloseConnectingButton = false;

    $('body').removeClass('modal-open');
    $('.modal-backdrop').closest('div').remove();

    setTimeout(() => {
      // let currentUrl = this.router.url;
      // let pathWithoutQueryParams = currentUrl.split('?')[0];
      // let currentQueryparams = this.route.snapshot.queryParams;
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.router.navigate([pathWithoutQueryParams])
      // })
      location.reload();
    }, 0)
  }

  onCallMandateModalClose() {
    // $('#mandate_call_modal').click();
    this.isOnCallMandateModalOpen = false;
    this.isApiCallPending = false;
    this.isModalOpen = false;
    this.callStatus = undefined;
    this.isPointerEvents = false;
    localStorage.setItem('calledLead', '');
    localStorage.setItem('callerTriggeredPlace', '');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').closest('div').remove();
    localStorage.removeItem('callStartTime');
    this.showCloseButton = false;
    this.showCloseConnectingButton = false;
    if (this.callDirection == 'inbound') {
      // setTimeout(() => {
      //   let currentUrl = this.router.url;
      //   let pathWithoutQueryParams = currentUrl.split('?')[0];
      //   let currentQueryparams = this.route.snapshot.queryParams;
      //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //     this.router.navigate([pathWithoutQueryParams])
      //   })
      // }, 0)
      location.reload();
    }
  }

  scheduleCloseButton(callStart: any): void {
    const elapsed = Date.now() - callStart;
    const remaining = 60000 - elapsed;
    if (remaining <= 0) {
      this.showCloseButton = true;
    } else {
      this.showCloseButton = false;
      if (!this.closeButtonTimeoutSet) {
        this.closeButtonTimeoutSet = true;
        setTimeout(() => {
          this.showCloseButton = true;
        }, remaining);
      }
    }
  }

  scheduleConnectingCloseButton(callStart: any): void {
    const elapsed = Date.now() - callStart;
    const remaining = 120000 - elapsed;
    if (remaining <= 0) {
      this.showCloseConnectingButton = true;
    } else {
      this.showCloseConnectingButton = false;
      if (!this.closeButtonTimeoutSet) {
        this.closeButtonTimeoutSet = true;
        setTimeout(() => {
          this.showCloseConnectingButton = true;
          console.log('Close button shown via timeout.');
        }, remaining);
      }
    }
  }

  //on clivk on bars icon side bar is appeared . 
  toggleSidebar() {
    // if (window.innerWidth <= 1000) {
    //   this.sidebarWrapper.nativeElement.classList.toggle('show-sidebar');
    //   this.pageWrapper.nativeElement.classList.toggle('toggled', this.sidebarWrapper.nativeElement.classList.contains('show-sidebar'));
    //   this.renderer.setStyle(this.sidebarWrapper.nativeElement, 'display', 'block');
    // }
  }

  getcustomer() {
    let teamlead;
    if (this.role_type == 1) {
      teamlead = this.userid;
    } else {
      teamlead = '';
    }
    let userid = localStorage.getItem('UserId');
    this.clients = this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(param =>
        param ? this._sharedservice.search(param, this.crmtype, userid, '', teamlead) : of<any[]>([])
      ),
      catchError(error => {
        return of<any[]>([]);
      }),
      map(results => {
        // Process results to filter based on crm_type and customer_number
        if (results) {
          const map = new Map<number, any>();
          // Store the values based on number and crm_type which is not null into a map
          results.forEach(item => {
            if (item.crm_type !== null) {
              map.set(item.customer_number, item);
            }
          });
          // Filter the results
          return results.filter(item =>
            item.crm_type !== null || !map.has(item.customer_number)
          );
        }
        return [];
      }),
      shareReplay(1)
    );
    // this.clients.subscribe(filteredResults => {
    // });
  }

  getversion() {
    let userid = localStorage.getItem('UserId');
    this._sharedservice.getversion(userid).subscribe((data) => {
      if (data.Executives[0].active_status == '0') {
        if (data.versioncode[0].Lead247_CRMWEB != version) {
          swal({
            title: 'Version Update',
            text: 'A new version is available',
            type: "warning",
            confirmButtonText: "Click Me",
          }).then((willProceed) => {
            if (willProceed) {
              this.triggerKeyPressEvent();
            } else {
              console.log("Version update was cancelled");
            }
          });
        }
        if (this.roleid != 1 && this.roleid != 2) {
          if (String(data.Executives[0].role_type) == String(this.role_type)) {
          } else {
            this.logout();
          }
        }
      } else {
        swal({
          title: 'Blocked',
          text: 'Your account has been blocked',
          type: "warning",
          showConfirmButton: true,
          confirmButtonText: "OK",
        }).then((willProceed) => {
          localStorage.clear();
          setTimeout(() =>
            this.router.navigate(['/login'])
            , 0)
        });
      }
    },
      (error) => {
        if (error.status == 401) {
          localStorage.clear();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 0);
        }
      })
  }

  getChatUnreadCounts(): Observable<any> {
    let param = {
      loginid: localStorage.getItem('UserId')
    }
    return this._sharedservice.getUnreadCounts(param);
  }

  // getWhatsappUnreadCounts(): Observable<any> {
  //   let param = {
  //     loginid: localStorage.getItem('UserId')
  //   }
  //   return this._sharedservice.getWhatsappUnreadCounts(param);
  // }

  // refresh browser
  triggerKeyPressEvent() {
    document.cookie.split(';').forEach(function (cookie) {
      let cookieName = cookie.split('=')[0];
      document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    });

    location.href = location.href.split('?')[0];
    window.location.reload();
  }

  searchClient(param: string): void {
    this.flag = true;
    this.searchTerms.next(param);
    if (param == "") {
      this.flag = false;
    }
  }

  mandatesearch(param: string): void {
    this.flag = true;
    this.mandatesearchTerms.next(param);
    if (param == "") {
      this.flag = false;
    }
  }

  retailsearch(param: string): void {
    this.flag = true;
    this.retailsearchTerms.next(param);
    if (param == "") {
      this.flag = false;
    }
  }

  onselectClient(client) {
    this.userid = localStorage.getItem('UserId');
    // if (client.customer_IDPK != null) {
    //   this.customer_name = client.customer_name;
    //   this.flag = false;
    //   let execid;
    //   if (client.execid == null || client.execid == undefined || client.execid == '') {
    //     execid = this.userid;
    //   } else {
    //     execid = client.execid;
    //   }

    //     let propid;
    //   if (client.propid == null) {
    //     propid = '';
    //   } else {
    //     propid = client.propid;
    //   }
    //   this.router.navigate([
    //     '/mandate-customers',
    //     client.customer_IDPK,
    //     execid,
    //     0,
    //     'mandate',
    //     propid
    //   ]);
    //   this.customer_name = '';
    //   // setTimeout(() => {
    //   //   let currentUrl = this.router.url;
    //   //   let pathWithoutQueryParams = currentUrl.split('?')[0];
    //   //   let currentQueryparams = this.route.snapshot.queryParams;
    //   //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   //     this.router.navigate([pathWithoutQueryParams])
    //   //   })
    //   // },700)
    //   // } else if (client.crm_type == 2 || client.crm_type == null) {
    //   //   this.router.navigate(['/assigned-leads-details/' + client.customer_IDPK + '/' + execid + '/' + '0' + '/' + 'retail']);
    //   //   this.customer_name = '';
    //   //   setTimeout(() => {
    //   //     let currentUrl = this.router.url;
    //   //     let pathWithoutQueryParams = currentUrl.split('?')[0];
    //   //     let currentQueryparams = this.route.snapshot.queryParams;
    //   //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   //       this.router.navigate([pathWithoutQueryParams])
    //   //     })
    //   //     // location.reload();
    //   //   }, 500)
    //   // }
    //   //  window.open('http://localhost:4200/Customer-Details/' + id ,'_blank');
    // } else {
    //   return false;
    // }


    if (!client || !client.customer_IDPK) {
      return;
    }

    const execid = client.execid ? client.execid : this.userid;
    const propid = client.propid ? client.propid : '';

    // this.router.navigate([
    //   '/mandate-customers',
    //   client.customer_IDPK,
    //   execid,
    //   0,
    //   'mandate',
    //   propid
    // ]);

    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([
      '/mandate-customers',
      client.customer_IDPK,
      execid,
      0,
      'mandate',
      propid
    ]);

    // setTimeout(() => {
    //   let currentUrl = this.router.url;
    //   let pathWithoutQueryParams = currentUrl.split('?')[0];
    //   let currentQueryparams = this.route.snapshot.queryParams;
    //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //     this.router.navigate([pathWithoutQueryParams])
    //   })
    // }, 1000)

  }

  passwordchange() {
    if ($('#newpass').val() == "") {
      $('#newpass').focus().css("border-color", "red").attr('placeholder', 'Please enter your new Password');
      return false;
    }
    else {
      $('#newpass').removeAttr("style");
    }
    var password = $("#newpass").val();
    if ($('#repass').val() == "") {
      $('#repass').focus().css("border-color", "red").attr('placeholder', 'Please re-enter the Password');
      return false;
    }
    else {
      var confirmPassword = $("#repass").val();
      if (password != confirmPassword) {
        $('#repass').focus().css("border-color", "red").attr('placeholder', 'Password Mismatch Please Re-enter').val('');
        return false;

      }
      else {
        $('#repass').removeAttr("style");
      }
    }
    var param = this.password;
    var id = localStorage.getItem('UserId')
    this._sharedservice.passwordupdate(id, param).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {

        swal({
          title: 'Password Updated',
          type: 'success',
          confirmButtonText: 'OK'
        })
        $('#cancel').click();
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

  changePassword() {
    $('#change_password_modal').modal('show');
    // $('#change_password_modal').addClass('show');
    // $('#change_password_modal').css('display','block');
    // $('body').addClass('modal-open');
    // $('.modal-backdrop').addClass('fade')
  }

  closeChangePassModal() {
    // $('#change_password_modal').removeClass('show');
    // $('#change_password_modal').css('display','none');
    // $('body').removeClass('modal-open');
  }

  // selectedLeadtype(type) {
  //   //   if(this.echoServiceSub){
  //   //     this.echoServiceSub.unsubscribe();
  //   //   }
  //   // setTimeout(() => {
  //   //   this.echoServiceSub = this.echoServiceSub = this.echoService.listenToDatabaseChanges((message) => {
  //   //     // Your message handler code here

  //   //     // ... rest of your code
  //   //   });
  //   // }, 5000);
  //   this.selectedTypeLead = type;
  //   let currentUrl = this.router.url;
  //   let pathWithoutQueryParams = currentUrl.split('?')[0];
  //   let currentQueryparams = this.route.snapshot.queryParams;
  //   // this.currentQueryparams = currentQueryparams;
  //   this.routerUrl = pathWithoutQueryParams;
  //   let detailpageurl
  //   if (currentUrl.split('/')[1] == "assigned-leads-details" || currentUrl.split('/')[1] == "mandate-customers") {
  //     detailpageurl = currentUrl.split('/')[1];
  //     this.routerUrl = currentUrl.split('/')[1];
  //   }

  //   if (type == 'mandate') {
  //     setTimeout(() => {
  //       this.selectedLead = 'mandate';
  //     }, 0)
  //     if (pathWithoutQueryParams == '/retail-dashboard') {
  //       this.router.navigate(['/mandate-dashboard'],
  //         {
  //           queryParams: {
  //             allvisits: 1,
  //             from: '',
  //             to: '',
  //             dashtype: 'dashboard',
  //             htype: 'mandate'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/retail-leadassign' && (currentQueryparams.todaysvisits == '1' || currentQueryparams.todayvisited == '1' || currentQueryparams.upcomingvisits == '1')) {
  //       if (currentQueryparams.todaysvisits == '1') {
  //         this.router.navigate(['/rmleadassign'],
  //           {
  //             queryParams: {
  //               todaysvisits: 1,
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.todayvisited == '1') {
  //         this.router.navigate(['/rmleadassign'],
  //           {
  //             queryParams: {
  //               todayvisited: 1,
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.upcomingvisits == '1') {
  //         this.router.navigate(['/rmleadassign'],
  //           {
  //             queryParams: {
  //               upcomingvisits: 1,
  //               htype: 'mandate'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/retail-leadassign' && (currentQueryparams.todaysfollowups == '1' || currentQueryparams.upcomingfollowups == '1')) {
  //       if (currentQueryparams.todaysfollowups == '1') {
  //         this.router.navigate(['/rmleadassign'],
  //           {
  //             queryParams: {
  //               todaysfollowups: 1,
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.upcomingfollowups == '1') {
  //         this.router.navigate(['/rmleadassign'],
  //           {
  //             queryParams: {
  //               upcomingfollowups: 1,
  //               htype: 'mandate'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/retail-lead-stages' && (currentQueryparams.pending == '1' || currentQueryparams.followups == '1' || currentQueryparams.nc == '1' || currentQueryparams.inactive == '1' || currentQueryparams.junkleads == '1')) {
  //       if (currentQueryparams.pending == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               pending: '1',
  //               from: '',
  //               to: '',
  //               type: 'leads',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.followups == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               followups: '1',
  //               from: '',
  //               to: '',
  //               type: 'leads',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.nc == '1') {
  //         let id;
  //         if (this.CSEXview || this.CSTLview) {
  //           id = currentQueryparams.id; //previsouly it was 1
  //         } else if (this.adminview) {
  //           id = currentQueryparams.id
  //         }
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               nc: '1',
  //               from: '',
  //               to: '',
  //               type: 'leads',
  //               htype: 'mandate',
  //               id: id
  //             }
  //           })
  //       } else if (currentQueryparams.inactive == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               inactive: '1',
  //               from: '',
  //               to: '',
  //               type: 'leads',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.junkleads == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               junkleads: '1',
  //               from: '',
  //               to: '',
  //               type: 'leads',
  //               htype: 'mandate'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/retail-lead-stages' && (currentQueryparams.usv == '1' || currentQueryparams.sv == '1' || currentQueryparams.rsv == '1' || currentQueryparams.fn == '1' || currentQueryparams.junkvisits == '1')) {
  //       if (currentQueryparams.usv == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               usv: 1,
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'mandate',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       } else if (currentQueryparams.sv == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               usv: 1,
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'mandate',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       } else if (currentQueryparams.rsv == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               rsv: 1,
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'mandate',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       } else if (currentQueryparams.fn == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               fn: 1,
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'mandate',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       } else if (currentQueryparams.junkvisits == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               junkvisits: 1,
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'mandate',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/retail-lead-stages' && (currentQueryparams.brs == '1' || currentQueryparams.brr == '1' || currentQueryparams.bkd == '1')) {
  //       if (currentQueryparams.brs == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               bookingRequest: 1,
  //               from: '',
  //               to: '',
  //               type: 'bookings',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.brr == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               bookingRejected: 1,
  //               from: '',
  //               to: '',
  //               type: 'bookings',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.bkd == '1') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               booked: 1,
  //               from: '',
  //               to: '',
  //               type: 'bookings',
  //               htype: 'mandate'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/retail-myoverdues') {
  //       if (currentQueryparams.followupsoverdues == '1') {
  //         this.router.navigate(['/mandate-myoverdues'],
  //           {
  //             queryParams: {
  //               followupsoverdues: 1,
  //               from: '',
  //               to: '',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.ncoverdues == '1') {
  //         this.router.navigate(['/mandate-myoverdues'],
  //           {
  //             queryParams: {
  //               ncoverdues: 1,
  //               from: '',
  //               to: '',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.usvoverdues == '1') {
  //         this.router.navigate(['/mandate-myoverdues'],
  //           {
  //             queryParams: {
  //               usvoverdues: 1,
  //               from: '',
  //               to: '',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.svoverdues == '1') {
  //         this.router.navigate(['/mandate-myoverdues'],
  //           {
  //             queryParams: {
  //               followupsoverdues: 1,
  //               from: '',
  //               to: '',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.rsvoverdues == '1') {
  //         this.router.navigate(['/mandate-myoverdues'],
  //           {
  //             queryParams: {
  //               rsvoverdues: 1,
  //               from: '',
  //               to: '',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.fnoverdues == '1') {
  //         this.router.navigate(['/mandate-myoverdues'],
  //           {
  //             queryParams: {
  //               fnoverdues: 1,
  //               from: '',
  //               to: '',
  //               htype: 'mandate'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/retail-plans') {
  //       this.router.navigate(['/mandate-plans'],
  //         {
  //           queryParams: {
  //             plan: 'weekend',
  //             type: 'usv',
  //             from: this.planfromdate,
  //             to: this.plantodate,
  //             htype: 'mandate'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/myretailreports') {
  //       this.router.navigate(['/mymandatereports'],
  //         {
  //           queryParams: {
  //             followups: 1,
  //             datetype: 'today',
  //             htype: 'mandate'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/retail-inactive-junk') {
  //       this.router.navigate(['/mandate-inactive-junk'],
  //         {
  //           queryParams: {
  //             type: 'inactive',
  //             inactive1: 1,
  //             from: '',
  //             to: '',
  //             htype: 'mandate'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/retail-lead-stages' && (currentQueryparams.filterData == 'AllVisits' || currentQueryparams.filterData == 'ActiveVisits')) {
  //       if (currentQueryparams.filterData == 'AllVisits') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               filterData: 'AllVisits',
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'mandate',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       } else if (currentQueryparams.filterData == 'ActiveVisits') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               filterData: 'ActiveVisits',
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'mandate',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/retail-lead-stages' && (currentQueryparams.filterData == 'Touched' || currentQueryparams.filterData == 'Active')) {
  //       if (currentQueryparams.filterData == 'Touched') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               filterData: 'Touched',
  //               stagestatus: '',
  //               type: 'leads',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'mandate'
  //             }
  //           })
  //       } else if (currentQueryparams.filterData == 'Active') {
  //         this.router.navigate(['/mandate-lead-stages'],
  //           {
  //             queryParams: {
  //               filterData: 'Active',
  //               stagestatus: '',
  //               type: 'leads',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'mandate'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/retail-pricing-list') {
  //       this.router.navigate(['/mandate-pricing-list'],
  //         {
  //           queryParams: {
  //             htype: 'mandate'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/retail-feedback') {
  //       this.router.navigate(['/mandate-feedback'],
  //         {
  //           queryParams: {
  //             pending: 1,
  //             from: '',
  //             to: '',
  //             htype: 'mandate'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/retail-junk-dash') {
  //       this.router.navigate(['/mandate-junk-dash'],
  //         {
  //           queryParams: {
  //             allvisits: 1,
  //             from: '',
  //             to: '',
  //             dashtype: 'dashboard',
  //             htype: 'mandate'
  //           }
  //         })
  //     } else if (detailpageurl == 'assigned-leads-details') {
  //       if (this.CSEXview || this.CSTLview) {
  //         this.router.navigateByUrl(`/mandate-customers/${currentUrl.split('/')[2]}/${this.userid}/${currentUrl.split('/')[4]}/mandate`)
  //       } else {
  //         this.router.navigateByUrl(`/mandate-customers/${currentUrl.split('/')[2]}/${currentUrl.split('/')[3]}/${currentUrl.split('/')[4]}/mandate`)

  //       }
  //     }
  //     // // will be removed after mandate feedback is made live
  //     // else if (pathWithoutQueryParams == '/mandate-feedback') {
  //     //   this.router.navigate(['/retail-feedback'],
  //     //     {
  //     //       queryParams: {
  //     //         pending: 1,
  //     //         from: '',
  //     //         to: '',
  //     //         htype: 'retail'
  //     //       }
  //     //     })
  //     // }
  //   } else if (type == 'retail') {
  //     setTimeout(() => {
  //       this.selectedLead = 'retail';
  //     }, 0)
  //     if (pathWithoutQueryParams == '/mandate-dashboard') {
  //       this.router.navigate(['/retail-dashboard'],
  //         {
  //           queryParams: {
  //             allvisits: 1,
  //             from: '',
  //             to: '',
  //             dashtype: 'dashboard',
  //             htype: 'retail'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/rmleadassign' && (currentQueryparams.todaysvisits == '1' || currentQueryparams.todayvisited == '1' || currentQueryparams.upcomingvisits == '1')) {
  //       if (currentQueryparams.todaysvisits == '1') {
  //         this.router.navigate(['/retail-leadassign'],
  //           {
  //             queryParams: {
  //               todaysvisits: 1,
  //               htype: 'retail'
  //             }
  //           })
  //       } else if (currentQueryparams.todayvisited == '1') {
  //         this.router.navigate(['/retail-leadassign'],
  //           {
  //             queryParams: {
  //               todayvisited: 1,
  //               htype: 'retail'
  //             }
  //           })
  //       } else if (currentQueryparams.upcomingvisits == '1') {
  //         this.router.navigate(['/retail-leadassign'],
  //           {
  //             queryParams: {
  //               upcomingvisits: 1,
  //               htype: 'retail'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/rmleadassign' && (currentQueryparams.todaysfollowups == '1' || currentQueryparams.upcomingfollowups == '1')) {
  //       if (currentQueryparams.todaysfollowups == '1') {
  //         this.router.navigate(['/retail-leadassign'],
  //           {
  //             queryParams: {
  //               todaysfollowups: 1,
  //               htype: 'retail'
  //             }
  //           })
  //       } else if (currentQueryparams.upcomingfollowups == '1') {
  //         this.router.navigate(['/retail-leadassign'],
  //           {
  //             queryParams: {
  //               upcomingfollowups: 1,
  //               htype: 'retail'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/mandate-lead-stages' && (currentQueryparams.pending == '1' || currentQueryparams.followups == '1' || currentQueryparams.nc == '1' || currentQueryparams.inactive == '1' || currentQueryparams.junkleads == '1')) {
  //       if (currentQueryparams.pending == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               pending: '1',
  //               from: '',
  //               to: '',
  //               type: 'leads',
  //               htype: 'retail'
  //             }
  //           })
  //       } else if (currentQueryparams.followups == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               followups: '1',
  //               from: '',
  //               to: '',
  //               type: 'leads',
  //               htype: 'retail'
  //             }
  //           })
  //       } else if (currentQueryparams.nc == '1') {
  //         let id;
  //         if (this.CSEXview || this.CSTLview) {
  //           id = currentQueryparams.id; //previsouly it was 1
  //         } else if (this.adminview) {
  //           id = currentQueryparams.id
  //         }
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               nc: '1',
  //               from: '',
  //               to: '',
  //               type: 'leads',
  //               htype: 'retail',
  //               id: id
  //             }
  //           })
  //       } else if (currentQueryparams.inactive == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               inactive: '1',
  //               from: '',
  //               to: '',
  //               type: 'leads',
  //               htype: 'retail'
  //             }
  //           })
  //       } else if (currentQueryparams.junkleads == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               junkleads: '1',
  //               from: '',
  //               to: '',
  //               type: 'leads',
  //               htype: 'retail'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/mandate-lead-stages' && (currentQueryparams.usv == '1' || currentQueryparams.rsv == '1' || currentQueryparams.fn == '1' || currentQueryparams.junkvisits == '1')) {
  //       if (currentQueryparams.usv == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               usv: 1,
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'retail',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       } else if (currentQueryparams.rsv == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               rsv: 1,
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'retail',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       } else if (currentQueryparams.fn == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               fn: 1,
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'retail',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       } else if (currentQueryparams.junkvisits == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               junkvisits: 1,
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'retail',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/mandate-lead-stages' && (currentQueryparams.bookingRequest == '1' || currentQueryparams.bookingRejected == '1' || currentQueryparams.booked == '1')) {
  //       if (currentQueryparams.bookingRequest == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               brs: 1,
  //               from: '',
  //               to: '',
  //               type: 'bookings',
  //               htype: 'retail'
  //             }
  //           })
  //       } else if (currentQueryparams.bookingRejected == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               brr: 1,
  //               from: '',
  //               to: '',
  //               type: 'bookings',
  //               htype: 'retail'
  //             }
  //           })
  //       } else if (currentQueryparams.booked == '1') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               bkd: 1,
  //               from: '',
  //               to: '',
  //               type: 'bookings',
  //               htype: 'retail'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/mandate-myoverdues') {
  //       setTimeout(() => {
  //         if (currentQueryparams.followupsoverdues) {
  //           this.router.navigate(['/retail-myoverdues'],
  //             {
  //               queryParams: {
  //                 followupsoverdues: 1,
  //                 from: '',
  //                 to: '',
  //                 htype: 'retail'
  //               }
  //             })
  //         } else if (currentQueryparams.ncoverdues) {
  //           this.router.navigate(['/retail-myoverdues'],
  //             {
  //               queryParams: {
  //                 ncoverdues: 1,
  //                 from: '',
  //                 to: '',
  //                 htype: 'retail'
  //               }
  //             })
  //         } else if (currentQueryparams.usvoverdues) {
  //           this.router.navigate(['/retail-myoverdues'],
  //             {
  //               queryParams: {
  //                 usvoverdues: 1,
  //                 from: '',
  //                 to: '',
  //                 htype: 'retail'
  //               }
  //             })
  //         } else if (currentQueryparams.rsvoverdues) {
  //           this.router.navigate(['/retail-myoverdues'],
  //             {
  //               queryParams: {
  //                 rsvoverdues: 1,
  //                 from: '',
  //                 to: '',
  //                 htype: 'retail'
  //               }
  //             })
  //         } else if (currentQueryparams.fnoverdues) {
  //           this.router.navigate(['/retail-myoverdues'],
  //             {
  //               queryParams: {
  //                 fnoverdues: 1,
  //                 from: '',
  //                 to: '',
  //                 htype: 'retail'
  //               }
  //             })
  //         }
  //       })
  //     } else if (pathWithoutQueryParams == '/mandate-plans') {
  //       this.router.navigate(['/retail-plans'],
  //         {
  //           queryParams: {
  //             plan: 'weekend',
  //             type: 'usv',
  //             from: this.planfromdate,
  //             to: this.plantodate,
  //             htype: 'retail'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/mymandatereports') {
  //       this.router.navigate(['/myretailreports'],
  //         {
  //           queryParams: {
  //             followups: 1,
  //             datetype: 'today',
  //             htype: 'retail'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/mandate-inactive-junk') {
  //       this.router.navigate(['/retail-inactive-junk'],
  //         {
  //           queryParams: {
  //             type: 'inactive',
  //             inactive1: 1,
  //             from: '',
  //             to: '',
  //             htype: 'retail'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/mandate-lead-stages' && (currentQueryparams.filterData == 'AllVisits' || currentQueryparams.filterData == 'ActiveVisits')) {
  //       if (currentQueryparams.filterData == 'AllVisits') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               filterData: 'AllVisits',
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'retail',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       } else if (currentQueryparams.filterData == 'ActiveVisits') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               filterData: 'ActiveVisits',
  //               stagestatus: '3',
  //               type: 'visits',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'retail',
  //               id: currentQueryparams.id
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/mandate-lead-stages' && (currentQueryparams.filterData == 'Touched' || currentQueryparams.filterData == 'Active')) {
  //       if (currentQueryparams.filterData == 'Touched') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               filterData: 'Touched',
  //               stagestatus: '',
  //               type: 'leads',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'retail'
  //             }
  //           })
  //       } else if (currentQueryparams.filterData == 'Active') {
  //         this.router.navigate(['/retail-lead-stages'],
  //           {
  //             queryParams: {
  //               filterData: 'Active',
  //               stagestatus: '',
  //               type: 'leads',
  //               visitedfrom: '',
  //               visitedto: '',
  //               htype: 'retail'
  //             }
  //           })
  //       }
  //     } else if (pathWithoutQueryParams == '/mandate-pricing-list') {
  //       this.router.navigate(['/retail-pricing-list'],
  //         {
  //           queryParams: {
  //             htype: 'retail'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/mandate-feedback') {
  //       this.router.navigate(['/retail-feedback'],
  //         {
  //           queryParams: {
  //             pending: 1,
  //             from: '',
  //             to: '',
  //             htype: 'retail'
  //           }
  //         })
  //     } else if (pathWithoutQueryParams == '/mandate-junk-dash') {
  //       this.router.navigate(['/retail-junk-dash'],
  //         {
  //           queryParams: {
  //             allvisits: 1,
  //             from: '',
  //             to: '',
  //             dashtype: 'dashboard',
  //             htype: 'retail'
  //           }
  //         })
  //     } else if (detailpageurl == 'mandate-customers') {
  //       if (this.CSEXview || this.CSTLview) {
  //         this.router.navigateByUrl(`/assigned-leads-details/${currentUrl.split('/')[2]}/${this.userid}/${currentUrl.split('/')[4]}/retail`)
  //       } else {
  //         this.router.navigateByUrl(`/assigned-leads-details/${currentUrl.split('/')[2]}/${currentUrl.split('/')[3]}/${currentUrl.split('/')[4]}/retail`)
  //       }
  //     }

  //   }
  // }

  selectedDashboardtype(dash) {
    let filterParam = {};
    if (this.dashboardUrl['todayvisited'] == 1) {
      filterParam = { todayvisited: 1 };
    } else if (this.dashboardUrl['yesterdayvisited'] == 1) {
      filterParam = { yesterdayvisited: 1 };
    } else if (this.dashboardUrl['last7'] == 1) {
      filterParam = { last7: 1 };
    } else if (this.dashboardUrl['allvisits'] == 1) {
      filterParam = { allvisits: 1 };
    } else {
      filterParam = { todayvisited: 1 };
    }

    if (dash == 'leads') {
      this.router.navigate(['/mandate-dashboard'], {
        queryParams: {
          ...filterParam,
          from: this.dashboardUrl.from,
          to: this.dashboardUrl.to,
          property: this.dashboardUrl.property,
          propname: this.dashboardUrl.propname,
          role: this.dashboardUrl.role,
          execid: this.dashboardUrl.execid,
          execname: this.dashboardUrl.execname,
          dashtype: 'dashboard',
          htype: 'mandate',
          type: 'leads'
        }
      })
    } else if (dash == 'visits') {
      this.router.navigate(['/mandate-dashboard'], {
        queryParams: {
          ...filterParam,
          from: this.dashboardUrl.from,
          to: this.dashboardUrl.to,
          property: this.dashboardUrl.property,
          propname: this.dashboardUrl.propname,
          role: this.dashboardUrl.role,
          execid: this.dashboardUrl.execid,
          execname: this.dashboardUrl.execname,
          dashtype: 'dashboard',
          htype: 'mandate',
          type: 'visits'
        }
      })
    } else if (dash == 'calldash') {
      this.router.navigate(['/all-calls'], {
        queryParams: {
          ...filterParam,
          from: this.todaysdateforcompare,
          to: this.todaysdateforcompare,
          property: this.dashboardUrl.property,
          propname: this.dashboardUrl.propname,
          role: this.dashboardUrl.role,
          execid: this.dashboardUrl.execid,
          execname: this.dashboardUrl.execname,
        }
      })
    }
  }

  selectedchattype(type) {
    let currentUrl = this.router.url;
    let pathWithoutQueryParams = currentUrl.split('?')[0];
    if (type == 'in') {
      if (pathWithoutQueryParams == '/client-chat') {
        this.router.navigate(['/team-chat'],
          {
            queryParams: {
              allchat: 1,
            }
          })
      }
    } else if (type == 'wc') {
      if (pathWithoutQueryParams == '/team-chat') {
        this.router.navigate(['/client-chat'],
          {
            queryParams: {
              allchat: 1,
            }
          })
      }
    }
  }

  // Method to toggle the drawer's visibility
  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.notificationSelection('unread')
  }

  // Method to close the drawer's visibility
  closeDrawer() {
    this.isDrawerOpen = false;
  }

  //here in this method message tab switching takes place.
  notificationSelection(type) {
    $('.add_class').removeClass('active');
    this.isUnread = false;
    this.isRead = false;
    if (type == 'unread') {
      setTimeout(() => {
        $('.unread_messages').addClass('active');
        this.isUnread = true;
      }, 0)
    } else if (type == 'read') {
      setTimeout(() => {
        $('.read_messages').addClass('active');
        this.isRead = true;
      }, 0)
    }
  }

  goToChatsection(type) {
    if (type == 'in') {
      this.router.navigateByUrl('/team-chat?allchat=1');
    } else if (type == 'wc') {
      this.router.navigateByUrl('/client-chat?allchat=1');
    }
  }

  goToAllCallsection() {
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    this.router.navigateByUrl(`/all-calls?today=1&from=${this.todaysdateforcompare}&to=${this.todaysdateforcompare}`);
  }

  // here we will trigger the gethourlydata method every 1 hour for executive account 
  // triggerHourlyAPIMethod() {
  //   setInterval(() => {
  //     this.getHourlyData();
  //     $('#hourlyReport_detail').click();
  //   }, 60000)
  // }

  // currentTime: any;
  // minus1hour: any;
  //here we check whether the time is between 9:30 to 6:30 and then trigger the counts API based on the mandate and retail Login.
  // getHourlyData() {
  //   const now = new Date();
  //   const hours = now.getHours();
  //   const minutes = now.getMinutes();
  //   const currentampm = hours >= 12 ? 'PM' : 'AM';
  //   let minusedTime = now.getHours() - 1;
  //   const minusampm = minusedTime >= 12 ? 'PM' : 'AM';

  //   if ((hours >= 9 && hours <= 18) && (minutes === 0 || minutes === 30)) {
  //     this.currentTime = hours+':'+minutes+ ' ' + currentampm;
  //     this.minus1hour=now.getHours() - 1 +':'+minutes+ ' ' + minusampm;
  //     if (this.RetailRMEXview == true || this.RetailRMTLview == true || this.CSTLview == true || this.CSEXview == true) {
  //       this.getCountsRetail();
  //     } else if (this.MandateRMExecutiveview == true || this.MandateRMTLview == true) {
  //       this.getCountsMandate();
  //     }
  //   }
  // }

  //here we get the counts for every one hour for Retail executives
  // getCountsRetail() {
  //   this.Totalleadcounts = 0;
  //   this.unquieleadcounts = 0;
  //   this.followupleadcounts = 0;
  //   this.normalcallcounts = 0;
  //   this.usvCounts = 0;
  //   this.rsvCounts = 0;
  //   this.rsvfixCounts = 0;
  //   this.fnCounts = 0;
  //   this.fnfixCounts = 0;
  //   this.bookingRequestCounts = 0;
  //   this.bookingRejCounts = 0;
  //   this.bookedCounts = 0;
  //   this.inactivecounts = 0;
  //   this.junkleadsCounts = 0;
  //   this.junkvisitsCounts = 0;
  //   this.svcount = 0;
  //   this.svfixcount = 0;


  //   var curmonth = this.currentdateforcompare.getMonth() + 1;
  //   var curmonthwithzero = curmonth.toString().padStart(2, "0");
  //   // Todays Date
  //   var curday = this.currentdateforcompare.getDate();
  //   var curdaywithzero = curday.toString().padStart(2, "0");
  //   this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

  //   this.rmid = localStorage.getItem('Role');

  //   var totalleads = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'pending',
  //     stage: '',
  //     stagestatus: '',
  //   }
  //   this._retailservice.assignedLeadsCount(totalleads).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.Totalleadcounts = compleads.result[0].total_counts;
  //       this.unquieleadcounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.Totalleadcounts = 0;
  //       this.unquieleadcounts = 0;
  //     }
  //   });

  //   // Followup Leads Counts Fetch......
  //   var followups = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'generalfollowups',
  //     stage: '',
  //     stagestatus: '',
  //   }
  //   this._retailservice.activityLeadsCount(followups).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.followupleadcounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.followupleadcounts = 0;
  //     }
  //   });
  //   // Followup Leads Counts Fetch

  //   // inactive Counts Fetch
  //   var inactive = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'inactive',
  //     stage: '',
  //     stagestatus: '',
  //   }
  //   this._retailservice.activityLeadsCount(inactive).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.inactivecounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.inactivecounts = 0;
  //     }
  //   });
  //   // inactive Counts Fetch

  //   //junk visits count detch
  //   var junkpar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'junkvisits',
  //     stagestatus: '',
  //     loginuser: this.userid,
  //   }
  //   this._retailservice.activityLeadsCount(junkpar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.junkvisitsCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.junkvisitsCounts = 0;
  //     }
  //   });

  //   //junk leads count detch
  //   var junkleadspar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'junkleads',
  //     stage: '',
  //     stagestatus: '',
  //   }
  //   this._retailservice.activityLeadsCount(junkleadspar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.junkleadsCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.junkleadsCounts = 0;
  //     }
  //   });

  //   // nc Counts
  //   var nc = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'NC',
  //     stage: '',
  //     stagestatus: '',
  //   }
  //   this._retailservice.activityLeadsCount(nc).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.normalcallcounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.normalcallcounts = 0;
  //     }
  //   });
  //   // nc Counts

  //   // USV Counts
  //   var usv = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'USV',
  //     stage: '',
  //     stagestatus: '3',
  //   }
  //   this._retailservice.activityLeadsCount(usv).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.usvCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.usvCounts = 0;
  //     }
  //   });
  //   // USV Counts

  //   // SV Counts
  //   var sv = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'SV',
  //     stage: '',
  //     stagestatus: '3',
  //   }
  //   this._retailservice.activityLeadsCount(sv).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.svcount = compleads.result[0].uniquee_count;
  //     } else {
  //       this.svcount = 0;
  //     }
  //   });
  //   // SV Counts

  //   // SV fix Counts
  //   var sv = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'SV',
  //     stage: '',
  //     stagestatus: '1',
  //   }
  //   this._retailservice.activityLeadsCount(sv).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.svfixcount = compleads.result[0].uniquee_count;
  //     } else {
  //       this.svfixcount = 0;
  //     }
  //   });
  //   // SV Counts

  //   // RSV Counts
  //   var rsv = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'RSV',
  //     stage: '',
  //     stagestatus: '3',
  //   }
  //   this._retailservice.activityLeadsCount(rsv).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.rsvCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.rsvCounts = 0;
  //     }
  //   });
  //   // RSV Counts

  //   // RSV fix Counts
  //   var rsv = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'RSV',
  //     stage: '',
  //     stagestatus: '1',
  //   }
  //   this._retailservice.activityLeadsCount(rsv).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.rsvfixCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.rsvfixCounts = 0;
  //     }
  //   });
  //   // RSV Counts

  //   // FN Counts
  //   var FN = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'Final Negotiation',
  //     stage: '',
  //     stagestatus: '3',
  //   }
  //   this._retailservice.activityLeadsCount(FN).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.fnCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.fnCounts = 0;
  //     }
  //   });
  //   // FN Counts


  //   // FN fix Counts
  //   var FN = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'Final Negotiation',
  //     stage: '',
  //     stagestatus: '1',
  //   }
  //   this._retailservice.activityLeadsCount(FN).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.fnfixCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.fnfixCounts = 0;
  //     }
  //   });
  //   // FN fix Counts

  //   var bookingreq = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'Deal Closing Requested',
  //     stagestatus: '3',
  //   }
  //   this._retailservice.activityLeadsCount(bookingreq).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.bookingRequestCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.bookingRequestCounts = 0;
  //     }
  //   });
  //   // Booking Rejected Counts

  //   var bookingreq = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'Closing Request Rejected',
  //     stagestatus: '3',
  //   }
  //   this._retailservice.activityLeadsCount(bookingreq).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.bookingRejCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.bookingRejCounts = 0;
  //     }
  //   });
  //   // Booking Rejected Counts

  //   // Booked Counts
  //   var dealclosed = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     statuss: 'Deal Closed',
  //     stagestatus: '3',
  //   }
  //   this._retailservice.activityLeadsCount(dealclosed).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.bookedCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.bookedCounts = 0;
  //     }
  //   });

  //   $('#hourlyReport_detail').click();

  // }

  //here we get the counts for every one hour for Mandate executives
  // getCountsMandate() {
  //   this.Totalleadcounts = 0;
  //   this.unquieleadcounts = 0;
  //   this.followupleadcounts = 0;
  //   this.normalcallcounts = 0;
  //   this.usvCounts = 0;
  //   this.rsvCounts = 0;
  //   this.rsvfixCounts = 0;
  //   this.fnCounts = 0;
  //   this.fnfixCounts = 0;
  //   this.bookingRequestCounts = 0;
  //   this.bookingRejCounts = 0;
  //   this.bookedCounts = 0;
  //   this.inactivecounts = 0;
  //   this.junkleadsCounts = 0;
  //   this.junkvisitsCounts = 0;

  //   // Total Assigned Leads Count
  //   var totalleads = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'pending',
  //     stage: '',
  //     stagestatus: '',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //   this._mandateservice.activityLeadsCount(totalleads).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.Totalleadcounts = compleads.result[0].total_counts;
  //       this.unquieleadcounts = compleads.result[0].uniquee_count
  //     } else {
  //       this.Totalleadcounts = 0;
  //     }
  //   });

  //   // Total Assigned Leads Count

  //   // Followup Leads Counts Fetch
  //   var followups = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'generalfollowups',
  //     stage: '',
  //     stagestatus: '',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //   this._mandateservice.activityLeadsCount(followups).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.followupleadcounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.followupleadcounts = 0;
  //     }
  //   });
  //   // Followup Leads Counts Fetch

  //   // nc Counts
  //   var nc = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'NC',
  //     stage: '',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //   this._mandateservice.activityLeadsCount(nc).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.normalcallcounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.normalcallcounts = 0;
  //     }
  //   });

  //   // nc Counts

  //   //usv counts  fetch
  //   var usvpar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'USV',
  //     stage: '',
  //     stagestatus: '3',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //   this._mandateservice.activityLeadsCount(usvpar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.usvCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.usvCounts = 0;
  //     }
  //   });
  //   //usv counts  fetch

  //   //rsv counts  fetch
  //   var rsvpar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'RSV',
  //     stage: '',
  //     stagestatus: '3',
  //     executid: this.rmid,
  //     loginuser: this.userid
  //   }
  //   this._mandateservice.activityLeadsCount(rsvpar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.rsvCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.rsvCounts = 0;
  //     }
  //   });
  //   //rsv counts  fetch

  //   //rsv counts fix fetch
  //   var rsvpar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'RSV',
  //     stage: '',
  //     stagestatus: '1',
  //     executid: this.rmid,
  //     loginuser: this.userid
  //   }
  //   this._mandateservice.activityLeadsCount(rsvpar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.rsvfixCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.rsvfixCounts = 0;
  //     }
  //   });
  //   //rsv counts fix fetch

  //   //fn counts  fetch
  //   var fnpar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'Final Negotiation',
  //     stage: '',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     stagestatus: '3',
  //   }
  //   this._mandateservice.activityLeadsCount(fnpar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.fnCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.fnCounts = 0;
  //     }
  //   });
  //   //fn counts  fetch

  //   //fn counts fix fetch
  //   var fnpar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'Final Negotiation',
  //     stage: '',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //     stagestatus: '1',
  //   }
  //   this._mandateservice.activityLeadsCount(fnpar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.fnfixCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.fnfixCounts = 0;
  //     }
  //   });
  //   //fn counts fix fetch

  //   //booking request counts  fetch
  //   var bookingRequestpar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'Deal Closing Requested',
  //     stage: '',
  //     stagestatus: '3',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //   this._mandateservice.activityLeadsCount(bookingRequestpar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.bookingRequestCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.bookingRequestCounts = 0;
  //     }
  //   });
  //   //booking request  fetch

  //   //booking request counts  fetch
  //   var bookingRequestpar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'Closing Request Rejected',
  //     stage: '',
  //     stagestatus: '3',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //   this._mandateservice.activityLeadsCount(bookingRequestpar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.bookingRejCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.bookingRejCounts = 0;
  //     }
  //   });
  //   //booking request  fetch

  //   //booked counts  fetch
  //   var bookedpar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'Deal Closed',
  //     stage: '',
  //     stagestatus: '3',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //   this._mandateservice.activityLeadsCount(bookedpar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.bookedCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.bookedCounts = 0;
  //     }
  //   });
  //   //booked counts fetch

  //   // inactive Counts Fetch
  //   var inactive = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'inactive',
  //     stage: '',
  //     stagestatus: '',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //   this._mandateservice.activityLeadsCount(inactive).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.inactivecounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.inactivecounts = 0;
  //     }
  //   });
  //   // inactive Counts Fetch

  //   //junk visits count detch
  //   var junkpar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'junkvisits',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //   this._mandateservice.activityLeadsCount(junkpar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.junkvisitsCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.junkvisitsCounts = 0;
  //     }
  //   });

  //   //junk leads count detch
  //   var junkleadspar = {
  //     actionfrom: this.todaysdateforcompare,
  //     actionto: this.todaysdateforcompare,
  //     statuss: 'junkleads',
  //     stage: '',
  //     stagestatus: '',
  //     executid: this.rmid,
  //     loginuser: this.userid
  //   }
  //   this._mandateservice.activityLeadsCount(junkleadspar).subscribe(compleads => {
  //     if (compleads['status'] == 'True') {
  //       this.junkleadsCounts = compleads.result[0].uniquee_count;
  //     } else {
  //       this.junkleadsCounts = 0;
  //     }
  //   });

  //   $('#hourlyReport_detail').click();

  //   //here on clicking start now the timer will start and on check in the timer will be stopped
  //   // doActionBasicTimer(action: String) {
  //   //   switch (action) {
  //   //     case 'start':
  //   //       this.basicTimer.start();
  //   //       this.timerstarted = true;
  //   //       break;
  //   //     default:
  //   //       this.totalBreakTime = this.basicTimer.get();
  //   //       this.basicTimer.stop();
  //   //       // $('.close').click();
  //   //       // this.timerstarted = false;
  //   //       // setTimeout(()=>{
  //   //       //   $('body').removeClass('modal-open');
  //   //       // },100)
  //   //       this.closeModal();
  //   //       break;
  //   //   }
  //   // }

  //   //here on clicking the start break button  timer pop up will appear with confirmation
  //   // startBreak(){
  //   //   this.basicTimer.reset();
  //   //   this.basicTimer.stop();
  //   // }

  //   //here on clicking cancel the timer popup will be closed.
  //   //   closeModal(){
  //   //     $('.close').click();
  //   //     setTimeout(()=>{
  //   //       $('body').removeClass('modal-open');
  //   //     },100)
  //   //     this.timerstarted = false;
  //   //   }
  // }

  getDurationTime(time) {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let formattedMinutes: string = String(minutes).padStart(2, '0');
    let formattedSeconds: string = String(seconds).padStart(2, '0');
    let currentTime = hours + ':' + formattedMinutes + ':' + formattedSeconds;
    let timerDifference = getTimeDifference(time.split(' ')[1], currentTime);
    const [hours1, minutes1, seconds1] = timerDifference.split(':');
    return `${hours1}h:${minutes1}m:${seconds1}s`;
  }

  getSelectedAssignSec() {
    var selectedObjects = $("input[name='programming']:checked").map(function () {
      return $(this).val();
    }).get();
    this.selectedAssignSec = selectedObjects;
  }

  getDateRange() {
    const selectedRange = $("input[name='programmingdays']:checked").val();
    this.selectedDateRange = selectedRange;
    if (selectedRange == 'custom') {
      setTimeout(() => {
        $('#customLeadDropdown').click();
      }, 0);
    }
  }

  CustomDate(type) {
    if (type == 'today') {
      this.selectedCustomOption = 'Today';
    } else if (type == 'last7') {
      this.selectedCustomOption = 'Last 7 days'
    } else if (type == 'last15') {
      this.selectedCustomOption = 'Last 15 days'
    }
  }

  sourceHistoryModalClose() {
    this.selectedCustomOption = '';
    $("input[name='programming']").prop("checked", false);
    $("input[name='programmingdays']").prop("checked", false);
  }

  finalSubmit() {

    if (this.selectedAssignSec == null || this.selectedAssignSec == undefined || this.selectedAssignSec.length == 0) {
      swal({
        title: 'Please Select the Lead Stages fro Auto-assign',
        type: 'error',
        confirmButtonText: 'Yes',
        allowOutsideClick: false
      })
    }

    if (this.selectedDateRange == 'custom' && this.selectedCustomOption == 'Custom') {
      swal({
        title: 'Please Select the Custom dates from Dropdown',
        type: 'error',
        confirmButtonText: 'Yes',
        allowOutsideClick: false
      })
    }
  }

  getAllLoginData() {
    this._sharedservice.getAllLoginData().subscribe((resp) => {
      console.log(resp);
      this.executiveListData = resp.Executives;
      this.copyOfExecutiveListData = resp.Executives;
    })
  }

  searchSwitchAccount() {
    console.log(this.switch_account_name)
    if (this.switch_account_name) {
      this.executiveListData = this.copyOfExecutiveListData.filter((exec) => exec.name.toLowerCase().includes(this.switch_account_name.toLowerCase()))
    } else {
      this.executiveListData = this.copyOfExecutiveListData;
    }
  }

  getConfirmationSwitch(account) {
    this.selectedSwitchAccount = account;
    this.confirmationSwitch = true;
  }

  switchToAcc() {

    let adminData = this.executiveListData.filter((exec) => exec.role_IDFK == '1');
    localStorage.setItem('Name', this.selectedSwitchAccount.name);
    localStorage.setItem('Number', this.selectedSwitchAccount.number);
    localStorage.setItem('UserId', this.selectedSwitchAccount.executives_FKID);
    localStorage.setItem('Password', "xxxxxxx");
    localStorage.setItem('Mail', this.selectedSwitchAccount.email);
    localStorage.setItem('Role', this.selectedSwitchAccount.role_IDFK);
    localStorage.setItem('Department', this.selectedSwitchAccount.department_IDFK);
    localStorage.setItem('role_type', this.selectedSwitchAccount.role_type);
    localStorage.setItem('property_ID', this.selectedSwitchAccount.mandate_propidfk);
    localStorage.setItem('whatsappExecId', this.selectedSwitchAccount.executives_FKID);
    localStorage.setItem('prop_suggest', this.selectedSwitchAccount.prop_suggestion);
    localStorage.setItem('mainAccount', 'Admin');
    localStorage.setItem('mainAccount', JSON.stringify(adminData[0]))

    setTimeout(() => {
      this.router.navigateByUrl('/mandate-dashboard?todayvisited=1&from=&to=&property=&propname=&execid=&execname=&stage=&stagestatus=&team=&dashtype=dashboard&htype=mandate&type=leads')
      setTimeout(() => {
        location.reload();
      }, 200)
    }, 100)
  }

  goBackToAdminAccount() {
    swal({
      title: `<small>Switching back to Admin account</small>`,
      text: 'Do you want to proceed?',
      type: "warning",
      showConfirmButton: true,
      confirmButtonText: "Yes, Switch Account",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      allowOutsideClick: false
    }).then((val) => {
      if (val.value == true) {
        let mainAccountStr = localStorage.getItem('mainAccount');
        const mainAccount = JSON.parse(mainAccountStr);
        localStorage.setItem('Name', mainAccount.name);
        localStorage.setItem('Number', mainAccount.number);
        localStorage.setItem('UserId', mainAccount.executives_FKID);
        localStorage.setItem('Password', "xxxxxxx");
        localStorage.setItem('Mail', mainAccount.email);
        localStorage.setItem('Role', mainAccount.role_IDFK);
        localStorage.setItem('Department', mainAccount.department_IDFK);
        localStorage.setItem('role_type', mainAccount.role_type);
        localStorage.setItem('property_ID', mainAccount.mandate_propidfk);
        localStorage.setItem('whatsappExecId', mainAccount.executives_FKID);
        localStorage.setItem('prop_suggest', mainAccount.prop_suggestion);
        localStorage.setItem('mainAccount', 'Admin');
        localStorage.setItem('mainAccount', '')

        setTimeout(() => {
          this.router.navigateByUrl('/mandate-dashboard?todayvisited=1&from=&to=&property=&propname=&execid=&execname=&stage=&stagestatus=&team=&dashtype=dashboard&htype=mandate&type=leads')
          setTimeout(() => {
            location.reload();
          }, 200)
        }, 100)
      }
    });
  }

  closeSwitchModal() {
    this.confirmationSwitch = false;
    this.selectedSwitchAccount = '';
  }

}

function getTimeDifference(startTime: string, endTime: string): string {
  const start = new Date(`1970-01-01T${startTime}Z`);
  const end = new Date(`1970-01-01T${endTime}Z`);
  const differenceInMs = end.getTime() - start.getTime();
  const hours = Math.floor((differenceInMs % 86400000) / 3600000);
  const minutes = Math.floor((differenceInMs % 3600000) / 60000);
  const seconds = Math.floor((differenceInMs % 60000) / 1000);
  return `${Math.abs(hours)}:${Math.abs(minutes)}:${Math.abs(seconds)}`;
}

function convertTimeStringToSeconds(timeString: string): number {
  //map is used to define the date type
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
}