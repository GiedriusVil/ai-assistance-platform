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

import { RuleMessageDeleteModalV1 } from './rule-message-delete-modal-v1/rule-message-delete-modal-v1';
import { RuleMessagePullModalV1 } from './rule-message-pull-modal-v1/rule-message-pull-modal-v1';
import { RuleMessageSaveModalV1 } from './rule-message-save-modal-v1/rule-message-save-modal-v1';
import { RuleMessageTemplatesTableV1 } from './rule-message-templates-table-v1/rule-message-templates-table-v1';
import { RuleMessagesComboboxV1 } from './rule-messages-combobox-v1/rule-messages-combobox-v1';
import { RuleMessagesTableV1 } from './rule-messages-table-v1/rule-messages-table-v1';

@NgModule({
  declarations: [
    RuleMessageDeleteModalV1,
    RuleMessagePullModalV1,
    RuleMessageSaveModalV1,
    RuleMessageTemplatesTableV1,
    RuleMessagesComboboxV1,
    RuleMessagesTableV1,
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
    RuleMessageDeleteModalV1,
    RuleMessagePullModalV1,
    RuleMessageSaveModalV1,
    RuleMessageTemplatesTableV1,
    RuleMessagesComboboxV1,
    RuleMessagesTableV1,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RuleMessagesModule { }
