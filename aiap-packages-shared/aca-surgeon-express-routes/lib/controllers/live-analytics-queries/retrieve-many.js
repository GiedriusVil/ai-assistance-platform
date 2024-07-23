/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-surgeon-express-routes-live-analytics-queries-retrieve-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { getStorage } = require('@ibm-aca/aca-live-analytics-queries-executor');

const _sanitizeTenantRegistry = (tenantRegistry) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(tenantRegistry) &&
    lodash.isObject(tenantRegistry)
  ) {
    for (let [key, value] of Object.entries(tenantRegistry)) {
      RET_VAL[key] = {
        tenantId: value?.tenantId,
        eventStreamId: value?.eventStreamId,
        eventStreamHash: value?.eventStreamHash,
      }
    }
  }
  return RET_VAL;
}

const _sanitizeRegistry = (registry) => {
  const RET_VAL = {};

  if (
    !lodash.isEmpty(registry) &&
    lodash.isObject(registry)
  ) {
    for (let [key, value] of Object.entries(registry)) {
      RET_VAL[key] = _sanitizeTenantRegistry(value);
    }
  }
  return RET_VAL;
}

const retrieveMany = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;
  let result;
  try {
    result = _sanitizeRegistry(getStorage());
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID })
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(`${retrieveMany.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  retrieveMany,
};
