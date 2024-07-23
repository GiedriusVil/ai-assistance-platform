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

import { TopicModelingTableV1 } from './topic-modeling-table-v1/topic-modeling-table-v1';
import { TopicModelingDeleteModalV1 } from './topic-modeling-delete-modal-v1/topic-modeling-delete.modal-v1';
import { TopicModelingExecuteModalV1 } from './topic-modeling-execute-modal-v1/topic-modeling-execute.modal-v1';
import { TopicModelingResultsModalV1 } from './topic-modeling-results-modal-v1/topic-modeling-results.modal-v1';
import { TopicModelingSaveModalV1 } from './topic-modeling-save-modal-v1/topic-modeling-save.modal-v1';
import { TopicModelingTopicsTableV1 } from './topic-modeling-topics-table-v1/topic-modeling-topic-table-v1';

@NgModule({
  declarations: [
    TopicModelingTableV1,
    TopicModelingDeleteModalV1,
    TopicModelingExecuteModalV1,
    TopicModelingResultsModalV1,
    TopicModelingSaveModalV1,
    TopicModelingTopicsTableV1,
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
    //
    CarbonFrameworkModule,
  ],
  exports: [
    TopicModelingTableV1,
    TopicModelingDeleteModalV1,
    TopicModelingExecuteModalV1,
    TopicModelingResultsModalV1,
    TopicModelingSaveModalV1,
    TopicModelingTopicsTableV1,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TopicModelingV1Module { }
