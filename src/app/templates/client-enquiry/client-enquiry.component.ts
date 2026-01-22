import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { retailservice } from '../../retail.service';
import { Enquiry, leadforward } from '../enquiry/enq';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-client-enquiry',
  templateUrl: './client-enquiry.component.html',
  styleUrls: ['./client-enquiry.component.css']
})
export class ClientEnquiryComponent implements OnInit {
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
    if (localStorage.getItem('Role') != '2') {
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
  qualifiedLeads: number = 0;
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
  copyOfSource: any;
  copyofcity: any;
  searchTerm_city: string = '';
  searchTerm_source: string = '';
  selectedCity: any;
  selectedCityName: any;
  selectedLocality: any;
  selectedLocalityName: any;
  sourceFilter: boolean = false;
  cityFilter: boolean = false;
  localityFilter: boolean = false;
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
  copyOfLocality: any;
  roleid: any;
  searchTerm_locality: string = '';

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
    this.getleadsData();
    this.getcitylist();
    if (localStorage.getItem('Role') != '2') {
      this.router.navigateByUrl('/login');
    }
    ClientEnquiryComponent.count = 0;
    ClientEnquiryComponent.retailCount = 0;
    $('.ui.accordion').accordion();
  }

  ngOnDestroy() {
    $('.modal').remove();
    if(this.hoverSubscription){
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
    this.resetScroll();
  },0);
  }

  getleadsData() {
    this.route.queryParams.subscribe((response) => {
      this.filterLoader = true;
      this.propertyid = response['property'];
      this.selectedCity = response['cityId'];
      this.selectedCityName = response['cityName'];
      this.selectedLocality = response['localityId'];
      this.selectedLocalityName = response['localityName'];
      this.leads = response['leads'];
      this.fromdate = response['from'];
      this.todate = response['to'];
      // this.selectedLocality = response['localityId'];
      // this.selectedLocalityName = response['localityName'];

      this.resetScroll();
      setTimeout(()=>{
        this.initializeNextActionDateRangePicker();
      },0)

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
      } else {
        if (this.leads == 2 || this.leads == 'qualified') {
          this.datefilterview = true;
        } else {
          this.datefilterview = false;
          this.fromdate = '';
          this.todate = '';
        }
      }

      if (this.selectedCity == undefined || this.selectedCity == '' || this.selectedCity == null) {
        this.cityFilter = false;
      } else {
        this.cityFilter = true;
        this.getlocalitylist();
      }

      if (this.selectedLocality == undefined || this.selectedLocality == '' || this.selectedLocality == null) {
        this.localityFilter = false;
      } else {
        this.localityFilter = true;
      }

      if (this.propertyid == '' || this.propertyid == undefined || this.propertyid == null) {
        this.propertyFilter = false;
      } else {
        this.propertyFilter = true;
      }
      console.log(this.leads)
      if (this.leads == '2') {
        this.getPendingEnquiries();
      } else if (this.leads == '1') {
        this.getenquiries();
      } else if(this.leads == 'qualified'){
        this.getqualifiedLeads();
      }
      this.getProperties();
      this.getEnquiriesCount();
    })
  }

  //get list properties for filter
  getProperties() {
    this._sharedservice.propertylistForEnquiry(this.leads, '').subscribe(prop => {
      this.propertyList = prop['Leads'];
      this.copyofpropertyList = prop['Leads'];
    })
  }

  getcitylist() {
    this._sharedservice.getcities().subscribe(citylist => {
      this.cities = citylist;
      this.copyofcity = citylist;
    })
  }

  // ENQUIRY-VIEW-FROM-DB  for fresh leads data 
  getenquiries() {
    ClientEnquiryComponent.count = 0;
    $(".pendingLeads_section").removeClass("active");
    $(".qualifiedLeads_section").removeClass("active");
    $(".freshLeads_section").addClass("active");
    let param = {
      limitparam: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      cityid: this.selectedCity,
      leads: 'fresh',
      localityid: this.selectedLocality,
      propname: this.propertyid
    }
    this._sharedservice.getHomes247FreshLeads(param).subscribe((resp) => {
      this.filterLoader = false;
      this.enquiries = resp;
      this.freshleads = resp;
    })
  }

  //here we get all the pending leads data on clicking pending leads
  getPendingEnquiries() {
    $(".freshLeads_section").removeClass("active");
    $(".qualifiedLeads_section").removeClass("active");
    $(".pendingLeads_section").addClass("active");
    ClientEnquiryComponent.count = 0;
    let param = {
      limitparam: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      cityid: this.selectedCity,
      leads: 'pending',
      localityid: this.selectedLocality,
      propname: this.propertyid
    }
    this._sharedservice.getHomes247FreshLeads(param).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = enquirys;
      this.freshleads = enquirys;
    })
  }

  //here we get all the qualified leads data on clicking qualified leads
  getqualifiedLeads() {
    console.log('triggered')
    $(".freshLeads_section").removeClass("active");
    $(".pendingLeads_section").removeClass("active");
    $(".qualifiedLeads_section").addClass("active");
    ClientEnquiryComponent.count = 0;
    let param = {
      limitparam: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      cityid: this.selectedCity,
      leads: 'qualified',
      localityid: this.selectedLocality,
      propname: this.propertyid
    }
    console.log(param)
    this._sharedservice.getHomes247FreshLeads(param).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = enquirys;
      this.freshleads = enquirys;
    })
  }

  //here we get the count of fresh and pending leads count
  getEnquiriesCount() {
    this.enquiryCount = 0;
    this.pendingLeads = 0;
    this.qualifiedLeads =0;
    let param = {
      from: this.fromdate,
      to: this.todate,
      cityid: this.selectedCity,
      localityid: this.selectedLocality,
      leads: null,
      count: 1,
      propname: this.propertyid
    }
    this._sharedservice.getHomes247FreshLeads(param).subscribe(enquirys => {
      console.log(enquirys)
      this.enquiryCount = enquirys[0].freshleads_count;
      this.pendingLeads = enquirys[0].pendingleads_count;
      this.qualifiedLeads = enquirys[0].qualifiedleads_count;
    })
  }

  //city selection  filter
  onCheckboxChangecity(selectedcity) {
    ClientEnquiryComponent.count = 0;
    if (selectedcity != '' || selectedcity != undefined || selectedcity != null) {
      this.selectedCity = selectedcity.id;
      this.selectedCityName = selectedcity.name;
      // this.getlocalitylist();
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

  //locality selection  filter
  onCheckboxChangeLocality(local) {
    ClientEnquiryComponent.count = 0;
    if (local != '' || local != undefined || local != null) {
      this.selectedLocality = local.id;
      this.selectedLocalityName = local.locality;
      this.localityFilter = true;
      this.router.navigate([], {
        queryParams: {
          localityId: this.selectedLocality,
          localityName: this.selectedLocalityName,
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.selectedLocality = '';
      this.selectedLocalityName = '';
      this.localityFilter = false;
    }
  }

  // Filter locality based on search 
  filterlocality(): void {
    if (this.searchTerm_locality != '') {
      this.locality = this.copyOfLocality.filter(local =>
        local.locality.toLowerCase().includes(this.searchTerm_locality.toLowerCase())
      );
    } else {
      this.locality = this.copyOfLocality;
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
      this.router.navigate(['/homes247-enquiry'], {
        queryParams: {
          leads: 2,
          property: this.propertyid
        },queryParamsHandling:'merge'
      })
    } else  if (this.leads == 'qualified') {
      this.router.navigate(['/homes247-enquiry'], {
        queryParams: {
          leads: 'qualified',
          property: this.propertyid
        },queryParamsHandling:'merge'
      })
    } else {
      this.router.navigate(['/homes247-enquiry'], {
        queryParams: {
          property: this.propertyid
        },
        queryParamsHandling:'merge'
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
    let restrictCount, leadtype;
    if (this.leads == '2') {
      restrictCount = this.pendingLeads;
      leadtype = 'pending';
    } else if (this.leads == 'qualified') {
      restrictCount = this.qualifiedLeads;
      leadtype = 'qualified';
    } else {
      restrictCount = this.enquiryCount;
      leadtype = 'fresh';
    }
    let param = {
      limitparam: ClientEnquiryComponent.count += 30,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      cityid: this.selectedCity,
      localityid: this.selectedLocality,
      leads: leadtype,
      count: null,
      propname: this.propertyid
    }
    let livecount = this.enquiries.length;
    if (livecount < restrictCount) {
      this.filterLoader = true
      return this._sharedservice.getHomes247FreshLeads(param).subscribe(enquirys => {
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
    ClientEnquiryComponent.count = 0;
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

  //here we remove the city filter
  cityClose() {
    this.cityFilter = false;
    ClientEnquiryComponent.count = 0;
    this.selectedCity = "";
    this.searchTerm_city = '';
    this.cities = this.copyofcity;
    this.selectedLocality = "";
    this.searchTerm_locality = '';
    this.localityFilter = false;
    this.locality = this.copyOfLocality;
    this.router.navigate([], {
      queryParams: {
        cityId: '',
        cityName: '',
        localityId:'',
        localityName:'',
      },
      queryParamsHandling: 'merge',
    });
  }

  localityClose(){
    this.localityFilter = false;
    ClientEnquiryComponent.count = 0;
    this.selectedLocality = "";
    this.searchTerm_locality = '';
    this.locality = this.copyOfLocality;
    this.router.navigate([], {
      queryParams: {
        localityId:'',
        localityName:'',
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
    this.propertyid = '';
    this.searchTerm = '';
    this.fromdate = '';
    this.todate = '';
    this.selectedLocality = '';
    this.selectedLocalityName = '';
    this.datefilterview = false;
    this.localityFilter = false;
    this.cityFilter = false;
    this.searchTerm_city = '';
    this.searchTerm_locality = '';
    this.filterProjects();
    this.propId = '';
    if (this.leads == '2') {
      this.router.navigate(['/homes247-enquiry'], {
        queryParams: {
          leads: 2,
          from: '',
          to: '',
          cityId: '',
          cityName: '',
          localityId:'',
          localityName:'',
          property: ''
        }
      });
    } else  if (this.leads == 'qualified') {
      this.router.navigate(['/homes247-enquiry'], {
        queryParams: {
          leads: 'qualified',
          from: '',
          to: '',
          cityId: '',
          cityName: '',
          localityId:'',
          localityName:'',
          property: ''
        }
      });
    } else {
      this.router.navigate(['/homes247-enquiry'], {
        queryParams: {
          leads: '1',
          from: '',
          to: '',
          cityId: '',
          cityName: '',
          localityId:'',
          localityName:'',
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
      this.router.navigate(['/homes247-enquiry'], {
        queryParams: {
          leads: 2,
          cityId: '',
          localityId:'',
          localityName:'',
          property: this.propertyid
        }
      });
    } else if(this.leads == 'qualified'){
      this.router.navigate(['/homes247-enquiry'], {
        queryParams: {
          leads: 'qualified',
          cityId: '',
          localityId:'',
          localityName:'',
          property: this.propertyid
        }
      });
    } else {
      this.router.navigate(['/homes247-enquiry']);
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

  localitychange(event,) {
    this.model.location = event.target.options[event.target.options.selectedIndex].text;
    this.model.locId = event.target.value;
  }

  getlocalitylist() {
    this._sharedservice.getlocalityByCityId(this.selectedCity).subscribe(localities => {
      this.locality = localities;
      this.copyOfLocality = localities;
    })
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
    let id = event.target.options[event.target.options.selectedIndex].value;
    if (id == '50010') {
    } else if (id == '50004') {
    } else {
      id = ''
    }
    this._retailService.getRetailExecutives(id, '').subscribe(execute => {
      this.executives = execute['DashboardCounts'];
    })
  }

  getexecutivesnames(event) {
    const name = event.target.options[event.target.options.selectedIndex].text;
    this.leadforwards.telecallername = name;
  }

  //get list of executives for  filter purpose
  getExecutivesForFilter() {
    this._sharedservice.getexecutiveslist('','','','','').subscribe(executives => {
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
  }

  // In this method when the user selects the executive .based on the length of selected exec
  executiveSelect(event) {
    this.selectedExecIds = [];
      this.selectedExecIds = this.selectedEXEC.map((exec) => exec.client_id)
     this.selectedExecIds = Array.from(new Set(this.selectedExecIds));
  }

  //this method is triggered when clicking on assign to get the list of leads.\
  assignmodalfetch() {
    this.leadforwards.assignedleads = '';
    $('#counts_dropdown').dropdown('clear');
  }

  //this the mandate leads assign property dropdown .selecting the property
  cityselected(event) {
    let cityid = event.target.value;
    $('#mandaterm_dropdown').dropdown('clear');
    this.getClientList(cityid);
    this.selectedCity = event.target.value;
    this.selectedCityName = event.target.options[event.target.options.selectedIndex].text;
    this.router.navigate([], {
      queryParams: {
        cityId: this.selectedCity,
        cityName: this.selectedCityName,
      },
      queryParamsHandling: 'merge',
    });
  }

  clientList:any;
  //to get all the mandate executive based on the team id
  getClientList(id) {
    this._sharedservice.getCPClientList(id).subscribe((resp)=>{
      this.clientList = resp['CP_List'];
      console.log(this.clientList)
    })
  }

  //this is to get all the mandate assign leads to assign the leads to the executives
  fetchbuilderleads(val) {
    ClientEnquiryComponent.retailCount = 0;
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
    if (event.target.value > 100) {
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
    console.log(this.selectedExecIds)
    let param = {
      client:this.selectedExecIds.join(','),
      assignedleads:this.leadforwards.assignedleads
    }

    this._sharedservice.clientLeadassign(param).subscribe((success) => {
      this.filterLoader = false;
      this.status = success.status;
      if (this.status == "True") {
        swal({
          title: 'Assigned Succesfully',
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
    } else if (this.leads == 'qualified') {
      restrictCount = this.qualifiedLeads;
    } else {
      restrictCount = this.enquiryCount;
    }
    let param = {
      limitparam: 0,
      limitrows: limitR,
      from: this.fromdate,
      to: this.todate,
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
}

