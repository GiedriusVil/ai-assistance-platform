/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-bot-socketio-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

// const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  getLibConfiguration,
  setConfigurationProvider,
} from './lib/configuration';

import {
  BotSocketIo,
  setupBotSocketIoAuth,
} from './lib/bot-socketio';

const attachBot2Botmaster = async (
  params: any,
) => {
  let configuration;
  try {
    configuration = getLibConfiguration();
    if (
      !params?.botmaster
    ) {
      const ERROR_MESSAGE = 'Missing required params?.botmaster parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !params?.sessionStorage
    ) {
      const ERROR_MESSAGE = 'Missing required params?.sessionStorage parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      configuration &&
      configuration?.settings &&
      configuration?.settings?.requireRole
    ) {
      const socketioBot = new BotSocketIo(
        {
          settings: configuration?.settings,
          sessionStorage: params?.sessionStorage,
          server: params?.server,
        }
      );
      params.botmaster.addBot(socketioBot);
    } else {
      logger.info(attachBot2Botmaster.name, 'Skipping bot initialisation, cause of missing configuration!');
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(attachBot2Botmaster.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initByConfigurationProvider = async (
  provider: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = `Missing required configuration provider! [aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  initByConfigurationProvider,
  attachBot2Botmaster,
  setupBotSocketIoAuth,
}
