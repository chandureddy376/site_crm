import { Component, OnInit, Renderer2 } from '@angular/core';
import { sharedservice } from '../../shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-cp-client-listing',
  templateUrl: './cp-client-listing.component.html',
  styleUrls: ['./cp-client-listing.component.css']
})
export class CpClientListingComponent implements OnInit {

  cpClients: any;
  filterLoader: boolean = true;
  id = this.route.snapshot.params['id'];
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  cities: any;
  copyOfCities: any;
  searchTerm_city: string = '';
  selectedcity: any;
  selectedCityName: any;
  cityFilter: boolean = false;
  uploads: string[] = [];
  agreementFiles: any[] = [];
  selectedStatus: any;
  statusFilter: boolean = false;
  selectedClientAgreement: any;
  localitiesList: any;
  copyLocalitiesList: any;
  selectedCityOpt: any;
  selectedLocalitiesOptions: any;
  selectedLocalities: any;
  propertiesList: any;
  copyPropertiesList: any;
  selectedPropertiesOptions: any;
  selectedProperties: any;
  searchTerm_property: string = '';
  propertyFilter: boolean = false;
  propertyid: any;
  propertyname: any;
  searchTerm_locality: string = '';
  localityFilter: boolean = false;
  selectedLocalityName: any;
  selectedLocalityIds: any;
  cpLocalityList: any;
  copyCPLocalityList: any;
  propertiesListFromCP: any;
  copyPropertiesListFromCP: any;
  selectedcitiesOptions: any;
  localitiesListForAdd: any
  paidParam: any;
  unpaidParam: any;
  trailParam: any;
  paidCount: number = 0;
  unpaidCount: number = 0;
  trailCount: number = 0;
  packList: any[] = [];
  clientPack: any;
  editClientData: any;
  clientStatusList: any[] = [];
  clientstatusid: any;
  isEdit: boolean = false;
  editCityId: any = '';
  editLocalitiesId: any = '';
  editPropertiesId: any = '';

  constructor(
    private _sharedService: sharedservice,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
    if (localStorage.getItem('Role') != '1' && localStorage.getItem('Role') != '2') {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    this.filterLoader = false;
    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    // this.getCpClients();
    this.getCitylist();
    this.getAllData();
    setTimeout(() => {
      // this.getLocalitiesList();
      // this.getPropertiesListBasedOnCP();
    }, 2000)

    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }

    this.packList = [
      { name: 'PAID', value: 1 },
      { name: 'UNPAID', value: 2 },
      { name: 'TRAIL', value: 3 },
    ]

    this.clientStatusList = [
      { name: 'ACTIVE', value: 1 },
      { name: 'INACTIVE', value: 2 }
    ]
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
    $('.modal').remove();
  }

  //here we receive the router changes data
  getAllData() {
    this.route.queryParams.subscribe((param) => {
      this.paidParam = param['paid'];
      this.unpaidParam = param['unpaid'];
      this.trailParam = param['trail'];
      this.selectedcity = param['cityId'];
      this.selectedCityName = param['cityName'];
      this.selectedLocalityIds = param['localityId'];
      this.selectedLocalityName = param['localityName'];
      this.propertyid = param['propid'];
      this.propertyname = param['propName'];
      // this.selectedStatus = param['status'];

      if (this.selectedcity == null || this.selectedcity == undefined || this.selectedcity == '') {
        this.selectedCityName = '';
        this.selectedcity = '';
        this.cityFilter = false;
      } else {
        this.cityFilter = true;
      }

      if (this.selectedLocalityIds == null || this.selectedLocalityIds == undefined || this.selectedLocalityIds == '') {
        this.selectedLocalityIds = '';
        this.selectedLocalityName = '';
        this.localityFilter = false;
      } else {
        this.localityFilter = true;
      }

      if (this.propertyid == null || this.propertyid == undefined || this.propertyid == '') {
        this.propertyid = '';
        this.propertyname = '';
        this.propertyFilter = false;
      } else {
        this.propertyFilter = true;
      }
      console.log(param['status'])
      if (param['status'] == null || param['status'] == undefined || param['status'] == '') {
        this.selectedStatus = 'Active';
        this.statusFilter = true;
      } else {
        if (param['status'] == 'Active') {
          this.selectedStatus = 'Active'
        } else if (param['status'] == 'Inactive') {
          this.selectedStatus = 'Inactive'
        }
        this.statusFilter = true;
      }

      if (this.paidParam == 1) {
        $(".lead_section").removeClass("active");
        $(".paid_section").addClass("active");
      } else if (this.unpaidParam == 1) {
        $(".lead_section").removeClass("active");
        $(".unpaid_section").addClass("active");
      } else if (this.trailParam == 1) {
        $(".lead_section").removeClass("active");
        $(".trail_section").addClass("active");
      }

      this.getCpCounts();
      this.getCpClients();
    })
  }

