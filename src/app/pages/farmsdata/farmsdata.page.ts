
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GridOptions } from "ag-grid";
import { RestService } from 'src/app/service/rest.service';
import { ActionTablePage } from 'src/app/modal/action-table/action-table.page';
import { ModalController } from '@ionic/angular';
import { AddFarmerPage } from 'src/app/modal/add-farmer/add-farmer.page';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from '../../model/user-model'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


export interface filterlist {
  displayName: any;
  value: any;
}


@Component({
  selector: 'app-farmsdata',
  templateUrl: './farmsdata.page.html',
  styleUrls: ['./farmsdata.page.scss'],
})
export class FarmsdataPage {

  @ViewChild('search') searchTextBox: ElementRef;

  openMenu: Boolean = false;
  loggedInUser: any;
  selectedDataToFilter: any = { district: [], place: [], agency_name: [], field_agent: [] }
  allSelectedFilter: any = []
  selectDistrictFormControl = new FormControl();
  selectPlaceFormControl = new FormControl();
  selectAgencyFormControl = new FormControl();
  selectAgentFormControl = new FormControl();
  searchDistrictControl = new FormControl();
  searchPlaceControl = new FormControl();
  searchAgencyControl = new FormControl();
  searchAgentControl = new FormControl();
  selectedDistrictValues = [];
  selectedPlaceValues = [];
  selectedAgencyValues = [];
  selectedAgentValues = [];
  filterDistrict = [];
  filterPlace = []
  filterAgency = []
  filterAgent = []
  dropDownDistrict = []
  dropDownPlace = []
  dropDownAgency = []
  dropDownAgent = []
  filteredAgent: Observable<any[]>;
  filteredDistrict: Observable<any[]>;
  filteredPlace: Observable<any[]>;
  filteredAgency: Observable<any[]>;
  agencyFilter: boolean = false;

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

  manager_list: any = [];
  //field agent
  agent_list: any = [];
  //others
  other_list: any = [];


  allHeaderFarmer: any;
  farmer_list: any = []

  constructor(private rest: RestService, private modalCtrl: ModalController, private toastr: ToastrService) {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    console.log("logged in user", this.loggedInUser.role)
    this.openMenu = false;
    this.rest.getFarmer(this.selectedDataToFilter).then(response => {
    })
    this.rest.getFarmerDropdown().subscribe((response) => {
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
    this.filteredAgent = this.searchAgentControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterDistrict(name))
      );

    // Grid Option Column Definitions for Agency Table
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = [
      {
        headerName: "Action",
        field: "actions",
        cellRendererFramework: ActionTablePage,
        cellRendererParams: { viewFarmer: true, editFarmer: true },
        suppressFilter: true,
        suppressSorting: true,
        width: 70,
        suppressSizeToFit: true
      },
      {
        headerName: "Farmer Id",
        field: "farmer_id",
        tooltipField: "farmer_id",
        width: 100,
        suppressSizeToFit: true,
        // pinned: 'left'
      },

      {
        headerName: "First Name",
        field: "first_name",
        tooltipField: "first_name",
        // width: 250,
        suppressSizeToFit: true
      },
      {
        headerName: "Last Name",
        field: "last_name",
        tooltipField: "last_name",
        // width: 250,
        suppressSizeToFit: true,
      },
      {
        headerName: "Mobile Number",
        field: "mobile_no",
        tooltipField: "mobile_no",
        // width: 100
        suppressSizeToFit: true,
      },

      {
        headerName: "Adhar Number",
        field: "aadhar_no",
        tooltipField: "aadhar_no",
        // width: 80,
        suppressSizeToFit: true,
      },
      {
        headerName: "Gender",
        field: "gender",
        tooltipField: "gender",
        // width: 80,
        suppressSizeToFit: true,
      },
      {
        headerName: "Date of Birth",
        field: "dob",
        tooltipField: "dob",
        // width: 80,
        suppressSizeToFit: true,
      },
      {
        headerName: "Created By",
        field: "created_by",
        tooltipField: "created_by",
        // width: 200,
        suppressSizeToFit: true
      },
      {
        headerName: "Created Time",
        field: "created_time",
        tooltipField: "created_time",
        // width: 200,
        suppressSizeToFit: true,
        // valueFormatter(params) {
        //   return this.config.DateMonthYear(params.value)
        // }
      },
      {
        headerName: "Updated By",
        field: "updated_by",
        tooltipField: "updated_by",
        // width: 200,
        suppressSizeToFit: true
      },
      {
        headerName: "updated Time",
        field: "updated_time",
        tooltipField: "updated_time",
        // width: 200,
        suppressSizeToFit: true,
        // valueFormatter(params) {
        //   return this.config.DateMonthYear(params.value)
        // }
      },
      {
        headerName: "Place",
        field: "place",
        tooltipField: "place",
        // width: 200,
        suppressSizeToFit: true
      },
      {
        headerName: "Pin code",
        field: "pincode",
        tooltipField: "pincode",
        // width: 80,
        suppressSizeToFit: true
      },
      {
        headerName: "District",
        field: "district",
        tooltipField: "district",
        // width: 200,
        suppressSizeToFit: true
      },
      {
        headerName: "State",
        field: "state",
        tooltipField: "state",
        // width: 80,
        suppressSizeToFit: true
      },
      {
        headerName: "Country",
        field: "country",
        tooltipField: "country",
        // width: 200,
        suppressSizeToFit: true
      },

      {
        headerName: "Status",
        field: "status",
        tooltipField: "status",
        // width: 80,
        suppressSizeToFit: true,
      },

    ]
    //Other Table setting
    this.gridOptions.localeText = { noRowsToShow: 'No farmer data to show' };
    this.gridOptions.rowData = [];
    this.allHeaderFarmer = this.gridOptions.columnDefs.filter((item) => item.headerName != 'Farmer Id');
  }

