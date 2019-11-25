import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserPasswordService } from '../../../core/services/user/user-password.service';
import { FormUserService } from '../../../core/services/user/form-user.service';

@Component({
  selector: 'bw-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  public addUserForm: FormGroup;
  public roles: Array<string> = ['USER', 'EXPERT', 'ADMIN'];
  public config = {
    // if objects array passed which key to be displayed defaults to description
    displayKey: 'description',
    // true/false for the search functionlity defaults to false
    search: true,
    // height of the list so that if there are more no of items it can show
    // a scroll defaults to auto. With auto height scroll will never appear
    height: 'auto',
    // text to be displayed when no item is selected defaults to Select
    placeholder: 'Sélectionner les roles',
    // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    moreText: 'en plus',
    // text to be displayed when no items are found while searching
    noResultsFound: 'Aucun résultat trouvé !',
    // label thats displayed in search input
    searchPlaceholder: 'Rechercher',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private userPasswordService: UserPasswordService,
    private formUserService: FormUserService
  ) { }

  ngOnInit() {
    this.addUserForm = this.createForm();
  }

  /**
   * Création du formulaire de l'utilisateur à partir du générateur de formulaire
   */
  private createForm(): FormGroup {
    // Contrôles demandés
    const controlsAsked = ['firstname', 'lastname', 'email', 'roleControl'];
    // Récupération du formulaire standard de l'entité User
    return this.formUserService.generateFormGroup(controlsAsked);
  }

  /**
   * Soummission du formulaire
   */
  submitForm(): void {
    if (this.addUserForm.valid) {
      const options = {
        firstname: this.firstname.value,
        lastname: this.lastname.value,
        email: this.email.value,
        password: this.userPasswordService.generatePassword(),
        role: this.roleControl.value
      };

      // Enregistrement de l'utilisateur dans le firebase
      // Redirection si ok
      this.authService.register(options).subscribe(
        _ => this.router.navigate(['/home'])
      );
    }
  }

  get firstname() {
    return this.addUserForm.get('firstname');
  }

  get lastname() {
    return this.addUserForm.get('lastname');
  }

  get email() {
    return this.addUserForm.get('email');
  }

  get roleControl() {
    return this.addUserForm.get('roleControl');
  }

}
