/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { ClientUtilsModule } from 'client-utils';
import {
  ConfigsService,
  EventsServiceV1,
  LocalStorageServiceV1,
  QueryServiceV1,
  HTMLDependenciesServiceV1,
  HTMLElementsService,
  DashboardsConfigurationsService,
  ChartsConfigurationsService,
  LiveAnalyticsService,
  LiveAnalyticsDataTransformationService,
  ChartsService,
  TilesConfigurationsService,
  FiltersConfigurationsService
} from './services';

@NgModule({
  declarations: [],
  imports: [
    ClientUtilsModule
  ],
  providers: [
    ConfigsService,
    EventsServiceV1,
    LocalStorageServiceV1,
    QueryServiceV1,
    HTMLDependenciesServiceV1,
    HTMLElementsService,
    DashboardsConfigurationsService,
    ChartsConfigurationsService,
    LiveAnalyticsService,
    LiveAnalyticsDataTransformationService,
    ChartsService,
    TilesConfigurationsService,
    FiltersConfigurationsService,
  ],
  exports: []
})
export class ClientServicesModule { }
