/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const retrieveTenantFromContext = (context) => {
  const RET_VAL = context?.user?.session?.tenant;
  return RET_VAL;
}

const retrieveEngineIdFromContext = (context) => {
  const CONTEXT_TENANT = retrieveTenantFromContext(context);
  const CONTEXT_TENANT_ID = CONTEXT_TENANT?.id;
  const CONTEXT_TENANT_HASH = CONTEXT_TENANT?.hash;
  let retVal;
  if (
    !lodash.isEmpty(CONTEXT_TENANT_ID)
  ) {
    retVal = `${CONTEXT_TENANT_ID}:${CONTEXT_TENANT_HASH}:BUY`;
  }
  return retVal;
}

module.exports = {
  retrieveEngineIdFromContext,
  retrieveTenantFromContext,
}
