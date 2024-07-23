/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IconService } from 'carbon-components-angular';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';

import { CarbonFrameworkModule } from './carbon-framework.module';
import { AcaDateRangePickerComponent } from './aca-date-range-picker/date-range-picker.component';
import { LiveAnalyticsWbcTileMetricsPanel } from './tile-metrics-panel/live-analytics-tile-metrics-panel.comp';
import { AcaMetricsTile } from './aca-metrics-tile/aca-metrics.tile';
import { LiveAnalyticsFilter } from './live-analytics-filter/live-analytics-filter.component';
import { LiveAnalyticsTileMetric } from './live-analytics-tile-metric/live-analytics-tile-metric.comp';
import { LiveAnalyticsChart } from './live-analytics-chart/live-analytics-chart.comp';
import { LiveAnalyticsChartsPanel } from './live-analytics-charts-panel/live-analytics-charts-panel.comp';
import { LiveAnalyticsFiltersPanel } from './live-analytics-filters-panel/live-analytics-filters-panel.component';
import { LiveAnalyticsMetricsCombo } from './live-analytics-metrics-combo/live-analytics-metrics-combo.comp';


@NgModule({
  declarations: [
    // components
    AcaDateRangePickerComponent,
    LiveAnalyticsWbcTileMetricsPanel,
    AcaMetricsTile,
    LiveAnalyticsTileMetric,
    LiveAnalyticsChart,
    LiveAnalyticsChartsPanel,
    LiveAnalyticsMetricsCombo,
    LiveAnalyticsFiltersPanel,
    LiveAnalyticsFilter
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CarbonFrameworkModule,
    TranslateModule,
    ClientUtilsModule,
    ClientServicesModule,
  ],
  exports: [
    // components
    AcaDateRangePickerComponent,
    LiveAnalyticsWbcTileMetricsPanel,
    AcaMetricsTile,
    LiveAnalyticsTileMetric,
    LiveAnalyticsChart,
    LiveAnalyticsChartsPanel,
    LiveAnalyticsMetricsCombo,
    LiveAnalyticsFiltersPanel,
    LiveAnalyticsFilter
  ],
  providers: [
    IconService,
  ],
})
export class ClientComponentsModule { }
