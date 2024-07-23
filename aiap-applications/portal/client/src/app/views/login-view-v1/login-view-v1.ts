/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import * as lodash from 'lodash';

import {
  SessionServiceV1,
  ConfigServiceV1
} from 'client-shared-services';

@Component({
  selector: 'aiap-login-view-v1',
  templateUrl: './login-view-v1.html',
  styleUrls: ['./login-view-v1.scss'],
})
export class LoginViewV1 implements AfterViewInit {

  static getClassName() {
    return 'LoginViewV1';
  }

  passwordRenewalRequired = false;

  constructor(
    private router: Router,
    private configService: ConfigServiceV1,
    private sessionService: SessionServiceV1,
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

  private addDays(date, days) {
    const RET_VAL = new Date(date);
    RET_VAL.setDate(date.getDate() + days);
    return RET_VAL;
  }

  async checkPasswordRotation() {
    const USER = this.sessionService.getUser();
    const USER_TYPE = USER?.type;

    if (
      USER_TYPE == 'sso'
    ) {
      this.redirect();
    } else {
      const CONFIGURATION = this.configService.getConfig();
      const PASSWORD_ROTATION_PERIOD = CONFIGURATION?.passwordPolicyRotation
      const USER_PASSWORD_LAST_SET = new Date(USER.passwordLastSet);
      const USER_PASSWORD_EXPIRATION = this.addDays(USER_PASSWORD_LAST_SET, PASSWORD_ROTATION_PERIOD);
      const NOW = new Date();

      if (
        NOW < USER_PASSWORD_EXPIRATION
      ) {
        this.redirect();
      } else {
        this.passwordRenewalRequired = true;
      }
    }
  }

  async redirect() {
    const SESSION = this.sessionService.getSession();
    if (
      !lodash.isEmpty(SESSION)
    ) {
      const SESSION_APP_ROUTE = SESSION?.application?.configuration?.route;
      if (
        !lodash.isEmpty(SESSION_APP_ROUTE)
      ) {
        await this.router.navigateByUrl(SESSION_APP_ROUTE);
      } else {
        await this.router.navigateByUrl('/main-view/organizations');
      }
    }
  }
}
