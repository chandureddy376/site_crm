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
  selector: 'app-cp-dedicated-leads',
  templateUrl: './cp-dedicated-leads.component.html',
  styleUrls: ['./cp-dedicated-leads.component.css']
})
export class CpDedicatedLeadsComponent implements OnInit {

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

  enquiries: any;
  static count: number;
  enquiryCount: number = 0;
  filterLoader: boolean = true;
  status: any;
  executives: any;
  leadforwards = new leadforward();
  propertyid: any = '';
  selectedEXEC: any[] = [];
  selectedExecIds: number[] = [];
  showSelectAll: boolean = false;
  userid: any;
  leads: any;
  sourcelist: any;
  searchTerm: string = '';
  source: any;
  propertyList: any;
  copyofpropertyList: any;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  previousMonthDateForCompare: any;
  executivesList: any;
  assigneeTeam: any;
  duplicateLeadsInfo: any;
  mandateprojects: any;
  copyOfSource: any;
  searchTerm_source: string = '';
  selectedLocality: any;
  selectedLocalityName: any;
  sourceFilter: boolean = false;
  localityFilter: boolean = false;
  propertyFilter: boolean = false;
  dateRange: Date[];
  fromdate: any;
  datefilterview: boolean = false;
  todate: any;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @ViewChild('cancel') cancel: ElementRef;
  selectedlocality: any;
  locality: any;
  copyOfLocality: any;
  roleid: any;
  searchTerm_locality: string = '';
  nextActionStart: moment.Moment | null = null;
  nextActionEnd: moment.Moment | null = null;
  clientList: any;
  selectedRetailLeads: any;
  selectedJunkReason: any;
  selectedJunkReasonId: any;
  junkReasonList: any;
  @ViewChild('junkReason') junkReason: ElementRef;

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
    this.getSourceList();
    this.getlocalitylist();
    this.getJunkReasonList();
    if (localStorage.getItem('Role') != '2') {
      this.router.navigateByUrl('/login');
    }
    CpDedicatedLeadsComponent.count = 0;
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
      this.resetScroll();
    }, 0);
  }

  getSourceList() {
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

  getJunkReasonList() {
      let param = {
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      localityid: this.selectedLocality,
      propname: this.propertyid
    }

    this._sharedservice.getJunkReason(param).subscribe((resp) => {
      if (resp.result == 'True') {
        this.junkReasonList = resp['Junk_Category'];
      }
    })
  }

  getleadsData() {
    this.route.queryParams.subscribe((response) => {
      this.filterLoader = true;
      this.propertyid = response['property'];
      this.selectedLocality = response['localityId'];
      this.selectedLocalityName = response['localityName'];
      this.fromdate = response['from'];
      this.todate = response['to'];
      this.selectedLocality = response['localityId'];
      this.selectedLocalityName = response['localityName'];
      this.source = response['source'];
      this.selectedJunkReason = response['junkreason'];
      this.selectedJunkReasonId = response['junkReasonId'];
      this.selectedJunkReason = response['junkreason'];
      this.selectedJunkReasonId = response['junkReasonId'];
      this.resetScroll();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0)

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
      } else {
        this.datefilterview = true;
      }

      if (this.source == undefined || this.source == null || this.source == '') {
        this.sourceFilter = false;
      } else {
        this.sourceFilter = true;
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
      this.getJunkReasonList();
      this.getProperties();
      this.getEnquiriesCount();
      this.getenquiries();
    })
  }

  //get list properties for filter
  getProperties() {
    let param = {
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      localityid: this.selectedLocality,
      reason: this.selectedJunkReasonId
    }
    this._sharedservice.getCPDedicatedProperties(param).subscribe(prop => {
      if (prop.status == 'True') {
        this.propertyList = prop['property_list'];
        this.copyofpropertyList = prop['property_list'];
      }
    })
  }

  // ENQUIRY-VIEW-FROM-DB  for fresh leads data 
  getenquiries() {
    CpDedicatedLeadsComponent.count = 0;
    $(".pendingLeads_section").removeClass("active");
    $(".freshLeads_section").addClass("active");
    let param = {
      limitparam: 0,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      localityid: this.selectedLocality,
      propname: this.propertyid,
      reason: this.selectedJunkReasonId
    }
    this._sharedservice.getCpDedicatedLeads(param).subscribe((resp) => {
      this.filterLoader = false;
      if(resp.status == 'True'){
        this.enquiries = resp['reuseJunk'];
      } else {
        this.enquiries = [];
      }
    })
  }

  //here we get the count of fresh and pending leads count
  getEnquiriesCount() {
    this.enquiryCount = 0;
    let param = {
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      localityid: this.selectedLocality,
      propname: this.propertyid,
      reason: this.selectedJunkReasonId
    }
    this._sharedservice.getCpDedicatedLeadsCount(param).subscribe(enquirys => {
      this.enquiryCount = enquirys.Total_Count.Lead_Count;
    })
  }

  //source selection  filter
  onCheckboxChangesource(source) {
    CpDedicatedLeadsComponent.count = 0;
    if (source != '' || source != undefined || source != null) {
      this.source = source;
      this.router.navigate([], {
        queryParams: {
          source: this.source,
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
      this.sourcelist = this.copyOfSource.filter(sou =>
        sou.source.toLowerCase().includes(this.searchTerm_source.toLowerCase())
      );
    } else {
      this.sourcelist = this.copyOfSource
    }
  }

  //locality selection  filter
  onCheckboxChangeLocality(local) {
    CpDedicatedLeadsComponent.count = 0;
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

  selectSuggestedJunkReason(reason) {
    var checkid = $("input[name='programming1']:checked").map(function () {
      return this.value;
    }).get().join(',');

    this.selectedJunkReason = reason.Junk_Category;
    this.selectedJunkReasonId = reason.Junk_IDPK;
    if (this.selectedJunkReason) {
      this.router.navigate(['/cp-dedicated-leads'], {
        queryParams: {
          junkreason: this.selectedJunkReason,
          junkReasonId: this.selectedJunkReasonId
        },
        queryParamsHandling: 'merge'
      });
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
    this.router.navigate(['/cp-dedicated-leads'], {
      queryParams: {
        property: this.propertyid
      },
      queryParamsHandling: 'merge'
    })

  }

  //Filter projects based on search param
  filterProjects(): void {
    if (this.searchTerm != '') {
      this.propertyList = this.copyofpropertyList.filter(project => {
        const propertyName = project.Property ? project.Property.toLowerCase() : '';
        return propertyName.includes(this.searchTerm.toLowerCase());
      });
    } else {
      this.propertyList = this.copyofpropertyList
    }
  }

  //on scroll fresh leads, pending and retail assign leads table to load the leads data
  loadMore() {
    let param = {
      limitparam: CpDedicatedLeadsComponent.count += 30,
      limitrows: 30,
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      count: null,
      propname: this.propertyid,
      reason: this.selectedJunkReasonId
    }
    let livecount = this.enquiries.length;
    if (livecount < this.enquiryCount) {
      this.filterLoader = true
      return this._sharedservice.getCpDedicatedLeads(param).subscribe(enquirys => {
        this.filterLoader = false;
        this.enquiries = this.enquiries.concat(enquirys['reuseJunk']);
        this.cdRef.detectChanges();
      })
    }
  }

  //here we remove the property filter
  propertyclose() {
    $('#project_dropdown').dropdown('clear');
    $("input[name='propFilter']").prop("checked", false);
    this.propertyFilter = false;
    CpDedicatedLeadsComponent.count = 0;
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

  sourceClose() {
    this.sourceFilter = false;
    CpDedicatedLeadsComponent.count = 0;
    this.source = "";
    this.searchTerm_source = '';
    this.source = this.copyOfLocality;
    this.router.navigate([], {
      queryParams: {
        source: '',
      },
      queryParamsHandling: 'merge',
    })
  }

  localityClose() {
    this.localityFilter = false;
    CpDedicatedLeadsComponent.count = 0;
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

  //this method refreshes /reset the page 
  refresh() {
    this.source = '';
    this.propertyid = '';
    this.searchTerm = '';
    this.fromdate = '';
    this.todate = '';
    this.searchTerm_locality = '';
    this.searchTerm_source = '';
    this.selectedLocality = '';
    this.selectedLocalityName = '';
    this.selectedJunkReason = '';
    this.selectedJunkReasonId = '';
    this.datefilterview = false;
    this.localityFilter = false;
    this.sourceFilter = false;
    this.filterProjects();

    this.router.navigate(['/cp-dedicated-leads'], {
      queryParams: {
        from: '',
        to: '',
        source: '',
        localityId: '',
        localityName: '',
        property: ''
      }
    });
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
    this.router.navigate(['/cp-dedicated-leads'], {
      queryParams: {
        localityId: '',
        localityName: '',
        property: this.propertyid
      }
    });
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

  getlocalitylist() {
    this._sharedservice.getlocalityByCityId('1').subscribe(localities => {
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
  // getexecutives(event) {
  //   let id = event.target.options[event.target.options.selectedIndex].value;
  //   if (id == '50010') {
  //   } else if (id == '50004') {
  //   } else {
  //     id = ''
  //   }
  //   this._retailService.getRetailExecutives(id, '').subscribe(execute => {
  //     this.executives = execute['DashboardCounts'];
  //   })
  // }

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
    this.getClientList();
  }

  //to get all the mandate executive based on the team id
  getClientList() {
    this._sharedservice.getCPClientList('1').subscribe((resp) => {
      this.clientList = resp['CP_List'];
    })
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
    let param = {
      client: this.selectedExecIds.join(','),
      assignedleads: this.leadforwards.assignedleads,
      type: 'junk'
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
        const propertyName = project.Property ? project.Property.toLowerCase() : '';
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
    let param = {
      limitparam: 0,
      limitrows: limitR,
      from: this.fromdate,
      to: this.todate,
      source: this.source,
      count: null,
      propname: this.propertyid
    }

    this.filterLoader = true
    return this._sharedservice.getenquirylist(param).subscribe(enquirys => {
      this.filterLoader = false;
      this.enquiries = this.enquiries.concat(enquirys['reuseJunk']);
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

  scrollLeft() {
    const list = this.junkReason.nativeElement;
    list.scrollBy({
      left: -600,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    const list = this.junkReason.nativeElement;
    list.scrollBy({
      left: 600,
      behavior: 'smooth'
    });
  }
}
