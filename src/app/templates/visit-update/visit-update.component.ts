import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { sharedservice } from '../../shared.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../mandate.service';

declare var Swal: any;
declare var $;

@Component({
  selector: 'app-visit-update',
  templateUrl: './visit-update.component.html',
  styleUrls: ['./visit-update.component.css']
})
export class VisitUpdateComponent implements OnInit {

  constructor(
    private _sharedService: sharedservice,
    private _mandateService: mandateservice,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  filterLoader: boolean = true;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  sitaraParam: any;
  samskruthiParam: any;
  swaraParam: any;
  revivaParam: any;
  ranavParam: any;
  username: any;
  usernumber: any;
  usermail: any;
  userRemarks: any;
  userbhksize: any;
  userPriority: any;
  userbudget: any;
  usersource: any;
  rsvcount: number = 0;
  exevutivesList: any;
  cpList: any;
  cpname: any;
  selectedCP: any;
  isExistChecker: boolean = true;
  isFreshExist: boolean = false;
  isRsvExist: boolean = false;
  roleid: any;
  leadResponse: any = '';
  leadResponseStatus: any;
  selectedexec: any;
  otpnumber: any;
  otp: string[] = ['', '', '', ''];
  otpArray = new Array(4);
  @ViewChildren('otpInput') otpInputs: QueryList<ElementRef>;
  role_type: any;
  userid: any;
  existingExecutivesList: any[] = [];
  accessShareExecid: any;
  selectedType: string = '';

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');
    this.role_type = localStorage.getItem('role_type');
    this.userid = localStorage.getItem('UserId');
    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });
    this.getVisitData();
    this.selectedType = '';
    this.accessShareExecid = '';
    this.existingExecutivesList = [];
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  //here get the params based refresh
  getVisitData() {
    this.route.queryParams.subscribe((params) => {
      this.sitaraParam = params['sitara'];
      this.samskruthiParam = params['samskruthi'];
      this.swaraParam = params['swara'];
      this.ranavParam = params['ranav'];
      this.revivaParam = params['reviva']

      this.getExecutivesList();
    })
  }

  //here we get the list of executive list based on the selected property
  getExecutivesList() {
    let propId;
    if (this.sitaraParam == 1) {
      propId = 16793;
    } else if (this.samskruthiParam == 1) {
      propId = 1830;
    } else if (this.swaraParam == 1) {
      propId = 82668;
    } else if (this.ranavParam == 1) {
      propId = 28773;
    } else if (this.revivaParam == 1) {
      propId = 80459;
    }

    let teamlead;
    if (this.role_type == 1) {
      teamlead = this.userid
    } else {
      teamlead = '';
    }

    this._mandateService.fetchmandateexecutuves(propId, '', '', teamlead).subscribe(executives => {
      this.filterLoader = false;
      if (executives['status'] == 'True') {
        this.exevutivesList = executives['mandateexecutives'];
      } else {
        this.exevutivesList = [];
      }
    });
  }

  //here we get the selected cp list , if the selected source is channel partner
  getCpList() {
    this._mandateService.cplists().subscribe((resp) => {
      this.cpList = resp;
    })
  }

  //here we check number is valid or no(validating)
  checkNumberValidate() {
    if (this.usernumber.length == '10') {
      var mobilee = /^[0-9]{10}$/;
      if (mobilee.test($('#number').val())) {
        $('#number').removeAttr('style');
        this.checkLeadExister();
      } else {
        $('#number').focus().css('border-color', 'red').attr('placeholder', 'Please enter valid contact number').val('');
        return false;
      }
      return false;
    }
  }

  //here we trigger the API to check whether the number exist or no
  checkLeadExister() {

    Swal.fire({
      title: 'Checking Lead in DataBase',
      text: 'Please Wait...........',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
      },
    })

    let propId;
    if (this.sitaraParam == 1) {
      propId = 16793;
    } else if (this.samskruthiParam == 1) {
      propId = 1830;
    } else if (this.swaraParam == 1) {
      propId = 82668;
    } else if (this.ranavParam == 1) {
      propId = 28773;
    } else if (this.revivaParam == 1) {
      propId = 80459;
    }
    let param = {
      number: this.usernumber,
      propertyId: propId,
      executiveid: localStorage.getItem('UserId')
    }

    this._mandateService.getLeadExister(param).subscribe((resp) => {
      this.isExistChecker = false;
      var datastatus = resp['success'];
      this.leadResponse = resp['success'];
      this.leadResponseStatus = resp;
      this.existingExecutivesList = resp.teammates;
      if (resp.status == '0') {
        this.rsvcount = 0;
        Swal.fire({
          title: 'Checking Lead in Database',
          html: 'Please Wait...........',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            // const b = Swal.getHtmlContainer().querySelector('b')
          },
        }).then(() => {
          Swal.fire({
            title: "Found as Fresh Visit",
            text: 'Please Fill the Relevant Details.',
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          }).then(function () {
            // this.username = ' ';
            // this.usermail = ' ';
            $('#name').val('');
            $('#custmail').val('');
            $('#sendproperty2').val('');
            $('#remarks2').val('');
            $('#sourceselected2').val('');
            $('#sizeselect2').val('');
            $('#budgetselect2').val('');

            setTimeout(() => {
              $('.freshvisitvisiblesection').removeAttr('style');
              $('.revisitvisiblesection').attr("style", "display:none;");
            }, 100)
            // $('.height_fix').attr("style", "height:none;");
          });
        });
      } else if (resp.status == '2') {
        Swal.fire({
          title: 'Checking Lead in Database',
          html: 'Please Wait...........',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
          },
        }).then(() => {
          Swal.fire({
            title: "Found as Existing Lead in our Database",
            text: 'Please Fill the Relevant Details.',
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          }).then(() => {
            if (datastatus && datastatus.length > 0) {
              this.username = datastatus[0].customer_name;
              this.usermail = datastatus[0].customer_mail;
              if (datastatus && datastatus[0].visited_count) {
                this.rsvcount = datastatus[0].visited_count;
              } else {
                this.rsvcount = 0;
              }
            } else {
              this.username = datastatus.customer_name;
              this.usermail = datastatus.customer_mail;
              if (datastatus && datastatus.visited_count) {
                this.rsvcount = datastatus.visited_count;
              } else {
                this.rsvcount = 0;
              }
            }
            $('.freshvisitvisiblesection').removeAttr('style');
            $('.revisitvisiblesection').attr("style", "display:none;");
          });
        });

      } else if (resp.status == '1') {
        Swal.fire({
          title: "Fetching the Details",
          text: 'Please Wait...........',
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
          },
        }).then(() => {
          if (datastatus && datastatus.length > 0) {
            this.rsvcount = datastatus[0].visited_count;
            $('.revisitvisiblesection').removeAttr('style');
            $('.freshvisitvisiblesection').attr("style", "display:none;");
            this.username = datastatus[0].enquiry_name;
            this.usermail = datastatus[0].enquiry_mail;
            let MySQLDate = datastatus[0].added_datetime;
            let date;
            if (MySQLDate) {
              date = MySQLDate.replace(/[-]/g, '/');
            }
            date = Date.parse(date);
            let jsDate = new Date(date);
            $('#visiteddate').val(jsDate);
            let MySQLDate2 = datastatus[0].rsvlastvisitdate;
            let date2
            if (MySQLDate2) {
              date2 = MySQLDate2.replace(/[-]/g, '/');
            }
            date2 = Date.parse(date2);
            let jsDate2 = new Date(date2);
            $('#lastvisiteddate').val(jsDate2);
            $('#lastvisiteddate').val(jsDate2);
            // $('#sizeselect2').val(datastatus[0].enquiry_bhksize);
            // $('#budgetselect2').val(datastatus[0].enquiry_budget);
            $('#sendproperty2').val(datastatus[0].accompanied_rm);
            $('#remarks2').val(datastatus[0].remarks);
            $('#sourceselected2').val(datastatus[0].enquiry_source + "-" + datastatus[0].cp_name);
          }
        })
      } else {
        Swal.fire({
          title: "Something Error Occured!",
          icon: "error"
        }).then(() => {
        });
      }
    })
  }

  //here we the selected executives
  rmchange(event) {
  }

  // here we get the selected CP , if the selected source is channel partner
  cpchange(event) {
    this.selectedCP = event.value;
  }

  //here we get the selected the bhk size.
  sizeselection(event) {
    var value = event.target.value;
    const a = document.getElementById("sizeselect") as HTMLInputElement;
    a.value = value;
    this.userbhksize = value;
  }

  //here we the selected budget
  budgetselection(event) {
    var value = event.target.value;
    const a = document.getElementById("budgetselect") as HTMLInputElement;
    a.value = value;
    this.userbudget = value;
  }

  //here we get the selected Priority
  prioritySelect(event) {
    var value = event.target.value;
    const a = document.getElementById("priorityselect") as HTMLInputElement;
    a.value = value;
    this.userPriority = value;
  }

  //here we get the source selection
  sourceselection(event) {
    var value = event.target.value;
    const a = document.getElementById("sourceselect") as HTMLInputElement;
    a.value = value;
    this.usersource = value;

    if (this.usersource == 'Channel Partners-Walkin') {
      this.getCpList();
    }
  }

  //if the entered number is fresh , we created a fresh direct lead from the panel.
  freshVisitFix() {

    if ((this.username == "" && this.username.trim()) || this.username == undefined || this.username == null) {
      $('#name').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      $('#closeExisitingmodal').click();
      return false;
    } else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test(this.username)) {
        $('#name').removeAttr("style");
      } else {
        this.username = '';
        $('#name').focus().css("border-color", "red").attr('placeholder', 'Please enter valid name');
        $('#closeExisitingmodal').click();
        return false;
      }
      $('#name').removeAttr("style");
    }

    if (this.usernumber == "" || this.usernumber == undefined || this.usernumber == null) {
      $('#number').focus().css("border-color", "red").attr('placeholder', 'Please Enter Phone Number');
      $('#closeExisitingmodal').click();
      return false;
    } else {
      var mobileno = /^[0-9]{10}$/;
      if (mobileno.test($('#number').val())) {
        $('#number').removeAttr("style");
      } else {
        $('#number').focus().css("border-color", "red").attr('placeholder', 'Please enter valid contact number').val('');
        $('#closeExisitingmodal').click();
        return false;
      }
      $('#number').removeAttr("style");
    }

    if (this.usermail != '' && this.usermail != null && this.usermail != undefined) {
      var email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
      if (email.test(this.usermail)) {
        $('#custmail').removeAttr("style");
      } else {
        this.usermail = '';
        $('#closeExisitingmodal').click();
        $('#custmail').focus().css("border-color", "red").attr('placeholder', 'Please Enter valid email-id').val('');
        return false;
      }
    }

    if ((this.selectedexec == "" || this.selectedexec == undefined || this.selectedexec == null) && (this.roleid == 1 || this.roleid == 2)) {
      Swal.fire({
        title: 'Please select the Executive',
        text: "Select any one Executive ",
        icon: 'error',
        showConfirmButton: true,
      })
      $('#closeExisitingmodal').click();
      return false;
    } else {
      $('#rm_dropdown').removeAttr("style");
    }

    if (this.userbhksize == "" || this.userbhksize == undefined || this.userbhksize == null) {
      Swal.fire({
        title: 'Please select the Size',
        text: "Select any BHK for the Final Submission",
        icon: 'error',
        showConfirmButton: true,
      })
      $('#closeExisitingmodal').click();
      return false;
    }

    if (this.userbudget == "" || this.userbudget == undefined || this.userbudget == null) {
      Swal.fire({
        title: 'Please select the Budget',
        text: "Select any budget range ",
        icon: 'error',
        showConfirmButton: true,
      })
      $('#closeExisitingmodal').click();
      return false;
    }

    if (this.userPriority == "" || this.userPriority == undefined || this.userPriority == null) {
      Swal.fire({
        title: 'Please select a Priority',
        text: "Select the Priority Type ",
        icon: 'error',
        showConfirmButton: true,
      })
      $('#closeExisitingmodal').click();
      return false;
    }

    if (this.usersource == "" || this.usersource == undefined || this.usersource == null) {
      Swal.fire({
        title: 'Please select the Source',
        text: "Select any Source ",
        icon: 'error',
        showConfirmButton: true,
      })
      $('#closeExisitingmodal').click();
      return false;
    }

    // Swal.fire({
    //   title: "Are you sure?",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "Green",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "OTP Based",
    //   cancelButtonText: "Without OTP",
    //   allowOutsideClick: false,
    //   allowEscapeKey: false,
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //
    if (this.leadResponseStatus.status == '2') {
      this.freshLeadCretion('2')
    } else if (this.leadResponseStatus.status == '0') {

      // setTimeout(() => {
      //   const inputs = this.otpInputs.toArray();
      //   if (inputs.length > 0) {
      //     inputs[0].nativeElement.focus();
      //   }
      // }, 1000)
      let number = this.usernumber
      this.filterLoader = true
      this._mandateService.otpsend(number).subscribe((success) => {
        if (success.status == 'False') {
          this.filterLoader = false
          Swal.fire({
            title: "Something Error Occured!",
            icon: "error"
          });
        } else {
          $('#modalotpclick').click();
          setTimeout(() => {
            setTimeout(() => {
              const inputs = this.otpInputs.toArray();
              if (inputs.length > 0) {
                inputs[0].nativeElement.focus();
              }
            }, 1000)
            var fiveMinutes = 30 * 1,
              display = document.querySelector('#time');
            this.startTimer(fiveMinutes, display);
            this.filterLoader = false
          }, 0)
        }
      })
    }
    //
    //   } else if (result.dismiss == 'cancel') {
    //     this.freshLeadCretion('2')
    //   }
    // });
  }

  freshLeadCretion(otpval) {
    this.filterLoader = true;
    let propId, propname;
    if (this.sitaraParam == 1) {
      propId = 16793;
      propname = 'GR Sitara';
    } else if (this.samskruthiParam == 1) {
      propId = 1830;
      propname = 'GR Samskruthi';
    } else if (this.swaraParam == 1) {
      propId = 82668;
      propname = 'GR Swara';
    } else if (this.ranavParam == 1) {
      propId = 28773;
      propname = 'Ranav Tranquil Haven';
    } else if (this.revivaParam == 1) {
      propId = 80459;
      propname = 'Reviva By SSI'
    }

    let cpname, cpmail, cpid;
    if (this.usersource == 'Channel Partners-Walkin') {
      cpid = this.selectedCP.CP_IDPK;
      cpmail = this.selectedCP.CP_MAIL;
      cpname = this.selectedCP.CP_NAME;
    } else if (this.usersource == 'Reference' || this.usersource == 'Hoarding') {
      cpid = 'XXXXX';
      cpmail = 'XXXXX';
      cpname = this.cpname;
    } else {
      cpid = 'XXXXX';
      cpmail = 'XXXXX';
      cpname = '';
    }

    let executive = this.exevutivesList.filter((exec) => { return exec.id == this.selectedexec });
    let execname, execid;
    if (this.roleid == 1 || this.roleid == 2) {
      if (this.accessShareExecid) {
        if (executive[0].id != this.accessShareExecid[0].Exec_IDFK) {
          execid = executive[0].id + ',' + this.accessShareExecid[0].Exec_IDFK;
          execname = executive[0].name + ',' + this.accessShareExecid[0].execname;
        } else {
          execid = executive[0].id;
          execname = executive[0].name;
        }
      } else {
        execid = executive[0].id;
        execname = executive[0].name;
      }
    } else {
      if (this.accessShareExecid && this.role_type == 1) {
        if (localStorage.getItem('UserId') == this.accessShareExecid[0].Exec_IDFK) {
          execid = localStorage.getItem('UserId');
          execname = localStorage.getItem('Name');
        } else {
          execid = localStorage.getItem('UserId') + ',' + this.accessShareExecid[0].Exec_IDFK;
          execname = localStorage.getItem('Name') + ',' + this.accessShareExecid[0].execname;
        }
      } else {
        execid = localStorage.getItem('UserId');
        execname = localStorage.getItem('Name');
      }
    }


    let param = {
      client: this.username,
      clientnum: this.usernumber,
      clientmail: this.usermail,
      bhksize: this.userbhksize,
      budgetrange: this.userbudget,
      priority: this.userPriority,
      execname: execname,
      execid: execid,
      source: this.usersource,
      cpname: cpname,
      cpid: cpid,
      cpmail: cpmail,
      otpbased: otpval,
      propertyId: propId,
      remarks: this.userRemarks
    }
    this._mandateService.adminmailsend(param).subscribe((success) => {
      var status = success.status;
      var data = success.success;
      this.filterLoader = false;
      document.body.style.overflowY = 'scroll';
      var status = success['status'];
      if (status == '0') {
        Swal.fire({
          title: "Form Submitted Successfully!",
          text: `Congratulations!! Its a Non Existing Client. Thank You for Visit ${propname}`,
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        });
      } else if (status == '1') {
        Swal.fire({
          title: "Form Submitted Successfully!",
          text: `Oh Oh!! Its an Existing Client with Us. Thank You for Visit ${propname}`,
          icon: "warning",
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        });
      } else if (status == '2') {
        Swal.fire({
          title: "Form Submitted Successfully!",
          text: `Oh Oh!! Its an Existing Client with Us. Thank You for Visit ${propname}`,
          icon: "warning",
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        });
      } else {
        Swal.fire({
          title: "Something Error Occured!",
          icon: "error"
        }).then(function () {
        });
      }
    })
  }

  //if the visit is done multiple times for same customer , this API is triggered.
  reVisitDone() {
    let username = this.username.trim();
    if (username == "" || username == undefined || username == null) {
      $('#name').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      $('#closeExisitingmodal').click();
      return false;
    } else {
      $('#name').removeAttr("style");
    }

    if (this.usernumber == "" || this.usernumber == undefined || this.usernumber == null) {
      $('#number').focus().css("border-color", "red").attr('placeholder', 'Please Enter Phone Number');
      $('#closeExisitingmodal').click();
      return false;
    } else {
      var mobileno = /^[0-9]{10}$/;
      if (mobileno.test($('#number').val())) {
        $('#number').removeAttr("style");
      } else {
        $('#number').focus().css("border-color", "red").attr('placeholder', 'Please enter valid contact number').val('');
        $('#closeExisitingmodal').click();
        return false;
      }
      $('#number').removeAttr("style");
    }

    if ((this.selectedexec == "" || this.selectedexec == undefined || this.selectedexec == null) && (this.roleid == 1 || this.roleid == 2)) {
      Swal.fire({
        title: 'Please select the Executive',
        text: "Select any one Executive ",
        icon: 'error',
        showConfirmButton: true,
      })
      $('#closeExisitingmodal').click();
      return false;
    } else {
      $('#rm_dropdown').removeAttr("style");
    }

    if (this.userPriority == "" || this.userPriority == undefined || this.userPriority == null) {
      Swal.fire({
        title: 'Please select a Priority',
        text: "Select the Priority Type ",
        icon: 'error',
        showConfirmButton: true,
      })
      $('#closeExisitingmodal').click();
      return false;
    }

    let executive = this.exevutivesList.filter((exec) => { return exec.id == this.selectedexec });

    let propId;
    if (this.sitaraParam == 1) {
      propId = 16793;
    } else if (this.samskruthiParam == 1) {
      propId = 1830;
    } else if (this.swaraParam == 1) {
      propId = 82668;
    } else if (this.ranavParam == 1) {
      propId = 28773;
    } else if (this.revivaParam == 1) {
      propId = 80459;
    }

    let execname, execid;
    if (this.roleid == 1 || this.roleid == 2) {
      // execid = executive[0].id;
      // execname = executive[0].name;
      if (this.accessShareExecid) {
        execid = executive[0].id + ',' + this.accessShareExecid[0].Exec_IDFK;
        execname = executive[0].name + ',' + this.accessShareExecid[0].execname;
      } else {
        execid = executive[0].id;
        execname = executive[0].name;
      }
    } else {
      // execid = localStorage.getItem('UserId');
      // execname = localStorage.getItem('Name');
      if (this.accessShareExecid) {
        execid = localStorage.getItem('UserId') + ',' + this.accessShareExecid[0].Exec_IDFK;
        execname = localStorage.getItem('Name') + ',' + this.accessShareExecid[0].execname;
      } else {
        execid = localStorage.getItem('UserId');
        execname = localStorage.getItem('Name');
      }
    }

    // Swal.fire({
    //   title: "Are you sure?",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "Green",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "OTP Based",
    //   cancelButtonText: "Without OTP"
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //             $('#modalclickRSV').click();
    //         var submitting = {
    //           number:$scope.mailsend.contact
    //       };
    //       var fiveMinutes = 30 * 1,
    //       display = document.querySelector('#time_rsv');
    //       startTimerrsv(fiveMinutes, display);
    // networkFactory.otpsend(submitting,function(success)
    // {     
    // },function(error){
    // });

    // }
    // else if (result.dismiss == 'cancel') {
    this.filterLoader = true;
    let param;
    if (this.leadResponse[0].leadmerged == 1 && this.leadResponse[0].mergedlead) {
      param = {
        leadid: this.leadResponse[0].enquiry_idfk,
        execname: execname,
        execid: execid,
        otpbased: '1',
        propertyId: propId,
        priority: this.userPriority,
        remarks: this.userRemarks,
        mergedMail: this.leadResponse[0].mergedlead[0].mergedMail,
        mergedName: this.leadResponse[0].mergedlead[0].mergedName,
        mergedNumber: this.leadResponse[0].mergedlead[0].mergedNumber
      }
    } else {
      param = {
        leadid: this.leadResponse[0].enquiry_idfk,
        execname: execname,
        execid: execid,
        otpbased: '1',
        propertyId: propId,
        remarks: this.userRemarks,
        priority: this.userPriority,
      };
    }
    this._mandateService.rsvvisittrigger(param).subscribe((success) => {
      var status = success.status;
      var data = success.success;
      this.filterLoader = false;
      document.body.style.overflowY = 'scroll';
      var status = success['status'];
      if (status == '0') {
        Swal.fire({
          title: "Form Not Submitted!",
          text: 'No Data Found to Update',
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        });
      } else if (status == '1') {
        Swal.fire({
          title: "Form Submitted Successfully!",
          text: 'RSV Updated Successfully',
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        });
      } else if (status == '2') {
        Swal.fire({
          title: "Visit Updated!",
          text: 'Already Visit Updated for the Day',
          icon: "warning",
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        });
      } else {
        Swal.fire({
          title: "Something Error Occured!",
          icon: "error"
        }).then(() => {
        });
      }
    })

    //   }
    // });

  }

  otpresend() {
    this.filterLoader = true;
    // var fiveMinutes = 30 * 1,
    // display = document.querySelector('#time');
    // startTimer(fiveMinutes, display);
    $('.info').removeAttr("style");
    $('.resendtag').attr('style', 'display:none');
    this._mandateService.otpsend(this.usernumber).subscribe((success) => {
      if (success.status == 'False') {
        this.filterLoader = false
        Swal.fire({
          title: "Something Error Occured!",
          icon: "error"
        });
      } else {
        this.filterLoader = false;
        setTimeout(() => {
          const inputs = this.otpInputs.toArray();
          if (inputs.length > 0) {
            inputs[0].nativeElement.focus();
          }
        }, 1000)
        var fiveMinutes = 15 * 1,
          display = document.querySelector('#time2');
        this.startTimer2(fiveMinutes, display);
      }
    });
  }

  submitOTP() {
    if (this.otpnumber == '' || this.otpnumber == undefined || this.otpnumber == null) {
      Swal.fire({
        title: 'Enter OTP',
        text: 'Please Enter the OTP',
        icon: 'warning',
        showConfirmButton: false,
        timer: 2000,
      })
      return false;
    } else {
      var mobileno = /^[0-9]{4}$/
      if (mobileno.test(this.otpnumber)) {
      } else {
        Swal.fire({
          title: 'Enter Validate OTP',
          text: 'Please Enter the OTP in Valid format',
          icon: 'error',
          showConfirmButton: false,
          timer: 2000,
        })
        this.otpnumber = '';
        this.otp = ['', '', '', ''];
        return false;
      }
    }

    let param = {
      otp: this.otpnumber,
      number: this.usernumber
    }
    this.filterLoader = true;
    this._mandateService.otpvalidcheck(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'True') {
        $('#otpModalClose').click();
        this.freshLeadCretion('1');
      } else {
        Swal.fire({
          title: 'Oops Something Error!',
          text: 'Its Not a valid OTP / OTP Expired!',
          icon: 'error',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.otp = ['', '', '', ''];
          this.otpnumber = '';
          setTimeout(() => {
            const inputs = this.otpInputs.toArray();
            if (inputs.length > 0) {
              inputs[0].nativeElement.focus();
            }
          }, 1000)
        });
      }
    })
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
      this.otpnumber = fullOtp;
      this.submitOTP();
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

  startTimer2(duration, display) {
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
        $('.otptags').attr('style', 'display:none');
        // $('.otpresend').removeAttr("style");
        this.freshLeadCretion('2')
      }
    }, 1000);
  }

  exisitingPopUp(type) {
    this.selectedType = type;
    if (this.existingExecutivesList && this.existingExecutivesList.length > 0) {
      $('#exisiting_executives_leads_detail').click();
      setTimeout(() => {
        $('input[id="hidecheckboxid"]').attr("disabled", false);
        $('.hidecheckbox').show();
      })
    } else {
      if (type == 'fresh') {
        this.freshVisitFix()
      } else if (type == 'revisit') {
        this.reVisitDone();
      }
    }
  }

  getselectedExecutives() {
    var selectedObjects = $("input[name='programming']:checked").map(function () {
      return JSON.parse($(this).attr('data-assign'));
    }).get();
    this.accessShareExecid = selectedObjects;
  }

  finalSubmit() {
    if (this.selectedType == 'fresh') {
      this.freshVisitFix()
    } else if (this.selectedType == 'revisit') {
      this.reVisitDone();
    }
  }

  clearSelectedData() {
    this.accessShareExecid = [];
  }

}