/*
  © Copyright IBM Corporation 2023. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { InlineLoadingModule } from 'carbon-components-angular';

@NgModule({
  imports: [
    InlineLoadingModule
  ],
  exports: [
    InlineLoadingModule
  ],
  providers: []
})
export class CarbonFrameworkModule { }
