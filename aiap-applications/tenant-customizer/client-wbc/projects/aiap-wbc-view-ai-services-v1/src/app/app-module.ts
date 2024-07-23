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
  AiServiceDeleteModalV1,
  AiServiceExternalAwsLexV3SaveFormV1,
  AiServiceExternalChatGptV3SaveFormV1,
  AiServiceExternalWaV1SaveFormV1,
  AiServiceExternalWaV2SaveFormV1,
  AiServiceExternalWaVersionsV1,
  AiServiceImportModalV1,
  AiServiceSaveModalV1,
  AiServiceTabExternalV1,
  AiServiceTabGeneralV1,
  AiServicesTableV1,
} from './components';

import {
  AiServicesViewV1,
} from './view';

import { RoutingModule } from './modules/routing.module';
import { CarbonFrameworkModule } from './modules/carbon-framework.module';
import { AiapWbcViewAiServicesV1 } from './app';

@NgModule({
  declarations: [
    AiapWbcViewAiServicesV1,
    // view
    AiServicesViewV1,
    // components
    AiServiceDeleteModalV1,
    AiServiceExternalAwsLexV3SaveFormV1,
    AiServiceExternalChatGptV3SaveFormV1,
    AiServiceExternalWaV1SaveFormV1,
    AiServiceExternalWaV2SaveFormV1,
    AiServiceExternalWaVersionsV1,
    AiServiceImportModalV1,
    AiServiceSaveModalV1,
    AiServiceTabExternalV1,
    AiServiceTabGeneralV1,
    AiServicesTableV1,
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
  entryComponents: [AiapWbcViewAiServicesV1]
})
export class AppModule implements DoBootstrap {

  constructor(
    private injector: Injector
  ) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AiapWbcViewAiServicesV1, { injector: this.injector });
    customElements.define(AiapWbcViewAiServicesV1.getElementTag(), ELEMENT);
  }
}
