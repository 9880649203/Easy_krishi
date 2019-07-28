import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleBaseAccesService {
  role: any;
constructor() {
  this.role = JSON.parse(localStorage.getItem('user')).role;

}
  private rolebaseaccess = {
    viewDashboardPage: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager', 'Viewer'],
    viewProductPage: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager', 'Viewer'],
    viewOrderPage: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager', 'Viewer'],
    viewIndentPage: ['Admin',  'Order Manager', 'Viewer'],
    viewUserAgency: ['Admin', 'Agency Manager', 'Order Manager', 'Viewer'],
    viewUserFieldAgent: ['Admin', 'Agency Manager', 'Order Manager', 'Viewer'],
    viewUserOther: ['Admin'],
    viewFormersDataPage: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager', 'Viewer'],
    viewAdminConsole: ['Admin'],

    createModifyIndent: ['Order Manager'],
    changeStatusIndent: ['Order Manager'],
    createModifyOrder: ['Agency Manager', 'Field Agent', 'Order Manager'],
    cancelOrder: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager'],
    acceptOrder: ['Admin'],
    completeOrders: ['Admin'],
    exportOrders: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager', 'Viewer'],
    exportIndents: ['Admin', 'Order Manager', 'Viewer'],

    addModifyAgency: ['Admin'],
    deactivateReactivateAgency: ['Admin', 'Agency Manager'],
    addModifySubAgency: ['Agency Manager'],
    deactivateReactivateSubAgency: ['Agency Manager'],
    addModifyFieldAgent: ['Agency Manager'],
    deactivateReactivateFieldAgent: ['Agency Manager'],
    addModifyEkOrderManager: ['Admin'],
    deactivateReactivateEkOrderManager: ['Admin'],
    addModifyViewer: ['Admin'],
    DeactivateReactivateViewer: ['Admin'],

    addModifyProduct: ['Admin'],
    deactivateReactivateProduct: ['Admin'],

    addModifyFormerDetails: ['Field Agent'],
    deactivateReactivateFormer: ['Field Agent'],

    AddDeactivateRole: ['Admin'],
    AddModifyProductCategory: ['Admin'],
  };

  access_checking(val) {
    let t = false;
    Object.keys(this.rolebaseaccess).forEach(key => {
      if (val === key) {
        this.rolebaseaccess[key].forEach(res => {
            if (res === this.role) {
              t = true;
            }
        });
       }
    });
    return t;
 }

}
