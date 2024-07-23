/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  LoginServiceV1,
} from 'client-services';

import {
  AdministratorServiceV1,
} from '../../../services';

@Component({
  selector: 'aiap-admin-view-header-v1',
  templateUrl: './admin-view-header-v1.html',
  styleUrls: ['./admin-view-header-v1.scss']
})
export class AdminViewHeaderV1 implements OnInit {

  static getClassName() {
    return 'AdminViewHeaderV1';
  }

  user: any = null;
  isOpen = false;


  constructor(
    private router: Router,
    private loginService: LoginServiceV1,
    private sessionService: SessionServiceV1,
    private administratorService: AdministratorServiceV1,
  ) { }

  ngOnInit() {
    this.user = this.sessionService.getUser();
    if (this.user.username.includes('@')) {
      this.user.displayName = this.user.username.substring(0, this.user.username.indexOf('@')).split('.').join(' ');
    }
  }

  logout() {
    this.router.navigateByUrl('/login').then(() => {
      this.loginService.logout();
    });
  }

  handleExitAdministratorModeEvent(event) {
    _debugX(AdminViewHeaderV1.getClassName(), `handleExitAdministratorModeEvent`,
      {
        event,
      });

    this.administratorService.exitAdminMode();
  }

}
