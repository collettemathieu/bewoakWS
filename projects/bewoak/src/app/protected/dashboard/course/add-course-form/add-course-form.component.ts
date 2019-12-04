import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../../../shared/models/course';
import { AuthService } from 'projects/bewoak/src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../../../shared/models/user';
import { CourseService } from '../../../../core/services/course/course.service';
import { ToastrService } from 'projects/bewoak/src/app/core/services/toastr.service';

@Component({
  selector: 'bw-add-course-form',
  templateUrl: './add-course-form.component.html',
  styleUrls: ['./add-course-form.component.scss']
})
export class AddCourseFormComponent implements OnInit, OnDestroy {

  @Output()
  private closeModalParent: EventEmitter<boolean> = new EventEmitter(false);

  public formCourse: FormGroup;
  public levels: Array<string> = ['Débutant', 'Intermédiaire', 'Expert'];
  // Configuration du selecteur du formulaire
  public config = {
    search: false,
    height: 'auto',
    placeholder: 'Sélectionner la difficulté',
  };
  public user: User;
  private subscription: Subscription;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private courseService: CourseService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.formCourse = this.createForm();
    this.subscription = this.authService.user$.subscribe(
      user => this.user = user
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Création du formulaire pour l'ajout d'un parcours pédagogique
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', {
        validators: [Validators.required, Validators.minLength(3)]
      }],
      levelControl: ['', [Validators.required]]
    });
  }

  /**
   * Validation du formulaire pour l'ajout d'un parcours pédagogique
   */
  public submit() {
    if (this.formCourse.valid) {
      const options = {
        name: this.name.value,
        level: this.levelControl.value,
        userId: this.user.id
      };
      const course = new Course(options);
      this.courseService.save(course).subscribe(
        _ => {
          // Envoi d'un message à l'utilisateur
          this.toastrService.showMessage({
            type: 'success',
            message: 'Le parcours pédagogique a bien été enregistré'
          });
          // Fermeture de la fenêtre modale
          this.closeModalParent.emit(true);
        }
      );
    }
  }

  get name() { return this.formCourse.get('name'); }
  get levelControl() { return this.formCourse.get('levelControl'); }

}
