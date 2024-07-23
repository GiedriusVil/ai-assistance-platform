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

import { DocValidationMetricTileV1 } from './doc-validation-metric-tile-v1/doc-validation-metric-tile-v1';
import { DocValidationsSummeryTableV1 } from './doc-validations-summary-table-v1/doc-validations-summary-table-v1';
import { DocValidationsTableV1 } from './doc-validations-table-v1/doc-validations-table-v1';
import { DocValidationsTableV2 } from './doc-validations-table-v2/doc-validations-table-v2';

@NgModule({
  declarations: [
    DocValidationMetricTileV1,
    DocValidationsSummeryTableV1,
    DocValidationsTableV1,
    DocValidationsTableV2,
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
    DocValidationMetricTileV1,
    DocValidationsSummeryTableV1,
    DocValidationsTableV1,
    DocValidationsTableV2,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class DocValidationsModule { }
