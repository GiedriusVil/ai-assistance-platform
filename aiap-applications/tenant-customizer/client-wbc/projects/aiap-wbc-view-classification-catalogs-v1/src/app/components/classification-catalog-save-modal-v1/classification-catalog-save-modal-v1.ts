/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { of } from 'rxjs';

import { catchError, takeUntil, tap } from 'rxjs/operators';

import {
  BaseModalV1
} from 'client-shared-views';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';
import { ClassificationCatalogsServiceV1 } from 'client-services';

@Component({
  selector: 'aiap-classification-catalog-save-modal-v1',
  templateUrl: './classification-catalog-save-modal-v1.html',
  styleUrls: ['./classification-catalog-save-modal-v1.scss'],
})
export class ClassificationCatalogSaveModalV1 extends BaseModalV1 implements OnInit, AfterViewInit {

  static getClassName() {
    return 'ClassificationCatalogSaveModalV1';
  }

  isIdFieldEnabled = true;

  _state = {
    id: undefined,
    name: undefined,
    created: undefined,
    createdBy: undefined,
    updated: undefined,
    updatedBy: undefined,
  }

  state: any = lodash.cloneDeep(this._state);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private catalogService: ClassificationCatalogsServiceV1,
  ) {
    super();
  }

  private sendErrorNotification(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable to process action',
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  loadFormData(id: any) {
    this.catalogService.getViewData({
      id: id
    }).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.sendErrorNotification(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(ClassificationCatalogSaveModalV1.getClassName(), 'loadFormData', { response });
      const CATALOG = ramda.path(['catalog'], response);
      if (
        lodash.isEmpty(CATALOG)
      ) {
        this.state = lodash.cloneDeep(this._state);
      } else {
        this.state = CATALOG;
      }
      this.superShow();
      this.eventsService.loadingEmit(false);
    });
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  handleSaveApplicationError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification({
      type: 'error',
      title: 'Unable to save catalog',
      target: '.notification-container',
      duration: 10000
    });
    return of();
  }

  /* Switch is required here */
  public save() {
    _debugX(ClassificationCatalogSaveModalV1.getClassName(), 'save',
      {
        this_state: this.state,
      });

    const CATALOG = this.state;

    this.catalogService.save(CATALOG).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleSaveApplicationError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(ClassificationCatalogSaveModalV1.getClassName(), 'save', { response });
      this.eventsService.loadingEmit(false);
      this.close();
    });
  }


  show(catalog: any) {
    _debugX(ClassificationCatalogSaveModalV1.getClassName(), 'show', { catalog });
    const CATALOG_ID = catalog?.value?.id;
    if (
      lodash.isString(CATALOG_ID) &&
      !lodash.isEmpty(CATALOG_ID)
    ) {
      this.isIdFieldEnabled = false;
      this.loadFormData(CATALOG_ID);
    } else {
      this.isIdFieldEnabled = true;
      this.state = lodash.cloneDeep(this._state);
      this.isOpen = true;
    }
  }

  close() {
    super.close();
    this.eventsService.filterEmit(undefined);
  }

}
