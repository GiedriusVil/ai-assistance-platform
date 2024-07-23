/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ClientUtilsModule } from 'client-utils';

import { QueriesConfigurationsService } from './services/queries-configuration.service';
import { DashboardsConfigurationsService } from './services/dashboards-configuration.service';
import { ChartsConfigurationsService } from './services/charts-configuration.service';
import { TilesConfigurationsService } from './services/tiles-configuration.service';
import { FiltersConfigurationsService } from './services/filters-configuration.service';

import {
  EnvironmentServiceV1,
} from 'client-shared-services';

@NgModule({
  imports: [
    ClientUtilsModule,
  ]
})
export class ClientServicesModule {

  static forRoot(environment: any): ModuleWithProviders<ClientServicesModule> {
    return {
      ngModule: ClientServicesModule,
      providers: [
        {
          provide: EnvironmentServiceV1,
          useValue: new EnvironmentServiceV1(environment)
        },
        QueriesConfigurationsService,
        DashboardsConfigurationsService,
        ChartsConfigurationsService,
        TilesConfigurationsService,
        FiltersConfigurationsService
      ]
    };
  }
}
