import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { NavParams, PopoverController, NavController, ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { OrderModal } from '../../model/order-model';
import { OrderService } from '../../service/order.service';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { RestService } from '../../service/rest.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';




@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.page.html',
  styleUrls: ['./add-order.page.scss'],
})
export class AddOrderPage implements OnInit {

  toggleOrderedFor = '';
  formdata: any;
  productObj: any;
  productObj1: any;
  orderTypeAgency = false;
  orderTypeOthers = false;
  result: any;
  agency_name = 'ifco';

  formdataarray: any = [];
  state: any = [
    "Karnataka",
    "AndhraPradesh",
    "Kerala",
    "Bihar"
  ];
  showLoadingIndicator: boolean = false;
  product_id: any;
  district: any = [];
  units: any;
  status = ['created', 'notcreated', 'confirmed'];
  dropdownList = [];
  selectedItems = [];
  orderforSettings = {};
  dropdownSettings = {};
  dropdownSettings1 = {};
  agencydropdownSettings = {};
  farmerdropdownSettings = {};
  categorydropdownSettings = {};
  productdropdownSettings = {};
  statuSettings={};
  orderFormArray: any = [];
  farmerList: any = [];
  categoryList: any = [];
  ordered_for: any = [
    'Agency',
    'Other'
  ];
  testtt: any = [{category_id: 123, category_name: 'gggg'}];

  public orderForm: FormGroup;
  public editOrderForm: FormGroup;
  public items: FormArray;
  public moreOrderForm: FormGroup;
  public ShowAddMoreOders = false;
  public hideButton = false;

  public extractButton = true;
  public showStateDistrict = false;
  public modalType: any;
  public OrderData: any;
  public orderModal: OrderModal = new OrderModal();
  public pop: PopoverController;

  OrderDataModel: any;
  dialogRef: any;
  products: any = [];
  unitDropval = [];
  category: any = [];
  agencyList: any = [];
  catid: any;
  userdetails: any;
  on_the_behalf: any;
  productprice = 0;
  apiProdArr = [];
  editProducts:any = [];
  role:any;
  disableAgency:boolean = false;
  arr = [];
  constructor(public popoverCtrl: PopoverController, public toaster: ToastrService,
    private http:HttpClient, private formBuilder: FormBuilder,
    navParams: NavParams, public modalCtrl: ModalController,
    public orderService: OrderService, public restService: RestService) {
    // this.restService._userDropDownAgencyList$.subscribe(data => {
    // this.on_the_behalf = [];
    // this.on_the_behalf = this.on_the_behalf.concat(data);
    // });
    // console.log('on behalf of', this.on_the_behalf);
    this.role = JSON.parse(localStorage.getItem('user'));
   if(this.role.role === 'Field Agent'){
     this.disableAgency = true;
   } else {
    this.disableAgency = false;
   }


    this.orderService.getProducts().subscribe(res => {
      if (res) {
        this.agencyList = res.agency_name.map(obj => obj);
      }
    });

    this.categorydropdownSettings = {
      singleSelection: true,
      idField: 'category_id',
      textField: 'category_name',
      allowSearchFilter: true
    };
    // this.userdetails = JSON.parse(localStorage.getItem('user'));
    // console.log('checking order:', this.userdetails);

    this.orderService.getProducts().subscribe(res => {

      this.units = res.units;
      this.category = res.category_name.map(category => {

        return category.category_name;
      });
    });
    this.orderService.filterListData().subscribe(res => {
      console.log('districts >>>', res);
      if (res) {
        this.district = res.districts;
      }
    });

    this.dropdownSettings = {
      singleSelection: true,
      allowSearchFilter: true
    };

    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'product_id',
      textField: 'product_name',
      allowSearchFilter: true
    };
    this.statuSettings = {
        singleSelection: true,
        allowSearchFilter: true
    };

    this.farmerdropdownSettings = {
      singleSelection: true,
      idField: 'farmer_id',
      textField: 'first_name',
      allowSearchFilter: true
    };

    this.agencydropdownSettings = {
      singleSelection: true,
      idField: 'agency_id',
      textField: 'agency_name',
      allowSearchFilter: true,
    };

    this.productdropdownSettings = {
      singleSelection: true,
      idField: 'product_id',
      textField: 'product_name',
      allowSearchFilter: true
    };


    this.pop = navParams.get('modalController');
    console.log("pop", this.pop);

    this.modalType = navParams.get('modalType');
    console.log("this.modalType", this.modalType);
    if (this.modalType == 'addOrder') {
     // this.OrderData = this.orderModal
    }


