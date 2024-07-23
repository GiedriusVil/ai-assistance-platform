/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';

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
import { AiapWbcFormPurchaseRuleOutcomeV1 } from './app';
import { PurchaseRuleOutcomeFormV1 } from './form';

@NgModule({
  declarations: [
    AiapWbcFormPurchaseRuleOutcomeV1,
    //
    PurchaseRuleOutcomeFormV1,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
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
  entryComponents: [AiapWbcFormPurchaseRuleOutcomeV1]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AiapWbcFormPurchaseRuleOutcomeV1, { injector: this.injector });
    customElements.define(AiapWbcFormPurchaseRuleOutcomeV1.getElementTag(), ELEMENT);
  }
}
