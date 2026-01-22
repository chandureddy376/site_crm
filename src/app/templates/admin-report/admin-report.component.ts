import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../mandate.service';
import { retailservice } from '../../retail.service';
import Chart from 'chart.js';
import { DatePipe } from '@angular/common';
import { sharedservice } from '../../shared.service';
import { EchoService } from '../../echo.service';

declare var $: any;


@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css']
})
export class AdminReportComponent {

  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private _mandateService: mandateservice, 
    private _retailservice: retailservice, 
    private _sharedService: sharedservice, 
    public datepipe: DatePipe,
    private _echoService: EchoService
  ) {
    if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
      this.router.navigateByUrl('/login');
    };
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
      $('.ui.label.fluid.dropdown').dropdown({
        useLabels: false
      });
    }, 1000);
  }

  private isCountdownInitialized: boolean;
  filterLoader: boolean = true;
  fromdate: any;
  todate: any;
  static count: number;
  currentDate = new Date();
  todaysdate: any;
  todaysvisitedparam: any;
  yesterdaysvisitedparam: any;
  scheduledtoday:any;
  allvisitparam: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdayDateStore: any;
  tomorrowsdateforcompare: any;
  datecustomfetch: any;
  dateRange: Date[];
  roleid: any;
  userid: any;
  dashboardsCounts: any;
  previousMonthDateForCompare: any;
  percentage: any;
  sourcelist: any;
  username: any;


  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.username = localStorage.getItem('Name');

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

    // *********************load the required template files*********************
    this.getleadsdata();

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    // Todays Date

    // Tomorrows Date
    var tomorrow = this.currentdateforcompare.getDate() + 1;
    var tomorrowwithzero = tomorrow.toString().padStart(2, "0");
    this.tomorrowsdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + tomorrowwithzero;
    // Tomorrows Date

    //to get the previous month date of the present day date
    var previousMonthDate = new Date(this.currentdateforcompare);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    var prevMonth = (previousMonthDate.getMonth() + 1).toString().padStart(2, '0');
    var prevDay = previousMonthDate.getDate().toString().padStart(2, '0');
    this.previousMonthDateForCompare = previousMonthDate.getFullYear() + '-' + prevMonth + '-' + prevDay;

    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }

    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
    AdminReportComponent.count = 0;
    this.setPercentageForRevenueGraph();
    this.getsourcelist();
    this.scriptfunctions();
  }

  getProgressCircleBackground(index: number) {
    const percentage = 50;
    this.percentage = 50;
    return `conic-gradient(#FF69B4 ${percentage}%, #FFE7EF ${percentage}% 100%)`;
  }

  setPercentageForSourceGraph() {
    console.log('triggered')
    let percentage = 35;
    let progressCircle = document.getElementById('doughgraph')[0];
    let percentageText = document.getElementById('percentage-text');
    console.log(percentage)
    percentageText.textContent = `${percentage}%`;
    // Apply the gradient as the background image of the circle
    progressCircle.style.backgroundImage = `conic-gradient(#FF69B4 ${percentage}%, #FFE7EF ${percentage}% 100%)`;
  }

  setPercentageForRevenueGraph() {
    console.log('triggered1')
    let percentagemandate = 35;
    let progressCircle = document.getElementById('revenueMandate');
    progressCircle.style.backgroundImage = `conic-gradient(#FF6B93 ${percentagemandate}%, #ECEFF5 ${percentagemandate}% 100%)`;

    let percentageretail = 50;
    let progressCircle1 = document.getElementById('revenueRetail');
    progressCircle1.style.backgroundImage = `conic-gradient(#FF9777 ${percentageretail}%, #ECEFF5 ${percentageretail}% 100%)`;

    let percentagetotal = 75
    let progressCircle2 = document.getElementById('revenueTotal');
    progressCircle2.style.backgroundImage = `conic-gradient(#8A53FF ${percentagetotal}%, #ECEFF5 ${percentagetotal}% 100%)`;
  }

  getsourcelist() {
    this._sharedService.sourcelist().subscribe(sources => {
      this.sourcelist = sources;
      setTimeout(() => {
        this.setPercentageForSourceGraph();
      }, 1000)
    })
  }

  onDateRangeSelected(range: Date[]): void {
    this.dateRange = range;
    // Convert the first date of the range to yyyy-mm-dd format
    if (this.dateRange != null || this.dateRange != undefined) {
      let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
      if ((formattedFromDate == '' || formattedFromDate == undefined) || (formattedToDate == '' || formattedToDate == undefined)) {
        this.fromdate = '';
        this.todate = ''
      } else {
        this.fromdate = formattedFromDate;
        this.todate = formattedToDate;
        this.filterLoader = true;
        setTimeout(() => {
          this.customNavigation(formattedFromDate, formattedToDate)
        }, 1000)
      }
    }
  }

  customNavigation(fromdate, todate) {
    this.router.navigate(['/adminreports'], {
      queryParams: {
        allvisits: 1,
        from: fromdate,
        to: todate,
        dashtype: 'dashboard'
      }
    });
  }

  datePicker() {
    setTimeout(() => {
      this.dateRange = [this.currentdateforcompare];
      $("bs-daterangepicker-container").addClass("newDashBoardDatePicker");
      $("bs-daterangepicker-container").attr("id", "newDashBoardDatePicker");
    }, 100)
  }

  ngOnDestroy() {
    let element1 = document.getElementById('dashboard_dynamic_links_1');
    let element2 = document.getElementById('dashboard_dynamic_links_2');
    let element3 = document.getElementById('dashboard_material_css');
    let element5 = document.getElementById('dashboard_dynamic_links_5');
    let element6 = document.getElementById('dashboard_dynamic_links_6');
    if(element1){
      element1.parentNode.removeChild(element1);
    }
    if(element2){
      element2.parentNode.removeChild(element2);
    }
    if(element3){
      element3.parentNode.removeChild(element3);
    }
    if(element5){
      element5.parentNode.removeChild(element5);
    }
    if(element6){
      element6.parentNode.removeChild(element6);
    }
    $("bs-daterangepicker-container").removeAttr('style')
  }

  ngAfterViewChecked() {
    if (!this.isCountdownInitialized) {
      this.isCountdownInitialized = true;
      $('.modalclick').click(function () {
        $('.modalclick').removeClass('modal-backdrop');
        $('.modalclick').removeClass('fade');
        $('.modalclick').removeClass('show');
        document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
      });
    }
  }

  getleadsdata() {
    this.filterLoader = true;
    AdminReportComponent.count = 0;
    this.route.queryParams.subscribe((paramss) => {
      // Updated Using Strategy
      this.todaysvisitedparam = paramss['todayvisited'];
      this.yesterdaysvisitedparam = paramss['yesterdayvisited'];
      this.allvisitparam = paramss['allvisits'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];

      if ((this.fromdate == '' || this.fromdate == undefined) || (this.todate == '' || this.todate == undefined)) {
        $("#fromdate").val('');
        $("#todate").val('');
        this.fromdate = '';
        this.todate = '';
      } else {
        $("#fromdate").val(this.fromdate);
        $("#todate").val(this.todate);
      }

      if (this.todaysvisitedparam == '1') {
        this.fromdate = "";
        this.todate = "";
        this.clicked = false;
        this.clicked1 = true;
        this.clicked2 = false;
        this.clicked3 = false;
        this.filterLoader = true;
        var curmonth = this.currentDate.getMonth() + 1;
        var curmonthwithzero = curmonth.toString().padStart(2, "0");
        var curday = this.currentDate.getDate();
        var curdaywithzero = curday.toString().padStart(2, "0");
        this.todaysdate = this.currentDate.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
        this.fromdate = this.todaysdate;
        this.todate = this.todaysdate;
        this.batch2trigger();
        this.getOverallCounts();
      } else if (this.yesterdaysvisitedparam == '1') {
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
        this.clicked2 = true;
        this.clicked3 = false;
        this.fromdate = this.yesterdayDateStore;
        this.todate = this.yesterdayDateStore;
        this.filterLoader = true;
        this.batch2trigger();
        this.getOverallCounts();
      } else if (this.allvisitparam == '1') {
        this.filterLoader = true;
        this.batch2trigger();
        this.getOverallCounts();
        this.clicked = true;
        this.clicked3 = false;
        this.clicked1 = false;
        this.clicked2 = false;
      }
      // Updated Using Strategy
    });
  }

  //to get the executive today's and overdue data
  batch2trigger() {
  }

  //to get the counts of the dashboard.
  getOverallCounts() {
    //this counts is used for 1st row 
    if (this.fromdate == "" && this.todate == "" || this.fromdate == undefined && this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    // to get dasbboard counts
    let param = {
      rmid: '',
      propid: '',
      fromdate: this.fromdate,
      todate: this.todate,
      team: ''
    }
    this._retailservice.getDashboardCount(param).subscribe(dashCounts => {
      if (dashCounts.status == "True") {
        this.dashboardsCounts = dashCounts.DashboardCounts;
        this.filterLoader = false;
      }
    })
  }

  mandateGetData() {
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    // Todays Date

    // Tomorrows Date
    var tomorrow = this.currentdateforcompare.getDate() + 1;
    var tomorrowwithzero = tomorrow.toString().padStart(2, "0");
    this.tomorrowsdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + tomorrowwithzero;
  }

  backToWelcome() {
    $('.modal-backdrop').closest('div').remove();
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
    this._echoService.disconnectSocket();
  }

  refresh() {
    this.router.navigate(['/mandate-dashboard'], {
      queryParams: {
        todayvisited: 1,
        from: '',
        to: '',
        dashtype: 'dashboard',
        htype:'mandate',
        type:'leads'
      }
    });
  }

  scriptfunctions() {
    // Get the canvas element and cast it to HTMLCanvasElement
    const canvas = document.getElementById('mybarChart') as HTMLCanvasElement;
    // Get the 2D context for the chart
    const ctx = canvas.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Mandate',
              data: [50000, 60000, 20000, 10000, 60000, 200000, 100000, 230000, 300000, 60000, 40000, 100000],
              backgroundColor: '#2983FF',
              borderColor: '#2983FF',
              borderWidth: 1,
              barThickness: 10,
            },
            {
              label: 'Retail',
              data: [18000, 13000, 30000, 10000, 50000, 80000, 128000, 133000, 90000, 190000, 20500, 89000],
              backgroundColor: '#2983FF40',
              borderColor: '#2983FF40',
              borderWidth: 1,
              barThickness: 10,
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              gridLines: {
                color: 'rgba(0, 0, 0, 0.1)', // Optional: set grid line color
                lineWidth: 2, // Optional: set grid line width
                borderDash: [4, 4], // Dashed grid lines (5px line, 5px space)
            },
              ticks: {
                min: 0,  // Min value of the y-axis
                max: 250000, // Max value of the y-axis
                stepSize: 50000, // Interval between tick values
                callback: function (value) {
                  return '₹' + value / 1000 + 'K';  // Custom label format (₹0K, ₹50K, etc.)
                }
              }
            }],
            xAxes: [{
              gridLines: {
                display: false 
            }
            }],
          }
        }
      });
    } else {
      console.error("Canvas context not found!");
    }

    //   const canvas1 = document.getElementById('myroundChart') as HTMLCanvasElement;
    //   const ctx1 = canvas1.getContext('2d');
    //   if (ctx1) { 
    //     new Chart(ctx1, {
    //       type: 'polarArea',
    //       data: {
    //         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //         datasets: [{
    //           label: 'Revenue by Leads',
    //           data: [12, 19, 3, 5, 2, 3],
    //           backgroundColor: [
    //             'rgba(255, 255, 225, 1)',
    //             'rgba(255, 255, 255, 1)',
    //             'rgba(255, 255, 255, 1)',
    //             'rgba(255, 255, 255, 1)',
    //             'rgba(255, 255, 255, 1)',
    //             'rgba(255, 255, 255, 1)'
    //           ],
    //           borderColor: [
    //             'rgba(255, 99, 132, 1)',
    //             'rgba(54, 162, 235, 1)',
    //             'rgba(255, 206, 86, 1)',
    //             'rgba(75, 192, 192, 1)',
    //             'rgba(153, 102, 255, 1)',
    //             'rgba(255, 159, 64, 1)'
    //           ],
    //           borderWidth: 5,
    //         }]
    //       },
    //       options : {
    //       scale: {
    //         gridLines: {
    //           circular: true,
    //           display: false 
    //         },
    //         angleLines: {
    //           display: false  
    //         },
    //         ticks: {
    //           display: false  
    //         }
    //       },
    //       responsive: true,
    //       plugins: {
    //         legend: {
    //           position: 'right'
    //         },
    //         tooltip: {
    //           enabled: true
    //         }
    //       }
    //     }
    //     });
    //   }else {
    //     console.error("Canvas context not found!");
    //   }

    //     const canvas2 = document.getElementById('myChart') as HTMLCanvasElement;
    //     const ctx2 = canvas2.getContext('2d');
    //     if (ctx2) { 
    //       new Chart(ctx2, {
    //         type: 'doughnut',
    //         data: {
    //           labels: ['Red', 'Blue', 'Yellow', 'Green',],
    //           datasets: [{
    //             label: 'Lead Source',
    //             data: [12, 19, 3, 5],
    //             backgroundColor: [
    //               'rgba(255, 99, 132, 0.2)',
    //               'rgba(54, 162, 235, 0.2)',
    //               'rgba(255, 206, 86, 0.2)',
    //               'rgba(75, 192, 192, 0.2)',
    //             ],
    //             borderColor: [
    //               'rgba(255, 99, 132, 1)',
    //               'rgba(54, 162, 235, 1)',
    //               'rgba(255, 206, 86, 1)',
    //               'rgba(75, 192, 192, 1)',
    //             ],
    //             borderWidth: 1
    //           }]
    //         },
    //         options: {
    //           responsive: true,
    //           plugins: {
    //             legend: {
    //               position: 'top',
    //             },
    //             tooltip: {
    //               enabled: true 
    //             }
    //           }
    //         }
    //       });
    // }else {
    //   console.error("Canvas context not found!");
    // }
  }

  //name will be underlined when the mouse in overed on the row 
  underlinedRow: number | null = null;
  underlineName(underline: boolean, index: number): void {
    this.underlinedRow = underline ? index : null;
  }
}


export function convert(str) {
  var mnths = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12"
  },
    date = str.split(" ");

  return [date[3], mnths[date[1]], date[2]].join("-");
}
