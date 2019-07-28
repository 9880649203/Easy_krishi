import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, ModalController } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { IndentModal } from '../../model/indent-model';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../service/order.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-indent',
  templateUrl: './add-indent.page.html',
  styleUrls: ['./add-indent.page.scss'],
})
export class AddIndentPage implements OnInit {

  agencyList:any= [];
  userRole: any;
  formdata: any;
  formdataarray: any = [];
  stateffff = [
    { 'sid': 1, 'sname': 'KARNATAKA' },
    { 'sid': 2, 'sname': 'KRISHNA' },
    { 'sid': 3, 'sname': 'TELANGANA' },
    { 'sid': 4, 'sname': 'WEST GODAVARI' },
    { 'sid': 5, 'sname': 'EAST GODAVARI' }
  ];

district =[];
 place =[];
 state =[];
category = [];
product_indent:any = [];
category_indent:any =[];
editProducts: any = [];
 products: any = [];
 status = ['created', 'notcreated', 'confirmed'];

  productprice = 0;
  apiProdArr = [];
 // displaySettings = true;

  ordered_for = ['Farmers', 'Agency', 'Companies', 'Field_Agents'];
  Category1 = ['Product List', 'Product Id'];
  Category2 = ['Product List', 'product Category'];
  Category3 = ['Product Field', 'product Category'];
  Category4 = ['Product Field', 'Product Agency'];
  Category5 = ['Product Agency', 'Product Id'];

  unitDropval = [];
  onBehalfOf = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  agencydropdownSettings = {};
  categorydropdownSettings = {};
  productdropdownSettings = {};
  statedropDownSettings = {};
  districtdropDownSettings={};
  toggleOrderedFor = 'agency';
  arr = [];

  public indentForm: FormGroup;
  public editindentForm: FormGroup;
  public items: FormArray;
  public moreindentForm: FormGroup;
  public ShowAddMoreIndents = false;
  public hideButton = false;
  public modalType: any;
  public IndentData: any;
  public indentModal: IndentModal = new IndentModal();
  public pop: PopoverController;
  IndentDataModel: any;
  datePickerConfig: Partial<BsDatepickerConfig>;

  constructor(public popoverCtrl: PopoverController, public toaster: ToastrService,
    public navParams: NavParams, public modalCtrl: ModalController,  private formBuilder: FormBuilder,
    private orderService: OrderService, private http: HttpClient
    ) {

      this.datePickerConfig = Object.assign({}, {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY'
      });

    this.agencydropdownSettings = {
      singleSelection: true,
      idField: 'agency_id',
      textField: 'agency_name',
      allowSearchFilter: true,
    };

    this.categorydropdownSettings = {
      singleSelection: true,
      idField: 'category_id',
      textField: 'category_name',
      allowSearchFilter: true
    };

    this.productdropdownSettings = {
      singleSelection: true,
      idField: 'product_id',
      textField: 'product_name',
      allowSearchFilter: true
    };

    this.statedropDownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.districtdropDownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.pop = navParams.get('modelController');
    console.log('pop', this.pop);



    this.orderService.getProducts().subscribe(res => {
          if (res) {
              this.agencyList = res.agency_name.map( obj => obj );
          }
    });

    this.orderService.filterProductCategory({}).subscribe( res => {
           if (res) {
              this.category = res.category_name;
           }
           console.log('=====>', res );
    });

    this.orderService.filterIndentCategory({}).subscribe((res)=>{
      console.log('resdd',res)
      this.state = res.state;
      this.district = res.district;
      this.place = res.place;
      this.product_indent = res.product_name;
      this.category_indent = res.category_name;

    })


    this.userRole = JSON.parse(localStorage.getItem('user'));
    this.indentModal.ordered_by = this.userRole.role;
    console.log('User Role', this.userRole);

  }



