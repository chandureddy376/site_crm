import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mandateservice } from '../../../mandate.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-junkform',
  templateUrl: './mandate-junkform.component.html',
  styleUrls: ['./mandate-junkform.component.css']
})
export class MandateJunkformComponent implements OnInit {

  @Input() selectedExecId: any;
  @Input() selectedSuggestedProp: any;
  junkcategories: any;
  suggestchecked: any;
  junkcatognames: any;
  leadid = this.route.snapshot.params['id'];
  executeid: any;
  status: any;
  filterLoader: boolean = true;
  userid: any;
  autoremarks: any;
  selectedpropertylists: any;
  propertyid: any;
  junkExecutiveId: any;
  getselectedLeadExec: any;
  junkcategoryId: any;
  roleid: any;
  feedbackId: any
  copyOfJunkcategories: any;
  junk_reason: string = '';
  propertyCategory:any;

  constructor(private router: Router,
    private route: ActivatedRoute, private _mandateService: mandateservice) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.feedbackId = params['feedback'].split('?')[0];
    });
    this.userid = localStorage.getItem('UserId');
    this.roleid = localStorage.getItem('Role');

    if (this.userid == 1) {
      this.junkExecutiveId = this.selectedExecId;
    } else {
      this.junkExecutiveId = this.selectedExecId;
    }

    this._mandateService
      .getassignedrm(this.leadid, this.userid, this.selectedExecId, this.feedbackId)
      .subscribe(cust => {
        if (this.userid == 1) {
          this.junkExecutiveId = this.selectedExecId;
        } else {
          this.junkExecutiveId = this.selectedExecId;
        }

        let filteredInfo;
        filteredInfo = cust.RMname.filter((da) => da.executiveid == this.selectedExecId);
        this.getselectedLeadExec = filteredInfo[0];
        this.propertyid = filteredInfo[0]['suggestedprop'][0].propid;
        this.propertyCategory = filteredInfo[0]['suggestedprop'];
      })

    this._mandateService
      .getjunksections()
      .subscribe(junkcategos => {
        this.filterLoader = false;
        this.junkcategories = junkcategos['JunkCategories'];
        this.copyOfJunkcategories = junkcategos['JunkCategories'];
      });

  }

  selectsuggested(id, name) {
    this.junkcategoryId = id;
    var checkid = $("input[name='programming']:checked").map(function () {
      return this.value;
    }).get().join(',');
    // this.suggestchecked = checkid;
    this.junkcatognames = name;
  }

  junksuggestchecked:any;
  // selectedPropertyList(i,cat){
  //     if ($('#checkbox' + i).is(':checked')) {
  //     var checkid = $("input[name='programming']:checked").map(function () {
  //       return this.value;
  //     }).get().join(',');
  //     this.junksuggestchecked = checkid;
  //     console.log(checkid)
  //   } 
  // }

  junkmoving() {
    if (this.junkcategoryId == "" || this.junkcategoryId == undefined || this.junkcategoryId == null) {
      swal({
        title: 'Select any JUNK Reason',
        text: 'Select any Reason for the JUNK',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    }
    else { }

    let junkRemarks = $('#junkremarks').val().trim()
    if (junkRemarks == "") {
      $('#junkremarks').focus().css("border-color", "red").attr('placeholder', 'Please add some remarks for Move to Junk');
      return false;
    }
    else {
      $('#junkremarks').removeAttr("style");
    }

    if (this.getselectedLeadExec.suggestedprop.length > 1) {
      this.suggestchecked = this.selectedSuggestedProp.propid;
        // this.suggestchecked = this.junksuggestchecked;
    } else {
      this.suggestchecked = this.getselectedLeadExec.suggestedprop[0].propid;
    }

    this.filterLoader = true;
    var textarearemarks = $('#junkremarks').val();
    var userid = localStorage.getItem('UserId');

    this.autoremarks = " Moved the lead to Junk, Because of " + this.junkcatognames;
    var leadjunkparam = {
      leadid: this.leadid,
      closedate: "",
      closetime: "",
      leadstage: "Move to Junk",
      stagestatus: this.junkcategoryId,
      textarearemarks: textarearemarks,
      userid: userid,
      assignid: this.junkExecutiveId,
      autoremarks: this.autoremarks,
      property: this.suggestchecked,
      feedbackid: this.feedbackId
    }

    this._mandateService.addleadhistory(leadjunkparam).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {
        this.filterLoader = false;
        swal({
          title: 'Lead Moved Successfully',
          type: "success",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
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
    });
    // DIRECT JUNK FIXING
  }

  searchJunkCategory() {
    if (this.junk_reason) {
      this.junkcategories = this.copyOfJunkcategories.filter((junk) => {
        return junk.junk_categories.toLowerCase().includes(this.junk_reason.toLowerCase());
      });
    } else {
      this.junkcategories = this.copyOfJunkcategories;
    }
  }
}
