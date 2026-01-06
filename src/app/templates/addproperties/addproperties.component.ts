import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { sharedservice } from '../../shared.service';
import { mandateservice } from '../../mandate.service';
import { Subscription } from 'rxjs';
declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-addproperties',
  templateUrl: './addproperties.component.html',
  styleUrls: ['./addproperties.component.css']
})
export class AddpropertiesComponent implements OnInit {

  builders: any;
  properties: any;
  selectedproperties: any;
  builderid: any;
  status: any;
  addedpropertylists: any;
  dataType: string;
  addType: any;
  filterLoader: boolean = true;
  requestslists: any;
  cplists: any;
  responsedate: any;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;

  constructor(private router: Router,
    private route: ActivatedRoute, private _location: Location, private _sharedService: sharedservice, private _mandateservice: mandateservice) {
    if (localStorage.getItem('Role') != '1' && localStorage.getItem('UserId') != '40007' && localStorage.getItem('Role') != '2') {
      this.router.navigateByUrl('/login');
    }
    this.route.queryParams.subscribe((res) => {
      this.dataType = res['type'];
      if (this.dataType == "property") {
        this.addType = "Add Property";
        this.getAllBuilders();
        this.getAllProperties();
        $('.active_content_main').css("margin-top", "10px")
      } else if (this.dataType == 'cp') {
        this.addType = "Add CP";
        $('.active_content_main').css("margin-top", "10px")
        this.getCpData();
      } else if (this.dataType == 'builders') {
        setTimeout(() => {
          $('.active_content_main').css("margin-top", "10px")
        }, 0)
        this.getMandateBuilders();
      }
    })
  }


  userid: any
  username: any
  adminview: boolean = false;
  ngOnInit() {
    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
      this.filterLoader = false;
    });

    this.userid = localStorage.getItem('UserId');
    this.username = localStorage.getItem('Name');
    if (localStorage.getItem('Role') == null) {
      this.router.navigateByUrl('/login');
    } else if (localStorage.getItem('Role') == '1' || localStorage.getItem('UserId') == '40007' || localStorage.getItem('Role') == '2') {
      this.adminview = true;
    } else if (localStorage.getItem('Role') == '50002' && localStorage.getItem('UserId') != '40007') {
      this.adminview = false;
    }
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
  }

  getAllBuilders() {
    this._sharedService
      .builderlist()
      .subscribe(builderlist => {
        this.builders = builderlist;
      });
  }

  selectedBuilders: any;
  builderchange(event) {
    this.builderid = this.selectedBuilders;
    this.selectedProperties = [];
    if (this.selectedBuilders != null || this.selectedBuilders != undefined) {
      this._sharedService
        .getpropertiesbybuilder(this.builderid)
        .subscribe(propertylist => {
          this.properties = propertylist['Properties'];
        });
    }
  }

  selectedProperties: any[] = [];
  selectedPropertiesIds: number[] = []
  propertychange(event) {
    if (this.selectedProperties.length > 5) {
      this.selectedProperties.pop();
    }
    this.selectedProperties.forEach((data) => {
      this.selectedPropertiesIds.push(data.id)
    });
    this.selectedPropertiesIds = Array.from(new Set(this.selectedPropertiesIds));
  }

  getAllProperties() {
    $(".other_section").removeClass("active");
    $(".properties_section").addClass("active");
    this._sharedService
      .propertylistnew()
      .subscribe(proplist => {
        this.addedpropertylists = proplist;
        this.filterLoader = false;
      });
  }

  getMandateBuilders() {
    $(".other_section").removeClass("active");
    $(".builders_section").addClass("active");
    this._mandateservice
      .mandaterequestlists()
      .subscribe(proplist => {
        this.requestslists = proplist;
        this.filterLoader = false;
      });
  }

  getCpData() {
    $(".other_section").removeClass("active");
    $(".channel_section").addClass("active");
    this._mandateservice
      .cplists()
      .subscribe(proplist => {
        this.cplists = proplist;
        this.filterLoader = false;
      });
  }

  addproperties() {
    let comma_separated_data = this.selectedPropertiesIds.join(', ')
    if (this.dataType == "property" && this.addType == 'Add Property') {
      if (this.selectedPropertiesIds.length == 0) {
        swal({
          title: 'Select Some Properties',
          type: 'error',
          confirmButtonText: 'OK'
        })
        return false;
      }

      var param = {
        builderid: this.builderid,
        properties: comma_separated_data,
      }
      this.filterLoader = true;
      this._sharedService.addproperties(param).subscribe((success) => {
        this.status = success.status;
        if (this.status == "True") {
          this.filterLoader = false;
          swal({
            title: 'Successfully Addedd',
            type: "success",
            confirmButtonText: 'OK!',
          }).then((result) => {
            if (result.value) {
              // location.reload();
              // $('.modal-backdrop').closest('div').remove();
              $('.close').click();
              setTimeout(() => {
                let currentUrl = this.router.url;
                let pathWithoutQueryParams = currentUrl.split('?')[0];
                let currentQueryparams = this.route.snapshot.queryParams;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
                });
              })
            }
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
  }

  addnewcp() {
    if (this.dataType == "cp" && this.addType == 'Add CP') {
      if ($('#custname').val().trim() == "") {
        $('#custname').focus().css("border-color", "red").attr('placeholder', 'Please Enter Name');
        return false;
      }
      else {
        $('#custname').removeAttr("style");
      }
      if ($('#contactperson').val().trim() == "") {
        $('#contactperson').focus().css("border-color", "red").attr('placeholder', 'Please Enter Person Name');
        return false;
      }
      else {
        $('#contactperson').removeAttr("style");
      }

      if ($('#custnum').val().trim() == "") {
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
      if ($('#custmail').val().trim() == "") {
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
      //        if($('#gstno').val().trim() =="")
      //      {
      //          $('#gstno').focus().css("border-color","red").attr('placeholder','Please Enter GST');
      //          return false;
      //      }
      // else{
      //       $('#gstno').removeAttr("style"); 
      //       }
      if ($('#rerano').val().trim() == "") {
        $('#rerano').focus().css("border-color", "red").attr('placeholder', 'Please Enter Rera');
        return false;
      }
      else {
        $('#rerano').removeAttr("style");
      }

      var param = {
        cpname: $('#custname').val(),
        person: $('#contactperson').val(),
        cpnumber: $('#custnum').val(),
        cpmail: $('#custmail').val(),
        cpsecondmail: $('#custmailsecondary').val(),
        addeduser: localStorage.getItem('Name'),
        rera: $('#rerano').val(),
        gst: $('#gstno').val(),
      }
      this.filterLoader = true;
      this._mandateservice.addcp(param).subscribe((success) => {
        this.status = success.status;
        this.responsedate = success['cpadd'];
        if (this.status == "True") {
          this.filterLoader = false;
          swal({
            title: 'Successfully Addedd',
            type: "success",
            confirmButtonText: 'OK!',
          }).then((result) => {
            if (result.value) {
              $('.close').click();
              setTimeout(() => {
                let currentUrl = this.router.url;
                let pathWithoutQueryParams = currentUrl.split('?')[0];
                let currentQueryparams = this.route.snapshot.queryParams;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
                });
              })
            }
          });
          this.ngOnInit();
        } else {
          swal({
            title: 'CP Not Added',
            text: 'Given Number or Mail id is already registered with ' + this.responsedate[0].CP_NAME,
            type: "error",
            confirmButtonText: 'OK!',
          }).then((result) => {
            if (result.value) {
            }
          });
        }
      }, (err) => {
        console.log("Failed to Update");
      })
    }
  }

}
