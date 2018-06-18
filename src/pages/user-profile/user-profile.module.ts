import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from './user-profile';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UserProfilePage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(UserProfilePage),
  ],
})
export class UserProfilePageModule { }
