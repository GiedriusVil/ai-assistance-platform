/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import express from 'express';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  setConfigurationProvider,
} from './lib/configuration';

const initByConfigurationProvider = async (
  provider: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const ERROR_MESSAGE = `Missing required configuration provider!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    setConfigurationProvider(provider);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

import { setupMiddlewareCors } from './lib/setup-middleware-cors';
import { setupMiddlewareSession } from './lib/setup-middleware-session';
import { setupMiddlewareUrlReWrite } from './lib/setup-middleware-url-rewrite';
import { setupMiddlewaresBodyParser } from './lib/setup-middlewares-body-parser';
import { setupMiddlewaresSecurity } from './lib/setup-middlewares-security';

export {
  initByConfigurationProvider,
  express,
  setupMiddlewareCors,
  setupMiddlewareSession,
  setupMiddlewareUrlReWrite,
  setupMiddlewaresBodyParser,
  setupMiddlewaresSecurity,
}
