import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { retailservice } from '../../retail.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { leadforward } from '../enquiry/enq';
import * as XLSX from "xlsx";
import * as moment from 'moment';
import { Subscription } from 'rxjs';
declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-client-leads',
  templateUrl: './client-leads.component.html',
  styleUrls: ['./client-leads.component.css']
})
export class ClientLeadsComponent implements OnInit {

  constructor(private renderer: Renderer2, private el: ElementRef, private route: ActivatedRoute, private _sharedService: sharedservice, private _mandateService: mandateservice, private _retailService: retailservice, public datepipe: DatePipe, private router: Router) {
    if (localStorage.getItem('Role') != '2') {
      this.router.navigateByUrl('/login');
    }
  }

  enquiries: any;
  leadsource: string = "";
  static count: number;
  leadcounts: any;
  dateRange: Date[];
  fromdate: any;
  todate: any
  filterLoader: boolean = true;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  previousMonthDateForCompare: any;
  copyofpropertyList: any;
  propertyList: any;
  propertyname: any;
  propertyid: any;
  leadforwards = new leadforward();
  userid: any;
  datefilterview: boolean = false;
  propertyFilter: boolean = false;
  cityFilter: boolean = false;
  localityFilter: boolean = false;
  uniqueCounts: number = 0;
  duplicatesLeads: number = 0;
  uniqueParam: any;
  duplicateParam: any;
  isRandomChecked: boolean = false;
  showSelectAll: boolean = false;
  randomCheckVal: any;
  maxSelectedLabels: number = Infinity;
  selectedEXEC: any[] = [];
  selectedRetEXEC: any[] = [];
  selectedExecIds: number[] = [];
  selectedRetEXECIds: any[] = [];
  searchTerm: string = '';
  copyofcity: any;
  searchTerm_city: string = '';
  searchTerm_locality: string = '';
  selectedLocality: any;
  selectedLocalityName: any;
  mandateprojects: any;
  fromdateFormat = new Date();
  assignmodalval: any = 1;
  executivesList: any;
  mandateexecutives: any;
  selectedRetailLeads: any
  propid: any;
  executives: any;
  executiveId: any;
  reassignedResponseInfo: any;
  status: any;
  cities: any;
  selectedCity: any;
  selectedCityName: any;
  @ViewChild('datepicker') datepickerreceived: ElementRef;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  arr: Array<any>;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  assignedType: any;
  assignedTypeName: any;
  assignedTypeFilter: boolean = false;
  roleid: any;
  locality: any;
  copyOfLocality: any;

