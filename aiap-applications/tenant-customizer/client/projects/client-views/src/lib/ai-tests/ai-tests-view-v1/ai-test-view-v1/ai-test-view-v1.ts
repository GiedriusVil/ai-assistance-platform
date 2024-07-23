/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  WbcLocationServiceV1,
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
  selector: 'aca-aitest-view',
  templateUrl: './ai-test-view-v1.html',
  styleUrls: ['./ai-test-view-v1.scss']
})
export class AiTestView extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTestView';
  }
  @ViewChild('accordion', { static: true }) accordion;

  outlet = OUTLETS.tenantCustomizer;

  data: any;
  testId = undefined;
  errorMessage: any;
  unhittedIntents: any;
  state: any = {
    queryType: DEFAULT_TABLE.TEST.TYPE
  }

  public _destroyed$: Subject<void> = new Subject();

  constructor(
    private eventsService: EventsServiceV1,
    private aiTestsService: AiTestsService,
    private notificationService: NotificationServiceV2,
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    private queryService: QueryServiceV1,
    private router: Router,
    private wbcLocationService: WbcLocationServiceV1,
  ) {
    super()
  }

  ngOnInit(): void {
    this.subscribeToQueryParams();
    this.queryService.refreshState(this.state.queryType);
    this.addFilterEventHandler();

  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  addFilterEventHandler() {
    this.eventsService.loadingEmit(true);
    this.aiTestsService.findOneById(this.testId).pipe(
      catchError((error) => this.handleFindOneByIdError()),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AiTestView.getClassName(), `addFilterEventHandler`,
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
        _debugX(AiTestView.getClassName(), 'subscribeToQueryParams',
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
  handleFindOneByIdError() {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Ai Tests',
      subtitle: 'Unable to retrieve test!',
      duration: 10000,
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of({
      items: [],
    })
  }

  handleRowClick(tableName: any) {
    const NAVIGATION: any = {
    };
    let table;
    try {
      table = tableName?.value?.tableName;
      NAVIGATION.path = `(tenantCustomizer:main-view/aitests/ai-test/ai-test-${table})`;
      NAVIGATION.extras = {
        queryParams: {
          testId: this.testId
        }
      };
      _debugX(AiTestView.getClassName(), 'handleRowClick', { NAVIGATION });
      this.wbcLocationService.navigateToPath(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(AiTestView.getClassName(), 'handleRowClick', { error, NAVIGATION });
    }
  }

  checkForWarnings(data) {
    const UNHITTED_INTENTS = ramda.path(['warnings', 'unhittedIntents'], data);
    let retVal = false;
    if (!lodash.isEmpty(UNHITTED_INTENTS)) {
      retVal = true;
      this.unhittedIntents = lodash.join(UNHITTED_INTENTS, ', ');
      return retVal
    } else {
      return retVal;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'ai-test',
      children: [
        ...children,
        {
          path: '',
          component: AiTestView,
          data: {
            component: AiTestView.getClassName(),
            actions: []
          }
        },
      ],
      data: {
        breadcrumb: 'ai_test_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }

}
