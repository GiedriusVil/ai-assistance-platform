/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ClientServicesModule } from 'client-services';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ClientServicesModule,
    NgbDropdownModule,
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
