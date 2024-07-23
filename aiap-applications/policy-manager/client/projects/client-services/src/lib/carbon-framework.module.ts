/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  NotificationModule,
} from 'carbon-components-angular';

@NgModule({
  imports: [
    NotificationModule,
  ],
  exports: [
    NotificationModule,
  ]
})
export class CarbonFrameworkModule {}
