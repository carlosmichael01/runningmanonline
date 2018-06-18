/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Payment page
 * File path - '../../../../src/pages/payment/payment'
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { RunningmanConfig } from '../../assets/config/runningman';
import { Geolocation } from '@ionic-native/geolocation';
import { UserData } from '../../assets/config/user-data';
declare var google;

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
 
  shopdata :any;
  subtotal: any;
  delivery_cost: any;
  surcharge: any;
  gst: any;
  overalltotal : any;
  payment_mode: any;
  coupon_code:any;

  constructor(public navCtrl: NavController, public userData: UserData,
    public navParams: NavParams, public loading: LoadingController, private http: HttpClient,
    private alertCtrl: AlertController,) {
  }

  /**
   * Do any initialization
   */
  ngOnInit() {
    this.getNavParamsData();
  }

  /***
   * --------------------------------------------------------------
   * Form Validation
   * --------------------------------------------------------------
   * @method   formValidation
   */

getNavParamsData() {
    /*if (this.navParams.get('category')) {
      this.categoryName = this.navParams.get('category');
    }*/
     if (this.navParams.get('shopdata')) {
      this.shopdata = this.navParams.get('shopdata');
      console.log(this.shopdata);
    
      this.subtotal = this.shopdata.subtotal_price;
      this.delivery_cost = this.shopdata.total_deliveryfee;
      this.surcharge = 0;
      /*this.gst =(this.subtotal * 0.06).toFixed(2);*/
       this.gst =0;

      var _overalltotal = 0;
    _overalltotal =  parseFloat(this.subtotal) +  parseFloat(this.gst) +  parseFloat(this.delivery_cost) +  parseFloat(this.surcharge);
    this.overalltotal  = _overalltotal.toFixed(2);
    this.coupon_code ='';

     }
  }

  CompleteTransaction(){

  let loader = this.loading.create({
    content: 'Completing Transaction..',
    spinner: 'crescent'
  });
  loader.present();

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; 
  var yyyy = today.getFullYear();

var _dd = '';
var _mm = '';

  if(dd<10) 
{
    _dd='0'+dd.toString();
} else{
  _dd = dd.toString();
}

if(mm<10) 
{
    _mm='0'+mm.toString();
} else{
  _mm  = mm.toString();
}

  var _userid =  localStorage.getItem("userid");
  var transid = yyyy.toString().substring(2, 4) + _mm + _dd;
  var _cartid = this.shopdata.carts._id;

  var param = {amount:this.overalltotal,
                cartid: this.shopdata.carts._id,
                coupon_code: this.coupon_code,
                coupon_disc: 0,
                delivery_cost: this.delivery_cost,
                gst:this.gst,
                mode:'cash',
                runnerid: '58ca169b8236232e14fbd11a',
                subtotal: this.subtotal,
                surcharge: this.surcharge,
                transactionid: transid,
                userid: this.shopdata.carts.userid};

      

        let url =  RunningmanConfig.hosturl + 'checkoutcartcash';
          this.http.post(url, param).subscribe((data: any) => {
            loader.dismiss();

              this.userData.setCartCount('0');
                 let alert = this.alertCtrl.create({
                subTitle: 'Your order was successfully submitted!',
                buttons: [  {
                    text: 'Okay',
                    handler: () => {
                        this.navCtrl.setRoot('DeliveryTrackingPage');  
                    }
                  }]
              });
              alert.present();

                  
          }, error => {
            console.error('Error: ' + error);
            loader.dismiss();

          }); 
  }


  CalculateGoogleDistance(frmCoord,toCoord,callback)
    {
    var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins:  [""+frmCoord+""], //array of origins
          destinations:[""+toCoord+""], //aray of destionations
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: true
        }, function(response, status){
            if(status==google.maps.DistanceMatrixStatus.OK)
            {
             ///   console.log( response);
              var distance = response.rows[0].elements[0].distance.value;
              var kmdistance=Math.floor(distance/1000);
            
           
            console.log('Test d : ',  kmdistance);
               //callback(kmdistance,shopname);
                 
                  callback(kmdistance);
            }    
        });
      
     
    }

    getPromoDiscount(){

      let loader = this.loading.create({
        content: 'Validating promo code..',
        spinner: 'crescent'
      });
      loader.present();
      console.log('coupon', this.coupon_code);
        let url =  RunningmanConfig.hosturl + 'checkcoupon';
          this.http.post(url, {coupon: this.coupon_code}).subscribe((data: any) => {
            console.log ('res', data);
            if (data.length > 0){
            var discount = data[0].discount;
            var name  = data[0].name;
            console.log(name);
            console.log(data);
                let alert = this.alertCtrl.create({
                subTitle: name,
                buttons: [  {
                    text: 'Okay',
                    handler: () => {
                      var total = parseFloat(this.overalltotal);
                      var dis = parseFloat(discount) / 100;
                      var discountprice = (total * dis );
                      var _overalltotal = total - discountprice;
                      this.overalltotal  = _overalltotal.toFixed(2);
                    }
                  }]
              });
              alert.present();
          }else{
              let alert = this.alertCtrl.create({
                subTitle: "Invalid Code!",
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
            loader.dismiss();

          }); 


    }


}
