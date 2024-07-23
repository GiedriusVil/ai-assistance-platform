/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { of, Subject, Subscription } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  QueryServiceV1,
  EventsServiceV1,
} from 'client-shared-services';

import {
  TilesConfigurationsService,
  LiveAnalyticsService,
} from 'client-services';

@Component({
  selector: 'aca-live-analytics-tile-metric',
  templateUrl: './live-analytics-tile-metric.comp.html',
  styleUrls: ['./live-analytics-tile-metric.comp.scss'],
})
export class LiveAnalyticsTileMetric implements OnInit, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsTileMetric';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() tileRef: any;
  @Input() configuration: any;

  _state = {
    query: undefined,
    isLoading: true,
    error: undefined,
    response: undefined,
  };
  state = lodash.cloneDeep(this._state);
  tile: any;
  filtersSubscription: Subscription;

  constructor(
    private tilesService: TilesConfigurationsService,
    private liveAnalyticsService: LiveAnalyticsService,
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
  ) { }

  ngOnInit(): void {
    this.addFilterEventHandler();
    this.loadTile();
  }

  ngOnDestroy(): void {
    this.filtersSubscription.unsubscribe();
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private addFilterEventHandler() {
    const QUERY_TYPE = this.configuration?.ref;
    let defaultQuery = this.queryService.query(QUERY_TYPE);
    this.filtersSubscription = this.eventsService.filterEmitter.pipe(
      tap(() => {
        this.eventsService.loadingEmit(true);
        this.setLoading(true);
      }),
      switchMap((query: any) => {
        if (query) {
          defaultQuery = query;
        }
        this.state.query = defaultQuery;
        return this.tilesService.findOneByRef(this.tileRef).pipe(
          catchError((error: any) => this.handleRetrieveTileMetricDataError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(LiveAnalyticsTileMetric.getClassName(), 'filterEventHandler', { response });
      this.refreshTile(response);
      this.eventsService.loadingEmit(false);
    });
  }

  private loadTile() {
    this.setLoading(true);
    const QUERY_TYPE = this.configuration?.ref;
    this.state.query = this.queryService.query(QUERY_TYPE);
    this.tilesService.findOneByRef(this.tileRef).pipe(
      catchError((error: any) => this.handleRetrieveTileMetricDataError(error))
    ).subscribe((response: any) => {
      _debugX(LiveAnalyticsTileMetric.getClassName(), 'loadTile', { response });
      this.refreshTile(response);
    });
  }

  private refreshTile(response) {
    this.tile = response?.value?.tile;
    this.tile.name = response?.name;
    this.loadTileMetricData();
  }

  private handleRetrieveTileMetricDataError(error: any) {
    _errorX(LiveAnalyticsTileMetric.getClassName(), 'handleRetrieveTileMetricDataError', { error });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.error = error;
    this.state = NEW_STATE;
    return of();
  }

  private loadTileMetricData() {
    const QUERY = lodash.cloneDeep(this.state.query);
    const MERGED_FILTERS = this.mergeTileFilters();
    const PARAMS = {
      ref: this.tile?.queryRef,
      query: QUERY,
      filters: MERGED_FILTERS,
    };
    _debugX(LiveAnalyticsTileMetric.getClassName(), 'loadTileMetricData', PARAMS);
    this.liveAnalyticsService.executeOne(PARAMS)
      .pipe(
        catchError((error: any) => this.handleRetrieveTileMetricDataError(PARAMS))
      ).subscribe((response: any) => {
        _debugX(LiveAnalyticsTileMetric.getClassName(), 'loadTileMetricData', { response });
        const NEW_STATE = lodash.cloneDeep(this.state);
        NEW_STATE.response = response;
        this.state = NEW_STATE;
        this.setLoading(false);
      })
  }

  private mergeTileFilters() {
    const DASHBOARD_FILTERS = lodash.cloneDeep(this.configuration?.elements?.filters);
    const TILE_FILTERS = lodash.cloneDeep(this.tile?.filters);
    let retVal;
    if (
      lodash.isArray(DASHBOARD_FILTERS) &&
      lodash.isArray(TILE_FILTERS)
    ) {
      retVal = lodash.concat(DASHBOARD_FILTERS, TILE_FILTERS);
    } else if (
      lodash.isArray(DASHBOARD_FILTERS)
    ) {
      retVal = DASHBOARD_FILTERS;
    } else if (
      lodash.isArray(TILE_FILTERS)
    ) {
      retVal = TILE_FILTERS;
    }
    _debugX(LiveAnalyticsService.getClassName(), 'mergeTileFilters', { retVal });
    return retVal;
  }

  private handleExportDataEvent () {
    const QUERY = lodash.cloneDeep(this.state.query);
    const MERGED_FILTERS = this.mergeTileFilters();
    const PARAMS = {
      ref: this.tile?.queryRef,
      query: QUERY,
      filters: MERGED_FILTERS,
      export: true
    };
    _debugX(LiveAnalyticsTileMetric.getClassName(), 'exportTileMetricData', PARAMS);
    this.liveAnalyticsService.exportOne(PARAMS)
      .pipe(
        catchError((error: any) => this.handleRetrieveTileMetricDataError({error}))
      ).subscribe((response: any) => {
        _debugX(LiveAnalyticsTileMetric.getClassName(), 'exportTileMetricData', { response });
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.tile?.queryRef}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
  }

  private setLoading(value: boolean) {
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.isLoading = value;
    this.state = NEW_STATE;
  }
}
