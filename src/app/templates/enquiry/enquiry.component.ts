import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { retailservice } from '../../retail.service';
import { Enquiry, leadforward } from './enq';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css'],
})

export class EnquiryComponent implements OnInit {
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
  model = new Enquiry();
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
  todate: any;
  @ViewChild('datepicker') datepickerreceived: ElementRef;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @ViewChild('cancel') cancel: ElementRef;
  selectedlocality: any;
  locality: any;
  roleid: any;
  assignedResponseInfo: any;
  roleTeam: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  uploadedResultCSV: any;
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
    localStorage.setItem('locationURL', '')
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
    this.getlocalitylist();
    this.getcitylist();

    const savedState = sessionStorage.getItem('enquiry_state');

    if (savedState) {
      const state = JSON.parse(savedState);
      this.isRestoredFromSession = true;
      this.fromdate = state.fromdate;
      this.todate = state.todate;
      this.propertyid = state.property;
      this.source = state.source;
      EnquiryComponent.count = state.page;
      this.enquiries = state.leads;
      this.leads = state.id
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
      setTimeout(() => {
        if (state.id == 1) {
          $(".freshLeads_section").addClass("active");
        } else if (state.id == 2) {
          $(".pendingLeads_section").addClass("active");
        }
      }, 100)

      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = state.scrollTop;
      }, 0);
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0)
      this.getProperties();
      this.filterLoader = false;
      this.getEnquiriesCount();
      // 🔴 IMPORTANT
    }

    this.getleadsData();
    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }
    // EnquiryComponent.count = 0;
    EnquiryComponent.retailCount = 0;
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
      // this.resetScroll();
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
      this.resetScroll();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0)
      this.detailsPageRedirection();

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
      } else if (this.leads = '1') {
        this.getenquiries();
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
    EnquiryComponent.count = 0;
    $(".pendingLeads_section").removeClass("active");
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
      propname: this.propertyid
    }
    this._sharedservice.getenquirylist(param).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = enquirys;
      this.freshleads = enquirys;
    })
  }

  //here we get all the pending leads data on clicking pending leads
  getPendingEnquiries() {
    $(".freshLeads_section").removeClass("active");
    $(".pendingLeads_section").addClass("active");
    EnquiryComponent.count = 0;
    let param = {
      limitparam: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      cityid: this.selectedCity,
      leads: 2,
      count: null,
      propname: this.propertyid
    }
    this._sharedservice.getenquirylist(param).subscribe(enquirys => {
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
      propname: this.propertyid
    }
    this._sharedservice.getenquirylist(param).subscribe(enquirys => {
      this.enquiryCount = enquirys[0].freshleads_count;
      this.pendingLeads = enquirys[0].pendingleads_count;
    })
  }

  //source selection  filter
  onCheckboxChangesource(selectedsource) {
    EnquiryComponent.count = 0;
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
    EnquiryComponent.count = 0;
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
      this.router.navigate(['/Enquiry'], {
        queryParams: {
          leads: 2,
          property: this.propertyid
        },
        queryParamsHandling: 'merge',
      })

    } else {
      this.router.navigate(['/Enquiry'], {
        queryParams: {
          property: this.propertyid
        },
        queryParamsHandling: 'merge',
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
    } else {
      restrictCount = this.enquiryCount;
    }
    let param = {
      limitparam: EnquiryComponent.count += 30,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      cityid: this.selectedCity,
      leads: this.leads,
      count: null,
      propname: this.propertyid
    }
    let livecount = this.enquiries.length;
    if (livecount < restrictCount) {
      this.filterLoader = true
      return this._sharedservice.getenquirylist(param).subscribe(enquirys => {
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
    EnquiryComponent.count = 0;
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
    EnquiryComponent.count = 0;
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
    EnquiryComponent.count = 0;
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
    this.datefilterview = false;
    this.filterProjects();
    // if(this.propId != ''){
    this.propId = '';
    // if (this.leads == '2') {
    //   this.getPendingEnquiries();
    //   this.getEnquiriesCount();
    // } else {
    //   this.getenquiries();
    //   this.getEnquiriesCount();
    // }
    // }
    if (this.leads == '2') {
      this.router.navigate(['/Enquiry'], {
        queryParams: {
          leads: 2,
          from: '',
          to: '',
          source: '',
          cityId: '',
          cityName: '',
          property: ''
        }
      });
    } else {
      this.router.navigate(['/Enquiry'], {
        queryParams: {
          leads: '1',
          from: '',
          to: '',
          source: '',
          cityId: '',
          cityName: '',
          property: ''
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
      this.router.navigate(['/Enquiry'], {
        queryParams: {
          leads: 2,
          source: '',
          cityId: '',
          property: this.propertyid
        }
      });
    } else {
      this.router.navigate(['/Enquiry']);
    }
  }

  rowidentifier(i) {
    if ($('.duplicateidentify-' + i).hasClass('active')) {
      $('.duplicateidentify-' + i).removeClass('active');
      $('.duplicateidentify-' + i).addClass('hidden');
    } else {
      $('.subduplicates').removeClass('active');
      $('.subduplicates').addClass('hidden');
      $('.duplicateidentify-' + i).addClass('active');
      $('.duplicateidentify-' + i).removeClass('hidden');
    }
  }

  getcitybasedleads(event) {
    const id = event.target.value;
    this.cityid = id;
    this.router.navigate([], {
      queryParams: {
        cityId: this.cityid
      },
      queryParamsHandling: 'merge'
    })
  }

  sizeselection(event) {
    var value = event.target.value;
    const a = document.getElementById("sizeselect") as HTMLInputElement;
    a.value = value;
    let numArr = value.match(/[\d\.]+/g)
    numArr = numArr.filter(n => n != '.')
    this.model.size = numArr;
  }

  typeselection(event) {
    var value = event.target.value;
    const a = document.getElementById("proptypeselect") as HTMLInputElement;
    a.value = value;
    this.model.propertytype = value;
  }

  prioritychange(event) {
    this.model.priority = event.target.value;
  }

  possessionselection(event) {
    var value = event.target.value;
    const a = document.getElementById("possessionselect") as HTMLInputElement;
    a.value = value;
    this.model.timeline = value;
  }

  budgetselection(event) {
    var value = event.target.value;
    const a = document.getElementById("budgetselect") as HTMLInputElement;
    a.value = value;
    this.model.budget = value;
  }

  sourcechange(event) {
    this.model.source = event.target.value;
  }

  localitychange(event,) {
    this.model.location = event.target.options[event.target.options.selectedIndex].text;
    this.model.locId = event.target.value;
  }

  addenquiry() {
    this.model.username = localStorage.getItem('Name');
    if ($('#custname').val() == "") {
      $('#custname').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#custname').val())) {
        $('#custname').removeAttr("style");
      }
      else {
        $('#custname').focus().css("border-color", "red").attr('placeholder', 'Please enter valid name').val('');
        return false;
      }
    }
    if ($('#custnum').val() == "") {
      $('#custnum').focus().css("border-color", "red").attr('placeholder', 'Please Enter Phone Number');
      return false;
    }
    else {
      var mobilee = /^[0-9]{10}$/;
      if (mobilee.test($('#custnum').val())) {
        $('#custnum').removeAttr('style');
      } else {
        $('#custnum').focus().css('border-color', 'red').attr('placeholder', 'Please enter valid contact number').val('');
        return false;
      }
    }
    if ($('#custmail').val() == "") {
      $('#custmail').focus().css("border-color", "red").attr('placeholder', 'Please Enter Email-id');
      return false;
    }
    else {
      var email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
      if (email.test($('#custmail').val())) {
        $('#custmail').removeAttr("style");
      }
      else {
        $('#custmail').focus().css("border-color", "red").attr('placeholder', 'Please enter valid email-id').val('');
        return false;
      }
    }
    if (this.model.source == undefined || this.model.source == '' || this.model.source == null) {
      // $('.source_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the source');
      swal({
        title: 'Please select the source Type',
        text: "Select any kind of Type",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }
    else {
      $('.source_dropdown').removeAttr("style");
    }

    if ($('#proptypeselect').val() == "" || $('#proptypeselect').val() == undefined || $('#proptypeselect').val() == null) {
      swal({
        title: 'Please select the Property Type',
        text: "Select the source",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }
    else {
      $('#proptypeselect').removeAttr("style");
    }
    if ($('#possessionselect').val() == "" || $('#possessionselect').val() == undefined || $('#possessionselect').val() == null) {
      swal({
        title: 'Please select the Possession',
        text: "Select any Timeline for the client.",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }
    else {
      $('#possessionselect').removeAttr("style");
    }
    if (($('#sizeselect').val() == "" || $('#sizeselect').val() == undefined || $('#sizeselect').val() == null) && this.model.propertytype != '3') {
      swal({
        title: 'Please select the Size',
        text: "Select any BHK for the Final Submission",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }
    else {
      $('#sizeselect').removeAttr("style");
    }
    if ($('#budgetselect').val() == "" || $('#budgetselect').val() == undefined || $('#budgetselect').val() == null) {
      swal({
        title: 'Please select the Budget',
        text: "Select any budget range ",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }
    else {
      $('#budgetselect').removeAttr("style");
    }

    if ($('#address').val().trim() == "" || $('#address').val() == undefined || $('#address').val() == null) {
      $('#address').focus().css("border-color", "red").attr('placeholder', 'Please Enter the address');
      return false;
    }
    else {
      $('#address').removeAttr("style");
    }

    var params = this.model;
    this.loadershow = true;

    this._sharedservice.addenquiry(params).subscribe((success) => {
      this.status = success.code;
      if (this.status == "0") {
        this.loadershow = false;
        this.addAsDuplicate = '';
        swal({
          title: 'Lead Added Succesfully',
          text: 'Added as a new Lead',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        })
        $('.close').click();
        this.getenquiries();
        this.save();
      } else if (this.status == "1") {
        setTimeout(() => {
          this.duplicateLeadsInfo = success.Leads;
          this.loadershow = false;
          $('#alreadyExist_lead_detail').click();
          setTimeout(() => {
            $('body').addClass('modal-open');
            this.duplicateLeadsInfo = success.Leads;
          }, 100)
        }, 1000);
      } else if (this.status == "2") {
        this.loadershow = false;
        this.addAsDuplicate = '';
        swal({
          title: 'Lead Added Succesfully',
          text: 'Added as a new Lead',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        })
        $('.close').click();
        this.getenquiries();
        this.save();
      } else {
        this.loadershow = false;
        this.addAsDuplicate = '';
        swal({
          title: 'Some Error Occured',
          text: 'Lead Not Passed',
          type: 'error',
          showConfirmButton: false,
          timer: 2000
        })
        this.getenquiries();
        this.save();
        $('.close').click();
      }
    }, (err) => {
      console.log("Failed to Update");
    })
  };

  //create mew lead
  addDuplicateLead() {
    this.addAsDuplicate = '1';
    this.model.duplicate = '1';
    setTimeout(() => {
      this.addenquiry();
    }, 1000);
  }

  //cancel in add lead popup
  cancelDuplicateLead() {
    $('.close').click();
    $('#addleadmod').click();
    this.getenquiries();
    this.save();
  }

  closeModal() {
    $('#addleadmod').click();
  }

  save() {
    $('.modal').removeClass('in');
    $('#add_test').hide();
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', "");
    $('#cancel').click();
    this.model.name = "";
    this.model.number = "";
    this.model.mail = "";
    this.model.propertytype = "";
    this.model.size = "";
    this.model.source = "";
    this.model.timeline = "";
    this.model.budget = "";
    this.model.address = "";
    $(".radiocheck").prop("checked", false);
  }

  freshLeadsParams() {
    $(".pendingLeads_section").removeClass("active");
    $(".freshLeads_section").addClass("active");
    $('#sourceDropdown').dropdown('clear');
    this.homes247leadbtn = true;
    this.othersleadbtn = false;
    this.cityid = ''
    if (this.routeparams['leads'] == '2') {
      this.router.navigate(['/Enquiry'])
    } else {
      this.router.navigate(['/Enquiry'], {
        queryParamsHandling: 'merge'
      })
    }
  }

  getlocalitylist() {
    this._mandateService.localitylist().subscribe(localities => {
      this.locality = localities;
      // this.selectedlocality = this.show_cnt['localityid'];
    })
  }

  pendingLeadsParams() {
    $(".freshLeads_section").removeClass("active");
    $(".pendingLeads_section").addClass("active");
    $('#sourceDropdown').dropdown('clear');
    this.homes247leadbtn = true;
    this.othersleadbtn = false;
    this.cityid = ''
    this.router.navigate([], {
      queryParams: {
        leads: '2',
        source: '',
        cityId: ''
      }
    })
  }

  //on clicking the homes247 button changing the url params
  // getHomesleads() {
  //   if (this.leads == '2') {
  //     this.router.navigate([], {
  //       queryParams: {
  //         leads: 2,
  //         source: 'Homes247',
  //         cityId: ''
  //       },
  //       queryParamsHandling: 'merge'
  //     });
  //   } else {
  //     this.router.navigate([], {
  //       queryParams: {
  //         source: 'Homes247',
  //         cityId: ''
  //       },
  //       queryParamsHandling: 'merge'
  //     });
  //   }

  //   this.othersleadbtn = true;
  //   this.homes247leadbtn = false;
  // }

  //get homes 247 leads data
  // gethomes247leads() {
  //   EnquiryComponent.count = 0;
  //   this.enquiryCount = 0;
  //   this.homes247leadbtn = false;
  //   this.othersleadbtn = true;
  //   this.filterLoader = true;
  //   let leadtype;
  //   if (this.pendingLeadsData == true) {
  //     leadtype = 2;
  //   } else {
  //     leadtype = 1;
  //   }
  //   let param = {
  //     limitparam: 0,
  //     limitrows: 30,
  //     source: "Homes247",
  //     cityid: this.cityid,
  //     leads: leadtype,
  //     count: null,
  //     propname: this.propertyid
  //   }
  //   this._sharedservice.getenquirylist(param).subscribe(enquirys => {
  //     this.getHomes247LeadsCount();
  //     this.filterLoader = false;
  //     this.enquiries = enquirys;
  //     this.freshleads = enquirys;
  //   })
  // }

  //get homes247 leads count
  // getHomes247LeadsCount() {
  //   this.homes247leadbtn = false;
  //   this.othersleadbtn = true;
  //   let param = {
  //     limitparam: 0,
  //     limitrows: 30,
  //     source: "Homes247",
  //     cityid: this.cityid,
  //     leads: null,
  //     count: 1,
  //     propname: this.propertyid
  //   }
  //   this._sharedservice.getenquirylist(param).subscribe(enquirys => {
  //     this.enquiryCount = enquirys[0].freshleads_count;
  //     this.pendingLeads = enquirys[0].pendingleads_count;
  //   })
  // }


  //on scroll mandate assign leads table to load the leads data
  // loadMoreForRetail() {
  //   let limitparam = EnquiryComponent.retailCount += 100;
  //   let limitrows = 100;
  //   let propertyname = this.mandatePropertyName;

  //   let livecount = this.builderleads.length;
  //   if (livecount < 10000) {
  //     this.filterLoader = true
  //     this._sharedservice.fetchbuilderleads(propertyname, limitrows, limitparam).subscribe(builderslead => {
  //       this.filterLoader = false;
  //       this.builderleads = this.builderleads.concat(builderslead);
  //     })
  //   }
  // }

  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
        this.getMandateDetails();
      } else {
      }
    });
  }

  // executives_LIST
  getexecutives(event) {
    this.roleTeam = event.target.options[event.target.options.selectedIndex].value;
    // if (id == '50010') {
    // } else if (id == '50004') {
    // } else {
    //   id = ''
    // }
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

  // In this method when the user selects the executive .based on the length of selected exec
  // and leads count we are restricting the selection of exec in dropdown 
  executiveSelect(event, type) {
    this.selectedExecIds = [];
    //here im pushing the leads id to array to get the length size
    var arraylist = this.leadforwards.assignedleads.split(',');

    // if (this.isRandomChecked == false) {
    //   if (this.selectedEXEC.length > arraylist.length) {
    //     this.selectedEXEC.pop();
    //   }
    // }

    // if (event && type == 'mandate') {
    this.selectedExecIds = this.selectedEXEC.map((exec) => exec.id)
    if (this.selectedEXEC.length > 1 && this.maxSelectedLabels > 1) {
      $('#customSwitch1').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch1').prop('checked', false);
      this.randomCheckVal = '';
    }
    // }

    // if (event && type == 'retail') {
    //   this.selectedRetEXECIds = this.selectedRetEXEC.map((exec) => exec.ExecId)
    //   if (this.selectedRetEXEC.length > 1 && this.maxSelectedLabels > 1) {
    //     $('#customSwitch1').prop('checked', true);
    //     this.randomCheckVal = 1;
    //   } else {
    //     $('#customSwitch1').prop('checked', false);
    //     this.randomCheckVal = '';
    //   }
    // }

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
  assignmodalfetch(val) {
    this.selectedteamOption = val;
    this.assignmodalval = val;
    this.leadforwards.assignedleads = '';
    $('#counts_dropdown').dropdown('clear');
    if (val == '1') {
      this.teamselectionmodal = true;
      this.builderleadassignmodal = false;
      this.selectedteamOption = val;
      this._retailService.getRetailExecutives('', '').subscribe(execute => {
        this.executives = execute['DashboardCounts'];
      })
    } else if (val == '2') {
      // this.propertyid = 'GR Sitara';
      this.propId = '16793';
      this.executiveId = null;
      this.mandateprojectsfetch()
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
    }
    this.assignselection = false;
  }

  //here we the selected assigne team
  selectedAssignTeam(event) {
    this.selectedteamOption = event.target.value;
    this.assignmodalfetch(event.target.value)
  }

  //this the mandate leads assign property dropdown .selecting the property
  filteredproject: any = '';
  leadsType(event) {
    this.propertyid = event.target.value;
    let filteredproject = this.mandateprojects.filter((da) => da.property_info_name == event.target.value);
    this.propId = filteredproject[0].property_idfk;
    this.getMandateDetails();
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
  }

  //this os to select the team 
  // teamchange(vals) {
  //   if (vals.target.value == 'all') {
  //     this.team = "";
  //     this.router.navigate([], {
  //       queryParams: {
  //         team: "",
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   } else {
  //     this.team = vals.target.value;
  //     this.router.navigate([], {
  //       queryParams: {
  //         team: this.team
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   };
  //   this.getMandateDetails();
  // }

  //to get all the mandate executive based on the team id
  getMandateDetails() {
    // if (this.propertyid != null) {
    this._mandateService.fetchmandateexecutuves(this.propId, '', this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      } else {
        this.mandateexecutives = [];
      }
    });
    // }
  }

  getMandateRanavExecutives() {
    this._mandateService.getExecutivesForRanav(this.propId, '', this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      } else {
        this.mandateexecutives = [];
      }
    });
  }

  // modalback() {
  //   if (this.assignmodalval == '1') {
  //     this.assignmodalval = "";
  //     this
  //     this.teamselectionmodal = false;
  //     this.assignselection = true;
  //   } else if (this.assignmodalval == '2') {
  //     this.builderleadassignmodal = false;
  //     this.propertyselection = true;
  //     this.assignselection = false;
  //     this.assignmodalval = '3';
  //   } else if (this.assignmodalval == '3') {
  //     this.propertyselection = false;
  //     this.assignselection = true;
  //     this.assignmodalval = "";
  //   }
  //   else {
  //     this.teamselectionmodal = false;
  //     this.builderleadassignmodal = false;
  //     this.propertyselection = false;

  //     $('.close').click();
  //   }
  // }

  //this is to get all the mandate assign leads to assign the leads to the executives
  fetchbuilderleads(val) {
    EnquiryComponent.retailCount = 0;
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
    this._retailService.leadassign(param, this.randomCheckVal, this.userid, '').subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {
        // this.closeModal();
        this.filterLoader = false;
        swal({
          title: 'Assigned Succesfully',
          type: 'success',
          // confirmButtonText: 'Show Details'
          showConfirmButton: false,
          timer: 2000
        })
        // .then(() => {
        //   this.assignedResponseInfo = success['details'];
        //   $('#assign_leads_detail').click();
        // })
        this.cancel.nativeElement.click();
        this.assignleadModalClose();
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
  assignMandatetorm() {
    this.filterLoader = true;
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
    if (this.selectedExecIds.length == 0) {
      swal({
        title: 'Please Select The Executive!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      this.filterLoader = false;
      return false;
    }
    else {
      $('#rm_dropdown').removeAttr("style");
      this.filterLoader = true;
    }
    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let comma_separated_data = this.selectedExecIds.join(',')
    this.leadforwards.customersupport = comma_separated_data;

    var param = this.leadforwards;
    var propId = this.propId;
    var excId = this.executiveId;
    if (this.filteredproject.crm == '2') {
      this._mandateService.ranavleadassign(param, propId, this.randomCheckVal, this.userid, '').subscribe((success) => {
        this.filterLoader = false;
        this.status = success.status;
        if (this.status == "True") {
          this.closeModal();
          this.assignleadModalClose();
          swal({
            title: 'Assigned Succesfully',
            type: 'success',
            confirmButtonText: 'Show Details'
          }).then(() => {
            this.assignedResponseInfo = success['details'];
            $('#assign_leads_detail').click();
          })
          // this.cancel.nativeElement.click();
          $('#assigneeeTeam_dropdown').dropdown('clear');
          $('#counts_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          $('#mandaterm_dropdown').dropdown('clear');
          this.selectedExecIds = [];
          this.selectedEXEC = [];
          this.selectedteamOption = 0;
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
    } else {
      this._mandateService.leadassign(param, propId, this.randomCheckVal, this.userid, '').subscribe((success) => {
        this.filterLoader = false;
        this.status = success.status;
        if (this.status == "True") {
          this.closeModal();
          this.assignleadModalClose();
          swal({
            title: 'Assigned Succesfully',
            type: 'success',
            confirmButtonText: 'Show Details'
          }).then(() => {
            this.assignedResponseInfo = success['details'];
            $('#assign_leads_detail').click();
          })
          this.cancel.nativeElement.click();
          $('#assigneeeTeam_dropdown').dropdown('clear');
          $('#counts_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          $('#mandaterm_dropdown').dropdown('clear');
          this.selectedExecIds = [];
          this.selectedEXEC = [];
          this.selectedteamOption = 0;
          //after assign to get the count and leads data
          //  if (this.routeparams['leads'] == '2') {
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
  }

  modalclose() { }

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

  //on date filter showing the daterange picker
  showdateRange() {
    this.dateRange = [this.currentdateforcompare];
    setTimeout(() => {
      const inputElement = this.datepickerreceived.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.click();
    }, 0);
  }

  //here we get the from and to date based on the calender selection
  onDateRangeSelected(range: Date[]): void {
    this.dateRange = range;
    // Convert the first date of the range to yyyy-mm-dd format
    if (this.dateRange != null) {
      let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
      if (formattedFromDate != null && formattedToDate != null) {
        this.fromdate = formattedFromDate;
        this.todate = formattedToDate;
        if ((this.fromdate != '' && this.fromdate != undefined && this.fromdate != null) && (this.todate != '' || this.todate != undefined || this.todate != null)) {
          this.router.navigate([], {
            queryParams: {
              from: this.fromdate,
              to: this.todate
            },
            queryParamsHandling: 'merge',
          });
        }
      }
    }
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
      propname: this.propertyid
    }

    this.filterLoader = true
    return this._sharedservice.getenquirylist(param).subscribe(enquirys => {
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

  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
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
        this.datefilterview = true;
        this.router.navigate([], {
          queryParams: {
            from: this.fromdate,
            to: this.todate,
          },
          queryParamsHandling: 'merge',
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

  detailsPageRedirection() {
    localStorage.setItem('backLocation', 'fresh');
    localStorage.setItem('locationURL', this.router.url)
  }

  redirectTO(enquiry) {

    this._sharedservice.leads = this.enquiries;
    this._sharedservice.page = EnquiryComponent.count;
    this._sharedservice.scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this._sharedservice.hasState = true;

    const state = {
      fromdate: this.fromdate,
      todate: this.todate,
      property: this.propertyid,
      source: this.source,
      page: EnquiryComponent.count,
      scrollTop: this.scrollContainer.nativeElement.scrollTop,
      id: this.leads,
      leads: this.enquiries
    };
    console.log(state,this.source)
    sessionStorage.setItem('enquiry_state', JSON.stringify(state));

    this.router.navigate([
      '/mandate-customers',
      enquiry.customer_IDPK,
      this.userid,
      0,
      'mandate',
      ''
    ]);
  }

  //importing leads through csv file
  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  // importcsvfile(event: any) {
  //   const file: File = event.target.files[0];

  //   if (file && file.name.endsWith('.csv')) {
  //     console.log('CSV file selected:', file);
  //   } else {
  //     swal({
  //       title: 'Invalid File Format',
  //       text: 'Please upload a valid CSV file only.',
  //       type: "error",
  //       timer: 3000,
  //       showConfirmButton: false
  //     }).then(() => {

  //     });
  //   }
  // }

  importcsvfile(event: any) {
    const file: File = event.target.files[0];

    // Validate CSV
    if (!file || !file.name.toLowerCase().endsWith('.csv')) {
      swal({
        title: 'Invalid File',
        text: 'Only CSV files are allowed.',
        type: 'error',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    this._sharedservice.uploadCSV(file).subscribe((resp) => {
      console.log(file);
      if (resp.status == true) {
        console.log(resp.summary)
        this.uploadedResultCSV = resp.summary;
        swal({
          title: 'Successfully uploaded the File',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          $('.close').click();
          setTimeout(() => {
            $('#import_csv_detail').click();
          })
        });
      }
    })

    // const reader = new FileReader();

    // reader.onload = () => {
    //   const csvData = reader.result as string;
    //   this.printCsvToConsole(csvData);
    // };

    // reader.readAsText(file);
  }

  // printCsvToConsole(csvData: string) {
  //   const rows = csvData.split('\n');

  //   const result = rows.map(row =>
  //     row.split(',').map(cell => cell.trim())
  //   );

  //   console.log('CSV DATA:', result);
  // }
}
