import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArticleService } from '../../../core/services/article/article.service';
import { CourseStateService } from '../../../core/services/course/course-state.service';
import { Course } from '../../../shared/models/course';
import { Article } from '../../../shared/models/article';

@Component({
  selector: 'bw-add-article-form',
  templateUrl: './add-article-form.component.html',
  styleUrls: ['./add-article-form.component.scss']
})
export class AddArticleFormComponent implements OnInit {

  @Output()
  private closeModalArticle: EventEmitter<boolean> = new EventEmitter(false);
  public formArticle: FormGroup;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private courseStateService: CourseStateService
  ) { }

  ngOnInit() {
    this.formArticle = this.createForm();
  }

  /**
   * Création du formulaire pour l'ajout d'un article au parcours pédagogique
   */
  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [],
        updateOn: 'change'
      }]
    });
  }

  /**
   * Validation du formulaire pour l'ajout d'un article au parcours pédagogique
   */
  public submit(): void {
    if (!this.formArticle.valid) {
      return;
    }

    const course: Course = this.courseStateService.getCurrentCourse();
    const order = {};
    order[course.id] = course.articles.length + 1;
    const article = new Article({
      title: this.title.value,
      courseIds: [course.id],
      orderByCourseId: order,
      dateAdd: Date.now()
    });

    // Ajout de l'article
    this.articleService.addArticle(article).subscribe(
      _ => this.courseStateService.getCourse(course.id).subscribe()
    );

    // Fermeture de la fenêtre modale
    this.closeModalArticle.emit(true);

  }

  get title() { return this.formArticle.get('title'); }

}
