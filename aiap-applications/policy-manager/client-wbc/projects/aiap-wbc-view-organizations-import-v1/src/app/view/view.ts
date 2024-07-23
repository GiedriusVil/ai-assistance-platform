/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  FileUploaderV1,
} from 'client-shared-components';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  OrganizationsImportServiceV1,
} from 'client-services';

import {
  OrganizationDeleteModalV1,
  OrganizationSaveModalV1,
} from 'client-components';

import {
  OrganizationClearModalV1,
} from '.';

@Component({
  selector: 'aiap-wbc-organizations-import-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class OrganizationsImportViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'OrganizationsImportViewV1';
  }

  @ViewChild('fileUpload') fileUpload: FileUploaderV1;

  @ViewChild('organizationSaveModalV1') organizationSaveModalV1: OrganizationSaveModalV1;
  @ViewChild('organizationDeleteModalV1') organizationDeleteModalV1: OrganizationDeleteModalV1;
  @ViewChild('organizationClearModalV1') organizationClearModalV1: OrganizationClearModalV1;

  query: any = {
    filter: {
      organizationId: undefined
    },
    sort: {
      field: 'id',
      direction: 'desc'
    },
    pagination: {
      page: 1,
      size: 10,
    }
  };

  current: number = 0;
  unsubmittedOrganizationCount: number = 0;

  _state: any = {
    query: {
      type: DEFAULT_TABLE.ORGANIZATIONS_V1.TYPE,
      sort: DEFAULT_TABLE.ORGANIZATIONS_V1.SORT,
    },
    filterByWarning: false,
    ready: false,
  };
  state = lodash.cloneDeep(this._state);

  steps: any = [
    {
      text: this.translateService.instant('organizations_import_v1.view.steps.import'),
      state: ["current"],
    },
    {
      text: this.translateService.instant('organizations_import_v1.view.steps.review'),
      state: ["incomplete"],
    },
    {
      text: this.translateService.instant('organizations_import_v1.view.steps.submit'),
      state: ["completed"],
    },
  ];

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-super
    private router: Router,
    private organizationsImportService: OrganizationsImportServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit() {
    this.startImportTracking();
    this.state.filterByWarning = this.queryService.getFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.IS_RULES_WITH_WARNING);
    this.eventsService.filterEmit({});
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  startImportTracking() {
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(() => {
        return this.organizationsImportService.findManyByQuery(this.query).pipe(
          catchError(error => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(OrganizationsImportViewV1.getClassName(), `startImportTracking`, { response });

      const IMPORT_ITEMS_TOTAL = ramda.path(['total'], response);
      const IMPORT_ITEMS: any = ramda.path(['items'], response);

      if (
        IMPORT_ITEMS_TOTAL > 0 &&
        this.current < 1
      ) {
        this.current = 1;
      }
      this.state.ready = IMPORT_ITEMS.every(
        r => r.id && r.external.id && r.name
      );
      this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('organizations_import_v1.view.notification.error.title'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  stepSelected(event: any) { }

  onFileUploadedSuccess($event) {
    if (!lodash.isEmpty($event) && $event.values()) {
      const ITERATOR = $event.values();
      const FILE: any = ramda.path(['value', 'file'], ITERATOR.next());

      this.organizationsImportService.uploadFile(FILE).pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.hanldeFileUploadError(error)),
        takeUntil(this._destroyed$)
      ).subscribe(response => {
        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('organizations_import_v1.view.notification.success.title.file_upload'),
          target: '.notification-container',
          duration: 5000
        };
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.next();
      });
    }
  }

  next() {
    this.current += 1;
  }

  back() {
    this.current -= 1;
  }

  cancel() { }


  hanldeFileUploadError(error: any) {
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('organizations_import_v1.view.notification.error.title.import'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  import() {
    this.organizationsImportService.submitImport().pipe(
      catchError(error => this.hanldeFileUploadError(error)),
      takeUntil(this._destroyed$),
    ).subscribe(response => {
      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('organizations_import_v1.view.notification.success.title.import'),
        target: '.notification-container',
        duration: 5000
      };
      this.next();
      this.notificationService.showNotification(NOTIFICATION);
    });
  }

  showSaveModal(event: any = undefined) {
    this.organizationSaveModalV1.show(event?.value);
  }

  showDeleteModal(event: any) {
    this.organizationDeleteModalV1.show(event?.item);
  }

  showClearModal(event: any) {
    this.organizationClearModalV1.show(event);
  }

  routeToOrganizationView() {
    this.router.navigateByUrl('/main-view/organizations');
  }

  handleSearchChangeEvent(event: any) {
    _debugW(OrganizationsImportViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleSearchClearEvent(event: any) {
    _debugW(OrganizationsImportViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleShowOrganizationDeleteModal(ids: any[]) {
    _debugW(OrganizationsImportViewV1.getClassName(), `handleShowOrganizationDeleteModal`, { ids });
    this.organizationDeleteModalV1.show(ids);
  }

}
