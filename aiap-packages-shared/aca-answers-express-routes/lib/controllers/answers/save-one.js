/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-express-routes-answers-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  constructActionContextFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const { answersService } = require('@ibm-aca/aca-answers-service');

const saveOne = async (request, response) => {
  const ERRORS = [];
  let retVal;
  try {
    const ANSWER_STORE_ID = ramda.path(['params', 'answerStoreId'], request);
    const ANSWER = ramda.path(['body'], request);
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = {
      answerStoreId: ANSWER_STORE_ID,
      answer: ANSWER,
    };
    retVal = await answersService.saveOne(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    !lodash.isEmpty(ERRORS)
  ) {
    logger.error(saveOne.name, { ERRORS });
    response.status(500).json(ERRORS);
  } else {
    response.status(200).json(retVal);
  }
}

module.exports = {
  saveOne,
}
