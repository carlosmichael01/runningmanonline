/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Second Landing page
 * File path - '../../../../src/pages/second-landing/second-landing'
 */


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { RunningmanConfig } from '../../assets/config/runningman';
import { UserData } from '../../assets/config/user-data';

@IonicPage()
@Component({
  selector: 'page-second-landing',
  templateUrl: 'second-landing.html',
})
export class SecondLandingPage {

  languages: any;
  deliverystate: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private menu: MenuController,
    private http: HttpClient,
    public platform: Platform,
    public userData: UserData,
    public loading: LoadingController,
    public translateService: TranslateService) {
    this.menu.enable(false); // Disable sidemenu
  }

  /** Do any initialization */
  ngOnInit() {
        this.getCartItem();
    this.getAllLocation();

  }

  /**
   * -------------------------------------------------------------------
   * Get All Languages
   * -------------------------------------------------------------------
   * @method getAllLanguages
   */
  getAllLanguages() {
    this.http.get('assets/i18n/en.json').subscribe((languages: any) => {
      this.languages = languages.LANGUAGES;
       console.log(this.languages);
    }, error => {
      console.error('Error: ' + error);
    });
  }

getAllLocation() {

 let loader = this.loading.create({
    content: 'Loading City',
    spinner: 'crescent'
  });
loader.present().then(() => {
    let url = RunningmanConfig.hosturl + 'deliverystate';
    this.http.post(url, {}).subscribe((deliverystate: any) => {
      this.deliverystate = deliverystate.location;
      console.log(this.deliverystate);
      console.log(this.deliverystate[0].name);
        loader.dismiss();
    }, error => {
      console.error('Error: ' + error);
        loader.dismiss();
    });
    
  });
  }

  /**
   * -------------------------------------------------------------------
   * Choose Language
   * -------------------------------------------------------------------
   * @method chooseLanguage
   * @param language      Selected Language
   * 
   * When language code 'ar' then the platform direction will be 'rtl' otherwise platform direction 'ltr' 
   */
  chooseLanguage(language) {
    if (language === 'ar') {
      this.platform.setDir('rtl', true);
      this.translateService.setDefaultLang(language);
    } else {
      this.platform.setDir('ltr', true);
      this.translateService.setDefaultLang(language);
    }
  }

chooseLocation(location){
  console.log("Selected:",location);
}

  /**
   * -------------------------------------------------------------------
   * Go To User Information Page
   * -------------------------------------------------------------------
   * @method gotoUserInfoPage     This function goto user information page and collect user Info's from user.
   */
  gotoUserInfoPage() {
    this.navCtrl.setRoot('UserInformationPage');
  }
gotoRestaurantPage(state) {

/*localStorage.clear();*/

  localStorage.setItem("city", state);
  this.navCtrl.setRoot('FoodCategoriesPage', {deliverystate : this.deliverystate});

   
  }
  getCartItem(){
     console.log('getting cart...');
     var _userid =  localStorage.getItem("userid");
  if (_userid === 'undefined' || _userid === null || _userid === undefined){
    this.userData.setCartCount("0");
    console.log('your cart empty');
  }else{
        let url = RunningmanConfig.hosturl + 'LoadMobileCart';
                  this.http.post(url, {userid:_userid}).subscribe((data: any) => {
                    console.log('your cart', data.carts)
                if (data.carts != null){ 
                  this.userData.setCartCount(data.carts.orders.length);
                  // localStorage.setItem("cartitem", data.carts.orders.length);
                } else {this.userData.setCartCount("0"); }                 
              }); 
  
}
  }
}
