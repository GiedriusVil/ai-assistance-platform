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

import { TranslateModule, MissingTranslationHandler, TranslateLoader } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ClientSharedUtilsModule, UIMissingTranslationHandler } from 'client-shared-utils';

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

import { LambdaModulesConfigurationsViewV1 } from './view';

import {
  LambdaModulesConfigurationsDeleteModalV1,
  LambdaModulesConfigurationsImportModalV1,
  LambdaModulesConfigurationsSaveModalV1,
  LambdaModulesConfigurationsTableV1,
} from './components';

import { RoutingModule } from './modules/routing.module';
import { AiapWbcViewLambdaModulesConfigurationsV1 } from './app';
import { CarbonFrameworkModule } from './modules/carbon-framework.module';

@NgModule({
  declarations: [
    AiapWbcViewLambdaModulesConfigurationsV1,
    // view
    LambdaModulesConfigurationsViewV1,
    // components
    LambdaModulesConfigurationsDeleteModalV1,
    LambdaModulesConfigurationsImportModalV1,
    LambdaModulesConfigurationsSaveModalV1,
    LambdaModulesConfigurationsTableV1,
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
  entryComponents: [AiapWbcViewLambdaModulesConfigurationsV1]
})
export class AppModule implements DoBootstrap {
  constructor(
    private injector: Injector
  ) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AiapWbcViewLambdaModulesConfigurationsV1, { injector: this.injector });
    customElements.define(AiapWbcViewLambdaModulesConfigurationsV1.getElementTag(), ELEMENT);
  }
}
