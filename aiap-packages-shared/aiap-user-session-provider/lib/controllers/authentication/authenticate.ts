/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'user-session-provider-controllers-authentication-authenticate';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextUserV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1UpdateUserLastSession,
} from '@ibm-aiap/aiap--types-domain-app';

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
} from '@ibm-aiap/aiap-app-service';

export const authenticate = async (
  request: any,
  response: any,
) => {
  const ERRORS = [];

  const {
    found,
    user,
    error,
  } = request.user;

  let result;
  try {
    if (
      !lodash.isEmpty(error)
    ) {
      const ERROR_MESSAGE = 'Unexpected exception happened during authentication!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { error });
    }
    if (
      !found
    ) {
      return response.status(401).json({});
    }
    const CONTEXT = {
      user: {
        id: 'system',
      }
    }

    const PARAMS_UPDATE_ONE_LAST_LOGIN_TIME = {
      value: user,
    };

    await usersService.updateOneLastLoginTime(CONTEXT, PARAMS_UPDATE_ONE_LAST_LOGIN_TIME);

    const PARAMS_UPDATE_ONE_LAST_SESSION: IParamsV1UpdateUserLastSession = {
      value: user as IContextUserV1,
    }
    await usersService.updateOneLastSession(CONTEXT, PARAMS_UPDATE_ONE_LAST_SESSION);

    const JWT_RESULT = getJwtProviderV1().token.generateWithUserData({ value: user });

    const PARAMS_UPDATE_ONE_TOKEN = {
      token: JWT_RESULT.token,
      value: user,
    };

    await usersService.updateOneToken(CONTEXT, PARAMS_UPDATE_ONE_TOKEN);


    const TENANT_ID = user?.session?.tenant?.id;
    if (
      !lodash.isEmpty(TENANT_ID)
    ) {
      const APPS = await applicationsService.findManyByTenantId(
        CONTEXT,
        {
          tenantId: TENANT_ID
        }
      );

      user.session.tenant.applications = APPS;
    }

    result = {
      token: JWT_RESULT.token,
      expiresAt: JWT_RESULT.expirationDateISOString,
      username: user.username,
      timezone: user.timezone,
      session: user.session,
    };
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push({ ACA_ERROR });
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    logger.info(`AUTHENTICATION_SUCCESS`, {
      id: user.id,
      username: user.username
    });
    return response.json(result);
  } else {
    logger.error(authenticate.name, { ERRORS });
    return response.status(401).json(ERRORS);
  }
}
