import { NgModule } from '@angular/core';

import { SettingsRoutingModule } from './settings-routing.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from '../../shared/shared.module';
import { SettingsComponent } from './settings/settings.component';
import { NavbarSettingsComponent } from './navbar-settings/navbar-settings.component';
import { AccountModule } from './account/account.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtAuthInterceptorService } from '../../core/services/user/jwt-auth--interceptor.service';


@NgModule({
  declarations: [SettingsComponent, NavbarSettingsComponent],
  imports: [
    SharedModule,
    SettingsRoutingModule,
    ProfileModule,
    AccountModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtAuthInterceptorService, multi: true }
  ]
})
export class SettingsModule { }
