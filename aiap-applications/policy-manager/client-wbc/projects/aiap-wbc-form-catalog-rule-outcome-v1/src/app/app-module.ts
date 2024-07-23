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
import { AiapWbcFormRuleOutcomeV2 } from './app';
import { RuleOutcomeFormV2 } from './form';

@NgModule({
  declarations: [
    AiapWbcFormRuleOutcomeV2,
    //
    RuleOutcomeFormV2,
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
  entryComponents: [AiapWbcFormRuleOutcomeV2]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AiapWbcFormRuleOutcomeV2, { injector: this.injector });
    customElements.define(AiapWbcFormRuleOutcomeV2.getElementTag(), ELEMENT);
  }
}
