/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  TableModule,
  PaginationModule,
  ModalModule,
  FileUploaderModule,
  DropdownModule,
  InputModule,
  InlineLoadingModule
} from 'carbon-components-angular';

@NgModule({
  imports: [
    TableModule,
    PaginationModule,
    ModalModule,
    FileUploaderModule,
    DropdownModule,
    InputModule,
    InlineLoadingModule
  ],
  exports: [
    TableModule,
    PaginationModule,
    ModalModule,
    FileUploaderModule,
    DropdownModule,
    InputModule,
    InlineLoadingModule
  ],
  providers: [

  ]
})
export class CarbonFrameworkModule { }
