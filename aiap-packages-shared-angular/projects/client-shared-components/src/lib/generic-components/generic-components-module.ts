/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CheckboxModule} from 'carbon-components-angular';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services'

import { CarbonFrameworkModule } from '../carbon-framework-module';

import { GenericModalV1 } from './generic-modal-v1/generic-modal-v1';

@NgModule({
  declarations: [
    GenericModalV1,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    CheckboxModule,
    //
    CarbonFrameworkModule,
  ],
  exports: [
    GenericModalV1,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class GenericComponentsModule { }
