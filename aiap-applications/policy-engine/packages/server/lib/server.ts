/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-policy-engine-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  resolveIpAddress,
} from '@ibm-aca/aca-utils-metadata';

import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';

const configurationProvider = require('@ibm-aiap/aiap-policy-engine-configuration');

const startServer = async () => {
  const APP = express();
  const CONFIGURATION = configurationProvider.getConfiguration();

  APP.use(bodyParser.json());
  APP.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

  // const swaggerUi = require('swagger-ui-express');
  // const swaggerDocument = require('../../../swagger.json');

  // APP.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  const serverRoutes = require('./api/routes');

  APP.use('/api', serverRoutes.routes);

  const { basicAuthenicationMidleware } = require('@ibm-aiap/aiap-express-midleware-provider');

  await require('@ibm-aca/aca-surgeon-express-routes').initByConfigurationProvider(configurationProvider, APP);
  APP.use(basicAuthenicationMidleware());

  //
  await require('@ibm-aca/aca-doc-validation-service').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-doc-validation-express-routes').initByConfigurationProvider(configurationProvider, APP);

  await require('@ibm-aca/aca-rules-engine-express-routes').initByConfigurationProvider(configurationProvider, APP);

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
