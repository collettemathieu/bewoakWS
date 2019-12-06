import { NgModule } from '@angular/core';

import { CourseRoutingModule } from './course-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { SharedModule } from '../../../shared/shared.module';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';
import { AddCourseFormComponent } from './add-course-form/add-course-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowCoursesUserComponent } from './show-courses-user/show-courses-user.component';


@NgModule({
  declarations: [AddCourseComponent, AddCourseModalComponent, AddCourseFormComponent, ShowCoursesUserComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    CourseRoutingModule
  ],
  exports: [AddCourseComponent, ShowCoursesUserComponent],
  entryComponents: [AddCourseModalComponent]
})
export class CourseModule { }
