/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-service-translate-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');
const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const _translateOne = async (context, params) => {
  throwAcaError(
    MODULE_ID,
    ACA_ERROR_TYPE.SYSTEM_ERROR,
    'Translation service is not implemented. Please implement it using lambda module.',
    { params }
  );
}

const translateOne = async (context, params) => {
  try {
      const INPUT_LANGUAGE = params?.inputLanguage;
      const OUTPUT_LANGUAGE = params?.outputLanguage;
      const TEXT = params?.input?.text;
      if (lodash.isEmpty(INPUT_LANGUAGE)) {
        const ERROR_MESSAGE = `Missing required value params.inputLanguage`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
      }
      if (lodash.isEmpty(OUTPUT_LANGUAGE)) {
        const ERROR_MESSAGE = `Missing required value params.outputLanguage`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
      }
      if (lodash.isEmpty(TEXT)) {
        const ERROR_MESSAGE = `Missing required value params.input.text`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
      }
      await executeEnrichedByLambdaModule(MODULE_ID, _translateOne, context, params);
      const RET_VAL = params?.output;
      return RET_VAL;
    
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }

}

module.exports = {
  translateOne,
}
