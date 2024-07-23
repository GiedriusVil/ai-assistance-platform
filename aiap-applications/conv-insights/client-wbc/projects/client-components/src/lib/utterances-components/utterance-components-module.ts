/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { LazyElementsModule } from '@angular-extensions/elements';

import {
  CarbonFrameworkModule,
} from '../carbon-framework-module';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services'
import { ClientSharedComponentsModule } from 'client-shared-components';

import {
  ClientUtilsModule,
} from 'client-utils';

import {
  ClientServicesModule,
} from 'client-services';

import { IgnoreUtteranceModalV1 } from './ignore-utterance-modal-v1/ignore-utterance.modal-v1';
import { UtteranceAuditModalV1 } from './utterance-audit-modal-v1/utterance-audit.modal-v1';
import { UtteranceFeedbackModalV1 } from './utterance-feedback-modal-v1/utterance-feedback.modal-v1';
import { UtteranceIntentModalV1 } from './utterance-intent-modal-v1/utterance-intent.modal-v1';
import { UtterancesTableV1 } from './utterances-table-v1/utterances-table-v1';
import { UtterancesMetricsV1 } from './utterances-metrics-v1/utterances-metrics-v1';

@NgModule({
  declarations: [
    IgnoreUtteranceModalV1,
    UtteranceAuditModalV1,
    UtteranceFeedbackModalV1,
    UtteranceIntentModalV1,
    UtterancesTableV1,
    UtterancesMetricsV1
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LazyElementsModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientUtilsModule,
    ClientServicesModule,
    CarbonFrameworkModule,
  ],
  exports: [
    IgnoreUtteranceModalV1,
    UtteranceAuditModalV1,
    UtteranceFeedbackModalV1,
    UtteranceIntentModalV1,
    UtterancesTableV1,
    UtterancesMetricsV1
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class UtterancesV1Module { }
