/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Food Item Details page
 * File path - '../../../../src/pages/food-item-details/food-item-details'
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, ModalController} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { RunningmanConfig } from '../../assets/config/runningman';
import { UserData } from '../../assets/config/user-data';

@IonicPage()
@Component({
  selector: 'page-delivery-details',
  templateUrl: 'delivery-details.html',
})
export class DeliveryDetailsPage {

  orderid: any;
  itemaddon: any;
  orderdetails: any;
  itemoption: any;
  itemqty: any;
  totalprice: number;
  Instruction: string='';
  cartdata : any;
  totalcostprice: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userData: UserData,
    private viewCtrl: ViewController,private http: HttpClient,  public loading: LoadingController, public modalCtrl: ModalController, private alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
   
  this.getItemDetail() ;
    
  }



 /* async getNavParamsData() {
     if (this.navParams.get('transactionid')) {
      this.transactionid = this.navParams.get('transactionid');
       console.log('transactionid', this.transactionid);
      
    }
  }*/

  getItemDetail() {

 let loader = this.loading.create({
    content: 'Loading Details',
    spinner: 'crescent'
  });
  loader.present();
 let transid = this.navParams.get('transactionid');
    console.log('transactionid', transid);
this.orderid = transid;
  let url =  RunningmanConfig.hosturl + 'loadorderdetail';
  this.http.post(url, {transaction_id: transid}).subscribe((data: any) => {
        this.orderdetails = data.items;
      console.log ('Product', this.orderdetails);

  
 

       loader.dismiss();
    }, error => {
      console.error('Error: ' + error);
       loader.dismiss();
    });
  
  }

  

 
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
