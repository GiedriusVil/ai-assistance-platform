/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Inject,
} from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import * as lodash from 'lodash'

import { TranslateService } from '@ngx-translate/core';

import {
  _debugX,
} from 'client-shared-utils';

import { NGX_MONACO_EDITOR_CONFIGS } from 'client-shared-utils';

import {
  WbcLocationServiceV1,
  EnvironmentServiceV1,
  LocalStorageServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseAppWbcV1,
} from 'client-shared-views';

import { ConfigurationService } from 'client-services';
import { Title } from '@angular/platform-browser'; 
import { filter, map, mergeMap } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseAppWbcV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'AppComponent';
  }

  static getWbcId() {
    return 'policy-manager';
  }

  @Input() set host(host: string) {
    NGX_MONACO_EDITOR_CONFIGS.baseUrl = host + '/assets';
    this._host = host;
  }

  get host() {
    return this._host;
  }

  _host: string;

  @Input() path: string;

  title = 'client';
  configuration: any = {};

  _state = {
    initialized: false,
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    private titleService: Title, 
    private configurationService: ConfigurationService,
    private wbcLocationService: WbcLocationServiceV1,
    @Inject(DOCUMENT)
    protected document: Document,
    protected environmentService: EnvironmentServiceV1,
    protected localStorageService: LocalStorageServiceV1,
    protected translateService: TranslateService,
    protected translateHelperService: TranslateHelperServiceV1,
  ) {
    super(
      document,
      environmentService,
      localStorageService,
      translateService,
      translateHelperService,
    );
  }

  ngOnInit() {
    this.wbcLocationService.handleNavigation();
    this.router.initialNavigation();

    // Title change logic
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
          this.titleService.setTitle(`${data['name']} | ${environment.title}`);
      });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.host || changes.path) {
      _debugX(AppComponent.getClassName(), 'ngOnChanges', {
        this_host: this.host,
        this_path: this.path,
      });
      const ENVIRONMENT = {
        host: this.host,
        path: this.path,
      }
      this.environmentService.setEnvironment(ENVIRONMENT);
      await this.initTranslations({
        app: AppComponent.getWbcId(),
        host: this.host,
        path: `/assets/i18n`,
      });
      await this.loadStyle({
        wbcId: AppComponent.getWbcId(),
        host: this.host,
      });
      await this.loadScripts({
        wbcId: AppComponent.getWbcId(),
        host: this.host,
      });
      await this.configurationService.fetch();
      this.configuration = this.configurationService.getConfig();
      this.state.initialized = true;
    }
  }

}
