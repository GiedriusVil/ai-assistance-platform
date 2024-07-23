/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';


import {
  BaseViewV1,
} from 'client-shared-views';

import {
  OUTLETS,
  DEFAULT_TABLE,
} from 'client-utils';

@Component({
  selector: 'aiap-jobs-and-queues-board-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class JobsAndQueuesBoardViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'JobsAndQueuesBoardViewV1';
  }

  outlet = OUTLETS.tenantCustomizer;

  constructor(

  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToQueryParams();
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  subscribeToQueryParams() {

  }

}
