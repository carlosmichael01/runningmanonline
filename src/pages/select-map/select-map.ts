/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Food Category Item page
 * File path - '../../../../src/pages/food-category-items/food-category-items'
 */

import { Component, NgZone, ViewChild, ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, LoadingController , ActionSheetController, AlertController, App,  Platform, ToastController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

declare var google: any;
declare var MarkerClusterer: any;
var mapmarkers = [];

@IonicPage()
@Component({
  selector: 'page-select-map',
  templateUrl: 'select-map.html',
})
export class SelectMapPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;

  listSearch: string = '';

  map: any;
  marker: any;
  loading: any;
  search: boolean = false;
  error: any;
  switch: string = "map";
  regionals: any = [];
  currentregional: any;
  curlat: any;
  curlng:any;
  shopdata:any;
  selplace:any;
  ismapselect : boolean = false;
  sel_address:any;
  place_id:any;
  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public app: App,
    public nav: NavController,
    public zone: NgZone,
    public platform: Platform,
    public alertCtrl: AlertController,
    public storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public geolocation: Geolocation) {

  }

  /***
   * --------------------------------------------------------------
   * Lifecycle Event - ionViewDidLoad()
   * --------------------------------------------------------------
   * 
   * Fired when the page has loaded
   */

   ionViewDidLoad() {
    this.curlat=  3.146642;
    this.curlng=  101.695845;

   
    this.loadMaps();
    this.getNavParamsData();
    


  }

  viewPlace(id) {
    console.log('Clicked Marker', id);
  }


  loadMaps() {
    if (!!google) {
      this.initializeMap();
      this.initAutocomplete();
    } else {
      this.errorAlert('Error', 'Something went wrong with the Internet Connection. Please check your Internet.')
    }
  }

 initializeMap() {

   console.log ('Initializa Lat', this.curlat);
   console.log ('Initialize Lng', this.curlng);
  let latLng = new google.maps.LatLng(this.curlat, this.curlng);
  var mapEle = this.mapElement.nativeElement;
    let mapOptions = {
      center: latLng,
      zoom: 12,
      styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }],
       disableDoubleClickZoom: false,
      disableDefaultUI: true,
      zoomControl: true,
      scaleControl: true,
    }
    console.log('Initial map', latLng);
    this.map = new google.maps.Map(mapEle, mapOptions);
    this.addMarker(latLng, 'Initial');

  }

   getCurrentPosition() {
    this.loading = this.loadingCtrl.create({
      content: 'Searching Location ...'
    });
    this.loading.present();
    
    let locationOptions = { timeout: 10000, enableHighAccuracy: true };

    this.geolocation.getCurrentPosition(locationOptions).then(
      (position) => {
        this.loading.dismiss().then(() => {
          this.showToast('Location found!');
           localStorage.setItem("SelAddress", null);
          console.log(position);
          this.curlat = position.coords.latitude;
          this.curlng = position.coords.longitude;
          let myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          let options = {
            center: myPos,
            zoom: 15
          };
          this.map.setOptions(options);
          this.addMarker(myPos, "Your current location!");
          this.ismapselect= true;

        });
      },
      (error) => {
        this.loading.dismiss().then(() => {
          this.showToast('Cannot detect your current location!');

          console.log(error);
        });
      }
    )
  }

  errorAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.loadMaps();
          }
        }
      ]
    });
    alert.present();
  }

  mapsSearchBar(ev: any) {
    // set input to the value of the searchbar
    //this.search = ev.target.value;
    console.log(ev);
    const autocomplete = new google.maps.places.Autocomplete(ev);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          localStorage.setItem("SelAddress", place.formatted_address);
              //         console.log ("SelLat", place.geometry.location.lat());
              //  console.log("SelLng", place.geometry.location.lng());
               localStorage.setItem("SelLat", place.geometry.location.lat());
               localStorage.setItem("SelLng", place.geometry.location.lng());
          this.ismapselect= true;
          sub.next(place.geometry.location);
          sub.complete();
        }
      });
    });
  }

  initAutocomplete(): void {
    // reference : https://github.com/driftyco/ionic/issues/7223
    this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
    this.createAutocomplete(this.addressElement).subscribe((location) => {
       let options = {
        center: location,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map.setOptions(options);
      this.addMarker(location, "Search result");
      this.ismapselect= true;
    });
  }

  createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          localStorage.setItem("SelAddress", place.formatted_address);
            // console.log ("SelLat", place.geometry.location.lat());
            //    console.log("SelLng", place.geometry.location.lng());
               localStorage.setItem("SelLat", place.geometry.location.lat());
               localStorage.setItem("SelLng", place.geometry.location.lng());
          this.ismapselect= true;
          sub.next(place.geometry.location);
          //sub.complete();
        }
      });
    });
  }


  addMarker(position, content) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position
    });
    

    for (var i = 0; i < mapmarkers.length; i++) {
          mapmarkers[i].setMap(null);
    }
  
    mapmarkers.push (marker);
    if (content != 'Initial'){
    var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': position}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
        
              var _savedaddress =  localStorage.getItem("SelAddress");
              
              if (_savedaddress === undefined || _savedaddress === 'null' || _savedaddress === 'undefined') {
               this.sel_address = results[0].formatted_address;
               localStorage.setItem("SelAddress", this.sel_address);
              // console.log ("SelLat", results[0].geometry.location.lat());
              //  console.log("SelLng", results[0].geometry.location.lng());
               localStorage.setItem("SelLat", results[0].geometry.location.lat());
               localStorage.setItem("SelLng", results[0].geometry.location.lng());
              }else{
                this.sel_address = _savedaddress;
              }

              content = this.sel_address;
               let infoWindow = new google.maps.InfoWindow({
                content: content,
                maxWidth: 200
              });
              infoWindow.open(this.map, marker);

              google.maps.event.addListener(marker, 'click', () => {
                infoWindow.open(this.map, marker);
              });
              
              for (var ac = 0; ac < results[0].address_components.length; ac++) {
                var component = results[0].address_components[ac];
                if(component.types.includes('locality')) {
                      localStorage.setItem("SelCity", component.long_name);
                } else if (component.types.includes('postal_code')) {
                      localStorage.setItem("SelZipCode", component.long_name);
                }  
              };

            } else {
             this.showToast('No results found');
            }
          } else {
            this.showToast('Location found!');('Geocoder failed due to: ' + status);
          }
        });
}
    

    /*this.addInfoWindow(marker, content);*/
    return marker;
  }




  //Center zoom
  //http://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers
  bounceMap(markers) {
    let bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].getPosition());
    }

    this.map.fitBounds(bounds);
  }

  resizeMap() {
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 200);
  }

  getCurrentPositionfromStorage(markers) {
    this.storage.get('lastLocation').then((result) => {
      if (result) {
        let myPos = new google.maps.LatLng(result.lat, result.long);
        this.map.setOptions({
          center: myPos,
          zoom: 14
        });
        let marker = this.addMarker(myPos, "My last saved Location: " + result.location);

        markers.push(marker);
        this.bounceMap(markers);

        this.resizeMap();
      }
    });
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  choosePosition() {
    this.storage.get('lastLocation').then((result) => {
      if (result) {
        let actionSheet = this.actionSheetCtrl.create({
          title: 'Last Location: ' + result.location,
          buttons: [
            {
              text: 'Reload',
              handler: () => {
                this.getCurrentPosition();
              }
            },
            {
              text: 'Delete',
              handler: () => {
                this.storage.set('lastLocation', null);
                this.showToast('Location deleted!');
                this.initializeMap();
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });
        actionSheet.present();
      } else {
        this.getCurrentPosition();

      }
    });
  }

  // go show currrent location
 

  toggleSearch() {
    if (this.search) {
      this.search = false;
    } else {
      this.search = true;
    }
  }




  /**
   * --------------------------------------------------------------
   * Get & Set data from NavParams
   * --------------------------------------------------------------
   */

addnewDeliveryLocation(){
  this.shopdata.delivery_lat = this.curlat;
  this.shopdata.delivery_lng = this.curlng;
  var latlng = {lat:  this.curlat, lng: this.curlng};
  var google_maps_geocoder = new google.maps.Geocoder();
    google_maps_geocoder.geocode(
    { 'location': latlng },
    function( results, status ) {
        console.log( 'Mike', results );
        this.sel_address = results[0].formatted_address;
    }
  );

  this.shopdata.delivery_address = this.sel_address;
  this.ismapselect = true;
  console.log (this.shopdata);
}

async getNavParamsData() {

  if (this.navParams.get('data')) {
      this.shopdata = this.navParams.get('data');
      this.shopdata.delivery_legend ='';
  var i;
    for (i = 0; i < this.shopdata.length; i++) {
      this.shopdata[i].delivery_location = '';
    }
console.log ('Initial Data', this.shopdata);
}
}


  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    infoWindow.open(this.map, marker);

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  gotoDeliveryConfirmPage() {
    console.log('Final Cart', this.shopdata);
    var address = localStorage.getItem("SelAddress");
    var city = localStorage.getItem("SelCity");
    var lat = localStorage.getItem("SelLat");
    var lng = localStorage.getItem("SelLng");
    var zipcode = localStorage.getItem("SelZipCode");
  let alert = this.alertCtrl.create({
            title: 'Confirm Location',
            message: 'Do you want to use this address? <br /> <b>' + address  + '</b>',
            buttons: [
              {
                text: 'Cancel'
              },
              {
                text: 'Yes',
                handler: data => {
                  
                  this.shopdata.carts.address.street = address;
                   this.shopdata.carts.address.city = city;
                  this.shopdata.carts.address.postcode  = zipcode;
                   this.shopdata.carts.coordinate.lat = lat;
                   this.shopdata.carts.coordinate.lng  = lng;
                   console.log(this.shopdata);
                 this.navCtrl.setRoot('DeliveryConfirmationPage',  { shopdata: this.shopdata });
                }
              }
            ]
          });
          alert.present();

  
  }



  dismiss() {
    this.navCtrl.setRoot('CartPage');
  }
}
