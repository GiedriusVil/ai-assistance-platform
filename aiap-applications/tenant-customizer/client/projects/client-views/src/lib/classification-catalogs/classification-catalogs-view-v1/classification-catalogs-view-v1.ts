/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseViewWithWbcLoaderV1
} from 'client-shared-views';

import * as lodash from 'lodash';

@Component({
  selector: 'aiap-classification-catalogs-view-v1',
  templateUrl: './classification-catalogs-view-v1.html',
  styleUrls: ['./classification-catalogs-view-v1.scss']
})
export class ClassificationCatalogsViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassificationCatalogsViewV1';
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
    this.loadWBCView(ClassificationCatalogsViewV1.getClassName());
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'classification-catalogs',
      children: [
        ...children,
        {
          path: '',
          component: ClassificationCatalogsViewV1,
          data: {
            component: ClassificationCatalogsViewV1.getClassName()
          }
        }
      ],
      data: {
        breadcrumb: 'classification_catalogs_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
