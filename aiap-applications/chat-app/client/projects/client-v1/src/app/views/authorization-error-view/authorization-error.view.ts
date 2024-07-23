/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  _debugX
} from "client-utils";

import {
  TmpErrorsServiceV1,
  ConfigServiceV1
} from "client-services";

@Component({
  selector: 'aca-authorization-error-view',
  templateUrl: './authorization-error.view.html',
  styleUrls: ['./authorization-error.view.scss']
})
export class AuthorizationErrorView implements OnInit, OnDestroy {

  static getClassName() {
    return 'AuthorizationErrorView';
  }

  param: { title: string, showError: boolean };

  error: any;

  constructor(
    private configService: ConfigServiceV1,
    private tmpErrorsService: TmpErrorsServiceV1,
  ) { }

  ngOnInit(): void {
    const CONFIG = this.configService.get();
    this.param = { title: CONFIG['title'] || 'the bot', showError: CONFIG['errorDetailsEnabled'] };

    this.error = this.tmpErrorsService.getAuthorizationError();
  }

  ngOnDestroy(): void {

  }

}
