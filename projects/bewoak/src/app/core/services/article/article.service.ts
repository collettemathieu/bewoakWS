import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Course } from '../../../shared/models/course';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor() { }

  /**
   * Récupére l'ensemble des articles de la plateforme
   */
  public getArticles() {
    return of([]);
  }

  /**
   * Ajout d'un article à un parcours pédagogique
   * @param course Le parcours pédagogique à rattacher à l'article
   */
  public addArticleInCourse(course: Course) {

  }
}
