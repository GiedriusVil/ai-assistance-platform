/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import * as lodash from 'lodash';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseViewWithWbcLoaderV1
} from 'client-shared-views';

@Component({
  selector: 'aiap-classification-category-view-v1',
  templateUrl: './classification-category-view-v1.html',
  styleUrls: ['./classification-category-view-v1.scss'],
})
export class ClassificationCategoryViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassificationCategoryViewV1';
  }

  _state: any = {
    activatedRoute: undefined,
    router: undefined,
    wbc: {
      host: undefined,
      path: undefined,
      tag: undefined,
    },
  }
  state = lodash.cloneDeep(this._state);

  _params = {};
  params = lodash.cloneDeep(this._params);

  constructor(
      protected sessionService: SessionServiceV1,
      protected activatedRoute: ActivatedRoute,
      protected router: Router,
      protected ngZone: NgZone
  ) {
    super(
        ngZone,
        router,
        activatedRoute,
        sessionService,
    );
  }

  ngOnInit(): void {
    this.loadWBCView(ClassificationCategoryViewV1.getClassName());
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'classification-catalog',
      children: [
        ...children,
        {
          path: '',
          component: ClassificationCategoryViewV1,
          data: {
            component: ClassificationCategoryViewV1.getClassName(),
          }
        },
      ],
      data: {
        breadcrumb: 'classification_category_view_v1.breadcrumb',
      }
    };
    return RET_VAL
  }
}
