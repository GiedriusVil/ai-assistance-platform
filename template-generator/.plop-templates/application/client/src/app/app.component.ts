/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import * as lodash from 'lodash'

import {
  _debugX,
} from 'client-shared-utils';

import {
  EnvironmentServiceV1,
  ConfigServiceV1
} from 'client-shared-services';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnChanges {

  static getClassName() {
    return 'AppComponent';
  }

  static getWbcId() {
    return '{{dashCase name}}';
  }

  @Input()
  host: string;

  @Input()
  path: string;

  title = 'client';

  configuration: any = {};

  _state = {
    initialized: false,
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    @Inject(DOCUMENT)
    private document: Document,
    private router: Router,
    private location: Location,
    private environmentService: EnvironmentServiceV1,
    private configService: ConfigServiceV1
  ) {
    _debugX(AppComponent.getClassName(), 'constructor', {
      this_environmentService: this.environmentService,
      this_configurationService: this.configService,
    });
  }

  ngOnInit() {
    this.state = lodash.cloneDeep(this._state);
    this.router.initialNavigation(); // Manually triggering initial navigation for @angular/elements
    _debugX(AppComponent.getClassName(), 'ngOnChanges', {
      this_environmentService: this.environmentService,
      this_configurationService: this.configService,
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
      this.loadStyle();
      this.state.initialized = true;
      await this.configService.load();
      this.configuration = this.configService.getConfig();
      this.state.initialized = true;
    }
  }

  private loadStyle() {
    const head = this.document.getElementsByTagName('head')[0];

    const WBC_ID = AppComponent.getWbcId();
    const WBC_STYLE_HREF = `${this.host}/styles.css`;

    let themeLink = this.document.getElementById(WBC_ID) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = WBC_STYLE_HREF;
    } else {
      const WBC_STYLE_EL = this.document.createElement('link');
      WBC_STYLE_EL.id = WBC_ID;
      WBC_STYLE_EL.rel = 'stylesheet';
      WBC_STYLE_EL.href = WBC_STYLE_HREF;
      _debugX(AppComponent.getClassName(), 'loadStyle', { WBC_STYLE_EL });

      head.appendChild(WBC_STYLE_EL);
    }
  }

}
