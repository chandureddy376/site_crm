import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { retailservice } from '../../retail.service';
import { leadforward } from '../enquiry/enq';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Subscription } from 'rxjs'

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-whatsapp-visit',
  templateUrl: './whatsapp-visit.component.html',
  styleUrls: ['./whatsapp-visit.component.css']
})
export class WhatsappVisitComponent implements OnInit {

  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;

  constructor(
    private _sharedservice: sharedservice,
    private router: Router,
    private route: ActivatedRoute,
    private _mandateService: mandateservice,
    private _retailService: retailservice,
    private cdRef: ChangeDetectorRef,
    public datepipe: DatePipe,
  ) {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
      $('.ui.checkbox').checkbox();
    }, 1000);
    if (localStorage.getItem('Role') != '1' && localStorage.getItem('Role') != '2') {
      this.router.navigateByUrl('/login');
    }
  }

  routeparams: any;
  enquiries: any;
  freshleads: any;
  static count: number;
  enquiryCount: number = 0;
  static retailCount: number = 0;
  homes247leadbtn = true;
  othersleadbtn = false;
  loadershow = false;
  assignselection = true;
  teamselectionmodal = false;
  propertyselection = false;
  builderleadassignmodal = false;
  builderleads: any;
  filterLoader: boolean = true;
  selectedprop: any;
  today = new Date();
  dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0');
  yyyy = this.today.getFullYear();
  date = this.yyyy + '-' + this.mm + '-' + this.dd;
  pendingLeads: number = 0;
  allLeads: number = 0;
  status: any;
  executives: any;
  cities: any;
  cityid: any;
  leadforwards = new leadforward();
  assignmodalval: any;
  team: any;
  mandateexecutives: any;
  propertyid: any = '';
  executiveId: any;
  mandatePropertyName: any;
  selectedAssignType: any;
  maxSelectedLabels: number = Infinity;
  selectedEXEC: any[] = [];
  selectedRetEXEC: any[] = [];
  selectedExecIds: number[] = [];
  selectedRetEXECIds: any[] = [];
  isRandomChecked: boolean = false;
  showSelectAll: boolean = false;
  randomCheckVal: any;
  userid: any;
  leads: any;
  sourcelist: any;
  searchTerm: string = '';
  propertyList: any;
  copyofpropertyList: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  previousMonthDateForCompare: any;
  executivesList: any;
  assigneeTeam: any;
  selectedteamOption: any = 1;
  duplicateLeadsInfo: any;
  addAsDuplicate: string = '';
  mandateprojects: any;
  selectedRetailLeads: any;
  propId: any;
  source: any;
  copyOfSource: any;
  copyofcity: any;
  searchTerm_city: string = '';
  searchTerm_source: string = '';
  selectedCity: any;
  selectedCityName: any;
  sourceFilter: boolean = false;
  cityFilter: boolean = false;
  propertyFilter: boolean = false;
  dateRange: Date[];
  fromdate: any;
  datefilterview: boolean = false;
  visitedFrom: any;
  visitedTo: any;
  visitedDatefilterview: boolean = false;
  todate: any;
  @ViewChild('datepicker') datepickerreceived: ElementRef;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @ViewChild('cancel') cancel: ElementRef;
  roleid: any;
  roleTeam: any;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  visitedOnStart: moment.Moment | null = null;
  visitedOnEnd: moment.Moment | null = null;
  selectedLeadAssign: any;
  isRestoredFromSession = false;

  ngOnInit() {
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');
    this.assigneeTeam = [
      { name: 'Retail Team', value: 1 },
      { name: 'Mandate Team', value: 2 },
    ]
    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    //to get the previous month date of the present day date
    var previousMonthDate = new Date(this.currentdateforcompare);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    var prevMonth = (previousMonthDate.getMonth() + 1).toString().padStart(2, '0');
    var prevDay = previousMonthDate.getDate().toString().padStart(2, '0');
    this.previousMonthDateForCompare = previousMonthDate.getFullYear() + '-' + prevMonth + '-' + prevDay;
    this.getsourcelist();
    this.getcitylist();

    const savedState = sessionStorage.getItem('whatapp_visit_state');

    if (savedState) {
      const state = JSON.parse(savedState);
      this.isRestoredFromSession = true;
      this.fromdate = state.fromdate;
      this.todate = state.todate;
      this.propertyid = state.property;
      this.source = state.source;
      this.visitedFrom = state.visitfrom,
        this.visitedTo = state.visitto,


        WhatsappVisitComponent.count = state.page;
      this.enquiries = state.leads;


      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
      } else {
        if (this.leads == 2) {
          this.datefilterview = true;
        } else {
          this.datefilterview = false;
          this.fromdate = '';
          this.todate = '';
        }
      }

      if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == '' || this.visitedTo == undefined || this.visitedTo == null)) {
        this.visitedDatefilterview = false;
      } else {
        this.visitedDatefilterview = true;
      }

      if (this.source == '' || this.source == undefined || this.source == null) {
        this.sourceFilter = false;
      } else {
        this.sourceFilter = true;
      }

      if (this.selectedCity == undefined || this.selectedCity == '' || this.selectedCity == null) {
        this.cityFilter = false;
      } else {
        this.cityFilter = true;
      }

      if (this.propertyid == '' || this.propertyid == undefined || this.propertyid == null) {
        this.propertyFilter = false;
      } else {
        this.propertyFilter = true;
      }

      $(".pendingLeads_section").removeClass("active");
      $(".freshLeads_section").removeClass("active");
      $(".allLeads_section").removeClass("active");
      setTimeout(() => {
        if (state.tabs == 1) {
          $(".freshLeads_section").addClass("active");
        } else if (state.tabs == 2) {
          $(".pendingLeads_section").addClass("active");
        } else if (state.tabs == 3) {
          $(".allLeads_section").addClass("active");
        }
        this.getEnquiriesCount();
      }, 0)

      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = state.scrollTop;
      }, 0);
      this.filterLoader = false;
      // 🔴 IMPORTANT
    }

    this.getleadsData();
    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }
    WhatsappVisitComponent.count = 0;
    WhatsappVisitComponent.retailCount = 0;
    $('.ui.accordion').accordion();
  }

  ngOnDestroy() {
    $('.modal').remove();
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
      this.initializeVisitedOnDateRangePicker();
      this.resetScroll();
    }, 0);
  }

  getleadsData() {
    this.route.queryParams.subscribe((response) => {

      if (this.isRestoredFromSession) {
        this.filterLoader = false;
        this.isRestoredFromSession = false;
        setTimeout(() => {
          sessionStorage.clear();
        }, 3000)
        return;
      }

      this.filterLoader = true;
      this.propertyid = response['property'];
      this.source = response['source'];
      this.selectedCity = response['cityId'];
      this.selectedCityName = response['cityName'];
      this.leads = response['leads'];
      this.fromdate = response['from'];
      this.todate = response['to'];
      this.visitedFrom = response['visitFrom'];
      this.visitedTo = response['visitTo'];
      this.resetScroll();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.initializeVisitedOnDateRangePicker();
      }, 100)

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
      } else {
        if (this.leads == 2) {
          this.datefilterview = true;
        } else {
          this.datefilterview = false;
          this.fromdate = '';
          this.todate = '';
        }
      }

      if ((this.visitedFrom == '' || this.visitedFrom == undefined || this.visitedFrom == null) || (this.visitedTo == '' || this.visitedTo == undefined || this.visitedTo == null)) {
        this.visitedDatefilterview = false;
      } else {
        this.visitedDatefilterview = true;
      }

      if (this.source == '' || this.source == undefined || this.source == null) {
        this.sourceFilter = false;
      } else {
        this.sourceFilter = true;
      }

      if (this.selectedCity == undefined || this.selectedCity == '' || this.selectedCity == null) {
        this.cityFilter = false;
      } else {
        this.cityFilter = true;
      }

      if (this.propertyid == '' || this.propertyid == undefined || this.propertyid == null) {
        this.propertyFilter = false;
      } else {
        this.propertyFilter = true;
      }

      if (this.leads == '2') {
        this.getPendingEnquiries();
      } else if (this.leads == '1') {
        this.getenquiries();
      } else if (this.leads == 3) {
        this.getAllenquiries();
      }

      this.getProperties();
      this.getEnquiriesCount();
    })
  }

  //get list properties for filter
  getProperties() {
    this._sharedservice.propertylistForEnquiry(this.leads, this.source).subscribe(prop => {
      this.propertyList = prop['Leads'];
      this.copyofpropertyList = prop['Leads'];
    })
  }

  getsourcelist() {
    this._sharedservice.sourcelist().subscribe(sources => {
      sources.filter((sou) => {
        if (sou.source == 'GR - Microsite') {
          sou.source = 'GR - campaign';
        }
      })
      this.sourcelist = sources;
      this.copyOfSource = sources;
    });
  }

  getcitylist() {
    this._sharedservice.getcities().subscribe(citylist => {
      this.cities = citylist;
      this.copyofcity = citylist;
    })
  }

  // ENQUIRY-VIEW-FROM-DB  for fresh leads data 
  getenquiries() {
    WhatsappVisitComponent.count = 0;
    $(".pendingLeads_section").removeClass("active");
    $(".allLeads_section").removeClass("active");
    $(".freshLeads_section").addClass("active");
    let param = {
      limitparam: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      cityid: this.selectedCity,
      leads: 1,
      count: null,
      propname: this.propertyid,
      visitFromDate: this.visitedFrom,
      visitToDate: this.visitedTo
    }
    this._sharedservice.getenquirylistVisits(param).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = enquirys;
      this.freshleads = enquirys;
    })
  }

  //here we get all the pending leads data on clicking pending leads
  getPendingEnquiries() {
    $(".freshLeads_section").removeClass("active");
    $(".allLeads_section").removeClass("active");
    $(".pendingLeads_section").addClass("active");
    WhatsappVisitComponent.count = 0;
    let param = {
      limitparam: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      cityid: this.selectedCity,
      leads: 2,
      count: null,
      propname: this.propertyid,
      visitFromDate: this.visitedFrom,
      visitToDate: this.visitedTo
    }
    this._sharedservice.getenquirylistVisits(param).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = enquirys;
      this.freshleads = enquirys;
    })
  }

  // ENQUIRY-VIEW-FROM-DB  for all received leads data 
  getAllenquiries() {
    WhatsappVisitComponent.count = 0;
    $(".pendingLeads_section").removeClass("active");
    $(".freshLeads_section").removeClass("active");
    $(".allLeads_section").addClass("active");
    let param = {
      limitparam: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      cityid: this.selectedCity,
      leads: '',
      count: null,
      propname: this.propertyid,
      visitFromDate: this.visitedFrom,
      visitToDate: this.visitedTo,
      all: '1'
    }
    this._sharedservice.getenquirylistVisits(param).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = enquirys;
      this.freshleads = enquirys;
    })
  }

  //here we get the count of fresh and pending leads count
  getEnquiriesCount() {
    this.enquiryCount = 0;
    this.pendingLeads = 0;
    let param = {
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      cityid: this.selectedCity,
      leads: null,
      count: 1,
      propname: this.propertyid,
      visitFromDate: this.visitedFrom,
      visitToDate: this.visitedTo
    }
    this._sharedservice.getenquirylistVisits(param).subscribe(enquirys => {
      this.enquiryCount = enquirys[0].freshvisits_count;
      this.pendingLeads = enquirys[0].pendingleads_count;
      this.allLeads = enquirys[0].all_counts;
    })
  }

  //source selection  filter
  onCheckboxChangesource(selectedsource) {
    WhatsappVisitComponent.count = 0;
    if (selectedsource != '' || selectedsource != undefined) {
      if (selectedsource == 'GR - campaign') {
        selectedsource = 'GR - Microsite';
      } else {
        selectedsource = selectedsource;
      }

      this.source = selectedsource;
      this.sourceFilter = true;

      if (this.source == 'Homes247' || this.source == 'Homes247 - Whatsapp' || this.source == 'Homes247-Campaign') {
        this.cities.filter((city) => {
          if (city.name == 'Bangalore') {
            this.selectedCity = city.id;
            this.selectedCityName = city.name;
          };
        })
      } else {
        this.selectedCity = '';
        this.selectedCityName = '';
      }

      this.router.navigate([], {
        queryParams: {
          source: this.source,
          cityId: this.selectedCity,
          cityName: this.selectedCityName
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.source = '';
      this.sourceFilter = false;
    }

  }

  // Filter source based on search 
  filtersource(): void {
    if (this.searchTerm_source != '') {
      this.sourcelist = this.copyOfSource.filter(project =>
        project.source.toLowerCase().includes(this.searchTerm_source.toLowerCase())
      );
    } else {
      this.sourcelist = this.copyOfSource
    }
  }

  //city selection  filter
  onCheckboxChangecity(selectedcity) {
    WhatsappVisitComponent.count = 0;
    if (selectedcity != '' || selectedcity != undefined || selectedcity != null) {
      this.selectedCity = selectedcity.id;
      this.selectedCityName = selectedcity.name;
      this.sourceFilter = true;
      this.router.navigate([], {
        queryParams: {
          cityId: this.selectedCity,
          cityName: this.selectedCityName,
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.selectedCity = '';
      this.selectedCityName = '';
      this.cityFilter = false;
    }

  }

  // Filter city based on search 
  filtercity(): void {
    if (this.searchTerm_city != '') {
      this.cities = this.copyofcity.filter(city =>
        city.name.toLowerCase().includes(this.searchTerm_city.toLowerCase())
      );
    } else {
      this.cities = this.copyofcity
    }
  }

  //property selection  filter
  onCheckboxChange(property) {
    if (property != '' || property != undefined) {
      this.propertyid = property;
      this.propertyFilter = true;
    } else {
      this.propertyid = '';
      this.propertyFilter = false;;
    }

    if (this.leads == '2') {
      this.router.navigate(['/whatsapp-visit'], {
        queryParams: {
          leads: 2,
          property: this.propertyid
        }
      })

    } else {
      this.router.navigate(['/whatsapp-visit'], {
        queryParams: {
          property: this.propertyid
        }
      })
    }

  }

  //Filter projects based on search param
  filterProjects(): void {
    if (this.searchTerm != '') {
      this.propertyList = this.copyofpropertyList.filter(project => {
        const propertyName = project.propertyname ? project.propertyname.toLowerCase() : '';
        return propertyName.includes(this.searchTerm.toLowerCase());
      });
    } else {
      this.propertyList = this.copyofpropertyList
    }
  }

  //on scroll fresh leads, pending and retail assign leads table to load the leads data
  loadMore() {
    let restrictCount;
    if (this.leads == '2') {
      restrictCount = this.pendingLeads;
    } else if (this.leads == '1') {
      restrictCount = this.enquiryCount;
    } else {
      restrictCount = this.allLeads;
    }
    let param = {
      limitparam: WhatsappVisitComponent.count += 30,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      cityid: this.selectedCity,
      leads: this.leads != 3 ? this.leads : '',
      count: null,
      propname: this.propertyid,
      visitFromDate: this.visitedFrom,
      visitToDate: this.visitedTo,
      all: this.leads == 3 ? '1' : ''
    }
    let livecount = this.enquiries.length;
    if (livecount < restrictCount) {
      this.filterLoader = true
      return this._sharedservice.getenquirylistVisits(param).subscribe(enquirys => {
        this.filterLoader = false;
        this.enquiries = this.enquiries.concat(enquirys);
        this.freshleads = this.freshleads.concat(enquirys);
        this.cdRef.detectChanges();
      })
    }
  }

  //here we remove the property filter
  propertyclose() {
    $('#project_dropdown').dropdown('clear');
    $("input[name='propFilter']").prop("checked", false);
    this.propertyFilter = false;
    WhatsappVisitComponent.count = 0;
    this.propertyid = "";
    this.searchTerm = '';
    this.propertyList = this.copyofpropertyList;
    this.router.navigate([], {
      queryParams: {
        property: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  //here we remove the source filter
  sourceClose() {
    $('#source_dropdown').dropdown('clear');
    $("input[name='sourceFilter']").prop("checked", false);
    this.sourceFilter = false;
    WhatsappVisitComponent.count = 0;
    this.searchTerm_source = '';
    this.source = this.copyOfSource;
    if (this.source == 'Homes247' || this.source == 'Homes247 - Whatsapp' || this.source == 'Homes247-Campaign') {
      this.router.navigate([], {
        queryParams: {
          source: '',
          cityId: '',
          cityName: ''
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate([], {
        queryParams: {
          source: '',
        },
        queryParamsHandling: 'merge',
      });
    }
    this.source = "";
  }

  //here we remove the city filter
  cityClose() {
    this.cityFilter = false;
    WhatsappVisitComponent.count = 0;
    this.selectedCity = "";
    this.searchTerm_city = '';
    this.cities = this.copyofcity;
    this.router.navigate([], {
      queryParams: {
        cityId: '',
        cityName: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  //this method refreshes /reset the page 
  refresh() {
    this.homes247leadbtn = true;
    this.othersleadbtn = false;
    this.selectedCity = '';
    this.selectedCityName = '';
    this.source = '';
    this.propertyid = '';
    this.searchTerm = '';
    this.fromdate = '';
    this.todate = '';
    this.visitedFrom = '';
    this.visitedTo = '';
    this.datefilterview = false;
    this.visitedDatefilterview = false;
    this.filterProjects();
    this.propId = '';
    if (this.leads == '2') {
      this.router.navigate(['/whatsapp-visit'], {
        queryParams: {
          leads: 2,
          from: '',
          to: '',
          source: '',
          cityId: '',
          cityName: '',
          property: '',
          visitFrom: '',
          visitTo: ''
        }
      });
    } else if (this.leads == '1') {
      this.router.navigate(['/whatsapp-visit'], {
        queryParams: {
          leads: '1',
          from: '',
          to: '',
          source: '',
          cityId: '',
          cityName: '',
          property: '',
          visitFrom: '',
          visitTo: ''
        }
      });
    } else {
      this.router.navigate(['/whatsapp-visit'], {
        queryParams: {
          leads: '3',
          from: '',
          to: '',
          source: '',
          cityId: '',
          cityName: '',
          property: '',
          visitFrom: '',
          visitTo: ''
        }
      });
    }
  }

  //here on clicking the assign modal close im reseting the team dropdown to retail by default.
  assignleadModalClose() {
    $('.modal-backdrop').closest('div').remove();
    let currentUrl = this.router.url;
    let pathWithoutQueryParams = currentUrl.split('?')[0];
    let currentQueryparams = this.route.snapshot.queryParams;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
    });
  }

  resetPropertyFilter() {
    this.propertyid = '';
    if (this.leads == '2') {
      this.router.navigate(['/whatsapp-visit'], {
        queryParams: {
          leads: 2,
          source: '',
          cityId: '',
          property: this.propertyid
        }
      });
    } else {
      this.router.navigate(['/whatsapp-visit']);
    }
  }

  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
      } else {
      }
    });
  }

  // executives_LIST
  getexecutives(event) {
    this.roleTeam = event.target.options[event.target.options.selectedIndex].value;
    // let id = event.target.options[event.target.options.selectedIndex].value;
    // if (id == '50010') {
    // } else if (id == '50004') {
    // } else {
    //   id = ''
    // }
    // this._retailService.getRetailExecutives(id, '').subscribe(execute => {
    //   this.executives = execute['DashboardCounts'];
    // })

    this._mandateService.fetchmandateexecutuves(this.propId, '', this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      } else {
        this.mandateexecutives = [];
      }
    });
  }

  getexecutivesnames(event) {
    const name = event.target.options[event.target.options.selectedIndex].text;
    this.leadforwards.telecallername = name;
  }

  //get list of executives for  filter purpose
  getExecutivesForFilter() {
    this._sharedservice.getexecutiveslist('', '', '', '', '').subscribe(executives => {
      this.executivesList = executives;
    });
  }

  //to get selected leads id based on the select count or manual selection
  getselectedRetailleads() {
    this.leadforwards.assignedleads = '';
    var checkid = $("input[name='programmingretail']:checked").map(function () {
      return this.value;
    }).get().join(',');
    this.leadforwards.assignedleads = checkid;
    //here im pushing the leads id to array to get the length size and assign it to the maxselectedlabels variable
    var arraylist = this.leadforwards.assignedleads.split(',');
    this.maxSelectedLabels = arraylist.length;
    if (this.selectedRetEXEC && this.selectedRetEXEC.length > 1 && this.maxSelectedLabels > 1) {
      $('#customSwitch1').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch1').prop('checked', false);
      this.randomCheckVal = '';
    }
  }

  //to get selected leads id based on the select count or manual selection
  getselectedMandateleads() {
    this.leadforwards.assignedleads = '';
    var checkid = $("input[name='programmingmandate']:checked").map(function () {
      return this.value;
    }).get().join(',');
    this.leadforwards.assignedleads = checkid;
    //here im pushing the leads id to array to get the length size and assign it to the maxselectedlabels variable
    var arraylist = this.leadforwards.assignedleads.split(',');
    this.maxSelectedLabels = arraylist.length;

    if (this.selectedEXEC && this.selectedEXEC.length > 1 && this.maxSelectedLabels > 1) {
      $('#customSwitch1').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch1').prop('checked', false);
      this.randomCheckVal = '';
    }
  }

  // In this method when the user selects the executive .based on the length of selected exec and leads count we are restricting the selection of exec in dropdown 
  executiveSelect(event, type) {
    this.selectedExecIds = [];
    //here im pushing the leads id to array to get the length size
    var arraylist = this.leadforwards.assignedleads.split(',');

    if (event && type == 'mandate') {
      this.selectedExecIds = this.selectedEXEC.map((exec) => exec.id)
      if (this.selectedEXEC.length > 1 && this.maxSelectedLabels > 1) {
        $('#customSwitch1').prop('checked', true);
        this.randomCheckVal = 1;
      } else {
        $('#customSwitch1').prop('checked', false);
        this.randomCheckVal = '';
      }
    }

    if (event && type == 'retail') {
      this.selectedRetEXECIds = this.selectedRetEXEC.map((exec) => exec.ExecId)
      if (this.selectedRetEXEC.length > 1 && this.maxSelectedLabels > 1) {
        $('#customSwitch1').prop('checked', true);
        this.randomCheckVal = 1;
      } else {
        $('#customSwitch1').prop('checked', false);
        this.randomCheckVal = '';
      }
    }

    //here im removing the repeated leads isd's from the array
    this.selectedExecIds = Array.from(new Set(this.selectedExecIds));
    this.selectedRetEXECIds = Array.from(new Set(this.selectedRetEXECIds));
  }

  //when random is selected the leads can  assign all leads to all the selected employees 
  checkActive(event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked == true) {
      this.isRandomChecked = true;
      this.showSelectAll = true;
      this.selectedEXEC = [];
      this.randomCheckVal = 1;
    } else {
      this.isRandomChecked = false;
      this.showSelectAll = false;
      this.selectedEXEC = [];
    }
  }

  //this method is triggered when clicking on assign to get the list of leads.\
  assignmodalfetch(val, lead) {
    this.selectedteamOption = val;
    this.assignmodalval = val;
    this.leadforwards.assignedleads = '';
    $('#counts_dropdown').dropdown('clear');
    // if (val == '1') {
    //   this.teamselectionmodal = true;
    //   this.builderleadassignmodal = false;
    //   this.selectedteamOption = val;
    //   this._retailService.getRetailExecutives('', '').subscribe(execute => {
    //     this.executives = execute['DashboardCounts'];
    //   })
    // } else if (val == '2') {
    // this.propertyid = 'GR Sitara';
    this.propId = '16793';
    this.executiveId = null;
    this.mandateprojectsfetch()
    this.getMandateDetails();
    this.selectedLeadAssign = lead;
    // this.teamselectionmodal = false;
    // this.builderleadassignmodal = true;
    // this.fetchbuilderleads('GR Sitara');
    // if (this.propertyid != '') {
    //   if (this.leads == '2') {
    //     this.getPendingEnquiries();
    //     this.getEnquiriesCount();
    //   } else {
    //     this.getenquiries();
    //     this.getEnquiriesCount();
    //   }
    //   
    // }
    // }
    this.assignselection = false;
  }

  //here we the selected assigne team
  // selectedAssignTeam(event) {
  //   this.selectedteamOption = event.target.value;
  //   this.assignmodalfetch(event.target.value)
  // }

  //this the mandate leads assign property dropdown .selecting the property
  leadsType(event) {
    this.propertyid = event.target.value;
    let filteredproject = this.mandateprojects.filter((da) => da.property_info_name == event.target.value);
    this.propId = filteredproject[0].property_idfk;
    this.getMandateDetails();
  }

  //to get all the mandate executive based on the team id
  getMandateDetails() {
    this._mandateService.fetchmandateexecutuves(this.propId, '', this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      } else {
        this.mandateexecutives = [];
      }
    });
  }

  //this is to get all the mandate assign leads to assign the leads to the executives
  fetchbuilderleads(val) {
    WhatsappVisitComponent.retailCount = 0;
    this.filterLoader = true;
    this.propertyselection = false;
    this.builderleadassignmodal = true;
    this.selectedprop = val;
    var propertyname = val;
    var limitrows = 30;
    var limitparam = 0;
    this.mandatePropertyName = val;
    this._sharedservice.fetchbuilderleads(propertyname, limitrows, limitparam).subscribe(builderslead => {
      this.filterLoader = false;
      this.builderleads = builderslead;
    })
  }

  //here we get the select counts of leads for retail
  selectcounts(event) {
    if (event.target.value > 30) {
      this.getReassignLeadsData(parseInt(event.target.value));
    } else {
      this.selectedAssignType = event.target.value
      $('#start2 tr td :checkbox').each(function () {
        this.checked = false;
      });
      var checkBoxes = $("#start2 tr td :checkbox:lt(" + event.target.value + ")");//using :lt get total num of checkboxes
      $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));

      if (event.target.value == 'Manual') {
        $('input[id="hidecheckboxid"]').attr("disabled", false);
        $('.hidecheckbox').show();
        this.getselectedRetailleads();
      } else {
        $('.hidecheckbox').hide();
        $('input[id="hidecheckboxid"]:checked').show();
        $('input[id="hidecheckboxid"]:checked').attr("disabled", true);
        this.getselectedRetailleads();
      }
    }
  }

  //here we get all the selected counts of leads for mandate
  selectcountsForBuilders(event) {
    if (event.target.value > 30) {
      this.getReassignLeadsData(parseInt(event.target.value));
    } else {
      $('#start3 tr td :checkbox').each(function () {
        this.checked = false;
      });
      var checkBoxes = $("#start3 tr td :checkbox:lt(" + event.target.value + ")");//using :lt get total num of checkboxes
      $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));

      if (event.target.value == 'Manual') {
        $('input[id="hidebuildercheckboxid"]').attr("disabled", false);
        $('.hideBuilderCheckbox').show();
        this.getselectedMandateleads();
      } else {
        $('.hideBuilderCheckbox').hide();
        $('input[id="hidebuildercheckboxid"]:checked').show();
        $('input[id="hidebuildercheckboxid"]:checked').attr("disabled", true);
        this.getselectedMandateleads();
      }
    }
  }

  // INSERT_ASSIGNED_LEADS for retail
  assigntorm() {
    this.filterLoader = true;
    if (this.selectedRetEXECIds.length == 0) {
      swal({
        title: 'Please Select One Executive!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      this.filterLoader = false;
      return false;
    }
    else {
      $('.executives').removeAttr("style");
      this.filterLoader = true;
    }

    if (this.leadforwards.assignedleads == "") {
      swal({
        title: 'Please Select Some Leads!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      this.filterLoader = false;
      return false;
    }
    else {
      $('#selectedleads').removeAttr("style");
      this.filterLoader = true;
    }
    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let comma_separated_data = this.selectedRetEXECIds.join(',')
    this.leadforwards.customersupport = comma_separated_data;

    var param = this.leadforwards;
    var excId = this.executiveId;
    var visits = '1';
    this._retailService.leadassign(param, this.randomCheckVal, this.userid, visits).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {
        this.filterLoader = false;
        swal({
          title: 'Assigned Succesfully',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        })
        this.cancel.nativeElement.click();
        //after assign to get the count and leads data
        // if (this.routeparams['leads'] == '2') {
        //   this.getPendingEnquiries();
        // } else {
        //   this.getenquiries();
        // }
        // this.getEnquiriesCount();
        $('.modal-backdrop').closest('div').remove();
        let currentUrl = this.router.url;
        let pathWithoutQueryParams = currentUrl.split('?')[0];
        let currentQueryparams = this.route.snapshot.queryParams;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
        })
        $('#assigneeeTeam_dropdown').dropdown('clear');
        $('#counts_dropdown').dropdown('clear');
        $('#exec_designation').dropdown('clear');
        $('#rm_dropdown').dropdown('clear');
        this.selectedRetEXEC = [];
        this.selectedteamOption = 1;
      } else {
        this.filterLoader = false;
        swal({
          title: 'Authentication Failed!',
          text: 'Please try again',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    });
  }

  // INSERT_ASSIGNED_LEADS for mandate
  // assignMandatetorm() {
  //   this.filterLoader = true;
  //   if (this.leadforwards.assignedleads == "") {
  //     swal({
  //       title: 'Please Select Some Leads!',
  //       text: 'Please try again',
  //       type: 'error',
  //       confirmButtonText: 'OK'
  //     })
  //     this.filterLoader = false;
  //     return false;
  //   } else {
  //     $('#selectedleads').removeAttr("style");
  //     this.filterLoader = true;
  //   }

  //   if (this.selectedExecIds.length == 0) {
  //     swal({
  //       title: 'Please Select The Executive!',
  //       text: 'Please try again',
  //       type: 'error',
  //       confirmButtonText: 'OK'
  //     })
  //     this.filterLoader = false;
  //     return false;
  //   } else {
  //     $('#rm_dropdown').removeAttr("style");
  //     this.filterLoader = true;
  //   }

  //   //here its a array of  lead ids converting it to a single value  as comma seperated.
  //   let comma_separated_data = this.selectedExecIds.join(',')
  //   this.leadforwards.customersupport = comma_separated_data;

  //   // var param = this.leadforwards;
  //   // var propId = this.propId;
  //   // var excId = this.executiveId;
  //   // var visits = '1';
  //   let selectedleadIds = this.leadforwards['assignedleads'].split(',').map(id => id.trim());
  //   console.log(selectedleadIds)
  //   let selectedLeads: any[] = [];
  //   selectedLeads = this.enquiries.filter(lead =>
  //     lead.Lead_IDFK && selectedleadIds.includes(lead.Lead_IDFK)
  //   );
  //   console.log(selectedLeads)

  //   let selectedPropNames = selectedLeads.map(lead => lead.propertyname);
  //   let selectedPropIds = selectedLeads.map(lead => lead.propid);
  //   let selectedVisitedDate = selectedLeads.map(lead => lead.visitdatetime);
  //   let selectedLeadTime = selectedLeads.map(lead => lead.selectedtime);

  //   let visitParam = {
  //     leadId: this.leadforwards['assignedleads'],
  //     loginid: this.userid,
  //     propname: selectedPropNames.join(','),
  //     propid: selectedPropIds.filter(Boolean).join(','),
  //     toexecid: this.leadforwards.customersupport,
  //     visitdate: selectedVisitedDate.join(','),
  //     visittime: selectedLeadTime.join(',')
  //   }
  //   console.log(visitParam)
  //   this._mandateService.whatsappVisitleadassign(visitParam).subscribe((success) => {
  //     this.filterLoader = false;
  //     this.status = success.status;
  //     if (this.status == "True") {
  //       swal({
  //         title: 'Visit Assigned Succesfully',
  //         type: 'success',
  //         showConfirmButton: false,
  //         timer: 2000
  //       })
  //       this.cancel.nativeElement.click();
  //       $('#assigneeeTeam_dropdown').dropdown('clear');
  //       $('#counts_dropdown').dropdown('clear');
  //       $('#property_dropdown').dropdown('clear');
  //       $('#mandaterm_dropdown').dropdown('clear');
  //       this.selectedExecIds = [];
  //       this.selectedEXEC = [];
  //       this.selectedteamOption = 0;
  //       //after assign to get the count and leads data
  //       //  if (this.routeparams['leads'] == '2') {
  //       //   this.getPendingEnquiries();
  //       // } else {
  //       //   this.getenquiries();
  //       // }
  //       // this.getEnquiriesCount();
  //       $('.modal-backdrop').closest('div').remove();
  //       let currentUrl = this.router.url;
  //       let pathWithoutQueryParams = currentUrl.split('?')[0];
  //       let currentQueryparams = this.route.snapshot.queryParams;
  //       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //         this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
  //       });
  //     } else {
  //       swal({
  //         title: 'Authentication Failed!',
  //         text: 'Please try again',
  //         type: 'error',
  //         confirmButtonText: 'OK'
  //       })
  //     }
  //   }, (err) => {
  //     console.log("Connection Failed")
  //   });
  // }

  // INSERT_ASSIGNED_LEADS for mandate and works for single selection lead
  visitAssign() {
    this.filterLoader = true;
    if (this.selectedLeadAssign.Lead_IDFK == "") {
      swal({
        title: 'Please Select the Lead!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      this.filterLoader = false;
      return false;
    } else {
      $('#selectedleads').removeAttr("style");
      this.filterLoader = true;
    }

    if (this.selectedExecIds.length == 0) {
      swal({
        title: 'Please Select The Executive!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      this.filterLoader = false;
      return false;
    } else {
      $('#rm_dropdown').removeAttr("style");
      this.filterLoader = true;
    }

    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let comma_separated_data = this.selectedExecIds.join(',')
    this.leadforwards.customersupport = comma_separated_data;

    let visitParam = {
      leadId: this.selectedLeadAssign.Lead_IDFK,
      loginid: this.userid,
      propname: this.selectedLeadAssign.propertyname,
      propid: this.selectedLeadAssign.propid,
      toexecid: this.leadforwards.customersupport,
      visitdate: this.selectedLeadAssign.visitdatetime,
      visittime: this.selectedLeadAssign.selectedtime
    }

    this._mandateService.whatsappVisitleadassign(visitParam).subscribe((success) => {
      this.filterLoader = false;
      this.status = success.status;
      if (this.status == "True") {
        swal({
          title: 'Visit Assigned Succesfully',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        })
        this.cancel.nativeElement.click();
        $('#assigneeeTeam_dropdown').dropdown('clear');
        $('#counts_dropdown').dropdown('clear');
        $('#property_dropdown').dropdown('clear');
        $('#mandaterm_dropdown').dropdown('clear');
        this.selectedExecIds = [];
        this.selectedEXEC = [];
        this.selectedteamOption = 0;
        $('.modal-backdrop').closest('div').remove();
        let currentUrl = this.router.url;
        let pathWithoutQueryParams = currentUrl.split('?')[0];
        let currentQueryparams = this.route.snapshot.queryParams;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
        });
      } else {
        swal({
          title: 'Authentication Failed!',
          text: 'Please try again',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    });
  }

  //Filter projects in retial modal based on user search
  filterretailProjects(event): void {
    if (event.target.value != '') {
      this.propertyList = this.copyofpropertyList.filter(project => {
        const propertyName = project.propertyname ? project.propertyname.toLowerCase() : '';
        return propertyName.includes(event.target.value.toLowerCase());
      });
    } else {
      this.propertyList = this.copyofpropertyList
    }
  }

  //here again i'm assigning the prop list back , on clicking prop filter in retail assign modal
  retailPropget() {
    this.propertyList = this.copyofpropertyList;
  }

  deleteLeads(id) {
    swal({
      title: 'Confirmation',
      text: 'Do You Want to Delete the Lead',
      type: 'warning',
      confirmButtonText: "Yes!",
      cancelButtonText: "NO",
      showConfirmButton: true,
      showCancelButton: true
    }).then((result) => {
      if (result.value == true) {
        this._sharedservice.deleteLead(id).subscribe((resp) => {
          if (resp.status == 'True') {
            swal({
              title: 'Lead Deletion',
              text: 'Lead has been Deleted successfully',
              type: 'success',
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              let currentUrl = this.router.url;
              let pathWithoutQueryParams = currentUrl.split('?')[0];
              let currentQueryparams = this.route.snapshot.queryParams;
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
              })
            });
          }
        })
      }
    })
  }

  //here we remove the date filter
  dateclose() {
    this.datefilterview = false;
    this.fromdate = "";
    this.todate = "";
    this.router.navigate([], {
      queryParams: {
        from: "",
        to: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  visitedDateclose() {
    this.visitedDatefilterview = false;
    this.visitedFrom = "";
    this.visitedTo = "";
    this.router.navigate([], {
      queryParams: {
        visitFrom: "",
        visitTo: ""
      },
      queryParamsHandling: 'merge',
    });
  }

  getReassignLeadsData(limitR) {
    this.filterLoader = true;
    let restrictCount;
    if (this.leads == '2') {
      restrictCount = this.pendingLeads;
    } else {
      restrictCount = this.enquiryCount;
    }
    let param = {
      limitparam: 0,
      limitrows: limitR,
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      cityid: this.selectedCity,
      leads: this.leads,
      count: null,
      propname: this.propertyid,
      visitFromDate: this.visitedFrom,
      visitToDate: this.visitedTo
    }

    this.filterLoader = true
    return this._sharedservice.getenquirylistVisits(param).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = this.enquiries.concat(enquirys);
      this.freshleads = this.freshleads.concat(enquirys);
      setTimeout(() => {
        $('#start2 tr td :checkbox').each(function () {
          this.checked = false;
        });
        var checkBoxes = $("#start2 tr td :checkbox:lt(" + limitR + ")");//using :lt get total num of checkboxes
        $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));

        if (limitR == 'Manual') {
          $('input[id="hidecheckboxid"]').attr("disabled", false);
          $('.hidecheckbox').show();
          this.getselectedRetailleads();
        } else {
          $('.hidecheckbox').hide();
          $('input[id="hidecheckboxid"]:checked').show();
          $('input[id="hidecheckboxid"]:checked').attr("disabled", true);
          this.getselectedRetailleads();
        }
      }, 1000)
    })
  }

  initializeNextActionDateRangePicker() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromDate = urlParams.get('from');
    const toDate = urlParams.get('to');

    let startDate = fromDate ? moment(fromDate, 'YYYY-MM-DD') : moment().startOf('day');
    let endDate = toDate ? moment(toDate, 'YYYY-MM-DD') : moment().endOf('day');

    const nextActionPickerEl = $('#nextActionDates');

    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        nextActionPickerEl.find('span').html(
          `${start.format('MMMM D, YYYY')} - ${end.format('MMMM D, YYYY')}`
        );

        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          nextActionPickerEl.data('daterangepicker').setEndDate(end);
        }

        this.fromdate = start.format('YYYY-MM-DD');
        this.todate = end.format('YYYY-MM-DD');
        this.datefilterview = true;

        this.router.navigate([], {
          queryParams: { from: this.fromdate, to: this.todate },
          queryParamsHandling: 'merge',
        });
      } else {
        nextActionPickerEl.find('span').html('Select Date Range');
      }
    };

    nextActionPickerEl.daterangepicker(
      {
        startDate,
        endDate,
        maxDate: new Date(),
        showDropdowns: false,
        timePicker: false,
        locale: { format: 'MMMM D, YYYY' },
        autoApply: true,
      },
      cb
    );

    // Initialize with the correct dates
    // cb(startDate, endDate);
  }

  initializeVisitedOnDateRangePicker() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromDate = urlParams.get('visitFrom');
    const toDate = urlParams.get('visitTo');

    let startDate = fromDate ? moment(fromDate, 'YYYY-MM-DD') : moment().startOf('day');
    let endDate = toDate ? moment(toDate, 'YYYY-MM-DD') : moment().endOf('day');

    const visitedPickerEl = $('#visitedOnDates');

    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        visitedPickerEl.find('span').html(
          `${start.format('MMMM D, YYYY')} - ${end.format('MMMM D, YYYY')}`
        );

        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          visitedPickerEl.data('daterangepicker').setEndDate(end);
        }

        this.visitedFrom = start.format('YYYY-MM-DD');
        this.visitedTo = end.format('YYYY-MM-DD');
        this.visitedDatefilterview = true;

        this.router.navigate([], {
          queryParams: { visitFrom: this.visitedFrom, visitTo: this.visitedTo },
          queryParamsHandling: 'merge',
        });
      } else {
        visitedPickerEl.find('span').html('Select Date Range');
      }
    };

    visitedPickerEl.daterangepicker(
      {
        startDate,
        endDate,
        maxDate: moment().add(7, 'days').endOf('day'),
        //  maxDate: new Date(),
        showDropdowns: false,
        timePicker: false,
        locale: { format: 'MMMM D, YYYY' },
        autoApply: true,
      },
      cb
    );

    // Initialize with the correct dates
    // cb(startDate, endDate);
  }


  // initializeNextActionDateRangePicker() {
  //   const cb = (start: moment.Moment, end: moment.Moment) => {
  //     if (start && end) {
  //       $('#nextActionDates span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  //       if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
  //         end = end.endOf('day');
  //         // $(this).data('daterangepicker').setEndDate(end);
  //         $('#nextActionDates').data('daterangepicker').setEndDate(end);
  //       }
  //     } else {
  //       $('#nextActionDates span').html('Select Date Range');
  //     }

  //     if (start && end) {
  //       this.fromdate = start.format('YYYY-MM-DD');
  //       this.todate = end.format('YYYY-MM-DD');
  //       this.datefilterview = true;
  //       this.router.navigate([], {
  //         queryParams: {
  //           from: this.fromdate,
  //           to: this.todate,
  //         },
  //         queryParamsHandling: 'merge',
  //       });
  //     } else {
  //     }
  //   };
  //   // Retrieve the date range from the URL query params (if any)
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const fromDate = urlParams.get('from');
  //   const toDate = urlParams.get('to');
  //   // Initialize start and end dates based on URL parameters or default values
  //   let startDate = fromDate ? moment(fromDate) : moment().startOf('day');
  //   let endDate = toDate ? moment(toDate) : moment().endOf('day');

  //   if (fromDate) {
  //     startDate = moment(fromDate + ' ', 'YYYY-MM-DD');
  //   }

  //   if (toDate) {
  //     endDate = moment(toDate + ' ', 'YYYY-MM-DD');
  //   }

  //   $('#nextActionDates').daterangepicker({
  //     startDate: startDate || moment().startOf('day'),
  //     endDate: endDate || moment().startOf('day'),
  //     maxDate: new Date(),
  //     showDropdowns: false,
  //     timePicker: false,
  //     timePickerIncrement: 1,
  //     locale: {
  //       format: 'MMMM D, YYYY h:mm A'
  //     },
  //     autoApply: true,
  //   }, cb);
  //   cb(this.nextActionStart, this.nextActionEnd);
  // }

  // //here we get the datepicker for visited on filter
  // initializeVisitedOnDateRangePicker() {
  //   const cb1 = (start1: moment.Moment, end1: moment.Moment) => {
  //     if (start1 && end1) {
  //       $('#visitedOnDates span').html(start1.format('MMMM D, YYYY') + ' - ' + end1.format('MMMM D, YYYY'));
  //       if (end1.hours() === 0 && end1.minutes() === 0 && end1.seconds() === 0) {
  //         end1 = end1.endOf('day');
  //         // $(this).data('daterangepicker').setEndDate(end1);
  //          $('#visitedOnDates').data('daterangepicker').setEndDate(end1);
  //       }
  //     } else {
  //       $('#visitedOnDates span').html('Select Date Range');
  //     }

  //     if (start1 && end1) {
  //       this.visitedFrom = start1.format('YYYY-MM-DD');
  //       this.visitedTo = end1.format('YYYY-MM-DD');
  //       this.visitedDatefilterview = true;
  //       this.router.navigate([], {
  //         queryParams: {
  //           visitFrom: this.visitedFrom,
  //           visitTo: this.visitedTo
  //         },
  //         queryParamsHandling: 'merge',
  //       });
  //     } else {
  //     }
  //   };
  //   // Retrieve the date range from the URL query params (if any)
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const fromDate = urlParams.get('from');
  //   const toDate = urlParams.get('to');
  //   const fromTime = urlParams.get('fromtime');
  //   const toTime = urlParams.get('totime');
  //   // Initialize start and end dates based on URL parameters or default values
  //   let startDate1 = fromDate ? moment(fromDate) : moment().startOf('day');
  //   let endDate1 = toDate ? moment(toDate) : moment().endOf('day');

  //   if (fromTime && fromDate) {
  //     startDate1 = moment(fromDate + ' ' + fromTime, 'YYYY-MM-DD');
  //   }

  //   if (toTime && toDate) {
  //     endDate1 = moment(toDate + ' ' + toTime, 'YYYY-MM-DD');
  //   }

  //   $('#visitedOnDates').daterangepicker({
  //     startDate: startDate1 || moment().startOf('day'),
  //     endDate: endDate1 || moment().startOf('day'),
  //     showDropdowns: false,
  //     // maxDate: new Date(),
  //     maxDate: moment().add(7, 'days'),
  //     timePicker: false,
  //     timePickerIncrement: 1,
  //     locale: {
  //       format: 'MMMM D, YYYY h:mm A'
  //     },
  //     autoApply: true,
  //   }, cb1);
  //   cb1(this.visitedOnStart, this.visitedOnEnd);
  // }

  redirectTo(lead) {
    console.log(lead);

    this._sharedservice.leads = this.enquiries;
    this._sharedservice.page = WhatsappVisitComponent.count;
    this._sharedservice.scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this._sharedservice.hasState = true;

    localStorage.setItem('backLocation', '');

    const state = {
      fromdate: this.fromdate,
      todate: this.todate,
      property: this.propertyid,
      source: this.source,
      visitfrom: this.visitedFrom,
      visitto: this.visitedTo,
      page: WhatsappVisitComponent.count,
      scrollTop: this.scrollContainer.nativeElement.scrollTop,
      leads: this.enquiries,
      tabs: this.leads,
    };

    sessionStorage.setItem('whatapp_visit_state', JSON.stringify(state));

    this.router.navigate([
      '/mandate-customers',
      lead.Lead_IDFK,
      this.userid,
      0,
      'mandate',
      lead.propid
    ]);
  }

}
