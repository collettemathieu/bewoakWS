import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'bw-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  public user: User;

  private homePath = 'home';
  private catalogPath = 'catalog';
  private dashboardPath = 'dashboard';
  private loginPath = 'login';
  private adminPath = 'administration';
  private addUserPath = '/administration/addUser';
  private addCoursePath = '/dashboard/addCourse';
  private settingsPath = 'settings';
  private settingsProfilePath = 'settings/profile';

  constructor(
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(
      user => this.user = user
    );
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  isActive(page: string): boolean{
    return this.router.isActive(page, false); // false, la route n'est pas exacte
  }

  navigate(page: string): void {
    this.router.navigate([page]);
  }

  logOut(): void{
    this.authService.logout();
  }

}
