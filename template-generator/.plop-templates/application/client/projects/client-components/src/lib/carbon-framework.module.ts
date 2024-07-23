/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import {
  CarbonModule,
  FadeModule,
  DownloadModule,
  EditModule,
  ManageProtectionModule,
  SysProvisionModule,
  CopyModule,
  ViewModule,
  ViewOffModule,
  WarningModule,
  AddModule,
  ChevronLeftModule,
  ChevronRightModule,
  ThumbsUpModule,
  WarningAltModule,
  ThumbsDownModule,
  InformationModule,
  CloudDownloadModule,
  LaunchModule,
  ResetModule,
  DeleteModule,
  CheckmarkModule,
  ErrorModule,
  SettingsModule,
  PlugModule,
} from '@carbon/icons-angular';

import {
  ButtonModule,
  NotificationModule,
  DatePickerModule,
  DatePickerInputModule,
  DialogModule,
  DropdownModule,
  ComboBoxModule,
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
  StructuredListModule,
  AccordionModule,
  TabsModule,
  TilesModule,
  TagModule, 
  FileUploaderModule,
  BreadcrumbModule, 
  IconModule,
} from 'carbon-components-angular';

@NgModule({
  imports: [
    // -> carbon-icons-angular
    CarbonModule,
    CopyModule,
    FadeModule,
    EditModule,
    SysProvisionModule,
    DownloadModule,
    ManageProtectionModule,
    ViewModule,
    ViewOffModule,
    WarningModule,
    AddModule,
    ChevronLeftModule,
    ChevronRightModule,
    ThumbsUpModule,
    WarningAltModule,
    ThumbsDownModule,
    InformationModule,
    CloudDownloadModule,
    LaunchModule,
    ResetModule,
    DeleteModule,
    IconModule,
    CheckmarkModule,
    ErrorModule,
    SettingsModule,
    PlugModule,
    // -> carbon-components-angular
    ButtonModule,
    NotificationModule,
    DatePickerModule,
    DatePickerInputModule,
    DialogModule,
    DropdownModule,
    ComboBoxModule,
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
    TagModule,
    StructuredListModule,
    AccordionModule,
    FileUploaderModule,
    BreadcrumbModule, 
  ],
  exports: [
    // -> carbon-icons-angular
    CarbonModule,
    CopyModule,
    FadeModule,
    EditModule,
    SysProvisionModule,
    DownloadModule,
    ManageProtectionModule,
    ViewModule,
    ViewOffModule,
    WarningModule,
    AddModule,
    ChevronLeftModule,
    ChevronRightModule,
    ThumbsUpModule,
    WarningAltModule,
    ThumbsDownModule,
    InformationModule,
    CloudDownloadModule,
    LaunchModule,
    ResetModule,
    DeleteModule,
    IconModule,
    CheckmarkModule,
    ErrorModule,
    SettingsModule,
    PlugModule,
    // -> carbon-components-angular
    ButtonModule,
    NotificationModule,
    DatePickerModule,
    DatePickerInputModule,
    DialogModule,
    DropdownModule,
    ComboBoxModule,
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
    TagModule,
    StructuredListModule,
    AccordionModule,
    FileUploaderModule,
    BreadcrumbModule, 
  ], 
})
export class CarbonFrameworkModule {}
