/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Cart page
 * File path - '../../../../src/pages/cart/cart'
 */


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { RunningmanConfig } from '../../assets/config/runningman';
import { Geolocation } from '@ionic-native/geolocation';
import { UserData } from '../../assets/config/user-data';
declare var google;

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  cartdata: any;
  cartorders: any;
  cartsubtotal: any;
  cartgst:any;
  carttotal:any;
  cartdistinct:any;
  totaldeliveryfee:any;
  _cartid : any;
  iscartempty : boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController,
    private http: HttpClient, 
    public userData: UserData,
    private menu: MenuController,
    public modalCtrl: ModalController) {
    this.menu.enable(true);
  }

  ngOnInit() {
    this.menu.enable(true);
    this.getCart();
  }


getCart() {


var _userid = localStorage.getItem("userid");

 let loader = this.loading.create({
    content: 'Loading Cart',
    spinner: 'crescent'
  });
  loader.present();

  let url = RunningmanConfig.hosturl + 'LoadMobileCart';
  this.http.post(url, {userid: _userid}).subscribe((data: any) => {
this.cartdata = data;
console.log('cartdata',this.cartdata);
if (this.cartdata.carts != null){
  this.cartorders = data.carts.orders;
  this.userData.setCartCount(this.cartorders.length);

  if ( this.cartorders.length > 0 ){
    this.iscartempty = false;
    this.cartsubtotal = 0;
    this._cartid = data.carts._id;
    this.cartdata.subtotal_price = 0;
    this.cartdata.availability = 'OPEN';
    this.cartdata.total_deliveryfee = 0;
    this.cartdistinct = data.distinctcart;

    this.getShopAvailability();
    this.calculateDeliveryFee();
    
    var i;
    var total=0;
    for (i = 0; i < this.cartorders.length; i++) {
        this.cartorders[i].addon_display = "";
        this.cartorders[i].option_display = "";

        total = total + this.cartorders[i].price;

         var x;
          var addonitems = '';
          for (x = 0; x < this.cartorders[i].add_on.length; x++) {
               addonitems += '+' + this.cartorders[i].add_on[x].name + ' X' + this.cartorders[i].add_on[x].quantity  + ',';
          }
          if (addonitems != ''){
              addonitems = addonitems.substr(0, addonitems.length - 1);
          }
          this.cartorders[i].addon_display = addonitems;

          var y;
          var optionitems = '';
          for (y = 0; y < this.cartorders[i].option.length; y++) {
               optionitems += 'OPTION: ' + this.cartorders[i].option[y].name + ',';
          }
          if (optionitems != ''){
              optionitems = optionitems.substr(0, optionitems.length - 1);
          }
          this.cartorders[i].option_display = optionitems;

    }
    if (total != 0){
      this.cartsubtotal = total.toFixed(2);
      this.cartdata.subtotal_price = this.cartsubtotal;
    }
       loader.dismiss();
  }else{
     this.userData.setCartCount('0');
      this.iscartempty = true;
      loader.dismiss();
  }

}else{
  this.userData.setCartCount('0');
  this.iscartempty = true;
  loader.dismiss();
}
 
    }, error => {
      console.error('Error: ' + error);
       loader.dismiss();
    }); 


  
  }

deleteCartItem(_orderid){


 let loader = this.loading.create({
    content: 'Deleting cart item..',
    spinner: 'crescent'
  });
  loader.present();

  let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        cartid: this._cartid,
        orderid:_orderid
      }
    };

  let url = RunningmanConfig.hosturl + 'deletecartitem';
  this.http.delete(url,options).subscribe((data: any) => {
    console.log(data);
    this.getCart();
    loader.dismiss();
    }, error => {
      console.error('Error: ' + error);
       loader.dismiss();
    }); 
}

gotoSetLocation(){
  /* const modal = this.modalCtrl.create('SelectMapPage',  { 'data': this.cartdata });
    modal.present();*/
console.log('Final Cart Data', this.cartdata);
    this.navCtrl.push('SelectMapPage',  { 'data': this.cartdata });

}

  gotoDeliveryConfirmPage() {
    this.navCtrl.setRoot('DeliveryConfirmationPage',  { shopdata: this.cartdata });
  }