  ngOnInit() {
    this.indentForm = new FormGroup({
      ordered_for: new FormControl('', [Validators.required]),
     // ordered_by: new FormControl('', [Validators.required]),
      on_behalf: new FormControl(),
      ordered_forother:  new FormControl(),
      category: new FormControl('', [Validators.required]),
      products: new FormControl('', [Validators.required]),
      units: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      price: new FormControl(),

    });


    this.moreindentForm = new FormGroup({
      expected_date: new FormControl(),
      delivered_date: new FormControl(),
      place: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      total_order: new FormControl(),
      total_price: new FormControl('', [Validators.required]),
      // notes: new FormControl()
    });


    this.editindentForm =  this.formBuilder.group({
      indent_id: '',
      indent_status: '',
      price: '',
      updated_by: '',
      expected_date: '',
      delivered_date: '',
      place: '',
      pincode: '',
      district: '',
      state: '',
      items: null
    });


    this.modalType = this.navParams.get('modalType');
    if (this.modalType == 'addIndent') {
        this.IndentData = this.indentModal;

    } else if (this.modalType === 'editIndent' || this.modalType === 'viewIndent') {

      this.IndentDataModel = this.navParams.get('indentData');
      const token = localStorage.getItem('token');
      let httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": token,
        })
      };
      const request = {
          indent_id: this.IndentDataModel.indent_id
      };
      this.http
        .post('http://134.209.147.129:3001/view_indent', request, httpOptions).subscribe((res: any) => {
              //  if ( res ) {
                  this.IndentData = res.message;
                  this.editProducts =  this.IndentData.products;

                 // this.IndentData.indent_status = [this.IndentData.indent_status];
                  this.editProducts =  this.IndentData.products.map( obj => {
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


     // console.log('==:>?,', this.IndentData);
      this.editindentForm.setControl('indent_id', this.formBuilder.control(this.IndentData.indent_id));
      this.editindentForm.setControl('indent_status', this.formBuilder.control(this.IndentData.indent_status));
      this.editindentForm.setControl('price', this.formBuilder.control(this.IndentData.order_total));
      this.editindentForm.setControl('updated_by', this.formBuilder.control(this.IndentData.updated_by));
      this.editindentForm.setControl('expected_date', this.formBuilder.control(this.IndentData.expected_date));
      this.editindentForm.setControl('delivered_date', this.formBuilder.control(this.IndentData.delivered_date));
      this.editindentForm.setControl('place', this.formBuilder.control(this.IndentData.place));
      this.editindentForm.setControl('pincode', this.formBuilder.control(this.IndentData.pincode));
      this.editindentForm.setControl('items', this.formBuilder.array(this.arr));
      const m = this.editindentForm;
      console.log('form builder', m)//this.editOrderForm.get('items'));
         });
      }
  }


  onItemSelect( event, t ) {

    // console.log('selected category  ==>', event.category_id);
    if (t === 'category') {
      const cid = {
        category_id: [event.category_id]
      };
      this.orderService.filterProductCategory(cid).subscribe( res => {
         this.products = res.product_name;
         this.unitDropval = res.units;
      });
    } else if ( t === 'product') {
          this.products.forEach(element => {
              if (element.product_id == event.product_id) {
                this.indentModal.quantity = 1;
                this.indentModal.price = element.mrp;
                this.productprice = element.mrp;
              }
          });
    } else if ( t == 'quantity' ) {
        if (event) {
            // tslint:disable-next-line: radix
            console.log(event);
            this.indentModal.price  = event.target.value *  this.productprice;
        } else {
          this.indentModal.price = 0;
        }
    }

  }



  // addOrder() {
  //   if (this.orderForm.valid) {
  //     console.log("forms values", this.orderForm.value);
  //     this.toaster.success("success", "Order Added Successfully");
  //     this.orderForm.reset();
  //   }
  // }


  BuildFormDynamic(item): FormGroup {
    return this.formBuilder.group({
         category: item.category_name,
         products: item.product_name,
         unit: item.unit,
         quantity: item.quantity,
         mrp: item.mrp,
     });
   }

  addMoreIndent(vall) {
    this.formdata = vall;

    const t = {
      category: vall.category[0].category_name,
      products: vall.products[0].product_name,
      units: vall.units,
      quantity: vall.quantity,
      price: vall.price
    };

    const tt = {
      product_id: vall.products[0].product_id,
      quantity: vall.quantity
    };

    this.apiProdArr.push(tt);

    this.formdataarray.push(t);
    let tprc = 0;
    this.formdataarray.forEach( itm => {
        tprc = tprc + itm.price;
    });

    this.ShowAddMoreIndents = true;
    this.indentModal.total_price = tprc;
    if (this.indentModal.state) { } else {
        this.indentModal.state = 'Karnataka';
    }

    if (this.indentModal.place) { } else {
      this.indentModal.place = 'Abbani';
    }

    if (this.indentModal.pincode) { } else {
      this.indentModal.pincode = '560037';
    }

    if (this.indentModal.district) { } else {
      this.indentModal.district = 'Kolar';
    }
    // this.orderForm.reset();
    this.indentModal.quantity = '';
    this.indentModal.category = '';
    this.indentModal.products = '';
    this.indentModal.units = '';
    this.indentModal.price = '';
  }

  addtotalOrder(val) {
      // console.log('fdgjjd', val);
      let finalObj: any;
      if (this.toggleOrderedFor === 'agency') {
          finalObj = {
                order_for: this.toggleOrderedFor,
                products: this.apiProdArr,
                order_total: val.total_order,
                expected_date: val.expected_date,
                on_behalf_of:  this.formdata.ordered_for[0].agency_id,
                ordered_for_id: this.formdata.on_behalf[0].agency_id
          };
      } else {
          finalObj = {
            order_for: 'external user',
            products: this.apiProdArr,
            order_total: val.total_order,
            expected_date: val.expected_date,
            on_behalf_of:  this.formdata.ordered_for[0].agency_id,
            order_for_name: this.formdata.ordered_forother,
            place: val.place,
            pincode: val.pincode,
            district: val.district,
            state: val.state
      };
    }

    console.log('Final obj', finalObj);

    this.orderService.createIndent(finalObj).subscribe( res => {
        console.log('create order=>', res);
    });
  }

  editIndentOrder(val){
      console.log('edit indent data', val);
  }

  modalclose() {
    this.pop.dismiss();

  }

  updateIndent(val) {


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
      indent_id: val.indent_id,
      indent_status: val.indent_status,
      products: p,
      expected_date: val.expected_date,
      delivered_date: val.delivered_date
    };

    console.log('val  ==>', sendObjData);
    this.orderService.indentUpdate(sendObjData).subscribe( res => {
      if (res) {
        // console.log(res);
        if (res.statusCode == 200) {
          setTimeout(() => {
            this.modalclose();
          }, 1000);
        }
        alert(res.message);
      }
    });

  }
  

}