import { NgModule } from '@angular/core';

import { EditCourseRoutingModule } from './edit-course-routing.module';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { SharedModule } from 'projects/bewoak/src/app/shared/shared.module';


@NgModule({
  declarations: [EditCourseComponent],
  imports: [
    SharedModule,
    EditCourseRoutingModule
  ]
})
export class EditCourseModule { }
