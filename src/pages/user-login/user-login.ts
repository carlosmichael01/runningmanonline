/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of User Information page
 * File path - '../../../../src/pages/user-information/user-information'
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController , ModalController,ViewController, App } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { RunningmanConfig } from '../../assets/config/runningman';

@IonicPage()
@Component({
  selector: 'page-user-login',
  templateUrl: 'user-login.html',
})
export class UserLoginPage {

  username: any;
  password: any;
  nav:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController, 
    private http: HttpClient,
    public modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private appCtrl: App,
    private menu: MenuController) {
    this.menu.enable(true); // Enable sidemenu
  }

  /**
   * Do any initialization
   */
 ionViewDidLoad() {
    
  }

  /***
   * --------------------------------------------------------------
   * Form Validation
   * --------------------------------------------------------------
   * @method   formValidation
   */


  /**
   * --------------------------------------------------------------
   * Go To Menu Category Page
   * --------------------------------------------------------------
   */
  gotoMenuCategoryPage() {
    this.navCtrl.setRoot('FoodCategoriesPage');
  }

doLogin(){

  let loader = this.loading.create({
    content: 'Authenticating..',
    spinner: 'crescent'
  });
  loader.present();
  var _page = 'UserProfilePage';
    if (this.navParams.get('page')) {
      _page = this.navParams.get('page');
    }

        let url =  RunningmanConfig.hosturl + 'api/mobile/login';
        this.http.post(url, {email: this.username , password: this.password}).subscribe((data: any) => {
         var userid = data._id;

         if (userid != null){
            localStorage.setItem("userid", data._id);
            localStorage.setItem("password", data.password);
            /* this.viewCtrl.dismiss(); */
            /*this.navCtrl.popToRoot(); */

              let url =  RunningmanConfig.hosturl + 'API/mobile/LoadMobileCart';
              this.http.post(url, {userid: data._id}).subscribe((data: any) => {
               console.log (data.orders.length);
               localStorage.setItem("cartitem", data.orders.length);
           }); 

            this.nav = this.appCtrl.getRootNavById('n4');
            this.nav.setRoot(_page); 
            this.viewCtrl.dismiss();
            
         }else{
            let alert = this.alertCtrl.create({
                subTitle: 'Invalid Email or Password!',
                buttons: [  {
                    text: 'Okay',
                    handler: () => {
                    }
                  }]
              });
              alert.present();
         }
          
            
            loader.dismiss();
          }, error => {
            console.error('Error: ' + error);

                let alert = this.alertCtrl.create({
                subTitle: 'Error: ' + error,
                buttons: [  {
                    text: 'Okay',
                    handler: () => {
                        
                    }
                  }]
            });
              alert.present();


            loader.dismiss();

          }); 

    
}

doSignup(){
    const modal = this.modalCtrl.create('UserInformationPage');
    modal.present();
}

  dismiss() {
    /*console.log (this.navCtrl.canGoBack());
    if ( this.navCtrl.canGoBack()){*/
    this.viewCtrl.dismiss();
   /* }else{
       this.navCtrl.setRoot('FoodCategoriesPage');
    }*/
  }


forgotPassword() {
  let alert = this.alertCtrl.create({
    title: 'Forgot Password',
    subTitle: 'Reset password link will be sent to your email',
    inputs: [
      {
        name: 'email',
        placeholder: 'Email Address'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Submit',
        handler: data => {
          // if (User.isValid(data.username, data.password)) {
          //   // logged in!
          // } else {
          //   // invalid login
          //   return false;
          // }

           let loader = this.loading.create({
              content: 'Sending Email..',
              spinner: 'crescent'
            });
          loader.present().then(() => {
              let url = RunningmanConfig.hosturl + 'forgotpassword';
              this.http.post(url, {email: data.email}).subscribe((result: any) => {
                console.log(result);
                loader.dismiss();
              }, error => {
                console.error('Error: ' + error);
                  loader.dismiss();
              });
              
            });


        }
      }
    ]
  });
  alert.present();
}

}
