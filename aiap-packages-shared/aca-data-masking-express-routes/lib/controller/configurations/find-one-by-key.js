/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-data-masking-express-routes-controller-configurations-find-one-by-key';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { dataMaskingConfigurationsService } = require('@ibm-aca/aca-data-masking-service');

const findOneByKey = async (request, response) => {
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
      throw ACA_ERROR;
    }
    result = await dataMaskingConfigurationsService.findOneByKey(CONTEXT, PARAMS);
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
  findOneByKey,
};
