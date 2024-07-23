/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX, _errorX } from 'client-utils';

@Injectable()
export class WindowEventsServiceV1 {

  static getClassName() {
    return 'WindowEventsService';
  }

  constructor() { }

  broadcastChatAppClientOpenEvent() {
    const EVENT = {
      type: 'aiapChatAppClientOpen',
      data: true
    };
    _debugX(WindowEventsServiceV1.getClassName(), 'broadcastChatAppClientOpenEvent', { EVENT });
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window['postMessage'](EVENT, '*')
    }, 0);
  }

}
