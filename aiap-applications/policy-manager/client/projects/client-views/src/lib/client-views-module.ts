/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { LazyElementsModule } from '@angular-extensions/elements';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { NotificationService, IconService } from 'carbon-components-angular';

import { CarbonFrameworkModule } from './carbon-framework.module';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ClientSharedUtilsModule, NGX_MONACO_EDITOR_CONFIGS } from 'client-shared-utils';

import { ClientSharedComponentsModule } from 'client-shared-components';

import { ClientComponentsModule } from 'client-components';
import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';

import { HomeViewV1 } from './home/home-view-v1';

import { DocValidationsViewsModule } from './doc-validations';
import { OrganizationsViewsModule } from './organizations';
import { RulesViewsModule } from './rules';
import { ValidationEngagementsViewsModule } from './validation-engagements';

import { LocalePipe } from 'client-shared-components';
import { TranslateModule } from '@carbon/icons-angular';

import { TranslateService } from '@ngx-translate/core';


@NgModule({
  declarations: [
    // home
    HomeViewV1,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LazyElementsModule,
    CarbonFrameworkModule,
    NgJsonEditorModule,
    MonacoEditorModule.forRoot(NGX_MONACO_EDITOR_CONFIGS),
    //
    ClientSharedComponentsModule,
    ClientSharedUtilsModule,
    //
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
    //
    DocValidationsViewsModule,
    OrganizationsViewsModule,
    RulesViewsModule,
    ValidationEngagementsViewsModule,
    TranslateModule,


  ],
  exports: [
    // home
    HomeViewV1,
    // modules
    DocValidationsViewsModule,
    OrganizationsViewsModule,
    RulesViewsModule,
    ValidationEngagementsViewsModule,
  ],
  providers: [
    IconService,
    DatePipe,
    NotificationService,
    LocalePipe,
  ],
})
export class ClientViewsModule { }
