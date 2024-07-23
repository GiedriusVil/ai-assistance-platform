/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  InlineLoadingModule,
} from 'client-shared-carbon';

@NgModule({
  imports: [
    InlineLoadingModule,
  ],
  exports: [
    InlineLoadingModule,
  ]
})
export class CarbonFrameworkModule { }
