/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'user-session-provider-controllers-authorization-authorize';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getJwtProviderV1,
} from '@ibm-aiap/aiap-jwt-provider';

import {
  usersService,
  applicationsService,
  tenantsService,
} from '@ibm-aiap/aiap-app-service';

const _sanitizeTenant = (
  tenant: any,
) => {
  if (
    !lodash.isEmpty(tenant)
  ) {
    delete tenant.apiKey;
    delete tenant.dbClients;
  }
}

const _sanitizeRedisClients = (
  tenant: any,
) => {
  const REDIS_CLIENTS = tenant?.redisClients;
  if (
    !lodash.isEmpty(REDIS_CLIENTS)
    && lodash.isArray(REDIS_CLIENTS)
  ) {
    const SANITIZED_CLIENTS = [];
    REDIS_CLIENTS.forEach((client) => {
      const SANITIZED_CLIENT = {
        type: client?.type,
        name: client?.name,
        id: client?.id,
        hash: client?.hash,
      };
      SANITIZED_CLIENTS.push(SANITIZED_CLIENT);
    })
    delete tenant.redisClients;
    tenant.redisClients = SANITIZED_CLIENTS;
  }
}

const CONTEXT = {
  user: {
    id: 'system'
  }
};

const getSelectedApp = (
  apps: Array<any>,
  theApp: any,
) => {
  let retVal;
  if (
    !lodash.isEmpty(apps) &&
    !lodash.isEmpty(theApp)
  ) {
    for (const APP of apps) {
      if (
        APP.id === theApp.id
      ) {
        retVal = APP;
        break;
      }
    }
  }
  return retVal;
}

export const authorize = async (
  request: any,
  response: any,
) => {
  const ERRORS = [];

  const USER = request?.user;
  const SESSION = request?.user?.session;
  const TENANT_ID = request?.body?.tenant?.id;

  let tenant;
  let app;
  let result;
  try {
    if (
      lodash.isEmpty(USER)
    ) {
      const MESSAGE = 'Missing required request.user parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(SESSION)
    ) {
      const MESSAGE = 'Missing required request.user.session parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing required request.body.tenant.id parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);
    }
    tenant = await tenantsService.findOneById(CONTEXT, {
      id: TENANT_ID
    });

    _sanitizeRedisClients(tenant);
    _sanitizeTenant(tenant);

    app = request?.body?.application;

    const APPS = await applicationsService.findManyByTenantId(
      CONTEXT,
      {
        tenantId: tenant?.id,
      }
    );

    if (
      !lodash.isEmpty(APPS)
    ) {
      app = getSelectedApp(APPS, app);
      if (app != null) {
        USER.session.application = app;
        USER.lastSession.application = app;
      } else {
        delete USER.session.application;
        delete USER.lastSession.application;
      }
      tenant.applications = APPS;
    }

    USER.session.tenant = tenant;
    USER.lastSession = {
      tenant: {
        id: tenant?.id,
        hash: tenant?.hash,
        applications: tenant.applications
      },
      application: app
    }

    const PARAMS = {
      value: USER
    };
    await usersService.updateOneLastSession(CONTEXT, PARAMS);
    const JWT_RESULT = getJwtProviderV1().token.generateWithUserData(PARAMS);
    const UPDATE_TOKEN_PARAMS = {
      token: JWT_RESULT.token,
      ...PARAMS,
    };
    await usersService.updateOneToken(CONTEXT, UPDATE_TOKEN_PARAMS);

    result = {
      token: JWT_RESULT.token,
      expiresAt: JWT_RESULT.expirationDateISOString,
      username: USER.username,
      timezone: USER.timezone,
      role: USER.role,
      session: USER.session,
    };

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ACA_ERROR.type = ACA_ERROR_TYPE.AUTHORIZATION_ERROR;
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    return response.json(result);
  } else {
    logger.error('->', {
      ERRORS
    });
    return response.status(401).json(ERRORS);
  }
}
