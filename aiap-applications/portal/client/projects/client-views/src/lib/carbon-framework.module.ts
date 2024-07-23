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
  StructuredListModule,
  TagModule,
  FileUploaderModule,
  PlaceholderModule,
  ProgressIndicatorModule,
  ComboBoxModule,
  AccordionModule,
  InlineLoadingModule,
  CodeSnippetModule,
  IconModule,
  NumberModule,
} from 'client-shared-carbon';

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
    StructuredListModule,
    TagModule,
    PlaceholderModule,
    ProgressIndicatorModule,
    FileUploaderModule,
    ComboBoxModule,
    AccordionModule,
    IconModule,
    NumberModule,

    InlineLoadingModule,
    CodeSnippetModule,
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
    StructuredListModule,
    TagModule,
    PlaceholderModule,
    ProgressIndicatorModule,
    FileUploaderModule,
    ComboBoxModule,
    AccordionModule,
    IconModule,
    NumberModule,
    InlineLoadingModule,
    CodeSnippetModule,
  ]
})
export class CarbonFrameworkModule { }
