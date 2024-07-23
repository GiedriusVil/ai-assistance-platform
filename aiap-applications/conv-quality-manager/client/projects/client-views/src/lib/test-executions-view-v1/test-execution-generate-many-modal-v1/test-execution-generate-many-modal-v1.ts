/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  JsonEditorOptions,
  JsonEditorComponent
} from 'ang-jsoneditor';

import {
  TEST_EXECUTION_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  TestExecutionsService,
} from 'client-services';


@Component({
  selector: 'aiap-test-execution-generate-many-modal-v1',
  templateUrl: './test-execution-generate-many-modal-v1.html',
  styleUrls: ['./test-execution-generate-many-modal-v1.scss']
})
export class TestExecutionGenerateManyModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TestExecutionGenerateManyModalV1';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _selections: any = {
    testCases: [],
    testCase: undefined,
    workers: [],
    workersSelected: undefined,
    quantity: 1,
  }
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
    this.jsonEditorOptions.modes = ['tree'];
    this.jsonEditorOptions.mode = 'tree';
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  generate() {
    const GENERATE_MANY_PARAMS = this.sanitizedValue();
    _debugX(TestExecutionGenerateManyModalV1.getClassName(), 'generate',
      {
        GENERATE_MANY_PARAMS,
      });

    this.testExecutionsService.generateMany(GENERATE_MANY_PARAMS)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleGenerateManyError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TestExecutionGenerateManyModalV1.getClassName(), 'generate',
          {
            response,
          });

        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
        this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.SUCCESS.GENERATE_MANY);
      });
  }

  loadFormData() {
    this.testExecutionsService.retrieveFormData(undefined)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRetrieveFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TestExecutionGenerateManyModalV1.getClassName(), 'response:',
          {
            response,
          });

        this.selections = lodash.cloneDeep(this._selections);
        this.setWorkerSelections(response?.workers?.items);
        this.setTestCaseSelections(response?.testCases?.items);
        _debugX(TestExecutionGenerateManyModalV1.getClassName(), 'loadFormData',
          {
            this_selections: this.selections,
          });

        this.superShow();
        this.eventsService.loadingEmit(false);
      });
  }

  private sanitizedValue() {
    try {
      const TEST_CASE_ID = this.selections?.testCase?.value;
      const WORKER_IDS = this.selections?.workersSelected.map((item) => item?.value);
      const QUANTITY = this.selections?.quantity;
      const RET_VAL = {
        testCase: {
          id: TEST_CASE_ID,
        },
        worker: {
          ids: WORKER_IDS,
        },
        quantity: QUANTITY
      };
      return RET_VAL;
    } catch (error) {
      _errorX(TestExecutionGenerateManyModalV1.getClassName(), 'sanitizedValue:',
        {
          error,
        });
    }
  }

  private setTestCaseSelections(testCases: any) {
    this.selections.testCases = this.transformTestCasesIntoDropDownItems(testCases);
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
            value: TEST_CASE.id
          }
          RET_VAL.push(OPTION);
        }
      }
    }
    return RET_VAL;
  }

  private setWorkerSelections(workers: any) {
    this.selections.workers = this.transformWorkersIntoDropDownItems(workers);
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

  private handleGenerateManyError(error: any) {
    _errorX(TestExecutionGenerateManyModalV1.getClassName(), 'handleGenerateManyError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.ERROR.GENERATE_MANY);
    return of();
  }

  private handleRetrieveFormDataError(error: any) {
    _errorX(TestExecutionGenerateManyModalV1.getClassName(), 'handleRetrieveFormDataError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.ERROR.RETRIEVE_FORM_DATA);
    return of();
  }

  show() {
    this.loadFormData();
  }

}
