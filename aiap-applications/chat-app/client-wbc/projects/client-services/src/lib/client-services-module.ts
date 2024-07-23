/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { ClientUtilsModule } from 'client-utils';

import {
  AttachmentsServiceV1,
  BoxConnectorServiceV1,
  ChatWidgetServiceV1,
  ConfigsServiceV1,
  EventBusServiceV1,
  EventsServiceV1,
  HTMLDependenciesServiceV1,
  HTMLElementsServiceV1,
  LocalStorageServiceV1,
  MessagesServiceV1,
  ModalServiceV1,
  SessionServiceV1,
  StorageServiceV1,
  TimestampPipe,
} from './services';

import { NotificationServiceV1 } from './services/notification-v1.service';

@NgModule({
  declarations: [TimestampPipe],
  imports: [
    ClientUtilsModule,
  ],
  providers: [
    BoxConnectorServiceV1,
    ChatWidgetServiceV1,
    ConfigsServiceV1,
    EventsServiceV1,
    HTMLDependenciesServiceV1,
    HTMLElementsServiceV1,
    LocalStorageServiceV1,
    ModalServiceV1,
    SessionServiceV1,
    MessagesServiceV1,
    AttachmentsServiceV1,
    NotificationServiceV1,
    StorageServiceV1,
    EventBusServiceV1,
  ],
  exports: [TimestampPipe]
})
export class ClientServicesModule { }
