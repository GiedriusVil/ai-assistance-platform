/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-catalog-rules-express-routes-controller-rules-audits-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { rulesAuditsService } = require('@ibm-aca/aca-catalog-rules-service');

const findOneById = async (request, response) => {
  const ERRORS = [];

  let context;
  let contextUserId;
  let id;

  let params;
  let result;
  try {
    context = request?.acaContext;
    contextUserId = context?.user?.id;
    id = request?.body?.id;
    if (
      lodash.isEmpty(context)
    ) {
      const MESSAGE = `Missing required request.acaContext parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    params = { id };
    result = await rulesAuditsService.findOneById(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId, params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(`${findOneById.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findOneById,
};
