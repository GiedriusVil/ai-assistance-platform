const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');
const { getText, getPatternMatch, getTranslate, getProfileLanguage } = require('./utils');
const R = require('ramda');

const TARGET_LANGUAGE = R.toLower('EN');

class TranslateWareIncoming extends AbstractMiddleware {
  constructor(config) {
    super([botStates.NEW, botStates.UPDATE], 'translate-incoming-ware', middlewareTypes.INCOMING);
    this.config = config;
  }

  executor(bot, update, next) {
    if (this.config === undefined || this.config === false) {
      return next();
    }

    const SOURCE_LANGUAGE = getProfileLanguage(update);

    if (update['session']['translate'] === undefined) {
      update['session']['translate'] = {};
    }

    const SKIP_ATTRIBUTE = R.pathOr(false, ['session', 'translate', 'skip'], update);
    if (SKIP_ATTRIBUTE) {
      update['session']['translate']['skip'] = false;
    }

    const INCOMING_TEXT = getText(update);

    const SKIP_TRANSLATE = SOURCE_LANGUAGE === TARGET_LANGUAGE || SKIP_ATTRIBUTE;
    if (SKIP_TRANSLATE === false && getPatternMatch(INCOMING_TEXT) === false) {
      getTranslate(this.config, INCOMING_TEXT, SOURCE_LANGUAGE, TARGET_LANGUAGE)
        .then(response => {
          update['message']['text'] = response['translated'];
        })
        .finally(() => {
          next();
        });
    } else {
      next();
    }
  }
}

module.exports = TranslateWareIncoming;
