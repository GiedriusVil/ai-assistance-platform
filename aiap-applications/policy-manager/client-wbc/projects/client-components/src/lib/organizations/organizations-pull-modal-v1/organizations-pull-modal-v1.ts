/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  OrganizationsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-organizations-pull-modal-v1',
  templateUrl: './organizations-pull-modal-v1.html',
  styleUrls: ['./organizations-pull-modal-v1.scss']
})
export class OrganizationsPullModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'OrganizationsPullModal';
  }

  state: any = {
    query: {
      type: DEFAULT_TABLE.ORGANIZATIONS_V1.TYPE,
      sort: DEFAULT_TABLE.ORGANIZATIONS_V1.SORT,
    }
  };

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private organizationsService: OrganizationsServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit(): void { }

  pull() {
    _debugW(OrganizationsPullModalV1.getClassName(), 'pull', {});
    this.organizationsService.pull().pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.hanldePullError(error)),
      takeUntil(this._destroyed$)
    ).subscribe(() => {
      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('organizations_pull_modal_v1.notification.success.title'),
        message: this.translateService.instant('organizations_pull_modal_v1.notification.success.message'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.isOpen = false;
      this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
    });
  }

  hanldePullError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('organizations_pull_modal_v1.notification.success.title'),
      message: this.translateService.instant('organizations_pull_modal_v1.notification.error.message'),
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of({ items: [] });
  }

  show() {
    this.isOpen = true;
  }
}
