import { NgModule } from '@angular/core';
import { ArticleFormComponent } from './article-form/article-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CourseModule } from './course/course.module';


@NgModule({
  declarations: [ArticleFormComponent, DashboardComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    CourseModule
  ]
})
export class DashboardModule { }
