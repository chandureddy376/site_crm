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
  selector: 'app-enq-camp-leads',
  templateUrl: './enq-camp-leads.component.html',
  styleUrls: ['./enq-camp-leads.component.css']
})
export class EnqCampLeadsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private _sharedService: sharedservice,
    private _mandateService: mandateservice,
    private _retailService: retailservice,
    public datepipe: DatePipe,
    private router: Router
  ) { }

  vsnapparam: any;
  sitecrmparam: any;
  freshparam: any;
  pendingparam: any;
  quafiliedparam: any;
  notqualifiedparam: any;
  callbackparam: any;
  numberbusyparam: any;
  rnrparam: any;
  switchoffparam: any;
  enquiriesList: any
  filterLoader: boolean = true;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  roleid: any;
  userid: any;
  datefilterview: boolean = false;
  dateRange: Date[];
  fromdate: any;
  todate: any
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
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
  followupsections: any;
  selectedFollowupLeadId: any = '';
  followupname: any = '';
  followupid: any = '';
  status: any;
  static count: number = 0;

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.followupsections = [
      { name: 'Callback', value: '4' },
      { name: 'Number Busy', value: '5' },
      { name: 'RNR', value: '6' },
      { name: 'Switch Off', value: '7' }
    ]

    this.getLeadsData();
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

  //here get the params based refresh
  getLeadsData() {
    this.route.queryParams.subscribe((params) => {
      this.sitecrmparam = params['sitecrm'];
      this.vsnapparam = params['vsnap'];
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

      this.resetScroll();
      setTimeout(() => {
        this.initializeNextActionDateRangePicker();
      }, 0)

      if ((this.fromdate == '' || this.fromdate == undefined || this.fromdate == null) || (this.todate == '' || this.todate == undefined || this.todate == null)) {
        this.datefilterview = false;
      } else {
        this.datefilterview = true;
      }

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

      if (this.vsnapparam == 1) {
        this.getVsnapCouts();
        this.getVsnapLeads();
      } else if (this.sitecrmparam == 1) {
        this.getSitecrmCouts();
        this.getSitecrmLeads();
      }

    })
  }

  getVsnapCouts() {
    EnqCampLeadsComponent.count = 0;
    let param = {
      fromdate: this.fromdate,
      todate: this.todate,
      count: 1
    }
    this._sharedService.getVsnapCountsLeads(param).subscribe((enquiryscount) => {
      if (enquiryscount.status == 'true') {
        this.freshLeadsCount = enquiryscount['counts'].freshcount;
        this.pendingLeadsCount = enquiryscount['counts'].pendingcount;
        this.qualifiedLeadsCount = enquiryscount['counts'].qualified;
        this.notqualifiedLeadsCount = enquiryscount['counts'].unqualified;
        this.callbackLeadsCount = enquiryscount['counts'].callback,
          this.numberbusyLeadsCount = enquiryscount['counts'].numberbusy,
          this.rnrLeadsCount = enquiryscount['counts'].rnr,
          this.switchoffLeadsCount = enquiryscount['counts'].switchoff
      } else {
        this.freshLeadsCount = 0;
        this.pendingLeadsCount = 0;
        this.qualifiedLeadsCount = 0;
        this.notqualifiedLeadsCount = 0;
        this.callbackLeadsCount = 0,
          this.numberbusyLeadsCount = 0,
          this.rnrLeadsCount = 0,
          this.switchoffLeadsCount = 0
      }
    });
  }

  getVsnapLeads() {
    var limit = 0;
    var limitrows = 30;
    let param = {
      limit: limit,
      limitrows: limitrows,
      fromdate: this.fromdate,
      todate: this.todate,
      status: this.status,
    }
    this.filterLoader = true;
    this._sharedService.getVsnapLeads(param).subscribe(enquirys => {
      this.filterLoader = false;
      if (enquirys.status == 'true') {
        this.enquiriesList = enquirys.data;
        console.log(this.enquiriesList)
      } else {
        this.enquiriesList = [];
      }
    })
  }

  getSitecrmCouts() {
    EnqCampLeadsComponent.count = 0;
    let param = {
      fromdate: this.fromdate,
      todate: this.todate,
      count: 1
    }
    this._sharedService.getSiteCrmCountsLeads(param).subscribe((enquiryscount) => {
      if (enquiryscount.status == 'true') {
        this.freshLeadsCount = enquiryscount.counts.freshcount;
        this.pendingLeadsCount = enquiryscount.counts.pendingcount;
        this.qualifiedLeadsCount = enquiryscount.counts.qualified;
        this.notqualifiedLeadsCount = enquiryscount.counts.unqualified;
        this.callbackLeadsCount = enquiryscount.counts.callback,
          this.numberbusyLeadsCount = enquiryscount.counts.numberbusy,
          this.rnrLeadsCount = enquiryscount.counts.rnr,
          this.switchoffLeadsCount = enquiryscount.counts.switchoff
      } else {
        this.freshLeadsCount = 0;
        this.pendingLeadsCount = 0;
        this.qualifiedLeadsCount = 0;
        this.notqualifiedLeadsCount = 0;
        this.callbackLeadsCount = 0,
          this.numberbusyLeadsCount = 0,
          this.rnrLeadsCount = 0,
          this.switchoffLeadsCount = 0
      }
    });
  }

  getSitecrmLeads() {
    var limit = 0;
    var limitrows = 30;
    let param = {
      limit: limit,
      limitrows: limitrows,
      fromdate: this.fromdate,
      todate: this.todate,
      status: this.status,
    }
    this.filterLoader = true;
    this._sharedService.getSiteCrmLeads(param).subscribe(enquirys => {
      this.filterLoader = false;
      if (enquirys.status == 'true') {
        this.enquiriesList = enquirys.data;
      } else {
        this.enquiriesList = [];
      }
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

  convertLead(status, id) {
    let message, mes1;
    if (status == '2') {
      message = 'Qualified';
      mes1 = 'Qualify';
    } else if (status == '3') {
      message = 'Not Qualified';
      mes1 = 'Dis-qualify';
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
        this.filterLoader = true;
        let param = {
          leadid: id,
          status: status
        }
        if (this.vsnapparam == 1) {
          this._sharedService.postVsnapLeadStage(param).subscribe((resp) => {
            this.filterLoader = false;
            if (resp.status == 'true') {
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
        } else if (this.sitecrmparam == 1) {
          this._sharedService.postSiteCrmLeadStage(param).subscribe((resp) => {
            this.filterLoader = false;
            if (resp.status == 'true') {
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
      }
    })
  }

  // here we ge the selected followup lead id 
  selectedFollowupLead(id) {
    this.selectedFollowupLeadId = id;

    let followid;
    if (this.callbackparam == 1) {
      followid = 4;
    } else if (this.numberbusyparam == 1) {
      followid = 5;
    } else if (this.rnrparam == 1) {
      followid = 6;
    } else if (this.switchoffparam == 1) {
      followid = 7;
    }

    const reasonsBtn = this.followupsections.findIndex(
      sec => { return sec.value == followid });

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
    }
    this.filterLoader = true;
    if (this.vsnapparam == 1) {
      this._sharedService.postVsnapLeadStage(param).subscribe((resp) => {
        this.filterLoader = false;
        if (resp.status == 'true') {
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
            $('#closefollowupmodal').click();
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams })
            })
          })
        }
      })
    } else if (this.sitecrmparam == 1) {
      this._sharedService.postSiteCrmLeadStage(param).subscribe((resp) => {
        this.filterLoader = false;
        if (resp.status == 'true') {
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
            $('#closefollowupmodal').click();
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

  //here we remove the date filter
  dateclose() {
    EnqCampLeadsComponent.count = 0;
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

  //here on scroll we load the leads/
  loadMore() {
    const limit = EnqCampLeadsComponent.count += 30;
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

    let livecount = this.enquiriesList.length;
    if (this.vsnapparam == 1) {
      let param = {
        limit: limit,
        limitrows: limitrows,
        fromdate: this.fromdate,
        todate: this.todate,
        status: this.status,
      }
      this.filterLoader = true;
      this._sharedService.getVsnapLeads(param).subscribe(enquirys => {
        this.filterLoader = false;
        if (enquirys.status == 'true') {
          this.enquiriesList = this.enquiriesList.concat(enquirys.result);
        }
      })
    } else if (this.sitecrmparam == 1) {
      let param = {
        limit: limit,
        limitrows: limitrows,
        fromdate: this.fromdate,
        todate: this.todate,
        status: this.status,
      }
      this.filterLoader = true;
      this._sharedService.getSiteCrmLeads(param).subscribe(enquirys => {
        this.filterLoader = false;
        if (enquirys.status == 'true') {
          this.enquiriesList = this.enquiriesList.concat(enquirys.result);
        }
      })
    }

  }

  refresh() {
    this.fromdate = '';
    this.todate = '';
    this.datefilterview = false;
    if (this.vsnapparam == 1) {
      this.router.navigate(['/enquiry-vsnap'], {
        queryParams: {
          vsnap: 1,
          fresh: 1
        }
      })
    } else if (this.sitecrmparam == 1) {
      this.router.navigate(['/enquiry-sitecrm'], {
        queryParams: {
          sitecrm: 1,
          fresh: 1,
        }
      })
    }
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

}
