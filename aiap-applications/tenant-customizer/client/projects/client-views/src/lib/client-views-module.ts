/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DatePipe } from '@angular/common';
import { LazyElementsModule } from '@angular-extensions/elements';

import { IconService } from 'carbon-components-angular';

import { CarbonFrameworkModule } from './carbon-framework.module';
import { MarkdownModule } from 'ngx-markdown';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { FilterModule } from '@carbon/icons-angular'

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { NGX_MONACO_EDITOR_CONFIGS } from 'client-shared-utils';

import { ClientSharedServicesModule } from 'client-shared-services';
import { ClientSharedComponentsModule } from 'client-shared-components';
import { ClientSharedViewsModule } from 'client-shared-views';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';
import { ClientComponentsModule } from 'client-components';


import {
  AiSearchAndAnalysisServicesViewV1,
  AiSearchAndAnalysisProjectsViewV1,
  AiSearchAndAnalysisCollectionsViewV1,
  AiSearchAndAnalysisDocumentsViewV1,
} from './ai-search-and-analysis';


import {
  AiServicesChangesRequestViewV1,
  AiServicesViewV1,
  AiServicesChangesViewV1,
  AiServiceViewV1,
} from './ai-services';

// ai-tests-view
import {
  AiTestsView,
  AiTestDeleteModal,
  AiTestView,
  AiTestOverallView,
  AiTestIntentsView,
  AiTestResultslView,
  AiTestMatrixView,
} from './ai-tests';

// ai-translations
import {
  AiTranslationServicesViewV1,
  AiTranslationModelsViewV1,
  AiTranslationServicesChangesViewV1,
  AiTranslationModelsChangesViewV1,
  AiTranslationModelExamplesViewV1,
  AiTranslationPromptsViewV1,
  AiTranslationPromptConfigurationViewV1,
} from './ai-translations';

// answers
import {
  AnswerStoresViewV1,
  AnswersViewV1,
  AnswerViewV1,
} from './answers';

// audio-voice-services-view
import {
  AudioVoiceServicesViewV1,
} from './audio-voice-services';

// chat-widget-test-view
import {
  ChatWidgetTestView,
} from './chat-widget-test-view';

// classification-catalogs
import {
  ClassificationCatalogsViewV1,
  ClassificationCategoryViewV1,
} from './classification-catalogs';

// classification-models
import {
  ClassifierModelAiSkillDisplayNameCard,
  ClassifierModelDeleteModal,
  ClassifierModelAddAiSkillModal,
  ClassifierModelSaveAiServiceCard,
  ClassifierModelSaveAiServicesTab,
  ClassifierModelSaveClassifierDocs,
  ClassifierModelSaveClassifierTab,
  ClassifierModelSaveWareTab,
  ClassifierModelSaveModal,
  ClassifierModelTestModal,
  ClassifierModelTrainModal,
  ClassifierModelImportModal,
  ClassifierModelsView,
  ClassifierModelsChangesViewV1,
} from './classification-models';

// data-masking-configuration-view
import {
  DataMaskingConfigurationViewV1,
} from './data-masking-configuration';

// diagram-editors
import {
  DiagramEditorView,
} from './diagram-editors';

// engagements
import {
  EngagementsViewV1,
  EngagementsChangesViewV1,
} from './engagements';

// jobs-and-queues
import {
  JobsQueuesViewV1,
  JobsAndQueuesBoardViewV1,
} from './jobs-and-queues';

// lambda-modules
import {
  LambdaModulesViewV1,
  LambdaModuleChangeView,
  LambdaModulesChangesView,
  LambdaModulesConfigurationsViewV1,
} from './lambda-modules';

// live-metrics-configurations
import {
  LiveMetricsConfigurationView,
  LiveMetricsConfigurationSaveModal,
  LiveMetricsConfigurationDeleteModal,
  LiveMetricsConfigurationImportModal,
} from './live-metrics-configurations';

// object-storages
import {
  ObjectStorageBucketsChangesViewV1,
  ObjectStorageBucketsViewV1,
  ObjectStorageFilesChangesViewV1,
  ObjectStorageFilesViewV1,
} from './object-storages';

