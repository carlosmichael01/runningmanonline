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
  selector: 'page-food-item-details',
  templateUrl: 'food-item-details.html',
})
export class FoodItemDetailsPage {

  dishid: any;
  /*itemname: any;
  itemprice: any;
  itemimage: any;
  itemdesc: any;
 */
  itemaddon: any;
  productdata: any;
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
    this.getNavParamsData();
    /*this.getFoodItems();*/
    this.getItemDetail() ;
  }



    async getNavParamsData() {
     if (this.navParams.get('dishid')) {
      this.dishid = this.navParams.get('dishid');
       console.log(this.dishid);
    }
  }

  getItemDetail() {

 let loader = this.loading.create({
    content: 'Loading Details',
    spinner: 'crescent'
  });
  loader.present();

  let url =  RunningmanConfig.hosturl + 'API/mobile/dishsearch';
  this.http.post(url, {id:this.dishid}).subscribe((data: any) => {
      this.productdata = data;

      console.log ('Product', this.productdata);

      this.itemaddon  = data[0].product.add_on;
      this.itemoption  = data[0].product.options;
      this.productdata[0].product['qty'] = 1;
      this.totalprice = this.productdata[0].product['selling_price'];
      this.totalcostprice = this.productdata[0].product['cost_price'];
    var i;
    for (i = 0; i < this.itemaddon.length; i++) {
          this.itemaddon[i].qty = 0;
    }

    var x;
    for (x = 0; x < this.itemoption.length; x++) {
          this.itemoption[x].isselected = 0;
    }

      console.log(this.productdata);
      console.log(this.itemaddon);
       console.log(this.itemoption);
 

       loader.dismiss();
    }, error => {
      console.error('Error: ' + error);
       loader.dismiss();
    });
  
  }

  // Remove quantity
  minusQuantity(price, cost) {
    if (this.productdata[0].product['qty'] > 1) {
      this.productdata[0].product['qty'] = this.productdata[0].product['qty'] - 1;
      this.totalprice = this.totalprice - price;
      this.totalcostprice =  this.totalcostprice - cost;
     
    }
  }

  // Add quantity
  addQuantity(price, cost) {
    if (this.productdata[0].product['qty']) {
      this.productdata[0].product['qty'] = this.productdata[0].product['qty'] + 1;
       this.totalprice = this.totalprice + price;
       this.totalcostprice = this.totalcostprice + cost;
        
    } else {
      this.productdata[0].product['qty'] = 0;
      this.productdata[0].product['qty'] = this.productdata[0].product['qty'] + 1;
      this.totalprice = this.totalprice + price;
      this.totalcostprice = this.totalcostprice + cost;
      
    }
   
  }

 // Remove quantity
  minusAddonQuantity(index, price, cost) {
    if (this.itemaddon[index].qty  > 0) {
      this.itemaddon[index].qty = this.itemaddon[index].qty - 1;
       this.totalprice = this.totalprice - price;
       this.totalcostprice = this.totalcostprice - cost;
    }
  }

  // Add quantity
  addAddonQuantity(index, price, cost) {
    if (this.itemaddon[index].qty) {
      this.itemaddon[index].qty = this.itemaddon[index].qty + 1;
       this.totalprice = this.totalprice + price;
       this.totalcostprice = this.totalcostprice + cost;
    } else {
      this.itemaddon[index].qty = 0;
      this.itemaddon[index].qty = this.itemaddon[index].qty + 1;
       this.totalprice = this.totalprice + price;
       this.totalcostprice = this.totalcostprice + cost;
    }
  }


  onSelectChange(selectedValue: any) {
    var x;
    var qty =  this.productdata[0].product['qty'];
    var presellingprice = 0;
    var precostprice = 0;
    for (x = 0; x < this.itemoption.length; x++) {
      if ( this.itemoption[x]._id == selectedValue){
          this.itemoption[x].isselected = 1;
          presellingprice = qty * this.itemoption[x].price;
          precostprice = qty * this.itemoption[x].cost_price;
          console.log('presellingprice' , presellingprice);
          console.log('precostprice' , precostprice);
          this.totalprice = this.totalprice + presellingprice;
          this.totalcostprice = this.totalcostprice + precostprice;
      }else{
        if ( this.itemoption[x].isselected == 1){
          presellingprice = qty * this.itemoption[x].price;
          precostprice = qty * this.itemoption[x].cost_price;
           this.totalprice = this.totalprice - presellingprice;
          this.totalcostprice = this.totalcostprice - precostprice;
          this.itemoption[x].isselected = 0;
        }
      }
          
    }
  }

