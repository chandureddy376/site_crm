import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { mandateservice } from '../../../mandate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { leadforward } from './mandate';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { sharedservice } from '../../../shared.service';
import * as moment from 'moment';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandatelisting',
  templateUrl: './mandatelisting.component.html',
  styleUrls: ['./mandatelisting.component.css']
})
export class MandatelistingComponent implements OnInit {
  date = new Date();
  priorDate = new Date(new Date().setDate(this.date.getDate() + 30));
  priorDatebefore = new Date(new Date().setDate(this.date.getDate() - 30));

  constructor(private _mandateService: mandateservice,private _sharedservice:sharedservice, private route: ActivatedRoute, private router: Router,public datepipe: DatePipe) {
    if (localStorage.getItem('Role') == '50009' || localStorage.getItem('Role') == '50010') {
      this.router.navigateByUrl('/login');
    };
    this.loadershow = false;
    this.isMasterSel = false;
  }

  private isCountdownInitialized: boolean;

  mandateleads: any;
  leadcounts: any;
  freshcounts: any;
  assignedcounts: any;
  properties: any;
  copyofprojects:any;
  cpdata: any;
  propertyid: string = "";
  static count: number;
  notassigned: any;
  cpselect: any;
  filterLoader: boolean = true;
  bhksize: any;
  budget: any;
  propselectmodel: any;
  status: any;
  loadershow: boolean;
  exec_desig: any;
  executives: any;
  assignexecutives: any;
  rmname: any;
  rmid: any;
  rmmail: any;
  adminview = false;
  userview = false;
  isMasterSel: boolean;
  checkedCategoryList = [];
  checkedCategoryList1 = [];
  registereduser: any;
  registereduserid: any;
  leadforwards = new leadforward();
  fromdate:any='';
  todate:any='';
  userid:any;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  assignedOnStart: moment.Moment | null = null;
  assignedOnEnd: moment.Moment | null = null;


  ngOnInit() {
    this.userid = localStorage.getItem('UserId');

    this.hoverSubscription = this._sharedservice.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.getleads();
    this.getcplists();
    this.getpropertieslist();
    // this.getexecutivesassign();
    const elements = document.getElementsByClassName("modalclick");
    while (elements.length > 0) elements[0].remove();
    const el = document.createElement('div');
    el.classList.add('modalclick');
    document.body.appendChild(el);
    MandatelistingComponent.count = 0;
  }

  ngAfterViewChecked() {
    if (!this.isCountdownInitialized) {
      this.isCountdownInitialized = true;
      this.scriptfunctions();
      $('.modalclick').click(function () {
        $('.modalclick').removeClass('modal-backdrop');
        $('.modalclick').removeClass('fade');
        $('.modalclick').removeClass('show');
        document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
      });
    }
  }

