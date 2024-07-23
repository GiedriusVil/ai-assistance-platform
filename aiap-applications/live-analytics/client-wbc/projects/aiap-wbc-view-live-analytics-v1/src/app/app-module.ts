/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  NgModule,
  DoBootstrap,
  Injector,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';

import {
  IconService,
} from 'carbon-components-angular';

import {
  TranslateModule,
  MissingTranslationHandler,
  TranslateLoader,
} from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  NotificationService,
} from 'client-shared-carbon';

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
  ClientUtilsModule,
} from 'client-utils';

import {
  ClientServicesModule,
  EventsServiceV1,
  HTMLElementsService,
  HTMLDependenciesServiceV1,
  QueryServiceV1,
} from 'client-services';

import {
  ClientComponentsModule,
} from 'client-components';

import { AppRoutingModule } from './modules/routing-module';

import { EnvironmentServiceImpl } from './services';

import { CarbonFrameworkModule } from './modules/carbon-framework-module';
import { AiapWbcViewLiveAnalyticsV1 } from './app';

@NgModule({
  declarations: [
    AiapWbcViewLiveAnalyticsV1,
    // Components 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule,
    CarbonFrameworkModule,
    HttpClientModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,

    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: UIMissingTranslationHandler,
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
    EventsServiceV1,
    HTMLElementsService,
    HTMLDependenciesServiceV1,
    LocalStorageServiceV1,
    IconService,
    NotificationService,
    QueryServiceV1,
    {
      provide: EnvironmentServiceV1,
      useClass: EnvironmentServiceImpl
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AiapWbcViewLiveAnalyticsV1]
})
export class AppModule implements DoBootstrap {

  constructor(
    private injector: Injector,
  ) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AiapWbcViewLiveAnalyticsV1, { injector: this.injector });
    customElements.define(AiapWbcViewLiveAnalyticsV1.getElementTag(), ELEMENT);
  }
}
