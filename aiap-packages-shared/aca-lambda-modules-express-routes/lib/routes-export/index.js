/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const modulesExportRoutes = require('./modules-export');
const modulesConfigurationsExportRoutes = require('./modules-configuration-export');

routes.use(
  '/modules',
  allowIfHasPagesPermissions('LambdaModulesViewV1'),
  modulesExportRoutes,
);
routes.use(
  '/configurations',
  allowIfHasPagesPermissions('LambdaModulesConfigurationsViewV1'),
  modulesConfigurationsExportRoutes
);

module.exports = routes;
