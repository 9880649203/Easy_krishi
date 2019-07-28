import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GridOptions } from "ag-grid";
import { ActionTablePage } from '../../modal/action-table/action-table.page';
import { UserModel } from '../../model/user-model'
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { enableRipple } from "@syncfusion/ej2-base";
import { DataManager, Query, ODataV4Adaptor } from "@syncfusion/ej2-data";
import { ModalController } from '@ionic/angular';
import { AddAgencyPage } from 'src/app/modal/add-agency/add-agency.page';
import { RestService } from 'src/app/service/rest.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
// import { UsersFilterPage } from 'src/app/filter/users-filter/users-filter.page';

export interface filterlist {
  displayName: any;
  value: any;
}

@Component({
  selector: 'user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
})

export class UserFilterComponent implements OnInit {
  @ViewChild('search') searchTextBox: ElementRef;

  openMenu: Boolean = false;
  loggedInUser: any;
  selectedDataToFilter: any = { district: [], place: [], agency_name: [] }
  allSelectedFilter: any = []
  selectDistrictFormControl = new FormControl();
  selectPlaceFormControl = new FormControl();
  selectAgencyFormControl = new FormControl();
  searchDistrictControl = new FormControl();
  searchPlaceControl = new FormControl();
  searchAgencyControl = new FormControl();
  selectedDistrictValues = [];
  selectedPlaceValues = [];
  selectedAgencyValues = [];
  filterDistrict = [];
  filterPlace = []
  filterAgency = []
  dropDownDistrict = []
  dropDownPlace = []
  dropDownAgency = []
  filteredOptions: Observable<any[]>;
  filteredDistrict: Observable<any[]>;
  filteredPlace: Observable<any[]>;
  filteredAgency: Observable<any[]>;
  agencyFilter: boolean = false;
  // public data = [
  //   // { class: 'data', text: 'Print', id: 'data1', category: 'Customize Quick Access Toolbar' },
  //   { class: 'data', text: 'Ramesh singh', id: 'data2', category: 'Field Agent' },
  //   { class: 'data', text: 'Sandeep kumar', id: 'data3', category: 'Field Agent' },
  //   { class: 'data', text: 'Shankar ehsaan', id: 'data4', category: 'Field Agent' }
  // ];

  public field: Object = { text: 'text', groupBy: 'category' };


  selectedData: any
  allHeaderManager: any = [];
  allHeaderAgent: any = [];
  allHeaderOther: any = [];
  toggle: boolean = false;
  toggleUserTypeAgency: boolean = true;
  toggleUserTypeAgent: boolean = false;
  toggleUserTypeOther: boolean = false;
  gridOptions: any;
  gridOptionsAgent: any;
  gridOptionsOther: any;
  agencyList: any = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  private userModel = new UserModel()

  public filterTags: any = [];
  public filterFlag: boolean = false;
  public clearButtonFlag: Boolean = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  filters: filterlist[] = [];
  foods: any = [];
  fields: any;
  //Agency Manager
  manager_list: any = [];
  //field agent
  agent_list: any = [];
  //others
  other_list: any = [];

