/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { demoController } = require('../controllers');

routes.get('/redirect', demoController.redirectToUrl);
routes.get('/mockIdentification', demoController.mockIdentification);
routes.get('/', demoController.renderPageDemo);
routes.get('/legacy', demoController.renderPageDemoLegacy);

module.exports = routes;
