/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-express-controller-catalogs-delete-many-by-ids';
const LOGGER = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest, } = require('@ibm-aiap/aiap-utils-express-routes');

const { catalogsService } = require('@ibm-aca/aca-classification-catalog-service');

const deleteManyByIds = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let params;
  let retVal;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;
    const IDS = request?.body;
    if (
      lodash.isEmpty(IDS)
    ) {
      const MESSAGE = `Missing required request.body attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    params = { ids: IDS };
    retVal = await catalogsService.deleteManyByIds(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId, params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    LOGGER.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

module.exports = {
  deleteManyByIds,
}
