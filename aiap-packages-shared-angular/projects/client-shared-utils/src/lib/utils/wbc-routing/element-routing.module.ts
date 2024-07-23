/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, Compiler, Injector, ModuleWithProviders } from '@angular/core';
import { MultiLocationStrategy } from './multi-location-strategy';

import {
  RouterModule,
  Router,
  UrlSerializer,
  ChildrenOutletContexts,
  ROUTES,
  ROUTER_CONFIGURATION,
  PreloadingStrategy,
  NoPreloading,
  provideRoutes,
  Routes,
  ExtraOptions,
} from '@angular/router';

import { ɵROUTER_PROVIDERS as ROUTER_PROVIDERS } from '@angular/router';
import { LocationStrategy, Location } from '@angular/common';


function flatten(list: any) {
  return list.reduce(function (flat: any, item: any) {
    var flatItem = Array.isArray(item) ? flatten(item) : item;
    return flat.concat(flatItem);
  }, []);
}

export function setupElementsRouter(urlSerializer: UrlSerializer, contexts: ChildrenOutletContexts, location: Location, compiler: any, injector: Injector, routes: any): Router {
  // tslint:disable-next-line:no-non-null-assertion
  const FLAT_ROUTES = flatten(routes);
  return new Router(null!, urlSerializer, contexts, location, injector, compiler, FLAT_ROUTES);
}

@NgModule({
  exports: [RouterModule],
  providers: [
    ROUTER_PROVIDERS,
    { provide: Location, useClass: Location },
    { provide: LocationStrategy, useClass: MultiLocationStrategy },
    {
      provide: Router,
      useFactory: setupElementsRouter,
      deps: [
        UrlSerializer,
        ChildrenOutletContexts,
        Location,
        Compiler,
        Injector,
        ROUTES,
      ]
    },
    { provide: PreloadingStrategy, useExisting: NoPreloading }, provideRoutes([])
  ]
})
export class ElementRoutingModule {
  static withRoutes(routes: Routes, config?: ExtraOptions): ModuleWithProviders<ElementRoutingModule> {
    return {
      ngModule: ElementRoutingModule,
      providers: [
        provideRoutes(routes),
        { provide: ROUTER_CONFIGURATION, useValue: config ? config : {} },
      ]
    };
  };
}
