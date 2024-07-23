/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-tenant-customizer-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  resolveIpAddress,
} from '@ibm-aca/aca-utils-metadata';

import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import secure from 'express-secure-only';
import compression from 'compression';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import path from 'path';
import cors from 'cors';

import configurationProvider from '@ibm-aiap/aiap-tenant-customizer-configuration';

const CLIENT_DIST_PATH = '../../../../client/dist';

const startServer = async () => {
  const APP = express();
  const CONFIGURATION = configurationProvider.getConfiguration();

  APP.enable('strict routing');
  APP.enable('trust proxy');

  if (
    process.env.NODE_ENV === 'production'
  ) {
    APP.use(secure());
  }

  APP.use(cors());
  APP.use(helmet({ frameguard: false }));
  APP.use(compression());
  APP.use(
    rateLimit({
      windowMs: 60000, // How long in milliseconds to keep records of requests in memory.
      max: 0, // Max number of connections during windowMs milliseconds before sending a 429 response. Set to 0 to disable.
    })
  );

  APP.use(bodyParser.json({ limit: '50mb' }));
  APP.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

  const serverRoutes = require('./api/routes');

  APP.get(
    '/api/v1/config',
    (req, res) => {
      return res.status(200).json(CONFIGURATION);
    }
  );

  APP.use(express.static(path.join(__dirname, `${CLIENT_DIST_PATH}/client`)));

  await require('@ibm-aca/aca-jobs-queue-board-provider').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-express-session-provider').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-passport-provider').initByConfigurationProvider(configurationProvider, APP);

  APP.use('/api/v1/server', serverRoutes.routes);

  // TO_DO inlude usage of authorization midleware

  await require('@ibm-aca/aca-classification-catalog-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-surgeon-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-ai-services-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-answers-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-lambda-modules-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-engagements-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-app-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-jobs-queues-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-classifier-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-data-masking-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-ai-translation-services-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-ai-search-and-analysis-services-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-conversations-express-router').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-analytics-live-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-auditor-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-audio-voice-services-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-object-storage-express-routes').initByConfigurationProvider(configurationProvider, APP);

  APP.use('/docs', swaggerUi.serve, swaggerUi.setup(require('./docs/swagger')));

  await require('@ibm-aiap/aiap-user-session-provider').initByConfigurationProvider(configurationProvider, APP);

  APP.use('/client-wbc', express.static(path.join(__dirname, '../../../../client-wbc/dist')));

  APP.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, `${CLIENT_DIST_PATH}/client/index.html`));
  });

  const SERVER = http.createServer(APP);
  const PORT = CONFIGURATION?.app?.port;
  const IP_ADDRESS = await resolveIpAddress();
  const PROCESS_ID = process?.pid;

  SERVER.listen(PORT, () => {
    logger.info(`[SERVER] application external IP address -> ${IP_ADDRESS}`);
    logger.info(`[SERVER] application port -> ${PORT}`)
    logger.info(`[SERVER] application process id ->  ${PROCESS_ID}`);
  });

  const RET_VAL = {
    app: APP,
    server: SERVER,
  }
  return RET_VAL;
};

export {
  startServer,
};