AddToCart(){
 var _userid =  localStorage.getItem("userid");

if ( _userid !== 'undefined') {
   console.log ('UserID Storage', localStorage.getItem("userid"));
_userid = localStorage.getItem("userid");
}


console.log('UserID Check', _userid);
if (_userid === 'undefined' || _userid === null){

   /* const modal = this.modalCtrl.create('UserLoginPage');
    modal.present();*/
     this.navCtrl.push('UserLoginPage');


}else{

      let loader = this.loading.create({
          content: 'Adding to Cart',
          spinner: 'crescent'
        });
        loader.present();


        var _productid  =  this.productdata[0].product['_id'];
        var _delivery_fee = this.productdata[0].delivery_fee;
        var _free_delivery = this.productdata[0].product['free_delivery'];
        var _instruction = this.Instruction;
        var _merchantcost = this.totalcostprice;
        var _productdesc =   this.productdata[0].product['desc'];
        var _productestimate =  this.productdata[0].product['prep_timefrom'] + ' - ' + this.productdata[0].product['prep_timeto'];
        var _productimage  = this.productdata[0].product['image'];
        var _productname = this.productdata[0].product['name'];
        var _quantity = this.productdata[0].product['qty'];
        var _restid  =  this.productdata[0]._id;
        var _restname = this.productdata[0].name;
        var _shopaddress = this.productdata[0].address;
        var _shopcity = this.productdata[0].location['city'];
        var _shopstate = this.productdata[0].location['state'];
        var _shoplat = this.productdata[0].coordinate[0];
        var _shoplng = this.productdata[0].coordinate[1];
        var _total_price = this.totalprice;
        var _transtype = 'Order';
        var _sessionid='';
        var _userid = localStorage.getItem("userid");

        var _addon_name = '';
        var i;
        for (i = 0; i < this.itemaddon.length; i++) {
             if (this.itemaddon[i].qty > 0) {
               _addon_name += this.itemaddon[i].name + ':' + this.itemaddon[i].qty + ':' + this.itemaddon[i].price  + ':' + this.itemaddon[i].cost_price + ','
             }
        }
        console.log(_addon_name);
        if (!! _addon_name){
        _addon_name = _addon_name.substr(0, _addon_name.length - 1);
        }

        var _option='';
        var x;
        for (x = 0; x < this.itemoption.length; x++) {
             if (this.itemoption[x].isselected > 0) {
               _option += this.itemoption[x].name + ':' + this.itemoption[x].price  + ':' + this.itemoption[x].cost_price + ','
             }
        }
        console.log(_option);
        if (!! _option){
        _option =  _option.substr(0, _option.length - 1);
        }
        var param = {productid  :  _productid,
                    delivery_fee : _delivery_fee,
                    free_delivery : _free_delivery,
                    instruction : _instruction,
                    merchantcost : _merchantcost,
                    productdesc :   _productdesc,
                    productestimate :  _productestimate,
                    productimage  : _productimage,
                    productname : _productname,
                    quantity : _quantity,
                    restid  :  _restid,
                    restname : _restname,
                    shopaddress : _shopaddress,
                    shopcity : _shopcity,
                    shopstate : _shopstate,
                    shoplat : _shoplat,
                    shoplng : _shoplng,
                    total_price : _total_price,
                    transtype : _transtype,
                    sessionid : _sessionid,
                    userid : _userid,
                    addon_name : _addon_name,
                    option: _option};

        console.log(param);

        let url =  RunningmanConfig.hosturl + 'API/mobile/RestaurantCart';
          this.http.post(url, param).subscribe((data: any) => {
            this.cartdata = data;
            console.log(this.cartdata);
            loader.dismiss();
          //  var cartitem = localStorage.getItem("cartitem");
          //  var itemcount = parseInt(cartitem, 16) + 1;
          //  localStorage.setItem("cartitem", itemcount.toString());
          //  console.log ( localStorage.getItem("cartitem"));
          
            this.userData.getCarCount().then((count) => {
               var cartitem = count;
               var itemcount = parseInt(cartitem, 16) + 1;
               this.userData.setCartCount(itemcount.toString());
              });

             let alert = this.alertCtrl.create({
                subTitle: 'Successfully added to cart!',
                buttons: [  {
                    text: 'Continue Shopping',
                    handler: () => {
                      this.viewCtrl.dismiss();
                    }
             }/*,
                    {
                      text: 'Go to Cart',
                      handler: () => {
                        this.navCtrl.setRoot('CartPage');
                      }
                    }*/
                  ]
              });
              alert.present();
             

          }, error => {
            console.error('Error: ' + error);
            loader.dismiss();
          }); 
      
}

  }



  /**
   * Dismiss function
   * This function dismiss the popup modal
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
