/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  setConfigurationProvider,
} from './lib/configuration';

import {
  engagementsService,
  engagementsChangesService,
  runtimeDataService,
} from './lib/api';

const initByConfigurationProvider = async (
  provider: any
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const ERROR_MESSAGE = `Missing configuration provider! [aca-common-config, aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    setConfigurationProvider(provider);
    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  initByConfigurationProvider,
  engagementsService,
  engagementsChangesService,
  runtimeDataService,
}
