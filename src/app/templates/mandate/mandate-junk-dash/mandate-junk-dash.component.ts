import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';
import { sharedservice } from '../../../shared.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-mandate-junk-dash',
  templateUrl: './mandate-junk-dash.component.html',
  styleUrls: ['./mandate-junk-dash.component.css']
})
export class MandateJunkDashComponent implements OnInit {

  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private _mandateService: mandateservice,private _sharedService: sharedservice, public datepipe: DatePipe) {
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
  currentDate = new Date();
  todaysdate: any;
  todaysvisitedparam: any;
  yesterdaysvisitedparam: any;
  allvisitparam: any;
  customparam:any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  yesterdayDateStore: any;
  tomorrowsdateforcompare: any;
  datecustomfetch: any;
  dateRange: Date[];
  roleid: any;
  sourcelist: any;
  username: any;
  userid: any;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  totalJunkCount:number=0;
  junkleadscount:number=0;
  junkvisitscount:number=0;
  junkvisitsUSVcount:number=0;
  junkvisitsUSVFixcount:number=0;
  junkvisitsUSVDonecount:number=0;
  junkvisitsSVcount:number=0;
  junkvisitsSVFixcount:number=0;
  junkvisitsSVDonecount:number=0;
  junkvisitsRSVcount:number=0;
  junkvisitsRSVFixcount:number=0;
  junkvisitsRSVDonecount:number=0;
  junkvisitsFNcount:number=0;
  junkvisitsFNFixcount:number=0;
  junkvisitsFNDonecount:number=0;
  mandateprojects: any;
  mandateexecutives:any;
  execid:any;
  execname:any;
  team:any;
  teamTypeName:any;
  source:any;
  mandateProperty_ID:string='';
  propertyid:any;
  propertyname:any;

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.username = localStorage.getItem('Name');

    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

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

    this.getSourceList();
    this.mandateprojectsfetch();
    // this.getMandateExec();

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

    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }

    this.getleadsdata();

    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
  }

  onDateRangeSelected(range: Date[]): void {
    this.dateRange = range;
    // Convert the first date of the range to yyyy-mm-dd format
    if (this.dateRange != null && this.dateRange != undefined) {
      let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
      if ((formattedFromDate == '' || formattedFromDate == undefined) || (formattedToDate == '' || formattedToDate == undefined)) {
        this.fromdate = '';
        this.todate = '';
      } else {
        this.fromdate = formattedFromDate;
        this.todate = formattedToDate;
        this.filterLoader = true;
        setTimeout(() => {
          this.customNavigation(formattedFromDate, formattedToDate)
        }, 1000);
      }
    }
  }

  customNavigation(fromdate, todate) {
    this.router.navigate(['/mandate-junk-dash'], {
      queryParams: {
        allvisits: 1,
        from: fromdate,
        to: todate,
        execid: this.execid,
        execname: this.execname,
        team: this.team,
        source:this.source,
        dashtype: 'dashboard',
        htype:'mandate'
      }
    });
  }

  datePicker() {
    setTimeout(() => {
      this.dateRange = [this.currentdateforcompare]
      $("bs-daterangepicker-container").addClass("newDashBoardDatePicker");
      $("bs-daterangepicker-container").attr("id", "newDashBoardDatePicker");
    }, 100);

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
    $("bs-daterangepicker-container").removeAttr('style');
    this.hoverSubscription.unsubscribe();
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
    this.route.queryParams.subscribe((paramss) => {
      this.filterLoader = true;
      // Updated Using Strategy
      this.todaysvisitedparam = paramss['todayvisited'];
      this.yesterdaysvisitedparam = paramss['yesterdayvisited'];
      this.allvisitparam = paramss['allvisits'];
      this.fromdate = paramss['from'];
      this.todate = paramss['to'];
      this.source = paramss['source'];
      this.execid = paramss['execid'];
      this.execname = paramss['execname'];
      this.propertyid = paramss['property'];
      this.propertyname = paramss['propname'];

      this.getMandateExec();
      
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
          this.getCounts()
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
        this.getCounts()
      } else if (this.allvisitparam == '1') {
        this.filterLoader = true;
        this.clicked = true;
        this.clicked1 = false;
        this.clicked2 = false;
        this.clicked3 = false;
        this.getCounts();
      }
      // Updated Using Strategy
    });
  }

  //here we get thejunk counts
  getCounts() {
    //dashboard counts
    if (this.fromdate == "" && this.todate == "" || this.fromdate == undefined && this.todate == undefined) {
      this.datecustomfetch = "Custom";
    } else {
      this.datecustomfetch = this.fromdate + ' - ' + this.todate;
    }

    var junk = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junk',
      stage: '',
      stagestatus: '',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junk).subscribe(compleads => {
      this.filterLoader = false;
      if (compleads['status'] == 'True') {
        this.totalJunkCount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.totalJunkCount = 0;
      }
    });

    var junkleads = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkleads',
      stage: '',
      stagestatus: '',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkleads).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkleadscount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkleadscount = 0;
      }
    });

    var junkvisits = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: '',
      stagestatus: '',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisits).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitscount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitscount = 0;
      }
    });

    var junkvisitsusv = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'USV',
      stagestatus: '',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitsusv).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsUSVcount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsUSVcount = 0;
      }
    });

    var junkvisitsusvfix = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'USV',
      stagestatus: '1',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitsusvfix).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsUSVFixcount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsUSVFixcount = 0;
      }
    });

    var junkvisitsusvdone = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'USV',
      stagestatus: '3',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitsusvdone).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsUSVDonecount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsUSVDonecount = 0;
      }
    });

    var junkvisitssv = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'SV',
      stagestatus: '',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitssv).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsSVcount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsSVcount = 0;
      }
    });

    var junkvisitssvfix = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'SV',
      stagestatus: '1',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitssvfix).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsSVFixcount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsSVFixcount = 0;
      }
    });


    var junkvisitssvdone = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'SV',
      stagestatus: '3',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitssvdone).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsSVDonecount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsSVDonecount = 0;
      }
    });

    var junkvisitsrsv = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'RSV',
      stagestatus: '',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitsrsv).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsRSVcount =compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsRSVcount = 0;
      }
    });

    var junkvisitsrsvfix = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'RSV',
      stagestatus: '1',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitsrsvfix).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsRSVFixcount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsRSVFixcount = 0;
      }
    });

    var junkvisitsrsvdone = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'RSV',
      stagestatus: '3',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitsrsvdone).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsRSVDonecount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsRSVDonecount = 0;
      }
    });

    var junkvisitsfn = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'Final Negotiation',
      stagestatus: '',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitsfn).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsFNcount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsFNcount = 0;
      }
    });

    var junkvisitsfnfix = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'Final Negotiation',
      stagestatus: '1',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitsfnfix).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsFNFixcount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsFNFixcount = 0;
      }
    });

    var junkvisitsfndone = {
      datefrom: this.fromdate,
      dateto: this.todate,
      statuss: 'junkvisits',
      stage: 'Final Negotiation',
      stagestatus: '3',
      executid: this.execid,
      loginuser: this.userid,
      propid: this.propertyid,
      source: this.source
    }
    this._mandateService.assignedLeadsCount(junkvisitsfndone).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        this.junkvisitsFNDonecount = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.junkvisitsFNDonecount = 0;
      }
    });

  }

  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
      }
    });
  }

  getMandateExec() {
    this._mandateService.fetchmandateexecutuves(this.propertyid, '','','').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      }
    });
  }

  getSourceList() {
    this._sharedService.sourcelist().subscribe(sources => {
      sources.filter((sou) => {
        if (sou.source == 'GR - Microsite') {
          sou.source = 'GR - campaign';
        }
      })
      this.sourcelist = sources;
      this.filterLoader = false;
    })
  }

  rmchange(vals) {
    this.filterLoader = true;
    if (vals.target.value == 'all') {
      this.execid = "";
      this.execname = "";
      this.router.navigate([], {
        queryParams: {
          execid: '',
          execname: ""
        },
        queryParamsHandling: 'merge',
      });
      this.filterLoader = false;
    } else if(vals.target.value) {
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
  }

  sourcechange(vals) {
    this.filterLoader = true;
    this.source = vals.target.value;
    this.router.navigate([], {
      queryParams: {
        source: this.source,
      },
      queryParamsHandling: 'merge',
    });
  }

  propchange(vals) {
    var element = document.getElementById('filtermaindiv');
    this.filterLoader = true;
    if (vals.target.value == 'all') {
      this.propertyid = "";
      this.propertyname = "";
      this.router.navigate([], {
        queryParams: {
          property: "",
          propname: "",
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.propertyid = vals.target.value;
      this.propertyname = vals.target.options[vals.target.options.selectedIndex].text;
      this.router.navigate([], {
        queryParams: {
          property: this.propertyid,
          propname: vals.target.options[vals.target.options.selectedIndex].text,
          execid: '',
          execname: ''
        },
        queryParamsHandling: 'merge',
      });
    }
    $('#rm_dropdown').dropdown('clear');
  }

  backToWelcome() {
    $('.modal-backdrop').closest('div').remove();   
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }

  refresh() {
    this.source = '';
    this.fromdate = '';
    this.todate = '';
    this.execid='';
    this.execname = '';
    this.propertyid = '';
    this.propertyname = '';
    this.router.navigate(['/mandate-junk-dash'], {
      queryParams: {
        allvisits: 1,
        from: '',
        to:'',
        dashtype: 'dashboard',
        source: '',
        execid:'',
        execname:'',
        property:'',
        propname:'',
        htype:'mandate'
      }
    });
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
