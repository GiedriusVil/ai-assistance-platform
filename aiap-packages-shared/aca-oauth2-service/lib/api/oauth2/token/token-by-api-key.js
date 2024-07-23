/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-token-token-by-api-key';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getAppDatasource } = require('../../datasource.utils');

const {
  constructOne: constructTokenRefresh,
  encodeOne: encodeTokenRefresh,
  inValidateAll: inValidateAll,
  saveOne: saveTokenRefresh,
} = require('../../oauth2-tokens-refresh');

const {
  constructOneByTokenRefresh: constructTokenAccessByTokenRefresh,
  encodeOne: encodeTokenAccess,
  saveOneToMemory: saveTokenAccessToMemory,
} = require('../../oauth2-tokens-access');

const tokenByApiKey = async (context, params) => {
  let appDatasource;
  let tenant;

  let oauth2TokenRefresh;
  let oauth2TokenRefreshEncoded;
  let oauth2TokenAccess;
  let oauth2TokenAccessEncoded;

  let retVal = {};
  try {
    appDatasource = getAppDatasource();
    if (
      lodash.isEmpty(params?.tenant?.external?.id)
    ) {
      const ERROR_MESSAGE = `Missing required params.tenant.external.id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    tenant = await appDatasource.tenants.findOneByExternalId(
      context,
      {
        externalId: params?.tenant?.external?.id,
      }
    );
    if (
      lodash.isEmpty(tenant)
    ) {
      const ERROR_MESSAGE = `Unable retrieve tenant by tenant external id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isEqual(
        { apiKey: params?.apiKey },
        { apiKey: tenant?.integration?.apiKey },
      )
    ) {
      const ERROR_MESSAGE = `Invalid apiKey or tenant is missing!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(tenant?.integration?.tokenRefresh?.secret)
    ) {
      const ERROR_MESSAGE = `Missing required tenant?.integration?.tokenRefresh?.secret attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(tenant?.integration?.tokenAccess?.secret)
    ) {
      const ERROR_MESSAGE = `Missing required tenant?.integration?.tokenAccess?.secret attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE)
    }
    context.user = {
      id: 'aca-oauth2-service',
      name: 'aca-oauth2-service',
      session: {
        tenant: tenant
      }
    }
    await inValidateAll(context, params);
    oauth2TokenRefresh = constructTokenRefresh(context, {});
    oauth2TokenRefresh = await saveTokenRefresh(context, { token: oauth2TokenRefresh });
    oauth2TokenRefreshEncoded = encodeTokenRefresh(context, { token: oauth2TokenRefresh });
    oauth2TokenAccess = constructTokenAccessByTokenRefresh(context, { tokenRefresh: oauth2TokenRefresh });
    oauth2TokenAccessEncoded = encodeTokenAccess(context, { token: oauth2TokenAccess })

    await saveTokenAccessToMemory(context, { tokenAccess: oauth2TokenAccess });

    const CURRENT_DATE = new Date();
    retVal.tokenRefresh = {
      value: oauth2TokenRefreshEncoded,
      expires: oauth2TokenRefresh.expiryLengthMs - (CURRENT_DATE - oauth2TokenRefresh?.created?.date),
    }
    retVal.tokenAccess = {
      value: oauth2TokenAccessEncoded,
      expires: oauth2TokenAccess.expiryLengthMs - (CURRENT_DATE - oauth2TokenAccess?.created?.date),
    };

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(tokenByApiKey.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  tokenByApiKey,
}