getShopAvailability(){
    
var d = new Date();
var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var dname = days[d.getDay()];
var dayname = dname.toLowerCase();


var h = (d.getHours()<10?'0':'') + d.getHours();
var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
var hournow = h + m;



// this.cartorders = this.cartdata.orders;
var i;
  for (i = 0; i < this.cartorders.length; i++) {
 
        var open;
        var close;
        switch (dayname) {
          case 'sunday':
      
              open = this.cartorders[i].shop_id.hours.sunday.open;
              close = this.cartorders[i].shop_id.hours.sunday.close;
              break;
          case 'monday':
              open = this.cartorders[i].shop_id.hours.monday.open;
              close = this.cartorders[i].shop_id.hours.monday.close;
              break;
          case 'tuesday':
              open = this.cartorders[i].shop_id.hours.tuesday.open;
              close = this.cartorders[i].shop_id.hours.tuesday.close;
              break;
          case 'wednesday':
              open = this.cartorders[i].shop_id.hours.wednesday.open;
              close = this.cartorders[i].shop_id.hours.wednesday.close;
              break;                            
          case 'thursday':
              open = this.cartorders[i].shop_id.hours.thursday.open;
              close = this.cartorders[i].shop_id.hours.thursday.close;
              break; 
          case 'friday':
              open = this.cartorders[i].shop_id.hours.friday.open;
              close = this.cartorders[i].shop_id.hours.friday.close;
              break;                
          case 'saturday':
              open = this.cartorders[i].shop_id.hours.saturday.open;
              close = this.cartorders[i].shop_id.hours.saturday.close;
              break;                     
      }
      if (parseInt(hournow, 16) >= parseInt (open,16) && parseInt(hournow, 16) <= parseInt (close,16) ) {
      }else{
          this.cartdata.availability = 'CLOSE';
      }
    }

}

calculateDeliveryFee(){
  this.totaldeliveryfee = 0;
  var arr_Coordinates=[];
  var arrCoordinate={};
  var firstshoplocation;
  
  //Calculate Delivery of each shop

console.log('Shopcount', this.cartdistinct.length);

  var z;
  for (z = 0; z < this.cartdistinct.length; z++) { 
    console.log('z', this.cartdistinct[z]);
    var i;
      for (i = 0; i < this.cartorders.length; i++) {
      console.log('i', this.cartorders[i].shop_id._id);
      if (this.cartdistinct[z] == this.cartorders[i].shop_id._id){
         if (this.cartorders[i].free_delivery == true){
           console.log(this.cartorders[i].delivery_fee);
          this.totaldeliveryfee = this.totaldeliveryfee + this.cartorders[i].delivery_fee;
          }
        else{
             this.totaldeliveryfee = this.totaldeliveryfee + 0;
        }
        break;
      }
    }
  }


this.cartdata.total_deliveryfee = this.totaldeliveryfee;
//Calculate Delivery Cost of each shop
if (this.cartdistinct.length > 1 ){

      var x;
      for (x = 0; x < this.cartdistinct.length; x++) {
           var y;
          for (y = 0; y < this.cartorders.length; y++) {
            if (this.cartdistinct[x] == this.cartorders[y].shop_id._id){
               if (arrCoordinate == undefined) {
                  firstshoplocation =this.cartorders[y].location.state +'_'+ this.cartorders[y].location.city;
               }
               arrCoordinate={'lat': this.cartorders[y].shop_coordinate.lat,'lng':this.cartorders[y].shop_coordinate.lng,'name':this.cartorders[y].shop_name};
              arr_Coordinates.push(arrCoordinate);
              break;
            }
          }

    
console.log('arr_Coordinates', arr_Coordinates);

    var frmLong;
     var frmLat;
     var toLong;
     var toLat;
     
     var counter=0;
     var total_distance=0;
     var distancefee=0;
     var distance=0;

 

        for (var c = 0; c < arr_Coordinates.length; c++) {
               
               if (counter==0)
               {
                  counter++;
                  frmLong=arr_Coordinates[c].lng;
                  frmLat=arr_Coordinates[c].lat;

               }
               else if (counter==1)
               {
                  counter++;
                  toLong=arr_Coordinates[c].lng;
                  toLat=arr_Coordinates[c].lat;
                  this.calculateShopDistance([frmLat, frmLong],[toLat, toLong]).then(data => {
                      let distancefee = this.calculatePricePerDistance(data); 
                      console.log('distancefee', distancefee);
                      console.log('totaldeliveryfee',  this.totaldeliveryfee)
                      this.totaldeliveryfee = this.totaldeliveryfee + distancefee;
                      this.cartdata.total_deliveryfee = this.totaldeliveryfee;
                     
                  });                
               }
               else
               {
                counter++;
                frmLong=toLong;
                frmLat=toLat;
                toLong=arr_Coordinates[c].lng;
                toLat=arr_Coordinates[c].lat;

                this.calculateShopDistance([frmLat, frmLong],[toLat, toLong]).then(data => {
                      let distancefee = this.calculatePricePerDistance(data); 
                       console.log('distancefee else', distancefee);
                      this.totaldeliveryfee = this.totaldeliveryfee + distancefee;
                      this.cartdata.total_deliveryfee = this.totaldeliveryfee;
                  });   
                   
               }
          }
     
    
  
}
     }

}



