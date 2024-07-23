/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-delay';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');

const {
  shouldSkipBySenderActionTypes,
} = require('@ibm-aca/aca-utils-soe-middleware');

const {
  queue,
} = require('@ibm-aiap/aiap-wrapper-async');

const {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} = require('@ibm-aiap/aiap-soe-brain');

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');
const lensImplementsTyping = ramda.lensPath(['bot', 'implements', 'typing']);
const lensId = ramda.lensPath(['update', 'sender', 'id']);

class DelayWare extends AbstractMiddleware {
  constructor(configuration) {
    super(
      [botStates.NEW, botStates.UPDATE],
      'delay-ware',
      middlewareTypes.OUTGOING
    );
    this.configuration = configuration?.middlewareDelay;

    this.delayFirst = configuration?.middlewareDelay?.responseFirstDelay;
    this.delaySubSequent =
      configuration?.middlewareDelay?.responseSubsequentDelay;
    this.queues = {};
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

  async executor(bot, update, message) {
    let updateSenderId;
    try {
      updateSenderId = getUpdateSenderId(update);
      if (message?.message && message?.message?.text) {
        await this.queueNext(bot, update, message);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { updateSenderId });
      throw ACA_ERROR;
    }
  }

  queueNext(bot, update, message) {
    let updateSenderId;
    try {
      updateSenderId = update?.sender?.id;
      const RET_VAL = new Promise((resolve, reject) => {
        let queue = ramda.view(ramda.lensProp(updateSenderId), this.queues);
        if (!queue) {
          queue = this.makeQueue();
          this.queues[updateSenderId] = queue;
        }
        queue.push({
          qLength: queue.length(),
          bot: bot,
          update: update,
          message: message,
          promise: {
            resolve: resolve,
            reject: reject,
          },
        });
      });
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('queueNext', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  queueWorker(task, cb) {
    let now;
    let diff;
    try {
      now = Date.now();
      diff = this.delayFirst - (now - task.update.timestamp);
      const exec = () => task.promise.resolve() || cb();
      const execWithDelay = (delay) => setTimeout(exec, delay);
      if (diff > 0 && task.qLength == 0) {
        if (logger.isDebug()) {
          logger.debug(`no messages on outgoing queue - waiting ${diff}`, {
            update: task.update,
          });
        }
        execWithDelay(diff);
      } else if (task.qLength > 0) {
        if (logger.isDebug()) {
          logger.debug(
            `${task.qLength} tasks on queue - waiting ${this.delaySubSequent}`,
            {
              update: task.update,
            }
          );
        }
        if (ramda.view(lensImplementsTyping, task)) {
          task.bot.sendIsTypingMessageTo(ramda.view(lensId, task), {
            ignoreMiddleware: true,
          });
        }
        execWithDelay(this.delaySubSequent);
      } else {
        if (logger.isDebug()) {
          logger.debug('over the min response time, not waiting', {
            update: task.update,
          });
        }
        process.nextTick(exec);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('queueWorker', { ACA_ERROR });
      task.promise.reject(ACA_ERROR);
    }
  }

  makeQueue() {
    const RET_VAL = queue(this.queueWorker.bind(this), 1);
    return RET_VAL;
  }
}

module.exports = {
  DelayWare,
};
