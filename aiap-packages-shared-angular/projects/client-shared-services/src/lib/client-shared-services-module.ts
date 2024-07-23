/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  CookieService
} from 'ngx-cookie-service';

import {
  ClientSharedUtilsModule,
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  AiServicesChangeRequestServiceV1,
  BrowserServiceV1,
  ConfigServiceV1,
  EnvironmentServiceV1,
  EventsServiceV1,
  HostLocationServiceV1,
  HTMLDependenciesServiceV1,
  LocalQueryServiceV1,
  LocalStorageServiceV1,
  NotificationServiceV1,
  NotificationServiceV2,
  QueryServiceV1,
  SessionServiceV1,
  SideNavServiceV1,
  StateServiceV1,
  TimezoneServiceV1,
  TranslateHelperServiceV1,
  UtilsServiceV1,
  WbcLocationServiceV1,
} from './services';

@NgModule({
  declarations: [],
  imports: [
    ClientSharedUtilsModule,
  ],
  providers: [
    // native-services
    ActivatedRouteServiceV1,
    BrowserServiceV1,
    ConfigServiceV1,
    EnvironmentServiceV1,
    EventsServiceV1,
    HostLocationServiceV1,
    HTMLDependenciesServiceV1,
    LocalQueryServiceV1,
    AiServicesChangeRequestServiceV1,
    LocalStorageServiceV1,
    NotificationServiceV1,
    NotificationServiceV2,
    QueryServiceV1,
    SessionServiceV1,
    SideNavServiceV1,
    StateServiceV1,
    TimezoneServiceV1,
    TranslateHelperServiceV1,
    UtilsServiceV1,
    WbcLocationServiceV1,
    // external-services
    CookieService,
  ],
  exports: []
})
export class ClientSharedServicesModule { }
