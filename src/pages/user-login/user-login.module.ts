import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserLoginPage } from './user-login';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UserLoginPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(UserLoginPage),
  ],
})
export class UserLoginPageModule { }
