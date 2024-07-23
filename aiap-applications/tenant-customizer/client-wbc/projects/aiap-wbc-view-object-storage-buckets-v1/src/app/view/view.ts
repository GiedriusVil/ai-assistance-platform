/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  BaseViewV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  ObjectStorageBucketsDeleteModalV1,
  ObjectStorageBucketSaveModalV1,
} from '../components';

@Component({
  selector: 'aiap-object-storage-buckets-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class ObjectStorageBucketsViewV1 extends BaseViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ObjectStorageBucketsViewV1';
  }

  @ViewChild('objectStorageBucketsDeleteModal') objectStorageBucketsDeleteModal: ObjectStorageBucketsDeleteModalV1;
  @ViewChild('objectStorageBucketSaveModal') objectStorageBucketSaveModal: ObjectStorageBucketSaveModalV1;

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    query: {
      type: DEFAULT_TABLE.OBJECT_STORAGE_BUCKETS_V1.TYPE,
      sort: DEFAULT_TABLE.OBJECT_STORAGE_BUCKETS_V1.SORT,
    }
  };

  constructor() {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleSearchChangeEvent(event: any) {
    _debugX(ObjectStorageBucketsViewV1.getClassName(), 'handleSearchChangeEvent',
      {
        event,
      });
  }

  handleSearchClearEvent(event: any) {
    _debugX(ObjectStorageBucketsViewV1.getClassName(), 'handleSearchClearEvent',
      {
        event,
      });
  }

  handleShowSavePlaceEvent(event: any) {
    _debugX(ObjectStorageBucketsViewV1.getClassName(), 'handleShowSavePlaceEvent',
      {
        event,
      });
    this.objectStorageBucketSaveModal.show(event?.value);
  }

  handleShowRemovePlaceEvent(ids: any) {
    _debugX(ObjectStorageBucketsViewV1.getClassName(), 'handleShowRemovePlaceEvent',
      {
        ids,
      });
    this.objectStorageBucketsDeleteModal.show(ids);
  }


}
