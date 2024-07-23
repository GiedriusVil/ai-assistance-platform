/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

/**
Component used for passing title and messages

Example:
 <aca-confirm-modal #confirmModal
  (confirmEvent)="confirmParentComponentMethod()">
  <div class="title">
   Title goes here
  </div>
  <p>
   Plain text or HTML goes here
  </p>
</aca-confirm-modal>
 */
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'aca-confirm-modal',
  templateUrl: './confirm.modal.html',
  styleUrls: ['./confirm.modal.scss'],
})
export class ConfirmModalComponent {

  @Output() confirmEvent = new EventEmitter<void>();

  isOpen: boolean = false;

  constructor() { }

  confirm(): void {
    this.confirmEvent.emit();
  }

  show(): void {
    this.isOpen = true;
  }

  hide(): void {
    this.isOpen = false;
  }
}
