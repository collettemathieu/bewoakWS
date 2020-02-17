import { NgModule } from '@angular/core';

import { EditCourseRoutingModule } from './edit-course-routing.module';
import { EditCourseComponent } from './edit-course.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ManageArticlesModule } from '../../manage-articles/manage-articles.module';
import { PlusDotsComponent } from '../shared/plus-dots/plus-dots.component';


@NgModule({
  declarations: [EditCourseComponent, PlusDotsComponent],
  imports: [
    SharedModule,
    EditCourseRoutingModule,
    ManageArticlesModule
  ]
})
export class EditCourseModule { }
