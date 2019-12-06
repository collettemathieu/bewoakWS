import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user';
import { CourseStateUserService } from '../../../core/services/course/course-state-user.service';

@Component({
  selector: 'bw-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  private user: User;

  constructor(private authService: AuthService, private courseStateUser: CourseStateUserService) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.courseStateUser.getCoursesByUser(this.user.id).subscribe();
  }

}
