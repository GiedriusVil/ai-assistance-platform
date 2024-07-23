/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { createCustomElement } from '@angular/elements';

import {
  TranslateModule,
  MissingTranslationHandler,
  TranslateLoader,
} from '@ngx-translate/core';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule, ChatWidgetServiceV1 } from 'client-services';

import { AppComponent } from './app.component';
import { QuickLinksModal } from './components/quick-links-modal/quick-links.modal';
import { HeaderZoom } from './components/header-zoom/header-zoom';

import { CustomTranslateLoader } from './translate/custom-translate-loader';
import { CustomMissingTranslationHandler } from './translate/custom-missing-translation-handler';

@NgModule({
  declarations: [
    AppComponent,
    QuickLinksModal,
    HeaderZoom,
  ],
  imports: [
    BrowserModule,
    ClientUtilsModule,
    ClientServicesModule,
    HttpClientModule,
    NgbModule,
    TranslateModule.forRoot({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient, ChatWidgetServiceV1]
      }
    }),
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
