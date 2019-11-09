import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { switchMap, catchError, tap, finalize, delay } from 'rxjs/operators';
import { UserService } from './user.service';
import { ToastrService } from './toastr.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: BehaviorSubject<User | null> = new BehaviorSubject(null);
  public readonly user$: Observable<User | null> = this.user.asObservable();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService,
    private errorService: ErrorService,
    private loaderService: LoaderService
  ) { }

  /* 
  *  Méthode permettant l'authentification depuis firebase de l'utilisateur
  */
  login(email: string, password: string): Observable<User | null> {

    // Mise en attente
    this.loaderService.setLoading(true);

    // Configuration de la requête
    const data = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url = `${environment.firebase.auth.baseUrl}accounts:signInWithPassword?key=${environment.firebase.apiKey}`;

    // Envoi requête
    return this.httpClient.post<Observable<User | null>>(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        const userId: string = data.localId;
        const jwt: string = data.idToken;
        // Sauvegarde des données dans le localStorage
        this.saveAuthData(userId, jwt);
        // Récupération des données utilisateur
        return this.userService.getUser(userId, jwt);
      }),
      tap(user => this.user.next(user)),
      tap(_ => this.logOutTimer(3600)),
      catchError((error) => {
        // Fin mise en attente
        this.loaderService.setLoading(false);
        // Envoi d'un message d'erreur
        return this.errorService.handleError(error)
      }),
      finalize(() => {
        // Envoi d'un message 
        this.toastrService.showMessage({
          type: 'success',
          message: `Bienvenue ${this.user.getValue().firstname}`
        });
        // Fin mise en attente
        this.loaderService.setLoading(false);
      })
    );
  }

  /* 
  *  Méthode permettant l'authentification automatique depuis firebase de l'utilisateur
  */
  automaticLogin(): void {
    const userId: string = localStorage.getItem('userId') || '';
    const jwt: string = localStorage.getItem('token') || '';
    const now = new Date().getTime();
    const expirationDate: number = +localStorage.getItem('expirationDate') || now;

    if (!jwt) {
      return;
    }

    if (now >= expirationDate) {
      return;
    }

    this.userService.getUser(userId, jwt).subscribe(
      user => {
        this.user.next(user);
        this.router.navigate(['home']);
      }
    );
  }


  /* 
  *  Méthode permettant l'enregistrement de l'utilisateur sur firebase
  */
  register(options: {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role: Array<'USER' | 'EXPERT' | 'ADMIN'>,
  }): Observable<User | null> {
    // Mise en attente
    this.loaderService.setLoading(true);

    // Configuration
    const url = `${environment.firebase.auth.baseUrl}accounts:signUp?key=${environment.firebase.apiKey}`;
    const data = {
      email: options.email,
      password: options.password,
      returnSecureToken: true
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // Envoi requête
    return this.httpClient.post<User>(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        const user: User = new User({
          id: data.localId,
          firstname: options.firstname,
          lastname: options.lastname,
          email: data.email,
          roles: options.role,
          dateAdd: Date.now(),
          dateUpdate: Date.now()
        });
        const jwt: string = data.idToken;
        return this.userService.save(user, jwt);
      }),
      catchError((error) => {
        // Fin mise en attente
        this.loaderService.setLoading(false);
        // Retourne l'erreur à l'utilisateur
        return this.errorService.handleError(error);
      }),
      finalize(() => {
        // Envoi d'un message
        this.toastrService.showMessage({
          type: 'success',
          message: 'Utilisateur enregistré'
        });
        // Fin mise en attente
        this.loaderService.setLoading(false);
      })
    );
  }


  /* 
  * Méthode permettant d'enregistrer les modifications d'un utilisateur
  * @param user: User
  * @return Observable<User | null>
  */
  updateStateUser(user: User): Observable<User | null> {
    this.loaderService.setLoading(true);

    return this.userService.update(user).pipe(
      tap(user => this.user.next(user)),
      tap(_ => this.toastrService.showMessage({
        type: 'success',
        message: 'Votre profil a bien été enregistré'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  /* 
  *  Méthode permettant la déconnexion de l'utilisateur
  */
  logout(): void {
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.user.next(null);
    this.router.navigate(['/login']);
  }

  /* 
  *  Méthode permettant la déconnexion automatique de l'utilisateur
  */
  private logOutTimer(timer: number): void {
    of(true).pipe(
      delay(timer * 1000)
    ).subscribe(
      _ => this.logout()
    );
  }

  /* 
  *  Méthode permettant de sauvegarder en local storage les données utilisateurs
  */
  private saveAuthData(userId: string, jwt: string): void {
    const now = new Date();
    localStorage.setItem('expirationDate', (now.getTime() + 3600 * 1000).toString());
    localStorage.setItem('token', jwt);
    localStorage.setItem('userId', userId);
  }


  /* 
  *  Méthode permettant de récupérer l'utilisateur courant
  */
  public getCurrentUser(): User {
    return this.user.getValue();
  }
}