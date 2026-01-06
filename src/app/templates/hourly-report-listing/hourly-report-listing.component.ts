import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sharedservice } from '../../shared.service'
import { Subscription } from 'rxjs';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-hourly-report-listing',
  templateUrl: './hourly-report-listing.component.html',
  styleUrls: ['./hourly-report-listing.component.css']
})
export class HourlyReportListingComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _sharedservice: sharedservice,
    public datepipe: DatePipe) { }

  roleid: any;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  sevendaysdateforcompare: any;
  filterLoader: boolean = true;
  execid: any;
  execname: any;
  retailExecutives: any;
  copyOfretailExecutives: any;
  searchTerm_executive: string = '';
  sourceFilter: boolean = false;
  searchTerm_source: string = '';
  sourceList: any;
  copyofsources: any;
  executivefilterview: boolean = false;
  @ViewChild('timeList') timeList: ElementRef;
  source: any;
  fromDate: any;
  toDate: any;
  fromTime: any;
  toTime: any;
  datecustomfetch: any = 'Custom';
  todaysDateParam: any;
  last7daysParam: any;
  allVisitsParam: any;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  status: any;
  callerleads: any;
  stageList: any[] = [
    { name: 'General Followups', value: 'GF' },
    { name: 'Normal Calls', value: 'NC' },
    { name: 'USV Fix', value: 'USV-Fix' },
    { name: 'USV Done', value: 'USV-Done' },
    { name: 'SV Fix', value: 'SV-Fix' },
    { name: 'SV Done', value: 'SV-Done' },
    { name: 'RSV Fix', value: 'RSV-Fix' },
    { name: 'RSV Done', value: 'RSV-Done' },
    { name: 'FN Fix', value: 'FN-Fix' },
    { name: 'FN Done', value: 'FN-Done' },
    { name: 'Inactive', value: 'Inactive' },
    { name: 'Junk Leads', value: 'JunkLeads' },
    { name: 'Junk Visits', value: 'JunkVisits' },
    { name: 'Booking Request', value: 'BR' },
    { name: 'Booked', value: 'Booked' },
    { name: 'Others', value: 'Others' },
  ];
  copyOfStageList: any;
  searchTerm_stage: string = '';
  stageFilter: boolean = false;

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.copyOfStageList = this.stageList;
    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });
    this.getRetailExec();
    this.getsourcelist();
    this.getLeadsData();

  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
    this.initializeNextActionDateRangePicker();
     },0);
  }

  //here we get the list of queryparams data
  getLeadsData() {
    this.route.queryParams.subscribe((param) => {
      this.todaysDateParam = param['today'];
      this.last7daysParam = param['last7'];
      this.allVisitsParam = param['allvisits'];
      this.fromDate = param['from'];
      this.toDate = param['to'];
      this.execid = param['execid'];
      this.execname = param['execname'];
      this.fromTime = param['fromtime'];
      this.toTime = param['totime'];
      this.status = param['status'];
      this.filterLoader = true;
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0);

      if (((this.fromDate == "" || this.fromDate == null || this.fromDate == undefined) || (this.toDate == '' || this.toDate == undefined || this.toDate == null))) {
        this.datecustomfetch = "Custom";
      } else {
        this.datecustomfetch = this.fromDate + ' - ' + this.toDate;
        if (this.fromDate != this.toDate) {
          this.fromTime = '';
          this.toTime = '';
        }
      }

      if (((this.fromTime == '' || this.fromTime == undefined || this.fromTime == null) || (this.toTime == '' || this.toTime == undefined || this.toTime == null)) && this.fromDate == this.toDate && param['type'] != 'overall') {
        this.fromTime = '';
        this.toTime = '';
        $('.time_zone').removeClass('active');
        $('.overall_day').addClass('active');
      } else {
        if (this.fromTime == '09:30' && this.toTime == '10:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.time_list').addClass('active');
          }, 0)
        } else if (this.fromTime == '10:30' && this.toTime == '11:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.time_list1').addClass('active');
          }, 0)
        } else if (this.fromTime == '11:30' && this.toTime == '12:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.time_list2').addClass('active');
          }, 0)
        } else if (this.fromTime == '12:30' && this.toTime == '13:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.time_list3').addClass('active');
          }, 0)
        } else if (this.fromTime == '13:30' && this.toTime == '14:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.time_list4').addClass('active');
          }, 0)
        } else if (this.fromTime == '14:30' && this.toTime == '15:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.time_list5').addClass('active');
          }, 0)
        } else if (this.fromTime == '15:30' && this.toTime == '16:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.time_list6').addClass('active');
          }, 0)
        } else if (this.fromTime == '16:30' && this.toTime == '17:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.time_list7').addClass('active');
          }, 0)
        } else if (this.fromTime == '17:30' && this.toTime == '18:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.time_list8').addClass('active')
          }, 0)
        } else if (this.fromTime == '18:30' && this.toTime == '19:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.time_list9').addClass('active');
          }, 0)
        } else if (this.fromTime == '00:00' && this.toTime == '09:30') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.before9_day').addClass('active');
          }, 0)
        } else if (this.fromTime == '19:30' && this.toTime == '23:59') {
          setTimeout(() => {
            $('.time_zone').removeClass('active');
            $('.after7_day').addClass('active');
          }, 0)
        }
      }

      if (this.status == '' || this.status == undefined || this.status == null) {
        this.stageFilter = false;
      } else {
        this.stageFilter = true;
      }

      if (this.execid == '' || this.execid == undefined || this.execid == null) {
        this.executivefilterview = false;
        this.execid = '';
        this.execname = '';
      } else {
        this.executivefilterview = true;
      }

      if (this.source == '' || this.source == undefined || this.source == null) {
        this.sourceFilter = false;
        this.source = '';
      } else {
        this.sourceFilter = true;
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
        this.fromDate = this.todaysdateforcompare;
        this.toDate = this.todaysdateforcompare;
        this.getAllLeadsData();
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
        this.fromDate = this.sevendaysdateforcompare;
        this.toDate = this.todaysdateforcompare;
        this.getAllLeadsData();
      } else if (this.allVisitsParam == '1') {
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = true;
        this.fromDate = this.fromDate;
        this.toDate = this.toDate;
        this.getAllLeadsData();
      }

    })
  }

  //In this method leads data.
  getAllLeadsData() {
    let param = {
      fromdate: this.fromDate,
      todate: this.toDate,
      fromtime: this.fromTime,
      totime: this.toTime,
      execid: this.execid,
      status: this.status,
      source: this.source
    }
    this._sharedservice.getExecutiveHourlyReportListing(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'True') {
        this.callerleads = resp['Exec_list'];
      } else {
        this.callerleads = [];
      }
    })
  }

  //here we get the list of executives to show in the dropdown.
  getRetailExec() {
    let teamlead;
    if (localStorage.getItem('role_type') == '1') {
      teamlead = localStorage.getItem('UserId');
    } else {
      teamlead = '';
    }
    this._sharedservice.getexecutiveslist('','','','',teamlead).subscribe((exec) => {
      this.retailExecutives = exec;
      this.copyOfretailExecutives = exec;
    })
  }

  //here we get the list sources
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

  //here we get the selected time zone.
  selectedTimeZone(time) {
    let overalltype = '';
    $('.time_zone').removeClass('active');
    if (time == '09:30') {
      $('.time_list').addClass('active');
      this.fromTime = '09:30';
      this.toTime = '10:30';
    } else if (time == '10:30') {
      $('.time_list1').addClass('active');
      this.fromTime = '10:30';
      this.toTime = '11:30';
    } else if (time == '11:30') {
      $('.time_list2').addClass('active');
      this.fromTime = '11:30';
      this.toTime = '12:30';
    } else if (time == '12:30') {
      $('.time_list3').addClass('active');
      this.fromTime = '12:30';
      this.toTime = '13:30';
    } else if (time == '1:30') {
      $('.time_list4').addClass('active');
      this.fromTime = '13:30';
      this.toTime = '14:30';
    } else if (time == '2:30') {
      $('.time_list5').addClass('active');
      this.fromTime = '14:30';
      this.toTime = '15:30';
    } else if (time == '3:30') {
      $('.time_list6').addClass('active');
      this.fromTime = '15:30';
      this.toTime = '16:30';
    } else if (time == '4:30') {
      $('.time_list7').addClass('active');
      this.fromTime = '16:30';
      this.toTime = '17:30';
    } else if (time == '5:30') {
      $('.time_list8').addClass('active');
      this.fromTime = '17:30';
      this.toTime = '18:30';
    } else if (time == '6:30') {
      $('.time_list9').addClass('active');
      this.fromTime = '18:30';
      this.toTime = '19:30';
    } else if (time == 'overall') {
      $('.overall_day').addClass('active');
      this.fromTime = '';
      this.toTime = '';
      overalltype = 'overall';
    } else if (time == 'before9') {
      $('.before9_day').addClass('active');
      this.fromTime = '00:00';
      this.toTime = '09:30';
    } else if (time == 'after7') {
      $('.after7_day').addClass('active');
      this.fromTime = '19:30';
      this.toTime = '23:59';
    }
    this.router.navigate([], {
      queryParams: {
        fromtime: this.fromTime,
        totime: this.toTime,
        type: overalltype
      },
      queryParamsHandling: 'merge'
    })
  }

  //Executive filter method
  onCheckboxExecutiveChange() {
    var checkid = $("input[name='executiveFilter']:checked").map(function () {
      return this.value;
    }).get().join(',');
    let filteredExexIds;
    filteredExexIds = checkid.split(',');
    let filteredExecName;
    filteredExecName = this.copyOfretailExecutives.filter((da) => filteredExexIds.some((prop) => {
      return prop == da.ID
    }));
    filteredExecName = filteredExecName.map((name) => name.Name);
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

  // Filter projects based on search 
  filterExecutive(): void {
    if (this.searchTerm_executive != '') {
      this.retailExecutives = this.copyOfretailExecutives.filter(exec =>
        exec.ExecName.toLowerCase().includes(this.searchTerm_executive.toLowerCase())
      );
    } else {
      this.retailExecutives = this.copyOfretailExecutives
    }
  }

  //Source filter method
  onCheckboxChangesource() {
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
      setTimeout(() => {
        this.router.navigate([], {
          queryParams: {
            source: this.source,
          },
          queryParamsHandling: 'merge',
        });
      }, 0)
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

  //Source filter method
  onCheckboxChangestage(stage) {
    if (stage != '' && stage != undefined && stage != null) {
      this.stageFilter = true;
      this.status = stage;
      setTimeout(() => {
        this.router.navigate([], {
          queryParams: {
            status: this.status,
          },
          queryParamsHandling: 'merge',
        });
      }, 0)
    } else {
      this.stageFilter = false;
    }
  }

  // Filter projects based on search 
  filterstage(): void {
    if (this.searchTerm_stage != '') {
      this.stageList = this.copyOfStageList.filter(stage =>
        stage.name.toLowerCase().includes(this.searchTerm_stage.toLowerCase())
      );
    } else {
      this.stageList = this.copyOfStageList
    }

  }

  //here the source filter is removed
  sourceClose() {
    $("input[name='sourceFilter']").prop("checked", false);
    this.sourceFilter = false;
    this.searchTerm_source = '';
    this.source = '';
    this.sourceList = this.copyofsources;
    this.router.navigate([], {
      queryParams: {
        source: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  //here the executive filter is removed
  executiveclose() {
    this.executivefilterview = false;
    this.execid = "";
    this.execname = "";
    this.searchTerm_executive = '';
    $("input[name='executiveFilter']").prop("checked", false);
    this.retailExecutives = this.copyOfretailExecutives;
    this.router.navigate([], {
      queryParams: {
        execid: "",
        execname: ""
      },
      queryParamsHandling: 'merge',
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
        this.fromDate = start.format('YYYY-MM-DD');
        this.toDate = end.format('YYYY-MM-DD');
        this.router.navigate([], {
          queryParams: {
            allvisits: 1,
            from: this.fromDate,
            to: this.toDate,
            fromtime: this.fromTime,
            totime: this.toTime,
            execid: this.execid,
            execname: this.execname,
            status:this.status
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

  //here we refresh all the filters.
  refresh() {
    this.execid = '';
    this.execname = '';
    this.fromTime = '';
    this.toTime = '';
    this.fromDate = '';
    this.toDate = '';
    this.source = '';
    this.sourceFilter = false;
    this.executivefilterview = false;
    this.filterLoader = false;
    let status = this.status;
    $("input[name='executiveFilter']").prop("checked", false);
    $("input[name='sourceFilter']").prop("checked", false);
    this.router.navigateByUrl('/hourly-report-listing', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/hourly-report-listing'], {
        queryParams: {
          today: 1,
          from: '',
          to: '',
          status: status
        }
      });
    });
  }

  loadMoreassignedleads() {

  }

  // scrollLeft() {
  //   const list = this.timeList.nativeElement;
  //   list.scrollBy({
  //     left: -600,
  //     behavior: 'smooth'
  //   });
  // }

  // scrollRight() {
  //   const list = this.timeList.nativeElement;
  //   list.scrollBy({
  //     left: 600,
  //     behavior: 'smooth'
  //   });
  // }

}
