import { AuthenticationService } from '../service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../service/config.service';
import { LoginData } from '../model/login-data-model'



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  toggleFA: boolean = false;
  toggleOther: boolean = true;

  loginform: FormGroup;
  userData = { "mobile_no": "", "password": "", "requestor_type": "admin_app", "status": "active" };
  result: any;
  noDetails: boolean = false;
  // pass; mobile_no;
  submitted = false;
  message: boolean = false;
  constructor(
    private authService: AuthenticationService,
    public navCtrl: NavController,
    private router: Router,
    private config: ConfigService,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.loginform = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(1), Validators.minLength(2), Validators.maxLength(12)]),
      mobile_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10)]),
    });
  }
  setUserType(type) {
    if (type == 'Other') {
      this.userData.requestor_type = 'admin_app';
      this.toggleFA = false;
      this.toggleOther = true;
    }
    else if (type == 'Field Agent') {
      this.userData.requestor_type = 'FA_app';
      this.toggleFA = true;
      this.toggleOther = false;
    }
  }

  goTo(path): void {
    this.navCtrl.navigateRoot(path)
  }

  login(): void {
    // const val = this.loginform.value;
    //console.log('values', val)
    if (this.userData.mobile_no == "" && this.userData.password == '') {
      this.message = false;
      this.noDetails = true;
    }
    else if (this.userData.mobile_no == '' && this.userData.password !== '') {
      this.message = false;
      this.noDetails = true;
    }
    else if (this.userData.password == "" && this.userData.mobile_no !== '') {
      this.message = false;
      this.noDetails = true;

    }
    else {
      // console.log('values', val)
      this.noDetails = false;
      this.submitted = true;
      // let sendObjData = {
      //   "mobile_no": val.mobile_no,
      //   "password": val.password,
      //   "status": "active",
      //   "requestor_type": "admin_app",
      // }

      this.authService.login(this.userData)
        .subscribe(res => {
          this.result = res;
          if (res === undefined) {
            this.message = true;

          }
          else {
            this.loginform.reset();
            this.message = false;
            this.router.navigate(['/dashboard'])
          }
        },
          error => {
            console.log('err', error);
          });
    }

  }


}