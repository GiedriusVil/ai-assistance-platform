/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateModule, MissingTranslationHandler, TranslateLoader } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  ClientUtilsModule,
} from 'client-utils';

import {
  ClientServicesModule,
  ChatWidgetServiceV1,
  EventsServiceV1,
  HTMLElementsServiceV1,
  HTMLDependenciesServiceV1,
  LocalStorageServiceV1,
  ModalServiceV1,
} from 'client-services';

import {
  ClientComponentsModule,
  createTranslateHttpLoaderFactory,
  WbcMissingTranslationHandler,
} from 'client-components';

import {
  AnswerComponent,
} from './components';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    // Components 
    AnswerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: WbcMissingTranslationHandler,
      },
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateHttpLoaderFactory(AppComponent.getElementTag()),
        deps: [HttpClient]
      }
    }),
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
  ],
  providers: [
    ChatWidgetServiceV1,
    EventsServiceV1,
    HTMLElementsServiceV1,
    HTMLDependenciesServiceV1,
    LocalStorageServiceV1,
    ModalServiceV1,
  ],
})
export class AppModule implements DoBootstrap {

  constructor(
    private injector: Injector,
  ) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define(AppComponent.getElementTag(), ELEMENT);
  }
}
