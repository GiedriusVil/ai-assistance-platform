/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  GridModule,
  // services
  NotificationService,
} from 'carbon-components-angular';

@NgModule({
  imports: [
    GridModule,
  ],
  exports: [
    GridModule,
  ],
  providers: [
    NotificationService,
  ]
})
export class CarbonFrameworkModule { }
