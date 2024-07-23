/*
  © Copyright IBM Corporation 2023. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
} from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-button-set-v1',
  templateUrl: './button-set-v1.html',
  styleUrls: ['./button-set-v1.scss'],
})
export class ButtonSetV1 implements OnInit {

  static getClassName() {
    return 'ButtonSetV1';
  }

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }
}
