/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  ButtonModule,
  AccordionModule,
  NotificationModule,
  CheckboxModule,
  ComboBoxModule,
  DatePickerModule,
  DatePickerInputModule,
  DialogModule,
  DropdownModule,
  FileUploaderModule,
  GridModule,
  IconModule,
  InlineLoadingModule,
  InputModule,
  ListModule,
  ModalModule,
  PaginationModule,
  PlaceholderModule,
  RadioModule,
  SearchModule,
  TableModule,
  ToggleModule,
  TabsModule,
  TilesModule,
  UIShellModule,
  //
  NotificationService,
} from 'carbon-components-angular';

@NgModule({
  imports: [
    ButtonModule,
    AccordionModule,
    NotificationModule,
    CheckboxModule,
    ComboBoxModule,
    DatePickerModule,
    DatePickerInputModule,
    DialogModule,
    DropdownModule,
    FileUploaderModule,
    GridModule,
    IconModule,
    InlineLoadingModule,
    InputModule,
    ListModule,
    ModalModule,
    PaginationModule,
    PlaceholderModule,
    RadioModule,
    SearchModule,
    TableModule,
    ToggleModule,
    TabsModule,
    TilesModule,
    UIShellModule,
  ],
  exports: [
    ButtonModule,
    AccordionModule,
    NotificationModule,
    CheckboxModule,
    ComboBoxModule,
    DatePickerModule,
    DatePickerInputModule,
    DialogModule,
    DropdownModule,
    FileUploaderModule,
    GridModule,
    IconModule,
    InlineLoadingModule,
    InputModule,
    ListModule,
    ModalModule,
    PaginationModule,
    PlaceholderModule,
    RadioModule,
    SearchModule,
    TableModule,
    ToggleModule,
    TabsModule,
    TilesModule,
    UIShellModule,
  ],
  providers: [
    NotificationService,
  ]
})
export class CarbonFrameworkModule { }
