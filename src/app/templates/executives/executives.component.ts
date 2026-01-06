import { Component, OnInit } from '@angular/core';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { Executive, Executiveupdate } from './executive';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth-service';
import { Subscription } from 'rxjs';
import { a } from '@angular/core/src/render3';
import { title } from 'process';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-executives',
  templateUrl: './executives.component.html',
  styleUrls: ['./executives.component.css']
})
export class ExecutivesComponent implements OnInit {

  default_desig: boolean;
  select_desig: boolean;
  loadershow: boolean = true;
  btn_name: string = "Save";
  signupData = new Executive();
  wishers = new Executive();
  dobdate: string;
  exec_desig = [];
  edit_desig = [];
  exec_departments = [];
  status: any;
  modela = new Executiveupdate();
  editmodela = new Executiveupdate();
  myexecutives: any;
  id = this.route.snapshot.params['id'];
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  mandateprojects: any;
  selectedProperties: any;
  editSelectedProperties: any;
  selected_act_status: any;
  act_status: any;
  desginId: any;
  desginName: any;
  designationList: any;
  copyDesignationList: any;
  desginationFilter: boolean = false;
  actStatusFilter: boolean = false;
  searchTerm_designation: string = '';
  departmentFilter: boolean = false;
  departId: any = '';
  departName: any;
  teamParam: any;
  executiveParam: any;
  team_btn_name: string = 'Save';
  team_name: any;
  team_lead: any;
  team_target_property: any;
  team_mem_list: any[] = [];
  SelectedTeamGroup: any[] = [];
  mandateexecutives: any;
  teamList: any;
  teamNameList: any;
  updateTeam: any;
  copyPropertyList: any;
  propertyList: any;
  propname: any;
  propid: any;
  propertyFilter: boolean = false;
  searchTerm_property: string = '';
  teamLeadId: any;
  teamLeadName: any;
  teamLeadFilter: boolean = false;
  teamMembersIds: any;
  teamMembersName: any;
  teamMembersFilter: boolean = false;
  copyMandateExecutives: any;
  mandateExecutivesFilter: any;
  searchTerm_teamlead: string = '';
  searchTerm_teammember: string = '';
  suggestchecked: any;
  existingProperty: any;
  addPropertyList: any;

  constructor(
    private _sharedService: sharedservice,
    private _mandateService: mandateservice,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {
    if (localStorage.getItem('Role') != '1' && localStorage.getItem('Role') != '2') {
      this.router.navigateByUrl('/login');
    }
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 1000);
    this.default_desig = true;
    this.select_desig = false;
    this.loadershow = false;
  }

