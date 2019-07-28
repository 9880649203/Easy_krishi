import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AgGridModule } from "ag-grid-angular/main";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { IonicModule } from '@ionic/angular';

import { FarmsdataPage } from './farmsdata.page';
import { HeaderModule } from '../../components/header.module';
import { FarmDataFilterComponent } from 'src/app/filter/farmData-filter/farmData-filter.component';

const routes: Routes = [
  {
    path: '',
    component: FarmsdataPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HeaderModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents([]),
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbDropdownModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
  ],
  declarations: [FarmsdataPage, FarmDataFilterComponent]
})
export class FarmsdataPageModule { }
