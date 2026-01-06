import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedservice } from '../../shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-all-calls-listing',
  templateUrl: './all-calls-listing.component.html',
  styleUrls: ['./all-calls-listing.component.css']
})
export class AllCallsListingComponent implements OnInit {

  constructor(
    private _sharedservice: sharedservice,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private sanitizer: DomSanitizer,
  ) { }

  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  datecustomfetch: any;
  filterLoader: boolean = true;
  fromdate: any;
  todate: any;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  execid: any;
  execname: any;
  callerleads: any;
  userid: any;
  roleid: any;
  executivesList: any;
  copyOfExecutivesList: any;
  searchTerm_executive: string = '';
  executiveFilter: boolean = false;
  datefilterview: boolean = false;
  static count: number;
  totalCallsCount: number = 0;
  connectedCalls: number = 0;
  activeCallsCount: number = 0;
  inActiveCallsCount: number = 0;
  missedCallsCount: number = 0;
  onlymissedCallsCount: number = 0;
  reConnectedCallsCount: number = 0;
  visitsCallsCount: number = 0;
  totalcallsparam: any;
  connectedcallsparam: any;
  activecallsparam: any;
  inactivecallsparam: any;
  missedcallsparam: any;
  reconnectedcallsparam: any;
  visitfixedcallsparam: any;
  status: any;
  statusFilter: boolean = false;


