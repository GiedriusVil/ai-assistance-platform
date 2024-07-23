/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversation-insights-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  resolveIpAddress,
} from '@ibm-aca/aca-utils-metadata';

import express from 'express';
import secure from 'express-secure-only';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import http from 'http';
import path from 'path';
import cors from 'cors';

const configurationProvider = require('@ibm-aiap/aiap-health-check-configuration');

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

  APP.get('/api/v1/config', (req, res) => {
    return res.status(200).json(CONFIGURATION);
  });

  APP.use(express.static(path.join(__dirname, `${DIST_PATH_CLIENT}`)));

  APP.use(
    '/',
    (req, res) => {
      res.sendFile(path.join(__dirname, `${DIST_PATH_CLIENT}/index.html`));
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
