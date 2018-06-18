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
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

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
        islogin: boolean = false;

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
    var _userid =  localStorage.getItem("userid");
    console.log('UserID Check', _userid);
    if (_userid === 'undefined' || _userid === null || _userid === undefined){
 
   const modal = this.modalCtrl.create('UserLoginPage', {page : 'UserProfilePage'});
    modal.present();

    }else{
      this.islogin = true;

    let loader = this.loading.create({
    content: 'Loading Profile..',
    spinner: 'crescent'
    });
    loader.present();
       let url = RunningmanConfig.hosturl + 'loadprofile';
          this.http.post(url, {userid : _userid}).subscribe((data: any) => {
            console.log(data);
            this.firstname = data[0].fname; 
            this.lastname = data[0].lname;
            this.email = data[0].email; 
            this.mobile = data[0].contact;
            this.fulladdress = data[0].address;
            this.city = data[0].city;
            this.state = data[0].state;
            this.confirmpassword ='';
            this.password ='';

            loader.dismiss();
          }, error => {
            console.error('Error: ' + error);
            loader.dismiss();
          }); 


    }


  }


doSubmit(){
var isvalid = true;
  if (this.firstname == '' || this.lastname == '' || this.email == '' || this.mobile == '' || this.fulladdress == '' || this.city == '' ){
      this.showToast("Missing information, Please fill in required fields!");
      isvalid = false;
  }

  if (this.password == '') {
    var _password  = localStorage.getItem("password");
    this.password = _password;
  }else{
      if (this.password != this.confirmpassword) {
            this.showToast("New Password not Match");
            isvalid = false;
      }
  }
  
  /*else{
        if (this.ValidateEmail(this.email) == false){
             this.showToast("Invalid Email!");
             isvalid = false;
    }else if (this.password != this.confirmpassword) {
      this.showToast("Password not Match");
      isvalid = false;
    }
  }*/

if (isvalid){
  var _userid =  localStorage.getItem("userid");
  let loader = this.loading.create({
    content: 'Updating Profile..',
    spinner: 'crescent'
  });
  loader.present();
     var param = {address : this.fulladdress,
                city: this.city,
                contact: this.mobile,
                delivery_address:  this.fulladdress,
                delivery_city: this.city,
                delivery_postcode: this.zipcode,
                fname: this.firstname,
                lname:this.lastname,  
                state:this.state,
                userid:_userid, 
                password: this.password};

console.log (param);

       let url = RunningmanConfig.hosturl + 'updateprofile';
          this.http.post(url, param).subscribe((data: any) => {
            console.log(data);
          let alert = this.alertCtrl.create({
                subTitle: 'Updated Successfully!',
                buttons: [  {
                    text: 'Okay',
                    handler: () => {
                      this.password ='';
                    }
                  }]
              });
             alert.present();
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

  dologOut(){

  localStorage.clear();
  this.navCtrl.setRoot('FirstLandingPage');

  }

  dologIn(){
    const modal = this.modalCtrl.create('UserLoginPage');
    modal.present();
  }

  dismiss() {
    this.navCtrl.pop();
  }
}
