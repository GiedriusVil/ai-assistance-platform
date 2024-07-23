/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { ClientSharedPipesModule } from './pipes';

import {
  TranslateModule,
} from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    ClientSharedPipesModule,
    TranslateModule,
  ],
  exports: [
    ClientSharedPipesModule,
    TranslateModule,
  ]
})
export class ClientSharedUtilsModule { }
