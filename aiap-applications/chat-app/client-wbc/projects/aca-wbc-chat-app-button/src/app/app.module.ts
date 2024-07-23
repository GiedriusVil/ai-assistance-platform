/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { LazyElementsModule } from '@angular-extensions/elements'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';
import { ClientComponentsModule } from 'client-components';

import { ChatButton, ConsentForm, LanguageSelectionForm } from './components';

import {
  ChatAppButtonService,
  ChatAppButtonConsentService,
  HTMLDependenciesServiceV1,
  StylesService,
  WindowEventsServiceV1
} from './services';

import { AppComponent } from './app.component';

import { createTranslateHttpLoaderFactory } from './translate/custom-translate-loader';
import { CustomMissingTranslationHandler } from './translate/custom-missing-translation-handler';


@NgModule({
  declarations: [
    AppComponent,
    ChatButton,
    ConsentForm,
    LanguageSelectionForm,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
    LazyElementsModule,
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: CustomMissingTranslationHandler,
      },
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateHttpLoaderFactory(AppComponent.getElementTag()),
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
  ],
  providers: [
    ChatAppButtonService,
    ChatAppButtonConsentService,
    HTMLDependenciesServiceV1,
    StylesService,
    WindowEventsServiceV1,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define(AppComponent.getElementTag(), ELEMENT);
  }
}
