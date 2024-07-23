/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  ChatWidgetServiceV1,
  HTMLDependenciesServiceV1,
} from 'client-services';

import {
  ClientComponentsModule,
} from 'client-components';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    ClientComponentsModule,
  ],
  providers: [
    ChatWidgetServiceV1,
    HTMLDependenciesServiceV1,
  ],
})
export class AppModule implements DoBootstrap {

  constructor(
    private injector: Injector,
  ) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define(AppComponent.getElementTag(), ELEMENT);
  }
}
