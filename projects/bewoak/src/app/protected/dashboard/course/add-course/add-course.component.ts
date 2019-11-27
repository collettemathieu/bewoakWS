import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bw-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /**
   * Ajout d'un nouveau parcours
   */
  addCourse() {
    alert('ici');
  }

}
