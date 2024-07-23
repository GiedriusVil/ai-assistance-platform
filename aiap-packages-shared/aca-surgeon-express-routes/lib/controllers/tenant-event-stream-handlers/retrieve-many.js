/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-surgeon-express-routes-tenant-event-stream-handlers-retrieve-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { getTenantEventStreamHandlers } = require('@ibm-aiap/aiap-tenant-event-stream-handler');

const _sanitizeTenantRegistry = (tenantRegistry) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(tenantRegistry) &&
    lodash.isObject(tenantRegistry)
  ) {
    for (let [key, value] of Object.entries(tenantRegistry)) {
      RET_VAL[key] = {
        tenantId: ramda.path(['tenantId'], value),
        eventStreamId: ramda.path(['eventStreamId'], value),
        eventStreamHash: ramda.path(['eventStreamHash'], value),
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
  let result;
  try {
    const EVENT_HANDLERS = getTenantEventStreamHandlers();
    result = _sanitizeRegistry(EVENT_HANDLERS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
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
  retrieveMany,
};
