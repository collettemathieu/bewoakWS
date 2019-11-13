import { Injectable } from '@angular/core';
import { Article } from '../../shared/models/article';
import { ARTICLES } from '../../shared/models/mock-articles';
import { of, Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private loaderService: LoaderService) { }

  getArticles(): Observable<Article[]> {

    this.loaderService.setLoading(true);

    return of(ARTICLES).pipe(
      delay(1000),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
}
