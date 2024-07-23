/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lamdba-modules-executor-execute-enriched-by-filter';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getOneByRefAndTenant } = require('../runtime-storage');

const executeRetrieveFilterPayloadEnriched = async (ref, origin, context, params) => {

  let retVal;
  let tenant;
  let filter;

  try {
    tenant = context?.user?.session?.tenant;
    filter = getOneByRefAndTenant({ tenant: tenant, ref: ref });

    if (
      filter &&
      filter.retrieveFilterPayload &&
      lodash.isFunction(filter.retrieveFilterPayload)
    ) {
      retVal = await filter.retrieveFilterPayload(context, params);
    } else {
      retVal = await origin(context, params);
    }

    return retVal;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(executeRetrieveFilterPayloadEnriched.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  executeRetrieveFilterPayloadEnriched
}
