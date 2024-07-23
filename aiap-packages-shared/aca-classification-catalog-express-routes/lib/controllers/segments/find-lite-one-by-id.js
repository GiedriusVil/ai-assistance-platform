/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-express-routes-controllers-segments-find-lite-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest, retrieveLanguageQueryParamFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { segmentsService } = require('@ibm-aca/aca-classification-catalog-service');

const findLiteOneById = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let params;
  let result;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;
    const SEGMENT_ID = request?.params?.id;
    const LANGUAGE = retrieveLanguageQueryParamFromRequest(request);
    params = {
      id: SEGMENT_ID,
      language: LANGUAGE,
    }
    result = await segmentsService.findLiteOneById(context, params);
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
    logger.error(`${findLiteOneById.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findLiteOneById
}
