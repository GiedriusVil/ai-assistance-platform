/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { LocalePipe } from './locale.pipe';

const PIPES = [
  LocalePipe
];

@NgModule({
  declarations: PIPES,
  exports: PIPES,
})
export class ClientSharedPipesModule { }
