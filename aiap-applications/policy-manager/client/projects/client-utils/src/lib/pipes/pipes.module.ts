/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { StatusIconPipe } from './status-icon.pipe';

const PIPES = [
  StatusIconPipe,
];

@NgModule({
  declarations: PIPES,
  exports: PIPES,
})
export class ClientSharedPipesModule { }
