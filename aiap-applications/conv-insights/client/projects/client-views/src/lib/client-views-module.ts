/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LazyElementsModule } from '@angular-extensions/elements';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { IconService } from 'carbon-components-angular';
import { CarbonFrameworkModule } from './carbon-framework.module';
import { FilterModule } from '@carbon/icons-angular'

import { BootstrapFrameworkModule } from './boostrap-framework.module';

import { MarkdownModule } from 'ngx-markdown';

import {
  ClientSharedPipesModule,
} from 'client-shared-utils';

import { ClientSharedComponentsModule } from 'client-shared-components';
import { ClientSharedViewsModule } from 'client-shared-views';

//
import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';
import { ClientComponentsModule } from 'client-components';
//
import { ConversationsViewV1 } from './conversations-view-v1/conversations.view-v1';
//
import { UtterancesViewV1 } from './utterances-view-v1/utterances.view-v1';
//
import { SurveysViewV1 } from './surveys-view-v1/surveys.view-v1';
//
import { LiveMetricsView } from './live-metrics-view/live-metrics.view';
//
import { WbcApplicationView } from './wbc-application-view/wbc-application.view';
//
import { TopicModelingViewV1 } from './topic-modeling-view-v1/topic-modeling.view-v1';

import {
  TranscriptViewV1,
} from './transcript-view-v1';

@NgModule({
  declarations: [
    //
    ConversationsViewV1,
    //
    UtterancesViewV1,
    //
    SurveysViewV1,
    LiveMetricsView,
    //
    WbcApplicationView,
    //
    TranscriptViewV1,
    //
    TopicModelingViewV1,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LazyElementsModule,
    CarbonFrameworkModule,
    BootstrapFrameworkModule,
    MarkdownModule.forRoot(),
    FilterModule,
    TranslateModule,
    //
    NgJsonEditorModule,
    //
    ClientSharedPipesModule,
    ClientSharedComponentsModule,
    ClientSharedViewsModule,
    //
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
  ],
  exports: [
    ConversationsViewV1,
    //
    UtterancesViewV1,
    //
    LiveMetricsView,
    //
    SurveysViewV1,
    //
    WbcApplicationView,
    //
    TranscriptViewV1,
    //
    TopicModelingViewV1,
  ],
  providers: [
    DatePipe,
    IconService,
  ],
})
export class ClientViewsModule { }