  ngOnInit() {
    this.openMenu = false;
    this.rest._farmerList$.subscribe(response => {
      this.farmer_list = []
      this.farmer_list = response
      console.log("famer data", this.farmer_list)
      setTimeout(() => {
        this.gridOptions.api.setRowData(this.farmer_list);
      }, 500);
    })
    this.rest._farmerDropDownList$.subscribe(data => {
      if (data.places || data.districts || data.agencies || data.field_agent) {
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
        this.dropDownAgent = [];
        this.dropDownAgent = data.field_agent;
        this.filteredAgent = this.searchAgentControl.valueChanges
          .pipe(
            startWith<string>(''),
            map(name => this._filterAgent(name))
          );
      }
    });

  }
  hideShowColumnsFarmer(data) {
    const columns = this.gridOptions.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.gridOptions.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptions.api.sizeColumnsToFit();
  }
  addFarmer() {

    return this.modalCtrl.create({
      component: AddFarmerPage,
      componentProps: { modalType: 'addFarmer', modalController: this.modalCtrl }
    })
      .then(popover => popover.present());
  }
  applyFilter() {
    this.rest.getFarmer(this.selectedDataToFilter).then(data => {
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
  }
  private _filterAgent(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    // this.setSelectedValuesPlace();
    this.selectAgentFormControl.patchValue(this.selectedAgentValues);
    let filteredList = this.dropDownAgent.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  /**
  * Remove from selected values based on uncheck
  */
  selectionChange(event, type) {
    if (event.isUserInput && event.source.selected == false) {
      if (type == 'Agency') {
        let indexAgency = this.selectedAgencyValues.indexOf(event.source.value);
        this.selectedAgencyValues.splice(indexAgency, 1)
        let index = this.selectedDataToFilter.agency_name.indexOf(event.source.value)
        this.selectedDataToFilter.agency_name.splice(index, 1)
      }
      if (type == 'District') {
        let indexDistrict = this.selectedDistrictValues.indexOf(event.source.value);
        this.selectedDistrictValues.splice(indexDistrict, 1)
        let index = this.selectedDataToFilter.district.indexOf(event.source.value)
        this.selectedDataToFilter.district.splice(index, 1)
      }
      if (type == 'Place') {
        let indexPlace = this.selectedPlaceValues.indexOf(event.source.value);
        this.selectedPlaceValues.splice(indexPlace, 1)
        let index = this.selectedDataToFilter.place.indexOf(event.source.value)
        this.selectedDataToFilter.place.splice(index, 1)
      }
      if (type == 'Agent') {
        let indexPlace = this.selectedPlaceValues.indexOf(event.source.value);
        this.selectedPlaceValues.splice(indexPlace, 1)
        let index = this.selectedDataToFilter.place.indexOf(event.source.value)
        this.selectedDataToFilter.place.splice(index, 1)
      }
      let indexFilter = this.filters.findIndex(x => x.displayName === event.source.value);
      this.filters.splice(indexFilter, 1);

    }
    if (event.isUserInput && event.source._selected) {
      if (type == 'District') {
        this.selectedDataToFilter.district = this.selectedDataToFilter.district.concat(event.source.value)
      }
      else if (type == 'Place') {
        this.selectedDataToFilter.place = this.selectedDataToFilter.place.concat(event.source.value)
      }
      else if (type == 'Agency') {
        this.selectedDataToFilter.agency_name = this.selectedDataToFilter.agency_name.concat(event.source.value)
      }
      else if (type == 'Agent') {
        this.selectedDataToFilter.field_agent = this.selectedDataToFilter.field_agent.concat(event.source.value)
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

  openedChangeAgent(e) {
    this.setSelectedValuesAgent();
    this.searchAgencyControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }


  // setAgencyFilter() {
  //   this.agencyFilter = !this.agencyFilter;
  // }

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
  setSelectedValuesAgent() {
    if (this.selectAgentFormControl.value && this.selectAgentFormControl.value.length > 0) {
      this.selectAgentFormControl.value.forEach((e) => {
        if (this.selectedAgentValues.indexOf(e) == -1) {
          this.selectedAgentValues.push(e);
        }
      });
    }
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
    if (filter.type == 'Agency') {
      let indexAgency = this.selectedAgencyValues.indexOf(filter.displayName);
      this.selectedAgencyValues.splice(indexAgency, 1)
      let index = this.selectedDataToFilter.agency_name.indexOf(filter.displayName)
      this.selectedDataToFilter.agency_name.splice(index, 1)
    }
    if (filter.type == 'District') {
      let indexDistrict = this.selectedDistrictValues.indexOf(filter.displayName);
      this.selectedDistrictValues.splice(indexDistrict, 1)
      let index = this.selectedDataToFilter.district.indexOf(filter.displayName)
      this.selectedDataToFilter.district.splice(index, 1)
    }
    if (filter.type == 'Place') {
      let indexPlace = this.selectedPlaceValues.indexOf(filter.displayName);
      this.selectedPlaceValues.splice(indexPlace, 1)
      let index = this.selectedDataToFilter.place.indexOf(filter.displayName)
      this.selectedDataToFilter.place.splice(index, 1)
    }
    if (filter.type == 'Agent') {
      let indexAgent = this.selectedAgentValues.indexOf(filter.displayName);
      this.selectedAgentValues.splice(indexAgent, 1)
      let index = this.selectedDataToFilter.agent.indexOf(filter.displayName)
      this.selectedDataToFilter.agent.splice(index, 1)
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
    this.selectedDataToFilter.field_agent = [];
    this.selectDistrictFormControl.patchValue("")
    this.selectPlaceFormControl.patchValue("")
    this.selectAgencyFormControl.patchValue("")
    this.selectAgentFormControl.patchValue("")
    this.selectedAgencyValues = []
    this.selectedDistrictValues = []
    this.selectedPlaceValues = []
    this.selectedAgentValues = []
    this.filters = [];
    if (this.filters.length == 0) {
      this.clearButtonFlag = false;
    } else {
      this.clearButtonFlag = true;
    }
    this.rest.getFarmer("").then(data => {
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



