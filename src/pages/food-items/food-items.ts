/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Food Categories page
 * File path - '../../../../src/pages/food-categories/food-categories'
 */

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicPage, NavController, NavParams, MenuController, ModalController, LoadingController } from 'ionic-angular';
import { RunningmanConfig } from '../../assets/config/runningman';
import { UserData } from '../../assets/config/user-data';

@IonicPage()
@Component({
  selector: 'page-food-items',
  templateUrl: 'food-items.html',
})
export class FoodItemsPage {

  restaurant: any;
  restaurantdata : any;
  deliverystate:any;
    price : string  = '';
  features : string = '';
  cuisine : string ='';
  cartitem: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private menu: MenuController,
    private http: HttpClient,
     public userData: UserData,
    public loading: LoadingController,
    public modalCtrl: ModalController) {
     this.menu.enable(true);
  }

  /** Do any initialization */
  ngOnInit() {
    this.getRestaurant();
    this.getCarCount();
  }

  getCarCount() {
    this.userData.getCarCount().then((count) => {
      this.cartitem = count;
    });
  }

  getRestaurant() {

var city = localStorage.getItem("city");
this.cartitem  = localStorage.getItem("cartitem");

 let loader = this.loading.create({
    content: 'Loading Dishes',
    spinner: 'crescent'
  });
  loader.present();

    if (this.navParams.get('deliverystate')) {
      this.deliverystate = this.navParams.get('deliverystate');
    }
    if (this.navParams.get('features')) {
      this.features = this.navParams.get('features');
    }
     if (this.navParams.get('price')) {
      this.price = this.navParams.get('price');
      
    }
     if (this.navParams.get('cuisine')) {
      this.cuisine = this.navParams.get('cuisine');
      
    }
      console.log( 'PRICE', this.price );
      console.log ('FEATURE',  this.features);
      console.log('CUISINE', this.cuisine);

     let url =  RunningmanConfig.hosturl + 'API/mobile/dishessearch';
    this.http.post(url, {txtsearch:"", sortOption:"liRestNameAsc", location:city, loc_level:1, state:"",cuisinefilter: this.cuisine ,pricefilter: this.price, featurefilter:this.features, pagenum: 1}).subscribe((restaurant: any) => {
      this.restaurantdata = restaurant;
      this.restaurant = restaurant;
      console.log(this.restaurantdata);
      loader.dismiss();
    }, error => {
      console.error('Error: ' + error);
       loader.dismiss();
    });

  }

 gotoMenuItemList(shopid) {
    const modal = this.modalCtrl.create('FoodCategoryItemsPage', { shopid: shopid });
    modal.present();
  }

 gotoItemDetails(event, dishid) {
    /*this.navCtrl.setRoot('FoodItemDetailsPage', { dishid: dishid });*/
    console.log(dishid);
    const modal = this.modalCtrl.create('FoodItemDetailsPage', { dishid: dishid });
    modal.present();
  }



setItems(){
    this.restaurant = this.restaurantdata;
  }


 filterItems(ev: any) {
   this.setItems();
    let val = ev.target.value;
    if (val && val.trim() !== '') {
      this.restaurant = this.restaurant.filter(function(item) {
        let res: any = item;
        return res.product['name'].toString().toLowerCase().includes(val.toLowerCase());
      });
    }
  }

  gotoCartPage() {
    this.navCtrl.setRoot('CartPage');
  }

gotoFoodSearch() {

    console.log(this.deliverystate);
    if (this.deliverystate  === undefined || this.deliverystate === 'undefined' || this.deliverystate === null){
      
    let loader = this.loading.create({
    content: 'Initialize search..',
    spinner: 'crescent'
  });
loader.present().then(() => {
    let url =  RunningmanConfig.hosturl + 'deliverystate';
    this.http.post(url, {}).subscribe((deliverystate: any) => {
      this.deliverystate = deliverystate.location;
      console.log(this.deliverystate);
      this.navCtrl.push('FoodSearchPage', {sourcepage: 'FoodItemsPage', deliverystate : this.deliverystate});

        loader.dismiss();
    }, error => {
      console.error('Error: ' + error);
        loader.dismiss();
    });
    
  });
    }else{
       console.log('ELSE DELIVERY', this.deliverystate);
       this.navCtrl.push('FoodSearchPage', {sourcepage: 'FoodItemsPage', deliverystate : this.deliverystate});
    }


  }

}
