import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-on-call-nego',
  templateUrl: './mandate-on-call-nego.component.html',
  styleUrls: ['./mandate-on-call-nego.component.css']
})

export class MandateOnCallNegoComponent implements OnInit {

  @Input() selectedExecId: any;
  @Input() selectedSuggestedProp: any;
  @Input() calledLead: any;
  @Input() assignedRm: any;
  callStatus: any = undefined;
  date = new Date();
  @Output() dataUpdated: EventEmitter<void> = new EventEmitter();
  priorDate = new Date(new Date().setDate(this.date.getDate() + 30));
  priorDatebefore = new Date(new Date().setDate(this.date.getDate() - 30));
  leadid: any;
  visitedpropertylists: any;
  negotiatedproperty: any;
  cancelledpropertylists: any;
  selectedpropertylists: any;
  selectedproperty_commaseperated: any;
  selectedlists: any;
  suggestchecked: any;
  svform = false;
  svFixed = false;
  rsvform = false;
  rsvFixed = false;
  negoFixed = true;
  negoDone = false;
  finalnegoform = false;
  subnegofixed = false;
  executeid: any;
  status: any;
  leadclosedform = false;
  leadclosed = false;
  junkform = false;
  junk = false;
  negoreFix = false;
  followform = false;
  followup = false;
  followdownform = false;
  followupdown = false;
  hideafterfixed = true;
  hidebeforefixed = false;
  activestagestatus: any;
  buttonhiders = true;
  autoremarks: any;
  userid: any;
  username: any;
  propertyremarks: any;
  suggestedpropertiesname: any;
  visitupdate: any;
  intrestbtn: boolean = false;
  filterLoader: boolean = true;
  visitstatusupdate = false;
  mainpropid: any;
  commonhide = true;
  negoExecutiveId: any;
  getselectedLeadExec: any;
  propertybasedFilter: any;
  private isCountdownInitialized: boolean;
  roleid: any;
  feedbackId: any

