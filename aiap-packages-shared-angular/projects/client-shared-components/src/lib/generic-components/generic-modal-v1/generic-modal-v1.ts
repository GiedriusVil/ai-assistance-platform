/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  LocalStorageServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aiap-generic-modal-v1',
  templateUrl: './generic-modal-v1.html',
  styleUrls: ['./generic-modal-v1.scss']
})
export class GenericModalV1 implements OnInit {

  static getClassName() {
    return 'GenericModalV1';
  }

  @Input() showCloseButton = true;
  @Input() showConfirmationButton = true;
  @Input() showCheckbox = false;
  @Input() title: string;
  @Input() description: string;
  @Input() data: string;
  @Input() cancelButtonLabel = 'Cancel';
  @Input() confirmButtonLabel = 'Yes';
  @Input() checkboxLabel: string;
  @Output() confirmAction = new EventEmitter();

  isOpen = false;

  constructor(
    private localStorageService: LocalStorageServiceV1,
  ) { }

  ngOnInit() {
    //
  }

  onYes() {
    this.confirmAction.emit();
    this.onClose();
  }

  onClose() {
    this.isOpen = false;
  }

  show() {
    this.isOpen = true;
  }

  handleCheckbox(event: any) {
    const CHECKED = event?.checked;
    if (
      CHECKED
    ) {
      this.localStorageService.set('appSettings', { showDisclaimer: false });
    } else {
      this.localStorageService.set('appSettings', { showDisclaimer: true });
    }
  }
}
