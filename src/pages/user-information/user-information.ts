/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of User Information page
 * File path - '../../../../src/pages/user-information/user-information'
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController , ModalController, ToastController, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { RunningmanConfig } from '../../assets/config/runningman';

@IonicPage()
@Component({
  selector: 'page-user-information',
  templateUrl: 'user-information.html',
})
export class UserInformationPage {

        firstname : any;
        lastname : any;
        email : any;
        mobile : any;
        fulladdress : any;
        city : any;
        state: any;
        zipcode : any ;
        password:any;
        confirmpassword: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController, 
    private http: HttpClient,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private menu: MenuController) {
    this.menu.enable(true); // Enable sidemenu
  }

  /**
   * Do any initialization
   */
  ngOnInit() {
    this.firstname = ''; 
    this.lastname = '';
    this.email = ''; 
    this.mobile = '';
    this.fulladdress = '';
    this.city = '';
    this.confirmpassword ='';
  }


doSubmit(){
  

var isvalid = true;
  if (this.firstname == '' || this.lastname == '' || this.email == '' || this.mobile == '' || this.fulladdress == '' || this.city == '' || this.confirmpassword =='' ){
      this.showToast("Missing information, Please fill in required fields!");
      isvalid = false;
  }else{
        if (this.ValidateEmail(this.email) == false){
             this.showToast("Invalid Email!");
             isvalid = false;
    }else if (this.password != this.confirmpassword) {
      this.showToast("Password not Match");
      isvalid = false;
    }
  }

if (isvalid){
    let loader = this.loading.create({
    content: 'Signing up..',
    spinner: 'crescent'
  });
  loader.present();
     var param = {address: this.fulladdress,
                  city: this.city,
                  contact: this.mobile,
                  email: this.email,
                  fname: this.firstname,
                  lname: this.lastname, 
                  module: 'user',
                  password: this.password,
                  postalcode: '',
                  role_type: 'normal',
                  state: this.state,
                  user_type: 'user'};

       let url =  RunningmanConfig.hosturl + 'signup';
        console.log ('SIGNUP',url);
          this.http.post(url, param).subscribe((data: any) => {
            console.log(data);
            if (data.error == 'That email is already in use'){

              let alert = this.alertCtrl.create({
                subTitle: 'That email is already in use',
                buttons: [  {
                    text: 'Okay',
                    handler: () => {
                    }
                  }]
              });
             alert.present();

            }else{
            let alert = this.alertCtrl.create({
                subTitle: 'Successfully Registered!',
                buttons: [  {
                    text: 'Okay',
                    handler: () => {
                         this.navCtrl.pop();
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
    
}


  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  checkPassword(){
    if (this.password != this.confirmpassword){
      this.showToast ("Password does not match!");
    }
  }

 ValidateEmail(email)
{
   var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
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

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
