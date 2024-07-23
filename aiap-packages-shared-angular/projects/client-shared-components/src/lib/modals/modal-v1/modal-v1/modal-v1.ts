/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { _debugX } from 'client-shared-utils';

import lodash from 'lodash';

@Component({
  selector: 'aiap-modal-v1',
  templateUrl: './modal-v1.html',
  styleUrls: ['./modal-v1.scss'],
})
export class ModalV1 implements OnInit {

  @Input() size: any;
  @Input('open') isOpen: any;
  @Output() overlaySelected = new EventEmitter<any>();

  static getClassName() {
    return 'ModalV1';
  }

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  handleEventOverlaySelected(event: any) {
    _debugX(ModalV1.getClassName(), 'handleEventOverlaySelected',
      {
        event,
      });

    this.overlaySelected.emit(event);
  }

}
