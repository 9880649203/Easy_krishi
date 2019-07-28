import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPage } from './login/login.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { OrderPage } from './pages/order/order.page';
import { ReportsPage } from './pages/reports/reports.page';
import { Product } from './model/product.model';
import { FarmsdataPage } from './pages/farmsdata/farmsdata.page';
import { UsersPage } from './pages/users/users.page';
import { AdminconsolePage } from './pages/adminconsole/adminconsole.page';
import { ProductsPage } from './pages/products/products.page';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: DashboardPage },
  { path: 'order', component: OrderPage },
  { path: 'reports', component: ReportsPage },
  { path: 'products', component: ProductsPage },
  { path: 'farmsdata', component: FarmsdataPage },
  { path: 'user', component: UsersPage },
  { path: 'adminconsole', component: AdminconsolePage },
  { path: 'product-action', loadChildren: './modal/product-action/product-action.module#ProductActionPageModule' },
  // { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  declarations: [],

  exports: [RouterModule],
  // providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})

export class AppRoutingModule { }
