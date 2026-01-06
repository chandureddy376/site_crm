import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedservice } from '../../shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {

  constructor(
    private _sharedservice: sharedservice,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) { }

  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  sevendaysdateforcompare: any;
  todaysDateParam: any;
  last7daysParam: any;
  allVisitsParam: any;
  datecustomfetch: any;
  filterLoader: boolean = false;
  fromdate: any;
  todate: any;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  executive_name: string = '';
  searchTerm_executive: string = '';
  execid: any;
  execname: any;
  userid: any;
  roleid: any;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  listOfAttendanceHistory: any;
  executivesList: any;
  selectedExecLogs: any;
  executiveLogDetails: any;
  isPhotoClicked: boolean = false;
  singleSelectionPhotoData: any;

  ngOnInit() {
    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    this.getleadsdata();
    if (this.roleid == 1 || this.roleid == 2) {
      this.getExecutiveList();
    }
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }

    if (this.renderer) {
      this.renderer.removeStyle(document.body, 'overflow')
    }
  }

  ngAfterViewInit() {
    this.resetScroll();
  }

  getleadsdata() {
    this.route.queryParams.subscribe((param) => {
      this.todaysDateParam = param['today'];
      this.last7daysParam = param['last7'];
      this.allVisitsParam = param['allvisits'];
      this.fromdate = param['from'];
      this.todate = param['to'];
      this.execid = param['execid'];
      this.resetScroll();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0);

      if (((this.fromdate == "" || this.fromdate == null || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined || this.todate == null)) && param['type'] != 'overall') {
        this.datecustomfetch = "Custom";
      } else {
        this.datecustomfetch = this.fromdate + ' - ' + this.todate;
      }

      if (this.todaysDateParam == '1') {
        this.clicked = true;
        this.clicked1 = false;
        this.clicked2 = false;
        this.currentdateforcompare = new Date();
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
        this.fromdate = this.todaysdateforcompare;
        this.todate = this.todaysdateforcompare;
      } else if (this.last7daysParam == '1') {
        this.clicked = false;
        this.clicked1 = true;
        this.clicked2 = false;
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
      } else if (this.allVisitsParam == '1') {
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = true;
        this.fromdate = this.fromdate;
        this.todate = this.todate;
      }
      this.getListOfCheckedIn();
    });
  }

  getExecutiveList() {
    this._sharedservice.getexecutiveslist('', '', '','','').subscribe((exec) => {
      this.executivesList = exec.filter((ex) => ex.ID != 1);
    })
  }

  //here we get the list of check in data and if its checked in then the timer is continued .
  getListOfCheckedIn() {
    let execid;
    if (this.execid == '' || this.execid == undefined || this.execid == null) {
      execid = this.userid
    } else {
      execid = this.execid;
    }
    let param = {
      execid: execid,
      fromdate: this.fromdate,
      todate: this.todate,
      limitparam: 0,
      limitrows: 30,
      loginid: this.userid
    }
    this.filterLoader = true;

    this._sharedservice.getAttendanceLogsData(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'true') {
        this.listOfAttendanceHistory = resp.data;
      } else {
        this.listOfAttendanceHistory = [];
      }
    });
  }

  //here we get the list of selected executive logged details in the pop up. 
  clickedLogsHistroy(log) {
    this.selectedExecLogs = log;
    const parsed = new Date(log.date);
    const formattedDate = moment(log.date).format('YYYY-MM-DD');
    let param = {
      loginid: log.id,
      fromdate: formattedDate,
      todate: formattedDate,
      limitparam: 0,
      limitrows: 30
    }
    this.filterLoader = true;
    this._sharedservice.getCheckedInData(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'True') {
        this.executiveLogDetails = resp.latestdata;
      } else {
        this.executiveLogDetails = [];
      }
    });
  }

  rmchange(event) {
    this.execid = event.target.value;
    this.router.navigate([], {
      queryParams: {
        execid: this.execid
      },
      queryParamsHandling: 'merge'
    })
  }

  refresh() {
    this.execid = '';
    $('#rm_dropdown').dropdown('clear');
    this.router.navigate([], {
      queryParams: {
        today: 1
      }
    })
  }

  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  loadMore() { }

  //this is triggered when custom is clicked to select the dates.
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
        const dateDiff = end.diff(start, 'days');
        if (dateDiff > 30) {
          swal({
            title: 'Date range too long',
            text: 'Please select a date range of 30 days or less.',
            type: 'info',
            showConfirmButton: false,
            timer: 2000
          });
          return;
        }

        this.fromdate = start.format('YYYY-MM-DD');
        this.todate = end.format('YYYY-MM-DD');
        this.router.navigate([], {
          queryParams: {
            allvisits: 1,
            from: this.fromdate,
            to: this.todate,
          },
          // queryParamsHandling: 'merge',
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
      minDate: new Date('2025-03-25'),
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

  clikedImage(exec) {
    this.isPhotoClicked = true;
    this.singleSelectionPhotoData = exec;
  }

  modalback() {
    this.isPhotoClicked = false;
    this.singleSelectionPhotoData = '';
    $('.modalclick').removeClass('modal-backdrop');
    $('.modalclick').removeClass('fade');
    $('.modalclick').removeClass('show');
  }

  photoClose() {
    this.isPhotoClicked = false;
    this.singleSelectionPhotoData = '';
  }

  calculateTotalHours(data) {
    let lastCheck = null;
    let allChecksLength = data.all_checks;
    if (allChecksLength && allChecksLength.length) {
      lastCheck = allChecksLength[allChecksLength.length - 1];
    }
    if (data.all_checks && data.all_checks[0].check_status == 1 && (lastCheck && lastCheck.check_status != 0)) {
      let currentDate = new Date();
      let hours = currentDate.getHours();
      let minutes = currentDate.getMinutes();
      let seconds = currentDate.getSeconds();
      let formattedMinutes: string = String(minutes).padStart(2, '0');
      let formattedSeconds: string = String(seconds).padStart(2, '0');
      let currentTime = hours + ':' + formattedMinutes + ':' + formattedSeconds;
      let timerDifference = getTimeDifference(data.all_checks[0].created_at.split(' ')[1], currentTime);
      const [hrs,min,sec] = timerDifference.split(':');
      return `${hrs}h:${min}m:${sec}s`
    } else {
      let currentDate = new Date();
      let hours = currentDate.getHours();
      let minutes = currentDate.getMinutes();
      let seconds = currentDate.getSeconds();
      let formattedMinutes: string = String(minutes).padStart(2, '0');
      let formattedSeconds: string = String(seconds).padStart(2, '0');
      let currentTime = hours + ':' + formattedMinutes + ':' + formattedSeconds;
      let timerDifference
      if (data.all_checks) {
       let timer = getTimeDifference(data.all_checks[0].created_at.split(' ')[1], lastCheck.created_at.split(' ')[1]);
        const [hrs,min,sec] = timer.split(':');
        timerDifference = `${hrs}h:${min}m:${sec}s`
      } else {
        timerDifference = '00h:00m:00s'
      }
      return timerDifference
    }
  }

  calculateOfflineTimings(time) {
    if (time.online_status == 'offline' && time.logout_time != null) {
      let currentDate = new Date();
      let hours = currentDate.getHours();
      let minutes = currentDate.getMinutes();
      let seconds = currentDate.getSeconds();
      let formattedMinutes: string = String(minutes).padStart(2, '0');
      let formattedSeconds: string = String(seconds).padStart(2, '0');
      let currentTime = hours + ':' + formattedMinutes + ':' + formattedSeconds;
      let timerDifference = getTimeDifference(time.logout_time.split(' ')[1], currentTime);
      const [hours1, minutes1, seconds1] = timerDifference.split(':');
      return `${hours1}h:${minutes1}m:${seconds1}s`;
    }
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
