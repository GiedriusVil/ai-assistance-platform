/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import {
  ClientSharedUtilsModule,
} from 'client-shared-utils';

import {
  ClientSharedServicesModule,
  //
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  ClientSharedComponentsModule,
} from 'client-shared-components';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';
import { ClientComponentsModule } from 'client-components';

import { CarbonFrameworkModule } from './modules/carbon-framework.module';
import { AiapWbcFieldOrganizationsV1 } from './app';
import { OrganizationsFieldV1 } from './field';

@NgModule({
  declarations: [
    AiapWbcFieldOrganizationsV1,
    //
    OrganizationsFieldV1,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CarbonFrameworkModule,
    ClientSharedUtilsModule,
    ClientSharedComponentsModule,
    ClientSharedServicesModule,
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
  ],
  providers: [
    {
      provide: EnvironmentServiceV1,
      useValue: new EnvironmentServiceV1({}),
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AiapWbcFieldOrganizationsV1]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AiapWbcFieldOrganizationsV1, { injector: this.injector });
    customElements.define(AiapWbcFieldOrganizationsV1.getElementTag(), ELEMENT);
  }
}
