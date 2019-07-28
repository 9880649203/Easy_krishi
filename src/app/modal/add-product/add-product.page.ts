import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { ProductService } from '../../service/product.service'
import { Product } from '../../model/product.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  newProductForm: FormGroup;
  showLoadingIndicator: boolean = false;

  productInform: Product = {
    product_id: '',
    brand_name: '',
    product_name: '',
    category_id: null,
    category_name: '',
    mrp: null,
    Unit: '',
    expiry: '',
    quantity: null,
    availability: '',
    status: ''
  };
  productData: Product;
  productInformation: Product;
  //role_display:any = [];
  message: any;
  pop: PopoverController;

  modalType: any;
  CategoryName: any = [];
  companyName = [];
  brandName = [];
  productName = [];
  addcategory = [];
  modal: ModalController;
  result;
  public list: any;
  product_list: any;
  temp_id;
  datePickerConfig: Partial<BsDatepickerConfig>;
  selectedCity: any;
  UnitData: any = [];
  categorySettings: any = {};
  unitSettings: any = {};
  categoryObjId: any;
  categoryObjName: any;
  UnitList: any;
  diabledCat:boolean =true;

  constructor(public popoverCtrl: PopoverController, navParams: NavParams,
    private toastr: ToastrService, private _serve: ProductService) {

    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD/MM/YYYY'
    })
    this.message = navParams.get('message');
    this.modalType = navParams.get('modalType');
    this.modal = navParams.get('modalController');
    this.list = navParams.get("mylist");
    //console.log('list', this.list);
    this.productData = this.list;

    this._serve.filterData().subscribe((ele) => {
      this.productName = ele.product_name;
      this.brandName = ele.brand_name;
      this.CategoryName = ele.category_name;
      this.addcategory = this.CategoryName;
      this.companyName = ele.category_name;
      this.UnitData = ele.units;
    })


  }

  ngOnInit() {
    
    var pricePattern = /^\d+\.\d{0,2}$/;
    
    this.newProductForm = new FormGroup({
      brand_name: new FormControl('', [Validators.required]),
      product_name: new FormControl('', [Validators.required]),
      expiry: new FormControl(''),
     //  mrp: new FormControl('', [Validators.required,Validators.pattern('[/^\d+\.\d{0,2}$/]'),]),
     // mrp : new FormControl('', [Validators.required, Validators.pattern(pricePattern)]),
       mrp : new FormControl(''),
      product_id: new FormControl(''),
      category_id: new FormControl(''),
      category_name: new FormControl('', [Validators.required]),
      availability: new FormControl('',[Validators.required]),
      Unit: new FormControl('', [Validators.required]),
      quantity: new FormControl(''),
      company_name: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),

    });

    this.categorySettings = {
      singleSelection: true,
      idField: 'category_id',
      textField: 'category_name',
      allowSearchFilter: true
    };

    this.unitSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

  }


  onCategorySelect(item: any) {
   // console.log('category', item);
    this.categoryObjId = item.category_id;
    this.categoryObjName = item.category_name;
  }
  onUnitSelect(item: any) {
   // console.log('unit', item);
    this.UnitList = item;
  }
  navigateBack() {
    // this.modalCtrl.dismiss()
  }
  closeModal() {
    this.modal.dismiss();
  }
  selected() {
   // console.log('event', this.selectedCity);
    //  this.temp_id = this.selectedCity.category_id;
  }

  productCreate() {
    const val = this.newProductForm.value;
    let sendObjData = {
      "product_name": val.product_name,
      "category_id": this.categoryObjId,
      "category_name": this.categoryObjName,
      "brand_name": val.brand_name,
      "mrp": val.mrp,
      "unit": this.UnitList,
      "quantity": val.quantity,
      "availability": val.availability,
      "expiry_date": this.getFormattedDate(new Date(val.expiry)),
      "company_name": val.company_name,
      "status": val.status,
    }
    this._serve.createProduct(sendObjData).subscribe(ele => {
      // console.log('list', ele);
      this.showLoadingIndicator = true;
      var temp: any = ele;
      this.showLoadingIndicator = false;
      this.result = temp.message;
      this.closeModal();
      this.toastr.success(`product ${val.product_name} added successfully.`);
      this.productList();
      // console.log('sending res',this.result)
    })
  }

  productList() {
    let sendObjData = {
      "page": 0,
      "limit": 80,
    }
    this._serve.productList(sendObjData).subscribe(ele => {
      this.showLoadingIndicator = true;
      var temp: any = ele;
      this.showLoadingIndicator = false;

    })
  }

  getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-' + day;
  }

  productUpdate() {
    const val = this.newProductForm.value;
    let sendObjData = {
      "product_id": val.product_id,
      "mrp": val.mrp,
      "unit": this.UnitList,
      "quantity": val.quantity,
      "expiry_date": val.expiry,
      "availability": val.availability,
    }
    this._serve.productUpdate(sendObjData).subscribe(ele => {
      //console.log('list', ele);
      this.showLoadingIndicator = true;
      var temp: any = ele;
      this.showLoadingIndicator = false;
      this.closeModal();
      this.toastr.success(`Product details for ${val.product_id} is modified successfully.`);
      this.productList()
    })
  }






}