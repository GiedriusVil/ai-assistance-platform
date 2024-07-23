/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  NgZone,
  OnDestroy,
  OnInit
} from '@angular/core';

import * as lodash from 'lodash';

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

@Component({
  selector: 'aiap-data-masking-configuration-view-v1',
  templateUrl: './data-masking-configuration-view-v1.html',
  styleUrls: ['./data-masking-configuration-view-v1.scss'],
})
export class DataMaskingConfigurationViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'DataMaskingConfigurationViewV1';
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
    this.loadWBCView(DataMaskingConfigurationViewV1.getClassName());
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'data-masking-configuration-view',
      children: [
        ...children,
        {
          path: '',
          component: DataMaskingConfigurationViewV1,
          data: {
            component: DataMaskingConfigurationViewV1.getClassName(),
          }
        },
      ],
      data: {
        breadcrumb: 'data_masking_configurations_view_v1.breadcrumb'
      }
    };
    return RET_VAL;
  }
}
