/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-language-translator-translate-ware-outgoing`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const { getPatternMatch, getTranslate, getProfileLanguage } = require('./utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const TARGET_LANGUAGE = ramda.toLower('EN');

const __translate = async (message, config, SOURCE_LANGUAGE, TARGET_LANGUAGE) => {
  try {
    const ATTACHMENT_TYPE = ramda.pathOr(undefined, ['message', 'attachment', 'type'], message);
    if (ATTACHMENT_TYPE && ATTACHMENT_TYPE === 'buttons') {
      const buttons = ramda.pathOr([], ['message', 'attachment', 'attachments'], message);
      for (let i = 0; i < buttons.length; i++) {
        const BUTTON_TITLE = ramda.pathOr('', [i, 'title'], buttons);
        if (BUTTON_TITLE && getPatternMatch(BUTTON_TITLE) === false) {
          const response = await getTranslate(config, BUTTON_TITLE, TARGET_LANGUAGE, SOURCE_LANGUAGE);
          message['message']['attachment']['attachments'][i]['title'] = response['translated'];
        }
        const BUTTON_PAYLOAD = ramda.pathOr('', [i, 'payload'], buttons);
        if (BUTTON_PAYLOAD && getPatternMatch(BUTTON_PAYLOAD) === false && BUTTON_PAYLOAD !== BUTTON_TITLE) {
          const response = await getTranslate(config, BUTTON_TITLE, TARGET_LANGUAGE, SOURCE_LANGUAGE);
          message['message']['attachment']['attachments'][i]['payload'] = response['translated'];
        } else {
          message['message']['attachment']['attachments'][i]['payload'] =
            message['message']['attachment']['attachments'][i]['title'];
        }
      }
    }
    return message;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${__translate.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

class TranslateWareOutgoing extends AbstractMiddleware {
  constructor(config) {
    super([botStates.NEW, botStates.UPDATE], 'translate-outgoing-ware', middlewareTypes.OUTGOING);
    this.config = config;
  }

  executor(bot, update, message, next) {
    if (this.config === undefined || this.config === false) {
      return next();
    }

    const SOURCE_LANGUAGE = getProfileLanguage(update);

    const SKIP_ATTRIBUTE = ramda.pathOr(false, ['session', 'translate', 'skip'], update);
    if (SKIP_ATTRIBUTE) {
      update['session']['translate']['skip'] = false;
    }

    const SKIP_TRANSLATE = SOURCE_LANGUAGE === TARGET_LANGUAGE || SKIP_ATTRIBUTE;
    if (SKIP_TRANSLATE === false) {
      __translate(message, this.config, SOURCE_LANGUAGE, TARGET_LANGUAGE).then(response => {
        message = bot.createOutgoingMessage(response);
        next();
      });
    } else {
      next();
    }
  }
}

module.exports = TranslateWareOutgoing;
