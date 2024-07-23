/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { APP_INITIALIZER, InjectionToken, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LazyElementsModule } from '@angular-extensions/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Bootstrap
import { TranslateModule, MissingTranslationHandler, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

// General
import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';

// Guards
import { AuthenticationGuard } from './guards/authentication';

import {
  CustomMissingTranslationHandler,
  AcaSharedClientUtilsModule
} from 'client-utils';

import {
  AcaSharedClientComponentsModule
} from 'client-components';


// Services
import {
  BasketServiceV1,
  EventsServiceV1,
  GAcaPropsServiceV1,
  ParamsServiceV1,
  PermissionServiceV1,
  ClientServiceV1,
  StylesServiceV1,
  ZendeskLiveAgentServiceV1,
  BotSocketIoServiceV1,
  TmpErrorsServiceV1,
  AttachmentsServiceV1,
  ConfigServiceV1,
  DataServiceV1,
  SessionServiceV1,
  StorageServiceV1,
  AcaSharedClientServicesModule,
  EnvironmentServiceV1
} from 'client-services';

// Views
import {
  AuthorizationErrorView,
  BasketView,
  MainView,
  SystemErrorView,
} from './views';

// Components
import {
  AudioComponent,
  AuthComponent,
  CloseComponent,
  ErrorComponent,
  FooterComponent,
  HeaderComponent,
  HeaderActionsComponent,
  PreChatComponent,
  ProductList,
  SurveyComponent,
  TestCasesComponent,
  TypingDotsComponent,
  SuggestionsComponent,
  ChatMessagesComponent
} from './components';

import { EnvironmentServiceImpl } from './services';

export function configServiceFactory(provider: ConfigServiceV1) {
  return () => provider.load();
}

export const WINDOW_TOKEN = new InjectionToken('Window');
function _window() {
  return window;
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    // Components
    AudioComponent,
    AuthComponent,
    CloseComponent,
    ErrorComponent,
    FooterComponent,
    SuggestionsComponent,
    HeaderComponent,
    HeaderActionsComponent,
    PreChatComponent,
    ProductList,
    SurveyComponent,
    TestCasesComponent,
    TypingDotsComponent,
    // Views
    AuthorizationErrorView,
    BasketView,
    MainView,
    SystemErrorView,
    ChatMessagesComponent,
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRouting,
    NgbModule,
    ReactiveFormsModule,
    LazyElementsModule,
    NgxJsonViewerModule,
    AcaSharedClientServicesModule,
    AcaSharedClientUtilsModule,
    AcaSharedClientComponentsModule,
  ],
  providers: [
    { provide: WINDOW_TOKEN, useFactory: _window },
    PermissionServiceV1,
    ConfigServiceV1,
    StorageServiceV1,
    DataServiceV1,
    ClientServiceV1,
    StylesServiceV1,
    ParamsServiceV1,
    EventsServiceV1,
    GAcaPropsServiceV1,
    ZendeskLiveAgentServiceV1,
    BotSocketIoServiceV1,
    BasketServiceV1,
    AttachmentsServiceV1,
    SessionServiceV1,
    TmpErrorsServiceV1,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      deps: [ConfigServiceV1],
      multi: true
    },
    AuthenticationGuard,
    {
      provide: EnvironmentServiceV1,
      useClass: EnvironmentServiceImpl
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
