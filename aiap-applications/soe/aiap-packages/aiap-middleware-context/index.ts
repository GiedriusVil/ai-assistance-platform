/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-context`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  getUpdateSenderId,
  getUpdateContext,
  getUpdateSessionContext,
  setUpdateSessionContext,
  setUpdateSessionAuth,
  getUpdateSessionAuth,
} from '@ibm-aiap/aiap-utils-soe-update';

class ContextWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'context-ware',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: [],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(adapter, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    const UPDATE_CONTEXT = getUpdateContext(update);
    const UPDATE_SESSION_CONTEXT = getUpdateSessionContext(update);
    const UPDATE_SESSION_AUTH = getUpdateSessionAuth(update);

    let updateSessionContextNew;
    let updateSessionAuthNew;
    try {
      if (logger.isDebug()) {
        logger.debug('Checking for context to add', { update });
      }
      if (UPDATE_CONTEXT) {
        if (UPDATE_SESSION_CONTEXT) {
          updateSessionContextNew = ramda.mergeRight(
            UPDATE_SESSION_CONTEXT,
            UPDATE_CONTEXT.context
          );
        } else {
          updateSessionContextNew = ramda.mergeRight(
            {},
            UPDATE_CONTEXT.context
          );
        }
        if (UPDATE_SESSION_AUTH) {
          updateSessionAuthNew = ramda.mergeRight(
            UPDATE_SESSION_AUTH,
            UPDATE_CONTEXT.auth
          );
        } else {
          updateSessionAuthNew = ramda.mergeRight({}, UPDATE_CONTEXT.auth);
        }
        setUpdateSessionContext(update, updateSessionContextNew);
        setUpdateSessionAuth(update, updateSessionAuthNew);
      }
      if (logger.isDebug()) {
        logger.debug('Context check finished', { update });
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  ContextWare,
};
