/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-has-to-switch-ai-service-by-regex';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateSenderId,
  getUpdateSessionContextClassificationModel,
} from '@ibm-aiap/aiap-utils-soe-update';

const hasToSwitchAiServiceByRegex = async (
  update: ISoeUpdateV1,
) => {

  let updateSenderId;
  let updateRawMessageText;

  let updateClassifierModel;
  let updateClassifierModelAiServices;

  let retVal = false;
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = 'Missing required update paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    updateSenderId = getUpdateSenderId(update);
    updateRawMessageText = update?.raw?.message?.text;

    updateClassifierModel = await getUpdateSessionContextClassificationModel(update);
    updateClassifierModelAiServices = updateClassifierModel?.aiServices;

    if (
      !lodash.isEmpty(updateRawMessageText) &&
      !lodash.isEmpty(updateClassifierModelAiServices) &&
      lodash.isArray(updateClassifierModelAiServices)
    ) {

      for (const AI_SERVICE of updateClassifierModelAiServices) {
        const TMP_REGEX_STRING = AI_SERVICE?.regex;

        let tmpRegexExp;
        if (
          !lodash.isEmpty(TMP_REGEX_STRING)
        ) {
          try {
            tmpRegexExp = new RegExp(TMP_REGEX_STRING);
            retVal = tmpRegexExp.test(updateRawMessageText);
          } catch (error) {
            //
          }
        }
        if (
          retVal
        ) {
          break;
        }
      }

    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR,
      {
        updateSenderId,
        updateRawMessageText,
        updateClassifierModel,
      });
    logger.error(hasToSwitchAiServiceByRegex.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  hasToSwitchAiServiceByRegex,
}
