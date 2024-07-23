/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { ClientUtilsModule } from 'client-utils';
import {
  ClientServicesModule,
  SessionServiceV1,
  MessagesServiceV1,
  AttachmentsServiceV1,
  ConfigsServiceV1,
  ModalServiceV1,
  NotificationServiceV1,
} from 'client-services';

import {
  NgbDateCustomAdapter,
  CustomDateParserFormatter,
  //
  AiServiceSuggestionsAttachment,
  BasketAttachment,
  ButtonsAttachment,
  ButtonsListAttachment,
  DropdownAttachment,
  FormAttachment,
  ImageAttachment,
  IntentsMenuAttachment,
  ProductListAttachment,
  TableAttachment,
  VideoAttachment,
  WbcAttachment,
  WdsAttachment,
  PiAgreementModal,
  MsSurveyQuestionsCardComponent,
  MsSurveyResultsCardComponent,
  MsWdsResultsCardComponent,
} from './components-attachments'

import { NgbDateAdapter, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientComponentsModule } from 'client-components';
import { BasketComponent } from './components/basket-component/basket.component';
import { ProductList } from './components/product-list/product.list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Message, WbcMessage } from './components-messages';

import { LazyElementsModule } from '@angular-extensions/elements'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomTranslateLoader } from './translate/custom-translate-loader';
import { CustomMissingTranslationHandler } from './translate/custom-missing-translation-handler';
import { BotNotification, DebugNotification, DefaultNotification, ErrorNotification } from './components-notifications';

import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
  declarations: [
    AppComponent,
    //
    AiServiceSuggestionsAttachment,
    BasketAttachment,
    ButtonsAttachment,
    ButtonsListAttachment,
    DropdownAttachment,
    FormAttachment,
    ImageAttachment,
    IntentsMenuAttachment,
    ProductListAttachment,
    TableAttachment,
    VideoAttachment,
    WbcAttachment,
    WdsAttachment,
    BasketComponent,
    ProductList,
    Message,
    WbcMessage,
    PiAgreementModal,
    BotNotification,
    DebugNotification,
    DefaultNotification,
    ErrorNotification,
    MsSurveyQuestionsCardComponent,
    MsSurveyResultsCardComponent,
    MsWdsResultsCardComponent,
  ],
  imports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
    LazyElementsModule,
    TranslateModule.forRoot({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient, ConfigsServiceV1]
      }
    }),
    HttpClientModule,
    NgxJsonViewerModule,
  ],
  providers: [
    {
      provide: NgbDateAdapter,
      useClass: NgbDateCustomAdapter
    },
    {
      provide: NgbDateParserFormatter,
      useClass: CustomDateParserFormatter
    },
    SessionServiceV1,
    MessagesServiceV1,
    AttachmentsServiceV1,
    ConfigsServiceV1,
    ModalServiceV1,
    NotificationServiceV1,
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
