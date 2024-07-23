/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { switchMap, catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

import * as ramda from 'ramda';

import {
  DataTable,
} from 'carbon-components';

import {
  EventsServiceV1,
  LocalStorageServiceV1,
} from 'client-shared-services';

import {
  ReportsChartsServiceV1,
  ReportsDataServiceV1,
  ReportsTransformServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-report-chart-v1',
  templateUrl: './report-chart-v1.html',
  styleUrls: ['./report-chart-v1.scss'],
})
export class ReportChartV1 implements OnInit {

  static getClassName() {
    return 'ReportChartV1';
  }

  @ViewChild('canvas') canvas;
  @ViewChild('datatablev2') datatablev2;

  @Input() type: string;
  @Input() name: string;
  @Input() title: string;
  @Input() dataTable: boolean | string = false;
  @Input() intentSlider = false;

  private _destroyed$: Subject<void> = new Subject();
  private confidenceEmitter: Subject<any> = new Subject();

  filters: any;
  error = false;
  errorMessage: string
  showData = false;
  chart;
  data: any;
  tablev2;

  constructor(
    private eventsService: EventsServiceV1,
    private localStorageService: LocalStorageServiceV1,
    private reportsDataService: ReportsDataServiceV1,
    private reportsChartsService: ReportsChartsServiceV1,
    private reportsTransformService: ReportsTransformServiceV1,
  ) { }

  ngOnInit(): void {
    if (
      this.dataTable
    ) {
      setTimeout(() => {
        this.tablev2 = DataTable.create(this.datatablev2.nativeElement);
        this.datatablev2.nativeElement.addEventListener('data-table-aftertogglesort', event => {
          const ascending = event.detail.element.classList.contains('bx--table-sort--ascending');
          const parts = event.detail.element.getAttribute('data-path').split('.');
          const PARTS: any = ramda.path(parts);
          const PARTS_ASC: any = ramda.ascend(PARTS);
          const PARTS_DESC: any = ramda.descend(PARTS);
          this.data = ascending ? ramda.sortWith([PARTS_ASC])(this.data) : ramda.sortWith([PARTS_DESC])(this.data);
        });
      }, 0);
    }

    this.eventsService.filterEmitter.pipe(
      this.handleFilterEvent(),
      takeUntil(this._destroyed$)
    ).subscribe(data => this.handleData(data));

    if (this.intentSlider) {
      this.confidenceEmitter.pipe(
        this.handleFilterEvent(),
        takeUntil(this._destroyed$),
      ).subscribe(data => this.handleData(data));
    }
  }

  onConfidenceChange(confidence: number) {
    this.filters.confidence = confidence;
    this.localStorageService.set('filters', this.filters);
    this.confidenceEmitter.next(this.filters);
  }

  private handleFilterEvent() {
    return switchMap((filters: any) => {
      this.filters = filters;
      if (this.chart) this.chart.destroy();
      if (this.data) this.data = undefined;
      this.error = false;
      this.showData = false;
      return this.reportsDataService.getData(this.name, filters).pipe(catchError(err => this.handleError(err)));
    });
  }

  private handleData(data: any) {
    const chartData = this.reportsTransformService.transformData(this.name, data);
    if (this.dataTable) this.data = data;
    this.error = false;
    this.showData = true;
    setTimeout(() => {
      this.chart = this.reportsChartsService.getChart(this.type, this.canvas.nativeElement, chartData);
      this.chart.update();
    }, 0);
  }

  private handleError(error: any) {
    this.error = true;
    this.errorMessage = error.error.errorMessage;
    if (
      this.data
    ) {
      this.data = undefined;
    }
    return of();
  }

  ngOnDestroy(): void {
    if (
      this.dataTable
    ) {
      this.datatablev2.nativeElement.removeEventListener('data-table-aftertogglesort', () => { });
    }
    if (
      this.dataTable
    ) {
      this.tablev2.release();
    }
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
