import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'bw-navbar-settings',
  templateUrl: './navbar-settings.component.html',
  styleUrls: ['./navbar-settings.component.scss']
})
export class NavbarSettingsComponent implements OnInit {

  private profilePath: string = 'settings/profile';
  private accountPath: string = 'settings/account';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  private isActiv(path: string): boolean{
    return this.router.isActive(path, true); // L'url est exact
  }

  private navigate(path: string): void{
    this.router.navigate([path]);
  }

}
