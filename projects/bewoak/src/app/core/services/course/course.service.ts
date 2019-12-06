import { Injectable } from '@angular/core';
import { Course } from '../../../shared/models/course';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { ErrorService } from '../error.service';

@Injectable()
export class CourseService {

  constructor(private httpClient: HttpClient, private errorService: ErrorService) { }

  /**
   * Enregistrer un nouveau parcours pédagogique
   * @param course Le parcours pédagogique
   */
  public save(course: Course): Observable<Course | null> {
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
   * Retourne les parcours pédagogiques de l'utilisateur
   * @param userId L'identifiant de l'utilisateur
   */
  public getCoursesByUser(userId: string): Observable<Course[]> {
    const url = `${environment.firestore.baseUrlDocument}:runQuery?key=${environment.firebase.apiKey}`;
    const req = this.getStructureQuery(userId);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(url, req, httpOptions).pipe(
      switchMap((data: any) => {
        let courses: Course[] = [];
        data.forEach(element => {
          if(typeof element.document != 'undefined'){
            courses.push(this.getCourseFromFirestore(element.document.fields));
          }
        });
        return of(courses);
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      })
    );
  }

  /**
   * Retourne les données du parcours pédagogique pour le firestore
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

  /**
   * Méthode pour le requêtage en base depuis firestore afin de récupérer les parcours 
   * pédagogiques de l'utilisateur
   * @param userId Identifiant utilisateur
   * @return Une requête pour firestore
   */
  private getStructureQuery(userId: string): object {
    return {
      structuredQuery: {
        from: [{
          collectionId: 'courses'
        }],
        where: {
          fieldFilter: {
            field: {
              fieldPath: 'userId'
            },
            op: 'EQUAL',
            value: {
              stringValue: userId
            }
          }
        }
      }
    };
  }
}
