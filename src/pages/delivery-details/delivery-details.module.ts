import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryDetailsPage } from './delivery-details';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DeliveryDetailsPage,
  ],
  imports: [
    TranslateModule, IonicPageModule.forChild(DeliveryDetailsPage),
  ],
})
export class DeliveryDetailsPageModule { }
