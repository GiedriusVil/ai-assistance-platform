/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { MarkdownModule } from 'ngx-markdown';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { TranslateModule, MissingTranslationHandler, TranslateLoader } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ClientSharedUtilsModule, NGX_MONACO_EDITOR_CONFIGS, UIMissingTranslationHandler } from 'client-shared-utils';

import {
  ClientSharedServicesModule,
  //
  EnvironmentServiceV1,
  LocalStorageServiceV1,
  UITranslateLoaderFactoryV1,
} from 'client-shared-services';

import { ClientSharedComponentsModule } from 'client-shared-components';

import { ClientUtilsModule } from 'client-utils';

import { ClientServicesModule } from 'client-services';

import { ClientComponentsModule } from 'client-components';

import { LambdaModulesViewV1 } from './view';

import {
  LambdaModuleDeleteModalV1,
  LambdaModuleHelpModalV1,
  LambdaModuleSaveModalV1,
  LambdaModulesChangesTableV1,
  LambdaModulesErrorsTableV1,
  LambdaModulesImportModalV1,
  LambdaModulesPullModalV1,
  LambdaModulesTableV1,
  LambdaModuleUsageModalV1,
} from './components';

import { RoutingModule } from './modules/routing.module';
import { AiapWbcViewLambdaModulesV1 } from './app';
import { CarbonFrameworkModule } from './modules/carbon-framework.module';

@NgModule({
  declarations: [
    AiapWbcViewLambdaModulesV1,
    // view
    LambdaModulesViewV1,
    // components
    LambdaModuleDeleteModalV1,
    LambdaModuleHelpModalV1,
    LambdaModuleSaveModalV1,
    LambdaModulesChangesTableV1,
    LambdaModulesErrorsTableV1,
    LambdaModulesImportModalV1,
    LambdaModulesPullModalV1,
    LambdaModulesTableV1,
    LambdaModuleUsageModalV1,
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
    RoutingModule,
    CarbonFrameworkModule,
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
    MarkdownModule.forRoot(),
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
  entryComponents: [AiapWbcViewLambdaModulesV1]
})
export class AppModule implements DoBootstrap {
  constructor(
    private injector: Injector
  ) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AiapWbcViewLambdaModulesV1, { injector: this.injector });
    customElements.define(AiapWbcViewLambdaModulesV1.getElementTag(), ELEMENT);
  }
}
