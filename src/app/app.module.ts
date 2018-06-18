import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MyApp } from './app.component';
import { AdMobFree } from '@ionic-native/admob-free';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { AdmobFreeProvider } from '../providers/admob-free/admob-free';
import { UserData } from '../assets/config/user-data';
import { IonicStorageModule } from '@ionic/storage';

// By default TranslateLoader will look for translation json files in i18n/
// So change this lool in the src/assets directory.
export function TranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'overlay'
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (TranslateLoaderFactory),
        deps: [HttpClient]
      }
    }),
     IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AdMobFree,
    Geolocation,
    UserData,
    AdmobFreeProvider
  ]
})
export class AppModule { }
