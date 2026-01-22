import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { retailservice } from '../../retail.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { P } from '@angular/core/src/render3';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-registrationdata',
  templateUrl: './registrationdata.component.html',
  styleUrls: ['./registrationdata.component.css']
})
export class RegistrationdataComponent implements OnInit {

  filterLoader: boolean = true;

  constructor(private _mandateService: mandateservice, private route: ActivatedRoute, private _retailService: retailservice, private _sharedService: sharedservice, public datepipe: DatePipe, private router: Router,) {
    if (localStorage.getItem('Role') != '1' && localStorage.getItem('Role') != '2') {
      this.router.navigateByUrl('/login');
    }
  }

  registrations: any;
  static count: number;
  registrationcounts: any;
  today = new Date();
  toDate: string = '';
  dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0');
  yyyy = this.today.getFullYear();
  date = this.yyyy + '-' + this.mm + '-' + this.dd;
  beginingdate = this.yyyy + '-' + this.mm + '-' + "01";
  dateRange: Date[];
  fromdate: any;
  todate: any;
  @ViewChild('datepicker') datepickerreceived: ElementRef;
  currentdateforcompare = new Date();
  datefilterview: boolean = false;
  userid: any;
  selectedTeamType: any;
  selectedMandateProp: any;
  reassignListExecutives: any;
  mandateprojects: any;
  selectedEXEC: any;
  randomCheckVal: any = '';
  selectedReassignTeam: any;
  selectedExecIds: any;
  selectedAssignedleads: any;
  choosedReAssignLeads: any;
  selectedEXECUTIVES: any;
  selectedEXECUTIVEIDS: any;
  reassignedResponseInfo: any;
  maxSelectedLabels: number = Infinity;
  team: any;
  copyofproperties: any;
  addedpropertylists: any;
  searchTerm: any;
  propertyName: any;
  propertyFilter: boolean = false;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  executivesList: any;
  copyOfExecutivesList: any;
  executiveFilter: boolean = false;
  execid: any;
  execname: any;
  searchExec: string = '';
  registrationStart: moment.Moment | null = null;
  registrationOnEnd: moment.Moment | null = null;