  ngOnInit() {
    this.btn_name = "Save";

    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });
    this.getExecData();
    this.getdeparts();
    this.getDesignationList();
    this.mandateprojectsfetch();
    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    }
  }

  ngAfterViewInit() {
    $('[data-toggle="popover"]').popover({
      trigger: 'manual',
      placement: 'right'
    });

    // toggle on click
    $(document).on('click', '.member-popover', function () {
      $('.member-popover').not(this).popover('hide'); // hide others
      $(this).popover('toggle');
    });

    // click outside to close
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.member-popover').length) {
        $('.member-popover').popover('hide');
      }
    });

    // toggle on click
    $(document).on('click', '.property-popover', function () {
      $('.property-popover').not(this).popover('hide'); // hide others
      $(this).popover('toggle');
    });

    // click outside to close
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.property-popover').length) {
        $('.property-popover').popover('hide');
      }
    });
  }

  getExecData() {
    this.route.queryParams.subscribe((resp) => {
      this.act_status = resp.status;
      this.desginId = resp.desId;
      this.desginName = resp.desName;
      this.departId = resp.deptId;
      this.departName = resp.deptName;
      this.executiveParam = resp.executive;
      this.teamParam = resp.team;

      if (this.departId != '' && this.departId != undefined && this.departId != null) {
        this.departmentFilter = true;
        this.getDesignationList();
      } else {
        this.departmentFilter = false;
      }

      if (this.desginId != '' && this.desginId != undefined && this.desginId != null) {
        this.desginationFilter = true;
      } else {
        this.desginationFilter = false;
      }

      if (this.act_status) {
        this.actStatusFilter = true;
        this.act_status = this.act_status;
      } else {
        this.actStatusFilter = false;
        this.act_status = '';
      }
      $('.member-popover').popover('hide');
      $('.property-popover').popover('hide');
      if (this.executiveParam == 1) {
        $('.add_class').removeClass('active');
        $('.executives_section').addClass('active');
        this.getexecutives();
      } else if (this.teamParam == 1) {
        $('.add_class').removeClass('active');
        $('.lead_section').addClass('active');
        this.getAllTeam();
        if (this.teamMembersIds == '' || this.teamMembersIds == undefined || this.teamMembersIds == null) {
          this.getExecutivesForFilter();
        }
      }

    })
  }

  getexecutives() {
    this.loadershow = true;
    this._sharedService.getexecutiveslist(this.act_status, this.desginId, this.departId, this.propid, '').subscribe(execute => {
      this.myexecutives = execute;
      this.loadershow = false;
    })
  }

  getDesignationList() {
    this._sharedService.getdesignations(this.departId ? this.departId : '').subscribe((success) => {
      this.designationList = success;
      this.copyDesignationList = success;
    });
  }

  getTeamNamesList() {
    this._sharedService.getTeamNames().subscribe({
      next: (resp) => {
        this.teamNameList = resp.TLnames;
        if (this.team_btn_name == 'Update') {
          setTimeout(() => {
            let team_name = this.teamNameList.filter((name) => name.TeamId == this.updateTeam.TeamId);
            this.team_name = team_name[0];
          }, 0)
        }
      }, error: (err) => {
        console.log('error', err);
      }
    })
  }

  getAllTeam() {
    let param = {
      propid: this.propid,
      teamlead: this.teamLeadId,
      teammember: this.teamMembersIds,
      status: this.act_status
    }

    this._sharedService.getTeamList(param).subscribe({
      next: (resp) => {
        this.teamList = resp.TLteam;
      }, error: (err) => {
        console.log('error', err);
      }
    })
  }

  getExecutivesForFilter() {
    this._mandateService.fetchmandateexecutuvesforreassign(this.propid, '', '', '', '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateExecutivesFilter = executives['mandateexecutives'];
        this.copyMandateExecutives = executives['mandateexecutives'];
      }
    });
  }

  mandateprojectsfetch() {
    this._mandateService.getmandateprojects().subscribe(mandates => {
      if (mandates['status'] == 'True') {
        this.mandateprojects = mandates['Properties'];
        this.propertyList = mandates['Properties'];
        this.copyPropertyList = mandates['Properties'];
        if (this.btn_name == 'Update') {
          if (this.editmodela.PropId) {
            let editprops = this.editmodela.PropId.split(',');
            let data = this.mandateprojects.filter((prop) => {
              return editprops.some((id) => {
                return prop.property_idfk == id;
              });
            });
            this.editSelectedProperties = data;
          }
        }

        if (this.team_btn_name == 'Update') {
          setTimeout(() => {
            if (this.updateTeam.PropId) {
              let team_target_property = this.mandateprojects.filter((prop) => prop.property_idfk == this.updateTeam.PropId);
              this.team_target_property = team_target_property[0];
            }
          }, 0)
          this.getTeamNamesList();
        }
      }
    });
  }

  selectsuggested(i, prop) {
    // if ($('#checkbox' + i).is(':checked')) {
    //   var checkid = $("input[name='programming']:checked").map(function () {
    //     return this.value;
    //   }).get().join(',');
    //   this.suggestchecked = checkid;
    // }
    prop.assigned = prop.assigned == 1 ? 0 : 1;

    this.suggestchecked = this.addPropertyList.filter(p => p.assigned == 1).map(p => p.property_idfk).join(',');

  }

  closeTeamModal() {
    this.team_name = '';
    this.team_target_property = '';
    this.team_lead = '';
    this.team_mem_list = [];
    this.SelectedTeamGroup = [];
  }

  addNewExecutive() {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 100);
    this.getdeparts();
    // this.getDesignationList();
    this.btn_name = "Save";
  }

  executivesOperation() {
    if (this.btn_name == "Save") {
      this.addExecutive();
    } else if (this.btn_name == "Update") {
      this.updateExecutive();
    }
  }

  getSelectedProperties(event) {
    if (this.selectedProperties && this.btn_name == 'Save') {
      let data = this.selectedProperties.map((data) => data.property_idfk);
      this.signupData.properties = data.join(',');
    } else if (this.btn_name == 'Update') {
      let data = this.editSelectedProperties.map((data) => data.property_idfk);
      this.editmodela.PropId = data.join(',');
    }
    else {
      this.signupData.properties = '';
      this.editmodela.PropId = '';
      this.editSelectedProperties = '';
      this.selectedProperties = '';
    }
  }

  clearExecutivesInfo() {
    this.signupData.name = '';
    this.signupData.mobilenum = '';
    this.signupData.dobdate = '';
    this.signupData.email = '';
    this.signupData.designation = '';
    this.getexecutives();
    this.getdeparts();
  }

  addExecutive() {
    if ($('#exec_name').val() == "") {
      $('#exec_name').focus().css("border-color", "red").attr('placeholder', 'Please Enter the Name');
      return false;
    }
    else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#exec_name').val())) {
        $('#exec_name').removeAttr("style");
      }
      else {
        $('#exec_name').focus().css("border-color", "red").attr('placeholder', 'Please enter valid name').val('');
        return false;
      }
    }

    if ($('#exec_mobile').val() == "") {
      $('#exec_mobile').focus().css("border-color", "red").attr('placeholder', 'Please Enter Phone Number');
      return false;
    }
    else {
      var mobileno = /^[0-9]{10}$/;
      if (mobileno.test($('#exec_mobile').val())) {
        $('#exec_mobile').removeAttr("style");
      }
      else {
        $('#exec_mobile').focus().css("border-color", "red").attr('placeholder', 'Please enter valid contact number').val('');
        return false;
      }
    }

    // if ($('#exec_date').val().trim() == "") {
    //   $('#exec_date').focus().css("border-color", "red").attr('placeholder', 'Please Enter DOB');
    //   return false;
    // }
    // else {
    //   $('#exec_date').removeAttr("style");
    // }

    if ($('#exec_email').val() == "") {
      $('#exec_email').focus().css("border-color", "red").attr('placeholder', 'Please Enter Email-id');
      return false;
    }
    else {
      var email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
      if (email.test($('#exec_email').val())) {
        $('#exec_email').removeAttr("style");
      }
      else {
        $('#exec_email').focus().css("border-color", "red").attr('placeholder', 'Please enter valid email-id').val('');
        return false;
      }
    }

    if ($('#exec_department').val() == null || $('#exec_department').val() == '' || $('#exec_department').val() == undefined) {
      $('.exec_department').focus().css("border-color", "red").attr('placeholder', 'Please select the department');
      return false;
    }
    else {
      $('.exec_department').removeAttr("style");
    }

    if ((this.signupData.properties == null || this.signupData.properties == '' || this.signupData.properties == undefined) && ($('#exec_department').val() && $('#exec_department').val() == '10001')) {
      swal({
        title: 'Select Properties',
        text: 'Please select the Properties',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
      return false
    }

    if ($('#exec_designation').val() == null || $('#exec_designation').val() == '' || $('#exec_designation').val() == undefined) {
      $('.exec_designation').focus().css("border-color", "red").attr('placeholder', 'Please select the designation');
      return false;
    }
    else {
      $('.exec_designation').removeAttr("style");
    }

    if ($('#exec_address').val().trim() == "") {
      $('#exec_address').focus().css("border-color", "red").attr('placeholder', 'Please Enter the address');
      return false;
    }
    else {
      $('#exec_address').removeAttr("style");
    }

    var param = this.signupData;
    var dob = '2001-01-01';
    this.loadershow = true;
    this._sharedService.addexecutive(param, dob).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {
        this.loadershow = false;
        swal({
          title: 'Executive Created Succesfully',
          type: 'success',
          confirmButtonText: 'OK'
        })
        $('.modal').click();
        this.signupData.name = '';
        this.signupData.mobilenum = '';
        this.signupData.dobdate = '';
        this.signupData.email = '';
        $('#exec_department').dropdown('clear');
        $('#exec_prop').dropdown('clear');
        $('#exec_designation').dropdown('clear');
        this.signupData.address = '';
        setTimeout(() => {
          $('.modal-backdrop').closest('div').remove();
          $('body').removeClass('modal-open');
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        }, 0)
      } else if (this.status == "Mobile") {
        this.loadershow = false;
        swal({
          title: 'Mobile Number Already Registered!',
          text: 'Please try again',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
      else {
        swal({
          title: 'Authentication Failed!',
          text: 'Please try agin',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    });
  }

  // UPDATE-FUNC-STARTS
  updateExecutive() {
    if ($('#executives_firstname').val().trim() == "") {
      $('#executives_firstname').focus().css("border-color", "red").attr('placeholder', 'Please Enter the Name');
      return false;
    } else {
      var nameFilter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (nameFilter.test($('#executives_firstname').val())) {
        $('#executives_firstname').removeAttr("style");
      }
      else {
        $('#executives_firstname').focus().css("border-color", "red").attr('placeholder', 'Please enter valid name').val('');
        return false;
      }
    }

    if ($('#executives_number').val() == "") {
      $('#executives_number').focus().css("border-color", "red").attr('placeholder', 'Please Enter Phone Number');
      return false;
    } else {
      var mobileno = /^[0-9]{10}$/;
      if (mobileno.test($('#executives_number').val())) {
        $('#executives_number').removeAttr("style");
      }
      else {
        $('#executives_number').focus().css("border-color", "red").attr('placeholder', 'Please enter valid contact number').val('');
        return false;
      }
    }

    // if ($('#executives_dob').val() == "") {
    //   $('#executives_dob').focus().css("border-color", "red").attr('placeholder', 'Please Enter DOB');
    //   return false;
    // }
    // else {
    //   $('#executives_dob').removeAttr("style");
    // }

    if ($('#executives_email').val() == "") {
      $('#executives_email').focus().css("border-color", "red").attr('placeholder', 'Please Enter Email-id');
      return false;
    } else {
      var email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
      if (email.test($('#executives_email').val())) {
        $('#executives_email').removeAttr("style");
      }
      else {
        $('#executives_email').focus().css("border-color", "red").attr('placeholder', 'Please enter valid email-id').val('');
        return false;
      }
    }

    if ($('#executive_department').val() == "" || $('#executive_department').val() == null || $('#executive_department').val() == undefined) {
      $('#executive_department').focus().css("border-color", "red").attr('placeholder', 'Please select the department');
      return false;
    } else {
      $('#executive_department').removeAttr("style");
    }

    if ((this.editSelectedProperties == null || this.editSelectedProperties == '' || this.editSelectedProperties == undefined || this.editSelectedProperties.length == 0) && ($('#executive_department').val() && $('#executive_department').val() == '10001')) {
      swal({
        title: 'Select Properties',
        text: 'Please select the Properties',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
      return false
    }

    if ($('#executive_designation').val() == "" || $('#executive_designation').val() == undefined || $('#executive_designation').val() == null) {
      $('#executive_designation').focus().css("border-color", "red").attr('placeholder', 'Please select the designation');
      return false;
    } else {
      $('#executive_designation').removeAttr("style");
    }

    if ($('#executive_address').val().trim() == "") {
      $('#executive_address').focus().css("border-color", "red").attr('placeholder', 'Please Enter the address');
      return false;
    } else {
      $('#executive_address').removeAttr("style");
    }


    var param = this.editmodela;
    var dob = '2001-01-01'
    this._sharedService.updatexecutives(param, dob, this.selected_act_status).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {
        swal({
          title: 'Updated Succesfully',
          type: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          $('#closeExecutiveForm').click();
          this.editmodela.executives_name = '';
          this.editmodela.executives_number = '';
          this.editmodela.executives_dob = '';
          this.editmodela.executives_email = '';
          $('#executive_department').dropdown('clear');
          $('#executive_designation').dropdown('clear');
          $('#executive_prop').dropdown('clear');
          this.editmodela.executive_address = '';
          setTimeout(() => {
            $('.modal-backdrop').closest('div').remove();
            $('body').removeClass('modal-open');
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
            });
          }, 0)
        })
      } else {
        swal({
          title: 'Authentication Failed!',
          text: 'Please try agin',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    });

  };

  //Team creation
  addTeam(type) {
    this.mandateprojectsfetch();
    this.team_btn_name = type;
  }

  // GET_DEPARTMENTS
  getdeparts() {
    this._sharedService.getdepartments().subscribe(departs => { this.exec_departments = departs; })
  }
  // GET_DEPARTMENTS

  // GET_DESIG_FOR_EDIT_MODAL
  changedepart(event) {
    const depid = event.target.value;
    this.editmodela.exec_dept_IDFK = depid;
    this.editmodela.exec_desig_IDFK = "";
    this._sharedService.getdesignations(depid).subscribe((success) => {
      this.edit_desig = success;
      this.default_desig = false;
      this.select_desig = true;
      this.exec_desig = success;
    }, (err) => {
      console.log("Connection Failed")
    });

    if (depid == '10001') {
      this.mandateprojectsfetch();
    }
  }

  changeprop(event) {
    const propid = event.target.value;
    this.editmodela.PropId = propid;
  }

  changedesgntns(event) {
    var desgid = event.target.value;
    this.editmodela.exec_desig_IDFK = desgid;
  }

  execStatus(stat) {
    this.act_status = stat;
    this.router.navigate([], {
      queryParams: {
        status: this.act_status
      },
      queryParamsHandling: 'merge'
    })
  }

  activeStatuschange(event) {
    this.selected_act_status = event.target.value;
  }

  // GET_DESIGNATIONS_BASED_ON_DEPARTMENTS
  getdesgntns(event) {
    const departid = event.target.value;
    this._sharedService.getdesignations(departid).subscribe((success) => {
      this.exec_desig = success;
    }, (err) => {
      console.log("Connection Failed")
    });

    if (departid == '10001') {
      this.mandateprojectsfetch();
    }
  }
  // GET_DESIGNATIONS_BASED_ON_DEPARTMENTS

  // ADD_PERFORMER_DETAILS
  addperformers() {
    if ($('#perfrm_name').val().trim() == "") {
      $('#perfrm_name').focus().css("border-color", "red").attr('placeholder', 'Please Enter Performer Name');
      return false;
    }
    else {
      $('#perfrm_name').removeAttr("style");
    }
    if ($('#perfrm_bday').val().trim() == "") {
      $('#perfrm_bday').focus().css("border-color", "red").attr('placeholder', 'Please Enter Birthday Person Name');
      return false;
    }
    else {
      $('#perfrm_bday').removeAttr("style");
    }

    this._sharedService.wisherupdate(this.wishers.performer, this.wishers.birthday).subscribe((success) => {
      this.status = success.status;
      if (this.status == "True") {
        swal({
          title: 'Added Succesfully',
          type: 'success',
          confirmButtonText: 'OK'
        })
        $('#cancel_btn').click();
      } else {
        swal({
          title: 'Authentication Failed!',
          text: 'Please try agin',
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }, (err) => {
      console.log("Connection Failed")
    });
  }
  // ADD_PERFORMER_DETAILS

  teamOperation() {
    if (this.team_btn_name == 'Save') {
      this.addTeamData();
    } else if (this.team_btn_name == 'Update') {
      this.updateTeamData();
    }
  }

  addTeamData() {
    let TeamLead = this.SelectedTeamGroup.filter((team) => {
      return team.type == 'lead';
    });

    let TeamMembers = this.SelectedTeamGroup.filter((team) => {
      return team.type == 'member';
    });

    if (this.team_target_property == null || this.team_target_property == '' || this.team_target_property == undefined) {
      swal({
        title: 'Select Property',
        text: 'Please select the Property',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
      return false
    }

    if (this.team_name == null || this.team_name == '' || this.team_name == undefined) {
      swal({
        title: 'Select Team Name',
        text: 'Please select the Team Title',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
      return false
    }

    if (TeamLead == null || TeamLead == undefined || TeamLead.length == 0) {
      swal({
        title: 'Select Team Lead',
        text: 'Please select the Team Lead',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
      return false
    }

    if (TeamMembers == null || TeamMembers == undefined || TeamMembers.length == 0) {
      swal({
        title: 'Select Team Members',
        text: 'Please select the Team Members',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
      return false
    }
    this.loadershow = true;
    let teamMembersID = TeamMembers.map((exec) => exec.id.id);
    // let teamMembersRoleIds = TeamMembers.map((exec) => exec.id.roleid);
    // let joinLeadMembersIds = teamMembersRoleIds.join(',') +','+TeamLead[0].id.roleid;

    let param = {
      teamName: this.team_name.TeamId,
      property_id: this.team_target_property.property_idfk,
      teamLead: TeamLead[0].id.id,
      teamMembers: teamMembersID.join(','),
      roleid: TeamLead[0].id.roleid
    }

    this._sharedService.addteamlead(param).subscribe({
      next: (resp) => {
        this.loadershow = false;
        swal({
          title: 'Team Created Succesfully',
          type: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          setTimeout(() => {
            this.team_name = '';
            this.team_target_property = '';
            this.team_lead = '';
            this.team_mem_list = [];
            this.SelectedTeamGroup = [];
            $('.modal-backdrop').closest('div').remove();
            $('body').removeClass('modal-open');
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
            });
          }, 0)
        })
      }, error: (err) => {
        this.loadershow = false;
        console.log('error', err);
      }
    })
  }

  updateTeamData() {
    let TeamLead = this.SelectedTeamGroup.filter((team) => {
      return team.type == 'lead';
    });

    let TeamMembers = this.SelectedTeamGroup.filter((team) => {
      return team.type == 'member';
    });

    if (this.team_target_property == null || this.team_target_property == '' || this.team_target_property == undefined) {
      swal({
        title: 'Select Property',
        text: 'Please select the Property',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
      return false
    }

    if (this.team_name == null || this.team_name == '' || this.team_name == undefined) {
      swal({
        title: 'Select Team Name',
        text: 'Please select the Team Title',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
      return false
    }

    if (TeamLead == null || TeamLead == undefined || TeamLead.length == 0) {
      swal({
        title: 'Select Team Lead',
        text: 'Please select the Team Lead',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
      return false
    }

    if (TeamMembers == null || TeamMembers == undefined || TeamMembers.length == 0) {
      swal({
        title: 'Select Team Members',
        text: 'Please select the Team Members',
        type: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
      return false
    }
    this.loadershow = true;
    let teamMembersID = TeamMembers.map((exec) => exec.id.id);
    // let teamMembersRoleIds = TeamMembers.map((exec) => exec.id.roleid);
    // let joinLeadMembersIds = teamMembersRoleIds.join(',') +','+TeamLead[0].id.roleid;

    let param = {
      teamName: this.team_name.TeamId,
      property_id: this.team_target_property.property_idfk,
      teamLead: TeamLead[0].id.id,
      teamMembers: teamMembersID.join(','),
      roleid: TeamLead[0].id.roleid
    }
    this._sharedService.updateTeam(param).subscribe({
      next: (resp) => {
        this.loadershow = false;
        swal({
          title: 'Team Updated Succesfully',
          type: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          setTimeout(() => {
            this.team_name = '';
            this.team_target_property = '';
            this.team_lead = '';
            this.team_mem_list = [];
            this.SelectedTeamGroup = [];
            $('.modal-backdrop').closest('div').remove();
            $('body').removeClass('modal-open');
            let currentUrl = this.router.url;
            let pathWithoutQueryParams = currentUrl.split('?')[0];
            let currentQueryparams = this.route.snapshot.queryParams;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
            });
          }, 0)
        })
      }, error: (err) => {
        this.loadershow = false;
        console.log('error', err);
      }
    })
  }

  getexecutiveupdate(id) {
    this.btn_name = "Update";
    this.default_desig = true;
    this.select_desig = false;
    this._sharedService.getexecuitiveview(id).subscribe(test => {
      this.modela = test[0];
      let deptid;
      setTimeout(() => {
        this.editmodela = test[0];
        deptid = this.editmodela.exec_dept_IDFK;
      }, 100)
      if (test[0].active_status) {
        // if (test[0].active_status == 'Active') {
        this.selected_act_status = test[0].active_status;
        // } else if (test[0].status == 'Inactive') {
        //   this.selected_act_status = 1;
        // }
      }
      if (test[0].exec_dept_IDFK == '10001') {
        this.mandateprojectsfetch();
      }
      this._sharedService.getdesignations(test[0].exec_dept_IDFK).subscribe((success) => {
        this.edit_desig = success;
      }, (err) => {
        console.log("Connection Failed")
      });
    })

  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
    $('.modal').remove();
  }

  filterproperty() {
    if (this.searchTerm_property) {
      this.propertyList = this.copyPropertyList.filter((des) => {
        return des.property_info_name.toLowerCase().includes(this.searchTerm_property.toLowerCase());
      })
    } else {
      this.propertyList = this.copyPropertyList;
    }
  }

  onCheckboxChangeProperty(prop) {
    this.propid = prop.property_idfk;
    this.propname = prop.property_info_name;
    this.propertyFilter = true;

    if (this.teamParam == 1) {
      this.getExecutivesForFilter();
    }

    this.router.navigate([], {
      queryParams: {
        propid: prop.property_idfk,
        propname: prop.property_info_name,
      },
      queryParamsHandling: 'merge',
    });
  }

  onCheckboxChangeMultiProperty() {
    var checkid = $("input[name='propertyFilter']:checked").map(function () {
      return this.value;
    }).get().join(',');
    let filteredPropIds;
    filteredPropIds = checkid.split(',');

    let filteredPropName;
    filteredPropName = this.copyPropertyList.filter((da) => filteredPropIds.some((prop) => {
      return prop == da.property_idfk
    }));
    filteredPropName = filteredPropName.map((name) => name.property_info_name);
    if (filteredPropName != '' || filteredPropName != undefined) {
      this.propertyFilter = true;
      this.propid = filteredPropIds;
      this.propname = filteredPropName;
      this.router.navigate([], {
        queryParams: {
          propid: this.propid,
          propname: this.propname
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.propertyFilter = false;
      this.propid = '';
      this.propname = '';
    }
  }

  onCheckboxChangeDepartment(dept) {
    this.departId = dept.id;
    this.departName = dept.departs;
    this.departmentFilter = true;

    this.router.navigate([], {
      queryParams: {
        deptId: dept.id,
        deptName: dept.departs,
      },
      queryParamsHandling: 'merge',
    });
  }

  filterDesignation() {
    if (this.searchTerm_designation) {
      this.designationList = this.copyDesignationList.filter((des) => {
        return des.designation.toLowerCase().includes(this.searchTerm_designation.toLowerCase());
      })
    } else {
      this.designationList = this.copyDesignationList;
    }
  }

  onCheckboxChangeDesignation(des) {
    this.desginId = des.role_id;
    this.desginName = des.role;
    this.desginationFilter = true;

    this.router.navigate([], {
      queryParams: {
        desName: des.role,
        desId: des.role_id,
      },
      queryParamsHandling: 'merge',
    });
  }

  filterTeamLead() {
    if (this.searchTerm_teamlead) {
      this.mandateExecutivesFilter = this.copyMandateExecutives.filter((exec) => {
        return exec.name.toLowerCase().includes(this.searchTerm_teamlead.toLocaleLowerCase());
      })
    } else {
      this.mandateExecutivesFilter = this.copyMandateExecutives;
    }
  }

  filterTeamMembers() {
    if (this.searchTerm_teammember) {
      this.mandateExecutivesFilter = this.copyMandateExecutives.filter((exec) => {
        return exec.name.toLowerCase().includes(this.searchTerm_teammember.toLocaleLowerCase());
      })
    } else {
      this.mandateExecutivesFilter = this.copyMandateExecutives;
    }
  }

  onCheckboxExecutiveChange(type, exec) {
    if (type == 'teamlead') {
      this.teamLeadFilter = true;
      this.teamLeadId = exec.id;
      this.teamLeadName = exec.name;

      this.router.navigate([], {
        queryParams: {
          teamleadid: this.teamLeadId,
          teamleadname: this.teamLeadName,
        },
        queryParamsHandling: 'merge',
      });
    } else {
      var checkid = $("input[name='executiveFilter']:checked").map(function () {
        return this.value;
      }).get().join(',');
      let filteredExexIds;
      filteredExexIds = checkid.split(',');

      let filteredExecName;
      filteredExecName = this.copyMandateExecutives.filter((da) => filteredExexIds.some((prop) => {
        return prop == da.id
      }));
      filteredExecName = filteredExecName.map((name) => name.name);

      if (filteredExecName != '' || filteredExecName != undefined) {
        this.teamMembersFilter = true;
        this.teamMembersIds = filteredExexIds;
        this.teamMembersName = filteredExecName;
        this.router.navigate([], {
          queryParams: {
            teammemid: this.teamMembersIds,
            teammemname: this.teamMembersName
          },
          queryParamsHandling: 'merge',
        });
      } else {
        this.teamMembersFilter = false;
        this.teamMembersIds = '';
        this.teamMembersName = '';
      }
    }
  }

  statusClose() {
    this.actStatusFilter = false;
    this.act_status = "";
    this.router.navigate([], {
      queryParams: {
        status: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  departClose() {
    this.departmentFilter = false;
    this.departId = "";
    this.departName = "";
    this.router.navigate([], {
      queryParams: {
        deptName: '',
        deptId: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  designationClose() {
    this.desginationFilter = false;
    this.desginId = "";
    this.desginName = "";
    this.router.navigate([], {
      queryParams: {
        desName: '',
        desId: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  propertyClose() {
    this.propertyFilter = false;
    this.propname = "";
    this.propid = "";
    this.router.navigate([], {
      queryParams: {
        propid: '',
        propname: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  teamLeadClose() {
    this.teamLeadFilter = false;
    this.teamLeadId = "";
    this.teamLeadName = "";
    this.router.navigate([], {
      queryParams: {
        teamleadid: '',
        teamleadname: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  teamMembersClose() {
    this.teamMembersFilter = false;
    this.teamMembersIds = "";
    this.teamMembersName = "";
    this.router.navigate([], {
      queryParams: {
        teammemid: '',
        teammemname: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  refresh() {
    this.departmentFilter = false;
    this.desginationFilter = false;
    this.actStatusFilter = false;
    this.propertyFilter = false;
    this.teamMembersFilter = false;
    this.teamLeadFilter = false;
    this.teamLeadId = "";
    this.teamLeadName = "";
    this.teamMembersIds = "";
    this.teamMembersName = "";
    this.departId = '';
    this.departName = '';
    this.act_status = '';
    this.desginId = '';
    this.desginName = '';
    this.propid = '';
    this.propname = '';
    if (this.executiveParam == 1) {
      this.router.navigate([], {
        queryParams: {
          executive: 1
        }
      })
    } else if (this.teamParam == 1) {
      this.router.navigate([], {
        queryParams: {
          team: 1
        }
      })
    }
  }

  getSelectedTeamProperty(event) {
    this.team_lead = '';
    this.team_mem_list = [];
    this.SelectedTeamGroup = [];
    setTimeout(() => {
      this.team_name = '';
    }, 1500)
    this.getTeamNamesList();
    this._mandateService.fetchmandateexecutuves(event.value.property_idfk, '', '', '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];
      }
    });
  }

  getSelectedTeamName(event) { }

  getTeamLead(event) {
    this.SelectedTeamGroup = this.SelectedTeamGroup.filter(x => x.type !== 'lead');
    this.SelectedTeamGroup.unshift({
      id: this.team_lead,
      type: 'lead'
    });
  }

  getSelectedTeamMembers(event) {
    this.SelectedTeamGroup = this.SelectedTeamGroup.filter(x => x.type !== 'member');
    // Add new selected members
    this.team_mem_list.forEach(id => {
      this.SelectedTeamGroup.push({
        id: id,
        type: 'member'
      });
    });
  }

  removeExec(exec) {
    this.SelectedTeamGroup = this.SelectedTeamGroup.filter((team) => {
      return team.id.id != exec.id
    })

    this.SelectedTeamGroup.forEach((team) => {
      if (team.type != 'lead') {
        this.team_lead = '';
      }
    })

    this.team_mem_list = this.team_mem_list.filter(exec => {
      return this.SelectedTeamGroup.some(team => team.id.id === exec.id);
    });
  }

  getTeamupdate(exec, type) {
    this.mandateprojectsfetch();
    this.updateTeam = exec;
    this.team_btn_name = type;
    this.SelectedTeamGroup = [];

    this._mandateService.fetchmandateexecutuves(this.updateTeam.PropId, '', '', '').subscribe(executives => {
      if (executives['status'] == 'True') {
        this.mandateexecutives = executives['mandateexecutives'];

        setTimeout(() => {
          let executives = this.mandateexecutives.filter((exec) => {
            return exec.id == this.updateTeam.TeamLeadId
          })
          this.SelectedTeamGroup.push({
            id: executives[0],
            type: 'lead'
          });
          this.team_lead = executives[0];

          let teamMembers = this.updateTeam.assignedmembers.map((exec) => exec.TeamMeetId);
          let teammem = this.mandateexecutives.filter(exec => {
            return teamMembers.some(id => id === exec.id);
          });
          this.team_mem_list = teammem;
          teammem.forEach(id => {
            this.SelectedTeamGroup.push({
              id: id,
              type: 'member'
            });
          });
        }, 0)

      }
    })
  }

  getMembers(list) {
    return list.map(m => m.TeamMeetName).join('<br>');
  }

  getProperties(list) {
    return list.map(m => m.property_name).join('<br>');
  }

  addProperty(prop) {
    this.existingProperty = prop;
    if (prop.assignedprop != undefined && prop.assignedprop != null && prop.assignedprop != '') {
      const assignedProp = prop.assignedprop.map(a => a.property_idfk);

      this.addPropertyList = this.mandateprojects.map(p => ({
        ...p,
        assigned: assignedProp.includes(p.property_idfk) ? 1 : 0
      }));
    } else {
      this.addPropertyList = this.mandateprojects.map(p => ({
        ...p,
        assigned: 0
      }));
    }
  }

  addNewProperties() {
    if (!this.suggestchecked) {
      swal({
        title: 'Property Selection',
        text: 'Select Atleast one Property',
        type: 'warning',
        timer: 3000
      })
      return false;
    }
    let param = {
      propid: this.suggestchecked,
      execid: this.existingProperty.ID
    }

    this._sharedService.updateexecproperty(param).subscribe((resp: any) => {
      if (resp['status'] == 'True') {
        swal({
          title: 'Properties Updated Successfully',
          type: 'success',
          timer: 3000
        });
        this.getexecutives();
        $('#closePropertyForm').click();
      } else {
        swal({
          title: 'Properties updation Failed',
          type: 'error',
          timer: 3000
        })
      }
    }
      //   {
      //   next:(resp)=>{
      //      swal({
      //       title:'Properties Updated Successfully',
      //       type:'success',
      //       timer:3000
      //     })
      //   },error:(err)=>{
      //     console.log('error',err);
      //     swal({
      //       title:'Properties updation Failed',
      //       type:'error',
      //       timer:3000
      //     })
      //   }
      // }
    )
  }

  clearTeamInfo() {
    this.team_lead = '';
    this.team_mem_list = [];
    this.SelectedTeamGroup = [];
    this.team_name = '';
    this.team_target_property = '';
    this.team_btn_name = 'Save';
  }

  // UPDATE-FUNC-ENDS

  // DELETE-FUNC
  // deleteEmp(id) {
  //   swal({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.value) {
  //       const formData = new FormData();
  //       formData.append("Id", id);
  //       this._sharedService.deletExecutive(id).subscribe(
  //         (response) => {
  //         }
  //       )
  //       swal({
  //         title: "Executive deleted Successfully!",
  //         type: "success",
  //         showConfirmButton: false,
  //         timer: 1500
  //       })
  //     } else {
  //       swal("Executive Details is safe!");
  //     }
  //   });
  // }
  // DELETE-FUNC

}
