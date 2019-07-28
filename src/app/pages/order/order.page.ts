import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
// import { OrderActionsPage } from '../../modal/order-actions/order-actions.page';
import { AddOrderPage } from '../../modal/add-order/add-order.page';
import { AddIndentPage } from '../../modal/add-indent/add-indent.page';
import { OrderService } from '../../service/order.service';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController
} from '@ionic/angular';

import { HttpHeaders, HttpClient } from '@angular/common/http';

import { IndentActionsPage } from '../../modal/indent-actions/indent-actions.page';

import { OrderActionsPage } from '../../modal/order-actions/order-actions.page';

const endpointAddress = 'http://134.209.147.129:3001';
const token = localStorage.getItem('token');

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: token
  })
};

// import { SearchFilterPage } from './filter/search-filter.page';
import { Router } from '@angular/router';

// import { OrderActionsPage } from '../order-actions/order-actions.page';

export class credit {
  public Order_Id: number;
  public Company_Name: string;
  public Brand_Name: string;
  public Agency_Name: string;
  public Price: number;
  public Unit: string;
  public Ordered_by: string;
  public Expected_Date: any;
  public Delivered_Date: any;
  public Created_Date: any;
  public ordered_for: string;
  public Place: string;
  public PinCode: number;
  public District: string;
  public State: string;
  public Farmer_id: number;
  public Field_Agent: string;
  public Category: string;
  public Products: string;
  public Quantity: string;
}
export class indcredit {
  public Indent_Id: number;
  public Company_Name: string;
  public Brand_Name: string;
  public Agency_Name: string;
  public Price: number;
  public Unit: string;
  public Ordered_by: string;
  public Expected_Date: any;
  public Delivered_Date: any;