  getCpCounts() {
    let status;
    if (this.selectedStatus == 'Active') {
      status = '1';
    } else if (this.selectedStatus == 'Inactive') {
      status = '2';
    }
    let param = {
      cityId: this.selectedcity,
      localityid: this.selectedLocalityIds,
      propertyid: this.propertyid,
      status: status
    }

    this._sharedService.getCpClientCounts(param).subscribe((resp) => {
      if (resp.status == 'True') {
        this.paidCount = resp.counts.paid;
        this.unpaidCount = resp.counts.unpaid;
        this.trailCount = resp.counts.trial;
      } else {
        this.paidCount = 0;
        this.unpaidCount = 0;
        this.trailCount = 0;
      }
    })
  }

  // here we get the list of cp clients 
  getCpClients() {
    let status, packStat;
    if (this.selectedStatus == 'Active') {
      status = '1';
    } else if (this.selectedStatus == 'Inactive') {
      status = '2';
    }

    if (this.paidParam == 1) {
      packStat = '1';
    } else if (this.unpaidParam == 1) {
      packStat = '2';
    } else if (this.trailParam == 1) {
      packStat = '3';
    }

    let param = {
      cityId: this.selectedcity,
      localityid: this.selectedLocalityIds,
      propertyid: this.propertyid,
      status: status,
      packstatus: packStat
    }
    this.filterLoader = true;
    this._sharedService.getCpClients(param).subscribe((resp) => {
      console.log(resp)
      this.filterLoader = false;
      if (resp.status == 'True') {
        this.cpClients = resp['result'];
      } else {
        this.cpClients = [];
      }
    })
  }

  // here we get the list of cities 
  getCitylist() {
    this._sharedService.getcities().subscribe(citylist => {
      this.cities = citylist;
      this.copyOfCities = citylist;
    });
  }

  getPropertiesList() {
    let cityid = '', localIds = '';
    if (this.isEdit == true && this.editClientData) {
      cityid = this.editCityId;
    } else {
      cityid = this.selectedcity;
    }

    if (this.isEdit == true && this.editClientData) {
      localIds = this.editLocalitiesId;
    } else {
      localIds = this.selectedLocalities;
    }
    let param = {
      city: cityid,
      locality: localIds
    }
    this._sharedService.getPropertyListForBuy(param).subscribe((resp) => {
      this.propertiesList = resp.data;
      this.copyPropertiesList = resp.data;
    })
  }

  propertychange(event) {
    if(this.isEdit){
      let props = this.selectedPropertiesOptions.map((prop) => prop.PropertyID);
      this.editPropertiesId = props.join(',');
    } else {
      let props = this.selectedPropertiesOptions.map((prop) => prop.PropertyID);
      this.selectedProperties = props.join(',');
    }
  }

  packchange(event) {
    console.log(event.value, this.clientPack)
  }

