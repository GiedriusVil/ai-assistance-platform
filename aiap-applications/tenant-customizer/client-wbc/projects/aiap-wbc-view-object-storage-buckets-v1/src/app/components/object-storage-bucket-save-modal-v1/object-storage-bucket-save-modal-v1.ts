/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  takeUntil,
} from 'rxjs/operators';

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
  ObjectStorageBucketsServiceV1,
} from 'client-services';

import {
  OBJECT_STORAGE_BUCKETS_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-object-storage-bucket-save-modal-v1',
  templateUrl: './object-storage-bucket-save-modal-v1.html',
  styleUrls: ['./object-storage-bucket-save-modal-v1.scss']
})
export class ObjectStorageBucketSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewChecked {

  static getClassName() {
    return 'ObjectStorageBucketSaveModalV1';
  }

  isLoading = false;

  _value = {
    id: null,
    reference: null,
  };
  value: any = lodash.cloneDeep(this._value);

  constructor(
    //
    private changeDetectorRef: ChangeDetectorRef,
    //
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private objectStorageBucketsServiceV1: ObjectStorageBucketsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  _sanitizedValue() {
    const RET_VAL = lodash.cloneDeep(this.value);

    return RET_VAL;
  }

  save() {
    const VALUE = this._sanitizedValue();
    _debugX(ObjectStorageBucketSaveModalV1.getClassName(), 'save',
      {
        this_value: this.value,
        VALUE: VALUE,
      });

    this.eventsService.loadingEmit(true);
    this.objectStorageBucketsServiceV1.saveOne(VALUE)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ObjectStorageBucketSaveModalV1.getClassName(), 'save',
          {
            response,
          });

        this.notificationService.showNotification(OBJECT_STORAGE_BUCKETS_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        this.isOpen = false;
      });
  }

  show(value: any = null) {
    _debugX(ObjectStorageBucketSaveModalV1.getClassName(), 'show',
      {
        value,
      });
    let valueNew;
    if (
      lodash.isEmpty(value?.id)
    ) {
      valueNew = lodash.cloneDeep(this._value);
    } else {
      valueNew = lodash.cloneDeep(value);
    }
    this.value = valueNew;
    this.isOpen = true;
  }


  handleSaveOneError(error: any) {
    _errorX(ObjectStorageBucketSaveModalV1.getClassName(), 'handleSaveOneError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(OBJECT_STORAGE_BUCKETS_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }


  handleEventSave(event: any) {
    _debugX(ObjectStorageBucketSaveModalV1.getClassName(), 'handleEventSave',
      {
        event,
      });

    this.save();
  }

}
