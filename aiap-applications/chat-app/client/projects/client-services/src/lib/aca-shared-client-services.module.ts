/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  AttachmentsServiceV1,
  AttachmentsServiceV2,
  BasketServiceV1,
  BotSocketIoServiceV1,
  BotSocketIoServiceV2,
  ChatWidgetServiceV1,
  ClientServiceV1,
  ClientServiceV2,
  ConfigServiceV1,
  ConfigServiceV2,
  DataServiceV1,
  DataServiceV2,
  EventBusServiceV1,
  EventsServiceV1,
  GAcaPropsServiceV1,
  LeftPanelServiceV1,
  LocalStorageServiceV1,
  ParamsServiceV1,
  PermissionServiceV1,
  SessionServiceV1,
  SessionServiceV2,
  StorageServiceV1,
  StorageServiceV2,
  StylesServiceV1,
  StylesServiceV2,
  TimestampPipe,
  TmpErrorsServiceV1,
  ZendeskLiveAgentServiceV1,
  ZendeskLiveAgentServiceV2,
} from './services';

import {
  AcaSharedClientUtilsModule
} from "client-utils";

@NgModule({
  declarations: [TimestampPipe],
  imports: [],
  providers: [
    AttachmentsServiceV1,
    AttachmentsServiceV2,
    BasketServiceV1,
    BotSocketIoServiceV1,
    BotSocketIoServiceV2,
    ChatWidgetServiceV1,
    ClientServiceV1,
    ClientServiceV2,
    ConfigServiceV1,
    ConfigServiceV2,
    DataServiceV1,
    DataServiceV2,
    EventsServiceV1,
    GAcaPropsServiceV1,
    LeftPanelServiceV1,
    LocalStorageServiceV1,
    ParamsServiceV1,
    PermissionServiceV1,
    SessionServiceV1,
    SessionServiceV2,
    StorageServiceV1,
    StorageServiceV2,
    StylesServiceV1,
    StylesServiceV2,
    TmpErrorsServiceV1,
    ZendeskLiveAgentServiceV1,
    ZendeskLiveAgentServiceV2,
    AcaSharedClientUtilsModule,
    EventBusServiceV1,
  ],
  exports: [
    TimestampPipe
  ]
})
export class AcaSharedClientServicesModule { }
