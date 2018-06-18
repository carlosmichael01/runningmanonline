/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Food Category Item page
 * File path - '../../../../src/pages/food-category-items/food-category-items'
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { RunningmanConfig } from '../../assets/config/runningman';

@IonicPage()
@Component({
  selector: 'page-food-category-items',
  templateUrl: 'food-category-items.html',
})
export class FoodCategoryItemsPage {

  categoryName: any;
  foodItems: any;
  shopid: any;
  shopDetail:any;
  shopInfo:any;
  shopName:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private http: HttpClient,
    public loading: LoadingController,
    public modalCtrl: ModalController) {

  }

  /***
   * --------------------------------------------------------------
   * Lifecycle Event - ionViewDidLoad()
   * --------------------------------------------------------------
   * 
   * Fired when the page has loaded
   */
  ionViewDidLoad() {
    this.getNavParamsData();
   /* this.getFoodItems(); */
    this.getMenuItems() ;
  }

  /**
   * --------------------------------------------------------------
   * Get & Set data from NavParams
   * --------------------------------------------------------------
   */
  async getNavParamsData() {
    /*if (this.navParams.get('category')) {
      this.categoryName = this.navParams.get('category');
    }*/
     if (this.navParams.get('shopid')) {
      this.shopid = this.navParams.get('shopid');
       
    }
  }

  /**
   * --------------------------------------------------------------
   * Get All Food Items
   * --------------------------------------------------------------
   */

getMenuItems() {

 let loader = this.loading.create({
    content: 'Loading Menu',
    spinner: 'crescent'
  });
  loader.present();


   let url =  RunningmanConfig.hosturl + 'API/mobile/menusearchbyid';
  this.http.post(url, {id:this.shopid}).subscribe((data: any) => {
      this.shopDetail = data.product;
      this.shopName  = data.name;
      this.shopInfo  = data.desc;
      loader.dismiss();
    }, error => {
      console.error('Error: ' + error);
      loader.dismiss();
    });
  }

  getFoodItems() {
    this.http.get('assets/i18n/en.json').subscribe((data: any) => {
      this.foodItems = data.FOOD_ITEMS['BURGER'];
      console.log( this.foodItems);
    }, error => {
      console.error('Error: ' + error);
    });
  }

  // Remove quantity
  minusQuantity(item, index) {
    if (this.foodItems[index].quantity > 0) {
      this.foodItems[index].quantity = this.foodItems[index].quantity - 1;
    }
  }

  // Add quantity
  addQuantity(item, index) {
    if (this.foodItems[index].quantity) {
      this.foodItems[index].quantity = this.foodItems[index].quantity + 1;
    } else {
      this.foodItems[index].quantity = 0;
      this.foodItems[index].quantity = this.foodItems[index].quantity + 1;
    }
  }

  /**
   * --------------------------------------------------------------
   * GoTO Item Details Page
   * --------------------------------------------------------------
   */
  gotoItemDetails(dishid) {
    /*this.navCtrl.setRoot('FoodItemDetailsPage', { dishid: dishid });*/
    console.log(dishid);
    const modal = this.modalCtrl.create('FoodItemDetailsPage', { dishid: dishid });
    modal.present();
  }
  /**
   * Dismiss function
   * This function dismiss the popup modal
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
