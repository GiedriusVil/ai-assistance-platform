/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services';

import { CarbonFrameworkModule } from './carbon-framework.module';

@NgModule({
  declarations: [],
  imports: [
    CarbonFrameworkModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
  ],
  exports: []
})
export class ClientUtilsModule { }
