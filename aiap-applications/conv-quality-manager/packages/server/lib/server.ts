/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conv-quality-manager-server-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  resolveIpAddress,
} from '@ibm-aca/aca-utils-metadata';

import express from 'express';
import secure from 'express-secure-only';
import compression from 'compression';
import bodyParser from 'body-parser';
import http from 'http';
import path from 'path';
import cors from 'cors';

const configurationProvider = require('@ibm-aiap/aiap-conv-quality-manager-configuration');

const DIST_PATH_CLIENT = '../../../../client/dist';

const startServer = async () => {
  const APP = express();
  const CONFIGURATION = configurationProvider.getConfiguration();

  APP.enable('strict routing');
  APP.enable('trust proxy');

  if (
    process.env.NODE_ENV === 'production'
  ) {
    APP.use(secure());
    APP.use(compression());
  }



  APP.use(cors());
  APP.use(bodyParser.json({ limit: '50mb' }));
  APP.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

  APP.use(express.static(path.join(__dirname, `${DIST_PATH_CLIENT}/client`)));

  await require('@ibm-aiap/aiap-express-session-provider').initByConfigurationProvider(configurationProvider, APP);
  require('@ibm-aiap/aiap-passport-provider').initByConfigurationProvider(configurationProvider, APP);

  const serverRoutes = require('./api/routes');
  APP.use(
    '/api/v1/server',
    serverRoutes.routes,
  );

  // const swaggerUi = require('swagger-ui-express');
  // const swaggerDocument = require('../../../swagger.json');

  await require('@ibm-aca/aca-test-cases-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-coach-express-routes').initByConfigurationProvider(configurationProvider, APP);

  APP.get(
    '/api/v1/config',
    (req, res) => {
      return res.status(200).json(CONFIGURATION);
    }
  );

  // APP.use(
  //   '/api-docs',
  //   swaggerUi.serve,
  //   swaggerUi.setup(swaggerDocument)
  // );

  APP.use(
    '/',
    (req, res) => {
      res.sendFile(path.join(__dirname, `${DIST_PATH_CLIENT}/client/index.html`));
    }
  );

  const SERVER = http.createServer(APP);

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
