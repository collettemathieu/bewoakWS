import { Injectable } from '@angular/core';
import { Course } from '../../../shared/models/course';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private httpClient: HttpClient, private errorService: ErrorService) { }

  /**
   * Enregistrer un nouveau parcours pédagogique
   * @param course Le parcours pédagogique
   */
  save(course: Course): Observable<Course | null> {
    const url = `${environment.firestore.baseUrlDocument}courses?key=${environment.firebase.apiKey}`;
    const dataCourse = this.getDataCourseForFirestore(course);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<Course>(url, dataCourse, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getCourseFromFirestore(data.fields));
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      })
    );
  }

  /**
   * Retourne les données du parcours pour le firestore
   * @param course Le parcours pédagogique
   */
  private getDataCourseForFirestore(course: Course): object {
    return {
      fields: {
        id: { stringValue: course.id },
        name: { stringValue: course.name },
        url: { stringValue: course.url },
        like: { integerValue: course.like },
        level: { stringValue: course.level },
        userId: { stringValue: course.userId }
      }
    };
  }

  /**
   * Méthode pour la transformation des données du firestore vers le parcours pédagogique
   * @param fields Champs retournés par le firestore
   * @return Un parcours pédagogique avec les données de firestore
   */
  private getCourseFromFirestore(fields: any): Course {
    return new Course({
      id: fields.id.stringValue,
      name: fields.name.stringValue,
      url: fields.url.stringValue,
      like: fields.like.integerValue,
      level: fields.level.stringValue,
      userId: fields.userId.stringValue
    });
  }
}
