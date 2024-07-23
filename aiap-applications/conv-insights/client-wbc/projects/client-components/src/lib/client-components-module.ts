/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { LazyElementsModule } from '@angular-extensions/elements';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services'
import { ClientSharedComponentsModule } from 'client-shared-components';

import {
  ClientUtilsModule,
} from 'client-utils';

import {
  ClientServicesModule,
} from 'client-services';

import {
  DatePickerV1,
} from './date-pickers';

import {
  TopicModelingV1Module,
} from './topic-modeling-components';

import {
  UtterancesV1Module
} from './utterances-components';

import {
  SurveysV1Module
} from './surveys-components';

@NgModule({
  declarations: [
    DatePickerV1,
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
    // organizations
    TopicModelingV1Module,
    UtterancesV1Module,
    SurveysV1Module
  ],
  exports: [
    // date-pickers
    DatePickerV1,
    // topic-modeling-v1
    TopicModelingV1Module,
    //utterances-v1
    UtterancesV1Module,
    //surveys-v1
    SurveysV1Module
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ClientComponentsModule { }
