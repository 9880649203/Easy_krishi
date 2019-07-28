import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/internal/operators';



const endpointAddress = 'http://134.209.147.129:3001';
@Injectable({
  providedIn: "root"
})
export class RestService {

  dropDownDistrict: any = [];
  dropDownPlace: any = [];
  dropDownAgency: any = [];

  token = localStorage.getItem('token')
  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': this.token,
    }),
  };

  // Observable
  public _userList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _userList = this._userList$.asObservable();
  public _userDropDownList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _userDropDownList = this._userDropDownList$.asObservable();
  public _farmerList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _farmerList = this._farmerList$.asObservable();
  public _farmerDropDownList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _farmerDropDownList = this._farmerDropDownList$.asObservable();
  public _message$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _message = this._message$.asObservable();

  constructor(private http: HttpClient, ) {
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
  getFarmer(request): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http
      .post(endpointAddress + '/farmer_list', request, this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._farmerList$.next(response.data);
          this.getFarmerDropdown()
        }
        else if (response.statusCode == '400') {
          this._farmerList$.next(response.data);
        }
      })
      .catch((data: any) => Promise.resolve());

  }
  createFarmer(request): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http
      .post(endpointAddress + '/farmer_create', request, this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._message$.next(response.message)
          this.getFarmer("")
        }
        if (response.statusCode == '409') {
          this._message$.next(response.message)
        }
      })
      .catch((data: any) => Promise.resolve());
  }
  updateFarmer(request): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    // console.log("user list", re)
    return this.http
      .post(endpointAddress + '/farmer_update', request, this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._message$.next(response.message)
          this.getFarmer("")
        }
        if (response.statusCode == '409') {
          this._message$.next(response.message)
        }
      })
      .catch((data: any) => Promise.resolve());
  }
  getFarmerDropdown(): Observable<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http.post<any>(endpointAddress + '/farmer_dropDown', '', this.httpOptions).pipe(
      tap((response) => {
        if (response.statusCode == '200') {
          this._farmerDropDownList$.next(response);
        }
        else if (response.statusCode == '400') {
          this._farmerDropDownList$.next(response);
        }
      }),
      catchError(this.handleError<any>('userDropdown'))
    );

  }
  getUserDropDownList(): Observable<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http.post<any>(endpointAddress + '/user_dropDown', '', this.httpOptions).pipe(
      tap((result) => {
        if (result) {
          this._userDropDownList$.next(result);
        }
      }),
      catchError(this.handleError<any>('userDropdown'))
    );
  }
  getUser(data): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http
      .post(endpointAddress + '/user_list', data, this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._userList$.next(response.data)
          this.getUserDropDownList();
        }
        else if (response.statusCode == '400') {
          this._userList$.next(response.data)
        }
      })
      .catch((data: any) => Promise.resolve());
  }
  createUserManager(request): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http
      .post(endpointAddress + '/user_create', request, this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._message$.next(response.message)
          this.getUser("")
        }
        if (response.statusCode == '409') {
          this._message$.next(response.message)
        }
      })
      .catch((data: any) => Promise.resolve());
  }
  updateUserManager(request): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    // console.log("user list", re)
    return this.http
      .post(endpointAddress + '/user_update', request, this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._message$.next(response.message)
          this.getUser("")
        }
        if (response.statusCode == '409') {
          this._message$.next(response.message)
        }
      })
      .catch((data: any) => Promise.resolve());
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}


