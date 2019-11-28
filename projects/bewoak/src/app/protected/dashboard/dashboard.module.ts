import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CourseModule } from './course/course.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    CourseModule
  ]
})
export class DashboardModule { }
