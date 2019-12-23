import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/models/user';
import { AuthService } from '../../../../core/services/auth.service';
import { CourseStateUserService } from '../../../../core/services/course/course-state-user.service';

@Component({
  selector: 'bw-course',
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.scss']
})
export class ManageCoursesComponent implements OnInit {

  private user: User;

  constructor(private authService: AuthService, private courseStateUser: CourseStateUserService) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.courseStateUser.getCoursesByUser(this.user.id).subscribe();
  }

}
