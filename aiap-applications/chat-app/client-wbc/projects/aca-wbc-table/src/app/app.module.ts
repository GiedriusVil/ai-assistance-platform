/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { PartOfTextPipe } from './pipes/part-of-text.pipe';
import { ClientServicesModule } from 'client-services';
import { ClientUtilsModule } from 'client-utils';

@NgModule({
  declarations: [
    AppComponent,
    PartOfTextPipe,
  ],
  imports: [
    BrowserModule,
    NgbPaginationModule,
    NgbTooltipModule,
    ClientUtilsModule,
    ClientServicesModule,
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
