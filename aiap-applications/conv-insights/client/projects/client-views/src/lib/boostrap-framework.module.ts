/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    NgbPaginationModule,
  ],
  exports: [
    NgbPaginationModule,
  ]
})
export class BootstrapFrameworkModule { }