    if (this.modalType == 'editOrder' || this.modalType == 'viewOrder') {
     
      this.OrderDataModel = navParams.get('orderData');
      // this.OrderData = this.OrderDataModel;
       console.log("OrderData values", this.OrderData);
      // this.OrderData.State = [this.OrderDataModel.State];
     //  this.OrderData.District = [this.OrderDataModel.District];
       // this.OrderData.Products = [this.OrderDataModel.Products];
        const token = localStorage.getItem('token');
         let httpOptions = {
         headers: new HttpHeaders({
         "Content-Type": "application/json",
         "Authorization": token,
         })
         };
         const request = {
           order_id: this.OrderDataModel.order_id
       };
           this.http
     .post('http://134.209.147.129:3001/view_order', request, httpOptions).subscribe((res: any) => {
     this.OrderData = res.message;
      this.OrderData.status = [this.OrderData.status];
      this.editProducts =  this.OrderData.products.map( obj => {
            const t = {
              category_name: {category_id: obj.category_id, category_name: obj.category_name},
              product_name: {product_id: obj.product_id, product_name: obj.product_name},
              unit: {unit: obj.unit},
              mrp: obj.mrp,
              quantity: obj.quantity
            };
            return t;
      });
      const that = this;
      this.arr = this.editProducts.map((i) => {
            return that.BuildFormDynamic(i);
      });


      console.log('==:>?,', this.OrderData);
      this.editOrderForm.setControl('items', this.formBuilder.array(this.arr));
      const m = this.editOrderForm.get('items') as FormArray;
      console.log('form builder', m)//this.editOrderForm.get('items'));
     });
   }

    this.orderService.farmerList().subscribe(res => {
      console.log('farmer List', res);
      if (res && res !== undefined) {
        if (res.statusCode == 200) {
          this.farmerList = res.data;
        }
      }
    });

    this.orderService.filterProductCategory({}).subscribe(res => {
      if (res) {
        this.categoryList = res.category_name;
      }
      // console.log('=====>', res );
    });

  }


  ngOnInit() {
    this.orderForm = new FormGroup({
      ordered_foragency: new FormControl(),
      ordered_forfarmer: new FormControl(),
      ordered_forexuser: new FormControl(),
      farmer_id: new FormControl(),
      on_the_behalf: new FormControl(),
     category: new FormControl('', [Validators.required]),
      product: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      mrp:new FormControl(),
      updated_by:new FormControl(),
    });


    this.moreOrderForm = new FormGroup({
      total_price: new FormControl(),
      total_order: new FormControl(),
      expected_date: new FormControl(),
      delivered_date: new FormControl(),
      place: new FormControl(),
      pincode: new FormControl(),
      district: new FormControl(),
      state: new FormControl(),
      status: new FormControl()
    });

    //this.items = this.editOrderForm.get('items') as FormArray;


    this.editOrderForm =  this.formBuilder.group({
      order_id: '',
      ordered_for: '',
      farmer_id: '',
      expected_date: '',
      delivered_date: '',
      place: '',
      pincode: '',
      district: '',
      state: '',
      order_status: '',
      updated_by: '',
      price: '',
      items: null,//this.formBuilder.array([ ...this.arr ])
    });

//     this.OrderData.products.forEach( obj => {
//       const t = {
//         category_name: [{category_id: obj.category_id, category_name: obj.category_name}],
//         product_name: [{product_id: obj.product_id, product_name: obj.product_name}],
//         unit: obj.unit,
//         mrp: obj.mrp,
//         quantity: obj.quantity
//       };

//       this.items = this.editOrderForm.get('items') as FormArray;
//       this.items.push(this.BuildFormDynamic( t));

//      // this.arr.push(this.BuildFormDynamic( t));
//      // return t;
// });


  }

