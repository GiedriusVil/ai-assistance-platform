/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnInit } from '@angular/core';

import * as ramda from 'ramda';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

@Component({
  selector: 'aca-diagram-editor-view',
  templateUrl: './diagram-editor-view-v1.html',
  styleUrls: ['./diagram-editor-view-v1.scss']
})
export class DiagramEditorView extends BaseView implements OnInit, AfterViewInit {

  static getClassName() {
    return 'DiagramEditorView';
  }

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    queryType: DEFAULT_TABLE.CLASSIFIER.TYPE,
    defaultSort: DEFAULT_TABLE.CLASSIFIER.SORT,
    search: '',
  };

  constructor(
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }


  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'diagram-editor',
      children: [
        ...children,
        {
          path: '',
          component: DiagramEditorView,
          data: {
            breadcrumb: 'Diagram Editor',
            name: 'Diagram Editor',
            component: DiagramEditorView.getClassName(),
            description: 'Enables access to Diagram Editor view',
            actions: []
          }
        }
      ],
      data: {
        breadcrumb: 'Diagram Editor',
      }
    };
    return RET_VAL;
  }
}
