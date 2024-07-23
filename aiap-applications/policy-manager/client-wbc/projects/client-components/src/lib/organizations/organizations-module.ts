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

import { OrganizationDeleteModalV1 } from './organization-delete-modal-v1/organization-delete-modal-v1';
import { OrganizationSaveModalV1 } from './organization-save-modal-v1/organization-save-modal-v1';
import { OrganizationsPullModalV1 } from './organizations-pull-modal-v1/organizations-pull-modal-v1';
import { OrganizationsTableV1 } from './organizations-table-v1/organizations-table-v1';
import { OrganizationsChangesTableV1 } from './organizations-changes-table-v1/organizations-changes-table-v1';

@NgModule({
  declarations: [
    OrganizationDeleteModalV1,
    OrganizationSaveModalV1,
    OrganizationsChangesTableV1,
    OrganizationsPullModalV1,
    OrganizationsTableV1,
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
    OrganizationDeleteModalV1,
    OrganizationSaveModalV1,
    OrganizationsChangesTableV1,
    OrganizationsPullModalV1,
    OrganizationsTableV1,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class OrganizationsModule { }
