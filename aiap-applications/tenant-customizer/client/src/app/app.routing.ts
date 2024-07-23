/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { MainView } from './views/main-view';

import { UnauthorizedView } from 'client-shared-views'

import { ElementRoutingModule } from 'client-shared-utils';

import {
  AiSearchAndAnalysisServicesViewV1,
  AiSearchAndAnalysisProjectsViewV1,
  AiSearchAndAnalysisCollectionsViewV1,
  AiSearchAndAnalysisDocumentsViewV1,
  AiServicesViewV1,
  AnswerViewV1,
  AiServicesChangesViewV1,
  AiServiceViewV1,
  AiTestOverallView,
  AiTestIntentsView,
  AiTestResultslView,
  AiTestMatrixView,
  AiTestsView,
  AiTestView,
  AiTranslationServicesViewV1,
  AiTranslationServicesChangesViewV1,
  AiTranslationModelsViewV1,
  AiTranslationModelsChangesViewV1,
  AiTranslationModelExamplesViewV1,
  AiTranslationPromptsViewV1,
  AiTranslationPromptConfigurationViewV1,
  AnswerStoresViewV1,
  AnswersViewV1,
  AudioVoiceServicesViewV1,
  ChatWidgetTestView,
  ClassificationCatalogsViewV1,
  ClassificationCategoryViewV1,
  ClassifierModelsView,
  DataMaskingConfigurationViewV1,
  DiagramEditorView,
  EngagementsViewV1,
  EngagementsChangesViewV1,
  JobsAndQueuesBoardViewV1,
  JobsQueuesViewV1,
  LambdaModulesViewV1,
  LambdaModulesChangesView,
  LambdaModulesConfigurationsViewV1,
  LiveMetricsConfigurationView,
  ObjectStorageFilesChangesViewV1,
  ObjectStorageFilesViewV1,
  ObjectStorageBucketsChangesViewV1,
  ObjectStorageBucketsViewV1,
  ClassifierModelsChangesViewV1,
  AiServicesChangesRequestViewV1,
} from 'client-views';

const OUTLET = 'tenantCustomizer';
const ROUTES: Routes = [
  {
    path: 'main-view',
    component: MainView,
    outlet: OUTLET,
    children: [
      UnauthorizedView.route(),
      DiagramEditorView.route([]),
      AiSearchAndAnalysisServicesViewV1.route([
        AiSearchAndAnalysisProjectsViewV1.route([
          AiSearchAndAnalysisCollectionsViewV1.route([
            AiSearchAndAnalysisDocumentsViewV1.route([]),
          ])
        ]),
      ]),
      AiServicesViewV1.route([AiServiceViewV1.route()]),
      AiServicesChangesViewV1.route(),
      AiServicesChangesRequestViewV1.route(),
      AiTestsView.route([
        AiTestView.route([
          AiTestOverallView.route(),
          AiTestIntentsView.route(),
          AiTestResultslView.route(),
          AiTestMatrixView.route(),
        ]),
      ]),
      AiTranslationServicesViewV1.route([
        AiTranslationModelsViewV1.route([
          AiTranslationModelExamplesViewV1.route([]),
        ]),
        AiTranslationPromptsViewV1.route([
          AiTranslationPromptConfigurationViewV1.route([]),
        ]),
      ]),
      AiTranslationServicesChangesViewV1.route(),
      AiTranslationModelsChangesViewV1.route(),
      AnswerStoresViewV1.route([
        AnswersViewV1.route([
          AnswerViewV1.route([])
        ])
      ]),
      AudioVoiceServicesViewV1.route([]),
      ChatWidgetTestView.route([]),
      ClassificationCatalogsViewV1.route([]),
      ClassificationCategoryViewV1.route([]),
      ClassifierModelsView.route([]),
      ClassifierModelsChangesViewV1.route(),
      DataMaskingConfigurationViewV1.route([]),
      DiagramEditorView.route([]),
      EngagementsViewV1.route([]),
      EngagementsChangesViewV1.route(),
      JobsQueuesViewV1.route([]),
      JobsAndQueuesBoardViewV1.route([]),
      LambdaModulesViewV1.route([]),
      LambdaModulesConfigurationsViewV1.route([]),
      LambdaModulesChangesView.route(),
      LiveMetricsConfigurationView.route(),
      ObjectStorageFilesChangesViewV1.route(),
      ObjectStorageFilesViewV1.route(),
      ObjectStorageBucketsChangesViewV1.route(),
      ObjectStorageBucketsViewV1.route(),
      {
        path: '**',
        redirectTo: 'engagements-v1',
      }
    ]
  },
  {
    path: '**',
    redirectTo: `/(${OUTLET}:main-view/engagements-v1)`,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    ElementRoutingModule.withRoutes(
      ROUTES,
      {
        onSameUrlNavigation: 'reload',
      })],
  exports: [
    ElementRoutingModule,
  ],
})
export class AppRouting { }
