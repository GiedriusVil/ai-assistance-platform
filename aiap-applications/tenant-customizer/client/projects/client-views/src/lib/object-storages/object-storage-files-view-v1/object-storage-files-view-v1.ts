/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  NgZone,
  OnInit,
  OnDestroy,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseViewWithWbcLoaderV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-object-storage-files-view-v1',
  templateUrl: './object-storage-files-view-v1.html',
  styleUrls: ['./object-storage-files-view-v1.scss'],
})
export class ObjectStorageFilesViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ObjectStorageFilesViewV1';
  }

  constructor(
    protected ngZone: NgZone,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected sessionService: SessionServiceV1,
  ) {
    super(
      ngZone,
      router,
      activatedRoute,
      sessionService,
    );
  }

  ngOnInit(): void {
    this.loadWBCView(ObjectStorageFilesViewV1.getClassName());
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  static route() {
    const RET_VAL = {
      path: 'object-storage-files-view-v1',
      component: ObjectStorageFilesViewV1,
      data: {
        breadcrumb: 'object_storage_files_view_v1.breadcrumb',
        component: ObjectStorageFilesViewV1.getClassName(),
      },
    }
    return RET_VAL;
  }
}
