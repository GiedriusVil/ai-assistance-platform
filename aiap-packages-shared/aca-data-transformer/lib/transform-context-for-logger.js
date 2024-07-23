/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('ramda');

const { transformDatasourcesForLogger } = require('./transform-datasources-for-logger');


const transformContextForLogger = (context) => {
  const CONTEXT_USER = ramda.path(['user'], context);
  const CONTEXT_USER_ID = ramda.path(['id'], CONTEXT_USER);

  const CONTEXT_USER_SESSION = ramda.path(['session'], CONTEXT_USER);

  const CONTEXT_USER_SESSION_TENANT = ramda.path(['tenant'], CONTEXT_USER_SESSION);
  const CONTEXT_USER_SESSION_TENANT_ID = ramda.path(['id'], CONTEXT_USER_SESSION_TENANT);
  const CONTEXT_USER_SESSION_TENANT_HASH = ramda.path(['hash'], CONTEXT_USER_SESSION_TENANT);

  const CONTEXT_USER_SESSION_TENANT_DATASOURCES = ramda.path(['_datasources'], CONTEXT_USER_SESSION_TENANT);

  const RET_VAL = {
    user: {
      id: CONTEXT_USER_ID,
    },
    tenant: {
      id: CONTEXT_USER_SESSION_TENANT_ID,
      hash: CONTEXT_USER_SESSION_TENANT_HASH,
      datasources: transformDatasourcesForLogger(CONTEXT_USER_SESSION_TENANT_DATASOURCES),
    }
  };
  return RET_VAL;
}

module.exports = {
  transformContextForLogger
}
