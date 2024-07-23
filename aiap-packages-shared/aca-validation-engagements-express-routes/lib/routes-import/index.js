/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const validationEngagementsImportRoutes = require('./validation-engagements-import');

routes.use(
  '/',
  validationEngagementsImportRoutes,
);

module.exports = routes;
