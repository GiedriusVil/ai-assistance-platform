/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { allowIfHasPagesPermissions } = require('@ibm-aiap/aiap-user-session-provider');

const topicsExportRoutes = require('./topics-export');

routes.use(
  '/topics',
  allowIfHasPagesPermissions('LambdaModulesViewV1'),
  topicsExportRoutes,
);

module.exports = routes;