  ngOnInit() {
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');
    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    // *********************load the required template files*********************

    this.getleadsdata();
    if (this.roleid == 1 || this.roleid == 2) {
      this.getExecutiveList();
    }
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }

    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeNextActionDateRangePicker();
      this.resetScroll();
    }, 0);
  }

  getExecutiveList() {
    let teamlead;
    if (localStorage.getItem('role_type') == '1') {
      teamlead = this.userid
    } else {
      teamlead = '';
    }
    this._sharedservice.getexecutiveslist('', '', '', '', teamlead).subscribe((exec) => {
      this.executivesList = exec;
      this.copyOfExecutivesList = exec;
    })
  }

  getleadsdata() {
    this.route.queryParams.subscribe((param) => {
      this.totalcallsparam = param['allcalls'];
      this.connectedcallsparam = param['connected'];
      this.activecallsparam = param['active'];
      this.inactivecallsparam = param['inactive'];
      this.missedcallsparam = param['missed'];
      this.visitfixedcallsparam = param['visitsfixed'];
      this.fromdate = param['from'];
      this.todate = param['to'];
      this.execid = param['execid'];
      this.execname = param['execname'];
      this.status = param['status'];
      this.resetScroll();

      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0);

      if (((this.fromdate == "" || this.fromdate == null || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined || this.todate == null))) {
        this.datefilterview = false;
      } else {
        this.datefilterview = true;
      }

      if (this.execid == '' || this.execid == undefined || this.execid == null) {
        this.executiveFilter = false;
      } else {
        this.executiveFilter = true;
      }

      if (this.status == undefined || this.status == null || this.status == '') {
        this.statusFilter = false;
      } else {
        this.statusFilter = true;
      }

      this.getAllCounts();

      if (this.totalcallsparam == 1) {
        this.getTotalCallsLeads();
      } else if (this.connectedcallsparam == 1) {
        this.getConnectedCallsLeads();
      } else if (this.activecallsparam == 1) {
        this.getActiveCallsLeads();
      } else if (this.inactivecallsparam == 1) {
        this.getInactiveCallsLeads();
      } else if (this.missedcallsparam == 1) {
        this.getMissedCallsLeads();
      } else if (this.visitfixedcallsparam == 1) {
        this.getVisitFixedLeads();
      }
    });
  }

  getAllCounts() {
    let param = {
      loginid: this.userid,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid
    }

    this._sharedservice.getAllCallsCounts(param).subscribe((resp) => {
      if (resp.status == 'success') {
        this.totalCallsCount = resp.success[0].overall;
        this.connectedCalls = resp.success[0].connected;
        this.activeCallsCount = resp.success[0].active;
        this.inActiveCallsCount = resp.success[0].inactive;
        this.missedCallsCount = resp.success[0].missed;
        this.reConnectedCallsCount = resp.success[0].reconnected;
        this.visitsCallsCount = resp.success[0].visitsfixed;
        this.onlymissedCallsCount = resp.success[0].missedF;
      } else {
        this.totalCallsCount = 0;
        this.connectedCalls = 0;
        this.activeCallsCount = 0;
        this.inActiveCallsCount = 0;
        this.missedCallsCount = 0;
        this.reConnectedCallsCount = 0;
        this.visitsCallsCount = 0;
        this.onlymissedCallsCount = 0;
      }
    })
  }

  getTotalCallsLeads() {
    AllCallsListingComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".allcalls_section").addClass("active");
    }, 0)

    let param = {
      loginid: this.userid,
      limit: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid,
      stage: 'overall'
    }
    this.filterLoader = true;
    this._sharedservice.getAllCalls(param).subscribe({
      next: (resp: any) => {
        this.filterLoader = false;
        this.callerleads = resp.success;
      }, error: (err) => {
        this.filterLoader = false;
        console.log('No Recordings found', err);
        this.callerleads = [];
      }
    })
  }

  getConnectedCallsLeads() {
    AllCallsListingComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".connected_section").addClass("active");
    }, 0)

    let param = {
      loginid: this.userid,
      limit: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid,
      stage: 'connected'
    }
    this.filterLoader = true;
    this._sharedservice.getAllCalls(param).subscribe({
      next: (resp: any) => {
        this.filterLoader = false;
        this.callerleads = resp.success;
      }, error: (err) => {
        this.filterLoader = false;
        console.log('No Recordings found', err);
        this.callerleads = [];
      }
    })
  }

  getActiveCallsLeads() {
    AllCallsListingComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".active_section").addClass("active");
    }, 0)

    let param = {
      loginid: this.userid,
      limit: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid,
      stage: 'active'
    }
    this.filterLoader = true;
    this._sharedservice.getAllCalls(param).subscribe({
      next: (resp: any) => {
        this.filterLoader = false;
        this.callerleads = resp.success;
      }, error: (err) => {
        this.filterLoader = false;
        console.log('No Recordings found', err);
        this.callerleads = [];
      }
    })
  }

  getInactiveCallsLeads() {
    AllCallsListingComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".inactive_section").addClass("active");
    }, 0)

    let param = {
      loginid: this.userid,
      limit: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid,
      stage: 'inactive'
    }
    this.filterLoader = true;
    this._sharedservice.getAllCalls(param).subscribe({
      next: (resp: any) => {
        this.filterLoader = false;
        this.callerleads = resp.success;
      }, error: (err) => {
        this.filterLoader = false;
        console.log('No Recordings found', err);
        this.callerleads = [];
      }
    })
  }

  getMissedCallsLeads() {
    AllCallsListingComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".missed_section").addClass("active");
    }, 0)
    let callStatus;
    if (this.status == 'reconnect') {
      callStatus = 'reconnected';
    } else if (this.status == 'missed') {
      callStatus = 'missedF';
    } else {
      callStatus = 'missed';
    }
    let param = {
      loginid: this.userid,
      limit: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid,
      stage: callStatus
    }
    this.filterLoader = true;
    this._sharedservice.getAllCalls(param).subscribe({
      next: (resp: any) => {
        this.filterLoader = false;
        this.callerleads = resp.success;
      }, error: (err) => {
        this.filterLoader = false;
        console.log('No Recordings found', err);
        this.callerleads = [];
      }
    })
  }

  getVisitFixedLeads() {
    AllCallsListingComponent.count = 0;
    this.filterLoader = true;
    setTimeout(() => {
      $(".other_section").removeClass("active");
      $(".visitfixed_section").addClass("active");
    }, 0)

    let param = {
      loginid: this.userid,
      limit: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid,
      stage: 'visitsfixed'
    }
    this.filterLoader = true;
    this._sharedservice.getAllCalls(param).subscribe({
      next: (resp: any) => {
        this.filterLoader = false;
        this.callerleads = resp.success;
      }, error: (err) => {
        this.filterLoader = false;
        console.log('No Recordings found', err);
        this.callerleads = [];
      }
    })
  }

  loadMoreassignedleads() {
    console.log('triggered data')
    let limit;
    limit = AllCallsListingComponent.count += 30;

    let livecount = this.callerleads.length;
    let param, count;
    if (this.totalcallsparam == 1) {
      param = {
        loginid: this.userid,
        limit: limit,
        limitrows: 30,
        from: this.fromdate,
        to: this.todate,
        execid: this.execid,
        stage: 'overall'
      }
      count = this.totalCallsCount;
    } else if (this.connectedcallsparam == 1) {
      param = {
        loginid: this.userid,
        limit: limit,
        limitrows: 30,
        from: this.fromdate,
        to: this.todate,
        execid: this.execid,
        stage: 'connected'
      }
      count = this.connectedCalls;
    } else if (this.activecallsparam == 1) {
      param = {
        loginid: this.userid,
        limit: limit,
        limitrows: 30,
        from: this.fromdate,
        to: this.todate,
        execid: this.execid,
        stage: 'active'
      }
      count = this.activeCallsCount;
    } else if (this.inactivecallsparam == 1) {
      param = {
        loginid: this.userid,
        limit: limit,
        limitrows: 30,
        from: this.fromdate,
        to: this.todate,
        execid: this.execid,
        stage: 'inactive'
      }
      count = this.inActiveCallsCount;
    } else if (this.missedcallsparam == 1) {
      let callStatus;
      if (this.status == 'reconnect') {
        callStatus = 'reconnected';
        count = this.reConnectedCallsCount;
      } else if (this.status == 'missed') {
        callStatus = 'missedF';
        count = this.onlymissedCallsCount;
      } else {
        callStatus = 'missed';
        count = this.missedCallsCount;
      }
      param = {
        loginid: this.userid,
        limit: limit,
        limitrows: 30,
        from: this.fromdate,
        to: this.todate,
        execid: this.execid,
        stage: callStatus,
      }
    } else if (this.visitfixedcallsparam == 1) {
      param = {
        loginid: this.userid,
        limit: limit,
        limitrows: 30,
        from: this.fromdate,
        to: this.todate,
        execid: this.execid,
        stage: 'visitsfixed'
      }
      count = this.visitsCallsCount;
    }

    this.filterLoader = true;
    console.log(livecount,count)
    if (livecount <= count) {
      this._sharedservice.getAllCalls(param).subscribe({
        next: (resp: any) => {
          console.log(resp)
          this.filterLoader = false;
          this.callerleads = this.callerleads.concat(resp.success);
        }, error: (err) => {
          console.log(err)
          this.filterLoader = false;
          console.log('No Recordings found', err);
        }
      })
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
        // const dayDiff = end.diff(start, 'days');
        // if (dayDiff > 7) {
        //   swal({
        //     title: 'Date Range Too Large( Max 7 days )',
        //     text: 'Filtering is only allowed for up to 7 days. Please select a shorter range.',
        //     type: 'warning',
        //     showConfirmButton: false,
        //     timer: 3000
        //   });
        //   const today = moment().startOf('day');
        //   $('#nextActionDates').data('daterangepicker').setStartDate(today);
        //   $('#nextActionDates').data('daterangepicker').setEndDate(today);
        //   $('#nextActionDates span').html('Select Date Range');
        //   return;
        // } else {
        this.fromdate = start.format('YYYY-MM-DD');
        this.todate = end.format('YYYY-MM-DD');
        this.datefilterview = true;
        this.router.navigate([], {
          queryParams: {
            allvisits: '1',
            execid: this.execid,
            from: this.fromdate,
            to: this.todate,
            execname: this.execname
          }, queryParamsHandling: 'merge'
        });
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
      maxDate: new Date(),
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

  filterExecutive() {
    if (this.searchTerm_executive != '') {
      this.executivesList = this.copyOfExecutivesList.filter(exec =>
        exec.Name.toLowerCase().includes(this.searchTerm_executive.toLowerCase())
      );
    } else {
      this.executivesList = this.copyOfExecutivesList
    }
  }

  onCheckboxChangeExec(exec) {
    if (exec != '' && exec != undefined && exec != null) {
      this.execid = exec.ID;
      this.execname = exec.Name;
      this.executiveFilter = true;
      this.router.navigate([], {
        queryParams: {
          execid: this.execid,
          execname: this.execname,
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.execid = '';
      this.execname = '';
      this.executiveFilter = false;
    }
  }

  refresh() {
    this.execid = '';
    this.execname = '';
    this.executiveFilter = false;
    this.datefilterview = false;
    this.statusFilter = false;
    this.fromdate = '';
    this.todate = '';
    this.status = '';
    $('#rm_dropdown').dropdown('clear');
    if (this.totalcallsparam == 1) {
      this.router.navigate(['/all-calls-listing'], {
        queryParams: {
          allcalls: 1,
          from: '',
          to: '',
          execid: '',
          execname: '',
        }
      });
    } else if (this.connectedcallsparam == 1) {
      this.router.navigate(['/all-calls-listing'], {
        queryParams: {
          connected: 1,
          from: '',
          to: '',
          execid: '',
          execname: '',
        }
      });
    } else if (this.activecallsparam == 1) {
      this.router.navigate(['/all-calls-listing'], {
        queryParams: {
          active: 1,
          from: '',
          to: '',
          execid: '',
          execname: '',
        }
      });
    } else if (this.inactivecallsparam == 1) {
      this.router.navigate(['/all-calls-listing'], {
        queryParams: {
          inactive: 1,
          from: '',
          to: '',
          execid: '',
          execname: '',
        }
      });
    } else if (this.missedcallsparam == 1) {
      this.router.navigate(['/all-calls-listing'], {
        queryParams: {
          missed: 1,
          from: '',
          to: '',
          execid: '',
          execname: '',
          status: ''
        }
      });
    } else if (this.visitfixedcallsparam == 1) {
      this.router.navigate(['/all-calls-listing'], {
        queryParams: {
          visitsfixed: 1,
          from: '',
          to: '',
          execid: '',
          execname: '',
        }
      });
    }
  }

  dateClose() {
    this.datefilterview = false;
    this.fromdate = '';
    this.todate = '';
    this.router.navigate([], {
      queryParams: {
        from: '',
        to: ''
      },
      queryParamsHandling: 'merge'
    })
  }

  executiveClose() {
    this.executiveFilter = false;
    this.execid = '';
    this.execname = '';
    this.router.navigate([], {
      queryParams: {
        execid: '',
        execname: ''
      },
      queryParamsHandling: 'merge'
    })
  }

  statusClose() {
    this.statusFilter = false;
    this.status = '';
    this.router.navigate([], {
      queryParams: {
        status: '',
      },
      queryParamsHandling: 'merge'
    })
  }

  callStatus(type) {
    this.status = type;
    this.router.navigate([], {
      queryParams: {
        status: type
      }, queryParamsHandling: 'merge'
    })
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

  triggerCall(lead, type) {
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
    swal({
      title: 'Initiate Outbound Call',
      html: `Do you want to place a call to <br><stronsg>${lead.leadname}</strong> (${lead.callto})`,
      type: 'warning',
      confirmButtonText: "Call",
      cancelButtonText: "Cancel",
      showConfirmButton: true,
      showCancelButton: true
    }).then((val) => {
      this.filterLoader = true;
      if (val.value == true) {
        const cleanedNumber = lead.callto.startsWith('91') && lead.callto.length > 10 ? lead.callto.slice(2) : lead.callto;
        let param = {
          execid: this.userid,
          number: cleanedNumber,
          leadid: lead.leadid,
          starttime: formattedDateTime,
          modeofcall: lead.modeofcall,
          rmid: lead.Exec_IDFK
        }
        this._sharedservice.postTriggerCall(param).subscribe((resp) => {
          this.filterLoader = false;
          if (resp.status == 'success') {
            this._sharedservice.setOnCallSelection('oncall')
          } else {
            swal({
              title: 'Call Not Connected',
              html: `The call could not be completed to <br><stronsg>${lead.leadname}</strong> (${lead.callto}) Please try again later.`,
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

}
