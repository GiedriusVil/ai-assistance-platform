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
  ConfigServiceV1,
  TmpErrorsServiceV1
} from "client-services";

@Component({
  selector: 'aca-system-error-view',
  templateUrl: './system-error.view.html',
  styleUrls: ['./system-error.view.scss']
})
export class SystemErrorView implements OnInit, OnDestroy {

  static getClassName() {
    return 'SystemErrorView';
  }

  param: { title: string, showError: boolean };

  error: any;

  constructor(
    private configService: ConfigServiceV1,
    private tmpErrorService: TmpErrorsServiceV1,
  ) { }

  ngOnInit(): void {
    const CONFIG = this.configService.get();
    this.param = { title: CONFIG['title'] || 'the bot', showError: CONFIG['errorDetailsEnabled'] };

    this.error = this.tmpErrorService.getSystemError();
  }

  ngOnDestroy(): void {

  }

}
