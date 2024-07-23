/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Translation
import { TranslateModule, MissingTranslationHandler, TranslateLoader } from '@ngx-translate/core';

import { LazyElementsModule } from '@angular-extensions/elements';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IconService } from 'client-shared-carbon';

import {
  ClientSharedUtilsModule,
  NGX_MONACO_EDITOR_CONFIGS,
  UIMissingTranslationHandler,
} from 'client-shared-utils';

import {
  ClientSharedServicesModule,
  LocalStorageServiceV1,
  UITranslateLoaderFactoryV1,
} from 'client-shared-services';

import { CarbonFrameworkModule } from './carbon-framework-module';
import { NgBootstrapModule } from './ng-bootstrap-module';

import { AcaIntentSliderComponent } from './aca-intent-slider/aca-intent-slider.component';
import { ConfirmModalComponent } from './aca-modals/confirm-modal/confirm.modal';
import { AcaNotificationComponent } from './aca-notification/aca-notification.component';
import { AcaPaginationComponent } from './aca-pagination/aca-pagination.component';
import { AcaToggleButtonComponent } from './aca-toggle-button/aca-toggle-button.component';

import {
  TableCellCreated,
  TableCellCreatedV1,
  TableCellUpdated,
  TableCellUpdatedV1,
  TableCellExternalV1,
} from './base-components';

import {
  BreadcrumbV1,
  BreadCrumbV2,
} from './bread-crumbs';

import {
  FieldComboBoxV1,
  FieldDropdown,
  FieldDropDownV1,
  FieldFilesUploaderSingularV1,
  FieldInput,
  FieldInputChipsV1,
  FieldInputV1,
  FieldTextAreaV1,
  FieldToggleV1,
  FieldCheckboxV1,
  FieldNumberV1,
  FieldSliderV1,
} from './fields';

import {
  ButtonV1,
  ButtonSetV1,
} from './buttons';

import {
  ToggleV1
} from './toggles';

import {
  DateRangeComponent,
  DateRangePicker,
  DateRangePickerV1,
} from './date-range-components';

import {
  AcaClientComponentsDirectivesModule,
} from './directives/directives.module';

import {
  FieldWrapperV1,
} from './field-wrappers';

import {
  FileUploaderV1,
  FileUploaderV2,
} from './file-uploaders';

import {
  GenericComponentsModule,
} from './generic-components';

import {
  IconSvg,
  IconSvgV1,
  IconSvgWithTooltipV1,
} from './icon-svg-components';

import {
  InlineLoaderV1,
} from './inline-loaders';

import {
  AcaJsonDifference
} from './json-difference/json-difference.component';

import {
  AcaJsonEditor
} from './json-editor/json-editor.component';

import {
  AcaLanguagesComboBox,
} from './languages-combo-box/languages-combo-box.component';

import {
  MaxGraphAiSkillEditor,
} from './max-graph-editors';

import {
  WbcFormLoaderV1,
} from './wbc-form-loaders';

import {
  WbcFieldLoaderV1,
} from './wbc-field-loaders'

import {
  WbcViewLoaderV1,
} from './wbc-view-loaders';

import {
  OverflowMenuV1,
  OverflowMenuOptionV1,
  OverflowButtonV1,
} from './overflow-menus';

import {
  ClientSharedPipesModule,
  LocalePipe,
} from './pipes';

import {
  TableV1,
  TableV1ContainerV1,
  TableV1PaginationV1,
  TableV1ToolbarContentV1,
  TableV1ToolbarSearchV1,
  TableV1HeaderV1,
  TableV1ToolbarV1,
} from './tables';

import {
  MetricsTileV1,
} from './metrics';

import {
  ModalV1,
  ModalV1HeaderV1,
  ModalV1FooterV1,
  ModalV1ContentV1,
} from './modals';

import { DatePicker } from './aiap-date-picker/date-picker.component';

import { LabelV1 } from './labels';

import {
  RightSideFilterPanelV1,
} from './filter-panel';

