/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const retrieveTenantFromContext = (context) => {
    const RET_VAL = ramda.path(['user', 'session', 'tenant'], context);
    return RET_VAL;
}

const retrieveEngineIdFromContext = (context) => {
    const CONTEXT_TENANT = retrieveTenantFromContext(context);
    const CONTEXT_TENANT_ID = ramda.path(['id'], CONTEXT_TENANT);
    const CONTEXT_TENANT_HASH = ramda.path(['hash'], CONTEXT_TENANT);
    let retVal;
    if (
        !lodash.isEmpty(CONTEXT_TENANT_ID)
    ) {
        retVal = `${CONTEXT_TENANT_ID}:${CONTEXT_TENANT_HASH}`;
    }
    return retVal;
}

module.exports = {
    retrieveEngineIdFromContext,
    retrieveTenantFromContext,
}
