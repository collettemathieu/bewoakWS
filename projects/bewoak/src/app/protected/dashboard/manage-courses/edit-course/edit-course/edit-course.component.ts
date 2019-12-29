import { Component, OnInit } from '@angular/core';
import { CourseStateService } from '../../../../../core/services/course/course-state.service';
import { Observable } from 'rxjs';
import { Course } from 'projects/bewoak/src/app/shared/models/course';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddCourseModalComponent } from '../../shared/add-course-modal/add-course-modal.component';

@Component({
  selector: 'bw-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  public course$: Observable<Course | null>;
  public bsModelRef: BsModalRef;

  constructor(private courseStateService: CourseStateService, private modalService: BsModalService) { }

  ngOnInit() {
    // On s'abonne à l'état du parcours demandé
    this.course$ = this.courseStateService.course;

  }

  public editCourse() {
    this.bsModelRef = this.modalService.show(AddCourseModalComponent, { class: 'modal-lg' });
  }

}
