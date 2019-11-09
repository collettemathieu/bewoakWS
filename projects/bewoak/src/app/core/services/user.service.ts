import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService
  ) { }


  /* 
    Méthode pour récupérer un utilisateur depuis le firestore en fonction de son
    identififiant après authentification
    @param userId:string, jwt:string (token)
    @return Observable<User|null>
  */
  getUser(userId: string, jwt: string): Observable<User | null> {
    const url = `${environment.firestore.baseUrl}:runQuery?key=${environment.firebase.apiKey}`;
    const data = this.getStructureQuery(userId);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      })
    };
    return this.httpClient.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data[0].document.fields));
      })
    );
  }

  /* 
    Méthode pour l'enregistrement de l'utilisateur dans le firestore après authentification
    @param user:User, jwt:string (token)
    @return Observable<User|null>
  */
  save(user: User, jwt: string): Observable<User | null> {
    const url = `${environment.firestore.baseUrl}users?key=${environment.firebase.apiKey}`;
    const data = this.getDataUserForFirestore(user);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      })
    };
    return this.httpClient.post<User>(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data.fields));
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      })
    );
  }

  /* 
  * Méthode permettant d'enregistrer les modifications d'un utilisateur
  * @param user: User
  * @return Observable<User>
  */
  update(user: User): Observable<User | null> {
    // Configuration
    const url = `${environment.firestore.baseUrl}users/${user.id}?key=${environment.firebase.apiKey}&currentDocument.exists=true`;
    const data = this.getDataUserForFirestore(user);
    const jwt = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      })
    };

    // Enregistrement en base    
    return this.httpClient.patch<User>(url, data, httpOptions).pipe(
      switchMap( (data: any) => {
        return of(this.getUserFromFirestore(data.fields))
      })
    );
  }

  /* 
    Méthode pour la transformation des données utilisateur vers le firestore
    @param user:User
    @return Object
  */
  private getDataUserForFirestore(user: User): Object {
    return {
      fields: {
        id: { stringValue: user.id },
        firstname: { stringValue: user.firstname },
        lastname: { stringValue: user.lastname },
        email: { stringValue: user.email },
        roles: {
          arrayValue: {
            "values": this.getRolesDataForFirestore(user)
          }
        },
        avatarUrl: { stringValue: user.avatarUrl },
        jobBackground: { stringValue: user.jobBackground },
        dateAdd: { integerValue: user.dateAdd },
        dateUpdate: { integerValue: user.dateUpdate }
      }
    }
  }

  /* 
    Méthode pour la transformation des données du firestore vers l'utilisateur
    @param fields: any
    @return User
  */
  private getUserFromFirestore(fields: any): User {
    return new User({
      id: fields.id.stringValue,
      firstname: fields.firstname.stringValue,
      lastname: fields.lastname.stringValue,
      email: fields.email.stringValue,
      roles: this.getRolesDataFromFirestore(fields.roles.arrayValue),
      avatarUrl: fields.avatarUrl.stringValue,
      jobBackground: fields.jobBackground.stringValue,
      dateAdd: fields.dateAdd.integerValue,
      dateUpdate: fields.dateUpdate.integerValue,
    });
  }

  /* 
    Méthode pour la transformation des roles de l'utilisateur vers le firestore
    @param user: User
    @return Object
  */
  private getRolesDataForFirestore(user: User): Object {
    const rolesUser = [];
    user.roles.forEach(role => {
      rolesUser.push({
        "stringValue": role
      });
    });
    return rolesUser;
  }

  /* 
  Méthode pour la transformation des roles du firestore vers l'utilisateur
  @param user: User
  @return Object
*/
  private getRolesDataFromFirestore(roles: any): Array<'USER' | 'EXPERT' | 'ADMIN'> {
    const rolesUser = [];
    roles.values.forEach(value => {
      rolesUser.push(value.stringValue);
    });
    return rolesUser;
  }

  /* 
   Méthode pour le requêtage en base depuis firestore
   @param userId: string
   @return Object
 */
  private getStructureQuery(userId: string): Object {
    return {
      'structuredQuery': {
        'from': [{
          'collectionId': 'users'
        }],
        'where': {
          'fieldFilter': {
            'field': {
              'fieldPath': 'id'
            },
            'op': 'EQUAL',
            'value': {
              'stringValue': userId
            }
          }
        }
      }
    };
  }
}