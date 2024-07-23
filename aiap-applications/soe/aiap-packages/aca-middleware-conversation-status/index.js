/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-conversation-status-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');

const {
  shouldSkipBySenderActionTypes,
} = require('@ibm-aca/aca-utils-soe-middleware');

const {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} = require('@ibm-aiap/aiap-soe-brain');

const {
  getUpdateSenderId,
  getUpdateSession,
  setUpdateStatus,
  getUpdateSessionTransfer,
  getUpdateTransfer,
  getUpdateSessionConversation,
  setUpdateSessionConversation,
  setUpdateSessionTransfer,
  getUpdateMetaConversation,
} = require('@ibm-aiap/aiap-utils-soe-update');

class ConversationStatusWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.UPDATE],
      'conversation-status-ware',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(adapter, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);

    const UPDATE_SESSION = getUpdateSession(update);
    const UPDATE_SESSION_TRANSFER = getUpdateSessionTransfer(update);
    const UPDATE_SESSION_CONVERSATION = getUpdateSessionConversation(update);

    const UPDATE_TRANSFER = getUpdateTransfer(update);

    const UPDATE_META_CONVERSATION = getUpdateMetaConversation(update);

    let status;
    let updateSessionConversation;
    let updateSessionTransfer;
    try {
      // Check if update session indicates that bot knows about this chat already
      // and set update.status to proper status
      if (lodash.isEmpty(UPDATE_SESSION)) {
        status = botStates.NEW;
        if (UPDATE_META_CONVERSATION) {
          updateSessionConversation = UPDATE_META_CONVERSATION;
        } else {
          updateSessionConversation = {};
        }
      } else if (!lodash.isEmpty(UPDATE_SESSION_TRANSFER) || UPDATE_TRANSFER) {
        status = botStates.MONITOR;
        updateSessionTransfer = ramda.mergeDeepLeft(
          UPDATE_SESSION_TRANSFER,
          UPDATE_TRANSFER
        );
      } else {
        status = botStates.UPDATE;
        if (UPDATE_META_CONVERSATION) {
          updateSessionConversation = ramda.mergeDeepLeft(
            UPDATE_SESSION_CONVERSATION,
            UPDATE_META_CONVERSATION
          );
        }
      }
      setUpdateStatus(update, status);
      if (updateSessionConversation) {
        setUpdateSessionConversation(update, updateSessionConversation);
      }
      if (updateSessionTransfer) {
        setUpdateSessionTransfer(update, updateSessionTransfer);
      }
      logger.info(this.executor.name, {
        status: update.status,
        trace: update,
      });
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  ConversationStatusWare,
};
