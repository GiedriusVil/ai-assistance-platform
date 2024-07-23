/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import { BaseModal } from 'client-shared-views';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  TEST_EXECUTION_MESSAGES,
} from 'client-utils';

import {
  TestExecutionsService,
} from 'client-services';

@Component({
  selector: 'aiap-test-execution-save-modal-v1',
  templateUrl: './test-execution-save-modal-v1.html',
  styleUrls: ['./test-execution-save-modal-v1.scss']
})
export class TestExecutionSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TestExecutionSaveModalV1';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _execution: any = {
    id: undefined,
    name: undefined,
    status: undefined,
    worker: {
      id: undefined,
    },
    testCase: {
      id: undefined,
      name: undefined
    },
    result: undefined,
  };
  _selections: any = {
    testCases: [],
    testCase: undefined,
    workers: [],
    worker: undefined,
    instructionsExpanded: false,
  }

  execution: any = lodash.cloneDeep(this._execution);
  selections: any = lodash.cloneDeep(this._selections);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private testExecutionsService: TestExecutionsService,
  ) {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'result';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['view'];
    this.jsonEditorOptions.mode = 'view';
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  save() {
    const EXECUTION = this.sanitizedValue();
    _debugX(TestExecutionSaveModalV1.getClassName(), 'save',
      {
        EXECUTION,
      });

    this.testExecutionsService.saveOne(EXECUTION)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TestExecutionSaveModalV1.getClassName(), 'save',
          {
            response,
          });

        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
        this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.SUCCESS.SAVE_ONE);
      });
  }

  loadFormData(id: any) {
    this.testExecutionsService.retrieveFormData(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRetrieveFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TestExecutionSaveModalV1.getClassName(), 'response:',
          {
            response,
          });

        const EXECUTION = response?.execution;
        if (
          lodash.isEmpty(EXECUTION?.id)
        ) {
          this.execution = lodash.cloneDeep(this._execution)
        } else {
          this.execution = EXECUTION;
        }
        this.selections = lodash.cloneDeep(this._selections);
        this.setWorkerSelections(response?.workers?.items);
        this.setTestCaseSelections(response?.testCases?.items);
        _debugX(TestExecutionSaveModalV1.getClassName(), 'loadFormData',
          {
            this_selections: this.selections,
          });

        this.superShow();
        this.eventsService.loadingEmit(false);
      });
  }

  private sanitizedValue() {
    const RET_VAL = lodash.cloneDeep(this.execution);
    const WORKER_ID = this.selections?.worker?.value;
    const WORKER_NAME = this.selections?.worker?.content;
    const TEST_CASE_ID = this.selections?.testCase?.value;
    const TEST_CASE_NAME = this.selections?.testCase?.content;
    RET_VAL.worker = {
      id: WORKER_ID,
      name: WORKER_NAME
    };
    RET_VAL.testCase = {
      id: TEST_CASE_ID,
      name: TEST_CASE_NAME
    }
    RET_VAL.status = 'PENDING';
    return RET_VAL;
  }

  private setTestCaseSelections(testCases: any) {
    this.selections.testCases = this.transformTestCasesIntoDropDownItems(testCases);
    for (const TEST_CASE of this.selections.testCases) {
      const TEST_CASE_ID_SELECTED = this.execution?.testCase?.id;
      if (
        TEST_CASE_ID_SELECTED === TEST_CASE?.value
      ) {
        TEST_CASE.selected = true;
        this.selections.testCase = TEST_CASE;
        break;
      }
    }
  }

  private transformTestCasesIntoDropDownItems(testCases: Array<any>) {
    const RET_VAL = [];
    if (
      lodash.isArray(testCases) &&
      !lodash.isEmpty(testCases)
    ) {
      for (const TEST_CASE of testCases) {
        if (
          lodash.isString(TEST_CASE?.name) &&
          !lodash.isEmpty(TEST_CASE?.name) &&
          lodash.isString(TEST_CASE?.id) &&
          !lodash.isEmpty(TEST_CASE?.id)
        ) {
          const OPTION = {
            content: TEST_CASE.name,
            value: TEST_CASE.id,
          }
          RET_VAL.push(OPTION);
        }
      }
    }
    return RET_VAL;
  }

  private setWorkerSelections(workers: any) {
    this.selections.workers = this.transformWorkersIntoDropDownItems(workers);
    for (const WORKER of this.selections.workers) {
      const WOKER_ID_SELECTED = this.execution?.worker?.id;
      if (
        WOKER_ID_SELECTED === WORKER?.value
      ) {
        WORKER.selected = true;
        this.selections.worker = WORKER;
        break;
      }
    }
  }

  private transformWorkersIntoDropDownItems(workers: Array<any>) {
    const RET_VAL = [];
    if (
      lodash.isArray(workers) &&
      !lodash.isEmpty(workers)
    ) {
      for (const WORKER of workers) {
        if (
          lodash.isString(WORKER?.name) &&
          !lodash.isEmpty(WORKER?.name) &&
          lodash.isString(WORKER?.id) &&
          !lodash.isEmpty(WORKER?.id)
        ) {
          const OPTION = {
            content: WORKER.name,
            value: WORKER.id,
          }
          RET_VAL.push(OPTION);
        }
      }
    }
    return RET_VAL;
  }

  private handleSaveOneError(error: any) {
    _errorX(TestExecutionSaveModalV1.getClassName(), 'handleSaveOneError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  private handleRetrieveFormDataError(error: any) {
    _errorX(TestExecutionSaveModalV1.getClassName(), 'handleRetrieveFormDataError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.ERROR.RETRIEVE_FORM_DATA);
    return of();
  }

  show(id: any) {
    this.loadFormData(id);
  }

}
