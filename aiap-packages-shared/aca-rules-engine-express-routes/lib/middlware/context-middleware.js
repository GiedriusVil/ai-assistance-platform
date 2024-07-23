/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-express-routes-midleware-context-midleware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');

const retrieveTenantById = async (context, id) => {
  const DATASOURCE = getDatasourceV1App();

  const RET_VAL = DATASOURCE.tenants.findOneById(context, { id });

  return RET_VAL;
}

const contextMidleware = (request, response, next) => {
  const USER_ID = ramda.pathOr('ANONYMOUS_USER_ID', ['header', 'user', 'id'], request);
  const USER_NAME = ramda.pathOr('ANONYMOUS_USER_NAME', ['header', 'user', 'name'], request);
  const TENANT_ID = ramda.path(['body', 'tenant', 'id'], request);
  const ORGANIZATION_ID = ramda.path(['body', 'client', 'id'], request);
  const USER = {
    id: USER_ID,
    username: USER_NAME,
    session: {
      tenant: { id: TENANT_ID },
      organization: { id: ORGANIZATION_ID },
    }
  };

  retrieveTenantById({ user: USER }, TENANT_ID).then((tenant) => {
    USER.session.tenant = tenant;
    request.user = USER;
    logger.info('->', { USER });
    next();
  }).catch((error) => {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    USER.error = ACA_ERROR;
    request.user = USER;
    logger.error('->', { USER });
    next();
  });
}


module.exports = {
  contextMidleware
}
