/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import {
  IconService,
} from 'carbon-components-angular';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services';
import { ClientSharedComponentsModule } from 'client-shared-components';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';

import { CarbonFrameworkModule } from './carbon-framework.module';


import {
  ChartsConfigurationTableV1,
} from './charts';

import {
  DashboardsConfigurationTableV1,
} from './dashboards';

import {
  TilesConfigurationTableV1,
} from './tiles';

import {
  QueriesConfigurationTableV1,
} from './queries';

import {
  FiltersConfigurationTableV1,
} from './filters';


@NgModule({
  declarations: [
    ChartsConfigurationTableV1,
    DashboardsConfigurationTableV1,
    TilesConfigurationTableV1,
    QueriesConfigurationTableV1,
    FiltersConfigurationTableV1,
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
  ],
  providers: [
    IconService,
  ],
  exports: [
    ChartsConfigurationTableV1,
    DashboardsConfigurationTableV1,
    TilesConfigurationTableV1,
    QueriesConfigurationTableV1,
    FiltersConfigurationTableV1,
  ]
})
export class ClientComponentsModule { }
