import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedservice } from '../../shared.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-all-calls',
  templateUrl: './all-calls.component.html',
  styleUrls: ['./all-calls.component.css']
})
export class AllCallsComponent implements OnInit {

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
  public clicked3: boolean = false;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  sevendaysdateforcompare: any;
  liveCallParam: any;
  todaysDateParam: any;
  yesterdaysvisitedparam:any;
  last7daysParam: any;
  allVisitsParam: any;
  datecustomfetch: any;
  filterLoader: boolean = true;
  all_calls_filterLoader: boolean = true;
  fromdate: any;
  todate: any;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  execid: any;
  execname: any;
  callerleads: any;
  liveCallsList: any;
  userid: any;
  roleid: any;
  allCallsList: any;
  missedCallsList: any;
  executivesList: any;
  copyOfExecutivesList: any;
  searchTerm_executive: string = '';
  executiveFilter: boolean = false;
  datefilterview: boolean = false;
  static allCallscount: number = 0;
  totalCallsCount: number = 0;
  connectedCalls: number = 0;
  activeCallsCount: number = 0;
  inActiveCallsCount: number = 0;
  missedCallsCount: number = 0;
  reConnectedCallsCount: number = 0;
  visitsCallsCount: number = 0;
  static missedCallsCount:number = 0;
  canDownload: boolean = false;
  role_type:any;
  yesterdayDateStore: any;

