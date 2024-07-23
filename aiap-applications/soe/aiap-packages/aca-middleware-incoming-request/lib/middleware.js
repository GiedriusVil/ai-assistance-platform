/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-incoming-request-middleware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
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
  sendErrorMessage,
} = require('@ibm-aiap/aiap-utils-soe-messages');

const { getUpdateRawMessage } = require('@ibm-aiap/aiap-utils-soe-update');

const ON_ERROR_MESSAGE =
  'I am facing error, while executing IncomingRequestWare!';

class IncomingRequestWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'incoming-message-ware',
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
    let updateRawMessage;
    let clone;
    try {
      if (lodash.isEmpty(update)) {
        const MESSAGE = `Missing required update parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      updateRawMessage = getUpdateRawMessage(update);
      clone = lodash.cloneDeep(updateRawMessage);
      if (lodash.isEmpty(update?.request)) {
        update.request = {};
      }
      if (lodash.isEmpty(update?.request?.message)) {
        update.request.message = {};
      }
      update.request.message.text = clone?.text;
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('executor', { ACA_ERROR });
      sendErrorMessage(adapter, update, ON_ERROR_MESSAGE, ACA_ERROR);
      return 'cancel';
    }
  }
}

module.exports = {
  IncomingRequestWare,
};
