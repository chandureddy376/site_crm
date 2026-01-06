import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';
import { sharedservice } from '../../../shared.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-closedform',
  templateUrl: './mandate-closedform.component.html',
  styleUrls: ['./mandate-closedform.component.css']
})
export class MandateClosedformComponent implements OnInit {

  @Input() selectedExecId: any;
  @Input() selectedSuggestedProp: any;
  date = new Date();
  priorDate = new Date(new Date().setDate(this.date.getDate() + 30));
  priorDatebefore = new Date(new Date().setDate(this.date.getDate() - 30));
  leadid = this.route.snapshot.params['id'];
  visitedpropertylists: any;
  suggestchecked: any;
  executeid: any;
  status: any;
  adminview: boolean;
  execview: boolean;
  selectedItem = 0;
  setActive: (buttonName: any) => void;
  isActive: (buttonName: any) => boolean;
  uploads: string[] = [];
  closurefiles: any[] = [];
  userid: any;
  autoremarks: any;
  filterLoader: boolean = true;
  closedExecutiveId: any;
  getselectedLeadExec: any;
  showleadClose: boolean = false;
  selectedLeadProperty: any;
  roleid: any;
  feedbackId: any;
  towerList: any;
  floorList: any;
  unitList: any;
  selectedUnits: any;
  selectedUnitsDimension: any;
  selectedUnitsDimensionCommaSeperated: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private _mandateService: mandateservice,
    private _sharedService: sharedservice,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.feedbackId = params['feedback'].split('?')[0];
    });
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');
    this.scriptfunctions();

    if (this.userid == 1) {
      this.closedExecutiveId = this.selectedExecId;
    } else {
      this.closedExecutiveId = this.selectedExecId;
    }

    this._mandateService
      .getassignedrm(this.leadid, this.userid, this.selectedExecId, this.feedbackId)
      .subscribe(cust => {
        let filteredInfo;
        filteredInfo = cust.RMname.filter((da) => da.executiveid == this.selectedExecId);
        this.getselectedLeadExec = filteredInfo[0];
        if (this.userid == 1) {
          this.closedExecutiveId = this.selectedExecId;
        } else {
          this.closedExecutiveId = this.selectedExecId;
        }
        this.loadimportantapi();
      })

    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }
    else if (localStorage.getItem('Role') == '1') {
      this.adminview = true;
      this.execview = false;
    } else {
      this.adminview = false;
      this.execview = true;
    }

    //  this.getAllUnitList('');
  }

  scriptfunctions() {
    $('.ui.dropdown').dropdown();
    $('.calendardate').calendar({
      type: 'date',
      // minDate: this.date,
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

    this.setActive = function (buttonName) {
      this.activeButton = buttonName;
    }
    this.isActive = function (buttonName) {
      return this.activeButton === buttonName;
    }

  }

  imageuploads(i, event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      let allFilesValid = true;

      // First, validate all files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('jpg') || file.name.endsWith('jpeg') || file.name.endsWith('png') || file.name.endsWith('pdf')) {
          if (file.size > 1110000) {
            allFilesValid = false;
            swal({
              title: 'File Size Exceeded',
              text: 'File Size limit is 1MB',
              type: "error",
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              input.value = '';
              this.closurefiles = [];
            });
            break;
          }
        } else {
          allFilesValid = false;
          swal({
            title: 'Invalid File Format',
            text: 'The file format is not acceptable. Please upload a file in: JPG, JPEG, PNG, or PDF formats.',
            type: "error",
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            this.closurefiles = [];
          });
        }
      }

      // If all files are valid, process them
      if (allFilesValid) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = file.name;
          $('#customFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

          // Push the file to closurefiles and read the file
          this.closurefiles.push(file);
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.uploads.push(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }


    // var fileInput = $('#customFile' + i);
    // var maxSize = fileInput.data('max-size');
    // var fileSize = fileInput.get(i).files[i].size;
    // if (fileSize > maxSize) {
    //   swal({
    //     title: 'File Size Exceeded',
    //     text: 'File Size limit is 1MB',
    //     type: "error",
    //     timer: 2000,
    //     showConfirmButton: false
    //   }).then(() => {
    //   });
    //   return false;
    // } else {
    //   var fileName = $('#customFile' + i).val().split("\\").pop();
    //   $('#customFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);
    //   for (let j = 0; j < event.target.files.length; j++) {
    //     console.log(event.target.files[j])
    //     this.closurefiles.push(event.target.files[j]);
    //     var reader = new FileReader();
    //     reader.onload = (event: any) => {
    //       this.uploads.push(event.target.result);
    //     };
    //     reader.readAsDataURL(event.target.files[j]);
    //   }
    // }
  }

  removeImage(i) {
    this.uploads.splice(i, 1);
    this.closurefiles.splice(i, 1);
    if (this.uploads.length == 0) {
      $("#customFile" + i).val('');
      $('.file-label-' + i).html('Choose file ');
    } else {

    }
    // alert(this.uploads.length);
  }

  tabclick(i, prop) {
    //to make the varibale empty string

    if (prop != '' || prop != undefined) {
      $('.closerequestform').css('height', '')
    }

    $(".actions").addClass("actionbtns");
    $(".selectMark").addClass("iconmark");
    $(".actionbtns").removeClass("actions");
    $(".iconmark").removeClass("selectMark");

    $(".actions" + i).removeClass("actionbtns");
    $(".actions" + i).addClass("actions");
    $(".selectMark" + i).removeClass("iconmark");
    $(".selectMark" + i).addClass("selectMark");

    this.showleadClose = true;
    this.suggestchecked = prop.propid;
    $('.classremover').removeClass('active');
    $('.radiocheck').prop('checked', false);
  }

  loadimportantapi() {
    this.filterLoader = false;
    var param = {
      leadid: this.leadid,
      execid: this.userid,
      stage: $('#customer_phase4').val(),
      assignid: this.closedExecutiveId,
      feedbackid: this.feedbackId,
      propid: this.selectedSuggestedProp.propid
    }

    this._mandateService
      .getvisitedsuggestproperties(param)
      .subscribe(visitsuggested => {
        this.visitedpropertylists = visitsuggested['visitedlists'];
        this.visitedpropertylists = this.visitedpropertylists.filter((da) => da.propid == this.selectedSuggestedProp.propid);
        this.suggestchecked = this.visitedpropertylists.map((item) => { return item.propid }).join(',');
      });
  }

  selectsuggested(id) {
    var checkid = $("input[name='programming']:checked").map(function () {
      return this.value;
    }).get().join(',');
    this.suggestchecked = checkid;
  }

  unitselection(i) {
    var checkid = $("input[name='select1-" + i + "']:checked").map(function () {
      return this.value;
    }).get().join(',');
    // this.selectedunits = checkid;
    const a = document.getElementById("selectedunits-" + i) as HTMLInputElement;
    a.value = checkid;

    // console.log(a.value);
    // const number = a.value.replace(/\D/g, '');
    // let numArry = number.split('');
    // let bhkNum = numArry.join(',');
    // this.getAllUnitList(bhkNum)

  }

  closingrequest(i, propid, propname) {
    // USV DONE with Lead Closing

    let closeLeadStage: any;
    if (this.userid == 1) {
      closeLeadStage = "Admin Lead Closed";
    } else {
      closeLeadStage = "Deal Closing Request";
    }

    if ($('#sectionselector').val() == "USV") {
      // alert("USV Detected");

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

      if ($('#USVvisiteddate').val() == "") {
        $('#USVvisiteddate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#USVvisiteddate').removeAttr("style");
      }

      if ($('#USVvisitedtime').val() == "") {
        $('#USVvisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#USVvisitedtime').removeAttr("style");
      }
      if ($('#closeddate').val() == "") {
        $('#closeddate').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Date');
        return false;
      }
      else {
        $('#closeddate').removeAttr("style");
      }
      if ($('#closedtime').val() == "") {
        $('#closedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Time');
        return false;
      }
      else {
        $('#closedtime').removeAttr("style");
      }
      if ($("#selectedunits-" + i).val() == "") {
        swal({
          title: 'Units Not Selected',
          text: 'Select any Unit for ' + propname,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      } else if ($("#unitnum-" + i).val().trim() == "") {
        $("#unitnum-" + i).val('')
        $("#unitnum-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Number');
        return false;
      } else if ($("#dimension-" + i).val().trim() == "" || !/^[0-9,]+$/.test($("#dimension-" + i).val())) {
        $("#dimension-" + i).val('');
        $("#dimension-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');
        return false;
      } else if ($("#ratepersquarfeet-" + i).val().trim() == "" || !/^[0-9,]+$/.test($("#ratepersquarfeet-" + i).val())) {
        $("#ratepersquarfeet-" + i).val('');
        $("#ratepersquarfeet-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
        return false;
      } else if ($("#remarks-" + i).val().trim() == "") {
        $("#remarks-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type some comments/remarks');
        return false;
      } else if ($("#customFile" + i).val() == "") {
        swal({
          title: 'No Files Uploaded',
          text: 'Upload atleast one file for ' + propname,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      } else {
        $("#unitnum-" + i).removeAttr("style");
        $("#dimension-" + i).removeAttr("style");
        $("#ratepersquarfeet-" + i).removeAttr("style");
        $("#remarks-" + i).removeAttr("style");
        this.filterLoader = true;
        var unitsselected = $("#selectedunits-" + i).val();
        var lastunit = unitsselected.replace(/,\s*$/, "");
        var totalunitscount = lastunit.split(",").length;
        // alert(totalunitscount);
        var unitnumbers = $("#unitnum-" + i).val();
        var lastuninumber = unitnumbers.replace(/,\s*$/, "");
        var totalunitnumbers = lastuninumber.split(",").length;
        // alert(lastuninumber);
        var dimensions = $("#dimension-" + i).val();
        var lastdimension = dimensions.replace(/,\s*$/, "");
        var totaldimensions = lastdimension.split(",").length;
        // alert(totaldimensions);
        var rpsft = $("#ratepersquarfeet-" + i).val();
        var lastsqft = rpsft.replace(/,\s*$/, "");
        var totalrpsft = lastsqft.split(",").length;
        // alert(totalrpsft);

        // Condition of selected only one unit or less than one & enetered more unit numbers
        if (totalunitscount <= 1 && totalunitnumbers > 1) {
          if (totalunitnumbers != totaldimensions) {
            if (totaldimensions == 1) {
              swal({
                title: totalunitnumbers + ' Unit Numbers & ' + totaldimensions + ' Dimension Detected',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            } else {
              swal({
                title: totalunitnumbers + ' Unit Numbers & ' + totaldimensions + ' Dimensions Detected',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            }
          } else if (totaldimensions != totalrpsft) {

            if (totalrpsft == 1) {
              swal({
                title: totaldimensions + ' Dimensions & ' + totalrpsft + ' Price Found',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            } else {
              swal({
                title: totaldimensions + ' Dimensions & ' + totalrpsft + ' Prices Found',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            }
          } else {
            // parameters & API Submissions for the property sitevisit update
            var visitparam = {
              leadid: this.leadid,
              propid: this.suggestchecked,
              execid: this.userid,
              visitupdate: 1,
              remarks: $('#propertyremarks').val(),
              stage: "USV",
              assignid: this.closedExecutiveId,
              feedbackid: this.feedbackId
            }
            // parameters & API Submissions for the property sitevisit update

            this._mandateService.addpropertyvisitupdate(visitparam).subscribe((success) => {
              this.status = success.status;
              if (this.status == "True") {

                // alert("Total Units and Unit numbers matched");
                const formData = new FormData();
                formData.append('PropID', propid);
                formData.append('LeadID', this.leadid);
                formData.append('ExecID', this.userid);
                formData.append('assignID', this.closedExecutiveId)
                for (var k = 0; k < this.closurefiles.length; k++) {
                  formData.append('file[]', this.closurefiles[k]);
                }
                this._mandateService.uploadFile(formData).subscribe((res) => {
                  if (res['status'] === 'True') {
                    var visiteddate = $('#USVvisiteddate').val();
                    var visitedtime = $('#USVvisitedtime').val();
                    // var usvfinalremarks = $('#usvfinalremarks').val();
                    var usvfinalremarks = "USV Done";
                    this.autoremarks = " Changed the status to Deal Closing Request after Successfully completed the USV";
                    var leadusvparam = {
                      leadid: this.leadid,
                      closedate: visiteddate,
                      closetime: visitedtime,
                      leadstage: "USV",
                      stagestatus: '3',
                      textarearemarks: usvfinalremarks,
                      userid: this.userid,
                      assignid: this.closedExecutiveId,
                      autoremarks: this.autoremarks,
                      property: propid,
                      feedbackid: this.feedbackId
                    }

                    this._mandateService.addleadhistory(leadusvparam).subscribe((success) => {
                      this.status = success.status;
                      if (this.status == "True") {
                        var closedate = $('#closeddate').val();
                        var closetime = $('#closedtime').val();
                        var textarearemarks = $("#remarks-" + i).val();
                        var dateformatchange = new Date(closedate).toDateString();

                        this.autoremarks = " Send the Deal Closing Request for " + propname + " On " + dateformatchange + " " + closetime;
                        var leadhistparam = {
                          leadid: this.leadid,
                          closedate: closedate,
                          closetime: closetime,
                          leadstage: closeLeadStage,
                          stagestatus: '0',
                          textarearemarks: textarearemarks,
                          userid: this.userid,
                          assignid: this.closedExecutiveId,
                          property: propid,
                          bhk: unitsselected,
                          bhkunit: unitnumbers,
                          dimension: dimensions,
                          ratepersft: rpsft,
                          autoremarks: this.autoremarks,
                          feedbackid: this.feedbackId
                        }
                        this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
                          this.status = success.status;
                          if (this.status == "True") {
                            this.filterLoader = false;
                            swal({
                              title: 'Deal Closing Request Send Successfully',
                              type: "success",
                              timer: 2000,
                              showConfirmButton: false
                            }).then(() => {
                              let currentUrl = this.router.url;
                              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                                this.router.navigate([currentUrl]);
                              });
                            });
                          } else if (this.status == "Duplicate Request") {
                            this.filterLoader = false;
                            swal({
                              title: 'Already got the request for this same Unit number',
                              type: "error",
                              timer: 2000,
                              showConfirmButton: false
                            });
                          }
                        }, (err) => {
                          console.log("Failed to Update");
                        });
                      }
                    }, (err) => {
                      console.log("Failed to Update");
                    });
                  } else if (res['status'] === 'Duplicate Request') {
                    this.filterLoader = false;
                    swal({
                      title: 'Already found the same property and same unit Closing request',
                      type: 'error',
                      timer: 2000,
                      showConfirmButton: false
                    });
                  }
                },
                  (err) => {
                    console.log(err);
                  });

              }
            }, (err) => {
              console.log("Failed to Update");
            })
          }
        }
        // Condition of selected unit more & entered less unit numbers
        else if (totalunitscount > totalunitnumbers) {
          if (totalunitnumbers == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalunitnumbers + ' Unit Number',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalunitnumbers + ' Unit Numbers',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#unitnum-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Number');

        }
        // Condition of selected unit less and not equal one & entered more unit numbers
        else if (totalunitscount < totalunitnumbers) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totalunitnumbers + ' Unit Numbers Detected',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        // Condition of selected unit more & entered less dimensions
        else if (totalunitscount > totaldimensions) {
          if (totaldimensions == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totaldimensions + ' Dimension',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totaldimensions + ' Dimensions',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#dimension-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');

        }
        // Condition of selected unit less & entered more dimensions
        else if (totalunitscount < totaldimensions) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totaldimensions + ' Dimensions Detected',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        // Condition of selected unit more & entered less ratepersqfeets
        else if (totalunitscount > totalrpsft) {
          if (totalrpsft == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalrpsft + ' Price Found',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalrpsft + ' Prices Found',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#ratepersquarfeet-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
        }
        // Condition of selected unit less & entered more ratepersqfeets
        else if (totalunitscount < totalrpsft) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totalrpsft + ' Prices Found',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        else {
          // this.filterLoader = true;

          // parameters & API Submissions for the property sitevisit update
          var visitparam = {
            leadid: this.leadid,
            propid: this.suggestchecked,
            execid: this.userid,
            visitupdate: 1,
            remarks: $('#propertyremarks').val(),
            stage: "USV",
            assignid: this.closedExecutiveId,
            feedbackid: this.feedbackId
          }
          // parameters & API Submissions for the property sitevisit update

          this._mandateService.addpropertyvisitupdate(visitparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {

              const formData = new FormData();
              formData.append('PropID', propid);
              formData.append('LeadID', this.leadid);
              formData.append('ExecID', this.userid);
              formData.append('assignID', this.closedExecutiveId)
              for (var k = 0; k < this.closurefiles.length; k++) {
                formData.append('file[]', this.closurefiles[k]);
              }
              this._mandateService.uploadFile(formData).subscribe((res) => {
                if (res['status'] === 'True') {
                  var visiteddate = $('#USVvisiteddate').val();
                  var visitedtime = $('#USVvisitedtime').val();
                  // var usvfinalremarks = $('#usvfinalremarks').val();
                  var usvfinalremarks = "USV Done";
                  this.autoremarks = " Changed the status to Deal Closing Request after Successfully completed the USV";
                  var leadusvparam = {
                    leadid: this.leadid,
                    closedate: visiteddate,
                    closetime: visitedtime,
                    leadstage: "USV",
                    stagestatus: '3',
                    textarearemarks: usvfinalremarks,
                    userid: this.userid,
                    assignid: this.closedExecutiveId,
                    autoremarks: this.autoremarks,
                    property: propid,
                    feedbackid: this.feedbackId
                  }

                  this._mandateService.addleadhistory(leadusvparam).subscribe((success) => {
                    this.status = success.status;
                    if (this.status == "True") {
                      var closedate = $('#closeddate').val();
                      var closetime = $('#closedtime').val();
                      var textarearemarks = $("#remarks-" + i).val();
                      var dateformatchange = new Date(closedate).toDateString();

                      this.autoremarks = " Send the Deal Closing Request for " + propname + " On " + dateformatchange + " " + closetime;
                      var leadhistparam = {
                        leadid: this.leadid,
                        closedate: closedate,
                        closetime: closetime,
                        leadstage: closeLeadStage,
                        stagestatus: '0',
                        textarearemarks: textarearemarks,
                        userid: this.userid,
                        assignid: this.closedExecutiveId,
                        property: propid,
                        bhk: unitsselected,
                        bhkunit: unitnumbers,
                        dimension: dimensions,
                        ratepersft: rpsft,
                        autoremarks: this.autoremarks,
                        feedbackid: this.feedbackId
                      }
                      this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
                        this.status = success.status;
                        if (this.status == "True") {
                          this.filterLoader = false;
                          swal({
                            title: 'Deal Closing Request Send Successfully',
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
                          }).then(() => {
                            let currentUrl = this.router.url;
                            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                              this.router.navigate([currentUrl]);
                            });
                          });
                        } else if (this.status == "Duplicate Request") {
                          this.filterLoader = false;
                          swal({
                            title: 'Already got the request for this same Unit number',
                            type: "error",
                            timer: 2000,
                            showConfirmButton: false
                          });
                        }
                      }, (err) => {
                        console.log("Failed to Update");
                      });
                    }
                  }, (err) => {
                    console.log("Failed to Update");
                  });
                } else if (res['status'] === 'Duplicate Request') {
                  this.filterLoader = false;
                  swal({
                    title: 'Already found the same property and same unit Closing request',
                    type: 'error',
                    timer: 2000,
                    showConfirmButton: false
                  });
                }
              },
                (err) => {
                  console.log(err);
                });
            }
          }, (err) => {
            console.log("Failed to Update");
          })
        }
      }
    }
    // USV DONE with Lead Closing

    // RSV DONE with Lead Closing
    else if ($('#sectionselector').val() == "RSV") {
      // alert("RSV Detected");
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
      if ($('#RSVvisiteddate').val() == "") {
        $('#RSVvisiteddate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#RSVvisiteddate').removeAttr("style");
      }

      if ($('#RSVvisitedtime').val() == "") {
        $('#RSVvisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#RSVvisitedtime').removeAttr("style");
      }
      if ($('#closeddate').val() == "") {
        $('#closeddate').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Date');
        return false;
      }
      else {
        $('#closeddate').removeAttr("style");
      }
      if ($('#closedtime').val() == "") {
        $('#closedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Time');
        return false;
      }
      else {
        $('#closedtime').removeAttr("style");
      }
      if ($("#selectedunits-" + i).val() == "") {
        swal({
          title: 'Units Not Selected',
          text: 'Select any Unit for ' + propname,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      } else if ($("#unitnum-" + i).val().trim() == "") {
        $("#unitnum-" + i).val('')
        $("#unitnum-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Number');
        return false;
      } else if ($("#dimension-" + i).val().trim() == "" || !/^[0-9,]+$/.test($("#dimension-" + i).val())) {
        $("#dimension-" + i).val('');
        $("#dimension-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');
        return false;
      } else if ($("#ratepersquarfeet-" + i).val().trim() == "" || !/^[0-9,]+$/.test($("#ratepersquarfeet-" + i).val())) {
        $("#ratepersquarfeet-" + i).val('');
        $("#ratepersquarfeet-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
        return false;
      } else if ($("#remarks-" + i).val().trim() == "") {
        $("#remarks-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type some comments/remarks');
        return false;
      } else if ($("#customFile" + i).val() == "") {
        swal({
          title: 'No Files Uploaded',
          text: 'Upload atleast one file for ' + propname,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      } else {

        $("#unitnum-" + i).removeAttr("style");
        $("#dimension-" + i).removeAttr("style");
        $("#ratepersquarfeet-" + i).removeAttr("style");
        $("#remarks-" + i).removeAttr("style");
        this.filterLoader = true;
        var unitsselected = $("#selectedunits-" + i).val();
        var lastunit = unitsselected.replace(/,\s*$/, "");
        var totalunitscount = lastunit.split(",").length;
        // alert(totalunitscount);
        var unitnumbers = $("#unitnum-" + i).val();
        var lastuninumber = unitnumbers.replace(/,\s*$/, "");
        var totalunitnumbers = lastuninumber.split(",").length;
        // alert(lastuninumber);
        var dimensions = $("#dimension-" + i).val();
        var lastdimension = dimensions.replace(/,\s*$/, "");
        var totaldimensions = lastdimension.split(",").length;
        // alert(totaldimensions);
        var rpsft = $("#ratepersquarfeet-" + i).val();
        var lastsqft = rpsft.replace(/,\s*$/, "");
        var totalrpsft = lastsqft.split(",").length;
        // alert(totalrpsft);

        // Condition of selected only one unit or less than one & enetered more unit numbers
        if (totalunitscount <= 1 && totalunitnumbers > 1) {
          if (totalunitnumbers != totaldimensions) {
            if (totaldimensions == 1) {
              swal({
                title: totalunitnumbers + ' Unit Numbers & ' + totaldimensions + ' Dimension Detected',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            } else {
              swal({
                title: totalunitnumbers + ' Unit Numbers & ' + totaldimensions + ' Dimensions Detected',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            }
          } else if (totaldimensions != totalrpsft) {

            if (totalrpsft == 1) {
              swal({
                title: totaldimensions + ' Dimensions & ' + totalrpsft + ' Price Found',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            } else {
              swal({
                title: totaldimensions + ' Dimensions & ' + totalrpsft + ' Prices Found',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            }
          } else {
            // parameters & API Submissions for the property sitevisit update
            var visitedparam = {
              leadid: this.leadid,
              propid: this.suggestchecked,
              execid: this.userid,
              visitupdate: 1,
              remarks: $('#propertyremarks').val(),
              stage: "RSV",
              assignid: this.closedExecutiveId,
              feedbackid: this.feedbackId
            }
            // parameters & API Submissions for the property sitevisit update
            this._mandateService.addpropertyvisitupdate(visitedparam).subscribe((success) => {
              this.status = success.status;
              if (this.status == "True") {

                // alert("Total Units and Unit numbers matched");
                const formData = new FormData();
                formData.append('PropID', propid);
                formData.append('LeadID', this.leadid);
                formData.append('ExecID', this.userid);
                formData.append('assignID', this.closedExecutiveId)
                for (var k = 0; k < this.closurefiles.length; k++) {
                  formData.append('file[]', this.closurefiles[k]);
                }
                this._mandateService.uploadFile(formData).subscribe((res) => {
                  if (res['status'] === 'True') {
                    var visiteddate = $('#RSVvisiteddate').val();
                    var visitedtime = $('#RSVvisitedtime').val();
                    // var rsvfinalremarks = $('#rsvfinalremarks').val();
                    // var rsvfinalremarks = "RSV Done";
                    var rsvfinalremarks = $('#propertyremarks').val();
                    this.autoremarks = " Changed the status to Deal Closing Request after Successfully completed the RSV";
                    var leadrsvparam = {
                      leadid: this.leadid,
                      closedate: visiteddate,
                      closetime: visitedtime,
                      leadstage: "RSV",
                      stagestatus: '3',
                      textarearemarks: rsvfinalremarks,
                      userid: this.userid,
                      assignid: this.closedExecutiveId,
                      autoremarks: this.autoremarks,
                      property: propid,
                      feedbackid: this.feedbackId
                    }

                    this._mandateService.addleadhistory(leadrsvparam).subscribe((success) => {
                      this.status = success.status;
                      if (this.status == "True") {
                        var closedate = $('#closeddate').val();
                        var closetime = $('#closedtime').val();
                        var textarearemarks = $("#remarks-" + i).val();
                        var dateformatchange = new Date(closedate).toDateString();

                        this.autoremarks = " Send the Deal Closing Request for " + propname + " On " + dateformatchange + " " + closetime;
                        var leadhistparam = {
                          leadid: this.leadid,
                          closedate: closedate,
                          closetime: closetime,
                          leadstage: closeLeadStage,
                          stagestatus: '0',
                          textarearemarks: textarearemarks,
                          userid: this.userid,
                          assignid: this.closedExecutiveId,
                          property: propid,
                          bhk: unitsselected,
                          bhkunit: unitnumbers,
                          dimension: dimensions,
                          ratepersft: rpsft,
                          autoremarks: this.autoremarks,
                          feedbackid: this.feedbackId
                        }
                        this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
                          this.status = success.status;
                          if (this.status == "True") {
                            this.filterLoader = false;
                            swal({
                              title: 'Deal Closing Requested Successfully',
                              type: "success",
                              timer: 2000,
                              showConfirmButton: false
                            }).then(() => {
                              let currentUrl = this.router.url;
                              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                                this.router.navigate([currentUrl]);
                              });
                            });
                          } else if (this.status == "Duplicate Request") {
                            this.filterLoader = false;
                            swal({
                              title: 'Already got the request for this same Unit number',
                              type: "error",
                              timer: 2000,
                              showConfirmButton: false
                            });
                          }
                        }, (err) => {
                          console.log("Failed to Update");
                        });
                      }
                    }, (err) => {
                      console.log("Failed to Update");
                    });

                  } else if (res['status'] === 'Duplicate Request') {
                    this.filterLoader = false;
                    swal({
                      title: 'Already found the same property and same unit Closing request',
                      type: 'error',
                      timer: 2000,
                      showConfirmButton: false
                    });
                  }
                },
                  (err) => {
                    console.log(err);
                  });

              }
            }, (err) => {
              console.log("Failed to Update");
            })



          }
        }
        // Condition of selected unit more & entered less unit numbers
        else if (totalunitscount > totalunitnumbers) {
          if (totalunitnumbers == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalunitnumbers + ' Unit Number',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalunitnumbers + ' Unit Numbers',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#unitnum-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Number');

        }
        // Condition of selected unit less and not equal one & entered more unit numbers
        else if (totalunitscount < totalunitnumbers) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totalunitnumbers + ' Unit Numbers Detected',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        // Condition of selected unit more & entered less dimensions
        else if (totalunitscount > totaldimensions) {
          if (totaldimensions == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totaldimensions + ' Dimension',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totaldimensions + ' Dimensions',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#dimension-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');

        }
        // Condition of selected unit less & entered more dimensions
        else if (totalunitscount < totaldimensions) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totaldimensions + ' Dimensions Detected',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        // Condition of selected unit more & entered less ratepersqfeets
        else if (totalunitscount > totalrpsft) {
          if (totalrpsft == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalrpsft + ' Price Found',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalrpsft + ' Prices Found',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#ratepersquarfeet-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
        }
        // Condition of selected unit less & entered more ratepersqfeets
        else if (totalunitscount < totalrpsft) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totalrpsft + ' Prices Found',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        else {
          // parameters & API Submissions for the property sitevisit update
          var visitedparam2 = {
            leadid: this.leadid,
            propid: this.suggestchecked,
            execid: this.userid,
            visitupdate: 1,
            remarks: $('#propertyremarks').val(),
            stage: "RSV",
            assignid: this.closedExecutiveId,
            feedbackid: this.feedbackId
          }
          // parameters & API Submissions for the property sitevisit update
          // this.filterLoader = true;

          this._mandateService.addpropertyvisitupdate(visitedparam2).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              const formData = new FormData();
              formData.append('PropID', propid);
              formData.append('LeadID', this.leadid);
              formData.append('ExecID', this.userid);
              formData.append('assignID', this.closedExecutiveId)
              for (var k = 0; k < this.closurefiles.length; k++) {
                formData.append('file[]', this.closurefiles[k]);
              }
              this._mandateService.uploadFile(formData).subscribe((res) => {
                if (res['status'] === 'True') {
                  var visiteddate = $('#RSVvisiteddate').val();
                  var visitedtime = $('#RSVvisitedtime').val();
                  // var rsvfinalremarks = $('#rsvfinalremarks').val();
                  // var rsvfinalremarks = "RSV Done";
                  var rsvfinalremarks = $('#propertyremarks').val();
                  this.autoremarks = " Changed the status to Deal Closing Request after Successfully completed the RSV";
                  var leadrsvparam = {
                    leadid: this.leadid,
                    closedate: visiteddate,
                    closetime: visitedtime,
                    leadstage: "RSV",
                    stagestatus: '3',
                    textarearemarks: rsvfinalremarks,
                    userid: this.userid,
                    assignid: this.closedExecutiveId,
                    autoremarks: this.autoremarks,
                    property: propid,
                    feedbackid: this.feedbackId
                  }

                  this._mandateService.addleadhistory(leadrsvparam).subscribe((success) => {
                    this.status = success.status;
                    if (this.status == "True") {
                      var closedate = $('#closeddate').val();
                      var closetime = $('#closedtime').val();
                      var textarearemarks = $("#remarks-" + i).val();
                      var dateformatchange = new Date(closedate).toDateString();

                      this.autoremarks = " Send the Deal Closing Request for " + propname + " On " + dateformatchange + " " + closetime;
                      var leadhistparam = {
                        leadid: this.leadid,
                        closedate: closedate,
                        closetime: closetime,
                        leadstage: closeLeadStage,
                        stagestatus: '0',
                        textarearemarks: textarearemarks,
                        userid: this.userid,
                        assignid: this.closedExecutiveId,
                        property: propid,
                        bhk: unitsselected,
                        bhkunit: unitnumbers,
                        dimension: dimensions,
                        ratepersft: rpsft,
                        autoremarks: this.autoremarks,
                        feedbackid: this.feedbackId
                      }
                      this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
                        this.status = success.status;
                        if (this.status == "True") {
                          this.filterLoader = false;
                          swal({
                            title: 'Deal Closing Requested Successfully',
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
                          }).then(() => {
                            let currentUrl = this.router.url;
                            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                              this.router.navigate([currentUrl]);
                            });
                          });
                        } else if (this.status == "Duplicate Request") {
                          this.filterLoader = false;
                          swal({
                            title: 'Already got the request for this same Unit number',
                            type: "error",
                            timer: 2000,
                            showConfirmButton: false
                          });
                        }
                      }, (err) => {
                        console.log("Failed to Update");
                      });
                    }
                  }, (err) => {
                    console.log("Failed to Update");
                  });

                } else if (res['status'] === 'Duplicate Request') {
                  this.filterLoader = false;
                  swal({
                    title: 'Already found the same property and same unit Closing request',
                    type: 'error',
                    timer: 2000,
                    showConfirmButton: false
                  });
                }
              },
                (err) => {
                  console.log(err);
                });
            }
          }, (err) => {
            console.log("Failed to Update");
          })
        }
      }
    }
    // RSV DONE with Lead Closing

    // NEGOTIATION DONE with Lead Closing
    else if ($('#sectionselector').val() == "Final Negotiation") {
      // alert("Nego Detected");
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
        $('#negovisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      }
      else {
        $('#negovisitedtime').removeAttr("style");
      }
      if ($('#closeddate').val() == "") {
        $('#closeddate').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Date');
        return false;
      }
      else {
        $('#closeddate').removeAttr("style");
      }
      if ($('#closedtime').val() == "") {
        $('#closedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Time');
        return false;
      }
      else {
        $('#closedtime').removeAttr("style");
      }
      if ($("#selectedunits-" + i).val() == "") {
        swal({
          title: 'Units Not Selected',
          text: 'Select any Unit for ' + propname,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
        // || !/^[0-9,]+$/.test($("#unitnum-" + i).val()) (to restrict the special characters and alphabets)
      } else if ($("#unitnum-" + i).val().trim() == "") {
        $("#unitnum-" + i).val('')
        $("#unitnum-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Number');
        return false;
      } else if ($("#dimension-" + i).val().trim() == "" || !/^[0-9,]+$/.test($("#dimension-" + i).val())) {
        $("#dimension-" + i).val('');
        $("#dimension-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');
        return false;
      } else if ($("#ratepersquarfeet-" + i).val().trim() == "" || !/^[0-9,]+$/.test($("#ratepersquarfeet-" + i).val())) {
        $("#ratepersquarfeet-" + i).val('');
        $("#ratepersquarfeet-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
        return false;
      } else if ($("#remarks-" + i).val().trim() == "") {
        $("#remarks-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type some comments/remarks');
        return false;
      } else if ($("#customFile" + i).val() == "") {
        swal({
          title: 'No Files Uploaded',
          text: 'Upload atleast one file for ' + propname,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      }
      else {
        this.filterLoader = true;
        $("#unitnum-" + i).removeAttr("style");
        $("#dimension-" + i).removeAttr("style");
        $("#ratepersquarfeet-" + i).removeAttr("style");
        $("#remarks-" + i).removeAttr("style");

        var unitsselected = $("#selectedunits-" + i).val();
        var lastunit = unitsselected.replace(/,\s*$/, "");
        var totalunitscount = lastunit.split(",").length;
        // alert(totalunitscount);
        var unitnumbers = $("#unitnum-" + i).val();
        var lastuninumber = unitnumbers.replace(/,\s*$/, "");
        var totalunitnumbers = lastuninumber.split(",").length;
        // alert(lastuninumber);
        var dimensions = $("#dimension-" + i).val();
        var lastdimension = dimensions.replace(/,\s*$/, "");
        var totaldimensions = lastdimension.split(",").length;
        // alert(totaldimensions);
        var rpsft = $("#ratepersquarfeet-" + i).val();
        var lastsqft = rpsft.replace(/,\s*$/, "");
        var totalrpsft = lastsqft.split(",").length;
        // alert(totalrpsft);

        // Condition of selected only one unit or less than one & enetered more unit numbers
        if (totalunitscount <= 1 && totalunitnumbers > 1) {
          if (totalunitnumbers != totaldimensions) {
            if (totaldimensions == 1) {
              swal({
                title: totalunitnumbers + ' Unit Numbers & ' + totaldimensions + ' Dimension Detected',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            } else {
              swal({
                title: totalunitnumbers + ' Unit Numbers & ' + totaldimensions + ' Dimensions Detected',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            }
          } else if (totaldimensions != totalrpsft) {

            if (totalrpsft == 1) {
              swal({
                title: totaldimensions + ' Dimensions & ' + totalrpsft + ' Price Found',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            } else {
              swal({
                title: totaldimensions + ' Dimensions & ' + totalrpsft + ' Prices Found',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            }
          } else {
            // alert("Total Units and Unit numbers matched");
            var visitedparamnego1 = {
              leadid: this.leadid,
              propid: this.suggestchecked,
              execid: this.userid,
              visitupdate: 1,
              remarks: $('#propertyremarks').val(),
              stage: "Final Negotiation",
              assignid: this.closedExecutiveId,
              feedbackid: this.feedbackId
            }

            this._mandateService.addpropertyvisitupdate(visitedparamnego1).subscribe((success) => {
              this.status = success.status;
              if (this.status == "True") {
                const formData = new FormData();
                formData.append('PropID', propid);
                formData.append('LeadID', this.leadid);
                formData.append('ExecID', this.userid);
                formData.append('assignID', this.closedExecutiveId)
                for (var k = 0; k < this.closurefiles.length; k++) {
                  formData.append('file[]', this.closurefiles[k]);
                }
                this._mandateService.uploadFile(formData).subscribe((res) => {
                  if (res['status'] === 'True') {
                    var visiteddate = $('#negovisiteddate').val();
                    var visitedtime = $('#negovisitedtime').val();
                    // var negofinalremarks = $('#negofinalremarks').val();
                    var negofinalremarks = "Final Negotiation Done";
                    this.autoremarks = " Changed the status to Deal Closing Request after Successfully completed the Final Negotiation";
                    var leadnegoparam = {
                      leadid: this.leadid,
                      closedate: visiteddate,
                      closetime: visitedtime,
                      leadstage: "Final Negotiation",
                      stagestatus: '3',
                      textarearemarks: negofinalremarks,
                      userid: this.userid,
                      assignid: this.closedExecutiveId,
                      autoremarks: this.autoremarks,
                      property: propid,
                      feedbackid: this.feedbackId
                    }

                    this._mandateService.addleadhistory(leadnegoparam).subscribe((success) => {
                      this.status = success.status;
                      if (this.status == "True") {
                        var closedate = $('#closeddate').val();
                        var closetime = $('#closedtime').val();
                        var textarearemarks = $("#remarks-" + i).val();
                        var dateformatchange = new Date(closedate).toDateString();

                        this.autoremarks = " Send the Deal Closing Request for " + propname + " On " + dateformatchange + " " + closetime;
                        var leadhistparam = {
                          leadid: this.leadid,
                          closedate: closedate,
                          closetime: closetime,
                          leadstage: closeLeadStage,
                          stagestatus: '0',
                          textarearemarks: textarearemarks,
                          userid: this.userid,
                          assignid: this.closedExecutiveId,
                          property: propid,
                          bhk: unitsselected,
                          bhkunit: unitnumbers,
                          dimension: dimensions,
                          ratepersft: rpsft,
                          autoremarks: this.autoremarks,
                          feedbackid: this.feedbackId
                        }
                        this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
                          this.status = success.status;
                          if (this.status == "True") {
                            this.filterLoader = false;
                            swal({
                              title: 'Deal Closing Requested Successfully',
                              type: "success",
                              timer: 2000,
                              showConfirmButton: false
                            }).then(() => {
                              let currentUrl = this.router.url;
                              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                                this.router.navigate([currentUrl]);
                              });
                            });
                          } else if (this.status == "Duplicate Request") {
                            this.filterLoader = false;
                            swal({
                              title: 'Already got the request for this same Unit number',
                              type: "error",
                              timer: 2000,
                              showConfirmButton: false
                            });
                          }
                        }, (err) => {
                          console.log("Failed to Update");
                        });
                      }
                    }, (err) => {
                      console.log("Failed to Update");
                    });

                  } else if (res['status'] === 'Duplicate Request') {
                    this.filterLoader = false;
                    swal({
                      title: 'Already found the same property and same unit Closing request',
                      type: 'error',
                      timer: 2000,
                      showConfirmButton: false
                    });
                  }
                },
                  (err) => {
                    console.log(err);
                  });
              }
            }, (err) => {
              console.log("Failed to Update");
            })

          }
        }
        // Condition of selected unit more & entered less unit numbers
        else if (totalunitscount > totalunitnumbers) {
          if (totalunitnumbers == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalunitnumbers + ' Unit Number',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalunitnumbers + ' Unit Numbers',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#unitnum-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Number');

        }
        // Condition of selected unit less and not equal one & entered more unit numbers
        else if (totalunitscount < totalunitnumbers) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totalunitnumbers + ' Unit Numbers Detected',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        // Condition of selected unit more & entered less dimensions
        else if (totalunitscount > totaldimensions) {
          if (totaldimensions == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totaldimensions + ' Dimension',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totaldimensions + ' Dimensions',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#dimension-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');

        }
        // Condition of selected unit less & entered more dimensions
        else if (totalunitscount < totaldimensions) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totaldimensions + ' Dimensions Detected',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        // Condition of selected unit more & entered less ratepersqfeets
        else if (totalunitscount > totalrpsft) {
          if (totalrpsft == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalrpsft + ' Price Found',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalrpsft + ' Prices Found',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#ratepersquarfeet-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
        }
        // Condition of selected unit less & entered more ratepersqfeets
        else if (totalunitscount < totalrpsft) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totalrpsft + ' Prices Found',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        else {
          var visitedparamnego2 = {
            leadid: this.leadid,
            propid: this.suggestchecked,
            execid: this.userid,
            visitupdate: 1,
            remarks: $('#propertyremarks').val(),
            stage: "Final Negotiation",
            assignid: this.closedExecutiveId,
            feedbackid: this.feedbackId
          }
          // this.filterLoader = true;

          this._mandateService.addpropertyvisitupdate(visitedparamnego2).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              const formData = new FormData();
              formData.append('PropID', propid);
              formData.append('LeadID', this.leadid);
              formData.append('ExecID', this.userid);
              formData.append('assignID', this.closedExecutiveId)
              for (var k = 0; k < this.closurefiles.length; k++) {
                formData.append('file[]', this.closurefiles[k]);
              }
              this._mandateService.uploadFile(formData).subscribe((res) => {
                if (res['status'] === 'True') {
                  var visiteddate = $('#negovisiteddate').val();
                  var visitedtime = $('#negovisitedtime').val();
                  // var negofinalremarks = $('#negofinalremarks').val();
                  var negofinalremarks = "Final Negotiation Done";
                  this.autoremarks = " Changed the status to Deal Closing Request after Successfully completed the Final Negotiation";
                  var leadnegoparam = {
                    leadid: this.leadid,
                    closedate: visiteddate,
                    closetime: visitedtime,
                    leadstage: "Final Negotiation",
                    stagestatus: '3',
                    textarearemarks: negofinalremarks,
                    userid: this.userid,
                    assignid: this.closedExecutiveId,
                    autoremarks: this.autoremarks,
                    property: propid,
                    feedbackid: this.feedbackId
                  }

                  this._mandateService.addleadhistory(leadnegoparam).subscribe((success) => {
                    this.status = success.status;
                    if (this.status == "True") {
                      var closedate = $('#closeddate').val();
                      var closetime = $('#closedtime').val();
                      var textarearemarks = $("#remarks-" + i).val();
                      var dateformatchange = new Date(closedate).toDateString();

                      this.autoremarks = " Send the Deal Closing Request for " + propname + " On " + dateformatchange + " " + closetime;
                      var leadhistparam = {
                        leadid: this.leadid,
                        closedate: closedate,
                        closetime: closetime,
                        leadstage: closeLeadStage,
                        stagestatus: '0',
                        textarearemarks: textarearemarks,
                        userid: this.userid,
                        assignid: this.closedExecutiveId,
                        property: propid,
                        bhk: unitsselected,
                        bhkunit: unitnumbers,
                        dimension: dimensions,
                        ratepersft: rpsft,
                        autoremarks: this.autoremarks,
                        feedbackid: this.feedbackId
                      }
                      this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
                        this.status = success.status;
                        if (this.status == "True") {
                          this.filterLoader = false;
                          swal({
                            title: 'Deal Closing Requested Successfully',
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
                          }).then(() => {
                            let currentUrl = this.router.url;
                            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                              this.router.navigate([currentUrl]);
                            });
                          });
                        } else if (this.status == "Duplicate Request") {
                          this.filterLoader = false;
                          swal({
                            title: 'Already got the request for this same Unit number',
                            type: "error",
                            timer: 2000,
                            showConfirmButton: false
                          });
                        }
                      }, (err) => {
                        console.log("Failed to Update");
                      });
                    }
                  }, (err) => {
                    console.log("Failed to Update");
                  });

                } else if (res['status'] === 'Duplicate Request') {
                  this.filterLoader = false;
                  swal({
                    title: 'Already found the same property and same unit Closing request',
                    type: 'error',
                    timer: 2000,
                    showConfirmButton: false
                  });
                }
              },
                (err) => {
                  console.log(err);
                });
            }
          }, (err) => {
            console.log("Failed to Update");
          })
        }
      }
    }
    // NEGOTIATION DONE with Lead Closing

    // Direct Lead Closing
    else {
      // alert("Direct Detected");
      if ($('#closeddate').val() == "") {
        $('#closeddate').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Date');
        return false;
      }
      else {
        $('#closeddate').removeAttr("style");
      }
      if ($('#closedtime').val() == "") {
        $('#closedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Time');
        return false;
      }
      else {
        $('#closedtime').removeAttr("style");
      }
      if ($("#selectedunits-" + i).val() == "") {
        swal({
          title: 'Units Not Selected',
          text: 'Select any Unit for ' + propname,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      } else if ($("#unitnum-" + i).val().trim() == "") {
        $("#unitnum-" + i).val('')
        $("#unitnum-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Number');
        return false;
      } else if ($("#dimension-" + i).val().trim() == "" || !/^[0-9,]+$/.test($("#dimension-" + i).val())) {
        $("#dimension-" + i).val('');
        $("#dimension-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');
        return false;
      } else if ($("#ratepersquarfeet-" + i).val().trim() == "" || !/^[0-9,]+$/.test($("#ratepersquarfeet-" + i).val())) {
        $("#ratepersquarfeet-" + i).val('');
        $("#ratepersquarfeet-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
        return false;
      } else if ($("#remarks-" + i).val().trim() == "") {
        $("#remarks-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type some comments/remarks');
        return false;
      } else if ($("#customFile" + i).val() == "") {
        swal({
          title: 'No Files Uploaded',
          text: 'Upload atleast one file for ' + propname,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return false;
      }
      else {
        $("#unitnum-" + i).removeAttr("style");
        $("#dimension-" + i).removeAttr("style");
        $("#ratepersquarfeet-" + i).removeAttr("style");
        $("#remarks-" + i).removeAttr("style");
        this.filterLoader = true;
        var unitsselected = $("#selectedunits-" + i).val();
        var lastunit = unitsselected.replace(/,\s*$/, "");
        var totalunitscount = lastunit.split(",").length;
        // alert(totalunitscount);
        var unitnumbers = $("#unitnum-" + i).val();
        var lastuninumber = unitnumbers.replace(/,\s*$/, "");
        var totalunitnumbers = lastuninumber.split(",").length;
        // alert(lastuninumber);
        var dimensions = $("#dimension-" + i).val();
        var lastdimension = dimensions.replace(/,\s*$/, "");
        var totaldimensions = lastdimension.split(",").length;
        // alert(totaldimensions);
        var rpsft = $("#ratepersquarfeet-" + i).val();
        var lastsqft = rpsft.replace(/,\s*$/, "");
        var totalrpsft = lastsqft.split(",").length;
        // alert(totalrpsft);
        // Condition of selected only one unit or less than one & enetered more unit numbers
        if (totalunitscount <= 1 && totalunitnumbers > 1) {
          if (totalunitnumbers != totaldimensions) {
            if (totaldimensions == 1) {
              swal({
                title: totalunitnumbers + ' Unit Numbers & ' + totaldimensions + ' Dimension Detected',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            } else {
              swal({
                title: totalunitnumbers + ' Unit Numbers & ' + totaldimensions + ' Dimensions Detected',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            }
          } else if (totaldimensions != totalrpsft) {

            if (totalrpsft == 1) {
              swal({
                title: totaldimensions + ' Dimensions & ' + totalrpsft + ' Price Found',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            } else {
              swal({
                title: totaldimensions + ' Dimensions & ' + totalrpsft + ' Prices Found',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              })
              this.filterLoader = false;
            }
          } else {
            // alert("Total Units and Unit numbers matched")
            const formData = new FormData();
            formData.append('PropID', propid);
            formData.append('LeadID', this.leadid);
            formData.append('ExecID', this.userid);
            formData.append('assignID', this.closedExecutiveId)
            for (var k = 0; k < this.closurefiles.length; k++) {
              formData.append('file[]', this.closurefiles[k]);
            }
            this._mandateService.uploadFile(formData).subscribe((res) => {
              if (res['status'] === 'Duplicate Request') {
                this.filterLoader = false;
                swal({
                  title: 'Already found the same property and same unit Closing request',
                  type: 'error',
                  timer: 2000,
                  showConfirmButton: false
                });
              }
            },
              (err) => {
                console.log(err);
              });

            var closedate = $('#closeddate').val();
            var closetime = $('#closedtime').val();
            var textarearemarks = $("#remarks-" + i).val();
            this.autoremarks = " Send the Deal Closing Request successfully.";
            var leadhistparam = {
              leadid: this.leadid,
              closedate: closedate,
              closetime: closetime,
              leadstage: closeLeadStage,
              stagestatus: '0',
              textarearemarks: textarearemarks,
              userid: this.userid,
              assignid: this.closedExecutiveId,
              property: propid,
              bhk: unitsselected,
              bhkunit: unitnumbers,
              dimension: dimensions,
              ratepersft: rpsft,
              autoremarks: this.autoremarks,
              feedbackid: this.feedbackId
            }

            this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
              this.status = success.status;
              if (this.status == "True") {
                this.filterLoader = false;
                swal({
                  title: 'Deal Closing Requested Successfully',
                  type: "success",
                  timer: 2000,
                  showConfirmButton: false
                }).then((result) => {
                  if (result.value) {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  }
                });
              } else if (this.status == "Duplicate Request") {
                this.filterLoader = false;
                swal({
                  title: 'Already got the request for this same Unit number',
                  type: "error",
                  timer: 2000,
                  showConfirmButton: false
                });
              }
            }, (err) => {
              console.log("Failed to Update");
            });

          }
        }
        // Condition of selected unit more & entered less unit numbers
        else if (totalunitscount > totalunitnumbers) {
          if (totalunitnumbers == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalunitnumbers + ' Unit Number',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalunitnumbers + ' Unit Numbers',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#unitnum-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Unit Number');
        }
        // Condition of selected unit less and not equal one & entered more unit numbers
        else if (totalunitscount < totalunitnumbers) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totalunitnumbers + ' Unit Numbers Detected',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        // Condition of selected unit more & entered less dimensions
        else if (totalunitscount > totaldimensions) {
          if (totaldimensions == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totaldimensions + ' Dimension',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totaldimensions + ' Dimensions',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#dimension-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Dimension');
        }
        // Condition of selected unit less & entered more dimensions
        else if (totalunitscount < totaldimensions) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totaldimensions + ' Dimensions Detected',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        // Condition of selected unit more & entered less ratepersqfeets
        else if (totalunitscount > totalrpsft) {
          if (totalrpsft == 1) {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalrpsft + ' Price Found',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          } else {
            swal({
              title: totalunitscount + ' Units Selected & Found only ' + totalrpsft + ' Prices Found',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            this.filterLoader = false;
          }
          $("#ratepersquarfeet-" + i).focus().css("border-color", "red").attr('placeholder', 'Please type the Rate Per Squarefeet');
        }
        // Condition of selected unit less & entered more ratepersqfeets
        else if (totalunitscount < totalrpsft) {
          swal({
            title: totalunitscount + ' Units Selected & ' + totalrpsft + ' Prices Found',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.filterLoader = false;
        }
        else {
          // alert("Total Units and Unit numbers matched");
          // this.filterLoader = true;
          const formData = new FormData();
          formData.append('PropID', propid);
          formData.append('LeadID', this.leadid);
          formData.append('ExecID', this.userid);
          formData.append('assignID', this.closedExecutiveId)
          for (var k = 0; k < this.closurefiles.length; k++) {
            formData.append('file[]', this.closurefiles[k]);
          }
          this._mandateService.uploadFile(formData).subscribe((res) => {
            if (res['status'] === 'True') {
              var closedate = $('#closeddate').val();
              var closetime = $('#closedtime').val();
              var textarearemarks = $("#remarks-" + i).val();
              this.autoremarks = " Send the Deal Closing Request successfully.";
              var leadhistparam = {
                leadid: this.leadid,
                closedate: closedate,
                closetime: closetime,
                leadstage: closeLeadStage,
                stagestatus: '0',
                textarearemarks: textarearemarks,
                userid: this.userid,
                assignid: this.closedExecutiveId,
                property: propid,
                bhk: unitsselected,
                bhkunit: unitnumbers,
                dimension: dimensions,
                ratepersft: rpsft,
                autoremarks: this.autoremarks,
                feedbackid: this.feedbackId
              }

              this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
                this.status = success.status;
                if (this.status == "True") {
                  this.filterLoader = false;
                  swal({
                    title: 'Deal Closing Requested Successfully',
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                  }).then(() => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  });
                } else if (this.status == "Duplicate Request") {
                  this.filterLoader = false;
                  swal({
                    title: 'Already got the request for this same Unit number',
                    type: "error",
                    timer: 2000,
                    showConfirmButton: false
                  });
                }
              }, (err) => {
                console.log("Failed to Update");
              });
            } else if (res['status'] === 'False') {
              this.filterLoader = false;
              swal({
                title: 'Some error Occured in Image upload',
                type: 'error',
                timer: 2000,
                showConfirmButton: false
              });
            }
          },
            (err) => {
              console.log(err);
            });
        }
      }
    }
    // Direct Lead Closing
  }

  csClosingrequest() {
    // USV DONE with Lead Closing
    let i = 0;
    let propid = this.selectedSuggestedProp.propid;
    let propname = this.selectedSuggestedProp.name;

    let closeLeadStage = 'Deal Closing Pending';

    if ($('#sectionselector').val() == "USV") {
      let visitremarks = $('#propertyremarks').val().trim();
      if (visitremarks == "") {
        $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      } else {
        $('#propertyremarks').removeAttr("style");
      }

      if ($('#USVvisiteddate').val() == "") {
        $('#USVvisiteddate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      } else {
        $('#USVvisiteddate').removeAttr("style");
      }

      if ($('#USVvisitedtime').val() == "") {
        $('#USVvisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      } else {
        $('#USVvisitedtime').removeAttr("style");
      }

      if ($('#closeddate').val() == "") {
        $('#closeddate').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Date');
        return false;
      } else {
        $('#closeddate').removeAttr("style");
      }

      if ($('#closedtime').val() == "") {
        $('#closedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Time');
        return false;
      } else {
        $('#closedtime').removeAttr("style");
      }

      var visitparam = {
        leadid: this.leadid,
        propid: propid,
        execid: this.userid,
        visitupdate: 1,
        remarks: $('#propertyremarks').val(),
        stage: "USV",
        assignid: this.closedExecutiveId,
        feedbackid: this.feedbackId
      }
      // parameters & API Submissions for the property sitevisit update

      this._mandateService.addpropertyvisitupdate(visitparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {

          var visiteddate = $('#USVvisiteddate').val();
          var visitedtime = $('#USVvisitedtime').val();
          var usvfinalremarks = "USV Done";
          this.autoremarks = " Changed the status to Deal Closing Pending after Successfully completed the USV";
          var leadusvparam = {
            leadid: this.leadid,
            closedate: visiteddate,
            closetime: visitedtime,
            leadstage: "USV",
            stagestatus: '3',
            textarearemarks: usvfinalremarks,
            userid: this.userid,
            assignid: this.closedExecutiveId,
            autoremarks: this.autoremarks,
            property: propid,
            feedbackid: this.feedbackId
          }

          this._mandateService.addleadhistory(leadusvparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              var closedate = $('#closeddate').val();
              var closetime = $('#closedtime').val();
              var textarearemarks = `${this.getselectedLeadExec.customer_assign_name} sent a Deal Closing Request for ${this.getselectedLeadExec.accompany}`;
              var dateformatchange = new Date(closedate).toDateString();

              this.autoremarks = " Send the Deal Closing Pending for " + propname + " On " + dateformatchange + " " + closetime;
              var leadhistparam = {
                leadid: this.leadid,
                closedate: closedate,
                closetime: closetime,
                leadstage: closeLeadStage,
                stagestatus: '0',
                textarearemarks: textarearemarks,
                userid: this.userid,
                assignid: this.closedExecutiveId,
                property: propid,
                bhk: '',
                bhkunit: '',
                dimension: '',
                ratepersft: '',
                autoremarks: this.autoremarks,
                feedbackid: this.feedbackId
              }
              this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
                this.status = success.status;
                if (this.status == "True") {
                  this.filterLoader = false;
                  swal({
                    title: 'Deal Closing Pending Updated Successfully',
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                  }).then(() => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  });
                } else if (this.status == "Duplicate Request") {
                  this.filterLoader = false;
                  swal({
                    title: 'Already got the request for this same Unit number',
                    type: "error",
                    timer: 2000,
                    showConfirmButton: false
                  });
                }
              }, (err) => {
                console.log("Failed to Update");
              });
            }
          }, (err) => {
            console.log("Failed to Update");
          });

        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
    // USV DONE with Lead Closing

    // RSV DONE with Lead Closing
    else if ($('#sectionselector').val() == "RSV") {

      let visitremarks = $('#propertyremarks').val().trim();
      if (visitremarks == "") {
        $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      } else {
        $('#propertyremarks').removeAttr("style");
      }

      if ($('#RSVvisiteddate').val() == "") {
        $('#RSVvisiteddate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      } else {
        $('#RSVvisiteddate').removeAttr("style");
      }

      if ($('#RSVvisitedtime').val() == "") {
        $('#RSVvisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      } else {
        $('#RSVvisitedtime').removeAttr("style");
      }

      if ($('#closeddate').val() == "") {
        $('#closeddate').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Date');
        return false;
      } else {
        $('#closeddate').removeAttr("style");
      }

      if ($('#closedtime').val() == "") {
        $('#closedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Time');
        return false;
      } else {
        $('#closedtime').removeAttr("style");
      }

      // parameters & API Submissions for the property sitevisit update
      var visitedparam = {
        leadid: this.leadid,
        propid: propid,
        execid: this.userid,
        visitupdate: 1,
        remarks: $('#propertyremarks').val(),
        stage: "RSV",
        assignid: this.closedExecutiveId,
        feedbackid: this.feedbackId
      }
      // parameters & API Submissions for the property sitevisit update
      this._mandateService.addpropertyvisitupdate(visitedparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          var visiteddate = $('#RSVvisiteddate').val();
          var visitedtime = $('#RSVvisitedtime').val();
          // var rsvfinalremarks = $('#rsvfinalremarks').val();
          // var rsvfinalremarks = "RSV Done";
          var rsvfinalremarks = $('#propertyremarks').val();
          this.autoremarks = " Changed the status to Deal Closing Pending after Successfully completed the RSV";
          var leadrsvparam = {
            leadid: this.leadid,
            closedate: visiteddate,
            closetime: visitedtime,
            leadstage: "RSV",
            stagestatus: '3',
            textarearemarks: rsvfinalremarks,
            userid: this.userid,
            assignid: this.closedExecutiveId,
            autoremarks: this.autoremarks,
            property: propid,
            feedbackid: this.feedbackId
          }

          this._mandateService.addleadhistory(leadrsvparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              var closedate = $('#closeddate').val();
              var closetime = $('#closedtime').val();
              var textarearemarks = '';
              var dateformatchange = new Date(closedate).toDateString();

              this.autoremarks = " Send the Deal Closing Pending for " + propname + " On " + dateformatchange + " " + closetime;
              var leadhistparam = {
                leadid: this.leadid,
                closedate: closedate,
                closetime: closetime,
                leadstage: closeLeadStage,
                stagestatus: '0',
                textarearemarks: textarearemarks,
                userid: this.userid,
                assignid: this.closedExecutiveId,
                property: propid,
                bhk: '',
                bhkunit: '',
                dimension: '',
                ratepersft: '',
                autoremarks: this.autoremarks,
                feedbackid: this.feedbackId
              }
              this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
                this.status = success.status;
                if (this.status == "True") {
                  this.filterLoader = false;
                  swal({
                    title: 'Deal Closing Pending Updated Successfully',
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                  }).then(() => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  });
                } else if (this.status == "Duplicate Request") {
                  this.filterLoader = false;
                  swal({
                    title: 'Already got the request for this same Unit number',
                    type: "error",
                    timer: 2000,
                    showConfirmButton: false
                  });
                }
              }, (err) => {
                console.log("Failed to Update");
              });
            }
          }, (err) => {
            console.log("Failed to Update");
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
    // RSV DONE with Lead Closing

    // NEGOTIATION DONE with Lead Closing
    else if ($('#sectionselector').val() == "Final Negotiation") {

      let visitremarks = $('#propertyremarks').val().trim();
      if (visitremarks == "") {
        $('#propertyremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks about the Sitevisit');
        return false;
      } else {
        $('#propertyremarks').removeAttr("style");
      }

      if ($('#negovisiteddate').val() == "") {
        $('#negovisiteddate').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      } else {
        $('#negovisiteddate').removeAttr("style");
      }

      if ($('#negovisitedtime').val() == "") {
        $('#negovisitedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select One Date');
        return false;
      } else {
        $('#negovisitedtime').removeAttr("style");
      }

      if ($('#closeddate').val() == "") {
        $('#closeddate').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Date');
        return false;
      } else {
        $('#closeddate').removeAttr("style");
      }

      if ($('#closedtime').val() == "") {
        $('#closedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Time');
        return false;
      } else {
        $('#closedtime').removeAttr("style");
      }

      var visitedparamnego1 = {
        leadid: this.leadid,
        propid: propid,
        execid: this.userid,
        visitupdate: 1,
        remarks: $('#propertyremarks').val(),
        stage: "Final Negotiation",
        assignid: this.closedExecutiveId,
        feedbackid: this.feedbackId
      }

      this._mandateService.addpropertyvisitupdate(visitedparamnego1).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          var visiteddate = $('#negovisiteddate').val();
          var visitedtime = $('#negovisitedtime').val();
          var negofinalremarks = "Final Negotiation Done";
          this.autoremarks = " Changed the status to Deal Closing Pending after Successfully completed the Final Negotiation";
          var leadnegoparam = {
            leadid: this.leadid,
            closedate: visiteddate,
            closetime: visitedtime,
            leadstage: "Final Negotiation",
            stagestatus: '3',
            textarearemarks: negofinalremarks,
            userid: this.userid,
            assignid: this.closedExecutiveId,
            autoremarks: this.autoremarks,
            property: propid,
            feedbackid: this.feedbackId
          }

          this._mandateService.addleadhistory(leadnegoparam).subscribe((success) => {
            this.status = success.status;
            if (this.status == "True") {
              var closedate = $('#closeddate').val();
              var closetime = $('#closedtime').val();
              var textarearemarks = '';
              var dateformatchange = new Date(closedate).toDateString();

              this.autoremarks = " Send the Deal Closing Pending for " + propname + " On " + dateformatchange + " " + closetime;
              var leadhistparam = {
                leadid: this.leadid,
                closedate: closedate,
                closetime: closetime,
                leadstage: closeLeadStage,
                stagestatus: '0',
                textarearemarks: textarearemarks,
                userid: this.userid,
                assignid: this.closedExecutiveId,
                property: propid,
                bhk: '',
                bhkunit: '',
                dimension: '',
                ratepersft: '',
                autoremarks: this.autoremarks,
                feedbackid: this.feedbackId
              }
              this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
                this.status = success.status;
                if (this.status == "True") {
                  this.filterLoader = false;
                  swal({
                    title: 'Deal Closing Pending Updated Successfully',
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                  }).then(() => {
                    let currentUrl = this.router.url;
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate([currentUrl]);
                    });
                  });
                } else if (this.status == "Duplicate Request") {
                  this.filterLoader = false;
                  swal({
                    title: 'Already got the request for this same Unit number',
                    type: "error",
                    timer: 2000,
                    showConfirmButton: false
                  });
                }
              }, (err) => {
                console.log("Failed to Update");
              });
            }
          })
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
    // NEGOTIATION DONE with Lead Closing

    // Direct Lead Closing
    else {
      if ($('#closeddate').val() == "") {
        $('#closeddate').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Date');
        return false;
      }
      else {
        $('#closeddate').removeAttr("style");
      }
      if ($('#closedtime').val() == "") {
        $('#closedtime').focus().css("border-color", "red").attr('placeholder', 'Please Select closed Time');
        return false;
      }
      else {
        $('#closedtime').removeAttr("style");
      }


      var closedate = $('#closeddate').val();
      var closetime = $('#closedtime').val();
      var textarearemarks = '';
      this.autoremarks = " Send the Deal Closing Pending successfully.";
      var leadhistparam = {
        leadid: this.leadid,
        closedate: closedate,
        closetime: closetime,
        leadstage: closeLeadStage,
        stagestatus: '0',
        textarearemarks: textarearemarks,
        userid: this.userid,
        assignid: this.closedExecutiveId,
        property: propid,
        bhk: '',
        bhkunit: '',
        dimension: '',
        ratepersft: '',
        autoremarks: this.autoremarks,
        feedbackid: this.feedbackId
      }

      this._mandateService.addleadhistory(leadhistparam).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this.filterLoader = false;
          swal({
            title: 'Deal Closing Pending Updated Successfully',
            type: "success",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });
        } else if (this.status == "Duplicate Request") {
          this.filterLoader = false;
          swal({
            title: 'Already got the request for this same Unit number',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      });
    }
    // Direct Lead Closing
  }

  // getAllUnitList(bhk){
  //   console.log(bhk,this.selectedSuggestedProp.propid)
  //   this._sharedService.getUnitDetails(this.selectedSuggestedProp.propid,bhk).subscribe((resp)=>{
  //     console.log(resp);
  //     this.unitList = resp.data;
  //   })
  // }

  // unitChange(event){
  //   console.log('Selected Units:', event,this.selectedUnits);
  //   let dimensionData = this.selectedUnits.map((unit)=> unit.unit_sba);
  //   this.selectedUnitsDimension = dimensionData;
  //   this.selectedUnitsDimensionCommaSeperated = this.selectedUnitsDimension.join(',');
  //   console.log(this.selectedUnitsDimensionCommaSeperated);
  // }

}
