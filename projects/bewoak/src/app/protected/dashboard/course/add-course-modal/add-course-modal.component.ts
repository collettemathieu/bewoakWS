import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'bw-add-course-modal',
  templateUrl: './add-course-modal.component.html',
  styleUrls: ['./add-course-modal.component.scss']
})
export class AddCourseModalComponent implements OnInit {

  constructor(private bsModelRef: BsModalRef) { }

  ngOnInit() {
  }

  /**
   * Fermeture de la fenêtre modale
   */
  closeModal() {
    this.bsModelRef.hide();
  }

}
