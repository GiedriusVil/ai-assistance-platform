/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-channel-rocketchat-provider-message-processor';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  processPingMessage
} from './process-ping-message';

import {
  processErrorMessage
} from './process-error-message';

import {
  processAgentMessage
} from './process-agent-message';

import {
  processTransferBackMessage
} from './process-livechat-close-message';

import {
  processUserConnectedToChatMessage
} from './process-user-connected-to-chat-message';

import {
  processUserForwardedToAgentMessage
} from './process-user-forwad-to-agent-message';

import {
  processAgentStatusChangeMessage
} from './process-agent-status-change-message';

import {
  ChatChannelV1Rocketchat
} from '../channel'

import {
  isPingMessage,
  isAgentMessage,
  isTransferbackMessage,
  isErrorMessage,
  isUserConnectedToChatMessage,
  isUserForwardedToAnotherAgent,
  isAgentStatusChanged
} from '../client-utils';

const processMessage = async (
  channel: ChatChannelV1Rocketchat,
  message: any
) => {
  try {
    const PARAMS = {
      channel: channel,
      message: message
    };
    const IS_CHAT_INITIATED = channel?.chatInitiated;
    switch (true) {
      case isPingMessage(message):
        await processPingMessage(PARAMS);
        break;
      case isErrorMessage(message):
        await processErrorMessage(PARAMS);
        break;
      case isTransferbackMessage(message):
        await processTransferBackMessage(PARAMS);
        break;
      case isAgentMessage(message):
        await processAgentMessage(PARAMS);
        break;
      case isUserConnectedToChatMessage(message, IS_CHAT_INITIATED):
        await processUserConnectedToChatMessage(PARAMS);
        break;
      case isUserForwardedToAnotherAgent(message):
        await processUserForwardedToAgentMessage(PARAMS);
        break;
      case isAgentStatusChanged(message):
        await processAgentStatusChangeMessage(PARAMS);
        break;
      default:
        break;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  processMessage
}
