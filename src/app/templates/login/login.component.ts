import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Http } from '@angular/http';
import { sharedservice } from '../../shared.service';
import { Router } from '@angular/router';
// import * as L from 'leaflet';

// Make sure `window.OneSignalDeferred` exists as a global (from index.html script)
declare const OneSignalDeferred: any[]; // Declare the global variable
// Also declare the global OneSignal object for type safety/autocompletion (optional but good practice)
declare const OneSignal: any; // This will be the main OneSignal SDK object


declare let L: any;
declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private oneSignalAppId: string = 'b31dea3b-b87e-4436-9881-10265e024310';
  private isOneSignalSetupAttempted: boolean = false;

  status: any;
  resposeData: any;

  loginData = { "username": "", "password": "", "number": "", "otpmodel": "" };

  constructor(private _sharedservice: sharedservice,
    private http: Http,
    // public authService: AuthService,
    private router: Router) {
  }

  filterLoader: boolean = false;
  usernamelogin = false;
  numberlogin = true;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  previousMonthDateForCompare: any;
  currentLocation: any;
  ipAddress: any;
  otp: string[] = ['', '', '', ''];
  otpArray = new Array(4);
  @ViewChildren('otpInput') otpInputs: QueryList<ElementRef>;

  ngOnInit() {
    // this.scriptsloads();

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


    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
      this.usernamelogin = false;
      this.numberlogin = true;
      // if(this.router.url == "/adminlogin"){
      //   // this.router.navigateByUrl('/adminlogin');
      //   this.usernamelogin = true;
      //   this.numberlogin = false;
      // }else{

      // }
    } else if (localStorage.getItem('Role') != null) {
      if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
        this.router.navigateByUrl('/mandate-dashboard?todayvisited=1&from=&to=&dashtype=dashboard&htype=mandate&type=leads');
      } else {

      }
    }

    navigator.geolocation.getCurrentPosition((position) => {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      // this.reverseGeocode(latitude, longitude);
      getAddressFromCoordinates(latitude, longitude).then(data => {
        this.currentLocation = data;
        return this.currentLocation
      });
    });

    getIPAddress().then(ip => {
      this.ipAddress = ip;
      return this.ipAddress
    });

    // this.getLocation();
  }


  // getLocation() {
  //   fetch('https://ipapi.co/json/')
  //     .then(res => res.json())
  //     .then(data => {
  //     })
  //     .catch(err => console.error('Location fetch error:', err));
  // }

  scriptsloads() {
    var otp_inputs = document.querySelectorAll(".otp__digit");
    const elementArray = Array.from(otp_inputs);
    var mykey = "0123456789".split("");
    let values = Array(4);
    let clipData;
    (otp_inputs[0] as HTMLElement).focus();
    elementArray.forEach((element, index) => {

      const { value } = element as HTMLInputElement;
      element.addEventListener('keyup', (event: KeyboardEvent) => {
        // OLD MEthod

        let _finalKey = ""

        elementArray.forEach((element) => {
          const inputElement = element as HTMLInputElement;
          _finalKey += inputElement.value;
        });

        if (_finalKey.length == 4) {
          const otpElement = document.querySelector("#_otp");
          otpElement.classList.remove("_notok");
          otpElement.classList.add("_ok");
          $('#otpselected').val(_finalKey);
          this.loginData.otpmodel = _finalKey;
          this.otpverify();
        } else {
          const otpElement = document.querySelector("#_otp");
          otpElement.classList.remove("_ok");
          otpElement.classList.add("_notok");
          $('#verify-btn').attr('disabled', 'true');
        }
        // OLD MEthod
        if (element instanceof HTMLInputElement) {
          if (event.code === "Backspace" && hasNoValue(index)) {
            if (index > 0) (elementArray[index - 1] as HTMLElement).focus();
          }

          // else if any input move focus to next or out
          else if (element.value !== "") {
            (index < elementArray.length - 1) ? (elementArray[index + 1] as HTMLElement).focus() : element.blur();
          }
        }


        //add val to array to track prev vals
        values[index] = (event.target as HTMLInputElement).value;

      });

      element.addEventListener('input', () => {
        //replace digit if already exists
        if (element instanceof HTMLInputElement) {
          const numericValue = 10;
          const stringNumber = numericValue.toString();
          if (element.value > stringNumber) {
            element.value = String(Number(element.value) % Number(10));
          }
        }
      });
    })

    function hasNoValue(index) {
      if (values[index] || values[index] === 0)
        return false;
      return true;
    }
  }

  loginswap() {
    this.usernamelogin = !this.usernamelogin;
    this.numberlogin = !this.numberlogin;
  }

  // Method of Based on Username and Password
  loginold() {
    if ($('#name').val() == "") {
      $('#name').focus().css("border-color", "red").attr('placeholder', 'Please Enter your username');
      return false;
    } else {
      $('#name').removeAttr("style");
    }

    if ($('#password').val() == "") {
      $('#password').focus().css("border-color", "red").attr('placeholder', 'Please Enter your Password');
      return false;
    } else {
      $('#password').removeAttr("style");
    }
    this.filterLoader = true;

    let devicename = getBrowserName() + ' - ' + getPlatform();
    let param = {
      username: this.loginData.username,
      password: this.loginData.password,
      device: 'Desktop',
      browser: devicename
    }

    this._sharedservice.getlogin(param).subscribe((success) => {
      this.status = success.status;
      this.resposeData = success;
      if (this.status == "True") {
        localStorage.setItem('SessionId', success.session_id);
        this._sharedservice.getversion(success.details[0].executives_FKID).subscribe((data) => {
          this.filterLoader = false;
          if (data && data.Executives[0].active_status == '0') {
            var name = success.details[0].name;
            var number = success.details[0].number;
            var userid = success.details[0].executives_FKID;
            var mail = success.details[0].email;
            var roleid = success.details[0].role_IDFK;
            var deptid = success.details[0].department_IDFK;
            var role_type = success.details[0].role_type;
            var mandate_propidfk = success.details[0].mandate_propidfk;
            localStorage.setItem('Name', name);
            localStorage.setItem('Number', number);
            localStorage.setItem('UserId', userid);
            localStorage.setItem('Password', "xxxxxxx");
            localStorage.setItem('Mail', mail);
            localStorage.setItem('Role', roleid);
            localStorage.setItem('Department', deptid);
            localStorage.setItem('role_type', role_type);
            localStorage.setItem('property_ID', mandate_propidfk);
            localStorage.setItem('whatsappExecId', userid);
            localStorage.setItem('prop_suggest', success.details[0].prop_suggestion);

            this._sharedservice.setOnCallSelection('login');
            // ------------------------------------------------------------RELATED_TO_ONESIGNAL_PUSH------------------------------------------------------------
            const loggedInUserId = success.details[0].executives_FKID;
            // --- Trigger OneSignal Setup ONLY AFTER SUCCESSFUL LOGIN ---
            // Ensure setup runs only once per login session
            if (!this.isOneSignalSetupAttempted) {
              this.setupOneSignal(loggedInUserId.toString()); // Pass user ID as string
              this.isOneSignalSetupAttempted = true;
            }
            // ------------------------------------------------------------RELATED_TO_ONESIGNAL_PUSH------------------------------------------------------------


            // localStorage.setItem('userData', JSON.stringify(this.resposeData) )
            // if (localStorage.getItem('Department') == '10004') {
            //   if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
            //     this.router.navigateByUrl('/retail-dashboard?allvisits=1&from=&to=&dashtype=dashboard&htype=retail')
            //   } else if (localStorage.getItem('Role') == '50003' || localStorage.getItem('Role') == '50004') {
            //     this.router.navigateByUrl('/retail-dashboard?allvisits=1&from=&to=&dashtype=dashboard&htype=retail')
            //   } else {
            //     this.router.navigateByUrl('/mandate-dashboard?todayvisited=1&from=&to=&dashtype=dashboard&htype=mandate');
            //   }

            // } else {
            if (localStorage.getItem('Role') == null) {
              this.router.navigateByUrl('/login');
            } else if (localStorage.getItem('Role') != null) {
              if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
                this.router.navigateByUrl('/mandate-dashboard?todayvisited=1&from=&to=&dashtype=dashboard&htype=mandate&type=leads');
              } else if (localStorage.getItem('Role') == '50001' || localStorage.getItem('Role') == '50002' || localStorage.getItem('Role') == '50013' || localStorage.getItem('Role') == '50014') {
                this.router.navigateByUrl('/mandate-dashboard?todayvisited=1&from=&to=&property=&propname=&execid=&execname=&stage=&stagestatus=&team=&dashtype=dashboard&htype=mandate&type=leads')
              } else if (localStorage.getItem('Department') == '10003') {
                this.router.navigateByUrl('/campaignLeads?fresh=1&type=fresh');
              } else if (localStorage.getItem('Department') == '10005') {
                this.router.navigateByUrl('/source-dashboard?todayvisited=1&from=&to=&dashtype=dashboard');
              } else {
                swal({
                  title: 'Restricted Access!',
                  text: 'No account found with this credentials.',
                  type: 'error',
                  showConfirmButton: false,
                  timer: 3000
                }).then(() => {
                  this.router.navigateByUrl('/login');
                })
              }
              // else if(localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010'){
              //   this.router.navigateByUrl('retail-dashboard?allvisits=1&from=&to=')
              // }
              // else {
              //   this.router.navigateByUrl('/retail-dashboard?allvisits=1&from=&to=&dashtype=dashboard&htype=retail');
              // }
              // this.router.navigateByUrl('rmleadassign?todayscheduled=1&from=&to=');
              // localStorage.clear();
              // swal({
              //   title: 'Restricted Access!!',
              //   text: 'You are not authorized for this access. Please use OTP based login',
              //   type: 'error',
              //   confirmButtonText: 'OK'
              // })
              // }
              // }
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
          navigator.geolocation.getCurrentPosition((position) => {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            localStorage.setItem('latitude', latitude.toString())
            localStorage.setItem('longitude', longitude.toString())
            // this.reverseGeocode(latitude, longitude);
          })
        });
      }
      else {
        this.filterLoader = false;
        swal({
          title: 'Authentication Failed!',
          text: 'Please try agin',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }, (err) => {
      this.filterLoader = false;
      console.log("Connection Failed")
    });
  }

  // ------------------------------------------------------------RELATED_TO_ONESIGNAL_PUSH------------------------------------------------------------

  /**
   * Encapsulates OneSignal initialization and event handling logic.
   * This is called only when a user successfully logs in.
   * @param userId The authenticated user's ID.
   */
  private setupOneSignal(userId: string): void {
    console.log('Attempting OneSignal setup for userId:', userId);
    // Ensure OneSignalDeferred array exists before pushing
    (window as any).OneSignalDeferred = (window as any).OneSignalDeferred || [];

    // Push the setup logic to OneSignalDeferred
    (window as any).OneSignalDeferred.push(async (OneSignalInstance: any) => {

      // 1. Initialize OneSignal (only if not already initialized)
      if (!OneSignalInstance.initialized) { // Check if already initialized to prevent re-init issues
        await OneSignalInstance.init({
          appId: this.oneSignalAppId, // Use the property here
          allowLocalhostAsSecureOrigin: true,
          welcomeNotification: { disable: true }, // Disable default welcome
          autoResubscribe: true, // OneSignal tries to resubscribe lost subscriptions
        });
        console.log('OneSignal core initialized.');
      } else {
        console.log('OneSignal core already initialized.');
      }

      // --- IMPORTANT FIXES START HERE ---
      // Access OneSignal modules via the global 'OneSignal' object after init
      // You must wait for init() to complete before accessing User or Notifications modules
      const OneSignalGlobal = (window as any).OneSignal;
      console.log('One signal Data - ', OneSignalGlobal.User);

      // 2. Set External User ID
      try {
        OneSignal.login(userId);
        console.log("OneSignal External User ID set:", userId);
      } catch (error) {
        console.error("Error setting OneSignal External User ID:", error);
      }

      // 3. Request Permission
      try {
        // const accepted = await OneSignalGlobal.Notifications.requestPermission(true);
        // console.log("User accepted notifications: " + accepted);
        // if (accepted) {
        //   this.sendPlayerIdToBackend(userId, OneSignalGlobal);
        // }else{
        //   swal({
        //     title: 'Notification Required',
        //     text: 'Push notifications are mandatory for using this application. Please allow notifications.',
        //     type: "warning",
        //     showConfirmButton: true,
        //     allowOutsideClick: false,
        //     confirmButtonText: "OK",
        //   }).then(() => {
        //     localStorage.clear();
        //     setTimeout(() =>
        //       this.router.navigate(['/login'])
        //       , 100);
        //       this.echoService.disconnectSocket();
        //   });
        // }

        OneSignalGlobal.Notifications.requestPermission(true).then((accepted) => {
          console.log("User accepted notifications: " + accepted);
          // if (accepted) {
          this.sendPlayerIdToBackend(userId, OneSignalGlobal);
          // }else{
          //   swal({
          //     title: 'Notification Required',
          //     text: 'Push notifications are mandatory for using this application. Please allow notifications.',
          //     type: "warning",
          //     showConfirmButton: true,
          //     allowOutsideClick: false,
          //     confirmButtonText: "OK",
          //   }).then(() => {
          //     localStorage.clear();
          //     setTimeout(() =>
          //       this.router.navigate(['/login'])
          //       , 100);
          //       this.echoService.disconnectSocket();
          //   });
          // }
        });

      } catch (error) {
        console.error("Error handling OneSignal permissions:", error);
      }

      // 4. Add Event Listeners (ensure these are added only once)
      // Check if listeners are already registered to prevent duplicates if `setupOneSignal` is called multiple times
      if (!(window as any)._oneSignalListenersAdded) {
        OneSignalGlobal.on('subscriptionChange', (isSubscribed: boolean) => {
          console.log("OneSignal: User subscription status changed:", isSubscribed);
          if (isSubscribed) {
            // this.sendPlayerIdToBackend(userId, OneSignalGlobal);
          }
        });
        (window as any)._oneSignalListenersAdded = true; // Set flag
      }
    });
  }

  private async sendPlayerIdToBackend(userId: string, OneSignalGlobal: any): Promise<void> {
    // const playerId = await OneSignalGlobal.User.getPushSubscriptionId(); // Use getPushSubscriptionId for v16
    // const playerId = OneSignal.User.PushSubscription.id;
    try {
      // It's more reliable to get the subscription object and then its ID
      const pushSubscription = await OneSignalGlobal.User.getPushSubscription();
      const playerId = pushSubscription ? pushSubscription.id : null;
      if (playerId && userId) {
        let param = {
          userid: userId,
          subscriberid: playerId
        }
        this._sharedservice.onesignalpush(param).subscribe((success) => {
          this.status = success.status;
          if (this.status == "True") {
            swal({
              title: 'Notification Permission Granted',
              text: 'Onesignal Player ID Stored Success',
              type: 'success',
            })
          } else {
            // swal({
            //   title: 'Some Thing Error Occured!',
            //   text: 'Onesignal Player ID Not Stored',
            //   type: 'error',
            // })
          }
        }, (err) => {
          this.filterLoader = false;
          console.log("Connection Failed")
        });

      } else {
        console.warn("OneSignal Player ID or User ID is missing, cannot send to backend.");
      }
    } catch (error) {
      console.error("Error getting PushSubscription ID:", error);
      // swal({
      //   title: 'Subscription Error',
      //   text: 'Could not retrieve OneSignal subscription ID.',
      //   icon: 'error',
      // });
    }
  }

  // ------------------------------------------------------------RELATED_TO_ONESIGNAL_PUSH------------------------------------------------------------


  // reverseGeocode(lat: number, lon: number) {
  //   const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  //   fetch(geocodeUrl)
  //     .then(response => response.json())
  //     .then(data => {
  //       const address = data.display_name;
  //     })
  //     .catch(error => {
  //       console.error('Error fetching address:', error);
  //     });
  // }

  // OTP Based Login
  login() {

    if ($('#number').val() == "") {
      $('#number').focus().css("border-color", "red").attr('placeholder', 'Please Enter Your Registered Number');
      return false;
    }
    else {
      var mobileno = /^[0-9]{10}$/;
      if (mobileno.test($('#number').val())) {
        $('#number').removeAttr("style");
      }
      else {
        $('#number').focus().css("border-color", "red").attr('placeholder', 'Please enter valid contact number').val('');
        return false;
      }
      $('#number').removeAttr("style");
    }

    this.filterLoader = true;
    this._sharedservice.loginotpsend(this.loginData.number).subscribe((success) => {
      this.status = success.status;
      this.resposeData = success;
      if (this.status == "True") {
        this.filterLoader = false;
        $('#modalclick').click();
        setTimeout(() => {
          const inputs = this.otpInputs.toArray();
          if (inputs.length > 0) {
            inputs[0].nativeElement.focus();
          }
        }, 1000)
        var fiveMinutes = 30 * 1,
          display = document.querySelector('#time');
        this.startTimer(fiveMinutes, display);
      }
      else {
        this.filterLoader = false;
        swal({
          title: 'Number Not Registered',
          text: 'Please check your number',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    });


  }

  // OTP Based Login
  startTimer(duration, display) {
    let timer: number = duration;
    let minutes: number;
    let seconds: number;
    const __timer1 = setInterval(() => {
      minutes = Math.floor(timer / 60); // Calculate minutes as integer
      seconds = timer % 60; // Calculate seconds as integer

      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
      const formattedSeconds = seconds < 10 ? "0" + seconds : seconds.toString();
      display.textContent = formattedMinutes + ":" + formattedSeconds;

      if (--timer < 0) {
        clearInterval(__timer1);
        $('.otpresend').removeAttr("style");
        display.textContent = "00:00";
      }
    }, 1000);
  }

  otpresend() {
    this.filterLoader = true;
    this._sharedservice.loginotpsend(this.loginData.number).subscribe((success) => {
      this.status = success.status;
      this.resposeData = success;
      if (this.status == "True") {
        this.filterLoader = false;
        $('.otpresend').attr('style', 'display:none');
        setTimeout(() => {
          const inputs = this.otpInputs.toArray();
          if (inputs.length > 0) {
            inputs[0].nativeElement.focus();
          }
        }, 1000)
        var fiveMinutes = 30 * 1,
          display = document.querySelector('#time');
        this.startTimer(fiveMinutes, display);
      }
      else {
        this.filterLoader = false;
        swal({
          title: 'Number Not Registered',
          text: 'Please check your number',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    });
  }

  //here get ip and get location is slow because of promise.Here the issue ,api is triggered before the resposne of get location and get ip  so, after the reposne of location and ip the API should be triggered same like loginold method.
  otpverify() {
    this.filterLoader = true;
    this._sharedservice.otpvalidate(this.loginData.otpmodel, this.loginData.number).subscribe((success) => {
      var status = success['status'];
      if (status == "True") {
        var logindata = success['success'][0];

        let devicename = getBrowserName() + ' - ' + getPlatform();

        let param = {
          username: logindata.email,
          password: logindata.password,
          device: 'Desktop',
          browser: devicename
        }

        this._sharedservice.getlogin(param).subscribe((success) => {
          this.status = success.status;
          this.resposeData = success;
          if (this.status == "True") {
            // localStorage.setItem('SessionId', success.session_id);
            // this.filterLoader = false;
            // var name = success.details[0].name;
            // var userid = success.details[0].executives_FKID;
            // var mail = success.details[0].email;
            // var roleid = success.details[0].role_IDFK;
            // var deptid = success.details[0].department_IDFK;
            // var sessionId = success.sesion_id;
            // localStorage.setItem('Name', name);
            // localStorage.setItem('UserId', userid);
            // localStorage.setItem('Password', "xxxxxxx");
            // localStorage.setItem('Mail', mail);
            // localStorage.setItem('Role', roleid);
            // localStorage.setItem('Department', deptid);
            // localStorage.setItem('SessionId', sessionId);
            // // localStorage.setItem('userData', JSON.stringify(this.resposeData) )
            // if (localStorage.getItem('Department') == '10004') {
            //   if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
            //     this.router.navigateByUrl('/retail-dashboard?allvisits=1&from=&to=&dashtype=dashboard&htype=retail')
            //   } else if (localStorage.getItem('Role') == '50003' || localStorage.getItem('Role') == '50004') {
            //     this.router.navigateByUrl('/retail-dashboard?allvisits=1&from=&to=&dashtype=dashboard&htype=retail')
            //   } else {
            //     this.router.navigateByUrl('/mandateleads?freshid=2');
            //   }
            // } else {
            //   if (localStorage.getItem('Role') == null) {
            //     this.router.navigateByUrl('/login');
            //   }
            //   else if (localStorage.getItem('Role') != null) {
            //     if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
            //       this.router.navigateByUrl('/Enquiry');
            //     }
            //     else if (localStorage.getItem('Role') == '50002' || localStorage.getItem('Role') == '50001') {
            //       this.router.navigateByUrl('mandate-dashboard?allvisits=1&from=&to=&dashtype=dashboard&htype=mandate');
            //     }
            //     // else if(localStorage.getItem('Role') == '50011')
            //     // {
            //     //   this.router.navigateByUrl('/clientleads');
            //     // }
            //     // else if(localStorage.getItem('Role') == '50004')
            //     // {
            //     //   // this.router.navigateByUrl('CSExecutive/Dashboard');
            //     //   this.router.navigateByUrl('csleadassign?allassigned=1&from=&to=');
            //     // }
            //   }
            // }
            localStorage.setItem('SessionId', success.session_id);
            this._sharedservice.getversion(success.details[0].executives_FKID).subscribe((data) => {
              this.filterLoader = false;
              if (data && data.Executives[0].active_status == '0') {
                var name = success.details[0].name;
                var number = success.details[0].number;
                var userid = success.details[0].executives_FKID;
                var mail = success.details[0].email;
                var roleid = success.details[0].role_IDFK;
                var deptid = success.details[0].department_IDFK;
                var role_type = success.details[0].role_type;
                var mandate_propidfk = success.details[0].mandate_propidfk;
                localStorage.setItem('Name', name);
                localStorage.setItem('Number', number);
                localStorage.setItem('UserId', userid);
                localStorage.setItem('Password', "xxxxxxx");
                localStorage.setItem('Mail', mail);
                localStorage.setItem('Role', roleid);
                localStorage.setItem('Department', deptid);
                localStorage.setItem('role_type', role_type);
                localStorage.setItem('property_ID', mandate_propidfk);
                localStorage.setItem('whatsappExecId', userid);
                localStorage.setItem('prop_suggest', success.details[0].prop_suggestion);

                this._sharedservice.setOnCallSelection('login');

                // ------------------------------------------------------------RELATED_TO_ONESIGNAL_PUSH------------------------------------------------------------
                const loggedInUserId = success.details[0].executives_FKID;
                // --- Trigger OneSignal Setup ONLY AFTER SUCCESSFUL LOGIN ---
                // Ensure setup runs only once per login session
                if (!this.isOneSignalSetupAttempted) {
                  this.setupOneSignal(loggedInUserId.toString()); // Pass user ID as string
                  this.isOneSignalSetupAttempted = true;
                }
                // ------------------------------------------------------------RELATED_TO_ONESIGNAL_PUSH------------------------------------------------------------


                // if (localStorage.getItem('Department') == '10004') {
                //   if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
                //     this.router.navigateByUrl('/retail-dashboard?allvisits=1&from=&to=&dashtype=dashboard&htype=retail')
                //   } else if (localStorage.getItem('Role') == '50003' || localStorage.getItem('Role') == '50004') {
                //     this.router.navigateByUrl('/retail-dashboard?allvisits=1&from=&to=&dashtype=dashboard&htype=retail')
                //   } else {
                //    this.router.navigateByUrl('/mandate-dashboard?todayvisited=1&from=&to=&dashtype=dashboard&htype=mandate');
                //   }
                // } else if (localStorage.getItem('Department') == '10003') {
                //   this.router.navigateByUrl('/campaignLeads?fresh=1&type=fresh');
                // } else {
                if (localStorage.getItem('Role') == null) {
                  this.router.navigateByUrl('/login');
                } else if (localStorage.getItem('Role') != null) {
                  if (localStorage.getItem('Role') == '1' || localStorage.getItem('Role') == '2') {
                    this.router.navigateByUrl('/mandate-dashboard?todayvisited=1&from=&to=&dashtype=dashboard&htype=mandate&type=leads');
                  } else if (localStorage.getItem('Role') == '50001' || localStorage.getItem('Role') == '50002' || localStorage.getItem('Role') == '50013' || localStorage.getItem('Role') == '50014') {
                    this.router.navigateByUrl('/mandate-dashboard?todayvisited=1&from=&to=&property=&propname=&execid=&execname=&stage=&stagestatus=&team=&dashtype=dashboard&htype=mandate&type=leads')
                  } else if (localStorage.getItem('Department') == '10003') {
                    this.router.navigateByUrl('/campaignLeads?fresh=1&type=fresh');
                  } else if (localStorage.getItem('Department') == '10005') {
                    this.router.navigateByUrl('/source-dashboard?todayvisited=1&from=&to=&dashtype=dashboard');
                  } else {
                    swal({
                      title: 'Restricted Access!',
                      text: 'No account found with this credentials.',
                      type: 'error',
                      showConfirmButton: false,
                      timer: 3000
                    }).then(() => {
                      this.router.navigateByUrl('/login');
                    })
                  }
                  // else {
                  //   this.router.navigateByUrl('/retail-dashboard?allvisits=1&from=&to=&dashtype=dashboard&htype=retail');
                  // }
                  // }
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
              navigator.geolocation.getCurrentPosition((position) => {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                // this.reverseGeocode(latitude, longitude);
              })
            });
            $('.modal-backdrop').removeClass('fade');
            $('.modal-backdrop').removeClass('show');
            $('.modal-backdrop').removeClass('modal-backdrop');
          }
          else {
            swal({
              title: 'Authentication Failed!',
              text: 'Please try agin',
              type: 'error',
              confirmButtonText: 'OK',
            })
          }
        }, (err) => {
          console.log("Connection Failed")
        });
      }
      else {
        this.filterLoader = false;
        swal({
          title: 'Oops Something Error!',
          text: 'Its Not a valid OTP / OTP Expired!',
          type: 'error',
          showConfirmButton: false,
          timer: 3000
        }).then(function () {
        });
      }
    }, (err) => {
      console.log("Connection Failed")
    });

  }

  //on click on view it shows the password and after 2seconds it gets hidded automatically.
  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = 'text';

    // After 2 seconds, revert the input type back to 'password'
    setTimeout(() => {
      passwordInput.type = 'password';
    }, 1500);
  }

  onInputChange(event: any, index: number): void {
    const input = event.target;
    const value = input.value;

    // Move to next input if value exists
    if (value.length === 1 && index < this.otp.length - 1) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      nextInput.nativeElement.focus();
    }

    // Check if all inputs are filled
    if (this.otp.every(d => d.length === 1)) {
      const fullOtp = this.otp.join('');
      this.loginData.otpmodel = fullOtp;
      this.otpverify();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      prevInput.nativeElement.focus();
    }
  }

  closeOtpModal() {
    this.otp = ['', '', '', ''];
  }

  //send latitude and longitude while login time.
  sendLonLat(lat, long) {
    let param = {
      loginid: localStorage.getItem('UserId'),
      device: 'Desktop',
      lat: lat,
      long: long
    }
    this._sharedservice.postLoggedLocation(param).subscribe((resp) => {
    })
  }

}

function getBrowserName() {
  const userAgent = navigator.userAgent;

  if (userAgent.indexOf("Edg/") > -1) {
    return "Microsoft Edge";
  }
  else if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Edg/") === -1) {
    return "Google Chrome";
  }
  else if (userAgent.indexOf("Firefox") > -1) {
    return "Mozilla Firefox";
  }
  else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
    return "Safari";
  }
  else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
    return "Internet Explorer";
  }

}

function getPlatform() {
  const platform = navigator.platform;

  if (platform.indexOf("Win") !== -1) {
    return "Windows";
  }

  if (platform.indexOf("Mac") !== -1) {
    return "macOS";
  }

  if (platform.indexOf("Linux") !== -1) {
    return "Linux";
  }

  if (platform.indexOf("Android") !== -1) {
    return "Android";
  }

  if (platform.indexOf("iPhone") !== -1 || platform.indexOf("iPad") !== -1 || platform.indexOf("iPod") !== -1) {
    return "iOS";
  }
  return "Unknown Platform";
}

function getIPAddress() {
  return fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => data.ip)
    .catch(error => {
      console.error('Error fetching IP address:', error);
      return 'Unable to retrieve IP';
    });
}

function getAddressFromCoordinates(lat, lon) {
  const apiKey = 'aa1c34969145491e87a1dca26c7d2783';
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const address = data.features[0].properties;
        const fullAddress = address.suburb + ', ' + address.state_district + ', ' + address.state;
        return fullAddress;
      } else {
        throw new Error('No address found for these coordinates.');
      }
    })
    .catch(error => {
      console.error('Error fetching address:', error);
      return 'Error fetching address';
    });
}