/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-context-var-toggle-middleware-index`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
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
  getUpdateSessionContext,
} = require('@ibm-aiap/aiap-utils-soe-update');

const { getLibConfiguration } = require('../configuration');

class ContextVarToggleWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE
      ],
      'context-var-toggle-ware',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context) {
    let retVal = false;
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };
    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);
    if (
      IGNORE_BY_SENDER_ACTION_TYPE
    ) {
      retVal = true;
    }
    return retVal;
  }

  async executor(adapter, update) {
    let configuration;
    let configurationConfidenceLevel;

    const UPDATE_SESSION_CONTEXT = getUpdateSessionContext(update);
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      configuration = getLibConfiguration();
      console.log(MODULE_ID, { configuration });
      if (
        !configuration?.confidenceLevel
      ) {
        const ERROR_MESSAGE = `Missing required configuration?.confidenceLevel configuration!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      configurationConfidenceLevel = configuration?.confidenceLevel;

      UPDATE_SESSION_CONTEXT['aiapConfidenceLevel'] = configurationConfidenceLevel;

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
  ContextVarToggleWare,
};
