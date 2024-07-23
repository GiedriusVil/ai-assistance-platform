/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CarbonFrameworkModule } from './carbon-framework.module';

import { NotificationService } from 'client-shared-carbon';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services';
import { ClientSharedComponentsModule } from 'client-shared-components';

import { ClientUtilsModule } from 'client-utils';

import { ClientServicesModule } from 'client-services';

// access-groups  
import {
  AccessGroupsChangesTableV1,
  AccessGroupsTableV1,
} from './access-groups';

// applications 
import {
  ApplicationsChangesTableV1,
  ApplicationsDropdownV1,
  ApplicationsMenuV1,
  ApplicationsTableV1,
} from './applications';

// cards-panel-v1
import {
  CardsPanelV1,
} from './cards-panel-v1/cards-panel-v1';

// checkbox-tree-v1
import {
  CheckboxTreeV1,
} from './checkbox-tree-v1/checkbox-tree-v1';

// Tenants
import {
  TenantApplicationsDropdownV1,
  TenantApplicationsTableV1,
  TenantAssistantsDropdownV1,
  TenantAssistantsTableV1,
  TenantDatasourceCardV1,
  TenantDatasourcesTableV1,
  TenantDbClientsTableV1,
  TenantEventStreamsTableV1,
  TenantRedisClientsTableV1,
  TenantsChangesTableV1,
  TenantsDropDownV1,
  TenantsTableV1,
} from './tenants';

// users
import {
  UsersChangesTableV1,
  UsersTableV1,
} from './users'


@NgModule({
  declarations: [
    // access-groups
    AccessGroupsChangesTableV1,
    AccessGroupsTableV1,
    // applications
    ApplicationsChangesTableV1,
    ApplicationsDropdownV1,
    ApplicationsMenuV1,
    ApplicationsTableV1,
    // cards-panel-v1
    CardsPanelV1,
    // checkbox-tree-v1
    CheckboxTreeV1,
    // tenants
    TenantApplicationsDropdownV1,
    TenantApplicationsTableV1,
    TenantAssistantsDropdownV1,
    TenantAssistantsTableV1,
    TenantDatasourceCardV1,
    TenantDatasourcesTableV1,
    TenantDbClientsTableV1,
    TenantEventStreamsTableV1,
    TenantRedisClientsTableV1,
    TenantsChangesTableV1,
    TenantsDropDownV1,
    TenantsTableV1,
    // users
    UsersChangesTableV1,
    UsersTableV1,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientUtilsModule,
    ClientServicesModule,
    CarbonFrameworkModule,
    FormsModule,
    TranslateModule,
  ],
  providers: [
    NotificationService,
  ],
  exports: [
    // access-groups
    AccessGroupsChangesTableV1,
    AccessGroupsTableV1,
    // applications
    ApplicationsChangesTableV1,
    ApplicationsDropdownV1,
    ApplicationsMenuV1,
    ApplicationsTableV1,
    // cards-panel-v1
    CardsPanelV1,
    // checkbox-tree-v1
    CheckboxTreeV1,
    // tenants
    TenantApplicationsDropdownV1,
    TenantApplicationsTableV1,
    TenantAssistantsDropdownV1,
    TenantAssistantsTableV1,
    TenantDatasourceCardV1,
    TenantDatasourcesTableV1,
    TenantDbClientsTableV1,
    TenantEventStreamsTableV1,
    TenantRedisClientsTableV1,
    TenantsChangesTableV1,
    TenantsDropDownV1,
    TenantsTableV1,
    //  users
    UsersChangesTableV1,
    UsersTableV1,
  ]
})
export class ClientComponentsModule { }
