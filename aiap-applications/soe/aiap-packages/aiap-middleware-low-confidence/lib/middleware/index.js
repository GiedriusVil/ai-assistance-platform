/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-low-confidence-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const {
  getUpdateSenderId,
} = require('@ibm-aiap/aiap-utils-soe-update');

const { getLibConfiguration } = require('../configuration');

class LowConfidenceWare extends AbstractMiddleware {

  constructor(params) {
    super(
      [
        botStates.NEW, botStates.UPDATE
      ],
      'low-confidence-ware',
      middlewareTypes.INCOMING
    );
    if (
      !params.sessionStorage
    ) {
      const ERROR_MESSAGE = `Missing required params?.sessionStorage parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    this.sessionStorage = params?.sessionStorage;
  }

  async executor(bot, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);

    let configuration;

    try {
      configuration = getLibConfiguration();
      const getResponse = update => {
        return `<fail id ="lowConfidence" max = ${configuration.lowConfidenceWare.maxRetryCount} message = "${configuration.lowConfidenceWare.message
          }" handover = "${update.message ? update.message.text || '' : ''}" skill="${configuration.lowConfidenceWare.skill
          }" />${configuration.lowConfidenceWare.retryMessage}`;
      };

      const restartChat = async () => {
        ramda.omit(['response'], update);
        const lowConfidenceRetries = update.session.context ? update.session.context.lowConfidence || 0 : 0;
        const formattedUpdate = {
          sender: update.sender,
          recipient: update.recipient,
          status: 'NEW',
          message: {
            text: '', // starting up a new dialog - hence just empty message
          },
          botRestarted: true,
          lowConfidence: lowConfidenceRetries,
        };

        await this.sessionStorage.deleteData(UPDATE_SENDER_ID);
        delete update.session;
        logger.debug('Formatted request: ', { update: formattedUpdate });
        bot.__emitUpdate(formattedUpdate);
      };

      if (update.botRestarted) {
        update.response = update.response || {};
        update.response.text = getResponse(update);
        delete update.botRestarted;
        update.session.context = {
          lowConfidence: update.lowConfidence,
        };
        delete update.lowConfidence;
      }

      if (
        configuration.lowConfidenceWare &&
        (update.session.newFlow || update.session.dialogType == 'wcs') && // TODO - LEGO - LEGACY part
        update.session[update.session.dialogType || 'wva'].intents.length > 0
      ) {
        const filt = intent => intent.confidence >= configuration.lowConfidenceWare.minConfidence;

        const filteredIntents = ramda.filter(filt, update.session[update.session.dialogType || 'wva'].intents);

        if (
          filteredIntents.length === 0
        ) {
          logger.debug('[low-confidence] All intents have too low confidence and chat will be restarted', { update });
          if (
            !update.session.dialogType ||
            update.session.dialogType == 'wva'
          ) {
            await restartChat();
          } else if (
            update.session.dialogType == 'wcs'
          ) {
            update.response.text = getResponse(update);
            return;
          }
        } else {
          return;
        }
      } else {
        return;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  LowConfidenceWare,
};