  scriptfunctions() {
    $('.calendardate').calendar({
      type: 'date',
      minDate: this.date,
      maxDate: this.priorDate,
      formatter: {
        date: function (date, settings) {
          if (!date) return '';
          var day = date.getDate();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          return year + '-' + month + '-' + day;
        }
      }
    });
  }

  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  resetScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  ngOnDestroy(){
    if(this.hoverSubscription){
      this.hoverSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
    this.initializeAssignedOnDateRangePicker();
    this.resetScroll();
  },0);
  }

  getleads() {
    this.filterLoader = true;
    this.route.queryParams.subscribe((param) => {
      setTimeout(()=>{
        this.initializeAssignedOnDateRangePicker()
      },0)
      this.resetScroll();
      const freshid = param['freshid'];
      MandatelistingComponent.count = 0;
      var params = {
        limit: 0,
        limitrows: 30,
        todate: "",
        fromdate: "",
        property: "",
        freshid: freshid
      }
      var rmparams = {
        limit: 0,
        limitrows: 30,
        todate: "",
        fromdate: "",
        property: "",
        rmid: localStorage.getItem('UserId'),
        freshid: freshid
      }
      if (localStorage.getItem('UserId') == '1') {
        this.adminview = true;
        this.userview = false;
        this._mandateService.getmandateleads(params).subscribe(mandleads => {
          this.filterLoader = false;
          this.mandateleads = mandleads;
        })
        this._mandateService.getmandateleadcounts(params).subscribe(enquiryscount => {
          this.leadcounts = enquiryscount[0].Total;
          this.freshcounts = enquiryscount[0].Fresh;
          this.assignedcounts = enquiryscount[0].Assigned;
        })
      } else {
        this.userview = true;
        this.adminview = false;
        this._mandateService.getmandateleads(rmparams).subscribe(mandleads => {
          this.filterLoader = false;
          this.mandateleads = mandleads;
        })
        this._mandateService.getmandateleadcounts(rmparams).subscribe(enquiryscount => {
          this.leadcounts = enquiryscount[0].Total;
          this.freshcounts = enquiryscount[0].Fresh;
          this.assignedcounts = enquiryscount[0].Assigned;
        })
      }
    });
  }

  propertychangeassign(event) {
    var params = {
      limit: 0,
      limitrows: 30,
      todate: "",
      fromdate: "",
      property: this.propertyid,
      freshid: "0"
    }
    this._mandateService.getmandateleads(params).subscribe(noassignleads => {
      this.notassigned = noassignleads;
    })
  }

  getselectedleads(id) {
    var checkid = $("input[name='programming']:checked").map(function () {
      return this.value;
    }).get().join(',');
    this.leadforwards.assignedleads = checkid;
  }

  refresh() {
    this.getleads();
    this.fromdate = '';
    this.todate = '';
    this.propertyid = '';
    $('#source_dropdown').dropdown('clear');
    $('#locality_dropdown').dropdown('clear');
  }

  loadMore() {
    this.route.queryParams.subscribe((param) => {
      const freshid = param['freshid'];
      let counts;
      if(freshid == 2){
        counts = this.leadcounts
      }else{
        counts = this.freshcounts
      }

      if (localStorage.getItem('UserId') == '1') {
        var params = {
          limit: MandatelistingComponent.count += 30,
          limitrows: 30,
          livecount: this.mandateleads.length,
          todate:this.todate,
          fromdate: this.fromdate,
          property: this.propertyid,
          freshid: freshid
        }
        if (this.mandateleads.length <= counts) {
          return this._mandateService.getmandateleads(params).subscribe(enquirys => {
            this.filterLoader = false;
            this.mandateleads = this.mandateleads.concat(enquirys);
          })
        }
      } else {
        var rmparams = {
          limit: MandatelistingComponent.count += 30,
          limitrows: 30,
          todate: this.todate,
          fromdate: this.fromdate,
          property: this.propertyid,
          rmid: localStorage.getItem('UserId'),
          freshid: freshid
        }
        if (this.mandateleads.length <= counts) {
          return this._mandateService.getmandateleads(rmparams).subscribe(enquirys => {
            this.filterLoader = false;
            this.mandateleads = this.mandateleads.concat(enquirys);
          })
        } 
      }
    });
  }

  selecttodate() {
    this.filterLoader = true;
    this.route.queryParams.subscribe((param) => {
      const freshid = param['freshid'];
      MandatelistingComponent.count = 0;
      var params = {
        limit: 0,
        limitrows: 30,
        todate: this.todate,
        fromdate: this.fromdate,
        property: this.propertyid,
        freshid: freshid
      }

      var rmparams = {
        limit: 0,
        limitrows: 30,
        todate:this.todate,
        fromdate: this.fromdate,
        property: this.propertyid,
        rmid: localStorage.getItem('UserId'),
        freshid: freshid
      }

      if (localStorage.getItem('UserId') == '1') {
        this._mandateService.getmandateleads(params).subscribe(mandleads => {
          this.filterLoader = false;
          this.mandateleads = mandleads;
        })
        this._mandateService.getmandateleadcounts(params).subscribe(enquiryscount => {
          this.leadcounts = enquiryscount[0].Total;
          this.freshcounts = enquiryscount[0].Fresh;
          this.assignedcounts = enquiryscount[0].Assigned;
        })
      } else {
        this._mandateService.getmandateleads(rmparams).subscribe(mandleads => {
          this.filterLoader = false;
          this.mandateleads = mandleads;
        })
        this._mandateService.getmandateleadcounts(rmparams).subscribe(enquiryscount => {
          this.leadcounts = enquiryscount[0].Total;
          this.freshcounts = enquiryscount[0].Fresh;
          this.assignedcounts = enquiryscount[0].Assigned;
        })
      }
    });
  }

  propertychange() {
    this.route.queryParams.subscribe((param) => {
      const freshid = param['freshid'];
      MandatelistingComponent.count = 0;
      var params = {
        limit: 0,
        limitrows: 30,
        todate: this.todate,
        fromdate:this.fromdate,
        property: this.propertyid,
        freshid: freshid
      }

      var rmparams = {
        limit: 0,
        limitrows: 30,
        todate: this.todate,
        fromdate: this.fromdate,
        property: this.propertyid,
        rmid: localStorage.getItem('UserId'),
        freshid: freshid
      }

      if (localStorage.getItem('UserId') == '1') {
        this._mandateService.getmandateleads(params).subscribe(mandleads => {
          this.filterLoader = false;
          this.mandateleads = mandleads;
        })
        this._mandateService.getmandateleadcounts(params).subscribe(enquiryscount => {
          this.leadcounts = enquiryscount[0].Total;
          this.freshcounts = enquiryscount[0].Fresh;
          this.assignedcounts = enquiryscount[0].Assigned;
        })
      } else {
        this._mandateService.getmandateleads(rmparams).subscribe(mandleads => {
          this.filterLoader = false;
          this.mandateleads = mandleads;
        })
        this._mandateService.getmandateleadcounts(rmparams).subscribe(enquiryscount => {
          this.leadcounts = enquiryscount[0].Total;
          this.freshcounts = enquiryscount[0].Fresh;
          this.assignedcounts = enquiryscount[0].Assigned;
        })
      }
    });
  }

  getcplists() {
    this._mandateService.cplists().subscribe(proplist => { this.cpdata = proplist; });
  }

  getpropertieslist() {
    this._mandateService.getmandatelist().subscribe(property => { 
      this.properties = property;
      this.copyofprojects = property;
     })
  }

  selectproperties() {
    var propid = $('#propname').val();
    this.propselectmodel = propid;
  }

  selectsource(event) {
    var value = event.target.value;
    if (value == "CP") {
      this.cpselect = true;
    } else {
      this.cpselect = false;
      this.registereduser = "Homes247";
      this.registereduserid = "1";
    }
  }

  selectcp(event) {
    this.registereduser = event.target.options[event.target.options.selectedIndex].text;
    this.registereduserid = event.target.value;
  }

  sizeselection(event) {
    var value = event.target.value;
    const a = document.getElementById("sizeselect") as HTMLInputElement;
    a.value = value;
    let numArr = value.match(/[\d\.]+/g)
    numArr = numArr.filter(n => n != '.')
    // alert(numArr);
    this.bhksize = numArr;
  }

  budgetselection(event) {
    var value = event.target.value;
    const a = document.getElementById("budgetselect") as HTMLInputElement;
    a.value = value;
    this.budget = value;
  }

  // GET_DESIGNATIONS_BASED_ON_DEPARTMENTS
  getdesgntns(event) {
    $('#exec_designation').dropdown('clear');
    $('#executives').dropdown('clear');
    const departid = event.target.value;
    this._mandateService.getdesignations(departid).subscribe((success) => {
      this.exec_desig = success;
    }, (err) => {
      console.log("Connection Failed")
    });
  }

  // GET_EXECUTIVES_BASED_ON_DESIGNATIONS
  getexecutives(event) {
    $('#executives').dropdown('clear');
    const id = event.target.options[event.target.options.selectedIndex].value;
    this._mandateService.getexecutivesbasedid(id).subscribe(execute => { this.executives = execute; })
  }

  // Get executives for assign leads
  // getexecutivesassign() {
  //   const id = '50010';
  //   this._mandateService.getexecutivesbasedid(id).subscribe(execute => { this.assignexecutives = execute; })
  // }

  // Get executives for assign leads
  getexecutivesnames(event) {
    this.rmname = event.target.options[event.target.options.selectedIndex].text;
    const Data = event.target.value;
    var list = Data.split("||");
    this.rmid = list[0];
    this.rmmail = list[1];
    this.leadforwards.telecallername = this.rmname;
  }

  addlead() {
    if ($('#custname').val() == "") {
      $('#custname').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#custname').val())) {
        $('#custname').removeAttr("style");
      }
      else {
        $('#custname').focus().css("border-color", "red").attr('placeholder', 'Please enter valid name').val('');
        return false;
      }
    }
    if ($('#custnum').val() == "") {
      $('#custnum').focus().css("border-color", "red").attr('placeholder', 'Please Enter Phone Number');
      return false;
    }
    else {
      var mobilee = /^[0-9]{10}$/;
      if (mobilee.test($('#custnum').val())) {
        $('#custnum').removeAttr('style');
      } else {
        $('#custnum').focus().css('border-color', 'red').attr('placeholder', 'Please enter valid contact number').val('');
        return false;
      }
    }
    if ($('#custmail').val() == "") {
      $('#custmail').focus().css("border-color", "red").attr('placeholder', 'Please Enter Email-id');
      return false;
    }
    else {
      var email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
      if (email.test($('#custmail').val())) {
        $('#custmail').removeAttr("style");
      }
      else {
        $('#custmail').focus().css("border-color", "red").attr('placeholder', 'Please enter valid email-id').val('');
        return false;
      }
    }

    if ($('#sourceselect').val() == "") {
      $('.sourcename').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      $('.sourcename').removeAttr("style");
    }

    if ($('#propname').val() == "") {
      $('.projectname').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      $('.projectname').removeAttr("style");
    }

    if ($('#sizeselect').val() == "") {
      swal({
        title: 'Please select the Size',
        text: "Select any BHK for the Final Submission",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }
    else {
      $('#sizeselect').removeAttr("style");
    }

    if ($('#budgetselect').val() == "") {
      swal({
        title: 'Please select the Budget',
        text: "Select any budget range ",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }
    else {
      $('#budgetselect').removeAttr("style");
    }

    if ($('#visitdate').val() == "") {
      $('#visitdate').focus().css("border-color", "red").attr('placeholder', 'Please Select the Date');
      return false;
    }
    else {
      $('#visitdate').removeAttr("style");
    }

    if ($('#exec_department').val() == "") {
      $('.exec_department').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      $('.exec_department').removeAttr("style");
    }

    if ($('#exec_designation').val() == "") {
      $('.exec_designation').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      $('.exec_designation').removeAttr("style");
    }

    if ($('#executives').val() == "") {
      $('.executives').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      $('.executives').removeAttr("style");
    }

    var params = {
      clientname: $('#custname').val(),
      clientnumber: $('#custnum').val(),
      clientmail: $('#custmail').val(),
      clientsource: $('#sourceselect').val(),
      propid: this.propselectmodel,
      bhk: this.bhksize,
      budget: this.budget,
      svdate: $('#visitdate').val(),
      remarks: $('#remarks').val(),
      rmname: this.rmname,
      rmmail: this.rmmail,
      rmid: this.rmid,
      usermail: localStorage.getItem('Mail'),
      username: localStorage.getItem('Name'),
      userid: localStorage.getItem('UserId'),
      registeredname: this.registereduser,
      registeredid: this.registereduserid,
    }
    this.loadershow = true;
    this._mandateService.addmandatelead(params).subscribe((success) => {
      this.status = success.status;
      if (this.status == "0") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Registered Successfully!",
          text: 'Kindly accompany the customer for Site Visit.',
          icon: "success"
        }).then(function () {

        });
      } else if (this.status == "1") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead Already Registered With You!",
          text: 'Kindly accompany the customer for Site Visit.',
          icon: "success"
        }).then(function () {

        });
      } else if (this.status == "2") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead Re-Registered Successfully!",
          text: 'Lead is Already found in Your Bucket, Kindly accompany the customer for Site Visit.',
          icon: "success"
        }).then(function () {
        });
      } else if (this.status == "3") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead Already Registered With You!",
          text: 'Lead is Already in Your Bucket.Kindly accompany the customer for Site Visit.',
          icon: "success"
        }).then(function () {

        });
      } else if (this.status == "4") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead is Already Exisiting!",
          text: 'Please Contact with the Sales Manager For Further Clarification',
          icon: "success"
        }).then(function () {

        });
      } else if (this.status == "5") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead is Already Exisiting!",
          text: 'Please Contact with the Sales Manager For Further Clarification',
          icon: "success"
        }).then(function () {

        });
      } else if (this.status == "6") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead is Already Exisiting!",
          text: 'This Lead Cant Register Now. Please Contact with the Sales Manager For Further Clarification.',
          icon: "success"
        }).then(function () {

        });
      }
      $('#propname').dropdown('clear');
      $('input[name="select"]').prop('checked', false);
      $('input[name="select1"]').prop('checked', false);
      $('#sizeselect').val("");
      $('#budgetselect').val("");
      $('#visitdate').val("");
      $('#remarks').val("");
      $('#exec_department').dropdown('clear');
      $('#exec_designation').dropdown('clear');
      $('#executives').dropdown('clear');
    }, (err) => {
      console.log("Connection Failed")
    });
  }

  rmaddlead() {
    if ($('#custname').val() == "") {
      $('#custname').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#custname').val())) {
        $('#custname').removeAttr("style");
      }
      else {
        $('#custname').focus().css("border-color", "red").attr('placeholder', 'Please enter valid name').val('');
        return false;
      }
    }
    if ($('#custnum').val() == "") {
      $('#custnum').focus().css("border-color", "red").attr('placeholder', 'Please Enter Phone Number');
      return false;
    }
    else {
      $('#custnum').removeAttr("style");
    }
    if ($('#custmail').val() == "") {
      $('#custmail').focus().css("border-color", "red").attr('placeholder', 'Please Enter Email-id');
      return false;
    }
    else {
      var email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
      if (email.test($('#custmail').val())) {
        $('#custmail').removeAttr("style");
      }
      else {
        $('#custmail').focus().css("border-color", "red").attr('placeholder', 'Please enter valid email-id').val('');
        return false;
      }
    }

    if ($('#sourceselect').val() == "") {
      $('.sourcename').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      $('.sourcename').removeAttr("style");
    }

    if ($('#propname').val() == "") {
      $('.projectname').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
      return false;
    }
    else {
      $('.projectname').removeAttr("style");
    }

    if ($('#sizeselect').val() == "") {
      swal({
        title: 'Please select the Size',
        text: "Select any BHK for the Final Submission",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }
    else {
      $('#sizeselect').removeAttr("style");
    }

    if ($('#budgetselect').val() == "") {
      swal({
        title: 'Please select the Budget',
        text: "Select any budget range ",
        type: 'error',
        showConfirmButton: true,
      })
      return false;
    }
    else {
      $('#budgetselect').removeAttr("style");
    }

    if ($('#visitdate').val() == "") {
      $('#visitdate').focus().css("border-color", "red").attr('placeholder', 'Please Select the Date');
      return false;
    }
    else {
      $('#visitdate').removeAttr("style");
    }

    var params = {
      clientname: $('#custname').val(),
      clientnumber: $('#custnum').val(),
      clientmail: $('#custmail').val(),
      clientsource: $('#sourceselect').val(),
      propid: this.propselectmodel,
      bhk: this.bhksize,
      budget: this.budget,
      svdate: $('#visitdate').val(),
      remarks: $('#remarks').val(),
      rmname: localStorage.getItem('Name'),
      rmmail: localStorage.getItem('Mail'),
      rmid: localStorage.getItem('UserId'),
      usermail: localStorage.getItem('Mail'),
      username: localStorage.getItem('Name'),
      userid: localStorage.getItem('UserId'),
      registeredname: this.registereduser,
      registeredid: this.registereduserid,
    }

    this.loadershow = true;
    this._mandateService.rmmandateleadadd(params).subscribe((success) => {
      this.status = success.status;
      if (this.status == "0") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Registered Successfully!",
          text: 'Kindly accompany the customer for Site Visit.',
          icon: "success"
        }).then(function () {

        });
      } else if (this.status == "1") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "This Lead is Already Registered With Us!",
          text: 'Please check with the sales cordinator for the further details.',
          icon: "success"
        }).then(function () {

        });
      } else if (this.status == "2") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead Re-Registered Successfully!",
          text: 'Lead is Already found in our Bucket, Kindly accompany the customer for Site Visit.',
          icon: "success"
        }).then(function () {
        });
      } else if (this.status == "3") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead Already Registered With us!",
          text: 'Please check with the sales cordinator for the further details.',
          icon: "success"
        }).then(function () {

        });
      } else if (this.status == "4") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead is Already Exisiting!",
          text: 'Please Contact with the Sales Cordinator For Further Clarification',
          icon: "success"
        }).then(function () {

        });
      } else if (this.status == "5") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead is Already Exisiting!",
          text: 'Please Contact with the Sales Manager For Further Clarification',
          icon: "success"
        }).then(function () {

        });
      } else if (this.status == "6") {
        this.loadershow = false;
        document.body.style.overflowY = 'scroll';
        swal({
          title: "Lead is Already Exisiting!",
          text: 'This Lead Cant Register Now. Please Contact with the Sales Manager For Further Clarification.',
          icon: "success"
        }).then(function () {

        });
      }
      $('#propname').dropdown('clear');
      $('input[name="select"]').prop('checked', false);
      $('input[name="select1"]').prop('checked', false);
      $('#sizeselect').val("");
      $('#budgetselect').val("");
      $('#visitdate').val("");
      $('#remarks').val("");
    }, (err) => {
      console.log("Connection Failed")
    });
  }

  modalclose() {
    $('#custname').val("");
    $('#custnum').val("");
    $('#custmail').val("");
    $('#propname').dropdown('clear');
    $('input[name="select"]').prop('checked', false);
    $('input[name="select1"]').prop('checked', false);
    $('#sizeselect').val("");
    $('#budgetselect').val("");
    $('#visitdate').val("");
    $('#remarks').val("");
    $('#exec_department').dropdown('clear');
    $('#exec_designation').dropdown('clear');
    $('#executives').dropdown('clear');
  }

  // morefilter() {
  //   document.getElementsByClassName('more_filter_maindiv')[0].removeAttribute("hidden");
  //   $('.modalclick').addClass('modal-backdrop');
  //   $('.modalclick').addClass('fade');
  //   $('.modalclick').addClass('show');
  // }

  close() {
    $('#fromdate').val("");
    $('#todate').val("");
    $('#source_dropdown').dropdown('clear');
    $('.modalclick').removeClass('modal-backdrop');
    $('.modalclick').removeClass('fade');
    $('.modalclick').removeClass('show');
    document.getElementsByClassName('more_filter_maindiv')[0].setAttribute("hidden", '');
  }

    //property selection  filter
    onCheckboxChange(val) {
      this.filterLoader=true;
      MandatelistingComponent.count = 0;
      this.propertyid = val;
      this.propertychange();
    }
    
    // Filter projects based on search 
    filterProjects(): void {
      if (this.searchTerm != '') {
        this.properties = this.copyofprojects.filter(project =>
          project.property_info_name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.properties = this.copyofprojects
      }
    }

    searchTerm: string = '';
    @ViewChild('datepicker') datepickerreceived: ElementRef;
    leadDateRange:Date[];
    currentdateforcompare = new Date();
    showdateRange() {
      // this.datepicker1.show();
      this.leadDateRange = [this.currentdateforcompare];
  
      setTimeout(() => {
        const inputElement = this.datepickerreceived.nativeElement as HTMLInputElement;
        inputElement.focus();
        inputElement.click();
      }, 0);
    }

    onLeadDateRangeSelected(range: Date[]): void {
      this.leadDateRange = range;
      //Convert the first date of the range to yyyy-mm-dd format
      if (this.leadDateRange != null || this.leadDateRange != undefined) {
        let formattedFromDate = this.datepipe.transform(this.leadDateRange[0], 'yyyy-MM-dd');
        let formattedToDate = this.datepipe.transform(this.leadDateRange[1], 'yyyy-MM-dd');
        if (formattedFromDate != null && formattedToDate != null) {
          this.fromdate = formattedFromDate;
          this.todate = formattedToDate;
          this.selecttodate();
       }
    }
  }

    //here we get the datepicker for Assigned on filter
    initializeAssignedOnDateRangePicker() {
      const cb = (start: moment.Moment, end: moment.Moment) => {
        if (start && end) {
          $('#assigedOnDates span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
          if (end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0) {
            end = end.endOf('day');
            $(this).data('daterangepicker').setEndDate(end);
          }
        } else {
          $('#assigedOnDates span').html('Select Date Range');
        }
  
        if (start && end) {
          this.fromdate = start.format('YYYY-MM-DD');
          this.todate = end.format('YYYY-MM-DD');
          this.selecttodate();
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
  
      $('#assigedOnDates').daterangepicker({
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
      cb(this.assignedOnStart, this.assignedOnEnd);
    }

}
