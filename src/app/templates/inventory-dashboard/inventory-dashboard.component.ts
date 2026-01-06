import { Component, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.css']
})
export class InventoryDashboardComponent implements OnInit {

  constructor(
    private _sharedService: sharedservice,
    private _mandateService: mandateservice,
    private router: Router,
    private route: ActivatedRoute,
    private render: Renderer2
  ) { }

  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  isViewType: any;
  units_name: string = '';
  assignedCount: number = 0;
  availableUnitsCount: number = 0;
  bookedCount: number = 0;
  cancelledCount: number = 0;
  agreementCount: number = 0;
  disbursementCount: number = 0;
  registrationCount: number = 0;
  soldUnitsCount: number = 0;
  mandateprojects: any;
  propertyid: any;
  propertyname: any;
  filterLoader: boolean = false;
  towerList: any;
  bhkList: any;
  sizeList: any;
  statusList: any;
  bhkSize: any;
  towerId: any;
  status: any;
  unitsize: any;
  propertyDetails: any;
  copypropertyDetails: any;
  selectedTower: any;
  isDrawerOpen: boolean = false;
  selectedEditBhkId: any;
  unitList: any;
  executiveList: any;
  leadsList: any;
  editremarks: any;
  isCheck: boolean = false;
  selectedEditUnit: any;
  selectedUnitStatus: any;
  allListBhk:any;
  selectedEditExecutive: any;


