/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-express-routes-answers-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  constructActionContextFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { answersService } = require('@ibm-aca/aca-answers-service');

const findManyByQuery = async (request, response) => {
  const ERRORS = [];

  const ANSWER_STORE_ID = request?.params?.answerStoreId;
  const QUERY = request?.body?.query;
  const ATTACH_SKILLS = request?.body?.attachSkills;

  let params;
  let retVal;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    params = {
      answerStoreId: ANSWER_STORE_ID,
      attachSkills: ATTACH_SKILLS,
      ...QUERY
    };
    retVal = await answersService.findManyByQuery(CONTEXT, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { ANSWER_STORE_ID, params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error('ERRORS', { ERRORS });
    response.status(500).json(ERRORS);
  }
}

module.exports = {
  findManyByQuery,
}
