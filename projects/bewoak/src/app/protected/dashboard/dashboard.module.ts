import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ManageCoursesModule } from './manage-courses/manage-courses.module';
import { DashboardRoutingModule } from './dashboard-routing.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    ManageCoursesModule
  ]
})
export class DashboardModule { }
