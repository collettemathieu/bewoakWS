import { Component, Input } from '@angular/core';
import { Article } from '../../../shared/models/article';
import { ArticleService } from '../../../core/services/article/article.service';
import { CourseStateService } from '../../../core/services/course/course-state.service';

@Component({
  selector: 'bw-remove-article',
  templateUrl: './remove-article.component.html',
  styleUrls: ['./remove-article.component.scss']
})
export class RemoveArticleComponent {

  @Input()
  article: Article;

  constructor(
    private articleService: ArticleService,
    private courseStateService: CourseStateService
  ) { }

  public remove(): void {
    const article = this.article;
    const course = this.courseStateService.getCurrentCourse();
    const index = article.courseIds.findIndex((element) => {
      return element === course.id;
    });
    console.log(index);
    if(index !== -1){
      this.article.courseIds.slice(index, 1);
      console.log(this.article);
    }
    delete article.orderByCourseId[course.id];
      
    this.articleService.update(article);
  }

}
