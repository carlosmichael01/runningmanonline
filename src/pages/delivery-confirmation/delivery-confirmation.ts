/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Delivery Confirmation page
 * File path - '../../../../src/pages/delivery-confirmation/delivery-confirmation'
 */


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { RunningmanConfig } from '../../assets/config/runningman';

@IonicPage()
@Component({
  selector: 'page-delivery-confirmation',
  templateUrl: 'delivery-confirmation.html',
})
export class DeliveryConfirmationPage {

 
  private shopdata: any;
  private cartdata:any;
  DeliveryDate: any;
  DeliveryTime: any;
  DeliveryLater: boolean = false;
  DeliverySched: String = 'Now';
        firstname : any;
        lastname : any;
        email : any;
        mobile : any;
        fulladdress : any;
        legend : any;
        city : any;
        zipcode : any ;
  asapselected :boolean = true;
  laterselected : boolean = true;
  asapdisable : boolean = false;
  deliverlater:any;
  delivernow:any;
  mindate: any;
  mintime:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    public loading: LoadingController,
    private alertCtrl: AlertController,
    private menu: MenuController) {
    this.menu.enable(true); // Enable sidemenu
  }

  /**
   * Do any initialization
   */
  ngOnInit() {

    /*this.getNavParamsData();*/


    this.loadData();
  }

// getNavParamsData() {
//     /*if (this.navParams.get('category')) {
//       this.categoryName = this.navParams.get('category');
//     }*/
//      if (this.navParams.get('shopdata')) {
//       this.cartdata = this.navParams.get('shopdata');

//      }
//   }


loadData(){

if (this.navParams.get('shopdata')) {
  this.shopdata = this.navParams.get('shopdata');
  this.cartdata = this.shopdata.carts;

  var date = new Date();

  if (this.shopdata.availability == 'OPEN'){
    this.asapselected = true;
    this.laterselected = false;
    this.asapdisable = false;
    this.DeliveryLater = false;
  }else{
    this.asapselected = false;
    this.laterselected = true;
    this.asapdisable = true;
    this.DeliveryLater = true;

  }

    date.setDate(date.getDate() + 1);
    this.mindate = date.toISOString();
    this.DeliveryDate = this.mindate;
    this.DeliveryTime = date.toISOString();
     this.DeliverySched = 'ASAP';


  this.fulladdress = this.cartdata.address.street;
  this.zipcode = this.cartdata.address.postcode ;
  this.city = this.cartdata.address.city;
 
  if (this.cartdata.contact.email === '' || this.cartdata.contact.email === 'undefined' || this.cartdata.contact.email === null ) {
    var _userid =  localStorage.getItem("userid");
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
            this.city = data[0].city;
            loader.dismiss();
          }, error => {
            console.error('Error: ' + error);
            loader.dismiss();
          }); 

  } else {
        this.firstname = this.cartdata.contact.fname;
        this.lastname = this.cartdata.contact.lname;
        this.email = this.cartdata.contact.email;
        this.mobile = this.cartdata.contact.number;
        this.legend = this.cartdata.delivery_legend;
        
 }
}

}
  /**
   * --------------------------------------------------------------
   * Go To Menu Category Page
   * --------------------------------------------------------------
   */

 /* formValidation() {
    this.PaymentForm = this.formBuilder.group(
      {
        cardName: ['', Validators.compose([Validators.required])],
        cardNumber: ['', Validators.compose([Validators.required])],
        expireDate: ['', Validators.compose([Validators.required])],
        cvcType: ['', Validators.compose([Validators.required])]
      }
    );
  }*/
  gotoPaymentPage() {

    let loader = this.loading.create({
    content: 'Updating Delivery Info..',
    spinner: 'crescent'
  });
  loader.present();

    this.cartdata.contact.fname = this.firstname;
    this.cartdata.contact.lname = this.lastname;
    this.cartdata.contact.email = this.email;
    this.cartdata.contact.number = this.mobile;
    this.cartdata.delivery_legend = this.legend;
    this.cartdata.address.city = this.city;
    this.cartdata.address.postcode = this.zipcode;

    this.cartdata.delivery_time.date  = this.DeliveryDate;
    this.cartdata.delivery_time.time  = this.DeliveryTime;
    this.cartdata.delivery_time.schedule  = this.DeliverySched;
    var delivery_address = this.cartdata.address.street;
    // if (this.legend != ""){
    //     delivery_address = this.legend + ' ' + delivery_address;
    // }

    var param = {cartid: this.cartdata._id,
                city: this.cartdata.address.city,
                contact: this.cartdata.contact.number,
                delivery_date: this.cartdata.delivery_time.date,
                delivery_time: this.cartdata.delivery_time.time,
                email: this.cartdata.contact.email,
                firstname: this.cartdata.contact.fname,
                lastname:this.cartdata.contact.lname,
                lat: this.cartdata.coordinate.lat,
                lng: this.cartdata.coordinate.lng,
                postcode: this.cartdata.address.postcode,
                schedule: this.cartdata.delivery_time.schedule,
                street: delivery_address};

        console.log('Final Final shop', this.shopdata);

        let url = RunningmanConfig.hosturl + 'updatecartitem';
          this.http.post(url, param).subscribe((data: any) => {
            loader.dismiss();
            this.navCtrl.setRoot('PaymentPage',  { shopdata: this.shopdata });        
          }, error => {
            console.error('Error: ' + error);
            loader.dismiss();
              let alert = this.alertCtrl.create({
                subTitle: error,
                buttons: [  {
                    text: 'Okay',
                    handler: () => {
                    }
                  }]
              });
              alert.present();

          }); 
   
  }
    gotoCartPage() {
    this.navCtrl.setRoot('CartPage');
  }

  setSchedule(value: string): void {
      this.DeliverySched = value;
      if (value == 'ASAP'){
        this.DeliveryLater = false;
      }else{
          this.DeliveryLater = true;
      }

  }
}
