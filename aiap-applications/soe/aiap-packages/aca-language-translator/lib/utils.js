/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-language-translator`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


const {
  LanguageTranslatorV3,
  IamAuthenticator,
} = require('@ibm-aiap/aiap-wrapper-ibm-watson');


const languages = require('@cospired/i18n-iso-languages');

const R = require('ramda');

const getLanguageTranslator = config => {
  if (config) {
    return new LanguageTranslatorV3({
      version: config['version'],
      authenticator: new IamAuthenticator({
        apikey: config['apikey'],
      }),
      url: config['url'],
    });
  } else {
    return undefined;
  }
};

const getText = update => {
  let text = R.path(['message', 'text'], update);
  if (text) {
    text = R.trim(text);
  }
  return text;
};

const getPatternMatch = text => {
  const patterns = ['@', '.com', '.net'];

  let skipTranslate = false;
  for (let i = 0; i < patterns.length; i++) {
    if (R.includes(patterns[i], text)) {
      skipTranslate = true;
    }
  }

  if (R.isEmpty(text) || R.isNil(text)) {
    skipTranslate = true;
  }

  return skipTranslate;
};

const getTranslate = (config, INCOMING_TEXT, SOURCE_LANGUAGE, TARGET_LANGUAGE) => {
  return new Promise(resolve => {
    getLanguageTranslator(config)
      .translate({ text: INCOMING_TEXT, source: SOURCE_LANGUAGE, target: TARGET_LANGUAGE })
      .then(response => {
        return resolve({
          translated: R.pathOr(INCOMING_TEXT, ['result', 'translations', 0, 'translation'], response),
        });
      })
      .catch(error => {
        logger.error('[TRANSLATE][ERROR]', {
          error: R.path(['message'], error),
          text: INCOMING_TEXT,
          source: SOURCE_LANGUAGE,
          target: TARGET_LANGUAGE,
        });
        return resolve({
          translated: INCOMING_TEXT,
        });
      });
  });
};

const getProfileLanguage = update => {
  let language = R.path(['session', 'context', 'profile', 'language'], update);

  if (language) {
    language = R.trim(language);
  }

  if (R.isEmpty(language) || R.isNil(language) || language === undefined) {
    language = 'ENG';
  }

  const result = languages.alpha3BToAlpha2(R.toLower(language));
  return result ? R.toLower(result) : R.toLower('EN');
};

module.exports = {
  getProfileLanguage,
  getPatternMatch,
  getTranslate,
  getText,
};
