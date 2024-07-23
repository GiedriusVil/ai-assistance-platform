/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import {
  NotificationService,
  IconService,
} from 'carbon-components-angular';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services';
import { ClientSharedComponentsModule } from 'client-shared-components';

import { CarbonFrameworkModule } from './carbon-framework.module';

import { ExampleComponent } from './example-component/example.component';

import {
  iconServiceFactory,
} from './carbon-framework.factories';

@NgModule({
  declarations: [
    ExampleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    CarbonFrameworkModule,
    NgJsonEditorModule,
  ],
  providers: [
    NotificationService,
    {
      provide: APP_INITIALIZER,
      useFactory: iconServiceFactory,
      deps: [IconService],
      multi: true
    },
  ],
  exports: [
    ExampleComponent,
  ]
})
export class ClientComponentsModule { }
