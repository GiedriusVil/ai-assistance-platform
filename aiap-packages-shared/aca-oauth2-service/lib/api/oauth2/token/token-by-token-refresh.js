/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-token-token-by-token-refresh';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { jwt } = require('@ibm-aca/aca-wrapper-jsonwebtoken');

const {
  getAppDatasource,
} = require('../../datasource.utils');

const {
  calculateTokenExpiryLengthMS,
} = require('../../../utils');

const {
  constructOne: constructTokenRefresh,
  encodeOne: encodeTokenRefresh,
  findOneById: findTokenRefreshById,
  saveOne: saveTokenRefresh,
} = require('../../oauth2-tokens-refresh');

const {
  constructOneByTokenRefresh: constructTokenAccessByTokenRefresh,
  encodeOne: encodeTokenAccess,
  saveOneToMemory: saveTokenAccessToMemory,
} = require('../../oauth2-tokens-access');

const tokenByTokenRefresh = async (context, params) => {
  let appDatasource;
  let tenant;

  let oauth2TokenRefresh;
  let oauth2TokenRefreshEncoded;
  let oauth2TokenAccess;
  let oauth2TokenAccessEncoded;

  let retVal = {};
  try {
    if (
      lodash.isEmpty(params?.tenant?.external?.id)
    ) {
      const ERROR_MESSAGE = `Missing required params.tenant.external.id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.tokenRefresh)
    ) {
      const ERROR_MESSAGE = `Missing required params.tokenRefresh!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    appDatasource = getAppDatasource();
    tenant = await appDatasource.tenants.findOneByExternalId(
      context,
      {
        externalId: params?.tenant?.external?.id,
      }
    );
    context.user = {
      session: {
        tenant: tenant,
      }
    }
    if (
      lodash.isEmpty(tenant)
    ) {
      const ERROR_MESSAGE = `Unable retrieve tenant by tenant external id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    oauth2TokenRefreshEncoded = params?.tokenRefresh;
    oauth2TokenRefresh = jwt.verify(oauth2TokenRefreshEncoded, tenant?.integration?.tokenRefresh?.secret)
    oauth2TokenRefresh = await findTokenRefreshById(context, { id: oauth2TokenRefresh?.id });
    if (
      !lodash.isEqual(
        {
          tenantId: tenant?.id,
          tenantExternalId: tenant?.external?.id,
        },
        {
          tenantId: oauth2TokenRefresh?.tenant?.id,
          tenantExternalId: params?.tenant?.external?.id
        }
      )
    ) {
      const ERROR_MESSAGE = `Invalid tokenRefresh!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, ERROR_MESSAGE);
    }
    const TOKEN_REFRESH_VALID_LENGTH_MS = calculateTokenExpiryLengthMS(context, { token: oauth2TokenRefresh });
    if (
      TOKEN_REFRESH_VALID_LENGTH_MS <= 0
    ) {
      oauth2TokenRefresh = constructTokenRefresh(context, {});
      oauth2TokenRefresh = await saveTokenRefresh(context, { token: oauth2TokenRefresh });
      oauth2TokenRefreshEncoded = encodeTokenRefresh(context, { token: oauth2TokenRefresh });
    }

    oauth2TokenAccess = constructTokenAccessByTokenRefresh(context, { tokenRefresh: oauth2TokenRefresh });
    oauth2TokenAccessEncoded = encodeTokenAccess(context, { token: oauth2TokenAccess });
    await saveTokenAccessToMemory(context, { tokenAccess: oauth2TokenAccess });

    retVal.tokenRefresh = {
      value: oauth2TokenRefreshEncoded,
      expires: calculateTokenExpiryLengthMS(context, { token: oauth2TokenRefresh }),
    }
    retVal.tokenAccess = {
      value: oauth2TokenAccessEncoded,
      expires: calculateTokenExpiryLengthMS(context, { token: oauth2TokenAccess }),
    };

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(tokenByTokenRefresh.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  tokenByTokenRefresh,
}
