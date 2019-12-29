import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Course } from '../../../../../shared/models/course';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CourseStateService } from 'projects/bewoak/src/app/core/services/course/course-state.service';
import { ToastrService } from 'projects/bewoak/src/app/core/services/toastr.service';

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
    private courseStateService: CourseStateService,
    private toastrService: ToastrService
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
   * Avant la redirection, on charge l'état du parcours via
   * le service.
   */
  public edit(): void {
    this.courseStateService.getCourse(this.course.id).subscribe(
      _ => this.router.navigate(['dashboard/editCourse', this.course.id]),
      _ => this.toastrService.showMessage(
        {
          type: 'danger',
          message: 'Une erreur inconnue est survenue.'
        }
      )
    );

  }

  /**
   * Suppression du parcours pédagogique
   */
  public remove(): void {
    this.modalRef.hide();
    this.removeCourse.emit(this.course);
  }

}
