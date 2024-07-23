/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-authorization-service-retrieve-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');

const { getTokenService } = require('@ibm-aiap/aiap-token-service');

const retrieveTenantByJwtToken = async (token) => {
  try {
    const TENANTS_CASH_PROVIDER = getTenantsCacheProvider();
    const TOKEN_SERVICE = getTokenService();
    const JWT_TOKEN_DECODED = TOKEN_SERVICE.verify(token);
    const TENANT_ID = JWT_TOKEN_DECODED?.tenant?.id;
    const TENANT_HASH = JWT_TOKEN_DECODED?.tenant?.hash;
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing tenant.id attribute from JWT_TOKEN!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TENANT_HASH)
    ) {
      const MESSAGE = 'Missing tenant.hash attribute from JWT_TOKEN!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = await TENANTS_CASH_PROVIDER.tenants.findOneByIdAndHash({ id: TENANT_ID, hash: TENANT_HASH });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveTenantByJwtToken.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const retrieveTenantByGAcaProps = async (gAcaProps) => {
  try {
    const TENANTS_CASH_PROVIDER = getTenantsCacheProvider();
    const TENANT_ID = gAcaProps?.tenantId;
    const PARAMS = {
      id: TENANT_ID
    }
    const RET_VAL = await TENANTS_CASH_PROVIDER.tenants.reloadOneById(PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveTenantByGAcaProps.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const retrieveTenant = async (params) => {
  const JWT_TOKEN_ENCODED = params?.token;
  const G_ACA_PROPS = params?.gAcaProps;
  let retVal;
  if (
    !lodash.isEmpty(JWT_TOKEN_ENCODED)
  ) {
    retVal = await retrieveTenantByJwtToken(JWT_TOKEN_ENCODED);
  } else {
    retVal = await retrieveTenantByGAcaProps(G_ACA_PROPS);
  }
  return retVal;
}

module.exports = {
  retrieveTenant,
}
