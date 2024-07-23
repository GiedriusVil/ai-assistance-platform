/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'jwt-provider-jsonwebtoken-token-construct-with-user-data';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

export const generateWithUserData = (
  jwt: any,
  config: any,
  params: {
    value: any,
  },
) => {
  try {
    const USER = params?.value;
    if (
      lodash.isEmpty(USER)
    ) {
      const ERROR_MESSAGE = `Missing params.value required parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    const DATE_NOW_T = Date.now();
    const EXPIRATION_T = Math.floor(DATE_NOW_T / 1000) + parseInt(config.expiration);

    const LAST_SESSION = USER?.lastSession;
    const LAST_SESSION_TENANT = LAST_SESSION?.tenant;
    const LAST_SESSION_TENANT_ID = LAST_SESSION_TENANT?.id;
    const LAST_SESSION_TENANT_HASH = LAST_SESSION_TENANT?.hash;

    const LAST_SESSION_APPLICATION = LAST_SESSION?.application;
    const LAST_SESSION_APPLICATION_ID = LAST_SESSION_APPLICATION?.id;

    const JWT_PAYLOAD: any = {};

    JWT_PAYLOAD.id = USER.id;
    JWT_PAYLOAD.username = USER.username;
    JWT_PAYLOAD.exp = EXPIRATION_T;
    JWT_PAYLOAD.type = USER.type;
    JWT_PAYLOAD.timezone = USER.timezone;
    JWT_PAYLOAD.accessGroupIds = USER.accessGroupIds;
    JWT_PAYLOAD.tenants = USER.tenants;
    JWT_PAYLOAD.passwordLastSet = USER.passwordLastSet;

    JWT_PAYLOAD.lastSession = {
      tenant: {
        id: LAST_SESSION_TENANT_ID,
        hash: LAST_SESSION_TENANT_HASH,
      },
      application: {
        id: LAST_SESSION_APPLICATION_ID,
      }
    }

    const TOKEN = jwt.sign(JWT_PAYLOAD, config.secret);

    const RET_VAL = {
      token: TOKEN,
      expirationT: EXPIRATION_T,
      expirationDateISOString: new Date(EXPIRATION_T * 1000).toISOString(),
    };
    logger.info(generateWithUserData.name, {
      jwtTokenSize: Buffer.byteLength(RET_VAL.token, 'utf-8'),
      dateNowT: DATE_NOW_T,
      dateNow: new Date(DATE_NOW_T).toISOString(),
      expirationT: RET_VAL.expirationT * 1000,
      expirationDateISOString: RET_VAL.expirationDateISOString
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(generateWithUserData.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
