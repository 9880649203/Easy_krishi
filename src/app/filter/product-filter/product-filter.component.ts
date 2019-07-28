import { Component, OnInit,ElementRef, Output,EventEmitter, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ProductService } from '../../service/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';



export interface filterlist {
  displayName: any;
  value: any;
}   


@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
})
export class ProductFilterComponent implements OnInit {

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
  
  selectedDataToFilter: any = {category_name:[], product_name:[], brand_name:[],company_name:[],category_id:[],product_id:[]}
  filterList: filterlist[] = [];
  productHeader: any = [];
  toggle: boolean = false;
  removable = true;
  selectable = true;
  cat_id:any = [];
  productId:any = [];
   public filterTags: any = [];
  public filterFlag: boolean = false;
  public clearButtonFlag: Boolean = false;
  CategoryCount:any;
  ProductCount:any;
  visible:boolean = false;
  allrowdata: any = [];
  rowdata: any = [];
  filterLength:number;
  agencyFilter: boolean = false;

  constructor(public navCtrl: NavController,private userService: ProductService,private modalCtrl: ModalController) { 

    this.userService.filterData().subscribe((ele) => {
      console.log('res', ele);
          var result = ele.product_name.reduce((unique, o) => {
       if(!unique.some(obj => obj.product_name === o.product_name)) {
         unique.push(o);
       }
       return unique;
   },[]);
      console.log('filter array',result); 
  
      var cat = ele.category_name.reduce((unique,o) =>{
       if(!unique.some(obj => obj.category_name === o.category_name)) {
         unique.push(o);
       }
       return unique;
     },[]);
      console.log('filter array',cat);
  
     this.userService._initializeCategory$.next(cat);
     this.userService._product$.next(result);
     this.userService._barnd$.next(ele.brand_name);
     this.userService._company$.next(ele.company_name);
     
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
  
  
  }

  ngOnInit() {
    
   this.userService._initializeCategory.subscribe(data => {
    console.log('category***',data)
    this.CategoryName = [];
    this.CategoryName = this.CategoryName.concat(data);
    this.filteredCategory = this.searchCategoryControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterCategory(name))
      );
  });
  this.userService._product.subscribe(data => {
    console.log('product***',data)
    this.productName = [];
    this.productName = data;
    this.filteredProduct = this.searchProductControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterProduct(name))
      );
  });
  this.userService._barnd.subscribe(data => {
    console.log('barand***',data)
    this.brandName = [];
    this.brandName = data
    this.filteredBrand = this.searchBrandControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterBrand(name))
      );
  });
 
  this.userService._company.subscribe(data => {
    console.log('company***',data)
    this.companyName = [];
    this.companyName = data
    this.filteredCompany = this.searchCompanyControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterCompany(name))
      );
  });
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
 
 
 
 
 submit(e){
 console.log('checked',e)
 //this.selectedDataToFilter.category_id = [];
 if(e.checked){
 this.selectedDataToFilter.category_id.push(e.category_id);
 
 console.log('checked',this.selectedDataToFilter.category_id)
 }
 
 else{
 for(let i=0;i<this.selectedDataToFilter.category_id.length;i++){
    if(this.selectedDataToFilter.category_id[i] == e.category_id){
      this.selectedDataToFilter.category_id.splice(i,1);
    break;
    }
   }
 }
 this.CategoryCount = this.selectedDataToFilter.category_id.length;
 console.log('count', this.CategoryCount)
 console.log("arrchecksdsd", this.selectedDataToFilter.category_id)
 }
 
 
 productSubmit(e){
 // this.selectedDataToFilter.product_id = [];
 if(e.checked){
 
 this.selectedDataToFilter.product_id.push(e.product_id)
 } 
 else{
 for(let i =0;i<=this.selectedDataToFilter.product_id.length;i++){
  if(this.selectedDataToFilter.product_id[i] == e.product_id){
    this.selectedDataToFilter.product_id.splice(i,1);
    break;
  }
 }
 } 
 this.ProductCount = this.selectedDataToFilter.product_id.length;
 console.log('product id',this.selectedDataToFilter.product_id.map(String))
 
 }
 
 applyFilter() {
 Object.keys(this.selectedDataToFilter).forEach(key =>{
  this.selectedDataToFilter[key].length === 0 ? delete this.selectedDataToFilter[key] : key
 
 }  );
 //  console.log('filter**',this.selectedDataToFilter)
 

  this.passdata.emit(this.selectedDataToFilter);
  this.togglePopupMenu() ;


//  this.userService.productList(this.selectedDataToFilter).subscribe(data => {
//   console.log('data8888',data);
//   if(data !== undefined){
//     if(data.statusCode == '200'){
//       console.log('apply filter==>',data)
//       this.rowdata = data.message;
//       this.passdata.emit(data.message);
//      }
//     else {
//       this.rowdata = [];
//       this.allrowdata = [];
//     }
//   }
//   else {
//     this.rowdata = [];
//     this.allrowdata = [];
//   }
 
//  })
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
  console.log('category',e);
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
  console.log('ddddd',this.selectCategoryFormControl)
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
  console.log('filteretewrt',filter)
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
    this.rowdata= this.allrowdata;
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
  this.selectedDataToFilter.category_name =[]
  this.selectedDataToFilter.company_name =[]
  this.selectedDataToFilter.brand_name =[]
  this.selectedDataToFilter.category_id =[]
  this.selectedDataToFilter.product_id =[]
 
  if (this.filterList.length == 0) {
    this.clearButtonFlag = false;
  } else {
    this.clearButtonFlag = true;
  }
  this.userService.productList("").subscribe(data => {
    console.log('eee',data);
 
   this.userService._clear$.next(data.message);
  });
  this.togglePopupMenu() ;

 // this.pageCount(this.countpage);
 }
 
 
 closeModal() {
  this.modalCtrl.dismiss();
}


}
