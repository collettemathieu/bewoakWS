import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddArticleModalComponent } from '../add-article-modal/add-article-modal.component';

@Component({
  selector: 'bw-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent implements OnInit {

  private bsModelRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  public addArticle() {
    this.bsModelRef = this.modalService.show(AddArticleModalComponent, { class: 'modal-lg' });
    this.bsModelRef.content.title = 'Ajouter un article au parcours';
  }
}
