/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, DoBootstrap, Injector, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { LazyElementsModule } from '@angular-extensions/elements';

import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import {
  TranslateModule,
  MissingTranslationHandler,
  TranslateLoader,
} from '@ngx-translate/core';

import { AuthenticationGuard } from './guards/authentication';
import { CarbonFrameworkModule } from './carbon-framework.module';
import { IconService } from 'carbon-components-angular';
import { iconServiceFactory } from './carbon-framework.factories';

import { MainView } from './views/main-view/main-view';

import {
  ClientSharedUtilsModule,
  ElementRoutingModule,
  UIMissingTranslationHandler,
} from 'client-shared-utils';

import {
  ClientSharedServicesModule,
  LocalStorageServiceV1,
  UITranslateLoaderFactoryV1,
} from 'client-shared-services';

import { ClientSharedComponentsModule } from 'client-shared-components';
import { ClientSharedViewsModule } from 'client-shared-views';

import { ClientUtilsModule } from 'client-utils';
import { ClientComponentsModule } from 'client-components';
import { ClientServicesModule } from 'client-services';
import { ClientViewsModule } from 'client-views';

// Environment gap mock
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    MainView,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: iconServiceFactory,
      deps: [IconService],
      multi: true
    },
    AuthenticationGuard,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LazyElementsModule,
    CarbonFrameworkModule,
    HttpClientModule,
    NgxJsonViewerModule,
    ClientUtilsModule,
    ClientServicesModule.forRoot(environment),
    ClientComponentsModule,
    ClientViewsModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientSharedViewsModule,
    AppRouting,
    ElementRoutingModule,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const PolicyManager = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define(AppComponent.getWbcId(), PolicyManager);
  }

}
