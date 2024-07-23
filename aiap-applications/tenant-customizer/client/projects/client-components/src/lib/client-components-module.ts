/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgJsonEditorModule } from 'ang-jsoneditor';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import {
  IconService,
} from 'carbon-components-angular';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services'
import { ClientSharedComponentsModule } from 'client-shared-components';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';

import {
  AiTestOverallTable,
  AiTestIntentsTable,
  AiTestMatrixTable,
  AiTestResulTable,
  AiTestTable,
  AiTestsTable,
} from './ai-tests';

import {
  ChatAppV2,
} from './chat-apps';

import {
  AiServicesSkillsComboBox,
  ClassificationModelsTable,
} from './classification-models';

import {
  EngagementsTable,
} from './engagements';

import {
  LambdaModulesChangesTable,
} from './lambda-modules';

import {
  LiveMetricsConfigurationTable,
  MetricsTile,
} from './live-metrics';

import { CarbonFrameworkModule } from './carbon-framework.module';

@NgModule({
  declarations: [
    // ai-tests
    AiTestOverallTable,
    AiTestIntentsTable,
    AiTestMatrixTable,
    AiTestResulTable,
    AiTestTable,
    AiTestsTable,
    // chat-apps
    ChatAppV2,
    AiServicesSkillsComboBox,
    ClassificationModelsTable,
    // engagements
    EngagementsTable,
    // lambda-modules
    LambdaModulesChangesTable,
    // live-metrics
    LiveMetricsConfigurationTable,
    MetricsTile,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientUtilsModule,
    ClientServicesModule,
    CarbonFrameworkModule,
    NgJsonEditorModule,
    MonacoEditorModule,
  ],
  providers: [
    IconService,
  ],
  exports: [
    // ai-tests
    AiTestOverallTable,
    AiTestIntentsTable,
    AiTestMatrixTable,
    AiTestResulTable,
    AiTestTable,
    AiTestsTable,
    // chat-apps
    ChatAppV2,
    AiServicesSkillsComboBox,
    ClassificationModelsTable,
    // engagements
    EngagementsTable,
    // lambda-modules
    LambdaModulesChangesTable,
    // live-metrics
    LiveMetricsConfigurationTable,
    MetricsTile,
  ]
})
export class ClientComponentsModule { }
