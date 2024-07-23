/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-midleware-provider-formidable-middleware-wrapper';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const formidableMiddleware = require('express-formidable');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
} from '../../lib/configuration';

const _handleErrorEvent = (
  request: any,
  response: any,
  next: any,
  error: any,
) => {
  const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
  response.status(500).json({ error: ACA_ERROR });
}

export const formidableMiddlewareWrapper = (
  options: {
    maxFileSize?: any,
  } = {},
) => {
  try {
    const LIB_CONFIGURATION = getLibConfiguration();

    const CONFIGURED_OPTIONS = LIB_CONFIGURATION?.formidableWare?.options;

    const CONFIG_MAX_FILE_SIZE = CONFIGURED_OPTIONS?.maxFileSize;

    const OPTIONS_MAX_FILE_SIZE = options?.maxFileSize;

    if (
      !OPTIONS_MAX_FILE_SIZE
    ) {
      options.maxFileSize = (CONFIG_MAX_FILE_SIZE * 1024 * 1024);
    }

    const RET_VAL = formidableMiddleware(
      options,
      [
        {
          event: 'error',
          action: _handleErrorEvent,
        }
      ],
    );
    logger.info('Initialized with options: ', options);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(formidableMiddlewareWrapper.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
