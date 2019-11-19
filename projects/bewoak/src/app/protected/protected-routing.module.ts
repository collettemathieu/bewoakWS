import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedComponent } from './protected.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleExpertGuard } from '../core/guards/role-expert.guard';
import { RoleUserGuard } from '../core/guards/role-user.guard';
import { SettingsComponent } from './settings/settings/settings.component';
import { ProfileComponent } from './settings/profile/profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AccountComponent } from './settings/account/account/account.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: ProtectedComponent,
    canActivate: [AuthGuard, RoleExpertGuard],
    canActivateChild: [AuthGuard, RoleExpertGuard],
    children: [
      { path: 'addCourse', component: DashboardComponent }
    ]
  },
  {
    path: 'settings',
    component: ProtectedComponent,
    canActivate: [AuthGuard, RoleUserGuard],
    canActivateChild: [AuthGuard, RoleUserGuard],
    children: [
      {
        path: '',
        component: SettingsComponent,
        children: [
          { path: 'profile', component: ProfileComponent },
          { path: 'account', component: AccountComponent }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
