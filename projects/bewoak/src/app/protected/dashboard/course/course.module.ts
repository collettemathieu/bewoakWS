import { NgModule } from '@angular/core';

import { CourseRoutingModule } from './course-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { SharedModule } from '../../../shared/shared.module';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';


@NgModule({
  declarations: [AddCourseComponent, AddCourseModalComponent],
  imports: [
    SharedModule,
    CourseRoutingModule
  ],
  exports: [AddCourseComponent],
  entryComponents: [AddCourseModalComponent]
})
export class CourseModule { }