  ngOnInit() {
    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.mandateprojectsfetch();
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  getData() {
    this.route.queryParams.subscribe((params) => {
      this.propertyid = params['property'];
      this.propertyname = params['propname'];
      this.isViewType = params['viewtype'];
      this.towerId = params['tower'];
      this.bhkSize = params['bhk'];
      this.unitsize = params['size'];
      this.status = params['status']

      if (this.propertyid == '' || this.propertyid == undefined || this.propertyid == null) {
        this.propertyid = this.mandateprojects[0].property_idfk;
        this.propertyname = this.mandateprojects[0].property_info_name;
      }

      if (this.isViewType) {
        $('.add_class').removeClass('active');
        setTimeout(() => {
          if (this.isViewType == 'table') {
            $('.table_section').addClass('active');
          } else if (this.isViewType == 'block') {
            $('.block_section').addClass('active');
          }
    }, 0)
        this.getPropData();
      } else {
        this.getPropData();
      }

      this.getDashCounts();
      this.getTowerByPropid();
      this.getBhkList();
      this.getstatuslist();
      this.getSizesList();
    })
  }

  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
        this.getData();
      }
    });
  }

  getmandateExecutives() {
    this._mandateService.fetchmandateexecutuves(this.propertyid, '','','').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.executiveList = executives['mandateexecutives'];
      } else {
        this.executiveList = [];
      }
    });
  }

  viewChange(type) {
    $('.add_class').removeClass('active');
    this.isViewType = type;
    setTimeout(() => {
      if (type == 'table') {
        $('.table_section').addClass('active');
      } else if (type == 'block') {
        $('.block_section').addClass('active');
      }
    }, 0)

    this.router.navigate([], {
      queryParams: {
        viewtype: type
      }
    })
  }

  getDashCounts() {
    this._sharedService.getInventoryCounts(this.propertyid).subscribe((resp) => {
      if (resp.status == 'true') {
        this.assignedCount = resp.counts.total_units;
        this.availableUnitsCount = resp.counts.available_units;
        this.soldUnitsCount = resp.counts.sold_units;
        this.bookedCount = resp.counts.total_booked_units;
        this.cancelledCount = resp.counts.cancelled_units;
        this.agreementCount = resp.counts.sale_agreement_units;
        this.disbursementCount = resp.counts.loan_disburse_units;
        this.registrationCount = resp.counts.reg_due_units;
      }
    })
  }

  getPropData() {
    let type;
    if (this.isViewType == 'table') {
      type = 1;
    } else if (this.isViewType == 'block') {
      type = 2;
    }
    let param = {
      propid: this.propertyid,
      type: type,
      bhk: this.bhkSize,
      status: this.status,
      towerid: this.towerId,
      unit: this.unitsize
    }

    this._sharedService.getPropertyDetails(param).subscribe((resp) => {
      if (resp.status == 'true') {
        this.propertyDetails = resp.data;
        this.copypropertyDetails = resp.data;
        if (type == 2) {
          this.selectedTower = resp.data[0];
        }
      } else {
        this.propertyDetails = [];
        this.copypropertyDetails = [];
      }
    })
  }

  getTowerByPropid() {
    this._sharedService.getTowerDetails(this.propertyid).subscribe((resp) => {
      // if(resp.status == 'true'){
      this.towerList = resp
      // }
    })
  }

  getstatuslist(){
    let param = {
      propid: this.propertyid,
      towerid: this.towerId,
      size: this.unitsize,
      bhk: this.bhkSize,
      status: ''
    }
    console.log(param)
    this._sharedService.getstatus(param).subscribe((resp) => {
      console.log(resp);
      if (resp.status == 'true') {
        this.statusList = resp.data;
        console.log(this.statusList)
      }
    })
  }

  getBhkList() {
    let param = {
      propid: this.propertyid,
      towerid: this.towerId,
      size: this.unitsize,
      status: this.status
    }
    console.log(param)
    this._sharedService.getBHKDetails(param).subscribe((resp) => {
      console.log(resp);
      if (resp.status == 'true') {
        this.bhkList = resp.data;
        console.log(this.bhkList)
      }
    })
  }

  getSizesList(){
    let param = {
      propid:this.propertyid,
      towerid:this.towerId,
      bhk:this.bhkSize,
      status:this.status
    }

    this._sharedService.getSizes(param).subscribe((resp)=>{
      if(resp.status == 'true'){
        this.sizeList = resp.data;
      }
    })
  }

  blockTower(data) {
    this.selectedTower = data;
  }

  propchange(vals) {
    this.filterLoader = true;
    this.propertyid = vals.target.value;
    this.propertyname = vals.target.options[vals.target.options.selectedIndex].text;
    this.router.navigate([], {
      queryParams: {
        property: this.propertyid,
        propname: vals.target.options[vals.target.options.selectedIndex].text,
      },
      queryParamsHandling: 'merge',
    });
    $('#rm_dropdown').dropdown('clear');
  }

  towerchange(event) {
    this.towerId = event.target.value;
    // this.getBhkList();
     this.router.navigate([], {
      queryParams: {
        tower: this.towerId,
      },
      queryParamsHandling: 'merge',
    });
  }

  bhkchange(event) {
    this.bhkSize = event.target.value;
     this.router.navigate([], {
      queryParams: {
        bhk: this.bhkSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  sizechange(event) {
    this.unitsize = event.target.value;
    // this.getBhkList();
     this.router.navigate([], {
      queryParams: {
        size: this.unitsize,
      },
      queryParamsHandling: 'merge',
    });
  }

  statuschange(event) {
    this.status = event.target.value;
    console.log(this.status)
    // this.getBhkList();
     this.router.navigate([], {
      queryParams: {
        status: this.status,
      },
      queryParamsHandling: 'merge',
    });
  }

  filterUnits(){
    if(this.units_name){
      this.propertyDetails = this.copypropertyDetails.filter((prop) =>{
        return prop.unit_name.toLowerCase().includes(this.units_name.toLowerCase());
      })
    } else {
      this.propertyDetails = this.copypropertyDetails;
    }
  }

  refresh() {
    this.towerId = '';
    this.bhkSize = '';
    this.unitsize = '';
    this.status = '';
    this.units_name = '';
    $('#tower_dropdown').dropdown('clear');
    $('#bhk_dropdown').dropdown('clear');
    $('#size_dropdown').dropdown('clear');
    $('#status_dropdown').dropdown('clear');
    this.router.navigate(['inventory-dashboard'], {
      queryParams: {
        viewtype: 'table',
        tower:'',
        bhk:'',
        size:'',
        status:'',
    },
    });
  }

  getAllBhkSizes(){
    return this._sharedService.getAllBhk().subscribe((resp)=>{
        this.allListBhk = resp;
    })
  }

  // Method to toggle the drawer's visibility
  editUnit(floor) {
    this.selectedEditUnit = floor;
    console.log(this.selectedEditUnit);
    this.isDrawerOpen = !this.isDrawerOpen;
    this.getAllBhkSizes();
    this.getmandateExecutives();
  }

  // Method to close the drawer's visibility
  closeDrawer() {
    this.isDrawerOpen = false;
  }

  selectedEditBhk(bhk) {
    this.selectedEditBhkId = bhk;
  }

  unitchange(event) {
    console.log(event.target.value);
  }

  rmchange(event) {
    console.log(event.target.value);
    this.selectedEditExecutive = event.target.value;
  }

  leadchange(event) {
    console.log(event.target.value)
  }

  onCheckboxAsSold(event) {
    console.log(event.target.checked);
    this.isCheck = event.target.checked;
  }

  selectUnitStatusData(type) {
    this.selectedUnitStatus = type;
  }

}
