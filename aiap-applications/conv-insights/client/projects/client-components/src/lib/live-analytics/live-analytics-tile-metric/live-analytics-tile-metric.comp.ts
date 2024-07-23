/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnChanges, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  LiveAnalyticsTileMetricsDataService,
} from 'client-services';

@Component({
  selector: 'aca-live-analytics-tile-metric',
  templateUrl: './live-analytics-tile-metric.comp.html',
  styleUrls: ['./live-analytics-tile-metric.comp.scss'],
})
export class LiveAnalyticsTileMetric implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsTileMetric';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() tile: any;
  @Input() query: any;
  @Input() configuration: any;
  @Input() _cancelMetricsRequests$: Subject<void>;

  _state: any = {
    isLoading: false,
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    private liveAnalyticsTileMetricsDataService: LiveAnalyticsTileMetricsDataService,
  ) { }

  ngOnInit(): void {
    this.loadTileMetricData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(LiveAnalyticsTileMetric.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_query: this.query,
      this_configuration: this.configuration,
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private loadTileMetricData() {
    const QUERY = lodash.merge(
      lodash.cloneDeep(this.query),
      {
        filter: this.configuration?.filter,
        nFilter: this.configuration?.nFilter
      }
    );
    this.state.isLoading = true;

    const PARAMS = {
      tile: this.tile,
      query: QUERY,
      configuration: this.configuration,
    };
    _debugX(LiveAnalyticsTileMetric.getClassName(), 'loadTileMetricData', { PARAMS });
    this.liveAnalyticsTileMetricsDataService.retrieveTileMetricData(PARAMS)
      .pipe(
        catchError((error: any) => this.handleRetrieveTileMetricDataError(PARAMS)),
        takeUntil(this._cancelMetricsRequests$),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(LiveAnalyticsTileMetric.getClassName(), 'loadTileMetricData', { response });
        const NEW_STATE = lodash.cloneDeep(this.state);
        NEW_STATE.response = response;
        NEW_STATE.isLoading = false;
        this.state = NEW_STATE;
      })
  }

  private handleRetrieveTileMetricDataError(error: any): Observable<any> {
    _errorX(LiveAnalyticsTileMetric.getClassName(), 'handleRetrieveMetricsByQueryError', { error });

    return of()
  }

}

