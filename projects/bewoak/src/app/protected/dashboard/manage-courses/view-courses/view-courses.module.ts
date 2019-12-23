import { NgModule } from '@angular/core';
import { CoursesUserComponent } from './courses-user/courses-user.component';
import { CourseUserComponent } from './course-user/course-user.component';
import { SharedModule } from 'projects/bewoak/src/app/shared/shared.module';



@NgModule({
  declarations: [CoursesUserComponent, CourseUserComponent],
  imports: [
    SharedModule
  ],
  exports: [CoursesUserComponent]
})
export class ViewCoursesModule { }
