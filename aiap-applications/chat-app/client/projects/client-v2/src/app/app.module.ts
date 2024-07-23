/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { APP_INITIALIZER, NgModule, Injector, DoBootstrap, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LazyElementsModule } from '@angular-extensions/elements';

// Bootstrap
import { TranslateModule, MissingTranslationHandler, TranslateLoader } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { APP_BASE_HREF } from '@angular/common';

import {
  HeaderActionsComponent,
  ChatMessagesComponent,
  AudioComponent,
  ProductList,
  TypingDotsComponent,
  SuggestionsComponent,
  LeftPanelOpenButton,
  BasketComponent
} from './components';


import {
  BaseModal,
  CloseModal,
  SurveyModal,
  TestCasesModal,
  ContentModal,
} from './components-modals';

import {
  ChatFooterPanel,
  ChatHeaderPanel,
  ChatLeftPanel,
  ChatWindowPanel,
} from './layout';

import {
  HostPageInfoService,
  CustomTranslateLoader,
  ModalService,
  HTMLElementsService,
  EnvironmentServiceImpl,
} from './services';

import {
  CustomMissingTranslationHandler,
} from 'client-utils';

// Views
import {
  AuthorizationErrorView,
  BasketView,
  MainView,
  LoadingView,
} from './views';

import {
  AcaSharedClientServicesModule,
  BasketServiceV1,
  ChatWidgetServiceV1,
  EventsServiceV1,
  GAcaPropsServiceV1,
  LocalStorageServiceV1,
  ParamsServiceV1,
  PermissionServiceV1,
  ClientServiceV2,
  StylesServiceV2,
  ZendeskLiveAgentServiceV2,
  BotSocketIoServiceV2,
  LeftPanelServiceV1,
  AttachmentsServiceV2,
  ConfigServiceV2,
  DataServiceV2,
  SessionServiceV2,
  StorageServiceV2,
  EnvironmentServiceV1,
  EventBusServiceV1,
} from 'client-services';

import {
  AcaSharedClientComponentsModule
} from 'client-components';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new CustomTranslateLoader(httpClient);
}

export function configServiceFactory(provider: ConfigServiceV2) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
    // components
    HeaderActionsComponent,
    ChatMessagesComponent,
    AudioComponent,
    ProductList,
    TypingDotsComponent,
    SuggestionsComponent,
    LeftPanelOpenButton,
    BasketComponent,
    // components-modals
    BaseModal,
    CloseModal,
    SurveyModal,
    TestCasesModal,
    ContentModal,
    // layout
    ChatFooterPanel,
    ChatHeaderPanel,
    ChatLeftPanel,
    ChatWindowPanel,
    // views
    AuthorizationErrorView,
    BasketView,
    MainView,
    LoadingView,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    LazyElementsModule,
    AcaSharedClientServicesModule,
    AcaSharedClientComponentsModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    ChatWidgetServiceV1,
    SessionServiceV2,
    DataServiceV2,
    ClientServiceV2,
    ConfigServiceV2,
    StorageServiceV2,
    PermissionServiceV1,
    GAcaPropsServiceV1,
    BasketServiceV1,
    StylesServiceV2,
    ParamsServiceV1,
    EventsServiceV1,
    ZendeskLiveAgentServiceV2,
    BotSocketIoServiceV2,
    AttachmentsServiceV2,
    HostPageInfoService,
    ModalService,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      deps: [ConfigServiceV2],
      multi: true
    },
    HTMLElementsService,
    LocalStorageServiceV1,
    LeftPanelServiceV1,
    {
      provide: EnvironmentServiceV1,
      useClass: EnvironmentServiceImpl
    },
    EventBusServiceV1
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AppComponent, { injector: this.injector });
    const ELEMENT_TAG_NAME = AppComponent.getHTMLTagName();

    const ELEMENT_OLD = customElements.get(ELEMENT_TAG_NAME);
    if (
      !ELEMENT_OLD
    ) {
      customElements.define(ELEMENT_TAG_NAME, ELEMENT);
    }
  }
}
