import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {

  constructor(private renderer: Renderer2, private el: ElementRef, private route: ActivatedRoute, private _sharedService: sharedservice, private _mandateService: mandateservice, private _retailService: retailservice, public datepipe: DatePipe, private router: Router) {
    if (localStorage.getItem('Role') != '1' && localStorage.getItem('Role') != '2') {
      this.router.navigateByUrl('/login');
    }
  }

  enquiries: any;
  source: any;
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
  sourceFilter: boolean = false;
  propertyFilter: boolean = false;
  cityFilter: boolean = false;
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
  copyofsources: any;
  copyofcity: any;
  searchTerm_source: string = '';
  searchTerm_city: string = '';
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
  roleTeam: any;
  isRestoredFromSession = false;

  ngOnInit() {
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');
    localStorage.setItem('locationURL', '')
    // LeadsComponent.count = 0;
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
    this.getcitylist();
    this.getsourcelist();

    const savedState = sessionStorage.getItem('complete_state');

    if (savedState) {
      const state = JSON.parse(savedState);
      this.isRestoredFromSession = true;
      this.fromdate = state.fromdate;
      this.todate = state.todate;
      this.propertyname = state.property;
      this.leadsource = state.source;
      LeadsComponent.count = state.page;
      this.enquiries = state.leads;
      this.assignedType = state.assignid;

      if ((this.fromdate != '' || this.fromdate != undefined || this.fromdate != null) && (this.todate != '' || this.todate != undefined || this.todate != null)) {
        this.datefilterview = true;
        this.dateRange = [new Date(this.fromdate), new Date(this.todate)];
      } else {
        this.datefilterview = false;
      }

      if (this.leadsource == '' || this.leadsource == undefined || this.leadsource == null) {
        this.sourceFilter = false;
      } else {
        this.sourceFilter = true;
      }

      if (this.roleid == 1) {
        this.selectedCity = '1';
        this.selectedCityName = 'Bangalore';
      }

      if (this.roleid == 2) {
        if (this.selectedCity == '' || this.selectedCity == undefined || this.selectedCity == null) {
          this.cityFilter = false;
        } else {
          this.cityFilter = true;
          this.selectedCity = this.selectedCity;
          this.selectedCityName = this.selectedCityName;
        }
      }

      if (this.propertyname == '' || this.propertyname == undefined || this.propertyname == null) {
        this.propertyFilter = false;
      } else {
        this.propertyFilter = true;
      }

      if (this.assignedType != '' && this.assignedType != null && this.assignedType != undefined) {
        this.assignedTypeFilter = true;
        if (this.assignedType == '1') {
          this.assignedTypeName = 'Assigned';
        } else if (this.assignedType == '2') {
          this.assignedTypeName = 'Not Assigned';
        }
      }

      $(".uniqueLeads_section").removeClass("active");
      $(".duplicatesLeads_section").removeClass("active");
      setTimeout(() => {
        if (state.tabs == 'uniqueParam') {
          $(".uniqueLeads_section").addClass("active");
          this.uniqueParam = 1;
        } else if (state.tabs == 'duplicateParam') {
          $(".duplicatesLeads_section").addClass("active");
          this.duplicateParam = 1;
        }
      }, 100)

      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = state.scrollTop;
      }, 0);
      this.filterLoader = false;
      this.getCounts();
      // 🔴 IMPORTANT
    }

    this.getleads();
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
    }, 0);
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  //here we have written the conditions based on router params
  getleads() {
    this.route.queryParams.subscribe((params) => {

      if (this.isRestoredFromSession) {
        this.filterLoader = false;
        this.isRestoredFromSession = false;
        setTimeout(() => {
          sessionStorage.clear();
        }, 5000)
        return;
      }

      this.uniqueParam = params['unique'];
      this.duplicateParam = params['duplicates'];
      this.propertyname = params['propName'];
      this.leadsource = params['source'];
      this.fromdate = params['from'];
      this.todate = params['to'];
      this.selectedCity = params['city'];
      this.selectedCityName = params['cityName'];
      this.assignedType = params['assignid'];
      this.resetScroll();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }), 0
      this.detailsPageRedirection();

      if ((this.fromdate != '' || this.fromdate != undefined || this.fromdate != null) && (this.todate != '' || this.todate != undefined || this.todate != null)) {
        this.datefilterview = true;
        this.dateRange = [new Date(this.fromdate), new Date(this.todate)];
      } else {
        this.datefilterview = false;
      }

      if (this.leadsource == '' || this.leadsource == undefined || this.leadsource == null) {
        this.sourceFilter = false;
      } else {
        this.sourceFilter = true;
        // if ((this.leadsource == 'Homes247' || this.leadsource == 'Homes247 - Whatsapp' || this.leadsource == 'Homes247-Campaign' || this.leadsource == 'Homes247 - FacebookAd') && this.selectedCity != undefined && this.selectedCity != '' && this.selectedCity != null) {
        //   this.cityFilter = true;
        //   if(this.roleid == 1){
        //   // this.selectedCity = '1';
        //   // this.selectedCityName = 'Bangalore';
        //   }else{
        //     this.selectedCity = this.selectedCity;
        //     this.selectedCityName = this.selectedCityName;
        //   }

        // } else {
        //   this.cityFilter = false;
        //   this.selectedCity = '';
        //   this.selectedCityName = '';
        // }
      }

      if (this.roleid == 1) {
        this.selectedCity = '1';
        this.selectedCityName = 'Bangalore';
      }

      if (this.roleid == 2) {
        if (this.selectedCity == '' || this.selectedCity == undefined || this.selectedCity == null) {
          this.cityFilter = false;
        } else {
          this.cityFilter = true;
          this.selectedCity = this.selectedCity;
          this.selectedCityName = this.selectedCityName;
        }
      }

      if (this.propertyname == '' || this.propertyname == undefined || this.propertyname == null) {
        this.propertyFilter = false;
      } else {
        this.propertyFilter = true;
      }

      if (this.assignedType != '' && this.assignedType != null && this.assignedType != undefined) {
        this.assignedTypeFilter = true;
        if (this.assignedType == '1') {
          this.assignedTypeName = 'Assigned';
        } else if (this.assignedType == '2') {
          this.assignedTypeName = 'Not Assigned';
        }
      }

      // if (this._sharedService.hasState) {
      //   this.filterLoader = false;
      //   this.enquiries = this._sharedService.enquiries;
      //   this.page = this._sharedService.page;
      //   setTimeout(() => {
      //     this.scrollContainer.nativeElement.scrollTop = this._sharedService.scrollTop;
      //   }, 0);
      // } else {
      if (params.unique == 1) {
        this.getUniquedata();
      } else if (params.duplicates == 1) {
        this.getduplicatedata();
      }
      this.getCounts();
      this.getpropertyList();
      // }
    })
  }

  //here we get the counts
  getCounts() {
    // LeadsComponent.count = 0;
    this._sharedService.getleadcounts(this.fromdate, this.todate, this.leadsource, this.propertyname, this.selectedCity, this.assignedType).subscribe(enquiryscount => {
      this.leadcounts = enquiryscount[0].leadcounts;
      this.uniqueCounts = enquiryscount[0].uniqueecounts;
      this.duplicatesLeads = enquiryscount[0].duplicatecounts;
    });
  }

  //here we the unique data 
  getUniquedata() {
    var limitparam = 0;
    var limitrows = 30;
    LeadsComponent.count = 0;
    $(".duplicatesLeads_section").removeClass("active");
    $(".uniqueLeads_section").addClass("active");
    this.filterLoader = true;
    // this.page = 1;
    this._sharedService.getleads(limitparam, limitrows, this.fromdate, this.todate, this.leadsource, this.propertyname, '', this.selectedCity, this.assignedType).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = enquirys;
    })
  }

  //here we get the duplicates data
  getduplicatedata() {
    LeadsComponent.count = 0;
    var limitparam = 0;
    var limitrows = 30;
    $(".uniqueLeads_section").removeClass("active");
    $(".duplicatesLeads_section").addClass("active");
    this.filterLoader = true;
    // this.page = 1;
    this._sharedService.getleads(limitparam, limitrows, this.fromdate, this.todate, this.leadsource, this.propertyname, '1', this.selectedCity, this.assignedType).subscribe(enquirys => {
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

  //here we reset the filters 
  refresh() {
    this.leadsource = '';
    this.propertyname = '';
    this.selectedCity = '';
    this.selectedCityName = '';
    this.assignedType = '';
    this.assignedTypeName = '';
    this.assignedTypeFilter = false;
    this.sourceFilter = false;
    this.propertyFilter = false;
    this.cityFilter = false;
    this.dateRange = [
      new Date(`${this.previousMonthDateForCompare}`),
      new Date(`${this.todaysdateforcompare}`)
    ];
    this.searchTerm = '';
    // this.searchTerm_source = '';
    // this.searchTerm_city = '';
    // this.cities = this.copyofcity;
    // this.source = this.copyofsources;
    this.fromdate = this.previousMonthDateForCompare;
    this.todate = this.todaysdateforcompare;

    if (this.uniqueParam == 1) {
      this.router.navigate([], {
        queryParams: {
          unique: 1,
          from: this.fromdate,
          to: this.todate,
          propertyname: '',
          source: '',
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
          source: '',
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
    this.sourceFilter = false;
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
          source: '',
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
          source: '',
          city: '',
          cityName: ''
        }
      })
    }
  }

  //here on scroll we load the leads/
  loadMore() {
    const limit = LeadsComponent.count += 30;
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
    if (livecount < counts) {
      this.filterLoader = true;
      // this.page++;
      return this._sharedService.getleads(limit, limitrows, this.fromdate, this.todate, this.leadsource, this.propertyname, duplicates, this.selectedCity, this.assignedType).subscribe(enquirys => {
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

  // selecttodate() {
  //   LeadsComponent.count = 0;
  //   var limitparam = 0;
  //   var limitrows = 100;
  //   var todate = this.todate ? this.todate : '';
  //   var fromdate = this.fromdate ? this.fromdate : '';
  //   var source = this.leadsource;
  //   var propid = this.propertyname
  //   this.filterLoader = true;
  //   if (fromdate != '' && todate != '') {
  //     this.router.navigate([], {
  //       queryParams: {
  //         from: this.fromdate,
  //         to: this.todate
  //       },
  //       queryParamsHandling: 'merge',
  //     });
  //   }
  // }


  //here we get the list of sources
  getsourcelist() {
    this._sharedService.sourcelist().subscribe(sources => {
      if (sources) {
        sources.filter((sou) => {
          if (sou.source == 'GR - Microsite') {
            sou.source = 'GR - campaign';
          }
        })
        this.source = sources;
        this.copyofsources = sources;
      }
    })
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

  //source selection  filter
  onCheckboxChangesource(selectedsource) {
    LeadsComponent.count = 0;
    if (selectedsource != '' || selectedsource != undefined) {
      if (selectedsource == 'GR - campaign') {
        selectedsource = 'GR - Microsite';
      } else {
        selectedsource = selectedsource;
      }
      this.leadsource = selectedsource;
      this.sourceFilter = true;
      // if ((this.leadsource == 'Homes247' || this.leadsource == 'Homes247 - Whatsapp' || this.leadsource == 'Homes247-Campaign' || this.leadsource == 'Homes247 - FacebookAd')) {
      //     this.cityFilter = true;
      //     this.selectedCity = '1';
      //     this.selectedCityName = 'Bangalore';
      //     this.router.navigate([], {
      //       queryParams: {
      //         source: this.leadsource,
      //         city: this.selectedCity,
      //         cityName: this.selectedCityName,
      //       },
      //       queryParamsHandling: 'merge',
      //     });
      // } else {
      this.router.navigate([], {
        queryParams: {
          source: this.leadsource,
          city: '',
          cityName: '',
        },
        queryParamsHandling: 'merge',
      });
      // }
    } else {
      this.leadsource = '';
      this.sourceFilter = false;
    }

  }

  // Filter source based on search 
  filtersource(): void {
    if (this.searchTerm_source != '') {
      this.source = this.copyofsources.filter(project =>
        project.source.toLowerCase().includes(this.searchTerm_source.toLowerCase())
      );
    } else {
      this.source = this.copyofsources
    }
  }

  //city selection  filter
  onCheckboxChangecity(selectedcity) {
    LeadsComponent.count = 0;
    if (selectedcity != '' || selectedcity != undefined || selectedcity != null) {
      this.selectedCity = selectedcity.id;
      this.selectedCityName = selectedcity.name;
      this.sourceFilter = true;
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
    if (event.target.value != '') {
      this.source = this.copyofsources.filter(project =>
        project.source.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      this.source = this.copyofsources
    }
  }

  //filter the assign leads and not assigned leads.
  leadStatus(type) {
    this.assignedTypeName = type;
    this.assignedTypeFilter = true;
    let assignId: any;
    if (type == 'Assigned') {
      assignId = 1;
    } else if (type == 'Not Assigned') {
      assignId = 2;
    }
    this.assignedType = assignId;
    this.router.navigate([], {
      queryParams: {
        assignid: assignId,
      },
      queryParamsHandling: 'merge',
    });
  }

  //here we remove the property filter
  propertyclose() {
    $('#project_dropdown').dropdown('clear');
    $("input[name='propFilter']").prop("checked", false);
    this.propertyFilter = false;
    this.searchTerm = '';
    this.propertyList = this.copyofpropertyList;
    LeadsComponent.count = 0;
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

  //here we remove the source filter
  sourceClose() {
    $('#source_dropdown').dropdown('clear');
    $("input[name='sourceFilter']").prop("checked", false);
    this.sourceFilter = false;
    this.searchTerm_source = '';
    this.source = this.copyofsources;
    LeadsComponent.count = 0;
    if (this.leadsource == 'Homes247' || this.leadsource == 'Homes247 - Whatsapp' || this.leadsource == 'Homes247-Campaign' || this.leadsource == 'Homes247 - FacebookAd') {
      this.router.navigate([], {
        queryParams: {
          source: '',
          city: '',
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
    this.leadsource = "";
  }

  //here we remove the city filter
  cityClose() {
    this.cityFilter = false;
    LeadsComponent.count = 0;
    this.selectedCity = "";
    this.searchTerm_city = '';
    this.cities = this.copyofcity;
    this.router.navigate([], {
      queryParams: {
        city: '',
        cityName: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  //here we remove the date filter
  dateclose() {
    LeadsComponent.count = 0;
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

  assigntypeclose() {
    this.assignedTypeFilter = false;
    this.assignedType = '';
    this.assignedTypeName = '';
    this.router.navigate([], {
      queryParams: {
        assignid: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  //here we get the list of mandate projects
  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
        this.getMandateDetails();
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
      this.executiveId = null;
    }
    this.filterLoader = false;
  }

  //get list of executives for  filter purpose
  getExecutivesForFilter() {
    this._sharedService.getexecutiveslist('', '', '', '', '').subscribe(executives => {
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
      this._mandateService.fetchmandateexecutuves(this.propid, '', this.roleTeam, '').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.mandateexecutives = executives['mandateexecutives'];
        } else {
          this.mandateexecutives = [];
        }
      });
    }
  }

  getMandateRanavExecutives() {
    this._mandateService.getExecutivesForRanav(this.propid, '', this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      } else {
        this.mandateexecutives = [];
      }
    });
  }

  //here we get selected property from assign modal.
  filteredproject: any = '';
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
    if (event.target.value > 30) {
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

    // if (this.isRandomChecked == false) {
    //   if (this.selectedEXEC.length > arraylist.length) {
    //     // this.selectedEXEC.pop();
    //   }
    // }

    // if (event && type == 'mandate') {
    this.selectedExecIds = this.selectedEXEC.map((exec) => exec.id);
    if ((this.selectedEXEC.length > 1) && this.maxSelectedLabels > 1) {
      $('#customSwitch1').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch1').prop('checked', false);
      this.randomCheckVal = '';
    }
    // }

    // if (event && type == 'retail') {
    //   this.selectedRetEXECIds = this.selectedRetEXEC.map((exec) => exec.ExecId);
    //   if(this.selectedRetEXEC.length > 1  && this.maxSelectedLabels > 1){
    //     $('#customSwitch1').prop('checked',true);
    //     this.randomCheckVal = 1;
    //   }else{
    //     $('#customSwitch1').prop('checked',false);
    //     this.randomCheckVal = '';
    //   }
    // }

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
    this.roleTeam = event.target.options[event.target.options.selectedIndex].value;

    this._mandateService.fetchmandateexecutuves(this.propid, '', this.roleTeam, '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      } else {
        this.mandateexecutives = [];
      }
    });
    // let id = event.target.options[event.target.options.selectedIndex].value;
    // if (id == '50010') {
    //   id = '50010'
    // } else if (id == '50004') {
    //   id = '50004'
    // } else {
    //   id = ''
    // }
    // this._retailService.getRetailExecutives(id, '').subscribe(execute => {
    //   this.executives = execute['DashboardCounts'];
    // })
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
    if (this.filteredproject.crm == '2') {
      this._mandateService.ranavleadreassign(param).subscribe((success) => {
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
    } else {
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

  //downloading the junk report only for admin
  downloadDocument() {
    if (this.leadsource == '' || this.leadsource == null || this.leadsource == undefined) {
      swal({
        title: 'Please Select the Source',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      swal({
        title: 'Please Wait.....',
        text: 'Generating Report',
        onOpen: () => {
          swal.showLoading();
        }
      })
      let id;
      if (this.uniqueParam == 1) {
        id = '';
      } else if (this.duplicateParam == 1) {
        id = '1';
      }
      this._sharedService.downloadLeads(this.fromdate, this.todate, this.leadsource, this.propertyname, id, this.selectedCity).subscribe(enquirys => {
        if (enquirys.length > 0) {
          swal.close();
          this.arr = enquirys.map(lead => {
            // let stagestatus1;
            // switch (lead.stagestatus) {
            //   case '1':
            //     stagestatus1 = 'Fix';
            //     break;
            //   case '2':
            //     stagestatus1 = 'Refix';
            //     break;
            //   case '3':
            //     stagestatus1 = 'Done';
            //     break;
            //   default:
            //     stagestatus1 = '';
            //     break;
            // }
            return {
              LeadReceived: lead.LeadReceivedDate,
              CustomerName: lead.CustomerName,
              CustomerNumber: lead.CustomerNumber,
              Source: lead.CustomerSource,
              Property: lead.EnquiredPropertyName == null ? 'No Properties' : lead.EnquiredPropertyName,
              ExecutiveName: lead.AssignedExecutive == null ? 'Not Assigned' : lead.AssignedExecutive,
              CurrentLeadStage: lead.CurrentStage == null ? 'Not Assigned' : lead.CurrentStage,
            };
          });
          const fileName = "CompleteLeads.xlsx";

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.arr);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "CompleteLeads");
          XLSX.writeFile(wb, fileName);
        }
      });
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
      this.enquiries = enquirys;
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

  detailsPageRedirection() {
    localStorage.setItem('backLocation', 'complete');
    localStorage.setItem('locationURL', this.router.url)
  }

  // page = 1;
  // pageSize = 30;

  redirectTO(enquiry) {
    this._sharedService.leads = this.enquiries;
    this._sharedService.page = LeadsComponent.count;
    this._sharedService.scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this._sharedService.hasState = true;

    let tab;
    if (this.uniqueParam == 1) {
      tab = 'uniqueParam';
    } else if (this.duplicateParam == 1) {
      tab = 'duplicateParam'
    }

    const state = {
      fromdate: this.fromdate,
      todate: this.todate,
      property: this.propertyname,
      source: this.leadsource,
      assignid: this.assignedType,
      page: LeadsComponent.count,
      scrollTop: this.scrollContainer.nativeElement.scrollTop,
      tabs: tab,
      leads: this.enquiries
    };

    sessionStorage.setItem('complete_state', JSON.stringify(state));

    this.router.navigate([
      '/mandate-customers',
      enquiry.customer_IDPK,
      this.userid,
      0,
      'mandate',
      '' // this will create the trailing empty segment
    ]);
  }

}

// deleteLeads(id) {
//   swal({
//     title: 'Confirmation',
//     text: 'Do You Want to Delete the Lead',
//     type: 'warning',
//     confirmButtonText: "Yes!",
//     cancelButtonText: "NO",
//     showConfirmButton: true,
//     showCancelButton: true
//   }).then((result) => {
//     if (result.value == true) {
//       this._sharedService.deleteLead(id).subscribe((resp) => {
//         if (resp.status == 'True') {
//           swal({
//             title: 'Lead Deletion',
//             text: 'Lead has been Deleted successfully',
//             type: 'success',
//             showConfirmButton: false,
//             timer: 1000
//           }).then(() => {
//             let currentUrl = this.router.url;
//             let pathWithoutQueryParams = currentUrl.split('?')[0];
//             let currentQueryparams = this.route.snapshot.queryParams;
//             this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//               this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
//             })
//           });
//         }
//       })
//     }
//   })
// }
