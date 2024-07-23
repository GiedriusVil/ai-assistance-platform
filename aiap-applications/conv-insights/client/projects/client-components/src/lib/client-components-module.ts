/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import {
  IconService,
} from 'carbon-components-angular';

import {
  LazyElementsModule,
} from '@angular-extensions/elements';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services';
import { ClientSharedComponentsModule } from 'client-shared-components';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';

import {
  LiveAnalyticsChart,
  LiveAnalyticsChartsPanel,
  LiveAnalyticsMetricsCombo,
  LiveAnalyticsTileMetric,
  LiveAnalyticsTileMetricsPanel,
} from './live-analytics';

import {
  SurveysMetrics,
  SurveysTable,
} from './surveys';


import { CarbonFrameworkModule } from './carbon-framework.module';

@NgModule({
  declarations: [
    // live-analytics
    LiveAnalyticsChart,
    LiveAnalyticsChartsPanel,
    LiveAnalyticsMetricsCombo,
    LiveAnalyticsTileMetric,
    LiveAnalyticsTileMetricsPanel,
    // surveys
    SurveysMetrics,
    SurveysTable,
    // transcripts
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientUtilsModule,
    ClientServicesModule,
    CarbonFrameworkModule,
    NgJsonEditorModule,
    LazyElementsModule,
  ],
  providers: [
    IconService,
  ],
  exports: [
    // live-analytics
    LiveAnalyticsChart,
    LiveAnalyticsChartsPanel,
    LiveAnalyticsMetricsCombo,
    LiveAnalyticsTileMetric,
    LiveAnalyticsTileMetricsPanel,
    // surveys
    SurveysMetrics,
    SurveysTable,
    // transcripts
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ClientComponentsModule { }
