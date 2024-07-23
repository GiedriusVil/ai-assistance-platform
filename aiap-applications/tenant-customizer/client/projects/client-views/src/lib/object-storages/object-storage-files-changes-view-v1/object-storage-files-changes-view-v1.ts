/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  NgZone,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseViewWithWbcLoaderV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-object-storage-files-changes-view-v1',
  templateUrl: './object-storage-files-changes-view-v1.html',
  styleUrls: ['./object-storage-files-changes-view-v1.scss'],
})
export class ObjectStorageFilesChangesViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ObjectStorageFilesChangesViewV1';
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
    this.loadWBCView(ObjectStorageFilesChangesViewV1.getClassName());
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  static route() {
    const RET_VAL = {
      path: 'object-storage-files-changes-view-v1',
      component: ObjectStorageFilesChangesViewV1,
      data: {
        name: 'object_storage_files_changes_view_v1.name',
        breadcrumb: 'object_storage_files_changes_view_v1.breadcrumb',
        description: 'object_storage_files_changes_view_v1.description',
        component: ObjectStorageFilesChangesViewV1.getClassName(),
      }
    };
    return RET_VAL;
  }
}
