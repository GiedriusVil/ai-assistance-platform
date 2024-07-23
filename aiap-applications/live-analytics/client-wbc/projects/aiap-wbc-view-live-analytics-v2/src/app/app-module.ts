/*
  © Copyright IBM Corporation 2022. All Rights Reserved

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
  LiveAnalyticsChartV2,
  LiveAnalyticsChartsPanelV2,
  LiveAnalyticsFiltersPanelV2,
  LiveAnalyticsTileMetricV2,
  LiveAnalyticsTileMetricsPanelV2,
  LiveAnalyticsMetricsComboV2,
} from './components';

import {
  LiveAnalyticsViewV2,
} from './view';

import { RoutingModule } from './modules/routing.module';
import { CarbonFrameworkModule } from './modules/carbon-framework.module';
import { WbcViewLiveAnalyticsV2 } from './app';

@NgModule({
  declarations: [
    WbcViewLiveAnalyticsV2,
    // view
    LiveAnalyticsViewV2,
    // components
    LiveAnalyticsChartV2,
    LiveAnalyticsChartsPanelV2,
    LiveAnalyticsFiltersPanelV2,
    LiveAnalyticsTileMetricV2,
    LiveAnalyticsTileMetricsPanelV2,
    LiveAnalyticsMetricsComboV2,
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
  entryComponents: [WbcViewLiveAnalyticsV2]
})
export class AppModule implements DoBootstrap {

  constructor(
    private injector: Injector
  ) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(WbcViewLiveAnalyticsV2, { injector: this.injector });
    customElements.define(WbcViewLiveAnalyticsV2.getElementTag(), ELEMENT);
  }
}
