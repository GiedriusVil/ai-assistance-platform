/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const routes = express.Router();

const modulesImportRoutes = require('./modules-import');
const modulesConfigurationsImportRoutes = require('./modules-configurations-import');

routes.use(
  '/modules',
  allowIfHasPagesPermissions('LambdaModulesViewV1'),
  modulesImportRoutes
);
routes.use(
  '/configurations',
  allowIfHasPagesPermissions('LambdaModulesConfigurationsViewV1'),
  modulesConfigurationsImportRoutes
);

module.exports = routes;
