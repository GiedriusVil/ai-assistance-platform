/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import {
  TranslateModule,
  MissingTranslationHandler,
  TranslateLoader,
} from '@ngx-translate/core';

//
import {
  NotificationService,
  IconService,
} from 'client-shared-carbon';

import {
  CarbonFrameworkModule,
} from './carbon-framework.module';

// Environment gap mock
import { environment } from '../environments/environment';

//
import {
  ClientSharedUtilsModule,
  UIMissingTranslationHandler,
} from 'client-shared-utils';

import {
  ClientSharedServicesModule,
  ConfigServiceV1,
  LocalStorageServiceV1,
  UITranslateLoaderFactoryV1,
} from 'client-shared-services';

import {
  ClientSharedComponentsModule,
} from 'client-shared-components';

import { ClientSharedViewsModule } from 'client-shared-views';

// shareble modules
import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';
import { ClientComponentsModule } from 'client-components';
import { ClientViewsModule } from 'client-views';

//
import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { AuthenticationGuard } from './guards/authentication';

import {
  AdministratorServiceV1,
  ZoomServiceV1,
} from './services';

import {
  AdminViewV1,
  AdminViewHeaderV1,
  AdminViewBodyV1,
} from './views/admin-view-v1';

import {
  LoginViewV1,
} from './views/login-view-v1/login-view-v1';

import {
  MainViewV1,
  MainViewNativeHeaderV1,
  MainViewNativeBodyV1,
  MainViewWbcBodyV1,
} from './views/main-view-v1';

import {
  HeaderHamburgerMenuV1,
  HeaderApplicationsMenuV1,
  HeaderTenantsMenuV1,
  HeaderAdminMenuV1,
  HeaderUserMenuV1,
  HeaderLanguageMenuV1,
  HeaderZoomMenuV1,
} from './components';

import {
  SessionExpirationModalV1,
} from './views/main-view-v1/session-expiration-modal-v1/session-expiration-modal-v1';

import {
  configServiceFactory,
} from './factories';

import {
  PasswordRenewalFormV1,
} from './views/login-view-v1/password-renewal-form-v1/password-renewal-form-v1';
import {
  UserCredentialsFormV1,
} from './views/login-view-v1/user-credentials-form-v1/user-credentials-form-v1';
import {
  PasswordVisibilityToggleV1,
} from './views/login-view-v1/password-visibility-toggle-v1/password-visibility-toggle-v1';

@NgModule({
  declarations: [
    AppComponent,
    LoginViewV1,
    // AdminView
    AdminViewV1,
    AdminViewBodyV1,
    AdminViewHeaderV1,
    // MainView
    MainViewV1,
    MainViewNativeHeaderV1,
    MainViewNativeBodyV1,
    MainViewWbcBodyV1,
    //
    UserCredentialsFormV1,
    PasswordRenewalFormV1,
    PasswordVisibilityToggleV1,
    SessionExpirationModalV1,
    // Components
    HeaderHamburgerMenuV1,
    HeaderApplicationsMenuV1,
    HeaderTenantsMenuV1,
    HeaderAdminMenuV1,
    HeaderUserMenuV1,
    HeaderLanguageMenuV1,
    HeaderZoomMenuV1
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRouting,
    LazyElementsModule,
    CarbonFrameworkModule,
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
      },
    }),
    ClientSharedUtilsModule,
    ClientSharedComponentsModule,
    ClientSharedServicesModule,
    ClientSharedViewsModule,
    ClientUtilsModule,
    ClientServicesModule.forRoot(environment),
    ClientComponentsModule,
    ClientViewsModule,
    NgbTooltipModule
  ],
  providers: [
    AuthenticationGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      deps: [ConfigServiceV1],
      multi: true
    },
    NotificationService,
    IconService,
    AdministratorServiceV1,
    ZoomServiceV1,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
