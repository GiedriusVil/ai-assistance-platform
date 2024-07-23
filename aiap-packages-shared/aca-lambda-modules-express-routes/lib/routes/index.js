/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const modulesRoutes = require('./modules');
const configurationsRoutes = require('./configurations');

routes.use('/configurations',
  allowIfHasPagesPermissions('LambdaModulesConfigurationsViewV1'),
  configurationsRoutes
);
routes.use(
  '/',
  allowIfHasPagesPermissions('LambdaModulesViewV1'),
  modulesRoutes
);

module.exports = routes;
