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
  selector: 'page-food-categories',
  templateUrl: 'food-categories.html',
})
export class FoodCategoriesPage {

  restaurant: any;
  restaurantdata: any;
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
    /*this.getNavParamsData();*/
    this.getRestaurant();
    this.getCarCount();
    console.log('Cart Count', this.userData.CART_ITEM_COUNT);
  }

  getCarCount() {
    this.userData.getCarCount().then((count) => {
      this.cartitem = count;
    });
  }

  getRestaurant() {

var city = localStorage.getItem("city");
// this.cartitem  = localStorage.getItem("cartitem");
// if (_cartitem === 'undefined' || _cartitem === null || _cartitem === undefined){

// }

console.log ('Cart Item', localStorage.getItem("cartitem"));
console.log(city);

 let loader = this.loading.create({
    content: 'Loading Restaurant',
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

     let url = RunningmanConfig.hosturl + 'API/mobile/restaurantsearch';
    this.http.post(url, {txtsearch:"", sortOption:"liRestNameAsc", location:city, loc_level:1, state:"",cuisinefilter: this.cuisine ,pricefilter: this.price , featurefilter: this.features, pagenum: 1}).subscribe((restaurant: any) => {
      this.restaurantdata = restaurant;
      this.restaurant = restaurant;
      this.getShopAvailability();
      console.log(this.restaurant);
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



gotoCategoryItemList(shopid) {
    const modal = this.modalCtrl.create('FoodCategoryItemsPage', { shopid: shopid });
    modal.present();
  }

gotoFoodSearch() {

    console.log(this.deliverystate);
    if (this.deliverystate  === undefined || this.deliverystate === 'undefined' || this.deliverystate === null){
      
    let loader = this.loading.create({
    content: 'Initialize search..',
    spinner: 'crescent'
  });
loader.present().then(() => {
    let url = RunningmanConfig.hosturl + 'deliverystate';
    this.http.post(url, {}).subscribe((deliverystate: any) => {
      this.deliverystate = deliverystate.location;
      console.log(this.deliverystate);
       this.navCtrl.push('FoodSearchPage', {sourcepage: 'FoodCategoriesPage', deliverystate : this.deliverystate});
        loader.dismiss();
    }, error => {
      console.error('Error: ' + error);
        loader.dismiss();
    });
    
  });
    }else{
       console.log('ELSE DELIVERY', this.deliverystate);
       this.navCtrl.push('FoodSearchPage', {sourcepage: 'FoodCategoriesPage', deliverystate : this.deliverystate});

    }


  }


  /* gotoCartPage() {
 this.navCtrl.setRoot('CartPage');
    const modal = this.modalCtrl.create('UserLoginPage');
    modal.present();

  }*/

  setItems(){
    this.restaurant = this.restaurantdata;
  }


 filterItems(ev: any) {
   this.setItems();
    let val = ev.target.value;
    if (val && val.trim() !== '') {
      this.restaurant = this.restaurant.filter(function(item) {
        let res: any = item;
        return res.name.toString().toLowerCase().includes(val.toLowerCase());
      });
    }
  }

getNavParamsData() {
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
  }

  getAllLocation() {

 
  }
      gotoCartPage() {
    this.navCtrl.setRoot('CartPage');
  }

  getShopAvailability(){
    
var d = new Date();
var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var dname = days[d.getDay()];
var dayname = dname.toLowerCase();

var h = (d.getHours()<10?'0':'') + d.getHours();
var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
var hournow = h + m;



var i;
  for (i = 0; i < this.restaurant.length; i++) {
        
       

        var open;
        var close;
        switch (dayname) {
          case 'sunday':
                  open = this.restaurant[i].hours.sunday.open;
              close = this.restaurant[i].hours.sunday.close;
              break;
          case 'monday':
              open = this.restaurant[i].hours.monday.open;
              close = this.restaurant[i].hours.monday.close;
              break;
          case 'tuesday':
              open = this.restaurant[i].hours.tuesday.open;
              close = this.restaurant[i].hours.tuesday.close;
              break;
          case 'wednesday':
              open = this.restaurant[i].hours.wednesday.open;
              close = this.restaurant[i].hours.wednesday.close;
              break;                            
          case 'thursday':
              open = this.restaurant[i].hours.thursday.open;
              close = this.restaurant[i].hours.thursday.close;
              break; 
          case 'friday':
              open = this.restaurant[i].hours.friday.open;
              close = this.restaurant[i].hours.friday.close;
              break;                
          case 'saturday':
              open = this.restaurant[i].hours.saturday.open;
              close = this.restaurant[i].hours.saturday.close;
              break;                     
      }
      if (parseInt(hournow, 16) >= parseInt (open,16) && parseInt(hournow, 16) <= parseInt (close,16) ) {

         this.restaurant[i].isopen = false ;
      }else{
          this.restaurant[i].isopen = true ;
      }


    }

}

}
