import { NgModule } from '@angular/core';

import { ManageArticlesRoutingModule } from './manage-articles-routing.module';
import { AddArticleComponent } from './add-article/add-article.component';
import { ViewArticleComponent } from './view-article/view-article.component';
import { SharedModule } from '../../../shared/shared.module';
import { AddArticleFormComponent } from './add-article-form/add-article-form.component';
import { AddArticleModalComponent } from './add-article-modal/add-article-modal.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AddArticleComponent, ViewArticleComponent, AddArticleFormComponent, AddArticleModalComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    ManageArticlesRoutingModule
  ],
  exports: [AddArticleComponent, ViewArticleComponent],
  entryComponents: [AddArticleModalComponent]
})
export class ManageArticlesModule { }
