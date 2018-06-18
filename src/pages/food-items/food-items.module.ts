import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodItemsPage } from './food-items';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FoodItemsPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(FoodItemsPage),
  ],
})
export class FoodItemsPageModule { }
