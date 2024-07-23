/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-express-routes-controller-classification-rules-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { rulesService } = require('@ibm-aca/aca-classification-rules-service');
const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const findOneById = async (request, response) => {
  const ERRORS = [];
  let params;
  let context;
  let result;
  try {
    params = request?.body;
    context = request?.acaContext;

    if (lodash.isEmpty(context)) {
      const MESSAGE = `Missing required request.acaContext parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(params)) {
      const MESSAGE = `Missing required request.body parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);  
    }

    result = await rulesService.findOneById(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(`${findOneById.name}`, { errors: ERRORS });
    response.status(500).json({errors: ERRORS});
  }
};

module.exports = {
  findOneById,
};
