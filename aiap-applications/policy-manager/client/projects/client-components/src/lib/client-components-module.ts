/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { LazyElementsModule } from '@angular-extensions/elements';

import { NotificationService, IconService } from 'carbon-components-angular';

// Shared
import { ClientSharedComponentsModule } from 'client-shared-components';

import { CarbonFrameworkModule } from './carbon-framework.module';


// Tables
import { AcaMetricsSummaryTable } from './metrics-summary-table/aca-metrics-summary.table';

// Components
import { AcaMetricsTile } from './metrics-tile/aca-metrics.tile';
import { ClientSharedUtilsModule} from 'client-shared-utils';

@NgModule({
  declarations: [
    // Tables
    AcaMetricsSummaryTable,
    // Components
    AcaMetricsTile,
    // VALIDATION
  ],
  imports: [
    BrowserModule,
    CarbonFrameworkModule,
    ClientSharedComponentsModule,
    ClientSharedUtilsModule,
    FormsModule,
    LazyElementsModule,
  ],
  providers: [
    IconService,
    NotificationService,
  ],
  exports: [
    // Tables
    AcaMetricsSummaryTable,
    // Components
    AcaMetricsTile,
  ]
})
export class ClientComponentsModule { }
