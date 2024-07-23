/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
/* eslint no-console: "off" */
const MODULE_ID = `aiap-chat-app-server`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const SESSION_KEY = 'JSESSIONID';

import rateLimit from 'express-rate-limit';
import compression from 'compression';
import bodyParser from 'body-parser';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import http from 'http';
import cors from 'cors';
import path from 'node:path';
import {
  getInstance
} from './common/token/tokenService';

import * as configurationProvider from '@ibm-aiap/aiap-chat-app-configuration';


import {
  setupSecurity
} from './common/security';

import {
  resolveIpAddress,
} from '@ibm-aca/aca-utils-metadata';

const startServer = async () => {
  const APP = express();
  const CONFIGURATION = configurationProvider.getConfiguration();

  APP.enable('strict routing');
  APP.enable('trust proxy');

  getInstance(CONFIGURATION?.app);

  const { contextRouter } = require('./routes');

  setupSecurity(CONFIGURATION, APP);

  APP.use(cors(
    {
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
    }
  ));

  APP.use(helmet(
    {
      frameguard: false,
    }
  ));
  APP.use(compression());
  APP.use(
    rateLimit({
      windowMs: 60000, // How long in milliseconds to keep records of requests in memory.
      max: 0, // Max number of connections during windowMs milliseconds before sending a 429 response. Set to 0 to disable.
    })
  );

  await require('@ibm-aiap/aiap-express-session-provider').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-passport-provider').initByConfigurationProvider(configurationProvider, APP);

  await require('@ibm-aiap/aiap-chat-server-provider-slack').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-chat-server-provider-rest-api').initByConfigurationProvider(configurationProvider, APP);

  APP.use(bodyParser.json(
    {
      limit: '50mb',
    }
  ));

  APP.use(bodyParser.urlencoded(
    {
      extended: false,
      limit: '50mb',
    }
  ));

  const SESSION_OPTS = {
    key: SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    secret: 'SOME_SECRET',
  };

  APP.use(expressSession(SESSION_OPTS));

  const SERVER = http.createServer(APP);

  await require('@ibm-aiap/aiap-chat-channel-telia-ace-provider').initByConfigurationProvider(configurationProvider, APP);

  // await require('@ibm-aca/aca-jobs-queue-board-provider').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-surgeon-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-lambda-modules-express-routes').initByConfigurationProvider(configurationProvider, APP);

  await require('@ibm-aiap/aiap-chat-server-provider-socketio').initByConfigurationProvider(configurationProvider, APP, SERVER);

  await require('@ibm-aca/aca-chat-app-demo-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-chat-app-full-screen-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-suggestions-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-ibm-box-connector-express-routes').initByConfigurationProvider(configurationProvider, APP);

  APP.set('views', path.join(__dirname, '../../../../hbs-views'));
  APP.set('view engine', 'hbs');
  APP.use('/', contextRouter);

  const PORT = CONFIGURATION?.app?.port;
  const IP_ADDRESS = await resolveIpAddress();
  const PROCESS_ID = process?.pid;

  SERVER.listen(PORT, () => {
    logger.info(`[SERVER] application external IP address -> ${IP_ADDRESS}`);
    logger.info(`[SERVER] application port -> ${PORT}`)
    logger.info(`[SERVER] application process id ->  ${PROCESS_ID}`);
  });

};

export {
  startServer,
};
