/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-notifications-express-routes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { notificationsService } = require('@ibm-aca/aca-notifications-service');
const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const deleteOneById = async (request, response) => {
  const ERRORS = [];
  let retVal;
  try {
    const CONTEXT = constructActionContextFromRequest(request);

    const BODY = ramda.path(['body'], request);
    if (lodash.isEmpty(BODY)) {
      const MESSAGE = 'Missing request body!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const ID = ramda.path(['body', 'id'], request);

    if (lodash.isEmpty(ERRORS)) {
      const PARAMS = { id: ID };
      retVal = await notificationsService.deleteOneById(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(retVal);
  } else {
    logger.error('->', { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

module.exports = {
  deleteOneById,
}
