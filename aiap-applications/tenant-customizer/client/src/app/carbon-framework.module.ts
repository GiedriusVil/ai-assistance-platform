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
  DialogModule,
  DropdownModule,
  ModalModule,
  RadioModule,
  TableModule,
  PaginationModule,
  ToggleModule,
  InputModule,
  GridModule,
  ListModule,
  CheckboxModule,
  UIShellModule,
  SearchModule,
  TabsModule,
  TilesModule,
  FileUploaderModule,
  IconModule,
} from 'carbon-components-angular';

@NgModule({
  imports: [
    ButtonModule,
    NotificationModule,
    DatePickerModule,
    DatePickerInputModule,
    DialogModule,
    DropdownModule,
    ModalModule,
    RadioModule,
    TableModule,
    PaginationModule,
    ToggleModule,
    InputModule,
    GridModule,
    ListModule,
    CheckboxModule,
    UIShellModule,
    SearchModule,
    TabsModule,
    TilesModule,
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
    TableModule,
    PaginationModule,
    ToggleModule,
    InputModule,
    GridModule,
    ListModule,
    CheckboxModule,
    UIShellModule,
    SearchModule,
    TabsModule,
    TilesModule,
    FileUploaderModule,
    IconModule,
  ]
})
export class CarbonFrameworkModule { }
