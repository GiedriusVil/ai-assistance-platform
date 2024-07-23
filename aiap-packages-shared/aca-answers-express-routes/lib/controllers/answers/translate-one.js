/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-express-routes-answers-translate-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { answersService } = require('@ibm-aca/aca-answers-service');

const translateOne = async (request, response) => {
  const ERRORS = [];
  let retVal;
  try {
    const ANSWER_STORE_ID = request?.params?.answerStoreId;
    const BODY = request?.body;

    if (lodash.isEmpty(BODY)) {
      const ERROR_MESSAGE = `Missing required value request.body`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    const INPUT_LANGUAGE = BODY?.inputLanguage;
    const OUTPUT_LANGUAGE = BODY?.outputLanguage;
    const INPUT = BODY?.input;
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = {
      answerStoreId: ANSWER_STORE_ID,
      inputLanguage: INPUT_LANGUAGE,
      outputLanguage: OUTPUT_LANGUAGE,
      input: INPUT
    };
    if (lodash.isEmpty(ERRORS)) {
      retVal = await answersService.translateOne(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    !lodash.isEmpty(ERRORS)
  ) {
    logger.error('ERRORS', { ERRORS });
    response.status(500).json(ERRORS);
  } else {
    response.status(200).json(retVal);
  }
}

module.exports = {
  translateOne,
}
