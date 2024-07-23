/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '../environments/environment';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  HostLocationServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aiap-portal-v1',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  static getClassName() {
    return 'AppComponent';
  }

  _state: any = {
    initialized: false,
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private hostLocationService: HostLocationServiceV1,
    private translateHelperServiceV1: TranslateHelperServiceV1,
    private translateService: TranslateService,
  ) { }

  async initTranslations() {
    try {
      const CONFIGURATION_TRANSLATIONS = {
        app: 'portal',
        host: `${window.location.protocol}//${window.location.host}`,
        path: '/assets/i18n',
      };
      _debugX(AppComponent.getClassName(), 'ngOnInit',
        {
          CONFIGURATION_TRANSLATIONS,
        });

      await this.translateHelperServiceV1.load(CONFIGURATION_TRANSLATIONS);
      await this.translateHelperServiceV1.setTranslateService(this.translateService);
    } catch (error) {
      _errorX(AppComponent.getClassName(), 'initTranslations',
        {
          error,
        });
      throw error;
    }
  }

  async ngOnInit() {
    this.hostLocationService.handleNavigation();
    await this.initTranslations();
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.initialized = true;
    this.state = STATE_NEW;

    const body = document.body || document.getElementsByTagName('body')[0];
    document.addEventListener('modal-shown', () => {
      body.classList.add('bx--modal-shown');

      const elements = document.getElementsByClassName('bx--structured-list');
      for (let i = 0; i < elements.length; i++) {
        elements[i].scrollIntoView(true);
      }
    });
    document.addEventListener('modal-hidden', () => {
      body.classList.remove('bx--modal-shown');
    });
    // https://toddmotto.com/dynamic-page-titles-angular-2-router-events
    this.router.events
      .pipe(
        filter((event: any) => {
          let retVal = false;
          if (event instanceof NavigationEnd) {
            retVal = true;
          }
          return retVal;
        }),
        map(() => this.activatedRoute),
        map((route: any) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route: any) => route.outlet === 'primary'),
        mergeMap((route: any) => route.data)
      )
      .subscribe((data: any) => {
        this.title.setTitle(`${this.translateHelperServiceV1.instant(data['name'])} | ${environment.title}`);
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }
}
