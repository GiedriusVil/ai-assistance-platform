/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-utils-soe-update-meta-update-meta-conversation`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateMetaConversationV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ensureUpdateMeta,
} from './update-meta';


const ensureUpdateMetaConversation = (
  update: ISoeUpdateV1,
) => {
  const UPDATE_META_CONVERSATION = update?.meta?.conversation;
  const UPDATE_META_CONVERSATION_DEFAULT = {};
  const UPDATE_SESSION_CONTEXT = update?.session?.context;
  try {
    ensureUpdateMeta(update);
    if (
      lodash.isEmpty(UPDATE_META_CONVERSATION)
    ) {
      setUpdateMetaConversation(update, UPDATE_META_CONVERSATION_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { UPDATE_SESSION_CONTEXT });
    logger.error(ensureUpdateMetaConversation.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateMetaConversation = (
  update: ISoeUpdateV1,
  value: ISoeUpdateMetaConversationV1,
) => {
  try {
    ensureUpdateMeta(update);
    update.meta.conversation = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateMetaConversation.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateMetaConversation = (
  update: ISoeUpdateV1,
) => {
  try {
    const RET_VAL = update?.meta?.conversation;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateMetaConversation.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateMetaConversation,
  setUpdateMetaConversation,
  getUpdateMetaConversation,
}
