/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-midleware-provider-basic-authencitation-midleware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const expressBasicAuth = require('express-basic-auth');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
} from '../configuration';

export const basicAuthenicationMidleware = () => {
  try {
    const LIB_CONFIGURATION = getLibConfiguration();
    const CONFIGURED_USERS = LIB_CONFIGURATION?.basicAuthenticationWare?.users;
    const USERS = {};
    if (
      !lodash.isEmpty(CONFIGURED_USERS) &&
      lodash.isArray(CONFIGURED_USERS)
    ) {
      for (const USER of CONFIGURED_USERS) {
        if (
          !lodash.isEmpty(USER) &&
          !lodash.isEmpty(USER.username) &&
          !lodash.isEmpty(USER.password)
        ) {
          USERS[USER.username] = USER.password;
        }
      }
    }
    const BASIC_AUTH_OPTIONS = {
      users: USERS,
      unauthorizedResponse: 'USERNAME/PASSWORD are not recognized!'
    }
    const RET_VAL = expressBasicAuth(BASIC_AUTH_OPTIONS);
    logger.info('Initialized with users -> ', { users: CONFIGURED_USERS.map(item => item.username) });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(basicAuthenicationMidleware.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
