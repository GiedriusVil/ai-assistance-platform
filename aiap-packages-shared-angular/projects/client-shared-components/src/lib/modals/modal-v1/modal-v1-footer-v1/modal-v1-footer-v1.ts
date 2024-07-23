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
  selector: 'aiap-modal-v1-footer-v1',
  templateUrl: './modal-v1-footer-v1.html',
  styleUrls: ['./modal-v1-footer-v1.scss'],
})
export class ModalV1FooterV1 implements OnInit {

  static getClassName() {
    return 'ModalV1FooterV1';
  }

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }
}
