import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../../../../shared/models/course';
import { AuthService } from '../../../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../../../../shared/models/user';
import { CoursesStateUserService } from '../../../../../core/services/course/courses-state-user.service';
import { CheckCourseNameValidator } from '../../../../../shared/validators/check-course-name.validator';
import { CourseStateService } from 'projects/bewoak/src/app/core/services/course/course-state.service';

@Component({
  selector: 'bw-add-course-form',
  templateUrl: './add-course-form.component.html',
  styleUrls: ['./add-course-form.component.scss']
})
export class AddCourseFormComponent implements OnInit, OnDestroy {

  @Output()
  private closeModalParent: EventEmitter<boolean> = new EventEmitter(false);

  public formCourse: FormGroup;
  private currentCourse: Course;
  // Options des difficultés du parcours pédagogique
  public levels: { id: number, name: string }[] = [
    {
      id: 1,
      name: 'Débutant'
    },
    {
      id: 2,
      name: 'Intermédiaire'
    },
    {
      id: 3,
      name: 'Expert'
    }
  ];
  // Configuration du selecteur du formulaire
  public config = {
    displayKey: 'name',
    search: false,
    height: 'auto',
    placeholder: 'Sélectionner la difficulté',
  };
  public user: User;
  private subscription: Subscription;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private coursesStateUserService: CoursesStateUserService,
    private checkCourseNameValidator: CheckCourseNameValidator,
    private courseStateService: CourseStateService
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
    this.currentCourse = this.courseStateService.getCurrentCourse();
    const nameCourse = this.currentCourse ? this.currentCourse.name : '';
    const levelCourse = this.currentCourse ? this.currentCourse.level : '';
    return this.fb.group({
      name: [nameCourse, {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [this.checkCourseNameValidator],
        updateOn: 'change'
      }],
      levelControl: [levelCourse, [Validators.required]]
    });
  }

  /**
   * Validation du formulaire pour l'ajout d'un parcours pédagogique
   */
  public submit() {
    if (this.formCourse.valid) {
      const options = {
        name: this.name.value,
        level: this.levelControl.value.name,
        userId: this.user.id,
        dateAdd: Date.now(),
        dateUpdate: Date.now()
      };

      if (this.currentCourse) {

      } else {
        const course = new Course(options);
        this.coursesStateUserService.register(course).subscribe();
      }

      // Fermeture de la fenêtre modale
      this.closeModalParent.emit(true);
    }
  }

  get name() { return this.formCourse.get('name'); }
  get levelControl() { return this.formCourse.get('levelControl'); }

}