@NgModule({
  declarations: [
    // base-components
    TableCellCreated,
    TableCellCreatedV1,
    TableCellUpdated,
    TableCellUpdatedV1,
    TableCellExternalV1,
    // bread-crumbs
    BreadcrumbV1,
    BreadCrumbV2,
    // fields
    FieldComboBoxV1,
    FieldDropdown,
    FieldDropDownV1,
    FieldFilesUploaderSingularV1,
    FieldInput,
    FieldInputV1,
    FieldInputChipsV1,
    FieldTextAreaV1,
    FieldToggleV1,
    FieldCheckboxV1,
    FieldNumberV1,
    FieldSliderV1,
    // buttons
    ButtonV1,
    ButtonSetV1,
    // toggles
    ToggleV1,
    // Components
    AcaPaginationComponent,
    AcaNotificationComponent,
    AcaIntentSliderComponent,
    AcaToggleButtonComponent,
    ConfirmModalComponent,
    // date-range-components
    DateRangeComponent,
    DateRangePicker,
    DateRangePickerV1,
    //
    AcaJsonEditor,
    AcaJsonDifference,
    FieldWrapperV1,
    FileUploaderV1,
    FileUploaderV2,
    // icon-svg-components
    IconSvg,
    IconSvgV1,
    IconSvgWithTooltipV1,
    // inline-loaders
    InlineLoaderV1,
    //
    AcaLanguagesComboBox,
    // overflow-menus
    OverflowMenuV1,
    OverflowMenuOptionV1,
    OverflowButtonV1,
    // tables
    TableV1,
    TableV1ContainerV1,
    TableV1PaginationV1,
    TableV1ToolbarContentV1,
    TableV1ToolbarSearchV1,
    TableV1HeaderV1,
    TableV1ToolbarV1,
    // MaxGraph
    MaxGraphAiSkillEditor,
    // wbc-form-loaders
    WbcFormLoaderV1,
    // wbc-field-loaders
    WbcFieldLoaderV1,
    // wbc-view-loaders
    WbcViewLoaderV1,
    DatePicker,
    // Metrics
    MetricsTileV1,
    // Modals
    ModalV1,
    ModalV1HeaderV1,
    ModalV1FooterV1,
    ModalV1ContentV1,
    // Labels
    LabelV1,
    // Filter panels
    RightSideFilterPanelV1,
  ],
  providers: [
    IconService,
    LocalePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LazyElementsModule,
    CarbonFrameworkModule,
    NgBootstrapModule,
    TagInputModule, 
    BrowserAnimationsModule,
    NgJsonEditorModule,
    MonacoEditorModule.forRoot(NGX_MONACO_EDITOR_CONFIGS),
    // Directives
    AcaClientComponentsDirectivesModule,
    //
    GenericComponentsModule,
    ClientSharedUtilsModule,
    ClientSharedPipesModule,
    ClientSharedServicesModule,
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler, 
        useClass: UIMissingTranslationHandler 
      },
      loader: {
        provide: TranslateLoader,
        useFactory: UITranslateLoaderFactoryV1,
        deps: [
          LocalStorageServiceV1,
        ]
      }
    }),
  ],
  exports: [
    GenericComponentsModule,
    // base-components
    // Table
    TableCellCreated,
    TableCellCreatedV1,
    TableCellUpdated,
    TableCellUpdatedV1,
    TableCellExternalV1,
    // bread-crumbs
    BreadcrumbV1,
    BreadCrumbV2,
    // Components
    // fields
    FieldComboBoxV1,
    FieldDropdown,
    FieldDropDownV1,
    FieldFilesUploaderSingularV1,
    FieldInput,
    FieldInputV1,
    FieldInputChipsV1,
    FieldTextAreaV1,
    FieldToggleV1,
    FieldCheckboxV1,
    FieldNumberV1,
    FieldSliderV1,
    // buttons
    ButtonV1,
    ButtonSetV1,
    // toggles
    ToggleV1,
    // Components
    AcaPaginationComponent,
    AcaNotificationComponent,
    AcaIntentSliderComponent,
    AcaToggleButtonComponent,
    ConfirmModalComponent,
    // date-range-components
    DateRangeComponent,
    DateRangePicker,
    DateRangePickerV1,
    //
    AcaJsonEditor,
    AcaJsonDifference,
    FieldWrapperV1,
    FileUploaderV1,
    FileUploaderV2,
    // icon-svg-components
    IconSvg,
    IconSvgV1,
    IconSvgWithTooltipV1,
    // inline-loaders
    InlineLoaderV1,
    //
    AcaLanguagesComboBox,
    // Directives
    AcaClientComponentsDirectivesModule,
    // overflow-menus
    OverflowMenuV1,
    OverflowMenuOptionV1,
    OverflowButtonV1,
    // tables
    TableV1,
    TableV1ContainerV1,
    TableV1PaginationV1,
    TableV1ToolbarContentV1,
    TableV1ToolbarSearchV1,
    TableV1HeaderV1,
    TableV1ToolbarV1,
    // MaxGraph
    MaxGraphAiSkillEditor,
    // wbc-form-loaders
    WbcFormLoaderV1,
    // wbc-field-loaders
    WbcFieldLoaderV1,
    // wbc-view-loaders
    WbcViewLoaderV1,
    ClientSharedPipesModule,
    DatePicker,
    // Metrics
    MetricsTileV1,
    // Modals
    ModalV1,
    ModalV1HeaderV1,
    ModalV1FooterV1,
    ModalV1ContentV1,
    // Labels
    LabelV1,
    // Filter panels
    RightSideFilterPanelV1,
  ],
})
export class ClientSharedComponentsModule {

}
