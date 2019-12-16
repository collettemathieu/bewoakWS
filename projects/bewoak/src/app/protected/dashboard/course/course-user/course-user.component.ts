import { Component, OnInit, Input } from '@angular/core';
import { Course } from 'projects/bewoak/src/app/shared/models/course';

@Component({
  selector: 'bw-course-user',
  templateUrl: './course-user.component.html',
  styleUrls: ['./course-user.component.scss']
})
export class CourseUserComponent implements OnInit {

  @Input()
  course: Course;

  constructor() { }

  ngOnInit() {
  }

}
