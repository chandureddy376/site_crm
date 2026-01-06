import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from "@angular/http";
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { _throw } from 'rxjs/observable/throw';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable()

export class mandateservice implements OnInit {

    indiaestatesapi: string;
    mandateUrl: string;
    mandateUrlSwitching: string;
    otpURl: string;
    private controlNameSub: Subscription;

    constructor(private _http: Http, private http: Http, private router: Router) {
        this.mandateUrl = 'https://superadmin-azure.right2shout.in/mandatecrm_test';
        this.otpURl = 'https://api.right2shout.in/backend';
        this.indiaestatesapi = 'https://www.indiaestates.in';
    }

    ngOnInit() { }

    private controllName = new BehaviorSubject<string>('');
    controllerName$ = this.controllName.asObservable();

    setControllerName(name) {
        this.controllName.next(name);
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

    getReportExecs(fromdate, todate) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('fromdate', fromdate);
        urlSearchParams.set('todate', todate);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        return this.http
            .get(this.mandateUrl + "/activity_report?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    //to get the exec today's scheldue  data for mandate dashboard
    getExecutiveScheldueTodayInfo(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('PropID', param.propId);
        urlSearchParams.set('todate', param.todate);
        urlSearchParams.set('FromDate', param.fromDate);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('ExecId', param.execId);
        urlSearchParams.append('roleId', param.role);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.mandateUrl + "/scheduledtoday_execquickview", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    //to get the exec overall scheldue  data for mandate dashboard
    getExecutiveInfo(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('PropID', param.propId);
        urlSearchParams.set('FromDate', param.fromDate);
        urlSearchParams.set('todate', param.todate);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('ExecId', param.execId);
        urlSearchParams.append('roleId', param.role);
        urlSearchParams.append('leads', param.leads);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.mandateUrl + "/execquickview", { search: urlSearchParams })
            .pipe(map(response => response.json()))
    }

    //to get the mandate projects list for mandate dash
    getmandateprojects() {
        let userid = localStorage.getItem('UserId');
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('execid', userid);
        return this._http.get(this.mandateUrl + "/mandateprojects", { search: urlSearchParams }).map((response: Response) => response.json());
    }

    //to get the whether the direct team exist or no
    checkdirectteamexist(propid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('PropID', propid);
        let body = urlSearchParams.toString()
        var headers = new Headers();

        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/directteamexistchecker", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //to get th data of hot,warm,cold in mandate dash
    getHotColdWarmCount(count, propId, todate, fromdate, team, execId, role) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('count', count);
        urlSearchParams.append('PropID', propId);
        urlSearchParams.append('ToDate', todate);
        urlSearchParams.append('FromDate', fromdate);
        urlSearchParams.append('team', team);
        urlSearchParams.append('ExecId', execId);
        urlSearchParams.append('roleId', role);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.mandateUrl + "/hotwarmcold_leads" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    csPropertylist(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('leadid', params.leadid);
        urlSearchParams.set('Execid', params.execid);
        urlSearchParams.set('loginid', params.loginid);
        return this._http.get(this.mandateUrl + "/propertylist?", { search: urlSearchParams })
            .pipe(map(response => response.json().Properties));
    }

    csAddsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/addsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getmandatelist() {
        let userid = localStorage.getItem('UserId');
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('execid', userid);
        // , { search: urlSearchParams }
        return this._http.get(this.mandateUrl + "/mandateprojects", { search: urlSearchParams }).map((response: Response) => response.json().Properties);
    }

    getmandateleads(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', params.limit);
        urlSearchParams.set('limitrows', params.limitrows);
        urlSearchParams.set('FromDate', params.fromdate);
        urlSearchParams.set('ToDate', params.todate);
        urlSearchParams.set('property', params.property);
        urlSearchParams.set('RMID', params.rmid);
        urlSearchParams.set('FRESHID', params.freshid);
        return this._http
            .get(this.mandateUrl + "/completemandateleads" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    getmandateleadcounts(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', params.fromdate);
        urlSearchParams.set('ToDate', params.todate);
        urlSearchParams.set('property', params.property);
        urlSearchParams.set('RMID', params.rmid);
        return this._http
            .get(this.mandateUrl + "/completemandateleadscounts" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Leads));
    }

    addmandatelead(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('client', params.clientname);
        urlSearchParams.append('clientnum', params.clientnumber);
        urlSearchParams.append('clientmail', params.clientmail);
        urlSearchParams.append('source', params.clientsource);
        urlSearchParams.append('propertyId', params.propid);
        urlSearchParams.append('bhksize', params.bhk);
        urlSearchParams.append('budgetrange', params.budget);
        urlSearchParams.append('sitevisitdate', params.svdate);
        urlSearchParams.append('remarks', params.remarks);
        urlSearchParams.append('rmmail', params.rmmail);
        urlSearchParams.append('rmname', params.rmname);
        urlSearchParams.append('rmid', params.rmid);
        urlSearchParams.append('usermail', params.usermail);
        urlSearchParams.append('username', params.username);
        urlSearchParams.append('userid', params.userid);
        urlSearchParams.append('regname', params.registeredname);
        urlSearchParams.append('regid', params.registeredid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/leadadding", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    rmmandateleadadd(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('client', params.clientname);
        urlSearchParams.append('clientnum', params.clientnumber);
        urlSearchParams.append('clientmail', params.clientmail);
        urlSearchParams.append('source', params.clientsource);
        urlSearchParams.append('propertyId', params.propid);
        urlSearchParams.append('bhksize', params.bhk);
        urlSearchParams.append('budgetrange', params.budget);
        urlSearchParams.append('sitevisitdate', params.svdate);
        urlSearchParams.append('remarks', params.remarks);
        urlSearchParams.append('rmmail', params.rmmail);
        urlSearchParams.append('rmname', params.rmname);
        urlSearchParams.append('rmid', params.rmid);
        urlSearchParams.append('usermail', params.usermail);
        urlSearchParams.append('username', params.username);
        urlSearchParams.append('userid', params.userid);
        urlSearchParams.append('regname', params.registeredname);
        urlSearchParams.append('regid', params.registeredid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/rmleadadding", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //Mandate customer page - this api is called on clicking edit customer.
    getcustomeredit(id) {
        return this._http.get(this.mandateUrl + "/geteditcustomer/" + id).map((response: Response) => response.json().Customerview);
    }

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
        urlSearchParams.set('feedback', followups.feedbackid);
        // urlSearchParams.append('CSID', csid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/addfollowupleadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

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
        urlSearchParams.append('closedleadID', param.closedleadID);
        urlSearchParams.append('weekplan', param.weekplan);
        urlSearchParams.set('feedback', param.feedbackid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/addleadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //Mandate-customer page - on clicking on the name in mandate leads page table used to get the info of customer.
    getassignedrm(id, loginid, execid, feedbackid) {
        let urlSearchParams = new URLSearchParams();
        // urlSearchParams.set('id', id);
        urlSearchParams.set('loginid', loginid);
        urlSearchParams.set('execid', execid);
        urlSearchParams.set('feedback', feedbackid);
        return this._http.get(this.mandateUrl + "/getassignedrm/" + id + "?", { search: urlSearchParams }).map((response: Response) => response.json());
    }

    //to get the count of the dashboards.
    getDashboardCount(rmid, propid, fromdate, todate, team) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('rmid', rmid);
        urlSearchParams.set('propId', propid);
        urlSearchParams.set('FromDate', fromdate);
        urlSearchParams.set('ToDate', todate);
        urlSearchParams.set('team', team);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.get(this.mandateUrl + "/mandate_leads_count", { search: urlSearchParams }).map((response: Response) => response.json());
    }

    //Mandate-customer page - to get the leads status.
    getactiveleadsstatus(leadid, userid, assignid, propid, feedbackid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('ExecID', userid);
        urlSearchParams.append('assignID', assignid);
        urlSearchParams.set('propId', propid);
        urlSearchParams.set('feedback', feedbackid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/getactiveleadsstatus", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    gethistory(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('RoleID', param.roleid);
        urlSearchParams.append('UserID', param.userid);
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.set('feedback', param.feedbackid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/leadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
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
            .get(this.mandateUrl + "/todaymeetings?", { search: urlSearchParams })
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
            .get(this.mandateUrl + "/todaymeetingscounts?", { search: urlSearchParams })
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
            .get(this.mandateUrl + "/missedmeetings?", { search: urlSearchParams })
            .pipe(map(response => response.json().Missedmeeting));
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
            .get(this.mandateUrl + "/missedmeetingscounts?", { search: urlSearchParams })
            .pipe(map(response => response.json().missedcounts));
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
            .get(this.mandateUrl + "/rmleads?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    completeassignedRMLeadscounts(countparam) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', countparam.fromdate);
        urlSearchParams.set('ToDate', countparam.todate);
        urlSearchParams.set('rmid', countparam.executid);
        return this.http
            .get(this.mandateUrl + "/rmleadcounts?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMLeadCounts));
    }

    leadassignrm(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/Rmleadassign", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //mandate-customer page used to assign the lead to executive 
    leadassign(param, propId, randomval, loginid, visits) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('propID', propId);
        urlSearchParams.append('random', randomval);
        urlSearchParams.append('loginId', loginid);
        urlSearchParams.append('visits', visits);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/leadassign", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    ranavleadassign(param, propId, randomval, loginid, visits) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('propID', propId);
        urlSearchParams.append('random', randomval);
        urlSearchParams.append('loginId', loginid);
        urlSearchParams.append('visits', visits);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/leadassign", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //mandate assigned leads section leads reassign.
    leadreassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('propID', param.propId);
        urlSearchParams.append('random', param.randomval);
        urlSearchParams.append('loginId', param.loginid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('FromExecids', param.executiveIds);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/leadreassign_mandate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    ranavleadreassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('propID', param.propId);
        urlSearchParams.append('random', param.randomval);
        urlSearchParams.append('loginId', param.loginid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('FromExecids', param.executiveIds);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/leadreassign_mandate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //mandate assigned leads section leads transfer nly for team lead.
    leadAcessTransfer(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadId', param.assignedleads);
        urlSearchParams.append('LoginId', param.loginid);
        urlSearchParams.append('PropId', param.propId);
        urlSearchParams.append('FromExecId', param.executiveIds);
        urlSearchParams.append('ToExecId', param.customersupport);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/changeleadaccess", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //retail assigned leads section leads reassign.
    feedbackassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('random', param.randomval);
        urlSearchParams.append('loginId', param.loginid);
        urlSearchParams.append('FromExecids', param.executiveIds);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/assignfeedback", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    inactiveJunkLeadreassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('propID', param.propId);
        urlSearchParams.append('random', param.randomval);
        urlSearchParams.append('loginId', param.loginid);
        urlSearchParams.append('FromExecids', param.executiveIds);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/junkreassign_mandate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    ranavinactiveJunkLeadreassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('propID', param.propId);
        urlSearchParams.append('random', param.randomval);
        urlSearchParams.append('loginId', param.loginid);
        urlSearchParams.append('FromExecids', param.executiveIds);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/junkreassign_mandate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    completejunks(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.datefrom);
        urlSearchParams.set('ToDate', param.dateto);
        urlSearchParams.set('rmid', param.executid);
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        return this.http
            .get(this.mandateUrl + "/getjunk?", { search: urlSearchParams })
            .pipe(map(response => response.json().RMLeads));
    }

    cplists() {
        return this._http.get(this.indiaestatesapi + "/cplists")
            .pipe(map(response => response.json().CPlists));
    }

    addcp(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('name', param.cpname);
        urlSearchParams.append('person', param.person);
        urlSearchParams.append('number', param.cpnumber);
        urlSearchParams.append('mail', param.cpmail);
        urlSearchParams.append('secondarymail', param.cpsecondmail);
        urlSearchParams.append('addedby', param.addeduser);
        urlSearchParams.append('rerano', param.rera);
        urlSearchParams.append('gstno', param.gst);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.indiaestatesapi + "/addcp", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    mandaterequestlists() {
        return this._http.get(this.indiaestatesapi + "/builderlists")
            .pipe(map(response => response.json().BuilderLists));
    }

    //Mandate-customer page to get the details of the bhk(property size)
    getbhk() {
        return this._http.get(this.mandateUrl + "/getbhk")
            .pipe(map(response => response.json().Bhksize));
    }

    //Mandate-customer page to get the details of the property type
    getpropertytypelist() {
        return this._http.get(this.mandateUrl + "/propertytype")
            .pipe(map(response => response.json().PropertyTypes));
    }

    //Mandate-customer page to get the lead follow reasons
    leadstatus() {
        return this._http.get(this.mandateUrl + "/status_check")
            .pipe(map(response => response.json().Status));
    }

    //Mandate-customer page to get the list of locality in edit customer form 
    localitylist() {
        return this._http.get(this.mandateUrl + "/localitylist")
            .pipe(map(response => response.json().Localities));
    }

    getpropertydroplist() {
        return this._http.get(this.mandateUrl + "/propertylist").map((response: Response) => response.json().PropertyList);
    }

    rsvselectproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('assignedId', param.assignid);
        urlSearchParams.set('feedback', param.feedbackid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/getrsvselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getvisitedsuggestproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('assignID', param.assignid),
            urlSearchParams.set('feedback', param.feedbackid);
        urlSearchParams.set('propId', param.propid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/getsuggestvisitedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getcancelledsuggestproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.set('feedback', param.feedbackid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/getsuggestcancelledproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addpropertyvisitupdate(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('PropertyID', param.propid);
        urlSearchParams.append('ActionID', param.visitupdate);
        urlSearchParams.append('Remarks', param.remarks);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.set('feedback', param.feedbackid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/propertyvisitupdate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getmandateselectedsuggestproperties(leadid, execid, assignid, feedbackid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('Execid', execid);
        urlSearchParams.append('assignID', assignid);
        urlSearchParams.set('feedback', feedbackid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/mandategetselectedsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getfollowupsections() {
        return this._http.get(this.mandateUrl + "/followupcatogs").map((response: Response) => response.json().followupCategories);
    }

    getsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.set('feedback', param.feedbackid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/suggestedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getnonselectedproperties(leadid, execid, assignid, feedbackid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('ExecId', execid);
        urlSearchParams.append('assignID', assignid);
        urlSearchParams.set('feedback', feedbackid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/getnonselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getnegotiatedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('assignedId', param.assignid)
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/getvisitednegotiated", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addnegoselected(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('assignedId', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/negotiationselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    public uploadFile(data) {
        return this._http
            .post(this.mandateUrl + '/closurefileuploads', data)
            .pipe(map(response => response.json()));
    }

    getjunksections() {
        return this._http.get(this.mandateUrl + "/junkcatogs").map((response: Response) => response.json());
    }

    getassignedcs(id) {
        return this._http.get(this.mandateUrl + "/getassignedcs/" + id).map((response: Response) => response.json().CSname);
    }

    fetchmandateexecutuves(propid, team, role, teamlead) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('PropID', propid);
        urlSearchParams.append('team', team);
        urlSearchParams.append('roleId', role);
        urlSearchParams.append('teamlead', teamlead);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/mandateexecutives", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getExecutivesForRanav(propid, team, role, teamlead) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('PropID', propid);
        urlSearchParams.append('team', team);
        urlSearchParams.append('roleId', role);
        urlSearchParams.append('teamlead', teamlead);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/mandateexecutives", body, { headers: headers })
            .pipe(map(response => response.json()));
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
            .get(this.mandateUrl + "/rmc?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    movetoretail() {
        return this._http.get(this.mandateUrl + "/movetoretail").map((response: Response) => response.json());
    }

    //used in mandate registered leads page to get list of executives 
    getexecutivesbasedid(id) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        return this._http
            .get(this.mandateUrl + "/execbdondesigs" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Executiveslist));
    }

    // to get list of desginations
    getdesignations(departid) {
        return this._http.get(this.mandateUrl + "/get_designations/" + departid).map((response: Response) => response.json().Designations);
    }

    //
    propertylist(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('leadid', params.leadid);
        urlSearchParams.set('execid', params.execid);
        urlSearchParams.set('feedback', params.feedbackid);
        return this._http.get(this.mandateUrl + "/propertylist?", { search: urlSearchParams })
            .pipe(map(response => response.json().Properties));
    }

    //Mandate-customer page - to show the suggested properyie on clicking the suggestions
    addsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('execid', param.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/addsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    addvisitedpropertiesothers(param2) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param2.leadid);
        urlSearchParams.append('PropertyID', param2.visitedproperties);
        urlSearchParams.append('execid', param2.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/addvisitedpropertiesothers", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    getpropertylist_ID(val) {
        return this._http.get(this.mandateUrl + "/get_PropertyName?buliderId=" + val).map((response: Response) => response.json().details);
    }

    //
    getfollowupcustomeredit(id) {
        return this._http.get(this.mandateUrl + "/getfollowupcustomerview/" + id)
            .pipe(map(response => response.json().Followupcustomer));
    }

    // 
    getfacecustomeredit(id) {
        return this._http.get(this.mandateUrl + "/getfaceupcustomerview/" + id)
            .pipe(map(response => response.json().Facecustomer));
    }

    //
    getusvcustomerview(id) {
        return this._http.get(this.mandateUrl + "/getusvcustomerview/" + id)
            .pipe(map(response => response.json().Usvcustomer));
    }

    //
    getsvcustomerview(id) {
        return this._http.get(this.mandateUrl + "/getsvcustomerview/" + id)
            .pipe(map(response => response.json().Svcustomer));
    }

    // 
    getrsvcustomerview(id) {
        return this._http.get(this.mandateUrl + "/getrsvcustomerview/" + id)
            .pipe(map(response => response.json().Rsvcustomer));
    }

    //
    getfinalcustomerview(id) {
        return this._http.get(this.mandateUrl + "/getfinalcustomerview/" + id)
            .pipe(map(response => response.json().Finalcustomer));
    }

    //
    getclosedcustomerview(id) {
        return this._http.get(this.mandateUrl + "/getclosedcustomerview/" + id)
            .pipe(map(response => response.json().ClosureView));
    }

    //
    getstageslist() {
        return this._http.get(this.mandateUrl + "/getstages")
            .map((response: Response) => response.json().Sections);
    }

    //
    datashortupdate(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('IDPK', param.leadid);
        urlSearchParams.append('name', param.name);
        urlSearchParams.append('number', param.number);
        urlSearchParams.append('mail', param.mail);
        urlSearchParams.append('preferdlocation', param.location);
        urlSearchParams.append('preferedtype', param.proptype);
        urlSearchParams.append('leadpossession', param.possession);
        urlSearchParams.append('preferedvarient', param.size);
        urlSearchParams.append('preferedbudget', param.budget);
        urlSearchParams.append('leadaddress', param.address);
        urlSearchParams.append('leadpriority', param.priority);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('primaryname', param.primaryname);
        urlSearchParams.append('primarynumber', param.primarynumber);
        urlSearchParams.append('primarymail', param.primarymail);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/updateshortdata", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    fetchrequestedvalues(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropID', param.propid);
        urlSearchParams.append('ExecID', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/closerequestedvalues", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    closingrequestresponse(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropID', param.propid);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('statusid', param.statusid);
        urlSearchParams.append('remarks', param.remarks);
        urlSearchParams.append('assignID', param.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/closerequestresponse", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    requestresubmition(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropID', param.propid);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('bhk', param.bhk);
        urlSearchParams.append('bhkunit', param.bhkunit);
        urlSearchParams.append('dimension', param.dimension);
        urlSearchParams.append('ratepersqft', param.ratepersqft);
        urlSearchParams.append('assignID', param.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/closureresubmition", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //mandate-customer  to pusing the lead to junk
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
        return this.http.post(this.mandateUrl + "/addjunkleadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    getnotintrestsections() {
        return this._http.get(this.mandateUrl + "/notintrestcatogs").map((response: Response) => response.json());
    }

    //
    leadassigncs(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('CSID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/csleadassign", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    negoselectproperties(leadid, execid, assignid, feedback) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('ExecId', execid);
        urlSearchParams.append('assignedId', assignid);
        urlSearchParams.append('feedback', feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/getnegotiationselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    removeselectedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('stage', param.stage);
        urlSearchParams.append('Execid', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/removeselectedproperty", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    addnegoselectedrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('assignedId', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/negotiationselectedpropertiesrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    addrsvselected(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('assignedId', param.assignid);
        urlSearchParams.set('feedback', param.feedbackid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/rsvselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    addrsvselectedrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('assignedId', param.assignid)
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/rsvselectedpropertiesrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    getselectedsuggestproperties(leadid, execid, assignedId) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('ExecId', execid);
        urlSearchParams.append('assignedId', assignedId)
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/getselectedsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    addselectedsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('assignedId', param.assignid);
        urlSearchParams.set('feedback', param.feedbackid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/selectedsuggestproperty", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //
    addselectedsuggestedpropertiesrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('assignedId', param.assignid);
        urlSearchParams.set('feedback', param.feedbackid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/selectedsuggestpropertyrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    moveToUSV(leadid, execid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadId', leadid);
        urlSearchParams.append('ExecId', execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/resettousv", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    deleteImg(file_id, file_name, LeadId) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('file_id', file_id);
        urlSearchParams.append('file_name', file_name);
        urlSearchParams.append('LeadId', LeadId);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + '/removeclosurefileuploads', body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //assigned -leads component api's
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
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('visits', param.visits);
        urlSearchParams.set('followup', param.followup);
        urlSearchParams.set('receivedfromdate', param.receivedfrom);
        urlSearchParams.set('receivedtodate', param.receivedto);
        urlSearchParams.set('assignedfromdate', param.assignedfrom);
        urlSearchParams.set('assignedtodate', param.assignedto);
        urlSearchParams.set('visitedfromdate', param.visitedfrom);
        urlSearchParams.set('visitedtodate', param.visitedto);
        urlSearchParams.set('updatedfromdate', param.updatedfrom);
        urlSearchParams.set('updatedtodate', param.updatedto);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        urlSearchParams.set('counter', param.counter);
        urlSearchParams.set('visittype', param.visittype);
        urlSearchParams.set('visitassignedto', param.visitassignedTo);
        urlSearchParams.set('remarks_search', param.remarks_search);
        urlSearchParams.append('roleId', param.role);
        urlSearchParams.set('teamlead', param.teamlead);
        urlSearchParams.append('teammateid', param.teammateid);
        urlSearchParams.append('rnrleads', param.rnrleads);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.mandateUrl + "/assignedleads_mandate?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    assignedLeadsCount(param) {
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
        urlSearchParams.set('priority', param.priority);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('visits', param.visits);
        urlSearchParams.set('followup', param.followup);
        urlSearchParams.set('receivedfromdate', param.receivedfrom);
        urlSearchParams.set('receivedtodate', param.receivedto);
        urlSearchParams.set('assignedfromdate', param.assignedfrom);
        urlSearchParams.set('assignedtodate', param.assignedto);
        urlSearchParams.set('visitedfromdate', param.visitedfrom);
        urlSearchParams.set('visitedtodate', param.visitedto);
        urlSearchParams.set('updatedfromdate', param.updatedfrom);
        urlSearchParams.set('updatedtodate', param.updatedto);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        urlSearchParams.set('counter', param.counter);
        urlSearchParams.set('visittype', param.visittype);
        urlSearchParams.set('visitassignedto', param.visitassignedTo);
        urlSearchParams.set('remarks_search', param.remarks_search);
        urlSearchParams.append('roleId', param.role);
        urlSearchParams.set('teamlead', param.teamlead);
        urlSearchParams.append('teammateid', param.teammateid);
        urlSearchParams.append('rnrleads', param.rnrleads);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.mandateUrl + "/assignedleads_count_mandate?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    feedbackAssignedLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.datefrom);
        urlSearchParams.set('ToDate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('stage', param.stage);
        urlSearchParams.set('stagestatus', param.stagestatus);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('rmid', param.executid);
        urlSearchParams.set('tcid', param.csexecid);
        urlSearchParams.set('loginid', param.loginuser);
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('receivedfromdate', param.receivedfrom);
        urlSearchParams.set('receivedtodate', param.receivedto);
        urlSearchParams.set('visitedfromdate', param.visitedfrom);
        urlSearchParams.set('visitedtodate', param.visitedto);
        urlSearchParams.set('activityfromdate', param.updatedfrom);
        urlSearchParams.set('activitytodate', param.updatedto);
        urlSearchParams.set('counter', param.counter);
        urlSearchParams.set('assignedfromdate', param.assignedfrom);
        urlSearchParams.set('assignedtodate', param.assignedto);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.mandateUrl + "/feedback_assignapi?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    feedbackAssignedLeadsCount(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.datefrom);
        urlSearchParams.set('ToDate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('stage', param.stage);
        urlSearchParams.set('stagestatus', param.stagestatus);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('rmid', param.executid);
        urlSearchParams.set('tcid', param.csexecid);
        urlSearchParams.set('loginid', param.loginuser);
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('receivedfromdate', param.receivedfrom);
        urlSearchParams.set('receivedtodate', param.receivedto);
        urlSearchParams.set('visitedfromdate', param.visitedfrom);
        urlSearchParams.set('visitedtodate', param.visitedto);
        urlSearchParams.set('activityfromdate', param.updatedfrom);
        urlSearchParams.set('activitytodate', param.updatedto);
        urlSearchParams.set('counter', param.counter);
        urlSearchParams.set('assignedfromdate', param.assignedfrom);
        urlSearchParams.set('assignedtodate', param.assignedto);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.mandateUrl + "/feedback_assign_countapi?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }


    getreassignLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('followup', param.followup);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('execId', param.executid);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('loginid', param.loginuser);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.mandateUrl + "/get_reassignleads_mandate?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    //this api is used for reassign section in mandate assigned leads comp
    fetchmandateexecutuvesforreassign(propid, team, activestatus, role, teamlead) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('PropID', propid);
        urlSearchParams.append('team', team);
        urlSearchParams.append('activestatus', activestatus);
        urlSearchParams.append('roleId', role);
        urlSearchParams.append('teamlead', teamlead);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/mandateexecutives", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    revertBackToPreStage(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadId', param.leadid);
        urlSearchParams.append('PropId', param.propid);
        urlSearchParams.set('ExecId', param.executid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/revertjunktoprevious", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //assigned -leads component api's
    activityLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('fromdate', param.datefrom);
        urlSearchParams.set('todate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('execid', param.executid);
        urlSearchParams.set('visits', param.visits);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('actionfromdate', param.actionfrom);
        urlSearchParams.set('actiontodate', param.actionto);
        urlSearchParams.set('stage', param.stage);
        // urlSearchParams.set('team', param.team);
        urlSearchParams.set('stagestatus', param.stagestatus);
        urlSearchParams.set('loginid', param.loginuser);
        // urlSearchParams.set('priority', param.priority);
        urlSearchParams.set('followup', param.followup);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        urlSearchParams.set('teamlead', param.teamlead);
        // urlSearchParams.set('receivedfromdate', param.receivedfrom);
        // urlSearchParams.set('receivedtodate', param.receivedto);
        // urlSearchParams.set('updatedfromdate', param.updatedfrom);
        // urlSearchParams.set('updatedtodate', param.updatedto);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.mandateUrl + "/activity_report_byid?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    activityLeadsCount(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('fromdate', param.datefrom);
        urlSearchParams.set('todate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('execid', param.executid);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('visits', param.visits);
        urlSearchParams.set('stage', param.stage);
        // urlSearchParams.set('team', param.team);
        urlSearchParams.set('stagestatus', param.stagestatus);
        urlSearchParams.set('loginid', param.loginuser);
        // urlSearchParams.set('priority', param.priority);
        urlSearchParams.set('followup', param.followup);
        // urlSearchParams.set('receivedfromdate', param.receivedfrom);
        // urlSearchParams.set('receivedtodate', param.receivedto);
        // urlSearchParams.set('visitedfromdate', param.visitedfrom);
        // urlSearchParams.set('visitedtodate', param.visitedto);
        urlSearchParams.set('actionfromdate', param.actionfrom);
        urlSearchParams.set('actiontodate', param.actionto);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        urlSearchParams.set('teamlead', param.teamlead);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.mandateUrl + "/activity_report_count_byid?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    updatemyplan(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ExecId', params.execid),
            urlSearchParams.set('LeadId', params.leadid),
            urlSearchParams.set('myplan', params.planid),
            urlSearchParams.set('actiondate', params.plandate),
            urlSearchParams.set('actiontime', params.plantime),
            urlSearchParams.set('leadstage', params.stage),
            urlSearchParams.set('stagestatus', params.stagestatus),
            urlSearchParams.set('LoginId', params.loginid)
        urlSearchParams.set('PropId', params.propid)

        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.mandateUrl + "/updatemyplan", body, { headers: headers }).
            pipe(map((response) => response.json()));
    }

    planLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('fromdate', param.datefrom);
        urlSearchParams.set('todate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('execid', param.executid);
        urlSearchParams.set('visits', param.visits);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('stage', param.stage);
        urlSearchParams.set('stagestatus', param.stagestatus);
        urlSearchParams.set('loginid', param.loginuser);
        urlSearchParams.set('plan', param.plan);
        urlSearchParams.set('teamlead', param.teamlead);
        urlSearchParams.set('leadvisit', param.leadvisit);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.mandateUrl + "/week_plans?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    planLeadsCount(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('fromdate', param.datefrom);
        urlSearchParams.set('todate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('execid', param.executid);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('visits', param.visits);
        urlSearchParams.set('stage', param.stage);
        urlSearchParams.set('stagestatus', param.stagestatus);
        urlSearchParams.set('loginid', param.loginuser);
        urlSearchParams.set('plan', param.plan);
        urlSearchParams.set('teamlead', param.teamlead);
        urlSearchParams.set('leadvisit', param.leadvisit);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.mandateUrl + "/week_plans_counts?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    createPricingList(param) {
        return this._http.post(this.mandateUrl + '/post_propertiesdetails_mandate', param).
            pipe(map((response) => { response.json() }))
    }

    getPriceList() {
        return this._http.get(this.mandateUrl + "/get_propertiesdetails_mandate").pipe(map(resp => resp.json()));
    }

    updateBrochure(param) {
        return this._http.post(this.mandateUrl + '/update_propbrochure_mandate', param).pipe(map((resp) => resp.json()));
    }

    updatePriceSheet(param) {
        return this._http.post(this.mandateUrl + '/update_proppricesheet_mandate', param).pipe(map((resp) => resp.json()));
    }

    updateVideo(param) {
        return this._http.post(this.mandateUrl + '/update_propvideo_only_mandate', param).pipe(map((resp) => resp.json()));
    }

    deleteVideo(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('detailsId', param.detailid),
            urlSearchParams.set('videoId', param.videoId),
            urlSearchParams.set('videofilename', param.videofilename)

        let body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.mandateUrl + '/delete_propvideo_mandate', body, { headers: headers }).pipe(map((resp) => resp.json()));
    }

    updatePropertyInfo(param) {
        return this._http.post(this.mandateUrl + '/update_propinfo_mandate', param).pipe(map((resp) => resp.json()));
    }

    deletepriceSheet(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('detailsId', param.detailid),
            urlSearchParams.set('pricesheetId', param.psid)
        urlSearchParams.set('pricesheetfilename', param.pricesheetname)

        let body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.mandateUrl + '/delete_proppricesheet_mandate', body, { headers: headers }).pipe(map((resp) => resp.json()));
    }

    deletefloorplan(param) {
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.set('detailsId', param.detailid),
            urlSearchParams.set('floorplanId', param.pfid)
        urlSearchParams.set('floorplanfilename', param.floorplanName)

        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.mandateUrl + '/delete_floorplan_mandate', body, { headers: headers }).pipe(map((resp) => resp.json()));
    }

    postPriceSheetOnUpdate(param) {
        return this._http.post(this.mandateUrl + '/update_pricesheet_only_mandate', param).
            pipe(map((response) => { response.json() }))
    }

    getLeadExister(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('number', param.number)
        urlSearchParams.append('propertyId', param.propertyId)
        urlSearchParams.append('execId', param.executiveid)

        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.mandateUrl + '/leadexistchecker', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }

    adminmailsend(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('client', param.client);
        urlSearchParams.append('clientnum', param.clientnum);
        urlSearchParams.append('clientmail', param.clientmail);
        urlSearchParams.append('leadid', param.leadid);
        urlSearchParams.append('bhksize', param.bhksize);
        urlSearchParams.append('budgetrange', param.budgetrange);
        urlSearchParams.append('priority', param.priority);
        urlSearchParams.append('execname', param.execname);
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('source', param.source);
        urlSearchParams.append('cpname', param.cpname);
        urlSearchParams.append('cpid', param.cpid);
        urlSearchParams.append('cpmail', param.cpmail);
        urlSearchParams.append('propertyId', param.propertyId);
        urlSearchParams.append('remarks', param.remarks);
        urlSearchParams.append('otpbased', param.otpbased);

        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.mandateUrl + '/mailsendbuilderbased', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }

    rsvvisittrigger(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('leadid', param.leadid);
        urlSearchParams.append('execname', param.execname);
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('otpbased', param.otpbased);
        urlSearchParams.append('priority', param.priority);
        urlSearchParams.append('propertyId', param.propertyId);
        urlSearchParams.append('remarks', param.remarks);
        urlSearchParams.append('mergedMail', param.mergedMail);
        urlSearchParams.append('mergedNumber', param.mergedNumber);
        urlSearchParams.append('mergedName', param.mergedName);

        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.mandateUrl + '/rsvvisittrigger', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }

    otpsend(number) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('number', number);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.otpURl + '/asdthyujdllkhjsjkkjhs', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    otpvalidcheck(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('otp', param.otp)
        urlSearchParams.append('number', param.number);

        var body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.otpURl + '/otpvalidate', body, { headers: headers })
            .pipe(map(resp => resp.json()));
    }

    visitAssign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadId', param.leadid);
        urlSearchParams.append('PropId', param.propid);
        urlSearchParams.append('LoginId', param.loginid);
        urlSearchParams.append('FromExecId', param.fromexecutives);
        urlSearchParams.append('ToExecId', param.toexecutives);
        urlSearchParams.append('CrmType', param.crmtype);
        urlSearchParams.append('DbClient', param.dbclinet);
        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.mandateUrl + '/assignfixedvisitlead_mandate', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }


    visitSelfAssign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('leadid', param.leadid);
        urlSearchParams.append('propid', param.propid);
        urlSearchParams.append('execid', param.execid);
        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.mandateUrl + '/unlockleadtomandate', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }

    visitReassignMandate(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('RMID', param.rmid);
        urlSearchParams.append('FromExecids', param.fromexecid);
        urlSearchParams.append('propID', param.propid);
        urlSearchParams.append('loginId', param.loginid);
        urlSearchParams.append('random', param.random);
        urlSearchParams.append('Stage', param.stage);
        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.mandateUrl + '/visitsreassign_mandate', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }

    getFixedMandateProperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadId', param.leadid);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('PropId', param.propid);
        urlSearchParams.append('LoginId', param.loginid);
        return this._http.get(this.mandateUrl + '/fixedvisitsexecbasedproperty_mandate', { search: urlSearchParams }).
            pipe(map(response => response.json()));
    }

    revertBackToActive(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadId', param.leadid);
        urlSearchParams.append('ExecId', param.execid);
        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.mandateUrl + '/revertrnrcounts', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }

    getAllDashPlansCounts(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('fromdate', param.fromdate);
        urlSearchParams.append('todate', param.todate);
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('loginid', param.loginid);
        urlSearchParams.append('plan', param.plan);
        urlSearchParams.append('propid', param.propid);

        var body = urlSearchParams.toString();

        return this.http
            .get(this.mandateUrl + "/scheduledplans_counts?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    whatsappVisitleadassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('leadId', param.leadId);
        urlSearchParams.append('loginid', param.loginid);
        urlSearchParams.append('propname', param.propname);
        urlSearchParams.append('propid', param.propid);
        urlSearchParams.append('toexecid', param.toexecid);
        urlSearchParams.append('visitdate', param.visitdate);
        urlSearchParams.append('visittime', param.visittime);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/assignwhatsappvisits", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getfetchmail(propid) {
        return this._http.get(this.mandateUrl + "/get_mailwithpropid/" + propid).map((response: Response) => response.json().Buildermail);
    }

    fetchclientregistereddata(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Propid', param.propid);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.mandateUrl + "/fetchleadregistered" + "?", { search: urlSearchParams })
            .pipe(map((response: any) => response.json()));
    }


    clientregistration(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('leadid', param.leadid);
        urlSearchParams.append('propid', param.propid);
        urlSearchParams.append('client', param.customer);
        urlSearchParams.append('clientnum', param.customernum);
        urlSearchParams.append('clientmail', param.customermail);
        urlSearchParams.append('rmname', param.rmname);
        urlSearchParams.append('rmid', param.rmid);
        urlSearchParams.append('rmmail', param.rmmail);
        urlSearchParams.append('assignID', param.assignid)
        urlSearchParams.append('builder', param.builder);
        urlSearchParams.append('property', param.property);
        urlSearchParams.append('sendmail', param.sendto);
        urlSearchParams.append('ccmail', param.sendcc);
        urlSearchParams.append('sendnote', param.remarks);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.mandateUrl + "/clientregistration", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    markAllAsActive(){
        let urlSearchParams = new URLSearchParams();
         let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.mandateUrl + '/markallactiveleads_mandate',body,{headers : headers})
            .pipe(map(response => response.json()));
    }
    
    updatePriority(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('leadid', param.leadid);
        urlSearchParams.append('priority', param.priority);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.mandateUrl + '/updatehotwarmcold', body, { headers: headers })
            .pipe(map(response => response.json()));
    }

}



