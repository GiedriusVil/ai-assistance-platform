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

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  ClientSharedUtilsModule,
  UIMissingTranslationHandler,
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
  AiTranslationServiceExternalWatsonxSaveFormV1,
  AiTranslationServiceExternalWltSaveFormV1,
  AiTranslationServiceDeleteModalV1,
  AiTranslationServiceImportModalV1,
  AiTranslationServiceSaveModalV1,
  AiTranslationServiceTabExternalV1,
  AiTranslationServiceTabGeneralV1,
  AiTranslationServicesTableV1,
} from './components';

import {
  AiTranslationServicesViewV1,
} from './view';

import { RoutingModule } from './modules/routing.module';
import { CarbonFrameworkModule } from './modules/carbon-framework.module';
import { AiapWbcViewAiTranslationServicesV1 } from './app';

@NgModule({
  declarations: [
    AiapWbcViewAiTranslationServicesV1,
    // view
    AiTranslationServicesViewV1,
    // components
    AiTranslationServiceExternalWatsonxSaveFormV1,
    AiTranslationServiceExternalWltSaveFormV1,
    AiTranslationServiceDeleteModalV1,
    AiTranslationServiceImportModalV1,
    AiTranslationServiceSaveModalV1,
    AiTranslationServiceTabExternalV1,
    AiTranslationServiceTabGeneralV1,
    AiTranslationServicesTableV1,
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
  entryComponents: [AiapWbcViewAiTranslationServicesV1]
})
export class AppModule implements DoBootstrap {

  constructor(
    private injector: Injector
  ) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AiapWbcViewAiTranslationServicesV1, { injector: this.injector });
    customElements.define(AiapWbcViewAiTranslationServicesV1.getElementTag(), ELEMENT);
  }
}
