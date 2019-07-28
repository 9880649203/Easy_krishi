import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ModalController } from '@ionic/angular';
import { AddAgencyPage } from '../add-agency/add-agency.page';
import { AddFarmerPage } from '../add-farmer/add-farmer.page';


@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.page.html',
  styleUrls: ['./action-table.page.scss'],
})
export class ActionTablePage implements ICellRendererAngularComp {

  mainParams: any

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  openModalUser(request, viewType) {
    return this.modalCtrl.create({
      component: AddAgencyPage,
      componentProps: { data: request.data, modalType: viewType, modalController: this.modalCtrl }
    })
      .then(popover => popover.present());
  }
  openModalFarmer(request, viewType) {
    return this.modalCtrl.create({
      component: AddFarmerPage,
      componentProps: { data: request.data, modalType: viewType, modalController: this.modalCtrl }
    })
      .then(popover => popover.present());
  }
  // openModalRole(request, viewType): Promise<void> {
  // console.log("edit", request.data)
  // let modalType: any;
  // if (viewType == 'edit') {
  //   modalType = 'editRole'
  //   return this.modalCtrl.create({
  //     component: RolePage,
  //     componentProps: { roleList: request.data, modalType: modalType, popoverController: this.modalCtrl }
  //   })
  //     .then(popover => popover.present());
  // }
  // else if (viewType == 'view') {
  //   modalType = 'viewRole'
  //   return this.modalCtrl.create({
  //     component: RoleInformationPage,
  //     componentProps: { roleList: request.data, modalType: modalType, modalController: this.modalCtrl }
  //   })
  //     .then(popover => popover.present());
  // }

  // }

  agInit(params: any): void {
    this.mainParams = params;
  }

  refresh(): boolean {
    return false;
  }
}
