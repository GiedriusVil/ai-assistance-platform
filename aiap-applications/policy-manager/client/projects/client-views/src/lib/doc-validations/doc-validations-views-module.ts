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

import { DocValidationMetricsViewV1 } from './doc-validation-metrics-view-v1/doc-validation-metrics-view-v1';
import { DocValidationMetricsViewV2 } from './doc-validation-metrics-view-v2/doc-validation-metrics-view-v2';
import { DocValidationsViewV1 } from './doc-validations-view-v1/doc-validations-view-v1';
import { DocValidationsViewV2 } from './doc-validations-view-v2/doc-validations-view-v2';

@NgModule({
  declarations: [
    // doc-validations
    DocValidationMetricsViewV1,
    DocValidationMetricsViewV2,
    DocValidationsViewV1,
    DocValidationsViewV2,
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
    // doc-validations
    DocValidationMetricsViewV1,
    DocValidationMetricsViewV2,
    DocValidationsViewV1,
    DocValidationsViewV2,
  ],
  providers: [
    DatePipe,
    NotificationService,
  ],
})
export class DocValidationsViewsModule { }
