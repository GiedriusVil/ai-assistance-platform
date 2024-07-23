/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import * as R from 'ramda';
import { WidgetParams } from "client-utils";

@Injectable()
export class ParamsServiceV1 {
  private params: WidgetParams = {
    minimized: false,
    widget: true,
    width: '1080'
  };

  get(): WidgetParams {
    return this.params;
  }

  set(profile: any) {
    this.params = R.mergeDeepRight(this.params, profile);
  }
}
