/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import { EnvironmentService } from 'client-services';

import { environment } from '../../environments/environment';

@Injectable()
export class EnvironmentServiceImpl extends EnvironmentService {

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
