/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { LazyElementsModule } from '@angular-extensions/elements';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { IconService } from 'carbon-components-angular';
import { CarbonFrameworkModule } from './carbon-framework.module';
import { FilterModule } from '@carbon/icons-angular'

import { BootstrapFrameworkModule } from './boostrap-framework.module';

import { MarkdownModule } from 'ngx-markdown';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import {
  ClientSharedUtilsModule,
  ClientSharedPipesModule,
  NGX_MONACO_EDITOR_CONFIGS,
} from 'client-shared-utils';
import { ClientSharedComponentsModule } from 'client-shared-components';
import { ClientSharedViewsModule } from 'client-shared-views';

//
import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';
import { ClientComponentsModule } from 'client-components';

import { QueriesConfigurationViewV1 } from './queries-configuration-view-v1/queries-configuration-view-v1';
import { QueriesModelsChangesViewV1 } from './queries-models-changes-view-v1';
import { ChartsConfigurationViewV1 } from './charts-configuration-view-v1/charts-configuration-view-v1';
import { ChartsModelsChangesViewV1 } from './charts-models-changes-view-v1';
import { DashboardsConfigurationViewV1 } from './dashboards-configuration-view-v1/dashboards-configuration-view-v1';
import { DashboardsModelsChangesViewV1 } from './dashboard-models-changes-view-v1';
import { TilesConfigurationViewV1 } from './tiles-configuration-view-v1/tiles-configuration-view-v1';
import { TilesModelsChangesViewV1 } from './tiles-models-changes-view-v1';
import { FiltersConfigurationViewV1 } from './filters-configuration-view-v1/filters-configuration-view-v1';
import { FiltersModelsChangesViewV1 } from './filters-models-changes-view-v1';
//
import { QuerySaveModalV1 } from './queries-configuration-view-v1/query-save-modal-v1/query-save-modal-v1';
import { ChartSaveModalV1 } from './charts-configuration-view-v1/chart-save-modal-v1/chart-save-modal-v1';
import { DashboardSaveModalV1 } from './dashboards-configuration-view-v1/dashboard-save-modal-v1/dashboard-save-modal-v1';
import { TileSaveModalV1 } from './tiles-configuration-view-v1/tile-save-modal-v1/tile-save-modal-v1';
import { FilterSaveModalV1 } from './filters-configuration-view-v1/filter-save-modal-v1/filter-save-modal-v1';
//
import { QueryDeleteModalV1 } from './queries-configuration-view-v1/query-delete-modal-v1/query-delete-modal-v1';
import { DashboardDeleteModalV1 } from './dashboards-configuration-view-v1/dashboard-delete-modal-v1/dashboard-delete-modal-v1';
import { ChartDeleteModalV1 } from './charts-configuration-view-v1/chart-delete-modal-v1/chart-delete-modal-v1';
import { TileDeleteModalV1 } from './tiles-configuration-view-v1/tile-delete-modal-v1/tile-delete-modal-v1';
import { FilterDeleteModalV1 } from './filters-configuration-view-v1/filter-delete-modal-v1/filter-delete-modal-v1';
//
import { QueryHelpModalV1 } from './queries-configuration-view-v1/query-help-modal-v1/query-help-modal-v1';
//
import { QueryImportModalV1 } from './queries-configuration-view-v1/query-import-modal-v1/query-import-modal-v1';
import { ChartImportModalV1 } from './charts-configuration-view-v1/chart-import-modal-v1/chart-import-modal-v1';
import { DashboardsImportModalV1 } from './dashboards-configuration-view-v1/dashboard-import-modal-v1/dashboard-import-modal-v1';
import { TilesImportModalV1 } from './tiles-configuration-view-v1/tile-import-modal-v1/tile-import-modal-v1';
import { FilterImportModalV1 } from './filters-configuration-view-v1/filter-import-modal-v1/filter-import-modal-v1';
//
import { DashboardElementsTab } from './dashboards-configuration-view-v1/dashboard-save-modal-v1/dashboard-elements-tab/dashboard-elements-tab';
import { DashboardConfigurationsTab } from './dashboards-configuration-view-v1/dashboard-save-modal-v1/dashboard-configurations-tab/dashboard-configurations-tab';
//
import { FiltersConfigurationFilterTab } from './filters-configuration-view-v1/filter-save-modal-v1/filters-configuration-filter-tab/filter-configuration-filter-tab';
import { FiltersConfigurationTab } from './filters-configuration-view-v1/filter-save-modal-v1/filters-configuration-configurations-tab/filters-configuration-configurations-tab';


@NgModule({
  declarations: [
    //
    QueriesConfigurationViewV1,
    QueriesModelsChangesViewV1,
    ChartsConfigurationViewV1,
    ChartsModelsChangesViewV1,
    DashboardsConfigurationViewV1,
    DashboardsModelsChangesViewV1,
    TilesConfigurationViewV1,
    TilesModelsChangesViewV1,
    FiltersConfigurationViewV1,
    FiltersModelsChangesViewV1,
    QuerySaveModalV1,
    FilterSaveModalV1,
    ChartSaveModalV1,
    TileSaveModalV1,
    DashboardSaveModalV1,
    QueryHelpModalV1,
    QueryDeleteModalV1,
    FilterDeleteModalV1,
    DashboardDeleteModalV1,
    TileDeleteModalV1,
    ChartDeleteModalV1,
    DashboardElementsTab,
    FiltersConfigurationFilterTab,
    DashboardConfigurationsTab,
    FiltersConfigurationTab,
    QueryImportModalV1,
    TilesImportModalV1,
    FilterImportModalV1,
    ChartImportModalV1,
    DashboardsImportModalV1
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LazyElementsModule,
    CarbonFrameworkModule,
    BootstrapFrameworkModule,
    MarkdownModule.forRoot(),
    FilterModule,
    //
    NgJsonEditorModule,
    MonacoEditorModule.forRoot(NGX_MONACO_EDITOR_CONFIGS),
    //
    ClientSharedUtilsModule,
    ClientSharedPipesModule,
    ClientSharedComponentsModule,
    ClientSharedViewsModule,
    //
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
  ],
  exports: [
    QueriesConfigurationViewV1,
    QueriesModelsChangesViewV1,
    ChartsConfigurationViewV1,
    ChartsModelsChangesViewV1,
    DashboardsConfigurationViewV1,
    DashboardsModelsChangesViewV1,
    TilesConfigurationViewV1,
    TilesModelsChangesViewV1,
    FiltersConfigurationViewV1,
    FiltersModelsChangesViewV1,
    QuerySaveModalV1,
    FilterSaveModalV1,
    QueryHelpModalV1,
    ChartSaveModalV1,
    TileSaveModalV1,
    DashboardSaveModalV1,
    QueryDeleteModalV1,
    FilterDeleteModalV1,
    DashboardDeleteModalV1,
    TileDeleteModalV1,
    QueryImportModalV1,
    ChartImportModalV1,
    FilterImportModalV1,
    DashboardsImportModalV1,
    TilesImportModalV1,
    ChartDeleteModalV1,
    DashboardElementsTab,
    DashboardConfigurationsTab,
    FiltersConfigurationFilterTab,
    FiltersConfigurationTab
  ],
  providers: [
    DatePipe,
    IconService,
  ],
})
export class ClientViewsModule { }
