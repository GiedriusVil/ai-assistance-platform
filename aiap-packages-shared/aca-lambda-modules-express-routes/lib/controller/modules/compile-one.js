/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-express-routes-controller-modules-compile-one'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  transformToAcaErrorFormat,
  transformContextForLogger,
} = require('@ibm-aca/aca-data-transformer');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { lambdaModulesService } = require('@ibm-aiap/aiap-lambda-modules-service');

const compileOne = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const PARAMS = ramda.path(['body'], request);
  const LAMBDA_MODULE_ID = ramda.path(['id'], PARAMS);
  let result;
  try {
    if (
      lodash.isEmpty(LAMBDA_MODULE_ID)
    ) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body.id attribute!`
      };
      throw ACA_ERROR;
    }
    if (lodash.isEmpty(ERRORS)) {
      logger.info('->', {
        context: transformContextForLogger(CONTEXT),
        params: PARAMS,
      });
      result = await lambdaModulesService.compileOne(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    ACA_ERROR.params = PARAMS;
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(compileOne.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  compileOne,
};
