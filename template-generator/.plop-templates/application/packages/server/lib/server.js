/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-{{dashCase fullName}}-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const rateLimit = require('express-rate-limit');
const secure = require('express-secure-only');
const compression = require('compression');
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const path = require('path');
const cors = require('cors');

const configurationProvider = require('@ibm-aiap/aiap-{{dashCase name}}-configuration');

const CLIENT_DIST_PATH = '../../../client/dist';

const startServer = async () => {
  const app = express();
  const config = configurationProvider.getConfiguration();

  app.enable('strict routing');
  app.enable('trust proxy');

  if (process.env.NODE_ENV === 'production') {
    app.use(secure());
  }

  app.use(cors());
  app.use(helmet({ frameguard: false }));
  app.use(compression());
  app.use(
    rateLimit({
      windowMs: 60000, // How long in milliseconds to keep records of requests in memory.
      max: 0, // Max number of connections during windowMs milliseconds before sending a 429 response. Set to 0 to disable.
    })
  );
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

  const serverRoutes = require('./api/routes');

  app.get('/api/v1/config', (req, res) => {
    return res.status(200).json(config);
  });
  app.use(express.static(path.join(__dirname, `${CLIENT_DIST_PATH}/client`)));

  await require('@ibm-aiap/aiap-passport-provider').initByConfigurationProvider(configurationProvider, app);

  app.use('/api/v1/server', serverRoutes);

  // TO_DO inlude usage of authorization midleware
  await require('@ibm-aca/aca-surgeon-express-routes').initByConfigurationProvider(configurationProvider, app);

  await require('@ibm-aiap/aiap-app-express-routes').initByConfigurationProvider(configurationProvider, app);

  await require('@ibm-aiap/aiap-user-session-provider').initByConfigurationProvider(configurationProvider, app);

  // app.use('/proxy/:groupname/:api', proxyMiddleware(config.proxy));


  app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, `${CLIENT_DIST_PATH}/client/index.html`));
  });

  http.createServer(app).listen(config.app.port, () => {
    logger.info(`[CLUSTER] Worker ${process.pid} is listening to all incoming requests on ${config.app.port} port`);
  });
};

module.exports = {
  startServer
}
