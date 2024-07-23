/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  // services
  NotificationService,
} from 'carbon-components-angular';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    NotificationService,
  ]
})
export class CarbonFrameworkModule { }
