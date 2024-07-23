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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';
import { createCustomElement } from '@angular/elements';

import {
  TranslateModule,
  MissingTranslationHandler,
  TranslateLoader,
} from '@ngx-translate/core';

// carbon-components-angular default imports
import { IconService } from 'carbon-components-angular';

// This is external library - probably we could implement inhouse this funtionality?
import { NgJsonEditorModule } from 'ang-jsoneditor';

// Environment gap mock
import { environment } from '../environments/environment';

// aiap-packages-shared-angular
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

// Interceptors
import { HTTPGenericInterceptor } from './interceptors';

import { CarbonFrameworkModule } from './carbon-framework.module';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';

import {
  MainView,
} from './views/main-view';

@NgModule({
  declarations: [
    AppComponent,
    MainView,
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    CarbonFrameworkModule,
    AppRouting,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientSharedViewsModule,
    LazyElementsModule,
    ClientUtilsModule,
    ClientServicesModule.forRoot(environment),
    ClientComponentsModule,
    ClientViewsModule,
    NgJsonEditorModule,
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
  providers: [
    IconService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPGenericInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const tenantCustomizer = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define(AppComponent.getWbcId(), tenantCustomizer);
  }
}
