/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-policy-manager-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  resolveIpAddress,
  getAcaAppBuildTimestamp,
} from '@ibm-aca/aca-utils-metadata';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import secure from 'express-secure-only';
import compression from 'compression';
import bodyParser from 'body-parser';

import helmet from 'helmet';
import http from 'http';
import path from 'path';
import cors from 'cors';

const configurationProvider = require('@ibm-aiap/aiap-policy-manager-configuration');

const DIST_PATH_CLIENT = '../../../../client/dist';
const DIST_PATH_CLIENT_WBC = '../../../../client-wbc/dist';

const startServer = async () => {
  const CONFIGURATION = configurationProvider.getConfiguration();
  const APP = express();

  APP.enable('strict routing');
  APP.enable('trust proxy');

  if (
    process.env.NODE_ENV === 'production'
  ) {
    APP.use(secure());
  }

  APP.use(cors({ origin: true }));
  APP.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: {
      action: 'deny'
    },
    xssFilter: false,
  }));

  APP.use('*', function (_req, res, next) {
    res.setHeader('X-XSS-Protection', '1');
    next();
  });
  APP.use(compression());
  APP.use(
    rateLimit({
      windowMs: 60000, // How long in milliseconds to keep records of requests in memory.
      max: 0, // Max number of connections during windowMs milliseconds before sending a 429 response. Set to 0 to disable.
    })
  );
  APP.use(bodyParser.json({ limit: '50mb' }));
  APP.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

  APP.use(express.static(path.join(__dirname, `${DIST_PATH_CLIENT}/client`)));

  await require('@ibm-aiap/aiap-express-session-provider').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-passport-provider').initByConfigurationProvider(configurationProvider, APP);

  const serverRoutes = require('./api/routes');
  APP.use('/api/server', serverRoutes.routes);

  await require('@ibm-aca/aca-surgeon-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-app-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-lambda-modules-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-rules-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-organizations-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-auditor-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-metrics-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-doc-validation-express-routes').initByConfigurationProvider(configurationProvider, APP);

  await require('@ibm-aca/aca-rule-actions-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-buy-rules-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-catalog-rules-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-classification-rules-express-routes').initByConfigurationProvider(configurationProvider, APP);

  await require('@ibm-aca/aca-validation-engagements-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-rules-express-routes-v2').initByConfigurationProvider(configurationProvider, APP);

  await require('@ibm-aca/aca-organizations-cache-provider').initByConfigurationProvider(configurationProvider);

  APP.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./docs/swagger')));

  await require('@ibm-aiap/aiap-user-session-provider').initByConfigurationProvider(configurationProvider, APP);
  APP.use('/client-wbc', express.static(path.join(__dirname, DIST_PATH_CLIENT_WBC)));

  APP.get(
    '/api/config',
    async (req, res) => {
      const options = ramda.mergeAll([
        CONFIGURATION.app.options,
        {
          acaAppBuildTimestamp: getAcaAppBuildTimestamp()
        },
        {
          cosUrl: CONFIGURATION.cos.endpoint
        },
        {
          enableWaTests: true
        },
      ]);
      return res.status(200).json(options);
    }
  );

  APP.get(
    '/DomainVerification(|.htm|.html)$',
    (req, res) => {
      res.sendFile(path.join(__dirname, `../../../DomainVerification.html`));
    }
  );

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