@NgModule({
  declarations: [
    // ai-search-and-analysis
    AiSearchAndAnalysisServicesViewV1,
    AiSearchAndAnalysisProjectsViewV1,
    AiSearchAndAnalysisCollectionsViewV1,
    AiSearchAndAnalysisDocumentsViewV1,
    // ai-services
    AiServicesChangesRequestViewV1,
    AiServicesViewV1,
    AiServicesChangesViewV1,
    AiServiceViewV1,
    // ai-tests-view
    AiTestsView,
    AiTestDeleteModal,
    AiTestView,
    AiTestOverallView,
    AiTestIntentsView,
    AiTestResultslView,
    AiTestMatrixView,
    // ai-translations
    AiTranslationServicesViewV1,
    AiTranslationModelsViewV1,
    AiTranslationServicesChangesViewV1,
    AiTranslationModelsChangesViewV1,
    AiTranslationModelExamplesViewV1,
    AiTranslationPromptsViewV1,
    AiTranslationPromptConfigurationViewV1,
    // answers
    AnswerStoresViewV1,
    AnswersViewV1,
    AnswerViewV1,
    // audio-voice-services-view-v1
    AudioVoiceServicesViewV1,
    // chat-widget-test-view
    ChatWidgetTestView,
    // classification-catalogues
    ClassificationCatalogsViewV1,
    ClassificationCategoryViewV1,
    // classification-models
    ClassifierModelAiSkillDisplayNameCard,
    ClassifierModelDeleteModal,
    ClassifierModelAddAiSkillModal,
    ClassifierModelSaveAiServiceCard,
    ClassifierModelSaveAiServicesTab,
    ClassifierModelSaveClassifierDocs,
    ClassifierModelSaveClassifierTab,
    ClassifierModelSaveWareTab,
    ClassifierModelSaveModal,
    ClassifierModelTestModal,
    ClassifierModelTrainModal,
    ClassifierModelImportModal,
    ClassifierModelsView,
    ClassifierModelsChangesViewV1,
    // data-masking-configuration
    DataMaskingConfigurationViewV1,
    // diagram-editors
    DiagramEditorView,
    // engagements
    EngagementsViewV1,
    EngagementsChangesViewV1,
    // jobs-and-queues
    JobsQueuesViewV1,
    JobsAndQueuesBoardViewV1,
    // lambda-modules
    LambdaModulesViewV1,
    LambdaModuleChangeView,
    LambdaModulesChangesView,
    LambdaModulesConfigurationsViewV1,
    // live-metrics-configuration
    LiveMetricsConfigurationView,
    LiveMetricsConfigurationSaveModal,
    LiveMetricsConfigurationDeleteModal,
    LiveMetricsConfigurationImportModal,
    // object-storages
    ObjectStorageBucketsChangesViewV1,
    ObjectStorageBucketsViewV1,
    ObjectStorageFilesChangesViewV1,
    ObjectStorageFilesViewV1,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LazyElementsModule,
    CarbonFrameworkModule,
    MarkdownModule.forRoot(),
    FilterModule,
    //
    NgJsonEditorModule,
    MonacoEditorModule.forRoot(NGX_MONACO_EDITOR_CONFIGS),
    //
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientSharedViewsModule,
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
  ],
  exports: [
    // ai-search-and-analysis
    AiSearchAndAnalysisServicesViewV1,
    AiSearchAndAnalysisProjectsViewV1,
    AiSearchAndAnalysisCollectionsViewV1,
    AiSearchAndAnalysisDocumentsViewV1,
    // ai-services
    AiServicesChangesRequestViewV1,
    AiServicesViewV1,
    AiServicesChangesViewV1,
    AiServiceViewV1,
    // ai-tests
    AiTestsView,
    AiTestDeleteModal,
    AiTestView,
    AiTestOverallView,
    AiTestIntentsView,
    AiTestResultslView,
    AiTestMatrixView,
    // ai-translations
    AiTranslationServicesViewV1,
    AiTranslationModelsViewV1,
    AiTranslationModelExamplesViewV1,
    AiTranslationServicesChangesViewV1,
    AiTranslationPromptsViewV1,
    AiTranslationPromptConfigurationViewV1,
    // answers
    AnswerStoresViewV1,
    AnswersViewV1,
    AnswerViewV1,
    // audio-voice-services
    AudioVoiceServicesViewV1,
    // chat-widget-test-view
    ChatWidgetTestView,
    // classification-catalogs
    ClassificationCatalogsViewV1,
    ClassificationCategoryViewV1,
    // classification-models
    ClassifierModelsView,
    ClassifierModelsChangesViewV1,
    // data-masking-configuration
    DataMaskingConfigurationViewV1,
    // diagram-editors
    DiagramEditorView,
    // engagements
    EngagementsViewV1,
    EngagementsChangesViewV1,
    // jobs-and-queues
    JobsAndQueuesBoardViewV1,
    JobsQueuesViewV1,
    // lambda-modules
    LambdaModulesViewV1,
    LambdaModulesChangesView,
    LambdaModuleChangeView,
    LambdaModulesConfigurationsViewV1,
    // live-metrics-configurations
    LiveMetricsConfigurationView,
    LiveMetricsConfigurationSaveModal,
    LiveMetricsConfigurationDeleteModal,
    LiveMetricsConfigurationImportModal,
    // object-storages
    ObjectStorageBucketsChangesViewV1,
    ObjectStorageBucketsViewV1,
    ObjectStorageFilesChangesViewV1,
    ObjectStorageFilesViewV1,
  ],
  providers: [
    DatePipe,
    IconService,
  ],
})
export class ClientViewsModule { }
