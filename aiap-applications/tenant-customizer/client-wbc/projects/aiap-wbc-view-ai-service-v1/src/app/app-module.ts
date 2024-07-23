/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { TranslateModule, MissingTranslationHandler, TranslateLoader } from '@ngx-translate/core';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  ClientSharedUtilsModule, 
  UIMissingTranslationHandler,
  NGX_MONACO_EDITOR_CONFIGS
} from 'client-shared-utils';

import {
  ClientSharedServicesModule,
  //
  EnvironmentServiceV1,
  LocalStorageServiceV1,
  UITranslateLoaderFactoryV1,
} from 'client-shared-services';

import {
  ClientSharedComponentsModule,
} from 'client-shared-components';

import {
  ClientUtilsModule,
} from 'client-utils';

import {
  ClientServicesModule,
} from 'client-services';

import {
  ClientComponentsModule,
} from 'client-components';

import {
  AiServiceViewV1,
} from './view';

import {
  AiServiceAwsLexV1ContentV1,
  AiServiceChatGptV3ContentV1,
  AiServiceWaV1ContentV1,
  AiServiceWaV2ContentV1,
  AiSkillCompareModalV1,
  AiSkillDeleteModalV1,
  AiSkillDialogTreeModalV1,
  AiSkillManageModalV1,
  AiSkillPullModalV1,
  AiSkillReleaseDeleteModalV1,
  AiSkillReleaseDeployModalV1,
  AiSkillReleaseTestModalV1,
  AiSkillSyncByFileModalV1,
  AiSkillSyncModalV1,
  AiSkillTestModalV1,
  AiSkillsReleasesTableV1,
  AiSkillsTableV1,
} from './components';

import { RoutingModule } from './modules/routing.module';
import { CarbonFrameworkModule } from './modules/carbon-framework.module';
import { AiapWbcViewAiServiceV1 } from './app';

@NgModule({
  declarations: [
    AiapWbcViewAiServiceV1,
    // view
    AiServiceViewV1,
    // components
    AiServiceAwsLexV1ContentV1,
    AiServiceChatGptV3ContentV1,
    AiServiceWaV1ContentV1,
    AiServiceWaV2ContentV1,
    AiSkillCompareModalV1,
    AiSkillDeleteModalV1,
    AiSkillDialogTreeModalV1,
    AiSkillManageModalV1,
    AiSkillPullModalV1,
    AiSkillReleaseDeleteModalV1,
    AiSkillReleaseDeployModalV1,
    AiSkillReleaseTestModalV1,
    AiSkillSyncByFileModalV1,
    AiSkillSyncModalV1,
    AiSkillTestModalV1,
    AiSkillsReleasesTableV1,
    AiSkillsTableV1,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //
    NgbModule,
    //
    CarbonFrameworkModule,
    RoutingModule,
    //
    ClientSharedUtilsModule,
    ClientSharedComponentsModule,
    ClientSharedServicesModule,
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
    //
    NgJsonEditorModule,
    MonacoEditorModule.forRoot(NGX_MONACO_EDITOR_CONFIGS),
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler, 
        useClass: UIMissingTranslationHandler 
      },
      loader: {
        provide: TranslateLoader,
        useFactory: UITranslateLoaderFactoryV1,
        deps: [
          LocalStorageServiceV1,
        ]
      }
    }),
  ],
  providers: [
    {
      provide: EnvironmentServiceV1,
      useValue: new EnvironmentServiceV1({}),
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AiapWbcViewAiServiceV1]
})
export class AppModule implements DoBootstrap {

  constructor(
    private injector: Injector
  ) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AiapWbcViewAiServiceV1, { injector: this.injector });
    customElements.define(AiapWbcViewAiServiceV1.getElementTag(), ELEMENT);
  }
}
