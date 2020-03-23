import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArticleService } from '../../../core/services/article/article.service';
import { CourseStateService } from '../../../core/services/course/course-state.service';
import { Course } from '../../../shared/models/course';
import { Article } from '../../../shared/models/article';
import { DoiArticleService } from '../../../core/services/article/doi-article.service';

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
    private doiArticleService: DoiArticleService,
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
      doi: ['', {
        validators: [Validators.required, Validators.pattern('[0-9]{2}.[0-9]{4,5}/.+')],
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

    this.doiArticleService.setCrossRefOptions({
      pid: 'collettemathieu%40noolib.com',
      format: 'unixsd'
    });
    this.doiArticleService.getArticle(this.doi.value).subscribe(
      data => {

        const course: Course = this.courseStateService.getCurrentCourse();
        const order = {};
        order[course.id] = course.articles.length + 1;

        const article = new Article({
          title: data.title,
          courseIds: [course.id],
          orderByCourseId: order,
          dateAdd: Date.now()
        });

        // Ajout de l'article
        this.articleService.addArticle(article).subscribe(
          _ => this.courseStateService.getCourse(course.id).subscribe()
        );
      }
    );

    // Fermeture de la fenêtre modale
    this.closeModalArticle.emit(true);

  }

  get doi() { return this.formArticle.get('doi'); }

}
