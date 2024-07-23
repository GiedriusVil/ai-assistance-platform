/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  ButtonModule,
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
  ProgressIndicatorModule,
  RadioModule,
  SearchModule,
  TableModule,
  ToggleModule,
  TabsModule,
  TilesModule,
  //
  NotificationService,
} from 'carbon-components-angular';

@NgModule({
  imports: [
    ButtonModule,
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
    ProgressIndicatorModule,
    RadioModule,
    SearchModule,
    TableModule,
    ToggleModule,
    TabsModule,
    TilesModule,
  ],
  exports: [
    ButtonModule,
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
    ProgressIndicatorModule,
    RadioModule,
    SearchModule,
    TableModule,
    ToggleModule,
    TabsModule,
    TilesModule,
  ],
  providers: [
    NotificationService,
  ]
})
export class CarbonFrameworkModule { }
