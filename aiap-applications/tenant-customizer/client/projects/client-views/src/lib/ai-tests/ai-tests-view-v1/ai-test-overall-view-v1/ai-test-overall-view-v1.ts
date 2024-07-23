/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';

import {
  _debugX,
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
} from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

@Component({
  selector: 'aca-aitest-overall-view',
  templateUrl: './ai-test-overall-view-v1.html',
  styleUrls: ['./ai-test-overall-view-v1.scss']
})
export class AiTestOverallView extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTestOverallView';
  }

  outlet = OUTLETS.tenantCustomizer;

  data: any;
  testId: any;
  errorMessage: any;
  state: any = {
    queryType: DEFAULT_TABLE.TEST_OVERALL.TYPE
  }

  public _destroyed$: Subject<void> = new Subject();

  constructor(
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
  ) {
    super()
  }

  ngOnInit() {
    this.subscribeToQueryParams();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiTestOverallView.getClassName(), 'subscribeToQueryParams', { params });
        this.testId = params?.testId;
      });
  }

  static route() {
    const RET_VAL = {
      path: 'ai-test-overall',
      component: AiTestOverallView,
      data: {
        breadcrumb: 'ai_test_overall_view_v1.breadcrumb',
        component: AiTestOverallView.getClassName(),
        actions: []
      }
    };
    return RET_VAL;
  }
}
