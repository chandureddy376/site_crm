import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';
import { sharedservice } from '../../../shared.service';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-report-activity',
  templateUrl: './report-activity.component.html',
  styleUrls: ['./report-activity.component.css']
})
export class ReportActivityComponent implements OnInit {

  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;
  public clicked4: boolean = false;

  static count: number = 0;
  datecustomfetch: any;
  teleExecParam: any;
  rmExecParam: any;
  teleExecCount: number = 0;
  rmExecCount: number = 0;
  callerleads: any;
  userid: any;
  filterLoader: boolean = true;
  rmid: any;
  fromdate: any = '';
  todate: any = '';
  mandateExecutivesFilter: any;
  copyMandateExecutives: any;
  searchTerm_executive: string = '';
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdaysdateforcompare: any;
  alldateparam:any;
  execid: any;
  execname: any;
  dateRange: Date[];
  todaysdate: any;
  todaysvisitedparam: any;
  yesterdaysvisitedparam: any;
  allvisitparam: any;
  execCounts: number = 0;
  datetype:any;


  constructor(private readonly _mandateservice: mandateservice, private _sharedservice: sharedservice, private router: Router, private route: ActivatedRoute, public datepipe: DatePipe) {
    if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
      this.router.navigateByUrl('/login');
    };
  }

  ngOnInit() {
    this.userid = localStorage.getItem('UserId');
    this.getleadsdata();
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    var yesterday = this.currentdateforcompare.getDate() - 1;
    var yesterdaywithzero = yesterday.toString().padStart(2, "0");
    this.yesterdaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + yesterdaywithzero;

    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
  }

  getleadsdata() {
    if (localStorage.getItem('Role') == '50002') {
      this.rmid = localStorage.getItem('UserId');
    }
    this.route.queryParams.subscribe((paramss) => {
      this.filterLoader = true;
      // Updated Using Strategy

      this.todaysvisitedparam = paramss['todayvisited'];
      this.yesterdaysvisitedparam = paramss['yesterdayvisited'];
      this.alldateparam = paramss['all'];
      this.allvisitparam = paramss['allvisits'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to']

      if (this.todaysvisitedparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.clicked1 = false;
        this.clicked = true;
        this.clicked2 = false;
        this.clicked4 = false;
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentdateforcompare.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        this.todaysdate = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

        this.fromdate = this.todaysdate;
        this.todate = this.todaysdate;
        this.datetype = 'today';
        this.getExecData();
      } else if (this.yesterdaysvisitedparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.clicked = false;
        this.clicked1 = false;
        this.clicked2 = true;
        this.clicked4 = false;
        var curmonth = this.currentdateforcompare.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var yesterday = this.currentdateforcompare.getDate() - 1;
        var yesterdaywithzero = yesterday.toString().padStart(2, "0");
        this.yesterdaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + yesterdaywithzero;
        this.datetype = 'yesterday';
        this.fromdate = this.yesterdaysdateforcompare;
        this.todate = this.yesterdaysdateforcompare;
        this.getExecData();
      } else if (this.alldateparam == '1') {
        this.clicked4 = true;
        this.clicked = false;
        this.clicked2 = false;
        this.clicked1 = false;
        this.fromdate = '';
        this.todate = '';
        this.datetype = 'today';
        this.getExecData();
      } else if (this.allvisitparam == '1') {
        this.clicked1 = true;
        this.clicked = false;
        this.clicked2 = false;
        this.clicked4 = false;
        this.getExecData();
        this.datetype = '';
      }
      if ((this.fromdate == "" || this.fromdate == undefined) || (this.todate == ""  ||  this.todate == undefined)) {
        this.datecustomfetch = "Custom";
        $("#fromdate").val(this.fromdate);
        $("#todate").val(this.todate);
      } else {
        this.datecustomfetch = this.fromdate + ' - ' + this.todate;
      }

    });
  }

  onDateRangeSelected(range: Date[]): void {
    this.dateRange = range;
    // Convert the first date of the range to yyyy-mm-dd format
    if (this.dateRange != null) {
      let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
      this.fromdate = formattedFromDate;
      this.todate = formattedToDate
      if ((formattedFromDate != undefined && formattedFromDate != '' && formattedFromDate != null) && (formattedToDate != undefined && formattedToDate != '' && formattedToDate != null)) {
        setTimeout(() => {
          this.customNavigation(formattedFromDate, formattedToDate)
        }, 1000);
      }
    }
  }

  customNavigation(fromdate, todate) {
    this.router.navigate(['/mandatereports'], {
      queryParams: {
        allvisits:1,
        from: fromdate,
        to: todate,
      }
    });
  }

  datePicker() {
    $("bs-daterangepicker-container").addClass("newDashBoardDatePicker");
    $("bs-daterangepicker-container").attr("id", "newDashBoardDatePicker");
    setTimeout(() => {
      if(this.dateRange == undefined || this.dateRange == null || this.dateRange[0] == null || this.dateRange[1] == null ){
      this.dateRange = [this.currentdateforcompare];
      }
    },0)
  }

  //to fetch inhouse exec details
  getExecData() {
    this.filterLoader = true;
    $(".other_section").removeClass("active");
    $(".inhouseEXEC_section").addClass("active");
    this._mandateservice.getReportExecs(this.fromdate, this.todate).subscribe((response) => {
      this.filterLoader = false;
      if (response['status'] == 'True') {
        this.callerleads = response['Exec_list'];
        this.execCounts = response['Exec_counts'];
      } else {
        this.callerleads = [''];
      }
    });
  }

  getteleExecData() {
      this.router.navigate([], {
        queryParamsHandling: 'merge'
      })
  }

  //reset the filters used 
  refresh() {
    this.fromdate = '';
    this.todate = '';
    this.dateRange = [];
    this.router.navigate([], {
      queryParams: {
        todayvisited:'1',
      },
      queryParamsHandling: 'merge',
    });
    // this.getExecData();
  }

  //to fetch direct exec details
  // directExecData() {
  //   this.filterLoader = true;
  //   $(".other_section").removeClass("active");
  //   $(".directEXEC_section").addClass("active");
  //   this._mandateservice.getReportExecs(this.roleID, this.fromdate, this.todate).subscribe((response) => {
  //     this.filterLoader = false;
  //     if (response['status'] == 'True') {
  //       this.callerleads = response['Exec_list'];
  //       this.execCounts = response['Exec_counts'];
  //     } else {
  //       this.callerleads = [''];
  //     }
  //   });
  // }

  //  batch1trigger(){
  //   this.teleExecCount=0
  //   this.rmExecCount=0;

  //   //here we get the overdue counts
  //   var teleparam = {
  //     datefrom: this.fromdate,
  //     dateto: this.todate,
  //     statuss: 'overdues',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //     this._mandateservice.assignedLeadsCount(teleparam).subscribe(compleads => {
  //       if (compleads['status'] == 'True') {
  //         this.teleExecCount = compleads.AssignedLeads[0].counts;
  //       } else {
  //         this.teleExecCount = 0;
  //       }
  //     })

  //   //here we get general followups count
  //   var rmparam = {
  //     datefrom: this.fromdate,
  //     dateto: this.todate,
  //     statuss: 'overdues',
  //     executid: this.rmid,
  //     loginuser: this.userid,
  //   }
  //     this._mandateservice.assignedLeadsCount(rmparam).subscribe(compleads => {
  //       if (compleads['status'] == 'True') {
  //         this.rmExecCount = compleads.AssignedLeads[0].counts;
  //       } else {
  //         this.rmExecCount = 0;
  //       }
  //     });
  //  }

  //get list of mandate executives for mandate for filter purpose
  //  getExecutivesForFilter() {
  //   this._mandateservice.fetchmandateexecutuvesforreassign('', '','').subscribe(executives => {
  //     if (executives['status'] == 'True') {
  //       this.mandateExecutivesFilter = executives['mandateexecutives'];
  //       this.copyMandateExecutives = executives['mandateexecutives'];
  //     }
  //   });
  //   }

  //  loadMoreassignedleads(){
  //   const limit = ReportActivityComponent.count += 30;
  //   if(this.teleExecParam == 1){
  //     var gfparam = {
  //       limit: limit,
  //       limitrows: 30,
  //       datefrom: this.fromdate,
  //       dateto: this.todate,
  //       statuss: '',
  //       stage: '',
  //       executid: this.rmid,
  //       loginuser: this.userid,
  //     }
  //     if (this.callerleads.length < this.teleExecCount) {
  //     this._mandateservice.assignedLeads(gfparam).subscribe(compleads => {
  //       this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
  //       // this.filterLoader = false;
  //     });
  //     }
  //   }else if(this.rmExecParam == 1){
  //     var usvparam = {
  //       limit: limit,
  //       limitrows: 30,
  //       datefrom: this.fromdate,
  //       dateto: this.todate,
  //       statuss: '',
  //       stage: '',
  //       executid: this.rmid,
  //       loginuser: this.userid,
  //     }
  //     if (this.callerleads.length < this.rmExecCount) {
  //     this._mandateservice.assignedLeads(usvparam).subscribe(compleads => {
  //       this.callerleads = this.callerleads.concat(compleads['AssignedLeads']);
  //       // this.filterLoader = false;
  //     });
  //     }
  //   }
  // }

  // close() {
  //   $('.modalclick').removeClass('modal-backdrop');
  //   $('.modalclick').removeClass('fade');
  //   $('.modalclick').removeClass('show');
  //   document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
  // }


  // // Filter executives based on search 
  // filterExecutives(): void {
  // if(this.searchTerm_executive != ''){
  //   this.mandateExecutivesFilter = this.copyMandateExecutives.filter(exec =>
  //     exec.name.toLowerCase().includes(this.searchTerm_executive.toLowerCase())
  //   );
  // }else{
  //   this.mandateExecutivesFilter = this.copyMandateExecutives
  // }

  // }
}
