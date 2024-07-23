/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  NgModule,
  DoBootstrap,
  Injector,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import {
  TranslateModule,
  MissingTranslationHandler,
  TranslateLoader,
} from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ButtonModule,
  GridModule
} from 'carbon-components-angular';

import {
  ClientSharedUtilsModule,
  UIMissingTranslationHandler,
} from 'client-shared-utils';

import {
  ClientSharedServicesModule,
  EnvironmentServiceV1,
  LocalStorageServiceV1,
  UITranslateLoaderFactoryV1,
} from 'client-shared-services';

import {
  ClientSharedComponentsModule,
} from 'client-shared-components';

import {
  ClientUtilsModule,
} from 'client-utils';

import {
  ClientServicesModule,
} from 'client-services';

import {
  ClientComponentsModule,
} from 'client-components';
import {
  ClassificationCategoryDeleteModalV1,
  ClassificationCategoryImportModalV1,
  ClassificationCategorySaveModalV1,
  ClassificationCategoryListV1,
  ClassificationSynonymsTableV1,

} from './components';

import { RoutingModule } from './modules/routing.module';
import { CarbonFrameworkModule } from './modules/carbon-framework.module';
import {
  WbcClassificationCategoryViewV1
} from './app';
import {
  ClassificationCategoryViewV1
} from './view';

@NgModule({
  declarations: [
    ClassificationCategoryViewV1,
    ClassificationCategoryDeleteModalV1,
    ClassificationCategoryImportModalV1,
    ClassificationCategorySaveModalV1,
    ClassificationCategoryListV1,
    ClassificationSynonymsTableV1,
    WbcClassificationCategoryViewV1
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        //
        NgbModule,
        //
        CarbonFrameworkModule,
        RoutingModule,
        //
        ClientSharedUtilsModule,
        ClientSharedComponentsModule,
        ClientSharedServicesModule,
        ClientUtilsModule,
        ClientServicesModule,
        ClientComponentsModule,
        //
        NgJsonEditorModule,
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
        ButtonModule,
        GridModule,
    ],
  providers: [
    {
      provide: EnvironmentServiceV1,
      useValue: new EnvironmentServiceV1({}),
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [WbcClassificationCategoryViewV1]
})
export class AppModule implements DoBootstrap {

  constructor(
    private injector: Injector
  ) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(WbcClassificationCategoryViewV1,
      {
        injector: this.injector,
      });
    customElements.define(WbcClassificationCategoryViewV1.getElementTag(), ELEMENT);
  }
}
