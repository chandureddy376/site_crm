import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedservice } from '../../shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-calls-executives-report',
  templateUrl: './calls-executives-report.component.html',
  styleUrls: ['./calls-executives-report.component.css']
})
export class CallsExecutivesReportComponent implements OnInit {

  constructor(
    private _sharedservice: sharedservice,
    private router: Router,
    private route: ActivatedRoute,
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
  executive_name:string='';
  searchTerm_executive:string='';
  execid: any;
  execname: any;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  callerleads:any;


  ngOnInit() {
    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    this.getleadsdata();
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(){
    this.resetScroll();
  }

  getleadsdata() {
    this.route.queryParams.subscribe((param) => {
      this.todaysDateParam = param['today'];
      this.last7daysParam = param['last7'];
      this.allVisitsParam = param['allvisits'];
      this.fromdate = param['from'];
      this.todate = param['to'];
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
    });
  }

  searchExecutive() {
    if (this.executive_name) {
          // this.executivesList = this.copyExecutivesList.filter((exec) => {
          //   return exec.overall == 0 && exec.ExecName.toLowerCase().includes(this.executive_name.toLowerCase());
          // })
        } else {
          // this.executivesList = this.copyExecutivesList;
        }
  }

  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  refresh(){}

  loadMore(){}

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
