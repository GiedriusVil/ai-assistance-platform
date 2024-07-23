/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX
} from "client-utils";

import {
  ConfigServiceV2,
} from "client-services";

@Component({
  selector: 'aca-chat-authorization-error-view',
  templateUrl: './authorization-error.view.html',
  styleUrls: ['./authorization-error.view.scss']
})
export class AuthorizationErrorView implements OnInit, OnDestroy {

  static getClassName() {
    return 'AuthorizationErrorView';
  }

  param: { title: string };

  constructor(
    private configService: ConfigServiceV2,
  ) { }

  ngOnInit(): void {
    const CONFIG = this.configService.get();
    this.param = { title: CONFIG['title'] || 'the bot' };
  }

  ngOnDestroy(): void {

  }

}
