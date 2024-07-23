/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-bot-socketio-utils-utils-typing';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  TYPING_OFF,
  TYPING_ON,
} from '@ibm-aiap/aiap-soe-bot';


class UtilsTyping {

  adapter: any;

  constructor(
    adapter: any,
  ) {
    this.adapter = adapter;
  }

  async getTyping(
    clientId: any,
  ) {
    let retVal;
    if (
      true === this.adapter?.typingStatus[clientId]?.status
    ) {
      retVal = TYPING_ON;
    } else {
      retVal = TYPING_OFF;
    }
    return retVal;
  }

  setTypingStatus(clientId, typingStatus) {
    this.clearTypingStatusTimeout(clientId);
    this.adapter.typingStatus[clientId] = {
      status: typingStatus,
      offTimeout: undefined,
    };
  }

  removeFromTypingStatus(clientId) {
    this.clearTypingStatusTimeout(clientId);
    this.adapter.typingStatus = ramda.dissoc(clientId, this.adapter.typingStatus);
  }

  updateTypingStatus(clientId) {
    this.clearTypingStatusTimeout(clientId);
    //Set typing status to false with timeout
    const offTimeout = setTimeout(() => {
      if (
        null != this.adapter?.typingStatus[clientId]?.offTimeout
      ) {
        this.adapter.typingStatus[clientId].status = false;
      }
    }, this.adapter.settings.typingOffDelay);

    this.adapter.typingStatus = ramda.assocPath(
      [clientId, 'status'],
      true,
      ramda.assocPath([clientId, 'offTimeout'], offTimeout, this.adapter.typingStatus)
    );
  }

  clearTypingStatusTimeout(clientId) {
    if (
      null != this.adapter?.typingStatus[clientId]?.offTimeout
    ) {
      clearTimeout(this.adapter.typingStatus[clientId].offTimeout);
    }
  }
}

export {
  UtilsTyping,
}
