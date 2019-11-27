import { NgModule } from '@angular/core';

import { CourseRoutingModule } from './course-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [AddCourseComponent],
  imports: [
    SharedModule,
    CourseRoutingModule
  ],
  exports: [AddCourseComponent]
})
export class CourseModule { }
