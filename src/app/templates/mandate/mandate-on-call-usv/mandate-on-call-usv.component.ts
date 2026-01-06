import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-on-call-usv',
  templateUrl: './mandate-on-call-usv.component.html',
  styleUrls: ['./mandate-on-call-usv.component.css']
})
export class MandateOnCallUsvComponent implements OnInit {

  @Input() selectedExecId: any;
  @Input() selectedSuggestedProp: any;
  @Input() calledLead: any;
  @Input() assignedRm: any;
  @Output() dataUpdated: EventEmitter<void> = new EventEmitter();
  callStatus: any = undefined;
  date = new Date();
  priorDate = new Date(new Date().setDate(this.date.getDate() + 30));
  priorDatebefore = new Date(new Date().setDate(this.date.getDate() - 30));
  usvFixed = true;
  usvreFix = false;
  usvDone = false;
  svform = false;
  rsvform = false;
  finalnegoform = false;
  leadclosedform = false;
  leadclosed = false;
  svFixed = false;
  rsvFixed = false;
  negofixed = false;
  junkform = false;
  junk = false;
  properties: any;
  suggestedpropertylists: any;
  nonsuggestedpropertylists: any;
  selectedpropertylists: any;
  selectedproperty_commaseperated: any;
  visitedpropertylists: any;
  cancelledpropertylists: any;
  leadid: any;
  datavisitwithothersid: any;
  datavisitwithothersname: any;
  datavisitwithothers: any;
  suggestedproperties: any;
  suggestedpropertiesname: any;
  status: any;
  executeid: any;
  suggestchecked: any;
  activestagestatus: any;
  hideafterfixed = true;
  hiderefixed = false;
  hidebeforefixed = false;
  leadclose = false;
  junkmove = false;
  selectedlists: any;
  followform = false;
  followup = false;
  followdownform = false;
  followupdown = false;
  autoremarks: any;
  userid: any;
  username: any;
  visitupdate: any;
  propertyremarks: any;
  filterLoader: boolean = true;
  intrestbtn: boolean = false;
  afterselectvisitdate = false;
  beforeselectvisitdate = true;
  visitstatusupdate = false;
  selectedPropName: any;
  usvExecutiveId: any;
  getselectedLeadExec: any;
  assignedrminfo: any;
  showSiteVisitDate: boolean = false;
  feedbackId: any
  buildernamereg: any;
  mails: any;
  regitrationData: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _mandateService: mandateservice,) { }
  private isCountdownInitialized: boolean

  leadDetails: any;
  visitdate: any;
  visitedremarks: any;
  selectedPropID: any;
  roleid: any;

  ngOnInit() {
    let currentUrl = this.router.url;
    let pathWithoutQueryParams1 = currentUrl.split('?')[0];
    if (pathWithoutQueryParams1 == '/mandate-feedback') {
      this.feedbackId = 1;
    } else {
      this.feedbackId = 0;
    }
    this.leadid = this.calledLead.LeadID;

    this.userid = localStorage.getItem('UserId');
    this.username = localStorage.getItem('Name');
    this.roleid = localStorage.getItem('Role');

    if (this.userid == 1) {
      this.usvExecutiveId = this.selectedExecId;
    } else {
      this.usvExecutiveId = this.selectedExecId;
    }

    this._mandateService
      .getassignedrm(this.leadid, this.userid, this.selectedExecId, this.feedbackId)
      .subscribe(cust => {
        if (this.userid == 1) {
          this.usvExecutiveId = this.selectedExecId;
        } else {
          this.usvExecutiveId = this.selectedExecId;
        }

        let filteredInfo;
        filteredInfo = cust.RMname.filter((da) => da.executiveid == this.selectedExecId);
        this.getselectedLeadExec = filteredInfo[0];
        this.leadDetails = filteredInfo[0];
        if (this.getselectedLeadExec.walkintime) {
          var date = this.getselectedLeadExec.walkintime.split(' ')[0];
          var time = this.getselectedLeadExec.walkintime.split(' ').pop();
          $('#USVvisiteddate').val(date);
          $('#USVvisitedtime').val(time);
        } else {
          $('#USVvisiteddate').val('');
          $('#USVvisitedtime').val('');
        }

        if (this.getselectedLeadExec && this.getselectedLeadExec.suggestedprop) {
          this.regitrationData = this.selectedSuggestedProp.registered;
        }

        if (this.regitrationData == undefined || this.regitrationData == null || this.regitrationData == '') {
          this.fetchmails();
        }

        this.loadimportantapi();
      });

    let rmid;
    if (this.feedbackId == 1) {
      rmid = this.usvExecutiveId;
    } else {
      rmid = this.userid;
    }

    var param = {
      leadid: this.leadid,
      execid: rmid,
      feedbackid: this.feedbackId
    }

    this._mandateService
      .propertylist(param)
      .subscribe(propertylist => {
        this.properties = propertylist;
      });

    this._mandateService
      .getactiveleadsstatus(this.leadid, this.userid, this.usvExecutiveId, this.selectedSuggestedProp.propid, this.feedbackId)
      .subscribe(stagestatus => {
        this.filterLoader = false;
        this.activestagestatus = stagestatus['activeleadsstatus'];
        if (this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "1") {
          this.hideafterfixed = false;
          this.usvFixed = false;
          this.hidebeforefixed = true;
          this.hiderefixed = true;
          this.usvreFix = true;
          $('#sectionselector').val('USV');
        } else if (this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "2") {
          this.hideafterfixed = false;
          this.usvFixed = false;
          this.hidebeforefixed = true;
          this.hiderefixed = true;
          this.usvreFix = true;
          $('#sectionselector').val('USV');
        } else if (this.activestagestatus[0].stage == "USV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "0") {
          this.hideafterfixed = false;
          this.hiderefixed = false;
          this.hidebeforefixed = false;
          this.usvFixed = false;
          this.usvreFix = false;
          this.usvDone = true;
          $('#sectionselector').val('USV');
        } else {
          this.hideafterfixed = true;
        }
      });
    this.suggestchecked = "";
  }

  ngAfterViewChecked() {
    if (!this.isCountdownInitialized) {
      this.isCountdownInitialized = true;
      this.scriptfunctions();
    }
  }

  scriptfunctions() {
    $('.ui.dropdown').dropdown();
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

    $('.visitedcalendardate').calendar({
      type: 'date',
      minDate: this.priorDatebefore,
      maxDate: this.date,
      formatter: {
        date: function (date, settings) {
          if (!date) return '';
          var day = date.getDate();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          return year + '-' + month + '-' + day;
        }
      },

    });

    var minDate = new Date();
    var maxDate = new Date();
    minDate.setHours(7);
    maxDate.setHours(20);
    $('.calendartime').calendar({
      type: 'time',
      disableMinute: true,
      minDate: minDate,
      maxDate: maxDate,
    });
    $.extend($.expr[':'], {
      unchecked: function (obj) {
        return ((obj.type == 'checkbox' || obj.type == 'radio') && !$(obj).is(':checked'));
      }
    });
  }

  datefocus() { }

  datefocusOut() {
    if ($('#USVvisiteddate').val() == "") {
      $('#USVvisiteddate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
      return false;
    } else if ($('#USVvisitedtime').val() == "") {
      $('#USVvisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
      return false;
    }
    else {
      $('#USVvisiteddate').removeAttr("style");
      $('#USVvisitedtime').removeAttr("style");
      this.afterselectvisitdate = true;
      this.beforeselectvisitdate = false;
    }
  }

  timefocus() {

  }

  timefocusOut() {
    if ($('#USVvisiteddate').val() == "") {
      $('#USVvisiteddate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
      return false;
    } else if ($('#USVvisitedtime').val() == "") {
      $('#USVvisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
      return false;
    }
    else {
      $('#USVvisiteddate').removeAttr("style");
      $('#USVvisitedtime').removeAttr("style");
      this.afterselectvisitdate = true;
      this.beforeselectvisitdate = false;
    }
  }

  loadimportantapi() {
    var param = {
      leadid: this.leadid,
      execid: this.userid,
      stage: $('#customer_phase4').val(),
      assignid: this.usvExecutiveId,
      feedbackid: this.feedbackId,
      propid: this.selectedSuggestedProp.propid
    }

    this._mandateService
      .getsuggestedproperties(param)
      .subscribe(suggested => {
        this.suggestedpropertylists = suggested['suggestedlists'];
        if (this.selectedpropertylists) {
          this.selectedpropertylists = this.selectedpropertylists.filter((da) => da.propid == this.selectedSuggestedProp.propid);
        }
      });

    this._mandateService
      .getnonselectedproperties(this.leadid, this.userid, this.usvExecutiveId, this.feedbackId)
      .subscribe(suggested => {
        this.nonsuggestedpropertylists = suggested['nonselectedlists'];
      });

    this._mandateService
      .getmandateselectedsuggestproperties(this.leadid, this.userid, this.usvExecutiveId, this.feedbackId)
      .subscribe(selectsuggested => {
        this.selectedpropertylists = selectsuggested['selectedlists'];
        if (this.selectedpropertylists) {
          this.selectedpropertylists = this.selectedpropertylists.filter((da) => da.propid == this.selectedSuggestedProp.propid);
          this.selectedlists = selectsuggested;
          this.suggestchecked = this.selectedpropertylists.map((item) => { return item.propid }).join(',');
        }
      });

    this._mandateService
      .getvisitedsuggestproperties(param)
      .subscribe(visitsuggested => {
        this.visitedpropertylists = visitsuggested['visitedlists'];
        if (visitsuggested['status'] == 'True') {
          this.visitedremarks = this.visitedpropertylists[0].remarks;
          $('#visitupdate').val("4");
          this.visitstatusupdate = true;
        } else {

        }
      });

    this._mandateService
      .getcancelledsuggestproperties(param)
      .subscribe(cancelsuggested => {
        this.cancelledpropertylists = cancelsuggested['cancelledlists'];
      });

    let rmid;
    if (this.feedbackId == 1) {
      rmid = this.usvExecutiveId;
    } else {
      rmid = this.userid;
    }

    var params = {
      leadid: this.leadid,
      execid: rmid,
      feedbackid: this.feedbackId
    }

    this._mandateService
      .propertylist(params)
      .subscribe(propertylist => {
        this.properties = propertylist;
      });

  }

  onusvFixed() {
    this.usvFixed = true;
    this.usvreFix = false;
    this.usvDone = false;
    this.junkform = false;
    this.junk = false;
    this.followform = false;
    this.followup = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  onusvreFix() {
    this.usvFixed = false;
    this.usvreFix = true;
    this.usvDone = false;
    this.junkform = false;
    this.junk = false;
    this.followform = false;
    this.followup = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  onusvDone() {
    this.followdownform = false;
    this.followupdown = false;
    this.usvFixed = false;
    this.usvreFix = false;
    this.usvDone = true;
    this.junkform = false;
    this.junk = false;
    this.followform = false;
    this.followup = false;
    $('#sectionselector').val('USV');
  }

  onfollowup() {
    this.followform = true;
    this.followup = true;
    this.usvFixed = false;
    this.usvreFix = false;
    this.usvDone = false;
    this.junkform = false;
    this.junk = false;
    $('#sectionselector').val("");
  }

  onjunk() {
    this.junkform = true;
    this.junk = true;
    this.usvFixed = false;
    this.usvreFix = false;
    this.usvDone = false;
    this.followform = false;
    this.followup = false;
  }

  followupdownbtn() {
    this.followdownform = true;
    this.followupdown = true;
    this.svform = false;
    this.svFixed = false;
    this.rsvFixed = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.negofixed = false;
    this.leadclosedform = false;
    this.leadclosed = false;
  }

  onsvFixed() {
    this.followdownform = false;
    this.followupdown = false;
    this.svform = true;
    this.svFixed = true;
    this.rsvFixed = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.negofixed = false;
    this.leadclosedform = false;
    this.leadclosed = false;

  }

  onrsvFixed() {
    this.rsvform = true;
    this.rsvFixed = true;
    this.svform = false;
    this.svFixed = false;
    this.finalnegoform = false;
    this.negofixed = false;
    this.leadclosedform = false;
    this.leadclosed = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  onnegofixed() {
    this.finalnegoform = true;
    this.negofixed = true;
    this.rsvform = false;
    this.rsvFixed = false;
    this.svform = false;
    this.svFixed = false;
    this.leadclosedform = false;
    this.leadclosed = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  onleadclosed() {
    this.leadclosedform = true;
    this.leadclosed = true;
    this.finalnegoform = false;
    this.negofixed = false;
    this.rsvform = false;
    this.rsvFixed = false;
    this.svform = false;
    this.svFixed = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  removeValue(list, value) {
    return list.replace(new RegExp(",?" + value + ",?"), function (match) {
      var first_comma = match.charAt(0) === ',',
        second_comma;

      if (first_comma &&
        (second_comma = match.charAt(match.length - 1) === ',')) {
        return ',';
      }
      return '';
    });
  };

  // Selecting the suggested properties for fix the USV
  selectsuggestedprop(event: Event, i: number, id: string, propname: string) {
    const checkbox = (event.target as HTMLInputElement);
    const checkedIds = this.suggestchecked ? this.suggestchecked.split(',') : [];

    if (checkbox.checked) {
      // Add the checked ID if it's not already in the list
      if (!checkedIds.includes(id)) {
        checkedIds.push(id);
      }
    } else {
      // Remove the unchecked ID from the list
      const index = checkedIds.indexOf(id);
      if (index > -1) {
        checkedIds.splice(index, 1);
      }
    }
    this.suggestchecked = checkedIds.join(',');
  }


  // selectsuggestedprop(event: Event,i, id, propname) {
  //   if($('#checkbox'+i).is(':checked')){
  //     var checkid = $("input[name='programmings']:checked").map(function () {
  //       return this.value;
  //     }).get().join(',');
  //   this.suggestchecked=checkid;
  //     // var param = {
  //     //   leadid: this.leadid,
  //     //   suggestproperties: this.suggestchecked
  //     // }
  //     // this._mandateService.addselectedsuggestedproperties(param).subscribe((success) => {
  //     //   this.status = success.status;
  //     //   this._mandateService.getselectedsuggestproperties(this.leadid,this.userid,this.usvExecutiveId).subscribe(selectsuggested => {
  //     //     this.selectedpropertylists = selectsuggested['selectedlists'];
  //     //     this.selectedlists = selectsuggested;
  //     //     // Joining the object values as comma seperated when add the property for the history storing
  //     //     this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
  //     //     // Joining the object values as comma seperated when add the property for the history storing
  //     //   });
  //     // }, (err) => {
  //     //   console.log("Failed to Update");
  //     // })
  //   }
  //    else {

  //     // var param2 = {
  //     //   leadid: this.leadid,
  //     //   suggestproperties: id,
  //     //   stage: "USV",
  //     //   execid: this.usvExecutiveId,
  //     // }
  //     // this.suggestchecked = this.removeValue(this.suggestchecked, id);
  //     // this.autoremarks = " removed the " + propname + " from the USV scheduled lists.";
  //     // this._mandateService.removeselectedproperties(param2).subscribe((success) => {
  //     //   this.status = success.status;
  //     //   this._mandateService.getselectedsuggestproperties(this.leadid,this.userid,this.usvExecutiveId).subscribe(selectsuggested => {
  //     //     this.selectedpropertylists = selectsuggested['selectedlists'];
  //     //     this.selectedlists = selectsuggested;
  //     //     // Joining the object values as comma seperated when remove the property for the history storing
  //     //     this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
  //     //     this.suggestchecked = this.selectedproperty_commaseperated;
  //     //     // Joining the object values as comma seperated when remove the property for the history storing
  //     //   });
  //     // }, (err) => {
  //     //   console.log("Failed to Update");
  //     // })

  //   }
  // }

  // Selecting the suggested properties for fix the USV

  refixsuggested(i, id, propname) {

    if ($('#suggestcheckbox').is(':checked')) {
      var checkid = $("input[name='programming']:checked").map(function () {
        return this.value;
      }).get().join(',');
      this.suggestchecked = checkid;
      this.autoremarks = " added the " + propname + " for USV while refixing the meeting.";
    }
    // else {
    //   var param = {
    //     leadid: this.leadid,
    //     suggestproperties: id,
    //     stage: "USV",
    //     execid: this.usvExecutiveId,
    //   }
    //   this.suggestchecked = this.removeValue(this.suggestchecked, id);
    //   this.autoremarks = " removed the " + propname + " from the USV scheduled lists while refixing the meeting.";
    //   this._mandateService.removeselectedproperties(param).subscribe((success) => {
    //     this.status = success.status;
    //     if (this.status == "True") {
    //       this._mandateService.getselectedsuggestproperties(this.leadid,this.userid,this.usvExecutiveId).subscribe(selectsuggested => {
    //         this.selectedpropertylists = selectsuggested['selectedlists'];
    //         this.selectedlists = selectsuggested;
    //         // Joining the object values as comma seperated when remove the property for the history storing
    //         this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
    //         // Joining the object values as comma seperated when remove the property for the history storing
    //       });
    //     }
    //   }, (err) => {
    //     console.log("Failed to Update");
    //   })
    // }
  }

  moresuggested(i, id, propname) {
    if ($('#USVvisiteddate').val() == "") {
      $('#USVvisiteddate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
      return false;
    }
    else {
      $('#USVvisiteddate').removeAttr("style");
    }
    if ($('#USVvisitedtime').val() == "") {
      $('#USVvisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
      return false;
    }
    else {
      $('#USVvisitedtime').removeAttr("style");
    }
    var visiteddate = $('#USVvisiteddate').val();
    var visitedtime = $('#USVvisitedtime').val();
    if ($('#moresuggestcheckbox' + i).is(':checked')) {
      var checkid = $("input[name='programming']:checked").map(function () {
        return this.value;
      }).get().join(',');
      this.suggestchecked = checkid;
      var param = {
        leadid: this.leadid,
        nextdate: visiteddate,
        nexttime: visitedtime,
        suggestproperties: this.suggestchecked,
        execid: this.userid,
        assignid: this.usvExecutiveId
      }
      this.autoremarks = " added the " + propname + " for USV during the sitevisit.";
      this._mandateService.addselectedsuggestedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this._mandateService
            .getselectedsuggestproperties(this.leadid, this.userid, this.usvExecutiveId)
            .subscribe(selectsuggested => {
              this.selectedpropertylists = selectsuggested['selectedlists'];
              this.selectedlists = selectsuggested;
            });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    } else {

      var param2 = {
        leadid: this.leadid,
        suggestproperties: id,
        stage: "USV",
        execid: this.usvExecutiveId,
      }
      this.suggestchecked = this.removeValue(this.suggestchecked, id);
      this.autoremarks = " removed the " + propname + " from the USV scheduled lists.";
      this._mandateService.removeselectedproperties(param2).subscribe((success) => {
        this.status = success.status;
        this._mandateService.getselectedsuggestproperties(this.leadid, this.userid, this.usvExecutiveId).subscribe(selectsuggested => {
          this.selectedpropertylists = selectsuggested['selectedlists'];
          this.selectedlists = selectsuggested;
          // Joining the object values as comma seperated when remove the property for the history storing
          this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
          // Joining the object values as comma seperated when remove the property for the history storing
        });
      }, (err) => {
        console.log("Failed to Update");
      })

    }
  }

  moresuggestedbeforeselection() {
    swal({
      title: 'Select Visited Date and Time!',
      type: 'error',
      timer: 2000,
      showConfirmButton: false
    })
  }

  addpropertiestolist01() {
    this.datavisitwithothersid = $(".onchangeforvisitwithothers").dropdown("get value");
    this.datavisitwithothersname = $('.onchangeforvisitwithothers option:selected').toArray().map(item => item.text).join();
    this.suggestedproperties = $(".onchangeforsuggestproperties01").dropdown("get value");
    this.suggestedpropertiesname = $('.onchangeforsuggestproperties01 option:selected').toArray().map(item => item.text).join();

    if (this.suggestedproperties == "" && this.datavisitwithothersid == "") {
      swal({
        title: 'Add any one property',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    } else {
      $('.onchangeforsuggestproperties01').removeAttr("style");
    }

    if (this.suggestedproperties.length == 0) {
      // alert("No need push to database");
    } else {
      // alert("Should push to database");
      var param = {
        leadid: this.leadid,
        suggestproperties: this.suggestedproperties,
        assignid: this.usvExecutiveId,
        stage: "USV",
      }
      this.autoremarks = "While fixing the USV " + " suggested some properties like " + this.suggestedpropertiesname;
      this._mandateService.addsuggestedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          swal({
            title: 'Successfully Added',
            type: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            this.loadimportantapi();
          });
        }
        $(".onchangeforvisitwithothers").dropdown('clear');
        $(".onchangeforvisitwithothers").dropdown('destroy');
        $(".onchangeforvisitwithothers").dropdown('restore defaults');
        $(".onchangeforsuggestproperties01").dropdown('clear');
        $(".onchangeforsuggestproperties01").dropdown('destroy');
        $(".onchangeforsuggestproperties01").dropdown('restore defaults');
      }, (err) => {
        console.log("Failed to Update");
      })
    }

    if (this.datavisitwithothersid.length == 0) {
      // alert("No need push to database");
    } else {
      // alert("Should push to database");
      var param2 = {
        leadid: this.leadid,
        assignid: this.usvExecutiveId,
        visitedproperties: this.datavisitwithothersid
      }
      this.autoremarks = "While fixing the USV " + this.username + " added few already visited properties with others Like, " + this.datavisitwithothersname;
      this._mandateService.addvisitedpropertiesothers(param2).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          swal({
            title: 'Successfully Added',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.loadimportantapi();
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }

  }

  addpropertiestolist02() {
    this.datavisitwithothersid = $(".onchangeforvisitwithothers").dropdown("get value");
    this.datavisitwithothersname = $('.onchangeforvisitwithothers option:selected').toArray().map(item => item.text).join();
    this.suggestedproperties = $(".onchangeforsuggestproperties02").dropdown("get value");
    this.suggestedpropertiesname = $('.onchangeforsuggestproperties02 option:selected').toArray().map(item => item.text).join();

    if (this.suggestedproperties == "" && this.datavisitwithothersid == "") {
      swal({
        title: 'Suggest any one property',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    } else {
      $('.onchangeforsuggestproperties02').removeAttr("style");
    }

    if (this.suggestedproperties.length == 0) {
      // alert("No need push to database");
    } else {
      // alert("Should push to database");
      var param = {
        leadid: this.leadid,
        suggestproperties: this.suggestedproperties,
        assignid: this.usvExecutiveId,
        stage: "USV",
      }
      this.autoremarks = "While Refixing the USV " + this.username + " suggested some properties like " + this.suggestedpropertiesname;
      this._mandateService.addsuggestedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          swal({
            title: 'Successfully Added',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.loadimportantapi();
          });
        }
        $(".onchangeforvisitwithothers").dropdown('clear');
        $(".onchangeforvisitwithothers").dropdown('destroy');
        $(".onchangeforvisitwithothers").dropdown('restore defaults');
        $(".onchangeforsuggestproperties02").dropdown('clear');
        $(".onchangeforsuggestproperties02").dropdown('destroy');
        $(".onchangeforsuggestproperties02").dropdown('restore defaults');
      }, (err) => {
        console.log("Failed to Update");
      })

    }

    if (this.datavisitwithothersid.length == 0) {
      // alert("No need push to database");
    } else {
      // alert("Should push to database");
      //need conf
      var param2 = {
        leadid: this.leadid,
        visitedproperties: this.datavisitwithothersid,
        assignid: this.userid
      }
      this.autoremarks = "While Refixing the USV " + this.username + " added few already visited properties with others Like, " + this.datavisitwithothersname;
      this._mandateService.addvisitedpropertiesothers(param2).subscribe((success) => {
        this.status = success.status;
      }, (err) => {
        console.log("Failed to Update");
      })
    }
  }

  addpropertiestolist03() {
    this.suggestedproperties = $(".onchangeforsuggestproperties03").dropdown("get value");
    if (this.suggestedproperties == "") {
      swal({
        title: 'Suggest any one property',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    } else {
      $('.onchangeforsuggestproperties03').removeAttr("style");
    }

    if (this.suggestedproperties.length == 0) {
      // alert("No need push to database");
    } else {
      // alert("Should push to database");
      var param = {
        leadid: this.leadid,
        suggestproperties: this.suggestedproperties,
        assignid: this.usvExecutiveId,
        stage: "USV",
      }
      this.autoremarks = "While During the UniqueSiteVisit " + this.username + " some more properties suggested like " + this.suggestedpropertiesname;
      this._mandateService.addsuggestedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          swal({
            title: 'Successfully Added',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.loadimportantapi();
          });
        }
        $(".onchangeforsuggestproperties03").dropdown('clear');
        $(".onchangeforsuggestproperties03").dropdown('destroy');
        $(".onchangeforsuggestproperties03").dropdown('restore defaults');
      }, (err) => {
        console.log("Failed to Update");
      })
    }
  }

  //  ASSIGN LEAD SECTION
  fetchmails() {
    this.filterLoader = true;
    this._mandateService
      .getfetchmail(this.selectedSuggestedProp.propid)
      .subscribe(mails => {
        this.filterLoader = false;
        this.mails = mails;
        this.buildernamereg = mails[0]['builderInfo_name'];
      });
  }

  usvfixing() {

    if (this.getselectedLeadExec.suggestedprop.length > 1) {
      this.suggestchecked = this.selectedSuggestedProp.propid;
    } else {
      this.suggestchecked = this.getselectedLeadExec.suggestedprop[0].propid;
    }

    if (this.suggestchecked == "") {
      swal({
        title: 'Property Not Selected',
        text: 'Please select atleast one property for the Sitevisit',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    }
    else {
    }

    if ($('#nextactiondate').val() == "") {
      $('#nextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
      return false;
    }
    else {
      $('#nextactiondate').removeAttr("style");
    }
    if ($('#nextactiontime').val() == "") {
      $('#nextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
      return false;
    }
    else {
      $('#nextactiontime').removeAttr("style");
    }
    let usvtextremarks = $('#textarearemarks').val().trim();
    if (usvtextremarks == "") {
      $('#textarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
      return false;
    }
    else {
      $('#textarearemarks').removeAttr("style");
    }

    this.filterLoader = true;
    var nextdate = $('#nextactiondate').val();
    var nexttime = $('#nextactiontime').val();
    var textarearemarks = $('#textarearemarks').val();
    var dateformatchange = new Date(nextdate).toDateString();

    var param = {
      leadid: this.leadid,
      nextdate: nextdate,
      nexttime: nexttime,
      suggestproperties: this.suggestchecked,
      execid: this.userid,
      assignid: this.usvExecutiveId
    }
    this._mandateService.addselectedsuggestedproperties(param).subscribe((success) => {
      this.status = success.status;
      this._mandateService.getselectedsuggestproperties(this.leadid, this.userid, this.usvExecutiveId).subscribe(selectsuggested => {
        this.selectedpropertylists = selectsuggested['selectedlists'];
        this.selectedlists = selectsuggested;
        // Joining the object values as comma seperated when add the property for the history storing
        this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
        // Joining the object values as comma seperated when add the property for the history storing

        this.autoremarks = "Scheduled the USV for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
        var leadusvhistparam = {
          leadid: this.leadid,
          closedate: nextdate,
          closetime: nexttime,
          leadstage: "USV",
          stagestatus: '1',
          textarearemarks: textarearemarks,
          userid: this.userid,
          assignid: this.usvExecutiveId,
          autoremarks: this.autoremarks,
          property: this.suggestchecked,
          feedbackid: this.feedbackId
        }
        this._mandateService.addleadhistory(leadusvhistparam).subscribe((success) => {
          this.status = success.status;
          if (this.status == "True") {
            this.filterLoader = false;
            $('#nextactiondate').val('');
            $('#nextactiontime').val('');
            $('#customer_phase4').val('');
            $('#textarearemarks').val('');
            swal({
              title: 'USV Fixed Successfully',
              type: "success",
              timer: 2000,
              showConfirmButton: false
            }).then(() => {

              if (this.regitrationData == null || this.regitrationData == undefined || this.regitrationData == '') {
                let registrationremarks = 'Registration Successfully Done';
                this.filterLoader = true;
                var param = {
                  leadid: this.leadid,
                  propid: this.selectedSuggestedProp.propid,
                  customer: this.getselectedLeadExec.customer_name,
                  customernum: this.getselectedLeadExec.customer_number,
                  customermail: this.getselectedLeadExec.customer_mail,
                  rmname: localStorage.getItem('Name'),
                  rmid: localStorage.getItem('UserId'),
                  rmmail: localStorage.getItem('Mail'),
                  assignid: this.selectedExecId,
                  builder: this.buildernamereg,
                  property: this.selectedSuggestedProp.name,
                  sendto: this.mails[0].builder_mail,
                  sendcc: this.mails[1].builder_mail,
                  remarks: registrationremarks
                }
                this._mandateService.clientregistration(param).subscribe((success) => {
                  var status = success.status;
                  var data = success.success;

                  if (status == "1") {
                    this.filterLoader = false;
                    swal({
                      title: "Mail Sent Successfully!",
                      text: 'This Data registered on 30 Days before so Re-registered Successfully',
                      icon: "success",
                      type: 'success',
                      timer: 2000,
                      showConfirmButton: false
                    }).then(() => {
                      setTimeout(() => {
                        this.dataUpdated.emit();
                      }, 0)
                    });

                  } else if (status == "0") {

                    this.filterLoader = false;
                    swal({
                      title: "Mail Sent Successfully!",
                      text: 'Registered Successfully',
                      icon: "success",
                      type: 'success',
                      timer: 2000,
                      showConfirmButton: false
                    }).then(() => {
                      setTimeout(() => {
                        this.dataUpdated.emit();
                      }, 0)
                    });

                  } else {
                    this.filterLoader = false;
                    swal({
                      title: 'Already Registered Data Found.!',
                      text: data[0].registered_property + ' is registered by ' + data[0].registered_RM + ' on ' + data[0].registered_date + '. Please Unselect this Property If it is a group Submission.',
                      type: 'error',
                      timer: 2000,
                      showConfirmButton: false
                    })
                  }
                }, (err) => {
                  console.log("Failed to Update");
                });
              } else {
                setTimeout(() => {
                  this.dataUpdated.emit();
                }, 0)
              }

            });
          } else if (this.status == "False" && success.data) {
            this.filterLoader = false;
            swal({
              title: `USV already fixed by ${success.data[0].name}`,
              text: `Please Contact Admin to assign this visit`,
              type: "error",
              showConfirmButton: true
            }).then(() => {
              setTimeout(() => {
                this.dataUpdated.emit();
              }, 0)
              // let currentUrl = this.router.url;
              // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              //   this.router.navigate([currentUrl]);
              // });
            });
          }
        }, (err) => {
          console.log("Failed to Update");
        });
      });
    });


  };

  usvrefixing() {
    if (this.suggestchecked == "") {
      swal({
        title: 'Property Not Selected',
        text: 'Please select atleast one property for the Sitevisit',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    } else {
    }

    if ($('#refixdate').val() == "") {
      $('#refixdate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
      return false;
    }
    else {
      $('#refixdate').removeAttr("style");
    }
    if ($('#refixtime').val() == "") {
      $('#refixtime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
      return false;
    }
    else {
      $('#refixtime').removeAttr("style");
    }

    let usvrefixremarks = $('#refixtextarearemarks').val().trim();
    if (usvrefixremarks == "") {
      $('#refixtextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
      return false;
    }
    else {
      $('#refixtextarearemarks').removeAttr("style");
    }

    if (this.getselectedLeadExec.suggestedprop.length > 1) {
      this.suggestchecked = this.selectedSuggestedProp.propid;
    } else {
      this.suggestchecked = this.leadDetails.suggestedprop[0].propid;
    }

    var nextdate = $('#refixdate').val();
    var nexttime = $('#refixtime').val();
    var textarearemarks = $('#refixtextarearemarks').val();
    var dateformatchange = new Date(nextdate).toDateString();
    this.filterLoader = true;
    var param = {
      leadid: this.leadid,
      nextdate: nextdate,
      nexttime: nexttime,
      suggestproperties: this.suggestchecked,
      execid: this.userid,
      assignid: this.usvExecutiveId
    }
    this._mandateService.addselectedsuggestedpropertiesrefix(param).subscribe((success) => {
      this.status = success.status;
      this._mandateService.getselectedsuggestproperties(this.leadid, this.userid, this.usvExecutiveId).subscribe(selectsuggested => {
        this.selectedpropertylists = selectsuggested['selectedlists'];
        this.selectedlists = selectsuggested;
        // Joining the object values as comma seperated when add the property for the history storing
        this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
        // Joining the object values as comma seperated when add the property for the history storing

        this.autoremarks = " ReFixed the USV for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
        var leadusvhistparam = {
          leadid: this.leadid,
          closedate: nextdate,
          closetime: nexttime,
          leadstage: "USV",
          stagestatus: '2',
          textarearemarks: textarearemarks,
          userid: this.userid,
          assignid: this.usvExecutiveId,
          autoremarks: this.autoremarks,
          property: this.suggestchecked,
          feedbackid: this.feedbackId
        }
        this._mandateService.addleadhistory(leadusvhistparam).subscribe((success) => {
          this.status = success.status;
          if (this.status == "True") {
            this.filterLoader = false;
            swal({
              title: 'USV Refixed Successfully',
              type: "success",
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              // this.ngOnInit();
              setTimeout(() => {
                this.dataUpdated.emit();
              }, 0)
              // let currentUrl = this.router.url;
              // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              //   this.router.navigate([currentUrl]);
              // });
            });
          } else if (this.status == "False" && success.data) {
            this.filterLoader = false;
            swal({
              title: `USV already fixed by ${success.data[0].name}`,
              text: `Please Contact Admin to assign this visit`,
              type: "error",
              showConfirmButton: true
            }).then(() => {
              setTimeout(() => {
                this.dataUpdated.emit();
              }, 0)
              // let currentUrl = this.router.url;
              // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              //   this.router.navigate([currentUrl]);
              // });
            });
          }
        }, (err) => {
          console.log("Failed to Update");
        });
      });
    }, (err) => {
      console.log("Failed to Update");
    })
  };

  visitclick() {
    $('#visitupdate').val("1");
    $('.nextactionmaindiv').removeAttr('style');
    $('.visitupdatebtn').attr("style", "display:none;");

    if (this.getselectedLeadExec.walkintime != null) {
      this.showSiteVisitDate = true;
    } else {
      this.showSiteVisitDate = false;
    }
  }

  cancelclick(propertyname) {
    $('#visitupdate').val("3");
    $('.visitupdatebtn').removeAttr('style');
    $('.nextactionmaindiv').attr("style", "display:none;");
    this.followdownform = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.leadclosedform = false;
    this.showSiteVisitDate = true;
  }

  updatepropertyvisit(propertyid, propertyname) {
    if ($('#visitupdate').val() == "1") {
      this.visitupdate = "Visited";
    } else if ($('#visitupdate').val() == "3") {
      this.visitupdate = "Visited but not interested";
    } else {
      this.visitupdate = "Not Visited";
    }
    this.propertyremarks = $('#propertyremarks').val();
    if ($('#visitupdate').val() == "") {
      swal({
        title: 'Action Not Took',
        text: 'Please select any actions',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    }
    else {
      $('#visitupdate').removeAttr("style");
    }

    if ($('#propertyremarks').val() == "") {
      $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
      return false;
    }
    else {
      $('#propertyremarks').removeAttr("style");
    }
    this.autoremarks = " Marked the " + propertyname + " as " + this.visitupdate + ". Here is the property remarks - " + this.propertyremarks;
    this.filterLoader = true;
    var param = {
      leadid: this.leadid,
      propid: propertyid,
      execid: this.userid,
      visitupdate: $('#visitupdate').val(),
      remarks: $('#propertyremarks').val(),
      stage: "USV",
      assignid: this.usvExecutiveId,
      feedbackid: this.feedbackId
    }
    this._mandateService.addpropertyvisitupdate(param).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {
        var userid = localStorage.getItem('UserId');
        this.autoremarks = " Moved the lead to Junk, Because of " + "Not Interested";
        var leadjunkparam = {
          leadid: this.leadid,
          closedate: "",
          closetime: "",
          leadstage: "Move to Junk",
          stagestatus: '46',
          textarearemarks: 'Not Interested',
          userid: userid,
          assignid: this.usvExecutiveId,
          autoremarks: this.autoremarks,
          property: propertyid,
          feedbackid: this.feedbackId
        }
        this._mandateService.addleadhistory(leadjunkparam).subscribe((success) => {
          this.status = success.status;
        }, (err) => {
          console.log("Failed to Update");
        });
        $('#visitupdate').val("3");
        swal({
          title: 'Data Updated Successfully',
          type: "success",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          // this.ngOnInit();
          setTimeout(() => {
            this.dataUpdated.emit();
          }, 0)
          // let currentUrl = this.router.url;
          // let pathWithoutQueryParams = currentUrl.split('?')[0];
          // let currentQueryparams = this.route.snapshot.queryParams;
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //   this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          // });
        }
        );
      }
    }, (err) => {
      console.log("Failed to Update");
    })
  }

  selectProp(id, name) {
    var checkid = $("input[name='programming']:checked").map(function () {
      return this.value;
    }).get().join(',');
    this.selectedPropID = checkid;
    this.selectedPropName = name;
    this.suggestchecked = checkid;
  }
}
