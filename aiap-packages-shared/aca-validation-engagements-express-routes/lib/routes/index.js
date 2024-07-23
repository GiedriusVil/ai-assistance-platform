/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const validationEngagementsRoutes = require('./validation-engagements');
const validationEngagementsChangesRoutes = require('./validation-engagements-changes');

routes.use('/',
  validationEngagementsRoutes
);


routes.use('/changes',
  validationEngagementsChangesRoutes
);

module.exports = routes;
