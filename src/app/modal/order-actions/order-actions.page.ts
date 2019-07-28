import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { AddOrderPage } from '../add-order/add-order.page';

@Component({
selector: 'app-order-actions',
templateUrl: './order-actions.page.html',
styleUrls: ['./order-actions.page.scss'],
})
export class OrderActionsPage implements OnInit {

mainParams: any;
constructor(private modalCtrl: ModalController) { }

agInit(params: any): void {
this.mainParams = params;
console.log('mainParams', this.mainParams);

}
refresh(): boolean {
return false;
}
openModal(data, type) {

}
openEditrole(data, type) {
// console.log('edit ==>>', data.data);
if (type === 'edit') {
return this.modalCtrl.create({
component: AddOrderPage,
componentProps: { orderData: data.data, modalType: 'editOrder', modelController: this.modalCtrl }
})
.then(popover => popover.present());
} else if (type === 'view') {
return this.modalCtrl.create({
component: AddOrderPage,
componentProps: { orderData: data.data, modalType: 'viewOrder', modelController: this.modalCtrl }
})
.then(popover => popover.present());
}
}

ngOnInit() {
}

}