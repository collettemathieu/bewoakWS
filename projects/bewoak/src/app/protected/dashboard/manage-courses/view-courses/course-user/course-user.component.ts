import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Course } from '../../../../../shared/models/course';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

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

  constructor(
    private modalService: BsModalService,
    private router: Router,
  ) { }

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
   * Redirection vers la page d'édition du parcours pédagogique.
   */
  public edit(): void {
    this.router.navigate(['dashboard/editCourse', this.course.id]);
  }

  /**
   * Suppression du parcours pédagogique
   */
  public remove(): void {
    this.modalRef.hide();
    this.removeCourse.emit(this.course);
  }

}
