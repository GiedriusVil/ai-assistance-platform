/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { _debugX } from 'client-shared-utils';

import lodash from 'lodash';

@Component({
  selector: 'aiap-table-v1-header-v1',
  templateUrl: './table-v1-header-v1.html',
  styleUrls: ['./table-v1-header-v1.scss'],
})
export class TableV1HeaderV1 implements OnInit {

  static getClassName() {
    return 'TableV1HeaderV1';
  }

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

}
