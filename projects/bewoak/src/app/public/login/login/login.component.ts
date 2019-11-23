import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from '../../../core/services/toastr.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'bw-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.createLoginForm();
  }

  /**
   * Création du formulaire de LogIn pour l'utilisateur
   */
  createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  /**
   * Soumission du formulaire de logIn et redirection si nécessaire
   */
  submitForm(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.email.value, this.password.value).subscribe(
        _ => this.router.navigate(['/home']),
        _ => this.loginForm.reset()
      );
    }
  }

  get email() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }

}