  // Method to upload brochure
  agreementuploads(i, event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.filterLoader = true;
    if (files.length == 0) {
      this.filterLoader = false;
    }

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // if (file.type !== 'application/pdf' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
        //   this.filterLoader = false;
        //   swal({
        //     title: 'Invalid File Type',
        //     text: 'Only PDF/PNG/JPEG files are allowed.',
        //     type: "error",
        //     timer: 2000,
        //     showConfirmButton: false
        //   }).then(() => {
        //     input.value = '';
        //     this.agreementFiles = [];
        //   });
        //   return;
        // } else {
        // Validate the file size
        if (file.size > 10000000) {
          this.filterLoader = false;
          swal({
            title: 'File Size Exceeded',
            text: 'File Size limit is 10MB',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            this.uploads = [];
          });
        } else {
          // Push the file to closurefiles and read the file
          const file = files[i];
          const fileName = file.name;
          $('#customFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);
          this.agreementFiles.push(file);
          // this.uploads = [];
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.filterLoader = false;
            this.uploads.push(event.target.result);
          };
          reader.readAsDataURL(file);

        }
        // }
      }
    }
  }

  // Method to remove agreement file
  removeAgreementFile(i) {
    this.uploads.splice(i, 1);
    this.agreementFiles.splice(i, 1);
    if (this.uploads.length == 0) {
      $("#customFile" + i).val('');
      $('.file-label-' + i).html('Choose file ');
    } else {

    }
    // alert(this.uploads.length);
  }

  //to display the uploaded file in ui
  getagreementUrl(agreement, type) {
    let fileURL;
    if (type == 'post') {
      fileURL = URL.createObjectURL(agreement);
    } else {
      fileURL = 'https://lead247.in/images/clients_docs/' + agreement.doc_name;
    }
    // Sanitize the object URL and return it
    return this.sanitizer.bypassSecurityTrustUrl(fileURL);
  }

  //to view the uploaded file in new tab
  viewagreement(path, type) {
    let fileURL;
    if (type == 'post') {
      fileURL = URL.createObjectURL(path);
    } else if (type == "view") {
      fileURL = 'https://lead247.in/images/clients_docs/' + path.doc_name;
    }
    window.open(fileURL, '_blank');
  }

  //download agreement on view
  downloadAgreement(data) {
    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', 'https://lead247.in/images/clients_docs/' + data.doc_name);
    link.setAttribute('download', data);
    link.click();
    link.remove();
  }

  selectViewClient(client) {
    this.selectedClientAgreement = client;

    if (this.selectedClientAgreement.client_docs.length == 0) {
      swal({
        title: 'No Files has been uploaded',
        type: 'info',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  // creation of cp cliebnt 
  createClient() {
    if ($('#client_company_name').val().trim() == '' || $('#client_company_name').val().trim() == undefined) {
      $('#client_company_name').focus().css('border-color', 'red').attr('Please Enter the Company Name');
      return false;
    } else {
      // var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      // if (nameFilter.test($('#client_company_name').val())) {
      $('#client_company_name').removeAttr("style");
      // }
    }

    if ($('#client_name').val().trim() == '' || $('#client_name').val().trim() == undefined) {
      $('#client_name').focus().css('border-color', 'red').attr('Please Enter the Name');
      return false;
    } else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#client_name').val())) {
        $('#client_name').removeAttr("style");
      }
    }

    if ($('#client_mobile').val().trim() == '' || $('#client_mobile').val().trim() == undefined) {
      $('#client_mobile').focus().css('border-color', 'red').attr('Please Enter the Number');
      return false;
    } else {
      var mobilee = /^[0-9]{10}$/;
      if (mobilee.test($('#client_mobile').val())) {
        $('#client_mobile').removeAttr('style');
      } else {
        $('#client_mobile').focus().css('border-color', 'red').attr('placeholder', 'Please enter valid contact number').val('');
        return false;
      }
    }

    if ($('#client_email').val().trim() == '' || $('#client_email').val().trim() == undefined) {
      $('#client_email').focus().css('border-color', 'red').attr('Please Enter the Mail');
      return false;
    } else {
      var email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
      if (email.test($('#client_email').val())) {
        $('#custmail').removeAttr("style");
      }
      else {
        $('#client_email').focus().css("border-color", "red").attr('placeholder', 'Please enter valid email-id').val('');
        return false;
      }
    };

    if (this.selectedcity == '' || this.selectedcity == undefined || this.selectedcity == null) {
      swal({
        title: 'City Selection',
        text: 'Please Select the City',
        type: 'warning',
        timer: 2000,
        showConfirmbutton: false
      })
    }

    if (this.clientPack == '' || this.clientPack == undefined || this.clientPack == null) {
      swal({
        title: 'Client Type',
        text: 'Please Select the Pack',
        type: 'warning',
        timer: 2000,
        showConfirmbutton: false
      })
    }

    if (this.agreementFiles && this.agreementFiles.length == 0) {
      swal({
        title: 'Agreement File',
        text: 'Upload atleast One File',
        timer: 2000,
        type: 'warning',
        showConfirmButton: false
      })
      return false;
    }

    this.filterLoader = true;
    const formData = new FormData();
    formData.append('company_name', $('#client_company_name').val());
    formData.append('client_name', $('#client_name').val());
    formData.append('client_number', $('#client_mobile').val());
    formData.append('client_email', $('#client_email').val());
    formData.append('client_cityId', this.selectedcity);
    formData.append('client_locality', this.selectedLocalities);
    formData.append('client_property', this.selectedProperties);
    formData.append('client_useagestatus', this.clientPack.value);
    for (let i = 0; i < this.agreementFiles.length; i++) {
      formData.append('client_doc[]', this.agreementFiles[i]);
    }


    this._sharedService.createCPClient(formData).subscribe((resp) => {
      console.log(resp)
      this.filterLoader = false;
      // if (resp['status'] == 'True') {
      swal({
        title: 'CP Client',
        text: 'Client Added Successfully',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        $('#clientModalCloase').click();
        $('.modal-backdrop').closest('div').remove();
        let currentUrl = this.router.url;
        let pathWithoutQueryParams = currentUrl.split('?')[0];
        let currentQueryparams = this.route.snapshot.queryParams;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
        });
      });
      // } else {

      // }
    })
  }

  //city selection  filter
  onCheckboxChangecity(selectedcity) {
    if (selectedcity != '' || selectedcity != undefined || selectedcity != null) {
      this.selectedcity = selectedcity.id;
      this.selectedCityName = selectedcity.name;
      this.router.navigate([], {
        queryParams: {
          cityId: this.selectedcity,
          cityName: this.selectedCityName,
        },
        queryParamsHandling: 'merge',
      });
      this.getLocalitiesList();
      this.getPropertiesListBasedOnCP();
    } else {
      this.selectedcity = '';
      this.selectedCityName = '';
      this.cityFilter = false;
    }

  }

  // Filter city based on search 
  filtercity(): void {
    if (this.searchTerm_city != '') {
      this.cities = this.copyOfCities.filter(city =>
        city.name.toLowerCase().includes(this.searchTerm_city.toLowerCase())
      );
    } else {
      this.cities = this.copyOfCities
    }
  }

  //locality selection  filter
  onCheckChangeLocality() {
    var checkid = $("input[name='locFilter']:checked").map(function () {
      return this.value;
    }).get().join(',');

    let filteredlocIds;
    filteredlocIds = checkid.split(',');
    let filteredLocNames;
    filteredLocNames = this.copyCPLocalityList.filter((da) => filteredlocIds.some((prop) => {
      return prop == da.locality_IDPK
    }));
    filteredLocNames = filteredLocNames.map((name) => name.locality_name);

    if (filteredlocIds != '' || filteredlocIds != undefined) {
      this.selectedLocalityIds = filteredlocIds;
      this.selectedLocalityName = filteredLocNames;
      this.localityFilter = true;
      this.router.navigate([], {
        queryParams: {
          localityId: this.selectedLocalityIds,
          localityName: this.selectedLocalityName,
        },
        queryParamsHandling: 'merge',
      });
      this.getPropertiesListBasedOnCP();
    } else {
      this.selectedLocalityIds = '';
      this.selectedLocalityName = '';
      this.localityFilter = false;
    }
  }

  // Filter locality based on search 
  filterlocality(): void {
    if (this.searchTerm_locality != '') {
      this.cpLocalityList = this.copyCPLocalityList.filter(local =>
        local.locality_name.toLowerCase().includes(this.searchTerm_locality.toLowerCase())
      );
    } else {
      this.cpLocalityList = this.copyCPLocalityList;
    }
  }

  //property selection  filter
  onCheckPropertyChange() {
    var checkid = $("input[name='propFilter']:checked").map(function () {
      return this.value;
    }).get().join(',');

    let filteredPropertyIds = checkid.split(',');

    let filteredPropertyNames = this.copyPropertiesListFromCP.filter((da) =>
      filteredPropertyIds.some((prop) => {
        return prop == da.property_id;
      }));
    filteredPropertyNames = filteredPropertyNames.map((name) => name.property_name);

    if (filteredPropertyIds != '' || filteredPropertyIds != undefined || filteredPropertyIds != null) {
      this.propertyname = filteredPropertyNames;
      this.propertyid = filteredPropertyIds;
      this.propertyFilter = true;
      this.router.navigate([], {
        queryParams: {
          propName: this.propertyname,
          propid: this.propertyid
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
    if (this.searchTerm_property != '') {
      this.propertiesListFromCP = this.copyPropertiesListFromCP.filter(project => {
        return project.property_name.toLowerCase().includes(this.searchTerm_property.toLowerCase());
      });
    } else {
      this.propertiesListFromCP = this.copyPropertiesListFromCP
    }
  }

  //here we get the selected city
  citychange(event) {
    if (this.isEdit) {
      this.editCityId = event.value.id;
      this.selectedLocalitiesOptions = [];
      this.editLocalitiesId = '';
      this.selectedPropertiesOptions = [];
      this.editPropertiesId = '';
    } else {
      this.selectedCityName = event.value.name;
      this.selectedcity = event.value.id;
      this.selectedcitiesOptions = event.value;
    }
    this.getLocalityByCityIdForAdd();
    this.getPropertiesList();
  }

  // here we get the list of localities by city id 
  getLocalitiesByCity() {
    this._sharedService.getLocalitiesBycity(this.selectedcity).subscribe((resp) => {
      if (resp.status == 'True') {
        this.localitiesList = resp.LocalityList;
        this.copyLocalitiesList = resp.LocalityList;
      }
    })
  }

  localitychange(event) {
    console.log(this.selectedLocalitiesOptions)
    if (this.isEdit) {
      let selectedIds = this.selectedLocalitiesOptions.map((local) => local.id);
      this.editLocalitiesId = selectedIds.join(',');
    } else {
      let selectedIds = this.selectedLocalitiesOptions.map((local) => local.id);
      this.selectedLocalities = selectedIds.join(',');
    }
    console.log(this.selectedLocalities)
    this.getPropertiesList();
  }

  //this is code for filter for active and inactive
  clientStatus(event) {
    this.selectedStatus = event;
    if (event == 'All') {
      this.router.navigate([], {
        queryParams: {
          status: ''
        },
        queryParamsHandling: 'merge',
      });
      this.statusFilter = false;
    } else if (event == 'Active') {
      this.router.navigate([], {
        queryParams: {
          status: 'Active'
        },
        queryParamsHandling: 'merge',
      });
    } else if (event == 'Inactive') {
      this.router.navigate([], {
        queryParams: {
          status: 'Inactive'
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  //Here the city filter will be removed 
  cityClose() {
    this.cityFilter = false;
    this.selectedcity = "";
    this.searchTerm_city = '';
    this.cities = this.copyOfCities;
    this.router.navigate([], {
      queryParams: {
        cityId: '',
        cityName: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  //Here the locality filter will be removed 
  localityClose() {
    this.localityFilter = false;
    this.selectedLocalityIds = "";
    this.selectedLocalityName = "";
    this.searchTerm_locality = '';
    this.localitiesList = [];
    this.router.navigate([], {
      queryParams: {
        localityId: '',
        localityName: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  //Here the property filter will be removed 
  propertyClose() {
    this.propertyFilter = false;
    this.propertyid = "";
    this.propertyname = "";
    this.searchTerm_property = '';
    this.propertiesList = [];
    this.router.navigate([], {
      queryParams: {
        propid: '',
        propName: ''
      },
      queryParamsHandling: 'merge',
    });
  }

  statusClose() {
    this.statusFilter = false;
    this.selectedStatus = "";
    this.router.navigate([], {
      queryParams: {
        status: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  refresh() {
    if(this.paidParam == 1){
      this.router.navigate(['client-list'], {
        queryParams: {
          paid: 1
        }
      })
    } else if(this.unpaidParam == 1){
      this.router.navigate(['client-list'], {
        queryParams: {
          unpaid: 1
        }
      })
    } else if(this.trailParam == 1){
      this.router.navigate(['client-list'], {
        queryParams: {
          trail: 1
        }
      })
    }
  }

  showall(i: number): void {
    $(`.popper${i}`).popover({
      html: true,
      content: function () {
        return $(`.popover_content_wrapper${i}`).html();
      }
    });
    $(`.popper${i}`).popover('show');
  }

  propShowall(i: number): void {
    $(`.propertypopper${i}`).popover({
      html: true,
      content: function () {
        return $(`.property_popover_content_wrapper${i}`).html();
      }
    });
    $(`.propertypopper${i}`).popover('show');
  }

  getLocalitiesList() {
    let param = {
      cityid: this.selectedcity
    }
    this._sharedService.getLocalityByCityForCp(param).subscribe((resp) => {
      console.log(resp);
      if (resp.status == 'true') {
        this.cpLocalityList = resp.data;
        this.copyCPLocalityList = resp.data;
      } else {
        this.cpLocalityList = [];
      }
    })
  }

  getPropertiesListBasedOnCP() {
    let param = {
      cityid: this.selectedcity,
      localityid: this.selectedLocalityIds
    }

    this._sharedService.getPropertiesByCityForCp(param).subscribe((resp) => {
      console.log(resp);
      if (resp.status == 'true') {
        this.propertiesListFromCP = resp.data;
        this.copyPropertiesListFromCP = resp.data;
      }
    })
  }

  getLocalityByCityIdForAdd() {
    let cityid = '';
    if (this.isEdit == true && this.editClientData) {
      cityid = this.editCityId;
    } else {
      cityid = this.selectedcity;
    }
    this._sharedService.getlocalityByCityId(cityid).subscribe((resp) => {
      console.log(resp);
      this.localitiesListForAdd = resp;
    })
  }

  statuschange(event) {
    this.clientstatusid = event.value;
  }

  closeEditModal() {
    this.isEdit = false;
    this.editCityId = '';
    this.editLocalitiesId = '';
    this.editPropertiesId = '';
  }

  // on click edit updated the modal data 
  editClient(client) {
    console.log(client)
    this.isEdit = true;
    this.editClientData = client;

    if (client.client_cityid || client.client_localityid) {
      this.editCityId = client.client_cityid;
      this.editLocalitiesId = client.client_localityid;
      this.editPropertiesId = client.client_propid;
      this._sharedService.getlocalityByCityId(client.client_cityid).subscribe((resp) => {
        this.localitiesListForAdd = resp;
      })

      let param = {
        city: client.client_cityid,
        locality: client.client_localityid
      }
      console.log(param)
      this._sharedService.getPropertyListForBuy(param).subscribe((resp) => {
        this.propertiesList = resp.data;
        this.copyPropertiesList = resp.data;
      })
    }

    // this.selectedLocalities = client.client_localityid;

    // if (this.selectedcity) {
    //   this.getLocalityByCityIdForAdd();
    //   this.getPropertiesList();
    // }

    setTimeout(() => {
      $('#edit_client_company_name').val(client.company_name);

      $('#edit_client_name').val(client.client_name);

      $('#edit_client_mobile').val(client.client_number);

      $('#edit_client_email').val(client.client_email);

      let city = this.cities.filter((city) => city.id == client.client_cityid);
      this.selectedcitiesOptions = city[0];

      setTimeout(() => {
        let localities = this.localitiesListForAdd.filter((loc) =>
          client.client_locality.some((sel) => loc.id == sel.locality_id));
        this.selectedLocalitiesOptions = localities;

        let properties = this.propertiesList.filter((prop) =>
          client.client_property.some((pop) => prop.PropertyID == pop.property_id));
        this.selectedPropertiesOptions = properties;

      }, 600)

      let clientStat = this.packList.filter((pac) => pac.value == client.client_useagestatus);
      this.clientPack = clientStat[0];

      let clientactivestatus = this.clientStatusList.filter((act) => act.value == client.client_status);
      this.clientstatusid = clientactivestatus[0];
    }, 100)
  }

  // updation of client data 
  UpdateClient() {
    console.log('updated', this.selectedLocalityIds)
    if ($('#edit_client_company_name').val().trim() == '' || $('#edit_client_company_name').val().trim() == undefined) {
      $('#edit_client_company_name').focus().css('border-color', 'red').attr('Please Enter the Company Name');
      return false;
    } else {
      $('#edit_client_company_name').removeAttr("style");
    }

    if ($('#edit_client_name').val().trim() == '' || $('#edit_client_name').val().trim() == undefined) {
      $('#edit_client_name').focus().css('border-color', 'red').attr('Please Enter the Name');
      return false;
    } else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#client_name').val())) {
        $('#edit_client_name').removeAttr("style");
      }
    }

    if ($('#edit_client_mobile').val().trim() == '' || $('#edit_client_mobile').val().trim() == undefined) {
      $('#edit_client_mobile').focus().css('border-color', 'red').attr('Please Enter the Number');
      return false;
    } else {
      var mobilee = /^[0-9]{10}$/;
      if (mobilee.test($('#edit_client_mobile').val())) {
        $('#edit_client_mobile').removeAttr('style');
      } else {
        $('#edit_client_mobile').focus().css('border-color', 'red').attr('placeholder', 'Please enter valid contact number').val('');
        return false;
      }
    }

    if ($('#edit_client_email').val().trim() == '' || $('#edit_client_email').val().trim() == undefined) {
      $('#edit_client_email').focus().css('border-color', 'red').attr('Please Enter the Mail');
      return false;
    } else {
      var email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
      if (email.test($('#edit_client_email').val())) {
        $('#custmail').removeAttr("style");
      }
      else {
        $('#edit_client_email').focus().css("border-color", "red").attr('placeholder', 'Please enter valid email-id').val('');
        return false;
      }
    };

    if (this.editCityId == '' || this.editCityId == undefined || this.editCityId == null) {
      swal({
        title: 'City Selection',
        text: 'Please Select the City',
        type: 'warning',
        timer: 2000,
        showConfirmbutton: false
      })
    }

    if (this.clientPack == '' || this.clientPack == undefined || this.clientPack == null) {
      swal({
        title: 'Client Type',
        text: 'Please Select the Pack',
        type: 'warning',
        timer: 2000,
        showConfirmbutton: false
      })
    }

    this.filterLoader = true;
    const formData = new FormData();
    formData.append('client_id', this.editClientData.client_id);
    formData.append('company_name', $('#edit_client_company_name').val());
    formData.append('client_name', $('#edit_client_name').val());
    formData.append('client_number', $('#edit_client_mobile').val());
    formData.append('client_email', $('#edit_client_email').val());
    formData.append('client_cityId', this.editCityId);
    formData.append('client_locality', this.editLocalitiesId?this.editLocalitiesId:'');
    formData.append('client_property', this.editPropertiesId?this.editPropertiesId:'');
    formData.append('client_useagestatus', this.clientPack.value);
    formData.append('active_status', this.clientstatusid.value);

    console.log(formData)
    this._sharedService.updateCPClient(formData).subscribe((resp) => {
      console.log(resp)
      // if (resp['status'] == 'True') {
        this.filterLoader = false;
        swal({
          title: 'CP Client Updation',
          text: 'Client Updated Successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.isEdit = false;
          $('#clientModalCloase').click();
          $('.modal-backdrop').closest('div').remove();
          document.body.classList.remove('modal-open');
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        });
      // }
    })
  }

}