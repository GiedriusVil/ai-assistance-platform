/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-response-structure-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const {
  getUpdateSenderId,
} = require('@ibm-aiap/aiap-utils-soe-update');


class ResponseStructureWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW, botStates.UPDATE, botStates.INTERNAL_UPDATE
      ],
      'response-structure-ware',
      middlewareTypes.OUTGOING
    );
  }

  async executor(bot, update, message) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      let checkTotalTags = message.message.text.match(/<(.*?)\/>/g);
      let checkPause = message.message.text.match(/<pause(.*?)\/>/g);
      let pauseCount = 0;
      let totalTagsCount = 0;

      if (
        !bot.conversations[UPDATE_SENDER_ID]
      ) {
        bot.conversations[UPDATE_SENDER_ID] = {};
      }
      const conv = bot.conversations[UPDATE_SENDER_ID];

      logger.debug(`Analyzing message for ${UPDATE_SENDER_ID} - ${update.sequence}`);
      // logger.debug(`message for ${JSON.stringify(message)}`);
      // logger.debug(`state ${JSON.stringify(conv)}`);

      if (checkTotalTags) {
        totalTagsCount = checkTotalTags.length;
      }

      if (!conv.response) {
        if (totalTagsCount != 0) {
          if (checkPause) {
            pauseCount = checkPause.length;
          }
          conv.response = { answers: pauseCount + 1 };
        } else {
          conv.response = { answers: 1 };
        }
        // logger.debug(`setting new response ${JSON.stringify(conv)}`);
      } else if (
        conv.internal &&
        conv.internal.sequence &&
        conv.internal.sequence.length > 0 &&
        conv.response.answers &&
        conv.response.answers == 1
      ) {
        if (totalTagsCount != 0) {
          if (checkPause) {
            pauseCount = checkPause.length;
          }
          conv.response = { answers: pauseCount + 1 };
        } else {
          conv.response = { answers: 1 };
        }
        // logger.debug(`setting after internal update ${JSON.stringify(conv)}`);
      } else if (conv.response.answers == 0) {
        if (totalTagsCount != 0) {
          if (checkPause) {
            pauseCount = checkPause.length;
          }
          conv.response = { answers: pauseCount + 1 };
        } else {
          conv.response = { answers: 1 };
        }
        // logger.debug(`setting after 0 answers ${JSON.stringify(conv)}`);
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID })
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}


module.exports = {
  ResponseStructureWare,
};
