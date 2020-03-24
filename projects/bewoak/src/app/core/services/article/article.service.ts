import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Article } from '../../../shared/models/article';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ErrorService } from '../error.service';
import { RandomService } from '../random.service';
import { switchMap, catchError } from 'rxjs/operators';
import { ApiCrossRefServiceService } from './api-cross-ref-service.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
    private randomService: RandomService,
    private ApiCrossRefService: ApiCrossRefServiceService
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
  public getCourseArticles(id: string): Observable<Article[]> {

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
   * Retourne l'article à partir de son DOI
   * @param id Identifiant DOI de l'article
   */
  public getArticleFromDoi(doi: string): Observable<Article | null> {
    this.ApiCrossRefService.setOptions({
      pid: environment.apiCrossRef.pid
    });
    return this.ApiCrossRefService.getArticleData(doi).pipe(
      switchMap(data => {
        return of(new Article({
          title: data.title
        }));
      }),
      catchError(error => {
        return this.errorService.handleError({
          error: {
            error: {
              message: error.statusText
            }
          }
        });
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
      orderByCourseId: article.orderByCourseId,
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
        orderByCourseId: {
          mapValue: {
            fields: this.getOrderByCourseIdDataForFirestore(article)
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
      courseIds: this.getCourseIdsDataFromFirestore(fields.courseIds),
      orderByCourseId: this.getOrderByCourseIdDataFromFirestore(fields.orderByCourseId),
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
   * Méthode pour la transformation des ordres de l'article par parcours pédagogique vers le firestore
   * @param article L'article courant
   * @return Un tableau de {stringValue: id}
   */
  private getOrderByCourseIdDataForFirestore(article: Article): object {
    const orderBycourseId = {};
    for (const key in article.orderByCourseId) {
      if (article.orderByCourseId.hasOwnProperty(key)) {
        orderBycourseId[key] = {
          integerValue: article.orderByCourseId[key]
        }
      }
    }
    return orderBycourseId;
  }

  /**
   * Méthode pour la transformation des ids des parcours pédagogiques rendu par firestore vers l'article
   * @param ids Ids formatés des parcours pédagogique de l'article courant
   * @return Un tableau des ids des parcours pédagogiques de l'article
   */
  private getCourseIdsDataFromFirestore(ids: any): Array<string> {
    const courseIds = [];
    ids.arrayValue.values.forEach(value => {
      courseIds.push(value.stringValue);
    });
    return courseIds;
  }

  /**
   * Méthode pour la transformation des ordres par parcours pédagogique de l'article depuis le firestore vers l'article
   * @param orders Ordre de l'article dans les parcours pédagogique formatés
   * @return Un tableau des ordres de l'article par parcours pédagogique
   */
  private getOrderByCourseIdDataFromFirestore(orders: any): { [key: string]: number } {
    const orderBycourseId = {};
    for (const key in orders.mapValue.fields) {
      if (orders.mapValue.fields.hasOwnProperty(key)) {
        orderBycourseId[key] = +orders.mapValue.fields[key].integerValue;
      }
    }
    return orderBycourseId;
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
