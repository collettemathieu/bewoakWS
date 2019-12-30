import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from '../../../shared/models/course';
import { CourseService } from './course.service';
import { LoaderService } from '../loader.service';
import { ErrorService } from '../error.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { ToastrService } from '../toastr.service';

@Injectable()
export class CourseStateService {

  private course: BehaviorSubject<Course | null> = new BehaviorSubject(null);
  public readonly course$: Observable<Course | null> = this.course.asObservable();

  constructor(
    private courseService: CourseService,
    private loaderService: LoaderService,
    private errorService: ErrorService,
    private toastrService: ToastrService
  ) { }

  /**
   * Récupère le parcours pédagogique en fonction de son ID
   * @param id Id du parcours pédagogique
   * @return Une observable du parcours pédagogique
   */
  public getCourse(id: string): Observable<Course> {
    // Mise en attente
    this.loaderService.setLoading(true);

    return this.courseService.getCourse(id).pipe(
      tap(course => this.course.next(course)),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => {
        // Fin mise en attente
        this.loaderService.setLoading(false);
      })
    );
  }

  /**
   * Modifie un parcours pédagogique
   * @param course Le parcours pédagogique à modifier
   */
  public updateCourse(course: Course): Observable<Course> {

    // Mise en attente
    this.loaderService.setLoading(true);

    return this.courseService.update(course).pipe(
      tap(updatedCourse => {
        this.course.next(updatedCourse);
      }),
      tap(_ => {
        // Envoi d'un message à l'utilisateur
        this.toastrService.showMessage({
          type: 'success',
          message: 'Le parcours pédagogique a bien été modifié'
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => {
        // Fin mise en attente
        this.loaderService.setLoading(false);
      })
    );
  }

  /**
   * Retourne le parcours pédagogique courant
   */
  public getCurrentCourse(): Course {
    return this.course.getValue();
  }

  /**
   * Annule l'état du parcours courant
   */
  public resetCourse(): void {
    this.course.next(null);
  }

}
