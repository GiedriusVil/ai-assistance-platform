/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { ExtractValueMessagePipe, PartOfTextPipe, SafePipe } from './pipes';


@NgModule({
  declarations: [
    ExtractValueMessagePipe,
    PartOfTextPipe,
    SafePipe
  ],
  imports: [],
  exports: [
    ExtractValueMessagePipe,
    PartOfTextPipe,
    SafePipe
  ]
})
export class AcaSharedClientComponentsModule { }
