import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { retailservice } from '../../retail.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-campaign-leads',
  templateUrl: './campaign-leads.component.html',
  styleUrls: ['./campaign-leads.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CampaignLeadsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _sharedService: sharedservice, private _mandateService: mandateservice, private _retailService: retailservice, public datepipe: DatePipe, private router: Router) { }

  freshparam: any;
  pendingparam: any;
  quafiliedparam: any;
  notqualifiedparam: any;
  callbackparam: any;
  numberbusyparam: any;
  rnrparam: any;
  switchoffparam: any;
  enquiriesBuyList: any;
  enquiriesSellList: any;
  enquiriesRentList: any;
  source: any;
  leadsource: string = "";
  static count: number;
  dateRange: Date[];
  fromdate: any;
  todate: any
  filterLoader: boolean = false;
  copyofpropertyList: any;
  propertyList: any;
  propertyname: any;
  propertyid: any;
  userid: any;
  datefilterview: boolean = false;
  sourceFilter: boolean = false;
  propertyFilter: boolean = false;
  cityFilter: boolean = false;
  searchTerm: string = '';
  copyofsources: any;
  copyofcity: any;
  searchTerm_source: string = '';
  searchTerm_city: string = '';
  cities: any;
  selectedCity: any;
  selectedCityName: any;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  roleid: any;
  campaignLeadsCount: number = 0;
  freshLeadsCount: number = 0;
  pendingLeadsCount: number = 0;
  qualifiedLeadsCount: number = 0;
  notqualifiedLeadsCount: number = 0;
  callbackLeadsCount: number = 0;
  numberbusyLeadsCount: number = 0;
  rnrLeadsCount: number = 0;
  switchoffLeadsCount: number = 0;
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  status: any;
  followupsections: any;
  selectedFollowupLeadId: any = '';
  followupname: any = '';
  followupid: any = '';
  selectedEditLead: any;
  propertiesList: any;
  localitiesList: any;
  copyOfLocalitiesList: any;
  selectedLocality: any = '';
  selectedProperty: any = '';
  customerName: any;
  customerNumber: any;
  selectedBuySellRentType: any;
  propertyListForBuy: any;
  selectedEditCity: any;
  selectedEditLocality: any;
  selectedPropType: any;
  selectedEditproperty: any = '';
  roletype: any[] = [];
  bilderPropertyName: string = '';
  sqftData: any;
  specificFloor: any;
  expectedRent: any;
  parkingType: any;
  totalFloors: any;
  despositAmount: any;
  selectedCustomerType: any;
  selectedPossessionMonth: any;
  selectedPossessionYear: any;
  selectedBHKSize: any;
  selectedBudget: any;
  selectedFacingPref: any;
  authorityList: any;
  propertyStatus: any
  checboxStatus: boolean = false;
  selectedAuthority: any;
  type: any;
  selectedBuySellRentFollowup: any;
  buysellrentsections: any[] = [];
  searchTerm_locality: string = '';
  selectedListLocality: any;
  localityFilter: boolean = false;
  selectedLocId: any;
  selectedLocName: any;
  selectedPropTypeTableFil: any;
  propTypeFilter: boolean = false;
  selectedLeadPropDetails: any;
  selectedEditPropType: any;

  ngOnInit() {
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');
    CampaignLeadsComponent.count = 0;
    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.followupsections = [
      { name: 'Callback', value: '4' },
      { name: 'Number Busy', value: '5' },
      { name: 'RNR', value: '6' },
      { name: 'Switch Off', value: '7' }
    ]

    this.buysellrentsections = [
      { name: 'Buy', value: '1' },
      { name: 'Sell', value: '2' },
      { name: 'Rent', value: '3' }
    ]

    this.getleads();
    this.getcitylist();
    this.getsourcelist();
  }

  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeNextActionDateRangePicker();
      this.initializeMonthYearPicker();
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
      this.freshparam = params['fresh'];
      this.pendingparam = params['pending'];
      this.quafiliedparam = params['quafilied'];
      this.notqualifiedparam = params['notquafilied'];
      this.callbackparam = params['callback'];
      this.numberbusyparam = params['numberbusy'];
      this.rnrparam = params['rnr'];
      this.switchoffparam = params['switchoff'];
      this.fromdate = params['from'];
      this.todate = params['to'];
      this.leadsource = params['source'];
      this.selectedCity = params['city'];
      this.selectedCityName = params['cityName'];
      this.propertyname = params['propName'];
      this.type = params['type'];
      this.selectedLocId = params['locid'];
      this.selectedLocName = params['locName'];
      this.selectedPropTypeTableFil = params['propType'];

      this.resetScroll();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
        this.initializeMonthYearPicker();
      },0)

      if (this.freshparam == '1') {
        this.status = '1';
        this.selectedTab('fresh');
      } else if (this.pendingparam == '1') {
        this.status = '8';
        this.selectedTab('pending');
      } else if (this.quafiliedparam == '1') {
        this.status = '2';
        this.selectedTab('quafilied');
      } else if (this.notqualifiedparam == '1') {
        this.status = '3';
        this.selectedTab('notqualified');
      } else if (this.callbackparam == '1') {
        this.status = '4';
        this.selectedTab('callback');
      } else if (this.numberbusyparam == '1') {
        this.status = '5';
        this.selectedTab('numberbusy');
      } else if (this.rnrparam == '1') {
        this.status = '6';
        this.selectedTab('rnr');
      } else if (this.switchoffparam == '1') {
        this.status = '7';
        this.selectedTab('switchoff');
      }

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
      } else {
        this.datefilterview = true;
      }

      if (this.leadsource == '' || this.leadsource == undefined || this.leadsource == null) {
        this.sourceFilter = false;
      } else {
        this.sourceFilter = true;
      }

      if (this.selectedCity == undefined || this.selectedCity == '' || this.selectedCity == null) {
        this.cityFilter = false;
        this.selectedCity = '';
        this.selectedCityName = '';
      } else {
        this.cityFilter = true;
        this.selectedCity = this.selectedCity;
        this.selectedCityName = this.selectedCityName;
      }

      if (this.selectedLocId == '' || this.selectedLocId == undefined || this.selectedLocId == null) {
        this.localityFilter = false;
      } else {
        this.localityFilter = true;
      }

      if (this.propertyname == '' || this.propertyname == undefined || this.propertyname == null) {
        this.propertyFilter = false;
      } else {
        this.propertyFilter = true;
      }

      if (this.selectedPropTypeTableFil == '' || this.selectedPropTypeTableFil == undefined || this.selectedPropTypeTableFil == null) {
        this.propTypeFilter = false;
      } else {
        this.propTypeFilter = true;
      }

      if (this.type == 'fresh') {
        this.getCounts();
        this.getFreshCampaigndata();
      } else if (this.type == 'buy') {
        this.getBuyCounts();
        this.getBuyCampaigndata();
      } else if (this.type == 'sell') {
        this.getSellCounts();
        this.getSellCampaigndata();
      } else if (this.type == 'rent') {
        this.getRentCounts();
        this.getRentCampaigndata();
      }
      this.getpropertyList();
    })
  }

  //here the selected tab we active
  selectedTab(type) {
    $(".lead_section").removeClass("active");
    if (type == 'fresh') {
      setTimeout(() => {
        $(".freshLeads_section").addClass("active");
      }, 0)
    } else if (type == 'pending') {
      setTimeout(() => {
        $(".pendingLeads_section").addClass("active");
      }, 0)
    } else if (type == 'quafilied') {
      setTimeout(() => {
        $(".quafilied_section").addClass("active");
      }, 0)
    } else if (type == 'notqualified') {
      setTimeout(() => {
        $(".notqualified_section").addClass("active");
      }, 0)
    } else if (type == 'callback') {
      setTimeout(() => {
        $(".callback_section").addClass("active");
      }, 0)
    } else if (type == 'numberbusy') {
      setTimeout(() => {
        $(".numberbusy_section").addClass("active");
      }, 0)
    } else if (type == 'rnr') {
      setTimeout(() => {
        $(".rnr_section").addClass("active");
      }, 0)
    } else if (type == 'switchoff') {
      setTimeout(() => {
        $(".switchoff_section").addClass("active");
      }, 0)
    }
  }

  //here we get the Fresh counts
  getCounts() {
    CampaignLeadsComponent.count = 0;
    let param = {
      fromdate: this.fromdate,
      todate: this.todate,
      source: this.leadsource,
      cityid: this.selectedCity,
      propid: this.propertyname,
      status: this.status
    }
    this._sharedService.getCampaignleadsCounts(param).subscribe(enquiryscount => {
      this.campaignLeadsCount = enquiryscount.counts.totalcount;
      this.freshLeadsCount = enquiryscount.counts.freshcount;
      this.pendingLeadsCount = enquiryscount.counts.pendingcount;
      this.qualifiedLeadsCount = enquiryscount.counts.qualifiedcount;
      this.notqualifiedLeadsCount = enquiryscount.counts.notqualifiedcount;
      this.callbackLeadsCount = enquiryscount.counts.callback,
        this.numberbusyLeadsCount = enquiryscount.counts.numberbusy,
        this.rnrLeadsCount = enquiryscount.counts.rnr,
        this.switchoffLeadsCount = enquiryscount.counts.swtichoff
    });
  }

  //here we get the Buy counts
  getBuyCounts() {
    CampaignLeadsComponent.count = 0;
    let param = {
      fromdate: this.fromdate,
      todate: this.todate,
      source: this.leadsource,
      cityid: this.selectedCity,
      locality: this.selectedLocId,
      propid: this.propertyname,
      count: 1
    }
    this._sharedService.getBuyCampaignleads(param).subscribe(enquiryscount => {
      this.campaignLeadsCount = enquiryscount.counts.totalcount;
      this.qualifiedLeadsCount = enquiryscount.counts.qualifiedcount;
      this.notqualifiedLeadsCount = enquiryscount.counts.notqualifiedcount;
      this.callbackLeadsCount = enquiryscount.counts.callback,
        this.numberbusyLeadsCount = enquiryscount.counts.numberbusy,
        this.rnrLeadsCount = enquiryscount.counts.rnr,
        this.switchoffLeadsCount = enquiryscount.counts.swtichoff
    });
  }

  //here we get the Sell counts
  getSellCounts() {
    CampaignLeadsComponent.count = 0;
    let param = {
      fromdate: this.fromdate,
      todate: this.todate,
      source: this.leadsource,
      cityid: this.selectedCity,
      locality: this.selectedLocId,
      propid: this.propertyname,
      count: 1
    }
    this._sharedService.getSellCampaignleads(param).subscribe(enquiryscount => {
      this.campaignLeadsCount = enquiryscount.counts.totalcount;
      this.qualifiedLeadsCount = enquiryscount.counts.qualifiedcount;
      this.notqualifiedLeadsCount = enquiryscount.counts.notqualifiedcount;
      this.callbackLeadsCount = enquiryscount.counts.callback,
        this.numberbusyLeadsCount = enquiryscount.counts.numberbusy,
        this.rnrLeadsCount = enquiryscount.counts.rnr,
        this.switchoffLeadsCount = enquiryscount.counts.swtichoff
    });
  }

  //here we get the of Rent counts
  getRentCounts() {
    CampaignLeadsComponent.count = 0;
    let param = {
      fromdate: this.fromdate,
      todate: this.todate,
      cityid: this.selectedCity,
      locality: this.selectedLocId,
      source: this.leadsource,
      propid: this.propertyname,
      count: 1
    }
    this._sharedService.getRentCampaignleads(param).subscribe(enquiryscount => {
      this.campaignLeadsCount = enquiryscount.counts.totalcount;
      this.qualifiedLeadsCount = enquiryscount.counts.qualifiedcount;
      this.notqualifiedLeadsCount = enquiryscount.counts.notqualifiedcount;
      this.callbackLeadsCount = enquiryscount.counts.callback,
        this.numberbusyLeadsCount = enquiryscount.counts.numberbusy,
        this.rnrLeadsCount = enquiryscount.counts.rnr,
        this.switchoffLeadsCount = enquiryscount.counts.swtichoff
    });
  }

  //here we the fresh leads data 
  getFreshCampaigndata() {
    var limitparam = 0;
    var limitrows = 30;
    let param = {
      limitparam: limitparam,
      limitrows: limitrows,
      fromdate: this.fromdate,
      todate: this.todate,
      source: this.leadsource,
      cityid: this.selectedCity,
      propid: this.propertyname,
      status: this.status,
      bsr: '1'
    }
    this.filterLoader = true;
    this._sharedService.getFreshCampaignleads(param).subscribe(enquirys => {
      this.filterLoader = false;
      if (enquirys.status == 'True') {
        this.enquiriesBuyList = enquirys.result;
      } else {
        this.enquiriesBuyList = [];
      }
    })
  }

  //here we the buy leads data 
  getBuyCampaigndata() {
    var limitparam = 0;
    var limitrows = 30;
    let param = {
      limitparam: limitparam,
      limitrows: limitrows,
      fromdate: this.fromdate,
      todate: this.todate,
      source: this.leadsource,
      cityid: this.selectedCity,
      locality: this.selectedLocId,
      propid: this.propertyname,
      status: this.status
    }
    this.filterLoader = true;
    this._sharedService.getBuyCampaignleads(param).subscribe(enquirys => {
      this.filterLoader = false;
      if (enquirys.status == 'True') {
        this.enquiriesBuyList = enquirys.data;
      } else {
        this.enquiriesBuyList = [];
      }
    })
  }

  //here we the sell leads data 
  getSellCampaigndata() {
    var limitparam = 0;
    var limitrows = 30;
    let param = {
      limitparam: limitparam,
      limitrows: limitrows,
      fromdate: this.fromdate,
      todate: this.todate,
      source: this.leadsource,
      cityid: this.selectedCity,
      locality: this.selectedLocId,
      propid: this.propertyname,
      status: this.status
    }
    this.filterLoader = true;
    this._sharedService.getSellCampaignleads(param).subscribe(enquirys => {
      this.filterLoader = false;
      if (enquirys.status == 'True') {
        this.enquiriesSellList = enquirys.data;
      } else {
        this.enquiriesSellList = [];
      }
    })
  }

  //here we the rent leads data 
  getRentCampaigndata() {
    var limitparam = 0;
    var limitrows = 30;
    let param = {
      limitparam: limitparam,
      limitrows: limitrows,
      fromdate: this.fromdate,
      todate: this.todate,
      cityid: this.selectedCity,
      locality: this.selectedLocId,
      source: this.leadsource,
      propid: this.propertyname,
      status: this.status
    }
    this.filterLoader = true;
    this._sharedService.getRentCampaignleads(param).subscribe(enquirys => {
      this.filterLoader = false;
      if (enquirys.status == 'True') {
        this.enquiriesRentList = enquirys.data;
      } else {
        this.enquiriesRentList = [];
      }
    })
  }

  convertLead(status, id) {
    let message, mes1;
    if (status == '2') {
      message = 'Qualified';
      mes1 = 'Qualify';
    } else if (status == '3') {
      message = 'Not Qualified';
      mes1 = 'Dis-qualify';
    }

    let bsrId;
    if (this.type == 'buy') {
      bsrId = 1;
    } else if (this.type == 'sell') {
      bsrId = 2;
    } else if (this.type == 'rent') {
      bsrId = 3;
    }

    swal({
      title: 'Are you Sure',
      text: `You want to ${mes1} the Lead`,
      type: 'warning',
      confirmButtonText: "Yes..!",
      cancelButtonText: "NO",
      showConfirmButton: true,
      showCancelButton: true
    }).then((result) => {
      if (result.value == true) {
        let param = {
          leadid: id,
          status: status,
          bsr: bsrId
        }

        this._sharedService.postCampaignLeadStage(param).subscribe((resp) => {
          if (resp.status == 'True') {
            swal({
              title: `Lead ${message}`,
              text: `Lead has been Converted Successfully`,
              type: 'success',
              showConfirmButton: false,
              timer: 3000
            })
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
            })
          }
        })
      }
    })
  }

  //here we get list of properties
  getpropertyList() {
    this._sharedService.propertylistForCompleteLeads(this.fromdate, this.todate, '').subscribe(prop => {
      this.propertyList = prop['Leads'];
      this.copyofpropertyList = prop['Leads'];
    })
  }

  //here on scroll we load the leads/
  loadMore() {
    const limit = CampaignLeadsComponent.count += 30;
    let limitrows = 30;


    let count;
    if (this.freshparam == '1') {
      count = this.freshLeadsCount;
    } else if (this.pendingparam == '1') {
      count = this.pendingLeadsCount;
    } else if (this.quafiliedparam == '1') {
      count = this.qualifiedLeadsCount;
    } else if (this.notqualifiedparam == '1') {
      count = this.notqualifiedLeadsCount;
    } else if (this.callbackparam == '1') {
      count = this.callbackLeadsCount;
    } else if (this.numberbusyparam == '1') {
      count = this.numberbusyLeadsCount;
    } else if (this.rnrparam == '1') {
      count = this.rnrLeadsCount;
    } else if (this.switchoffparam == '1') {
      count = this.switchoffLeadsCount;
    }

    if (this.type == 'fresh') {
      let livecount = this.enquiriesBuyList.length;
      // let param = {
      //   limitparam: limit,
      //   limitrows: limitrows,
      //   fromdate: this.fromdate,
      //   todate: this.todate,
      //   source: this.leadsource,
      //   cityid: this.selectedCity,
      //   propid: this.propertyname,
      //   status: this.status
      // }

      // if (livecount < count) {
      //   this.filterLoader = true;
      //   return this._sharedService.getBuyCampaignleads(param).subscribe(enquirys => {
      //     this.enquiriesBuyList = this.enquiriesBuyList.concat(enquirys.result);
      //     this.filterLoader = false;
      //   })
      // }

      let param = {
        limitparam: limit,
        limitrows: limitrows,
        fromdate: this.fromdate,
        todate: this.todate,
        source: this.leadsource,
        cityid: this.selectedCity,
        propid: this.propertyname,
        status: this.status,
        bsr: '1'
      }
      this.filterLoader = true;
      this._sharedService.getFreshCampaignleads(param).subscribe(enquirys => {
        this.filterLoader = false;
        if (enquirys.status == 'True') {
          this.enquiriesBuyList = this.enquiriesBuyList.concat(enquirys.result);
        }
      })
    } else if (this.type == 'buy') {
      let livecount = this.enquiriesBuyList.length;
      // let param = {
      //   limitparam: limit,
      //   limitrows: limitrows,
      //   fromdate: this.fromdate,
      //   todate: this.todate,
      //   source: this.leadsource,
      //   cityid: this.selectedCity,
      //   locality: this.selectedLocId,
      //   propid: this.propertyname,
      //   status: this.status
      // }
      // if (livecount < count) {
      //   this.filterLoader = true;
      //   return this._sharedService.getBuyCampaignleads(param).subscribe(enquirys => {
      //     this.enquiriesBuyList = this.enquiriesBuyList.concat(enquirys.data);
      //     this.filterLoader = false;
      //   })
      // }

      let param = {
        limitparam: limit,
        limitrows: limitrows,
        fromdate: this.fromdate,
        todate: this.todate,
        source: this.leadsource,
        cityid: this.selectedCity,
        locality: this.selectedLocId,
        propid: this.propertyname,
        status: this.status
      }
      if (livecount < count) {
        this.filterLoader = true;
        this._sharedService.getBuyCampaignleads(param).subscribe(enquirys => {
          this.filterLoader = false;
          if (enquirys.status == 'True') {
            this.enquiriesBuyList = this.enquiriesBuyList.concat(enquirys.data);
          }
        })
      }
    } else if (this.type == 'sell') {
      let livecount = this.enquiriesSellList.length;
      // let param = {
      //   limitparam: limit,
      //   limitrows: limitrows,
      //   fromdate: this.fromdate,
      //   todate: this.todate,
      //   source: this.leadsource,
      //   cityid: this.selectedCity,
      //   locality: this.selectedLocId,
      //   propid: this.propertyname,
      //   status: this.status
      // }
      // if (livecount < count) {
      //   this.filterLoader = true;
      //   this._sharedService.getSellCampaignleads(param).subscribe(enquirys => {
      //     this.enquiriesSellList = this.enquiriesSellList.concat(enquirys.data);
      //     this.filterLoader = false;
      //   })
      // }

      let param = {
        limitparam: limit,
        limitrows: limitrows,
        fromdate: this.fromdate,
        todate: this.todate,
        source: this.leadsource,
        cityid: this.selectedCity,
        locality: this.selectedLocId,
        propid: this.propertyname,
        status: this.status
      }
      if (livecount < count) {
        this.filterLoader = true;
        this._sharedService.getSellCampaignleads(param).subscribe(enquirys => {
          this.filterLoader = false;
          if (enquirys.status == 'True') {
            this.enquiriesSellList = this.enquiriesSellList.concat(enquirys.data);
          }
        })
      }
    } else if (this.type == 'rent') {
      let livecount = this.enquiriesRentList.length;
      // let param = {
      //   limitparam: limit,
      //   limitrows: limitrows,
      //   fromdate: this.fromdate,
      //   todate: this.todate,
      //   cityid: this.selectedCity,
      //   locality: this.selectedLocId,
      //   source: this.leadsource,
      //   propid: this.propertyname,
      //   status: this.status
      // }
      // if (livecount < count) {
      //   this.filterLoader = true;
      //   this._sharedService.getRentCampaignleads(param).subscribe(enquirys => {
      //     this.enquiriesRentList = this.enquiriesRentList.concat(enquirys.data);
      //     this.filterLoader = false;
      //   })
      // }

      let param = {
        limitparam: limit,
        limitrows: limitrows,
        fromdate: this.fromdate,
        todate: this.todate,
        cityid: this.selectedCity,
        locality: this.selectedLocId,
        source: this.leadsource,
        propid: this.propertyname,
        status: this.status
      }
      if (livecount < count) {
        this.filterLoader = true;
        this._sharedService.getRentCampaignleads(param).subscribe(enquirys => {
          this.filterLoader = false;
          if (enquirys.status == 'True') {
            this.enquiriesRentList = enquirys.data;
            this.enquiriesRentList = this.enquiriesRentList.concat(enquirys.data);
          }
        })
      }
    }
  }

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

  //here we reset the filters 
  refresh() {
    this.leadsource = '';
    this.propertyname = '';
    this.selectedCity = '';
    this.selectedCityName = '';
    this.sourceFilter = false;
    this.propertyFilter = false;
    this.cityFilter = false;
    this.fromdate = '';
    this.todate = '';
    this.searchTerm = '';
    this.searchTerm_source = '';
    this.searchTerm_city = '';
    this.localityFilter = false;
    this.selectedLocId = "";
    this.selectedLocName = "";
    this.searchTerm_locality = '';
    this.localitiesList = [];
    this.selectedPropTypeTableFil = '';
    this.propTypeFilter = false;
    if (this.type == 'fresh') {
      this.router.navigate(['/campaignLeads'], {
        queryParams: {
          fresh: 1,
          type: 'fresh'
        }
      })
    } else {
      let type;
      if (this.type == 'buy') {
        type = 'buy';
        this.router.navigate(['/buyleads'], {
          queryParams: {
            quafilied: 1,
            type: type
          }
        })
      } else if (this.type == 'sell') {
        type = 'sell';
        this.router.navigate(['/sellleads'], {
          queryParams: {
            quafilied: 1,
            type: type
          }
        })
      } else if (this.type == 'rent') {
        type = 'rent';
        this.router.navigate(['/rentleads'], {
          queryParams: {
            quafilied: 1,
            type: type
          }
        })
      }
    }
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
    CampaignLeadsComponent.count = 0;
    if (selectedsource != '' || selectedsource != undefined) {
      if (selectedsource == 'GR - campaign') {
        selectedsource = 'GR - Microsite';
      } else {
        selectedsource = selectedsource;
      }
      this.leadsource = selectedsource;
      this.sourceFilter = true;
      if ((this.leadsource == 'Homes247' || this.leadsource == 'Homes247 - Whatsapp' || this.leadsource == 'Homes247-Campaign' || this.leadsource == 'Homes247 - FacebookAd')) {
        this.cityFilter = true;
        this.selectedCity = '1';
        this.selectedCityName = 'Bangalore';
        this.router.navigate([], {
          queryParams: {
            source: this.leadsource,
            city: this.selectedCity,
            cityName: this.selectedCityName,
          },
          queryParamsHandling: 'merge',
        });
      } else {
        this.router.navigate([], {
          queryParams: {
            source: this.leadsource,
            city: '',
            cityName: '',
          },
          queryParamsHandling: 'merge',
        });
      }
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
    CampaignLeadsComponent.count = 0;
    if (selectedcity != '' || selectedcity != undefined || selectedcity != null) {
      this.selectedCity = selectedcity.id;
      this.selectedCityName = selectedcity.name;
      this.cityFilter = true;
      this.router.navigate([], {
        queryParams: {
          city: this.selectedCity,
          cityName: this.selectedCityName,
        },
        queryParamsHandling: 'merge',
      });
      this._sharedService.getLocalitiesBycity(this.selectedCity).subscribe((resp) => {
        if (resp.status == 'True') {
          this.localitiesList = resp.LocalityList;
          this.copyOfLocalitiesList = resp.LocalityList;
        }
      })
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

  //city selection  filter
  onCheckboxChangeLocality(selectedLoc) {
    CampaignLeadsComponent.count = 0;
    if (selectedLoc != '' || selectedLoc != undefined || selectedLoc != null) {
      this.selectedLocId = selectedLoc.localityId;
      this.selectedLocName = selectedLoc.LocalityName;
      this.localityFilter = true;
      this.router.navigate([], {
        queryParams: {
          locid: this.selectedLocId,
          locName: this.selectedLocName,
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.selectedLocId = '';
      this.selectedLocName = '';
      this.localityFilter = false;
    }

  }

  // Filter Locality based on search 
  filterLocality(): void {
    if (this.searchTerm_locality) {
      this.localitiesList = this.copyOfLocalitiesList.filter(loc =>
        loc.LocalityName.toLowerCase().includes(this.searchTerm_locality.toLowerCase())
      );
    } else {
      this.localitiesList = this.copyOfLocalitiesList
    }
  }

  //here we remove the property filter
  propertyclose() {
    $('#project_dropdown').dropdown('clear');
    $("input[name='propFilter']").prop("checked", false);
    this.propertyFilter = false;
    this.searchTerm = '';
    this.propertyList = this.copyofpropertyList;
    CampaignLeadsComponent.count = 0;
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
    CampaignLeadsComponent.count = 0;
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
    CampaignLeadsComponent.count = 0;
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

  //here we remove the locality filter
  localityClose() {
    CampaignLeadsComponent.count = 0;
    this.localityFilter = false;
    this.selectedLocId = "";
    this.selectedLocName = "";
    this.searchTerm_locality = '';
    this.localitiesList = this.copyOfLocalitiesList;
    this.router.navigate([], {
      queryParams: {
        city: '',
        cityName: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  //here we remove the proptype filter
  propTypeClose() {
    CampaignLeadsComponent.count = 0;
    this.propTypeFilter = false;
    this.selectedPropTypeTableFil = "";
    this.router.navigate([], {
      queryParams: {
        propType: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  //here we remove the date filter
  dateclose() {
    CampaignLeadsComponent.count = 0;
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

  //lead status update modal
  leadstatusModalClose() {
    $('.modal-backdrop').closest('div').remove();
    let currentUrl = this.router.url;
    let pathWithoutQueryParams = currentUrl.split('?')[0];
    let currentQueryparams = this.route.snapshot.queryParams;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
    });
  }

  buysellrentselection(i, name, value) {
    console.log(i, value, name)
    setTimeout(()=>{
      $(".actionsbsr").addClass("actionbtnsbsr");
      $(".selectMarkbsr").addClass("iconmarkbsr");
      $(".actionbtnsbsr").removeClass("actionsbsr");
      $(".iconmarkbsr").removeClass("selectMarkbsr");
  
      $(".actionsbsr" + i).removeClass("actionbtnsbsr");
      $(".actionsbsr" + i).addClass("actionsbsr");
      $(".selectMarkbsr" + i).removeClass("iconmarkbsr");
      $(".selectMarkbsr" + i).addClass("selectMarkbsr");
      this.selectedBuySellRentFollowup = value;
      console.log(this.selectedBuySellRentFollowup)
    },0)


    // this.followupname = name;
  }

  // here we ge the selected followup lead id 
  selectedFollowupLead(id) {
    console.log('this.selectedFollowup',id)
    this.selectedFollowupLeadId = id;
    let bsrId;
    if (this.type == 'buy') {
      bsrId = 1;
    } else if (this.type == 'sell') {
      bsrId = 2;
    } else if (this.type == 'rent') {
      bsrId = 3;
    }

    const preselectedIndex = this.buysellrentsections.findIndex(
      section => { return section.value == bsrId }
    );

    console.log(preselectedIndex)
    if (preselectedIndex != -1) {
      setTimeout(() => {
        this.buysellrentselection(preselectedIndex,
          this.buysellrentsections[preselectedIndex].name,
          this.buysellrentsections[preselectedIndex].value
        );
      });
    }

        let followid;
    if(this.callbackparam == 1){
      followid = 4;
    } else  if(this.numberbusyparam == 1){
      followid = 5;
    } else  if(this.rnrparam == 1){
      followid = 6;
    } else  if(this.switchoffparam == 1){
      followid = 7;
    }

   const reasonsBtn = this.followupsections.findIndex(
    sec => { return sec.value == followid});

    if (reasonsBtn != -1) {
      setTimeout(() => {
        this.followupactionclick(reasonsBtn,
          this.followupsections[reasonsBtn].name,
          this.followupsections[reasonsBtn].value
        );
      });
    }
  }

  // add and remove css for selected button
  followupactionclick(i, name, value) {

    $(".actions").addClass("actionbtns");
    $(".selectMark").addClass("iconmark");
    $(".actionbtns").removeClass("actions");
    $(".iconmark").removeClass("selectMark");

    $(".actions" + i).removeClass("actionbtns");
    $(".actions" + i).addClass("actions");
    $(".selectMark" + i).removeClass("iconmark");
    $(".selectMark" + i).addClass("selectMark");


    this.followupname = name;
    this.followupid = value;
  }

  //followup status update
  updateFollowup() {
    let param = {
      leadid: this.selectedFollowupLeadId,
      status: this.followupid,
      type: this.selectedBuySellRentFollowup
    }
    console.log(param, this.selectedBuySellRentFollowup)
    if (this.selectedBuySellRentFollowup == '' || this.selectedBuySellRentFollowup == undefined || this.selectedBuySellRentFollowup == null || this.type == 'fresh') {
      this._sharedService.updateBuySellRentFollowup(param).subscribe((resp) => {
        if (resp.status == 'True') {
          swal({
            title: `${this.followupname}`,
            text: `Followup Updated Successfully`,
            type: 'success',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.selectedFollowupLeadId = '';
            this.followupid = '';
            this.followupname = '';
            $('#closereassignmodal').click();
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
            })
          })
        }
      })
    } else if (this.selectedBuySellRentFollowup == '1' || this.type == 'buy') {
      this._sharedService.updateBuySellRentFollowup(param).subscribe((resp) => {
        if (resp.status == 'True') {
          swal({
            title: `${this.followupname}`,
            text: `Followup Updated Successfully`,
            type: 'success',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.selectedFollowupLeadId = '';
            this.followupid = '';
            this.followupname = '';
            $('#closereassignmodal').click();
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
            })
          })
        }
      })
    } else if (this.selectedBuySellRentFollowup == '2' || this.type == 'sell') {
      console.log('sell')
      this._sharedService.updateBuySellRentFollowup(param).subscribe((resp) => {
        if (resp.status == 'True') {
          swal({
            title: `${this.followupname}`,
            text: `Followup Updated Successfully`,
            type: 'success',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.selectedFollowupLeadId = '';
            this.followupid = '';
            this.followupname = '';
            $('#closereassignmodal').click();
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
            })
          })
        }
      })
    } else if (this.selectedBuySellRentFollowup == '3' || this.type == 'rent') {
      this._sharedService.updateBuySellRentFollowup(param).subscribe((resp) => {
        if (resp.status == 'True') {
          swal({
            title: `${this.followupname}`,
            text: `Followup Updated Successfully`,
            type: 'success',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.selectedFollowupLeadId = '';
            this.followupid = '';
            this.followupname = '';
            $('#closereassignmodal').click();
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
            })
          })
        }
      })
    }
  }

  // here we get the selected add properties lead 
  addLocalities(lead) {
    console.log(lead)
    this.selectedEditLead = lead;
    this.customerName = lead.customer_name;
    this.customerNumber = lead.customer_number;

    const cityIdStr = lead.cityId;
    setTimeout(() => {
      this.selectedEditCity = lead.cityId;
    }, 0)

    if (lead.cityId) {
      if (lead.localityId) {
        this.selectedEditLocality = lead.localityId;
      } else {
        this.selectedEditLocality = '';

      }
      this.getLocalitiesByCity();
      if (this.selectedBuySellRentType == 'buy') {
        this.getbuyPropertyList(lead.cityId);
      } else if (this.selectedBuySellRentType == 'sell') {
        this.getAllAuthorityList(lead.cityId);
      }
    }

    console.log(this.type)
    if (this.type == 'buy') {
      setTimeout(() => {
        this.selectedEditCity = lead.city_IDPK ? lead.city_IDPK : '';
        this.selectedEditLocality = lead.locality_IDPK ? lead.locality_IDPK : '';
        this.selectedEditproperty = lead.customer_property;
        // $('#proptypeselect').val(lead.customer_proptype);
        this.selectedEditPropType = lead.customer_proptype;

      }, 0)
    } else if (this.type == 'sell') {
      setTimeout(() => {
        this.selectedEditCity = lead.city_IDPK;
        this.selectedEditLocality = lead.locality_IDPK ? lead.locality_IDPK : '';
        this.selectedCustomerType = lead.customer_role_PK ? lead.customer_role_PK : '';
        this.selectedEditPropType = lead.customer_proptype;
        this.bilderPropertyName = lead.customer_property;
        this.selectedFacingPref = lead.facing_preference;
        this.totalFloors = lead.no_floors;
        this.specificFloor = lead.specific_floor;
        this.sqftData = lead.property_sqft;
        this.expectedRent = lead.expected_rent;
        this.despositAmount = lead.deposite;
        this.parkingType = lead.parking;
        this.selectedBHKSize = lead.propeties_size;
        this.selectedAuthority = lead.Approvals_name;
        this.propertyStatus = lead.customer_status;
        this.selectedBudget = lead.customer_budget;
        const monthText = lead.possession_month;
        const monthNumber = moment().month(monthText).month();
        $('#monthPicker').val(monthNumber);
        $('#yearPicker').val(lead.possession_year);
        if (this.selectedBudget) {
          this.formatBudget();
        }
      }, 100)
    } else if (this.type == 'rent') {
      setTimeout(() => {
        this.selectedEditCity = lead.city_IDPK;
        this.selectedEditLocality = lead.locality_IDPK ? lead.locality_IDPK : '';
        this.selectedCustomerType = lead.customer_role_PK ? lead.customer_role_PK : '';
        this.bilderPropertyName = lead.customer_property;
        this.selectedFacingPref = lead.facing_preference;
        this.totalFloors = lead.no_floors;
        this.specificFloor = lead.specific_floor;
        this.sqftData = lead.property_sqft;
        this.expectedRent = lead.expected_rent;
        this.despositAmount = lead.deposite;
        this.parkingType = lead.parking;
        this.selectedBHKSize = lead.propeties_size;
      }, 100)
    }
    // this.getPropertiesByCity();
  }

  //   addLocalities(lead){
  //     this.selectedEditLead = lead;
  //     this.selectedLocality = lead.localityId;
  //     this.customerName = lead.customer_name;
  //     this.customerNumber = lead.customer_number;
  //     this.getLocalitiesByCity();
  //     this.getPropertiesByCity();
  // }

  // here we get the list properties based on city id
  getPropertiesByCity() {
    // this.filterLoader = true;
    this._sharedService.getPropertiesByCity(this.selectedEditLead.cityId, this.selectedEditLead.localityId).subscribe((resp) => {
      // this.filterLoader = false;
      if (resp.status == 'True') {
        this.propertiesList = resp.PropertyList;
      }
    })
  }

  // here we get the list of localities by city id 
  getLocalitiesByCity() {
    this._sharedService.getLocalitiesBycity(this.selectedEditLead.cityId).subscribe((resp) => {
      if (resp.status == 'True') {
        this.localitiesList = resp.LocalityList;
        this.copyOfLocalitiesList = resp.LocalityList;
      }
    })
  }

  //here we update the locality and property of the lead.
  editLeadData() {

    if (this.customerName == '' || this.customerName == undefined || this.customerName == null) {
      $('#custname').focus().css('border-color', 'red').attr('placeholder', 'Please Enter the Name');
      return false;
    } else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#custname').val())) {
        $('#custname').removeAttr("style");
      }
      else {
        $('#custname').focus().css("border-color", "red").attr('placeholder', 'Please enter valid name').val('');
        return false;
      }
    }

    if ((this.selectedLocality == '' || this.selectedLocality == undefined || this.selectedLocality == null) && (this.selectedProperty == '' || this.selectedProperty == undefined || this.selectedProperty == null)) {
      swal({
        title: 'Property & Locality',
        text: 'Select Atleast any one Property or Locality',
        type: 'warning',
        timer: 3000,
        showConfirmButton: false
      }).then(() => {
        $('#locality_dropdown').focus().css('border-color', 'red').attr('placeholder', 'Please Select the Locality');
        $('#property_dropdown').focus().css('border-color', 'red').attr('placeholder', 'Please Select the Property');
      })
      return false
    } else {
      $('#locality_dropdown').removeAttr('style');
      $('#property_dropdown').removeAttr('style');
    }

    let param = {
      leadName: this.customerName,
      locId: this.selectedLocality,
      propid: this.selectedProperty,
      leadid: this.selectedEditLead.customer_IDPK
    }

    this.filterLoader = true;
    this._sharedService.updateLocalityAndPropety(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'True') {
        swal({
          title: 'Lead Updated',
          text: 'Lead Updated Successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.selectedLocality = '';
          this.selectedProperty = '';
          $('#closeeditmodal').click();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
          })
        })
      }
    })
  }

  handleClick(type, enquiry) {
    console.log(enquiry, type)
    this.onSelectBuySellRentType(type);
    this.addLocalities(enquiry);
    if (enquiry.customer_city || enquiry.customer_locality) {
      this._sharedService.getLocalitiesBycity(enquiry.city_IDPK).subscribe((resp) => {
        if (resp.status == 'True') {
          this.localitiesList = resp.LocalityList;
          this.copyOfLocalitiesList = resp.LocalityList;
        }
      })

      let param = {
        city: enquiry.city_IDPK,
        locality: enquiry.locality_IDPK
      }
      this._sharedService.getPropertyListForBuy(param).subscribe((resp) => {
        if (resp.status == 'True') {
          this.propertyListForBuy = resp['data'];
        }
      })

      this.getAllAuthorityList(enquiry.city_IDPK);
    }
  }

  onSelectBuySellRentType(type) {
    this.selectedBuySellRentType = type;
    this.localitiesList = [];
    if (type == 'sell' || type == 'rent') {
      this.roletype = [
        { id: 'Owner', value: 'owner' },
        { id: 'Agent', value: 'agent' },
        // {id:'Tenant',value:'tenant'},
        // {id:'Builder',value:'builder'},
      ]
      if (type == 'sell') {
        let sellobj = { id: 'Builder', value: 'builder' };
        this.roletype.push(sellobj);
        setTimeout(() => {
          this.selectedCustomerType = 'owner';
        }, 0)
      } else if (type == 'rent') {
        let rentobj = { id: 'Tenant', value: 'tenant' };
        this.roletype.push(rentobj);
        setTimeout(() => {
          this.selectedCustomerType = 'owner';
        }, 0)
      }
    }
  }

  getbuyPropertyList(cityid) {
    let param = {
      city: cityid,
      locality: this.selectedEditLocality
    }
    this._sharedService.getPropertyListForBuy(param).subscribe((resp) => {
      if (resp.status == 'True') {
        this.propertyListForBuy = resp['data'];
      }
    })
  }

  cityselected(event) {
    this.selectedEditLocality = '';
    this.selectedEditproperty = '';

    this.localitiesList = []
    this.selectedEditCity = event.target.value;
    this._sharedService.getLocalitiesBycity(event.target.value).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'True') {
        this.localitiesList = resp.LocalityList;
        if (this.selectedBuySellRentType == 'buy') {
          this.getbuyPropertyList(event.target.value)
        } else if (this.selectedBuySellRentType == 'sell') {
          this.getAllAuthorityList(event.target.value);
        }
      }
    })
  }

  getAllAuthorityList(cityid) {
    let param = {
      cityid: cityid
    }
    this._sharedService.getAuthorityList(param).subscribe((resp) => {
      if (resp.status == 'True') {
        this.authorityList = resp['data'];
      }
    })
  }

  customerSelected(event) {
    this.selectedCustomerType = event.target.value;
  }

  localitySelected(event) {
    this.selectedEditLocality = event.target.value;
    if (this.selectedBuySellRentType == 'buy') {
      this.getbuyPropertyList(this.selectedEditCity)
    }
  }

  typeselection(event) {
    this.selectedPropType = event.target.value;
  }

  // possessionselection(event) {
  //   console.log(event.target.value);
  //   this.selectedPossession = event.target.value;
  // }

  sizeselection(event) {
    console.log(event.target.value);
    this.selectedBHKSize = event.target.value;
  }

  budgetselection(event) {
    console.log(event.target.value);
    this.selectedBudget = event.target.value;
  }

  facingselection(event) {
    console.log(event.target.value);
    this.selectedFacingPref = event.target.value;
  }

  parkingSelected(event) {
    console.log(event.target.value);
    this.parkingType = event.target.value;
  }

  selectedPropertyStatus(event) {
    this.propertyStatus = event.target.value;
    console.log(this.propertyStatus)
  }

  onCheckboxChange1(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checboxStatus = target.checked;

    if (this.checboxStatus) {
      this.bilderPropertyName = 'Builder Floor';
    } else {
      this.bilderPropertyName = '';
    }
  }

  updateLeads() {
    let id;
    if (this.selectedBuySellRentType == 'buy') {
      id = 1;
    } else if (this.selectedBuySellRentType == 'sell') {
      id = 2;
    } else if (this.selectedBuySellRentType == 'rent') {
      id = 3;
    }

    if (this.customerName == '' || this.customerName == undefined || this.customerName == null) {
      $('#custname').focus().css('border-color', 'red').attr('placeholder', 'Please Enter the Name');
      return false;
    } else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#custname').val())) {
        $('#custname').removeAttr("style");
      } else {
        $('#custname').focus().css("border-color", "red").attr('placeholder', 'Please enter valid name').val('');
        return false;
      }
    }

    if (this.selectedEditCity == '' || this.selectedEditCity == undefined || this.selectedEditCity == null) {
      swal({
        title: 'City',
        text: 'Select Atleast any one City',
        type: 'warning',
        timer: 3000,
        showConfirmButton: false
      }).then(() => {
        $('#city_dropdown').focus().css('border-color', 'red').attr('placeholder', 'Please Select the City');
      })
      return false
    } else {
      $('#city_dropdown').removeAttr('style');
    }

    if ((this.selectedEditproperty == '' || this.selectedEditproperty == undefined || this.selectedEditproperty == null) && this.selectedBuySellRentType == 'buy') {
      swal({
        title: 'Property',
        text: 'Select the Property',
        type: 'warning',
        timer: 3000,
        showConfirmButton: false
      }).then(() => {
        $('#property_dropdown').focus().css('border-color', 'red').attr('placeholder', 'Please Select the Property');
      })
      return false
    } else {
      $('#property_dropdown').removeAttr('style');
    }

    if ((this.selectedPropType == '' || this.selectedPropType == undefined || this.selectedPropType == null) && this.selectedBuySellRentType == 'buy') {
      swal({
        title: 'Property',
        text: 'Select the Property Type',
        type: 'warning',
        timer: 3000,
        showConfirmButton: false
      })
      return false
    }

    if ((this.selectedCustomerType == '' || this.selectedCustomerType == undefined || this.selectedCustomerType == null) && this.selectedBuySellRentType != 'buy') {
      swal({
        title: 'Customer Type',
        text: 'Select the Customer Type',
        type: 'warning',
        timer: 3000,
        showConfirmButton: false
      })
      return false
    }

    if ((this.bilderPropertyName == '' || this.bilderPropertyName == undefined || this.bilderPropertyName == null) && (this.selectedBuySellRentType == 'sell' || this.selectedBuySellRentType == 'rent')) {
      $('#property_name_sell').focus().css('border-color', 'red').attr('placeholder', 'Please Enter the Prop Name');
      return false;
    } else {
      $('#property_name_sell').removeAttr("style");
    }

    let param;
    if (this.selectedBuySellRentType == 'buy') {
      param = {
        flow: id,
        leadid: this.selectedEditLead.customer_IDPK,
        name: this.customerName,
        cityid: this.selectedEditCity,
        locid: this.selectedEditLocality,
        type: this.selectedPropType,
        propid: this.selectedEditproperty
      }
    } else if (this.selectedBuySellRentType == 'sell') {
      param = {
        flow: id,
        leadid: this.selectedEditLead.customer_IDPK,
        name: this.customerName,
        cityid: this.selectedEditCity,
        locid: this.selectedEditLocality,
        customertype: this.selectedCustomerType,
        builderpropertyname: this.bilderPropertyName,
        type: this.selectedPropType,
        possession_month: this.selectedPossessionMonth,
        possession_year: this.selectedPossessionYear,
        bhk: this.selectedBHKSize,
        budget: this.selectedBudget,
        totalfloors: this.totalFloors,
        specificfloor: this.specificFloor,
        sqft: this.sqftData,
        expectedrent: this.expectedRent,
        deposite: this.despositAmount,
        parking: this.parkingType,
        authority: this.selectedAuthority,
        propstatus: this.propertyStatus,
        facingpref: this.selectedFacingPref,
      }
    } else if (this.selectedBuySellRentType == 'rent') {
      param = {
        flow: id,
        leadid: this.selectedEditLead.customer_IDPK,
        name: this.customerName,
        cityid: this.selectedEditCity,
        locid: this.selectedEditLocality,
        customertype: this.selectedCustomerType,
        builderpropertyname: this.bilderPropertyName,
        bhk: this.selectedBHKSize,
        totalfloors: this.totalFloors,
        specificfloor: this.specificFloor,
        sqft: this.sqftData,
        expectedrent: this.expectedRent,
        deposite: this.despositAmount,
        parking: this.parkingType,
        propstatus: this.propertyStatus,
        facingpref: this.selectedFacingPref,
      }
    }
    // = {
    //   flow: id,
    //   leadid: this.selectedEditLead.customer_IDPK,
    //   name: this.customerName,
    //   type: this.selectedPropType,
    //   cityid: this.selectedEditCity,
    //   locid: this.selectedEditLocality,
    //   propid: this.selectedEditproperty,
    //   customertype: this.selectedCustomerType,
    //   builderpropertyname: this.bilderPropertyName,
    //   sqft: this.sqftData,
    //   facingpref: this.selectedFacingPref,
    //   totalfloors: this.totalFloors,
    //   specificfloor: this.specificFloor,
    //   expectedrent: this.expectedRent,
    //   parking: this.parkingType,
    //   deposite: this.despositAmount,
    //   bhk: this.selectedBHKSize,
    //   authority: this.selectedAuthority,
    //   propstatus: this.propertyStatus
    // }
    console.log(param)
    this._sharedService.updateBuySellRent(param).subscribe((resp) => {
      console.log(resp)
      if (resp.status == 'True') {
        swal({
          title: 'Lead Updated',
          text: 'Lead Updated Successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.selectedLocality = '';
          this.selectedProperty = '';
          $('#closeeditmodal').click();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
          })
        })
      }
    })
  }

  //this is code for filter for direct and assigned
  propType(type) {
    this.selectedPropTypeTableFil = type;
    this.router.navigate([], {
      queryParams: {
        propType: type
      },
      queryParamsHandling: 'merge',
    });
  }

  clickedLeadPropDetails(lead) {
    console.log(lead);
    this.selectedLeadPropDetails = lead;
  }

  // Convert raw number into Indian formatted currency with ₹
  formatBudget() {
    if (!this.selectedBudget) return;

    let numberValue = this.selectedBudget.toString().replace(/[^0-9]/g, '');
    const num = parseInt(numberValue, 10);

    if (!isNaN(num)) {
      this.selectedBudget = '₹' + this.formatIndianNumber(num);
    }
  }

  // Remove formatting when editing
  unformatBudget() {
    if (!this.selectedBudget) return;
    this.selectedBudget = this.selectedBudget.toString().replace(/[^0-9]/g, '');
  }

  // Helper to format numbers in Indian format (e.g., 1000000 => 10,00,000)
  formatIndianNumber(x: number): string {
    const numStr = x.toString();
    const lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return otherNumbers ? formattedOther + ',' + lastThree : lastThree;
  }

  initializeMonthYearPicker() {
    // Populate months
    const monthPicker = $('#monthPicker');
    monthPicker.empty();
    for (let m = 0; m < 12; m++) {
      const monthName = moment().month(m).format('MMMM');
      monthPicker.append(`<option value="${m}">${monthName}</option>`);
    }

    // Populate years (e.g., last 20 years)
    const yearPicker = $('#yearPicker');
    yearPicker.empty();
    const currentYear = moment().year();
    for (let y = currentYear - 50; y <= currentYear; y++) {
      yearPicker.append(`<option value="${y}">${y}</option>`);
    }

    // Initialize selected values from URL or default to current month/year
    const urlParams = new URLSearchParams(window.location.search);
    const selectedMonth = urlParams.get('month');
    const selectedYear = urlParams.get('year');

    monthPicker.val(selectedMonth !== null ? selectedMonth : '');
    yearPicker.val(selectedYear !== null ? selectedYear : '');

    // Update the display and URL when either picker changes
    const updateSelectedMonthYear = () => {
      const month = parseInt(monthPicker.val() as string, 10);
      const year = parseInt(yearPicker.val() as string, 10);
      const formatted = moment().year(year).month(month).format('MMMM YYYY');
      // this.selectedPossessionMonth = month;
      // this.selectedPossessionYear = year;
    };

    monthPicker.on('change', updateSelectedMonthYear);
    yearPicker.on('change', updateSelectedMonthYear);

    // Initialize display
    updateSelectedMonthYear();
  }

  selectedMonth(event) {
    // console.log(event,event.target.value,event.target.options[event.target.options.selectedIndex].text)
    this.selectedPossessionMonth = event.target.options[event.target.options.selectedIndex].text;
  }

  selectedYear(event) {
    // console.log(event,event.target.value)
    this.selectedPossessionYear = event.target.value;
  }

}


