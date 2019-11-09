import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../shared/models/user';
import { FormUserService } from '../../../../core/services/user/form-user.service';

@Component({
  selector: 'bw-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {

  private formProfile: FormGroup;
  private roles: string;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private formUserService: FormUserService) { }

  /*
  * Si l'utilisateur est connecté, création et insertion des données
  * utilisateur dans le formulaire de profil
  */
  ngOnInit() {
    this.authService.user$.subscribe(
      user => {
        // Affichage des rôles de l'utiliateur (pour information)
        this.roles = this.getRolesFromUser(user);
        // Création du formulaire de profil
        this.formProfile = this.createForm();
        // Insertion des données utilisateur
        this.formProfile.setValue(this.getDataForFormProfile(user));
      }
    );
  }

  /*
  * Enregistrement des modifications du profil utilisateur
  * @return void
  */
  private submit() {
    if (this.formProfile.valid) {
      const user = this.authService.getCurrentUser();
      user.firstname = this.firstname.value;
      user.lastname = this.lastname.value;
      user.jobBackground = this.jobBackground.value;
      user.dateUpdate = Date.now();
      this.authService.updateStateUser(user).subscribe();
    }
  }

  /*
  * Création du formulaire de profil utilisateur
  * @return FormGroup
  */
  private createForm(): FormGroup {
    // Contrôles demandés
    const controlsAsked = ['firstname', 'lastname', 'jobBackground'];
    // Récupération du formulaire standard de l'entité User
    return this.formUserService.generateFormGroup(controlsAsked);
  }

  /*
  * Transformation des données utilisateur pour le formulaire de profil
  * @param user: User
  * @return Object avec les données pour le formulaire
  */
  private getDataForFormProfile(user: User): Object {
    return {
      'firstname': user.firstname,
      'lastname': user.lastname,
      'jobBackground': user.jobBackground
    }
  }

  /*
  * Transformation des rôles de l'objet utilisateur pour un affichage dans le formulaire
  * @param user: User
  * @return string
  */
  private getRolesFromUser(user: User): string {
    let roles: string = '',
        _role: string;
    user.roles.forEach((role, index) => {
      switch (role) {
        case 'ADMIN':
          _role = 'Administrateur';
          break;
        case 'EXPERT':
          _role = 'Expert';
          break;
        case 'USER':
          _role = 'Utilisateur';
          break;
      }

      if (index === 0) {
        roles = `${_role}`;
      } else {
        roles = `${roles}, ${_role}`;
      }
    });
    return roles;
  }



  get firstname() {
    return this.formProfile.get('firstname');
  }

  get lastname() {
    return this.formProfile.get('lastname');
  }

  get jobBackground() {
    return this.formProfile.get('jobBackground');
  }

}
