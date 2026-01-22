import { Component, OnInit } from '@angular/core';
import { sharedservice } from '../../shared.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.css']
})
export class ClientRegistrationComponent implements OnInit {

  constructor(private _sharedservice:sharedservice) { }

  clientName:any;
  clientNumber:any;
  clientMail:any;
  clientremarks:any;
  builderpropertylists:any;
  employeesList:any;
  propertiesList:any;
  selectedbuilder:any;
  selectedProperty:any;
  buidersMails:any;
  selectedBuilderMail:any;
  selectedCcMail:any;
  selectedbuilderCCmails:any;
  executivesList:any;
  selectedExecutive:any;
  rmMail:any;

  ngOnInit() {
    this.getbuildersList();
    this.getEmployeesList();
  }

  //here we get the list of builders
  getbuildersList(){
    this._sharedservice.getBangalorebuilders().subscribe((builders)=>{
      console.log(builders);
      this.builderpropertylists = builders['details']
    })
  }

  //here we get the selected builder
  builderschange(event){
    console.log(event.target.value);
    this.selectedbuilder = event.target.value;
    this.getProperties(event.target.value);
    if(this.selectedbuilder != '2'){
      this.getBuilderMails(event.target.value)
    }

    if(this.selectedbuilder == '203'){
        $('.propertyClassDrop').removeClass('multiple');
        console.log('entered')
    }else{
      $('.propertyClassDrop').removeClass('multiple');
    }
  }

  //here we get the list employees
  getEmployeesList(){
    this._sharedservice.getemployeesList().subscribe((employees)=>{
      console.log(employees);
      this.employeesList = employees['details'];
    })
  }

  //here we get the list of properties based on selected builders
  getProperties(id){
    this._sharedservice.getPropertiesList(id).subscribe((properties)=>{
      console.log(properties);
      this.propertiesList = properties['Builderid'];
    })
  }

  //here we get the builders mail based on the builder selection
  getBuilderMails(id){
    this._sharedservice.getBuilderMails(id).subscribe((mails)=>{
      console.log(mails);
      this.buidersMails = mails['Buildermail'];
      console.log(this.buidersMails)
    })
  }

  //here we get the selected property
  propchange(event){
    console.log(event.value);
    this.selectedProperty = event.value.map((prop)=>prop.property_info_IDPK);
  }

  buildermailchange(event){
    console.log(event.target.value);
  }

  //here we get the selected series for sobha project
  serieschange(event){
    console.log(event.target.value);
    // if(this.selectedbuilder == '2'){
    //   this.getBuilderMails(event.target.value)
    // }
  }

  //here we get the selected RM name
  rmchange(event){
    this.selectedExecutive = event.target.value;
    console.log(this.selectedExecutive);
  }
  
  //here we get the selected to mail
  selectmail(event){
    console.log(event.target.value);
    this.selectedBuilderMail = event.target.value;
  }

    //here we get the selected CC mail
    selectCCmail(event){
      console.log(event.value,event,this.selectedbuilderCCmails);
      this.selectedCcMail = this.selectedbuilderCCmails.map((mail)=> mail.builder_mail)
      console.log(this.selectedCcMail.join(','))
    }

    //here we get the selected rm mail
    rmMailchange(event){

    }

  //Registraion of client
  addClient(){

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

    if (this.selectedbuilder == "" || this.selectedbuilder == undefined) {
      swal({
        title: 'Please Select Some Builder!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    }
    else {
    }
  
    if (this.selectedProperty == "" || this.selectedProperty == undefined) {
      swal({
        title: 'Please Select Some Properties!',
        text: 'Please try again',
        type: 'error',
        confirmButtonText: 'OK'
      })
      return false;
    }
    else {
    }
  

    var param = {
      client:$('#custname').val(),
      clientnum:$('#custnum').val(),
      clientmail:$('#custmail').val(),
      // sitevisitdate:$scope.datemodel,
      rmname:this.selectedExecutive,
      rmmail:'',
      builder:this.selectedbuilder,
      property:this.selectedProperty.join(','),
      sendmail:this.selectedBuilderMail,
      sendnote:$('#remarks').val(),
      ccmail:this.selectedCcMail.join(','),
    };

    this._sharedservice.addClient(param).subscribe((response)=>{
      console.log(response);
      if(response.status == '1'){
        swal({
          title: "Mail Sent Successfully!",
          text: '30 Days before This Data registered with this property, so Re-registered Successfully',
          icon: "success"
        }).then(function() {
          this.clientName = '';
          this.clientNumber = '';
          this.clientMail = '';
          $('#builder_dropdown').dropdown('clear');
          $('#series_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          $('#mail_dropdown').dropdown('clear');
          $('#mail2_dropdown').dropdown('clear');
          this.clientremarks = '';
        });
      }else if(response.status == '0'){
        swal({
          title: "Mail Sent Successfully!",
          text: 'Registered Successfully',
          icon: "success"
        }).then(function() {
          this.clientName = '';
          this.clientNumber = '';
          this.clientMail = '';
          $('#builder_dropdown').dropdown('clear');
          $('#series_dropdown').dropdown('clear');
          $('#property_dropdown').dropdown('clear');
          $('#mail_dropdown').dropdown('clear');
          $('#mail2_dropdown').dropdown('clear');
          this.clientremarks = '';
        });
      }else{
        swal({
          title: 'Already Registered Data!',
          text: 'This Data is already registered with this project. Please try after 30 days.',
          type: 'error',
          showConfirmButton: true,
          })
      }
    })

  }
  
}
