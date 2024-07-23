/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  EventsServiceV1,
  CatalogRulesCatalogsService
} from 'client-services';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  TranslateHelperServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aca-catalog-rules-catalog-delete-modal',
  templateUrl: './catalog-rules-catalog-delete.modal.html',
  styleUrls: ['./catalog-rules-catalog-delete.modal.scss']
})
export class CatalogRulesCatalogDeleteModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'CatalogRulesCatalogDeleteModal';
  }

  private _destroyed$: Subject<void> = new Subject();

  isOpen = false;

  _catalogIds: any = [];
  catalogIds: any = lodash.cloneDeep(this._catalogIds);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private catalogRulesCatalogService: CatalogRulesCatalogsService,
    private translateService: TranslateHelperServiceV1,
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  delete() {
    this.catalogRulesCatalogService.deleteManyByIds(this.catalogIds)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.hanldeDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(CatalogRulesCatalogDeleteModal.getClassName(), 'delete', { response });
        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('catalog_rules.delete_modal.notification.success.title'),
          target: '.notification-container',
          duration: 5000
        };
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.isOpen = false;
        this.eventsService.catalogRuleCatalogsEmit(undefined);
      });
  }

  hanldeDeleteManyByIdsErrors(error: any) {
    _debugX(CatalogRulesCatalogDeleteModal.getClassName(), 'hanldeDeleteManyByIdsErrors', { error });
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('catalog_rules.delete_modal.notification.error.title'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(catalogIds: any) {
    if (
      !lodash.isEmpty(catalogIds)
    ) {
      this.catalogIds = lodash.cloneDeep(catalogIds);
      this.isOpen = true;
    } else {
      const NOTIFICATION = {
        type: 'error',
        title: this.translateService.instant('catalog_rules.delete_modal.notification.error.title'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
    }
  }

  close() {
    this.isOpen = false;
  }

}
