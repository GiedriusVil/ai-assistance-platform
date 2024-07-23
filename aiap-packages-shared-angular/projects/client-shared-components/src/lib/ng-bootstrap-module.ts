/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    NgbTooltipModule,
  ],
  exports: [
    NgbTooltipModule,
  ],
})
export class NgBootstrapModule { }
