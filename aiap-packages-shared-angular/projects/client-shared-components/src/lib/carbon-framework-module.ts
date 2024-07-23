/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  BreadcrumbModule,
  ButtonModule,
  DialogModule,
  ComboBoxModule,
  DatePickerModule,
  FileUploaderModule,
  GridModule,
  IconModule,
  InlineLoadingModule,
  InputModule,
  ModalModule,
  NotificationModule,
  NumberModule,
  PaginationModule,
  RadioModule,
  SliderModule,
  TableModule,
  TilesModule,
  ToggleModule,
  CheckboxModule,
  // services
  NotificationService,
} from 'client-shared-carbon';

@NgModule({
  imports: [
    // -> carbon-components-angular
    BreadcrumbModule,
    ButtonModule,
    DialogModule,
    ComboBoxModule,
    DatePickerModule,
    FileUploaderModule,
    GridModule,
    IconModule,
    InlineLoadingModule,
    InputModule,
    ModalModule,
    NotificationModule,
    NumberModule,
    PaginationModule,
    RadioModule,
    SliderModule,
    TableModule,
    TilesModule,
    ToggleModule,
    CheckboxModule,
  ],
  exports: [
    // -> carbon-components-angular
    BreadcrumbModule,
    ButtonModule,
    DialogModule,
    ComboBoxModule,
    DatePickerModule,
    FileUploaderModule,
    GridModule,
    IconModule,
    InlineLoadingModule,
    InputModule,
    ModalModule,
    NotificationModule,
    NumberModule,
    PaginationModule,
    RadioModule,
    SliderModule,
    TableModule,
    TilesModule,
    ToggleModule,
    CheckboxModule,
  ],
  providers: [
    NotificationService,
  ]
})
export class CarbonFrameworkModule { }
