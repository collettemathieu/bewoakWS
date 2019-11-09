import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'bw-article-form',
  templateUrl: './article-form.component.html',
  styles: []
})
export class ArticleFormComponent implements OnInit {

  courseForm: FormGroup;

  articleForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.courseForm = this.fb.group({

    });

    this.articleForm = this.fb.group({
      'title': '',
      'description': ''
    });

    
  }

  get title(){
    return this.articleForm.get('title');
  }
  get description(){
    return this.articleForm.get('description');
  }

}
