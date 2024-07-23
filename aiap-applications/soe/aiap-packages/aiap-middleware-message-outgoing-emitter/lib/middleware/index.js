/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-message-outgoing-emitter`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

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

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

const { getLibConfiguration } = require('../configuration');

class MessageOutgoingEmitterWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE
      ],
      'message-outgoing-emitter-ware',
      middlewareTypes.INCOMING
    );
    this.prefix = `[${this.middlewareType.toUpperCase()}][${this.middlewareName.toUpperCase()}]`;
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

  async executor(bot, update) {
    let configuration;

    let updateSenderId;
    let updateResponseText;
    let outgoingMessage;

    let fallbackMessage;

    let handoverEnabled;
    let handoverSkill;
    let handoverMessage;
    try {
      configuration = getLibConfiguration();
      updateSenderId = getUpdateSenderId(update);
      updateResponseText = update?.response?.text;

      fallbackMessage = configuration?.fallbackMessage;

      handoverEnabled = configuration?.withHandover;
      handoverSkill = configuration?.handoverSkill;
      handoverMessage = configuration?.handoverMessage || '';

      if (
        !lodash.isEmpty(updateResponseText)
      ) {
        outgoingMessage = bot.createOutgoingMessageFor(updateSenderId);
        outgoingMessage.addText(updateResponseText);

        ramda.omit(['response'], update);

        bot.sendMessage(outgoingMessage);
      } else {
        if (
          lodash.isEmpty(configuration)
        ) {
          const ERROR_MESSAGE = `Empty message to be sent out. Can't reply to the chat.`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, {
            updateSenderId,
            updateResponseText,
          });
        }
        if (
          handoverEnabled
        ) {
          bot.reply(
            update,
            `${fallbackMessage}<handover skill="${handoverSkill}">${handoverMessage}</handover>`
          );
        } else {
          // Replying to chat with fallback message with no handover
          bot.reply(update, fallbackMessage);
        }
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { updateSenderId });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  MessageOutgoingEmitterWare,
};
