/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-express-midleware-overide-session-tenant-by-headers-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { tenantsService } = require('@ibm-aiap/aiap-app-service');

const overideSessionTenantByHeadersWare = (request, response, next) => {
  const TENANT_ID_FROM_HEADER = ramda.path(['headers', 'x-aca-tenant-id'], request);
  const REQUEST_SESSION = ramda.path(['user', 'session'], request);
  if (
    !lodash.isEmpty(TENANT_ID_FROM_HEADER) &&
    !lodash.isEmpty(REQUEST_SESSION)
  ) {
    tenantsService.findOneById({}, { id: TENANT_ID_FROM_HEADER })
      .then((response) => {
        if (
          !lodash.isEmpty(response)
        ) {
          logger.info('Tenant overide event: ', { previous: REQUEST_SESSION.tenant, next: response });
          REQUEST_SESSION.tenant = response;
        }
        next();
      }).catch((error) => {
        next(error);
      });
  } else {
    next();
  }
};

module.exports = {
  overideSessionTenantByHeadersWare,
}
