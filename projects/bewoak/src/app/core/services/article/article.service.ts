import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Article } from '../../../shared/models/article';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ErrorService } from '../error.service';
import { RandomService } from '../random.service';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
    private randomService: RandomService
  ) { }

  /**
   * Récupére l'ensemble des articles de la plateforme
   */
  public getArticles() {
    return of([]);
  }

  /**
   * Retourne l'ensemble des articles par ordre d'apparition d'un parcours pédagogique
   * @param id Id du parcours pédagogique
   */
  public getArticlesForCourse(id: string): Observable<Article[]> {

    const url = `${environment.firestore.baseUrlDocument}:runQuery?key=${environment.firebase.apiKey}`;
    const req = this.getStructureQuery({ fieldPath: 'courseIds', value: id });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(url, req, httpOptions).pipe(
      switchMap((data: any) => {
        const articles: Array<Article> = [];
        data.forEach(element => {
          if (element.document && typeof element.document !== 'undefined') {
            articles.push(this.getArticleFromFirestore(element.document.fields));
          }
        });
        return of(articles);
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      })
    );
  }

  /**
   * Ajout d'un article. Si l'article existe déjà, l'id du parcours pédaogique sera uniqument ajouté à son
   * tableau d'ids.
   * @param article L'article à ajouter
   */
  public addArticle(article: Article): Observable<Article> {
    const id = this.randomService.generateId();

    const newArticle = new Article({
      id,
      title: article.title,
      courseIds: article.courseIds,
      dateAdd: article.dateAdd
    });
    const url = `${environment.firestore.baseUrlDocument}articles?key=${environment.firebase.apiKey}&documentId=${id}`;
    const dataArticle = this.getDataArticleForFirestore(newArticle);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<Article>(url, dataArticle, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getArticleFromFirestore(data.fields));
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      })
    );
  }

  /**
   * Retourne les données de l'article pour le firestore
   * @param article L'article
   */
  private getDataArticleForFirestore(article: Article): object {
    return {
      fields: {
        id: { stringValue: article.id },
        title: { stringValue: article.title },
        courseIds: {
          arrayValue: {
            values: this.getCourseIdsDataForFirestore(article)
          }
        },
        dateAdd: { integerValue: article.dateAdd }
      }
    };
  }

  /**
   * Méthode pour la transformation des données du firestore vers l'article
   * @param fields Champs retournés par le firestore
   * @return Un article avec les données de firestore
   */
  private getArticleFromFirestore(fields: any): Article {
    return new Article({
      id: fields.id.stringValue,
      title: fields.title.stringValue,
      courseIds: fields.courseIds.stringValue,
      dateAdd: fields.dateAdd.integerValue
    });
  }

  /**
   * Méthode pour la transformation des ids des parcours de l'article vers le firestore
   * @param article L'article courant
   * @return Un tableau de {stringValue: id}
   */
  private getCourseIdsDataForFirestore(article: Article): object {
    const courseIds = [];
    article.courseIds.forEach(id => {
      courseIds.push({
        stringValue: id
      });
    });
    return courseIds;
  }

  /**
   * Méthode pour la transformation des ids des parcours pédagogiques rendu par firestore vers l'article
   * @param ids Ids formatés des parcours pédagogique de l'article courant
   * @return Un tableau des ids des parcours pédagogiques de l'article
   */
  private getCourseIdsDataFromFirestore(ids: any): Array<string> {
    const courseIds = [];
    ids.values.forEach(value => {
      courseIds.push(value.stringValue);
    });
    return courseIds;
  }

  /**
   * Méthode pour le requêtage en base depuis firestore afin de récupérer les articles d'un parcours pédagogique
   * @param field Le champ recherché avec sa valeur
   * @return Une requête pour firestore
   */
  private getStructureQuery(field: { fieldPath: string, value: string }): object {
    return {
      structuredQuery: {
        from: [{
          collectionId: 'articles'
        }],
        where: {
          fieldFilter: {
            field: {
              fieldPath: field.fieldPath
            },
            op: 'ARRAY_CONTAINS',
            value: {
              stringValue: field.value
            }
          }
        }
      }
    };
  }
}
