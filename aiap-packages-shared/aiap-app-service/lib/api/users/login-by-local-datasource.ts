/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-login-by-local-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const bcryptjs = require('bcryptjs');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextUserV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IUserV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  fromBase64ToString,
} from '@ibm-aca/aca-utils-codec';

import {
  transformUserForLogger,
} from '@ibm-aca/aca-data-transformer';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  getLibConfiguration,
} from '../../configuration';

import {
  authorizeUser,
} from './authorize-user';

const ENUM_USER_STATUSES = {
  ACTIVE: [
    'ACTIVE',
  ],
  IN_ACTIVE: [
    'IN_ACTIVE',
    'IN_ACTIVE_FAILED_ATTEMPTS',
  ]
}

const isValidPassword = (
  user,
  password
) => {
  const DECODED_PASSWORD = fromBase64ToString({ input: password });

  return bcryptjs.compareSync(DECODED_PASSWORD, user.password);
}

const captureDeniedLoginAttempt = (
  user: IUserV1,
) => {
  const LIB_CONFIG = getLibConfiguration();

  const DENIED_LOGINS_ALLOWED = LIB_CONFIG?.userLoginFailiureLimit;
  const DENIED_LOGIN_ATTEMPT_COUNT = user?.deniedLoginAttempts;

  user.deniedLoginAttempts = DENIED_LOGIN_ATTEMPT_COUNT + 1;
  user.lastLoginDenial = new Date().getTime();

  const DATASOURCE = getDatasourceV1App();
  if (
    DENIED_LOGIN_ATTEMPT_COUNT > DENIED_LOGINS_ALLOWED
  ) {
    user.userStatus = ENUM_USER_STATUSES?.IN_ACTIVE?.[1]
  }

  DATASOURCE.users.saveOne({}, { value: user });
}

const dismissDeniedLoginAttempts = (
  user: IUserV1,
) => {
  user.deniedLoginAttempts = 0;
  user.userStatus = ENUM_USER_STATUSES?.ACTIVE;
  const DATASOURCE = getDatasourceV1App();
  DATASOURCE.users.saveOne({}, { value: user });
}

const loginForbiddenForUser = (
  user
) => {
  const LIB_CONFIG = getLibConfiguration();
  const MAX_ATTEMPTS_ALLOWED = LIB_CONFIG?.userLoginFailiureLimit;
  const CURRENT_ATTEMPT_COUNT = user?.deniedLoginAttempts;
  const RET_VAL = CURRENT_ATTEMPT_COUNT > MAX_ATTEMPTS_ALLOWED || ENUM_USER_STATUSES.IN_ACTIVE.includes(user.userStatus);
  return RET_VAL;
}

export const loginByLocalDatasource = async (
  context: IContextV1,
  params: {
    username: any,
    password: any,
  },
) => {
  const RET_VAL: {
    status?: string,
    user?: IContextUserV1,
  } = {};
  try {
    const DATASOURCE = getDatasourceV1App();
    if (
      lodash.isEmpty(DATASOURCE)
    ) {
      const ERROR_MESSAGE = 'Unable to retrieve datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.username)
    ) {
      const ERROR_MESSAGE = 'Missing params?.username required parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const USERNAME = params?.username;

    if (
      lodash.isEmpty(params?.password)
    ) {
      const ERROR_MESSAGE = 'Missing params?.password required parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const PASSWORD = params?.password;
    const PARAMS = {
      username: USERNAME,
    }
    const USER = await DATASOURCE.users.findOneByUsername(context, PARAMS);
    if (
      lodash.isEmpty(USER)
    ) {
      const ACA_ERROR = {
        type: ACA_ERROR_TYPE.AUTHENTICATION_ERROR,
        message: `[${MODULE_ID}] USER_NOT_FOUND!`
      };
      logger.error('->', { ACA_ERROR });
      RET_VAL.status = 'USER_NOT_AUTHENTICATED';
      return RET_VAL;
    }

    if (
      !isValidPassword(USER, PASSWORD)
    ) {
      captureDeniedLoginAttempt(USER);
      const ACA_ERROR = {
        type: ACA_ERROR_TYPE.AUTHENTICATION_ERROR,
        message: `[${MODULE_ID}] INVALID_PASSWORD!`
      };
      logger.error('->', { ACA_ERROR });
      RET_VAL.status = 'USER_NOT_AUTHENTICATED';
      return RET_VAL;
    }

    if (
      loginForbiddenForUser(USER)
    ) {
      captureDeniedLoginAttempt(USER);
      const ACA_ERROR = {
        type: ACA_ERROR_TYPE.AUTHENTICATION_ERROR,
        message: `[${MODULE_ID}] USER_IS_LOCKED!`
      };
      logger.error('->', { ACA_ERROR });

      RET_VAL.status = 'USER_LOCKED';
      return RET_VAL;
    }
    const AUTHORIZE_USER_PARAMS = {
      user: lodash.cloneDeep(USER),
      isLogin: true,
    }
    dismissDeniedLoginAttempts(USER);

    RET_VAL.user = await authorizeUser(AUTHORIZE_USER_PARAMS);
    RET_VAL.status = 'AUTHENTICATION_SUCCESS';

    logger.info('AUTHENICATION_SUCCESS', { user: transformUserForLogger(RET_VAL.user) });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { username: params?.username })
    logger.error(loginByLocalDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
