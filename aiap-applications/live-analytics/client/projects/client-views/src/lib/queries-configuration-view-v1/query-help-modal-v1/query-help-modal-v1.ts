/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  QUERY_EXAMPLE_AGGREGATIONS,
  QUERY_EXAMPLE_RETRIEVE_DATA,
  QUERY_EXAMPLE_TRANSFORM_RESULTS,
} from './query-examples';

@Component({
  selector: 'aiap-query-help-modal-v1',
  templateUrl: './query-help-modal-v1.html',
  styleUrls: ['./query-help-modal-v1.scss']
})
export class QueryHelpModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'QueryHelpModalV1';
  }

  markdown: string = `
  ----
  ### HotKeys
  - Command + s -> Save's Query.
  ----

  ${QUERY_EXAMPLE_RETRIEVE_DATA}

  ${QUERY_EXAMPLE_AGGREGATIONS}
  
  ${QUERY_EXAMPLE_TRANSFORM_RESULTS}
  `;

  constructor(
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  show() {
    this.superShow();
  }

}
