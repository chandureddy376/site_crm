import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-rsvform',
  templateUrl: './mandate-rsvform.component.html',
  styleUrls: ['./mandate-rsvform.component.css']
})
export class MandateRsvformComponent implements OnInit {

  @Input() selectedExecId: any;
  @Input() selectedSuggestedProp: any;
  callStatus: any = undefined;
  date = new Date();
  priorDate = new Date(new Date().setDate(this.date.getDate() + 30));
  priorDatebefore = new Date(new Date().setDate(this.date.getDate() - 30));
  svform = false;
  svFixed = false;
  rsvform = false;
  rsvFixed = true;
  rsvreFix = false;
  rsvDone = false;
  rsvFixedsubbtn = false;
  leadid = this.route.snapshot.params['id'];
  visitedpropertylists: any;
  cancelledpropertylists: any;
  suggestchecked: any;
  executeid: any;
  status: any;
  selectedpropertylists: any;
  selectedlists: any;
  visitupdate: any;
  propid: any;
  activestagestatus: any;
  hideafterfixed = true;
  hidebeforefixed = false;
  hiderefixed = false;
  finalnegoform = false;
  negofixed = false;
  leadclosedform = false;
  leadclosed = false;
  junkform = false;
  junk = false;
  followform = false;
  followup = false;
  followdownform = false;
  followupdown = false;
  buttonhiders = true;
  autoremarks: any;
  userid: any;
  username: any;
  propertyremarks: any;
  suggestedpropertiesname: any;
  selectedproperty_commaseperated: any;
  intrestbtn: boolean = false;
  filterLoader: boolean = true;
  visitstatusupdate = false;
  commonhide = true;
  rsvExecutiveId: any;
  assigedrm: any;
  getselectedLeadExec: any;
  propertybasedFilter: any;
  mainpropid: any;
  roleid: any;
  feedbackId: any
  selectedVisitEXEC: any;
  mandateExecutives: any;

  constructor(private router: Router,
    private route: ActivatedRoute, private _mandateService: mandateservice) { }