  ngOnInit() {
    this.userid = localStorage.getItem('UserId');

    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.getleads();
    this.getAllProperties();
    this.getExecutiveList();
    RegistrationdataComponent.count = 0;
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeRegistrationDateRangePicker();
    }, 0);
  }

  //here we get the list of properties
  getAllProperties() {
    this._retailService
      .propertylistnew()
      .subscribe(proplist => {
        this.addedpropertylists = proplist;
        this.copyofproperties = proplist;
      });
  }

  getExecutiveList() {
    this._sharedService.getexecutiveslist('', '', '','','').subscribe((exec) => {
      this.executivesList = exec;
      this.copyOfExecutivesList = exec;
    })
  }

  //here we get the data throght router params and enable/disable the filters
  getleads() {
    RegistrationdataComponent.count = 0;
    this.route.queryParams.subscribe((params) => {
      this.filterLoader = true;
      this.fromdate = params['from'];
      this.todate = params['to'];
      this.propertyName = params['propname'];
      this.execid = params['execid'];
      this.execname = params['execname'];

      setTimeout(() => {
        this.initializeRegistrationDateRangePicker();
      }, 0)

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.fromdate = '';
        this.todate = '';
        this.datefilterview = false;
      } else {
        this.datefilterview = true;
      }

      if (this.propertyName == null || this.propertyName == undefined || this.propertyName == '') {
        this.propertyFilter = false;
        this.propertyName = '';
      } else {
        this.propertyFilter = true;
      }

      if (this.execid == null || this.execid == undefined || this.execid == '') {
        this.executiveFilter = false;
        this.execid = '';
        this.execname = '';
      } else {
        this.executiveFilter = true;
      }

      this.getRegistrationData();
    })
  }

  //here we get the list of registration data and counts
  getRegistrationData() {
    var limitparam = 0;
    var limitrows = 30;
    this._sharedService.getregistrationlist(limitparam, limitrows, this.fromdate, this.todate, this.propertyName, this.execid).subscribe(regs => {
      this.registrations = regs;
      this.filterLoader = false;
    })
    this._sharedService.getregistrationlistcounts(this.fromdate, this.todate, this.propertyName, this.execid).subscribe(regscount => {
      this.registrationcounts = regscount[0].registrationcounts;
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

  //here we get the from and to dates from the calendar.
  onDateRangeSelected(range: Date[]): void {
    this.dateRange = range;
    // Convert the first date of the range to yyyy-mm-dd format
    if (this.dateRange != null) {
      let formattedFromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
      let formattedToDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
      if ((formattedFromDate != '' && formattedFromDate != undefined && formattedFromDate != null) && (formattedToDate != '' && formattedToDate != undefined && formattedToDate != null)) {
        this.datefilterview = true;
        this.fromdate = formattedFromDate;
        this.todate = formattedToDate;

        this.router.navigate([], {
          queryParams: {
            from: this.fromdate,
            to: this.todate
          }, queryParamsHandling: 'merge'
        })
      } else {
        this.datefilterview = false;
      }
    }
  }

  //here we reset the date filter
  dateclose() {
    RegistrationdataComponent.count = 0;
    this.fromdate = '';
    this.todate = '';
    this.router.navigate([], {
      queryParams: {
        from: '',
        to: ''
      }, queryParamsHandling: 'merge'
    });
  }

  //here we reset the property filter
  propertyclose() {
    RegistrationdataComponent.count = 0;
    this.propertyName = '';
    this.searchTerm = '';
    this.addedpropertylists = this.copyofproperties;
    this.router.navigate([], {
      queryParams: {
        propname: ''
      }, queryParamsHandling: 'merge'
    });
  }

  executiveclose() {
    RegistrationdataComponent.count = 0;
    this.execid = '';
    this.execname = '';
    this.searchExec = '';
    this.executivesList = this.copyOfExecutivesList;
    this.router.navigate([], {
      queryParams: {
        execid: '',
        execname: ''
      }, queryParamsHandling: 'merge'
    });
  }

  //here we reset the date and property filter.
  refresh() {
    this.fromdate = '';
    this.todate = '';
    this.execid = '';
    this.execname = '';
    this.datefilterview = false;
    this.propertyFilter = false;
    this.executiveFilter = false;
    this.dateRange = null;
    this.propertyName = '';
    this.propertyclose();
    this.executiveclose();
    this.router.navigate([], {
      queryParams: {
        from: '',
        to: '',
        propname: '',
        execid: '',
        execname: ''
      }
    })
  }

  //load more leads based on the user scrolls
  loadMore() {
    const counts = this.registrationcounts;
    const limit = RegistrationdataComponent.count += 30;
    let limitrows = 30;
    let livecount = this.registrations.length;
    if (livecount <= counts) {
      return this._sharedService.getregistrationlist(limit, limitrows, this.fromdate, this.todate, this.propertyName, this.execid).subscribe(regs => {
        this.registrations = this.registrations.concat(regs);
      })
    }
  }

  //here we get the selected property.
  onCheckboxChange(property) {
    RegistrationdataComponent.count = 0;
    this.propertyFilter = true;
    this.router.navigate([], {
      queryParams: {
        propname: property.name,
      },
      queryParamsHandling: 'merge',
    });
  }

  // Filter property based on search 
  filterProjects(): void {
    if (this.searchTerm != '') {
      this.addedpropertylists = this.copyofproperties.filter(project =>
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.addedpropertylists = this.copyofproperties;
    }

  }

  //here we get the selected property.
  onCheckExecutiveChange(exec) {
    RegistrationdataComponent.count = 0;
    this.executiveFilter = true;
    this.router.navigate([], {
      queryParams: {
        execid: exec.ID,
        execname: exec.Name,
      },
      queryParamsHandling: 'merge',
    });
  }

  // Filter executive based on search 
  filterExecutives(): void {
    if (this.searchExec != '') {
      this.executivesList = this.copyOfExecutivesList.filter(exec =>
        exec.Name.toLowerCase().includes(this.searchExec.toLowerCase())
      );
    } else {
      this.executivesList = this.copyOfExecutivesList;
    }
  }

  //on clicking on back  in assign leads pop up we reset the dropdowns.
  backToMain() {
    $('#leadcount_dropdown').dropdown('clear');
    $('#team_dropdown').dropdown('clear');
    $('#property_dropdown').dropdown('clear');
    $('#retail_dropdown').dropdown('clear');
    $('#mandateExec_dropdown').dropdown('clear');
    $('#retailExec_dropdown').dropdown('clear');
    this.selectedMandateProp = '';
    this.randomCheckVal = '';
    this.selectedEXEC = [];
    this.selectedEXECUTIVEIDS = [];
    this.selectedEXECUTIVES = [];
    this.selectedExecIds = [];
    this.maxSelectedLabels = Infinity;
  }

  assignLead(){
    $('#leadcount_dropdown').dropdown('clear');
    $('#property_dropdown').dropdown('clear');
    $('#retail_dropdown').dropdown('clear');
    $('#mandateExec_dropdown').dropdown('clear');
    
    this.selectedTeamType = 'mandate';
    this.mandateprojectsfetch();
    this.selectedMandateProp = '16793';
    this._mandateService.fetchmandateexecutuves(16793, '', '','').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.reassignListExecutives = executives['mandateexecutives'];
      }
    });
  }

  //here we get the selected assigned team
  reassignTeam(event) {
    this.selectedTeamType = event.target.value;
    this.selectedMandateProp = '';
    this.reassignListExecutives = [];
    if (this.selectedTeamType == 'mandate') {
      this.mandateprojectsfetch();
      this.selectedMandateProp = '16793';
      this._mandateService.fetchmandateexecutuves(16793, '','','').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.reassignListExecutives = executives['mandateexecutives'];
        }
      });
    } else if (this.selectedTeamType == 'retail') {
      this._retailService.getRetailExecutives('', '').subscribe(execute => {
        this.reassignListExecutives = execute['DashboardCounts'];
      })
    }
    $('#mandate_dropdown').dropdown('clear');
    // $('#retail_dropdown').dropdown('clear');
    $('#mandateExec_dropdown').dropdown('clear');
    $('#retailExec_dropdown').dropdown('clear');
    $('#property_dropdown').dropdown('clear');
  }

  //here we fetch the mandate projects
  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
      }
    });
  }

  //here on clicking random assign the leads will be divided equally assigned 
  checkRandom(event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked == true) {
      this.selectedEXEC = [];
      this.randomCheckVal = 1;
    } else {
      this.selectedEXEC = [];
    }
  }

  //here we get the selected reassign mandate property
  reassignPropChange(event) {
    if (this.selectedTeamType == 'mandate') {
      this.selectedMandateProp = event.target.value;
      this._mandateService.fetchmandateexecutuves(this.selectedMandateProp, '','','').subscribe(executives => {
        if (executives['status'] == 'True') {
          this.reassignListExecutives = executives['mandateexecutives'];
        }
      });
    }
  }

  //heree we get the selected assign executive team type
  reassignExecTeam(event) {
    let roleTeam = event.target.options[event.target.options.selectedIndex].value;
    this._mandateService.fetchmandateexecutuves(this.selectedMandateProp,'', roleTeam,'').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.reassignListExecutives = executives['mandateexecutives'];
      }
    });
    // if (event.target.options[event.target.options.selectedIndex].value == '50010' || event.target.options[event.target.options.selectedIndex].value == '50004') {
    //   const teamid = event.target.options[event.target.options.selectedIndex].value;
    //   this._retailService.getRetailExecutives(teamid, '').subscribe(execute => {
    //     this.reassignListExecutives = execute['DashboardCounts'];
    //   })
    // } else {
    //   this._retailService.getRetailExecutives('', '').subscribe(execute => {
    //     this.reassignListExecutives = execute['DashboardCounts'];
    //   })
    // }
    $('#mandateExec_dropdown').dropdown('clear');
    $('#retailExec_dropdown').dropdown('clear');
  }

  //here we get th list of selected rmid's
  reAssignexecutiveSelect(event) {
    // if (this.selectedTeamType == 'mandate') {
      this.selectedEXECUTIVEIDS = this.selectedEXECUTIVES.map((exec) => exec.id);
      if (this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
        $('#customSwitch5').prop('checked', true);
        this.randomCheckVal = 1;
      } else {
        $('#customSwitch5').prop('checked', false);
        this.randomCheckVal = '';
      }
    // } else if (this.selectedTeamType == 'retail') {
    //   this.selectedEXECUTIVEIDS = this.selectedEXECUTIVES.map((exec) => exec.ExecId);
    //   if (this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
    //     $('#customSwitch5').prop('checked', true);
    //     this.randomCheckVal = 1;
    //   } else {
    //     $('#customSwitch5').prop('checked', false);
    //     this.randomCheckVal = '';
    //   }
    // }
  }

  //here we get the select counts of leads for retail
  selectcounts(event) {
    if (event.target.value > 30) {
      this.getReassignLeadsData(parseInt(event.target.value));
    } else {
      $('#start2 tr td :checkbox').each(function () {
        this.checked = false;
      });
      var checkBoxes = $("#start2 tr td :checkbox:lt(" + event.target.value + ")");
      $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));

      if (event.target.value == 'Manual') {
        $('input[id="hidecheckboxid"]').attr("disabled", false);
        $('.hidecheckbox').show();
        this.getselectedleads();
      } else {
        $('.hidecheckbox').hide();
        $('input[id="hidecheckboxid"]:checked').show();
        $('input[id="hidecheckboxid"]:checked').attr("disabled", true);
        this.getselectedleads();
      }
    }
  }

  getselectedleads() {
    var checkid = $("input[name='programming']:checked").map(function () {
      return this.value;
    }).get().join(',');
    this.selectedAssignedleads = checkid;
    if (this.selectedAssignedleads != '') {
      var arraylist = this.selectedAssignedleads.split(',');
      this.maxSelectedLabels = arraylist.length;
    }
    if (this.selectedEXECUTIVES && this.selectedEXECUTIVES.length > 1 && this.maxSelectedLabels > 1) {
      $('#customSwitch5').prop('checked', true);
      this.randomCheckVal = 1;
    } else {
      $('#customSwitch5').prop('checked', false);
      this.randomCheckVal = '';
    }
  }

  //here we are reassinging the leads now
  getAssignedLeadsList() {
    if (this.selectedAssignedleads == undefined || this.selectedAssignedleads == "") {
      swal({
        title: 'Please Select Some Leads!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    } else {
      $('#selectedleads').removeAttr("style");
      this.filterLoader = true;
    }

    if (this.selectedTeamType == 'mandate' && this.selectedMandateProp == '') {
      $('#property_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Property');
      swal({
        title: 'Please Select Property!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    } else {
      $('#property_dropdown').removeAttr("style");
      this.filterLoader = true;
    }


    if (this.selectedEXECUTIVES == undefined || this.selectedEXECUTIVES.length == 0) {
      $('#mandateExec_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Executives');
      $('#retailExec_dropdown').focus().css("border-color", "red").attr('placeholder', 'Select Executives');
      swal({
        title: 'Please Select The Executive!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    } else {
      $('#mandateExec_dropdown').removeAttr("style");
      $('#retailExec_dropdown').removeAttr("style");
      this.filterLoader = true;
    }
    //here its a array of  lead ids converting it to a single value  as comma seperated.
    let comma_separated_data = this.selectedEXECUTIVEIDS.join(',');
    let param = {
      assignedleads: this.selectedAssignedleads,
      customersupport: comma_separated_data,
      propId: this.selectedMandateProp,
      randomval: this.randomCheckVal,
      loginid: this.userid
    }
    // if (this.selectedTeamType == 'mandate') {
    this.filterLoader = true;
      this._mandateService.leadreassign(param).subscribe((success) => {
        this.filterLoader = false;
        if (success.status == "True") {
          $('#closereassignmodal').click();
          swal({
            title: 'Assigned Successfully',
            type: 'success',
            confirmButtonText: 'Show Details'
          }).then(() => {
            this.reassignedResponseInfo = success['assignedleads'];
            $('#reassign_leads_detail').click();
          })
          $('#statuslist_dropdown').dropdown('clear');
          $('#followup_dropdown').dropdown('clear');
          $('#exec_designation').dropdown('clear');
          $('#exec_dropdown').dropdown('clear');
          $('#leadcount_dropdown').dropdown('clear');
          $('#team_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          $('#mandate_dropdown').dropdown('clear');
          $('#retail_dropdown').dropdown('clear');
          $('#mandateExec_dropdown').dropdown('clear');
          $('#retailExec_dropdown').dropdown('clear');
          this.selectedMandateProp = '';
          this.randomCheckVal = '';
          this.selectedEXEC = [];
          this.selectedEXECUTIVEIDS = [];
          this.selectedEXECUTIVES = [];
          this.selectedExecIds = [];
          this.maxSelectedLabels = Infinity;
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
    // } else if (this.selectedTeamType == 'retail') {
    //   this._retailService.leadreassign(param).subscribe((success) => {
    //     this.filterLoader = false;
    //     if (success.status == "True") {
    //       $('#closereassignmodal').click();
    //       swal({
    //         title: 'Assigned Successfully',
    //         type: 'success',
    //         confirmButtonText: 'Show Details'
    //       }).then(() => {
    //         this.reassignedResponseInfo = success['assignedleads'];
    //         $('#reassign_leads_detail').click();
    //       })
    //       $('#statuslist_dropdown').dropdown('clear');
    //       $('#followup_dropdown').dropdown('clear');
    //       $('#exec_designation').dropdown('clear');
    //       $('#exec_dropdown').dropdown('clear');
    //       $('#leadcount_dropdown').dropdown('clear');
    //       $('#team_dropdown').dropdown('clear');
    //       $('#property_dropdown').dropdown('clear');
    //       $('#mandate_dropdown').dropdown('clear');
    //       $('#retail_dropdown').dropdown('clear');
    //       $('#mandateExec_dropdown').dropdown('clear');
    //       $('#retailExec_dropdown').dropdown('clear');
    //       this.selectedMandateProp = '';
    //       this.randomCheckVal = '';
    //       this.selectedEXEC = [];
    //       this.selectedEXECUTIVEIDS = [];
    //       this.selectedEXECUTIVES = [];
    //       this.selectedExecIds = [];
    //       this.maxSelectedLabels = Infinity;
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

  getReassignLeadsData(limitR) {
    this.registrations = [];
    this._sharedService.getregistrationlist(0, limitR, this.fromdate, this.todate, this.propertyName, this.execid).subscribe(regs => {
      this.registrations = regs;
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
          this.getselectedleads();
        } else {
          $('.hidecheckbox').hide();
          $('input[id="hidecheckboxid"]:checked').show();
          $('input[id="hidecheckboxid"]:checked').attr("disabled", true);
          this.getselectedleads();
        }
      }, 500)
    })
  }

  //here we get the datepicker for Assigned on filter
  initializeRegistrationDateRangePicker() {
    const cb = (start: moment.Moment, end: moment.Moment) => {
      if (start && end) {
        $('#registrationDates span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
          end = end.endOf('day');
          $(this).data('daterangepicker').setEndDate(end);
        }
      } else {
        $('#registrationDates span').html('Select Date Range');
      }

      if (start && end) {
        this.fromdate = start.format('YYYY-MM-DD');
        this.todate = end.format('YYYY-MM-DD');
        this.datefilterview = true;
        this.router.navigate([], {
          queryParams: {
            from: this.fromdate,
            to: this.todate
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
    const fromTime = urlParams.get('fromtime');
    const toTime = urlParams.get('totime');
    // Initialize start and end dates based on URL parameters or default values
    let startDate = fromDate ? moment(fromDate) : moment().startOf('day');
    let endDate = toDate ? moment(toDate) : moment().endOf('day');

    if (fromTime && fromDate) {
      startDate = moment(fromDate + ' ' + fromTime, 'YYYY-MM-DD');
    }

    if (toTime && toDate) {
      endDate = moment(toDate + ' ' + toTime, 'YYYY-MM-DD');
    }

    $('#registrationDates').daterangepicker({
      startDate: startDate || moment().startOf('day'),
      endDate: endDate || moment().startOf('day'),
      showDropdowns: false,
      maxDate: new Date(),
      timePicker: false,
      timePickerIncrement: 1,
      locale: {
        format: 'MMMM D, YYYY h:mm A'
      },
      autoApply: true,
    }, cb);
    cb(this.registrationStart, this.registrationOnEnd);
  }
}
