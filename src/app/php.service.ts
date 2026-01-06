import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { _throw } from 'rxjs/observable/throw';
import { retry, catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class phpservice implements OnInit {
    ngOnInit() {
        this.getExecutivesview();
    }
    enqrycount = [];
    executives = [];
    projects = [];
    items = [];
    enquiries = [];
    activeleads = [];
    followups = [];
    facetoface = [];
    uniquesite = [];
    repeatsite = [];
    negotiate = [];
    closedleads = [];
    myexecutives = [];
    filterItems = [];
    urlPrefix: string;
    urlPrefix_web: string;
    urlPrefix_php: string;

    apiurl: string;
    newapiurl: string;
    webapi: string;
    localApi: any;
    retailApi:string;

    private mouseenter_listners = new Subject<any>();
    private mouseenter_listners1 = new Subject<any>();
    private mouseenter_listners2 = new Subject<any>();
    private mouseenter_listners3 = new Subject<any>();
    private mouseenter_listners4 = new Subject<any>();
    private mouseenter_listners5 = new Subject<any>();

    constructor(private _http: Http, private http: Http, private router: Router) {

        this.urlPrefix_php = 'https://superadmin.right2shout.in/crmbackend';
        this.apiurl = 'https://superadmin.right2shout.in/crmbackend';
        this.newapiurl = 'https://superadmin.right2shout.in/crmnewbackend';
        this.urlPrefix = 'https://superadmin.right2shout.in/crmapi';
        this.urlPrefix_web = 'https://superadmin.right2shout.in/backend';
        this.webapi = 'https://superadmin.right2shout.in/retailcrm';
        this.localApi = 'https://superadmin.right2shout.in/crmbackend';
        this.retailApi = 'https://superadmin.right2shout.in/retailcrm';
    }
    checkMe: any;

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

    assignedLeadsCounts(param: any) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('FromDate', param.datefrom);
        urlSearchParams.append('ToDate', param.dateto);
        urlSearchParams.append('status', param.statuss);
        urlSearchParams.append('stage', param.stage);
        urlSearchParams.append('team', param.team ? undefined : '');
        urlSearchParams.append('stagestatus', param.stagestatus);
        urlSearchParams.append('rmid', param.executid);
        urlSearchParams.append('propid', param.propid);
        urlSearchParams.append('loginid', param.loginuser);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.localApi + "/leadassignedcountsadmin?" + "?", { search: urlSearchParams })
            .pipe(map((response: any) => response));
    }

    getRetailExecutives(roleId){
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('roleId', roleId);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.retailApi + "/retail_executives" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }


    getExecutiveScheldueTodayInfo(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('PropID', param.propId);
        urlSearchParams.set('todate', param.todate);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('ExecId', param.execId);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.apiurl + "/scheduledtoday_execquickview" , { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }


    getleads(limitparam, limitrows, fromdate, todate, source) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', limitparam);
        urlSearchParams.set('limitrows', limitrows);
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        urlSearchParams.set('source', source);
        return this._http
            .get(this.apiurl + "/completeleads" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    //common used in dashboard
    getHotColdWarmCount(count, propId, todate, fromdate) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('count', count);
        urlSearchParams.append('PropID', propId);
        urlSearchParams.append('todate', todate);
        urlSearchParams.append('FromDate', fromdate);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.apiurl + "/hotwarmcold_leads" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getlogin(username, password) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('username', username);
        urlSearchParams.append('password', password);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/login", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    loginotpsend(number) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('number', number);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/crmloginotpsending", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    otpvalidate(otp, number) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('otp', otp);
        urlSearchParams.append('number', number);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/otpvalidate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    wisherupdate(performer, birthday) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('Perform', performer);
        urlSearchParams.append('Birthday', birthday);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/wisherupdate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }
    addexecutive(params, dob) {
        var exec_name = params.name;
        var exec_num = params.mobilenum;
        var exec_dob = dob;
        var exec_mail = params.email;
        var dept_idfk = params.department;
        var desig_idfk = params.designation;
        var exec_address = params.address;
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('Name', exec_name);
        urlSearchParams.append('Mobile', exec_num);
        urlSearchParams.append('dob', exec_dob);
        urlSearchParams.append('Mail', exec_mail);
        urlSearchParams.append('DeptIDFK', dept_idfk);
        urlSearchParams.append('DesigIDFK', desig_idfk);
        urlSearchParams.append('Address', exec_address);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/addexecutive", body, { headers: headers })
            .pipe(map(response => response.json()));
    }
    customerupdate(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('IDPK', params.customer_IDPK);
        urlSearchParams.append('Name', params.customer_name);
        urlSearchParams.append('Mail', params.customer_mail);
        urlSearchParams.append('Location', params.localityid);
        urlSearchParams.append('Timeline', params.timelineid);
        urlSearchParams.append('Purpose', params.purposeid);
        urlSearchParams.append('PropType', params.proptypeid);
        urlSearchParams.append('Suggestprop', params.customer_properties);
        urlSearchParams.append('Budget', params.customer_budget);
        urlSearchParams.append('Varient', params.propertysizeid);
        urlSearchParams.append('AssignID', params.customer_assign_IDPK);
        urlSearchParams.append('Status', params.statusid);
        urlSearchParams.append('Address', params.customer_address);
        urlSearchParams.append('Phase', params.customer_phaseid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/updateCustomer", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    updatexecutives(params, dob) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('Id', params.executives_IDPK);
        urlSearchParams.append('Name', params.executives_name);
        urlSearchParams.append('Mobile', params.executives_number);
        urlSearchParams.append('dob', dob);
        urlSearchParams.append('Mail', params.executives_email);
        urlSearchParams.append('DeptIDFK', params.exec_dept_IDFK);
        urlSearchParams.append('DesigIDFK', params.exec_desig_IDFK);
        urlSearchParams.append('Address', params.executive_address);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/updateexecutive", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getdepartments() {
        return this._http.get(this.apiurl + "/get_departments").map((response: Response) => response.json().Departments);
    }

    //common used in executive page
    getdesignations(departid) {
        return this._http.get(this.apiurl + "/get_designations/" + departid).map((response: Response) => response.json().Designations);
    }

    getexecuitiveview(id) {
        return this._http.get(this.apiurl + "/execuitiveview/" + id).map((response: Response) => response.json().Execuitiveview);
    }

    leaderdesignation() {
        return this._http.get(this.apiurl + "/getleaderdesigs").map((response: Response) => response.json().Leaderdesignation);
    }

    getleaders(id) {
        return this._http.get(this.apiurl + "/getteamleaders/" + id).map((response: Response) => response.json().Teamleaders);
    }
    getteam(id) {
        return this._http.get(this.apiurl + "/getteammembers/" + id).map((response: Response) => response.json().Teammembers);
    }
    getcities() {
        return this._http.get(this.newapiurl + "/getcity").map((response: Response) => response.json().citylists);
    }

    addteam(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('DesigIDFK', param.designation);
        urlSearchParams.append('TLEXID', param.teamleader);
        urlSearchParams.append('Leadername', param.teamleadername);
        urlSearchParams.append('Exec_idfk', param.members);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/addteam", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    assignedteam() {
        return this._http.get(this.apiurl + "/teamview").map((response: Response) => response.json().Teamview);
    }

    deleteteam(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('DeleteID', id);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/teamdelete", body, { headers: headers })
            .pipe(map(response => response.json()));
    }


    deletExecutive(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('Id', id);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.apiurl + "/deletexecutive", body, { headers: headers })
            .map(() => this.getexecutiveslist());
    }

    getpropertytime() {
        return this._http.get(this.apiurl + "/possessiontime")
            .pipe(map(response => response.json().PossessionTime));
    }

    getpropertypurpose() {
        return this._http.get(this.apiurl + "/propertypurpose")
            .pipe(map(response => response.json().Purpose));
    }

    getsourcelist() {
        return this._http.get(this.apiurl + "/leadsource")
            .map((response: Response) => response.json().Leadsource);
    }

    getleadcounts(fromdate, todate, source) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        urlSearchParams.set('source', source);
        return this._http
            .get(this.apiurl + "/completeleadscounts" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    getenquirylist(listParam) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', listParam.limitparam);
        urlSearchParams.set('limitrows', listParam.limitrows);
        urlSearchParams.set('source', listParam.source);
        urlSearchParams.set('cityid', listParam.cityid);
        urlSearchParams.set('leads', listParam.leads);
        urlSearchParams.set('count', listParam.count);
        return this._http
            .get(this.apiurl + "/enquirylistnewC" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }


    fetchbuilderleads(property, limitrows, limitparam) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('property', property);
        urlSearchParams.set('limit', limitparam);
        urlSearchParams.set('limitrows', limitrows);
        return this._http
            .get(this.apiurl + "/builderleadsfetch" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    //comm
    getpropertytypelist() {
        return this._http.get(this.apiurl + "/propertytype")
            .pipe(map(response => response.json().PropertyTypes));
    }

    //comm
    getbhk() {
        return this._http.get(this.apiurl + "/getbhk")
            .pipe(map(response => response.json().Bhksize));
    }

    customersupport() {
        return this._http.get(this.apiurl + "/telecallers")
            .pipe(map(response => response.json().Telecallers));
    }

    sourcelist() {
        return this._http.get(this.apiurl + "/sources")
            .pipe(map(response => response.json().Sources));
    }

    // to be rem
    localitylist() {
        return this._http.get(this.apiurl + "/localitylist")
            .pipe(map(response => response.json().Localities));
    }



    passwordupdate(id, param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('ID', id);
        urlSearchParams.append('Password', param.repassword);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/changepassword", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    telecallerreassign(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadId', params.selectedleadid);
        urlSearchParams.append('TeleCallID', params.customersupport);
        urlSearchParams.append('TeleCallerName', params.telecallername);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/reassigntelecall", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //to be rem
    leadstatus() {
        return this._http.get(this.apiurl + "/status_check")
            .pipe(map(response => response.json().Status));
    }



    getcsactivelead(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSid', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/csactiveleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSActiveleads));
    }

    getcstotalassign(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSid', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/cstotalassignleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSAssignedleads));
    }

    getexecleadslist(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('Execid', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/activeleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().Activeleads));
    }

    getactiveleadslist(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('status', param.stages);
        urlSearchParams.set('OnlyRM', param.onlyrm);
        urlSearchParams.set('OnlyCS', param.onlycs);
        urlSearchParams.set('Unassign', param.unassign);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/activeleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().Activeleads));
    }

    getactivermleadslist(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('status', param.stages);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/activermleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().ActiveRMleads));
    }


    getactivecsleadslist(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('status', param.stages);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/activecsleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().ActiveCSleads));
    }

    gettodaymeetings(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('status', param.stages);
        urlSearchParams.set('OnlyRM', param.onlyrm);
        urlSearchParams.set('OnlyCS', param.onlycs);
        urlSearchParams.set('Unassign', param.unassign);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/todaymeetings?", { search: urlSearchParams })
            .pipe(map(response => response.json().Todaymeeting));
    }

    gettodaymeetingscounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('status', param.status);
        urlSearchParams.set('OnlyRM', param.onlyrm);
        urlSearchParams.set('OnlyCS', param.onlycs);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/todaymeetingscounts?", { search: urlSearchParams })
            .pipe(map(response => response.json().meetingcounts));
    }

    getmissedmeetings(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('status', param.stages);
        urlSearchParams.set('OnlyRM', param.onlyrm);
        urlSearchParams.set('OnlyCS', param.onlycs);
        urlSearchParams.set('Unassign', param.unassign);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/missedmeetings?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getmissedmeetingscounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('status', param.status);
        urlSearchParams.set('OnlyRM', param.onlyrm);
        urlSearchParams.set('OnlyCS', param.onlycs);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/missedmeetingscounts?", { search: urlSearchParams })
            .pipe(map(response => response.json().missedcounts));
    }

    getactiveleadscounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('status', param.status);
        urlSearchParams.set('OnlyRM', param.onlyrm);
        urlSearchParams.set('OnlyCS', param.onlycs);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/activecountsleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().Activecounts));
    }

    getactivecsleadscounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('status', param.status);
        urlSearchParams.set('OnlyCS', param.onlycs);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/activecscountsleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().ActiveCScounts));
    }

    getactivermleadscounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('status', param.status);
        urlSearchParams.set('OnlyRM', param.onlyrm);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/activermcountsleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().ActiveRMcounts));
    }

    Rmfollowups(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('FSid', param.sectionid);
        return this._http.get(this.apiurl + "/assignedrmfollowups?", { search: urlSearchParams })
            .pipe(map(response => response.json().AssignedrmFollowups));
    }

    Rmfollowupcounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('RMid', param.rmid);
        return this.http
            .get(this.apiurl + "/assignedrmfollowupcounts?", { search: urlSearchParams })
            .pipe(map(response => response.json().Assignedrmfollowupcounts));
    }

    Csfollowups(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('FSid', param.sectionid);
        return this._http.get(this.apiurl + "/assignedcsfollowups?", { search: urlSearchParams })
            .pipe(map(response => response.json().AssignedcsFollowups));
    }

    Csfollowupcounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('CSid', param.csid);
        return this.http
            .get(this.apiurl + "/assignedcsfollowupcounts?", { search: urlSearchParams })
            .pipe(map(response => response.json().Assignedcsfollowupcounts));
    }

    followup(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('FSid', param.sectionid);
        urlSearchParams.set('OnlyRM', param.onlyrm);
        urlSearchParams.set('OnlyCS', param.onlycs);
        return this._http.get(this.apiurl + "/followups?", { search: urlSearchParams })
            .pipe(map(response => response.json().Followups));
    }

    followupcounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('OnlyRM', param.onlyrm);
        urlSearchParams.set('OnlyCS', param.onlycs);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/followupcounts?", { search: urlSearchParams })
            .pipe(map(response => response.json().Followupcounts));
    }

    getexecinactive(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('Execid', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/inactiveleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().Inactiveleads));
    }

    getcustinactive(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSid', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/csinactiveleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSInActiveleads));
    }

    getinactiveleadslist() {
        return this._http.get(this.apiurl + "/inactiveleads").map((response: Response) => response.json().Inactiveleads);
    }


    getDashboardCount(param) {
        //add search url params 
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('rmid', param.rmid);
        urlSearchParams.set('propId', param.propid);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate); 
        urlSearchParams.set('team', param.team);
        return this._http.get(this.retailApi + "/dashboardcountsadmin").map((response: Response) => response.json());
    }
    
    getdashfilter(id) {
        return this._http.get(this.apiurl + "/getdashfilter/" + id).map((response: Response) => response.json().FilterCounts);
    }

    gettldashcounts(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getcountsRMTL?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMTLCounts));
    }

    getcsdashcounts(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getcsexeccounts?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSEXECCounts));
    }

    junkdatas(id) {
        return this._http.get(this.apiurl + "/junkdatas/" + id).map((response: Response) => response.json().Junkdatas);
    }

    getmyteam(id) {
        return this._http.get(this.apiurl + "/getmyteam/" + id).map((response: Response) => response.json().Myteam);
    }

    getDashboardtotal() {
        return this._http.get(this.apiurl + "/execquickview").map((response: Response) => response.json().Dashtotal);
    }

    gettlquickview(id) {
        return this._http.get(this.apiurl + "/tlquickview/" + id).map((response: Response) => response.json().quickview);
    }

    getCSmeetings(id) {
        return this._http.get(this.apiurl + "/CStodaymeeting/" + id).map((response: Response) => response.json().Todaymeeting);
    }

    //tobe rem
    getfollowuplist(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getfollowuplist?", { search: urlSearchParams })
            .pipe(map(response => response.json().Getfollowuplist));
    }

    getface2facelist(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getface2facelist?", { search: urlSearchParams })
            .pipe(map(response => response.json().Getface2facelist));
    }
    getcsface2face(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getcsface2face?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSface2facelist));
    }

    getuniquevisit(id) {

        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getuniquevisit?", { search: urlSearchParams })
            .pipe(map(response => response.json().Getuniquevisit));
    }

    getcsuniquevisit(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getcsuniquevisit?", { search: urlSearchParams })
            .pipe(map(response => response.json().Getuniquevisit));
    }

    getsv(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getsv?", { search: urlSearchParams })
            .pipe(map(response => response.json().Getsv));
    }

    getCSsv(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getcssv?", { search: urlSearchParams })
            .pipe(map(response => response.json().Getsv));
    }

    getrepeatvisit(id) {

        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getrepeatvisit?", { search: urlSearchParams })
            .pipe(map(response => response.json().Getrepeatvisit));
    }

    getCSrsv(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/csrsvlist?", { search: urlSearchParams })
            .pipe(map(response => response.json().Getrepeatvisit));
    }

    getfinalnegotiate(id) {

        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/getfinalnegotiate?", { search: urlSearchParams })
            .pipe(map(response => response.json().Getfinalnegotiate));

    }

    getCSnegotiate(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/csnegotiate?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSnegotiate));
    }

    getclosures() {
        return this._http.get(this.apiurl + "/closures").map((response: Response) => response.json().bookingclosures);
    }

    //tobe rem
    getclosedcustomerview(id) {
        return this._http.get(this.apiurl + "/getclosedcustomerview/" + id)
            .pipe(map(response => response.json().ClosureView));
    }

    search(param) {
        return this._http.get(this.apiurl + "/searchlist/" + param).map((response: Response) => response.json().Searchlist);
    }

    mandatesearch(param, userid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('execid', userid);
        return this._http.get(this.apiurl + "/mandatesearchlist/" + param + "?", { search: urlSearchParams }).map((response: Response) => response.json().Searchlist);
    }

    addlead(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('Name', params.customer_name);
        urlSearchParams.append('Number', params.customer_number);
        urlSearchParams.append('Source', params.customer_source_IDPK);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/addlead", body, { headers: headers })
            .pipe(map(response => response.json()));
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

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/addenquiry", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    // CODEIGNITER api Ends



    getExecutivesview() {
        return this._http.get(this.urlPrefix + "/quickview").map((response: Response) => response.json().Quickview);
    }
    getfilter() {
        return this._http.get(this.urlPrefix + "/filter").map((response: Response) => response.json().filterview);
    }
    getcounts() {
        return this._http.get(this.urlPrefix + "/Counts").map((response: Response) => response.json().Countview);
    }

    //to be rem
    getstageslist() {
        return this._http.get(this.urlPrefix + "/getstages")
            .map((response: Response) => response.json().Sections);
    }
    getbuilderslist() {
        return this._http.get(this.urlPrefix_web + "/get_bulidersInfo").map((response: Response) => response.json().details);
    }
    getpropertylist() {
        return this._http.get(this.urlPrefix_web + "/get_PropertyName").map((response: Response) => response.json().details);
    }
    //tobe rem
    getpropertylist_ID(val) {
        return this._http.get(this.urlPrefix_web + "/get_PropertyName?buliderId=" + val).map((response: Response) => response.json().details);
    }
    //to be rem
    getpropertydroplist() {
        return this._http.get(this.urlPrefix + "/propertylist").map((response: Response) => response.json().PropertyList);
    }

    getwish() {
        return this._http.get(this.urlPrefix + "/wishing").map((response: Response) => response.json().wishinglist);
    }


    revertenquiry() {
        return this._http.get(this.urlPrefix + "/revertjunk").map((response: Response) => response.json().Junkfiles);
    }

    // integrating chai api

    // getcustomers() {
    //     return this._http.get(this.urlPrefix + "/getcustomers").map((response: Response) => response.json().Customers);
    // }

//tobe rem
    getfollowupcustomeredit(id) {
        return this._http.get(this.urlPrefix + "/getfollowupcustomerview/" + id)
            .pipe(map(response => response.json().Followupcustomer));
    }

//tobe rem
    getfacecustomeredit(id) {
        return this._http.get(this.urlPrefix + "/getfaceupcustomerview/" + id)
            .pipe(map(response => response.json().Facecustomer));
    }

    //to be rem
    getusvcustomerview(id) {
        return this._http.get(this.urlPrefix + "/getusvcustomerview/" + id)
            .pipe(map(response => response.json().Usvcustomer));
    }
 //tobe rem
    getsvcustomerview(id) {
        return this._http.get(this.urlPrefix + "/getsvcustomerview/" + id)
            .pipe(map(response => response.json().Svcustomer));
    }

//tobe rem
    getrsvcustomerview(id) {
        return this._http.get(this.urlPrefix + "/getrsvcustomerview/" + id)
            .pipe(map(response => response.json().Rsvcustomer));
    }

//tobe rem
    getfinalcustomerview(id) {
        return this._http.get(this.urlPrefix + "/getfinalcustomerview/" + id)
            .pipe(map(response => response.json().Finalcustomer));
    }


    getactivecustomerview(id) {
        return this._http.get(this.urlPrefix + "/activecustomerview/" + id).map((response: Response) => response.json().Activecustomerview);
    }

    getfacecustomerview(id) {
        return this._http.get(this.urlPrefix + "/facecustomerview/" + id).map((response: Response) => response.json().Facecustomerview);
    }


    usvcustomerview(id) {

        return this._http.get(this.urlPrefix + "/usvcustomerview/" + id).map((response: Response) => response.json().Usvcustomerview);
    }


    rsvcustomerview(id) {
        return this._http.get(this.urlPrefix + "/rsvcustomerview/" + id).map((response: Response) => response.json().Rsvcustomerview);
    }

    negotiatecstmrview(id) {
        return this._http.get(this.urlPrefix + "/negotiatecstmrview/" + id).map((response: Response) => response.json().Negotiatecstmrview);
    }


    getactiveleadphaselist() {
        return this._http.get(this.urlPrefix + "/getactiveleadphaselist").map((response: Response) => response.json().Getactiveleadphaselist);
    }


    getsearchlist() {
        return this._http.get(this.urlPrefix + "/searchlist").map((response: Response) => response.json().Searchlist);
    }

    // api is not working

    getfilteractivephase(id) {
        return this._http.get(this.urlPrefix + "/getfilteractivephase/" + id).map((response: Response) => response.json().Getfilteractivephase);
    }
    // api is not working

    // still on process
    addfollowuplist(info) {
        return this._http.post(this.urlPrefix_php + "/addfollowup.php", info)
            .map(() => "");
    }

    addrsv(info) {
        return this._http.post(this.urlPrefix_php + "/addrsv.php", info)
            .map(() => "");
    }
    addfinalnegotiate(info) {
        return this._http.post(this.urlPrefix_php + "/addnegotiate.php", info)
            .map(() => "");
    }
    //end still on process

    // didnt work on this
    updatexecutive(info) {
        return this._http.post(this.urlPrefix_php + "/addexecutive.php", info)
            .map(() => "");
    }

    //ends didnt work on this


    deletexecutive(id) {
        return this._http.post(this.urlPrefix_php + "/delete.php/", { 'delete_id': id })
            .map(() => this.getexecutiveslist());
    }

    deletejunk(id) {
        return this._http.post(this.urlPrefix_php + "/delete.php/", { 'delete_junk': id })
            .map(() => this.getjunks());
    }

    //to be rem
    addjunkhistory(leadid, nextdate, leadstage, junksection, textarearemarks, userid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('Leadstatus', leadstage);
        urlSearchParams.append('JunkSection', junksection);
        urlSearchParams.append('Actiondate', nextdate);
        urlSearchParams.append('remarks', textarearemarks);
        urlSearchParams.append('userid', userid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/addjunkleadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    datashortupdate(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('IDPK', param.leadid);
        urlSearchParams.append('name', param.name);
        urlSearchParams.append('mail', param.mail);
        urlSearchParams.append('preferdlocation', param.location);
        urlSearchParams.append('preferedtype', param.proptype);
        urlSearchParams.append('leadpossession', param.possession);
        urlSearchParams.append('preferedvarient', param.size);
        urlSearchParams.append('preferedbudget', param.budget);
        urlSearchParams.append('leadaddress', param.address);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/updateshortdata", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    gethistory(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('RoleID', param.roleid);
        urlSearchParams.append('UserID', param.userid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/leadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getexecutiveslist() {
        return this._http.get(this.apiurl + "/getexecutiveslist").map((response: Response) => response.json().Executiveslist);
    }

    //to be rem
    getexecutivesbasedid(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        return this._http
            .get(this.apiurl + "/execbdondesigs" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Executiveslist));
    }

    getexecutivesbasedfilter(id, execid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        urlSearchParams.set('EXEC_ID', execid);
        return this._http
            .get(this.apiurl + "/execbdondesigs" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Executiveslist));
    }

    getregistrationlist(limitparam, limitrows, fromdate, todate) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', limitparam);
        urlSearchParams.set('limitrows', limitrows);
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        return this._http
            .get(this.apiurl + "/registrations" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Registrations));
    }

    getregistrationlistcounts(fromdate, todate) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        return this._http
            .get(this.apiurl + "/registrationcounts" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().RegistrationCounts));
    }


    followuprm(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('RMID', id);
        return this._http
            .get(this.apiurl + "/followuprmbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMLeadlists));
    }
    followupcs(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSID', id);
        return this._http
            .get(this.apiurl + "/followupcsbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSLeadlists));
    }

    face2face() {
        return this._http.get(this.apiurl + "/f2flists").map((response: Response) => response.json().face2face);
    }
    face2facerm(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('RMID', id);
        return this._http
            .get(this.apiurl + "/f2frmbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMLeadlists));
    }
    face2facecs(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSID', id);
        return this._http
            .get(this.apiurl + "/f2fcsbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSLeadlists));
    }

    getusv() {
        return this._http.get(this.apiurl + "/usvlists").map((response: Response) => response.json().usvlist);
    }
    getrmusv(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('RMID', id);
        return this._http
            .get(this.apiurl + "/usvrmbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMLeadlists));
    }
    getcsusv(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSID', id);
        return this._http
            .get(this.apiurl + "/usvcsbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSLeadlists));
    }

    getsvlist() {
        return this._http.get(this.apiurl + "/svlists").map((response: Response) => response.json().svlist);
    }
    getrmsvlist(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('RMID', id);
        return this._http
            .get(this.apiurl + "/svrmbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMLeadlists));
    }
    getcssvlist(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSID', id);
        return this._http
            .get(this.apiurl + "/svcsbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSLeadlists));
    }

    getrsv() {
        return this._http.get(this.apiurl + "/rsvlists").map((response: Response) => response.json().rsvlist);
    }
    getrmrsv(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('RMID', id);
        return this._http
            .get(this.apiurl + "/rsvrmbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMLeadlists));
    }
    getcsrsv(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSID', id);
        return this._http
            .get(this.apiurl + "/rsvcsbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSLeadlists));
    }

    getnegotiatelist() {
        return this._http.get(this.apiurl + "/negotiatelists").map((response: Response) => response.json().negotiatelist);
    }
    getnegotiatelistrm(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('RMID', id);
        return this._http
            .get(this.apiurl + "/negotiatelistsrmbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMLeadlists));
    }
    getnegotiatelistcs(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSID', id);
        return this._http
            .get(this.apiurl + "/negotiatelistscsbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSLeadlists));
    }
    getclosedlists(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('RMid', param.rmid);
        urlSearchParams.set('CSid', param.csid);
        urlSearchParams.set('OnlyRM', param.onlyrm);
        urlSearchParams.set('OnlyCS', param.onlycs);
        return this._http
            .get(this.apiurl + "/closedlists" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().closedlist));
    }
    getclosedlistsrm(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('RMID', id);
        return this._http
            .get(this.apiurl + "/closedlistsrmbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMLeadlists));
    }
    getclosedlistscs(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSID', id);
        return this._http
            .get(this.apiurl + "/closedlistscsbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSLeadlists));
    }


    getjunks() {
        return this._http.get(this.apiurl + "/junklists").map((response: Response) => response.json().junklist);
    }

    getjunksrm(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('RMID', param.rmid);
        return this._http
            .get(this.apiurl + "/junklistsrmbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMLeadlists));
    }

    getjunkscs(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('CSID', param.csid);
        return this._http
            .get(this.apiurl + "/junklistscsbase" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSLeadlists));
    }

    leadassigncs(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('CSID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/csleadassign", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    leadassignrm(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/Rmleadassign", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    reassignrm(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('NEWRMID', param.reassignedto);
        urlSearchParams.append('LeadID', param.assignedleads);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/reassignrmlead", body, { headers: headers })
            .pipe(map(response => response.json()));
    }



    reassigncs(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('NEWCSID', param.reassignedto);
        urlSearchParams.append('LeadID', param.assignedleads);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/reassigncslead", body, { headers: headers })
            .pipe(map(response => response.json()));
    }


    getcsassignlead(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSid', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/csassignleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSAssignedleads));
    }

    getrmassignlead(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('RMid', id);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.apiurl + "/rmassignleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMAssignedleads));
    }

    completeassignedRMLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.datefrom);
        urlSearchParams.set('ToDate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('stage', param.stage);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('stagestatus', param.stagestatus);
        urlSearchParams.set('rmid', param.executid);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('loginid', param.loginuser);
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('priority', param.priority);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        return this.http
            .get(this.retailApi + "/retail_visits?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getExecutiveInfo(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('PropID', param.propId);
        urlSearchParams.set('FromDate', param.fromDate);
        urlSearchParams.set('todate', param.todate);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('ExecId', param.execId);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.apiurl + "/execquickview", { search: urlSearchParams })
            .pipe(map(response => response.json()))
    }

    getCountForDashBoard(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.datefrom);
        urlSearchParams.set('ToDate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('stage', param.stage);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('stagestatus', param.stagestatus);
        urlSearchParams.set('rmid', param.executid);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('loginid', param.loginuser);
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('priority', param.priority);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.retailApi + "/retail_visit_counts?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    assignedLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.datefrom);
        urlSearchParams.set('ToDate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('stage', param.stage);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('stagestatus', param.stagestatus);
        urlSearchParams.set('rmid', param.executid);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('loginid', param.loginuser);
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('priority', param.priority);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.retailApi + "/assignedleads?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }


    assignedcountsadmin(paramcounts) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', paramcounts.datefrom);
        urlSearchParams.set('ToDate', paramcounts.dateto);
        urlSearchParams.set('rmid', paramcounts.rmid);
        return this.http
            .get(this.apiurl + "/leadassignedcountsadmin?", { search: urlSearchParams })
            .pipe(map(response => response.json().AssignedLeadsCounts));
    }

    completeassignedCSLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.datefrom);
        urlSearchParams.set('ToDate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('csid', param.executid);
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        return this.http
            .get(this.apiurl + "/csleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSLeads));
    }

    completeassignedCSLeadscounts(userid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('csid', userid);
        return this.http
            .get(this.apiurl + "/csleadcounts?", { search: urlSearchParams })
            .pipe(map(response => response.json().CSLeadCounts));
    }

    getreassignleads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('NOTINRM', param.RM);
        urlSearchParams.set('NOTINCS', param.CS);
        return this.http
            .get(this.apiurl + "/reassignedleads?", { search: urlSearchParams })
            .pipe(map(response => response.json().Reassignleads));
    }

    assignedcountscsadmin(paramcounts) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', paramcounts.datefrom);
        urlSearchParams.set('ToDate', paramcounts.dateto);
        urlSearchParams.set('csid', paramcounts.csid);
        return this.http
            .get(this.apiurl + "/leadassignedcscountsadmin?", { search: urlSearchParams })
            .pipe(map(response => response.json().AssignedLeadsCounts));
    }


    //to be rem
    getfollowupsections() {
        return this._http.get(this.apiurl + "/followupcatogs").map((response: Response) => response.json().followupCategories);
    }

    //tobe rem
    getcustomeredit(id) {
        return this._http.get(this.apiurl + "/geteditcustomer/" + id).map((response: Response) => response.json().Customerview);
    }

    //to be rem
    getassignedrm(id, loginid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('loginid', loginid);
        return this._http.get(this.apiurl + "/getassignedrm/" + id + "?", { search: urlSearchParams }).map((response: Response) => response.json().RMname);
    }
    getassignedrmretail(id, loginid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('loginid', loginid);
        return this._http.get(this.apiurl + "/getassignedrmretail/" + id + "?", { search: urlSearchParams }).map((response: Response) => response.json().RMname);
    }

    //tobe rem
    getassignedcs(id) {
        return this._http.get(this.apiurl + "/getassignedcs/" + id).map((response: Response) => response.json().CSname);
    }
    getPropertyDetails() {
        return this.http.get(this.urlPrefix_web + 'get_PropertyName')
            .pipe(retry(3), catchError(this.handleError));
    }

    //tobe rem
    propertylist(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('leadid', params.leadid);
        urlSearchParams.set('execid', params.execid);
        return this._http.get(this.newapiurl + "/propertylist?", { search: urlSearchParams })
            .pipe(map(response => response.json().Properties));
    }

    getvisitpropertyothers(leadid, loginid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('Execid', loginid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/visitedwithothers", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    getsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('Execid', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/suggestedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    addsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('execid', param.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/addsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    addvisitedpropertiesothers(param2) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param2.leadid);
        urlSearchParams.append('PropertyID', param2.visitedproperties);
        urlSearchParams.append('execid', param2.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiurl + "/addvisitedpropertiesothers", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    addleadhistory(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Leadstatus', param.leadstage);
        urlSearchParams.append('Actiondate', param.closedate);
        urlSearchParams.append('Actiontime', param.closetime);
        urlSearchParams.append('Stagestatus', param.stagestatus);
        urlSearchParams.append('remarks', param.textarearemarks);
        urlSearchParams.append('userid', param.userid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('property', param.property);
        urlSearchParams.append('BHK', param.bhk);
        urlSearchParams.append('BhkUnit', param.bhkunit);
        urlSearchParams.append('dimension', param.dimension);
        urlSearchParams.append('ratepersft', param.ratepersft);
        urlSearchParams.append('autoremarks', param.autoremarks);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/addleadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    addselectedsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/selectedsuggestproperty", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    addselectedsuggestedpropertiesrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/selectedsuggestpropertyrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addsvselectedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/svselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addsvselectedpropertiesrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/svselectedpropertiesrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //to be rem
    addrsvselected(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/rsvselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    addrsvselectedrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/rsvselectedpropertiesrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addnegoselected(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/negotiationselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    addnegoselectedrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/negotiationselectedpropertiesrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addclosedselected(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/closedselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    removeselectedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('stage', param.stage);
        urlSearchParams.append('Execid', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/removeselectedproperty", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    getnonselectedproperties(leadid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/getnonselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    getselectedsuggestproperties(leadid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/getselectedsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }
//tobe rem
    getmandateselectedsuggestproperties(leadid, execid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('Execid', execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/mandategetselectedsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    svselectproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('execid', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/getsvselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //to be removed
    rsvselectproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('execid', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/getrsvselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    negoselectproperties(leadid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/getnegotiationselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //to be rem
    getvisitedsuggestproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('Stage', param.stage);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/getsuggestvisitedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getvisitedsuggestpropertiesretail(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('Stage', param.stage);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getsuggestvisitedpropertiesretail", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    getnegotiatedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Stage', param.stage);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/getvisitednegotiated", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //to be remo
    getcancelledsuggestproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Stage', param.stage);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/getsuggestcancelledproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    addpropertyvisitupdate(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('PropertyID', param.propid);
        urlSearchParams.append('ActionID', param.visitupdate);
        urlSearchParams.append('Remarks', param.remarks);
        urlSearchParams.append('Stage', param.stage);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/propertyvisitupdate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //tobe rem
    getactiveleadsstatus(leadid, userid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('ExecID', userid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/getactiveleadsstatus", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //to be rem
    getjunksections() {
        return this._http.get(this.newapiurl + "/junkcatogs").map((response: Response) => response.json());
    }

    //tobe rem
    addfollowuphistory(followups) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', followups.leadid);
        urlSearchParams.append('Leadstatus', followups.leadstatus);
        urlSearchParams.append('Stagestatus', followups.stagestatus);
        urlSearchParams.append('FollowupSection', followups.followupsection);
        urlSearchParams.append('Actiondate', followups.actiondate);
        urlSearchParams.append('Actiontime', followups.actiontime);
        urlSearchParams.append('remarks', followups.followupremarks);
        urlSearchParams.append('userid', followups.userid);
        urlSearchParams.append('assignID', followups.assignid);
        urlSearchParams.append('autoremarks', followups.autoremarks);
        urlSearchParams.append('property', followups.property);
        // urlSearchParams.append('CSID', csid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/addfollowupleadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    builderlist() {
        return this._http.get(this.newapiurl + "/getbuilders")
            .pipe(map(response => response.json().Builders));
    }
    
    getpropertiesbybuilder(builderid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('BuilderID', builderid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/getpropertybybuilder", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('BuildID', param.builderid);
        urlSearchParams.append('PropertyID', param.properties);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/addproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    propertylistnew() {
        return this._http.get(this.retailApi + "/propertynewlists")
            .pipe(map(response => response.json().Properties));
    }

    getnotintrestsections() {
        return this._http.get(this.newapiurl + "/notintrestcatogs").map((response: Response) => response.json());
    }

    //tobe rem
    public uploadFile(data) {
        return this._http
            .post(this.newapiurl + '/closurefileuploads', data)
            .pipe(map(response => response.json()));
    }

    //tobe rem
    fetchrequestedvalues(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropID', param.propid);
        urlSearchParams.append('ExecID', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/closerequestedvalues", body, { headers: headers })
            .pipe(map(response => response.json()));
    }


    //tobe rem
    closingrequestresponse(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropID', param.propid);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('statusid', param.statusid);
        urlSearchParams.append('remarks', param.remarks);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/closerequestresponse", body, { headers: headers })
            .pipe(map(response => response.json()));
    }


    //tobe rem
    requestresubmition(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropID', param.propid);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('bhk', param.bhk);
        urlSearchParams.append('bhkunit', param.bhkunit);
        urlSearchParams.append('dimension', param.dimension);
        urlSearchParams.append('ratepersqft', param.ratepersqft);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/closureresubmition", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    movetoretail() {
        return this._http.get(this.newapiurl + "/movetoretail").map((response: Response) => response.json());
    }

    getmandateprojects() {
        return this._http.get(this.newapiurl + "/mandateprojects").map((response: Response) => response.json());
    }

    //commom used in dashboard
    fetchmandateexecutuves(propid, team) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('PropID', propid);
        urlSearchParams.append('team', team);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/mandateexecutives", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //to be rem
    checkdirectteamexist(propid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('PropID', propid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.newapiurl + "/directteamexistchecker", body, { headers: headers })
            .pipe(map(response => response.json()));
    }


    leadassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/leadassign", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getnonselectedpropertiesretail(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('ExecID', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getnonselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getselectedsuggestpropertiesretail(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('ExecID', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getselectedsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getcancelledsuggestpropertiesretail(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('ExecID', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getsuggestcancelledproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    svselectpropertiesretail(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('ExecID', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getsvselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addpropertyvisitupdate_indirect(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('PropertyID', param.propid);
        urlSearchParams.append('ActionID', param.visitupdate);
        urlSearchParams.append('Remarks', param.remarks);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('Stagestatus', param.stagestatus);
        urlSearchParams.append('Actiondate', param.closedate);
        urlSearchParams.append('Actiontime', param.closetime);
        urlSearchParams.append('accompaniedid', param.accompany);
        urlSearchParams.append('visittype', param.visittype);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/propertyvisitupdate_indirect", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addpropertyvisitupdate_direct(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('PropertyID', param.propid);
        urlSearchParams.append('ActionID', param.visitupdate);
        urlSearchParams.append('Remarks', param.remarks);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('Stagestatus', param.stagestatus);
        urlSearchParams.append('Actiondate', param.closedate);
        urlSearchParams.append('Actiontime', param.closetime);
        urlSearchParams.append('accompaniedid', param.accompany);
        urlSearchParams.append('visittype', param.visittype);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/propertyvisitupdate_direct", body, { headers: headers })
            .pipe(map(response => response.json()));
    }


    //   Listners Services Starts

    // mouseenterlisten(): Observable<any> {
    //     return this.mouseenter_listners.asObservable();
    //   }

    // mouseenterservice() {
    //     this.mouseenter_listners.next();
    //   }

    //   Listners Services Ends



}