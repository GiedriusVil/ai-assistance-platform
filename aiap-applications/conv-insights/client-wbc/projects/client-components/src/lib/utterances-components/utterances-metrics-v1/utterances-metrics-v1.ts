/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
  sanitizeIBMOverflowMenuPaneElement,
  FEEDBACK_SCORES
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  UTTERANCES_MESSAGES,
  DEFAULT_TABLE,
} from 'client-utils';

import {
  UtteranceService,
} from 'client-services';

@Component({
  selector: 'aca-utterances-metrics-v1',
  templateUrl: './utterances-metrics-v1.html',
  styleUrls: ['./utterances-metrics-v1.scss'],
})
export class UtterancesMetricsV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'UtterancesMetrics';
  }

  private _destroyed$: Subject<void> = new Subject();

  state: any = {
    queryType: DEFAULT_TABLE.UTTERANCES.TYPE,
    metric: undefined,
  }

  taggedAsFalsePositiveDesc: string = 'Utterances that received a response from the chatbot but were deemed inaccurate by a conversational analyst (by tagging them on transcripts as false positives).';

  response: any = {
    actionNeeded: 0,
    negativeFeedback: 0,
    positiveFeedback: 0,
    allUtterances: 0,
    falsePositiveIntents: 0
  };

  constructor(
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
    private utteranceService: UtteranceService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.addFilterEventHandler();
    const QUERY = this.queryService.query(this.state.queryType);
    this.setSelectedMetricsTile(QUERY);
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
    sanitizeIBMOverflowMenuPaneElement(UtterancesMetricsV1.getClassName(), document);
  }

  _isMetricSelected(metric) {
    let retVal = false;
    if (
      this.state?.metric === metric
    ) {
      retVal = true;
    }
    return retVal;
  }

  handleMetricSelectedEvent(metric: any): void {
    this.state.metric = metric?.type;
    _debugX(UtterancesMetricsV1.getClassName(), 'handleMetricSelectedEvent', {
      metric: metric,
      this_state: this.state
    });
    this.queryService.deleteFilterItems(
      this.state.queryType,
      QueryServiceV1.FILTER_KEY.SCORE,
      QueryServiceV1.FILTER_KEY.ACTION_NEEDED,
      QueryServiceV1.FILTER_KEY.FALSE_POSITIVE_INTENTS,
    );
    switch (metric.type) {
      case 'positive':
        this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SCORE, FEEDBACK_SCORES.POSITIVE);
        this.queryService.setOptions(this.state.queryType, { intents: false });
        break;
      case 'negative':
        this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SCORE, FEEDBACK_SCORES.NEGATIVE);
        this.queryService.setOptions(this.state.queryType, { intents: false });
        break;
      case 'action':
        this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.ACTION_NEEDED, true);
        this.queryService.setOptions(this.state.queryType, { intents: false });
        break;
      case 'falsePositiveIntents':
        this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.FALSE_POSITIVE_INTENTS, true);
        this.queryService.setOptions(this.state.queryType, { intents: false });
        break;
      case 'all':
        this.queryService.setOptions(this.state.queryType, { intents: true });
        break;
      default:
        break;
    }
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  private addFilterEventHandler(): void {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(UtterancesMetricsV1.getClassName(), 'addFilterEventHandler', { query });
        if (query) {
          defaultQuery = query;
        }

        return this.utteranceService.getUtterancesTotals(defaultQuery).pipe(
          catchError((error) => this.handleGetDataError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response) => {
      _debugX(UtterancesMetricsV1.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.eventsService.loadingEmit(false);
    });
  }

  handleGetDataError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(UTTERANCES_MESSAGES.ERROR.GET_METRICS);
    return of()
  }

  private setSelectedMetricsTile(query: any) {
    const FILTER_KEY_SCORE = ramda.pathOr(false, ['filter', 'score'], query);
    const FILTER_KEY_ACTION_NEEDED = ramda.pathOr(false, ['filter', 'actionNeeded'], query);
    const FILTER_KEY_FALSE_POSITIVE = ramda.pathOr(false, ['filter', 'falsePositiveIntents'], query);

    if (FILTER_KEY_SCORE && FILTER_KEY_SCORE === 'positive') {
      this.state.metric = 'positive';
    } else if (FILTER_KEY_SCORE && FILTER_KEY_SCORE === 'negative') {
      this.state.metric = 'negative';
    } else if (FILTER_KEY_ACTION_NEEDED) {
      this.state.metric = 'action';
    } else if (FILTER_KEY_FALSE_POSITIVE) {
      this.state.metric = 'falsePositiveIntents';
    } else {
      this.state.metric = 'all';
    }
  }
}
