/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  ButtonModule,
  NotificationModule,
  DatePickerModule,
  DatePickerInputModule,
  DropdownModule,
  ModalModule,
  RadioModule,
  CheckboxModule,
  UIShellModule,
  SearchModule,
  DialogModule,
  ProgressIndicatorModule,
  FileUploaderModule,
  IconModule,
} from 'client-shared-carbon';

@NgModule({
  imports: [
    ButtonModule,
    NotificationModule,
    DatePickerModule,
    DatePickerInputModule,
    DropdownModule,
    ModalModule,
    RadioModule,
    CheckboxModule,
    UIShellModule,
    SearchModule,
    DialogModule,
    ProgressIndicatorModule,
    FileUploaderModule,
    IconModule,
  ],
  exports: [
    ButtonModule,
    NotificationModule,
    DatePickerModule,
    DatePickerInputModule,
    DialogModule,
    DropdownModule,
    ModalModule,
    RadioModule,
    CheckboxModule,
    UIShellModule,
    SearchModule,
    DialogModule,
    ProgressIndicatorModule,
    FileUploaderModule,
    IconModule,
  ]
})
export class CarbonFrameworkModule { }
