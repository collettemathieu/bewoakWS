import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../../../../shared/models/course';

@Component({
  selector: 'bw-course-user',
  templateUrl: './course-user.component.html',
  styleUrls: ['./course-user.component.scss']
})
export class CourseUserComponent {

  @Input()
  course: Course;

  @Output()
  removeCourse: EventEmitter<Course> = new EventEmitter();

  /**
   * Suppression du parcours pédagogique
   */
  public remove(): void {
    this.removeCourse.emit(this.course);
  }

}
