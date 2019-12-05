import { Injectable } from '@angular/core';
import { Course } from '../../../shared/models/course';
import { Observable, BehaviorSubject } from 'rxjs';
import { CourseService } from './course.service';
import { ToastrService } from '../toastr.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { ErrorService } from '../error.service';
import { LoaderService } from '../loader.service';

@Injectable()
export class CourseStateService {

  private courses: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  public readonly courses$: Observable<Course[]> = this.courses.asObservable();


  constructor(
    private courseService: CourseService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private errorService: ErrorService
  ) { }

  /**
   * Ajout un nouveau parcours pédagogique
   * @param course Le parcours pédagogique
   * @return Retourne le tableau des parcours pédagogiques de l'utilisateur mis à jour
   */
  register(course: Course): Observable<Course> {

    this.loaderService.setLoading(true);

    return this.courseService.save(course).pipe(
      tap(newCourse => {
        const courses = this.courses.value;
        courses.push(newCourse);
        this.courses.next(courses);
      }),
      tap(_ => {
        // Envoi d'un message à l'utilisateur
        this.toastrService.showMessage({
          type: 'success',
          message: 'Le parcours pédagogique a bien été enregistré'
        });
        // Fin mise en attente
        this.loaderService.setLoading(false);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => {
        // Fin mise en attente
        this.loaderService.setLoading(false);
      })
    );
  }

  /**
   * Retourne les parcours pédagogiques de l'utilisateur
   * @param userId L'identifiant de l'utilisateur
   */
  getCourses(userId: string): Observable<Course[]>{
    return this.courseService.getCourses(userId).pipe(
      tap( courses => {
        this.courses.next(courses);
      })
    );
  }
  
}
