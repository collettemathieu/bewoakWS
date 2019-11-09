import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../../shared/models/article';

@Component({
  selector: 'bw-catalog-article',
  templateUrl: './catalog-article.component.html',
  styleUrls: ['./catalog-article.component.scss']
})
export class CatalogArticleComponent implements OnInit {

  @Input() article: Article;

  constructor() { }

  ngOnInit() {
  }

}
