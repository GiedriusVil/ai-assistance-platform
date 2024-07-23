/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-policy-gateway-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  resolveIpAddress,
} from '@ibm-aca/aca-utils-metadata';

import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';

const configurationProvider = require('@ibm-aiap/aiap-policy-gateway-configuration');



const startServer = async () => {
  const CONFIGURATION = configurationProvider.getConfiguration();
  const APP = express();

  APP.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
  APP.use(bodyParser.json({ limit: '50mb' }));


  await require('@ibm-aca/aca-surgeon-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-oauth2-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-gw-validation-express-routes').initByConfigurationProvider(CONFIGURATION, APP);

  const serverRoutes = require('./api/routes');
  APP.use('/api/v1/server', serverRoutes.routes);

  const SERVER = http.createServer(APP);
  const PORT = CONFIGURATION?.app?.port;
  const IP_ADDRESS = await resolveIpAddress();
  const PROCESS_ID = process?.pid;

  SERVER.listen(PORT, () => {
    logger.info(`[SERVER] application external IP address -> ${IP_ADDRESS}`);
    logger.info(`[SERVER] application port -> ${PORT}`)
    logger.info(`[SERVER] application process id ->  ${PROCESS_ID}`);
  });

}

export {
  startServer,
};

