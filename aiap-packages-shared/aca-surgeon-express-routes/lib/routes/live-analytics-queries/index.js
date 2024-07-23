/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsQieriesRoutes = express.Router();

const { liveAnalyticsQieriesController } = require('../../controllers');

liveAnalyticsQieriesRoutes.get('/', liveAnalyticsQieriesController.retrieveMany);

module.exports = {
  liveAnalyticsQieriesRoutes,
};