calculateShopDistance(frmCoord,toCoord) {

       let loader = this.loading.create({
          content: 'Calculating delivery cost..',
          spinner: 'crescent'
        });
        loader.present();
  var kmdistance;
  return new Promise(function(resolve, reject) {
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
               kmdistance=Math.floor(distance/1000);   
              resolve(kmdistance); 
             
            }
              loader.dismiss();   
        });
    
    });
}

 calculatePricePerDistance(distance)
  {
    var distancefee=0;
  
      if (distance  < .5)
      {
        distancefee=1;
      }
      else if (distance < 1)
      {
         distancefee=2;
      }
       else if (distance < 3)
      {
         distancefee=3;
      }
      else
      {
        distancefee =distance*1;
      }
      return distancefee;

  }

  backtoShop(){
    this.navCtrl.setRoot('FoodCategoriesPage');
  }


// CalculateGoogleDistance(frmCoord,toCoord,callback)
//     {
//     ///    console.log('This is coordinate : '+ frmCoord +'-'+ toCoord);
//       var service = new google.maps.DistanceMatrixService();
//       service.getDistanceMatrix(
//         {
//           origins:  [""+frmCoord+""], //array of origins
//           destinations:[""+toCoord+""], //aray of destionations
//           travelMode: google.maps.TravelMode.DRIVING,
//           unitSystem: google.maps.UnitSystem.METRIC,
//           avoidHighways: false,
//           avoidTolls: true
//         }, function(response, status){
//             if(status==google.maps.DistanceMatrixStatus.OK)
//             {
//              ///   console.log( response);
//               var distance = response.rows[0].elements[0].distance.value;
//               var kmdistance=Math.floor(distance/1000);   
//               callback(kmdistance);
//             }    
//         });
//     }

//  calculateShopDistance(frmCoord,toCoord){

//     var dis =0 ;
//     var service = new google.maps.DistanceMatrixService();
//       service.getDistanceMatrix(
//         {
//           origins:  [""+frmCoord+""], //array of origins
//           destinations:[""+toCoord+""], //aray of destionations
//           travelMode: google.maps.TravelMode.DRIVING,
//           unitSystem: google.maps.UnitSystem.METRIC,
//           avoidHighways: false,
//           avoidTolls: true
//         }, function(response, status){
//             if(status==google.maps.DistanceMatrixStatus.OK)
//             {
//              ///   console.log( response);
//               var distance = response.rows[0].elements[0].distance.value;
//               var kmdistance=Math.floor(distance/1000);   
//               dis= kmdistance;
//               console.log('out', dis);
//             }    
//         });

//       return dis;
// }





}
