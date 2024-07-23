/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HostLocationServiceV1 {

  static getClassName() {
    return 'HostLocationServiceV1';
  }

  constructor(
    private router: Router
  ) { }

  public handleNavigation() {
    this.router.events.subscribe((val: any) => {

      if (val instanceof NavigationStart) {

        if (val.id === 1 && val.navigationTrigger === 'imperative' || val.navigationTrigger === 'popstate') {

          // Get URL from current Route
          const fullRouteUrl = val.url;

          // Remove outlet from url
          const routeWithoutOutlet = fullRouteUrl.replace(/ *\([^)]*\) */g, '');

          // Navigate to host route and replace location history with fullRouteUrl
          this.router.navigateByUrl(routeWithoutOutlet).then(() => {
            window.history.pushState({}, '', fullRouteUrl);
          });
        }
      }
    });
  }
}
