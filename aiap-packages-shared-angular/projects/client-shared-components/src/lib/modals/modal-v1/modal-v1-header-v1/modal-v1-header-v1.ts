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
  selector: 'aiap-modal-v1-header-v1',
  templateUrl: './modal-v1-header-v1.html',
  styleUrls: ['./modal-v1-header-v1.scss'],
})
export class ModalV1HeaderV1 implements OnInit {

  @Output() closeSelect = new EventEmitter<any>();

  static getClassName() {
    return 'ModalV1HeaderV1';
  }

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  handleEventCloseSelect(event: any) {
    _debugX(ModalV1HeaderV1.getClassName(), 'handleEventCloseSelect',
      {
        event,
      });

    this.closeSelect.emit(event);
  }

}
