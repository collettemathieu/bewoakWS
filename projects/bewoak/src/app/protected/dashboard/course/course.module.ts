import { NgModule } from '@angular/core';

import { CourseRoutingModule } from './course-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { SharedModule } from '../../../shared/shared.module';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';
import { AddCourseFormComponent } from './add-course-form/add-course-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AddCourseComponent, AddCourseModalComponent, AddCourseFormComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    CourseRoutingModule
  ],
  exports: [AddCourseComponent],
  entryComponents: [AddCourseModalComponent]
})
export class CourseModule { }
