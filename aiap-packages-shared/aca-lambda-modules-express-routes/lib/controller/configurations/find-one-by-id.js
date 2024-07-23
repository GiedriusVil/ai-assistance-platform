/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-express-routes-controller-configuration-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { lambdaModulesConfigurationService } = require('@ibm-aiap/aiap-lambda-modules-service');

const findOneById = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const PARAMS = ramda.path(['body'], request);
  let result;
  try {
    if (
      lodash.isEmpty(PARAMS)
    ) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body parameter!`
      };
      throw ACA_ERROR
    }

    if (lodash.isEmpty(ERRORS)) {
      result = await lambdaModulesConfigurationService.findOneById(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('->', { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findOneById,
};
