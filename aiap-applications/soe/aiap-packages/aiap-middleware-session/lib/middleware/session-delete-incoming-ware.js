/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-middleware-session-session-delete-incoming-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');
const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');

class SessionDeleteIncomingMiddleware extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.INTERNAL_UPDATE
      ],
      'session-delete-ware',
      middlewareTypes.INCOMING
    );
  }

  async executor(adapter, update) {
    const UPDATE_SENDER_ID = ramda.path(['sender', 'id'], update);
    try {
      const SESSION_STORE = getMemoryStore();
      if (
        lodash.isEmpty(SESSION_STORE)
      ) {
        const MESSAGE = `Unable to retrieve session store from @ibm-aiap/aiap-memory-store-provider!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      if (
        update.metadata &&
        ramda.defaultTo({})(ramda.find(ramda.propEq('key', 'deleteSession'))(update.metadata)).value
      ) {
        await SESSION_STORE.deleteData(update);
      }
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
  SessionDeleteIncomingMiddleware,
};
