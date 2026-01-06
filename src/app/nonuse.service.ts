import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams  } from "@angular/http";
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';  
import {_throw} from 'rxjs/observable/throw';
import {retry, catchError} from 'rxjs/operators';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class nouseservice implements OnInit{
    ngOnInit() {
    }
    enqrycount=[];
    executives=[];
    projects=[];
    items=[];
    enquiries=[];
    activeleads=[];
    followups=[];
    facetoface=[];
    uniquesite=[];
    repeatsite=[];
    negotiate=[];
    closedleads=[];
    myexecutives=[];
    filterItems=[];
    // filters=[];
    // fitems=[];
    urlPrefix: string;
    urlPrefix_web: string;
    urlPrefix_php: string;

   // endPoint:string;
    apiurl: string
    constructor(private _http:Http,private http: Http,private router: Router){
        // this.urlPrefix = 'http://localhost/homes247newbackend/crmapi'; 
        // this.urlPrefix_web = 'http://localhost/homes247newbackend/backend';
        // this.apiurl = 'http://localhost/homes247newbackend/crmbackend';

        this.urlPrefix = 'https://superadmin.right2shout.in/crmapi';
        this.urlPrefix_web = 'https://superadmin.right2shout.in/backend';
        this.apiurl = 'https://superadmin.right2shout.in/crmbackend';
    }
    checkMe:any;

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

      customerupdate(params)
    {
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
    getpropertytime() {
        return this._http.get(this.apiurl + "/possessiontime")
        .pipe(map(response => response.json().PossessionTime)); 
    }
    getsourcelist(){
        return this._http.get(this.apiurl + "/leadsource")
        .map((response: Response) => response.json().Leadsource);
    }

    getpropertypurpose(){
        return this._http.get(this.apiurl + "/propertypurpose")
        .pipe(map(response => response.json().Purpose));
    }

    localitylist()
    {
        return this._http.get(this.apiurl + "/localitylist")
        .pipe(map(response => response.json().Localities));
    }

    propertylist()
    {
        return this._http.get(this.apiurl + "/propertylist")
        .pipe(map(response => response.json().Properties));
    }

    telecallerreassign(params){
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

    getcstotalassign(id)
    {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.set('CSid', id );
        let body = urlSearchParams.toString()
        return this.http
        .get(this.apiurl + "/cstotalassignleads?", { search: urlSearchParams })
         .pipe(map(response => response.json().CSAssignedleads));
    }

      // still on process
//    addfollowuplist(info){
//         return this._http.post(this.urlPrefix_php + "/addfollowup.php",info)
//         .map(()=>"");
//     }

    // addrsv(info){
    //     return this._http.post(this.urlPrefix_php + "/addrsv.php",info)
    //     .map(()=>"");
    // }
    // addfinalnegotiate(info){
    //     return this._http.post(this.urlPrefix_php + "/addnegotiate.php",info)
    //     .map(()=>"");
    // }
   //end still on process
    
    // didnt work on this
    // updatexecutive(info){
    //         return this._http.post(this.urlPrefix_php + "/addexecutive.php",info)
    //         .map(()=>"");
    //         }

    //ends didnt work on this


    // deletexecutive(id){
    //     return this._http.post(this.urlPrefix_php + "/delete.php/",{'delete_id':id})
    //     .map(()=>this.getexecutiveslist());
    //     }

    // deletejunk(id){
    //     return this._http.post(this.urlPrefix_php + "/delete.php/",{'delete_junk':id})
    //     .map(()=>this.getjunks());
    // }


}