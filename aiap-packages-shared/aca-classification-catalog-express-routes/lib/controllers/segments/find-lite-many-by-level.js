/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-express-routes-controllers-find-lite-many-by-level';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { segmentsService } = require('@ibm-aca/aca-classification-catalog-service');

const findLiteManyByLevel = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let params;
  let result;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;

    const BODY = request?.body;
    const LANGUAGE = BODY?.language;
    const LEVEL = BODY?.level;
    const INCLUDE_PARENT = BODY?.includeParent;
    const IDS = BODY?.ids;

    params = {
      language: LANGUAGE,
      level: LEVEL,
      includeParent: INCLUDE_PARENT,
      ids: IDS,
    }
    result = await segmentsService.findLiteManyByLevel(context, params);
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
    logger.error(`${findLiteManyByLevel.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findLiteManyByLevel
}
