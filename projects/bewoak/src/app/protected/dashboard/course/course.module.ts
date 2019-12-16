import { NgModule, LOCALE_ID } from '@angular/core';
import localeFr from '@angular/common/locales/fr';

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
import { registerLocaleData } from '@angular/common';
import { CourseUserComponent } from './course-user/course-user.component';
registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [AddCourseComponent, AddCourseModalComponent, AddCourseFormComponent, ShowCoursesUserComponent, CourseComponent, CourseUserComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    CourseRoutingModule
  ],
  providers: [CourseService, CourseStateUserService, { provide: LOCALE_ID, useValue: 'fr-FR' }],
  entryComponents: [AddCourseModalComponent]
})
export class CourseModule { }
