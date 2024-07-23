/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DatePipe } from '@angular/common';
import { LazyElementsModule } from '@angular-extensions/elements';

import { NotificationService, IconService } from 'client-shared-carbon';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services';
import { ClientSharedComponentsModule } from 'client-shared-components';
import { ClientSharedViewsModule } from 'client-shared-views';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';
import { ClientComponentsModule } from 'client-components';

import { CarbonFrameworkModule } from './carbon-framework.module';

import {
  WbcApplicationViewV1,
} from './wbc-application-view-v1';

//
import {
  DisabledViewV1,
} from './disabled-view-v1/disabled-view-v1';

// Applications
import {
  ApplicationsViewV1,
  ApplicationSaveModalV1,
  ApplicationDeleteModalV1,
  ApplicationImportModalV1,
} from './applications-view-v1';

// Applications Changes
import {
  ApplicationsChangesViewV1,
  ApplicationsChangesModalV1,
} from './applications-changes-view-v1';

// Tenants module
import {
  TenantDeleteModalV1,
  TenantSaveModalV1,
  TenantsImportModalV1,
  TenantTabGeneralV1,
  TenantTabConfigurationV1,
  TenantTabIntegrationV1,
  TenantTabApplicationsV1,
  TenantTabAssistantsV1,
  TenantTabDatasourcesV1,
  TenantTabEventStreamsV1,
  TenantTabObjectStorageV1,
  TenantApplicationSaveModalV1,
  TenantAssistantsDeleteModalV1,
  TenantAssistantsSaveModalV1,
  TenantEventStreamsSaveModalV1,
  TenantRedisClientsSaveModalV1,
  TenantDbClientsSaveModalV1,
  TenantDatasourcesSaveModalV1,
  TenantsViewV1,
} from './tenants-view-v1'

// Tenants Changes
import {
  TenantsChangesViewV1,
  TenantsChangesModalV1,
} from './tenants-changes-view-v1';

// Access Groups
import {
  AccessGroupsViewV1,
  AccessGroupDeleteModalV1,
  AccessGroupImportModalV1,
  AccessGroupSaveModalV1,
  AccessGroupSummaryV1,
  ApplicationPoliciesV1,
  AssistantPoliciesV1,
  AccessGroupActionsV1,
  AccessGroupPolicyPlatformV1,
  AccessGroupPolicyTenantV1,
  AccessGroupPolicyGeneralV1,
  AccessGroupPolicyApplicationV1,
} from './access-groups-view-v1';

// Access Groups Changes
import {
  AccessGroupsChangesViewV1,
  AccessGroupsChangesModalV1,
} from './access-groups-changes-view-v1';

// Users
import {
  UserDeleteModalV1,
  UserSaveModalV1,
  UsersViewV1,
} from './users-view-v1';

// Users Changes
import {
  UsersChangesModalV1,
  UsersChangesViewV1,
} from './users-changes-view-v1';

//
import {
  PersonalProfileViewV1,
} from './personal-profile-view-v1';

@NgModule({
  declarations: [
    //
    DisabledViewV1,
    //
    TenantDeleteModalV1,
    TenantSaveModalV1,
    TenantsImportModalV1,
    TenantTabGeneralV1,
    TenantTabConfigurationV1,
    TenantTabIntegrationV1,
    TenantTabApplicationsV1,
    TenantTabAssistantsV1,
    TenantTabDatasourcesV1,
    TenantTabEventStreamsV1,
    TenantTabObjectStorageV1,
    TenantApplicationSaveModalV1,
    TenantAssistantsDeleteModalV1,
    TenantAssistantsSaveModalV1,
    TenantEventStreamsSaveModalV1,
    TenantRedisClientsSaveModalV1,
    TenantDbClientsSaveModalV1,
    TenantDatasourcesSaveModalV1,
    TenantsViewV1,
    //
    TenantsChangesViewV1,
    TenantsChangesModalV1,
    //
    WbcApplicationViewV1,
    //
    ApplicationsViewV1,
    ApplicationSaveModalV1,
    ApplicationDeleteModalV1,
    ApplicationImportModalV1,
    //
    ApplicationsChangesViewV1,
    ApplicationsChangesModalV1,
    AccessGroupsChangesViewV1,
    AccessGroupsChangesModalV1,
    //
    AccessGroupsViewV1,
    AccessGroupDeleteModalV1,
    AccessGroupImportModalV1,
    AccessGroupSaveModalV1,
    AccessGroupSummaryV1,
    ApplicationPoliciesV1,
    AssistantPoliciesV1,
    AccessGroupActionsV1,
    AccessGroupPolicyPlatformV1,
    AccessGroupPolicyTenantV1,
    AccessGroupPolicyGeneralV1,
    AccessGroupPolicyApplicationV1,
    //
    UserDeleteModalV1,
    UserSaveModalV1,
    UsersViewV1,
    //
    UsersChangesModalV1,
    UsersChangesViewV1,
    //
    PersonalProfileViewV1,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LazyElementsModule,
    CarbonFrameworkModule,
    NgJsonEditorModule,
    //
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientSharedViewsModule,
    //
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,

  ],
  exports: [
    //
    ApplicationsViewV1,
    //
    TenantsViewV1,
    //
    AccessGroupImportModalV1,
    AccessGroupSaveModalV1,
    AccessGroupsViewV1,
    //
    UserDeleteModalV1,
    UserSaveModalV1,
    UsersViewV1,
    //
    PersonalProfileViewV1,
    //
    WbcApplicationViewV1,
  ],
  providers: [
    DatePipe,
    NotificationService,
    IconService,
  ],
})
export class ClientViewsModule { }
