/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  ComboBoxModule,
  // services
  NotificationService,
} from 'carbon-components-angular';

@NgModule({
  imports: [
    ComboBoxModule,
  ],
  exports: [
    ComboBoxModule,
  ],
  providers: [
    NotificationService,
  ]
})
export class CarbonFrameworkModule { }
