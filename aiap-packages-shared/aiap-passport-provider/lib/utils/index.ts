/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const retrieveUserFromJwtPayload = (
  payload: {
    id: any,
    username: any,
    timezone: any,
    accessGroupIds: Array<any>,
    tenants: Array<any>,
    lastSession: any,
  },
) => {
  let retVal;
  if (
    !lodash.isEmpty(payload)
  ) {
    retVal = {
      id: payload.id,
      username: payload.username,
      timezone: payload.timezone,
      accessGroupIds: payload.accessGroupIds,
      tenants: payload.tenants,
      lastSession: payload.lastSession,
    };
  }
  return retVal;
}

const isTokenValid = (
  token: {
    exp: number,
  },
) => {
  const CURRENT_DATE = new Date();
  const TOKEN_EXPIRATION = new Date(token?.exp * 1000);

  const RET_VAL = TOKEN_EXPIRATION > CURRENT_DATE;
  return RET_VAL;
}

export {
  retrieveUserFromJwtPayload,
  isTokenValid,
} 
