/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DatePipe } from '@angular/common';

import { NotificationService, IconService } from 'carbon-components-angular';

import { CarbonFrameworkModule } from './carbon-framework.module';
import { MarkdownModule } from 'ngx-markdown';

import { DefaultView } from './default-view/default.view';

import {
  FilterModule
} from '@carbon/icons-angular'

import { ClientSharedPipesModule } from 'client-shared-utils';
import { ClientSharedComponentsModule } from 'client-shared-components';

//
import { ClientUtilsModule } from 'aca-client-shared';
import { ClientServicesModule } from 'aca-client-services';
import { ClientComponentsModule } from 'aca-client-components';

//
import {
  iconServiceFactory,
} from './carbon-framework.factories';

@NgModule({
  declarations: [
    DefaultView,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CarbonFrameworkModule,
    MarkdownModule.forRoot(),
    FilterModule,
    //
    NgJsonEditorModule,
    //
    ClientSharedPipesModule,
    ClientSharedComponentsModule,
    //
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
  ],
  exports: [
    DefaultView,
  ],
  providers: [
    DatePipe,
    NotificationService,
    {
      provide: APP_INITIALIZER,
      useFactory: iconServiceFactory,
      deps: [IconService],
      multi: true
    },
  ],
})
export class ClientViewsModule { }
