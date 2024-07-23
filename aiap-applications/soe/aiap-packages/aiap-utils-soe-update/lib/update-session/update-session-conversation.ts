/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-soe-update-session-conversation`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
  ISoeConversationV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ensureUpdateSession,
} from './update-session';

const ensureUpdateSessionConversation = (
  update: ISoeUpdateV1,
) => {
  const UPDATE_SESSION_CONVERSATION = update?.session?.conversation;
  const UPDATE_SESSION_CONVERSATION_DEFAULT = {};
  try {
    ensureUpdateSession(update);
    if (
      lodash.isEmpty(UPDATE_SESSION_CONVERSATION)
    ) {
      setUpdateSessionConversation(update, UPDATE_SESSION_CONVERSATION_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureUpdateSessionConversation.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateSessionConversation = (
  update: ISoeUpdateV1,
  value: ISoeConversationV1,
) => {
  try {
    ensureUpdateSession(update);
    update.session.conversation = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateSessionConversation.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSessionConversation = (
  update: ISoeUpdateV1,
) => {
  try {
    const RET_VAL = update?.session?.conversation;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSessionConversation.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateSessionConversation,
  setUpdateSessionConversation,
  getUpdateSessionConversation,
}
