/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { ClientUtilsModule } from 'client-utils';

import {
  ClientSideDownloadServiceV1,
  EventsServiceV1,
  HTMLDependenciesServiceV1,
  TopicModelingService,
  ConversationService,
  TranscriptsService,
  UtteranceService,
  DataService,
  AuditService,
  SurveyService
} from './services';

@NgModule({
  declarations: [],
  imports: [
    ClientUtilsModule,
  ],
  providers: [
    ClientSideDownloadServiceV1,
    EventsServiceV1,
    HTMLDependenciesServiceV1,
    TopicModelingService,
    ConversationService,
    TranscriptsService,
    UtteranceService,
    DataService,
    AuditService,
    SurveyService
  ],
  exports: []
})
export class ClientServicesModule { }
