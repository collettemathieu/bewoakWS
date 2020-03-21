import { Component, Input } from '@angular/core';
import { Article } from '../../../shared/models/article';

@Component({
  selector: 'bw-catalog-article',
  templateUrl: './catalog-article.component.html',
  styleUrls: ['./catalog-article.component.scss']
})
export class CatalogArticleComponent {

  @Input() article: Article;

}
