import { NgModule } from '@angular/core';

import { ProtectedRoutingModule } from './protected-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProtectedComponent } from './protected.component';
import { SettingsModule } from './settings/settings.module';


@NgModule({
  declarations: [ProtectedComponent],
  imports: [
    SharedModule,
    ProtectedRoutingModule,
    SettingsModule,
    DashboardModule
  ]
})
export class ProtectedModule { }
