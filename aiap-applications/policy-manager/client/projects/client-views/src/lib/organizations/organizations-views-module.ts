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

import { OrganizationsChangesViewV1 } from './organizations-changes-view-v1/organizations-changes-view-v1';
import { OrganizationsImportViewV1 } from './organizations-import-view-v1/organizations-import-view-v1';
import { OrganizationsViewV1 } from './organizations-view-v1/organizations-view-v1';

@NgModule({
  declarations: [
    // organizations
    OrganizationsChangesViewV1,
    OrganizationsImportViewV1,
    OrganizationsViewV1,
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
    // organizations
    OrganizationsChangesViewV1,
    OrganizationsImportViewV1,
    OrganizationsViewV1,
  ],
  providers: [
    DatePipe,
    NotificationService,
  ],
})
export class OrganizationsViewsModule { }
