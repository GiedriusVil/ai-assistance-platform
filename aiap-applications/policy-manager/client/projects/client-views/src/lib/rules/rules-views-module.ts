/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { LazyElementsModule } from '@angular-extensions/elements';

import { NotificationService } from 'carbon-components-angular';

import { ClientSharedComponentsModule } from 'client-shared-components';

import { ClientComponentsModule } from 'client-components';
import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';

import { CarbonFrameworkModule } from '../carbon-framework.module';

import { RuleActionsChangesViewV1 } from './rule-actions-changes-view-v1/rule-actions-changes-view-v1';
import { RuleActionsViewV1 } from './rule-actions-view-v1/rule-actions-view-v1';
import { RuleMessagesChangesViewV1 } from './rule-messages-changes-view-v1/rule-messages-changes-view-v1';
import { RuleMessagesImportViewV1 } from './rule-messages-import-view-v1/rule-messages-import-view-v1';
import { RuleMessagesViewV1 } from './rule-messages-view-v1/rule-messages-view-v1';
import { RulesChangesViewV1 } from './rules-changes-view-v1/rules-changes-view-v1';
import { RulesChangesViewV2 } from './rules-changes-view-v2/rules-changes-view-v2';
import { RulesImportViewV1 } from './rules-import-view-v1/rules-import-view-v1';
import { RulesViewV1 } from './rules-view-v1/rules-view-v1';
import { RulesViewV2 } from './rules-view-v2/rules-view-v2';

@NgModule({
  declarations: [
    // rules
    RuleActionsChangesViewV1,
    RuleActionsViewV1,
    RuleMessagesChangesViewV1,
    RuleMessagesImportViewV1,
    RuleMessagesViewV1,
    RulesChangesViewV1,
    RulesChangesViewV2,
    RulesImportViewV1,
    RulesViewV1,
    RulesViewV2,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LazyElementsModule,
    //
    ClientSharedComponentsModule,
    //
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
    //
    CarbonFrameworkModule,
  ],
  exports: [
    // rules
    RuleActionsChangesViewV1,
    RuleActionsViewV1,
    RuleMessagesChangesViewV1,
    RuleMessagesImportViewV1,
    RuleMessagesViewV1,
    RulesChangesViewV1,
    RulesChangesViewV2,
    RulesImportViewV1,
    RulesViewV1,
    RulesViewV2,
  ],
  providers: [
    DatePipe,
    NotificationService,
  ],
})
export class RulesViewsModule { }
