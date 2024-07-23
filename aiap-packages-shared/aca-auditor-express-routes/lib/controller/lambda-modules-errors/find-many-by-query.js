/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const LOGGER_NAME = 'aca-auditor-express-routes-controller-lambda-modules-errors-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(LOGGER_NAME);

const ramda = require('ramda');
const lodash = require('lodash');

const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { lambdaModulesErrorsAuditorService } = require('@ibm-aca/aca-auditor-service');

const findManyByQuery = async (request, response) => {
  const ERRORS = [];
  let retVal;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = ramda.path(['body'], request);
    if (
      lodash.isEmpty(PARAMS)
    ) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${LOGGER_NAME}] Missing required request.body attribute!`
      };
      throw ACA_ERROR;
    }
    if (lodash.isEmpty(ERRORS)) {
      retVal = await lambdaModulesErrorsAuditorService.findManyByQuery(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(LOGGER_NAME, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(retVal);
  } else {
    logger.error('ERROR', ERRORS);
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findManyByQuery,
};
