import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryTrackingPage } from './delivery-tracking';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DeliveryTrackingPage,
  ],
  imports: [
    TranslateModule, IonicPageModule.forChild(DeliveryTrackingPage),
  ],
})
export class DeliveryTrackingPageModule { }
