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

import { ValidationEngagementsChangesViewV1 } from './validation-engagements-changes-view-v1/validation-engagements-changes-view-v1';
import { ValidationEngagementsViewV1 } from './validation-engagements-view-v1/validation-engagements-view-v1';

@NgModule({
  declarations: [
    // validation-engagements
    ValidationEngagementsChangesViewV1,
    ValidationEngagementsViewV1,
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
    // validation-engagements
    ValidationEngagementsChangesViewV1,
    ValidationEngagementsViewV1,
  ],
  providers: [
    DatePipe,
    NotificationService,
  ],
})
export class ValidationEngagementsViewsModule { }