  constructor(private router: Router,
    private route: ActivatedRoute, private _mandateService: mandateservice) { }


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
      this.negoExecutiveId = this.selectedExecId;
    } else {
      this.negoExecutiveId = this.selectedExecId;
    }

    this._mandateService
      .getassignedrm(this.leadid, this.userid, this.selectedExecId, this.feedbackId)
      .subscribe(cust => {
        // Adding RSV Visit date time to RSV Submission Section
        // $('#negovisiteddate').val(cust[0]['suggestedprop'][0].followupdate);
        // $('#negovisitedtime').val(cust[0]['suggestedprop'][0].followuptime);
        // Adding RSV Visit date time to RSV Submission Section

        let filteredInfo;
        filteredInfo = cust.RMname.filter((da) => da.executiveid == this.selectedExecId);
        this.getselectedLeadExec = filteredInfo[0];
        if (this.userid == 1) {
          this.negoExecutiveId = this.selectedExecId;
        } else {
          this.negoExecutiveId = this.selectedExecId;
        }

        if (this.getselectedLeadExec) {
          this.propertybasedFilter = this.getselectedLeadExec.suggestedprop;
          this.propertybasedFilter = this.propertybasedFilter.filter((da) =>
            da.propid == this.selectedSuggestedProp.propid);
          $('#negovisiteddate').val(this.propertybasedFilter[0].followupdate);
          $('#negovisitedtime').val(this.propertybasedFilter[0].followuptime);
        } else {
          $('#negovisiteddate').val('');
          $('#negovisitedtime').val('');
        }

        this.loadimportantapi();
      });

    this._mandateService
      .getactiveleadsstatus(this.leadid, this.userid, this.negoExecutiveId, this.selectedSuggestedProp.propid, this.feedbackId)
      .subscribe(stagestatus => {
        this.filterLoader = false;
        this.activestagestatus = stagestatus['activeleadsstatus'];
        if (this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "1") {
          this.hideafterfixed = false;
          this.negoFixed = false;
          this.hidebeforefixed = true;
          this.negoreFix = true;
          $('#sectionselector').val('Final Negotiation');
        } else if (this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "2") {
          this.hideafterfixed = false;
          this.negoFixed = false;
          this.hidebeforefixed = true;
          this.negoreFix = true;
          $('#sectionselector').val('Final Negotiation');
        } else if (this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "0") {
          this.hideafterfixed = false;
          this.hidebeforefixed = false;
          this.negoDone = false;
          this.negoFixed = false;
          this.negoDone = true;
          this.commonhide = false;
          $('#sectionselector').val('Final Negotiation');
        } else if (this.activestagestatus[0].stage == "Final Negotiation" && this.activestagestatus[0].stagestatus == "3" && this.activestagestatus[0].visitstatus == "1") {
          this.hideafterfixed = true;
          this.hidebeforefixed = false;
          this.negoDone = false;
          this.negoFixed = true;
          $('#sectionselector').val('Final Negotiation');
        } else {
          this.hideafterfixed = true;
        }
      });

    if ($('#sectionselector').val() == "SV" || $('#sectionselector').val() == "USV" || $('#sectionselector').val() == "RSV") {
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
      stage: $('#customer_phase4').val(),
      assignid: this.negoExecutiveId,
      feedbackid: this.feedbackId,
      propid: this.selectedSuggestedProp.propid
    }
    this._mandateService
      .negoselectproperties(this.leadid, this.userid, this.negoExecutiveId, this.feedbackId)
      .subscribe(selectsuggested => {
        if (selectsuggested['status'] == 'True') {
          this.selectedpropertylists = selectsuggested['selectednegolists'];
          this.selectedpropertylists = this.selectedpropertylists.filter((da) => da.propid == this.selectedSuggestedProp.propid);
          this.selectedlists = selectsuggested;
        } else {
          this.selectedpropertylists = selectsuggested['selectednegolists'];
          this.selectedpropertylists = this.selectedpropertylists.filter((da) => da.propid == this.selectedSuggestedProp.propid);
          this.selectedlists = selectsuggested;
          this.visitstatusupdate = true;
        }
      });

    this._mandateService
      .getnegotiatedproperties(param)
      .subscribe(negotiated => {
        this.negotiatedproperty = negotiated['negotiatedlists'];
      });

    this._mandateService
      .getvisitedsuggestproperties(param)
      .subscribe(visitsuggested => {
        this.visitedpropertylists = visitsuggested['visitedlists'];
        this.suggestchecked = this.visitedpropertylists.map((item) => { return item.propid }).join(',');
      });

    this._mandateService
      .getcancelledsuggestproperties(param)
      .subscribe(cancelsuggested => {
        this.cancelledpropertylists = cancelsuggested['cancelledlists'];
      });
  }

  onnegoFixed() {
    this.negoFixed = true;
    this.negoDone = false;
    this.junkform = false;
    this.junk = false;
    this.negoreFix = false;
    this.followform = false;
    this.followup = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  onnegoreFix() {
    this.negoreFix = true;
    this.negoFixed = false;
    this.negoDone = false;
    this.junkform = false;
    this.junk = false;
    this.followform = false;
    this.followup = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  onnegoDone() {
    this.negoFixed = false;
    this.negoDone = true;
    this.junkform = false;
    this.junk = false;
    this.negoreFix = false;
    this.followform = false;
    this.followup = false;
    this.followdownform = false;
    this.followupdown = false;
    $('#sectionselector').val('Final Negotiation');
  }

  onfollowup() {
    this.followform = true;
    this.followup = true;
    this.negoFixed = false;
    this.negoDone = false;
    this.junkform = false;
    this.junk = false;
    this.negoreFix = false;
    $('#sectionselector').val("");
  }

  onjunk() {
    this.junkform = true;
    this.junk = true;
    this.negoFixed = false;
    this.negoDone = false;
    this.negoreFix = false;
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
    this.subnegofixed = false;
    this.leadclosedform = false;
    this.leadclosed = false;
  }

  onsvFixed() {
    this.svform = true;
    this.svFixed = true;
    this.rsvFixed = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.subnegofixed = false;
    this.leadclosedform = false;
    this.leadclosed = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  onrsvFixed() {
    this.rsvform = true;
    this.rsvFixed = true;
    this.svFixed = false;
    this.svform = false;
    this.finalnegoform = false;
    this.subnegofixed = false;
    this.leadclosedform = false;
    this.leadclosed = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  onsubnegofixed() {
    this.finalnegoform = true;
    this.subnegofixed = true;
    this.rsvform = false;
    this.rsvFixed = false;
    this.svFixed = false;
    this.svform = false;
    this.leadclosedform = false;
    this.leadclosed = false;
    this.followdownform = false;
    this.followupdown = false;
  }

  onleadclosed() {
    this.leadclosedform = true;
    this.leadclosed = true;
    this.finalnegoform = false;
    this.subnegofixed = false;
    this.rsvform = false;
    this.rsvFixed = false;
    this.svFixed = false;
    this.svform = false;
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

  selectsuggested(i, id, propname) {
    if ($('#negocheckbox' + i).is(':checked')) {
      var checkid = $("input[name='programming']:checked").map(function () {
        return this.value;
      }).get().join(',');
      this.suggestchecked = checkid;
      this.autoremarks = " Selected the " + propname + " for Finalnegotiation.";
    } else {
      var param = {
        leadid: this.leadid,
        suggestproperties: id,
        stage: 'Final Negotiation',
        execid: this.userid,
      }
      this.suggestchecked = this.removeValue(this.suggestchecked, id);
      this.autoremarks = " removed the " + propname + " from the Finalnegotiation scheduled lists.";
      this._mandateService.removeselectedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this._mandateService.negoselectproperties(this.leadid, this.userid, this.negoExecutiveId, this.feedbackId).subscribe(selectsuggested => {
            this.selectedpropertylists = selectsuggested['selectednegolists'];
            this.selectedlists = selectsuggested;
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
  }

  selectsuggestedsub(i, id, propname) {
    if ($('#subnegocheckbox' + i).is(':checked')) {
      var checkid = $("input[name='programming']:checked").map(function () {
        return this.value;
      }).get().join(',');
      this.suggestchecked = checkid;
      this.autoremarks = " Selected the " + propname + " for Finalnegotiation.";
    } else {
      var param = {
        leadid: this.leadid,
        suggestproperties: id,
        stage: 'Final Negotiation',
        execid: this.userid,
      }
      this.suggestchecked = this.removeValue(this.suggestchecked, id);
      this.autoremarks = " removed the " + propname + " from the Finalnegotiation scheduled lists.";
      this._mandateService.removeselectedproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this._mandateService.negoselectproperties(this.leadid, this.userid, this.negoExecutiveId, this.feedbackId).subscribe(selectsuggested => {
            this.selectedpropertylists = selectsuggested['selectednegolists'];
            this.selectedlists = selectsuggested;
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
  }

  refixsuggested(i, id, propname) {
    if ($('#suggestcheckbox' + i).is(':checked')) {
      var checkid = $("input[name='programmingrefix']:checked").map(function () {
        return this.value;
      }).get().join(',');
      this.suggestchecked = checkid;
    } else {

      var param2 = {
        leadid: this.leadid,
        suggestproperties: id,
        stage: 'Final Negotiation',
        execid: this.userid,
      }
      this.suggestchecked = this.removeValue(this.suggestchecked, id);
      this.autoremarks = " removed the " + propname + " from the Finalnegotiation scheduled lists while refixing the meeting.";
      this._mandateService.removeselectedproperties(param2).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this._mandateService
            .negoselectproperties(this.leadid, this.userid, this.negoExecutiveId, this.feedbackId)
            .subscribe(selectsuggested => {
              this.selectedpropertylists = selectsuggested['selectednegolists'];
              this.selectedlists = selectsuggested;
            });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
  }

  negofixing() {
    var nextdate = $('#negonextactiondate').val();
    var nexttime = $('#negonextactiontime').val();
    var textarearemarks = $('#negotextarearemarks').val();
    var assignid = this.negoExecutiveId;
    var dateformatchange = new Date(nextdate).toDateString();
    // USV DONE with NEGOTIATION Fixing
    if (this.getselectedLeadExec.suggestedprop.length > 1) {
      this.suggestchecked = this.selectedSuggestedProp.propid;
    } else {
      this.suggestchecked = this.getselectedLeadExec.suggestedprop[0].propid;
    }
    if ($('#sectionselector').val() == "USV") {

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

      let visitremarks = $('#propertyremarks').val().trim();
      if (visitremarks == "") {
        $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      }
      else {
        $('#propertyremarks').removeAttr("style");
      }

      if ($('#negonextactiondate').val() == "") {
        $('#negonextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#negonextactiondate').removeAttr("style");
      }
      if ($('#negonextactiontime').val() == "") {
        $('#negonextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#negonextactiontime').removeAttr("style");
      }
      let negotextremarks = $('#negotextarearemarks').val().trim();
      if (negotextremarks == "") {
        $('#negotextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks for the final negotiation');
        return false;
      }
      else {
        $('#negotextarearemarks').removeAttr("style");
      }

      var visitedparam = {
        leadid: this.leadid,
        propid: this.suggestchecked,
        execid: this.userid,
        visitupdate: 1,
        remarks: $('#propertyremarks').val(),
        stage: "USV",
        assignid: this.negoExecutiveId,
        feedbackid: this.feedbackId
      }

      this.filterLoader = true;
      var visiteddate = $('#USVvisiteddate').val();
      var visitedtime = $('#USVvisitedtime').val();
      var nextactiondate = $('#negonextactiondate').val();
      var nextactiontime = $('#negonextactiontime').val();
      var usvfinalremarks = "USV Done";

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
        nextdate: nextactiondate,
        nexttime: nextactiontime,
        suggestproperties: this.suggestchecked,
        execid: this.userid,
        assignid: this.negoExecutiveId,
        feedback: this.feedbackId
      }

      this.autoremarks = "Scheduled the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
      var leadnegofixparam = {
        leadid: this.leadid,
        closedate: nextdate,
        closetime: nexttime,
        leadstage: "Final Negotiation",
        stagestatus: '1',
        textarearemarks: textarearemarks,
        userid: this.userid,
        assignid: this.negoExecutiveId,
        autoremarks: this.autoremarks,
        property: this.suggestchecked,
        feedbackid: this.feedbackId
      }
      this._mandateService.addleadhistory(leadnegofixparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {

          this._mandateService.addpropertyvisitupdate(visitedparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this._mandateService.addnegoselected(param).subscribe((success) => {
                this.status = success.status;
                this._mandateService.negoselectproperties(this.leadid, this.userid, this.negoExecutiveId, this.feedbackId).subscribe(selectsuggested => {
                  this.selectedpropertylists = selectsuggested['selectednegolists'];
                  this.selectedlists = selectsuggested;
                  // Joining the object values as comma seperated when add the property for the history storing
                  this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
                  // Joining the object values as comma seperated when add the property for the history storing
                  this.autoremarks = " Changed the status to Final Negotiation after Successfully completed USV";
                  var leadusvdoneparam = {
                    leadid: this.leadid,
                    closedate: visiteddate,
                    closetime: visitedtime,
                    leadstage: "USV",
                    stagestatus: '3',
                    textarearemarks: usvfinalremarks,
                    userid: this.userid,
                    assignid: this.negoExecutiveId,
                    autoremarks: this.autoremarks,
                    property: this.suggestchecked,
                    weekplan: checkedDay,
                    feedbackid: this.feedbackId
                  }
                  this._mandateService.addleadhistory(leadusvdoneparam).subscribe((success) => {
                    this.status = success.status;
                    if (this.status == "True") {
                      this.autoremarks = "Scheduled the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
                      var leadnegofixparam = {
                        leadid: this.leadid,
                        closedate: nextdate,
                        closetime: nexttime,
                        leadstage: "Final Negotiation",
                        stagestatus: '1',
                        textarearemarks: textarearemarks,
                        userid: this.userid,
                        assignid: this.negoExecutiveId,
                        autoremarks: this.autoremarks,
                        property: this.suggestchecked,
                        feedbackid: this.feedbackId
                      }
                      this._mandateService.addleadhistory(leadnegofixparam).subscribe((success) => {
                        this.status = success.status;
                        if (this.status == "True") {
                          this.filterLoader = false;
                          swal({
                            title: 'Negotiation Fixed Successfully',
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
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
            title: `Final Negotiation already fixed by ${success.data[0].name}`,
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
      });
    }
    // USV DONE with NEGOTIATION Fixing

    // RSV DONE with NEGOTIATION Fixing
    else if ($('#sectionselector').val() == "RSV") {
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

      let visitremarks = $('#propertyremarks').val().trim();
      if (visitremarks == "") {
        $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      }
      else {
        $('#propertyremarks').removeAttr("style");
      }

      if ($('#negonextactiondate').val() == "") {
        $('#negonextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#negonextactiondate').removeAttr("style");
      }
      if ($('#negonextactiontime').val() == "") {
        $('#negonextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#negonextactiontime').removeAttr("style");
      }

      let negotextremarks = $('#negotextarearemarks').val().trim();
      if (negotextremarks == "") {
        $('#negotextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks for the final negotiation');
        return false;
      }
      else {
        $('#negotextarearemarks').removeAttr("style");
      }
      var visitedparam = {
        leadid: this.leadid,
        propid: this.suggestchecked,
        execid: this.userid,
        visitupdate: 1,
        remarks: $('#propertyremarks').val(),
        stage: "RSV",
        assignid: this.negoExecutiveId,
        feedbackid: this.feedbackId
      }
      this.filterLoader = true;
      var visiteddate = $('#RSVvisiteddate').val();
      var visitedtime = $('#RSVvisitedtime').val();
      var nextactiondate = $('#negonextactiondate').val();
      var nextactiontime = $('#negonextactiontime').val();
      var rsvfinalremarks = "RSV Finished";

      let date = new Date($('#RSVvisiteddate').val());
      let day = date.getDay();
      let isWeekend = (day === 6 || day === 0);
      var checkedDay;
      if (isWeekend) {
        checkedDay = 2;
      } else {
        checkedDay = 1;
      }

      var param1 = {
        leadid: this.leadid,
        nextdate: nextactiondate,
        nexttime: nextactiontime,
        suggestproperties: this.suggestchecked,
        execid: this.userid,
        assignid: this.negoExecutiveId,
        feedback: this.feedbackId
      }

      this.autoremarks = "Scheduled the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
      var leadnegofixparam = {
        leadid: this.leadid,
        closedate: nextdate,
        closetime: nexttime,
        leadstage: "Final Negotiation",
        stagestatus: '1',
        textarearemarks: textarearemarks,
        userid: this.userid,
        assignid: this.negoExecutiveId,
        autoremarks: this.autoremarks,
        property: this.suggestchecked,
        feedbackid: this.feedbackId
      }
      this._mandateService.addleadhistory(leadnegofixparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {

          this._mandateService.addpropertyvisitupdate(visitedparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this._mandateService.addnegoselected(param1).subscribe((success) => {
                this.status = success.status;
                this._mandateService.negoselectproperties(this.leadid, this.userid, this.negoExecutiveId, this.feedbackId).subscribe(selectsuggested => {
                  this.selectedpropertylists = selectsuggested['selectednegolists'];
                  this.selectedlists = selectsuggested;
                  // Joining the object values as comma seperated when add the property for the history storing
                  this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
                  // Joining the object values as comma seperated when add the property for the history storing
                  this.autoremarks = " Changed the status to Final Negotiation after Successfully completed RSV";
                  var leadrsvdoneparam = {
                    leadid: this.leadid,
                    closedate: visiteddate,
                    closetime: visitedtime,
                    leadstage: "RSV",
                    stagestatus: '3',
                    textarearemarks: rsvfinalremarks,
                    userid: this.userid,
                    assignid: this.negoExecutiveId,
                    autoremarks: this.autoremarks,
                    property: this.suggestchecked,
                    weekplan: checkedDay,
                    feedbackid: this.feedbackId
                  }
                  this._mandateService.addleadhistory(leadrsvdoneparam).subscribe((success) => {
                    this.status = success.status;
                    if (this.status == "True") {
                      this.autoremarks = "Scheduled the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
                      var leadnegofixparam = {
                        leadid: this.leadid,
                        closedate: nextdate,
                        closetime: nexttime,
                        leadstage: "Final Negotiation",
                        stagestatus: '1',
                        textarearemarks: textarearemarks,
                        userid: this.userid,
                        assignid: this.negoExecutiveId,
                        autoremarks: this.autoremarks,
                        property: this.suggestchecked,
                        feedbackid: this.feedbackId
                      }
                      this._mandateService.addleadhistory(leadnegofixparam).subscribe((success) => {
                        this.status = success.status;
                        if (this.status == "True") {
                          this.filterLoader = false;
                          swal({
                            title: 'Negotiation Fixed Successfully',
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
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
            title: `Final Negotiation already fixed by ${success.data[0].name}`,
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
      });
    }
    // RSV DONE with NEGOTIATION Fixing

    // DIRECT Negotiation Fixing
    else if ($('#sectionselector').val() == "Final Negotiation") {
      if ($('#negonextactiondate').val() == "") {
        $('#negonextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#negonextactiondate').removeAttr("style");
      }
      if ($('#negonextactiontime').val() == "") {
        $('#negonextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#negonextactiontime').removeAttr("style");
      }

      let negotextremarks = $('#negotextarearemarks').val().trim();
      if (negotextremarks == "") {
        $('#negotextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks for the final negotiation');
        return false;
      }
      else {
        $('#negotextarearemarks').removeAttr("style");
      }

      this.filterLoader = true;
      var nextdate = $('#negonextactiondate').val();
      var nexttime = $('#negonextactiontime').val();
      var textarearemarks = $('#negotextarearemarks').val();
      this.autoremarks = " Scheduled the Finalnegotiation";

      var param3 = {
        leadid: this.leadid,
        nextdate: nextdate,
        nexttime: nexttime,
        suggestproperties: this.suggestchecked,
        execid: this.userid,
        assignid: this.negoExecutiveId
      }
      this._mandateService.addnegoselected(param3).subscribe((success) => {
        this.status = success.status;
        this._mandateService.negoselectproperties(this.leadid, this.userid, this.negoExecutiveId, this.feedbackId).subscribe(selectsuggested => {
          this.selectedpropertylists = selectsuggested['selectednegolists'];
          this.selectedlists = selectsuggested;
          // Joining the object values as comma seperated when add the property for the history storing
          this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
          // Joining the object values as comma seperated when add the property for the history storing

          this.autoremarks = "Scheduled the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
          var leadnegofixparam = {
            leadid: this.leadid,
            closedate: nextdate,
            closetime: nexttime,
            leadstage: "Final Negotiation",
            stagestatus: '1',
            textarearemarks: textarearemarks,
            userid: this.userid,
            assignid: this.negoExecutiveId,
            autoremarks: this.autoremarks,
            property: this.suggestchecked,
            feedbackid: this.feedbackId
          }
          this._mandateService.addleadhistory(leadnegofixparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this.filterLoader = false;
              swal({
                title: 'Final Negotiation Fixed Successfully',
                type: "success",
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
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
                title: `Final Negotiation already fixed by ${success.data[0].name}`,
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

    }

    else {
      if ($('#negonextactiondate').val() == "") {
        $('#negonextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#negonextactiondate').removeAttr("style");
      }
      if ($('#negonextactiontime').val() == "") {
        $('#negonextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#negonextactiontime').removeAttr("style");
      }


      let negotextremarks = $('#negotextarearemarks').val().trim();
      if (negotextremarks == "") {
        $('#negotextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks for the final negotiation');
        return false;
      }
      else {
        $('#negotextarearemarks').removeAttr("style");
      }

      this.filterLoader = true;
      var nextdate = $('#negonextactiondate').val();
      var nexttime = $('#negonextactiontime').val();
      var textarearemarks = $('#negotextarearemarks').val();
      this.autoremarks = " Scheduled the Finalnegotiation";

      var param4 = {
        leadid: this.leadid,
        nextdate: nextdate,
        nexttime: nexttime,
        suggestproperties: this.suggestchecked,
        execid: this.userid,
        assignid: this.negoExecutiveId,
        feedback: this.feedbackId
      }
      this._mandateService.addnegoselected(param4).subscribe((success) => {
        this.status = success.status;
        this._mandateService.negoselectproperties(this.leadid, this.userid, this.negoExecutiveId, this.feedbackId).subscribe(selectsuggested => {
          this.selectedpropertylists = selectsuggested['selectednegolists'];
          this.selectedlists = selectsuggested;
          // Joining the object values as comma seperated when add the property for the history storing
          this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
          // Joining the object values as comma seperated when add the property for the history storing

          this.autoremarks = "Scheduled the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
          var leadnegofixparam = {
            leadid: this.leadid,
            closedate: nextdate,
            closetime: nexttime,
            leadstage: "Final Negotiation",
            stagestatus: '1',
            textarearemarks: textarearemarks,
            userid: this.userid,
            assignid: this.negoExecutiveId,
            autoremarks: this.autoremarks,
            property: this.suggestchecked,
            feedbackid: this.feedbackId
          }
          this._mandateService.addleadhistory(leadnegofixparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this.filterLoader = false;
              swal({
                title: 'Final Negotiation Fixed Successfully',
                type: "success",
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
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
                title: `Final Negotiation already fixed by ${success.data[0].name}`,
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
    }
    // DIRECT Negotiation Fixing
  }

  negorefixing() {
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
    let negorefixremarks = $('#refixtextarearemarks').val().trim();
    if (negorefixremarks == "") {
      $('#refixtextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks for the Final Negotiation');
      return false;
    }
    else {
      $('#refixtextarearemarks').removeAttr("style");
    }

    if (this.getselectedLeadExec.suggestedprop.length > 1) {
      this.suggestchecked = this.selectedSuggestedProp.propid;
    } else {
      this.suggestchecked = this.getselectedLeadExec.suggestedprop[0].propid;
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
      assignid: this.negoExecutiveId,
      feedback: this.feedbackId
    }
    this._mandateService.addnegoselectedrefix(param).subscribe((success) => {
      this.status = success.status;
      this._mandateService.negoselectproperties(this.leadid, this.userid, this.negoExecutiveId, this.feedbackId).subscribe(selectsuggested => {
        this.selectedpropertylists = selectsuggested['selectednegolists'];
        this.selectedlists = selectsuggested;
        // Joining the object values as comma seperated when add the property for the history storing
        this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
        // Joining the object values as comma seperated when add the property for the history storing
        this.autoremarks = " ReFixed the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
        var leadnegorefixparam = {
          leadid: this.leadid,
          closedate: nextdate,
          closetime: nexttime,
          leadstage: "Final Negotiation",
          stagestatus: '2',
          textarearemarks: textarearemarks,
          userid: this.userid,
          assignid: this.negoExecutiveId,
          autoremarks: this.autoremarks,
          property: this.suggestchecked,
          feedbackid: this.feedbackId
        }
        this._mandateService.addleadhistory(leadnegorefixparam).subscribe((success) => {
          this.status = success.status;
          if (this.status == "True") {
            this.filterLoader = false;
            swal({
              title: 'Refixed Final Negotiation Successfully',
              type: "success",
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
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
              title: `Final Negotiation already fixed by ${success.data[0].name}`,
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
  }

  negodonewithfixing() {
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
    let visitremarks = $('#propertyremarks').val().trim();
    if (visitremarks == "") {
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

    if ($('#subnegonextactiondate').val() == "") {
      $('#subnegonextactiondate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
      return false;
    }
    else {
      $('#subnegonextactiondate').removeAttr("style");
    }
    if ($('#subnegonextactiontime').val() == "") {
      $('#subnegonextactiontime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
      return false;
    }
    else {
      $('#subnegonextactiontime').removeAttr("style");
    }

    let subremarks = $('#subnegotextarearemarks').val().trim();
    if (subremarks == "") {
      $('#subnegotextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks for the final negotiation');
      return false;
    }
    else {
      $('#subnegotextarearemarks').removeAttr("style");
    }

    if (this.getselectedLeadExec.suggestedprop.length > 1) {
      this.suggestchecked = this.selectedSuggestedProp.propid;
    } else {
      this.suggestchecked = this.getselectedLeadExec.suggestedprop[0].propid;
    }

    var visitedparam = {
      leadid: this.leadid,
      propid: this.suggestchecked,
      execid: this.userid,
      visitupdate: 1,
      remarks: $('#propertyremarks').val(),
      stage: "Final Negotiation",
      assignid: this.negoExecutiveId,
      feedbackid: this.feedbackId
    }

    this.filterLoader = true;
    var nextactiondate = $('#subnegonextactiondate').val();
    var nextactiontime = $('#subnegonextactiontime').val();

    var param = {
      leadid: this.leadid,
      nextdate: nextactiondate,
      nexttime: nextactiontime,
      suggestproperties: this.suggestchecked,
      execid: this.userid,
      assignid: this.negoExecutiveId,
      feedback: this.feedbackId
    }

    this.autoremarks = "Scheduled the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + new Date($('#subnegonextactiondate').val()).toDateString() + " " + $('#subnegonextactiontime').val();
    var leadnegofixparam = {
      leadid: this.leadid,
      closedate: $('#subnegonextactiondate').val(),
      closetime: $('#subnegonextactiontime').val(),
      leadstage: "Final Negotiation",
      stagestatus: '1',
      textarearemarks: $('#subnegotextarearemarks').val(),
      userid: this.userid,
      assignid: this.negoExecutiveId,
      autoremarks: this.autoremarks,
      property: this.suggestchecked,
      feedbackid: this.feedbackId
    }
    this._mandateService.addleadhistory(leadnegofixparam).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {

        this._mandateService.addpropertyvisitupdate(visitedparam).subscribe((success) => {
          this.status = success.status;
          if (this.status == "True") {
            this._mandateService.addnegoselected(param).subscribe((success) => {
              this.status = success.status;
              this._mandateService.negoselectproperties(this.leadid, this.userid, this.negoExecutiveId, this.feedbackId).subscribe(selectsuggested => {
                this.selectedpropertylists = selectsuggested['selectednegolists'];
                this.selectedlists = selectsuggested;
                // Joining the object values as comma seperated when add the property for the history storing
                this.selectedproperty_commaseperated = this.selectedpropertylists.map((item) => { return item.name }).join(',');
                // Joining the object values as comma seperated when add the property for the history storing
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

                this.autoremarks = " Changed the status again to Final Negotiation after Successfully completed one negotiation Meeting";
                var leadnegodoneparam = {
                  leadid: this.leadid,
                  closedate: visiteddate,
                  closetime: visitedtime,
                  leadstage: "Final Negotiation",
                  stagestatus: '3',
                  textarearemarks: negofinalremarks,
                  userid: this.userid,
                  assignid: this.negoExecutiveId,
                  autoremarks: this.autoremarks,
                  property: this.suggestchecked,
                  weekplan: checkedDay,
                  feedbackid: this.feedbackId
                }
                this._mandateService.addleadhistory(leadnegodoneparam).subscribe((success) => {
                  this.status = success.status;
                  if (this.status == "True") {
                    var nextdate = $('#subnegonextactiondate').val();
                    var nexttime = $('#subnegonextactiontime').val();
                    var textarearemarks = $('#subnegotextarearemarks').val();
                    var dateformatchange = new Date(nextdate).toDateString();
                    this.autoremarks = "Again Scheduled the Final Negotiation for " + this.selectedproperty_commaseperated + " On " + dateformatchange + " " + nexttime;
                    var leadnegofixparam = {
                      leadid: this.leadid,
                      closedate: nextdate,
                      closetime: nexttime,
                      leadstage: "Final Negotiation",
                      stagestatus: '1',
                      textarearemarks: textarearemarks,
                      userid: this.userid,
                      assignid: this.negoExecutiveId,
                      autoremarks: this.autoremarks,
                      property: this.suggestchecked,
                      feedbackid: this.feedbackId
                    }
                    this._mandateService.addleadhistory(leadnegofixparam).subscribe((success) => {
                      this.status = success.status;
                      if (this.status == "True") {
                        this.filterLoader = false;
                        swal({
                          title: 'Negotiation Fixed Successfully',
                          type: "success",
                          timer: 2000,
                          showConfirmButton: false
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
          title: `Final Negotiation already fixed by ${success.data[0].name}`,
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

    var param5 = {
      leadid: this.leadid,
      nextdate: nextactiondate,
      nexttime: nextactiontime,
      suggestproperties: this.suggestchecked,
      execid: this.userid,
      assignid: this.negoExecutiveId,
      feedback: this.feedbackId
    }
    this._mandateService.addnegoselected(param5).subscribe((success) => {
      this.status = success.status;
    }, (err) => {
      console.log("Failed to Update");
    })
  }

  visitclick(i, propertyname) {
    $('#visitupdate').val("4");
    $('.nextactionmaindiv').removeAttr('style');
    $('.visitupdatebtn').attr("style", "display:none;");
  }

  cancelclick(i, propertyname) {
    $('#visitupdate').val("2");
    $('.visitupdatebtn').removeAttr('style');
    $('.nextactionmaindiv').attr("style", "display:none;");
    this.followdownform = false;
    this.rsvform = false;
    this.finalnegoform = false;
    this.leadclosedform = false;
  }

  updatepropertyvisit(propertyid, propertyname, i) {
    if ($('#visitupdate').val() == "1") {
      this.visitupdate = "Negotiation Done";
    } else {
      this.visitupdate = "Negotiation Cancelled";
    }
    this.propertyremarks = $('#propertyremarks' + i).val();

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

    let visitremarks = $('#propertyremarks').val().trim();
    if (visitremarks == "") {
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
      stage: "Final Negotiation",
      assignid: this.negoExecutiveId,
      feedbackid: this.feedbackId
    }
    this._mandateService.addpropertyvisitupdate(param).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {
        this.filterLoader = false;
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
          assignid: this.negoExecutiveId,
          autoremarks: this.autoremarks,
          property: propertyid,
          feedbackid: this.feedbackId
        }
        this._mandateService.addleadhistory(leadjunkparam).subscribe((success) => {
          this.status = success.status;
        }, (err) => {
          console.log("Failed to Update");
        });
        swal({
          title: 'Data Updated Successfully',
          type: "success",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          setTimeout(() => {
            this.dataUpdated.emit();
          }, 0)
          // this.loadimportantapi();
          // let currentUrl = this.router.url;
          // let pathWithoutQueryParams = currentUrl.split('?')[0];
          // let currentQueryparams = this.route.snapshot.queryParams;
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //   this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          // });
        });
      }
    }, (err) => {
      console.log("Failed to Update");
    })
  }
}