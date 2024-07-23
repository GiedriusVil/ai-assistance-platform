/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { createCustomElement } from '@angular/elements';

import {
  TranslateModule,
  MissingTranslationHandler,
  TranslateLoader,
} from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { ClientUtilsModule } from 'client-utils';
import { ChatWidgetServiceV1, ClientServicesModule } from 'client-services';
import { CustomTranslateLoader } from './translate/custom-translate-loader';
import { CustomMissingTranslationHandler } from './translate/custom-missing-translation-handler';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ClientUtilsModule,
    ClientServicesModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient, ChatWidgetServiceV1]
      }
    })
  ],
  providers: []
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define(AppComponent.getElementTag(), ELEMENT);
  }
}
