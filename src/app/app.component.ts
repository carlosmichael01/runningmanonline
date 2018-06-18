import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { App } from 'ionic-angular/components/app/app';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'FirstLandingPage';

  pages: Array<{ title: string, component: any, leftIcon: string }>;
  

  constructor(public platform: Platform, public app: App , public statusBar: StatusBar,
    public splashScreen: SplashScreen, public translateService: TranslateService,
    public http: HttpClient) {
    this.initializeApp();
    // Default Language
    translateService.setDefaultLang('en');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
     /* this.platform.registerBackButtonAction(() => {
            app.navPop();
        });*/
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getSidebarList();

      // Show Video Ad After 2 Minutes
     /* setInterval(() => {
        this.prepareAdmobVideo();
      }, 120000); */

      // Show Interstitial Ad After 1 Minutes
     /* setInterval(() => {
        this.prepareInterstitial();
      }, 60000); */
    });
  }

  /**
   * --------------------------------------------------------------
   * Get Sidebar List
   * --------------------------------------------------------------
   */
  getSidebarList() {

   /*  var _userid =  localStorage.getItem("userid");
    
    if (_userid === undefined || _userid === 'undefined' || _userid === null){
        _userid = '';
    }
    console.log('UserID Check MAIN', _userid);*/
    this.http.get('assets/i18n/en.json').subscribe((data: any) => {
    this.pages = data.SIDEBAR_List;

   /* if (_userid != ''){
    var i;
    for (i = 0; i < data.SIDEBAR_List.length; i++) {
        
        if ( data.SIDEBAR_List[i].NAME === 'Log-in'){
          console.log (data.SIDEBAR_List[i].NAME);
          data.SIDEBAR_List[i].NAME = "Log-out";
          data.SIDEBAR_List[i].ICON = 'log-out';
        }
    }
    }
    this.pages = data.SIDEBAR_List;

console.log (this.pages);*/

    }, error => {
      console.error(error);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page);
  }

  /**
   * Prepare and show admob Video ad
   */
 /* prepareAdmobVideo() {
    this.admobFree.prepareAdmobVideo();
  }*/

  /**
   * Prepare and show admob Interstitial Ad
   */
 /* prepareInterstitial() {
    this.admobFree.prepareInterstitial();
  }*/
}