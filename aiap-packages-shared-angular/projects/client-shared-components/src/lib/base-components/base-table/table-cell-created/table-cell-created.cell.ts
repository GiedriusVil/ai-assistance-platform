/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';
import moment from 'moment';
import { SessionServiceV1 } from 'client-shared-services';

@Component({
  selector: 'aca-table-cell-created',
  templateUrl: './table-cell-created.cell.html',
  styleUrls: ['./table-cell-created.cell.scss'],
})
export class TableCellCreated implements OnInit {

  static getClassName() {
    return 'TableCellCreated';
  }

  @Input() value;

  constructor() { }

  ngOnInit(): void { }
}
