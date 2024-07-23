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
  selector: 'aiap-table-v1-container-v1',
  templateUrl: './table-v1-container-v1.html',
  styleUrls: ['./table-v1-container-v1.scss'],
})
export class TableV1ContainerV1 implements OnInit {

  static getClassName() {
    return 'TableV1ContainerV1';
  }

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

}
