/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { EnvironmentServiceV1 } from "client-services";

import { environment } from '../../environments/environment';

@Injectable()
export class EnvironmentServiceImpl extends EnvironmentServiceV1 {

  static getClassName() {
    return 'EnvironmentServiceImpl';
  }

  constructor() {
    super();
  }

  public getEnvironment() {
    return environment;
  }
}
