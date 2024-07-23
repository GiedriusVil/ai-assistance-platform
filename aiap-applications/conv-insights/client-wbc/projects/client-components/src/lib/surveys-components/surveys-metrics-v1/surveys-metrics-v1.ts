/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

import {
  NotificationService
} from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  SurveyService,
} from 'client-services';

import {
  DEFAULT_TABLE,
  SURVEYS_MESSAGES,
} from 'client-utils';

@Component({
  selector: 'aiap-surveys-metrics-v1',
  templateUrl: './surveys-metrics-v1.html',
  styleUrls: ['./surveys-metrics-v1.scss'],
})
export class SurveysMetricsV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'SurveysMetricsV1';
  }

  private _destroyed$: Subject<void> = new Subject();

  error = false;
  avgNps = 0;

  state: any = {
    queryType: DEFAULT_TABLE.SURVEYS.TYPE,
  };

  response: any;

  constructor(
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private surveyService: SurveyService,
    protected timezoneService: TimezoneServiceV1,
    protected queryService: QueryServiceV1,
    protected sessionService: SessionServiceV1,
  ) {
  }

  ngOnInit() {
    this.addFilterEventHandler();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        _debugX(SurveysMetricsV1.getClassName(), `addFilterEventHandler`, { query });
        if (query) {
          defaultQuery = query;
        }
        return this.surveyService.findAvgScoreByQuery(defaultQuery).pipe(
          catchError((error) => this.handleSurveysError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(SurveysMetricsV1.getClassName(), `addFilterEventHandler`, { response });
      this.error = false;
      this.avgNps = response.avgNps;
      this.eventsService.loadingEmit(false);
    });
  }

  handleSurveysError(error) {
    this.eventsService.loadingEmit(false);
    this.error = true;
    this.notificationService.showNotification(SURVEYS_MESSAGES.ERROR.FIND_AVG_SCORE_BY_QUERY);
    return of()
  }
}
