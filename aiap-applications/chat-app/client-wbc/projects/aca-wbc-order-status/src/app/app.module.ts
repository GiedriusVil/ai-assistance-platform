/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  TranslateModule,
  MissingTranslationHandler,
  TranslateLoader,
} from '@ngx-translate/core';

import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomTranslateLoader } from './translate/custom-translate-loader';
import { CustomMissingTranslationHandler } from './translate/custom-missing-translation-handler';
import { ClientUtilsModule } from 'client-utils';

import {
  ClientServicesModule,
  ChatWidgetServiceV1,
  HTMLElementsServiceV1,
  ModalServiceV1,
  ConfigsServiceV1,
  LocalStorageServiceV1,
} from 'client-services';

import { ClientComponentsModule } from 'client-components';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: CustomMissingTranslationHandler,
      },
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient, ConfigsServiceV1, LocalStorageServiceV1],
      },
    }),
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
  ],
  providers: [
    ChatWidgetServiceV1,
    HTMLElementsServiceV1,
    ModalServiceV1,
    LocalStorageServiceV1,
  ],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AppComponent, {
      injector: this.injector,
    });
    customElements.define(AppComponent.getElementTag(), ELEMENT);
  }
}
