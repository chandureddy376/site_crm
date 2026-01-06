import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from "@angular/http";
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { _throw } from 'rxjs/observable/throw';
import { debounceTime, map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable()

export class sharedservice implements OnInit {
    sharedcontroller: any;
    clientAPI: any;
    versionURL: any;
    chatProcessAPI: any;
    laravelAPI: any;
    private unReadTrigger$ = new Subject<void>();
    private unReadWhatsapp$ = new Subject<void>();
    unReadChatCount: any;
    unReadWhatsappChatCount: any;

    constructor(private _http: Http, private http: Http, private router: Router) {
        this.sharedcontroller = 'https://superadmin-azure.right2shout.in/admincrm_test';
        this.clientAPI = 'https://superadmin.homes247.in/cpclientreg';
        this.chatProcessAPI = 'https://test-chat.right2shout.in';
        this.laravelAPI = 'https://lead247-laravel-api.right2shout.in';

        this.unReadTrigger$.pipe(debounceTime(500)).subscribe(() => {
            return this.fetchUnreadChatCount()
        });

        this.unReadWhatsapp$.pipe(debounceTime(500)).subscribe(() => {
            return this.fetchUnreadWhatsAppChatCount();
        })
    }

    ngOnInit() {

    }


    //here the given method is for triggered whether the call is getting initiated or no
    private initiatedcallSubject = new BehaviorSubject<string>('');
    // Observable to subscribe to intitiated changes
    initiatedState$ = this.initiatedcallSubject.asObservable();
    // Method to set intitiated state
    initiatedState(status) {
        this.initiatedcallSubject.next(status);
    }


    //here the given method is for triggered whether the sidebar is hovered or no to all the components and unsubscribe
    private hoverSubject = new BehaviorSubject<boolean>(false);
    // Observable to subscribe to hover changes
    hoverState$ = this.hoverSubject.asObservable();
    // Method to set hover state
    setHoverState(isHovered: boolean) {
        this.hoverSubject.next(isHovered);
    }

    //this mthod is to indicated that the a chat is selected from the List in chat section.
    private selectedChatFromList = new BehaviorSubject<string>('');
    indicationForChatSelect$ = this.selectedChatFromList.asObservable();

    setIndicationForChatSelection(name) {
        this.selectedChatFromList.next(name);
    }

    //this mthod is to indicated that the a chat is selected from the List in whats app chat section.
    private selectedWhatsappChatFromList = new BehaviorSubject<string>('');
    indicationForWhatsappChatSelect$ = this.selectedWhatsappChatFromList.asObservable();

    setIndicationForWhatsappChatSelection(name) {
        this.selectedWhatsappChatFromList.next(name);
    }

    //this modal is to trigger the call modal instantly
    private onCallModalClick = new BehaviorSubject<string>('');
    callModalSelect$ = this.onCallModalClick.asObservable();

    setOnCallSelection(name: string) {
        this.onCallModalClick.next(name);
    }

    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        // window.alert(errorMessage);
        return _throw(errorMessage);
    }


    //here the given method is for triggered whether the sidebar is hovered or no to all the components and unsubscribe
    private allCallSubject = new BehaviorSubject<string>('');
    // Observable to subscribe to on call changes
    onCallState$ = this.allCallSubject.asObservable();
    // Method to set hover state
    setOnCallState(isOnCall: string) {
        this.allCallSubject.next(isOnCall);
    }


    getenquirylist(listParam) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', listParam.limitparam);
        urlSearchParams.set('limitrows', listParam.limitrows);
        urlSearchParams.set('fromdate', listParam.from);
        urlSearchParams.set('todate', listParam.to);
        urlSearchParams.set('source', listParam.source);
        urlSearchParams.set('cityid', listParam.cityid);
        urlSearchParams.set('leads', listParam.leads);
        urlSearchParams.set('count', listParam.count);
        urlSearchParams.set('propname', listParam.propname);
        return this._http
            .get(this.sharedcontroller + "/enquirylistnewC" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    getenquirylistVisits(listParam) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', listParam.limitparam);
        urlSearchParams.set('limitrows', listParam.limitrows);
        urlSearchParams.set('fromdate', listParam.from);
        urlSearchParams.set('todate', listParam.to);
        urlSearchParams.set('visitfromdate', listParam.visitFromDate);
        urlSearchParams.set('visittodate', listParam.visitToDate);
        urlSearchParams.set('source', listParam.source);
        urlSearchParams.set('cityid', listParam.cityid);
        urlSearchParams.set('leads', listParam.leads);
        urlSearchParams.set('count', listParam.count);
        urlSearchParams.set('propname', listParam.propname);
        urlSearchParams.set('all', listParam.all);
        return this._http
            .get(this.sharedcontroller + "/enquirylistvisitsfixed" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    propertylistForEnquiry(leads, source) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('leads', leads);
        urlSearchParams.set('source', source);
        return this._http
            .get(this.sharedcontroller + "/getpropertybysource" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getcities() {
        return this._http.get(this.sharedcontroller + "/getcity").map((response: Response) => response.json().citylists);
    }

    addenquiry(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('Name', params.name);
        urlSearchParams.append('Number', params.number);
        urlSearchParams.append('Mail', params.mail);
        urlSearchParams.append('Source', params.source);
        urlSearchParams.append('PropertyType', params.propertytype);
        urlSearchParams.append('Timeline', params.timeline);
        urlSearchParams.append('Varient', params.size);
        urlSearchParams.append('Budget', params.budget);
        urlSearchParams.append('Address', params.address);
        urlSearchParams.append('addedby', params.username);
        urlSearchParams.append('duplicate', params.duplicate);
        urlSearchParams.append('leadpriority', params.priority);
        urlSearchParams.append('preferdlocation', params.location);
        urlSearchParams.append('localityid', params.locId);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/addenquiry", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    fetchbuilderleads(property, limitrows, limitparam) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('property', property);
        urlSearchParams.set('limit', limitparam);
        urlSearchParams.set('limitrows', limitrows);
        return this._http
            .get(this.sharedcontroller + "/builderleadsfetch" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    getlogin(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('username', param.username);
        urlSearchParams.append('password', param.password);
        urlSearchParams.append('deviceid', param.device);
        urlSearchParams.append('browser', param.browser);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/login", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    logout(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('X-Session-Id', param.sessionid);
        urlSearchParams.append('User_Id', param.id);
        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.sharedcontroller + "/logout", body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    loginotpsend(number) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('number', number);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/crmloginotpsending", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    otpvalidate(otp, number) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('otp', otp);
        urlSearchParams.append('number', number);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/otpvalidate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //to be added in admin_test
    passwordupdate(id, param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('ID', id);
        urlSearchParams.append('Password', param.repassword);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/changepassword", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //to be added in admin_test
    search(param, crmtype, userid, merge, teamlead) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('crmtype', crmtype);
        urlSearchParams.set('loginId', userid);
        urlSearchParams.set('merge', merge);
        urlSearchParams.set('teamlead', teamlead);
        return this._http.get(this.sharedcontroller + "/searchlist/" + param + "?", { search: urlSearchParams }).map((response: Response) => response.json().Searchlist);
    }

    sourcelist() {
        return this._http.get(this.sharedcontroller + "/sources")
            .pipe(map(response => response.json().Sources));
    }

    //everything to be check whether its  present in admin_test controller
    //add prop comp
    builderlist() {
        return this._http.get(this.sharedcontroller + "/getbuilders")
            .pipe(map(response => response.json().Builders));
    }

    getpropertiesbybuilder(builderid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('BuilderID', builderid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/getpropertybybuilder", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    propertylistnew() {
        return this._http.get(this.sharedcontroller + "/propertynewlists")
            .pipe(map(response => response.json().Properties));
    }

    addproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('BuildID', param.builderid);
        urlSearchParams.append('PropertyID', param.properties);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/addproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }
    //add prop comp

    //executive comp

    getexecutiveslist(status, desId, depId, propid, teamlead) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('active_status', status);
        urlSearchParams.append('depart_id', depId);
        urlSearchParams.append('desig_id', desId);
        urlSearchParams.append('propid', propid);
        urlSearchParams.append('teamlead', teamlead);
        return this._http.get(this.sharedcontroller + '/getexecutiveslist', { search: urlSearchParams }).map((response: Response) => response.json().Executiveslist);
    }

    addexecutive(params, dob) {
        var exec_name = params.name;
        var exec_num = params.mobilenum;
        var exec_dob = dob;
        var exec_mail = params.email;
        var dept_idfk = params.department;
        var prop_idfk = params.properties;
        var desig_idfk = params.designation;
        var exec_address = params.address;
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('Name', exec_name);
        urlSearchParams.append('Mobile', exec_num);
        urlSearchParams.append('dob', exec_dob);
        urlSearchParams.append('Mail', exec_mail);
        urlSearchParams.append('DeptIDFK', dept_idfk);
        urlSearchParams.append('PropIDFK', prop_idfk);
        urlSearchParams.append('DesigIDFK', desig_idfk);
        urlSearchParams.append('Address', exec_address);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/addexecutive", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    updatexecutives(params, dob, status) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('Id', params.executives_IDPK);
        urlSearchParams.append('Name', params.executives_name);
        urlSearchParams.append('Mobile', params.executives_number);
        urlSearchParams.append('dob', dob);
        urlSearchParams.append('Mail', params.executives_email);
        urlSearchParams.append('DeptIDFK', params.exec_dept_IDFK);
        urlSearchParams.append('PropIDFK', params.PropId);
        urlSearchParams.append('DesigIDFK', params.exec_desig_IDFK);
        urlSearchParams.append('Address', params.executive_address);
        urlSearchParams.append('active_status', status);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + '/updateexecutive', body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getdepartments() {
        return this._http.get(this.sharedcontroller + "/get_departments").map((response: Response) => response.json().Departments);
    }

    // getdesignations(departid) {
    //   let urlSearchParams = new URLSearchParams();
    //     urlSearchParams.append('departid',departid);
    //     return this._http.get(this.sharedcontroller + '/get_designations' , { search:urlSearchParams }).map((response: Response) => response.json().Designations);
    // }

    getdesignations(departid) {
        return this._http.get(this.sharedcontroller + "/get_designations/" + departid).map((response: Response) => response.json().Designations);
    }

    wisherupdate(performer, birthday) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('Perform', performer);
        urlSearchParams.append('Birthday', birthday);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/wisherupdate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getexecuitiveview(id) {
        return this._http.get(this.sharedcontroller + "/execuitiveview/" + id).map((response: Response) => response.json().Execuitiveview);
    }

    deletExecutive(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('Id', id);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.sharedcontroller + "/deletexecutive", body, { headers: headers })
            .map(() => this.getexecutiveslist('', '', '', '', ''));
    }

    //executive comp

    //leads comp
    getleads(limitparam, limitrows, fromdate, todate, source, propid, duplicate, cityid, assignId) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', limitparam);
        urlSearchParams.set('limitrows', limitrows);
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        urlSearchParams.set('source', source);
        urlSearchParams.set('cityid', cityid);
        urlSearchParams.set('propname', propid);
        urlSearchParams.set('duplicates', duplicate);
        urlSearchParams.set('assignid', assignId);
        return this._http
            .get(this.sharedcontroller + "/completeleads" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    getSourceListWithCounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.from);
        urlSearchParams.set('ToDate', param.to);
        urlSearchParams.set('visitedfromdate', param.visitedfrom);
        urlSearchParams.set('visitedtodate', param.visitedto);
        return this.http.get(this.sharedcontroller + "/sourcedashboard" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    propertylistForCompleteLeads(fromdate, todate, source) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        urlSearchParams.set('source', source);
        return this._http
            .get(this.sharedcontroller + "/getpropertybysource" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getleadcounts(fromdate, todate, source, propid, cityid, assignId) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        urlSearchParams.set('source', source);
        urlSearchParams.set('propname', propid);
        urlSearchParams.set('cityid', cityid);
        urlSearchParams.set('assignid', assignId);
        return this._http
            .get(this.sharedcontroller + "/completeleadscounts" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    localitylist() {
        return this._http.get(this.sharedcontroller + "/localitylist").pipe(map(response => response.json().Localities));
    }
    //leads comp

    //registration comp
    getregistrationlist(limitparam, limitrows, fromdate, todate, propname, execid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', limitparam);
        urlSearchParams.set('limitrows', limitrows);
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        urlSearchParams.set('propName', propname);
        urlSearchParams.set('ExecId', execid);
        return this._http
            .get(this.sharedcontroller + "/registrations" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Registrations));
    }

    getregistrationlistcounts(fromdate, todate, propname, execid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        urlSearchParams.set('propName', propname);
        urlSearchParams.set('ExecId', execid);

        return this._http
            .get(this.sharedcontroller + "/registrationcounts" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().RegistrationCounts));
    }
    //refistration comp

    //customers comp
    propertylist(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('leadid', params.leadid);
        urlSearchParams.set('execid', params.execid);
        return this._http.get(this.sharedcontroller + "/propertylist?", { search: urlSearchParams })
            .pipe(map(response => response.json().Properties));
    }

    getcustomeredit(id) {
        return this._http.get(this.sharedcontroller + "/geteditcustomer/" + id).map((response: Response) => response.json().Customerview);
    }

    getassignedrm(id, loginid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('loginid', loginid);
        return this._http.get(this.sharedcontroller + "/getassignedrm/" + id + "?", { search: urlSearchParams }).map((response: Response) => response.json().RMname);
    }

    addsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('execid', param.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/addsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addvisitedpropertiesothers(param2) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param2.leadid);
        urlSearchParams.append('PropertyID', param2.visitedproperties);
        urlSearchParams.append('execid', param2.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/addvisitedpropertiesothers", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getpropertytypelist() {
        return this._http.get(this.sharedcontroller + "/propertytype")
            .pipe(map(response => response.json().PropertyTypes));
    }

    getpropertylist_ID(val) {
        return this._http.get(this.sharedcontroller + "/get_PropertyName?buliderId=" + val).map((response: Response) => response.json().details);
    }

    getbhk() {
        return this._http.get(this.sharedcontroller + "/getbhk").pipe(map(response => response.json().Bhksize));
    }

    datashortupdate(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('IDPK', param.leadid);
        urlSearchParams.append('name', param.name);
        urlSearchParams.append('number', param.number);
        urlSearchParams.append('mail', param.mail);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('preferdlocation', param.location);
        urlSearchParams.append('preferedtype', param.proptype);
        urlSearchParams.append('leadpossession', param.possession);
        urlSearchParams.append('preferedvarient', param.size);
        urlSearchParams.append('preferedbudget', param.budget);
        urlSearchParams.append('leadpriority', param.priority);
        urlSearchParams.append('leadaddress', param.address);
        urlSearchParams.append('primaryname', param.primaryname);
        urlSearchParams.append('primarynumber', param.primarynumber);
        urlSearchParams.append('primarymail', param.primarymail);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/updateshortdata", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    leadassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/leadassign", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addClient(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('client', param.client);
        urlSearchParams.append('clientnum', param.clientnum);
        urlSearchParams.append('clientmail', param.clientmail);
        urlSearchParams.append('sitevisitdate', param.sitevisitdate);
        urlSearchParams.append('rmname', param.rmname);
        urlSearchParams.append('rmmail', param.rmmail);
        urlSearchParams.append('builder', param.builder);
        urlSearchParams.append('property', param.property);
        urlSearchParams.append('sendmail', param.sendmail);
        urlSearchParams.append('sendnote', param.sendnote);
        urlSearchParams.append('ccmail', param.ccmail);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        return this._http.post(this.clientAPI + "/mailsending", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    startBreak(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ExecId', param.execid);
        urlSearchParams.set('StartTime', param.startTime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/poststarttime", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getBreakDetails(execid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ExecId', execid);
        return this.http.get(this.sharedcontroller + "/todaysbreak?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    endBreak(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('BreakId', param.breakId);
        urlSearchParams.set('ExecId', param.execid);
        urlSearchParams.set('EndTime', param.endtime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/postendtime", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //here post and get is triggered with post Method (execid is passed for get and session is passed as post.)
    getversion(execid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('X-Session-Id', localStorage.getItem('SessionId'));

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.sharedcontroller + "/get_ionic_version?ExecId=" + execid, body, {
            headers: headers,
            search: urlSearchParams,
        }).map(resposne => resposne.json());
    }

    deleteLead(leadid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('LeadId', leadid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.sharedcontroller + "/deletelead", body, { headers: headers })
            .map(response => response.json());
    }

    downloadLeads(fromdate, todate, source, propid, duplicate, cityid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        urlSearchParams.set('source', source);
        urlSearchParams.set('propname', propid);
        urlSearchParams.set('duplicates', duplicate);
        return this._http
            .get(this.sharedcontroller + "/completeleads_status" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    assignedLeadsCount(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('fromdate', param.datefrom);
        urlSearchParams.set('todate', param.dateto);
        urlSearchParams.set('source', param.source);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.sharedcontroller + "/sourcebasedleadscounts?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    assignedLeadsCount2(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('fromdate', param.datefrom);
        urlSearchParams.set('todate', param.dateto);
        urlSearchParams.set('source', param.source);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.sharedcontroller + "/sourcebasedleadscounts2?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    sourcebasedleadslisting(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('fromdate', param.datefrom);
        urlSearchParams.set('todate', param.dateto);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('status', param.status);
        urlSearchParams.set('leads', param.leads);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.sharedcontroller + "/sourcebasedleadslisting?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    assignedLeadsCPCount(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('fromdate', param.datefrom);
        urlSearchParams.set('todate', param.dateto);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('rmid', param.executid);
        urlSearchParams.set('loginid', param.loginuser);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('stage', param.stage);
        urlSearchParams.set('stagestatus', param.stagestatus);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(`https://superadmin-azure.right2shout.in/${localStorage.getItem('cpcontrollerName')}/retailcrm` + "/assignedleads_count_retail?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getExecutiveScheldueTodayInfo(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('PropID', param.propId);
        urlSearchParams.set('todate', param.todate);
        urlSearchParams.set('FromDate', param.fromDate);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('ExecId', param.execId);
        urlSearchParams.set('loginid', param.loginuser);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(`https://superadmin-azure.right2shout.in/${localStorage.getItem('cpcontrollerName')}/retailcrm` + "/scheduledtoday_execquickview", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getExecutiveInfo(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('PropID', param.propId);
        urlSearchParams.set('FromDate', param.fromDate);
        urlSearchParams.set('todate', param.todate);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('ExecId', param.execId);
        urlSearchParams.set('loginid', param.loginuser);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(`https://superadmin-azure.right2shout.in/${localStorage.getItem('cpcontrollerName')}/retailcrm` + "/execquickview", { search: urlSearchParams })
            .pipe(map(response => response.json()))
    }

    getTinyMceCode() {
        return this._http.get('https://superadmin-azure.right2shout.in/admincrm/tinymce_code').pipe(map((response) => response.json()))
    }

    postMergeLeads(param) {
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('primarylead', param.leadId);
        urlSearchParams.append('mergedlead', param.mergeLeadId);
        urlSearchParams.append('relationship', param.relation);
        urlSearchParams.append('LeadP', param.primaryid);

        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.sharedcontroller + '/mergeleads', body, { headers: headers }).pipe(map((resp) => {
            resp.json();
        }))
    }

    getCpClients(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('cityid', param.cityId);
        urlSearchParams.set('localityid', param.localityid);
        urlSearchParams.set('propertyid', param.propertyid);
        urlSearchParams.set('active_status', param.status);
        urlSearchParams.set('useage_status', param.packstatus);
        return this._http.get(this.sharedcontroller + "/getclientlist", { search: urlSearchParams }).pipe(map(response => response.json()));
    }

    createCPClient(param) {
        return this._http.post(this.sharedcontroller + '/addclient', param).pipe(map((resp) => {
            resp.json();
        }))
    }

    getAdminHourlyReport(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('activityfromdate', param.fromdate);
        urlSearchParams.set('activitytodate', param.todate);
        urlSearchParams.set('activityfromtime', param.fromtime);
        urlSearchParams.set('activitytotime', param.totime);
        urlSearchParams.set('execid', param.execid);
        urlSearchParams.set('loginid', param.loginid);
        urlSearchParams.set('pageid', param.loop);
        urlSearchParams.set('DbClient', param.team);
        urlSearchParams.set('teamlead', param.teamlead);

        return this._http.get(this.sharedcontroller + '/hourly_report_executives', { search: urlSearchParams }).pipe(
            map((resp) => {
                return resp.json();
            }))
    }

    getExecutiveHourlyReportListing(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('activityfromdate', param.fromdate);
        urlSearchParams.set('activitytodate', param.todate);
        urlSearchParams.set('activityfromtime', param.fromtime);
        urlSearchParams.set('activitytotime', param.totime);
        urlSearchParams.set('execid', param.execid);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('activity', param.status);

        return this._http.get(this.sharedcontroller + '/hourly_report_executives_listing', { search: urlSearchParams }).pipe(map((resp) => {
            return resp.json();
        }))
    }

    getHomes247FreshLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limitparam);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('leads', param.leads);
        urlSearchParams.set('city', param.cityid);
        urlSearchParams.set('locality', param.localityid);
        urlSearchParams.set('propName', param.propname);
        urlSearchParams.set('fromdate', param.from);
        urlSearchParams.set('todate', param.to);
        urlSearchParams.set('count', param.count);
        return this._http.get(this.sharedcontroller + '/gethomes247freshpendingleads' + "?", { search: urlSearchParams }).
            pipe(map((resp) => {
                return resp.json().result;
            }))
    }

    getHomes247CompleteLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limitparam);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('fromdate', param.fromdate);
        urlSearchParams.set('todate', param.todate);
        urlSearchParams.set('city', param.cityid);
        urlSearchParams.set('locality', param.localityid);
        urlSearchParams.set('propName', param.property);
        urlSearchParams.set('count', param.count);
        return this._http.get(this.sharedcontroller + '/gethomes247completeleads', { search: urlSearchParams }).
            pipe(map((resp) => {
                return resp.json().result;
            }))
    }

    getlocalityByCityId(locality) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('cityId', locality)
        return this._http.get(this.sharedcontroller + '/citybasedlocalitylist' + '?', { search: urlSearchParams }).pipe(map((resp) => {
            return resp.json().Localities;
        }))
    }

    getCPClientList(cityid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('cityId', cityid);

        return this._http.get(this.sharedcontroller + '/crm_clientlist', { search: urlSearchParams }).pipe(map((resp) => {
            return resp.json();
        }))
    }

    clientLeadassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('clientId', param.client);
        urlSearchParams.append('leadId', param.assignedleads);
        urlSearchParams.append('type', param.type);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedcontroller + "/clientleadassign", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getFreshCampaignleads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limitparam);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('fromdate', param.fromdate);
        urlSearchParams.set('todate', param.todate);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('cityid', param.cityid);
        urlSearchParams.set('property', param.propid);
        urlSearchParams.set('stage', param.status);
        urlSearchParams.set('bsr_status', param.bsr);
        return this._http
            .get(this.sharedcontroller + '/enquiry_qualify_list', { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getBuyCampaignleads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limitparam);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('from', param.fromdate);
        urlSearchParams.set('to', param.todate);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('city', param.cityid);
        urlSearchParams.set('locality', param.locality);
        urlSearchParams.set('property', param.propid);
        urlSearchParams.set('stage', param.status);
        urlSearchParams.set('count', param.count);
        return this._http
            .get(this.laravelAPI + '/enq_enquiry_buy', { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getSellCampaignleads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limitparam);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('from', param.fromdate);
        urlSearchParams.set('to', param.todate);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('city', param.cityid);
        urlSearchParams.set('property', param.propid);
        urlSearchParams.set('locality', param.locality);
        urlSearchParams.set('status', param.status);
        urlSearchParams.set('customer_role', param.customer_role);
        urlSearchParams.set('prop_type', param.prop_type);
        urlSearchParams.set('size', param.size);
        urlSearchParams.set('facing', param.facing);
        urlSearchParams.set('approval', param.approval);
        urlSearchParams.set('count', param.count);
        return this._http
            .get(this.laravelAPI + '/enq_individual_sell' + "?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getRentCampaignleads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limitparam);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('from', param.fromdate);
        urlSearchParams.set('to', param.todate);
        urlSearchParams.set('city', param.cityid);
        urlSearchParams.set('locality', param.locality);
        urlSearchParams.set('customer_role', param.customer_role);
        urlSearchParams.set('prop_type', param.prop_type);
        urlSearchParams.set('property', param.propid);
        urlSearchParams.set('parking', param.parking);
        urlSearchParams.set('size', param.size);
        urlSearchParams.set('facing', param.facing);
        urlSearchParams.set('status', param.status);
        urlSearchParams.set('approval', param.approval);
        urlSearchParams.set('count', param.count);
        return this._http
            .get(this.laravelAPI + '/enq_rental_rent', { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getCampaignleadsCounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('fromdate', param.fromdate);
        urlSearchParams.set('todate', param.todate);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('cityid', param.cityid);
        urlSearchParams.set('property', param.propid);
        urlSearchParams.set('stage', param.status);
        return this._http
            .get(this.sharedcontroller + "/enquiry_qualify_count" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    postCampaignLeadStage(param) {
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('leadId', param.leadid);
        urlSearchParams.append('qualify', param.status);
        urlSearchParams.append('bsr', param.bsr);

        let body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.sharedcontroller + '/post_lead_qualification', body, { headers: headers })
            .pipe(map((respone) => respone.json()));
    }

    getLocalitiesBycity(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('cityid', id);
        return this._http.get(this.sharedcontroller + '/get_locality_list', { search: urlSearchParams })
            .pipe(map((response => response.json())));
    }

    getPropertiesByCity(id, locid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('cityid', id);
        urlSearchParams.append('localityid', locid);
        return this._http.get(this.sharedcontroller + '/get_property_list', { search: urlSearchParams })
            .pipe(map((response => response.json())));
    }

    updateLocalityAndPropety(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('localityId', param.locId);
        urlSearchParams.append('propName', param.propid);
        urlSearchParams.append('leadId', param.leadid);
        urlSearchParams.append('leadName', param.leadName);
        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.sharedcontroller + '/update_locality_property', body, { headers: headers })
            .pipe(map((resp) => resp.json()));
    }

    // shareMandateDocuments(param){
    //     let urlSearchParams = new URLSearchParams();
    //     urlSearchParams.append('name',param.name);
    //     urlSearchParams.append('number',param.number);
    //     urlSearchParams.append('property',param.property);

    //     var body = urlSearchParams.toString();
    //     var headers = new Headers();
    //     headers.append('Content-Type','application/x-www-form-urlencoded');
    //     return this._http.post(this.sharedcontroller + "/postDocuments",body,{headers : headers})
    //     .pipe(map(response => response.json()));
    // }

    //client regisatration API
    getBangalorebuilders() {
        return this._http.get(this.clientAPI + "/get_bangalorebuildersInfo").pipe(map(response => response.json()));
    }

    getemployeesList() {
        return this._http.get(this.clientAPI + "/get_employees").pipe(map(response => response.json()));
    }

    getPropertiesList(id) {
        return this._http.get(this.clientAPI + "/get_propertiesbybuilder/" + id).map(response => response.json());
    }

    getBuilderMails(id) {
        return this._http.get(this.clientAPI + "/get_buildermail/" + id).map(response => response.json());
    }

    getAllChats(loginid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('loginid', loginid);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/fetchallchats', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    get121Chats(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('loginid', param.loginid);
        urlSearchParams.append('recieverid', param.recId);
        urlSearchParams.append('chattype', param.type);
        urlSearchParams.append('groupid', param.groupid);
        urlSearchParams.append('fromdate', param.from);
        urlSearchParams.append('todate', param.to);
        urlSearchParams.append('encryptid', param.encryptid);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/one2onefetch', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    sendMessage(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('senderid', param.loginid);
        urlSearchParams.append('recieverid', param.recieverid);
        urlSearchParams.append('message', param.message);
        urlSearchParams.append('groupname', param.groupname);
        urlSearchParams.append('chattype', param.type);
        urlSearchParams.append('members', param.members);
        urlSearchParams.append('groupid', param.groupid);
        urlSearchParams.append('msgid', param.messageid);
        urlSearchParams.append('edit', param.edit);
        urlSearchParams.append('forward', param.forward);
        urlSearchParams.append('forward_msg', JSON.stringify(param.messages));
        urlSearchParams.append('edit_gn', param.edit_gn);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/chatcheck', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    sendAttachment(param) {
        return this._http.post(this.chatProcessAPI + '/api/chats/messages/attachment', param)
            .pipe(map(resp => resp.json()))
    }

    getAllGroupMembers(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('senderid', param.loginid);
        urlSearchParams.append('groupid', param.groupid);
        urlSearchParams.append('req', param.type);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/groupmembers', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    removeMemberFromGroup(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('senderid', param.loginid);
        urlSearchParams.append('groupid', param.groupid);
        urlSearchParams.append('memberid', param.memberid);
        urlSearchParams.append('actiontype', param.actiontype);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/removemember', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getCpDedicatedLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limitparam);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('from', param.from);
        urlSearchParams.set('to', param.to);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('prop', param.propname);
        urlSearchParams.set('locality', param.localityid);
        urlSearchParams.set('reason', param.reason);
        return this._http.get(this.laravelAPI + '/junkReuse', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    getCpDedicatedLeadsCount(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('from', param.from);
        urlSearchParams.set('to', param.to);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('prop', param.propname);
        urlSearchParams.set('locality', param.localityid);
        urlSearchParams.set('reason', param.reason);
        return this._http.get(this.laravelAPI + '/CpDedicateCountLeads', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    getCPDedicatedProperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('from', param.from);
        urlSearchParams.set('to', param.to);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('locality', param.localityid);
        urlSearchParams.set('reason', param.reason);
        return this._http.get(this.laravelAPI + '/CpDedicatedPropertylist', { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getJunkReason(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('from', param.from);
        urlSearchParams.set('to', param.to);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('prop', param.propname);
        urlSearchParams.set('locality', param.localityid);
        return this._http.get(this.laravelAPI + '/CpDedicatedjunkCategory', { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    postLoggedLocation(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('execid', param.loginid);
        urlSearchParams.append('device_type', param.device);
        urlSearchParams.append('latitude', param.lat);
        urlSearchParams.append('longitude', param.long);
        urlSearchParams.append('address', param.address);
        urlSearchParams.append('check_status', param.checkin);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        let body = urlSearchParams.toString();
        return this._http.post(this.laravelAPI + '/store_livelocation', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getCheckedInData(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('execid', param.loginid);
        urlSearchParams.append('from', param.fromdate);
        urlSearchParams.append('to', param.todate);
        urlSearchParams.set('limit', param.limitparam);
        urlSearchParams.set('limitrows', param.limitrows);

        return this._http.get(this.laravelAPI + '/get_recentlocation', { search: urlSearchParams })
            .pipe(map(resp => resp.json()))
    }

    getAttendanceLogsData(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('from', param.fromdate);
        urlSearchParams.append('to', param.todate);
        urlSearchParams.set('limit', param.limitparam);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('loginid', param.loginid);

        return this._http.get(this.laravelAPI + '/datelocation_get', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    convertMessageToRead(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('loginid', param.loginid);
        urlSearchParams.append('chatid', param.chatid);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');


        let body = urlSearchParams.toString();
        return this._http.post(this.chatProcessAPI + '/msgsts', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getUnreadCounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('loginid', param.loginid);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/unreadcount', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    deleteMessage(mesId) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('messageid', mesId);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/msgdlt', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    postForwardedMessage(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('messageid', param.mesId),
            urlSearchParams.append('selectedExecutive', param.executivesId)

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/msgfrd', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getPropertyListForBuy(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('city', param.city);
        urlSearchParams.append('locality', param.locality);
        return this._http.get(this.laravelAPI + '/bsr_propertyList', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    getPropertyListForSell() {
        return this._http.get(this.sharedcontroller)
            .pipe(map(resp => resp.json()));
    }

    updateBuySellRent(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('buysellrent', param.flow);
        urlSearchParams.append('customer_id', param.leadid);
        urlSearchParams.append('customer_name', param.name);
        urlSearchParams.append('prop_type', param.type);
        urlSearchParams.append('city', param.cityid);
        urlSearchParams.append('locality', param.locid);
        urlSearchParams.append('property', param.propid);
        urlSearchParams.append('customer_role', param.customertype);
        urlSearchParams.append('buildFloor_propName', param.builderpropertyname);
        urlSearchParams.append('sqft', param.sqft);
        urlSearchParams.append('facing_pref', param.facingpref);
        urlSearchParams.append('no_floors', param.totalfloors);
        urlSearchParams.append('specific_floor', param.specificfloor);
        urlSearchParams.append('expected_rent', param.expectedrent);
        urlSearchParams.append('parking', param.parking);
        urlSearchParams.append('deposite', param.deposite);
        urlSearchParams.append('approval_auth', param.authority);
        urlSearchParams.append('prop_status', param.propstatus);
        urlSearchParams.append('bhk', param.bhk);

        let body = urlSearchParams.toString();

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded')
        return this._http.post(this.laravelAPI + '/enquiry_update_bsr', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getAuthorityList(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('city', param.cityid);

        return this._http.get(this.laravelAPI + '/bsr_approvalAuth', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    onesignalpush(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('user_id', param.userid);
        urlSearchParams.append('onesignal_player_id', param.subscriberid);
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let body = urlSearchParams.toString();
        return this._http.post(this.chatProcessAPI + '/save-onesignal-id', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getLocalityByCityForCp(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('cityid', param.cityid);

        return this._http.get(this.sharedcontroller + '/getclientlocality', { search: urlSearchParams })
            .pipe(map(res => res.json()));
    }

    getPropertiesByCityForCp(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('cityid', param.cityid);
        urlSearchParams.append('localityid', param.localityid);

        return this._http.get(this.sharedcontroller + '/getclientproperty', { search: urlSearchParams })
            .pipe(map(res => res.json()));
    }

    getAllWhatsAppChats(loginid, execid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('loginid', loginid);
        urlSearchParams.append('execid', execid);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/whatsapp/fetchallchats', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    get121WhatsappChats(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('loginid', param.loginid);
        urlSearchParams.append('recieverid', param.recId);
        // urlSearchParams.append('chattype', param.type);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/whatsapp/one2onefetch', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    sendWhatsappMessage(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('senderid', param.loginid);
        urlSearchParams.append('recieverid', param.recieverid);
        urlSearchParams.append('message', param.message);
        // urlSearchParams.append('chattype', param.type);
        // urlSearchParams.append('members', param.members);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/whatsapp/chatcheck', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    sendwhatsappAttachment(param) {
        return this._http.post(this.chatProcessAPI + '/api/whatsapp_chats/messages/attachment', param)
            .pipe(map(resp => resp.json()))
    }

    convertWhatsappMessageToRead(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('clientnum', param.clientnum);
        urlSearchParams.append('chatid', param.chatid);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');


        let body = urlSearchParams.toString();
        return this._http.post(this.chatProcessAPI + '/whatsapp/msgsts', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getWhatsappUnreadCounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('loginid', param.loginid);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/whatsapp/unreadcount', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    deletewhatsappMessage(mesId) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('messageid', mesId);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/whatsapp/msgdlt', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    checkNumberForWhatsApp(num) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('number', num);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/whatsapp/numbercheck', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    updateBuySellRentFollowup(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('customer_id', param.leadid);
        urlSearchParams.append('status', param.status);
        urlSearchParams.append('buysellrent', param.type);

        let body = urlSearchParams.toString();

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded')
        return this._http.post(this.laravelAPI + '/enquiry_update_bsr', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getCpClientCounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('cityid', param.cityId);
        // urlSearchParams.append('clientid',param.clientid);
        urlSearchParams.append('localityid', param.localityid);
        urlSearchParams.append('propertyid', param.propertyid);
        urlSearchParams.append('active_status', param.status);

        return this._http.get(this.sharedcontroller + '/getclientlistcount', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    updateCPClient(param) {
        return this._http.post(this.sharedcontroller + '/updateclient', param).pipe(map((resp) => {
            resp.json();
        }))
    }

    searchNameMessage(search, id, chatid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('searchTerm', search)
        urlSearchParams.append('loginid', id);
        urlSearchParams.append('chat_id', chatid)

        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded')
        return this._http.post(this.chatProcessAPI + '/search', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }

    getVsnapLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('from', param.fromdate);
        urlSearchParams.append('to', param.todate);
        urlSearchParams.append('limit', param.limit);
        urlSearchParams.append('limitrows', param.limitrows);
        urlSearchParams.append('status', param.status);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded')
        return this._http.get(this.laravelAPI + '/get_vsnapenquiryleads', { search: urlSearchParams })
            .pipe(map(resp => resp.json()))
    }

    getVsnapCountsLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('from', param.fromdate);
        urlSearchParams.append('to', param.todate);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded')
        return this._http.get(this.laravelAPI + '/count_vsnapenquiryleads', { search: urlSearchParams })
            .pipe(map(resp => resp.json()))
    }

    getSiteCrmLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('from', param.fromdate);
        urlSearchParams.append('to', param.todate);
        urlSearchParams.append('limit', param.limit);
        urlSearchParams.append('limitrows', param.limitrows);
        urlSearchParams.append('status', param.status);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded')
        return this._http.get(this.laravelAPI + '/get_sitecrmenquiryleads', { search: urlSearchParams })
            .pipe(map(resp => resp.json()))
    }

    getSiteCrmCountsLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('from', param.fromdate);
        urlSearchParams.append('to', param.todate);
        // urlSearchParams.append('status', param.status);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded')
        return this._http.get(this.laravelAPI + '/count_sitecrmenquiryleads', { search: urlSearchParams })
            .pipe(map(resp => resp.json()))
    }

    postVsnapLeadStage(param) {
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('customerid', param.leadid);
        urlSearchParams.append('status', param.status);

        let body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.laravelAPI + '/vsnap_qualification', body, { headers: headers })
            .pipe(map((respone) => respone.json()));
    }

    postSiteCrmLeadStage(param) {
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('customerid', param.leadid);
        urlSearchParams.append('status', param.status);

        let body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.laravelAPI + '/sitecrm_qualification', body, { headers: headers })
            .pipe(map((respone) => respone.json()));
    }

    getInventoryCounts(propid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('propid', propid);

        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/count_propertyinventory', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    getPropertyInventory(propid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('propid', propid);

        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/count_propertyinventory', { search: urlSearchParams })
            .pipe(map(resp => resp.json()))
    }

    getBHKDetails(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('propid', param.propid);
        urlSearchParams.append('towerid', param.towerid);
        urlSearchParams.append('size', param.size);
        urlSearchParams.append('status', param.status);
        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/get_bhkdetails', { search: urlSearchParams })
            .pipe(map(resp => resp.json()))
    }

    getFacingDetails() {
        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/get_doorfacingdetails')
            .pipe(map(resp => resp.json()));
    }

    getTowerDetails(propid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('propid', propid)
        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/get_towerdetails', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    getUnits() {
        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/get_singleunit/20')
            .pipe(map(resp => resp.json()));
    }

    getPropertyDetails(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('propid', param.propid);
        urlSearchParams.append('viewtype', param.type);
        urlSearchParams.append('bhk', param.bhk);
        urlSearchParams.append('status', param.status);
        urlSearchParams.append('towerid', param.towerid);
        urlSearchParams.append('size', param.unit);

        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/getpropertyinventory', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    getstatus(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('propid', param.propid);
        urlSearchParams.append('towerid', param.towerid);
        urlSearchParams.append('size', param.size);
        urlSearchParams.append('bhk', param.bhk);
        urlSearchParams.append('status', param.status);

        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/get_statusdetails', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    getSizes(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('propid', param.propid),
            urlSearchParams.append('towerid', param.towerid),
            urlSearchParams.append('bhk', param.bhk),
            urlSearchParams.append('status', param.status)

        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/get_sizedetails', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    postTriggerCall(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('callto', param.number);
        urlSearchParams.append('leadid', param.leadid);
        urlSearchParams.append('starttime', param.starttime);
        urlSearchParams.append('leadtype', param.leadtype);
        urlSearchParams.append('modeofcall', param.modeofcall);
        urlSearchParams.append('assignee', param.rmid);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/calls/trgrcls', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getAllBhk() {
        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/bhk_listing')
            .pipe(map(resp => resp.json()));
    }

    getLiveCallsList(loginid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('loginid', loginid);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post(this.chatProcessAPI + '/calls/lvecls', body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getAllCalls(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('loginid', param.loginid);
        urlSearchParams.append('limit', param.limit);
        urlSearchParams.append('limitrows', param.limitrows);
        urlSearchParams.append('fromcalldatetime', param.from);
        urlSearchParams.append('tocalldatetime', param.to);
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('clientnum', param.number);
        urlSearchParams.append('callstage', param.stage);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/calls/alcls', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getAllCallsCounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('loginid', param.loginid);
        urlSearchParams.append('fromcalldatetime', param.from);
        urlSearchParams.append('tocalldatetime', param.to);
        urlSearchParams.append('execid', param.execid);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/calls/alclcnts', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getMessageInfo(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('sender_id', param.senderid)
        urlSearchParams.append('messageid', param.messageid);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/msginfo', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    onCallDisconnected(number) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('emp_phone', number)

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/calls/mnltrgr', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    getUnitDetails(propId, bhk) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('propid', propId);
        urlSearchParams.append('bhk', bhk);
        urlSearchParams.append('status', '1');

        return this._http.get('http://192.168.0.116/noncdnsuperadmin-live/admincrm_test/get_unitlisting', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    triggerUnreadCount() {
        this.unReadTrigger$.next();
    }

    // triggerWhatsappUnreadCount() {
    //     this.unReadWhatsapp$.next();
    // }

    fetchUnreadChatCount() {
        let param = {
            loginid: localStorage.getItem('UserId')
        }
        this.getUnreadCounts(param).subscribe(
            (response) => {
                this.unReadChatCount = response['details'][0].unreadmsgcount;
            }
        );
    }

    fetchUnreadWhatsAppChatCount() {
        let param = {
            loginid: localStorage.getItem('UserId')
        }
        this.getWhatsappUnreadCounts(param).subscribe(
            (response) => {
                this.unReadWhatsappChatCount = response['details'][0].unreadmsgcount;
            }
        );
    }

    disappear24Message(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('groupid', param.groupid);
        urlSearchParams.append('actionid', param.encryptid);

        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.chatProcessAPI + '/msg-encrypt', body, { headers: headers })
    }

    getTeamList(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('propid', param.propid);
        urlSearchParams.append('teamlead', param.teamlead);
        urlSearchParams.append('teammember', param.teammember);
        urlSearchParams.append('status', param.status);

        return this._http.get(this.sharedcontroller + '/getteammemberslisting', { search: urlSearchParams })
            .pipe(map(resp => resp.json()));
    }

    getTeamNames() {
        return this._http.get(this.sharedcontroller + '/getteamname')
            .pipe(map(resp => resp.json()));
    }

    addteamlead(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('teamName', param.teamName);
        urlSearchParams.append('property_id', param.property_id);
        urlSearchParams.append('teamLead', param.teamLead);
        urlSearchParams.append('teamMembers', param.teamMembers);
        urlSearchParams.append('roleid', param.roleid);

        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.sharedcontroller + '/addteamlead', body, { headers: headers })
    }

    updateTeam(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('IDPK', param.IDPK);
        urlSearchParams.append('teamName', param.teamName);
        urlSearchParams.append('property_id', param.property_id);
        urlSearchParams.append('teamLead', param.teamLead);
        urlSearchParams.append('teamMembers', param.teamMembers);
        urlSearchParams.append('roleid', param.roleid);

        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.sharedcontroller + '/updateteammember', body, { headers: headers })
    }

    updateexecproperty(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('propid', param.propid);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.sharedcontroller + '/updateexecproperty', body, { headers: headers }).pipe(map(resp => resp.json()));

    }

    viewSourceHistory(leadid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('leadid', leadid);

        return this._http.get(this.sharedcontroller + '/viewsourcebasedleaddetails', { search: urlSearchParams })
            .pipe(map(resp => resp.json()))
    }

    getAllLoginData() {
        return this._http.get(this.sharedcontroller + '/getallactiveexec').pipe(map(resp => resp.json()));
    }

    uploadCSV(file: File) {
        let formdate = new FormData();
        formdate.append('cs_file', file);

        return this._http.post(this.sharedcontroller + '/upload-csv', formdate)
            .pipe(map(resp => resp.json()));
    }

}

// postWhatsappForwardedMessage(param) {
//     let urlSearchParams = new URLSearchParams();
//     urlSearchParams.append('messageid', param.mesId),
//         urlSearchParams.append('selectedExecutive', param.executivesId)

//     var body = urlSearchParams.toString();
//     var headers = new Headers();
//     headers.append('Content-Type', 'application/x-www-form-urlencoded');

//     return this._http.post(this.whatsAppchatProcessAPI + '/msgfrd', body, { headers: headers })
//         .pipe(map(resp => resp.json()));
// }