  constructor(private modalCtrl: ModalController, private rest: RestService,
    private toastr: ToastrService, ) {
    this.rest.getUserDropDownList().subscribe((response) => {
      // let dataRemove = response.filter((item) => item.agencies === 'Agency Manager')
      console.log("from users", response)
      this.rest._userDropDownList$.next(response)
    })
    this.filteredPlace = this.searchPlaceControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterPlace(name))
      );
    this.filteredAgency = this.searchAgencyControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterAgency(name))
      );

    this.filteredDistrict = this.searchDistrictControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterDistrict(name))
      );
    this.rest._userDropDownList$.subscribe(data => {
      if (data.places || data.districts || data.agencies) {
        console.log("dropdown ", data)
        this.dropDownPlace = [];
        this.dropDownPlace = data.places;
        this.filteredPlace = this.searchPlaceControl.valueChanges
          .pipe(
            startWith<string>(''),
            map(name => this._filterPlace(name))
          );
        this.dropDownDistrict = [];
        this.dropDownDistrict = data.districts;
        this.filteredDistrict = this.searchDistrictControl.valueChanges
          .pipe(
            startWith<string>(''),
            map(name => this._filterDistrict(name))
          );
        this.dropDownAgency = [];
        this.dropDownAgency = data.agencies;
        this.filteredAgency = this.searchAgencyControl.valueChanges
          .pipe(
            startWith<string>(''),
            map(name => this._filterAgency(name))
          );
      }
    });

  }

  ngOnInit() {

  }
  applyFilter() {
    this.rest.getUser(this.selectedDataToFilter).then(data => {
      // this.selectedDataToFilter.district = [];
      // this.selectedDataToFilter.place = [];
      // this.selectedDataToFilter.agency_name = [];
    })
    this.togglePopupMenu()
  }
  // Used to filter data based on search input
  private _filterAgency(name: string): String[] {
    const filterValue = name.toLowerCase();
    this.selectAgencyFormControl.patchValue(this.selectedAgencyValues);
    let filteredList = this.dropDownAgency.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }
  private _filterDistrict(name: string): String[] {
    const filterValue = name.toLowerCase();
    this.selectDistrictFormControl.patchValue(this.selectedDistrictValues);
    let filteredList = this.dropDownDistrict.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }
  private _filterPlace(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    // this.setSelectedValuesPlace();
    this.selectPlaceFormControl.patchValue(this.selectedPlaceValues);
    let filteredList = this.dropDownPlace.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
    console.log("filtered list", filteredList)
  }

  /**
  * Remove from selected values based on uncheck
  */
  selectionChange(event, type) {
    if (event.isUserInput && event.source.selected == false) {
      if (type == 'agency') {
        let indexAgency = this.selectedAgencyValues.indexOf(event.source.value);
        this.selectedAgencyValues.splice(indexAgency, 1)
        let index = this.selectedDataToFilter.agency_name.indexOf(event.source.value)
        this.selectedDataToFilter.agency_name.splice(index, 1)
      }
      if (type == 'district') {
        let indexDistrict = this.selectedDistrictValues.indexOf(event.source.value);
        this.selectedDistrictValues.splice(indexDistrict, 1)
        let index = this.selectedDataToFilter.district.indexOf(event.source.value)
        this.selectedDataToFilter.district.splice(index, 1)
      }
      if (type == 'place') {
        let indexPlace = this.selectedPlaceValues.indexOf(event.source.value);
        this.selectedPlaceValues.splice(indexPlace, 1)
        let index = this.selectedDataToFilter.place.indexOf(event.source.value)
        this.selectedDataToFilter.place.splice(index, 1)
      }
      let indexFilter = this.filters.findIndex(x => x.displayName === event.source.value);
      this.filters.splice(indexFilter, 1);

    }
    if (event.isUserInput && event.source._selected) {
      if (type == 'district') {
        this.selectedDataToFilter.district = this.selectedDataToFilter.district.concat(event.source.value)
      }
      else if (type == 'place') {
        this.selectedDataToFilter.place = this.selectedDataToFilter.place.concat(event.source.value)
      }
      else if (type == 'agency') {
        this.selectedDataToFilter.agency_name = this.selectedDataToFilter.agency_name.concat(event.source.value)
      }
      let selected_data = { type: type, displayName: event.source.value, value: event }
      if (this.filters.indexOf(event.source.value) === -1) {
        this.filters.push(selected_data);
      }

      if (this.filters.length > 0) {
        this.clearButtonFlag = true;
      } else {
        this.clearButtonFlag = false;
      }
    }
    if (event.source._selected == false) {
      let selected_data = { id: event.source.id, displayName: event.source.value, value: event }
      // let index = this.filters.indexOf(event.source.value)
      // this.filters.splice(index, 1);
      // if (type == 'district') {
      //   let index = this.selectedDataToFilter.district.indexOf(event.source.value)
      //   this.selectedDataToFilter.district.splice(index, 1);
      // }
      // else if (type == 'place') {
      //   let index = this.selectedDataToFilter.place.indexOf(event.source.value)
      //   this.selectedDataToFilter.place.splice(index, 1);
      // }
      // else if (type == 'agency') {
      //   let index = this.selectedDataToFilter.agency_name.indexOf(event.source.value)
      //   this.selectedDataToFilter.agency_name.splice(index, 1);
      // }
    }
  }

  openedChangeDistrict(e) {
    this.setSelectedValuesDistrict();
    this.searchDistrictControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }
  openedChangePlace(e) {
    this.setSelectedValuesPlace();
    this.searchPlaceControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }
  openedChangeAgency(e) {
    this.setSelectedValuesAgency();
    this.searchAgencyControl.patchValue('');
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
    this.searchAgencyControl.patchValue('');
  }

  /**
   * Set selected values to retain the state
   */
  setSelectedValuesDistrict() {
    if (this.selectDistrictFormControl.value && this.selectDistrictFormControl.value.length > 0) {
      this.selectDistrictFormControl.value.forEach((e) => {
        if (this.selectedDistrictValues.indexOf(e) == -1) {
          this.selectedDistrictValues.push(e);
        }
      });
    }
  }
  setSelectedValuesPlace() {
    if (this.selectPlaceFormControl.value && this.selectPlaceFormControl.value.length > 0) {
      this.selectPlaceFormControl.value.forEach((e) => {
        if (this.selectedPlaceValues.indexOf(e) == -1) {
          this.selectedPlaceValues.push(e);
        }
      });
    }
  }
  setSelectedValuesAgency() {
    if (this.selectAgencyFormControl.value && this.selectAgencyFormControl.value.length > 0) {
      this.selectAgencyFormControl.value.forEach((e) => {
        if (this.selectedAgencyValues.indexOf(e) == -1) {
          this.selectedAgencyValues.push(e);
        }
      });
    }
  }
  setUserType(type) {
    if (type == 'agency') {
      this.toggleUserTypeAgent = false;
      this.toggleUserTypeOther = false;
      this.toggleUserTypeAgency = true;
      setTimeout(() => {
        this.gridOptions.api.setRowData(this.manager_list);
      }, 500);
    }
    else if (type == 'agent') {
      this.toggleUserTypeAgent = true;
      this.toggleUserTypeOther = false;
      this.toggleUserTypeAgency = false;
      setTimeout(() => {
        this.gridOptionsAgent.api.setRowData(this.agent_list);
      }, 500);
    }
    if (type == 'other') {
      this.toggleUserTypeAgent = false;
      this.toggleUserTypeOther = true;
      this.toggleUserTypeAgency = false;
      setTimeout(() => {
        this.gridOptionsOther.api.setRowData(this.other_list);
      }, 500);
    }
    else return;
  }
  hideShowColumnsAgency(data) {
    const columns = this.gridOptions.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.gridOptions.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptions.api.sizeColumnsToFit();
  }
  hideShowColumnsFieldAgent(data) {
    const columns = this.gridOptionsAgent.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.gridOptionsAgent.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptionsAgent.api.sizeColumnsToFit();
  }
  hideShowColumnsOther(data) {
    const columns = this.gridOptions.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.gridOptions.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptions.api.sizeColumnsToFit();
  }
  addAgency() {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (this.loggedInUser.user_level <= 5) {
      return this.modalCtrl.create({
        component: AddAgencyPage,
        componentProps: { modalType: 'addManager', modalController: this.modalCtrl }
      })
        .then(popover => popover.present());
    }
    else {
      this.toastr.success('User can not be created above ' + this.loggedInUser.user_level + ' level...');
    }
  }
  OnGridReadyManager(params) {
    // this.gridOptions = params.api;
    // this.gridOptions.setRowData([]);
    // this.gridOptions.updateRowData({ add: this.manager_list })
  }
  OnGridReadyAgent(params) {
    // this.gridOptionsAgent = params.api;
    // this.gridOptionsAgent.setRowData([]);
    // this.gridOptionsAgent.updateRowData({ add: this.agent_list })
  }
  OnGridReadyOther(params) {
    // this.gridOptionsOther = params.api;
    // this.gridOptionsOther.setRowData([]);
    // this.gridOptionsOther.updateRowData({ add: this.other_list })
  }
  onFiltering(e) {
    // cpublic onFiltering: EmitType =  (e: FilteringEventArgs) => {
    let query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.dropDownAgency, query);
  }
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
    if (filter.type == 'agency') {
      let indexAgency = this.selectedAgencyValues.indexOf(filter.displayName);
      this.selectedAgencyValues.splice(indexAgency, 1)
      let index = this.selectedDataToFilter.agency_name.indexOf(filter.displayName)
      this.selectedDataToFilter.agency_name.splice(index, 1)
    }
    if (filter.type == 'district') {
      let indexDistrict = this.selectedDistrictValues.indexOf(filter.displayName);
      this.selectedDistrictValues.splice(indexDistrict, 1)
      let index = this.selectedDataToFilter.district.indexOf(filter.displayName)
      this.selectedDataToFilter.district.splice(index, 1)
    }
    if (filter.type == 'place') {
      let indexPlace = this.selectedPlaceValues.indexOf(filter.displayName);
      this.selectedPlaceValues.splice(indexPlace, 1)
      let index = this.selectedDataToFilter.place.indexOf(filter.displayName)
      this.selectedDataToFilter.place.splice(index, 1)
    }
    let indexFilter = this.filters.findIndex(x => x.displayName === filter.displayName);
    this.filters.splice(indexFilter, 1);
    if (this.filters.length == 0) {
      this.clearButtonFlag = false;
    } else {
      this.clearButtonFlag = true;
    }
  }
  filter(event) {
    if (this.filters.indexOf(event) === -1) {

    }
    if (this.filters.length > 0) {
      this.clearButtonFlag = true;
    } else {
      this.clearButtonFlag = false;
    }

  }
  clearFilter() {
    this.selectedDataToFilter.district = [];
    this.selectedDataToFilter.place = [];
    this.selectedDataToFilter.agency_name = [];
    this.selectDistrictFormControl.patchValue("")
    this.selectPlaceFormControl.patchValue("")
    this.selectAgencyFormControl.patchValue("")
    this.selectedAgencyValues = []
    this.selectedDistrictValues = []
    this.selectedPlaceValues = []
    this.filters = [];
    if (this.filters.length == 0) {
      this.clearButtonFlag = false;
    } else {
      this.clearButtonFlag = true;
    }
    this.rest.getUser("").then(data => {
    })
    this.togglePopupMenu()
  }
  // toggleFilter() {
  //   return this.modalCtrl.create({
  //     component: UsersFilterPage,
  //     componentProps: { type: 'users', modalController: this.modalCtrl }
  //   })
  //     .then(popover => popover.present());
  // }
  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }
}

