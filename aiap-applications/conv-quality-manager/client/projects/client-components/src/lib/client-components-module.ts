/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Required Carbon components
 */
import {
  BreadcrumbModule,
  IconService,
} from 'carbon-components-angular';

import {
  CarbonFrameworkModule
} from './carbon-framework.module';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services';
import { ClientSharedComponentsModule } from 'client-shared-components';

/**
 * Required application modules
 */
import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';


import {
  TestCasesTableV1,
} from './test-cases';

import {
  TestExecutionsTableV1,
} from './test-executions';

import {
  TestWorkersTableV1,
} from './test-workers';


@NgModule({
  declarations: [
    TestCasesTableV1,
    TestExecutionsTableV1,
    TestWorkersTableV1,
  ],
  imports: [
    BrowserAnimationsModule,
    CarbonFrameworkModule,
    CommonModule,
    BreadcrumbModule,
    FormsModule,
    RouterModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientUtilsModule,
    ClientServicesModule,
  ],
  providers: [
    IconService,
  ],
  exports: [
    TestCasesTableV1,
    TestExecutionsTableV1,
    TestWorkersTableV1,
  ]
})

export class ClientComponentsModule { }
