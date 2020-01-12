import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../../shared/models/course';

@Component({
  selector: 'bw-search-course',
  templateUrl: './search-course.component.html',
  styleUrls: ['./search-course.component.scss']
})
export class SearchCourseComponent implements OnInit {
  @Input()
  public course: Course;

  constructor() { }

  ngOnInit() {
  }

}
