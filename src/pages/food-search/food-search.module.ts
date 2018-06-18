import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodSearchPage } from './food-search';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FoodSearchPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(FoodSearchPage),
  ],
})
export class FoodSearchPageModule { }
