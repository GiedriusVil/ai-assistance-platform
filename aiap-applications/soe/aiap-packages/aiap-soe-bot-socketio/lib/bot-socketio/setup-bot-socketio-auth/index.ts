/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-soe-bot-socketio-bot-socketio-setup-bot-socketio-auth`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const socketioAuth = require('socketio-auth');

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  execHttpGetRequest,
} from '@ibm-aca/aca-wrapper-http';

const _executeAuthentication = async (
  configuration,
  data,
) => {
  let context;
  let params;
  let response;
  try {
    context = {};
    params = {
      headers: {
        Authorization: `Bearer ${data}`,
      },
      url: `${configuration?.authProvider?.host}/session`,
    };
    response = await execHttpGetRequest(context, params);
    if (
      !response?.body?.roles
    ) {
      const ERROR_MESSAGE = `Unable to authenticate`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHENTICATION_ERROR, ERROR_MESSAGE, { response });
    } else if (
      response?.body?.roles.indexOf(configuration?.requireRole) < 0
    ) {
      const ERROR_MESSAGE = `Missing required role! Reach administrators!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, ERROR_MESSAGE, { response });
    }
    return response?.body;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_executeAuthentication.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const makeAuthenticateWare = (
  configuration: any
) => (
  socket: any,
  data: any,
  cb: any,
) => {
    try {
      _executeAuthentication(configuration, data)
        .then((result) => {
          logger.info(makeAuthenticateWare.name, { result });
          cb(null, true);
        })
        .catch((error) => {
          logger.error(makeAuthenticateWare.name, { error });
          cb(null, false);
        });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(makeAuthenticateWare.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  };

const setupBotSocketIoAuth = (
  configuration: any,
  io: any,
) => {
  try {
    const authenticate = makeAuthenticateWare(configuration);
    socketioAuth(io, { authenticate });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setupBotSocketIoAuth.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  setupBotSocketIoAuth,
}
