/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService
} from 'client-shared-carbon';

import {
  _debugX,
} from 'client-shared-utils';

import {
  BaseModal
} from 'client-shared-views';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  TenantsServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-tenant-delete-modal-v1',
  templateUrl: './tenant-delete-modal-v1.html',
  styleUrls: ['./tenant-delete-modal-v1.scss'],
})
export class TenantDeleteModalV1 extends BaseModal implements OnInit {

  static getClassName() {
    return 'TenantDeleteModalV1';
  }

  _tenants: any = [];
  tenants: any = lodash.cloneDeep(this._tenants);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private tenantsService: TenantsServiceV1,
  ) {
    super();
  }


  ngOnInit() {
    //
  }

  hanldeDeleteManyByIds() {
    _debugX(TenantDeleteModalV1.getClassName(), 'hanldeDeleteManyByIds',
      {
        tenants: this.tenants,
      });

    this.tenantsService.deleteManyByIds(this.tenants)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.hanldeDeleteManyByIdsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TenantDeleteModalV1.getClassName(), 'hanldeDeleteManyByIds',
          {
            response,
          });

        const NOTIFICATION = {
          type: 'success',
          title: 'Tenants were deleted',
          target: '.notification-container',
          duration: 10000
        }
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }

  hanldeDeleteManyByIdsError(error: any) {
    _debugX(TenantDeleteModalV1.getClassName(), 'hanldeDeleteManyByIdsError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable to delete tenants',
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(tenants: Array<any>) {
    _debugX(TenantDeleteModalV1.getClassName(), 'show',
      {
        tenants,
      });

    if (
      !lodash.isEmpty(tenants)
    ) {
      this.tenants = lodash.cloneDeep(tenants);
      this.superShow();
    }
  }
}