BuildFormDynamic(item): FormGroup {
 return this.formBuilder.group({
      category: item.category_name,
      products: item.product_name,
      unit: item.unit,
      quantity: item.quantity,
      mrp: item.mrp,
  });
}


  onItemSelect(event, t) {

    console.log("selected category", event);
    if (t === 'category') {
      const cid = {
        category_id: [event.category_id]
      };
      this.orderService.filterProductCategory(cid).subscribe(res => {
        this.products = res.product_name;
        this.unitDropval = res.units;
      });
    } else if (t === 'product') {
      this.products.forEach(element => {
        if (element.product_id == event.product_id) {
          this.orderModal.quantity = 1;
          this.orderModal.price = element.mrp;
          this.productprice = element.mrp;
          console.log(this.productprice);
        }
      });
    } else if (t === 'quantity') {
      if (event) {
        // tslint:disable-next-line: radix
        // console.log(event);
        this.orderModal.price = event.target.value * this.productprice;
      } else {
        this.orderModal.price = 0;
      }
    }


  }




  addOrder() {
    if (this.orderForm.valid) {
      console.log("forms values", this.orderForm.value);
      this.toaster.success("success", "Order Added Successfully");
      this.orderForm.reset();
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  addMoreOrder(vall) {
    this.formdata = vall;

    const t = {
      category: vall.category[0].category_name,
      products: vall.product[0].product_name,
      units: vall.units,
      quantity: vall.quantity,
      price: vall.price
    };

    const tt = {
      product_id: vall.product[0].product_id,
      quantity: vall.quantity
    };

    this.apiProdArr.push(tt);

    this.formdataarray.push(t);
    let tprc = 0;
    this.formdataarray.forEach(itm => {
      tprc = tprc + itm.price;
    });

    this.ShowAddMoreOders = true;
    this.orderModal.total_price = tprc;
    if (this.orderModal.state) { } else {
      this.orderModal.state = 'Karnataka';
    }

    if (this.orderModal.place) { } else {
      this.orderModal.place = 'Abbani';
    }

    if (this.orderModal.pincode) { } else {
      this.orderModal.pincode = '560037';
    }

    if (this.orderModal.district) { } else {
      this.orderModal.district = 'Kolar';
    }
    // this.orderForm.reset();
    this.orderModal.quantity = '';
    this.orderModal.category = '';
    this.orderModal.products = '';
    this.orderModal.units = '';
    this.orderModal.price = '';
  }


  addtotalOrder(ordersdata) {

    let finalObj: any = {};
    finalObj.order_for = this.toggleOrderedFor;
    if (this.toggleOrderedFor === 'farmer') {
      finalObj.farmer_id = this.formdata.farmer_id[0].farmer_id;
    } else if (this.toggleOrderedFor === 'agency') {
      finalObj.on_behalf_of = this.formdata.on_the_behalf[0].agency_id;
      finalObj.ordered_for_id = this.formdata.ordered_foragency[0].agency_id;
    } else if (this.toggleOrderedFor === 'external_user') {
      finalObj.on_behalf_of = this.formdata.on_the_behalf[0].agency_id;
      finalObj.order_for_name = this.formdata.ordered_forexuser;
      finalObj.place = ordersdata.place;
      finalObj.pincode = ordersdata.pincode;
      finalObj.state = ordersdata.state;
      finalObj.district = ordersdata.district;
    }
    finalObj.products = this.apiProdArr;
    finalObj.order_total = ordersdata.total_order;
    finalObj.expected_date = ordersdata.expected_date;
    // console.log('finalObj', finalObj);
    // this.closeModal();
    this.orderService.createOrder(finalObj).subscribe(res => {
      if (res) {
        // console.log(res);
        if (res.statusCode == 200) {
          setTimeout(() => {
            this.closeModal();
          }, 1000);
        }
        alert(res.message);
      }
    });
  }


  updateOrder(val) {


    const p = val.items.map( m => {
          const tt = {
            product_id: m.products.product_id,
            cat_id: m.category.category_id,
            unit: m.unit.unit,
            price: m.mrp,
            quantity: m.quantity
          };
          return tt;
    });

    const sendObjData = {
      order_id: val.order_id,
      order_status: val.order_status,
      products: p,
      expected_date: val.expected_date,
      delivered_date: val.delivered_date
    };

    console.log('val  ==>', sendObjData);
    this.orderService.orderUpdate(sendObjData).subscribe( res => {
      if (res) {
        // console.log(res);
        if (res.statusCode == 200) {
          setTimeout(() => {
            this.closeModal();
          }, 1000);
        }
        alert(res.message);
      }
    });

  }
  addModalclose() {
    this.modalCtrl.dismiss();
  }

  modalclose() {
    this.modalCtrl.dismiss();

  }

  checkExtractbutton(event) {
    if (event.target.value.length === 6) {
      this.extractButton = false;
    } else {
      this.showStateDistrict = false;
      this.extractButton = true;
    }

  }
  extractDistrictState(pin) {
    this.showStateDistrict = true;
  }


  onProductSelect1(event) {
    this.productObj1 = event;
  }
  onProductSelect(event) {


    this.productObj = event;
  }
  setOrderType(event) {
    // console.log("event", event);
    if (event == "Agency") {
      this.orderTypeAgency = true;
      this.orderTypeOthers = false;
    }
    else if (event == "Other") {
      this.orderTypeOthers = true;
      this.orderTypeAgency = false;
    }

  }
}