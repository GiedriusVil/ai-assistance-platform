/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ChatServerV1SessionExpirationNotifierV1,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  setConfigurationProvider,
  getLibConfiguration,
} from './lib/configuration';

import {
  routes,
  ChatServerV1Socketio,
} from './lib';


let chatServer;
let chatServerSessionExpirationNotifier;

const initByConfigurationProvider = async (
  configurationProvider,
  app,
  server,
) => {
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
      const ERROR_MESSAGE = 'Missing required app parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(server)
    ) {
      const ERROR_MESSAGE = 'Missing required server parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    setConfigurationProvider(configurationProvider);
    chatServer = new ChatServerV1Socketio(server);

    const LIB_CONFIGURATION = getLibConfiguration();

    if (
      LIB_CONFIGURATION?.sessionExpirationNotifier
    ) {
      chatServerSessionExpirationNotifier = new ChatServerV1SessionExpirationNotifierV1(LIB_CONFIGURATION?.sessionExpirationNotifier);
      await chatServerSessionExpirationNotifier.init();
    }


    app.use('/api/chat-server/v1', routes);
    logger.info(`[${MODULE_ID}] - INITIALIZED - [${chatServer?.id}]`);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  initByConfigurationProvider,
}
