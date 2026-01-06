import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { retailservice } from '../../retail.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-hourly-report',
  templateUrl: './hourly-report.component.html',
  styleUrls: ['./hourly-report.component.css']
})

export class HourlyReportComponent implements OnInit {

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
  fromDate: any;
  toDate: any;
  fromTime: any;
  toTime: any;
  execid: any;
  execname: any;
  datecustomfetch: any;
  filterLoader: boolean = true;
  retailExecutives: any;
  copyOfretailExecutives: any;
  unquieleadcounts: number = 0;
  totalPendingCount: number = 0;
  totalRetailPendingCount: number = 0;
  totalMandatePendingCount: number = 0;
  currentDate: Date = new Date();
  formattedDate: string = this.formatDate(this.currentDate);
  executivesList: any[] = [];
  copyExecutivesList: any[] = [];
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  sendRepStart: moment.Moment | null = null;
  sendRepEnd: moment.Moment | null = null;
  sendFromDate: any;
  sendToDate: any;
  executive_name: string = '';
  roleid: any;
  currentPage: number = 0;
  pageSize: number = 6;
  totalPages = 2;
  totalPagesForAdmin: number = 0;
  isCheckedBtn: boolean = false;
  selectedDateRange: any = '';
  selectedSendReportSlot: any;
  rmid: any;
  rmName: any;
  mandateExecutives:any;
  team:any;
  role_type: any;

