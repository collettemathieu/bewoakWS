import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Course } from '../../../../shared/models/course';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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

  public modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  /**
   * Ouverture de la fenêtre modale de confirmation de suppression du parcours
   * @param template Le template de la fenêtre modale
   */
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * Abandon de la suppression du parcours pédagogique
   */
  public decline(): void {
    this.modalRef.hide();
  }

  /**
   * Suppression du parcours pédagogique
   */
  public remove(): void {
    this.modalRef.hide();
    this.removeCourse.emit(this.course);
  }

}
