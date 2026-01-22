import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';
import { EchoService } from '../../../echo.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-on-call-followupform',
  templateUrl: './mandate-on-call-followupform.component.html',
  styleUrls: ['./mandate-on-call-followupform.component.css']
})
export class MandateOnCallFollowupformComponent implements OnInit {

  @Input() selectedExecId: any;
  @Input() selectedSuggestedProp: any;
  @Input() callStatus: any;
  @Input() callDirection: any;
  @Output() dataUpdated: EventEmitter<void> = new EventEmitter();
  @Input() calledLead: any;
  @Input() assignedRm: any;
  date = new Date();
  priorDate
  // new Date(new Date().setDate(this.date.getDate() + 7));
  priorDatebefore = new Date(new Date().setDate(this.date.getDate() - 30));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private _mandateService: mandateservice,
    private _echoService: EchoService
  ) { }
  followupsections: any;
  executeid: any;
  status: any;
  id: any;
  followsectiondata: any;
  followsectionname: any;
  currentstage: any;
  autoremarks: any;
  userid: any;
  filterLoader: boolean = true;
  stagestatus: any;
  stagestatusapi: any;
  selectedpropertylists: any;
  suggestchecked: any;
  leadid: any;
  followupExecutiveId: any;
  getselectedLeadExec: any;
  isFreshLead: boolean = false;
  currentdateforcompare = new Date();
  todaysdateforcompare: any;
  currenttime: any;
  roleid: any;
  feedbackId: any = 0;
  buildernamereg: any;
  mails: any;
  regitrationData: any;

  ngOnInit() {
    let currentUrl = this.router.url;
    let pathWithoutQueryParams1 = currentUrl.split('?')[0];
    if (pathWithoutQueryParams1 == '/mandate-feedback') {
      this.feedbackId = 1;
    } else {
      this.feedbackId = 0;
    }

    this.id = this.calledLead.LeadID;
    this.leadid = this.calledLead.LeadID;
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');
    var curmonth = this.currentdateforcompare.getMonth() + 1;
    var curmonthwithzero = curmonth.toString().padStart(2, "0");
    var curday = this.currentdateforcompare.getDate();
    var curdaywithzero = curday.toString().padStart(2, "0");
    this.todaysdateforcompare = this.currentdateforcompare.getFullYear() + "-" + curmonthwithzero + "-" + curdaywithzero;

    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    const timeString = (new Date()).toLocaleTimeString([], options);
    this.currenttime = timeString;

    if (this.userid == 1) {
      this.followupExecutiveId = this.selectedExecId;
    } else {
      this.followupExecutiveId = this.selectedExecId;
    }

    this._mandateService
      .getassignedrm(this.id, this.userid, this.selectedExecId, this.feedbackId)
      .subscribe(cust => {
        if (this.userid == 1) {
          this.followupExecutiveId = this.selectedExecId;
        } else {
          this.followupExecutiveId = this.selectedExecId;
        }
        let filteredInfo;
        filteredInfo = cust.RMname.filter((da) => da.executiveid == this.selectedExecId);
        this.getselectedLeadExec = filteredInfo[0];

        if (this.getselectedLeadExec.suggestedprop.length > 1) {
          this.suggestchecked = this.selectedSuggestedProp.propid;
          this.regitrationData = this.selectedSuggestedProp.registered;
        } else {
          this.suggestchecked = this.getselectedLeadExec.suggestedprop[0].propid;
          this.regitrationData = this.selectedSuggestedProp.registered;
        }

        if (this.regitrationData == undefined || this.regitrationData == null || this.regitrationData == '') {
          this.fetchmails();
        }
        this.loadimportantapi();
        this.scriptfunctions();
      })

    this.followsectiondata = "";
    this._mandateService
      .getactiveleadsstatus(this.id, this.userid, this.followupExecutiveId, this.selectedSuggestedProp.propid, this.feedbackId).subscribe(stagestatus => {
        this.filterLoader = false;
        if (stagestatus.status == "True") {
          this.currentstage = stagestatus['activeleadsstatus'][0].stage;
          this.stagestatusapi = stagestatus['activeleadsstatus'][0].stagestatus;
          if (this.currentstage == null) {
            this.currentstage = "Fresh";
            this.stagestatus = '0';
          }
          if (stagestatus['activeleadsstatus'][0].stage == 'Fresh') {
            this.isFreshLead = false;
          } else {
            this.isFreshLead = true;
          }
        } else {
          this.currentstage = "Fresh";
          this.stagestatus = '0';
        }

        this._mandateService
          .getfollowupsections()
          .subscribe(followupsection => {
            this.followupsections = followupsection;
            setTimeout(() => {
              if (this.currentstage != 'Fresh') {
                this.followupsections = followupsection.filter((foll) => {
                  return foll.followup_categories == 'Callback';
                })

                this.followupactionclick(0, 1, 'Callback',)
              } else {
                this.followupsections = followupsection.filter((foll) => {
                  return foll.followup_categories == 'Callback' || foll.followup_categories == 'NC';
                })
              }
            }, 0)
          });
      });

    // this._mandateService.getfollowupsections().subscribe(followupsection => {
    //   this.followupsections = followupsection;
    //   // if (this.callStatus == 'Answered' || this.callStatus == 'Call Disconnected' || this.callStatus == undefined) {
    //     this.followupsections = followupsection.filter((foll) => {
    //       return foll.followup_categories == 'Callback' || foll.followup_categories == 'NC';
    //     })
    //   // } else {
    //   //   setTimeout(() => {
    //   //     if (this.currentstage == 'Fresh') {
    //   //       this.followupsections = this.followupsections
    //   //       console.log(this.followupsections)
    //   //     } else {
    //   //       this.followupsections = this.followupsections.filter((data) => {
    //   //         return !(data.followup_categories == "NC")
    //   //       });
    //   //     }
    //   //   }, 500)
    //   // }
    // });
    // this.scriptfunctions();
  }

  loadimportantapi() {
    this._mandateService
      .getmandateselectedsuggestproperties(this.leadid, this.userid, this.followupExecutiveId, this.feedbackId)
      .subscribe(selectsuggested => {
        this.selectedpropertylists = selectsuggested['selectedlists'];
      });
  }

  followupactionclick(i, id, name) {
    if ((id == 1 && name == 'Callback') || (id == 8 && name == 'NC') && this.currentstage == "Fresh") {
      this.isFreshLead = true;
      $('#folloupdate').val('');
      $('#followuptime').val('')
      $('#followuptextarearemarks').val('');
    } else if (this.currentstage == "Fresh") {
      this.isFreshLead = false;
      $('#folloupdate').val(this.todaysdateforcompare);
      $('#followuptime').val(this.currenttime)
      $('#followuptextarearemarks').val(name);
    }

    $(".actions").addClass("actionbtns");
    $(".selectMark").addClass("iconmark");
    $(".actionbtns").removeClass("actions");
    $(".iconmark").removeClass("selectMark");

    $(".actions" + i).removeClass("actionbtns");
    $(".actions" + i).addClass("actions");
    $(".selectMark" + i).removeClass("iconmark");
    $(".selectMark" + i).addClass("selectMark");

    this.followsectiondata = id;
    this.followsectionname = name;
    this.scriptfunctions();

  }

  selectsuggestedprop(event: Event, i, id, propname) {
    if ($('#checkbox' + i).is(':checked')) {
      var checkid = $("input[name='programmings']:checked").map(function () {
        return this.value;
      }).get().join(',');
      this.suggestchecked = checkid;
    } else {

    }
  }

  addfollowupdata() {
    var followdate = $('#folloupdate').val();
    var followtime = $('#followuptime').val();
    var leadstage = $('#sectionselector').val();
    var followuptextarearemarks = $('#followuptextarearemarks').val();
    if (followuptextarearemarks == '' || followuptextarearemarks == undefined || followuptextarearemarks == null) {
      followuptextarearemarks = this.followsectionname;
    } else {
      followuptextarearemarks = $('#followuptextarearemarks').val();
    }
    var leadid = this.id;
    var userid = localStorage.getItem('UserId');
    var username = localStorage.getItem('Name');
    if (this.currentstage !== 'Fresh') {
      if (this.stagestatusapi == '1') {
        this.stagestatus = "1";
      } else if (this.stagestatusapi == '2') {
        this.stagestatus = "2";
      } else if (this.stagestatusapi == '3') {
        this.stagestatus = "3";
      }
    } else {
      if (this.stagestatusapi == null) {
        this.stagestatus = '0';
      } else {
        this.stagestatus = this.stagestatusapi;
      }
    }
    var dateformatchange = new Date(followdate).toDateString();

    var followupscommon = {
      leadid: leadid,
      actiondate: followdate,
      actiontime: followtime,
      leadstatus: leadstage,
      stagestatus: '3',
      followupsection: this.followsectiondata,
      followupremarks: followuptextarearemarks,
      userid: userid,
      assignid: this.followupExecutiveId,
      property: this.suggestchecked,
      autoremarks: " Set the next followup on - " + dateformatchange + " " + followtime,
      feedbackid: this.feedbackId
    }
    // USV DONE with Followup Fixing
    if ($('#sectionselector').val() == "USV") {

      // if ($('#propertyremarks').val().trim() == "") {
      //   $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
      //   return false;
      // }
      // else {
      //   $('#propertyremarks').removeAttr("style");
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

      if (this.followsectiondata == "") {
        swal({
          title: 'Please Select any Followup Actions',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      }
      else {
        $('#followupsection').removeAttr("style");
      }

      if ($('#folloupdate').val() == "") {
        $('#folloupdate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#folloupdate').removeAttr("style");
      }
      if ($('#followuptime').val() == "") {
        $('#followuptime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#followuptime').removeAttr("style");
      }

      // let followupRemarks = $('#followuptextarearemarks').val().trim();
      // if (followupRemarks == "") {
      //   $('#followuptextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks');
      //   return false;
      // }
      // else {
      //   $('#followuptextarearemarks').removeAttr("style");
      // }



      if (this.followsectionname == "Callback") {
        this.autoremarks = " set the status as Followup after the USV, because client need a callback.";
      } else if (this.followsectionname == "RNR") {
        this.autoremarks = " tried to contact the client after the USV but, client didnt pick the call. So its set as Followup.";
      } else if (this.followsectionname == "Switch Off") {
        this.autoremarks = " tried to contact the client after the USV but, number is swtiched off. So its set as Followup.";
      } else if (this.followsectionname == "Not Connected") {
        this.autoremarks = " tried to contact the client after the USV but, number is not connecting. So its set as Followup.";
      } else if (this.followsectionname == "Number Busy") {
        this.autoremarks = " tried to contact the client after the USV but, number is busy. So its set as Followup.";
      } else if (this.followsectionname == "Not Answered") {
        this.autoremarks = " tried to contact the client after the USV but, client is not answering the call. So its set as Followup.";
      } else if (this.followsectionname == "Not Reachable") {
        this.autoremarks = " tried to contact the client after the USV but, number is in out of coverage area. So its set as Followup.";
      } else if (this.followsectionname == "NC") {
        this.autoremarks = " set the status as NC for fixing the next sitevisit.";
      } else {
        this.autoremarks = " Changed the status to Followup after the USV - " + this.followsectionname;
      }

      // parameters & API Submissions for the property sitevisit update
      var visitparam = {
        leadid: this.id,
        propid: this.suggestchecked,
        execid: this.userid,
        visitupdate: 1,
        remarks: 'Interested',
        stage: "USV",
        assignid: this.followupExecutiveId,
        feedbackid: this.feedbackId
      }
      // parameters & API Submissions for the property sitevisit update
      var visiteddate = $('#USVvisiteddate').val();
      var visitedtime = $('#USVvisitedtime').val();
      var usvfinalremarks = "USV Done";

      var leadusvdoneparam = {
        leadid: this.id,
        closedate: visiteddate,
        closetime: visitedtime,
        leadstage: "USV",
        stagestatus: '3',
        textarearemarks: usvfinalremarks,
        userid: userid,
        assignid: this.followupExecutiveId,
        autoremarks: this.autoremarks,
        property: this.suggestchecked,
        feedbackid: this.feedbackId
      }
      this.filterLoader = true;
      this._mandateService.addpropertyvisitupdate(visitparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          $('#visitupdate').val("4");
          this._mandateService.addleadhistory(leadusvdoneparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this._mandateService.addfollowuphistory(followupscommon).subscribe((success) => {
                this.status = success.status;
                if (this.status == "True") {
                  this.filterLoader = false;
                  swal({
                    title: 'Followup Fixed Successfully',
                    text: "Please check your followup bucket for the Lead reminders",
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                  }).then(() => {
                    setTimeout(() => {
                      this.dataUpdated.emit();
                    }, 0)
                  });
                }
              }, (err) => {
                console.log("Failed to Update");
              })
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
    // USV DONE with Followup Fixing

    // RSV DONE with Followup Fixing
    else if ($('#sectionselector').val() == "RSV") {

      // if ($('#propertyremarks').val().trim() == "") {
      //   $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
      //   return false;
      // }
      // else {
      //   $('#propertyremarks').removeAttr("style");
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

      if (this.followsectiondata == "") {
        swal({
          title: 'Please Select any Followup Actions',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      }
      else {
        $('#followupsection').removeAttr("style");
      }
      if ($('#folloupdate').val() == "") {
        $('#folloupdate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#folloupdate').removeAttr("style");
      }
      if ($('#followuptime').val() == "") {
        $('#followuptime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#followuptime').removeAttr("style");
      }
      // let followupRemarks = $('#followuptextarearemarks').val().trim();
      // if (followupRemarks == "") {
      //   $('#followuptextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks');
      //   return false;
      // }
      // else {
      //   $('#followuptextarearemarks').removeAttr("style");
      // }

      if (this.followsectionname == "Callback") {
        this.autoremarks = " set the status as Followup after the RSV, because client need a callback.";
      } else if (this.followsectionname == "RNR") {
        this.autoremarks = " tried to contact the client after the RSV but, client didnt pick the call. So its set as Followup.";
      } else if (this.followsectionname == "Switch Off") {
        this.autoremarks = " tried to contact the client after the RSV but, number is swtiched off. So its set as Followup.";
      } else if (this.followsectionname == "Not Connected") {
        this.autoremarks = " tried to contact the client after the RSV but, number is not connecting. So its set as Followup.";
      } else if (this.followsectionname == "Number Busy") {
        this.autoremarks = " tried to contact the client after the RSV but, number is busy. So its set as Followup.";
      } else if (this.followsectionname == "Not Answered") {
        this.autoremarks = " tried to contact the client after the RSV but, client is not answering the call. So its set as Followup.";
      } else if (this.followsectionname == "Not Reachable") {
        this.autoremarks = " tried to contact the client after the RSV but, number is in out of coverage area. So its set as Followup.";
      } else if (this.followsectionname == "NC") {
        this.autoremarks = " set the status as NC for fixing the next sitevisit.";
      } else {
        this.autoremarks = " Changed the status to Followup after the RSV - " + this.followsectionname;
      }
      // parameters & API Submissions for the property sitevisit update
      var visitedparam = {
        leadid: this.leadid,
        propid: this.suggestchecked,
        execid: this.userid,
        visitupdate: 1,
        remarks: 'Interested',
        stage: "RSV",
        assignid: this.followupExecutiveId,
        feedbackid: this.feedbackId
      }
      // parameters & API Submissions for the property sitevisit update

      var visiteddate = $('#RSVvisiteddate').val();
      var visitedtime = $('#RSVvisitedtime').val();
      // var rsvfinalremarks = $('#rsvfinalremarks').val();
      var rsvfinalremarks = "RSV Done";

      var leadrsvdoneparam = {
        leadid: this.id,
        closedate: visiteddate,
        closetime: visitedtime,
        leadstage: "RSV",
        stagestatus: '3',
        textarearemarks: rsvfinalremarks,
        userid: userid,
        assignid: this.followupExecutiveId,
        autoremarks: this.autoremarks,
        property: this.suggestchecked,
        feedbackid: this.feedbackId
      }
      this.filterLoader = true;
      this._mandateService.addpropertyvisitupdate(visitedparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this._mandateService.addleadhistory(leadrsvdoneparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this._mandateService.addfollowuphistory(followupscommon).subscribe((success) => {
                this.status = success.status;
                if (this.status == "True") {
                  this.filterLoader = false;
                  swal({
                    title: 'Followup Updated Successfully',
                    text: "Please check your followup bucket for the Lead reminders",
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
              })
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
    // RSV DONE with Followup Fixing

    // NEGOTIATION DONE with Followup Fixing
    else if ($('#sectionselector').val() == "Final Negotiation") {
      // if ($('#visitupdate').val() == "") {
      //   swal({
      //     title: 'Action Not Took',
      //     text: 'Please Confirm Property Revisited or Not',
      //     type: 'error',
      //     timer: 2000,
      //     showConfirmButton: false
      //   })
      //   return false;
      // }
      // else { }

      // if ($('#propertyremarks').val().trim() == "") {
      //   $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
      //   return false;
      // }
      // else {
      //   $('#propertyremarks').removeAttr("style");
      // }

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

      if (this.followsectiondata == "") {
        swal({
          title: 'Please Select any Followup Actions',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      }
      else {
        $('#followupsection').removeAttr("style");
      }

      if ($('#folloupdate').val() == "") {
        $('#folloupdate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#folloupdate').removeAttr("style");
      }
      if ($('#followuptime').val() == "") {
        $('#followuptime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#followuptime').removeAttr("style");
      }
      // let followupRemarks = $('#followuptextarearemarks').val().trim();
      // if (followupRemarks == "") {
      //   $('#followuptextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks');
      //   return false;
      // }
      // else {
      //   $('#followuptextarearemarks').removeAttr("style");
      // }

      if (this.followsectionname == "Callback") {
        this.autoremarks = " set the status as Followup after the Finalnegotiation, because client need a callback.";
      } else if (this.followsectionname == "RNR") {
        this.autoremarks = " tried to contact the client after the Finalnegotiation but, client didnt pick the call. So its set as Followup.";
      } else if (this.followsectionname == "Switch Off") {
        this.autoremarks = " tried to contact the client after the Finalnegotiation but, number is swtiched off. So its set as Followup.";
      } else if (this.followsectionname == "Not Connected") {
        this.autoremarks = " tried to contact the client after the Finalnegotiation but, number is not connecting. So its set as Followup.";
      } else if (this.followsectionname == "Number Busy") {
        this.autoremarks = " tried to contact the client after the Finalnegotiation but, number is busy. So its set as Followup.";
      } else if (this.followsectionname == "Not Answered") {
        this.autoremarks = " tried to contact the client after the Finalnegotiation but, client is not answering the call. So its set as Followup.";
      } else if (this.followsectionname == "Not Reachable") {
        this.autoremarks = " tried to contact the client after the Finalnegotiation but, number is in out of coverage area. So its set as Followup.";
      } else if (this.followsectionname == "NC") {
        this.autoremarks = " set the status as NC for fixing the next sitevisit.";
      } else {
        this.autoremarks = " Changed the status to Followup after the Finalnegotiation - " + this.followsectionname;
      }

      var negovisitparam = {
        leadid: this.leadid,
        propid: this.suggestchecked,
        execid: this.userid,
        visitupdate: 1,
        remarks: 'Interested',
        stage: "Final Negotiation",
        assignid: this.followupExecutiveId,
        feedbackid: this.feedbackId
      }

      var visiteddate = $('#negovisiteddate').val();
      var visitedtime = $('#negovisitedtime').val();
      var negofinalremarks = "Final Negotiation Finished";

      var leadnegodoneparam = {
        leadid: this.id,
        closedate: visiteddate,
        closetime: visitedtime,
        leadstage: "Final Negotiation",
        stagestatus: '3',
        textarearemarks: negofinalremarks,
        userid: userid,
        assignid: this.followupExecutiveId,
        autoremarks: this.autoremarks,
        property: this.suggestchecked,
        feedbackid: this.feedbackId
      }

      this.filterLoader = true;
      this._mandateService.addpropertyvisitupdate(negovisitparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this._mandateService.addleadhistory(leadnegodoneparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              this._mandateService.addfollowuphistory(followupscommon).subscribe((success) => {
                this.status = success.status;
                if (this.status == "True") {
                  this.filterLoader = false;
                  swal({
                    title: 'Followup Updated Successfully',
                    text: "Please check your followup bucket for the Lead reminders",
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
              })
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
    // NEGOTIATION DONE with Followup Fixing

    // Direct Followup Fixing
    else {
      if (this.followsectiondata == "") {
        swal({
          title: 'Please Select any Followup Actions',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      }
      else {
        $('#followupsection').removeAttr("style");
      }
      if ($('#folloupdate').val() == "") {
        $('#folloupdate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#folloupdate').removeAttr("style");
      }
      if ($('#followuptime').val() == "") {
        $('#followuptime').focus().css("border-color", "red").attr('placeholder', 'Please Select The Time');
        return false;
      }
      else {
        $('#followuptime').removeAttr("style");
      }
      // let followupRemarks = $('#followuptextarearemarks').val().trim();
      // if (followupRemarks == "") {
      //   $('#followuptextarearemarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks');
      //   return false;
      // } else {
      //   $('#followuptextarearemarks').removeAttr("style");
      // }
      var followleadstage = this.currentstage;
      if (this.followsectionname == "Callback") {
        this.autoremarks = " Changed the status to Followup, because client need a callback.";
      } else if (this.followsectionname == "RNR") {
        this.autoremarks = " tried to contact the client but, client didnt pick the call. So Changed the status to Followup.";
      } else if (this.followsectionname == "Switch Off") {
        this.autoremarks = " tried to contact the client but, number is swtiched off. So Changed the status to Followup.";
      } else if (this.followsectionname == "Not Connected") {
        this.autoremarks = " tried to contact the client but, number is not connecting. So Changed the status to Followup.";
      } else if (this.followsectionname == "Number Busy") {
        this.autoremarks = " tried to contact the client but, number is busy. So Changed the status to Followup.";
      } else if (this.followsectionname == "Not Answered") {
        this.autoremarks = " tried to contact the client but, client is not answering the call. So Changed the status to Followup.";
      } else if (this.followsectionname == "Not Reachable") {
        this.autoremarks = " tried to contact the client but, number is in out of coverage area. So Changed the status to Followup.";
      } else if (this.followsectionname == "NC") {
        this.autoremarks = " Changed the status to NC, Need to callback the client for fixing the sitevisit.";
      } else {
        this.autoremarks = " Changed the status to Followup - " + this.followsectionname;
      }
      var followups = {
        leadid: leadid,
        actiondate: followdate,
        actiontime: followtime,
        leadstatus: this.currentstage,
        stagestatus: this.stagestatus,
        followupsection: this.followsectiondata,
        followupremarks: followuptextarearemarks,
        userid: userid,
        assignid: this.followupExecutiveId,
        autoremarks: this.autoremarks,
        property: this.suggestchecked,
        feedbackid: this.feedbackId
      }
      this.filterLoader = true;
      this._mandateService.addfollowuphistory(followups).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this.filterLoader = false;
          swal({
            title: 'Followup Updated Successfully',
            text: "Please check your followup bucket for the Lead reminders",
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {

            if (this.followsectiondata == 8 && ((this.regitrationData == null || this.regitrationData == undefined || this.regitrationData == ''))) {
              let registrationremarks = 'Registration Successfully Done';
              this.filterLoader = true;
              var param = {
                leadid: this.id,
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
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
    // Direct Followup Fixing
  };

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


  scriptfunctions() {
    $('.ui.dropdown').dropdown();
    if (this.getselectedLeadExec && this.getselectedLeadExec.leadstage == 'Fresh') {
      $('.calendardate').calendar({
        type: 'date',
        minDate: this.date,
        maxDate: this.followsectionname == 'Callback'?new Date(new Date().setDate(this.date.getDate() + 1)):new Date(new Date().setDate(this.date.getDate() + 3)) ,
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
    } else {
      $('.calendardate').calendar({
        type: 'date',
        minDate: this.date,
        // maxDate: this.priorDate,
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
    }
    );
  }
}
