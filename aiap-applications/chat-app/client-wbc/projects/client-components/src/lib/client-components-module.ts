/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';

import {
  WbcBaseModal,
  AnswerSliderComp,
  FeedbackModal,
  FeedbackComp,
  MultimediaBoxComp,
} from './components';

import {
  ExtractValueMessagePipe,
  PartOfTextPipe,
  SafePipe,
} from './pipes';

import { LazyElementsModule } from '@angular-extensions/elements';

@NgModule({
  declarations: [
    // components
    WbcBaseModal,
    AnswerSliderComp,
    FeedbackModal,
    FeedbackComp,
    MultimediaBoxComp,
    // pipes
    SafePipe,
    ExtractValueMessagePipe,
    PartOfTextPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ClientUtilsModule,
    ClientServicesModule,
    LazyElementsModule,
  ],
  exports: [
    // components
    WbcBaseModal,
    AnswerSliderComp,
    FeedbackModal,
    FeedbackComp,
    MultimediaBoxComp,
    // pipes
    SafePipe,
    ExtractValueMessagePipe,
    PartOfTextPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientComponentsModule { }
