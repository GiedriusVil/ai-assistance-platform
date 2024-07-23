/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-service-ai-search-and-analysis-collections-find-supported-languages';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { isoLanguages } = require('@ibm-aca/aca-wrapper-i18n-iso');

const findSupportedLanguages = (context, params) => {
  try {
    const ISO_LANGUAGE_NAMES_LANGUAGE = 'en';
    const LANGUAGES = isoLanguages.getNames(ISO_LANGUAGE_NAMES_LANGUAGE);

    const RET_VAL = [];

    for (const [LANG_CODE, LANG_NAME] of Object.entries(LANGUAGES)) {
      RET_VAL.push({
        code: LANG_CODE,
        name: LANG_NAME,
      });
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findSupportedLanguages.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findSupportedLanguages,
};
