/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { CarbonFrameworkModule } from './carbon-framework.module';
import { ClientSharedPipesModule } from './pipes';

@NgModule({
  declarations: [],
  imports: [
    CarbonFrameworkModule,
    ClientSharedPipesModule,
  ],
  exports: [
    ClientSharedPipesModule,
  ]
})
export class ClientUtilsModule { }
