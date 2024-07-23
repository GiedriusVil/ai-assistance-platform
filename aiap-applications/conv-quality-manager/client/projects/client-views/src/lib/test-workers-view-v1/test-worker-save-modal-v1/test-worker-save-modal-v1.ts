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

import { isValidCron } from 'cron-validator';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  TEST_WORKER_MESSAGES,
} from 'client-utils';

import {
  TestWorkersService,
} from 'client-services';

@Component({
  selector: 'aiap-test-worker-save-modal-v1',
  templateUrl: './test-worker-save-modal-v1.html',
  styleUrls: ['./test-worker-save-modal-v1.scss']
})
export class TestWorkerSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TestWorkerSaveModalV1';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _selections: any = {
    instructionsExpanded: false,
  }

  _worker: any = {
    name: undefined,
    cronExpression: '*/10 * * * * *',
    configuration: {
      Capabilities: {
        PROJECTNAME: 'My Botium Project',
        TEMPDIR: '/tmp/botium-tmp',
        CONTAINERMODE: 'aca-socketio',
        SIMPLESOCKETIO_ENDPOINTURL: 'https://vba-chat-app-dev.968d96a4.public.multi-containers.ibm.com',
        SIMPLESOCKETIO_ENDPOINTPATH: '/socket.io',
        SIMPLESOCKETIO_EVENT_USERSAYS: 'message',
        SIMPLESOCKETIO_EVENT_BOTSAYS: 'message',
        ASSERTERS: [
          {
            ref: 'ACA_ATTACHMENT',
            src: 'botium-asserter-aca-attachment'
          }
        ]
      },
      Sources: {},
      Envs: {
        gAcaProps: {
          tenantId: 'b2bc-dev-tenant',
          assistantId: 'b2bc-assistant',
          engagementId: 'default',
          isoLang: 'en',
          user: {
            firstName: 'Oleg',
            lastName: 'Lukasonok',
            email: 'oleg.lukasonok@lt.ibm.com',
            country: {
              isoCode: 'eng'
            }
          }
        }
      }
    }
  };
  worker: any = lodash.cloneDeep(this._worker);
  selections: any = lodash.cloneDeep(this._selections);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private testWorkersService: TestWorkersService,
  ) {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'configuration';
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
    const WORKER = this.sanitizedValue();
    _debugX(TestWorkerSaveModalV1.getClassName(), 'save',
      {
        WORKER,
      });

    this.testWorkersService.saveOne(WORKER)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveWorkerError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TestWorkerSaveModalV1.getClassName(), 'save',
          {
            response,
          });

        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }

  loadFormData(id: any) {
    _debugX(TestWorkerSaveModalV1.getClassName(), 'loadFormData',
      {
        id,
      });

    this.testWorkersService.retrieveFormData(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRetrieveFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TestWorkerSaveModalV1.getClassName(), 'loadFormData',
          {
            response,
          });

        const WORKER = response?.worker;
        if (
          lodash.isEmpty(WORKER?.id)
        ) {
          this.worker = lodash.cloneDeep(this._worker);
        } else {
          this.worker = WORKER;
        }
        this.selections = lodash.cloneDeep(this._selections);
        _debugX(TestWorkerSaveModalV1.getClassName(), 'loadFormData',
          {
            this_selections: this.selections,
          });

        this.superShow();
        this.eventsService.loadingEmit(false);
      });
  }

  isCronExpressionInvalid() {
    let retVal = true;
    try {
      retVal = isValidCron(this.worker?.cronExpression, { seconds: true }) ? false : true;
    } catch (error) {
      //
    }
    return retVal;
  }

  private sanitizedValue() {
    const RET_VAL = lodash.cloneDeep(this.worker);
    RET_VAL.configuration = this.jsonEditor.get();
    return RET_VAL;
  }

  private handleRetrieveFormDataError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(TestWorkerSaveModalV1.getClassName(), 'handleRetrieveFormDataError',
      {
        error,
      });

    this.notificationService.showNotification(TEST_WORKER_MESSAGES.ERROR.RETRIEVE_FORM_DATA);
    return of();
  }

  private handleSaveWorkerError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(TestWorkerSaveModalV1.getClassName(), 'handleSaveWorkerError',
      {
        error,
      });

    this.notificationService.showNotification(TEST_WORKER_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  show(instanceId: any) {
    this.loadFormData(instanceId);
  }

}
