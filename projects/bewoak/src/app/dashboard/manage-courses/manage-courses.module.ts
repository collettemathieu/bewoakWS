import { NgModule, LOCALE_ID } from '@angular/core';
import localeFr from '@angular/common/locales/fr';

import { ManageCoursesRoutingModule } from './manage-courses-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { SharedModule } from '../../shared/shared.module';
import { AddCourseModalComponent } from './shared/add-course-modal/add-course-modal.component';
import { AddCourseFormComponent } from './shared/add-course-form/add-course-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageCoursesComponent } from './manage-courses.component';
import { CourseService } from '../../core/services/course/course.service';
import { CoursesStateUserService } from '../../core/services/course/courses-state-user.service';
import { registerLocaleData } from '@angular/common';
import { CourseStateService } from '../../core/services/course/course-state.service';
import { CoursesUserModule } from './courses-user/courses-user.module';
registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [AddCourseComponent, AddCourseModalComponent, AddCourseFormComponent, ManageCoursesComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    ManageCoursesRoutingModule,
    CoursesUserModule
  ],
  providers: [
    CourseService,
    CourseStateService,
    CoursesStateUserService,
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  entryComponents: [AddCourseModalComponent]
})
export class ManageCoursesModule { }
