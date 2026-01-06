import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mandateservice } from '../../mandate.service';
import { sharedservice } from '../../shared.service';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-call-insights',
  templateUrl: './call-insights.component.html',
  styleUrls: ['./call-insights.component.css']
})
export class CallInsightsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _mandateService: mandateservice,
    private _sharedservice: sharedservice,
    public datepipe: DatePipe) { }

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
  mandateexecutives: any;
  roleid: any;
  userid: any;
  execid: any;
  execname: any;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  executiveTodayInfo:any;

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
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
    this.getExecutivesList();
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

    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  getExecutivesList() {
    this._mandateService.fetchmandateexecutuves('','','','').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      }
    })
  }

  getleadsdata() {
    this.route.queryParams.subscribe((param) => {
      this.todaysDateParam = param['today'];
      this.last7daysParam = param['last7'];
      this.allVisitsParam = param['allvisits'];
      this.fromdate = param['from'];
      this.todate = param['to'];
      this.execid = param['execid'];
      this.execname = param['execname'];

      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0);

      if (((this.fromdate == "" || this.fromdate == null || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined || this.todate == null)) && param['type'] != 'overall') {
        this.datecustomfetch = "Custom";
      } else {
        this.datecustomfetch = this.fromdate + ' - ' + this.todate;
      }

      if (this.execid == '' || this.execid == undefined || this.execid == null) {
        this.execid = '';
        this.execname = '';
        $('#rm_dropdown').dropdown('clear');
      } else {
        this.execid = this.execid;
        this.execname = this.execname;
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
        this.getAllCounts();
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
        this.getAllCounts();
      } else if (this.allVisitsParam == '1') {
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = true;
        this.fromdate = this.fromdate;
        this.todate = this.todate;
        this.getAllCounts();
      }
    });
  }

  getAllCounts() {

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

  refresh() {
    $('#rm_dropdown').dropdown('clear');
    this.execid = '';
    this.execname = '';
    this.router.navigate(['/call-dashboard'], {
      queryParams: {
        today: 1,
        from: '',
        to: '',
      }
    });
  }

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
        this.fromdate = start.format('YYYY-MM-DD');
        this.todate = end.format('YYYY-MM-DD');
        this.router.navigate([], {
          queryParams: {
            allvisits: 1,
            from: this.fromdate,
            to: this.todate,
            execid: this.execid,
            execname: this.execname
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

}
