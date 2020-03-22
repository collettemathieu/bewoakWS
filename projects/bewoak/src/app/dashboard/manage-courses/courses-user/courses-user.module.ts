import { NgModule } from '@angular/core';
import { CoursesUserComponent } from './courses-user.component';
import { CourseUserComponent } from './course-user/course-user.component';
import { RemoveCourseComponent } from './remove-course/remove-course.component';
import { SharedModule } from 'projects/bewoak/src/app/shared/shared.module';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { ManageArticlesModule } from '../../manage-articles/manage-articles.module';
import { PlusDotsComponent } from '../shared/plus-dots/plus-dots.component';



@NgModule({
  declarations: [CoursesUserComponent, CourseUserComponent, RemoveCourseComponent, EditCourseComponent, PlusDotsComponent],
  imports: [
    SharedModule,
    ManageArticlesModule
  ],
  exports: [
    CoursesUserComponent
  ]
})
export class CoursesUserModule { }
