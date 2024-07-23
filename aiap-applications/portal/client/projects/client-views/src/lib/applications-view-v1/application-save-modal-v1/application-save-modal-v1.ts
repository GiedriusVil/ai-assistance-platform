/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'client-shared-carbon';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  BaseModal,
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  ApplicationsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-application-save-modal-v1',
  templateUrl: './application-save-modal-v1.html',
  styleUrls: ['./application-save-modal-v1.scss']
})
export class ApplicationSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ApplicationSaveModalV1';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  configuration: any = {};

  _application: any = {
    id: undefined,
    name: undefined,
    configuration: undefined
  }
  application: any = lodash.cloneDeep(this._application);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private applicationsService: ApplicationsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
    this.jsonEditorOptions.name = 'Configuration';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.mode = 'code';
    this.jsonEditorOptions.modes = ['code', 'text', 'tree', 'view'];
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  save() {
    _debugX(ApplicationSaveModalV1.getClassName(), 'save',
      {
        this_segment: this.configuration,
        jsonEditorValue: this.jsonEditor.get()
      });

    this.application.configuration = this.jsonEditor.get();
    this.applicationsService.saveOne(this.application)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveApplicationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ApplicationSaveModalV1.getClassName(), 'save',
          {
            response,
          });

        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }

  handleSaveApplicationError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable to save application',
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  loadViewData(id: any) {
    this.applicationsService.retrieveApplicationFormData(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveApplicationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        this.application = response?.application;
        this.eventsService.loadingEmit(false);
      });
  }

  show(applicationId: any) {

    if (applicationId) {
      this.loadViewData(applicationId);
    } else {
      this.application = lodash.cloneDeep(this._application);
    }
    this.superShow();
  }

}
