/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { createCustomElement } from '@angular/elements';

import * as lodash from 'lodash';

import { AppComponent } from './app.component';
import { ClientUtilsModule, _debugX, _warnX } from 'client-utils';
import { ClientServicesModule } from 'client-services';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ClientUtilsModule,
    ClientServicesModule,
    ReactiveFormsModule,
  ]
})
export class AppModule implements DoBootstrap {

  static getClassName() {
    return 'AppModule';
  }

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AppComponent, { injector: this.injector });
    if (!lodash.isEmpty(customElements.get(AppComponent.getElementTag()))) {
      _warnX(AppModule.getClassName(), `ngDoBootstrap`, {
        message: 'Custom element is already defined',
        element: AppComponent.getElementTag(),
      })
    } else {
      customElements.define(AppComponent.getElementTag(), ELEMENT);
    }
  }
}
