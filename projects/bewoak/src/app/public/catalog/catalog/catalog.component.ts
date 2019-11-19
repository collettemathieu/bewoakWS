import { Component, OnInit } from '@angular/core';
import { Article } from '../../../shared/models/article';
import { ArticleService } from '../../../core/services/article.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'bw-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  public articles$: Observable<Article[]>;

  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.articles$ = this.getArticles();
  }

  /**
   * Récupére la liste de tous les articles de bewoak
   */
  getArticles(): Observable<Article[]> {
    return this.articleService.getArticles();
  }

}
