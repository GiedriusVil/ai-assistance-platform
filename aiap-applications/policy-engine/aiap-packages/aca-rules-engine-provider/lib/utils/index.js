/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-rules-engine-provider-utils`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const retrieveTenantFromContext = (context) => {
  const RET_VAL = context?.user?.session?.tenant;
  return RET_VAL;
}

const retrieveOrganizationFromContext = (context) => {
  const RET_VAL = context?.user?.session?.organization;
  return RET_VAL;
}

const retrieveOrganizationIdFromContext = (context) => {
  const ORGANIZATION = retrieveOrganizationFromContext(context);
  const RET_VAL = ORGANIZATION?.id;
  return RET_VAL;
}

const retrieveEngineIdFromContext = (context) => {
  const CONTEXT_TENANT = retrieveTenantFromContext(context);
  const CONTEXT_TENANT_ID = CONTEXT_TENANT?.id;
  const CONTEXT_TENANT_HASH = CONTEXT_TENANT?.hash;
  const CONTEXT_ORGANIZATION_ID = retrieveOrganizationIdFromContext(context);
  let retVal;
  if (
    !lodash.isEmpty(CONTEXT_TENANT_ID) &&
    !lodash.isEmpty(CONTEXT_ORGANIZATION_ID)
  ) {
    retVal = `${CONTEXT_TENANT_ID}:${CONTEXT_TENANT_HASH}:${CONTEXT_ORGANIZATION_ID}`;
  }
  return retVal;
}

module.exports = {
  retrieveEngineIdFromContext,
  retrieveOrganizationFromContext,
  retrieveOrganizationIdFromContext,
  retrieveTenantFromContext,
}
