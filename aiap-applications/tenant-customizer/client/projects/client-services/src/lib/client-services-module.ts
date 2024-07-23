/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ClientUtilsModule } from 'client-utils';

import {
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  AiServicesServiceV1,
  AiSkillsReleasesService,
  AiSkillsService,
  ClassifierServiceV1,
} from './services';


import { DataExportService } from './services/data-export.service';
import { AuditService } from './services/audit.service';
import { SupervisorActionsService } from './services/supervisor-actions.service';

import { LiveMetricsConfigurationsService } from './services/live-metrics-configurations.service';
import { DataMaskingConfigurationsService } from './services/data-masking-configurations.service';
import { UnspscService } from './services/unspsc.service';
import { LambdaModulesServiceV1 } from './services/lambda-modules-service-v1';
import { LambdaModulesChangesService } from './services/lambda-modules-changes.service';
import { LambdaModulesErrorsService } from './services/lambda-modules-errors.service';
import { AiTestsService } from './services/ai-tests.service';
import { LambdaModulesConfigurationsServiceV1 } from './services/lambda-modules-configurations-service-v1';
import { EngagementsServiceV1 } from './services/engagements-service-v1';

import { AiTranslationServicesService } from './services/ai-translation-services.service';
import { AiTranslationModelsService } from './services/ai-translation-models.service';
import { AiTranslationModelExamplesService } from './services/ai-translation-model-examples.service';

@NgModule({
  imports: [
    ClientUtilsModule
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
        DataExportService,
        AuditService,
        SupervisorActionsService,
        AiServicesServiceV1,
        AiSkillsReleasesService,
        AiSkillsService,
        LiveMetricsConfigurationsService,
        DataMaskingConfigurationsService,
        UnspscService,
        LambdaModulesServiceV1,
        LambdaModulesChangesService,
        LambdaModulesErrorsService,
        AiTestsService,
        LambdaModulesConfigurationsServiceV1,
        EngagementsServiceV1,
        ClassifierServiceV1,
        AiTranslationServicesService,
        AiTranslationModelsService,
        AiTranslationModelExamplesService,
      ]
    };
  }
}
