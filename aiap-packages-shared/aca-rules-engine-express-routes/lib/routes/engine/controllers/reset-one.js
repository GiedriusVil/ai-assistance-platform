/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-purchase-request-express-routes-controller-engine-reset-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { transformContextForLogger } = require('@ibm-aca/aca-data-transformer');

const engineProvider = require('@ibm-aca/aca-rules-engine-provider');

const resetEngineInstanceByContext = async (request, response) => {
  const ERRORS = [];
  let result;

  try {
    const BODY = ramda.path(['body'], request);
    if (
      lodash.isEmpty(BODY)
    ) {
      const MESSSAGE = 'Missing required request.body attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSSAGE);
    }
    const CONTEXT = constructActionContextFromRequest(request);

    if (lodash.isEmpty(ERRORS)) {
      const PARAMS = {
        clientId: ramda.path(['client', 'id'], BODY),
        tenantId: ramda.path(['tenant', 'id'], BODY)
      }

      logger.info('->', {
        context: transformContextForLogger(CONTEXT),
      });

      result = await engineProvider.resetAcaRulesEngineByContext(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    logger.info('->', { result });
    response.status(200).json(result);
  } else {
    logger.error('->', { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};


module.exports = {
  resetEngineInstanceByContext,
};
