/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-soe-send-error-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateSessionContextAttribute,
  getUpdateConversationId,
} from '@ibm-aiap/aiap-utils-soe-update';
import { SoeBotV1 } from '@ibm-aiap/aiap-soe-bot';


const _isErrorMessageEnabled = (
  update: ISoeUpdateV1,
) => {
  let engagement;
  let configuration;
  let userProfileId;
  let retVal = false;
  try {
    engagement = getUpdateSessionContextAttribute(update, 'engagement');
    configuration = ramda.path(['soe', 'aca-utils-soe-messages', 'ACA_ERROR'], engagement);
    userProfileId = update?.session?.context?.private?.userProfile?.id;

    if (
      lodash.isBoolean(configuration)
    ) {
      retVal = configuration;
    } else if (
      lodash.isObject(configuration) &&
      !lodash.isEmpty(configuration?.userIds) &&
      lodash.isArray(configuration?.userIds) &&
      !lodash.isEmpty(userProfileId)
    ) {
      retVal = configuration.userIds.includes(userProfileId);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_isErrorMessageEnabled.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const sendErrorMessage = async (
  bot: SoeBotV1,
  update: ISoeUpdateV1,
  text: any,
  error: any,
) => {
  let isEnabled;
  try {
    isEnabled = _isErrorMessageEnabled(update);
    if (
      isEnabled
    ) {
      if (error) {
        error.conversationId = getUpdateConversationId(update);
      }
      const ATTACHMENT = {
        type: 'ACA_ERROR',
        error: error
      };
      const OUTGOING_MESSAGE = bot.createOutgoingMessageFor(update.sender.id);
      OUTGOING_MESSAGE.addText(text);
      OUTGOING_MESSAGE.addAttachment(ATTACHMENT);
      OUTGOING_MESSAGE.__addProperty('type', 'sendDebugMessage', 'ACA_ERROR');
      await bot.sendMessage(OUTGOING_MESSAGE);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(sendErrorMessage.name, { ACA_ERROR });
  }
}

export {
  sendErrorMessage,
}
