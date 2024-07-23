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

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import {
  TranslateModule,
  MissingTranslationHandler,
  TranslateLoader,
} from '@ngx-translate/core';

import {
  IconService,
} from 'carbon-components-angular';

// Environment gap mock
import { environment } from '../environments/environment';

import { CarbonFrameworkModule } from './carbon-framework.module';
// aiap-packages-shared-angular
import {
  ClientSharedUtilsModule,
  ElementRoutingModule,
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
  ClientSharedViewsModule,
} from 'client-shared-views';

// ACA_CHARABLE_MODULES
import { ClientUtilsModule } from 'client-utils';
import { ClientComponentsModule } from 'client-components';
import { ClientServicesModule } from 'client-services';
import { ClientViewsModule } from 'client-views';

/*
 * Exorted components
 */
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';

import {
  MainView,
} from './views/main-view';

@NgModule({
  declarations: [
    AppComponent,
    MainView,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CarbonFrameworkModule,
    HttpClientModule,
    NgJsonEditorModule,
    ElementRoutingModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientSharedViewsModule,
    ClientUtilsModule,
    ClientServicesModule.forRoot(environment),
    ClientComponentsModule,
    ClientViewsModule,
    AppRouting,
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
      provide: EnvironmentServiceV1,
      useValue: new EnvironmentServiceV1({}),
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const acaConvQualityManager = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define(AppComponent.getWbcId(), acaConvQualityManager);
  }
}
