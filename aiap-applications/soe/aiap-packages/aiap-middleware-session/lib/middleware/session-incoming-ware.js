/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-session-incoming-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
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

const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');

class SessionIncomingWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE
      ],
      'session-ware-inc',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: [],
    };
    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);
    if (
      IGNORE_BY_SENDER_ACTION_TYPE
    ) {
      return true;
    }
    return false;
  }

  async executor(adapter, update) {
    const UPDATE_SENDER_ID = update?.sender?.id;
    try {
      if (
        lodash.isEmpty(UPDATE_SENDER_ID)
      ) {
        const MESSAGE = `Missing required update.sender.id attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const MEMORY_STORE = getMemoryStore();

      const SESSION = await MEMORY_STORE.getData(UPDATE_SENDER_ID);

      update.session = SESSION;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  SessionIncomingWare,
};
