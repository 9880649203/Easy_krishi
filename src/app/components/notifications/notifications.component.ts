import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, MenuController, ModalController } from '@ionic/angular';
import { MyAccountPage } from 'src/app/modal/my-account/my-account.page';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  modalType: any;
  loggedInUser: any;
  modalControler: any;

  constructor(private navParams: NavParams, public navCtrl: NavController, private menuCtrl: MenuController, private modalCtrl: ModalController) {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    this.modalType = this.navParams.get('modalType');
    this.modalControler = this.navParams.get('popoverControler');
    console.log("modal type", this.modalType)
  }

  ngOnInit() {
  }
  logout() {
    this.navCtrl.navigateRoot('');
    this.modalControler.dismiss();
    this.menuCtrl.enable(false);
  }

  async myAccount() {
    this.modalControler.dismiss();
    return this.modalCtrl.create({
      component: MyAccountPage,
      componentProps: { modalType: 'myAccount', modalController: this.modalCtrl }
    })
      .then(popover => popover.present());

  }
}
