/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-provider-setup-middlewares-body-parser';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const bodyParser = require('body-parser');

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
  ensureLibConfigurationExists
} from '../configuration';

export const setupMiddlewaresBodyParser = (
  params: {
    app: any,
  },
) => {
  let libConfiguration;
  try {
    ensureLibConfigurationExists();
    libConfiguration = getLibConfiguration();
    if (
      !params?.app
    ) {
      const ERROR_MESSAGE = `Missing require params?.app parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      libConfiguration?.bodyParser
    ) {
      params.app.use(bodyParser.json({
        limit: libConfiguration?.bodyParser?.json?.limit || '50mb'
      }));
      params.app.use(bodyParser.urlencoded({
        limit: libConfiguration?.bodyParser?.urlencoded?.limit || '50mb',
        extended: libConfiguration?.bodyParser?.urlencoded?.extended || true,
        parameterLimit: libConfiguration?.bodyParser?.urlencoded?.parameterLimit || 50000,
      }));
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(MODULE_ID, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
