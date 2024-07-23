/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-syncrhonize-incoming-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const {
  getUpdateSenderId,
} = require('@ibm-aiap/aiap-utils-soe-update');

class SynchronizeIncomingWare extends AbstractMiddleware {

  constructor(sessionStore) {
    super(
      [
        botStates.NEW, botStates.UPDATE
      ],
      'synchronize-incoming-ware',
      middlewareTypes.INCOMING
    );
    this.sessionStore = sessionStore;
  }

  async executor(bot, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      if (
        bot.conversations[UPDATE_SENDER_ID]
      ) {
        // adding new promise to the chain
        const conv = bot.conversations[UPDATE_SENDER_ID];
        // logger.debug(`conversation store ${JSON.stringify(conv)}`);
        if (
          conv.done.isPending()
        ) {
          logger.debug(`Skiping messsage for conversation ${UPDATE_SENDER_ID} -  ${update.sequence}`);
          return 'skip';
        } else {
          logger.debug(`adding new message to conversation ${UPDATE_SENDER_ID} -  ${update.sequence}`);

          const promise = new Promise(resolve => {
            bot.once(`${UPDATE_SENDER_ID}-${update.sequence}`, () => {
              resolve(true);
            });
          });

          bot.conversations[UPDATE_SENDER_ID] = { done: promise, sequence: update.sequence };
          return this.sessionStore
            .getData(UPDATE_SENDER_ID)
            .then(data => {
              update.session = data;
            })
            .catch(err => {
              logger.error(`error occured trying to retrieve data from cache: ${err}`, { update });
            });
        }
      } else {
        logger.debug(`adding new conversation ${UPDATE_SENDER_ID} -  ${update.sequence}`);
        const promise = new Promise(resolve => {
          bot.once(`${UPDATE_SENDER_ID}-${update.sequence}`, () => {
            resolve(true);
          });
        });
        bot.conversations[UPDATE_SENDER_ID] = { done: promise, sequence: update.sequence };
        return;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}


module.exports = {
  SynchronizeIncomingWare,
};
