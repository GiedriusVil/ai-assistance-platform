/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { createCustomElement } from '@angular/elements';

import {
  AnswerComponent,
} from './components';

import { AppComponent } from './app.component';

import { ClientComponentsModule } from 'client-components';
import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';

@NgModule({
  declarations: [
    AppComponent,
    // Components 
    AnswerComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    ClientUtilsModule,
    ClientServicesModule,
    ClientComponentsModule,
  ],
  providers: []
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define(AppComponent.getElementTag(), ELEMENT);
  }
}
