/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-express-routes-controller-modules-refresh'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  transformToAcaErrorFormat,
  transformContextForLogger,
} = require('@ibm-aca/aca-data-transformer');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { lambdaModulesService } = require('@ibm-aiap/aiap-lambda-modules-service');

const refresh = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const MODULE = ramda.path(['body'], request);
  const PARAMS = { module: MODULE };
  let result;
  try {
    if (
      lodash.isEmpty(MODULE)
    ) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body attribute!`
      };
      throw ACA_ERROR;
    }
    if (lodash.isEmpty(ERRORS)) {
      logger.info(refresh.name, {
        context: transformContextForLogger(CONTEXT),
        params: PARAMS,
      });
      result = await lambdaModulesService.refresh(CONTEXT, PARAMS);

    }
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    ACA_ERROR.params = PARAMS;
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(refresh.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  refresh,
};
