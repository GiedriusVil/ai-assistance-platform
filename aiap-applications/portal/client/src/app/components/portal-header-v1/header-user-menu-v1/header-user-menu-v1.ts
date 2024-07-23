/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  LoginServiceV1,
} from 'client-services';

import {
  UserSaveModalV1,
} from 'client-views';

@Component({
  selector: 'aiap-header-user-menu-v1',
  templateUrl: './header-user-menu-v1.html',
  styleUrls: ['./header-user-menu-v1.scss']
})
export class HeaderUserMenuV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'HeaderUserMenuV1';
  }

  @ViewChild('userSaveModal') userSaveModal: UserSaveModalV1;

  @Input() user;

  constructor(
    private router: Router,
    private loginService: LoginServiceV1,
  ) { }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    //
  }

  handleViewDocumentationEvent(event: any) {
    _debugX(HeaderUserMenuV1.getClassName(), 'handleViewDocumentationEvent',
      {
        event,
      });

    const URL_DOCS = this.router.serializeUrl(this.router.createUrlTree(['/docs']));
    window.open(URL_DOCS, '_blank');
  }

  handleShowUserProfile(event: any) {
    this.user.userStatus = 'ACTIVE';
    _debugX(HeaderUserMenuV1.getClassName(), 'handleShowUserProfile',
      {
        event,
      });

    this.userSaveModal.showAsModal(this.user, true);
  }

  handleLogoutEvent(event) {
    _debugX(HeaderUserMenuV1.getClassName(), 'handleShowUserProfile',
      {
        event,
      });

    this.router.navigateByUrl('/login').then(() => {
      this.loginService.logout();
    });
  }

}
