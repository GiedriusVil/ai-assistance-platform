/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';
import moment from 'moment-timezone'
import { SessionServiceV1 } from 'client-shared-services';
import { LocalePipe } from '../../../pipes';

@Component({
  selector: 'aca-table-cell-updated',
  templateUrl: './table-cell-updated.cell.html',
  styleUrls: ['./table-cell-updated.cell.scss'],
})
export class TableCellUpdated implements OnInit, OnDestroy {

  static getClassName() {
    return 'TableCellCreated';
  }

  @Input() value;

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

}
