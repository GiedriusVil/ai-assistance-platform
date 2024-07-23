/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-conversation-echo`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');
const {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} = require('@ibm-aiap/aiap-soe-brain');

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

class ConversationEchoWare extends AbstractMiddleware {
  constructor(config) {
    super(
      [botStates.NEW, botStates.UPDATE],
      'conversation-echo-ware',
      middlewareTypes.INCOMING
    );
    this.config = config;
  }

  __shouldSkip(context) {
    const UPDATE = context?.update;
    const MESSAGE = UPDATE?.raw?.message;
    const SENDER_ACTION_TYPE = MESSAGE?.sender_action?.type;

    const SKIP_SENDER_ACTION_TYPES = ['LOG_USER_ACTION'];

    if (
      !lodash.isEmpty(SENDER_ACTION_TYPE) &&
      SKIP_SENDER_ACTION_TYPES.includes(SENDER_ACTION_TYPE)
    ) {
      return true;
    }

    return false;
  }

  async executor(bot, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      return Promise.resolve(`ECHO: ${update.message.text}`).then(
        (response) => {
          if (logger.isDebug())
            logger.debug('Message received from Echo Conversation Service', {
              echo_response: response,
              update,
            });
          update.session.dialogId = 'UNUSED';
          update.session.lastContext = {};
          update.session.echo = update.session.echo || {};
          update.session.echo.intents = [];
          update.session.echo.entities = [];
          update.session.echo.log_data = [];
          update.session.echo.nodes_visited = [];
          update.response = update.response || {};
          update.response.text = response;
          return;
        }
      );
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  ConversationEchoWare,
};
