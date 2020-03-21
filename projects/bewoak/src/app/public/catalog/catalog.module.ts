import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogComponent } from './catalog.component';
import { CatalogArticleComponent } from './catalog-article/catalog-article.component';
import { CatalogRoutingModule } from './catalog-routing.module';



@NgModule({
  declarations: [CatalogComponent, CatalogArticleComponent],
  imports: [
    CommonModule,
    CatalogRoutingModule
  ]
})
export class CatalogModule { }
