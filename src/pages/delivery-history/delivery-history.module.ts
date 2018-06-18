import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryHistoryPage } from './delivery-history';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DeliveryHistoryPage,
  ],
  imports: [
    TranslateModule, IonicPageModule.forChild(DeliveryHistoryPage),
  ],
})
export class DeliveryHistoryPageModule { }
