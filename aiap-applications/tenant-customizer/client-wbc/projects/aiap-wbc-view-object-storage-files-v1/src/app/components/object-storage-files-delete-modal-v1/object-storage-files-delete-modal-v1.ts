/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views';


import {
  ObjectStorageFilesServiceV1,
} from 'client-services';

import {
  OBJECT_STORAGE_FILES_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-object-storage-files-delete-modal-v1',
  templateUrl: './object-storage-files-delete-modal-v1.html',
  styleUrls: ['./object-storage-files-delete-modal-v1.scss']
})
export class ObjectStorageFilesDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ObjectStorageFilesDeleteModalV1';
  }

  _ids: Array<any> = [];
  ids: Array<any>;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private objectStorageFilesService: ObjectStorageFilesServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  show(ids: any) {
    if (
      lodash.isArray(ids) &&
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.isOpen = true;
    } else {
      this.notificationService.showNotification(OBJECT_STORAGE_FILES_MESSAGES.ERROR.SHOW_DELETE_MODAL);
    }
  }

  delete(): void {
    _debugX(ObjectStorageFilesDeleteModalV1.getClassName(), 'delete',
      {
        this_ids: this.ids,
      });

    this.objectStorageFilesService.deleteManyByIds(this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeleteManyByIdsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ObjectStorageFilesDeleteModalV1.getClassName(), 'delete',
          {
            response,
          });

        this.notificationService.showNotification(OBJECT_STORAGE_FILES_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.isOpen = false;
        this.eventsService.filterEmit(null);
      });
  }

  handleDeleteManyByIdsError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(ObjectStorageFilesDeleteModalV1.getClassName(), 'handleDeleteOneByIdError',
      {
        error,
      });

    this.notificationService.showNotification(OBJECT_STORAGE_FILES_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  handleEventDelete(event: any) {
    _debugX(ObjectStorageFilesDeleteModalV1.getClassName(), 'handleEventDelete',
      {
        event,
      });

    this.delete();
  }

}
