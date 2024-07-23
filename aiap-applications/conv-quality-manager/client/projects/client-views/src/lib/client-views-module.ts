/**
 * Required Angular framework modules
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { NgJsonEditorModule } from 'ang-jsoneditor';

import { CarbonFrameworkModule } from './carbon-framework.module';
import { MarkdownModule } from 'ngx-markdown';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services';
import { ClientSharedComponentsModule } from 'client-shared-components';
import { ClientSharedViewsModule } from 'client-shared-views';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';
import { ClientComponentsModule } from 'client-components';

import {
  TestWorkersViewV1,
  TestWorkerSaveModalV1,
  TestWorkerDeleteModalV1,
  TestWorkerDocumentationV1,
} from './test-workers-view-v1';

import {
  TestCasesViewV1,
  TestCaseSaveModalV1,
  TestCaseImportModalV1,
  TestCaseDeleteModalV1,
  TestCaseDocumentationV1,
} from './test-cases-view-v1';

import {
  TestExecutionsViewV1,
  TestExecutionSaveModalV1,
  TestExecutionGenerateManyModalV1,
  TestExecutionDeleteModalV1,
  TestExecutionDocumentationV1,
} from './test-executions-view-v1';

@NgModule({
  declarations: [
    TestWorkersViewV1,
    TestWorkerSaveModalV1,
    TestWorkerDeleteModalV1,
    TestWorkerDocumentationV1,

    TestCasesViewV1,
    TestCaseSaveModalV1,
    TestCaseImportModalV1,
    TestCaseDeleteModalV1,
    TestCaseDocumentationV1,

    TestExecutionsViewV1,
    TestExecutionSaveModalV1,
    TestExecutionGenerateManyModalV1,
    TestExecutionDeleteModalV1,
    TestExecutionDocumentationV1,
  ],
  imports: [
    // Required Angular framework modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,

    // Required Carbon framework modules
    CarbonFrameworkModule,
    MarkdownModule.forRoot(),
    // Required ACA framework modules
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientSharedViewsModule,
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,

    NgJsonEditorModule
  ],
  exports: [
    TestWorkersViewV1,
    TestCasesViewV1,
    TestExecutionsViewV1,
  ]
})
export class ClientViewsModule { }
