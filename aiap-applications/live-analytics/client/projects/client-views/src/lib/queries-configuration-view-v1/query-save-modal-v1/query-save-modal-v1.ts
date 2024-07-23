/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { DEFAULT_CODE } from './query-save-modal-utils-v1';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  QueriesConfigurationsService
} from 'client-services'

import {
  QUERIES_CONFIGURATION_MESSAGES,
} from 'client-utils';

import { QueryHelpModalV1 } from '../query-help-modal-v1/query-help-modal-v1';


import { BaseModal } from 'client-shared-views';

@Component({
  selector: 'aiap-query-save-modal-v1',
  templateUrl: './query-save-modal-v1.html',
  styleUrls: ['./query-save-modal-v1.scss']
})
export class QuerySaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'QuerySaveModalV1';
  }

  @ViewChild('queryHelpModalV1') queryHelpModal: QueryHelpModalV1;

  isBaseUrlsPresent = false;

  _query: any = {
    id: '',
    ref: '',
    code: DEFAULT_CODE
  };

  query = lodash.cloneDeep(this._query);
  _state: any = {
    editor: {
      small: false,
    },
    errorsVisible: false,
    monacoOptions: {
      theme: 'hc-black',
      language: 'javascript',
      minimap: {
        enabled: false
      },
      automaticLayout: true,
      padding: {
        bottom: 20
      },
      scrollbar: {
        vertical: 'hidden'
      },
    }
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private queriesConfigurationService: QueriesConfigurationsService,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
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

  private handleKeyDownEvent(event: any) {
    if (
      event?.metaKey &&
      'KeyS' === event?.code
    ) {
      _debugX(QuerySaveModalV1.getClassName(), 'handleKeyDownEvent - on - Command + s', { event });
      this.save(false);
      event.preventDefault();
    }
    if (
      event?.metaKey &&
      'KeyQ' === event?.code
    ) {
      _debugX(QuerySaveModalV1.getClassName(), 'handleKeyDownEvent - on - Command + q ', { event });
      this.close();
      event.preventDefault();
    }
  }

  handleMonacoEditorInitEvent(editor: any) {
    _debugX(QuerySaveModalV1.getClassName(), 'handleMonacoEditorInitEvent', { editor });
    editor.onKeyDown(this.handleKeyDownEvent.bind(this));
  }

  show(queryId: string) {
    _debugX(QuerySaveModalV1.getClassName(), 'show', { queryId });
    if (
      lodash.isString(queryId) &&
      !lodash.isEmpty(queryId)
    ) {
      this.loadFormData(queryId);
    } else {
      this.query = lodash.cloneDeep(this._query);
      this.superShow();
    }
  }


  help() {
    this.queryHelpModal.show();
  }

  save(isFinalSave = true) {
    if (
      this.isLoading
    ) {
      return;
    }
    const QUERY = this.sanitizedModule();
    _debugX(QuerySaveModalV1.getClassName(), 'save', { QUERY });
    this.eventsService.loadingEmit(true);
    this.queriesConfigurationService.saveOne(QUERY)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe(() => {
        this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.loadingEmit(false);
        if (
          isFinalSave
        ) {
          this.eventsService.filterEmit(null);
          this.close();
        }
      });
  }

  handleEventSave(event: any) {
    _debugX(QuerySaveModalV1.getClassName(), 'handleEventSave',
      {
        event,
      });
    this.save();
  }

  private sanitizedModule() {
    const RET_VAL: any = lodash.cloneDeep(this.query);

    return RET_VAL;
  }

  loadFormData(id: any) {
    _debugX(QuerySaveModalV1.getClassName(), 'loadFormData', { id });
    this.state = lodash.cloneDeep(this._state);
    this.eventsService.loadingEmit(true);
    this.queriesConfigurationService.findOneById(id)
      .pipe(
        catchError((error) => this.handleRetrieveFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(QuerySaveModalV1.getClassName(), 'loadFormData', { response });
        this.query = response;
        this.state = lodash.cloneDeep(this.state);
        this.eventsService.loadingEmit(false);
        this.superShow();
        this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.SUCCESS.FIND_ONE_BY_ID);
        _debugX(QuerySaveModalV1.getClassName(), 'loadFormData', { this_state: this.state, this_module: this.query });
      });
  }

  private handleRetrieveFormDataError(error: any) {
    _debugX(QuerySaveModalV1.getClassName(), 'handleRetrieveFormDataError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  private handleSaveOneError(error: any) {
    _debugX(QuerySaveModalV1.getClassName(), 'handleSaveOneError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.ERROR.SAVE_ONE);
    const ERROR_MESSAGE = error?.error?.errors?.[0]?.message;
    if (!lodash.isEmpty(ERROR_MESSAGE)) {
      const NOTIFICATION_WITH_ERROR = lodash.cloneDeep(QUERIES_CONFIGURATION_MESSAGES.ERROR.SAVE_ONE);
      NOTIFICATION_WITH_ERROR.message = ERROR_MESSAGE;
      this.notificationService.showNotification(NOTIFICATION_WITH_ERROR);
    }
    return of();
  }
}
