import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CourseModule } from './course/course.module';
import { CourseService } from '../../core/services/course/course.service';
import { CourseStateUserService } from '../../core/services/course/course-state-user.service';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    CourseModule
  ],
  providers: [CourseService, CourseStateUserService]
})
export class DashboardModule { }
