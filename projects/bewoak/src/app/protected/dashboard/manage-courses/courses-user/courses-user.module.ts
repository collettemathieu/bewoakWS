import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesUserComponent } from './courses-user.component';
import { CourseUserComponent } from './course-user/course-user.component';
import { RemoveCourseComponent } from './remove-course/remove-course.component';



@NgModule({
  declarations: [CoursesUserComponent, CourseUserComponent, RemoveCourseComponent],
  imports: [
    CommonModule
  ],
  exports: [
    CoursesUserComponent
  ]
})
export class CoursesUserModule { }
