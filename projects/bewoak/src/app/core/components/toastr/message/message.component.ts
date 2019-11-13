import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Toastr } from '../../../../shared/interface/toastr';

@Component({
  selector: 'bw-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  @Input('toastr')
  private message: Toastr;

  @Output()
  private closeMessageEmitter: EventEmitter<Toastr> = new EventEmitter();

  constructor() { }

  private closeMessage() {
    this.closeMessageEmitter.emit(this.message);
  }

}
