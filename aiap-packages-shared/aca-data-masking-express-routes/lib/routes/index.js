/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const configurationsRoutes = require('./configurations');

routes.use('/configurations',
  configurationsRoutes
);

module.exports = routes;
