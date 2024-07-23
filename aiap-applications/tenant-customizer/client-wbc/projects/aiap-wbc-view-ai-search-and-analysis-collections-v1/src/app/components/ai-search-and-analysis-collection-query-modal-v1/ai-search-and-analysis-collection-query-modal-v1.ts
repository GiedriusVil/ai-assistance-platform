/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  BaseModal
} from 'client-shared-views';

import { NotificationServiceV2 } from 'client-shared-services';

import {
  _debugX,
} from 'client-shared-utils';

import {
  AiSearchAndAnalysisCollectionsServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-search-and-analysis-collection-query-modal-v1',
  templateUrl: './ai-search-and-analysis-collection-query-modal-v1.html',
  styleUrls: ['./ai-search-and-analysis-collection-query-modal-v1.scss']
})
export class AiSearchAndAnalysisCollectionsQueryModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisCollectionsQueryModalV1';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _state = {
    testing: false,
    query: '',
    response: undefined
  }

  ids: string[] = [];

  @Input() aiSearchAndAnalysisServiceId: string;
  @Input() aiSearchAndAnalysisProjectId: string;

  state: any = lodash.cloneDeep(this._state);

  constructor(
    private notificationService: NotificationServiceV2,
    private aiSearchAndAnalysisCollectionsService: AiSearchAndAnalysisCollectionsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Response';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.expandAll = true;
    this.jsonEditorOptions.modes = ['view'];
    this.jsonEditorOptions.mode = 'view';
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  queryMany() {
    const QUERY = this.state?.query;
    _debugX(AiSearchAndAnalysisCollectionsQueryModalV1.getClassName(), 'query',
      {
        aiSearchAndAnalysisServiceId: this.aiSearchAndAnalysisServiceId,
        aiSearchAndAnalysisProjectId: this.aiSearchAndAnalysisProjectId,
        ids: this.ids,
        QUERY
      });

    this.aiSearchAndAnalysisCollectionsService.queryManyByServiceProjectIdAndCollectionsIds(QUERY, {
      aiSearchAndAnalysisServiceId: this.aiSearchAndAnalysisServiceId,
      aiSearchAndAnalysisProjectId: this.aiSearchAndAnalysisProjectId,
      ids: this.ids,
    })
      .pipe(
        tap(() => {
          this.state.testing = true;
        }),
        catchError(error => this.handleQueryManyError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(AiSearchAndAnalysisCollectionsQueryModalV1.getClassName(), 'query',
          {
            response,
          });

        const STATE_NEW = lodash.cloneDeep(this.state);
        STATE_NEW.response = response;
        this.state = STATE_NEW;
        this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.SUCCESS.QUERY_MANY_BY_SERVICE_PROJECT_ID_AND_COLLECTIONS_IDS);
        this.state.testing = false;
      });
  }


  handleQueryManyError(error: any) {
    _debugX(AiSearchAndAnalysisCollectionsQueryModalV1.getClassName(), 'handleQueryManyError',
      {
        error,
      });

    this.state.testing = false;
    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.ERROR.QUERY_MANY_BY_SERVICE_PROJECT_ID_AND_COLLECTIONS_IDS);
    return of();
  }


  handleKeyCtrlDownEvent(event) {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      _debugX(AiSearchAndAnalysisCollectionsQueryModalV1.getClassName(), 'handleKeyCtrlDownEvent',
        {
          this_state: this.state,
        });

      this.queryMany();
    }
  }

  show(ids: string[]) {
    _debugX(AiSearchAndAnalysisCollectionsQueryModalV1.getClassName(), 'show',
      {
        ids,
      });

    if (
      lodash.isArray(ids)
    ) {
      this.state = lodash.cloneDeep(this._state);
      this.ids = lodash.cloneDeep(ids);
      this.isOpen = true;
    } else {
      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.ERROR.SHOW_QUERY_MODAL);
    }
  }

  handleEventQueryMany(event: any) {
    _debugX(AiSearchAndAnalysisCollectionsQueryModalV1.getClassName(), 'handleEventQueryMany',
      {
        event,
      });

    this.queryMany();
  }

}
