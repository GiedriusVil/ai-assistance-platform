/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';
import moment from 'moment-timezone'

import { SessionServiceV1 } from 'client-shared-services';

@Component({
  selector: 'aiap-table-cell-external-v1',
  templateUrl: './table-cell-external-v1.html',
  styleUrls: ['./table-cell-external-v1.scss'],
})
export class TableCellExternalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'TableCellExternalV1';
  }

  @Input() value;

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

}
