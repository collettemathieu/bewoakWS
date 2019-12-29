import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from '../../../shared/models/course';
import { CourseService } from './course.service';
import { LoaderService } from '../loader.service';
import { ErrorService } from '../error.service';
import { tap, catchError, finalize } from 'rxjs/operators';

@Injectable()
export class CourseStateService {

  private course$: BehaviorSubject<Course | null> = new BehaviorSubject(null);
  public readonly course: Observable<Course | null> = this.course$.asObservable();

  constructor(
    private courseService: CourseService,
    private loaderService: LoaderService,
    private errorService: ErrorService

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
      tap(course => this.course$.next(course)),
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
    return this.course$.getValue();
  }

  /**
   * Annule l'état du parcours courant
   */
  public resetCourse(): void {
    this.course$.next(null);
  }

}
