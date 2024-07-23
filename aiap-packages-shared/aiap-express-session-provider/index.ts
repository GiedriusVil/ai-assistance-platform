/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-session-provider';
const logger = require('@ibm-aca/aca-common-logger')('MODULE_ID');

const { v4: uuidv4 } = require('uuid');
const expressSession = require('express-session')

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

const SESSION_KEY = 'JSESSIONID';

export const initByConfigurationProvider = async (
  provider: any,
  app: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const ERROR_MESSAGE = 'Missing configuration provider!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const ERROR_MESSAGE = 'Missing express application!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    const OPTIONS: any = {};

    OPTIONS.key = SESSION_KEY;
    OPTIONS.secret = uuidv4();
    OPTIONS.resave = false;
    OPTIONS.saveUninitialized = true;

    app.use(expressSession(OPTIONS));

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
