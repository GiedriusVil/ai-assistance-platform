/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
  ClientSharedUtilsModule,
} from 'client-shared-utils';

import {
  ClientSharedServicesModule
} from 'client-shared-services';

import {
  ClientSharedComponentsModule,
} from 'client-shared-components';

import { LazyElementsModule } from '@angular-extensions/elements';

import { CarbonFrameworkModule } from './carbon-framework.module';

import { UnauthorizedView } from './unauthorized-view/unauthorized-view';

import {
  LiveAnalyticsViewV1,
  LiveAnalyticsViewV2,
} from './live-analytics';

@NgModule({
  declarations: [
    LiveAnalyticsViewV1,
    LiveAnalyticsViewV2,
    UnauthorizedView,
  ],
  imports: [
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    CarbonFrameworkModule,
    LazyElementsModule
  ],
  exports: [
    LiveAnalyticsViewV1,
    LiveAnalyticsViewV2,
    UnauthorizedView,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientSharedViewsModule { }
