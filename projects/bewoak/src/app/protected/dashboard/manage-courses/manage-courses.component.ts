import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user';
import { AuthService } from '../../../core/services/auth.service';
import { CoursesStateUserService } from '../../../core/services/course/courses-state-user.service';
import { CourseStateService } from '../../../core/services/course/course-state.service';

@Component({
  selector: 'bw-course',
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.scss']
})
export class ManageCoursesComponent implements OnInit {

  private user: User;

  constructor(
    private authService: AuthService,
    private coursesStateUserService: CoursesStateUserService,
    private courseStateService: CourseStateService
  ) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.coursesStateUserService.getCoursesByUser(this.user.id).subscribe();
    this.courseStateService.resetCourse();
  }

}
