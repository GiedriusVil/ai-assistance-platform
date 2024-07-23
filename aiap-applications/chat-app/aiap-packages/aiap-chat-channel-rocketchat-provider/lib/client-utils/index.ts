/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-channel-rocketchat-provider-message-client-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

const MESSAGE_TYPE_ENUM = {
  PING: 'ping',
  RESULT: 'result',
  CHANGED: 'changed',
  CONNECTED: 'connected'
};

const AGENT_MESSAGE_TYPE_ENUM = {
  LIVECHAT_CLOSE: 'livechat-close',
  LIVE_CHAT_TRANSFER: 'livechat_transfer_history'
}

const AGENT_TRANSFER_DATA_SCOPE_ENUM = {
  AGENT: 'agent',
  DEPARTMENT: 'department'
}

const isPingMessage = (
  message: any
) => {
  let retVal = false;
  const MESSAGE_TYPE = message?.msg;
  if (
    MESSAGE_TYPE === MESSAGE_TYPE_ENUM.PING
  ) {
    retVal = true;
  }
  return retVal;
}

const isAgentMessage = (
  message: any
) => {
  let retVal = false;
  const MESSAGE_TYPE = message?.msg;
  const MESSAGE_OBJECT = message?.fields?.args?.[0];
  if (
    MESSAGE_TYPE === MESSAGE_TYPE_ENUM.CHANGED &&
    lodash.isEmpty(MESSAGE_OBJECT?.token) &&
    lodash.isEmpty(MESSAGE_OBJECT?.t)
  ) {
    retVal = true;
  }
  return retVal;
}

const isTransferbackMessage = (
  message: any
) => {
  let retVal = false;
  const MESSAGE_TYPE = message?.msg;
  const MESSAGE_OBJECT = message?.fields?.args?.[0];
  if (
    MESSAGE_TYPE === MESSAGE_TYPE_ENUM.CHANGED &&
    MESSAGE_OBJECT?.t === AGENT_MESSAGE_TYPE_ENUM.LIVECHAT_CLOSE
  ) {
    retVal = true;
  }
  return retVal;
}

const isErrorMessage = (
  message: any
) => {
  let retVal = false;
  const MESSAGE_TYPE = message?.msg;
  const MESSAGE_ERROR = message?.error;
  if (
    MESSAGE_TYPE === MESSAGE_TYPE_ENUM.RESULT &&
    !lodash.isEmpty(MESSAGE_ERROR)
  ) {
    retVal = true;
  }
  return retVal;
}

const isUserConnectedToChatMessage = (
  message: any,
  isChatInitiated: boolean
) => {
  let retVal = false;
  const MESSAGE_TYPE = message?.msg;
  const MESSAGE_OBJECT = message?.result?.token;
  if (
    MESSAGE_TYPE === MESSAGE_TYPE_ENUM.RESULT &&
    !lodash.isEmpty(MESSAGE_OBJECT) &&
    !isChatInitiated
  ) {
    retVal = true;
  }
  return retVal;
}

const isUserForwardedToAnotherAgent = (
  message: any
) => {
  let retVal = false;
  const MESSAGE_TYPE = message?.msg;
  const MESSAGE_OBJECT = message?.fields?.args?.[0];
  const MESSAGE_TRANSFER_DATA = MESSAGE_OBJECT?.transferData;
  const MESSAGE_TRANSFER_DATA_SCOPE = MESSAGE_TRANSFER_DATA?.scope;
  if (
    MESSAGE_TYPE === MESSAGE_TYPE_ENUM.CHANGED &&
    MESSAGE_OBJECT?.t === AGENT_MESSAGE_TYPE_ENUM.LIVE_CHAT_TRANSFER &&
    MESSAGE_TRANSFER_DATA_SCOPE === AGENT_TRANSFER_DATA_SCOPE_ENUM.AGENT
  ) {
    retVal = true;
  }
  return retVal;
}

const isAgentStatusChanged = (
  message: any
) => {
  let retVal = false;
  const MESSAGE_ARGS = message?.fields?.args?.[0];
  const MESSAGE_TYPE = MESSAGE_ARGS?.msg;
  const AGENT_NAME = MESSAGE_ARGS?.u?.name;
  if (
    MESSAGE_TYPE === MESSAGE_TYPE_ENUM.CONNECTED &&
    !lodash.isEmpty(AGENT_NAME) 
  ) {
    retVal = true;
  }
  return retVal;
}

export {
  isPingMessage,
  isAgentMessage,
  isTransferbackMessage,
  isErrorMessage,
  isUserConnectedToChatMessage,
  isUserForwardedToAnotherAgent,
  isAgentStatusChanged
}
