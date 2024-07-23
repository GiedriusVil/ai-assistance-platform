/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  ConfigServiceV1
} from 'client-shared-services';

@Component({
  selector: 'aiap-main-view-native-header-v1',
  templateUrl: './main-view-native-header-v1.html',
  styleUrls: ['./main-view-native-header-v1.scss']
})
export class MainViewNativeHeaderV1 implements OnInit {

  static getClassName() {
    return 'MainViewNativeHeader';
  }

  @ViewChild('hamburger') hamburger: HTMLElement;

  user: any = null;
  isOpen = false;
  isExpanded = false;
  permissions: any = {};
  _permissions: any = {};
  appBuildTimestamp: any = '';

  constructor(
    private sessionService: SessionServiceV1,
    private configService: ConfigServiceV1
  ) { }

  ngOnInit() {
    this.user = this.sessionService.getUser();
    if (this.user.username.includes('@')) {
      this.user.displayName = this.user.username.substring(0, this.user.username.indexOf('@')).split('.').join(' ');
    }
    this.appBuildTimestamp = this.acaAppBuildTimestamp();
  }

  acaAppBuildTimestamp() {
    try {
      const ACA_APP_BUILD_TIMESTAMP = this.configService.acaAppBuildTimestamp();
      const RET_VAL = `[${ACA_APP_BUILD_TIMESTAMP}]`;
      return RET_VAL;
    } catch (error) {
      _debugX(MainViewNativeHeaderV1.getClassName(), `acaAppBuildTimestamp`,
        {
          error,
        });
    }
  }
}
