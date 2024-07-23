/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-wait';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  until,
} = require('@ibm-aiap/aiap-wrapper-async');

const {
  setTimeout,
} = require('timers/promises');

const { TYPING_OFF } = require('@ibm-aiap/aiap-soe-bot');
const {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} = require('@ibm-aiap/aiap-soe-brain');
const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

const {
  shouldSkipBySenderActionTypes,
} = require('@ibm-aca/aca-utils-soe-middleware');

class WaitWare extends AbstractMiddleware {
  constructor(config) {
    super(
      [botStates.NEW, botStates.UPDATE],
      'wait-ware',
      middlewareTypes.INCOMING
    );

    this.CONFIG = config?.middlewareWait;

    this.NOT_TYPING_IN_A_ROW = this.CONFIG?.maxTypingCount;
    this.CONCAT_DELAY = this.CONFIG?.concatDelay;

    this.updatesBySender = {};
    this.notTypingCount = {};
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
    try {
      if (!this._hasToSkip(bot, update)) {
        await this._executeWaitWare(bot, update);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(WaitWare.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async _executeWaitWare(bot, update) {
    try {
      const SENDER_ID = getUpdateSenderId(update);
      this.notTypingCount[SENDER_ID] = 0;
      this.updatesBySender[SENDER_ID] = this.appendUpdate(update);
      const ORIGINAL_NUM_UPDATES = this.getNumUpdates(update);
      await this.checkUserTypingAndUpdateStatus(
        bot,
        update,
        ORIGINAL_NUM_UPDATES,
        SENDER_ID
      );

      if (this.getNotTypingSteadily(SENDER_ID)) {
        const TRACE_ID = update?.traceId;
        const TYPING_PARAMS = {
          senderId: SENDER_ID,
          traceId: TRACE_ID,
        };
        await this.sendIsTypingMessage(bot, TYPING_PARAMS);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(WaitWare.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  _hasToSkip(bot, update) {
    const RET_VAL =
      !bot.getTyping ||
      !update?.raw?.message ||
      update?.raw?.message?.text == '' ||
      lodash.startsWith(update?.raw?.message?.text, '§§');
    return RET_VAL;
  }

  getNumUpdates(update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    return this.updatesBySender[UPDATE_SENDER_ID].length;
  }

  getNewUpdates(originalUpdates, update) {
    const RET_VAL = originalUpdates !== this.getNumUpdates(update);
    return RET_VAL;
  }

  getNotTypingSteadily(senderId) {
    const RET_VAL = this.notTypingCount[senderId] > this.NOT_TYPING_IN_A_ROW;
    return RET_VAL;
  }

  appendUpdate(update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    return ramda.pipe(
      ramda.defaultTo([]),
      ramda.append(update)
    )(this.updatesBySender[UPDATE_SENDER_ID]);
  }

  checkUserTypingAndUpdateStatus(bot, update, originalUpdates, senderId) {
    const RET_VAL = until(
      async () => {
        return (
          this.getNewUpdates(originalUpdates, update) ||
          this.getNotTypingSteadily(senderId)
        );
      },
      async () => await this.checkUserTypingStatus(bot, update)
    );
    return RET_VAL;
  }

  async sendIsTypingMessage(bot, typingParams) {
    try {
      const SENDER_ID = typingParams.senderId;
      const USER_UPDATES = this.updatesBySender[SENDER_ID];
      const USER_LAST_UPDATE = USER_UPDATES.pop();
      const USER_JOINED_MESSAGES = USER_UPDATES.map(
        ramda.path(['raw', 'message', 'text'])
      ).join(' ');
      USER_LAST_UPDATE.raw.message.text =
        `${USER_JOINED_MESSAGES} ${USER_LAST_UPDATE.raw.message.text}`.trim(
          ' '
        );
      logger.info(`[MIDDLEWARE][INCOMING][WAIT-WARE]`, {
        text: USER_LAST_UPDATE.raw.message.text,
      });
      this.updatesBySender[SENDER_ID].length = 0;

      if (bot.implements.typing) {
        await bot.sendIsTypingMessageTo(typingParams, {
          ignoreMiddleware: true,
        });
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(WaitWare.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async checkUserTypingStatus(bot, update) {
    try {
      await setTimeout(this.CONCAT_DELAY);
      const UPDATE_SENDER_ID = getUpdateSenderId(update);
      const TYPING_STATUS = await bot.getTyping(UPDATE_SENDER_ID);
      if (!TYPING_STATUS || TYPING_STATUS === TYPING_OFF) {
        this.notTypingCount[UPDATE_SENDER_ID] += 1;
      } else {
        this.notTypingCount[UPDATE_SENDER_ID] = 0;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(WaitWare.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  WaitWare,
};
