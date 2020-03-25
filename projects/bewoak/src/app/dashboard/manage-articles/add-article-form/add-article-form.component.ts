import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArticleService } from '../../../core/services/article/article.service';
import { CourseStateService } from '../../../core/services/course/course-state.service';
import { Course } from '../../../shared/models/course';
import { Article } from '../../../shared/models/article';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bw-add-article-form',
  templateUrl: './add-article-form.component.html',
  styleUrls: ['./add-article-form.component.scss']
})
export class AddArticleFormComponent implements OnInit {

  public formArticle: FormGroup;
  public article: BehaviorSubject<Article | null> = new BehaviorSubject(null);
  @Output()
  private closeModalArticle: EventEmitter<boolean> = new EventEmitter(false);

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
      doi: ['', {
        validators: [Validators.required, Validators.pattern('(https://doi.org/){0,1}[0-9]{2}.[0-9]{4,5}/.+')],
        asyncValidators: [],
        updateOn: 'change'
      }]
    });
  }

  /**
   * Prévisualisation des données de l'article
   */
  public preview(): void {
    if (!this.formArticle.valid) {
      return;
    }

    this.articleService.getArticleFromDoi(this.doi.value).subscribe(
      article => {
        this.article.next(article);
      }
    );
  }

  /**
   * Validation du formulaire pour l'ajout d'un article au parcours pédagogique.
   * L'article est ajouté ou mis à jour selon son statut en bdd.
   */
  public submit(): void {
    if (!this.formArticle.valid) {
      return;
    }

    if (!this.article) {
      return;
    }
    
    this.articleService.getArticle(this.doi.value).subscribe(
      article => {
        if(article === null){
          this.addArticle();
        }
      }
    );
  }

  /**
   * Annulation de la recherche
   */
  public cancel(): void {
    this.article.next(null);
  }

  /**
   * Ajout de l'article en cours de validation
   */
  private addArticle(): void {

    const article = this.article.value;
    const course: Course = this.courseStateService.getCurrentCourse();
    const order = {};
    order[course.id] = course.articles.length + 1;
    article.courseIds = [course.id];
    article.dateAdd = Date.now();
    article.orderByCourseId = order;
    article.doi = this.doi.value;

    this.articleService.addArticle(article).subscribe(
      _ => {
        this.courseStateService.getCourse(course.id).subscribe();
        this.article.next(null);
        // Fermeture de la fenêtre modale
        this.closeModalArticle.emit(true);
      }
    );
  }

  get doi() { return this.formArticle.get('doi'); }

}
