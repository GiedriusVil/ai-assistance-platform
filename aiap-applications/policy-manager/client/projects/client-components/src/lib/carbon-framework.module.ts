/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  ButtonModule,
  BreadcrumbModule,
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
  SliderModule,
  TabsModule,
  TilesModule,
  TagModule,
  IconModule,
  ComboBoxModule,
  NumberModule,
} from 'carbon-components-angular';

@NgModule({
  imports: [
    // -> carbon-components-angular
    ButtonModule,
    BreadcrumbModule,
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
    SliderModule,
    SearchModule,
    TabsModule,
    TilesModule,
    TagModule,
    IconModule,
    ComboBoxModule,
    NumberModule,
  ],
  exports: [
    // -> carbon-components-angular
    ButtonModule,
    BreadcrumbModule,
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
    SliderModule,
    SearchModule,
    TabsModule,
    TilesModule,
    TagModule,
    IconModule,
    ComboBoxModule,
    NumberModule,
  ]
})
export class CarbonFrameworkModule { }
