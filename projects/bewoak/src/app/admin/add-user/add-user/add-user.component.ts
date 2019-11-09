import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserPasswordService } from '../../../core/services/user-password.service';
import { FormUserService } from '../../../core/services/user/form-user.service';

@Component({
  selector: 'bw-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  private addUserForm: FormGroup;
  private roles: Array<string> = ['USER', 'EXPERT', 'ADMIN'];
  private config = {
    displayKey:"description", //if objects array passed which key to be displayed defaults to description
    search:true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Sélectionner les roles', // text to be displayed when no item is selected defaults to Select,
    moreText: 'en plus', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat trouvé !', // text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher', // label thats displayed in search input,
  };

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userPasswordService: UserPasswordService,
    private formUserService: FormUserService) { }

  ngOnInit() {
    this.addUserForm = this.createForm();
  }

  private createForm(): FormGroup{
    // Contrôles demandés
    const controlsAsked = ['firstname', 'lastname', 'email', 'roleControl'];
    // Récupération du formulaire standard de l'entité User
    return this.formUserService.generateFormGroup(controlsAsked);
  }

  submitForm(): void {
    if(this.addUserForm.valid){
      const options = {
        firstname: this.firstname.value,
        lastname: this.lastname.value,
        email: this.email.value,
        password: this.userPasswordService.generatePassword(),
        role: this.roleControl.value
      };

      // Enregistrement de l'utilisateur dans le firebase
      // Redirection si ok
      // Réinitialisation du formulaire si ko
      this.authService.register(options).subscribe(
        _ => this.router.navigate(['/home']),
        _ => this.addUserForm.reset()
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
