import { APP_INITIALIZER, DoBootstrap, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from './layout/layout.module';
import { BotSocketIoServiceV2, ChatWidgetServiceV1, ClientServiceV2, ConfigServiceV2, GAcaPropsServiceV1, LocalStorageServiceV1, ParamsServiceV1, SessionServiceV2, StorageServiceV2 } from './services';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HostPageInfoService } from './services/host-page-info.service';
import { AcaSharedClientServicesModule, EventBusServiceV1 } from 'client-services';
import { createCustomElement } from '@angular/elements';


export function configServiceFactory(provider: ConfigServiceV2) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    LayoutModule,
    HttpClientModule,
    AppRoutingModule,
    AcaSharedClientServicesModule,
  ],
  providers: [
    EventBusServiceV1,
    ConfigServiceV2,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      deps: [ConfigServiceV2],
      multi: true
    },
    BotSocketIoServiceV2,
    ClientServiceV2,
    StorageServiceV2,
    ChatWidgetServiceV1,
    LocalStorageServiceV1,
    SessionServiceV2,
    GAcaPropsServiceV1,
    ParamsServiceV1,
    HostPageInfoService,
  ]
})
export class AppModule implements DoBootstrap {
  constructor(
    private injector: Injector,
  ) {
  }
  ngDoBootstrap() {
    const ELEMENT = createCustomElement(AppComponent, { injector: this.injector });
    const ELEMENT_TAG_NAME = AppComponent.getHTMLTagName();


    const ELEMENT_OLD = customElements.get(ELEMENT_TAG_NAME);
    if (
      !ELEMENT_OLD
    ) {
      customElements.define(ELEMENT_TAG_NAME, ELEMENT);
    }
  }
}
