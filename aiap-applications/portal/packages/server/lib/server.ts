/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-portal-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  resolveIpAddress,
  getAcaAppBuildTimestamp,
} from '@ibm-aca/aca-utils-metadata';

import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import secure from 'express-secure-only';
import compression from 'compression';
import bodyParser from 'body-parser';
import { cookieParser } from '@ibm-aca/aca-wrapper-cookie-parser';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import path from 'path';
import cors from 'cors';

import configurationProvider from '@ibm-aiap/aiap-portal-configuration';

import {
  authByCookieStrategy,
} from '@ibm-aiap/aiap-passport-provider';

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
  APP.use(cors({ origin: true }));
  APP.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: true,
    frameguard: {
      action: 'deny'
    },
    xssFilter: false,
  }));
  APP.use('*', (_req, res, next) => {
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
  APP.use(cookieParser());

  APP.use('/docs', authByCookieStrategy({ session: false }), express.static(path.join(__dirname, `${CLIENT_DIST_PATH}/client/docs`)));

  APP.use(express.static(path.join(__dirname, `${CLIENT_DIST_PATH}/client`)));

  await require('@ibm-aiap/aiap-express-session-provider').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-passport-provider').initByConfigurationProvider(configurationProvider, APP);

  await require('@ibm-aca/aca-surgeon-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aiap/aiap-app-express-routes').initByConfigurationProvider(configurationProvider, APP);
  await require('@ibm-aca/aca-auditor-express-routes').initByConfigurationProvider(configurationProvider, APP);

  APP.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./docs/swagger')));

  await require('@ibm-aiap/aiap-user-session-provider').initByConfigurationProvider(configurationProvider, APP);

  APP.get('/config', async (req, res) => {
    const options = ramda.mergeAll([
      {
        sso: CONFIGURATION?.app?.auth?.sso,
      },
      CONFIGURATION?.app?.options,
      CONFIGURATION?.app?.changeLogs,
      {
        acaAppBuildTimestamp: getAcaAppBuildTimestamp()
      },
      {
        cosUrl: CONFIGURATION?.cos?.endpoint,
      },
      {
        enableWaTests: true,
      },
      {
        passwordPolicyRotation: CONFIGURATION?.app?.passwordPolicyRotation,
        passwordPolicyRegexp: CONFIGURATION?.app?.passwordPolicyRegexp,
        passwordPolicyMessage: CONFIGURATION?.app?.passwordPolicyMessage,
        userLoginFailiureLimit: CONFIGURATION?.app?.userLoginFailiureLimit,
      },
      {
        userIdleService: CONFIGURATION.app.userIdleService,
      }
    ]);
    return res.status(200).json(options);
  });

  APP.get('/DomainVerification(|.htm|.html)$', (req, res) => {
    const DOMAIN_VERIFICATION_PATH = CONFIGURATION?.app?.domainVerificationPath;
    res.sendFile(path.join(__dirname, DOMAIN_VERIFICATION_PATH));
  });

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
