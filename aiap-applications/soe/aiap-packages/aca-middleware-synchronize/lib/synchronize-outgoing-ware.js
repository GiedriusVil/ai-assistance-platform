/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-synchronize-outgoing-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const {
  getUpdateSenderId,
} = require('@ibm-aiap/aiap-utils-soe-update');

class SynchronizeOutgoingWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW, botStates.UPDATE, botStates.INTERNAL_UPDATE
      ],
      'synchronize-outgoing-ware',
      middlewareTypes.OUTGOING
    );
  }

  async executor(bot, update, message) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      if (bot.conversations[UPDATE_SENDER_ID]) {
        const conv = bot.conversations[UPDATE_SENDER_ID];
        // logger.debug(`Synchronize outgoing ${UPDATE_SENDER_ID} - ${update.sequence}`);
        if (conv.response) {
          conv.response.answers = conv.response.answers ? conv.response.answers - 1 : 0;
        }

        if (conv.response && conv.response.answers == 0 && !conv.internal) {
          logger.debug(`Releasing lock - all answered no internal updates ${UPDATE_SENDER_ID} - ${update.sequence}`);
          bot.done(update);
        } else if (
          conv.response &&
          conv.response.answers == 0 &&
          conv.internal &&
          conv.internal.sequence &&
          conv.internal.sequence.length == 0
        ) {
          logger.debug(
            `Releasing lock - all answered all internal updates processed ${UPDATE_SENDER_ID} - ${update.sequence}`
          );
          bot.done(update);
        } else if (conv.internal && conv.internal.sequence && conv.internal.sequence.length > 0) {
          conv.internal.sequence.pop();
        } else {
          logger.debug(`Decreasing answers count`);
        }
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


module.exports = {
  SynchronizeOutgoingWare,
};
