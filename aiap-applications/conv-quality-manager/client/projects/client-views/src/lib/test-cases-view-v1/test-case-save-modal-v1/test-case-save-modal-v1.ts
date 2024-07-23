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
  TEST_CASE_MESSAGES,
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
  TestCasesService
} from 'client-services';

@Component({
  selector: 'aiap-test-case-save-modal-v1',
  templateUrl: './test-case-save-modal-v1.html',
  styleUrls: ['./test-case-save-modal-v1.scss'],
})
export class TestCaseSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TestCaseSaveModalV1';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _testCase: any = {
    key: undefined,
    name: undefined,
    worker: {
      id: undefined,
    },
    tags: undefined,
    description: undefined,
    script: {
      convos: [
        {
          name: 'item is not in the list I have provided path',
          description: 'item is not in the list I have provided path',
          steps: [
            {
              begin: [
                {
                  logichook: 'PAUSE',
                  args: '5000'
                }
              ]
            },
            {
              me: [
                '',
                'PAUSE 1000',
              ]
            },
            {
              bot: [
                'Hello Albert,',
              ]
            },
            {
              bot: [
                'I’m your Client Virtual Agent. How can I help you today?'
              ]
            },
            {
              me: [
                'i want to buy a chair", "PAUSE 15000',
              ]
            },
            {
              bot: [
                'Please confirm which of provided categories matches your request.',
              ]
            },
            {
              me: [
                'something else'
              ]
            },
            {
              bot: [
                'Unfortunately your requested item is not in the list I have provided. Would you like to try again?',
                {
                  asserter: 'ACA_ATTACHMENT',
                  args: [
                    {
                      type: 'buttons',
                      attachments: [
                        {
                          type: 'text',
                          title: 'Try again',
                          payload: 'Try again',
                        },
                        {
                          type: 'text',
                          title: 'Transfer to live agent',
                          payload: 'Transfer to live agent',
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              me: [
                'Try again',
              ]
            }
          ]
        }
      ]
    },
  };
  _selections: any = {
    workers: [],
    worker: undefined,
    instructionsExpanded: false,
  }
  testCase: any = lodash.cloneDeep(this._testCase);
  selections: any = lodash.cloneDeep(this._selections);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private testCasesService: TestCasesService,
  ) {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'script';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.jsonEditorOptions.mode = 'code';
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  save() {
    const TEST_CASE = this.sanitizedValue();
    _debugX(TestCaseSaveModalV1.getClassName(), 'save',
      {
        TEST_CASE,
      });

    this.testCasesService.saveOne(TEST_CASE)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TestCaseSaveModalV1.getClassName(), 'save', {
          response,
        });

        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }

  loadFormData(id: any) {
    _debugX(TestCaseSaveModalV1.getClassName(), 'loadFormData',
      {
        id,
      });

    this.testCasesService.retrieveFormData(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleLoadFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TestCaseSaveModalV1.getClassName(), 'response',
          {
            response,
          });

        const TEST_CASE = response?.testCase;
        if (
          lodash.isEmpty(TEST_CASE?.id)
        ) {
          this.testCase = lodash.cloneDeep(this._testCase);
        } else {
          this.testCase = TEST_CASE;
        }
        this.selections = lodash.cloneDeep(this._selections);
        this.setWorkerSelections(response?.workers?.items);
        _debugX(TestCaseSaveModalV1.getClassName(), 'loadFormData',
          {
            this_selections: this.selections,
          });

        this.superShow();
        this.eventsService.loadingEmit(false);
      });
  }

  private sanitizedValue() {
    const RET_VAL = lodash.cloneDeep(this.testCase);
    const WORKER_ID = this.selections?.worker?.value;
    RET_VAL.script = this.jsonEditor.get();
    RET_VAL.worker = {
      id: WORKER_ID,
    }
    return RET_VAL;
  }

  private setWorkerSelections(workers: any) {
    this.selections.workers = this.transformWorkersIntoDropDownItems(workers);
    for (const WORKER of this.selections.workers) {
      const WOKER_ID_SELECTED = this.testCase?.worker?.id;
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
            value: WORKER.id
          }
          RET_VAL.push(OPTION);
        }
      }
    }
    return RET_VAL;
  }

  private handleLoadFormDataError(error: any) {
    _errorX(TestCaseSaveModalV1.getClassName(), 'handleLoadFormDataError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TEST_CASE_MESSAGES.ERROR.LOAD_FORM_DATA);
    return of();
  }

  private handleSaveOneError(error: any) {
    _errorX(TestCaseSaveModalV1.getClassName(), 'handleSaveOneError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TEST_CASE_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  show(id: any) {
    _debugX(TestCaseSaveModalV1.getClassName(), 'show:',
      {
        id,
      });

    this.loadFormData(id);
  }

}
