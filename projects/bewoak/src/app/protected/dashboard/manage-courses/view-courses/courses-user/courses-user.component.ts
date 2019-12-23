import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../../../../shared/models/course';
import { CourseStateUserService } from '../../../../../core/services/course/course-state-user.service';

@Component({
  selector: 'bw-courses-user',
  templateUrl: './courses-user.component.html',
  styleUrls: ['./courses-user.component.scss']
})
export class CoursesUserComponent implements OnInit {

  public courses$: Observable<Course[]>;

  constructor(private courseStateUser: CourseStateUserService) { }

  ngOnInit() {
    this.courses$ = this.courseStateUser.coursesByUser$;
  }

  public remove(course: Course): void {
    this.courseStateUser.removeCourse(course);
  }

}
