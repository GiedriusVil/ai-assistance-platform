/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService
} from 'carbon-components-angular';

import {
  _errorW,
  _debugW,
} from 'client-shared-utils';

import {
  BaseModal
} from 'client-shared-views';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_VALIDATION_ENGAGEMENTS_SCHEMA_V1,
  DEFAULT_VALIDATION_ENGAGEMENTS_ACTIONS_V1,
} from 'client-utils';

import {
  VALIDATION_ENGAGEMENTS_MESSAGES_V1,
  ValidationEngagementsServiceV1,
} from 'client-services';

import {
  ValidationEngagementsActionsTabV1,
  ValidationEngagementsSchemasTabV1,
} from '.';

@Component({
  selector: 'aiap-wbc-validation-engagements-save-modal-v1',
  templateUrl: './validation-engagements-save-modal-v1.html',
  styleUrls: ['./validation-engagements-save-modal-v1.scss'],
})
export class ValidationEngagementsSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ValidationEngagementsSaveModalV1';
  };

  @ViewChild("schemaTab", { static: true }) schemaTab: ValidationEngagementsSchemasTabV1;
  @ViewChild("actionsTab", { static: true }) actionsTab: ValidationEngagementsActionsTabV1;

  _state: any = {
    actions: {
      value: DEFAULT_VALIDATION_ENGAGEMENTS_ACTIONS_V1,
    }
  }
  state = lodash.cloneDeep(this._state);

  _value: any = {
    key: undefined,
    description: undefined,
    schema: {
      value: DEFAULT_VALIDATION_ENGAGEMENTS_SCHEMA_V1,
    },
    actions: JSON.parse(DEFAULT_VALIDATION_ENGAGEMENTS_ACTIONS_V1),
  }
  value = lodash.cloneDeep(this._value);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private validationEngagementsService: ValidationEngagementsServiceV1,
  ) {
    super();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() { }

  loadFormData(id: string) {
    this.eventsService.loadingEmit(true);
    this.validationEngagementsService.findOneById(id)
      .pipe(
        catchError((error) => this.handleRetrieveFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugW(ValidationEngagementsSaveModalV1.getClassName(), 'loadFormData', { response });
        const STATE = lodash.cloneDeep(this.state);
        const VALUE = response;
        if (
          !lodash.isEmpty(VALUE?.actions)
        ) {
          STATE.actions.value = JSON.stringify(VALUE?.actions, null, 2);
        }
        this.state = STATE;
        if (
          lodash.isEmpty(VALUE)
        ) {
          this.value = lodash.cloneDeep(this._value);
        } else {
          this.value = VALUE;
        }
        this.eventsService.loadingEmit(false);
        this.superShow();

        this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.SUCCESS.FIND_ONE_BY_KEY());
        _debugW(ValidationEngagementsSaveModalV1.getClassName(), 'loadFormData', {
          this_state: this.state,
          this_value: this.value,
        });
      });
  }

  handleRetrieveFormDataError(error: any) {
    _debugW(ValidationEngagementsSaveModalV1.getClassName(), 'handleRetrieveFormDataError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.ERROR.FIND_ONE_BY_KEY());
    this.close();
    return of();
  }

  show(key: string) {
    this.value = lodash.cloneDeep(this._value);
    this.schemaTab.createMonacoEditor();
    this.actionsTab.createMonacoEditor();
    if (
      !lodash.isEmpty(key)
    ) {
      this.loadFormData(key);
    }
    else {
      this.superShow();
    }
  }

  close() {
    this.schemaTab.clearMonacoContainer();
    this.actionsTab.clearMonacoContainer();
    this.enableBodyScroll();
    this.isOpen = false;
  }

  private sanitizedValue() {
    const RET_VAL = lodash.cloneDeep(this.value);
    try {
      RET_VAL.actions = JSON.parse(this.state.actions.value);
      _debugW(
        ValidationEngagementsSaveModalV1.getClassName(),
        'sanitizedValue',
        {
          this_state_actions: this.state.actions,
          RET_VAL: RET_VAL,
        });

    } catch (error) {
      _errorW(
        ValidationEngagementsSaveModalV1.getClassName(),
        'sanitizedValue',
        {
          error: error,
          this_state_actions: this.state.actions,
          RET_VAL: RET_VAL
        });
      RET_VAL.actions = this._value?.actions;
    }
    return RET_VAL;
  }

  save() {
    const VALUE = this.sanitizedValue();
    _debugW(ValidationEngagementsSaveModalV1.getClassName(), 'save', { VALUE });
    this.validationEngagementsService.saveOne(VALUE)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugW(ValidationEngagementsSaveModalV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.SUCCESS.SAVE_ONE());
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        this.close();
      });
  }

  handleSaveOneError(error: any) {
    _errorW(ValidationEngagementsSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.ERROR.SAVE_ONE());
    this.close();
    return of();
  }

  isValid() {
    const RET_VAL =
      !lodash.isEmpty(this.value.key) &&
      this.schemaTab.isValid() &&
      this.actionsTab.isValid();
    return RET_VAL;
  }
}
