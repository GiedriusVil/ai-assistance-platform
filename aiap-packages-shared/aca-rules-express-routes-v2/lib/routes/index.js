/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const rulesRoutes = require('./rules');
const rulesConditionsRoutes = require('./rules-conditions');
const rulesChangesRoutes = require('./rules-changes');

routes.use('/',
  rulesRoutes
);

routes.use('/conditions',
  rulesConditionsRoutes
);

routes.use('/changes',
  rulesChangesRoutes
);

module.exports = routes;
