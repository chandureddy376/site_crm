import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Event, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CdTimerComponent } from 'angular-cd-timer';
import { sharedservice } from './shared.service';
import { mandateservice } from './mandate.service';
import { retailservice } from './retail.service';
import { EchoService } from './echo.service';
import { Subscription } from 'rxjs';

declare var base_version;
export const version = base_version;
const MINUTES_UNITL_AUTO_LOGOUT = 5 // in mins
const CHECK_INTERVAL = 15000 // in ms
const STORE_KEY = 'lastAction';
declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }

  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private sharedService: sharedservice,
    private _mandateservice: mandateservice,
    private _retailservice: retailservice,
    private _sharedService: sharedservice,
    private _echoService: EchoService
  ) {
    this.check();
    this.initListener();
    this.initInterval();
    localStorage.setItem(STORE_KEY, Date.now().toString());
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
      setTimeout(() => {
        $('.ui.dropdown').dropdown();
        $('.ui.checkbox').checkbox();
      }, 100)
    });
  }

  @ViewChild('basicTimer') basicTimer: CdTimerComponent;
  startTime: number = 0;
  timerstarted: boolean = false;
  totalBreakTime: any;
  currentdateforcompare = new Date();
  execid: any;
  roleid: any;
  breakDetails: any;
  IDPK: any;
  filterloader: boolean = false;
  timeExceeded: boolean = false;
  setTimeForExceeded: any;
  todaysdateforcompare: any;
  MandateRMTLview: boolean = false;
  MandateRMExecutiveview: boolean = false;
  RetailRMTLview: boolean = false;
  RetailRMEXview: boolean = false;
  CSTLview: boolean = false;
  CSEXview: boolean = false;
  currentTime: any;
  minus1hour: any;
  rmid: any;
  userid: any;
  unquieleadcounts: number = 0;
  isModalOpen: boolean = false;
  selectedReportType: any = 'activity';
  executivesList: any;
  zeroRepExecutives: any;
  activityRepExeutives: any;
  IsClosed: boolean = true;
  executiveCounts: any;
  uiTimesToDisplay: any;
  weekoffExecutiveList: any;
  copyWeekoffExecutiveList: any;
  selectedExecutives: any[] = [];
  executives_name: string = '';
  updatedUnavilableExecutives: any;
  callStatus: any;
  callsExecutivesList: any;
  totalCallsCount: number = 0;
  connectedCount: number = 0;
  notConnectedCount: number = 0;
  TotalTalkTime: number = 0;
  callSelectedExecutiveId: any;
  currentUrl: any;
  isCallBoxOpen: boolean = true;
  private onCallSubscription: Subscription;
  departId:any;

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    let roleid = localStorage.getItem('Role');
    if (isTimeout && this.callStatus != 'Call Connected' && roleid) {
      let param = {
        sessionid: localStorage.getItem('SessionId'),
        id: localStorage.getItem('UserId')
      }
      this._sharedService.logout(param).subscribe((resp) => {
        if (resp.status == 'True') {
          localStorage.clear();
          sessionStorage.clear();
          $('.modal-backdrop').closest('div').remove();
          setTimeout(() =>
            this.router.navigate(['/login'])
            , 100);
          setTimeout(() => {
            window.location.reload()
          }, 200)
          this._echoService.disconnectSocket();
        }
      })
    }
  }

  ngOnInit() {
    // $('#hourlyReport_detail').click();
    this.roleid = localStorage.getItem('Role');
    this.departId = localStorage.getItem('Department');
    
    if (localStorage.getItem('UserId') == '1') {
      this.userid = '';
    } else {
      this.userid = localStorage.getItem('UserId');
    }
    // if (this.roleid) {
    //   this.triggerHourlyAPIMethod();
    // }

    // if (this.roleid == 1) {
    this.getExecutive();
    // }

    this._echoService.listenToDatabaseChanges((message) => {
      if (localStorage.getItem('UserId') == message.Executive && (message.Call_status_new == 'Call Disconnected' || message.Call_status_new == 'Call Connected' || message.Call_status_new == 'Answered' || message.Call_status_new == 'Executive Busy' || message.Call_status_new == 'BUSY')) {
        this.callStatus = message.Call_status;
        this.geAllDashCounts();
        // setTimeout(() => {
        //   this.getLiveCallsData();
        // }, 1000)
        return
      }
    });

    if (this.roleid) {
      this.geAllDashCounts();
    }

    this.onCallSubscription = this._sharedService.callModalSelect$.subscribe((isOnCall) => {
      if (isOnCall == 'login') {
        this.geAllDashCounts();
      }
    });

    // if (this.roleid == 1) {
    // $('#hourlyReportAdmin_detail').click();
    // this.getAdminHourlyCounts();
    // }
    //  else {
    //   $('#hourlyReport_detail').click();
    //   this.getAdminHourlyCounts();
    // }

    this.getversion();

    if (localStorage.getItem('isModalOpen') === 'true') {
      this.isModalOpen = true;
      if (localStorage.getItem('Role')) {
        $('#hourlyReport_detail').click();
      }
      setTimeout(() => {
        let hours = this.currentdateforcompare.getHours();
        let minutes = this.currentdateforcompare.getMinutes();

        if (((hours == 9 && minutes > 30) || (hours == 10 && minutes <= 30)) && this.isModalOpen == true) {
          this.currentTime = '10:30 AM';
          this.minus1hour = '9:30 AM';
          this.uiTimesToDisplay = '9:30 AM - 10:30 AM';
        } else if (((hours == 10 && minutes > 30) || (hours == 11 && minutes <= 30)) && this.isModalOpen == true) {
          this.currentTime = '11:30 AM';
          this.minus1hour = '10:30 AM';
          this.uiTimesToDisplay = '10:30 AM - 11:30 AM';
        } else if (((hours == 11 && minutes > 30) || (hours == 12 && minutes <= 30)) && this.isModalOpen == true) {
          this.currentTime = '12:30 PM';
          this.minus1hour = '11:30 AM';
          this.uiTimesToDisplay = '11:30 AM - 12:30 PM';
        } else if (((hours == 12 && minutes > 30) || (hours == 13 && minutes <= 30)) && this.isModalOpen == true) {
          this.currentTime = '13:30 PM';
          this.minus1hour = '12:30 PM';
          this.uiTimesToDisplay = '12:30 PM - 1:30 PM';
        } else if (((hours == 13 && minutes > 30) || (hours == 14 && minutes <= 30)) && this.isModalOpen == true) {
          this.currentTime = '14:30 PM';
          this.minus1hour = '13:30 PM';
          this.uiTimesToDisplay = '1:30 PM - 2:30 PM';
        } else if (((hours == 14 && minutes > 30) || (hours == 15 && minutes <= 30)) && this.isModalOpen == true) {
          this.currentTime = '15:30 PM';
          this.minus1hour = '14:30 PM';
          this.uiTimesToDisplay = '2:30 PM - 3:30 PM';
        } else if (((hours == 15 && minutes > 30) || (hours == 16 && minutes <= 30)) && this.isModalOpen == true) {
          this.currentTime = '16:30 PM';
          this.minus1hour = '15:30 PM';
          this.uiTimesToDisplay = '3:30 PM - 4:30 PM';
        } else if (((hours == 16 && minutes > 30) || (hours == 17 && minutes <= 30)) && this.isModalOpen == true) {
          this.currentTime = '17:30 PM';
          this.minus1hour = '16:30 PM';
          this.uiTimesToDisplay = '4:30 PM - 5:30 PM';
        } else if (((hours == 17 && minutes > 30) || (hours == 18 && minutes <= 30)) && this.isModalOpen == true) {
          this.currentTime = '18:30 PM';
          this.minus1hour = '17:30 PM';
          this.uiTimesToDisplay = '5:30 PM - 6:30 PM';
        } else if (((hours == 18 && minutes > 30) || (hours == 19 && minutes <= 30)) && this.isModalOpen == true) {
          this.currentTime = '19:30 PM';
          this.minus1hour = '18:30 PM';
          this.uiTimesToDisplay = '6:30 PM - 7:30 PM';
        }
      }, 100)
    }

    if (this.location.path().indexOf('dashboard?') > -1) {
    } else {
      let element5 = document.getElementById('dashboard_dynamic_links_5');
      let element6 = document.getElementById('dashboard_dynamic_links_6');
      if (element5) {
        element5.parentNode.removeChild(element5);
      }
      if (element6) {
        element6.parentNode.removeChild(element6);
      }
    }
    this.currentdateforcompare = new Date();
    let hours = this.currentdateforcompare.getHours();
    let minutes = this.currentdateforcompare.getMinutes();
    let seconds = this.currentdateforcompare.getSeconds();
    let formattedMinutes: string = String(minutes).padStart(2, '0');
    let formattedSeconds: string = String(seconds).padStart(2, '0');
    // this.currentTime = hours + ':' + formattedMinutes + ':' + formattedSeconds;

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    this.execid = localStorage.getItem('UserId');

    if (this.roleid != 1 && this.roleid != '2') {
      this.getBreakDetails();
      this.checkTimeExceed();
    }

    if (localStorage.getItem('Role') == '50009') {
      this.RetailRMTLview = true;
    } else if (localStorage.getItem('Role') == '50010') {
      this.RetailRMEXview = true;
    } else if (localStorage.getItem('Role') == '50013') {
      this.CSTLview = true;
    } else if (localStorage.getItem('Role') == '50014') {
      this.CSEXview = true;
    } else if (localStorage.getItem('Role') == '50001') {
      this.MandateRMTLview = true;
    } else if (localStorage.getItem('Role') == '50002') {
      this.MandateRMExecutiveview = true;
    }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      // $('.ui.dropdown').dropdown();
      // $('.ui.checkbox').checkbox();
    }, 0);
  }

  getExecutive() {
    this._sharedService.getexecutiveslist('', '', '','','').subscribe((exec) => {
      this.callsExecutivesList = exec;
      // this.callsExecutivesList = [{ ID: '', Name: 'Select Executive' }].concat(exec);
      this.weekoffExecutiveList = exec.map((executive: any) => ({
        ...executive, status: ''
      }));

      this.copyWeekoffExecutiveList = exec.map((executive: any) => ({
        ...executive, status: ''
      }));
    })
  }

  getversion() {
    let userid = localStorage.getItem('UserId');
    if (localStorage.getItem('Role') != null) {
      this.sharedService.getversion(userid).subscribe((response) => {
        if (response.Executives[0].active_status == '0') {
          if (response.versioncode[0].Lead247_CRMWEB != version) {
            swal({
              title: 'Version Update',
              text: 'A new version is available',
              type: "warning",
              confirmButtonText: "Click Me",
            }).then((willProceed) => {
              if (willProceed) {
                this.triggerKeyPressEvent();
              } else {
                console.log("Version update was cancelled");
              }
            });
          } else {
          }
        } else {
          swal({
            title: 'Blocked',
            text: 'Your account has been blocked',
            type: "warning",
            showConfirmButton: true,
            confirmButtonText: "OK",
          }).then((willProceed) => {
            localStorage.clear();
            setTimeout(() =>
              this.router.navigate(['/login'])
              , 0)
          });
        }
      }
        , (error) => {
          if (error.status == 401) {
            localStorage.clear();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 0);
          }
        })
    }
  }

  triggerKeyPressEvent() {

    document.cookie.split(';').forEach(function (cookie) {
      let cookieName = cookie.split('=')[0];
      document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    });

    location.href = location.href.split('?')[0];
    window.location.reload();

    // const evt = new KeyboardEvent("keydown", {
    //   ctrlKey: true,
    //   shiftKey: true,
    //   key: "R",
    //   code: "KeyR"
    // });
    // document.dispatchEvent(evt);
  }

  //here on clicking the start break button timer pop up will appear with confirmation
  onClickstartBreak() {
    this.startTime = 0;
    this.basicTimer.reset();
    this.basicTimer.stop();
  }

  //here on clicking the start time the currentime and execid will be passed.
  startBreak() {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let formattedMinutes: string = String(minutes).padStart(2, '0');
    let formattedSeconds: string = String(seconds).padStart(2, '0');
    let currentTime = hours + ':' + formattedMinutes + ':' + formattedSeconds;
    let param = {
      execid: this.execid,
      startTime: currentTime
    }
    this.sharedService.startBreak(param).subscribe((response) => {
      this.IDPK = response.IDPK;
      this.setTimeForExceeded = parseInt(response['Time'][0].timings);
      // setTimeout(()=>{
      //   this.getBreakDetails();
      // },5000)
    })
  }

  //here we the details the execid break details. and the API is commented
  getBreakDetails() {
    // this.sharedService.getBreakDetails(this.execid).subscribe((response) => {
    //   this.breakDetails = response;
    //   this.filterloader = false;
    //   if (response.status == 'True') {
    //     //here if the end time is null then we are seperating the currentime and start break time to contine the break time.
    //     if (this.breakDetails['IDPK'][0].End_time == null) {
    //       let timerDifference = getTimeDifference(this.breakDetails['IDPK'][0].Start_time, this.currentTime);
    //       setTimeout(() => {
    //         const body = document.body;
    //         // Check if the class exists
    //         const hasClass = body.classList.contains('modal-open');
    //         $('.starttimer').click();
    //         this.basicTimer.resume();
    //         this.timerstarted = true;
    //         // }
    //         this.setTimeForExceeded = parseInt(this.breakDetails['Time'][0].timings);
    //       }, 0);
    //       this.startTime = convertTimeStringToSeconds(timerDifference);
    //     } else if (this.breakDetails['IDPK'][0].Start_time && this.breakDetails['IDPK'][0].End_time != null) {
    //       setTimeout(() => {
    //         this.startTime = 0;
    //         this.basicTimer.reset();
    //         this.basicTimer.stop();
    //       }, 100)
    //     }
    //   } else if (response.status == 'False') {
    //     //here if the breakdetails  is undefined then we are clearing the date and stop the time.
    //     setTimeout(() => {
    //       this.startTime = 0;
    //       this.basicTimer.reset();
    //       this.basicTimer.stop();
    //     }, 100)
    //   }
    // })
  }

  //here we end the break by clicking check in now
  endBreak() {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let formattedMinutes: string = String(minutes).padStart(2, '0');
    let formattedSeconds: string = String(seconds).padStart(2, '0');
    let endtime = hours + ':' + formattedMinutes + ':' + formattedSeconds;
    let breakID;
    if (this.IDPK == undefined || this.IDPK == null) {
      breakID = this.breakDetails.IDPK[0].IDPK;
    } else {
      breakID = this.IDPK;
    }
    let param = {
      breakId: breakID,
      execid: this.execid,
      endtime: endtime
    }
    this.sharedService.endBreak(param).subscribe((response) => {

    })
  }

  //here this the code for start break and end break to the strat and stop the timer.
  doActionBasicTimer(action: String) {
    switch (action) {
      case 'start':
        this.basicTimer.start();
        this.timerstarted = true;
        //set time out is given because there s delay in starting the time
        setTimeout(() => {
          this.startBreak();
        }, 1500);
        break;
      default:
        this.totalBreakTime = this.basicTimer.get();
        this.basicTimer.stop();
        this.endBreak();
        this.timerstarted = false;
        this.timeExceeded = false;
        this.startTime = 0;
        this.closeModal();
        break;
    }
  }

  //checking whetherthe break time is execeed to 20mins or no
  checkTimeExceed() {
    setInterval(() => {
      let breakTime = this.basicTimer.get();
      const timeFormat = breakTime.hours * 60 + breakTime.minutes + breakTime.seconds / 60;
      if (timeFormat >= this.setTimeForExceeded) {
        this.timeExceeded = true;
      } else {
        this.timeExceeded = false;
      }
    }, 1000);
  }

  //here this the code for  close start break modal.
  closeModal() {
    $('.close').click();
    setTimeout(() => {
      $('body').removeClass('modal-open');
    }, 100)
    this.timerstarted = false;
  }

  // here we will trigger the gethourlydata method every 1 hour for executive account 
  // triggerHourlyAPIMethod() {
  //   setInterval(() => {
  //     if (localStorage.getItem('Role') == '1') {
  //       this.getHourlyDataAdmin();
  //     } else if (localStorage.getItem('Role') != '1' && localStorage.getItem('Role') != '2') {
  //       this.getHourlyData();
  //     }
  //   }, 10000)
  // }

  //here we check whether the time is between 9:30 to 6:30 and then trigger the counts API based on the mandate and retail Login.
  getHourlyData() {
    if (localStorage.getItem('Role') == '50009') {
      this.RetailRMTLview = true;
    } else if (localStorage.getItem('Role') == '50010') {
      this.RetailRMEXview = true;
    } else if (localStorage.getItem('Role') == '50013') {
      this.CSTLview = true;
    } else if (localStorage.getItem('Role') == '50014') {
      this.CSEXview = true;
    } else if (localStorage.getItem('Role') == '50001') {
      this.MandateRMTLview = true;
    } else if (localStorage.getItem('Role') == '50002') {
      this.MandateRMExecutiveview = true;
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentampm = hours >= 12 ? 'PM' : 'AM';
    let minusedTime = now.getHours() - 1;
    const minusampm = minusedTime >= 12 ? 'PM' : 'AM';

    if (localStorage.getItem('isModalOpen') === 'true') {
      this.isModalOpen = true;
    } else {
      this.isModalOpen = false;
    }

    if ([10, 11, 12, 13, 14, 15, 16, 17, 18, 19].includes(hours) && (minutes >= 20 && minutes <= 28)) {
      this.autoCloseEXeModal();
    }

    //here we should call the api in place of submit report
    if (hours == 10 && (minutes >= 31 && minutes < 40) && this.isModalOpen == true) {
      this.autoCloseEXeModal();
    } else if (hours == 11 && (minutes >= 31 && minutes < 40) && this.isModalOpen == true) {
      this.autoCloseEXeModal();
    } else if (hours == 12 && (minutes >= 31 && minutes < 40) && this.isModalOpen == true) {
      this.autoCloseEXeModal();
    } else if (hours == 13 && (minutes >= 31 && minutes < 40) && this.isModalOpen == true) {
      this.autoCloseEXeModal();
    } else if (hours == 14 && (minutes >= 31 && minutes < 40) && this.isModalOpen == true) {
      this.autoCloseEXeModal();
    } else if (hours == 15 && (minutes >= 31 && minutes < 40) && this.isModalOpen == true) {
      this.autoCloseEXeModal();
    } else if (hours == 16 && (minutes >= 31 && minutes < 40) && this.isModalOpen == true) {
      this.autoCloseEXeModal();
    } else if (hours == 17 && (minutes >= 31 && minutes < 40) && this.isModalOpen == true) {
      this.autoCloseEXeModal();
    } else if (hours == 18 && (minutes >= 31 && minutes < 40) && this.isModalOpen == true) {
      this.autoCloseEXeModal();
    } else if (hours == 19 && (minutes >= 31 && minutes < 40) && this.isModalOpen == true) {
      this.autoCloseEXeModal();
    }

    if (((hours == 9 && minutes > 30) || (hours == 10 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '10:30 AM';
      this.minus1hour = '9:30 AM';
      this.uiTimesToDisplay = '9:30 AM - 10:30 AM';
    } else if (((hours == 10 && minutes > 30) || (hours == 11 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '11:30 AM';
      this.minus1hour = '10:30 AM';
      this.uiTimesToDisplay = '10:30 AM - 11:30 AM';
    } else if (((hours == 11 && minutes > 30) || (hours == 12 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '12:30 PM';
      this.minus1hour = '11:30 AM';
      this.uiTimesToDisplay = '11:30 AM - 12:30 PM';
    } else if (((hours == 12 && minutes > 30) || (hours == 13 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '13:30 PM';
      this.minus1hour = '12:30 PM';
      this.uiTimesToDisplay = '12:30 PM - 1:30 PM';
    } else if (((hours == 13 && minutes > 30) || (hours == 14 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '14:30 PM';
      this.minus1hour = '13:30 PM';
      this.uiTimesToDisplay = '1:30 PM - 2:30 PM';
    } else if (((hours == 14 && minutes > 30) || (hours == 15 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '15:30 PM';
      this.minus1hour = '14:30 PM';
      this.uiTimesToDisplay = '2:30 PM - 3:30 PM';
    } else if (((hours == 15 && minutes > 30) || (hours == 16 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '16:30 PM';
      this.minus1hour = '15:30 PM';
      this.uiTimesToDisplay = '3:30 PM - 4:30 PM';
    } else if (((hours == 16 && minutes > 30) || (hours == 17 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '17:30 PM';
      this.minus1hour = '16:30 PM';
      this.uiTimesToDisplay = '4:30 PM - 5:30 PM';
    } else if (((hours == 17 && minutes > 30) || (hours == 18 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '18:30 PM';
      this.minus1hour = '17:30 PM';
      this.uiTimesToDisplay = '5:30 PM - 6:30 PM';
    } else if (((hours == 18 && minutes > 30) || (hours == 19 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '19:30 PM';
      this.minus1hour = '18:30 PM';
      this.uiTimesToDisplay = '6:30 PM - 7:30 PM';
    }
    if ([10, 11, 12, 13, 14, 15, 16, 17, 18, 19].includes(hours) && minutes == 30) {
      if (this.isModalOpen == false && localStorage.getItem('isClicked') != 'true') {
        this.currentTime = hours + ':' + minutes + ' ' + currentampm;
        this.minus1hour = now.getHours() - 1 + ':' + minutes + ' ' + minusampm;
        this.uiTimesToDisplay = (convertTo12HourFormat(now.getHours() - 1, minutes)) + '-' + (convertTo12HourFormat(hours, minutes))
        if (this.RetailRMEXview == true || this.RetailRMTLview == true) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
          script.type = 'module';
          script.async = true;
          script.onload = () => {
            console.log('Lottie script loaded successfully');
          };
          document.head.appendChild(script);

          this.getCountsRetail();
          this.getAdminHourlyCounts()
          if (localStorage.getItem('Role')) {
            $('#hourlyReport_detail').click();
          }
          this.isModalOpen = true;
          localStorage.setItem('isModalOpen', 'true');
        } else if (this.MandateRMExecutiveview == true || this.MandateRMTLview == true || this.CSTLview == true || this.CSEXview == true) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
          script.type = 'module';
          script.async = true;
          script.id = "dashboard_dynamic_links_5";
          document.head.appendChild(script);

          this.getCountsMandate();
          this.getAdminHourlyCounts()
          if (localStorage.getItem('Role')) {
            $('#hourlyReport_detail').click();
          }
          this.isModalOpen = true;
          localStorage.setItem('isModalOpen', 'true');
        }
      }
    }
  }

  //here this method is called only on clicking the executie modal close.
  closeExecModal() {
    this.isModalOpen = false;
    $('#hourlyModalClose').click();
    localStorage.setItem('isModalOpen', 'false');
    this.IsClosed = false;
    localStorage.setItem('isClicked', 'true');
    let element = document.getElementById('dashboard_dynamic_links_5');
    if (element) {
      element.parentNode.removeChild(element);
    }
  }

  //here this method is called on autoclose after 1 min of modal open
  autoCloseEXeModal() {
    this.isModalOpen = false;
    $('#hourlyModalClose').click();
    localStorage.setItem('isModalOpen', 'false');
    this.IsClosed = false;
    localStorage.setItem('isClicked', 'false');
    let element = document.getElementById('dashboard_dynamic_links_5');
    if (element) {
      element.parentNode.removeChild(element);
    }
  }

  //here pop is shown for the admin with executives count every one hour
  getHourlyDataAdmin() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentampm = hours >= 12 ? 'PM' : 'AM';
    let minusedTime = now.getHours() - 1;
    const minusampm = minusedTime >= 12 ? 'PM' : 'AM';

    if (((hours == 9 && minutes > 30) || (hours == 10 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '10:30 AM';
      this.minus1hour = '9:30 AM';
      this.uiTimesToDisplay = '9:30 AM - 10:30 AM'
    } else if (((hours == 10 && minutes > 30) || (hours == 11 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '11:30 AM';
      this.minus1hour = '10:30 AM';
      this.uiTimesToDisplay = '10:30 AM - 11:30 AM'
    } else if (((hours == 11 && minutes > 30) || (hours == 12 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '12:30 PM';
      this.minus1hour = '11:30 AM';
      this.uiTimesToDisplay = '11:30 AM - 12:30 PM'
    } else if (((hours == 12 && minutes > 30) || (hours == 13 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '13:30 PM';
      this.minus1hour = '12:30 PM';
      this.uiTimesToDisplay = '12:30 PM - 1:30 PM'
    } else if (((hours == 13 && minutes > 30) || (hours == 14 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '14:30 PM';
      this.minus1hour = '13:30 PM';
      this.uiTimesToDisplay = '1:30 PM - 2:30 PM'
    } else if (((hours == 14 && minutes > 30) || (hours == 15 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '15:30 PM';
      this.minus1hour = '14:30 PM';
      this.uiTimesToDisplay = '2:30 PM - 3:30 PM'
    } else if (((hours == 15 && minutes > 30) || (hours == 16 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '16:30 PM';
      this.minus1hour = '15:30 PM';
      this.uiTimesToDisplay = '3:30 PM - 4:30 PM'
    } else if (((hours == 16 && minutes > 30) || (hours == 17 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '17:30 PM';
      this.minus1hour = '16:30 PM';
      this.uiTimesToDisplay = '4:30 PM - 5:30 PM'
    } else if (((hours == 17 && minutes > 30) || (hours == 18 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '18:30 PM';
      this.minus1hour = '17:30 PM';
      this.uiTimesToDisplay = '5:30 PM - 6:30 PM'
    } else if (((hours == 18 && minutes > 30) || (hours == 19 && minutes <= 30)) && this.isModalOpen == true) {
      this.currentTime = '19:30 PM';
      this.minus1hour = '18:30 PM';
      this.uiTimesToDisplay = '6:30 PM - 7:30 PM'
    }

    if ([10, 11, 12, 13, 14, 15, 16, 17, 18, 19].includes(hours) && minutes == 30) {
      if (this.isModalOpen == false) {
        this.currentTime = hours + ':' + minutes + ' ' + currentampm;
        this.minus1hour = now.getHours() - 1 + ':' + minutes + ' ' + minusampm;
        this.uiTimesToDisplay = (convertTo12HourFormat(now.getHours() - 1, minutes)) + '-' + (convertTo12HourFormat(hours, minutes))
        if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
          $('#hourlyReportAdmin_detail').click();
          this.isModalOpen = true;
          this.getAdminHourlyCounts();
        }
      }
    }
  }

  //here we get the counts for every one hour for Retail executives
  getCountsRetail() {
    this.unquieleadcounts = 0;

    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;
    this.rmid = localStorage.getItem('Role');

    var totalleads = {
      assignedfrom: this.todaysdateforcompare,
      assignedto: this.todaysdateforcompare,
      statuss: 'pending',
      executid: this.rmid,
      loginuser: this.userid,
    }
    this._retailservice.assignedLeadsCount(totalleads).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        if (compleads.result && compleads.result[0]) {
          return this.unquieleadcounts = compleads.AssignedLeads[0].Uniquee_counts;
        }
      } else {
        this.unquieleadcounts = 0;
      }
    });
  }

  //here we get the counts for every one hour for Mandate executives
  getCountsMandate() {
    this.unquieleadcounts = 0;

    // Total Assigned Leads Count
    var totalleads = {
      assignedfrom: this.todaysdateforcompare,
      assignedto: this.todaysdateforcompare,
      statuss: 'pending',
      executid: this.rmid,
      loginuser: this.userid,
    }
    this._mandateservice.assignedLeadsCount(totalleads).subscribe(compleads => {
      if (compleads['status'] == 'True') {
        return this.unquieleadcounts = compleads.AssignedLeads[0].Uniquee_counts;
      } else {
        this.unquieleadcounts = 0;
      }
    });
  }

  //here this is used for admin pop up to switch between activities and zero report
  reportTabActivity(type) {
    this.selectedReportType = type;
    $('.add_class').removeClass('active');
    if (type == 'activity') {
      $('.activity_rep').addClass('active');
    } else if (type == 'zero') {
      $('.zero_rep').addClass('active');
    }
  }

  //here we re-direct to hourly report section on clicking on detailed report
  viewMoreHourlyReport() {
    setTimeout(() => {
      this.filterloader = false;
      $('#hourlyModalAdminClose').click();
    }, 0)

    this.router.navigate(['/hourly-report'], {
      queryParams: {
        today: '1',
        from: this.todaysdateforcompare,
        to: this.todaysdateforcompare
      }
    })
  }

  //here we get the counts for executives and list of executives for admin 
  getAdminHourlyCounts() {
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    let hours = this.currentdateforcompare.getHours();
    let minutes = this.currentdateforcompare.getMinutes();
    let currentTime, minus1hour: any;
    if (((hours == 9 && minutes > 30) || (hours == 10 && minutes <= 30))) {
      currentTime = '10:30';
      minus1hour = '09:30';
    } else if (((hours == 10 && minutes > 30) || (hours == 11 && minutes <= 30))) {
      currentTime = '11:30';
      minus1hour = '10:30';
    } else if ((hours == 11 && minutes > 30) || (hours == 12 && minutes <= 30)) {
      currentTime = '12:30';
      minus1hour = '11:30';
    } else if ((hours == 12 && minutes > 30) || (hours == 13 && minutes <= 30)) {
      currentTime = '13:30';
      minus1hour = '12:30';
    } else if ((hours == 13 && minutes > 30) || (hours == 14 && minutes <= 30)) {
      currentTime = '14:30';
      minus1hour = '13:30';
    } else if ((hours == 14 && minutes > 30) || (hours == 15 && minutes <= 30)) {
      currentTime = '15:30';
      minus1hour = '14:30';
    } else if ((hours == 15 && minutes > 30) || (hours == 16 && minutes <= 30)) {
      currentTime = '16:30';
      minus1hour = '15:30';
    } else if ((hours == 16 && minutes > 30) || (hours == 17 && minutes <= 30)) {
      currentTime = '17:30';
      minus1hour = '16:30';
    } else if ((hours == 17 && minutes > 30) || (hours == 18 && minutes <= 30)) {
      currentTime = '18:30';
      minus1hour = '17:30';
    } else if ((hours == 18 && minutes > 30) || (hours == 19 && minutes <= 30)) {
      currentTime = '19:30';
      minus1hour = '18:30';
    }

    let param = {
      fromdate: this.todaysdateforcompare,
      todate: this.todaysdateforcompare,
      fromtime: minus1hour,
      totime: currentTime,
      loginid: localStorage.getItem('UserId')
    }

    if (localStorage.getItem('Role') != null) {
      this.filterloader = true;
      this.sharedService.getAdminHourlyReport(param).subscribe((resp) => {
        this.filterloader = false;
        if (this.roleid == '1') {
          this.executivesList = resp['Exec_list'];
        } else {
          this.executiveCounts = resp['Exec_list'];
        }

        if (this.roleid == '1') {
          this.zeroRepExecutives = this.executivesList.filter((exec) => {
            return exec.counts && exec.counts[0] && exec.counts[0].overall == 0
          })

          this.activityRepExeutives = this.executivesList.filter((exec) => {
            return exec.counts && exec.counts[0] && exec.counts[0].overall > 0
          })
          this.filterloader = false;
        }
      })
    }
  }

  //In this method we get the  searched executive filter.
  searchexecutives() {
    if (this.executives_name) {
      this.weekoffExecutiveList = this.copyWeekoffExecutiveList.filter((exec) => {
        return exec.Name.toLowerCase().includes(this.executives_name.toLowerCase());
      })
    } else {
      this.weekoffExecutiveList = this.copyWeekoffExecutiveList;
    }
  }

  //In this method we store the selected executives from the active executives table.
  onStatusChange(exec, status) {

    const existingExecIndex = this.selectedExecutives.findIndex(e => e.Name === exec.Name);

    if (existingExecIndex !== -1) {
      this.selectedExecutives[existingExecIndex].status = status;
    } else {
      this.selectedExecutives.push({ Name: exec.Name, ID: exec.ID, status: status, exec: exec });
    }
    this.updatedUnavilableExecutives = this.selectedExecutives;

    this.weekoffExecutiveList = this.copyWeekoffExecutiveList.filter((exec) => {
      return !this.updatedUnavilableExecutives.some((data) =>
        exec.ID == data.ID);
    });
  }

  // //In this method we push the executives to the unavilable executives table
  // selectedUnavilableExecs() {
  //   this.updatedUnavilableExecutives = this.selectedExecutives;

  //   this.weekoffExecutiveList = this.copyWeekoffExecutiveList.filter((exec) => {
  //     return !this.updatedUnavilableExecutives.some((data) =>
  //       exec.ID == data.ID);
  //   });
  // }

  //In this method we remove the executives from the unavilable executives table
  closeExecutive(exec: any) {
    if (this.updatedUnavilableExecutives) {
      this.updatedUnavilableExecutives = this.updatedUnavilableExecutives.filter(item => item.ID !== exec.ID);
      this.selectedExecutives = this.updatedUnavilableExecutives;
      if (this.updatedUnavilableExecutives.length == 0) {
        this.updatedUnavilableExecutives = [];
        this.selectedExecutives = [];
      }
      this.weekoffExecutiveList.push(exec);
    }
  }

  //here we update the selected exeutives today's status.
  saveUnavilableExecutives() {
    $('#weekoffclosebtn').click();
  }

  rmchange(event) {
    this.callSelectedExecutiveId = event.target.value;
    this.geAllDashCounts()
  }

  geAllDashCounts() {
    this.departId = localStorage.getItem('Department')
    this.currentdateforcompare = new Date();
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    // Todays Date
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    let todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    let param = {
      loginid: localStorage.getItem('UserId'),
      from: todaysdateforcompare,
      to: todaysdateforcompare,
      execid: this.callSelectedExecutiveId
    }

    this._sharedService.getAllCallsCounts(param).subscribe((resp) => {
      if (resp.status == 'success') {
        this.totalCallsCount = resp.success[0].overall;
        this.connectedCount = resp.success[0].connected;
        this.notConnectedCount = resp.success[0].inactive;
        this.TotalTalkTime = resp.success[0].total_talk_time_in_seconds;
      } else {
        this.totalCallsCount = 0;
        this.connectedCount = 0;
        this.notConnectedCount = 0;
        this.TotalTalkTime = 0;
      }
    })
  }

  toggleCallBox(): void {
    this.isCallBoxOpen = !this.isCallBoxOpen;
  }

  convertSecondsToTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}h:${pad(minutes)}m:${pad(seconds)}s`;
  }


}

//here we subtrat the time difference between start break time and current time we refresh the website in between
function getTimeDifference(startTime: string, endTime: string): string {
  const start = new Date(`1970-01-01T${startTime}Z`);
  const end = new Date(`1970-01-01T${endTime}Z`);
  const differenceInMs = end.getTime() - start.getTime();
  const hours = Math.floor((differenceInMs % 86400000) / 3600000);
  const minutes = Math.floor((differenceInMs % 3600000) / 60000);
  const seconds = Math.floor((differenceInMs % 60000) / 1000);
  return `${Math.abs(hours)}:${Math.abs(minutes)}:${Math.abs(seconds)}`;
}

//here we convert the differnece in time to seconds
function convertTimeStringToSeconds(timeString: string): number {
  //map is used to define the date type
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
}

function convertTo12HourFormat(hour: number, minutes: number): string {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12; // Convert 24-hour to 12-hour format
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

// submitReport() {
//   this.isModalOpen = false;
//   $('#hourlyModalClose').click();
//   localStorage.setItem('isModalOpen', 'false');
// }


// in this code the modal wont close it the exec submits the report 
// getHourlyData() {

//   if (localStorage.getItem('Role') == '50009') {
//     this.RetailRMTLview = true;
//   } else if (localStorage.getItem('Role') == '50010') {
//     this.RetailRMEXview = true;
//   } else if (localStorage.getItem('Role') == '50003') {
//     this.CSTLview = true;
//   } else if (localStorage.getItem('Role') == '50004') {
//     this.CSEXview = true;
//   } else if (localStorage.getItem('Role') == '50001') {
//     this.MandateRMTLview = true;
//   } else if (localStorage.getItem('Role') == '50002') {
//     this.MandateRMExecutiveview = true;
//   }

//   // if (this.isModalOpen == true && this.isSubmit == false) {
//   //   // $('#hourlyReport_detail').click();
//   // };

//   const now = new Date();
//   const hours = now.getHours();
//   const minutes = now.getMinutes();
//   const currentampm = hours >= 12 ? 'PM' : 'AM';
//   let minusedTime = now.getHours() - 1;
//   const minusampm = minusedTime >= 12 ? 'PM' : 'AM';
//   // this.currentTime = hours+':'+minutes+ ' ' + currentampm;
//   // this.minus1hour=minusedTime - 1 +':'+minutes+ ' ' + minusampm;
//   if (localStorage.getItem('isModalOpen') === 'true') {
//     // $('#hourlyReport_detail').click();
//     this.isModalOpen = true;
//     // this.currentTime = hours + ':' + minutes + ' ' + currentampm;
//     // this.minus1hour = now.getHours() - 1 + ':' + minutes + ' ' + minusampm;
//   } else {
//     this.isModalOpen = false;
//   }

//   // if ((hours >= 9 && hours <= 18) && (minutes === 0 || minutes === 30)) {
//   //here we should call the api in place of submit report
//   if (hours == 10 && minutes == 25 && this.isModalOpen == true) {
//     // $('#submitReport').click();
//     this.submitReport();
//   } else if (hours == 11 && minutes == 25 && this.isModalOpen == true) {
//     // $('#submitReport').click();
//     this.submitReport();
//   } else if (hours == 12 && minutes == 25 && this.isModalOpen == true) {
//     // $('#submitReport').click();
//     this.submitReport();
//   } else if (hours == 13 && minutes == 25 && this.isModalOpen == true) {
//     // $('#submitReport').click();
//     this.submitReport();
//   } else if (hours == 14 && minutes == 25 && this.isModalOpen == true) {
//     // $('#submitReport').click();
//     this.submitReport();
//   } else if (hours == 15 && minutes == 25 && this.isModalOpen == true) {
//     // $('#submitReport').click();
//     this.submitReport();
//   } else if (hours == 16 && minutes == 25 && this.isModalOpen == true) {
//     // $('#submitReport').click();
//     this.submitReport();
//   } else if (hours == 17 && minutes == 25 && this.isModalOpen == true) {
//     // $('#submitReport').click();
//     this.submitReport();
//   } else if (hours == 18 && minutes == 25 && this.isModalOpen == true) {
//     // $('#submitReport').click();
//     this.submitReport();
//   } else if (hours == 19 && minutes == 25 && this.isModalOpen == true) {
//     // $('#submitReport').click();
//     this.submitReport();
//   }

//   if (((hours == 10 && minutes > 30) || (hours == 11 && minutes < 30)) && this.isModalOpen == true) {
//     this.currentTime = '10:30 AM';
//     this.minus1hour = '9:30 AM';
//   } else if (((hours == 11 && minutes > 30) || (hours == 12 && minutes < 30)) && this.isModalOpen == true) {
//     this.currentTime = '11:30 AM';
//     this.minus1hour = '10:30 AM';
//   } else if (((hours == 12 && minutes > 30) || (hours == 13 && minutes < 30)) && this.isModalOpen == true) {
//     this.currentTime = '12:30 PM';
//     this.minus1hour = '11:30 AM';
//   } else if (((hours == 13 && minutes > 30) || (hours == 14 && minutes < 30)) && this.isModalOpen == true) {
//     this.currentTime = '13:30 PM';
//     this.minus1hour = '12:30 PM';
//   } else if (((hours == 14 && minutes > 30) || (hours == 15 && minutes < 30)) && this.isModalOpen == true) {
//     this.currentTime = '14:30 PM';
//     this.minus1hour = '13:30 PM';
//   } else if (((hours == 15 && minutes > 30) || (hours == 16 && minutes < 30)) && this.isModalOpen == true) {
//     this.currentTime = '15:30 PM';
//     this.minus1hour = '14:30 PM';
//   } else if (((hours == 16 && minutes > 30) || (hours == 17 && minutes < 30)) && this.isModalOpen == true) {
//     this.currentTime = '16:30 PM';
//     this.minus1hour = '15:30 PM';
//   } else if (((hours == 17 && minutes > 30) || (hours == 18 && minutes < 30)) && this.isModalOpen == true) {
//     this.currentTime = '17:30 PM';
//     this.minus1hour = '16:30 PM';
//   } else if (((hours == 18 && minutes > 30) || (hours == 19 && minutes < 30)) && this.isModalOpen == true) {
//     this.currentTime = '18:30 PM';
//     this.minus1hour = '17:30 PM';
//   } else if (((hours == 19 && minutes > 30) || (hours == 20 && minutes < 30)) && this.isModalOpen == true) {
//     this.currentTime = '19:30 PM';
//     this.minus1hour = '18:30 PM';
//   }

//   if ([10, 11, 12, 13, 14, 15, 16, 17, 18, 19].includes(hours) && minutes == 30) {
//     if (this.isModalOpen == false) {
//       this.currentTime = hours + ':' + minutes + ' ' + currentampm;
//       this.minus1hour = now.getHours() - 1 + ':' + minutes + ' ' + minusampm;
//       if (this.RetailRMEXview == true || this.RetailRMTLview == true || this.CSTLview == true || this.CSEXview == true) {
//         this.getCountsRetail();
//         $('#hourlyReport_detail').click();
//         this.isModalOpen = true;
//         localStorage.setItem('isModalOpen', 'true');
//       } else if (this.MandateRMExecutiveview == true || this.MandateRMTLview == true) {
//         this.getCountsMandate();
//         $('#hourlyReport_detail').click();
//         this.isModalOpen = true;
//         localStorage.setItem('isModalOpen', 'true');
//       }
//     }
//   }
// }