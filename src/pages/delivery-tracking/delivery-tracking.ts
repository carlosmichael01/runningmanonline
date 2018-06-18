/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Delivery Tracking page
 * File path - '../../../../src/pages/delivery-tracking/delivery-tracking'
 */

import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController , ModalController  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { RunningmanConfig } from '../../assets/config/runningman';
/*import { Geolocation } from '@ionic-native/geolocation';
import { MapStyle } from '../../assets/config/map-style';
declare var google;*/

@IonicPage()
@Component({
  selector: 'page-delivery-tracking',
  templateUrl: 'delivery-tracking.html',
})
export class DeliveryTrackingPage {

  /*@ViewChild('map') mapElement: ElementRef;
  map: any;*/
  transactiondata: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController, 
    private http: HttpClient,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
   /* this.loadmap(); */
   this.loadDelivery();
  }

loadDelivery(){

var _userid =  localStorage.getItem("userid");
    console.log('UserID Check', _userid);
    if (_userid === 'undefined' || _userid === null || _userid === undefined){
   
    const modal = this.modalCtrl.create('UserLoginPage', {page : 'DeliveryTrackingPage'});
    modal.present();

    }else{
     let loader = this.loading.create({
    content: 'Loading Delivery Tracking..',
    spinner: 'crescent'
  });
  loader.present();
  var _userid = localStorage.getItem("userid");
  console.log ('trackeruse', _userid);

       let url = RunningmanConfig.hosturl + 'API/mobile/loadusertracker';
          this.http.post(url, {userid: _userid}).subscribe((data: any) => {
        console.log('Data', data);
         console.log(data.items);
         this.transactiondata  = data.items;
     
          var i;
          for (i = 0; i < this.transactiondata.length; i++) {
            console.log('Trans Data 2', this.transactiondata[i]);
            var x;
            for (x = 0; x < this.transactiondata[i].task.length; x++) {
              console.log('Trans Data 2', this.transactiondata[i].task[x]);
              var status = this.transactiondata[i].task[x].status;
              var remarks= this.transactiondata[i].task[x].remarks;
              var paymentmode = this.transactiondata[i].payment.mode;
              var message;
              var paymentmessage;
              var paymentcolor;
              var isdelivered=false;
              if (status=='0') {message='Order Success';}
              else if(status=='1') {message='Preparing Order';}
              else if(status=='2') {message='Preparation Completed';}
              else if(status=='3') {message='Pick Up Success';}
              else if(status=='4') {message='Delivery Man Is On The Way!';}
              else if(status=='5') {message='Order Delivered'; isdelivered= true;}
              else if(status=='10') {message='Order Declined';} 

              this.transactiondata[i].task[x].statusmessage = message;
              console.log('mode', paymentmode);
               if (paymentmode=='cash' && isdelivered==false)
                {
                paymentmessage = 'Pending Payment';
                paymentcolor = 'orange';
                }
                else if (paymentmode !='cash' && status=='10' )
                {
                paymentmessage =  'Error in Payment';
                paymentcolor = 'orange';
                } else
                  {
                  paymentmessage ='Paid';
                  paymentcolor = 'secondary'
                  } 
            this.transactiondata[i].paymentmessage = paymentmessage;
            this.transactiondata[i].paymentcolor= paymentcolor;


            }
            console.log('Final',this.transactiondata );

          }
            
            loader.dismiss();
          }, error => {
            console.error('Error: ' + error);
            loader.dismiss();

          }); 



    }
}

 gotoItemDetails(transactionid) {
    /*this.navCtrl.setRoot('FoodItemDetailsPage', { dishid: dishid });*/
    console.log('TransID',transactionid);
    const modal = this.modalCtrl.create('DeliveryDetailsPage', { transactionid: transactionid });
    modal.present();
  }

}


 /* loadmap() {
    let user1Latlng = new google.maps.LatLng(23.7554464, 90.3856283);
    let user2Latlng = new google.maps.LatLng(23.7636971, 90.3706906);

    // Define Direction Service
    let directionsService = new google.maps.DirectionsService;

    let lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      scale: 3
    };
    let polylineOptionsActual = new google.maps.Polyline({
      strokeColor: '#d0330f',
      strokeWeight: 5,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '10px'
      }],
      strokeOpacity: 0,
      fillOpacity: 0,
    });


    let directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true, polylineOptions: polylineOptionsActual });


    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 5,
      center: user1Latlng,
      styles: MapStyle
    });

    directionsDisplay.setMap(this.map);

    let icons = {
      start: {
        icon: 'assets/imgs/user1.png',
        name: 'Sinthia'
      },
      end: {
        icon: 'assets/imgs/user2.png',
        name: 'Mark'
      }
    };

    this.addMarker(user1Latlng, icons.start, 'start');
    this.addMarker(user2Latlng, icons.end, 'end');

    directionsService.route({
      origin: user1Latlng,
      destination: user2Latlng,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  addMarker(latlng, info, title) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      icon: info.icon,
      title: title,
      position: latlng
    });
    let content = info.name;
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    infoWindow.open(this.map, marker);
  }*/

