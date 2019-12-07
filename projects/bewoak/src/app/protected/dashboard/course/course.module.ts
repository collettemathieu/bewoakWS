import { NgModule } from '@angular/core';

import { CourseRoutingModule } from './course-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { SharedModule } from '../../../shared/shared.module';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';
import { AddCourseFormComponent } from './add-course-form/add-course-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowCoursesUserComponent } from './show-courses-user/show-courses-user.component';
import { CourseComponent } from './course/course.component';
import { CourseService } from '../../../core/services/course/course.service';
import { CourseStateUserService } from '../../../core/services/course/course-state-user.service';


@NgModule({
  declarations: [AddCourseComponent, AddCourseModalComponent, AddCourseFormComponent, ShowCoursesUserComponent, CourseComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    CourseRoutingModule
  ],
  providers: [CourseService, CourseStateUserService],
  entryComponents: [AddCourseModalComponent]
})
export class CourseModule { }