  ngOnInit() {
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');
    this.role_type = localStorage.getItem('role_type');
    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    if(this.roleid == 1 || this.roleid == 2){
      this.canDownload = true;
    }

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

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

    this.getleadsdata();
    if (this.roleid == 1 || this.roleid == 2 || this.role_type == 1) {
      this.getExecutiveList();
    }
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
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

    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  resetScroll() {
    setTimeout(()=>{
    if (this.scrollContainer && this.scrollContainer.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = 0;
      }
    },0)
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeNextActionDateRangePicker();
      this.resetScroll();
    }, 0);
  }

  getleadsdata() {
    this.route.queryParams.subscribe((param) => {
      this.todaysDateParam = param['todayvisited'];
      this.yesterdaysvisitedparam = param['yesterdayvisited'];
      this.last7daysParam = param['last7'];
      this.allVisitsParam = param['allvisits'];
      this.liveCallParam = param['livecalls'];
      this.fromdate = param['from'];
      this.todate = param['to'];
      this.execid = param['execid'];
      this.execname = param['execname'];
      setTimeout(()=>{
        this.resetScroll();
      },0)

      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0);

      if (((this.fromdate == "" || this.fromdate == null || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined || this.todate == null)) && param['type'] != 'overall') {
        this.datecustomfetch = "Custom";
      } else {
        this.datecustomfetch = this.fromdate + ' - ' + this.todate;
      }

      if (this.execid == '' || this.execid == undefined || this.execid == null) {
        this.executiveFilter = false;
        $('#rm_dropdown').dropdown('clear');
        this.execid = '';
        this.execname = '';
      } else {
        this.executiveFilter = true;
      }

      if (this.role_type == 1 && (this.execid == null || this.execid == undefined || this.execid == '')) {
        this.execid = localStorage.getItem('UserId');
      }

      if (this.todaysDateParam == '1') {
        this.clicked = true;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = false;
        this.currentdateforcompare = new Date();
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
        this.fromdate = this.todaysdateforcompare;
        this.todate = this.todaysdateforcompare;
        this.geAllDashCounts();
        this.getAllCallsData();
        this.getMissedCallsData();
      }else if (this.yesterdaysvisitedparam == '1') {
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
        this.clicked2 = false;
        this.clicked3 = true;
        this.filterLoader = true;

        this.fromdate = this.yesterdayDateStore;
        this.todate = this.yesterdayDateStore;
        this.filterLoader = true;
        this.geAllDashCounts();
        this.getAllCallsData();
        this.getMissedCallsData();
      } else if (this.last7daysParam == '1') {
        this.clicked = false;
        this.clicked1 = true;
        this.clicked2 = false;
        this.clicked3 = false;
        this.currentdateforcompare = new Date();
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, '0');
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, '0');
        this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
        //getting the date of the -6days
        var sevendaysago = new Date(this.currentdateforcompare);
        sevendaysago.setDate(sevendaysago.getDate() - 6);
        var sevendaysmonth = sevendaysago.getMonth() + 1;
        var sevendaysmonthwithzero = sevendaysmonth.toString().padStart(2, "0");
        var sevendays = sevendaysago.getDate();
        var sevendayswithzero = sevendays.toString().padStart(2, "0");
        this.sevendaysdateforcompare = sevendaysago.getFullYear() + "-" + sevendaysmonthwithzero + "-" + sevendayswithzero;
        this.fromdate = this.sevendaysdateforcompare;
        this.todate = this.todaysdateforcompare;
        this.geAllDashCounts();
        this.getAllCallsData();
        this.getMissedCallsData();
      } else if (this.allVisitsParam == '1') {
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = true;
        this.clicked3 = false;
        this.fromdate = this.fromdate;
        this.todate = this.todate;
        this.geAllDashCounts();
        this.getAllCallsData();
        this.getMissedCallsData();
      } 
      this.getLiveCallsData();
      // else if (this.liveCallParam == '1') {
      //   $('#live_calls_detail').click();
      //   this.getLiveCallsData();
      // }
    });
  }

  geAllDashCounts() {
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
      } else {
        this.totalCallsCount = 0;
        this.connectedCalls = 0;
        this.activeCallsCount = 0;
        this.inActiveCallsCount = 0;
        this.missedCallsCount = 0;
        this.reConnectedCallsCount = 0;
        this.visitsCallsCount = 0;
      }
    })
  }

  getAllCallsData() {
    AllCallsComponent.allCallscount = 0;

    let param = {
      loginid: this.userid,
      limit: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid,
      stage: 'overall'
    }
    this.all_calls_filterLoader = true;
    this._sharedservice.getAllCalls(param).subscribe({
      next: (resp: any) => {
        this.all_calls_filterLoader = false;
        this.filterLoader = false;
        this.allCallsList = resp.success;
      }, error: (err) => {
        this.all_calls_filterLoader = false;
        this.filterLoader = false;
        console.log('No Recordings found', err);
        this.allCallsList = [];
      }
    })
  }

  getMissedCallsData() {
    AllCallsComponent.missedCallsCount = 0;

    let param = {
      loginid: this.userid,
      limit: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid,
      stage : 'missed'
    }
    this.all_calls_filterLoader = true;
    this._sharedservice.getAllCalls(param).subscribe({
      next: (resp: any) => {
        this.all_calls_filterLoader = false;
        this.filterLoader = false;
        this.missedCallsList = resp.success;
      }, error: (err) => {
        this.all_calls_filterLoader = false;
        this.filterLoader = false;
        console.log('No Recordings found', err);
        this.missedCallsList = [];
      }
    })
  }

  getExecutiveList() {
    let teamlead;
    if (this.role_type == 1) {
      teamlead = this.userid
    } else {
      teamlead = '';
    }
    this._sharedservice.getexecutiveslist('', '', '','',teamlead).subscribe((exec) => {
      this.executivesList = exec;
      this.copyOfExecutivesList = exec;
    })
  }

  getLiveCallsData() {
    this.filterLoader = true;
    let id;
    if(this.roleid == 1 || this.roleid == 2){
      id= '';
    } else if(this.role_type == 1){
      if(this.execid == null || this.execid == undefined || this.execid == ''){
        id  = this.userid;
      } else {
         id  = this.execid;
      }
    } else {
      id  = this.userid;
    }
    this._sharedservice.getLiveCallsList(id).subscribe((resp) => {
      this.filterLoader = false;
      this.all_calls_filterLoader = false;
      if (resp.status == 'success') {
        this.liveCallsList = resp.success;
      } else {
        this.liveCallsList = [];
      }
    })
  }

  closeLiveCallsModal() {
    setTimeout(() => {
      this._location.back();
    }, 0)
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

  rmchange(vals) {
    this.filterLoader = true;
    this.execid = vals.target.value;
    this.execname = vals.target.options[vals.target.options.selectedIndex].text;
    this.router.navigate([], {
      queryParams: {
        execid: this.execid,
        execname: this.execname
      },
      queryParamsHandling: 'merge',
    });
  }

  callStatus(type) { }

  callType(type) { }

  loadMoreAllCallsLeads() {
    let limit = AllCallsComponent.allCallscount += 30;
    console.log(limit)
    let param = {
      loginid: this.userid,
      limit: limit,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid,
      stage: 'overall'
    }
    let livecount = this.allCallsList.length;
    if (livecount < this.totalCallsCount) {
      this._sharedservice.getAllCalls(param).subscribe({
        next: (resp: any) => {
          this.allCallsList = this.allCallsList.concat(resp.success);
        }, error: (err) => {
          console.log(err);
        }
      })
    }
  }

  loadMoreMissedCallsLeads() {
    let limit = AllCallsComponent.missedCallsCount += 30;
    let param = {
      loginid: this.userid,
      limit: limit,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      execid: this.execid,
      stage : 'missed'
    }
    let livecount = this.missedCallsList.length;
    if (livecount < this.missedCallsCount) {
      this._sharedservice.getAllCalls(param).subscribe({
        next: (resp: any) => {
          this.missedCallsList = this.missedCallsList.concat(resp.success);
        }, error: (err) => {
          console.log(err);
        }
      })
    }
  }

  refresh() {
    this.execid = '';
    this.execname = '';
    this.executiveFilter = false;
    this.datefilterview = false;
    this.fromdate = '';
    this.todate = '';
    $('#rm_dropdown').dropdown('clear');
    this.router.navigate(['/all-calls'], {
      queryParams: {
        todayvisited: 1,
        from: '',
        to: '',
        execid: '',
        execname: '',
      }
    });
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

  getDurationTime(time) {
    if(time){
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
    } else return '---'
  }

  getAudioFilesUrlofClient(file) {
    const url = file;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
            },
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

function getTimeDifference(startTime: string, endTime: string): string {
  const start = new Date(`1970-01-01T${startTime}Z`);
  const end = new Date(`1970-01-01T${endTime}Z`);
  const differenceInMs = end.getTime() - start.getTime();
  const hours = Math.floor((differenceInMs % 86400000) / 3600000);
  const minutes = Math.floor((differenceInMs % 3600000) / 60000);
  const seconds = Math.floor((differenceInMs % 60000) / 1000);
  return `${Math.abs(hours)}:${Math.abs(minutes)}:${Math.abs(seconds)}`;
}
