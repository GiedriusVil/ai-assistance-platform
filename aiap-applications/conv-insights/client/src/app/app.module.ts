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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';
import { createCustomElement } from '@angular/elements';

import {
  TranslateModule,
  MissingTranslationHandler,
  TranslateLoader,
} from '@ngx-translate/core';

import {
  IconService,
} from 'carbon-components-angular';

import { CarbonFrameworkModule } from './carbon-framework.module';

// This is external library - probably we could implement inhouse this funtionality?
import {
  NgJsonEditorModule,
} from 'ang-jsoneditor';
// Environment gap mock
import {
  environment,
} from '../environments/environment';

// aiap-packages-shared-angular
import {
  ClientSharedUtilsModule,
  UIMissingTranslationHandler,
} from 'client-shared-utils';

import {
  ClientSharedServicesModule,
  LocalStorageServiceV1,
  UITranslateLoaderFactoryV1,
} from 'client-shared-services';

import {
  ClientSharedComponentsModule,
} from 'client-shared-components';

import {
  ClientSharedViewsModule,
} from 'client-shared-views';

// shareble modules
import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';
import { ClientComponentsModule } from 'client-components';
import { ClientViewsModule } from 'client-views';

// carbon-components-angular default imports

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';

import {
  MainView,
} from './views/main-view';


@NgModule({
  declarations: [
    AppComponent,
    // MainView
    MainView,
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    CarbonFrameworkModule,
    LazyElementsModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientSharedViewsModule,
    AppRouting,
    ClientUtilsModule,
    ClientServicesModule.forRoot(environment),
    ClientComponentsModule,
    ClientViewsModule,
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
    IconService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const convInsights = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define(AppComponent.getWbcId(), convInsights);
  }
}
