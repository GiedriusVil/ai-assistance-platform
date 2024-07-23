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
  ObjectStorageFilesServiceV1,
} from 'client-services';

import {
  OBJECT_STORAGE_FILES_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-object-storage-file-save-modal-v1',
  templateUrl: './object-storage-file-save-modal-v1.html',
  styleUrls: ['./object-storage-file-save-modal-v1.scss']
})
export class ObjectStorageFileSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewChecked {

  static getClassName() {
    return 'ObjectStorageFileSaveModalV1';
  }

  isLoading = false;

  _state = {
    file: null,
    bucket: null,
    buckets: [],
  }
  state = lodash.cloneDeep(this._state);

  _value = {
    id: null,
    bucketId: null,
    reference: null,
    file: null,
  };
  value: any = lodash.cloneDeep(this._value);

  constructor(
    //
    private changeDetectorRef: ChangeDetectorRef,
    //
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private objectStorageBucketsService: ObjectStorageBucketsServiceV1,
    private objectStorageFilesService: ObjectStorageFilesServiceV1,
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

    RET_VAL.file = this.state?.file

    return RET_VAL;
  }

  save() {
    const VALUE = this._sanitizedValue();

    _debugX(ObjectStorageFileSaveModalV1.getClassName(), 'save',
      {
        this_value: this.value,
        this_state: this.state,
        VALUE: VALUE,
      });

    this.eventsService.loadingEmit(true);
    this.objectStorageFilesService.saveOne(VALUE)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ObjectStorageFileSaveModalV1.getClassName(), 'save',
          {
            response,
          });

        this.notificationService.showNotification(OBJECT_STORAGE_FILES_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        this.isOpen = false;
      });
  }

  show(value: any = null) {
    _debugX(ObjectStorageFileSaveModalV1.getClassName(), 'show',
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

    const STATE_NEW = lodash.cloneDeep(this._state);

    if (
      valueNew?.file
    ) {
      STATE_NEW.file = {
        name: valueNew?.file?.originalname,
        size: valueNew?.file?.size,
        type: valueNew?.file?.mimetype,
      };
    }

    this.state = STATE_NEW;
    this.value = valueNew;
    this.loadBuckets();
  }

  private async loadBuckets() {
    try {
      const QUERY = {
        filter: {
          search: '',
        },
        pagination: {
          page: 1,
          size: 1000
        },
        sort: {
          field: 'name',
          direction: 'DESC'
        }
      }
      this.objectStorageBucketsService.findManyByQuery(QUERY)
        .pipe(
          catchError((error) => this.handleFindBucketsByQueryError(error)),
          takeUntil(this._destroyed$),
        ).subscribe((response: any) => {
          const STATE_NEW = lodash.cloneDeep(this.state);
          STATE_NEW.buckets = response.items?.map((item: any) => {
            const RET_VAL = {
              content: `${item?.reference}`,
              value: item,
            };
            return RET_VAL;
          });

          for (const BUCKET of STATE_NEW.buckets) {
            if (
              BUCKET?.value?.id === this.value?.bucketId
            ) {
              BUCKET.selected = true;
              STATE_NEW.bucket = BUCKET;
            } else {
              delete BUCKET?.selected;
            }
          }

          this.state = STATE_NEW;
          this.isOpen = true;
        });
    } catch (error) {
      _errorX(ObjectStorageFileSaveModalV1.getClassName(), 'loadBuckets',
        {
          error,
        });
      throw error;
    }
  }

  handleFindBucketsByQueryError(error: any) {
    _errorX(ObjectStorageFileSaveModalV1.getClassName(), 'handleFindBucketsByQueryError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(OBJECT_STORAGE_FILES_MESSAGES.ERROR.FIND_BUCKETS_BY_QUERY);
    return of();
  }

  handleSaveOneError(error: any) {
    _errorX(ObjectStorageFileSaveModalV1.getClassName(), 'handleSaveOneError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(OBJECT_STORAGE_FILES_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  handleEventBucketSelected(event: any) {
    _errorX(ObjectStorageFileSaveModalV1.getClassName(), 'handleEventBucketSelected',
      {
        event,
      });

    const VALUE_NEW = lodash.cloneDeep(this.value);

    VALUE_NEW.bucketId = event?.item?.value?.id;

    this.value = VALUE_NEW;
  }


  handleEventSave(event: any) {
    _debugX(ObjectStorageFileSaveModalV1.getClassName(), 'handleEventSave',
      {
        event,
      });

    this.save();
  }

}
