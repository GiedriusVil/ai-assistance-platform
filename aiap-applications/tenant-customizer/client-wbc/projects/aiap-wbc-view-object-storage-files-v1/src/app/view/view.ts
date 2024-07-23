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
  ActivatedRoute,
  Router,
} from '@angular/router';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  BaseViewV1,
} from 'client-shared-views';

import {
  ObjectStorageFileSaveModalV1,
  ObjectStorageFilesDeleteModalV1,
} from '../components';

@Component({
  selector: 'aiap-object-storage-files-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class ObjectStorageFilesViewV1 extends BaseViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ObjectStorageFilesViewV1';
  }

  @ViewChild('objectStorageFileSaveModal') objectStorageFileSaveModal: ObjectStorageFileSaveModalV1;
  @ViewChild('objectStorageFilesDeleteModal') objectStorageFilesDeleteModal: ObjectStorageFilesDeleteModalV1;

  outlet = OUTLETS.tenantCustomizer;


  _state: any = {
    query: {
      type: DEFAULT_TABLE.OBJECT_STORAGE_FILES_V1.TYPE,
      sort: DEFAULT_TABLE.OBJECT_STORAGE_FILES_V1.SORT,
    },
    buckets: [],
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    private activatedRouter: ActivatedRoute,
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleSearchChangeEvent(event: any) {
    _debugX(ObjectStorageFilesViewV1.getClassName(), 'handleSearchChangeEvent',
      {
        event,
      });
  }

  handleSearchClearEvent(event: any) {
    _debugX(ObjectStorageFilesViewV1.getClassName(), 'handleSearchClearEvent',
      {
        event,
      });
  }

  handleShowSavePlaceEvent(event: any) {
    _debugX(ObjectStorageFilesViewV1.getClassName(), 'handleShowSavePlaceEvent',
      {
        event,
      });
    this.objectStorageFileSaveModal.show(event?.value);
  }

  handleShowRemovePlaceEvent(ids: any) {
    _debugX(ObjectStorageFilesViewV1.getClassName(), 'handleShowRemovePlaceEvent',
      {
        ids,
      });
    this.objectStorageFilesDeleteModal.show(ids);
  }

}
