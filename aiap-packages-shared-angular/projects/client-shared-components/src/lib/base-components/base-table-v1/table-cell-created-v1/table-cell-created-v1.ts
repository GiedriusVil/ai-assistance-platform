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
  selector: 'aiap-table-cell-created-v1',
  templateUrl: './table-cell-created-v1.html',
  styleUrls: ['./table-cell-created-v1.scss'],
})
export class TableCellCreatedV1 implements OnInit {

  static getClassName() {
    return 'TableCellCreatedV1';
  }

  @Input() value;

  constructor() { }

  ngOnInit(): void { }

}
