import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Product } from '../model/product.model';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../service/authentication.service';
const endpointAddress = 'http://134.209.147.129:3001';
//const token = localStorage.getItem('token');

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  result: any = [];
  token: any;

  public _initializeCategory$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeCategory = this._initializeCategory$.asObservable();

  public _product$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _product = this._product$.asObservable();

  public _barnd$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _barnd = this._barnd$.asObservable();

  public _company$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _company = this._company$.asObservable();

  public _clear$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _clear = this._clear$.asObservable();

  products: Product[]
  constructor(private http: HttpClient, private auth: AuthenticationService) {
    // this.auth._loggedInUser.subscribe(res => {
    //   this.token = res;
    //   console.log('sdd', this.token)
    // })
  }


  ngOnInit() { }




  private extractData(res: Response) {
    let body = res;
    return body || {};
  }



  createProduct(createProjectRequest): Observable<any> {
    console.log('previous', this.token)
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };
    var request = createProjectRequest;
    return this.http
      .post(endpointAddress + '/add_product', request, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError<any>('createProduct')));
  }

  productList(createProjectRequest): Observable<any> {
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };
    var request = createProjectRequest;
    return this.http
      .post(endpointAddress + '/list_product', request, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError<any>('productList')));
  }



  productUpdate(product): Observable<any> {
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };
    var request = product;
    return this.http
      .post(`${endpointAddress}/update_product`, request, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError<any>('productUpdate')));
  }


  filterData(): Observable<any> {
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };

    return this.http
      .post(`${endpointAddress}/list_filter_product`, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError<any>('filtered values')));
  }



  productView(productview): Observable<any> {
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };
    var request = productview;
    return this.http
      .post(endpointAddress + '/view_product', request, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError<any>('productView')));
  }



  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }



}