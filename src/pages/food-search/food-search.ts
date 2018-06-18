/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of User Information page
 * File path - '../../../../src/pages/user-information/user-information'
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController , ModalController,ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'food-search',
  templateUrl: 'food-search.html',
})
export class FoodSearchPage {

  selcity: any;
  deliverystate:any;
  state: any;
  price :any;
  features :any;
  cuisine :any;
  sourcepage : any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController, 
    private http: HttpClient,
    public modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private menu: MenuController) {
    this.menu.enable(true); // Enable sidemenu
  }

  /**
   * Do any initialization
   */
 ionViewDidLoad() {
    this.getNavParamsData();
  }

 async getNavParamsData() {
     if (this.navParams.get('deliverystate')) {
      this.deliverystate = this.navParams.get('deliverystate');
      this.selcity = localStorage.getItem("city");
       console.log('SEARCH', this.deliverystate);
    }
      if (this.navParams.get('sourcepage')) {
      this.sourcepage = this.navParams.get('sourcepage');
       console.log('SEARCH', this.sourcepage);
    }
  }


  /**
   * --------------------------------------------------------------
   * Go To Menu Category Page
   * --------------------------------------------------------------
   */
  gotoMenuCategoryPage() {
    this.navCtrl.setRoot('FoodCategoriesPage');
  }

submitSearch(){

  console.log('state',this.state);
  console.log('features',this.features);
  console.log('cuisine',this.cuisine);
  console.log('price',this.price);

  var _features = '';
  var _cuisine = '';
  var _price = '';

  if (this.state  === undefined || this.state === 'undefined' || this.state === null){
  }else {localStorage.setItem("city",this.state);}

    if (this.features  === undefined || this.features === 'undefined' || this.features === null){
      _features = "";
   }else{  _features = this.features.toString();   }

    if (this.cuisine  === undefined || this.cuisine === 'undefined' || this.cuisine === null){
      _cuisine = "";
  }else{ _cuisine = this.cuisine.toString();}

    if (this.price  === undefined || this.price === 'undefined' || this.price === null){
      _price = "";
  }else{_price = this.price.toString();}


  this.navCtrl.setRoot(this.sourcepage, {features : _features, price : _price , cuisine : _cuisine , deliverystate : this.deliverystate}); 

}


  dismiss() {
    this.navCtrl.pop();
  }
}
