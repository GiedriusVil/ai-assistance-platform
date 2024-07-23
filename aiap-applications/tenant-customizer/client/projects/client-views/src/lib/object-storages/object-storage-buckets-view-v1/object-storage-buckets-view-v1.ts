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
  selector: 'aiap-object-storage-buckets-view-v1',
  templateUrl: './object-storage-buckets-view-v1.html',
  styleUrls: ['./object-storage-buckets-view-v1.scss'],
})
export class ObjectStorageBucketsViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ObjectStorageBucketsViewV1';
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
    this.loadWBCView(ObjectStorageBucketsViewV1.getClassName());
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  static route() {
    const RET_VAL = {
      path: 'object-storage-buckets-view-v1',
      component: ObjectStorageBucketsViewV1,
      data: {
        breadcrumb: 'object_storage_buckets_view_v1.breadcrumb',
        component: ObjectStorageBucketsViewV1.getClassName(),
      },
    }
    return RET_VAL;
  }
}
