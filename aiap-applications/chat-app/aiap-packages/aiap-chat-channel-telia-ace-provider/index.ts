/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ROUTES,
} from './lib/routes';

import {
  setConfigurationProvider,
} from './lib/configuration';

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const ERROR_MESSAGE = 'Missing required configuration provider parameter! [aca-lite-config]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing required app parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);

    app.use('/api/v1/telia-ace-server', ROUTES);

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

import {
  ChatChannelV1TeliaAce,
} from './lib/channel';

export {
  initByConfigurationProvider,
  ChatChannelV1TeliaAce,
}
