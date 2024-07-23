/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import * as ramda from 'ramda';

import {
  _debugX,
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import { AiTestsService } from 'client-services';

@Component({
  selector: 'aca-aitest-results-view',
  templateUrl: './ai-test-results-view-v1.html',
  styleUrls: ['./ai-test-results-view-v1.scss']
})
export class AiTestResultslView extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTestResultslView';
  }

  outlet = OUTLETS.tenantCustomizer;

  data: any;
  testId: any;
  errorMessage: any;
  state: any = {
    queryType: DEFAULT_TABLE.TEST_RESULTS.TYPE
  }

  public _destroyed$: Subject<void> = new Subject();

  constructor(
    private eventsService: EventsServiceV1,
    private aiTestsService: AiTestsService,
    private notificationService: NotificationServiceV2,
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super()
  }

  ngOnInit() {
    this.subscribeToQueryParams();
    this.addFilterEventHandler();
  }

  addFilterEventHandler() {
    this.eventsService.loadingEmit(true);
    this.aiTestsService.findOneById(this.testId).pipe(
      catchError((error) => this.handleFindOneByIdError()),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AiTestResultslView.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      this.data = response;
      this.errorMessage = this.transformErrorMessage(this.data);
      this.eventsService.loadingEmit(false);
    });
  }

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiTestResultslView.getClassName(), 'subscribeToQueryParams',
          {
            params,
          });

        this.testId = params.testId;
      });
  }

  transformErrorMessage(data) {
    const ERROR_MESSAGE = ramda.path(['errorMessage', 'message'], data);
    if (ERROR_MESSAGE) {
      const RET_VAL = ERROR_MESSAGE.replace(/\[.*?\]/, '');
      return RET_VAL;
    }
    else {
      return '';
    }
  }

  private handleFindOneByIdError() {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Ai Tests',
      subtitle: 'Unable to retrieve test!',
      duration: 10000,
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of({
      items: [],
    });
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  static route() {
    const RET_VAL = {
      path: 'ai-test-test-results',
      component: AiTestResultslView,
      data: {
        breadcrumb: 'ai_test_results_view_v1.breadcrumb',
        component: AiTestResultslView.getClassName(),
        actions: []
      }
    };
    return RET_VAL;
  }
}
