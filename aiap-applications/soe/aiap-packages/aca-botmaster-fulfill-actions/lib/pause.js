/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

/**
 *  Break text up with a separate messages pausing before each one
 *  ```xml
 *  <pause wait=2000 />
 *  ```
 *  evaluated in series
 *  after evaluating all text / xml before removed
 *  controller sends text before and then waits before allowing rest of text/xml to be evaluated
 *  if the bot implements typing a typing status is sent between pauses.
 *  @param wait {String} how long to wait in ms between each defaults to 1000
 *  @module pause
 */
const MODULE_ID = `aca-botmaster-fulfill-actions-pause`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { copyMessageErrors } = require('@ibm-aiap/aiap-utils-soe-messages');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const DEFAULT_WAIT = 1000;
const lensImplementsTyping = ramda.lensPath(['implements', 'typing']);
const lensId = ramda.lensPath(['sender', 'id']);

const pause = {
  series: true,
  evaluate: 'step',
  replace: 'before',
  controller: (params, cb) => {
    let before;
    let bot;
    let attributes;
    let update;

    try {
      before = params?.before;
      bot = params?.bot;
      attributes = params?.attributes;
      update = params?.update;
      const WAIT = ramda.isNil(attributes.wait) ? DEFAULT_WAIT : Number(attributes.wait);
      const sendNext = () => {
        if (
          ramda.view(lensImplementsTyping, bot) &&
          ramda.view(lensId, update)
        ) {
          bot.sendIsTypingMessageTo(ramda.view(lensId, update), { ignoreMiddleware: true });
        }
        setTimeout(() => cb(null, ''), WAIT);
      };
      if (
        before === ''
      ) {
        sendNext();
      } else {
        const OUTGOING_MESSAGE = bot.createOutgoingMessageFor(update.sender.id);
        OUTGOING_MESSAGE.addText(before);
        if (!lodash.isEmpty(params.message.errors)) {
          copyMessageErrors(params?.message, OUTGOING_MESSAGE);
          delete params.message.errors;
        }
        bot.sendMessage(OUTGOING_MESSAGE).then(() => {
          sendNext();
        }).catch(() => {
          sendNext();
        });
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(`pause.controller`, { ACA_ERROR });
      cb(ACA_ERROR, '');
    }
  }
};

module.exports = {
  pause,
};
