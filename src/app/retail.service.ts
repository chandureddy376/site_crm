import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from "@angular/http";
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { _throw } from 'rxjs/observable/throw';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class retailservice implements OnInit {

    webapi: string;

    constructor(private _http: Http, private http: Http, private router: Router) {
        this.webapi = 'https://superadmin-azure.right2shout.in/retailcrm_test';
    }

    ngOnInit() { }

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

    getassignedrmretail(id, loginid, feedbackid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('loginid', loginid);
        urlSearchParams.set('feedback', feedbackid);
        return this._http.get(this.webapi + "/getassignedrmretail/" + id + "?", { search: urlSearchParams }).map((response: Response) => response.json());
    }

    getReportExecs(id, fromdate, todate) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('fromdate', fromdate);
        urlSearchParams.set('todate', todate);
        urlSearchParams.set('role', id);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        return this.http
            .get(this.webapi + "/activity_report?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getactiveleadsstatus(leadid, userid, assignid, feedback) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('ExecID', userid);
        urlSearchParams.append('assignID', assignid);
        urlSearchParams.append('feedback', feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getactiveleadsstatus", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    rsvselectproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getrsvselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getvisitedsuggestpropertiesretail(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getsuggestvisitedpropertiesretail", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    leadassign(param, randomval, loginid, visits) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('random', randomval);
        urlSearchParams.append('loginId', loginid);
        urlSearchParams.append('visits', visits);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/leadassign", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    //retail assigned leads section leads reassign.
    leadreassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('propID', param.propId);
        urlSearchParams.append('random', param.randomval);
        urlSearchParams.append('loginId', param.loginid);
        urlSearchParams.append('FromExecids', param.executiveIds);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/leadreassign_retail", body, { headers: headers })
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
        return this.http.post(this.webapi + "/assignfeedback", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    inactiveJunkLeadreassign(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('RMID', param.customersupport);
        urlSearchParams.append('LeadID', param.assignedleads);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('random', param.randomval);
        urlSearchParams.append('loginId', param.loginid);
        urlSearchParams.append('FromExecids', param.executiveIds);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/junkreassign_retail", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getreassignLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('fromdate', param.fromdate);
        urlSearchParams.set('todate', param.todate);
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('followup', param.followup);
        urlSearchParams.set('team', param.team);
        urlSearchParams.set('execId', param.executid);
        urlSearchParams.set('propid', param.propid);
        urlSearchParams.set('loginid', param.loginuser);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.webapi + "/get_reassignleads_retail?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getnonselectedpropertiesretail(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
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
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);

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
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getsuggestcancelledproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    removeselectedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('stage', param.stage);
        urlSearchParams.append('Execid', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/removeselectedproperty", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    svselectpropertiesretail(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('ExecID', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getsvselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    retailpropertyvisitupdate(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('PropertyID', param.propid);
        urlSearchParams.append('ActionID', param.visitupdate);
        urlSearchParams.append('Remarks', param.remarks);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('Stagestatus', param.stagestatus);
        urlSearchParams.append('Actiondate', param.closedate);
        urlSearchParams.append('Actiontime', param.closetime);
        urlSearchParams.append('accompaniedid', param.accompany);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/propertyvisitupdate", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addleadhistoryretail(param) {
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
        urlSearchParams.append('weekplan', param.weekplan);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/addleadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addretailfollowup(followups) {
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
        urlSearchParams.append('feedback', followups.feedback);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/retailaddfollowup", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getretailhistory(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('RoleID', param.roleid);
        urlSearchParams.append('UserID', param.userid);
        urlSearchParams.append('execid', param.execid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/leadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addsvselectedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/svselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addrsvselectedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/rsvselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addnegoselectedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/negotiationselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    negoselectproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getnegotiationselectedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getvisitednegotiated(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/getvisitednegotiated", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addrsvselectedrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/rsvselectedpropertiesrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    propertylist(params) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('leadid', params.leadid);
        urlSearchParams.set('Execid', params.execid);
        return this._http.get(this.webapi + "/propertylist?", { search: urlSearchParams })
            .pipe(map(response => response.json().Properties));
    }

    getvisitpropertyothers(leadid, loginid, assignid, feedback) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('Execid', loginid);
        urlSearchParams.append('assignID', assignid);
        urlSearchParams.append('feedback', feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/visitedwithothers", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/suggestedproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addselectedsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/selectedsuggestproperty", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addvisitedpropertiesothers(param2) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param2.leadid);
        urlSearchParams.append('PropertyID', param2.visitedproperties);
        urlSearchParams.append('Execid', param2.execid);
        urlSearchParams.append('assignID', param2.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/addvisitedpropertiesothers", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addsuggestedproperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Stage', param.stage);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/addsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
    }


    addselectedsuggestedpropertiesrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/selectedsuggestpropertyrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addsvselectedpropertiesrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/svselectedpropertiesrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    addnegoselectedrefix(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropertyID', param.suggestproperties);
        urlSearchParams.append('Nextdate', param.nextdate);
        urlSearchParams.append('Nexttime', param.nexttime);
        urlSearchParams.append('Execid', param.execid);
        urlSearchParams.append('assignID', param.assignid);
        urlSearchParams.append('feedback', param.feedback);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/negotiationselectedpropertiesrefix", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    public uploadFile(data) {
        return this._http.post(this.webapi + '/closurefileuploads', data)
            .pipe(map(response => response.json()));
    }

    getcustomeredit(id) {
        return this._http.get(this.webapi + "/geteditcustomer/" + id).map((response: Response) => response.json().Customerview);
    }

    localitylist() {
        return this._http.get(this.webapi + "/localitylist")
            .pipe(map(response => response.json().Localities));
    }

    getpropertytypelist() {
        return this._http.get(this.webapi + "/propertytype")
            .pipe(map(response => response.json().PropertyTypes));
    }

    getbhk() {
        return this._http.get(this.webapi + "/getbhk")
            .pipe(map(response => response.json().Bhksize));
    }

    leadstatus() {
        return this._http.get(this.webapi + "/status_check")
            .pipe(map(response => response.json().Status));
    }

    getfollowupsections() {
        return this._http.get(this.webapi + "/followupcatogs").map((response: Response) => response.json().followupCategories);
    }

    retailselectedsuggestproperties(leadid, execid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', leadid);
        urlSearchParams.append('Execid', execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/retailselectedsuggestproperties", body, { headers: headers })
            .pipe(map(response => response.json()));
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
        urlSearchParams.append('feedback', followups.feedback);
        // urlSearchParams.append('CSID', csid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/addfollowupleadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

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
        urlSearchParams.append('primaryname', param.primaryname);
        urlSearchParams.append('primarynumber', param.primarynumber);
        urlSearchParams.append('primarymail', param.primarymail);

        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/updateshortdata", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    fetchrequestedvalues(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('PropID', param.propid);
        urlSearchParams.append('ExecID', param.execid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/closerequestedvalues", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

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
        return this.http.post(this.webapi + "/closerequestresponse", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

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
        return this.http.post(this.webapi + "/closureresubmition", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

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
        return this.http.post(this.webapi + "/addjunkleadhistory", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getjunksections() {
        return this._http.get(this.webapi + "/junkcatogs").map((response: Response) => response.json());
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
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('followup', param.followup);
        urlSearchParams.set('receivedfromdate', param.receivedfrom);
        urlSearchParams.set('receivedtodate', param.receivedto);
        urlSearchParams.set('visitedfromdate', param.visitedfrom);
        urlSearchParams.set('visitedtodate', param.visitedto);
        urlSearchParams.set('activityfromdate', param.updatedfrom);
        urlSearchParams.set('activitytodate', param.updatedto);
        urlSearchParams.set('enquiredprop', param.enquiredpropname);
        urlSearchParams.set('suggestedprop', param.suggestedpropid);
        urlSearchParams.set('visitedprop', param.visitedpropid);
        urlSearchParams.set('closedprop', param.closedpropid);
        urlSearchParams.set('counter', param.counter);
        urlSearchParams.set('assignedfromdate', param.assignedfrom);
        urlSearchParams.set('assignedtodate', param.assignedto);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        urlSearchParams.set('visittype', param.visittype);
        urlSearchParams.set('visitassignedto', param.visitassignedTo);
        urlSearchParams.set('remarks_search', param.remarks_search);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.webapi + "/assignedleads?", { search: urlSearchParams })
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
        urlSearchParams.set('limit', param.limit);
        urlSearchParams.set('limitrows', param.limitrows);
        urlSearchParams.set('priority', param.priority);
        urlSearchParams.set('source', param.source);
        urlSearchParams.set('followup', param.followup);
        urlSearchParams.set('receivedfromdate', param.receivedfrom);
        urlSearchParams.set('receivedtodate', param.receivedto);
        urlSearchParams.set('visitedfromdate', param.visitedfrom);
        urlSearchParams.set('visitedtodate', param.visitedto);
        urlSearchParams.set('activityfromdate', param.updatedfrom);
        urlSearchParams.set('activitytodate', param.updatedto);
        urlSearchParams.set('enquiredprop', param.enquiredpropname);
        urlSearchParams.set('suggestedprop', param.suggestedpropid);
        urlSearchParams.set('visitedprop', param.visitedpropid);
        urlSearchParams.set('closedprop', param.closedpropid);
        urlSearchParams.set('counter', param.counter);
        urlSearchParams.set('assignedfromdate', param.assignedfrom);
        urlSearchParams.set('assignedtodate', param.assignedto);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        urlSearchParams.set('visittype', param.visittype);
        urlSearchParams.set('visitassignedto', param.visitassignedTo);
        urlSearchParams.set('remarks_search', param.remarks_search);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.webapi + "/assignedleads_count_retail?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    feedbackAssignedLeads(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.datefrom);
        urlSearchParams.set('ToDate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('stage', param.stage);
        urlSearchParams.set('stagestatus', param.stagestatus);
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
        urlSearchParams.set('suggestedprop', param.suggestedpropid);
        urlSearchParams.set('visitedprop', param.visitedpropid);
        urlSearchParams.set('counter', param.counter);
        urlSearchParams.set('assignedfromdate', param.assignedfrom);
        urlSearchParams.set('assignedtodate', param.assignedto);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.webapi + "/feedback_assignapi?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    feedbackAssignedLeadsCount(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('FromDate', param.datefrom);
        urlSearchParams.set('ToDate', param.dateto);
        urlSearchParams.set('status', param.statuss);
        urlSearchParams.set('stage', param.stage);
        urlSearchParams.set('stagestatus', param.stagestatus);
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
        urlSearchParams.set('suggestedprop', param.suggestedpropid);
        urlSearchParams.set('visitedprop', param.visitedpropid);
        urlSearchParams.set('counter', param.counter);
        urlSearchParams.set('assignedfromdate', param.assignedfrom);
        urlSearchParams.set('assignedtodate', param.assignedto);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.webapi + "/feedback_assign_countapi?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
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
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.webapi + "/retail_visits?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
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
            .get(this.webapi + "/leadassignedcountsadmin?" + "?", { search: urlSearchParams })
            .pipe(map((response: any) => response));
    }

    // addpropertyvisitupdate_indirect(param) {
    //     let urlSearchParams = new URLSearchParams();
    //     urlSearchParams.append('LeadID', param.leadid);
    //     urlSearchParams.append('execid', param.execid);
    //     urlSearchParams.append('PropertyID', param.propid);
    //     urlSearchParams.append('ActionID', param.visitupdate);
    //     urlSearchParams.append('Remarks', param.remarks);
    //     urlSearchParams.append('Stage', param.stage);
    //     urlSearchParams.append('Stagestatus', param.stagestatus);
    //     urlSearchParams.append('Actiondate', param.closedate);
    //     urlSearchParams.append('Actiontime', param.closetime);
    //     urlSearchParams.append('accompaniedid', param.accompany);
    //     urlSearchParams.append('visittype', param.visittype);
    //     let body = urlSearchParams.toString();
    //     var headers = new Headers();
    //     headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //     return this.http.post(this.webapi + "/propertyvisitupdate_indirect", body, { headers: headers })
    //         .pipe(map(response => response.json()));
    // }

    getfetchmail(propid) {
        return this._http.get(this.webapi + "/get_mailwithpropid/" + propid).map((response: Response) => response.json().Buildermail);
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
        return this.http.post(this.webapi + "/clientregistration", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    fetchclientregistereddata(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadID', param.leadid);
        urlSearchParams.append('Propid', param.propid);
        let body = urlSearchParams.toString()
        return this.http
            .get(this.webapi + "/fetchleadregistered" + "?", { search: urlSearchParams })
            .pipe(map((response: any) => response.json()));
    }

    propertylistnew() {
        return this._http.get(this.webapi + "/propertynewlists")
            .pipe(map(response => response.json().Properties));
    }

    getRetailExecutives(roleId, active) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('roleId', roleId);
        urlSearchParams.set('activeStatus', active);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.webapi + "/retail_executives" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getDashboardCount(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('rmid', param.rmid);
        urlSearchParams.set('propId', param.propid);
        urlSearchParams.set('FromDate', param.fromdate);
        urlSearchParams.set('ToDate', param.todate);
        urlSearchParams.set('team', param.team);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.get(this.webapi + "/retail_leads_count", { search: urlSearchParams }).map((response) => response.json());
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
            .get(this.webapi + "/retail_visit_counts?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getreaassignexecutivesbasedid(id, active) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('ID', id);
        urlSearchParams.set('activeStatus', active);
        return this._http
            .get(this.webapi + "/execbdondesigs" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json().Executiveslist));
    }

    // Need To Check in Retail API
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
        return this.http.get(this.webapi + "/scheduledtoday_execquickview", { search: urlSearchParams })
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
        return this.http.get(this.webapi + "/execquickview", { search: urlSearchParams })
            .pipe(map(response => response.json()))
    }

    checkdirectteamexist(propid) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('PropID', propid);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/directteamexistchecker", body, { headers: headers })
            .pipe(map(response => response.json()));
    }

    getHotColdWarmCount(count, propId, todate, fromdate, team, execId) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('count', count);
        urlSearchParams.append('PropID', propId);
        urlSearchParams.append('ToDate', todate);
        urlSearchParams.append('FromDate', fromdate);
        urlSearchParams.append('team', team);
        urlSearchParams.append('ExecId', execId);
        let body = urlSearchParams.toString()
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.webapi + "/hotwarmcold_leads" + "?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }
    // Need To Check in Retail API
    //this is get the list of source

    //here i'm using subject when we add property in the usv component it should refelect in assigned component
    private dataSubject = new Subject<string>();

    sendData(data: string) {
        this.dataSubject.next(data);
    }

    getData() {
        return this.dataSubject.asObservable();
    }

    revertBackToPreStage(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadId', param.leadid);
        urlSearchParams.set('ExecId', param.executid);
        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.webapi + "/revertjunktoprevious", body, { headers: headers })
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
        urlSearchParams.set('enquiredprop', param.enquiredpropname);
        urlSearchParams.set('suggestedprop', param.suggestedpropid);
        urlSearchParams.set('visitedprop', param.visitedpropid);
        urlSearchParams.set('closedprop', param.closedpropid);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        // urlSearchParams.set('receivedfromdate', param.receivedfrom);
        // urlSearchParams.set('receivedtodate', param.receivedto);
        // urlSearchParams.set('updatedfromdate', param.updatedfrom);
        // urlSearchParams.set('updatedtodate', param.updatedto);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.webapi + "/activity_report_byid?", { search: urlSearchParams })
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
        urlSearchParams.set('enquiredprop', param.enquiredpropname);
        urlSearchParams.set('suggestedprop', param.suggestedpropid);
        urlSearchParams.set('visitedprop', param.visitedpropid);
        urlSearchParams.set('closedprop', param.closedpropid);
        // urlSearchParams.set('receivedfromdate', param.receivedfrom);
        // urlSearchParams.set('receivedtodate', param.receivedto);
        // urlSearchParams.set('visitedfromdate', param.visitedfrom);
        // urlSearchParams.set('visitedtodate', param.visitedto);
        urlSearchParams.set('actionfromdate', param.actionfrom);
        urlSearchParams.set('actiontodate', param.actionto);
        urlSearchParams.set('FromTime', param.fromtime);
        urlSearchParams.set('ToTime', param.totime);
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.webapi + "/activity_report_count_byid?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    getEnquiryPropertyList() {
        return this.http.get(this.webapi + '/enquirypropertylist').map(response => response.json())
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

        return this._http.post(this.webapi + "/updatemyplan", body, { headers: headers }).
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
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.webapi + "/week_plans?", { search: urlSearchParams })
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
        let body = urlSearchParams.toString()

        var headers = new Headers();
        return this.http
            .get(this.webapi + "/week_plans_counts?", { search: urlSearchParams })
            .pipe(map(response => response.json()));
    }

    createPricingList(param) {
        return this._http.post(this.webapi + '/post_propertiesdetails_retail', param).
            pipe(map((response) => { response.json() }))
    }

    getPriceList() {
        return this._http.get(this.webapi + "/get_propertiesdetails_retail").pipe(map(resp => resp.json()));
    }

    updateBrochure(param) {
        return this._http.post(this.webapi + '/update_propbrochure_retail', param).pipe(map((resp) => resp.json()));
    }

    updatePriceSheet(param) {
        return this._http.post(this.webapi + '/update_proppricesheet_retail', param).pipe(map((resp) => resp.json()));
    }

    updateVideo(param) {
        return this._http.post(this.webapi + '/update_propvideo_only_retail', param).pipe(map((resp) => resp.json()));
    }

    updateFloorPlan(param) {
        return this._http.post(this.webapi + '/update_propfloorplan_retail', param).pipe(map((resp) => resp.json()));
    }

    deleteVideo(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('detailsId', param.detailid),
            urlSearchParams.set('videoId', param.videoId),
            urlSearchParams.set('videofilename', param.videofilename)

        let body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.webapi + '/delete_propvideo_retail', body, { headers: headers }).pipe(map((resp) => resp.json()));
    }

    deletepriceSheet(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('detailsId', param.detailid),
            urlSearchParams.set('pricesheetId', param.psid)
        urlSearchParams.set('pricesheetfilename', param.pricesheetname)

        let body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.webapi + '/delete_proppricesheet_retail', body, { headers: headers }).pipe(map((resp) => resp.json()));
    }

    deletefloorplan(param) {
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.set('detailsId', param.detailid),
            urlSearchParams.set('floorplanId', param.pfid)
        urlSearchParams.set('floorplanfilename', param.floorplanName)

        let body = urlSearchParams.toString();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.webapi + '/delete_floorplan_retail', body, { headers: headers }).pipe(map((resp) => resp.json()));
    }

    updatePropertyInfo(param) {
        return this._http.post(this.webapi + '/update_propinfo_retail', param).
            pipe(map((resp) => resp.json()));
    }

    postPriceSheetOnUpdate(param) {
        return this._http.post(this.webapi + '/update_pricesheet_only_retail', param).
            pipe(map((response) => { response.json() }))
    }

    getFixedRetailProperties(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadId', param.leadid);
        urlSearchParams.append('ExecId', param.execid);
        urlSearchParams.append('LoginId', param.loginid);
        return this._http.get(this.webapi + '/fixedvisitsexecbasedproperty_retail', { search: urlSearchParams }).
            pipe(map(response => response.json()));
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

        return this._http.post(this.webapi + '/assignfixedvisitlead_retail', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }

    assignToRetail(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('leadid', param.leadid);
        urlSearchParams.append('execid', param.execid);
        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.webapi + '/unlockleadtoretail', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }

    revertBackToActive(param) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('LeadId', param.leadid);
        urlSearchParams.append('ExecId', param.execid);
        var body = urlSearchParams.toString();

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.webapi + '/revertrnrcounts', body, { headers: headers })
            .pipe(map(resp => resp.json()))
    }


    private refreshSubject = new Subject<void>();

    refresh$ = this.refreshSubject.asObservable();

    triggerRefresh() {
        this.refreshSubject.next();
    }


}