  private isCountdownInitialized: boolean;

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.feedbackId = params['feedback'].split('?')[0];
    });

    this.userid = localStorage.getItem('UserId');
    this.username = localStorage.getItem('Name');
    this.roleid = localStorage.getItem('Role');

    if (this.userid == 1) {
      this.rsvExecutiveId = this.selectedExecId;
    } else {
      this.rsvExecutiveId = this.selectedExecId;
    }

    this._mandateService
      .getassignedrm(this.leadid, this.userid, this.selectedExecId, this.feedbackId)
      .subscribe(cust => {
        this.assigedrm = cust.RMname;
        // Adding RSV Visit date time to RSV Submission Section
        if (this.userid == 1) {
          this.rsvExecutiveId = this.selectedExecId;
        } else {
          this.rsvExecutiveId = this.selectedExecId;
        }
        let filteredInfo;
        filteredInfo = cust.RMname.filter((da) => da.executiveid == this.selectedExecId);
        this.getselectedLeadExec = filteredInfo[0];

        if (this.getselectedLeadExec.suggestedprop) {
          this.propertybasedFilter = this.getselectedLeadExec.suggestedprop;
          this.propertybasedFilter = this.propertybasedFilter.filter((da) =>
            da.propid == this.selectedSuggestedProp.propid);
          $('#RSVvisiteddate').val(this.propertybasedFilter[0].followupdate);
          $('#RSVvisitedtime').val(this.propertybasedFilter[0].followuptime);
        } else {
          $('#RSVvisiteddate').val('');
          $('#RSVvisitedtime').val('');
        }

        this.loadimportantapi();
      })


    this._mandateService
      .getactiveleadsstatus(this.leadid, this.userid, this.rsvExecutiveId, this.selectedSuggestedProp.propid, this.feedbackId)
      .subscribe(stagestatus => {
        this.filterLoader = false;
        this.activestagestatus = stagestatus['activeleadsstatus'];
        if (this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "1") {
          this.hideafterfixed = false;
          this.rsvFixed = false;
          this.hidebeforefixed = true;
          this.hiderefixed = true;
          this.rsvreFix = true;
          this.rsvDone = false;
          $('#sectionselector').val('RSV');
        } else if (this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "2") {
          this.hideafterfixed = false;
          this.rsvFixed = false;
          this.hiderefixed = true;
          this.hidebeforefixed = true;
          this.rsvreFix = true;
          // this.rsvDone = false;
          $('#sectionselector').val('RSV');
        } else if (this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "0") {
          this.hideafterfixed = false;
          this.hidebeforefixed = false;
          this.hiderefixed = false;
          this.rsvDone = true;
          this.rsvFixed = false;
          this.commonhide = false;
          $('#sectionselector').val('RSV');
        } else if (this.activestagestatus[0].stage == "RSV" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "1") {
          this.hideafterfixed = true;
          this.hidebeforefixed = false;
          this.rsvDone = false;
          this.rsvFixed = true;
          $('#sectionselector').val('RSV');
        } else {
          this.hideafterfixed = true;
        }

        if (this.activestagestatus && this.activestagestatus[0].stage == 'RSV' && (this.activestagestatus[0].stagestatus == '1' || this.activestagestatus[0].stagestatus == '2') && this.activestagestatus[0].assignedvisits == null && (this.roleid == 50013 || this.roleid == 50014 || this.getselectedLeadExec.roleid == 50013 || this.getselectedLeadExec.roleid == 50014)) {
          this.mandateExecutivesfetch()
        }
      });


    this.visitupdate = "";

    if ($('#sectionselector').val() == "SV" || $('#sectionselector').val() == "USV" || $('#sectionselector').val() == "Final Negotiation") {
      this.buttonhiders = false;
    } else {
      this.buttonhiders = true;
    }
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
      }
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
  }

  loadimportantapi() {
    var param = {
      leadid: this.leadid,
      execid: this.userid,
      stage: "RSV",
      assignid: this.rsvExecutiveId,
      feedbackid: this.feedbackId,
      propid: this.selectedSuggestedProp.propid
    }

    this._mandateService
      .rsvselectproperties(param)
      .subscribe(selectsuggested => {
        if (selectsuggested['status'] == 'True') {
          this.selectedpropertylists = selectsuggested['selectedrsvlists'];
          this.selectedpropertylists = this.selectedpropertylists.filter((da) => da.propid == this.selectedSuggestedProp.propid);
          this.selectedlists = selectsuggested;
        } else {
          this.selectedpropertylists = selectsuggested['selectedrsvlists'];
          this.selectedpropertylists = this.selectedpropertylists.filter((da) => da.propid == this.selectedSuggestedProp.propid);
          this.selectedlists = selectsuggested;
          this.visitstatusupdate = true;
        }

      });

    this._mandateService
      .getvisitedsuggestproperties(param)
      .subscribe(visitsuggested => {
        this.visitedpropertylists = visitsuggested['visitedlists'];
        if (this.visitedpropertylists) {
          this.suggestchecked = this.visitedpropertylists.map((item) => { return item.propid }).join(',');
        }
      });

    this._mandateService
      .getcancelledsuggestproperties(param)
      .subscribe(cancelsuggested => {
        this.cancelledpropertylists = cancelsuggested['cancelledlists'];
      });
  }

  mandateExecutivesfetch() {
    this._mandateService.fetchmandateexecutuves(this.selectedSuggestedProp.propid, '', '50002','').subscribe(executives => {
      if (executives['status'] == 'True') {
        setTimeout(() => {
          this.mandateExecutives = executives['mandateexecutives'];
        }, 0)
      } else {
        this.mandateExecutives = [];
      }
    });
  }

  onrsvFixed() {
    this.rsvFixed = true;
    this.rsvreFix = false;
    this.rsvDone = false;
    this.junkform = false;
    this.junk = false;
    this.followform = false;
    this.followup = false;
    this.followdownform = false;
    this.followupdown = false;
    $('#sectionselector').val('RSV');
  }

  onrsvreFix() {
    this.rsvFixed = false;
    this.rsvreFix = true;
    this.rsvDone = false;
    this.junkform = false;
    this.junk = false;
    this.followform = false;
    this.followup = false;
    this.followdownform = false;
    this.followupdown = false;
    $('#sectionselector').val('RSV');
  }

  mainpropertyid: any;
  onrsvDone() {
    this.rsvFixed = false;
    this.rsvreFix = false;
    this.rsvDone = true;
    this.junkform = false;
    this.junk = false;
    this.followform = false;
    this.followup = false;
    this.followdownform = false;
    this.followupdown = false;
    $('#sectionselector').val('RSV');
    // Loading this API again only for fetching the walkin date & time and write to the html view hidden visited date and time input boxes after the usvform in true condition
    this._mandateService
      .getassignedrm(this.leadid, this.userid, this.selectedExecId, this.feedbackId)
      .subscribe(cust => {
        // Adding RSV Visit date time to RSV Submission Section
        if (this.getselectedLeadExec.suggestedprop) {
          this.propertybasedFilter = this.getselectedLeadExec.suggestedprop;
          this.propertybasedFilter = this.propertybasedFilter.filter((da) =>
            da.propid == this.selectedSuggestedProp.propid);
          $('#RSVvisiteddate').val(this.propertybasedFilter[0].followupdate);
          $('#RSVvisitedtime').val(this.propertybasedFilter[0].followuptime);
        } else {
          $('#RSVvisiteddate').val('');
          $('#RSVvisitedtime').val('');
        }
        // Adding RSV Visit date time to RSV Submission Section
      });
    // Loading this API again only for fetching the walkin date & time and write to the html view hidden visited date and time input boxes after the usvform in true condition
  }

  onfollowup() {
    this.followform = true;
    this.followup = true;
    this.junkform = false;
    this.junk = false;
    this.rsvFixed = false;
    this.rsvreFix = false;
    this.rsvDone = false;
    $('#sectionselector').val("");
  }

  onjunk() {
    this.junkform = true;
    this.junk = true;
    this.rsvFixed = false;
    this.rsvreFix = false;
    this.rsvDone = false;
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
    this.rsvFixedsubbtn = false;
    this.finalnegoform = false;
    this.negofixed = false;
    this.leadclosedform = false;
    this.leadclosed = false;
  }

  onsvFixed() {
    this.svform = true;
    this.svFixed = true;
    this.rsvFixed = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.negofixed = false;
    this.leadclosedform = false;
    this.leadclosed = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  onrsvFixedsubbtn() {
    this.rsvFixedsubbtn = true;
    this.rsvform = true;
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
    this.rsvFixedsubbtn = false;
    this.rsvform = false;
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
    this.rsvFixedsubbtn = false;
    this.rsvform = false;
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

  // Selecting the suggested properties for fix the RSV
  selectsuggested(i, id, propname) {
    if ($('#rsvcheckbox' + i).is(':checked')) {
      var checkid = $("input[name='programmingnew']:checked").map(function () {
        return this.value;
      }).get().join(',');
      this.suggestchecked = checkid;
      this.autoremarks = " added the " + propname + " for RSV while fixing the meeting.";
    } else {
      var param = {
        leadid: this.leadid,
        suggestproperties: id,
        stage: "RSV",
        execid: this.userid,
      }
      this.suggestchecked = this.removeValue(this.suggestchecked, id);
      this.autoremarks = " removed the " + propname + " from the RSV scheduled lists.";
      this._mandateService.removeselectedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          var param = {
            leadid: this.leadid,
            execid: this.userid,
            stage: "RSV",
            assignid: this.rsvExecutiveId,
            feedbackid: this.feedbackId
          }
          this._mandateService.rsvselectproperties(param).subscribe(selectsuggested => {
            this.selectedpropertylists = selectsuggested['selectedrsvlists'];
            this.selectedlists = selectsuggested;
            // Joining the object values as comma seperated when remove the property for the history storing
            this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
            // Joining the object values as comma seperated when remove the property for the history storing
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })

    }

  }
  // Selecting the suggested properties for fix the RSV

  // Selecting the suggested properties for fix the SV again after finished RSV
  selectsuggestedsub(i, id, propname) {
    if ($('#subrsvcheckbox' + i).is(':checked')) {
      var checkid = $("input[name='programming']:checked").map(function () {
        return this.value;
      }).get().join(',');
      this.suggestchecked = checkid;
      this.autoremarks = " added the " + propname + " for RSV while fixing the meeting.";
    } else {
      var param = {
        leadid: this.leadid,
        suggestproperties: id,
        stage: "RSV",
        execid: this.userid,
      }
      this.suggestchecked = this.removeValue(this.suggestchecked, id);
      this.autoremarks = " removed the " + propname + " from the RSV scheduled lists.";
      this._mandateService.removeselectedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          var param = {
            leadid: this.leadid,
            execid: this.userid,
            stage: "RSV",
            assignid: this.rsvExecutiveId,
            feedbackid: this.feedbackId
          }
          this._mandateService.rsvselectproperties(param).subscribe(selectsuggested => {
            this.selectedpropertylists = selectsuggested['selectedrsvlists'];
            this.selectedlists = selectsuggested;
            // Joining the object values as comma seperated when remove the property for the history storing
            this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
            // Joining the object values as comma seperated when remove the property for the history storing
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })

    }

  }

  // Selecting the suggested properties for fix the SV again after finished RSV
  refixsuggested(i, id, propname) {
    if ($('#suggestcheckbox' + i).is(':checked')) {
      var checkid = $("input[name='programmingrefix']:checked").map(function () {
        return this.value;
      }).get().join(',');
      this.suggestchecked = checkid;
    } else {
      var param = {
        leadid: this.leadid,
        suggestproperties: id,
        stage: "RSV",
        execid: this.userid,
      }
      this.suggestchecked = this.removeValue(this.suggestchecked, id);
      this.autoremarks = " removed the " + propname + " from the RSV scheduled lists.";
      this._mandateService.removeselectedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          var param = {
            leadid: this.leadid,
            execid: this.userid,
            stage: "RSV",
            assignid: this.rsvExecutiveId,
            feedbackid: this.feedbackId
          }
          this._mandateService.rsvselectproperties(param).subscribe(selectsuggested => {
            this.selectedpropertylists = selectsuggested['selectedrsvlists'];
            this.selectedlists = selectsuggested;
            // Joining the object values as comma seperated when remove the property for the history storing
            this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
            // Joining the object values as comma seperated when remove the property for the history storing
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })

    }
  }

  rsvfixing() {

    var nextdate = $('#rsvnextactiondate').val();
    var nexttime = $('#rsvnextactiontime').val();
    var textarearemarks = $('#rsvtextarearemarks').val();
    // var textarearemarks = "RSV Fixed";
    var dateformatchange = new Date(nextdate).toDateString();

    //     if (this.getselectedLeadExec.suggestedprop.length > 1) {
    //       this.suggestchecked = this.selectedSuggestedProp.propid;
    //     } else {
    this.suggestchecked = this.selectedSuggestedProp.propid;
    // }

    // USV DONE with RSV Fixing
    if ($('#sectionselector').val() == "USV") {

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

      let visitupdateremarks = $('#propertyremarks').val().trim();
      if (visitupdateremarks == "") {
        $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      }
      else {
        $('#propertyremarks').removeAttr("style");
      }

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

      if ($('#rsvnextactiondate').val() == "") {
        $('#rsvnextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#rsvnextactiondate').removeAttr("style");
      }
      if ($('#rsvnextactiontime').val() == "") {
        $('#rsvnextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#rsvnextactiontime').removeAttr("style");
      }

      let rsvtextremarks = $('#rsvtextarearemarks').val().trim();
      if (rsvtextremarks == "") {
        $('#rsvtextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      }
      else {
        $('#rsvtextarearemarks').removeAttr("style");
      }

      // if ($('#visitupdate').val() == "1") {
      //   this.visitupdate = "Visited";
      // } else if ($('#visitupdate').val() == "3") {
      //   this.visitupdate = "Visited but not interested";
      // } else {
      //   this.visitupdate = "Not Visited";
      // }
      var visitedparam = {
        leadid: this.leadid,
        propid: this.suggestchecked,
        execid: this.userid,
        visitupdate: $('#visitupdate').val(),
        remarks: $('#propertyremarks').val(),
        stage: "USV",
        assignid: this.rsvExecutiveId,
        feedbackid: this.feedbackId
      }
      this.filterLoader = true;
      var usvdate = $('#USVvisiteddate').val();
      var usvtime = $('#USVvisitedtime').val();
      var usvfinalremarks = $('#propertyremarks').val();
      let date = new Date($('#USVvisiteddate').val());
      let day = date.getDay();
      let isWeekend = (day === 6 || day === 0);
      var checkedDay;
      if (isWeekend) {
        checkedDay = 2;
      } else {
        checkedDay = 1;
      }

      var param = {
        leadid: this.leadid,
        nextdate: nextdate,
        nexttime: nexttime,
        suggestproperties: this.suggestchecked,
        execid: this.userid,
        assignid: this.rsvExecutiveId,
        feedbackid: this.feedbackId
      }

      this.autoremarks = " Scheduled the RSV for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
      var leadrsvfixparam = {
        leadid: this.leadid,
        closedate: nextdate,
        closetime: nexttime,
        leadstage: "RSV",
        stagestatus: '1',
        textarearemarks: textarearemarks,
        userid: this.userid,
        assignid: this.rsvExecutiveId,
        autoremarks: this.autoremarks,
        property: this.suggestchecked,
        feedbackid: this.feedbackId
      }
      this._mandateService.addleadhistory(leadrsvfixparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {

          this._mandateService.addpropertyvisitupdate(visitedparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this._mandateService.addrsvselected(param).subscribe((success) => {
                this.status = success.status;
                if (this.status == "True") {
                  var param2 = {
                    leadid: this.leadid,
                    execid: this.userid,
                    stage: "RSV",
                    assignid: this.rsvExecutiveId,
                    feedbackid: this.feedbackId
                  }
                  this._mandateService.rsvselectproperties(param2).subscribe(selectsuggested => {
                    this.selectedpropertylists = selectsuggested['selectedrsvlists'];
                    // Joining the object values as comma seperated when remove the property for the history storing
                    this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
                    // Joining the object values as comma seperated when remove the property for the history storing

                    this.autoremarks = " Changed the status to RSV after Successfully completed USV";
                    var leadusvdoneparam = {
                      leadid: this.leadid,
                      closedate: usvdate,
                      closetime: usvtime,
                      leadstage: "USV",
                      stagestatus: '3',
                      textarearemarks: usvfinalremarks,
                      userid: this.userid,
                      assignid: this.rsvExecutiveId,
                      autoremarks: this.autoremarks,
                      property: this.suggestchecked,
                      weekplan: checkedDay,
                      feedbackid: this.feedbackId
                    }
                    this._mandateService.addleadhistory(leadusvdoneparam).subscribe((success) => {
                      this.status = success.status;
                      if (this.status == "True") {

                        this.autoremarks = " Scheduled the RSV for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
                        var leadrsvfixparam = {
                          leadid: this.leadid,
                          closedate: nextdate,
                          closetime: nexttime,
                          leadstage: "RSV",
                          stagestatus: '1',
                          textarearemarks: textarearemarks,
                          userid: this.userid,
                          assignid: this.rsvExecutiveId,
                          autoremarks: this.autoremarks,
                          property: this.suggestchecked,
                          feedbackid: this.feedbackId
                        }
                        this._mandateService.addleadhistory(leadrsvfixparam).subscribe((success) => {
                          this.status = success.status;
                          if (this.status == "True") {
                            this.filterLoader = false;
                            $('#nextactiondate').val('');
                            $('#nextactiontime').val('');
                            $('#customer_phase4').val('');
                            $('#rsvtextarearemarks').val('');
                            swal({
                              title: 'RSV Fixed Successfully',
                              type: "success",
                              timer: 2000,
                              showConfirmButton: false
                            }).then(() => {
                              let currentUrl = this.router.url;
                              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                                this.router.navigate([currentUrl]);
                              });
                            });
                          }
                        }, (err) => {
                          console.log("Failed to Update");
                        });
                      }
                    }, (err) => {
                      console.log("Failed to Update");
                    });

                  });
                }
              }, (err) => {
                console.log("Failed to Update");
              })
            }
          }, (err) => {
            console.log("Failed to Update");
          })
        } else if (this.status == "False" && success.data) {
          this.filterLoader = false;
          swal({
            title: `RSV already fixed by ${success.data[0].name}`,
            text: `Please Contact Admin to assign this visit`,
            type: "error",
            showConfirmButton: true
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      });
    }
    // USV DONE with RSV Fixing

    // DIRECT RSV Fixing - Wrong Condition - Need to Check Later
    else if ($('#sectionselector').val() == "RSV") {

      if ($('#rsvnextactiondate').val() == "") {
        $('#rsvnextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#rsvnextactiondate').removeAttr("style");
      }

      if ($('#rsvnextactiontime').val() == "") {
        $('#rsvnextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#rsvnextactiontime').removeAttr("style");
      }

      let rsvtextremarks = $('#rsvtextarearemarks').val().trim();
      if (rsvtextremarks == "") {
        $('#rsvtextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      }
      else {
        $('#rsvtextarearemarks').removeAttr("style");
      }

      this.filterLoader = true;
      var nextactiondate = $('#rsvnextactiondate').val();
      var nextactiontime = $('#rsvnextactiontime').val();

      var param1 = {
        leadid: this.leadid,
        nextdate: nextactiondate,
        nexttime: nextactiontime,
        suggestproperties: this.suggestchecked,
        execid: this.userid,
        assignid: this.rsvExecutiveId,
        feedbackid: this.feedbackId
      }
      this._mandateService.addrsvselected(param1).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          var param = {
            leadid: this.leadid,
            execid: this.userid,
            stage: "RSV",
            assignid: this.rsvExecutiveId,
            feedbackid: this.feedbackId
          }
          this._mandateService.rsvselectproperties(param).subscribe(selectsuggested => {
            this.selectedpropertylists = selectsuggested['selectedrsvlists'];
            // Joining the object values as comma seperated when remove the property for the history storing
            this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
            // Joining the object values as comma seperated when remove the property for the history storing

            this.autoremarks = " Scheduled the RSV for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
            var leadrsvfixparam = {
              leadid: this.leadid,
              closedate: nextdate,
              closetime: nexttime,
              leadstage: "RSV",
              stagestatus: '1',
              textarearemarks: textarearemarks,
              userid: this.userid,
              assignid: this.rsvExecutiveId,
              autoremarks: this.autoremarks,
              property: this.suggestchecked,
              feedbackid: this.feedbackId
            }
            this._mandateService.addleadhistory(leadrsvfixparam).subscribe((success) => {
              this.status = success.status;
              if (this.status == "True") {
                this.filterLoader = false;
                $('#nextactiondate').val('');
                $('#nextactiontime').val('');
                $('#customer_phase4').val('');
                $('#rsvtextarearemarks').val('');
                swal({
                  title: 'RSV Fixed Successfully',
                  type: "success",
                  timer: 2000,
                  showConfirmButton: false
                }).then(() => {
                  let currentUrl = this.router.url;
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate([currentUrl]);
                  });
                });
              } else if (this.status == "False" && success.data) {
                this.filterLoader = false;
                swal({
                  title: `RSV already fixed by ${success.data[0].name}`,
                  text: `Please Contact Admin to assign this visit`,
                  type: "error",
                  showConfirmButton: true
                }).then(() => {
                  let currentUrl = this.router.url;
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate([currentUrl]);
                  });
                });
              }
            }, (err) => {
              console.log("Failed to Update");
            });
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
    // DIRECT RSV Fixing - Wrong Condition - Need to Check Later

    // NEGOTIATION DONE with RSV Fixing

    else if ($('#sectionselector').val() == "Final Negotiation") {

      if ($('#visitupdate').val() == "") {
        swal({
          title: 'Action Not Took',
          text: 'Please Confirm Property Revisited or Not',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      }
      else {
      }

      let visitupdateremarks = $('#propertyremarks').val().trim();
      if (visitupdateremarks == "") {
        $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      }
      else {
        $('#propertyremarks').removeAttr("style");
      }
      if ($('#negovisiteddate').val() == "") {
        $('#negovisiteddate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#negovisiteddate').removeAttr("style");
      }

      if ($('#negovisitedtime').val() == "") {
        $('#negovisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#negovisitedtime').removeAttr("style");
      }

      if ($('#rsvnextactiondate').val() == "") {
        $('#rsvnextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#rsvnextactiondate').removeAttr("style");
      }
      if ($('#rsvnextactiontime').val() == "") {
        $('#rsvnextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#rsvnextactiontime').removeAttr("style");
      }
      if (this.suggestchecked == "") {
        swal({
          title: 'Property Not Selected',
          text: 'Please select atleast one property for the RSV',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      }
      else {

      }
      let rsvtextremarks = $('#rsvtextarearemarks').val().trim();
      if (rsvtextremarks == "") {
        $('#rsvtextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      }
      else {
        $('#rsvtextarearemarks').removeAttr("style");
      }

      var negovisitparam = {
        leadid: this.leadid,
        propid: this.suggestchecked,
        execid: this.userid,
        visitupdate: $('#visitupdate').val(),
        remarks: $('#propertyremarks').val(),
        stage: "Final Negotiation",
        assignid: this.rsvExecutiveId,
        feedbackid: this.feedbackId
      }

      this.filterLoader = true;
      var visiteddate = $('#negovisiteddate').val();
      var visitedtime = $('#negovisitedtime').val();
      var negofinalremarks = "Final Negotiation Finished";

      let date = new Date($('#negovisiteddate').val());
      let day = date.getDay();
      let isWeekend = (day === 6 || day === 0);
      var checkedDay;
      if (isWeekend) {
        checkedDay = 2;
      } else {
        checkedDay = 1;
      }

      var nextactiondate = $('#rsvnextactiondate').val();
      var nextactiontime = $('#rsvnextactiontime').val();

      var param = {
        leadid: this.leadid,
        nextdate: nextactiondate,
        nexttime: nextactiontime,
        suggestproperties: this.suggestchecked,
        execid: this.userid,
        assignid: this.rsvExecutiveId,
        feedbackid: this.feedbackId
      }

      this.autoremarks = " Scheduled the RSV for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
      var leadrsvfixparam = {
        leadid: this.leadid,
        closedate: nextdate,
        closetime: nexttime,
        leadstage: "RSV",
        stagestatus: '1',
        textarearemarks: textarearemarks,
        userid: this.userid,
        assignid: this.rsvExecutiveId,
        autoremarks: this.autoremarks,
        property: this.suggestchecked,
        feedbackid: this.feedbackId
      }
      this._mandateService.addleadhistory(leadrsvfixparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {

          this._mandateService.addpropertyvisitupdate(negovisitparam).subscribe((success) => {
            this._mandateService.addrsvselected(param).subscribe((success) => {
              this.status = success.status;
              if (this.status == "True") {
                var param = {
                  leadid: this.leadid,
                  execid: this.userid,
                  stage: "RSV",
                  assignid: this.rsvExecutiveId,
                  feedbackid: this.feedbackId
                }
                this._mandateService.rsvselectproperties(param).subscribe(selectsuggested => {
                  this.selectedpropertylists = selectsuggested['selectedrsvlists'];
                  // Joining the object values as comma seperated when remove the property for the history storing
                  this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
                  // Joining the object values as comma seperated when remove the property for the history storing

                  this.autoremarks = " Scheduled the RSV after Successfully completed Final negotiation";
                  var leadnegodoneparam = {
                    leadid: this.leadid,
                    closedate: visiteddate,
                    closetime: visitedtime,
                    leadstage: "Final Negotiation",
                    stagestatus: '3',
                    textarearemarks: negofinalremarks,
                    userid: this.userid,
                    assignid: this.rsvExecutiveId,
                    autoremarks: this.autoremarks,
                    property: this.suggestchecked,
                    weekplan: checkedDay,
                    feedbackid: this.feedbackId
                  }
                  this._mandateService.addleadhistory(leadnegodoneparam).subscribe((success) => {
                    this.status = success.status;
                    if (this.status == "True") {
                      this.autoremarks = " Scheduled the RSV for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
                      var leadrsvfixparam = {
                        leadid: this.leadid,
                        closedate: nextdate,
                        closetime: nexttime,
                        leadstage: "RSV",
                        stagestatus: '1',
                        textarearemarks: textarearemarks,
                        userid: this.userid,
                        assignid: this.rsvExecutiveId,
                        autoremarks: this.autoremarks,
                        property: this.suggestchecked,
                        feedbackid: this.feedbackId
                      }
                      this._mandateService.addleadhistory(leadrsvfixparam).subscribe((success) => {
                        this.status = success.status;
                        if (this.status == "True") {
                          this.filterLoader = false;
                          $('#nextactiondate').val('');
                          $('#nextactiontime').val('');
                          $('#customer_phase4').val('');
                          $('#rsvtextarearemarks').val('');
                          swal({
                            title: 'RSV Fixed Successfully',
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
                          }).then((result) => {
                            let currentUrl = this.router.url;
                            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                              this.router.navigate([currentUrl]);
                            });
                          });
                        }
                      }, (err) => {
                        console.log("Failed to Update");
                      });
                    }
                  }, (err) => {
                    console.log("Failed to Update");
                  });

                });
              }
            }, (err) => {
              console.log("Failed to Update");
            })
          }, (err) => {
            console.log("Failed to Update");
          })
        } else if (this.status == "False" && success.data) {
          this.filterLoader = false;
          swal({
            title: `RSV already fixed by ${success.data[0].name}`,
            text: `Please Contact Admin to assign this visit`,
            type: "error",
            showConfirmButton: true
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      });
    }

    else {
      if ($('#rsvnextactiondate').val() == "") {
        $('#rsvnextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#rsvnextactiondate').removeAttr("style");
      }
      if ($('#rsvnextactiontime').val() == "") {
        $('#rsvnextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#rsvnextactiontime').removeAttr("style");
      }
      let rsvtextremarks = $('#rsvtextarearemarks').val().trim();
      if (rsvtextremarks == "") {
        $('#rsvtextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      }
      else {
        $('#rsvtextarearemarks').removeAttr("style");
      }
      this.filterLoader = true;
      var nextactiondate = $('#rsvnextactiondate').val();
      var nextactiontime = $('#rsvnextactiontime').val();

      var param1 = {
        leadid: this.leadid,
        nextdate: nextactiondate,
        nexttime: nextactiontime,
        suggestproperties: this.suggestchecked,
        execid: this.userid,
        assignid: this.rsvExecutiveId,
        feedbackid: this.feedbackId
      }
      this._mandateService.addrsvselected(param1).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          var param = {
            leadid: this.leadid,
            execid: this.userid,
            stage: "RSV",
            assignid: this.rsvExecutiveId,
            feedbackid: this.feedbackId
          }
          this._mandateService.rsvselectproperties(param).subscribe(selectsuggested => {
            this.selectedpropertylists = selectsuggested['selectedrsvlists'];
            // Joining the object values as comma seperated when remove the property for the history storing
            this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
            // Joining the object values as comma seperated when remove the property for the history storing

            this.autoremarks = " Scheduled the RSV for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
            var leadrsvfixparam = {
              leadid: this.leadid,
              closedate: nextdate,
              closetime: nexttime,
              leadstage: "RSV",
              stagestatus: '1',
              textarearemarks: textarearemarks,
              userid: this.userid,
              assignid: this.rsvExecutiveId,
              autoremarks: this.autoremarks,
              property: this.suggestchecked,
              feedbackid: this.feedbackId
            }
            this._mandateService.addleadhistory(leadrsvfixparam).subscribe((success) => {
              this.status = success.status;
              if (this.status == "True") {
                this.filterLoader = false;
                $('#nextactiondate').val('');
                $('#nextactiontime').val('');
                $('#customer_phase4').val('');
                $('#rsvtextarearemarks').val('');
                swal({
                  title: 'RSV Fixed Successfully',
                  type: "success",
                  timer: 2000,
                  showConfirmButton: false
                }).then(() => {
                  let currentUrl = this.router.url;
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate([currentUrl]);
                  });
                });
              } else if (this.status == "False" && success.data) {
                this.filterLoader = false;
                swal({
                  title: `RSV already fixed by ${success.data[0].name}`,
                  text: `Please Contact Admin to assign this visit`,
                  type: "error",
                  showConfirmButton: true
                }).then(() => {
                  let currentUrl = this.router.url;
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate([currentUrl]);
                  });
                });
              }
            }, (err) => {
              console.log("Failed to Update");
            });
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
    // NEGOTIATION DONE with RSV Fixing
  }

  rsvrefixing() {

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
    let rsvrefixremarks = $('#refixtextarearemarks').val().trim();
    if (rsvrefixremarks == "") {
      $('#refixtextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
      return false;
    }
    else {
      $('#refixtextarearemarks').removeAttr("style");
    }

    if (this.getselectedLeadExec.suggestedprop.length > 1) {
      this.suggestchecked = this.selectedSuggestedProp.propid;
    } else {
      this.suggestchecked = this.assigedrm[0].suggestedprop[0].propid;
    }

    this.filterLoader = true;
    var nextdate = $('#refixdate').val();
    var nexttime = $('#refixtime').val();
    var textarearemarks = $('#refixtextarearemarks').val();
    var dateformatchange = new Date(nextdate).toDateString();

    var param = {
      leadid: this.leadid,
      nextdate: nextdate,
      nexttime: nexttime,
      suggestproperties: this.suggestchecked,
      execid: this.userid,
      assignid: this.rsvExecutiveId,
      feedback: this.feedbackId
    }
    this._mandateService.addrsvselectedrefix(param).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {
        var param = {
          leadid: this.leadid,
          execid: this.userid,
          stage: "RSV",
          assignid: this.rsvExecutiveId,
          feedbackid: this.feedbackId
        }
        this._mandateService.rsvselectproperties(param).subscribe(selectsuggested => {
          this.selectedpropertylists = selectsuggested['selectedrsvlists'];
          // Joining the object values as comma seperated when remove the property for the history storing
          this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
          // Joining the object values as comma seperated when remove the property for the history storing

          this.autoremarks = " ReFixed the RSV for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
          var leadrsvrefixparam = {
            leadid: this.leadid,
            closedate: nextdate,
            closetime: nexttime,
            leadstage: "RSV",
            stagestatus: '2',
            textarearemarks: textarearemarks,
            userid: this.userid,
            assignid: this.rsvExecutiveId,
            autoremarks: this.autoremarks,
            property: this.suggestchecked,
            feedbackid: this.feedbackId
          }
          this._mandateService.addleadhistory(leadrsvrefixparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this.filterLoader = false;
              swal({
                title: 'RSV Refixed Successfully',
                type: "success",
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
                let currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              });
            } else if (this.status == "False" && success.data) {
              this.filterLoader = false;
              swal({
                title: `RSV already fixed by ${success.data[0].name}`,
                text: `Please Contact Admin to assign this visit`,
                type: "error",
                showConfirmButton: true
              }).then(() => {
                let currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              });
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        });
      }
    }, (err) => {
      console.log("Failed to Update");
    })

  }

  rsvdonewithfixing() {
    // if ($('#visitupdate').val() == "") {
    //   swal({
    //     title: 'Action Not Took',
    //     text: 'Please select any actions',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }
    // else {
    //   $('#visitupdate').removeAttr("style");
    // }
    let visitupdateremarks = $('#propertyremarks').val().trim();
    if (visitupdateremarks == "") {
      $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
      return false;
    }
    else {
      $('#propertyremarks').removeAttr("style");
    }
    if ($('#RSVvisiteddate').val() == "") {
      $('#RSVvisiteddate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
      return false;
    }
    else {
      $('#RSVvisiteddate').removeAttr("style");
    }

    if ($('#RSVvisitedtime').val() == "") {
      $('#RSVvisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
      return false;
    }
    else {
      $('#RSVvisitedtime').removeAttr("style");
    }

    if ($('#subrsvnextactiondate').val() == "") {
      $('#subrsvnextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
      return false;
    }
    else {
      $('#subrsvnextactiondate').removeAttr("style");
    }
    if ($('#subrsvnextactiontime').val() == "") {
      $('#subrsvnextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
      return false;
    }
    else {
      $('#subrsvnextactiontime').removeAttr("style");
    }

    let subrsvremarks = $('#subrsvtextarearemarks').val().trim();
    if (subrsvremarks == "") {
      $('#subrsvtextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
      return false;
    }
    else {
      $('#subrsvtextarearemarks').removeAttr("style");
    }

    if (this.getselectedLeadExec.suggestedprop.length > 1) {
      this.suggestchecked = this.selectedSuggestedProp.propid;
    } else {
      this.suggestchecked = this.assigedrm[0].suggestedprop[0].propid;
    }

    var visitedparam = {
      leadid: this.leadid,
      propid: this.suggestchecked,
      execid: this.userid,
      visitupdate: 1,
      remarks: $('#propertyremarks').val(),
      stage: $('#customer_phase4').val(),
      assignid: this.rsvExecutiveId,
      feedbackid: this.feedbackId
    }

    this.filterLoader = true;
    var nextactiondate = $('#subrsvnextactiondate').val();
    var nextactiontime = $('#subrsvnextactiontime').val();
    var param = {
      leadid: this.leadid,
      nextdate: nextactiondate,
      nexttime: nextactiontime,
      suggestproperties: this.suggestchecked,
      execid: this.userid,
      assignid: this.rsvExecutiveId,
      feedbackid: this.feedbackId
    }

    this.autoremarks = " Scheduled the RSV for " + this.selectedproperty_commaseperated + " On " + new Date($('#subrsvnextactiontime').val()).toDateString() + " " + $('#subrsvnextactiontime').val();
    var leadrsvfixparam = {
      leadid: this.leadid,
      closedate: $('#subrsvnextactiondate').val(),
      closetime: $('#subrsvnextactiontime').val(),
      leadstage: "RSV",
      stagestatus: '1',
      textarearemarks: $('#subrsvtextarearemarks').val(),
      userid: this.userid,
      assignid: this.rsvExecutiveId,
      autoremarks: this.autoremarks,
      property: this.suggestchecked,
      feedbackid: this.feedbackId
    }
    this._mandateService.addleadhistory(leadrsvfixparam).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {

        this._mandateService.addpropertyvisitupdate(visitedparam).subscribe((success) => {
          this.status = success.status;
          if (this.status == "True") {
            this._mandateService.addrsvselected(param).subscribe((success) => {
              var param = {
                leadid: this.leadid,
                execid: this.userid,
                stage: "RSV",
                assignid: this.rsvExecutiveId,
                feedbackid: this.feedbackId
              }
              this._mandateService.rsvselectproperties(param).subscribe(selectsuggested => {
                this.selectedpropertylists = selectsuggested['selectedrsvlists'];
                // Joining the object values as comma seperated when remove the property for the history storing
                this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
                // Joining the object values as comma seperated when remove the property for the history storing

                var rsvvisiteddate = $('#RSVvisiteddate').val();
                var rsvvisitedtime = $('#RSVvisitedtime').val();

                let date = new Date($('#RSVvisitedtime').val());
                let day = date.getDay();
                let isWeekend = (day === 6 || day === 0);
                var checkedDay;
                if (isWeekend) {
                  checkedDay = 2;
                } else {
                  checkedDay = 1;
                }

                var rsvfinalremarks = "RSV Done"
                this.autoremarks = " Completed the RSV Successfully";
                var leadrsvdoneparam = {
                  leadid: this.leadid,
                  closedate: rsvvisiteddate,
                  closetime: rsvvisitedtime,
                  leadstage: "RSV",
                  stagestatus: '3',
                  textarearemarks: rsvfinalremarks,
                  userid: this.userid,
                  assignid: this.rsvExecutiveId,
                  autoremarks: this.autoremarks,
                  property: this.suggestchecked,
                  weekplan: checkedDay,
                  feedbackid: this.feedbackId
                }
                this._mandateService.addleadhistory(leadrsvdoneparam).subscribe((success) => {
                  this.status = success.status;
                  if (this.status == "True") {
                    var nextdate = $('#subrsvnextactiondate').val();
                    var nexttime = $('#subrsvnextactiontime').val();
                    var textarearemarks = $('#subrsvtextarearemarks').val();
                    this.autoremarks = " again scheduled the RSV";
                    var dateformatchange = new Date(nextdate).toDateString();

                    this.autoremarks = " Scheduled the RSV again for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
                    var leadrsvfixparam = {
                      leadid: this.leadid,
                      closedate: nextdate,
                      closetime: nexttime,
                      leadstage: "RSV",
                      stagestatus: '1',
                      textarearemarks: textarearemarks,
                      userid: this.userid,
                      assignid: this.rsvExecutiveId,
                      autoremarks: this.autoremarks,
                      property: this.suggestchecked,
                      feedbackid: this.feedbackId
                    }
                    this._mandateService.addleadhistory(leadrsvfixparam).subscribe((success) => {
                      this.status = success.status;
                      if (this.status == "True") {
                        this.filterLoader = false;
                        $('#nextactiondate').val('');
                        $('#nextactiontime').val('');
                        $('#customer_phase4').val('');
                        $('#rsvtextarearemarks').val('');
                        swal({
                          title: 'RSV Fixed Succesfully',
                          type: "success",
                          timer: 2000,
                          showConfirmButton: false
                        }).then(() => {
                          let currentUrl = this.router.url;
                          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                            this.router.navigate([currentUrl]);
                          });
                        });
                      }
                    }, (err) => {
                      console.log("Failed to Update");
                    });
                  }
                }, (err) => {
                  console.log("Failed to Update");
                });
              });
            }, (err) => {
              console.log("Failed to Update");
            })
          }
        }, (err) => {
          console.log("Failed to Update");
        })

      } else if (this.status == "False" && success.data) {
        this.filterLoader = false;
        swal({
          title: `RSV already fixed by ${success.data[0].name}`,
          text: `Please Contact Admin to assign this visit`,
          type: "error",
          showConfirmButton: true
        }).then(() => {
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        });
      }
    }, (err) => {
      console.log("Failed to Update");
    });
  }

  visitclick(propertyname) {
    $('#visitupdate').val("1");
    $('.nextactionmaindiv').removeAttr('style');
    $('.visitupdatebtn').attr("style", "display:none;");
  }

  cancelclick(propertyname) {
    $('#visitupdate').val("3");
    $('.visitupdatebtn').removeAttr('style');
    $('.nextactionmaindiv').attr("style", "display:none;");
    this.followdownform = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.leadclosedform = false;
  }

  updatepropertyvisit(propertyid, propertyname) {
    if ($('#visitupdate').val() == "1") {
      this.visitupdate = "Visited";
    } else {
      this.visitupdate = "Not Visited";
    }
    this.propertyremarks = $('#propertyremarks').val();

    if ($('#visitupdate').val() == "") {
      swal({
        title: 'Action Not Took',
        text: 'Please Confirm Property Revisited or Not',
        heightAuto: false,
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    }
    else {
      $('#visitupdate').removeAttr("style");
    }
    let visitupdateremarks = $('#propertyremarks').val().trim();
    if (visitupdateremarks == "") {
      $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
      return false;
    }
    else {
      $('#propertyremarks').removeAttr("style");
    }
    this.filterLoader = true;
    var param = {
      leadid: this.leadid,
      propid: propertyid,
      execid: this.userid,
      visitupdate: $('#visitupdate').val(),
      remarks: $('#propertyremarks').val(),
      stage: "RSV",
      assignid: this.rsvExecutiveId,
      feedbackid: this.feedbackId
    }
    this.autoremarks = " Marked the " + propertyname + " as " + this.visitupdate + ". Here is the property remarks - " + this.propertyremarks;
    this._mandateService.addpropertyvisitupdate(param).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {
        var userid = localStorage.getItem('UserId');
        this.autoremarks = " Moved the lead to Junk, Because of" + "Not Interested";
        var leadjunkparam = {
          leadid: this.leadid,
          closedate: "",
          closetime: "",
          leadstage: "Move to Junk",
          stagestatus: '46',
          textarearemarks: 'Not Interested',
          userid: userid,
          assignid: this.rsvExecutiveId,
          autoremarks: this.autoremarks,
          property: propertyid,
          feedbackid: this.feedbackId
        }
        this._mandateService.addleadhistory(leadjunkparam).subscribe((success) => {
          this.status = success.status;
        }, (err) => {
          console.log("Failed to Update");
        });
        this.filterLoader = false;
        swal({
          title: 'Data Updated Successfully',
          type: "success",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          // this.loadimportantapi();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        });
      }
    }, (err) => {
      console.log("Failed to Update");
    })
  }

  executiveSelect(event) {
    this.selectedVisitEXEC = event.value.id;
  }

  visitConvert() {
    if (this.selectedVisitEXEC == '' || this.selectedVisitEXEC == null || this.selectedVisitEXEC == undefined) {
      swal({
        title: 'Please Select the Executive.',
        text: 'Please try again',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      $('#rm_dropdown').focus().css("border-color", "red").attr('placeholder', 'Please Select the Executives');
      return false;
    } else {
      $('#rm_dropdown').removeAttr("style");
    }

    let param = {
      leadid: this.leadid,
      propid: this.selectedSuggestedProp.propid,
      fromexecutives: this.selectedExecId,
      toexecutives: this.selectedVisitEXEC,
      loginid: this.userid,
      crmtype: '1'
    };

    this.filterLoader = true;
    this._mandateService.visitAssign(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == "True") {
        swal({
          title: 'Visit Assigned Successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        $('#rm_dropdown').dropdown('clear');
        $('.modal-backdrop').closest('div').remove();
        document.body.classList.remove('modal-open');
        let currentUrl = this.router.url.split('?')[0];
        let currentQueryParams = this.route.snapshot.queryParams;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl], { queryParams: currentQueryParams })
        })
      } else {
        swal({
          title: 'Authentication Failed!',
          text: 'Please try again',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    })

  }
}
