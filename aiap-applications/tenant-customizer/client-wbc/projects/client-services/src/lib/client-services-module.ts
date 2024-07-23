/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { ClientUtilsModule } from 'client-utils';

import {
  // ai-search-and-analysis
  AiSearchAndAnalysisCollectionsServiceV1,
  AiSearchAndAnalysisDocumentsServiceV1,
  AiSearchAndAnalysisProjectsServiceV1,
  AiSearchAndAnalysisServicesServiceV1,
  //
  AiServicesChangesServiceV1,
  AiServicesServiceV1,
  AiSkillsReleasesServiceV1,
  AiSkillsServiceV1,
  AiTestsServiceV1,
  AudioVoiceServiceV1,
  ClientSideDownloadServiceV1,
  EngagementsChangesServiceV1,
  EngagementsServiceV1,
  ObjectStorageBucketsChangesServiceV1,
  ObjectStorageBucketsServiceV1,
  ObjectStorageFilesChangesServiceV1,
  ObjectStorageFilesServiceV1,
  TopicModelingServiceV1,
  LambdaModulesChangesServiceV1,
  LambdaModulesConfigurationsServiceV1,
  LambdaModulesErrorsServiceV1,
  LambdaModulesServiceV1,
  AnswerStoresServiceV1,
  AnswersServiceV1,
  DataExportServiceV1,
  AiTranslationServicesChangesServiceV1,
  DataMaskingConfigurationsServiceV1,
  AiTranslationServicesServiceV1,
  AiTranslationModelsServiceV1,
  AiTranslationModelExamplesServiceV1,
  AiTranslationModelsChangesServiceV1,
  AiTranslationPromptsServiceV1,
  ClassificationCatalogsServiceV1,
  ClassificationCategoriesServiceV1,
  ClassifierModelsChangesServiceV1,
} from './services';
import { JobsQueuesServiceV1 } from './services/jobs-queues.service-v1';

@NgModule({
  declarations: [],
  imports: [
    ClientUtilsModule,
  ],
  providers: [
    // ai-search-and-analysis
    AiSearchAndAnalysisCollectionsServiceV1,
    AiSearchAndAnalysisDocumentsServiceV1,
    AiSearchAndAnalysisProjectsServiceV1,
    AiSearchAndAnalysisServicesServiceV1,
    //
    AiServicesChangesServiceV1,
    AiServicesServiceV1,
    AiSkillsReleasesServiceV1,
    AiSkillsServiceV1,
    AiTestsServiceV1,
    AudioVoiceServiceV1,
    ClientSideDownloadServiceV1,
    EngagementsChangesServiceV1,
    EngagementsServiceV1,
    ObjectStorageBucketsChangesServiceV1,
    ObjectStorageBucketsServiceV1,
    ObjectStorageFilesChangesServiceV1,
    ObjectStorageFilesServiceV1,
    TopicModelingServiceV1,
    LambdaModulesChangesServiceV1,
    LambdaModulesConfigurationsServiceV1,
    LambdaModulesErrorsServiceV1,
    LambdaModulesServiceV1,
    AnswerStoresServiceV1,
    AnswersServiceV1,
    DataExportServiceV1,
    AiTranslationServicesChangesServiceV1,
    DataMaskingConfigurationsServiceV1,
    AiTranslationServicesServiceV1,
    AiTranslationModelsServiceV1,
    AiTranslationModelExamplesServiceV1,
    AiTranslationModelsChangesServiceV1,
    AiTranslationPromptsServiceV1,
    ClassificationCatalogsServiceV1,
    ClassificationCategoriesServiceV1,
    JobsQueuesServiceV1,
    ClassifierModelsChangesServiceV1,
  ],
  exports: []
})
export class ClientServicesModule { }