  public ordered_for: string;
  public Place: string;
  public PinCode: number;
  public District: string;
  public State: string;
  public Farmer_id: number;
  public Field_Agent: string;
  public Category: string;
  public Products: string;
  public Quantity: string;
}
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  Order_Manager_createcheck = 'order';
  openMenu: Boolean = false;
  toggleOrder = true;
  toggleIndent = true;
  public allrowdata: any[];
  public indentdata: any[];
  public data;
  credits: credit[];
  indCredits: indcredit[];
  role_access :any;
  totalOrderCount = 0;
  totalIndentCount = 0;

  orderHeader: any = [];
  indentHeader: any = [];
  public gridOptions: GridOptions;
  public indGridOptions: GridOptions;
  searchKey = '';

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modelCtrl: ModalController,
    public toastCtrl: ToastController,
    private orderService: OrderService,
    private roleBaseAccesService: RoleBaseAccesService
  ) {
    this.role_access = JSON.parse(localStorage.getItem('user'));

    // this.allrowdata = this.orderService.credits;
    // this.data = this.orderService.credits;
    this.gridOptions = <GridOptions>{};
    this.indGridOptions = <GridOptions>{};

   this.orderService._totalCount.subscribe((res)=>{
     this.totalOrderCount = res;
    });
    this.orderService._totalIndCount.subscribe((res)=>{
      this.totalIndentCount = res;
     });

  

    this.gridOptions.columnDefs = [
      {
      headerName: 'Actions',
      width: 125,
      cellRendererFramework: OrderActionsPage,
      cellRendererParams: { editOrder: true, viewOrder: true },
      suppressFilter: true,
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'order_id',
      headerName: 'OrderId',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
        field: 'category_name',
        headerName: 'Category Name',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'product_name',
        headerName: 'Product Name',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'company_name',
        headerName: 'Company Name',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'brand_name',
        headerName: 'Brand Name',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'price',
        headerName: 'Price Number',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
      field: 'agency_name',
      headerName: 'Agency Name',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'order_status',
      headerName: 'Status',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'order_by',
      headerName: 'Order by',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'order_for',
      headerName: 'Order For',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'agency_name',
      headerName: 'Agency Name',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'expected_date',
      headerName: 'Expected Date',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'on_behalf_of',
      headerName: 'On Behalf Of',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'created_date',
      headerName: 'Created Date',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'place',
      headerName: 'Place',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'pincode',
      headerName: 'Pincode',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'district',
      headerName: 'District',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      {
      field: 'state',
      headerName: 'State',
      suppressSorting: true,
      suppressSizeToFit: true
      },
      
      ];



    this.indGridOptions.columnDefs = [
      {
        headerName: 'Actions',
        width: 125,
        cellRendererFramework: IndentActionsPage,
        cellRendererParams: { editIndent: true, viewIndent: true },
        // suppressFilter: true,
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'indent_id',
        headerName: 'Indent_Id',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'category_name',
        headerName: 'Category Name',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'product_name',
        headerName: 'Product Name',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'company_name',
        headerName: 'Company Name',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'brand_name',
        headerName: 'Brand Name',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'price',
        headerName: 'Price Number',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'unit',
        headerName: 'Unit',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'ordered_by',
        headerName: 'Order by',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'ordered_for',
        headerName: 'Order for',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'agency_name',
        headerName: 'Agency Name',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'expected_date',
        headerName: 'Expected Date',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'delivered_date',
        headerName: 'Delivered Date',
        suppressSorting: true,
        suppressSizeToFit: true
      },

      {
        field: 'place',
        headerName: 'Place',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'pincode',
        headerName: 'Pincode',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'district',
        headerName: 'District',
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'state',
        headerName: 'State',
        suppressSorting: true,
        suppressSizeToFit: true
      }
    ];

    this.gridOptions.localeText = { noRowsToShow: 'No order to show' };
    this.gridOptions.rowData = this.allrowdata;
    this.indGridOptions.rowData = [];
    this.orderHeader = this.gridOptions.columnDefs;
    this.indentHeader = this.indGridOptions.columnDefs;

    this.orderService._clear.subscribe((ele) => {
      console.log('ele888', ele);
      this.openMenu = false;
   })

   this.orderService._clear_order.subscribe((ele) => {
    console.log('ele888', ele);
    this.openMenu = false;
 })


  }

  pageCount() {
    this.orderService._order_list.subscribe(data => {


      if (data && data.statusCode === 200) {
        setTimeout(() => {
          this.allrowdata = data;
          console.log('dataadddd',data);
       
         // this.totalOrderCount = data.length;
          console.log('dSDdsdd', this.allrowdata);
        }, 500);
      }
     // this.totalOrderCount = data.length;
   //  this.totalOrderCount = data.order_count;
     console.log('dataacountssss',this.totalOrderCount);
          this.allrowdata = data.map((d) => {
            var row = d.products.map((p) => {
              var a = { ...d, ...p }
              delete a.products;
              return a;
            });
            return row;
          }).flat();

    });


    this.orderService._filter_type$.next('order');
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }

  getIndent() {
    console.log("-======================")
    this.orderService._indent_list.subscribe(data => {
      if (data && data.statusCode === 200) {
        setTimeout(() => {
          this.indentdata = data;
          //this.totalIndentCount = data.length;
         // console.log('this.totalIndentCount', this.totalIndentCount);
        }, 500);
      }

    //  this.totalIndentCount = data.length;
      //this.indentdata = data;
      this.indentdata = data.map((d) => {
        var row = d.products.map((p) => {
          var a = { ...d, ...p }
          //console.log(a)
          delete a.products
          return a
        })
        return row
      }).flat()
      console.log(this.indentdata);

      // this.gridOptions.rowData = data;
      console.log('ind list: ==>>', data);
    });

  }

  ngOnInit() {
    this.pageCount();
    this.getIndent();
  }

  addOrder(): Promise<void> {
    // console.log('clicked');

    return this.modelCtrl.create({
      component: AddOrderPage,
      componentProps: { modalType: 'addOrder', message: 'passed message', modelController: this.modelCtrl }
    }).then(popover => popover.present());
  }

  addIndent(): Promise<void> {
    return this.modelCtrl.create({
      component: AddIndentPage,
      componentProps: { modalType: 'addIndent', message: 'passed message', modelController: this.modelCtrl }
    }).then(popover => popover.present());
  }


  hideShowColumns(data) {
    const columns = this.gridOptions.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.gridOptions.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptions.api.sizeColumnsToFit();
  }

  hideShowColumns1(data) {
    const columns = this.indGridOptions.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.indGridOptions.columnApi.setColumnVisible(valueColumn, newState);
    this.indGridOptions.api.sizeColumnsToFit();
  }

  setOrderType(type) {
    if (type === 'indent') {
      this.toggleIndent = true;
      this.orderService._filter_type$.next('indent');
      this.toggleOrder = false;
    } else if (type === 'order') {
      this.toggleIndent = false;
      this.toggleOrder = true;
      this.orderService._filter_type$.next('order');
    } else {
      return;
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  // async searchFilter () {
  // const modal = await this.modalCtrl.create({
  // component: AddOrderPage
  // });
  // return await modal.present();
  // }

  // getIndentCall() {
  // const request = {
  // PAGE_NUMBER: 1,
  // NUMBER_OF_ITEMS: 10
  // };
  // this.http
  // .post(endpointAddress + '/list_indent', request, httpOptions)
  // .toPromise()
  // .then((res: any) => {
  // console.log('result indent', res.result);
  // this._indent_list$.next(res.result);
  // });

  // }

}