import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController
} from '@ionic/angular';

import { Component, OnInit, Input, OnChanges, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';

import { ProductService } from '../../service/product.service';
import { GridOptions } from "ag-grid-community";
import { AuthenticationService } from '../../service/authentication.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// import { FullWidthCellRenderer } from "./full-width-cell-renderer.component";
import { ActivatedRoute } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AddProductPage } from '../../modal/add-product/add-product.page';
import { ProductActionPage } from '../../modal/product-action/product-action.page';



export interface filterlist {
  displayName: any;
  value: any;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage {

  openMenu: Boolean = false;
  //filter variables
  // filter variables
  @ViewChild('search') searchTextBox: ElementRef;
  @Output() passdata = new EventEmitter<string>();
  searchCategoryControl = new FormControl();
  searchProductControl = new FormControl();
  searchBrandControl = new FormControl();
  searchCompanyControl = new FormControl();

  selectCategoryFormControl = new FormControl();
  selectProductFormControl = new FormControl();
  selectBrandFormControl = new FormControl();
  selectCompanyFormControl = new FormControl();

  filteredCategory: Observable<any[]>;
  filteredProduct: Observable<any[]>;
  filteredBrand: Observable<any[]>;
  filteredCompany: Observable<any[]>;
  selectedCategoryValues = [];
  selectedProductValues = [];
  selectedBrandValues = [];
  selectedCompanyValues = [];
  companyName = []; brandName = []; productName = []; CategoryName: any = [];

  selectedDataToFilter: any = { category_name: [], product_name: [], brand_name: [], company_name: [], category_id: [], product_id: [] }
  filterList: filterlist[] = [];
  productHeader: any = [];
  toggle: boolean = false;
  removable = true;
  selectable = true;
  cat_id: any = [];
  productId: any = [];
  public filterTags: any = [];
  public filterFlag: boolean = false;
  public clearButtonFlag: Boolean = false;
  CategoryCount: any;
  ProductCount: any;
  visible: boolean = false;
  allrowdata: any = [];
  rowdata: any = [];
  filterLength: number;
  agencyFilter: boolean = false;
  searchKey = '';
  yourLocation = '123 Test Street';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';

  result;
  private gridOptions: GridOptions;

  form: FormGroup;
  selectedItems = [];
  showLoadingIndicator: boolean = false;
  result_id: any = [];
  newcat: any = [];

  LIMITS = [
    { key: '10', value: 10 },
    { key: '20', value: 20 },
    { key: '18', value: 18 },
    { key: '100', value: 100 }
  ];




  //pagination
  pagination: any = [];
  countpage = 1;
  prevPage: Number;
  nextPage: Number;
  totalCount;
  token: any;
  productBtn: any;
  selectedValues = [];

  _: any;

  //pagination
  gridApi;
  gridColumnApi;

  // array of all items to be paged
  private allItems: any[];

  pager: any = {};

  pagedItems: any[];
  recieve: any = [];
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private authService: AuthenticationService, private route: ActivatedRoute,
    private userService: ProductService, private http: HttpClient,
    private _roleServe: RoleBaseAccesService,
    // private excelService: ExcelService,
  ) {

    this.userService.filterData().subscribe((ele) => {
     // console.log('res', ele);
      var result = ele.product_name.reduce((unique, o) => {
        if (!unique.some(obj => obj.product_name === o.product_name)) {
          unique.push(o);
        }
        return unique;
      }, []);
     // console.log('filter array', result);

      var cat = ele.category_name.reduce((unique, o) => {
        if (!unique.some(obj => obj.category_name === o.category_name)) {
          unique.push(o);
        }
        return unique;
      }, []);
     // console.log('filter array', cat);

      this.userService._initializeCategory$.next(cat);
      this.userService._product$.next(result);
       var filtered = ele.brand_name.filter(function (el) {
        return el != '';
         
      }); 
      console.log('ddd',filtered)
      this.userService._barnd$.next(filtered);
 
      var filteredComp = ele.company_name.filter(function (el) {
        return el != '';
      }); 
      console.log('ddd',filteredComp)

      this.userService._company$.next(filteredComp);

    })


    this.filteredCategory = this.searchCategoryControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterCategory(name))
      );
    this.filteredProduct = this.searchProductControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterProduct(name))
      );
    this.filteredBrand = this.searchBrandControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterBrand(name))
      );
    this.filteredBrand = this.searchBrandControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterBrand(name))
      );



    // this.authService._UserRole$.subscribe((res) => {
    // console.log('user res', res);
    // if (res.role == 'admin') {
    // this.productBtn = true;
    // }
    // })
    this.token = JSON.parse(localStorage.getItem('user'));
    // console.log('USER',this.token)
    this.productBtn = this.token.role;


  


    this.gridOptions = <GridOptions>{
      enableSorting: true,
      enableFilter: true,
      enableBrowserTooltips: true,
      suppressRowClickSelection: true,
      // rowSelection: 'multiple',
      // groupSelectsChildren: true,
      groupSelectsFiltered: true,
   };




    this.gridOptions.columnDefs = [

      {
        headerName: "Action",
        field: "actions",
        cellRendererFramework: ProductActionPage,
        cellRendererParams: { viewProduct: true, editProduct: true },
        suppressFilter: true,
        suppressSorting: true,
        width: 110,
        suppressSizeToFit: true
      },

  //     {
  //       headerName: "Actions",
  //       field: 'Actions',
  //       suppressMenu: true,
  //       suppressSorting: true,

  //       template:
  //         `
  // <ion-icon name="eye" data-action-type="view" class="pad-r-10" title="View"></ion-icon>&nbsp; &nbsp;
  // <ion-icon ios="ios-create" md="md-create" class="pad-r-10" title="Edit" data-action-type="edit"></ion-icon>
  // `,
  //       width: 190,


  //     },
      {
        headerName: 'Product ID', field: 'product_id', sortable: true, filter: true, width: 130,
        tooltipField: "Product Id",
        suppressSizeToFit: true,
      //  cellStyle: {color: 'red', 'background-color': 'green'}
        // headerCheckboxSelection: true,
        // headerCheckboxSelectionFilteredOnly: true,
        // checkboxSelection: true

      },
      {
        headerName: 'Product Name', field: 'product_name', sortable: true, filter: true, width: 200,
        tooltipField: "Product",
        suppressSizeToFit: true
      },

      {
        headerName: 'Category Name', field: 'category_name', sortable: true, filter: true, width: 180,
        tooltipField: "Category Name",
        suppressSizeToFit: true,
      },


      {
        headerName: 'Company Name', field: 'company_name', sortable: true, filter: true, width: 200,
        tooltipField: "Company Name",
        suppressSizeToFit: true
      },
      {
        headerName: 'Brand Name', field: 'brand_name', sortable: true, filter: true, width: 120,
        tooltipField: "Brand Name",
        suppressSizeToFit: true,
      },
      {
        headerName: 'MRP', field: 'mrp', sortable: true, filter: true, width: 100,
        tooltipField: "MRP",
        suppressSizeToFit: true,
      },
      {
        headerName: 'Unit', field: 'unit', sortable: true, filter: true, width: 100,
        tooltipField: "Unit",
        suppressSizeToFit: true,
      },
      {
        headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, width: 100,
        tooltipField: "Quantity",
        suppressSizeToFit: true,
      },
      {
        headerName: 'Availability', field: 'availability', sortable: true, filter: true, width: 100,
        tooltipField: "Availability",
        suppressSizeToFit: true,
      },
      {
        headerName: 'Expiry Date', field: 'expiry_date', sortable: true, filter: true, width: 160,
        tooltipField: "Expiry Date",
        suppressSizeToFit: true,
      },
      {
        headerName: 'Status', field: 'status', sortable: true, filter: true, width: 100,
        tooltipField: "status",
        suppressSizeToFit: true,
      },





    ];
    this.gridOptions.localeText = { noRowsToShow: 'No Products to show' };
    this.gridOptions.rowData = this.rowdata;
    this.gridOptions.rowClass = 'my-green-class';
    this.productHeader = this.gridOptions.columnDefs;


    this.userService._clear.subscribe((ele) => {
      // console.log('ele888', ele);
      this.rowdata = ele.map(o => {
       let tmp = {
         product_id: o.product_id,
         product_name: o.product_name,
         // category_id: o.category_id,
         company_name: o.company_name,
         category_name: [o.category_name],
         brand_name: o.brand_name,
         mrp: o.mrp,
         unit: [o.unit],
         quantity: o.quantity,
         availability: o.availability,
         status: o.status,
         expiry_date: this.getFormattedDate(new Date(o.expiry_date))
       };
       return tmp;
     });
      // this.rowdata = ele;
     })
 


  }

  ngOnInit() {

    this.pageCount(this.countpage);

    this.userService._initializeCategory.subscribe(data => {
     // console.log('category***', data)
      this.CategoryName = [];
      this.CategoryName = this.CategoryName.concat(data);
      this.filteredCategory = this.searchCategoryControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterCategory(name))
        );
    });
    this.userService._product.subscribe(data => {
     // console.log('product***', data)
      this.productName = [];
      this.productName = data;
      this.filteredProduct = this.searchProductControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterProduct(name))
        );
    });
    this.userService._barnd.subscribe(data => {
     // console.log('barand***', data)
      this.brandName = [];
      this.brandName = data
      this.filteredBrand = this.searchBrandControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterBrand(name))
        );
    });

    this.userService._company.subscribe(data => {
     // console.log('company***', data)
      this.companyName = [];
      this.companyName = data
      this.filteredCompany = this.searchCompanyControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterCompany(name))
        );
    });

  }





  getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-' + day;
  }



  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");
      this.token = JSON.parse(localStorage.getItem('user'));
      if (this.token.role == 'Admin') {
        //this.productBtn = true;
        switch (actionType) {
          case "view":
            return this.viewProduct(data);
          case "edit":
            return this.editModal(data);
        }
      }

    }
  }

  productView(i) {
    let sendObjData = {
      "product_id": i,
    }
    this.userService.productView(sendObjData).subscribe(ele => {
    })
  }

  async viewProduct(data) {
    const modal = await this.modalCtrl.create({
      component: AddProductPage,
      componentProps: {
        message: 'passed message',
        mylist: data,
        modalType: 'viewProduct', modalController: this.modalCtrl
      }
    })
    await modal.present();

  }


  async editModal(data) {
    const modal = await this.modalCtrl.create({
      component: AddProductPage,
      componentProps: {
        message: 'passed message',
        mylist: data,
        modalType: 'editProduct', modalController: this.modalCtrl
      }
    })
    await modal.present();

  }






  addProduct(): Promise<void> {
    return this.modalCtrl.create({
      component: AddProductPage,
      componentProps: { message: 'passed message', modalType: 'addProduct', modalController: this.modalCtrl }
    })
      .then(popover => popover.present());
  }



  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddProductPage,
      componentProps: { message: 'passed message', modalType: 'addProduct', modalController: this.modalCtrl }
    })
    await modal.present();

  }

  //pagination

  limit: number = this.LIMITS[0].value;
  rowLimits: Array<any> = this.LIMITS;

  changeRowLimits(event) {
    this.limit = event.target.value;
   // console.log('limit', this.limit)
  }


  pageCount(count) {
    //console.log('count', count);
    this.countpage = count - 1;
    this.prevPage = count - 1;
    this.nextPage = count + 1;

    if (this.countpage <= 0) {
      this.prevPage = 1;
    }

    let sendObjData = {
      "page": this.countpage,
      "limit": this.limit,
    }

    this.userService.productList(sendObjData).subscribe(ele => {
      this.showLoadingIndicator = true;
      this.totalCount = ele.product_count;
      var temp: any = ele;
      this.showLoadingIndicator = false;
      if (ele.statusCode == "200") {
        this.result = temp.message;

        this.rowdata = this.result.map(o => {
          let tmp = {
            product_id: o.product_id,
            product_name: o.product_name,
            // category_id: o.category_id,
            company_name: o.company_name,
            category_name: [o.category_name],
            brand_name: o.brand_name,
            mrp: o.mrp,
            unit: [o.unit],
            quantity: o.quantity,
            availability: o.availability,
            status: o.status,
            expiry_date: this.getFormattedDate(new Date(o.expiry_date))
          };
          return tmp;
        });
        this.allrowdata = this.rowdata;
        this.allItems = this.rowdata;
        this.findCount(ele.product_count);

      }

    })

  }


  applyFilter() {
    Object.keys(this.selectedDataToFilter).forEach(key =>{
     this.selectedDataToFilter[key].length === 0 ? delete this.selectedDataToFilter[key] : key
    
    }  );
    //  console.log('filter**',this.selectedDataToFilter)
    
    this.userService.productList(this.selectedDataToFilter).subscribe(data => {
   //  console.log('data8888',data);
     if(data !== undefined){
       if(data.statusCode == '200'){
         console.log('apply filter==>',data);
         //this.rowdata = data.message;
         this.rowdata = data.message.map(o => {
          let tmp = {
            product_id: o.product_id,
            product_name: o.product_name,
            // category_id: o.category_id,
            company_name: o.company_name,
            category_name: [o.category_name],
            brand_name: o.brand_name,
            mrp: o.mrp,
            unit: [o.unit],
            quantity: o.quantity,
            availability: o.availability,
            status: o.status,
            expiry_date: this.getFormattedDate(new Date(o.expiry_date))
          };
          return tmp;
        });
         
        }
       else {
         this.rowdata = [];
         this.allrowdata = [];
       }
     }
     else {
       this.rowdata = [];
       this.allrowdata = [];
     }
    
    })
    this.togglePopupMenu();
    }

  export() {

    const sendObjData = {
    'page': this.countpage,
    'limit': this.limit,
    };
    
    const endpoint = 'http://134.209.147.129:3001';
    const constants = {
    xmlheaders: {
    headers: new HttpHeaders({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }),
    responseType: 'blob' as 'blob'
    }
    };
    this.http
    .post(endpoint + '/export_list_product', sendObjData, constants.xmlheaders)
    .subscribe(data => {
    const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    FileSaver.saveAs(new Blob([data], { type: type }), 'sample-file.xlsx');
    });
    }

  

  findCount(total) {
    total = Math.ceil(this.totalCount / 10);
    console.log('total', total);
    this.pagination = [];
    for (let i = 1; i <= total; i++) {
      this.pagination.push(i);

    }
    console.log('pagination', this.pagination)
  }






  getTopics(event) {
    var val = Number(event.target.value);
    let sendObjData = {
      "product_id": val
    }
    if (val) {
      this.userService.productView(sendObjData).subscribe((ele) => {
        if (ele == undefined) {
          this.rowdata = [];
        }
        else if (ele.message) {
          this.rowdata = [ele.message];//this.result_id;
        }

      })
    } else {
      this.rowdata = this.allrowdata;
    }
  }

  calling() {
    this.rowdata = this.allrowdata;
  }

  onCancel($event) {
    this.rowdata = this.allrowdata;
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateRoot('/login')
  }


  onItemSelect(e, ) {
    for (let i = 0; i <= this.productName.length; i++) {
      if (this.selectedItems[0].category_id === this.productName[i].category_id) {
        this.newcat = [];
        this.newcat.push(this.productName[i]);

        this.productName = this.newcat;
      }


    }

  }

  // clicking(event) {
  //   this.recieve = event;
  //   console.log('this.recieve', this.recieve);

  //   this.userService.productList(this.recieve).subscribe(data => {
  //     console.log('data8888', data);
  //     if (data !== undefined) {
  //       if (data.statusCode == '200') {
  //         console.log('apply filter==>', data)
  //         this.rowdata = data.message;

  //       }
  //       else {
  //         this.rowdata = [];
  //         this.allrowdata = [];
  //       }
  //     }
  //     else {
  //       this.rowdata = [];
  //       this.allrowdata = [];
  //     }

  //   })
  // }



  hideShowColumns(data) {
    console.log('data', data);
    const columns = this.gridOptions.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.gridOptions.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptions.api.sizeColumnsToFit();
  }


  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }

  //filter functions

  // Used to filter data based on search input





  private _filterCategory(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectCategoryFormControl.patchValue(this.selectedCategoryValues);

    let filteredList = this.CategoryName.filter(option => option.category_name.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }
  private _filterProduct(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectProductFormControl.patchValue(this.selectedProductValues);
    let filteredList = this.productName.filter(option => option.product_name.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }
  private _filterBrand(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectBrandFormControl.patchValue(this.selectedBrandValues);
    let filteredList = this.brandName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  private _filterCompany(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectCompanyFormControl.patchValue(this.selectedCompanyValues);
    let filteredList = this.companyName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
    //  console.log(" company filtered list", filteredList)
  }




  submit(e) {
    console.log('checked', e)
    //this.selectedDataToFilter.category_id = [];
    if (e.checked) {
      this.selectedDataToFilter.category_id.push(e.category_id);

      console.log('checked', this.selectedDataToFilter.category_id)
    }

    else {
      for (let i = 0; i < this.selectedDataToFilter.category_id.length; i++) {
        if (this.selectedDataToFilter.category_id[i] == e.category_id) {
          this.selectedDataToFilter.category_id.splice(i, 1);
          break;
        }
      }
    }
    this.CategoryCount = this.selectedDataToFilter.category_id.length;
    console.log('count', this.CategoryCount)
    console.log("arrchecksdsd", this.selectedDataToFilter.category_id)
  }


  productSubmit(e) {
    // this.selectedDataToFilter.product_id = [];
    if (e.checked) {

      this.selectedDataToFilter.product_id.push(e.product_id)
    }
    else {
      for (let i = 0; i <= this.selectedDataToFilter.product_id.length; i++) {
        if (this.selectedDataToFilter.product_id[i] == e.product_id) {
          this.selectedDataToFilter.product_id.splice(i, 1);
          break;
        }
      }
    }
    this.ProductCount = this.selectedDataToFilter.product_id.length;
    console.log('product id', this.selectedDataToFilter.product_id.map(String))

  }

  




  selectionChange(event, type) {
    if (event.isUserInput && event.source.selected == false) {
      if (type == 'category') {
        let indexAgency = this.selectedCategoryValues.indexOf(event.source.value);
        this.selectedCategoryValues.splice(indexAgency, 1)
        let index = this.selectedDataToFilter.category_name.indexOf(event.source.value)
        this.selectedDataToFilter.category_name.splice(index, 1)
      }

      if (type == 'product') {
        let indexDistrict = this.selectedProductValues.indexOf(event.source.value);
        this.selectedProductValues.splice(indexDistrict, 1)
        let index = this.selectedDataToFilter.product_name.indexOf(event.source.value)
        this.selectedDataToFilter.product_name.splice(index, 1)
      }

      if (type == 'brand') {
        let indexPlace = this.selectedBrandValues.indexOf(event.source.value);
        this.selectedBrandValues.splice(indexPlace, 1)
        let index = this.selectedDataToFilter.brand_name.indexOf(event.source.value)
        this.selectedDataToFilter.brand_name.splice(index, 1)
      }

      if (type == 'company') {
        let indexPlace = this.selectedCompanyValues.indexOf(event.source.value);
        this.selectedCompanyValues.splice(indexPlace, 1)
        let index = this.selectedDataToFilter.company_name.indexOf(event.source.value)
        this.selectedDataToFilter.company_name.splice(index, 1)
      }

      let indexFilter = this.filterList.findIndex(x => x.displayName === event.source.value);
      this.filterList.splice(indexFilter, 1);

    }

    if (event.isUserInput && event.source._selected) {
      if (type == 'category') {
        this.selectedDataToFilter.category_name = this.selectedDataToFilter.category_name.concat(event.source.value)
      }
      else if (type == 'product') {
        this.selectedDataToFilter.product_name = this.selectedDataToFilter.product_name.concat(event.source.value)
      }
      else if (type == 'company') {
        this.selectedDataToFilter.company_name = this.selectedDataToFilter.company_name.concat(event.source.value)
      }
      else if (type == 'brand') {
        this.selectedDataToFilter.brand_name = this.selectedDataToFilter.brand_name.concat(event.source.value)
      }

      let selected_data = { type: type, displayName: event.source.value, value: event }
      if (this.filterList.indexOf(event.source.value) === -1) {
        this.filterList.push(selected_data);
      }

      if (this.filterList.length > 0) {
        this.filterLength = this.filterList.length;
        this.clearButtonFlag = true;
      } else {
        this.clearButtonFlag = false;
      }
    }
    if (event.source._selected == false) {
      let selected_data = { id: event.source.id, displayName: event.source.value, value: event }
    }
  }



  openedChangeCategory(e) {
    console.log('category', e);
    this.setSelectedValuesCategory();
    this.searchCategoryControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }
  openedChangeProduct(e) {
    this.setSelectedValuesProduct();
    this.searchProductControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }
  openedChangeBrand(e) {
    this.setSelectedValuesBrand();
    this.searchBrandControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }

  }


  openedChangeCompany(e) {
    this.setSelectedValuesCompany();
    this.searchCompanyControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }

  }

  setAgencyFilter() {
    this.agencyFilter = !this.agencyFilter;
  }

  /**
  * Clearing search textbox value
  */
  clearSearch(event) {

    event.stopPropagation();
    this.searchCategoryControl.patchValue('');

  }


  setSelectedValuesCategory() {
    console.log('ddddd', this.selectCategoryFormControl)
    if (this.selectCategoryFormControl.value && this.selectCategoryFormControl.value.length > 0) {
      this.selectCategoryFormControl.value.forEach((e) => {
        if (this.selectedCategoryValues.indexOf(e) == -1) {
          this.selectedCategoryValues.push(e);
        }
      });
    }
  }
  setSelectedValuesProduct() {
    if (this.selectProductFormControl.value && this.selectProductFormControl.value.length > 0) {
      this.selectProductFormControl.value.forEach((e) => {
        if (this.selectedProductValues.indexOf(e) == -1) {
          this.selectedProductValues.push(e);
        }
      });
    }
  }
  setSelectedValuesBrand() {
    if (this.selectBrandFormControl.value && this.selectBrandFormControl.value.length > 0) {
      this.selectBrandFormControl.value.forEach((e) => {
        if (this.selectedBrandValues.indexOf(e) == -1) {
          this.selectedBrandValues.push(e);
        }
      });
    }
  }


  setSelectedValuesCompany() {
    if (this.selectCompanyFormControl.value && this.selectCompanyFormControl.value.length > 0) {
      this.selectCompanyFormControl.value.forEach((e) => {
        if (this.selectedCompanyValues.indexOf(e) == -1) {
          this.selectedCompanyValues.push(e);
        }
      });
    }
  }



  // onFiltering(e) {
  //   // cpublic onFiltering: EmitType = (e: FilteringEventArgs) => {
  //   let query = new Query();
  //   //frame the query based on search string with filter type.
  //   query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
  //   //pass the filter data source, filter query to updateData method.
  //   e.updateData(this.CategoryName, query);
  // }


  searchByFilter() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("filterAgency");
    filter = input.value.toUpperCase();
    ul = document.getElementById("filterAgencyList");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
  displayfilter(arg) {
    this.filterFlag = arg;
  }




  remove(filter): void {
    console.log('filteretewrt', filter)
    if (filter.type == 'category') {
      let indexCategory = this.selectedCategoryValues.indexOf(filter.displayName);
      this.selectedCategoryValues.splice(indexCategory, 1)
      let index = this.selectedDataToFilter.category_name.indexOf(filter.displayName)
      this.selectedDataToFilter.category_name.splice(index, 1)
    }
    if (filter.type == 'product') {
      let indexProduct = this.selectedProductValues.indexOf(filter.displayName);
      this.selectedProductValues.splice(indexProduct, 1)
      let index = this.selectedDataToFilter.product_name.indexOf(filter.displayName)
      this.selectedDataToFilter.product_name.splice(index, 1)
    }
    if (filter.type == 'brand') {
      let indexBrand = this.selectedBrandValues.indexOf(filter.displayName);
      this.selectedBrandValues.splice(indexBrand, 1)
      let index = this.selectedDataToFilter.brand_name.indexOf(filter.displayName)
      this.selectedDataToFilter.brand_name.splice(index, 1)
    }
    if (filter.type == 'company') {
      let indexCompany = this.selectedCompanyValues.indexOf(filter.displayName);
      this.selectedCompanyValues.splice(indexCompany, 1)
      let index = this.selectedDataToFilter.company_name.indexOf(filter.displayName)
      this.selectedDataToFilter.company_name.splice(index, 1)
    }

    let indexFilter = this.filterList.findIndex(x => x.displayName === filter.displayName);
    this.filterList.splice(indexFilter, 1);
    if (this.filterList.length == 0) {

      this.clearButtonFlag = false;
      this.rowdata = this.allrowdata;
    } else {
      this.clearButtonFlag = true;
    }


  }
  filter(event) {
    if (this.filterList.indexOf(event) === -1) {

    }
    if (this.filterList.length > 0) {
      this.clearButtonFlag = true;
    } else {
      this.clearButtonFlag = false;
    }

  }
  clearFilter() {
    this.selectCategoryFormControl.patchValue("")
    this.selectProductFormControl.patchValue("")
    this.selectBrandFormControl.patchValue("")
    this.selectCompanyFormControl.patchValue("")
    this.selectedCategoryValues = [];
    this.selectedProductValues = [];
    this.selectedBrandValues = [];
    this.selectedCompanyValues = [];
    this.filterList = [];
    this.selectedDataToFilter.product_name = []
    this.selectedDataToFilter.category_name = []
    this.selectedDataToFilter.company_name = []
    this.selectedDataToFilter.brand_name = []
    this.selectedDataToFilter.category_id = []
    this.selectedDataToFilter.product_id = []

    if (this.filterList.length == 0) {
      this.clearButtonFlag = false;
    } else {
      this.clearButtonFlag = true;
    }

   // this.pageCount(this.countpage);
    this.userService.productList("").subscribe(data => {
      console.log('eee', data);

       this.userService._clear$.next(data.message);
     });
    this.togglePopupMenu();

    // this.pageCount(this.countpage);
  }


  closeModal() {
    this.modalCtrl.dismiss();
  }


}