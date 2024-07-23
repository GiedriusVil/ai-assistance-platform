/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-express-routes-controller-rules-conditions-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { rulesConditionsService } = require('@ibm-aca/aca-buy-rules-service');

const findManyByQuery = async (request, response) => {
  const ERRORS = [];

  let context;
  let contextUserId;

  let params;
  let result;
  try {
    context = request?.acaContext;
    contextUserId = context?.user?.id;
    params = request?.body;
    if (
      lodash.isEmpty(context)
    ) {
      const MESSSAGE = `Missing required request.acaContext paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSSAGE);
    }
    if (
      lodash.isEmpty(params)
    ) {
      const MESSAGE = `Missing required params.body parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    result = await rulesConditionsService.findManyByQuery(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {});
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERROR', ERRORS);
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findManyByQuery,
};
