/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-bot-socketio-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const io = require('socket.io');

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import * as socketIoEvents from './events';

import { getLibConfiguration } from '../../configuration';

const setupSocketIoServer = async (
  params: any,
) => {

  let configuration;
  let configurationSocketIoServerOptions;

  try {
    configuration = getLibConfiguration();
    if (
      !configuration?.socketIoServerOptions
    ) {
      const ERROR_MESSAGE = 'Missing required configuration?.socketIoServer attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    configurationSocketIoServerOptions = configuration?.socketIoServerOptions;

    if (
      !params?.adapter
    ) {
      const ERROR_MESSAGE = 'Missing required params?.adapter parameter!!!!!!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }

    params.adapter.ioServer = io(
      params.adapter.server,
      {
        ...configurationSocketIoServerOptions,
        wsEngine: require('ws').Server,
      }
    );
    logger.info(setupSocketIoServer.name, 'SoketIoServer Bot created!');
    params.adapter.ioServer.on('connection', await socketIoEvents.onConnectionCallback(params.adapter));
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setupSocketIoServer.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

};

export {
  setupSocketIoServer,
}
