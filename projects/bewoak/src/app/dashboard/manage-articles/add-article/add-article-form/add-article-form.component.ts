import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArticleService } from '../../../../core/services/article/article.service';
import { CourseStateService } from '../../../../core/services/course/course-state.service';
import { Course } from '../../../../shared/models/course';
import { Article } from '../../../../shared/models/article';
import { BehaviorSubject } from 'rxjs';
import { DoiService } from '../../../../core/services/article/doi.service';
import { ToastrService } from '../../../../core/services/toastr.service';

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
  private currentCourse: Course;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private courseStateService: CourseStateService,
    private doiService: DoiService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.formArticle = this.createForm();
    this.currentCourse = this.courseStateService.getCurrentCourse();
  }

  /**
   * Création du formulaire pour l'ajout d'un article au parcours pédagogique.
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
   * Prévisualisation des données de l'article sélection par son DOI.
   */
  public preview(): void {
    if (!this.formArticle.valid) {
      return;
    }
    this.doiService.getArticleByDoi(this.doi.value).subscribe(
      article => {
        this.article.next(article);
      }
    );
  }

  /**
   * Annulation de la prévisualisation de l'article.
   */
  public cancel(): void {
    this.article.next(null);
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

    this.articleService.getArticleByDoi(this.doiService.extractDoi(this.doi.value)).subscribe(
      article => {
        if (article === null) {
          this.addArticle();
        } else {
          this.updateArticle(article);
        }
      }
    );
  }

  /**
   * Ajout de l'article en cours de validation.
   */
  private addArticle(): void {

    const article = this.article.value;

    const order = {};
    order[this.currentCourse.id] = this.currentCourse.articles.length + 1;
    article.courseIds = [this.currentCourse.id];
    article.dateAdd = Date.now();
    article.dateUpdate = Date.now();
    article.orderByCourseId = order;
    article.doi = this.doiService.extractDoi(this.doi.value);

    this.articleService.add(article).subscribe(
      _ => {
        this.courseStateService.getCourse(this.currentCourse.id).subscribe();
        this.article.next(null);
        // Fermeture de la fenêtre modale
        this.closeModalArticle.emit(true);
      }
    );
  }

  /**
   * Modification de l'article en cours de validation.
   */
  private updateArticle(article: Article): void {

    // Un article ne peut être associé plusieurs fois à un même parcours.
    if (article.courseIds.includes(this.currentCourse.id)) {
      this.toastrService.showMessage({
        type: 'info',
        message: 'Vous ne pouvez pas ajouter plusieurs fois le même article dans un même parcours.'
      });
      // Fermeture de la fenêtre modale
      this.closeModalArticle.emit(true);
      return;
    }
    article.orderByCourseId[this.currentCourse.id] = this.currentCourse.articles.length + 1;
    article.courseIds.push(this.currentCourse.id);
    article.dateUpdate = Date.now();
    article.doi = this.doiService.extractDoi(this.doi.value);

    this.articleService.update(article).subscribe(
      _ => {
        this.courseStateService.getCourse(this.currentCourse.id).subscribe();
        this.article.next(null);
        // Fermeture de la fenêtre modale
        this.closeModalArticle.emit(true);
      }
    );
  }

  get doi() { return this.formArticle.get('doi'); }

}
