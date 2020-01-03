import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'bw-add-article-form',
  templateUrl: './add-article-form.component.html',
  styleUrls: ['./add-article-form.component.scss']
})
export class AddArticleFormComponent implements OnInit {

  private closeModalArticle: EventEmitter<boolean> = new EventEmitter(false);
  public formArticle: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.formArticle = this.createForm();
  }

  /**
   * Création du formulaire pour l'ajout d'un article au parcours pédagogique
   */
  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [],
        updateOn: 'change'
      }]
    });
  }

  /**
   * Validation du formulaire pour l'ajout d'un parcours pédagogique
   */
  public submit() {
    if (!this.formArticle.valid) {
      return;
    }
    console.log('submitted');
    // Fermeture de la fenêtre modale
    this.closeModalArticle.emit(true);

  }

  get title() { return this.formArticle.get('title'); }

}
