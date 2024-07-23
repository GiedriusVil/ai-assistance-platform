/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, ModuleWithProviders } from '@angular/core';

import {
  NotificationService
} from 'carbon-components-angular';

import { ActionsService } from './services/actions.service';
import {
  ChartService,
} from './services/chart';
import { ClientSideDownloadService } from './services/clientSideDownload.service';
import { DataService } from './services/data.service';

import { DataExportService } from './services/data-export.service';
import { ConversationService } from './services/conversation.service';
import { UtteranceService } from './services/utterance.service';
import { SurveyService } from './services/survey.service';
import { AuditService } from './services/audit.service';
import { SupervisorActionsService } from './services/supervisor-actions.service';

import { AccessGroupsService } from './services/access-groups.service';

import {
  LiveAnalyticsChartsService,
  LiveAnalyticsConfigurationsService,
  LiveAnalyticsMetricsDataTransformationService,
  LiveAnalyticsMetricsDataService,
  LiveAnalyticsMetricsService,
  LiveAnalyticsTileMetricsDataService,
  AiSkillsReleasesService,
  AiSkillsService,
  TranscriptsService,
  TopicModelingService
} from './services';

import { ConnectionsService } from './services/connections.service';
import { AiServicesService } from './services/ai-services.service';
import { ClientUtilsModule } from 'client-utils';

import {
  EnvironmentServiceV1,
} from 'client-shared-services';

@NgModule({
  imports: [ClientUtilsModule]
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
        ActionsService,
        //
        ChartService,
        //
        ClientSideDownloadService,
        DataService,
        DataExportService,
        ConversationService,
        UtteranceService,
        SurveyService,
        // live-analytics
        LiveAnalyticsChartsService,
        LiveAnalyticsConfigurationsService,
        LiveAnalyticsMetricsDataTransformationService,
        LiveAnalyticsMetricsDataService,
        LiveAnalyticsMetricsService,
        LiveAnalyticsTileMetricsDataService,
        //
        AuditService,
        SupervisorActionsService,
        AiSkillsReleasesService,
        AiSkillsService,
        AccessGroupsService,
        AiServicesService,
        ConnectionsService,
        TranscriptsService,
        TopicModelingService
      ]
    };
  }
}