  constructor(
    private readonly _sharedService: sharedservice,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly _retailService: retailservice,
    private readonly _mandateService: mandateservice
  ) { }

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    if (this.roleid != 1 && this.roleid != 2) {
      this.rmid = localStorage.getItem('UserId');
      this.rmName = localStorage.getItem('Name');
    }
    this.role_type = localStorage.getItem('role_type');
    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });
    this.getRetailExec();
    //date
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
  }

  ngAfterViewInit() {
    setTimeout(() => {
    this.initializeNextActionDateRangePicker();
    this.initializeSendReportDateRangePicker();
    },0);
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  //here we receive the query params and based the condition the trigger the data.
  getHourlyData() {
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
      this.team = param['team'];
      this.filterLoader = true;

      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.initializeSendReportDateRangePicker();
      }, 0);

      if (this.roleid == 1 || this.roleid == 2) {
        this.rmid = this.execid;
        this.rmName = this.execname;
      }

      if(this.role_type == 1 && (this.execid == null || this.execid == undefined || this.execid == '')){
        this.execid = localStorage.getItem('UserId');
      }

      if(this.team == '' || this.team == undefined || this.team == null){
        this.team = 0;
      }else {
        this.team = this.team;
      }

      if (((this.fromDate == "" || this.fromDate == null || this.fromDate == undefined) || (this.toDate == '' || this.toDate == undefined || this.toDate == null)) && param['type'] != 'overall') {
        this.datecustomfetch = "Custom";
      } else {
        this.datecustomfetch = this.fromDate + ' - ' + this.toDate;
        if (this.fromDate != this.toDate) {
          this.fromTime = '';
          this.toTime = '';
        }
      }

      if (((this.fromTime == '' || this.fromTime == undefined || this.fromTime == null) || (this.toTime == '' || this.toTime == undefined || this.toTime == null)) && this.fromDate == this.toDate && param['type'] != 'overall') {
        // this.fromTime = '09:30';
        // this.toTime = '10:30';
        this.fromTime = '';
        this.toTime = '';
        $('.time_zone').removeClass('active');
        $('.overall_day').addClass('active');
      } else {
        $('.time_zone').removeClass('active');
        if (this.fromTime == '09:30' && this.toTime == '10:30') {
          $('.time_list').addClass('active');
        } else if (this.fromTime == '10:30' && this.toTime == '11:30') {
          $('.time_list1').addClass('active');
        } else if (this.fromTime == '11:30' && this.toTime == '12:30') {
          $('.time_list2').addClass('active');
        } else if (this.fromTime == '12:30' && this.toTime == '13:30') {
          $('.time_list3').addClass('active');
        } else if (this.fromTime == '13:30' && this.toTime == '14:30') {
          $('.time_list4').addClass('active');
        } else if (this.fromTime == '14:30' && this.toTime == '15:30') {
          $('.time_list5').addClass('active');
        } else if (this.fromTime == '15:30' && this.toTime == '16:30') {
          $('.time_list6').addClass('active');
        } else if (this.fromTime == '16:30' && this.toTime == '17:30') {
          $('.time_list7').addClass('active');
        } else if (this.fromTime == '17:30' && this.toTime == '18:30') {
          $('.time_list8').addClass('active')
        } else if (this.fromTime == '18:30' && this.toTime == '19:30') {
          $('.time_list9').addClass('active');
        } else if (this.fromTime == '00:00' || this.toTime == '09:30') {
          $('.before9_day').addClass('active');
        } else if (this.fromTime == '19:30' && this.toTime == '23:59') {
          $('.after7_day').addClass('active');
        }
      }

      if (param['type'] == 'overall') {
        $('.overall_day').addClass('active');
        this.datecustomfetch = "Custom";
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
        this.fromDate = this.sevendaysdateforcompare;
        this.toDate = this.todaysdateforcompare;
        this.getAllCounts();
      } else if (this.allVisitsParam == '1') {
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = true;
        this.fromDate = this.fromDate;
        this.toDate = this.toDate;
        this.getAllCounts();
      }

      let executive;
      if (this.execid && this.retailExecutives) {
        executive = this.retailExecutives.filter((exec) => {
          return exec.ID == this.execid
        })

        if ((executive && (executive[0].DesignationId == '50001' || executive[0].DesignationId == '50002' || executive[0].DesignationId == '50013' || executive[0].DesignationId == '50014')) || (this.roleid == '50001' || this.roleid == '50002' || this.roleid == '50013' || this.roleid == '50014')) {
          this.getPendingCountsMandate();
        } 
        // else if ((executive && (executive[0].DesignationId == '50009' || executive[0].DesignationId == '50010' || executive[0].DesignationId == '50003' || executive[0].DesignationId == '50004')) || (this.roleid == '50009' || this.roleid == '50010' || this.roleid == '50003' || this.roleid == '50004')) {
        //   this.getPendingCountsRetail();
        // }
      }

      // if (this.roleid == '50001' || this.roleid == '50002' || this.roleid == '50013' || this.roleid == '50014') {
      //   this.getPendingCountsMandate();
      // } 
      // else if (this.roleid == '50009' || this.roleid == '50010' || this.roleid == '50003' || this.roleid == '50004') {
      //   this.getPendingCountsRetail();
      // }
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

  //This method is to show the zero activity Employees.
  checkActive(event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isCheckedBtn = isChecked;
    if (isChecked == true) {
      if ((this.execid == '' || this.execid == undefined || this.execid == null) && (this.roleid == 1 || this.roleid == 2)) {
        this.executivesList = this.copyExecutivesList.filter((exec) => {
          return exec.counts[0].overall == 0;
        });
      } else if ((this.execid != '' && this.execid != undefined && this.execid != null) || (this.roleid != 1 && this.roleid != 2)) {
        this.executivesList = this.copyExecutivesList.filter((exec) => {
          return exec.overall == 0;
        })
      }
    } else {
      if (this.isCheckedBtn == false) {
        this.executivesList = this.copyExecutivesList;
      }
    }
  }

  //here we filter particular executive from Executives List data.
  searchExecutive() {
    if (this.executive_name) {

      if (this.isCheckedBtn == true) {
        if ((this.execid == '' || this.execid == undefined || this.execid == null) && (this.roleid == 1 || this.roleid == 2)) {
          this.executivesList = this.copyExecutivesList.filter((exec) => {
            return exec.counts[0].overall == 0 && exec.ExecName.toLowerCase().includes(this.executive_name.toLowerCase());
          });
        } else if ((this.execid != '' && this.execid != undefined && this.execid != null) || (this.roleid != 1 && this.roleid != 2)) {
          this.executivesList = this.copyExecutivesList.filter((exec) => {
            return exec.overall == 0 && exec.ExecName.toLowerCase().includes(this.executive_name.toLowerCase());
          })
        }
      } else {
        this.executivesList = this.copyExecutivesList.filter((exec) => {
          return exec.ExecName.toLowerCase().includes(this.executive_name.toLowerCase())
        })
      }
    } else {
      if (this.isCheckedBtn == false) {
        this.executivesList = this.copyExecutivesList;
      } else if (this.isCheckedBtn == true) {
        if ((this.execid == '' || this.execid == undefined || this.execid == null) && (this.roleid == 1 || this.roleid == 2)) {
          this.executivesList = this.copyExecutivesList.filter((exec) => {
            return exec.counts[0].overall == 0 && exec.ExecName.toLowerCase().includes(this.executive_name.toLowerCase());
          });
        } else if ((this.execid != '' && this.execid != undefined && this.execid != null) || (this.roleid != 1 && this.roleid != 2)) {
          this.executivesList = this.copyExecutivesList.filter((exec) => {
            return exec.overall == 0 && exec.ExecName.toLowerCase().includes(this.executive_name.toLowerCase());
          })
        }
      }
    }
  }

  //here we get the list of executives to show in the dropdown.
  getRetailExec() {
    let teamlead;
    if (this.role_type == 1) {
      teamlead = localStorage.getItem('UserId');
    } else {
      teamlead = '';
    }
    this._sharedService.getexecutiveslist('','','','',teamlead).subscribe((exec) => {
      this.retailExecutives = exec;
      this.copyOfretailExecutives = exec;
      this.getHourlyData();
    })
  }

  //here we get the list of executives along with counts
  getAllCounts() {
    let fromTime, toTime;

    if ((this.execid == '' || this.execid == undefined || this.execid == null) && (this.roleid == 1 || this.roleid == 2)) {
      fromTime = this.fromTime;
      toTime = this.toTime;
    } else {
      fromTime = '';
      toTime = '';
    }

    if (this.fromDate != this.toDate) {
      fromTime = '';
      toTime = '';
    }

    let param = {
      fromdate: this.fromDate,
      todate: this.toDate,
      fromtime: fromTime,
      totime: toTime,
      execid: this.execid,
      loginid: localStorage.getItem('UserId'),
      loop: '1',
      team:this.team,
       ...(this.role_type == 1 ? { teamlead: localStorage.getItem('UserId') } : {})
    }

    this.filterLoader = true;
    this._sharedService.getAdminHourlyReport(param).subscribe((resp) => {
      this.filterLoader = false;
      this.executivesList = resp['Exec_list'];
      this.copyExecutivesList = resp['Exec_list'];
      if (this.isCheckedBtn == true) {
        if ((this.execid == '' || this.execid == undefined || this.execid == null) && (this.roleid == 1 || this.roleid == 2)) {
          this.executivesList = this.copyExecutivesList.filter((exec) => {
            return exec.counts[0].overall == 0;
          });
        } else if ((this.execid != '' && this.execid != undefined && this.execid != null) || (this.roleid != 1 && this.roleid != 2)) {
          this.executivesList = this.copyExecutivesList.filter((exec) => {
            return exec.overall == 0;
          })
        }
      } else {
        this.executivesList = this.copyExecutivesList;
      }
      this.filterLoader = false;
    })
  }

  //pagination code here we the calculate the total pages for admin login and return the list of executives.
  get pagedExecutives() {
    if (!this.executivesList || this.executivesList.length === 0) {
      return [];
    }
    let dividedData = Math.ceil(this.retailExecutives.length / 6);
    this.totalPagesForAdmin = dividedData % 1 > 0.1 ? Math.ceil(dividedData) : Math.round(dividedData);

    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.executivesList;
  }

  //This method is to go to previous page & only for the admin login without executives filter.
  adminpreviousPage() {
    this.filterLoader = true;
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadMoreAdimin();
    } else {
      this.getHourlyData();
    }
  }

  //This method is to go to the next page & only for the admin login without executives filter.
  adminnextPage() {
    // if ((this.currentPage + 1) * this.pageSize < this.retailExecutives.length) {
    //   this.currentPage++;
    //   this.loadMoreAdimin()
    // }
    this.filterLoader = true;
    if (this.currentPage < this.totalPagesForAdmin - 1) {
      this.currentPage++;
      this.loadMoreAdimin();
    }
  }

  //This method is to go to the next page & only for the executive login and admin login along executives filter.
  nextPage() {
    this.filterLoader = true;
    if (this.currentPage < this.totalPages - 1) {
      this.loadMore();
      this.currentPage++;
    }
  }

  //This method is to go to previous page & only for the executive login and admin login along executives filter. 
  previousPage() {
    this.filterLoader = true;
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getHourlyData();
    }
  }

  //here we get the counts for every one hour for Retail executives
  getPendingCountsRetail() {
    this.totalPendingCount = 0;

    var totalleads = {
      assignedfrom: this.todaysdateforcompare,
      assignedto: this.todaysdateforcompare,
      statuss: 'pending',
      executid: this.execid,
      loginuser: localStorage.getItem('UserId'),
    }
    this._retailService.assignedLeadsCount(totalleads).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.totalRetailPendingCount = compleads.AssignedLeads[0].Uniquee_counts;
        return this.totalPendingCount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.totalPendingCount = 0;
        this.totalRetailPendingCount = 0;
      }
    });
  }

  //here we get the counts for every one hour for Mandate executives
  getPendingCountsMandate() {
    this.unquieleadcounts = 0;

    // Total Assigned Leads Count
    var totalleads = {
      assignedfrom: this.todaysdateforcompare,
      assignedto: this.todaysdateforcompare,
      statuss: 'pending',
      executid: this.execid,
      loginuser: localStorage.getItem('UserId'),
    }
    this._mandateService.assignedLeadsCount(totalleads).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.totalMandatePendingCount = compleads.AssignedLeads[0].Uniquee_counts
        return this.totalPendingCount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.totalPendingCount = 0;
        this.totalMandatePendingCount = 0;
      }
    });
  }

    //here we get the selected executives.
    teamchange(vals) {
      this.filterLoader = true;
      this.currentPage = 0;
      this.totalPages = 2;
      if (vals.target.value == 'all') {
        this.router.navigate([], {
          queryParams: {
              team:''
          },
          queryParamsHandling: 'merge',
        });
        this.filterLoader = false;
      } else {
        this.team = vals.target.value;
        this.router.navigate([], {
          queryParams: {
            team: this.team,
          },
          queryParamsHandling: 'merge',
        });
      }
    }

  //here we get the selected executives.
  rmchange(vals) {
    this.filterLoader = true;
    $('.time_zone').removeClass('active');
    this.currentPage = 0;
    this.totalPages = 2;
    if (vals.target.value == 'all') {
      this.execid = '';
      this.execname = "";
      this.router.navigate([], {
        queryParams: {
          execid: '',
          execname: ""
        },
        queryParamsHandling: 'merge',
      });
      this.filterLoader = false;
    } else {
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

    // let executive;
    // if (this.retailExecutives) {
    //   executive = this.retailExecutives.filter((exec) => {
    //     return exec.ID == vals.target.value
    //   })
    //   if (executive && (executive[0].DesignationId == '50001' || executive[0].DesignationId == '50002')) {
    //     this.getPendingCountsMandate();
    //   } else if (executive && (executive[0].DesignationId == '50009' || executive[0].DesignationId == '50010' || executive[0].DesignationId == '50003' || executive[0].DesignationId == '50004')) {
    //     this.getPendingCountsRetail();
    //   }
    // }
    // if (executive && executive[0]?.type == 'retail') {
    //   this.getPendingCountsRetail();
    // } else if (executive && executive[0]?.type == 'mandate') {
    //   this.getPendingCountsMandate();
    // }
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

  //this loadmore is triggered for executive login and admin login only when executives are filtered.
  loadMore() {
    let fromTime, toTime;
    if ((this.execid == '' || this.execid == undefined || this.execid == null) && (this.roleid == 1 || this.roleid == 2)) {
      fromTime = this.fromTime;
      toTime = this.toTime;
    } else {
      fromTime = '';
      toTime = '';
    }

    if (this.fromDate != this.toDate) {
      fromTime = '';
      toTime = '';
    }

    let param = {
      fromdate: this.fromDate,
      todate: this.toDate,
      fromtime: fromTime,
      totime: toTime,
      execid: this.execid,
      loginid: localStorage.getItem('UserId'),
      loop: 2,
      team:this.team,
       ...(this.role_type == 1 ? { teamlead: localStorage.getItem('UserId') } : {})
    }

    this.filterLoader = true;
    this._sharedService.getAdminHourlyReport(param).subscribe((resp) => {
      this.filterLoader = false;
      this.executivesList = resp['Exec_list'];
      this.copyExecutivesList = resp['Exec_list'];
      if (this.isCheckedBtn == true) {
        if ((this.execid == '' || this.execid == undefined || this.execid == null) && (this.roleid == 1 || this.roleid == 2)) {
          this.executivesList = this.copyExecutivesList.filter((exec) => {
            return exec.counts[0].overall == 0;
          });
        } else if ((this.execid != '' && this.execid != undefined && this.execid != null) || (this.roleid != 1 && this.roleid != 2)) {
          this.executivesList = this.copyExecutivesList.filter((exec) => {
            return exec.overall == 0;
          })
        }
      } else {
        this.executivesList = this.copyExecutivesList;
      }
      this.filterLoader = false;
    })
  }

  //this loadmore is triggered only for the admin login without executives filters.
  loadMoreAdimin() {
    let fromTime, toTime;
    if (this.execid == '' || this.execid == undefined || this.execid == null) {
      fromTime = this.fromTime;
      toTime = this.toTime;
    } else {
      fromTime = '';
      toTime = '';
    }

    if (this.fromDate != this.toDate) {
      fromTime = '';
      toTime = '';
    }

    let param = {
      fromdate: this.fromDate,
      todate: this.toDate,
      fromtime: fromTime,
      totime: toTime,
      execid: this.execid,
      loginid: localStorage.getItem('UserId'),
      loop: this.currentPage + 1,
      team:this.team,
      ...(this.role_type == 1 ? { teamlead: localStorage.getItem('UserId') } : {})
    }

    this.filterLoader = true;
    this._sharedService.getAdminHourlyReport(param).subscribe((resp) => {
      this.filterLoader = false;
      this.executivesList = resp['Exec_list'];
      this.copyExecutivesList = resp['Exec_list'];
      if (this.isCheckedBtn == true) {
        if ((this.execid == '' || this.execid == undefined || this.execid == null) && (this.roleid == 1 || this.roleid == 2)) {
          this.executivesList = this.copyExecutivesList.filter((exec) => {
            return exec.counts[0].overall == 0;
          });
        } else if ((this.execid != '' && this.execid != undefined && this.execid != null) || (this.roleid != 1 && this.roleid != 2)) {
          this.executivesList = this.copyExecutivesList.filter((exec) => {
            return exec.overall == 0;
          })
        }
      } else {
        this.executivesList = this.copyExecutivesList;
      }
      this.filterLoader = false;
    })
  }

  //this method is to format the dates to dd-mm-yyyy format
  formatDate(date: Date): string {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  // Method to change the date when user clicks the icons
  changeDate(direction) {
    this.currentPage = 0;
    this.totalPages = 2;
    if (direction === 'next') {
      const maxDate = new Date();
      if (this.currentDate > maxDate) {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.formattedDate = this.formatDate(this.currentDate);

        this.router.navigate([], {
          queryParams: {
            allvisits: 1,
            from: this.formattedDate,
            to: this.formattedDate,
            fromtime: this.fromTime,
            totime: this.toTime,
            execid: this.execid,
            execname: this.execname
          },
          // queryParamsHandling: 'merge',
        });
      } else {
        swal({
          title: 'Date Selection',
          text: 'Selected Date should be Greater than Present Date',
          type: 'info',
          showConfirmButton: false,
          timer: 2000,
        })
      }
    } else if (direction === 'previous') {
      const minDate = new Date('2025-03-27');
      if (this.currentDate > minDate) {
        this.currentDate.setDate(this.currentDate.getDate() - 1);

        this.formattedDate = this.formatDate(this.currentDate);

        this.router.navigate([], {
          queryParams: {
            allvisits: 1,
            from: this.formattedDate,
            to: this.formattedDate,
            fromtime: this.fromTime,
            totime: this.toTime,
            execid: this.execid,
            execname: this.execname
          },
          // queryParamsHandling: 'merge',
        });
      } else {
        swal({
          title: 'Date Selection',
          text: 'Selected Date should be Greater than 26-03-2025',
          type: 'info',
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }
    // this.formattedDate = this.formatDate(this.currentDate);

    // this.router.navigate([], {
    //   queryParams: {
    //     allvisits: 1,
    //     from: this.formattedDate,
    //     to: this.formattedDate,
    //     fromtime: this.fromTime,
    //     totime: this.toTime,
    //     execid: this.execid,
    //     execname: this.execname
    //   },
    //   // queryParamsHandling: 'merge',
    // });
  }

  //here we refresh all the filters.
  refresh() {
    $('#customSwitch1').prop('checked', false);
    this.isCheckedBtn = false;
    $('#rm_dropdown').dropdown('clear');
    this.currentPage = 0;
    this.totalPages = 2;
    this.execid = '';
    this.execname = '';
    this.fromTime = '';
    this.toTime = '';
    this.filterLoader = false;
    this.formattedDate = this.formatDate(new Date);
    this.router.navigateByUrl('/hourly-report', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/hourly-report'], {
        queryParams: {
          today: 1,
          from: '',
          to: '',
          isListing: false
        }
      });
    });
  }

  // In this method string to time type is been converted
  convertTimeToDate(time: string): Date {
    if (time) {
      const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
  }

  //redirection to listing section.
  listingSectionclicked(execid, state, name, start, end) {
    if (this.roleid == 1 && (this.execid == '' || this.execid == undefined || this.execid == null)) {
      this.router.navigate(['/hourly-report-listing'], {
        queryParams: {
          allvisits: '1',
          execid: execid,
          execname: name,
          status: state,
          from: this.fromDate,
          to: this.toDate,
          fromtime: this.fromTime,
          totime: this.toTime
        }
      })
    } else {

      let startTime, endTime;
      if (start == '00:00' && end == '09:30') {
        startTime = start;
        endTime = end;
      } else if (start == '09:31' && end == '10:30') {
        startTime = '09:30';
        endTime = '10:30';
      } else if (start == '10:31' && end == '11:30') {
        startTime = '10:30';
        endTime = '11:30';
      } else if (start == '11:31' && end == '12:30') {
        startTime = '11:30';
        endTime = '12:30';
      } else if (start == '12:31' && end == '13:30') {
        startTime = '12:30';
        endTime = '13:30';
      } else if (start == '13:31' && end == '14:30') {
        startTime = '13:30';
        endTime = '14:30';
      } else if (start == '14:31' && end == '15:30') {
        startTime = '14:30';
        endTime = '15:30';
      } else if (start == '15:31' && end == '16:30') {
        startTime = '15:30';
        endTime = '16:30';
      } else if (start == '16:31' && end == '17:30') {
        startTime = '16:30';
        endTime = '17:30';
      } else if (start == '17:31' && end == '18:30') {
        startTime = '17:30';
        endTime = '18:30';
      } else if (start == '18:31' && end == '19:30') {
        startTime = '18:30';
        endTime = '19:30';
      } else if (start == '19:31' && end == '23:59') {
        startTime = '19:30';
        endTime = '23:59';
      }
      this.router.navigate(['/hourly-report-listing'], {
        queryParams: {
          allvisits: '1',
          execid: execid,
          execname: name,
          status: state,
          from: this.fromDate,
          to: this.toDate,
          fromtime: startTime,
          totime: endTime
        }
      })
    }
  }

  //here we get the selected time slot to send the report manually
  getselectedtime(event) {
    this.selectedSendReportSlot = event.target.value;
  }

  //this is triggered when custom is clicked to select the dates.
  initializeSendReportDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#sendReportDates input').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          $(this).data('daterangepicker').setEndDate(end);
        }
      } else {
        $('#sendReportDates input').html('Select Date Range');
      }
      if (start && end) {
        this.sendFromDate = start.format('YYYY-MM-DD');
        this.sendToDate = end.format('YYYY-MM-DD');
        this.selectedDateRange = this.sendFromDate + ' / ' + this.sendToDate;
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

    $('#sendReportDates').daterangepicker({
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
    cb(this.sendRepStart, this.sendRepEnd);
  }

  //pushing the report manually for selected date and time.
  pushReport() {

    if ((this.sendFromDate == '' || this.sendFromDate == undefined || this.sendFromDate == null) || (this.sendToDate == '' || this.sendToDate == undefined || this.sendToDate == null)) {
      swal({
        title: 'Select Date',
        text: 'Please select the Dates',
        type: 'error',
        showConfirmButton: false,
        timer: 2000
      })
    }

    if (this.selectedSendReportSlot == '' || this.selectedSendReportSlot == undefined || this.selectedSendReportSlot == null) {
      swal({
        title: 'Select Time',
        text: 'Please select the Time Range',
        type: 'error',
        showConfirmButton: false,
        timer: 2000
      })
    }

    const [startTime, endTime] = this.selectedSendReportSlot.split(" - ");

    let param = {
      fromdate: this.sendFromDate,
      todate: this.sendToDate,
      fromtime: startTime,
      totime: endTime,
      execid: '',
      loginid: localStorage.getItem('UserId'),
      team:this.team,
       ...(this.role_type == 1 ? { teamlead: localStorage.getItem('UserId') } : {})
    }

    this.filterLoader = true;
    this._sharedService.getAdminHourlyReport(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp['status']) {
        swal({
          title: 'Hourly Report',
          text: 'Report Send Successfully',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          $('leadAssignClose').click();
          $('time_dropdown').dropdown('clear');
          this.selectedDateRange = '';
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        })
        this.filterLoader = false;
      }
    })
  }

  //here on close im removing the selected data
  closesendreport() {
    this.selectedSendReportSlot = '';
    this.sendFromDate = '';
    this.sendToDate = '';
    this.selectedDateRange = '';
    $('time_dropdown').dropdown('clear');
  }

}
