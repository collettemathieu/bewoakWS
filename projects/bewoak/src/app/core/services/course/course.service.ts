import { Injectable } from '@angular/core';
import { Course } from '../../../shared/models/course';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { ErrorService } from '../error.service';
import { RandomService } from '../random.service';

@Injectable()
export class CourseService {

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
    private randomService: RandomService
  ) { }

  /**
   * Récupére le parcours pédagogique par son ID
   * @param id Id du parcours pédagogique
   */
  public getCourse(id: string): Observable<Course> {
    const url = `${environment.firestore.baseUrlDocument}:runQuery?key=${environment.firebase.apiKey}`;
    const req = this.getStructureQueryById(id);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient.post(url, req, httpOptions).pipe(
      switchMap((data: any) => {
        const course: Course = this.getCourseFromFirestore(data[0].document.fields);
        return of(course);
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      })
    );
  }


  /**
   * Enregistrer un nouveau parcours pédagogique
   * @param course Le parcours pédagogique
   */
  public save(course: Course): Observable<Course | null> {
    const id = this.randomService.generateId();
    const newCourse = new Course({
      id,
      name: course.name,
      level: course.level,
      userId: course.userId,
      dateAdd: course.dateAdd,
      dateUpdate: course.dateUpdate
    });
    const url = `${environment.firestore.baseUrlDocument}courses?key=${environment.firebase.apiKey}&documentId=${id}`;
    const dataCourse = this.getDataCourseForFirestore(newCourse);
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
    const req = this.getStructureQueryByUser(userId);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(url, req, httpOptions).pipe(
      switchMap((data: any) => {
        const courses: Course[] = [];
        data.forEach(element => {
          if (typeof element.document !== 'undefined') {
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
   * Retourne si le nom du parcours pédagogique est disponible
   * @param name Le nom du parcours pédagogique
   */
  public isAvailable(name: string): Observable<boolean> {
    const url = `${environment.firestore.baseUrlDocument}:runQuery?key=${environment.firebase.apiKey}`;
    const req = this.getStructureQueryByName(name);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient.post(url, req, httpOptions).pipe(
      switchMap((data: any) => {
        if (typeof data[0].document !== 'undefined') {
          return of(false);
        }
        return of(true);
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      })
    );
  }

  /**
   * Suppression d'un parcours pédagogique
   * @param course Le parcours pédagogique à supprimer
   */
  public remove(course: Course): Observable<Course> {
    const url = `${environment.firestore.baseUrlDocument}courses/${course.id}?key=${environment.firebase.apiKey}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.delete(url, httpOptions).pipe(
      switchMap(_ => {
        return of(course);
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
        avatar: { stringValue: course.avatar },
        like: { integerValue: course.like },
        level: { stringValue: course.level },
        userId: { stringValue: course.userId },
        dateAdd: { integerValue: course.dateAdd },
        dateUpdate: { integerValue: course.dateUpdate }
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
      avatar: fields.avatar.stringValue,
      like: fields.like.integerValue,
      level: fields.level.stringValue,
      userId: fields.userId.stringValue,
      dateAdd: fields.dateAdd.integerValue,
      dateUpdate: fields.dateUpdate.integerValue
    });
  }

  /**
   * Méthode pour le requêtage en base depuis firestore afin de récupérer les parcours
   * pédagogiques de l'utilisateur
   * @param userId Identifiant utilisateur
   * @return Une requête pour firestore
   */
  private getStructureQueryByUser(userId: string): object {
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

  /**
   * Méthode pour le requêtage en base depuis firestore afin de récupérer les parcours
   * pédagogiques possédant le nom name
   * @param name Nom du parcours pédagogique
   * @return Une requête pour firestore
   */
  private getStructureQueryByName(name: string): object {
    return {
      structuredQuery: {
        from: [{
          collectionId: 'courses'
        }],
        where: {
          fieldFilter: {
            field: {
              fieldPath: 'name'
            },
            op: 'EQUAL',
            value: {
              stringValue: name
            }
          }
        }
      }
    };
  }

  /**
   * Méthode pour le requêtage en base depuis firestore afin de récupérer le parcours
   * pédagogique possédant l'ID demandé
   * @param id Id du parcours pédagogique
   * @return Une requête pour firestore
   */
  private getStructureQueryById(id: string): object {
    return {
      structuredQuery: {
        from: [{
          collectionId: 'courses'
        }],
        where: {
          fieldFilter: {
            field: {
              fieldPath: 'id'
            },
            op: 'EQUAL',
            value: {
              stringValue: id
            }
          }
        }
      }
    };
  }
}
