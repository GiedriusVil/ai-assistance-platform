/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-midleware-provider-oauth2-token-access-authentication-midleware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  oauth2TokenAccessService,
} from '@ibm-aca/aca-oauth2-service';

const _oauth2TokenAccessAuthenticationMidleware = async (
  request: any,
  response: any,
) => {
  let tokenAccessEncoded;
  let tokenAccess;
  let params;
  let tenantExternalId;
  let tenant;
  let context;
  try {
    if (
      lodash.isEmpty(request?.headers['x-aiap-token-access'])
    ) {
      const ERROR_MESSAGE = `Missing required request?.headers[x-aiap-token-access] parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(request?.body?.context.tenant?.external?.id)
    ) {
      const ERROR_MESSAGE = `Missing required request?.body?.context.tenant?.external?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    tokenAccessEncoded = request?.headers['x-aiap-token-access'];
    tenantExternalId = request?.body?.context.tenant?.external?.id
    params = { externalId: tenantExternalId };
    const TENANTS_CACHE = getTenantsCacheProvider();
    if (
      lodash.isEmpty(TENANTS_CACHE)
    ) {
      const MESSAGE = `Unable retrieve AcaTenantCacheProvider!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    tenant = await TENANTS_CACHE.tenants.findOneByExternalId(params);
    if (
      lodash.isEmpty(tenant?.id)
    ) {
      const MESSAGE = `Unable retrieve tenant from cache!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    context = {
      user: {
        session: {
          tenant: tenant
        }
      }
    }
    tokenAccess = await oauth2TokenAccessService.decodeAndValidateOne(context, { tokenEncoded: tokenAccessEncoded });
    if (
      lodash.isEmpty(tokenAccess)
    ) {
      const MESSAGE = `Provided Token Access is invalid!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    context.user.id = tokenAccess?.created?.user?.id;
    context.user.name = tokenAccess?.created?.user?.name;
    request.user = context?.user;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_oauth2TokenAccessAuthenticationMidleware.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const oauth2TokenAccessAuthenticationMidleware = (
  request: any,
  response: any,
  next: any,
) => {
  try {
    _oauth2TokenAccessAuthenticationMidleware(request, response)
      .then((response: any) => {
        next();
      }).catch((error) => {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        response.status(500).json({ errors: [ACA_ERROR] });
      });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(oauth2TokenAccessAuthenticationMidleware.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
