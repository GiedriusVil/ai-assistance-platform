/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const packageJson = require('../package.json');

import http from 'http';

import {
  resolveIpAddress,
} from '@ibm-aca/aca-utils-metadata';

import {
  express,
  setupMiddlewareCors,
  setupMiddlewareSession,
  setupMiddlewaresBodyParser,
  setupMiddlewaresSecurity,
} from '@ibm-aiap/aiap-express-provider';

import { BrainStatusHandler } from '@ibm-aiap/aiap-soe-brain';
import { setupBotmaster } from './botmaster';

const startServer = async (configuration, provider) => {
  logger.info('[SERVER] Setting server');

  await require('@ibm-aiap/aiap-express-provider').initByConfigurationProvider(provider);



  const APP = express();
  const SERVER = http.createServer(APP);

  // configure express
  setupMiddlewaresSecurity(
    {
      app: APP
    }
  );
  setupMiddlewareCors(
    {
      app: APP
    }
  );
  setupMiddlewareSession(
    {
      app: APP
    }
  );

  await require('@ibm-aiap/aiap-passport-provider').initByConfigurationProvider(provider, APP);

  setupMiddlewaresBodyParser(
    {
      app: APP
    }
  );

  const brain = await setupBotmaster(
    {},
    {
      configuration: configuration,
      server: SERVER,
      app: APP,
    }
  );

  const statusHandler = BrainStatusHandler({
    brainStatusFn: brain.status,
    namespace: configuration.namespace(),
    version: packageJson.version,
  });

  APP.get('/', statusHandler);
  APP.get('/status', statusHandler);

  await require('@ibm-aca/aca-jobs-queue-board-provider').initByConfigurationProvider(provider, APP);
  await require('@ibm-aca/aca-lambda-modules-express-routes').initByConfigurationProvider(provider, APP);
  await require('@ibm-aca/aca-surgeon-express-routes').initByConfigurationProvider(provider, APP);
  await require('@ibm-aca/aca-coach-express-routes').initByConfigurationProvider(provider, APP);

  const PORT = process.env.PORT || 3001;
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
  };
  return RET_VAL;
};

export {
  startServer
}
