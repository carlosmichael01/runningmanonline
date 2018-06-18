import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectMapPage } from './select-map';
import { TranslateModule } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    SelectMapPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(SelectMapPage),
    IonicStorageModule.forRoot(),
  ],
})
export class SelectMapPageModule { }
