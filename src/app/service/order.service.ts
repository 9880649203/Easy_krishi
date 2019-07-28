import { Injectable } from '@angular/core';
import { credit, indcredit } from '../pages/order/order.page';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const endpointAddress = 'http://134.209.147.129:3001';
const token = localStorage.getItem('token');

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
    })
};

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    public _userFilteredData$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public _userFilteredData = this._userFilteredData$.asObservable();

    public _selectedFilterItem$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public _selectedFilterItem = this._selectedFilterItem$.asObservable();

    public _order_list$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public _order_list = this._order_list$.asObservable();

    public _indent_list$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public _indent_list = this._indent_list$.asObservable();

    public _filter_type$: BehaviorSubject<any> = new BehaviorSubject<any>(String);
    public _filter_type = this._filter_type$.asObservable();

  public _initializeCategory$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeCategory = this._initializeCategory$.asObservable();

  public _product$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _product = this._product$.asObservable();

  public _initializeAgency$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeAgency = this._initializeAgency$.asObservable();

  public _initializeFieldAgent$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeFieldAgent = this._initializeFieldAgent$.asObservable();

  public _initializeDistrict$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeDistrict = this._initializeDistrict$.asObservable();

  public _initializePlace$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializePlace = this._initializePlace$.asObservable();

  public _clear$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _clear = this._clear$.asObservable();
 

  public _clear_order$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _clear_order = this._clear_order$.asObservable();

  public _totalCount$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _totalCount = this._totalCount$.asObservable();

  public _totalIndCount$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _totalIndCount = this._totalIndCount$.asObservable();

  

    public credits: any = [];

    
    constructor(private http: HttpClient) {
        this.orderList();
        //this.indentList();
        this.indentList()
    }

    private extractData(res: Response) {
        const body = res;
        return body || {};
    }

    orderList() {
        const request = {
            PAGE_NUMBER: 1,
            NUMBER_OF_ITEMS: 10
        };
        this.http
            .post(endpointAddress + '/list_order', request, httpOptions)
            .toPromise()
            .then((res: any) => {
                console.log('result order---', res);
                this._totalCount$.next(res.order_count);
                this._order_list$.next(res.message);
            })
            .catch((data: any) => Promise.resolve());
    }

    // async Test(){
    //     await this.inde+-ntList();
    // }
    indentList() {
        const request = {
            PAGE_NUMBER: 1,
            NUMBER_OF_ITEMS: 10
        };
         this.http
            .post(endpointAddress + '/list_indent', request, httpOptions)
            .toPromise()
            .then((res: any) => {
                console.log('result indent', res.message);
                /// return res;
                
                this._indent_list$.next(res.message);
                this._totalIndCount$.next(res.indent_count)
            })
            .catch((data: any) => Promise.resolve());
    }

 

    filterOrder(data) {
        this.http
            .post(endpointAddress + '/list_order', data, httpOptions)
            .toPromise()
            .then((res: any) => {
                console.log('filtered data:', res);
                this._order_list$.next(res.message);
            });
    }

    filterIndent(data) {
        this.http
            .post(endpointAddress + '/list_indent', data, httpOptions)
            .toPromise()
            .then((res: any) => {
                console.log('filtered data:', res);
                this._indent_list$.next(res.message);

            });
    }

    filterListData(): Observable<any> {
        return this.http.post(endpointAddress + '/user_dropDown', '', httpOptions)
            .pipe(map(this.extractData), catchError(this.handleError<any>('filtered values')));
    }

    filterProductCategory(data) {
        return this.http.post(endpointAddress + '/list_filter_product', data, httpOptions)
            .pipe(map(this.extractData), catchError(this.handleError<any>('filtered values')));
    }

    filterIndentCategory(data) {
        return this.http.post(endpointAddress + '/list_filter_indent', data, httpOptions)
            .pipe(map(this.extractData), catchError(this.handleError<any>('filtered values')));
    }

    getProducts(): Observable<any> {
        return this.http.post(endpointAddress + '/list_filter_order', {}, httpOptions)
            .pipe(map(this.extractData), catchError(this.handleError<any>('filtered values')));
    }

    createOrder(createProjectRequest): Observable<any> {
        return this.http
            .post(endpointAddress + '/create_order', createProjectRequest, httpOptions)
            .pipe(map(this.extractData), catchError(this.handleError<any>('createorder')));
    }

    createIndent(createProjectRequest): Observable<any> {
        console.log('Token', httpOptions);
        return this.http
            .post(endpointAddress + '/create_indent', createProjectRequest, httpOptions)
            .pipe(map(this.extractData), catchError(this.handleError<any>('createIndent')));
    }

    orderUpdate(createProjectRequest): Observable<any> {
        return this.http
            .post(endpointAddress + '/update_order', createProjectRequest, httpOptions)
            .pipe(map(this.extractData), catchError(this.handleError<any>('orderUpdate')));
    }

    indentUpdate(createProjectRequest): Observable<any> {
        return this.http
            .post(endpointAddress + '/update_indent', createProjectRequest, httpOptions)
            .pipe(map(this.extractData), catchError(this.handleError<any>('indentUpdate')));
    }

    farmerList(): Observable<any> {
        const datta: any = { district: [], place: [], agency_name: [] }
        return this.http
            .post(endpointAddress + '/farmer_list', datta, httpOptions)
            .pipe(map(this.extractData), catchError(this.handleError<any>('farmerList')));
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}
