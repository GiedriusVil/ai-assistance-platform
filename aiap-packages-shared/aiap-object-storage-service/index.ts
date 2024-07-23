/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-object-storage-service-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  setConfigurationProvider,
} from './lib/configuration';

import {
  bucketsChangesService,
  bucketsService,
  filesChangesService,
  filesService,
} from './lib/api';

const initByConfigurationProvider = async (
  provider: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = `Missing required  configuration provider! [aca-common-config || aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    logger.info('INITIALIZED');
    setConfigurationProvider(provider);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  initByConfigurationProvider,
  bucketsChangesService,
  bucketsService,
  filesChangesService,
  filesService,
}