  ngOnInit() {
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');
    ClientLeadsComponent.count = 0;
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
    // this.dateRange = [
    //   new Date(`${previousMonthDate.getFullYear()}-${prevMonth}-${prevDay}`),
    //   new Date(`${this.currentdateforcompare.getFullYear()}-${curmonthwithzero}-${curdaywithzero}`)
    // ];

    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.getleads();
    this.getcitylist();
    // this.getsourcelist();
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

  ngOnDestroy() {
    if(this.hoverSubscription){
      this.hoverSubscription.unsubscribe();
    }
  }

  //here we have written the conditions based on router params
  getleads() {
    this.route.queryParams.subscribe((params) => {
      this.uniqueParam = params['unique'];
      this.duplicateParam = params['duplicates'];
      this.propertyname = params['propName'];
      this.fromdate = params['from'];
      this.todate = params['to'];
      this.selectedCity = params['city'];
      this.selectedCityName = params['cityName'];
      this.selectedLocality = params['localityId'];
      this.selectedLocalityName = params['localityName'];
      this.resetScroll();
      setTimeout(()=>{
        this.initializeNextActionDateRangePicker();
      },0)

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

      if ((this.fromdate != '' || this.fromdate != undefined || this.fromdate != null) && (this.todate != '' || this.todate != undefined || this.todate != null)) {
        this.datefilterview = true;
        this.dateRange = [new Date(this.fromdate), new Date(this.todate)];
      } else {
        this.datefilterview = false;
      }

      if (this.propertyname == '' || this.propertyname == undefined || this.propertyname == null) {
        this.propertyFilter = false;
      } else {
        this.propertyFilter = true;
      }

      if (params.unique == 1) {
        this.getUniquedata();
      } else if (params.duplicates == 1) {
        this.getduplicatedata();
      }
      this.getCounts();
      this.getpropertyList();
    })
  }

  //here we get the counts
  getCounts() {
    ClientLeadsComponent.count = 0;
    let param = {
      fromdate: this.fromdate,
      todate: this.todate,
      property: this.propertyname,
      cityid: this.selectedCity,
      localityid: '',
      count: 1
    }
    this._sharedService.getHomes247CompleteLeads(param).subscribe(enquiryscount => {
      this.leadcounts = enquiryscount[0].completeleads_count;
      this.uniqueCounts = enquiryscount[0].uniqueecounts;
      this.duplicatesLeads = enquiryscount[0].duplicatecounts;
    });
  }

  //here we the unique data 
  getUniquedata() {
    var limitparam = 0;
    var limitrows = 30;
    $(".duplicatesLeads_section").removeClass("active");
    $(".uniqueLeads_section").addClass("active");
    this.filterLoader = true;
    let param = {
      limitparam: 0,
      limitrows: 30,
      fromdate: this.fromdate,
      todate: this.todate,
      property: this.propertyname,
      cityid: this.selectedCity,
      localityid: '',

    }
    this._sharedService.getHomes247CompleteLeads(param).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = enquirys;
    })
  }

  //here we get the duplicates data
  getduplicatedata() {
    var limitparam = 0;
    var limitrows = 30;
    $(".uniqueLeads_section").removeClass("active");
    $(".duplicatesLeads_section").addClass("active");
    let param = {
      limitparam: 0,
      limitrows: 30,
      fromdate: this.fromdate,
      todate: this.todate,
      property: this.propertyname,
      cityid: this.selectedCity,
      localityid: '',

    }
    this.filterLoader = true;
    this._sharedService.getHomes247CompleteLeads(param).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = enquirys;
    })
  }

  //here we get list of properties
  getpropertyList() {
    this._sharedService.propertylistForCompleteLeads(this.fromdate, this.todate, '').subscribe(prop => {
      this.propertyList = prop['Leads'];
      this.copyofpropertyList = prop['Leads'];
    })
  }

  getlocalitylist() {
    this._sharedService.getlocalityByCityId(this.selectedCity).subscribe(localities => {
      this.locality = localities;
      this.copyOfLocality = localities;
    })
  }

  //here we reset the filters 
  refresh() {
    this.leadsource = '';
    this.propertyname = '';
    this.selectedCity = '';
    this.selectedCityName = '';
    this.assignedType = '';
    this.assignedTypeName = '';
    this.assignedTypeFilter = false;
    this.propertyFilter = false;
    this.cityFilter = false;
    this.selectedLocality = '';
    this.selectedLocalityName = '';
    this.datefilterview = false;
    this.localityFilter = false;
    this.dateRange = [
      new Date(`${this.previousMonthDateForCompare}`),
      new Date(`${this.todaysdateforcompare}`)
    ];
    this.searchTerm = '';
    this.fromdate = this.previousMonthDateForCompare;
    this.todate = this.todaysdateforcompare;

    if (this.uniqueParam == 1) {
      this.router.navigate([], {
        queryParams: {
          unique: 1,
          from: this.fromdate,
          to: this.todate,
          propertyname: '',
          localityId: '',
          localityName: '',
          city: '',
          cityName: '',
          assignid: ''
        }
      })
    } else if (this.duplicateParam == 1) {
      this.router.navigate([], {
        queryParams: {
          duplicates: 1,
          from: this.fromdate,
          to: this.todate,
          propertyname: '',
          localityId: '',
          localityName: '',
          city: '',
          cityName: ''
        }
      })
    }
  }

  //inreassign table it sreset the property and source filter
  resetPropertyFilter() {
    $('#fromdate').val("");
    $('#todate').val("");
    this.leadsource = '';
    this.propertyname = '';
    this.selectedCity = '';
    this.selectedCityName = '';
    this.selectedLocality = '';
    this.selectedLocalityName = '';
    this.propertyFilter = false;
    this.cityFilter = false;
    this.dateRange = [
      new Date(`${this.previousMonthDateForCompare}`),
      new Date(`${this.todaysdateforcompare}`)
    ];
    this.searchTerm = '';
    // this.searchTerm_source = '';
    this.fromdate = this.previousMonthDateForCompare;
    this.todate = this.todaysdateforcompare;

    if (this.uniqueParam == 1) {
      this.router.navigate([], {
        queryParams: {
          unique: 1,
          from: this.fromdate,
          to: this.todate,
          propertyname: '',
          localityId: '',
          localityName: '',
          city: '',
          cityName: ''
        }
      })
    } else if (this.duplicateParam == 1) {
      this.router.navigate([], {
        queryParams: {
          duplicates: 1,
          from: this.fromdate,
          to: this.todate,
          propertyname: '',
          localityId: '',
          localityName: '',
          city: '',
          cityName: ''
        }
      })
    }
  }

  //here on scroll we load the leads/
  loadMore() {
    const limit = ClientLeadsComponent.count += 30;
    let counts: any;
    let limitrows = 30;
    let livecount = this.enquiries.length;
    var duplicates;
    if (this.uniqueParam == 1) {
      duplicates = '';
      counts = this.uniqueCounts;
    } else if (this.duplicateParam == 1) {
      duplicates = '1';
      counts = this.duplicatesLeads;
    }
    let param = {
      limitparam: limit,
      limitrows: limitrows,
      fromdate: this.fromdate,
      todate: this.todate,
      property: this.propertyname,
      cityid: this.selectedCity,
      localityid: '',

    }
    if (livecount < counts) {
      this.filterLoader = true;
      return this._sharedService.getHomes247CompleteLeads(param).subscribe(enquirys => {
        this.enquiries = this.enquiries.concat(enquirys);
        this.filterLoader = false;
      })
    }
  }

  //on date filter showing the daterange picker
  showdateRange() {
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

  //here we get the list of city for Homes247 source filter
  getcitylist() {
    this._sharedService.getcities().subscribe(citylist => {
      this.cities = citylist;
      this.copyofcity = citylist;
    })
  }

  //here we get the list of poperties ased on the dates
  getProperties() {
    this._sharedService.propertylistForCompleteLeads('', '', '').subscribe(prop => {
      this.propertyList = prop['Leads'];
      this.copyofpropertyList = prop['Leads'];
    })
  }

  //property selection  filter
  onCheckboxChange(property) {
    if (property != '' || property != undefined || property != null) {
      this.propertyname = property;
      this.propertyid = property;
      this.propertyFilter = true;
      this.router.navigate([], {
        queryParams: {
          propName: property,
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.propertyname = '';
      this.propertyid = '';
      this.propertyFilter = false;
    }
  }

  // Filter projects based on search 
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

  //city selection  filter
  onCheckboxChangecity(selectedcity) {
    ClientLeadsComponent.count = 0;
    if (selectedcity != '' || selectedcity != undefined || selectedcity != null) {
      this.selectedCity = selectedcity.id;
      this.selectedCityName = selectedcity.name;
      this.cityFilter = true;
      this.getlocalitylist();
      this.router.navigate([], {
        queryParams: {
          city: this.selectedCity,
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
    ClientLeadsComponent.count = 0;
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

  //Filter projects in assign modal based on search 
  filterProjectsassign(event): void {
    if (event.target.value != '') {
      this.propertyList = this.copyofpropertyList.filter(project => {
        const propertyName = project.propertyname ? project.propertyname.toLowerCase() : '';
        return propertyName.includes(event.target.value.toLowerCase());
      });
    } else {
      this.propertyList = this.copyofpropertyList
    }
  }

  //Filter source in assign modal based on search 
  filterassignsource(event) {
    // if (event.target.value != '') {
    //   this.source = this.copyofsources.filter(project =>
    //     project.source.toLowerCase().includes(event.target.value.toLowerCase())
    //   );
    // } else {
    //   this.source = this.copyofsources
    // }
  }

  //here we remove the property filter
  propertyclose() {
    $('#project_dropdown').dropdown('clear');
    $("input[name='propFilter']").prop("checked", false);
    this.propertyFilter = false;
    this.searchTerm = '';
    this.propertyList = this.copyofpropertyList;
    ClientLeadsComponent.count = 0;
    this.propertyid = "";
    this.propertyname = '';
    this.router.navigate([], {
      queryParams: {
        propId: '',
        propName: ''
      },
      queryParamsHandling: 'merge',
    });
  }


  //here we remove the city filter
  cityClose() {
    this.cityFilter = false;
    ClientLeadsComponent.count = 0;
    this.selectedCity = "";
    this.searchTerm_city = '';
    this.cities = this.copyofcity;
    this.selectedLocality = "";
    this.searchTerm_locality = '';
    this.locality = this.copyOfLocality;
    this.localityFilter = false;
    this.router.navigate([], {
      queryParams: {
        city: '',
        cityName: '',
        localityId: '',
        localityName: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  localityClose() {
    this.localityFilter = false;
    ClientLeadsComponent.count = 0;
    this.selectedLocality = "";
    this.searchTerm_locality = '';
    this.locality = this.copyOfLocality;
    this.router.navigate([], {
      queryParams: {
        localityId: '',
        localityName: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  //here we remove the date filter
  dateclose() {
    ClientLeadsComponent.count = 0;
    swal({
      title: 'Please Select the date range between 3 Months!',
      type: 'info',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      let currentDate = new Date();
      this.dateRange = [currentDate];
      $('#todate').click()
    })
  }

  //here we get the list of mandate projects
  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
      } else {
      }
    });
  }

  //here on assign button click we show thw assign modal
  assignmodalfetch(val) {
    this.filterLoader = true;
    this.assignmodalval = val;
    this.leadforwards.assignedleads = '';
    $('#counts_dropdown').dropdown('clear');
    if (val == 1) {
      this._retailService.getRetailExecutives('', '').subscribe(execute => {
        this.executives = execute['DashboardCounts'];
      })
    } else {
      this.propertyid = 'GR Sitara';
      this.propid = 16793
      this.mandateprojectsfetch();
      this.getMandateDetails();
      this.executiveId = null;
    }
    this.filterLoader = false;
  }

  //get list of executives for  filter purpose
  getExecutivesForFilter() {
    this._sharedService.getexecutiveslist('','','','','').subscribe(executives => {
      this.executivesList = executives;
    });
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

  //to get all the mandate executive based on the team id
  getMandateDetails() {
    if (this.propertyid != null) {
      this._mandateService.fetchmandateexecutuves(this.propid, '','','').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateexecutives = executives['mandateexecutives'];
        } else {
          this.mandateexecutives = [];
        }
      });
    }
  }

  //here we get selected property from assign modal.
  propertyType(event) {
    let selectedPropType;
    selectedPropType = event.target.value;
    let filteredproject = this.mandateprojects.filter((da) => da.property_info_name == selectedPropType);
    this.propertyid = selectedPropType;
    this.propid = filteredproject[0].property_idfk;
    this.getMandateDetails();
  }

  //here on clicking assign modal close button its refresh in the current page .
  assignleadModalClose() {
    $('.modal-backdrop').closest('div').remove();
    let currentUrl = this.router.url;
    let pathWithoutQueryParams = currentUrl.split('?')[0];
    let currentQueryparams = this.route.snapshot.queryParams;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
    });
  }

  //here we the selected assigne team
  selectedAssignTeam(event) {
    this.assignmodalfetch(event.target.value)
  }

  //here we get the select counts of leads for retail
  selectcounts(event) {
    if (event.target.value > 100) {
      this.getReassignLeadsData(parseInt(event.target.value));
    } else {
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

  // In this method when the user selects the executive .based on the length of selected exec
  // and leads count we are restricting the selection of exec in dropdown 
  executiveSelect(event, type) {
    this.selectedExecIds = [];
    //here im pushing the leads id to array to get the length size
    var arraylist = this.leadforwards.assignedleads.split(',');
    if (event && type == 'mandate') {
      this.selectedExecIds = this.selectedEXEC.map((exec) => exec.id);
      if ((this.selectedEXEC.length > 1) && this.maxSelectedLabels > 1) {
        console.log(this.selectedEXEC.length > 1 && this.maxSelectedLabels > 1, '1')
        $('#customSwitch1').prop('checked', true);
        this.randomCheckVal = 1;
      } else {
        console.log('2')
        $('#customSwitch1').prop('checked', false);
        this.randomCheckVal = '';
      }
    }

    if (event && type == 'retail') {
      this.selectedRetEXECIds = this.selectedRetEXEC.map((exec) => exec.ExecId);
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
    if (((this.selectedRetEXEC && this.selectedRetEXEC.length > 1) || (this.selectedEXEC && this.selectedEXEC.length > 1)) && this.maxSelectedLabels > 1) {
      $('#customSwitch1').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch1').prop('checked', false);
      this.randomCheckVal = '';
    }
  }

  // executives_LIST
  getexecutives(event) {
    let id = event.target.options[event.target.options.selectedIndex].value;
    if (id == '50010') {
      id = '50010'
    } else if (id == '50004') {
      id = '50004'
    } else {
      id = ''
    }
    this._retailService.getRetailExecutives(id, '').subscribe(execute => {
      this.executives = execute['DashboardCounts'];
    })
  }

  // INSERT_ASSIGNED_LEADS for retail
  assigntorm() {
    this.filterLoader = true;
    if (this.selectedRetEXECIds.length == 0) {
      this.filterLoader = false;
      swal({
        title: 'Please Select One Executive!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
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
      this.filterLoader = true;
      $('#selectedleads').removeAttr("style");
    }
    let comma_separated_data = this.selectedRetEXECIds.join(',')
    this.leadforwards.customersupport = comma_separated_data;

    let param = {
      assignedleads: this.leadforwards.assignedleads,
      customersupport: comma_separated_data,
      propId: '',
      randomval: this.randomCheckVal,
      loginid: this.userid
    }
    //here its a array of  lead ids converting it to a single value  as comma seperated.

    this._retailService.leadreassign(param).subscribe((success) => {
      this.status = success.status;
      this.filterLoader = false;
      if (this.status == "True") {
        $('#closereassignmodal').click();
        this.assignleadModalClose();
        swal({
          title: 'Assigned Succesfully',
          type: 'success',
          confirmButtonText: 'Show Details'
        }).then(() => {
          this.reassignedResponseInfo = success['assignedleads'];
          $('#reassign_leads_detail').click();
        })
        $('.assigneee_dropdown').dropdown('clear');
        $('.counts_dropdown').dropdown('clear');
        $('.exec_designation').dropdown('clear');
        $('.rm_dropdown').dropdown('clear');
        this.selectedRetEXEC = [];
        this.isRandomChecked = false;
        this.randomCheckVal = '';
        $('modal-backdrop').closest('div').remove();
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl])
        })
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
      $('#mandaterm_dropdown').removeAttr("style");
      this.filterLoader = true;
    }
    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let comma_separated_data = this.selectedExecIds.join(',')
    this.leadforwards.customersupport = comma_separated_data;

    let param = {
      assignedleads: this.leadforwards.assignedleads,
      customersupport: comma_separated_data,
      propId: this.propid,
      randomval: this.randomCheckVal,
      loginid: this.userid
    }
    this._mandateService.leadreassign(param).subscribe((success) => {
      this.filterLoader = false;
      this.status = success.status;
      if (this.status == "True") {
        $('#closereassignmodal').click();
        this.assignleadModalClose();
        swal({
          title: 'Assigned Succesfully',
          type: 'success',
          confirmButtonText: 'Show Details'
        }).then(() => {
          this.reassignedResponseInfo = success['assignedleads'];
          $('#reassign_leads_detail').click();
        })
        $('.assigneee_dropdown').dropdown('clear');
        $('.counts_dropdown').dropdown('clear');
        $('.property_dropdown').dropdown('clear');
        $('.mandaterm_dropdown').dropdown('clear');
        this.selectedExecIds = [];
        this.selectedEXEC = [];
        this.isRandomChecked = false;
        this.randomCheckVal = '';
        $('.modal-backdrop').closest('div').remove();
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        })
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

  closeModal() {
    $('.modal-backdrop').closest('div').remove();
    let currentUrl = this.router.url;
    let pathWithoutQueryParams = currentUrl.split('?')[0];
    let currentQueryparams = this.route.snapshot.queryParams;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
    });
  }

  //Here on clicking the number in table it expands the table with the leads
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

  getReassignLeadsData(limitR) {
    this.filterLoader = true;
    let counts: any;
    let limitrows = limitR;
    var duplicates;
    if (this.uniqueParam == 1) {
      duplicates = '';
      counts = this.uniqueCounts;
    } else if (this.duplicateParam == 1) {
      duplicates = '1';
      counts = this.duplicatesLeads;
    }

    this._sharedService.getleads(0, limitrows, this.fromdate, this.todate, this.leadsource, this.propertyname, duplicates, this.selectedCity, this.assignedType).subscribe(enquirys => {
      this.enquiries = this.enquiries.concat(enquirys);
      this.filterLoader = false;
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
